# 苏格拉底教学系统 - OpenClaw 多Agent架构

## 系统架构

```
┌─────────────────────────────────────────┐
│           主 Agent (Master)              │
│  ┌─────────────────────────────────┐    │
│  │  - 微信文档处理                  │    │
│  │  - 课后状态更新                  │    │
│  │  - 任务分发                      │    │
│  │  - 学习者交互入口                 │    │
│  └─────────────────────────────────┘    │
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

## Agent 职责

### 主 Agent（Master）

**职责：**
- 接收学习者输入
- 判断意图：教学/查看微信/换老师/结束课程
- 分发给对应子 Agent
- 处理微信文档（wechat_group.md / wechat_unread.md）
- 课后状态更新（progress / session_log / review_queue 等）
- 管理会话状态

**系统 Prompt：** `system_prompt_master.md`

### 讲师 Agent（Teacher Agents）

三个独立的子 Agent，分别代表三位老师：

| Agent | 角色 | 启动方式 |
|-------|------|---------|
| `teacher_kurisu` | 紅莉栖 | sessions_spawn |
| `teacher_kousei` | 公生 | sessions_spawn |
| `teacher_lena` | 蕾娜 | sessions_spawn |

**职责：**
- 苏格拉底式教学（不直接给答案，通过提问引导）
- 维护角色性格（傲娇/温柔/冷静）
- 记录课堂要点
- 向主 Agent 报告课后更新数据

**配置：** `agents/teachers/kurisu.md` 等

### 课件阅读 Agent（Materials Agent）

**职责：**
- 读取 PDF 课件内容
- 提取关键知识点
- 总结章节要点供讲师使用
- 支持按知识点搜索

**启动方式：** `sessions_spawn(agentId="materials_reader")`

**配置：** `agents/materials_reader.md`

---

## Agent 间通信协议

### 主 Agent → 讲师 Agent

```json
{
  "action": "start_teaching",
  "topic": "电场概念",
  "chapter": "U1-03",
  "materials": "U1-Electrostatics/lecture03.md",
  "review_items": ["电场强度", "高斯定律"]
}
```

### 讲师 Agent → 主 Agent

```json
{
  "action": "class_finished",
  "summary": "课堂摘要...",
  "progress": "U1-03 完成 80%",
  "mistakes": ["计算错误-单位"],
  "new_review_items": ["电场叠加原理"]
}
```

### 主 Agent → 课件阅读 Agent

```json
{
  "action": "read_materials",
  "source": "U1-Electrostatics/lecture03.pdf",
  "purpose": "教学准备"
}
```

---

## 启动命令示例

### 启动教学会话

```
学习者：我想上课
主Agent：好的，你想跟哪位老师学习？
学习者：紅莉栖
主Agent：→ sessions_spawn(teacher_kurisu)
```

### 查看微信

```
学习者：看看微信
主Agent：→ read(teacher/runtime/wechat_unread.md)
展示未读消息
```

### 结束课程

```
学习者：今天到这
讲师Agent：→ 向主Agent报告课堂数据
主Agent：→ 更新 progress.md / session_log.md / review_queue.md
```

---

## 文件结构

```
socrates-learning/
├── OPENCLAW.md                 # 入口文档
├── agents/
│   ├── master.md              # 主 Agent 配置
│   ├── teachers/
│   │   ├── kurisu.md          # 紅莉栖 Agent
│   │   ├── kousei.md          # 公生 Agent
│   │   └── lena.md            # 蕾娜 Agent
│   └── materials_reader.md    # 课件阅读 Agent
├── system_prompt/
│   ├── master.md              # 主 Agent 系统指令
│   └── workflow.md            # 工作流定义
└── teacher/runtime/           # 状态文件
```

---

## 使用方式

### 方式一：直接启动 Master Agent

```bash
sessions_spawn(
  agentId="socrates_master",
  task="与学习者对话，执行教学或处理请求"
)
```

### 方式二：通过司礼监调度

1. 学习者在 Discord 发起请求
2. 司礼监调度到对应 Agent
3. 子 Agent 执行完成后汇报

---

## 状态管理

所有状态文件存储在 GitHub：`teacher/runtime/`

| 文件 | 用途 | 更新者 |
|------|------|--------|
| progress.md | 学习进度 | Master |
| session_log.md | 课堂摘要 | 讲师 → Master |
| review_queue.md | 复习队列 | Master |
| mistake_log.md | 错题本 | 讲师 |
| wechat_group.md | 群聊记录 | Master |
| wechat_unread.md | 未读消息 | Master |
| diary.md | 日记 | Master |