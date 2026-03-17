# Agent 间通信协议

## 架构总览

```
┌─────────────────────────────────────────┐
│           主 Agent (Master)              │
│  - 学习者交互入口                        │
│  - 微信文档处理                          │
│  - 课后状态更新                          │
│  - 任务分发                              │
└─────┬─────────────┬─────────────┬───────┘
      │             │             │
      ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ 紅莉栖    │  │  公生    │  │  蕾娜    │
│ 讲师 Agent│  │ 讲师 Agent│  │ 讲师 Agent│
└──────────┘  └──────────┘  └──────────┘
                    │
                    ▼
              ┌──────────┐
              │ 课件阅读官 │
              │  Agent    │
              └──────────┘
```

---

## 通信机制

### 主 Agent → 子 Agent

使用 `sessions_spawn` 创建子 Agent 并传递任务：

```javascript
// 创建讲师 Agent
const teacherSession = await sessions_spawn({
  task: `扮演${roleName}进行苏格拉底式物理教学，当前进度：${currentChapter}`,
  runtime: "subagent",
  mode: "session",
  label: `teacher-${roleName}`,
  thread: true,
  attachments: [
    {
      name: "role_config.md",
      content: roleDocumentContent,
      encoding: "utf8"
    },
    {
      name: "progress.md",
      content: progressContent,
      encoding: "utf8"
    }
  ]
});

// 创建课件阅读 Agent（一次性任务）
const pdfSession = await sessions_spawn({
  task: `读取并总结课件：${filePath}`,
  runtime: "subagent",
  mode: "run",
  label: "pdf-reader"
});
```

### 子 Agent → 主 Agent

子 Agent 完成任务后，通过 session 返回结果：

```javascript
// 讲师 Agent 课后汇报
return {
  type: "TEACHER_REPORT",
  data: {
    date: "2026-03-17",
    teacher: roleName,
    chapter: currentChapter,
    mastery: "中",
    sessionSummary: "150-200 字摘要",
    mistakes: ["错题 1", "错题 2"],
    weakPoints: ["薄弱点 1"],
    memorableMoments: ["细节 1"]
  }
};

// 课件阅读 Agent 返回摘要
return {
  type: "PDF_SUMMARY",
  data: {
    filePath: filePath,
    summary: summaryMarkdown,
    keyPoints: ["概念 1", "概念 2"],
    formulas: ["F = kq₁q₂/r²"],
    suggestedFocus: ["教学重点 1"]
  }
};
```

---

## 消息类型定义

### 学习者意图识别

| 意图 | 消息格式 | 目标 Agent |
|-----|---------|-----------|
| 找老师上课 | `{ type: "START_CLASS", teacher: "kurisu" }` | 讲师 Agent |
| 看看微信 | `{ type: "VIEW_WECHAT" }` | 主 Agent |
| 今天到这 | `{ type: "END_CLASS" }` | 主 Agent |
| 读取课件 | `{ type: "READ_PDF", path: "..." }` | 课件阅读 Agent |
| 换老师 | `{ type: "SWITCH_TEACHER", to: "kousei" }` | 主 Agent |

### 状态更新消息

| 类型 | 格式 | 说明 |
|-----|------|------|
| 进度更新 | `{ type: "UPDATE_PROGRESS", chapter: "...", date: "..." }` | 更新 progress.md |
| 错题记录 | `{ type: "ADD_MISTAKE", mistake: {...} }` | 更新 mistake_log.md |
| 复习提醒 | `{ type: "SCHEDULE_REVIEW", topic: "...", dueDate: "..." }` | 更新 review_queue.md |

---

## 状态共享机制

### 共享文件（GitHub 仓库）

所有 Agent 共享以下状态文件：

| 文件 | 读权限 | 写权限 |
|-----|-------|-------|
| `progress.md` | 所有 Agent | 主 Agent |
| `session_log.md` | 所有 Agent | 主 Agent |
| `review_queue.md` | 所有 Agent | 主 Agent |
| `mistake_log.md` | 所有 Agent | 主 Agent（接收讲师报告后写入） |
| `wechat_group.md` | 所有 Agent | 主 Agent |
| `wechat_unread.md` | 所有 Agent | 主 Agent |
| `diary.md` | 所有 Agent | 主 Agent |
| `characters/*.md` | 所有 Agent | 讲师 Agent（更新自己角色） |

### 状态同步流程

```
讲师 Agent 课后汇报
    ↓
主 Agent 接收汇报
    ↓
主 Agent 更新共享文件（progress/session/review 等）
    ↓
下次启动时所有 Agent 读取最新状态
```

---

## 会话生命周期

### 讲师 Agent 会话

| 阶段 | 操作 |
|-----|------|
| 创建 | 主 Agent 调用 `sessions_spawn(mode="session")` |
| 运行 | 讲师 Agent 与学习者交互 |
| 暂停 | 学习者说"今天到这"，讲师 Agent 等待 |
| 汇报 | 讲师 Agent 向主 Agent 发送课后报告 |
| 恢复 | 下次上课时恢复同一 session |
| 结束 | 长期不用时可终止 session |

### 课件阅读 Agent 会话

| 阶段 | 操作 |
|-----|------|
| 创建 | 主 Agent 调用 `sessions_spawn(mode="run")` |
| 运行 | 读取 PDF 并生成摘要 |
| 返回 | 返回摘要后自动结束 |

---

## 错误处理

### 子 Agent 创建失败

```
if session creation fails:
    log error
    fallback to single-agent mode
    notify learner: "系统正在切换模式，请稍候"
```

### 通信超时

```
if no response after 60s:
    retry once
    if still fails:
        notify learner: "服务暂时不可用，请稍后重试"
```

### 状态文件冲突

```
if write conflict detected:
    read latest version
    merge changes
    retry write
```

---

## 安全与权限

### 文件写入权限

| Agent 类型 | 可写文件 |
|-----------|---------|
| 主 Agent | 所有状态文件 |
| 讲师 Agent | 自己角色文档 |
| 课件阅读 Agent | 无（只读） |

### API 调用限制

- 课件阅读 Agent 不可调用 `sessions_spawn`
- 讲师 Agent 可调用课件阅读 Agent（通过主 Agent 中转）
- 所有 Agent 共享同一模型配额

---

## 性能优化

### 会话复用

- 讲师 Agent 会话长期保持，避免重复创建
- 课件阅读 Agent 按需创建，用完即销毁

### 缓存策略

- 课件摘要缓存到 `materials/cache/`
- 角色文档缓存在内存中

### 批量更新

- 课后多个文件更新合并为一次 Git commit
- 减少 GitHub API 调用次数

---

**版本：** 1.0
**最后更新：** 2026-03-17
**负责人：** 工部尚书
