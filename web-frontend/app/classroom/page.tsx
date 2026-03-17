"use client";

import { useState } from "react";
import { Send, User, Sparkles } from "lucide-react";
import clsx from "clsx";

type Teacher = "kurisu" | "kousei" | "lena";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  teacher?: Teacher;
}

const teachers = [
  { id: "kurisu" as const, name: "紅莉栖", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  { id: "kousei" as const, name: "公生", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "lena" as const, name: "蕾娜", color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
];

export default function ClassroomPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好，我是紅莉栖。今天我们要学习电场的基本概念。\n\n*用指尖敲了两下桌面* \"你学过万有引力，对吧？\"\n\n那么，我问你：如果把其中一个物体拿走，剩下那个物体周围，还有什么吗？",
      timestamp: new Date(),
      teacher: "kurisu",
    },
  ]);
  const [input, setInput] = useState("");
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>("kurisu");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call the API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "你刚才那个问题……不是一般人会问的。\n\n*把头发拨到耳后* \"别误会，我不是在夸你。不过，这个思路是对的。\"\n\n让我们继续。你觉得，为什么两个电荷之间会有力？",
        timestamp: new Date(),
        teacher: currentTeacher,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const currentTeacherInfo = teachers.find((t) => t.id === currentTeacher);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            上课界面
          </h1>
          <p className="text-gray-600 dark:text-gray-400">当前章节：U1-03 电场</p>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            选择老师：
          </label>
          <select
            value={currentTeacher}
            onChange={(e) => setCurrentTeacher(e.target.value as Teacher)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          >
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>学习进度</span>
          <span>U1-03 80%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-500 rounded-full transition-all"
            style={{ width: "80%" }}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === "user"
                    ? "bg-gray-300 dark:bg-gray-600"
                    : currentTeacherInfo?.bg
                )}
              >
                {msg.role === "user" ? (
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sparkles className={clsx("w-5 h-5", currentTeacherInfo?.color)} />
                )}
              </div>
              <div
                className={clsx(
                  "max-w-[70%] rounded-xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                )}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
                <div className="text-xs mt-2 opacity-70">
                  {msg.timestamp.toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center", currentTeacherInfo?.bg)}>
                <Sparkles className={clsx("w-5 h-5 animate-pulse", currentTeacherInfo?.color)} />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
            换老师
          </button>
          <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
            看看微信
          </button>
          <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
            今天到这
          </button>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入你的回答或问题..."
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}