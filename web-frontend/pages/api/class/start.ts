// /api/class/start — 开始上课

import type { NextApiRequest, NextApiResponse } from 'next'

interface StartClassRequest {
  teacher: 'kurisu' | 'kousei' | 'lena'
  chapter?: string
}

interface StartClassResponse {
  success: boolean
  sessionId?: string
  message?: string
}

// Vercel 环境直接返回 mock session，避免 fetch 相对路径问题
async function mockSpawnTeacher({ teacher, chapter }: { teacher: string; chapter: string }) {
  return {
    success: true,
    mock: true,
    sessionKey: `mock-teacher-${teacher}-${Date.now()}`,
    message: `已启动${teacher}老师的课程（模拟模式）`
  }
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

    // Vercel 环境直接返回 mock（无网关）
    const isVercel = process.env.VERCEL === '1' || !process.env.OPENCLAW_GATEWAY_URL
    
    if (isVercel) {
      const session = await mockSpawnTeacher({
        teacher,
        chapter: chapter || 'Chapter 21 - Electric Fields'
      })
      return res.status(200).json({
        success: true,
        sessionId: session.sessionKey,
        message: session.message
      })
    }

    // 本地环境：调用真实网关
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL
    const response = await fetch(`${gatewayUrl}/api/sessions/spawn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: `扮演${teacher}进行苏格拉底式物理教学，当前章节：${chapter || 'Chapter 21 - Electric Fields'}`,
        runtime: 'subagent',
        mode: 'session',
        label: `teacher-${teacher}`,
        thread: true
      })
    })
    const session = await response.json()

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
