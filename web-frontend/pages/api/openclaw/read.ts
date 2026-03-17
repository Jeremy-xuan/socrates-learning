import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const ALLOWLIST = ['teacher/runtime', 'teacher/config']
const RUNTIME_ROOT = '/tmp/openclaw-state'

function normalize(inputPath: string) {
  return inputPath.replace(/\\/g, '/').replace(/^\.\//, '')
}

function assertAllowed(normalized: string) {
  if (!normalized) throw new Error('path is required')
  if (normalized.startsWith('/')) throw new Error('absolute path is forbidden')
  if (normalized.includes('..')) throw new Error('path traversal is forbidden')
  const allowed = ALLOWLIST.some((p) => normalized === p || normalized.startsWith(`${p}/`))
  if (!allowed) throw new Error('path is not in allowlist')
}

function resolveReadPath(normalized: string): string {
  if (normalized.startsWith('teacher/runtime/')) {
    return path.join(RUNTIME_ROOT, normalized)
  }
  return path.join(process.cwd(), normalized)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { path: filePath } = req.body as { path?: string }
    const normalized = normalize(filePath || '')
    assertAllowed(normalized)

    const abs = resolveReadPath(normalized)

    // runtime 文件不存在时，给默认值，避免流程卡死
    if (!fs.existsSync(abs) && normalized === 'teacher/runtime/wechat_unread.md') {
      fs.mkdirSync(path.dirname(abs), { recursive: true })
      fs.writeFileSync(abs, '# 微信群未读同步\n\n状态：已同步\n\n（空）\n', 'utf8')
    }

    const content = fs.readFileSync(abs, 'utf8')
    return res.status(200).json({ success: true, content })
  } catch (e) {
    return res.status(400).json({ success: false, error: e instanceof Error ? e.message : 'read failed' })
  }
}
