# 整合方案 — 网页前端 + OpenClaw 学习系统

## 📋 整合目标

将兵部开发的**网页前端**与工部已完成的**OpenClaw 学习系统**无缝对接，形成完整可用的苏格拉底 AI 家教系统。

---

## 🏛️ 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    网页前端 (Next.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 上课界面  │  │ 微信聊天  │  │ Agent 配置 │  │ Token 统计│ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
└───────┼─────────────┼─────────────┼─────────────┼────────┘
        │             │             │             │
        │ HTTP/WebSocket API        │             │
        ▼             ▼             │             │
┌─────────────────────────────────────────────────────────┐
│              API Gateway (Next.js API Routes)            │
│  ┌─────────────────────────────────────────────────────┐│
│  │  /api/class/*     — 上课相关接口                     ││
│  │  /api/chat/*      — 微信聊天接口                     ││
│  │  /api/agent/*     — Agent 配置接口                   ││
│  │  /api/token/*     — Token 统计接口                   ││
│  │  /api/files/*     — 文件读写接口                     ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
        │
        │ OpenClaw sessions_spawn / sessions_send
        ▼
┌─────────────────────────────────────────────────────────┐
│                    OpenClaw 后端                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │  主 Agent (Master)                                   ││
│  │  ├── 任务分发                                         ││
│  │  ├── 文件管理 (progress/session/review)              ││
│  │  └── 子 Agent 协调                                    ││
│  ├─────────────────────────────────────────────────────┤│
│  │  讲师 Agent (Kurisu/Kousei/Lena)                     ││
│  │  ├── 苏格拉底式教学                                   ││
│  │  └── 角色对话                                        ││
│  ├─────────────────────────────────────────────────────┤│
│  │  课件阅读 Agent (PDF Reader)                         ││
│  │  ├── PDF 读取                                        ││
│  │  └── 内容总结                                        ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
        │
        │ read/write/edit tools
        ▼
┌─────────────────────────────────────────────────────────┐
│                  GitHub 仓库 (状态文件)                    │
│  teacher/runtime/progress.md                            │
│  teacher/runtime/session_log.md                         │
│  teacher/runtime/review_queue.md                        │
│  teacher/runtime/wechat_group.md                        │
│  ...                                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 整合任务清单

### P0 — 核心功能（必须完成）

| 任务 | 说明 | 负责 | 状态 |
|-----|------|------|------|
| **1. API 对接** | 前端调用 OpenClaw 后端接口 | 工部 + 兵部 | ⏳ |
| **2. 认证配置** | API Key 管理 + 环境变量 | 工部 | ⏳ |
| **3. Agent 通信** | 前端 ↔ 主 Agent ↔ 子 Agent | 工部 | ⏳ |

### P1 — 重要功能（应该完成）

| 任务 | 说明 | 负责 | 状态 |
|-----|------|------|------|
| **4. 文件同步** | progress/session 等文件读写 | 工部 | ⏳ |
| **5. 课件读取** | 前端展示 + 后端提取 | 工部 + 翰林院 | ⏳ |
| **6. 部署配置** | Vercel 一键部署 | 工部 | ⏳ |

### P2 — 增强功能（可以完成）

| 任务 | 说明 | 负责 | 状态 |
|-----|------|------|------|
| **7. Token 统计** | 前端图表 + 后端数据 | 工部 + 户部 | ⏳ |

---

## 🔧 技术实现

### 1. API 接口定义

#### 上课接口

```typescript
// POST /api/class/start
// 开始上课
{
  "teacher": "kurisu" | "kousei" | "lena",
  "chapter": "Chapter 21"
}

// POST /api/class/message
// 发送消息
{
  "message": "看看微信",
  "sessionId": "xxx"
}

// GET /api/class/history
// 获取对话历史
{
  "sessionId": "xxx"
}
```

#### 文件接口

```typescript
// GET /api/files/progress
// 获取学习进度

// POST /api/files/update
// 更新状态文件
{
  "file": "progress.md",
  "content": "..."
}
```

#### Agent 接口

```typescript
// POST /api/agent/spawn
// 创建子 Agent
{
  "type": "teacher" | "pdf-reader",
  "config": { ... }
}

// POST /api/agent/send
// 发送消息到 Agent
{
  "agentId": "xxx",
  "message": "..."
}
```

---

### 2. 环境变量配置

```bash
# .env.local
OPENCLAW_API_KEY=sk-xxx
OPENCLAW_MODEL=bailian/qwen3.5-plus
OPENCLAW_WORKSPACE=./teacher

# Vercel 环境变量（生产环境）
# 在 Vercel 控制台设置相同变量
```

---

### 3. 文件同步方案

#### 方案 A：GitHub API（推荐）

```typescript
// lib/github.ts
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export async function readFile(path: string) {
  const { data } = await octokit.repos.getContent({
    owner: 'Jeremy-xuan',
    repo: 'socrates-learning',
    path,
    branch: 'main'
  })
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

export async function writeFile(path: string, content: string, message: string) {
  const { data } = await octokit.repos.getContent({
    owner: 'Jeremy-xuan',
    repo: 'socrates-learning',
    path,
    branch: 'main'
  })
  
  await octokit.repos.createOrUpdateFileContents({
    owner: 'Jeremy-xuan',
    repo: 'socrates-learning',
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha: data.sha,
    branch: 'main'
  })
}
```

#### 方案 B：LocalStorage（离线模式）

```typescript
// lib/storage.ts
export function saveProgress(data: any) {
  localStorage.setItem('socrates-progress', JSON.stringify(data))
}

export function loadProgress() {
  const data = localStorage.getItem('socrates-progress')
  return data ? JSON.parse(data) : null
}
```

---

### 4. 课件读取集成

```typescript
// pages/api/files/pdf.ts
import { read } from '@openclaw/tools'

export default async function handler(req, res) {
  const { path } = req.query
  
  // 检查是否有预转换的 Markdown
  const mdPath = path.replace('.pdf', '.md')
  try {
    const content = await read(mdPath)
    res.json({ content, type: 'markdown' })
  } catch {
    // 如果没有 Markdown，调用课件阅读 Agent
    const summary = await spawnPdfReader(path)
    res.json({ content: summary, type: 'summary' })
  }
}
```

---

### 5. Token 统计

```typescript
// pages/api/token/usage.ts
import { session_status } from '@openclaw/tools'

export default async function handler(req, res) {
  const { sessionId } = req.query
  
  const status = await session_status({ sessionKey: sessionId })
  
  res.json({
    totalTokens: status.usage?.totalTokens || 0,
    inputTokens: status.usage?.inputTokens || 0,
    outputTokens: status.usage?.outputTokens || 0,
    cost: status.cost || 0
  })
}
```

---

## 📅 整合时间线

| 阶段 | 时间 | 任务 | 交付物 |
|-----|------|------|--------|
| **Phase 1** | Day 1-2 | API 接口定义 + 认证配置 | API 文档、环境变量模板 |
| **Phase 2** | Day 3-4 | Agent 通信 + 文件同步 | 上课功能、文件读写 |
| **Phase 3** | Day 5-6 | 课件读取 + Token 统计 | PDF 展示、统计图表 |
| **Phase 4** | Day 7 | 部署配置 + 测试 | Vercel 部署、测试报告 |

---

## ⚠️ 风险与对策

| 风险 | 等级 | 对策 |
|-----|------|------|
| API 调用延迟 | 中 | 添加加载状态、超时重试 |
| GitHub API 限流 | 中 | 使用 LocalStorage 缓存 |
| Agent 状态同步 | 高 | 使用 WebSocket 保持连接 |
| Token 成本超支 | 中 | 设置预算预警 |

---

## 🧪 测试计划

### 单元测试

```bash
# 测试 API 接口
npm test -- api/class.test.ts
npm test -- api/files.test.ts
```

### 集成测试

```bash
# 测试完整流程
npm run test:integration
```

### 端到端测试

```bash
# 使用 Playwright 测试
npm run test:e2e
```

---

## 📊 验收标准

| 功能 | 验收标准 | 状态 |
|-----|---------|------|
| 上课功能 | 能与 AI 老师正常对话 | ⏳ |
| 微信聊天 | 能查看和回复群消息 | ⏳ |
| Agent 配置 | 能切换老师角色 | ⏳ |
| Token 统计 | 能显示消耗数据 | ⏳ |
| 课件读取 | 能查看 PDF 内容 | ⏳ |
| 部署上线 | Vercel 一键部署成功 | ⏳ |

---

**负责人：** 工部尚书
**创建时间：** 2026-03-17
**最后更新：** 2026-03-17
