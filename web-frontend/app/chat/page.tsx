"use client";

import { useState } from "react";
import { Send, Image, MoreHorizontal } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "kurisu" | "kousei" | "lena" | "user";
  content: string;
  timestamp: string;
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "kurisu",
    content: "那道题你想清楚了吗？",
    timestamp: "10:30",
  },
  {
    id: "2",
    sender: "kousei",
    content: "她说得对，要仔细分析受力情况",
    timestamp: "10:32",
  },
  {
    id: "3",
    sender: "lena",
    content: "加油~",
    timestamp: "10:35",
  },
  {
    id: "4",
    sender: "kurisu",
    content: "他今天状态还可以，比昨天专注",
    timestamp: "10:36",
  },
  {
    id: "5",
    sender: "kousei",
    content: "嗯，电场强度那部分理解得不错",
    timestamp: "10:38",
  },
  {
    id: "6",
    sender: "lena",
    content: "高斯定律那块别急，慢慢来",
    timestamp: "10:40",
  },
];

const senderInfo = {
  kurisu: { name: "紅莉栖", avatar: "🟣", color: "text-purple-500" },
  kousei: { name: "公生", avatar: "🔵", color: "text-blue-500" },
  lena: { name: "蕾娜", avatar: "🟢", color: "text-green-500" },
  user: { name: "你", avatar: "🟡", color: "text-yellow-500" },
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">四重奏</h1>
        <p className="text-gray-600 dark:text-gray-400">群聊</p>
      </header>

      {/* Chat Container */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              四重奏
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
              <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
              <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center text-sm text-gray-400 py-2">
            3月17日
          </div>

          {messages.map((msg) => {
            const info = senderInfo[msg.sender];
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-lg">
                    {info.avatar}
                  </div>
                )}
                <div
                  className={`max-w-[70%] ${isUser ? "text-right" : ""}`}
                >
                  {!isUser && (
                    <div
                      className={`text-xs mb-1 ${info.color}`}
                    >
                      {info.name}
                    </div>
                  )}
                  <div
                    className={`inline-block px-3 py-2 rounded-lg ${
                      isUser
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
              <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入消息..."
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}