import Link from "next/link";

export default function ConfigPage() {
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
            <Link href="/config" className="underline">API</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">🔑 API 配置</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* OpenClaw 配置 */}
          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">OpenClaw 网关</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">网关地址</label>
                <input 
                  type="text" 
                  defaultValue="http://localhost:3001" 
                  className="w-full border rounded p-2 font-mono text-sm"
                />
              </div>
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">Workspace</label>
                <input 
                  type="text" 
                  defaultValue="./teacher" 
                  className="w-full border rounded p-2 font-mono text-sm"
                />
              </div>
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">模型</label>
                <select className="w-full border rounded p-2">
                  <option selected>bailian/qwen3.5-plus</option>
                  <option>bailian/qwen-max</option>
                  <option>openai/gpt-4</option>
                </select>
              </div>
            </div>
          </section>

          {/* GitHub 配置 */}
          <section>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">GitHub 集成</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">仓库</label>
                <input 
                  type="text" 
                  defaultValue="Jeremy-xuan/socrates-learning" 
                  className="w-full border rounded p-2 font-mono text-sm"
                />
              </div>
              <div className="border rounded-lg p-4">
                <label className="block text-sm text-slate-600 mb-2">分支</label>
                <input 
                  type="text" 
                  defaultValue="main" 
                  className="w-full border rounded p-2 font-mono text-sm"
                />
              </div>
            </div>
          </section>

          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            保存配置
          </button>
        </div>
      </main>
    </div>
  );
}
