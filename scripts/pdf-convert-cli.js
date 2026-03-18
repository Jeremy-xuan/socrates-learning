#!/usr/bin/env node

const path = require('path')
const { convertPdfToMarkdown } = require('../web-frontend/lib/pdf-converter')

function arg(name) {
  const idx = process.argv.indexOf(name)
  if (idx < 0) return undefined
  return process.argv[idx + 1]
}

function has(name) {
  return process.argv.includes(name)
}

function usage() {
  console.log(`\nPDF -> Markdown CLI\n\nUsage:\n  node scripts/pdf-convert-cli.js --pdf <path> [--force] [--out <dir>] [--parser-cmd \"python3 ...\"]\n\nExamples:\n  node scripts/pdf-convert-cli.js --pdf materials/练习册/物理电磁C练习册-U1-P1-P86.pdf\n  node scripts/pdf-convert-cli.js --pdf materials/讲义/AP物理电磁C-讲义-U1-P37-P82.pdf --force\n`)
}

async function main() {
  const pdfPathArg = arg('--pdf')
  if (!pdfPathArg || has('--help') || has('-h')) {
    usage()
    process.exit(pdfPathArg ? 0 : 1)
  }

  const force = has('--force')
  const out = arg('--out')
  const parserCommand = arg('--parser-cmd')

  const pdfPath = path.resolve(process.cwd(), pdfPathArg)
  const outputDir = out ? path.resolve(process.cwd(), out) : undefined

  const result = convertPdfToMarkdown({
    pdfPath,
    force,
    outputDir,
    parserCommand,
  })

  console.log(JSON.stringify({
    success: true,
    cacheHit: result.cacheHit,
    cacheKey: result.cacheKey,
    outputPath: result.outputPath,
  }, null, 2))
}

main().catch((err) => {
  console.error(JSON.stringify({ success: false, error: err.message }, null, 2))
  process.exit(1)
})
