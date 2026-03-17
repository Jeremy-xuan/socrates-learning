"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("吴宇轩");
  const [goal, setGoal] = useState("IPhO电磁学邀请赛");
  const [theme, setTheme] = useState("blue-white");

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">角色与学习配置</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          学习者
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
        <label className="text-sm">
          目标
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={goal} onChange={(e)=>setGoal(e.target.value)} />
        </label>
        <label className="text-sm">
          主题
          <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={theme} onChange={(e)=>setTheme(e.target.value)}>
            <option value="blue-white">蓝白简约</option>
            <option value="dark">深色</option>
          </select>
        </label>
      </div>
      <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">保存</button>
    </div>
  );
}
