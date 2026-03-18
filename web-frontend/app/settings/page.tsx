"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("吴宇轩");
  const [goal, setGoal] = useState("IPhO 电磁学邀请赛");
  const [theme, setTheme] = useState("blue-white");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">角色与学习配置</h2>
        <p className="mt-1 text-slate-600">个性化你的学习体验。</p>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-semibold text-slate-900">学习者信息</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">姓名</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">学习目标</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-semibold text-slate-900">界面设置</h3>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">主题</span>
          <select
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="blue-white">蓝白简约</option>
            <option value="dark">深色模式</option>
          </select>
        </label>
      </div>

      <button className="btn-primary">保存配置</button>
    </div>
  );
}
