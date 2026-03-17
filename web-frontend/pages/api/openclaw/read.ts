import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { path: filePath } = req.body as { path?: string }
    if (!filePath) return res.status(400).json({ error: 'path is required' })

    const abs = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), '..', filePath)

    const content = fs.readFileSync(abs, 'utf8')
    return res.status(200).json({ success: true, content })
  } catch (e) {
    return res.status(500).json({ success: false, error: e instanceof Error ? e.message : 'read failed' })
  }
}
