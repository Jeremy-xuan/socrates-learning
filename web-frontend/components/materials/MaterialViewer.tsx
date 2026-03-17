// components/materials/MaterialViewer.tsx — 课件查看器组件

'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface MaterialViewerProps {
  initialPath?: string
}

interface MaterialMetadata {
  title?: string
  chapter?: string
  pageCount?: number
  lastModified?: string
}

export default function MaterialViewer({ initialPath }: MaterialViewerProps) {
  const [path, setPath] = useState(initialPath || '')
  const [content, setContent] = useState<string>('')
  const [metadata, setMetadata] = useState<MaterialMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState<'markdown' | 'pdf' | 'summary'>('markdown')

  // 常用课件路径
  const commonPaths = [
    { label: 'Chapter 21 - Electric Fields', path: 'materials/cache/Chapter21.md' },
    { label: 'U1 - Electrostatics', path: 'materials/cache/U1.md' },
    { label: 'U2 - Conductors', path: 'materials/cache/U2.md' },
    { label: 'U3 - Circuits', path: 'materials/cache/U3.md' },
  ]

  const loadMaterial = async (materialPath: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/materials/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: materialPath })
      })

      const data = await response.json()

      if (data.success) {
        setContent(data.content)
        setMetadata(data.metadata || null)
        setType(data.type || 'markdown')
        setPath(materialPath)
      } else {
        setError(data.error || 'Failed to load material')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (path) loadMaterial(path)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 标题 */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        📚 课件查看器
      </h1>

      {/* 路径输入 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="输入课件路径，如：materials/cache/Chapter21.md"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '加载中...' : '加载'}
          </button>
        </div>
      </form>

      {/* 常用课件快捷选择 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          常用课件：
        </h3>
        <div className="flex flex-wrap gap-2">
          {commonPaths.map((item) => (
            <button
              key={item.path}
              onClick={() => loadMaterial(item.path)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 元信息 */}
      {metadata && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {metadata.title && (
              <div>
                <span className="text-gray-500">标题：</span>
                <span className="font-medium">{metadata.title}</span>
              </div>
            )}
            {metadata.chapter && (
              <div>
                <span className="text-gray-500">章节：</span>
                <span className="font-medium">{metadata.chapter}</span>
              </div>
            )}
            {metadata.lastModified && (
              <div>
                <span className="text-gray-500">更新：</span>
                <span className="font-medium">
                  {new Date(metadata.lastModified).toLocaleDateString('zh-CN')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载课件中...</span>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">❌ {error}</p>
        </div>
      )}

      {/* 课件内容 */}
      {!loading && !error && content && (
        <div className="prose dark:prose-invert max-w-none">
          {type === 'pdf' ? (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">
                ⚠️ 这是 PDF 文件，需要通过课件阅读 Agent 转换。
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                请联系老师或使用"转换课件"功能。
              </p>
            </div>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>
      )}

      {/* 空状态 */}
      {!loading && !error && !content && (
        <div className="text-center py-12 text-gray-500">
          <p>📖 选择一个课件开始学习</p>
          <p className="text-sm mt-2">支持 Markdown 格式的课件文件</p>
        </div>
      )}
    </div>
  )
}
