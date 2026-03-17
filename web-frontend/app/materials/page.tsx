const units = [["U1", "静电学", 65],["U2", "导体与电容", 92],["U3", "电路", 14],["U4", "磁场", 13],["U5", "电磁感应", 55]] as const;

export default function MaterialsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">题目索引</h2>
      <div className="grid gap-3">
        {units.map(([u, n, c]) => (
          <div key={u} className="card flex items-center justify-between p-4">
            <div><div className="font-semibold text-slate-900">{u} · {n}</div><div className="text-sm text-slate-600">题目 {c} 道</div></div>
            <button className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50">进入</button>
          </div>
        ))}
      </div>
    </div>
  );
}
