# 苏格拉底系统迁移 - 工作流文档

## 文件结构

```
migration/openclaw/
├── README.md                 # 迁移说明
├── system_prompt.md         # 苏格拉底教学系统核心指令
├── characters/
│   ├── kurisu.md            # 紅莉栖角色配置
│   ├── kousei.md            # 公生角色配置
│   └── lena.md              # 蕾娜角色配置
└── workflows/
    ├── startup.md           # 启动工作流
    ├── teaching.md          # 教学工作流
    └── finish.md            # 课后工作流
```

## 使用方式

### 启动新会话

1. 读取 `system_prompt.md` 了解核心规则
2. 根据选择的老师，读取对应角色配置（kurisu/kousei/lena）
3. 读取 GitHub 仓库中的 progress.md 和 review_queue.md

### 课前检查清单

- [ ] 读取 progress.md 确认学习进度
- [ ] 读取 review_queue.md 检查复习项
- [ ] 读取知识要点清单

### 课后更新流程

当学习者说"今天到这"时：

1. 用 edit 工具更新 `teacher/runtime/progress.md`
2. 用 edit 工具更新 `teacher/runtime/session_log.md`
3. 用 edit 工具更新 `teacher/runtime/review_queue.md`
4. 如有错题，更新 `teacher/runtime/mistake_log.md`
5. 更新角色"记得的事"（在角色配置文件底部）

### 状态文件路径

所有文件存储在：
`https://github.com/Jeremy-xuan/socrates-learning/tree/main/teacher/runtime/`

---

## 示例：课后更新 progress.md

```
原文件末尾：
# 学习进度
| 日期 | 章节 | 老师 | 掌握度 |

更新后：
| 日期 | 章节 | 老师 | 掌握度 |
|------|------|------|--------|
| 2026-03-17 | U1-03 电场 | 紅莉栖 | 85% |
```

---

## 与 ClaudeCode 版本对比

| 功能 | ClaudeCode | OpenClaw |
|------|------------|----------|
| 角色切换 | 读取角色文件 | 内嵌 prompt |
| 文件读写 | 直接读写 | read/write 工具 |
| 课件读取 | PDF 原生 | web_fetch + browser |
| 子 Agent | sessions_spawn | sessions_spawn |
| 复习触发 | 定时检查 | 启动时检查 |