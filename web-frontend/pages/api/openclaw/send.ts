import type { NextApiRequest, NextApiResponse } from 'next'

function getGatewayUrl() {
  const url = process.env.OPENCLAW_GATEWAY_URL
  if (!url) throw new Error('OPENCLAW_GATEWAY_URL is required in production')
  return url
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { sessionKey, message } = req.body

  try {
    const gatewayUrl = getGatewayUrl()
    const response = await fetch(`${gatewayUrl}/api/sessions/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionKey, message })
    })

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('OpenClaw send error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to send message' })
  }
}
