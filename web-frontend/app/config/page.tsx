"use client";

import { useState } from "react";

export default function ConfigPage() {
  const [gateway, setGateway] = useState("");
  const [model, setModel] = useState("bailian/qwen3.5-plus");

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">API 配置</h2>
      <p className="mt-1 text-sm text-slate-600">生产环境必须配置 OPENCLAW_GATEWAY_URL。</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          OPENCLAW_GATEWAY_URL
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={gateway} onChange={(e)=>setGateway(e.target.value)} placeholder="https://your-gateway.example.com"/>
        </label>
        <label className="text-sm">
          默认模型
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={model} onChange={(e)=>setModel(e.target.value)} />
        </label>
      </div>
      <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">保存配置</button>
    </div>
  );
}
