"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X, RefreshCw } from "lucide-react";

type Provider = "openai" | "anthropic" | "bailian" | "custom";

const providers = [
  { id: "openai" as const, name: "OpenAI", logo: "🤖" },
  { id: "anthropic" as const, name: "Anthropic", logo: "🧠" },
  { id: "bailian" as const, name: "Bailian", logo: "🌐" },
  { id: "custom" as const, name: "自定义", logo: "⚙️" },
];

const models = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-5-sonnet", "claude-3-haiku", "claude-3-opus"],
  bailian: ["abab6.5s-chat", "abab6-chat"],
  custom: ["自定义模型"],
};

export default function ConfigPage() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo, always succeed if key is not empty
    setTestResult(apiKey.trim() ? "success" : "error");
    setIsTesting(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          API 配置
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          设置大模型 API Key 与连接参数
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            选择服务商
          </label>
          <div className="grid grid-cols-4 gap-3">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProvider(p.id);
                  setModel(models[p.id][0]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  provider === p.id
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">{p.logo}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {p.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                provider === "openai"
                  ? "sk-..."
                  : provider === "anthropic"
                  ? "sk-ant-..."
                  : "输入 API Key"
              }
              className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showKey ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            您的 API Key 仅存储在浏览器本地，不会发送到我们的服务器
          </p>
        </div>

        {/* Endpoint (for custom) */}
        {provider === "custom" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API 端点
            </label>
            <input
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        )}

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            选择模型
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
          >
            {models[provider].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`flex items-center gap-2 p-4 rounded-lg ${
              testResult === "success"
                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {testResult === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span>
              {testResult === "success"
                ? "连接成功！API Key 有效"
                : "连接失败，请检查 API Key"}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleTest}
            disabled={isTesting || !apiKey.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white rounded-lg font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? "animate-spin" : ""}`} />
            {isTesting ? "测试中..." : "测试连接"}
          </button>
          <button className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium">
            保存配置
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          💡 使用提示
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• OpenAI gpt-4o-mini性价比最高，适合日常使用</li>
          <li>• Anthropic Claude 3 Haiku 响应快速，适合简单对话</li>
          <li>• 建议设置月度预算上限避免超额</li>
        </ul>
      </div>
    </div>
  );
}