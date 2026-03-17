"use client";
import { useState } from "react";

export default function ClassroomPage() {
  const [teacher, setTeacher] = useState("kurisu");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const teachers = {
    kurisu: { name: "牧瀬紅莉栖", avatar: "👩‍🔬" },
    kousei: { name: "有马公生", avatar: "🎹" },
    lena: { name: "弗拉基米尔·蕾娜", avatar: "👩‍🏫" },
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-slate-900">上课界面</h2>
        <p className="mt-1 text-slate-600">先同步群聊未读，再开始课程。</p>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{teachers[teacher as keyof typeof teachers].avatar}</span>
            <div>
              <div className="font-semibold text-slate-900">{teachers[teacher as keyof typeof teachers].name}</div>
              <div className="text-sm text-slate-500">在线</div>
            </div>
          </div>
          <select
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
          >
            <option value="kurisu">紅莉栖</option>
            <option value="kousei">公生</option>
            <option value="lena">蕾娜</option>
          </select>
        </div>

        <div className="mb-4 h-96 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-slate-500">课堂对话区（点击开始课程）</p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="mb-2 rounded-lg bg-white p-3 text-sm text-slate-700 shadow-sm">
                {m}
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) {
                setMessages((p) => [...p, `你：${text}`]);
                setText("");
              }
            }}
          />
          <button
            onClick={() => {
              if (!text.trim()) return;
              setMessages((p) => [...p, `你：${text}`]);
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
