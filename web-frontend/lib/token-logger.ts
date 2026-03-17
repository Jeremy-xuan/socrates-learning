// lib/token-logger.ts — Token 日志记录与统计

import { writeFile, readFile } from './github'

const TOKEN_LOG_PATH = 'teacher/runtime/token_log.json'

// 定价参数（百炼 qwen3.5-plus）
const PRICING = {
  input: 1.5 / 1_000_000,  // $1.5 per 1M input tokens
  output: 5 / 1_000_000    // $5 per 1M output tokens
}

// 预算阈值
const BUDGET_LIMITS = {
  daily: 5,
  weekly: 20,
  monthly: 50
}

export interface TokenLogEntry {
  timestamp: number
  date: string
  model: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
  sessionId?: string
  action?: string
}

export interface TokenStats {
  totalTokens: number
  inputTokens: number
  outputTokens: number
  totalCost: number
  period: {
    from: string
    to: string
  }
  dailyStats: Array<{
    date: string
    inputTokens: number
    outputTokens: number
    totalTokens: number
    cost: number
  }>
  budgetStatus: {
    daily: { used: number; limit: number; remaining: number; percentage: number }
    weekly: { used: number; limit: number; remaining: number; percentage: number }
    monthly: { used: number; limit: number; remaining: number; percentage: number }
  }
  alerts: Array<{
    type: 'warning' | 'critical'
    message: string
    period: 'daily' | 'weekly' | 'monthly'
  }>
}

// 记录 Token 使用
export async function logTokenUsage(entry: Omit<TokenLogEntry, 'timestamp' | 'date' | 'totalTokens' | 'cost'>) {
  const timestamp = Date.now()
  const date = new Date(timestamp).toISOString().split('T')[0]
  const totalTokens = entry.inputTokens + entry.outputTokens
  const cost = calculateCost(entry.inputTokens, entry.outputTokens)

  const newEntry: TokenLogEntry = {
    ...entry,
    timestamp,
    date,
    totalTokens,
    cost
  }

  // 读取现有日志
  let logs: TokenLogEntry[] = []
  try {
    const content = await readFile(TOKEN_LOG_PATH)
    logs = JSON.parse(content)
  } catch {
    // 文件不存在，创建新日志
    logs = []
  }

  // 添加新记录
  logs.push(newEntry)

  // 写回文件
  await writeFile(TOKEN_LOG_PATH, JSON.stringify(logs, null, 2), 'Log token usage')

  // 检查预算
  const alerts = await checkBudgetLimits(date)

  return {
    success: true,
    entry: newEntry,
    alerts
  }
}

// 计算成本
export function calculateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = inputTokens * PRICING.input
  const outputCost = outputTokens * PRICING.output
  return parseFloat((inputCost + outputCost).toFixed(6))
}

// 获取统计数据
export async function getTokenStats(period: 'day' | 'week' | 'month' = 'week'): Promise<TokenStats> {
  // 读取日志
  let logs: TokenLogEntry[] = []
  try {
    const content = await readFile(TOKEN_LOG_PATH)
    logs = JSON.parse(content)
  } catch {
    return getEmptyStats(period)
  }

  // 计算日期范围
  const now = new Date()
  const daysBack = period === 'day' ? 1 : period === 'week' ? 7 : 30
  const fromDate = new Date(now)
  fromDate.setDate(fromDate.getDate() - daysBack)

  const fromDateStr = fromDate.toISOString().split('T')[0]
  const toDateStr = now.toISOString().split('T')[0]

  // 过滤日期范围内的数据
  const filteredLogs = logs.filter(log => log.date >= fromDateStr && log.date <= toDateStr)

  // 按日期分组统计
  const dailyMap = new Map<string, TokenLogEntry>()
  for (const log of filteredLogs) {
    const existing = dailyMap.get(log.date)
    if (existing) {
      existing.inputTokens += log.inputTokens
      existing.outputTokens += log.outputTokens
      existing.totalTokens += log.totalTokens
      existing.cost += log.cost
    } else {
      dailyMap.set(log.date, { ...log })
    }
  }

  // 转换为数组
  const dailyStats = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))

  // 计算总计
  const totalTokens = dailyStats.reduce((sum, d) => sum + d.totalTokens, 0)
  const inputTokens = dailyStats.reduce((sum, d) => sum + d.inputTokens, 0)
  const outputTokens = dailyStats.reduce((sum, d) => sum + d.outputTokens, 0)
  const totalCost = dailyStats.reduce((sum, d) => sum + d.cost, 0)

  // 计算预算状态
  const budgetStatus = await calculateBudgetStatus(toDateStr)

  // 生成告警
  const alerts = generateAlerts(budgetStatus)

  return {
    totalTokens,
    inputTokens,
    outputTokens,
    totalCost: parseFloat(totalCost.toFixed(6)),
    period: {
      from: fromDateStr,
      to: toDateStr
    },
    dailyStats,
    budgetStatus,
    alerts
  }
}

// 检查预算限制
async function checkBudgetLimits(currentDate: string): Promise<Array<{ type: 'warning' | 'critical'; message: string; period: 'daily' | 'weekly' | 'monthly' }>> {
  const stats = await calculateBudgetStatus(currentDate)
  const alerts: Array<{ type: 'warning' | 'critical'; message: string; period: 'daily' | 'weekly' | 'monthly' }> = []

  for (const [period, data] of Object.entries(stats)) {
    if (period === 'from' || period === 'to') continue

    const percentage = data.percentage
    if (percentage >= 100) {
      alerts.push({
        type: 'critical',
        message: `${period} 预算已用尽 ($${data.used.toFixed(2)} / $${data.limit})`,
        period: period as 'daily' | 'weekly' | 'monthly'
      })
    } else if (percentage >= 80) {
      alerts.push({
        type: 'warning',
        message: `${period} 预算即将用尽 ($${data.used.toFixed(2)} / $${data.limit})`,
        period: period as 'daily' | 'weekly' | 'monthly'
      })
    }
  }

  return alerts
}

// 计算预算状态
async function calculateBudgetStatus(currentDate: string) {
  let logs: TokenLogEntry[] = []
  try {
    const content = await readFile(TOKEN_LOG_PATH)
    logs = JSON.parse(content)
  } catch {
    return {
      daily: { used: 0, limit: BUDGET_LIMITS.daily, remaining: BUDGET_LIMITS.daily, percentage: 0 },
      weekly: { used: 0, limit: BUDGET_LIMITS.weekly, remaining: BUDGET_LIMITS.weekly, percentage: 0 },
      monthly: { used: 0, limit: BUDGET_LIMITS.monthly, remaining: BUDGET_LIMITS.monthly, percentage: 0 }
    }
  }

  const now = new Date(currentDate)

  // 计算各周期起始日期
  const dailyStart = now.toISOString().split('T')[0]
  const weeklyStart = new Date(now)
  weeklyStart.setDate(weeklyStart.getDate() - 7)
  const monthlyStart = new Date(now)
  monthlyStart.setDate(monthlyStart.getDate() - 30)

  // 过滤各周期数据
  const dailyLogs = logs.filter(log => log.date >= dailyStart)
  const weeklyLogs = logs.filter(log => log.date >= weeklyStart.toISOString().split('T')[0])
  const monthlyLogs = logs.filter(log => log.date >= monthlyStart.toISOString().split('T')[0])

  // 计算各周期成本
  const dailyUsed = dailyLogs.reduce((sum, log) => sum + log.cost, 0)
  const weeklyUsed = weeklyLogs.reduce((sum, log) => sum + log.cost, 0)
  const monthlyUsed = monthlyLogs.reduce((sum, log) => sum + log.cost, 0)

  return {
    daily: {
      used: parseFloat(dailyUsed.toFixed(4)),
      limit: BUDGET_LIMITS.daily,
      remaining: parseFloat((BUDGET_LIMITS.daily - dailyUsed).toFixed(4)),
      percentage: parseFloat(((dailyUsed / BUDGET_LIMITS.daily) * 100).toFixed(1))
    },
    weekly: {
      used: parseFloat(weeklyUsed.toFixed(4)),
      limit: BUDGET_LIMITS.weekly,
      remaining: parseFloat((BUDGET_LIMITS.weekly - weeklyUsed).toFixed(4)),
      percentage: parseFloat(((weeklyUsed / BUDGET_LIMITS.weekly) * 100).toFixed(1))
    },
    monthly: {
      used: parseFloat(monthlyUsed.toFixed(4)),
      limit: BUDGET_LIMITS.monthly,
      remaining: parseFloat((BUDGET_LIMITS.monthly - monthlyUsed).toFixed(4)),
      percentage: parseFloat(((monthlyUsed / BUDGET_LIMITS.monthly) * 100).toFixed(1))
    }
  }
}

// 生成告警
function generateAlerts(budgetStatus: any) {
  const alerts: Array<{ type: 'warning' | 'critical'; message: string; period: 'daily' | 'weekly' | 'monthly' }> = []

  for (const [period, data] of Object.entries(budgetStatus)) {
    const percentage = (data as any).percentage
    if (percentage >= 100) {
      alerts.push({
        type: 'critical',
        message: `${period} 预算已用尽 ($${(data as any).used.toFixed(2)} / $${(data as any).limit})`,
        period: period as 'daily' | 'weekly' | 'monthly'
      })
    } else if (percentage >= 80) {
      alerts.push({
        type: 'warning',
        message: `${period} 预算即将用尽 ($${(data as any).used.toFixed(2)} / $${(data as any).limit})`,
        period: period as 'daily' | 'weekly' | 'monthly'
      })
    }
  }

  return alerts
}

// 获取空统计数据
function getEmptyStats(period: string): TokenStats {
  const now = new Date()
  const daysBack = period === 'day' ? 1 : period === 'week' ? 7 : 30
  const fromDate = new Date(now)
  fromDate.setDate(fromDate.getDate() - daysBack)

  return {
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalCost: 0,
    period: {
      from: fromDate.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0]
    },
    dailyStats: [],
    budgetStatus: {
      daily: { used: 0, limit: BUDGET_LIMITS.daily, remaining: BUDGET_LIMITS.daily, percentage: 0 },
      weekly: { used: 0, limit: BUDGET_LIMITS.weekly, remaining: BUDGET_LIMITS.weekly, percentage: 0 },
      monthly: { used: 0, limit: BUDGET_LIMITS.monthly, remaining: BUDGET_LIMITS.monthly, percentage: 0 }
    },
    alerts: []
  }
}

// 中间件：自动记录 Token 使用
export function createTokenLoggingMiddleware() {
  return async function tokenLogger(
    inputTokens: number,
    outputTokens: number,
    model: string = 'qwen3.5-plus',
    sessionId?: string,
    action?: string
  ) {
    return await logTokenUsage({
      model,
      inputTokens,
      outputTokens,
      sessionId,
      action
    })
  }
}
