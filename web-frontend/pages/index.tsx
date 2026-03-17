import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>苏格拉底式 AI 家教系统</title>
        <meta name="description" content="用 AI 重新定义学习｜AP Physics C 电磁学专项" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">预习 Agent</h3>
              <p className="text-gray-600">智能分析课件，自动推荐预习题目，课前准备更高效。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-2">图片理解</h3>
              <p className="text-gray-600">支持题目图片 OCR 识别，电路图/力学图智能解析。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">题目索引</h3>
              <p className="text-gray-600">按知识点/难度/题型分类，快速定位所需练习。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">苏格拉底式教学</h3>
              <p className="text-gray-600">引导式提问，非填鸭式，培养深度思考能力。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2">进度追踪</h3>
              <p className="text-gray-600">实时记录学习进度，错题本自动整理。</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">群聊模拟</h3>
              <p className="text-gray-600">"四重奏"学习小组，同伴互动不孤单。</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>苏格拉底式 AI 家教系统 © 2026 | Powered by OpenClaw</p>
          </div>
        </footer>
      </main>
    </>
  )
}
