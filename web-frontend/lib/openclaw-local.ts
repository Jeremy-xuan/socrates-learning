// lib/openclaw-local.ts — OpenClaw 本地 API 集成

const OPENCLAW_API_URL = process.env.NEXT_PUBLIC_OPENCLAW_API_URL || 'http://localhost:3001'

// 创建讲师 Agent
export async function spawnTeacherAgent({
  teacher,
  chapter
}: {
  teacher: string
  chapter: string
}) {
  const response = await fetch(`${OPENCLAW_API_URL}/api/sessions/spawn`, {
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
  const response = await fetch(`${OPENCLAW_API_URL}/api/sessions/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionKey, message })
  })
  return response.json()
}

// 获取 Agent 历史
export async function getAgentHistory({
  sessionKey,
  limit = 20
}: {
  sessionKey: string
  limit?: number
}) {
  const response = await fetch(`${OPENCLAW_API_URL}/api/sessions/history?sessionKey=${sessionKey}&limit=${limit}`)
  return response.json()
}

// 读取文件
export async function readFile(path: string) {
  const response = await fetch(`${OPENCLAW_API_URL}/api/files/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  })
  return response.json()
}

// 写入文件
export async function writeFile(path: string, content: string) {
  const response = await fetch(`${OPENCLAW_API_URL}/api/files/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content })
  })
  return response.json()
}
