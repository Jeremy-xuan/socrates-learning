"use client";
import { useState } from "react";

export default function ChatPage() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { from: "紅莉栖", text: "先把今天电场知识点过一遍。", time: "10:23" },
    { from: "公生", text: "我补一张图帮你建立直觉。", time: "10:25" },
    { from: "蕾娜", text: "先同步未读，再开课。", time: "10:27" },
  ]);

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      <div className="card mb-4 flex items-center justify-between p-4">
        <h2 className="text-xl font-bold text-slate-900">四重奏群聊</h2>
        <span className="text-sm text-green-600">● 在线</span>
      </div>

      <div className="card flex-1 overflow-hidden p-4">
        <div className="flex h-full flex-col gap-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">
                {m.from[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-slate-900">{m.from}</span>
                  <span className="text-xs text-slate-500">{m.time}</span>
                </div>
                <div className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{m.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-4 p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) {
                setMessages((p) => [...p, { from: "你", text, time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) }]);
                setText("");
              }
            }}
          />
          <button
            onClick={() => {
              if (!text.trim()) return;
              setMessages((p) => [...p, { from: "你", text, time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) }]);
              setText("");
            }}
            className="btn-primary"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
