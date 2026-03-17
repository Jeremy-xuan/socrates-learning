# OpenClaw 迁移包

本目录包含从 ClaudeCode 迁移到 OpenClaw 所需的全部配置和文档。

---

## 📦 文件清单

| 文件 | 说明 |
|-----|------|
| `system_prompt.md` | OpenClaw 系统 Prompt（核心教学逻辑） |
| `MIGRATION_CHECKLIST.md` | 迁移进度检查清单 |
| `README.md` | 本文件 |

---

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/Jeremy-xuan/socrates-learning.git
cd socrates-learning
```

### 2. 切换到迁移分支

```bash
git checkout migration/openclaw
```

### 3. 在 OpenClaw 中启动

在 Discord 命令频道中发送：

```
/sessions_spawn task="启动苏格拉底物理家教系统，读取 openclaw/system_prompt.md" runtime="subagent" mode="session"
```

---

## 📋 核心变更

### ClaudeCode → OpenClaw 工具映射

| 原功能 | OpenClaw 替代 |
|-------|-------------|
| 文件读取 | `read` tool |
| 文件写入 | `write` tool |
| 文件编辑 | `edit` tool |
| 子 Agent | `sessions_spawn` |
| PDF 读取 | `browser` + `web_fetch` |
| 命令行 | `exec` |

### 部署方式

- **原方案：** ClaudeCode Desktop + 本地文件
- **新方案：** Vercel 部署 + GitHub 仓库存储状态

### 成本对比

| 项目 | ClaudeCode | OpenClaw |
|-----|-----------|---------|
| 月成本 | ~$20+ | $0 |
| 部署 | 本地 | Vercel 免费层 |
| 状态存储 | 本地文件 | GitHub 仓库 |

---

## 🔧 配置说明

### 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

填写必要的环境变量（通常使用 OpenClaw 默认配置即可）。

### Vercel 部署

1. 在 Vercel 导入 GitHub 仓库
2. 设置项目根目录为 `socrates-learning`
3. 无需构建命令（静态文件）
4. 设置环境变量（参考 `.env.example`）

---

## 📚 课件处理

### 方案 A：预转换（推荐）

使用 `convert_pdfs.py` 批量转换 PDF 为 Markdown：

```bash
python convert_pdfs.py
```

转换后的 Markdown 文件存于 `materials/` 目录，可直接用 `read` 工具读取。

### 方案 B：运行时转换

使用 OpenClaw `exec` 工具调用转换脚本，按需转换。

---

## 🆘 故障排查

### 问题：找不到进度文件

确保 `teacher/runtime/progress.md` 存在。如不存在，创建一个空的：

```markdown
# 学习进度

待开始
```

### 问题：角色人格不鲜明

检查 `teacher/characters/*.md` 是否包含完整的角色设定，特别是：
- 说话方式
- 小动作列表
- 对学习者的态度
- 她/他记得的事

### 问题：Context 超限

使用分步读取策略：
1. 先读核心文件（system.md, progress.md）
2. 按需读取教材章节
3. 用到时再读历史文件

---

## 📞 联系

- **项目地址：** https://github.com/Jeremy-xuan/socrates-learning
- **迁移分支：** `migration/openclaw`
- **问题反馈：** 在 GitHub 开 Issue

---

**迁移负责人：** 工部尚书
**最后更新：** 2026-03-17
