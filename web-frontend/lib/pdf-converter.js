const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { spawnSync } = require('child_process')

const WEB_ROOT = path.resolve(__dirname, '..')
const WORKSPACE_ROOT = path.resolve(WEB_ROOT, '..')
const CACHE_ROOT = path.join(WEB_ROOT, '.cache', 'pdf-convert')
const DEFAULT_OUTPUT_DIR = path.join(WORKSPACE_ROOT, 'materials', 'parsed_md')

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function safeBaseName(filePath) {
  return path.basename(filePath).replace(/\.pdf$/i, '')
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

function fileFingerprint(pdfPath) {
  const stat = fs.statSync(pdfPath)
  return sha256(`${pdfPath}|${stat.size}|${stat.mtimeMs}`)
}

function cachePaths(cacheKey) {
  return {
    metaPath: path.join(CACHE_ROOT, `${cacheKey}.json`),
    mdPath: path.join(CACHE_ROOT, `${cacheKey}.md`),
  }
}

function normalizeParsedPayload(parsed) {
  const pages = Array.isArray(parsed?.pages)
    ? parsed.pages
    : typeof parsed?.pages === 'number'
      ? new Array(parsed.pages).fill(null).map((_, i) => ({ index: i + 1 }))
      : []

  const formulas = Array.isArray(parsed?.formulas) ? parsed.formulas : []
  const points = Array.isArray(parsed?.knowledge_points) ? parsed.knowledge_points : []
  const text = typeof parsed?.text === 'string' ? parsed.text : ''

  return { pages, formulas, points, text }
}

function toMarkdown({ pdfPath, parsed, generatedAt }) {
  const { pages, formulas, points, text } = normalizeParsedPayload(parsed)
  const title = safeBaseName(pdfPath)

  const lines = []
  lines.push(`# ${title}`)
  lines.push('')
  lines.push('> Source: PDF parsing result (for Claude Code readable context)')
  lines.push(`> Generated at: ${generatedAt}`)
  lines.push(`> File: ${pdfPath}`)
  lines.push('')

  lines.push('## Summary')
  lines.push('')
  lines.push(`- Pages: ${pages.length || 0}`)
  lines.push(`- Formulas: ${formulas.length}`)
  lines.push(`- Knowledge points: ${points.length}`)
  lines.push('')

  lines.push('## Knowledge Points')
  lines.push('')
  if (points.length === 0) {
    lines.push('- (none)')
  } else {
    points.forEach((p) => lines.push(`- ${p}`))
  }
  lines.push('')

  lines.push('## Formula Sheet')
  lines.push('')
  if (formulas.length === 0) {
    lines.push('- (none)')
  } else {
    formulas.forEach((f) => lines.push(`- \`${f}\``))
  }
  lines.push('')

  lines.push('## OCR / Parsed Text')
  lines.push('')
  lines.push(text ? text : '(empty)')
  lines.push('')

  lines.push('## Page Notes')
  lines.push('')
  if (pages.length === 0) {
    lines.push('- (no page-level data)')
  } else {
    pages.forEach((p, idx) => {
      const pageNo = p?.page || p?.index || idx + 1
      lines.push(`### Page ${pageNo}`)
      lines.push('')
      if (typeof p?.text === 'string' && p.text.trim()) {
        lines.push(p.text.trim())
      } else {
        lines.push('(no text extracted)')
      }
      if (Array.isArray(p?.formulas) && p.formulas.length > 0) {
        lines.push('')
        lines.push('Formulas:')
        p.formulas.forEach((f) => lines.push(`- \`${f}\``))
      }
      lines.push('')
    })
  }

  return `${lines.join('\n')}\n`
}

function parserFallback(pdfPath, reason) {
  return {
    pages: [{ page: 1, text: `Parser fallback for ${path.basename(pdfPath)}: ${reason}` }],
    text: `Parser fallback for ${pdfPath}: ${reason}`,
    formulas: [],
    knowledge_points: [],
  }
}

function runParser(pdfPath, parserCommand) {
  try {
    if (!parserCommand) {
      const scriptPath = path.join(WORKSPACE_ROOT, 'scripts', 'image-api-bridge.py')
      const cmd = spawnSync('python3', [scriptPath, 'parse', pdfPath], { encoding: 'utf8' })
      if (cmd.status !== 0) {
        return parserFallback(pdfPath, (cmd.stderr || cmd.stdout || 'parser failed').trim())
      }
      return JSON.parse(cmd.stdout || '{}')
    }

    const parts = parserCommand.split(' ').filter(Boolean)
    const cmd = spawnSync(parts[0], [...parts.slice(1), pdfPath], { encoding: 'utf8' })
    if (cmd.status !== 0) {
      return parserFallback(pdfPath, (cmd.stderr || cmd.stdout || 'custom parser failed').trim())
    }
    return JSON.parse(cmd.stdout || '{}')
  } catch (error) {
    return parserFallback(pdfPath, error instanceof Error ? error.message : 'unknown parser error')
  }
}

function convertPdfToMarkdown({ pdfPath, parsed, force = false, outputDir = DEFAULT_OUTPUT_DIR, parserCommand }) {
  if (!pdfPath) throw new Error('pdfPath is required')
  if (!fs.existsSync(pdfPath)) throw new Error(`PDF not found: ${pdfPath}`)

  ensureDir(CACHE_ROOT)
  ensureDir(outputDir)

  const key = fileFingerprint(pdfPath)
  const { metaPath, mdPath } = cachePaths(key)

  if (!force && fs.existsSync(metaPath) && fs.existsSync(mdPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    const markdown = fs.readFileSync(mdPath, 'utf8')
    const targetPath = path.join(outputDir, `${safeBaseName(pdfPath)}.md`)
    fs.writeFileSync(targetPath, markdown, 'utf8')
    return { cacheHit: true, cacheKey: key, markdown, outputPath: targetPath, meta }
  }

  const parseResult = parsed || runParser(pdfPath, parserCommand)
  const generatedAt = new Date().toISOString()
  const markdown = toMarkdown({ pdfPath, parsed: parseResult, generatedAt })

  const meta = {
    cacheKey: key,
    pdfPath,
    generatedAt,
    parser: parsed ? 'external_payload' : (parserCommand || 'python3 scripts/image-api-bridge.py parse'),
  }

  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8')
  fs.writeFileSync(mdPath, markdown, 'utf8')

  const targetPath = path.join(outputDir, `${safeBaseName(pdfPath)}.md`)
  fs.writeFileSync(targetPath, markdown, 'utf8')

  return { cacheHit: false, cacheKey: key, markdown, outputPath: targetPath, meta }
}

module.exports = {
  convertPdfToMarkdown,
  toMarkdown,
}
