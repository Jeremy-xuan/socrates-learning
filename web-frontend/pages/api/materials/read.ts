// /api/materials/read — 读取课件内容

import type { NextApiRequest, NextApiResponse } from 'next'
import { readFile } from '../../../lib/github'

interface MaterialsReadRequest {
  path: string
  type?: 'pdf' | 'markdown'
}

interface MaterialsReadResponse {
  success: boolean
  content?: string
  type?: 'pdf' | 'markdown' | 'summary'
  metadata?: {
    title?: string
    chapter?: string
    pageCount?: number
    lastModified?: string
  }
  error?: string
}

// 课件路径白名单
const ALLOWED_PATHS = [
  'materials/textbook/',
  'materials/讲义/',
  'materials/练习册/',
  'materials/cache/'
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MaterialsReadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { path, type = 'markdown' }: MaterialsReadRequest = req.body

    // 验证路径（防止目录遍历攻击）
    if (!ALLOWED_PATHS.some(allowed => path.startsWith(allowed))) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid path. Must be under materials/ directory' 
      })
    }

    if (path.includes('..')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid path' 
      })
    }

    // 尝试读取 Markdown 版本（优先）
    const mdPath = path.replace('.pdf', '.md')
    try {
      const content = await readFile(mdPath)
      res.status(200).json({
        success: true,
        content,
        type: 'markdown',
        metadata: {
          title: extractTitle(content),
          chapter: extractChapter(path),
          lastModified: new Date().toISOString()
        }
      })
      return
    } catch {
      // Markdown 不存在，继续
    }

    // 如果是 PDF，返回提示信息（需要课件阅读 Agent）
    if (path.endsWith('.pdf')) {
      res.status(200).json({
        success: true,
        content: 'PDF 文件需要通过课件阅读 Agent 转换',
        type: 'pdf',
        metadata: {
          chapter: extractChapter(path),
          lastModified: new Date().toISOString()
        }
      })
      return
    }

    // 读取其他文件
    const content = await readFile(path)
    res.status(200).json({
      success: true,
      content,
      type: 'markdown',
      metadata: {
        title: extractTitle(content),
        chapter: extractChapter(path),
        lastModified: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Failed to read material:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to read material' 
    })
  }
}

// 提取标题
function extractTitle(content: string): string | undefined {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1] : undefined
}

// 从路径提取章节信息
function extractChapter(path: string): string | undefined {
  const match = path.match(/(Chapter\s*\d+|U\d+|Unit\s*\d+)/i)
  return match ? match[0] : undefined
}
