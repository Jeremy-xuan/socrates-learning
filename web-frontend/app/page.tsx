import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🎓 苏格拉底式 AI 家教系统</h1>
          <p className="text-xl opacity-90">用 AI 重新定义学习｜AP Physics C 电磁学专项</p>
        </div>
      </header>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">272</div>
            <div className="text-gray-600 mt-2">道题目</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">5</div>
            <div className="text-gray-600 mt-2">个单元</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">7</div>
            <div className="text-gray-600 mt-2">个知识点</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">100%</div>
            <div className="text-gray-600 mt-2">覆盖考纲</div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/classroom" className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">预习 Agent</h3>
            <p className="text-gray-600">智能分析课件，自动推荐预习题目。</p>
          </Link>
          <Link href="/materials" className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">题目索引</h3>
            <p className="text-gray-600">按知识点/难度/题型分类。</p>
          </Link>
          <Link href="/dashboard" className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">学习仪表盘</h3>
            <p className="text-gray-600">实时记录学习进度，错题本。</p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>苏格拉底式 AI 家教系统 © 2026 | Powered by OpenClaw</p>
        </div>
      </footer>
    </div>
  );
}
