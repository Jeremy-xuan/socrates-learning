// /api/token/usage — Token 使用统计

import type { NextApiRequest, NextApiResponse } from 'next'
import { getTokenUsage } from '../../../lib/openclaw'

interface TokenUsageResponse {
  success: boolean
  data?: {
    totalTokens: number
    inputTokens: number
    outputTokens: number
    cost: number
    currency: string
  }
  period?: {
    from: string
    to: string
  }
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
    const { sessionId, from, to } = req.query

    // 获取 Token 使用情况
    const usage = await getTokenUsage({ 
      sessionId: sessionId as string 
    })

    res.status(200).json({
      success: true,
      data: usage,
      period: from && to ? {
        from: from as string,
        to: to as string
      } : undefined
    })
  } catch (error) {
    console.error('Failed to get token usage:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get token usage' 
    })
  }
}
