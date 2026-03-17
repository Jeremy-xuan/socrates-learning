// /api/token/usage — Token 使用统计（对接户部模块）

import type { NextApiRequest, NextApiResponse } from 'next'
import { getTokenStats } from '../../../lib/token-logger'

interface TokenUsageResponse {
  success: boolean
  totalTokens?: number
  inputTokens?: number
  outputTokens?: number
  totalCost?: number
  period?: {
    from: string
    to: string
  }
  dailyStats?: Array<{
    date: string
    inputTokens: number
    outputTokens: number
    totalTokens: number
    cost: number
  }>
  budgetStatus?: {
    daily: { used: number; limit: number; remaining: number; percentage: number }
    weekly: { used: number; limit: number; remaining: number; percentage: number }
    monthly: { used: number; limit: number; remaining: number; percentage: number }
  }
  alerts?: Array<{
    type: 'warning' | 'critical'
    message: string
    period: 'daily' | 'weekly' | 'monthly'
  }>
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenUsageResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { period = 'week' } = req.query

    // 获取 Token 统计数据（户部模块）
    const stats = await getTokenStats(period as 'day' | 'week' | 'month')

    res.status(200).json({
      success: true,
      totalTokens: stats.totalTokens,
      inputTokens: stats.inputTokens,
      outputTokens: stats.outputTokens,
      totalCost: stats.totalCost,
      period: stats.period,
      dailyStats: stats.dailyStats,
      budgetStatus: stats.budgetStatus,
      alerts: stats.alerts
    })
  } catch (error) {
    console.error('Failed to get token usage:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get token usage' 
    })
  }
}
