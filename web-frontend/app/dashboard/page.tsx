const cards = [
  ["总进度", "65%", "text-blue-700"],
  ["完成题数", "178", "text-green-700"],
  ["正确率", "92%", "text-emerald-700"],
  ["错题", "12", "text-orange-700"],
] as const;

const chart = [
  ["周一", 12],
  ["周二", 18],
  ["周三", 15],
  ["周四", 22],
  ["周五", 19],
  ["周六", 25],
  ["周日", 20],
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">学习仪表盘</h2>
        <p className="mt-1 text-slate-600">实时追踪你的学习进度。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([k, v, color]) => (
          <div key={k} className="card p-6">
            <div className="text-sm font-medium text-slate-500">{k}</div>
            <div className={`mt-2 text-3xl font-bold ${color}`}>{v}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-semibold text-slate-900">本周学习趋势</h3>
        <div className="flex items-end gap-3">
          {chart.map(([day, val]) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                style={{ height: `${(val / 30) * 160}px` }}
              />
              <span className="text-xs text-slate-500">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
