const units = [
  ["U1", "静电学", 65, "bg-red-500"],
  ["U2", "导体与电容", 92, "bg-orange-500"],
  ["U3", "电路", 14, "bg-yellow-500"],
  ["U4", "磁场", 13, "bg-green-500"],
  ["U5", "电磁感应", 55, "bg-blue-500"],
] as const;

export default function MaterialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">题目索引</h2>
        <p className="mt-1 text-slate-600">按单元选择，开始针对性练习。</p>
      </div>

      <div className="grid gap-4">
        {units.map(([u, n, c, color]) => (
          <div key={u} className="card flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${color} text-xl font-bold text-white`}>
                {u}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{n}</div>
                <div className="text-sm text-slate-600">题目 {c} 道</div>
              </div>
            </div>
            <button className="btn-primary">进入单元</button>
          </div>
        ))}
      </div>
    </div>
  );
}
