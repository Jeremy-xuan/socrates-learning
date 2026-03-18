import type { NextApiRequest, NextApiResponse } from 'next'

// Vercel Serverless 无持久化文件系统，写入操作模拟成功
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { path: filePath, content } = req.body as { path?: string; content?: string }
    if (typeof content !== 'string') return res.status(400).json({ success: false, error: 'content is required' })
    if (!filePath) return res.status(400).json({ success: false, error: 'path is required' })

    const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '')

    // 安全拦截
    if (normalized.startsWith('/') || normalized.includes('..')) {
      return res.status(400).json({ success: false, error: 'invalid path' })
    }
    if (!normalized.startsWith('teacher/runtime/') && !normalized.startsWith('teacher/config/')) {
      return res.status(400).json({ success: false, error: 'write only allowed in teacher/runtime or teacher/config' })
    }

    // 模拟写入成功（Vercel 无持久化存储）
    return res.status(200).json({ success: true, mock: true, message: '写入已记录（当前会话有效）' })
  } catch (e) {
    return res.status(400).json({ success: false, error: e instanceof Error ? e.message : 'write failed' })
  }
}
