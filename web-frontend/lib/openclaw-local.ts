// lib/openclaw-local.ts — OpenClaw 本地 API 集成（安全版）

// 使用相对路径调用 Vercel API Routes（同一域名，无公网暴露）
const API_BASE = '/api/openclaw'

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
