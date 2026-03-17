"use client";

import { useState } from "react";

export default function ClassroomPage() {
  const [teacher, setTeacher] = useState("kurisu");
  const [text, setText] = useState("");

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h2 className="text-xl font-semibold">上课界面</h2>
        <p className="mt-1 text-sm text-slate-600">先同步群聊未读，再开始课程。</p>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm text-slate-600">选择老师</label>
          <select value={teacher} onChange={(e)=>setTeacher(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="kurisu">紅莉栖</option>
            <option value="kousei">公生</option>
            <option value="lena">蕾娜</option>
          </select>
        </div>
        <div className="h-80 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">课堂对话区（待接入实时会话）</div>
        <div className="mt-3 flex gap-2">
          <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="输入你的问题…" className="flex-1 rounded-lg border border-slate-300 px-3 py-2"/>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">发送</button>
        </div>
      </div>
    </div>
  );
}
