import type { NextApiRequest, NextApiResponse } from 'next'

function getGatewayUrl() {
  return process.env.OPENCLAW_GATEWAY_URL
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { task, runtime, mode, label, thread } = req.body
  const gatewayUrl = getGatewayUrl()

  // 无网关时降级为 mock，保证前端流程可用
  if (!gatewayUrl) {
    return res.status(200).json({
      success: true,
      mock: true,
      sessionKey: `mock-${Date.now()}`,
      message: 'OPENCLAW_GATEWAY_URL 未配置，已进入本地模拟模式'
    })
  }

  try {
    const response = await fetch(`${gatewayUrl}/api/sessions/spawn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, runtime, mode, label, thread })
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    // 网关不可达时同样降级 mock
    return res.status(200).json({
      success: true,
      mock: true,
      sessionKey: `mock-${Date.now()}`,
      message: '网关暂不可达，已进入本地模拟模式'
    })
  }
}
