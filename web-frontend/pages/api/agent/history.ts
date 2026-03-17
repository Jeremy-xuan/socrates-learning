// /api/agent/history — 获取 Agent 对话历史

import type { NextApiRequest, NextApiResponse } from 'next'
import { getClassHistory } from '../../../lib/openclaw'

interface HistoryRequest {
  sessionId: string
  limit?: number
}

interface HistoryResponse {
  success: boolean
  messages?: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HistoryResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { sessionId, limit = 20 } = req.query
    const limitNum = parseInt(limit as string, 10)

    // 验证参数
    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'sessionId is required' 
      })
    }

    // 获取对话历史
    const history = await getClassHistory({
      sessionId: sessionId as string,
      limit: limitNum
    })

    res.status(200).json({
      success: true,
      messages: history.messages || []
    })
  } catch (error) {
    console.error('Failed to get history:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get history' 
    })
  }
}
