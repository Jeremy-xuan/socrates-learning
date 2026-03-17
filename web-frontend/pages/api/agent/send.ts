// /api/agent/send — 发送消息到 Agent

import type { NextApiRequest, NextApiResponse } from 'next'
import { sendToAgent, getClassHistory } from '../../../lib/openclaw'

interface SendAgentRequest {
  sessionKey?: string
  sessionId?: string
  message: string
}

interface SendAgentResponse {
  success: boolean
  response?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendAgentResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { sessionKey, sessionId, message }: SendAgentRequest = req.body
    const key = sessionKey || sessionId

    // 验证参数
    if (!key || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'sessionKey (or sessionId) and message are required' 
      })
    }

    // 发送消息到 Agent
    const result = await sendToAgent({ sessionKey: key, message })

    res.status(200).json({
      success: true,
      response: result.response || ''
    })
  } catch (error) {
    console.error('Failed to send message to agent:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send message' 
    })
  }
}
