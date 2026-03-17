// lib/token-middleware.ts — Token 日志中间件（API 调用时自动记录）

import { logTokenUsage, createTokenLoggingMiddleware } from './token-logger'

// 创建全局 Token 记录器
export const recordTokenUsage = createTokenLoggingMiddleware()

// API 中间件包装器
export function withTokenLogging<T extends any[]>(
  handler: (...args: T) => Promise<{ inputTokens?: number; outputTokens?: number; model?: string }>,
  action: string,
  sessionId?: string
) {
  return async function (...args: T) {
    try {
      // 执行原始处理函数
      const result = await handler(...args)

      // 记录 Token 使用
      if (result.inputTokens && result.outputTokens) {
        await recordTokenUsage(
          result.inputTokens,
          result.outputTokens,
          result.model || 'qwen3.5-plus',
          sessionId,
          action
        )
      }

      return result
    } catch (error) {
      console.error(`Token logging failed for ${action}:`, error)
      throw error
    }
  }
}

// 示例：在 API 路由中使用
// pages/api/agent/send.ts
/*
import { withTokenLogging } from '../../../lib/token-middleware'

export default async function handler(req, res) {
  const result = await withTokenLogging(
    async () => {
      // 调用 OpenClaw API
      const response = await sendToAgent({ sessionId, message })
      return {
        inputTokens: response.usage?.inputTokens || 0,
        outputTokens: response.usage?.outputTokens || 0,
        model: 'qwen3.5-plus'
      }
    },
    'agent_message',
    sessionId
  )()

  res.json(result)
}
*/

// 手动记录函数（用于无法使用包装器的场景）
export async function manualTokenRecord(
  inputTokens: number,
  outputTokens: number,
  model: string = 'qwen3.5-plus',
  sessionId?: string,
  action?: string
) {
  return await recordTokenUsage(inputTokens, outputTokens, model, sessionId, action)
}

// 预算告警检查
export async function checkBudgetAlerts() {
  const { getTokenStats } = await import('./token-logger')
  const stats = await getTokenStats('day')

  const alerts = []
  if (stats.budgetStatus.daily.percentage >= 100) {
    alerts.push({
      type: 'critical',
      message: `今日预算已用尽 ($${stats.budgetStatus.daily.used.toFixed(2)} / $${stats.budgetStatus.daily.limit})`
    })
  } else if (stats.budgetStatus.daily.percentage >= 80) {
    alerts.push({
      type: 'warning',
      message: `今日预算即将用尽 ($${stats.budgetStatus.daily.used.toFixed(2)} / $${stats.budgetStatus.daily.limit})`
    })
  }

  return alerts
}
