import Link from "next/link";

const MATERIALS = [
  { unit: 'U1', title: '静电学', pages: 'P1-P86', problems: 65, color: 'bg-red-500' },
  { unit: 'U2', title: '电容/导体', pages: 'P87-P116', problems: 92, color: 'bg-orange-500' },
  { unit: 'U3', title: '电路', pages: 'P117-P182', problems: 14, color: 'bg-yellow-500' },
  { unit: 'U4', title: '磁场', pages: 'P183-P236', problems: 13, color: 'bg-green-500' },
  { unit: 'U5', title: '电磁感应', pages: 'P237-P300', problems: 55, color: 'bg-blue-500' }
];

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-purple-600 hover:underline">← 返回首页</Link>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-12">📚 课件浏览</h1>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {MATERIALS.map((material) => (
            <div key={material.unit} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className={`${material.color} text-white px-6 py-8 min-w-[120px] text-center`}>
                  <div className="text-3xl font-bold">{material.unit}</div>
                </div>
                <div className="flex-1 p-6">
                  <h2 className="text-2xl font-bold mb-2">{material.title}</h2>
                  <div className="flex gap-6 text-gray-600">
                    <span>📄 {material.pages}</span>
                    <span>✏️ {material.problems} 题</span>
                  </div>
                </div>
                <div className="px-6">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    开始学习
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
