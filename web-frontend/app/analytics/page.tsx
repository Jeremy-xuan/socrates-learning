import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold">苏格拉底学习系统</Link>
          <nav className="flex gap-4">
            <Link href="/classroom" className="hover:underline">上课</Link>
            <Link href="/chat" className="hover:underline">群聊</Link>
            <Link href="/settings" className="hover:underline">配置</Link>
            <Link href="/analytics" className="underline">统计</Link>
            <Link href="/config" className="hover:underline">API</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">📊 学习统计</h1>
        
        {/* 统计卡片 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-blue-600">178</div>
            <div className="text-slate-600 mt-2">已做题数</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-green-600">92%</div>
            <div className="text-slate-600 mt-2">正确率</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-orange-600">12</div>
            <div className="text-slate-600 mt-2">错题数</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl font-bold text-purple-600">65%</div>
            <div className="text-slate-600 mt-2">整体进度</div>
          </div>
        </div>

        {/* 单元进度 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">单元进度</h2>
          <div className="space-y-4">
            {[
              { name: 'U1 静电学', progress: 100 },
              { name: 'U2 电容/导体', progress: 85 },
              { name: 'U3 电路', progress: 60 },
              { name: 'U4 磁场', progress: 45 },
              { name: 'U5 电磁感应', progress: 20 }
            ].map((unit) => (
              <div key={unit.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{unit.name}</span>
                  <span className="text-sm text-slate-600">{unit.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${unit.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 薄弱点 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">需要加强</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { topic: '电磁感应', accuracy: '58%' },
              { topic: '电路分析', accuracy: '65%' },
              { topic: '电势能', accuracy: '72%' }
            ].map((item) => (
              <div key={item.topic} className="border rounded-lg p-4">
                <div className="font-medium text-slate-700">{item.topic}</div>
                <div className="text-sm text-slate-500 mt-1">正确率：{item.accuracy}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
