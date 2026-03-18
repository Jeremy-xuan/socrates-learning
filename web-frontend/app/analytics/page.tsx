const rows = [
  ["今日学习时长", "92 分钟", "⏱️"],
  ["今日完成题目", "18 题", "✅"],
  ["当前正确率", "92%", "🎯"],
  ["累计 Token", "128,430", "💰"],
] as const;

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">学习统计</h2>
        <p className="mt-1 text-slate-600">追踪你的学习投入与产出。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rows.map(([k, v, icon]) => (
          <div key={k} className="card p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{icon}</span>
              <div className="text-right">
                <div className="text-sm text-slate-500">{k}</div>
                <div className="mt-1 text-2xl font-bold text-blue-700">{v}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
