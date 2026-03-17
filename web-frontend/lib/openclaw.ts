// lib/openclaw.ts — OpenClaw 后端集成

// TODO: OpenClaw tools 需本地安装
// import { sessions_spawn, sessions_send, sessions_history, read, write } from '@openclaw/tools'

// 临时占位函数
const sessions_spawn = async () => ({ sessionKey: 'mock' })
const sessions_send = async () => ({})
const sessions_history = async () => []
const read = async () => ''
const write = async () => true

// 角色名称映射
const TEACHER_NAMES: Record<string, string> = {
  kurisu: '牧瀬紅莉栖',
  kousei: '有马公生',
  lena: '弗拉基米尔·蕾娜'
}

// 创建讲师 Agent
export async function spawnTeacherAgent({
  teacher,
  chapter
}: {
  teacher: string
  chapter: string
}) {
  const session = await sessions_spawn({
    task: `扮演${TEACHER_NAMES[teacher]}进行苏格拉底式物理教学，当前章节：${chapter}`,
    runtime: 'subagent',
    mode: 'session',
    label: `teacher-${teacher}`,
    thread: true
  })

  return session
}

// 创建课件阅读 Agent
export async function spawnPdfReader({
  filePath
}: {
  filePath: string
}) {
  const session = await sessions_spawn({
    task: `读取并总结课件：${filePath}`,
    runtime: 'subagent',
    mode: 'run',
    label: 'pdf-reader'
  })

  return session
}

// 发送消息到 Agent
export async function sendToAgent({
  sessionId,
  message
}: {
  sessionId: string
  message: string
}) {
  const result = await sessions_send({
    sessionKey: sessionId,
    message
  })

  return result
}

// 获取对话历史
export async function getClassHistory({
  sessionId,
  limit = 20
}: {
  sessionId: string
  limit?: number
}) {
  const history = await sessions_history({
    sessionKey: sessionId,
    limit,
    includeTools: false
  })

  return history
}

// 读取状态文件
export async function readStatusFile(path: string) {
  try {
    const content = await read({ path })
    return { success: true, content }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// 写入状态文件
export async function writeStatusFile({
  path,
  content,
  commitMessage
}: {
  path: string
  content: string
  commitMessage?: string
}) {
  try {
    await write({
      path,
      content,
      commitMessage: commitMessage || `Update ${path}`
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// 获取 Token 使用情况
export async function getTokenUsage({ sessionId }: { sessionId: string }) {
  // 注意：这需要 OpenClaw 提供 session_status 工具
  // 目前是伪代码，需要根据实际 API 调整
  return {
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    cost: 0
  }
}
