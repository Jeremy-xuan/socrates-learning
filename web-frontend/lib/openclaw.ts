// lib/openclaw.ts — OpenClaw 后端集成

import {
  spawnTeacherAgent as spawnTeacherAgentLocal,
  sendToAgent as sendToAgentLocal,
  getAgentHistory,
  readFile,
  writeFile,
} from './openclaw-local'

// 兼容旧调用名
const sessions_spawn = spawnTeacherAgentLocal as any
const sessions_send = sendToAgentLocal as any
const sessions_history = getAgentHistory as any
const read = readFile as any
const write = writeFile as any

export { sessions_spawn, sessions_send, sessions_history, read, write }

// 角色名称映射
const TEACHER_NAMES: Record<string, string> = {
  kurisu: '牧瀬紅莉栖',
  kousei: '有马公生',
  lena: '弗拉基米尔·蕾娜',
}

// 创建讲师 Agent
export async function spawnTeacherAgent({
  teacher,
  chapter,
}: {
  teacher: string
  chapter: string
}) {
  return spawnTeacherAgentLocal({
    teacher,
    chapter: chapter || 'Chapter 21 - Electric Fields',
  })
}

// 创建课件阅读 Agent
export async function spawnPdfReader({ filePath }: { filePath: string }) {
  return sessions_spawn({
    task: `读取并总结课件：${filePath}`,
    runtime: 'subagent',
    mode: 'run',
    label: 'pdf-reader',
  } as any)
}

// 发送消息到 Agent
export async function sendToAgent({ sessionKey, message }: { sessionKey: string; message: string }) {
  return sendToAgentLocal({ sessionKey, message })
}

// 获取对话历史
export async function getClassHistory({
  sessionId,
  limit = 20,
}: {
  sessionId: string
  limit?: number
}) {
  return sessions_history({ sessionKey: sessionId, limit, includeTools: false } as any)
}

// 读取状态文件
export async function readStatusFile(path: string) {
  try {
    const content = await read({ path } as any)
    return { success: true, content }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// 写入状态文件
export async function writeStatusFile({
  path,
  content,
  commitMessage,
}: {
  path: string
  content: string
  commitMessage?: string
}) {
  try {
    await write({ path, content, commitMessage: commitMessage || `Update ${path}` } as any)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// 获取 Token 使用情况
export async function getTokenUsage({ sessionId }: { sessionId: string }) {
  return {
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    cost: 0,
  }
}
