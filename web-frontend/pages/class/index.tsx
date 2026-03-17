import Head from 'next/head'
import Link from 'next/link'

const TEACHERS = [
  {
    id: 'kurisu',
    name: '牧瀬紅莉栖',
    title: '理论物理背景',
    style: '严谨、逻辑强',
    emoji: '🔬',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'kousei',
    name: '有马公生',
    title: '音乐转物理',
    style: '温和、善于引导',
    emoji: '🎹',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'lena',
    name: '弗拉基米尔·蕾娜',
    title: '俄系训练',
    style: '严格、重实战',
    emoji: '❄️',
    color: 'from-purple-500 to-indigo-500'
  }
]

export default function ClassPage() {
  return (
    <>
      <Head>
        <title>选择老师 - 苏格拉底式 AI 家教系统</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="text-purple-600 hover:underline">← 返回首页</Link>
            <h1 className="text-4xl font-bold mt-4 mb-2">🎓 选择你的老师</h1>
            <p className="text-gray-600">三位特色讲师，总有一位适合你</p>
          </div>

          {/* Teachers Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TEACHERS.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className={`h-32 bg-gradient-to-r ${teacher.color}`} />
                <div className="p-6">
                  <div className="text-5xl mb-4">{teacher.emoji}</div>
                  <h2 className="text-2xl font-bold mb-2">{teacher.name}</h2>
                  <div className="text-sm text-gray-500 mb-4">{teacher.title}</div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {teacher.style}
                    </span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    开始上课
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Unit Selection */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">📚 选择学习单元</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['U1 静电学', 'U2 电容', 'U3 电路', 'U4 磁场', 'U5 电磁感应'].map((unit) => (
                <button
                  key={unit}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
                >
                  <div className="font-semibold">{unit.split(' ')[0]}</div>
                  <div className="text-sm text-gray-600">{unit.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
