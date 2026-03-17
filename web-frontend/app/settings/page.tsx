"use client";

import { useState } from "react";
import { Save, User, Bot, BookOpen, Clock } from "lucide-react";

const tabs = [
  { id: "profile", label: "学习者", icon: User },
  { id: "system", label: "系统设定", icon: Bot },
  { id: "characters", label: "角色管理", icon: BookOpen },
  { id: "schedule", label: "复习策略", icon: Clock },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "宇轩",
    grade: "11",
    target: "AP Physics C: EM 5分",
    learningStyle: "视觉型",
  });

  const [systemPrompt, setSystemPrompt] = useState(
    "你是一个苏格拉底式家教系统，专门教授 AP Physics C: Electricity & Magnetism..."
  );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Agent配置
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          定制系统背景、学习者信息和角色设定
        </p>
      </header>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                学习者档案
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    年级
                  </label>
                  <select
                    value={profile.grade}
                    onChange={(e) =>
                      setProfile({ ...profile, grade: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="9">9年级</option>
                    <option value="10">10年级</option>
                    <option value="11">11年级</option>
                    <option value="12">12年级</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学习目标
                  </label>
                  <input
                    type="text"
                    value={profile.target}
                    onChange={(e) =>
                      setProfile({ ...profile, target: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学习风格
                  </label>
                  <select
                    value={profile.learningStyle}
                    onChange={(e) =>
                      setProfile({ ...profile, learningStyle: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="视觉型">视觉型</option>
                    <option value="听觉型">听觉型</option>
                    <option value="动手型">动手型</option>
                  </select>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
                <Save className="w-4 h-4" />
                保存修改
              </button>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                系统设定
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Prompt
                </label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                />
                <p className="mt-2 text-sm text-gray-500">
                  定义AI助手的核心行为和教学理念
                </p>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
                <Save className="w-4 h-4" />
                保存修改
              </button>
            </div>
          )}

          {activeTab === "characters" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                角色管理
              </h2>

              <div className="space-y-4">
                {[
                  {
                    id: "kurisu",
                    name: "紅莉栖",
                    desc: "傲娇天才物理学家",
                    color: "bg-purple-100 dark:bg-purple-900/30",
                    text: "text-purple-500",
                  },
                  {
                    id: "kousei",
                    name: "公生",
                    desc: "温柔天才钢琴少年",
                    color: "bg-blue-100 dark:bg-blue-900/30",
                    text: "text-blue-500",
                  },
                  {
                    id: "lena",
                    name: "蕾娜",
                    desc: "冷静俄国物理学家",
                    color: "bg-green-100 dark:bg-green-900/30",
                    text: "text-green-500",
                  },
                ].map((char) => (
                  <div
                    key={char.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full ${char.color} flex items-center justify-center`}
                      >
                        <span className="text-2xl">
                          {char.id === "kurisu"
                            ? "🟣"
                            : char.id === "kousei"
                            ? "🔵"
                            : "🟢"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {char.name}
                        </div>
                        <div className="text-sm text-gray-500">{char.desc}</div>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 ${char.text} border border-current rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600`}
                    >
                      编辑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                复习策略
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    首次复习间隔（天）
                  </label>
                  <input
                    type="number"
                    defaultValue={2}
                    className="w-32 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    复习次数达到掌握
                  </label>
                  <input
                    type="number"
                    defaultValue={4}
                    className="w-32 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoReview"
                    defaultChecked
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <label
                    htmlFor="autoReview"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    启用自动复习提醒
                  </label>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
                <Save className="w-4 h-4" />
                保存修改
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}