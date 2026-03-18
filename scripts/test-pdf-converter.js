#!/usr/bin/env node

const path = require('path')
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

console.log(JSON.stringify({
  success: true,
  firstRunCacheHit: first.cacheHit,
  secondRunCacheHit: second.cacheHit,
  outputPath: second.outputPath,
}, null, 2))
