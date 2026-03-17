# OPENCLAW.md — AP Physics C: EM 苏格拉底家教系统 (OpenClaw 版)

> OpenClaw 替代 ClaudeCode 的启动入口文件

---

## 🚀 快速启动

### 方式一：Discord 频道启动（推荐）

在 Discord 命令频道中：

```
/sessions_spawn task="启动苏格拉底物理家教系统" runtime="subagent" mode="session"
```

### 方式二：本地 Session 启动

```bash
# 克隆仓库后，在 workspace 中运行
cd socrates-learning
# OpenClaw 会自动读取本目录下的配置
```

---

## 📋 OpenClaw 工具映射

| ClaudeCode 功能 | OpenClaw 替代工具 |
|----------------|------------------|
| 文件读取 | `read` tool |
| 文件写入 | `write` tool |
| 文件编辑 | `edit` tool |
| 子 Agent 创建 | `sessions_spawn` |
| 网页/PDF 读取 | `browser` + `web_fetch` |
| 命令行执行 | `exec` |

---

## 🏗️ 启动流程

### 第一步：加载核心配置（必须）

使用 `read` 工具按顺序读取：

1. `teacher/config/system.md` — 系统总指令
2. `teacher/story.md` — 故事背景
3. `teacher/config/learner_profile.md` — 学习者档案
4. `teacher/runtime/progress.md` — 当前学习进度

### 第二步：按需加载

5. `teacher/runtime/review_queue.md` — 检查复习队列
6. `teacher/characters/*.md` — 当课老师角色文档
7. 对应教材章节

### 第三步：进入教学模式

读取完成后，按 `system.md` 中的苏格拉底教学法开始教学。

---

## 📦 文件存储方案

所有状态文件存储于 GitHub 仓库，通过 OpenClaw `read`/`write` 工具管理：

| 文件 | 用途 | 更新时机 |
|------|------|---------|
| `teacher/runtime/progress.md` | 学习进度 | 每课后 |
| `teacher/runtime/session_log.md` | 课堂摘要 | 每课后 |
| `teacher/runtime/review_queue.md` | 复习队列 | 每课后 |
| `teacher/runtime/mistake_log.md` | 错题本 | 答错时 |
| `teacher/runtime/diary.md` | 每日日记 | 每晚 9:30 后 |
| `teacher/runtime/wechat_group.md` | 群聊记录 | 查看微信时 |
| `teacher/runtime/wechat_unread.md` | 未读消息 | 每课后生成 |

---

## 🎭 角色切换

学习者可以说：
- "找紅莉栖上课" → 加载 `teacher/characters/kurisu.md`
- "找公生上课" → 加载 `teacher/characters/kousei.md`
- "找蕾娜上课" → 加载 `teacher/characters/lena.md`

---

## 📚 课件读取

### 方案 A：预转换 Markdown（推荐）

PDF 已预先转换为 Markdown，存于 `materials/` 目录下，直接用 `read` 工具读取。

### 方案 B：运行时转换

使用 `exec` 调用 `convert_pdfs.py` 脚本：

```bash
python convert_pdfs.py materials/textbook/XX_Chapter.pdf
```

---

## 🔧 部署配置

### Vercel 部署

1. 连接 GitHub 仓库
2. 设置环境变量（见 `.env.example`）
3. Git Push 自动部署

### 本地运行

```bash
# 确保 OpenClaw 已安装
openclaw status

# 在 workspace 中启动 session
openclaw session start socrates-learning
```

---

## ⚙️ 环境变量

| 变量名 | 说明 | 默认值 |
|-------|------|-------|
| `OPENCLAW_MODEL` | 使用的模型 | `bailian/qwen3.5-plus` |
| `OPENCLAW_WORKSPACE` | 工作目录 | `./teacher` |
| `BAILIAN_API_KEY` | 百炼 API Key | (从 OpenClaw 配置读取) |

---

## 📅 迁移进度

- [x] 系统 Prompt 转换
- [x] 角色配置迁移
- [x] 文件读写逻辑
- [x] 部署配置
- [ ] 课件 Markdown 转换
- [ ] 完整测试验收

---

## 🆘 故障排查

### 问题：文件读取失败

检查文件路径是否正确，确保在 `teacher/` 目录下。

### 问题：角色人格不鲜明

检查 `teacher/characters/*.md` 是否完整加载，确保 system prompt 中角色规则生效。

### 问题：Context 超限

使用分步读取策略，按需加载文件，避免一次性读取所有内容。

---

**项目地址：** https://github.com/Jeremy-xuan/socrates-learning

**迁移分支：** `migration/openclaw`
