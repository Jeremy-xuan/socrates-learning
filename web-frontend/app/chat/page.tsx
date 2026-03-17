import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold">苏格拉底学习系统</Link>
          <nav className="flex gap-4">
            <Link href="/classroom" className="hover:underline">上课</Link>
            <Link href="/chat" className="underline">群聊</Link>
            <Link href="/settings" className="hover:underline">配置</Link>
            <Link href="/analytics" className="hover:underline">统计</Link>
            <Link href="/config" className="hover:underline">API</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">💬 学习群聊</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 mb-4">与老师和同学讨论问题，分享学习心得。</p>
          
          {/* Chat placeholder */}
          <div className="border rounded-lg p-8 text-center bg-slate-50">
            <p className="text-slate-500">群聊功能开发中...</p>
            <p className="text-sm text-slate-400 mt-2">即将支持微信群消息同步</p>
          </div>
        </div>
      </main>
    </div>
  );
}
