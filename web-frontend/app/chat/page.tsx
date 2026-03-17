"use client";
import { useState } from "react";

export default function ChatPage() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "紅莉栖：先把今天电场知识点过一遍。",
    "公生：我补一张图帮你建立直觉。",
    "蕾娜：先同步未读，再开课。",
  ]);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">四重奏群聊</h2>
      <div className="mt-4 h-80 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        {messages.map((m, i) => (<div key={i} className="mb-2 text-slate-700">{m}</div>))}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="输入消息…" className="flex-1 rounded-lg border border-slate-300 px-3 py-2" />
        <button onClick={() => { if (!text.trim()) return; setMessages((p) => [...p, `你：${text}`]); setText(""); }} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">发送</button>
      </div>
    </div>
  );
}
