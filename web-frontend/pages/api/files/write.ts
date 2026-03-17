// /api/files/write — 写入状态文件

import type { NextApiRequest, NextApiResponse } from 'next'
import { writeStatusFile } from '../../../lib/openclaw'
import { writeFile } from '../../../lib/github'

interface WriteFileRequest {
  path: string
  content: string
  source?: 'github' | 'openclaw'
  commitMessage?: string
}

interface WriteFileResponse {
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WriteFileResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { path, content, source = 'github', commitMessage }: WriteFileRequest = req.body

    // 验证路径
    const validPrefixes = ['teacher/runtime/', 'teacher/config/']
    if (!validPrefixes.some(prefix => path.startsWith(prefix))) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid path. Must start with teacher/runtime/ or teacher/config/' 
      })
    }

    // 验证内容
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content cannot be empty' 
      })
    }

    // 根据 source 选择写入方式
    if (source === 'openclaw') {
      const result = await writeStatusFile({
        path,
        content,
        commitMessage: commitMessage || `Update ${path}`
      })
      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error })
      }
    } else {
      await writeFile(path, content, commitMessage || `Update ${path}`)
    }

    res.status(200).json({
      success: true
    })
  } catch (error) {
    console.error('Failed to write file:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to write file' 
    })
  }
}
