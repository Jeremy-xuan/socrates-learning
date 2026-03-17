// /api/class/start — 开始上课

import type { NextApiRequest, NextApiResponse } from 'next'
import { spawnTeacherAgent } from '../../../lib/openclaw'
import fs from 'fs'
import path from 'path'

interface StartClassRequest {
  teacher: 'kurisu' | 'kousei' | 'lena'
  chapter?: string
}

interface StartClassResponse {
  success: boolean
  sessionId?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StartClassResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { teacher, chapter }: StartClassRequest = req.body

    // 验证老师选择
    const validTeachers = ['kurisu', 'kousei', 'lena']
    if (!teacher || !validTeachers.includes(teacher)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid teacher. Choose from: kurisu, kousei, lena' 
      })
    }

    // P0: 开课前强制检查微信群未读同步状态
    // 仅本地开发模式允许跳过（VERCEL_ENV 为空时）
    const isDev = !process.env.VERCEL_ENV
    const skipSync = isDev && process.env.SKIP_WECHAT_SYNC === 'true'
    
    if (!skipSync) {
      const workspaceRoot = process.env.OPENCLAW_WORKSPACE_ROOT || '/tmp/openclaw-state'
      const unreadPath = path.join(workspaceRoot, 'teacher/runtime/wechat_unread.md')
      const unreadContent = fs.existsSync(unreadPath) ? fs.readFileSync(unreadPath, 'utf8').trim() : ''
      const synced = unreadContent.includes('已同步') || unreadContent.includes('无未读') || unreadContent.includes('（空）')
      if (!synced) {
        return res.status(412).json({
          success: false,
          message: '请先同步微信群未读后再开课'
        })
      }
    }

    // 创建讲师 Agent
    const session = await spawnTeacherAgent({
      teacher,
      chapter: chapter || 'Chapter 21 - Electric Fields'
    })

    res.status(200).json({
      success: true,
      sessionId: session.sessionKey,
      message: `已启动${teacher}老师的课程`
    })
  } catch (error) {
    console.error('Failed to start class:', error)
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to start class' 
    })
  }
}
