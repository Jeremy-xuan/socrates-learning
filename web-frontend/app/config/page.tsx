"use client";
import { useState } from "react";

export default function ConfigPage() {
  const [gateway, setGateway] = useState("");
  const [model, setModel] = useState("bailian/qwen3.5-plus");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">API 配置</h2>
        <p className="mt-1 text-slate-600">生产环境必须配置 OPENCLAW_GATEWAY_URL。</p>
      </div>

      <div className="card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">OPENCLAW_GATEWAY_URL</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 font-mono text-sm"
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              placeholder="https://your-gateway.example.com"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">默认模型</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 font-mono text-sm"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </label>
        </div>
      </div>

      <button className="btn-primary">保存配置</button>
    </div>
  );
}
