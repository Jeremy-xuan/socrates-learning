import Link from "next/link";

const stats = [
  ["题目总数", "222"],
  ["完整题目", "153"],
  ["当前单元", "Ch.22"],
  ["正确率", "92%"],
] as const;

const modules = [
  ["/classroom", "上课界面", "苏格拉底式对话学习"],
  ["/materials", "题目索引", "按单元与知识点筛题"],
  ["/dashboard", "学习仪表盘", "进度、错题、趋势"],
  ["/chat", "四重奏群聊", "老师协同讨论与同步"],
  ["/settings", "角色配置", "教师提示词与参数"],
  ["/analytics", "统计分析", "Token 与学习行为统计"],
  ["/config", "API 配置", "模型与网关配置"],
] as const;

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="text-2xl font-semibold text-slate-900">现代简约版学习主页</h2>
        <p className="mt-2 text-slate-600">蓝白主色，信息优先，减少视觉噪声。</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="card p-5">
            <div className="text-sm text-slate-500">{k}</div>
            <div className="mt-2 text-2xl font-semibold text-blue-700">{v}</div>
          </div>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map(([href, title, desc]) => (
          <Link key={href} href={href} className="card p-5 transition hover:border-blue-300 hover:shadow-md">
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
