import Link from "next/link";
import { BookOpen, MessageCircle, Settings, BarChart3, Key } from "lucide-react";

const modules = [
  {
    id: "classroom",
    name: "上课界面",
    description: "苏格拉底式对话教学",
    icon: BookOpen,
    href: "/classroom",
    color: "bg-blue-500",
  },
  {
    id: "chat",
    name: "微信群聊",
    description: "\"四重奏\"群聊互动",
    icon: MessageCircle,
    href: "/chat",
    color: "bg-green-500",
  },
  {
    id: "settings",
    name: "Agent配置",
    description: "系统设定与角色管理",
    icon: Settings,
    href: "/settings",
    color: "bg-purple-500",
  },
  {
    id: "analytics",
    name: "Token统计",
    description: "API消耗与成本追踪",
    icon: BarChart3,
    href: "/analytics",
    color: "bg-orange-500",
  },
  {
    id: "config",
    name: "API配置",
    description: "大模型API Key管理",
    icon: Key,
    href: "/config",
    color: "bg-red-500",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          苏格拉底学习系统
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AP Physics C: Electricity & Magnetism AI家教
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          功能模块
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {module.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
          快速开始
        </h3>
        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>首先在 <strong>API配置</strong> 页面设置你的大模型 API Key</li>
          <li>进入 <strong>上课界面</strong> 选择老师开始学习</li>
          <li>课后可在 <strong>微信群聊</strong> 查看老师们的闲聊</li>
          <li>通过 <strong>Token统计</strong> 监控API消耗</li>
        </ol>
      </section>
    </div>
  );
}