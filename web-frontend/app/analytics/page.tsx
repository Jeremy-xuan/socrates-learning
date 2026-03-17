export default function AnalyticsPage() {
  const rows = [
    ["今日学习时长", "92 分钟"],
    ["今日完成题目", "18 题"],
    ["当前正确率", "92%"],
    ["累计 Token", "128,430"],
  ] as const;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">学习统计</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rows.map(([k, v]) => (
          <div key={k} className="card p-5">
            <div className="text-sm text-slate-500">{k}</div>
            <div className="mt-2 text-2xl font-semibold text-blue-700">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
