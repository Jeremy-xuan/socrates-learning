import type { NextApiRequest, NextApiResponse } from 'next'

// Vercel Serverless 无持久化文件系统，全部走 mock
const MOCK_DATA: Record<string, string> = {
  'teacher/runtime/wechat_unread.md': '# 微信群未读同步\n\n状态：已同步\n\n（空）\n',
  'teacher/config/learner_profile.md': '# 学习者配置\n\n姓名：吴宇轩\n目标：IPhO 电磁学邀请赛\n',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { path: filePath } = req.body as { path?: string }
    if (!filePath) return res.status(400).json({ success: false, error: 'path is required' })

    const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '')

    // 安全拦截
    if (normalized.startsWith('/')) return res.status(400).json({ success: false, error: 'absolute path is forbidden' })
    if (normalized.includes('..')) return res.status(400).json({ success: false, error: 'path traversal is forbidden' })
    if (!normalized.startsWith('teacher/runtime/') && !normalized.startsWith('teacher/config/')) {
      return res.status(400).json({ success: false, error: 'path is not in allowlist' })
    }

    const content = MOCK_DATA[normalized] || `# ${normalized}\n\n（模拟数据）\n`
    return res.status(200).json({ success: true, content, mock: true })
  } catch (e) {
    return res.status(400).json({ success: false, error: e instanceof Error ? e.message : 'read failed' })
  }
}
