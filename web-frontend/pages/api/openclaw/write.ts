import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { path: filePath, content } = req.body as { path?: string; content?: string }
    if (!filePath || typeof content !== 'string') {
      return res.status(400).json({ error: 'path and content are required' })
    }

    const abs = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), '..', filePath)

    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, content, 'utf8')
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ success: false, error: e instanceof Error ? e.message : 'write failed' })
  }
}
