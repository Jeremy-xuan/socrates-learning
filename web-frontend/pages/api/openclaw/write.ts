import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const ALLOWLIST = ['teacher/runtime', 'teacher/config']

function resolveAllowedPath(inputPath: string): string {
  if (!inputPath) throw new Error('path is required')
  if (path.isAbsolute(inputPath)) throw new Error('absolute path is forbidden')
  if (inputPath.includes('..')) throw new Error('path traversal is forbidden')

  const normalized = inputPath.replace(/\\/g, '/').replace(/^\.\//, '')
  const allowed = ALLOWLIST.some((p) => normalized === p || normalized.startsWith(`${p}/`))
  if (!allowed) throw new Error('path is not in allowlist')

  return path.join(process.cwd(), '..', normalized)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { path: filePath, content } = req.body as { path?: string; content?: string }
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'content is required' })
    }

    const abs = resolveAllowedPath(filePath || '')
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, content, 'utf8')
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(400).json({ success: false, error: e instanceof Error ? e.message : 'write failed' })
  }
}
