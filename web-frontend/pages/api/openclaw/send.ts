import type { NextApiRequest, NextApiResponse } from 'next'

function getGatewayUrl() {
  return process.env.OPENCLAW_GATEWAY_URL
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { sessionKey, message } = req.body
  const gatewayUrl = getGatewayUrl()

  if (!gatewayUrl) {
    return res.status(200).json({ success: true, response: `[mock:${sessionKey}] ${message}` })
  }

  try {
    const response = await fetch(`${gatewayUrl}/api/sessions/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionKey, message })
    })

    const data = await response.json()
    res.status(200).json(data)
  } catch {
    return res.status(200).json({ success: true, response: `[mock:${sessionKey}] ${message}` })
  }
}
