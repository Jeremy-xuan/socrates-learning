// lib/github.ts — GitHub API 集成（用于文件同步）

import { Octokit } from '@octokit/rest'

const GITHUB_OWNER = 'Jeremy-xuan'
const GITHUB_REPO = 'socrates-learning'
const GITHUB_BRANCH = 'main'

// 初始化 Octokit
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
})

// 读取文件
export async function readFile(path: string): Promise<string> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: GITHUB_BRANCH
    })

    if (!('content' in data)) {
      throw new Error('Not a file')
    }

    return Buffer.from(data.content, 'base64').toString('utf-8')
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      throw new Error(`File not found: ${path}`)
    }
    throw error
  }
}

// 写入文件
export async function writeFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  try {
    // 先检查文件是否存在
    let sha: string | undefined

    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
        ref: GITHUB_BRANCH
      })

      if ('sha' in data) {
        sha = data.sha
      }
    } catch {
      // 文件不存在，不需要 sha
      sha = undefined
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch: GITHUB_BRANCH
    })
  } catch (error) {
    console.error('Failed to write file:', error)
    throw error
  }
}

// 读取学习进度
export async function getProgress(): Promise<string> {
  return readFile('teacher/runtime/progress.md')
}

// 更新学习进度
export async function updateProgress(content: string): Promise<void> {
  await writeFile('teacher/runtime/progress.md', content, 'Update progress')
}

// 读取会话日志
export async function getSessionLog(): Promise<string> {
  return readFile('teacher/runtime/session_log.md')
}

// 读取复习队列
export async function getReviewQueue(): Promise<string> {
  return readFile('teacher/runtime/review_queue.md')
}

// 读取错题本
export async function getMistakeLog(): Promise<string> {
  return readFile('teacher/runtime/mistake_log.md')
}

// 读取微信聊天记录
export async function getWechatHistory(): Promise<string> {
  return readFile('teacher/runtime/wechat_group.md')
}

// 读取微信未读消息
export async function getWechatUnread(): Promise<string> {
  return readFile('teacher/runtime/wechat_unread.md')
}

// 更新微信未读消息（清空）
export async function clearWechatUnread(): Promise<void> {
  await writeFile('teacher/runtime/wechat_unread.md', '# 未读消息\n\n暂无未读消息\n', 'Clear unread messages')
}

// 追加微信聊天记录
export async function appendWechatHistory(content: string): Promise<void> {
  const existing = await getWechatHistory()
  await writeFile('teacher/runtime/wechat_group.md', existing + '\n' + content, 'Append wechat history')
}
