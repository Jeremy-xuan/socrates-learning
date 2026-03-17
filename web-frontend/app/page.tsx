import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">欢迎使用苏格拉底学习系统</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          ["上课", "/classroom", "📚", "bg-blue-500"],
          ["群聊", "/chat", "💬", "bg-green-500"],
          ["配置", "/settings", "⚙️", "bg-purple-500"],
          ["统计", "/analytics", "📊", "bg-orange-500"],
          ["API", "/config", "🔑", "bg-red-500"]
        ].map(([name, href, icon, color]) => (
          <Link key={href} href={href} className={`block p-6 ${color} text-white rounded-lg hover:opacity-90`}>
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-xl font-bold">{name}界面</div>
          </Link>
        ))}
      </div>
    </div>
  );
}