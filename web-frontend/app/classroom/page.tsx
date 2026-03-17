import Link from "next/link";

export default function ClassroomPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold">苏格拉底学习系统</Link>
          <nav className="flex gap-4">
            <Link href="/classroom" className="underline">上课</Link>
            <Link href="/chat" className="hover:underline">群聊</Link>
            <Link href="/settings" className="hover:underline">配置</Link>
            <Link href="/analytics" className="hover:underline">统计</Link>
            <Link href="/config" className="hover:underline">API</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">📚 开始上课</h1>
        
        {/* 老师选择 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">选择老师</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="border-2 border-blue-600 bg-blue-50 rounded-lg p-4 text-left">
              <div className="text-2xl mb-2">🎹</div>
              <div className="font-semibold text-slate-700">有马公生</div>
              <div className="text-sm text-slate-600">温和引导</div>
            </button>
            <button className="border rounded-lg p-4 text-left hover:border-blue-300">
              <div className="text-2xl mb-2">🔬</div>
              <div className="font-semibold text-slate-700">牧瀬紅莉栖</div>
              <div className="text-sm text-slate-600">严谨逻辑</div>
            </button>
            <button className="border rounded-lg p-4 text-left hover:border-blue-300">
              <div className="text-2xl mb-2">❄️</div>
              <div className="font-semibold text-slate-700">弗拉基米尔·蕾娜</div>
              <div className="text-sm text-slate-600">严格实战</div>
            </button>
          </div>
        </div>

        {/* 单元选择 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">选择单元</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['U1 静电学', 'U2 电容', 'U3 电路', 'U4 磁场', 'U5 电磁感应'].map((unit) => (
              <button
                key={unit}
                className="border rounded-lg p-3 text-center hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="font-semibold text-slate-700">{unit.split(' ')[0]}</div>
                <div className="text-sm text-slate-600">{unit.split(' ')[1]}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
