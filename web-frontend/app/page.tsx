import Link from "next/link";

export default function Home() {
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
            <Link href="/analytics" className="hover:underline">统计</Link>
            <Link href="/config" className="hover:underline">API</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">🎓 苏格拉底式 AI 家教系统</h1>
          <p className="text-lg opacity-90">AP Physics C 电磁学专项｜智能引导式学习</p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">178</div>
            <div className="text-slate-600 mt-1">已做题数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">92%</div>
            <div className="text-slate-600 mt-1">正确率</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">12</div>
            <div className="text-slate-600 mt-1">错题数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">65%</div>
            <div className="text-slate-600 mt-1">整体进度</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">核心功能</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/classroom" className="block bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">预习 Agent</h3>
            <p className="text-slate-600 text-sm">智能分析课件，自动推荐预习题目</p>
          </Link>
          <Link href="/materials" className="block bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">题目索引</h3>
            <p className="text-slate-600 text-sm">按知识点/难度/题型分类检索</p>
          </Link>
          <Link href="/dashboard" className="block bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">学习仪表盘</h3>
            <p className="text-slate-600 text-sm">实时记录学习进度与错题本</p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>苏格拉底式 AI 家教系统 © 2026</p>
        </div>
      </footer>
    </div>
  );
}
