// /api/files/read — 读取状态文件

import type { NextApiRequest, NextApiResponse } from 'next'
import { readStatusFile } from '../../../lib/openclaw'
import { readFile } from '../../../lib/github'

interface ReadFileRequest {
  path: string
  source?: 'github' | 'openclaw'
}

interface ReadFileResponse {
  success: boolean
  content?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReadFileResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { path, source = 'github' }: ReadFileRequest = req.body

    // 验证路径
    const validPrefixes = ['teacher/runtime/', 'teacher/config/', 'teacher/characters/']
    if (!validPrefixes.some(prefix => path.startsWith(prefix))) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid path. Must start with teacher/runtime/, teacher/config/, or teacher/characters/' 
      })
    }

    // 根据 source 选择读取方式
    let content: string
    if (source === 'openclaw') {
      const result = await readStatusFile(path)
      if (!result.success) {
        return res.status(404).json({ success: false, error: result.error })
      }
      content = result.content!
    } else {
      content = await readFile(path)
    }

    res.status(200).json({
      success: true,
      content
    })
  } catch (error) {
    console.error('Failed to read file:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to read file' 
    })
  }
}
