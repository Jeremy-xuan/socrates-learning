# 预习流程文档 (docs/preview-flow.md)

## 概述

预习官是一个独立子 Agent，负责课前自动翻阅课件并生成预习材料。

## 调用流程

```
主 Agent → sessions_spawn (runtime: "subagent") → 预习官 Agent → 输出到 preview/
```

## 输入

- knowledgePoint: 知识点名称
- 课件路径: materials/讲义/*.pdf
- 练习册: materials/练习册/

## 输出

```json
{
  "knowledgePoint": "电场强度",
  "summary": {
    "coreConcepts": ["电场强度定义", "库仑定律"],
    "formulas": ["E = F/q", "E = kQ/r²"],
    "keyPoints": ["矢量性", "叠加原理"]
  },
  "examples": [],
  "mistakes": [],
  "recommendations": [],
  "timestamp": "2026-03-16T..."
}
```

## 文件结构

```
teacher/
├── characters/
│   └── preparer.md       # 预习官角色定义
└── runtime/
    └── preview/          # 预习输出目录
        └── U1-电场强度.json
```

## 依赖

- 工部图片理解 API
- 索引系统题目查询