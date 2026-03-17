// pages/api/openclaw/spawn.ts — Vercel Serverless Function

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { task, runtime, mode, label, thread } = req.body

  // 调用本地 OpenClaw Gateway（内网访问）
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3001'
  
  try {
    const response = await fetch(`${gatewayUrl}/api/sessions/spawn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, runtime, mode, label, thread })
    })
    
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('OpenClaw spawn error:', error)
    res.status(500).json({ error: 'Failed to spawn agent' })
  }
}
