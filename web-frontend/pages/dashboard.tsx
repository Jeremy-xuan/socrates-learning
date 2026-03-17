import Head from 'next/head'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>学习仪表盘 - 苏格拉底式 AI 家教系统</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="text-purple-600 hover:underline">← 返回首页</Link>
            <h1 className="text-4xl font-bold mt-4 mb-2">📊 学习仪表盘</h1>
            <p className="text-gray-600">追踪你的学习进度</p>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-purple-600">65%</div>
              <div className="text-gray-600 mt-2">整体进度</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-600">178</div>
              <div className="text-gray-600 mt-2">已做题数</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-600">92%</div>
              <div className="text-gray-600 mt-2">正确率</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-orange-600">12</div>
              <div className="text-gray-600 mt-2">错题本</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Unit Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">📚 单元进度</h2>
              <div className="space-y-4">
                {[
                  { name: 'U1 静电学', progress: 100, color: 'bg-red-500' },
                  { name: 'U2 电容', progress: 85, color: 'bg-orange-500' },
                  { name: 'U3 电路', progress: 60, color: 'bg-yellow-500' },
                  { name: 'U4 磁场', progress: 45, color: 'bg-green-500' },
                  { name: 'U5 电磁感应', progress: 20, color: 'bg-blue-500' }
                ].map((unit) => (
                  <div key={unit.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{unit.name}</span>
                      <span className="text-sm text-gray-600">{unit.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${unit.color} h-2 rounded-full transition-all`}
                        style={{ width: `${unit.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">📝 最近活动</h2>
              <div className="space-y-3">
                {[
                  { action: '完成 U2 电容练习', time: '10 分钟前', icon: '✅' },
                  { action: '错题复习：高斯定理', time: '1 小时前', icon: '📖' },
                  { action: '预习 Agent 推荐题目', time: '2 小时前', icon: '🤖' },
                  { action: '完成 U1 单元测试', time: '昨天', icon: '🎯' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{item.action}</div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weak Points */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-4">⚠️ 需要加强</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { topic: '电磁感应', accuracy: '58%', problems: 12 },
                { topic: '电路分析', accuracy: '65%', problems: 8 },
                { topic: '电势能', accuracy: '72%', problems: 5 }
              ].map((item) => (
                <div key={item.topic} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="font-bold mb-2">{item.topic}</div>
                  <div className="text-sm text-gray-600">
                    <div>正确率：{item.accuracy}</div>
                    <div>错题数：{item.problems}</div>
                  </div>
                  <button className="mt-3 text-purple-600 text-sm hover:underline">
                    专项练习 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
