// components/analytics/TokenChart.tsx — Token 统计图表组件

'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface TokenUsage {
  date: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
}

interface TokenChartProps {
  sessionId?: string
  period?: 'day' | 'week' | 'month'
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B']

export default function TokenChart({ sessionId, period = 'week' }: TokenChartProps) {
  const [loading, setLoading] = useState(true)
  const [usage, setUsage] = useState<TokenUsage[]>([])
  const [total, setTotal] = useState({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    cost: 0
  })

  useEffect(() => {
    loadTokenUsage()
  }, [sessionId, period])

  const loadTokenUsage = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        period: period
      })
      if (sessionId) params.set('sessionId', sessionId)

      const response = await fetch(`/api/token/usage?${params}`)
      const data = await response.json()

      if (data.success && data.data) {
        // 模拟数据（实际应从后端获取）
        const mockData: TokenUsage[] = generateMockData(period)
        setUsage(mockData)

        // 计算总计
        setTotal({
          inputTokens: mockData.reduce((sum, d) => sum + d.inputTokens, 0),
          outputTokens: mockData.reduce((sum, d) => sum + d.outputTokens, 0),
          totalTokens: mockData.reduce((sum, d) => sum + d.totalTokens, 0),
          cost: mockData.reduce((sum, d) => sum + d.cost, 0)
        })
      }
    } catch (error) {
      console.error('Failed to load token usage:', error)
    } finally {
      setLoading(false)
    }
  }

  // 生成模拟数据（待户部提供真实数据后替换）
  const generateMockData = (period: string): TokenUsage[] => {
    const days = period === 'day' ? 24 : period === 'week' ? 7 : 30
    const data: TokenUsage[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      const inputTokens = Math.floor(Math.random() * 5000) + 1000
      const outputTokens = Math.floor(Math.random() * 3000) + 500
      const totalTokens = inputTokens + outputTokens
      const cost = totalTokens * 0.000002 // 假设每 token $0.000002

      data.push({
        date: period === 'day'
          ? `${date.getHours()}:00`
          : `${date.getMonth() + 1}/${date.getDate()}`,
        inputTokens,
        outputTokens,
        totalTokens,
        cost: parseFloat(cost.toFixed(4))
      })
    }

    return data
  }

  const pieData = [
    { name: 'Input Tokens', value: total.inputTokens, color: COLORS[0] },
    { name: 'Output Tokens', value: total.outputTokens, color: COLORS[1] },
    { name: 'Estimated Cost', value: total.cost * 10000, color: COLORS[2] } // 缩放以便显示
  ]

  return (
    <div className="space-y-6">
      {/* 总计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm text-blue-600 dark:text-blue-400">Input Tokens</h3>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {total.inputTokens.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-sm text-green-600 dark:text-green-400">Output Tokens</h3>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {total.outputTokens.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="text-sm text-yellow-600 dark:text-yellow-400">Total Tokens</h3>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {total.totalTokens.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h3 className="text-sm text-purple-600 dark:text-purple-400">Estimated Cost</h3>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            ${total.cost.toFixed(4)}
          </p>
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载统计数据...</span>
        </div>
      )}

      {/* 图表 */}
      {!loading && usage.length > 0 && (
        <>
          {/* Token 使用趋势 */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              📊 Token 使用趋势
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="inputTokens"
                  stroke="#3B82F6"
                  name="Input"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="outputTokens"
                  stroke="#10B981"
                  name="Output"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="totalTokens"
                  stroke="#F59E0B"
                  name="Total"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 每日成本 */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              💰 每日成本
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" fill="#8B5CF6" name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Token 分布 */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              🥧 Token 分布
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* 空状态 */}
      {!loading && usage.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>📈 暂无 Token 使用数据</p>
          <p className="text-sm mt-2">开始上课后会自动统计</p>
        </div>
      )}
    </div>
  )
}
