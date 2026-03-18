import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { convertPdfToMarkdown } from '../../../lib/pdf-converter'

interface ConvertReqBody {
  pdfPath?: string
  force?: boolean
  parsed?: unknown
  includeMarkdown?: boolean
}

type OkResp = {
  success: true
  cacheHit: boolean
  cacheKey: string
  outputPath: string
  markdown?: string
}

type ErrResp = {
  success: false
  error: string
  code: string
}

class BadRequestError extends Error {
  code: string

  constructor(message: string, code = 'BAD_REQUEST') {
    super(message)
    this.code = code
  }
}

function resolvePdfPath(input: string) {
  const normalized = input.replace(/\\/g, '/').replace(/^\.\//, '')
  if (normalized.startsWith('/') || normalized.includes('..')) {
    throw new BadRequestError('invalid pdfPath', 'INVALID_PATH')
  }

  const allowRoots = ['materials/讲义', 'materials/练习册', 'materials/textbook', 'materials/solutions']
  const allowed = allowRoots.some((root) => normalized.startsWith(`${root}/`))
  if (!allowed) throw new BadRequestError('pdfPath not in allowlist', 'PATH_NOT_ALLOWED')

  return path.join(process.cwd(), '..', normalized)
}

export default function handler(req: NextApiRequest, res: NextApiResponse<OkResp | ErrResp>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' })
  }

  try {
    const body = (req.body || {}) as ConvertReqBody
    if (!body.pdfPath) {
      throw new BadRequestError('pdfPath is required', 'MISSING_PDF_PATH')
    }

    const absPdfPath = resolvePdfPath(body.pdfPath)

    // 安全策略：API 不接受 parserCommand（防 RCE）
    const result = convertPdfToMarkdown({
      pdfPath: absPdfPath,
      force: Boolean(body.force),
    })

    const response: OkResp = {
      success: true,
      cacheHit: result.cacheHit,
      cacheKey: result.cacheKey,
      outputPath: result.outputPath,
    }

    // 默认不返回完整 markdown，避免大响应体
    if (body.includeMarkdown === true) {
      response.markdown = result.markdown
    }

    return res.status(200).json(response)
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).json({ success: false, error: error.message, code: error.code })
    }

    console.error('[api/pdf/convert] internal error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'convert failed',
      code: 'INTERNAL_ERROR',
    })
  }
}
