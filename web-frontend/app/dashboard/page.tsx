const cards = [["总进度", "65%"],["完成题数", "178"],["正确率", "92%"],["错题", "12"]] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">学习仪表盘</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([k, v]) => (
          <div key={k} className="card p-5"><div className="text-sm text-slate-500">{k}</div><div className="mt-2 text-2xl font-semibold text-blue-700">{v}</div></div>
        ))}
      </div>
    </div>
  );
}
