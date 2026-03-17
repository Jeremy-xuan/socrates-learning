import Link from "next/link";

const MATERIALS = [
  { unit: 'U1', title: '静电学', pages: 'P1-P86', problems: 65, color: 'bg-blue-500' },
  { unit: 'U2', title: '电容/导体', pages: 'P87-P116', problems: 92, color: 'bg-blue-500' },
  { unit: 'U3', title: '电路', pages: 'P117-P182', problems: 14, color: 'bg-blue-500' },
  { unit: 'U4', title: '磁场', pages: 'P183-P236', problems: 13, color: 'bg-blue-500' },
  { unit: 'U5', title: '电磁感应', pages: 'P237-P300', problems: 55, color: 'bg-blue-500' }
];

export default function MaterialsPage() {
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

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">📚 课件浏览</h1>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {MATERIALS.map((material) => (
            <div key={material.unit} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`${material.color} text-white px-6 py-6 min-w-[100px] text-center`}>
                  <div className="text-2xl font-bold">{material.unit}</div>
                </div>
                <div className="flex-1 p-4">
                  <h2 className="text-lg font-semibold text-slate-700 mb-1">{material.title}</h2>
                  <div className="flex gap-4 text-sm text-slate-600">
                    <span>📄 {material.pages}</span>
                    <span>✏️ {material.problems} 题</span>
                  </div>
                </div>
                <div className="px-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                    开始学习
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
