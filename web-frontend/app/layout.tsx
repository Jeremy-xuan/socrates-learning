import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "苏格拉底学习系统",
  description: "AP Physics C: EM AI 家教",
};

const nav = [
  ["/", "首页"],
  ["/classroom", "上课"],
  ["/materials", "题目"],
  ["/dashboard", "进度"],
  ["/chat", "群聊"],
  ["/settings", "配置"],
  ["/analytics", "统计"],
  ["/config", "API"],
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-slate-50 text-slate-800 antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <h1 className="text-lg font-semibold text-blue-700">苏格拉底学习系统</h1>
            </Link>
            <nav className="flex flex-wrap gap-1">
              {nav.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
