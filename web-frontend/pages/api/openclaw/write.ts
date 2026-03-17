import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const RUNTIME_PREFIX = 'teacher/runtime/'
const RUNTIME_ROOT = '/tmp/openclaw-state'

function normalize(inputPath: string) {
  return inputPath.replace(/\\/g, '/').replace(/^\.\//, '')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { path: filePath, content } = req.body as { path?: string; content?: string }
    if (typeof content !== 'string') return res.status(400).json({ error: 'content is required' })

    const normalized = normalize(filePath || '')
    if (!normalized.startsWith(RUNTIME_PREFIX)) {
      return res.status(400).json({ success: false, error: 'write only allowed in teacher/runtime' })
    }
    if (normalized.startsWith('/') || normalized.includes('..')) {
      return res.status(400).json({ success: false, error: 'invalid path' })
    }

    const abs = path.join(RUNTIME_ROOT, normalized)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, content, 'utf8')
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(400).json({ success: false, error: e instanceof Error ? e.message : 'write failed' })
  }
}
