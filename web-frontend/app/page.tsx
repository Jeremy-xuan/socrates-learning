import Link from "next/link";

const stats = [
  ["题目总数", "222"],
  ["完整题目", "153"],
  ["当前单元", "Ch.22"],
  ["正确率", "92%"],
] as const;

const modules = [
  ["/classroom", "📖 上课界面", "苏格拉底式对话学习，与 AI 老师互动"],
  ["/materials", "📚 题目索引", "按单元与知识点筛题，精准练习"],
  ["/dashboard", "📊 学习仪表盘", "进度、错题、趋势一目了然"],
  ["/chat", "💬 四重奏群聊", "老师协同讨论与同步"],
  ["/settings", "⚙️ 角色配置", "教师提示词与参数设置"],
  ["/analytics", "📈 统计分析", "Token 与学习行为统计"],
  ["/config", "🔌 API 配置", "模型与网关配置"],
] as const;

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h2 className="text-3xl font-bold text-slate-900">欢迎回来</h2>
        <p className="mt-2 text-slate-600">继续你的 AP Physics C 电磁学学习之旅。</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="card p-6">
            <div className="text-sm font-medium text-slate-500">{k}</div>
            <div className="mt-2 text-3xl font-bold text-blue-700">{v}</div>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">快速入口</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map(([href, title, desc]) => (
            <Link
              key={href}
              href={href}
              className="card p-6 transition hover:border-blue-300 hover:shadow-lg"
            >
              <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
              <p className="mt-1 text-sm text-slate-600">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
