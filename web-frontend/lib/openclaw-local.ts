// lib/openclaw-local.ts — OpenClaw 本地 API 集成（安全版）

// 浏览器端用相对路径；服务端（API route内）用绝对地址
const API_BASE = typeof window === 'undefined'
  ? `${process.env.INTERNAL_API_BASE || 'http://localhost:3000'}/api/openclaw`
  : '/api/openclaw'

// 创建讲师 Agent
export async function spawnTeacherAgent({
  teacher,
  chapter
}: {
  teacher: string
  chapter: string
}) {
  const response = await fetch(`${API_BASE}/spawn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task: `扮演${teacher}进行苏格拉底式物理教学，当前章节：${chapter}`,
      runtime: 'subagent',
      mode: 'session',
      label: `teacher-${teacher}`,
      thread: true
    })
  })
  return response.json()
}

// 发送消息到 Agent
export async function sendToAgent({
  sessionKey,
  message
}: {
  sessionKey: string
  message: string
}) {
  const response = await fetch(`${API_BASE}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionKey, message })
  })
  return response.json()
}

// 获取历史（占位：当前网关未开放 history，返回空数组）
export async function getAgentHistory({ sessionKey, limit = 20 }: { sessionKey: string; limit?: number }) {
  return { sessionKey, limit, messages: [] }
}

// 读取文件
export async function readFile(path: string) {
  const response = await fetch(`${API_BASE}/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  })
  return response.json()
}

// 写入文件
export async function writeFile(path: string, content: string) {
  const response = await fetch(`${API_BASE}/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content })
  })
  return response.json()
}
