#!/usr/bin/env node

const path = require('path')
const assert = require('assert')
const { convertPdfToMarkdown } = require('../web-frontend/lib/pdf-converter')

const pdfPath = path.resolve(__dirname, '../materials/练习册/物理电磁C练习册-U1-P1-P86.pdf')

const mockParsed = {
  pages: [
    { page: 1, text: '电场强度与库仑定律', formulas: ['E=F/q', 'F=kQq/r^2'] },
    { page: 2, text: '电势与电势能', formulas: ['U=W/q'] },
  ],
  text: '电场强度、电势、电势能是本章重点',
  formulas: ['E=F/q', 'F=kQq/r^2', 'U=W/q'],
  knowledge_points: ['电场强度', '库仑定律', '电势'],
}

const first = convertPdfToMarkdown({ pdfPath, parsed: mockParsed, force: true })
const second = convertPdfToMarkdown({ pdfPath, parsed: mockParsed, force: false })
assert.strictEqual(first.cacheHit, false, 'first run should miss cache')
assert.strictEqual(second.cacheHit, true, 'second run should hit cache')

// fallback 测试：解析器失败时仍应产出 markdown
const fallback = convertPdfToMarkdown({
  pdfPath,
  force: true,
  parserCommand: 'python3 scripts/not-exist.py parse',
})
assert.ok(fallback.markdown.includes('Parser fallback'), 'fallback markdown expected')

console.log(JSON.stringify({
  success: true,
  firstRunCacheHit: first.cacheHit,
  secondRunCacheHit: second.cacheHit,
  fallbackGenerated: true,
  outputPath: second.outputPath,
}, null, 2))
