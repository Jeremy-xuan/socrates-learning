# Vercel 部署指南

## 🚀 快速部署

### 方式一：一键部署（推荐）

1. 点击以下按钮导入到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?c=1&s=https://github.com/Jeremy-xuan/socrates-learning/tree/migration/openclaw/web-frontend)

2. 设置环境变量（见下方）
3. 点击 Deploy

---

### 方式二：手动部署

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 进入项目目录
cd web-frontend

# 4. 部署
vercel --prod
```

---

## ⚙️ 环境变量配置

### 必需环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|-------|-----|------|
| `GITHUB_TOKEN` | `ghp_xxx` | GitHub Personal Access Token |
| `GITHUB_OWNER` | `Jeremy-xuan` | GitHub 用户名 |
| `GITHUB_REPO` | `socrates-learning` | 仓库名 |
| `GITHUB_BRANCH` | `main` | 分支名 |
| `OPENCLAW_MODEL` | `bailian/qwen3.5-plus` | 使用的模型 |
| `OPENCLAW_WORKSPACE` | `./teacher` | 工作目录 |

### 可选环境变量

| 变量名 | 默认值 | 说明 |
|-------|-------|------|
| `TOKEN_BUDGET_LIMIT` | `50` | 月度 Token 预算（美元） |
| `SESSION_TIMEOUT` | `3600` | 会话超时时间（秒） |

---

## 📊 部署后验证

### 1. 检查首页

访问 `https://your-app.vercel.app`

应显示：
- ✅ 仪表盘
- ✅ 上课入口
- ✅ 功能模块导航

### 2. 测试上课功能

1. 点击"开始上课"
2. 选择老师（紅莉栖/公生/蕾娜）
3. 发送消息测试对话

### 3. 测试文件同步

1. 进入"学习进度"页面
2. 查看 progress.md 内容
3. 确认与 GitHub 仓库一致

### 4. 测试 Token 统计

1. 进入"Token 统计"页面
2. 查看当前用量
3. 确认数据准确

---

## ⚠️ 常见问题

### 问题 1：GitHub API 限流

**症状：** 文件读取失败，提示 rate limit

**解决：**
1. 确保 GITHUB_TOKEN 已正确设置
2. 考虑升级到 GitHub Pro（增加限流）
3. 或使用 LocalStorage 缓存

### 问题 2：OpenClaw 连接失败

**症状：** Agent 通信超时

**解决：**
1. 检查 OPENCLAW_MODEL 是否正确
2. 确认 API Key 有效
3. 检查网络连接

### 问题 3：Vercel 构建失败

**症状：** 构建时报错

**解决：**
```bash
# 本地测试构建
npm run build

# 检查 Node 版本
node --version  # 应为 18+
```

---

## 📈 性能优化

### 1. 启用 Edge Functions

```json
// vercel.json
{
  "functions": {
    "pages/api/**/*.ts": {
      "runtime": "@vercel/edge"
    }
  }
}
```

### 2. 配置缓存

```typescript
// pages/api/files/read.ts
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
```

### 3. 图片优化

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['github.com'],
  },
}
```

---

## 🔒 安全建议

1. **不要提交 .env.local** — 已添加到 .gitignore
2. **使用 Vercel 环境变量** — 不要硬编码敏感信息
3. **启用 GitHub 2FA** — 保护仓库安全
4. **定期轮换 API Key** — 建议每月更换

---

## 📞 联系支持

- **Vercel 文档：** https://vercel.com/docs
- **Next.js 文档：** https://nextjs.org/docs
- **项目 Issue：** https://github.com/Jeremy-xuan/socrates-learning/issues

---

**负责人：** 工部尚书
**最后更新：** 2026-03-17
