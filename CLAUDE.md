# CLAUDE.md — AP Physics C: EM 苏格拉底家教系统

> 每次新会话开始时，必须按顺序完成以下步骤，再进入教学模式。

## 启动顺序（强制）

### 第一步：加载核心（必须完整读取）

1. `teacher/config/system.md` — 系统总指令
2. `teacher/story.md` — 故事背景
3. `teacher/config/learner_profile.md` — 学习者档案
4. `teacher/runtime/progress.md` — 当前学习进度

### 第二步：按需加载

5. `teacher/runtime/review_queue.md` — 检查今日是否有到期复习项
6. 当课老师的角色文档（`teacher/characters/` 下，根据学习者选择或出场平衡机制决定）
7. 本节课对应的教材章节（路径见 `teacher/config/curriculum.md`）

### 第三步：延迟加载（用到时再读）

以下文件不在启动时读取，仅在需要时加载：

- `teacher/config/knowledge_points.md` — 每节课结束后读取，对照 session_log.md 更新知识点覆盖状态；章节 `[ ]` 超过 30% 时，下节课由当课老师用角色口吻自然带出"上次有些东西没讲完"，直接从遗漏处开始补，不说章节编号
- `teacher/config/curriculum.md` — 需要查课程结构或教材路径时读取
- `teacher/runtime/session_log.md` — 需要回顾历史课堂时读取
- `teacher/runtime/session_archive.md` — 需要查更早的历史时读取
- `teacher/runtime/mistake_log.md` — 需要查错题记录时读取
- `teacher/runtime/diary.md` — 写日记时读取（确认当天是否已有记录）
- `teacher/runtime/wechat_group.md` — 学习者说"看看微信"时读取
- `teacher/runtime/wechat_unread.md` — 学习者说"看看微信"时读取
- 非当课老师的角色文档 — 生成群聊消息时读取

**不得跳过第一步和第二步。不得在读完上述文件之前开始教学。**

## 课后更新容错

课后更新涉及多个文件。如果更新过程中会话中断：
- 下次启动时，检查 `progress.md` 最后一条记录的日期和章节
- 与 `session_log.md` 最后一条对比，如果不匹配，说明上次更新未完成
- 补全缺失的更新项，然后正常开始

## 项目结构

```
AP_Physics_EM/
├── CLAUDE.md                        # 本文件（启动入口）
├── teacher/
│   ├── story.md                     # 故事背景（共享信息）
│   ├── config/
│   │   ├── system.md                # 系统总指令
│   │   ├── curriculum.md            # 课程大纲与教材路径映射
│   │   └── learner_profile.md       # 学习者档案
│   ├── characters/
│   │   ├── kurisu.md                # 牧瀬紅莉栖
│   │   ├── kousei.md                # 有马公生
│   │   └── lena.md                  # 弗拉基米尔·蕾娜
│   └── runtime/
│       ├── progress.md              # 学习进度
│       ├── session_log.md           # 课堂摘要
│       ├── session_archive.md       # 历史归档（压缩后的旧记录）
│       ├── review_queue.md          # 复习队列
│       ├── mistake_log.md           # 错题本
│       ├── diary.md                 # 每日日记
│       ├── wechat_group.md          # "四重奏"群聊完整记录
│       └── wechat_unread.md         # 待查看的群聊未读消息
└── materials/
    ├── textbook/                    # 主教材（Fundamentals of Physics，按章节）
    ├── solutions/                   # 解题手册
    ├── reference/                   # 扩展参考
    ├── 讲义/                        # 机构讲义（U1-U5 + FRQ专项）
    └── 练习册/                      # 练习册（U1-U5 + 历年FRQ真题）
```

## 教材路径规则

- 主教材：`materials/textbook/XX_ChapterName.pdf`
- 对应讲义：`materials/讲义/AP物理电磁C-讲义-UX-*.pdf`
- 对应练习册：`materials/练习册/物理电磁C练习册-UX-*.pdf`
- FRQ真题：`materials/练习册/物理电磁C练习册-20XX北美FRQ真题-*.pdf`

具体章节与单元的对应关系见 `teacher/config/curriculum.md`。
