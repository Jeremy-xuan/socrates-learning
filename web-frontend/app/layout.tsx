import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "苏格拉底学习系统",
  description: "AP Physics C: EM 苏格拉底式AI家教",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}