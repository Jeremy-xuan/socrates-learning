import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-purple-600 hover:underline">← 返回首页</Link>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-12">📊 学习仪表盘</h1>
        
        {/* Stats */}
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
      </div>
    </div>
  );
}
