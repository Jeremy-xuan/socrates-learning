import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold">苏格拉底学习系统</Link>
          <nav className="flex gap-4">
            <Link href="/classroom" className="hover:underline">上课</Link>
            <Link href="/chat" className="hover:underline">群聊</Link>
            <Link href="/settings" className="underline">配置</Link>
            <Link href="/analytics" className="hover:underline">统计</Link>
            <Link href="/config" className="hover:underline">API</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">⚙️ 个人配置</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* 个人进度配置 */}
          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">学习进度</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">当前单元</label>
                <select className="w-full border rounded p-2">
                  <option>U1 静电学</option>
                  <option>U2 电容/导体</option>
                  <option selected>U3 电路</option>
                  <option>U4 磁场</option>
                  <option>U5 电磁感应</option>
                </select>
              </div>
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">完成题数</label>
                <input type="number" defaultValue="178" className="w-full border rounded p-2" />
              </div>
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">正确率</label>
                <input type="text" defaultValue="92%" className="w-full border rounded p-2" />
              </div>
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">错题数</label>
                <input type="number" defaultValue="12" className="w-full border rounded p-2" />
              </div>
            </div>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              保存进度
            </button>
          </section>

          {/* 老师选择 */}
          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">偏好设置</h2>
            <div className="border rounded-lg p-4">
              <label className="block text-sm text-slate-600 mb-2">默认老师</label>
              <select className="w-full border rounded p-2">
                <option>牧瀬紅莉栖 - 严谨逻辑</option>
                <option selected>有马公生 - 温和引导</option>
                <option>弗拉基米尔·蕾娜 - 严格实战</option>
              </select>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
