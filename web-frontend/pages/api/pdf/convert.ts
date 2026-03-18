import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { convertPdfToMarkdown } from '../../../lib/pdf-converter'

interface ConvertReqBody {
  pdfPath?: string
  force?: boolean
  parserCommand?: string
  parsed?: unknown
}

function resolvePdfPath(input: string) {
  const normalized = input.replace(/\\/g, '/').replace(/^\.\//, '')
  if (normalized.startsWith('/') || normalized.includes('..')) {
    throw new Error('invalid pdfPath')
  }

  const allowRoots = ['materials/讲义', 'materials/练习册', 'materials/textbook', 'materials/solutions']
  const allowed = allowRoots.some((root) => normalized.startsWith(`${root}/`))
  if (!allowed) throw new Error('pdfPath not in allowlist')

  return path.join(process.cwd(), '..', normalized)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const body = (req.body || {}) as ConvertReqBody
    if (!body.pdfPath) {
      return res.status(400).json({ success: false, error: 'pdfPath is required' })
    }

    const absPdfPath = resolvePdfPath(body.pdfPath)
    const result = convertPdfToMarkdown({
      pdfPath: absPdfPath,
      force: Boolean(body.force),
      parserCommand: body.parserCommand,
      parsed: body.parsed,
    })

    return res.status(200).json({
      success: true,
      cacheHit: result.cacheHit,
      cacheKey: result.cacheKey,
      outputPath: result.outputPath,
      markdown: result.markdown,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'convert failed',
    })
  }
}
