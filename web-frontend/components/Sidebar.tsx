"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, MessageCircle, Settings, BarChart3, Key, Home } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", icon: Home, label: "首页" },
  { href: "/classroom", icon: BookOpen, label: "上课界面" },
  { href: "/chat", icon: MessageCircle, label: "微信群聊" },
  { href: "/settings", icon: Settings, label: "Agent配置" },
  { href: "/analytics", icon: BarChart3, label: "Token统计" },
  { href: "/config", icon: Key, label: "API配置" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          🎓 苏格拉底
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          AP Physics C: EM
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>当前版本: v1.0.0</p>
          <p className="mt-1">OpenClaw 驱动</p>
        </div>
      </div>
    </aside>
  );
}