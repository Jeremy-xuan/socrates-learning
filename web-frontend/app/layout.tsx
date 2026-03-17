import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "苏格拉底学习系统", description: "AP Physics C: EM AI家教" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <nav className="bg-[#1E3A5F] text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">苏格拉底学习系统</h1>
            <div className="flex gap-4">
              <a href="/classroom" className="hover:underline">上课</a>
              <a href="/chat" className="hover:underline">群聊</a>
              <a href="/settings" className="hover:underline">配置</a>
              <a href="/analytics" className="hover:underline">统计</a>
              <a href="/config" className="hover:underline">API</a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}