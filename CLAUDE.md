# CLAUDE.md - 苏格拉底 AI 家教系统

## 项目概述

这是一个基于 AI 的自适应学习系统，包含预习 Agent、练习题索引系统和图片理解功能。

## 项目结构

```
.
├── agents/preparer/index.js    # 预习官 Agent 主程序
├── scripts/
│   ├── image-api-bridge.py     # 图片理解 API (Qwen-VL + PaddleOCR)
│   ├── test-preparer-e2e.js   # 端到端测试脚本
│   ├── import-*.js            # 题目导入脚本
│   └── fix-questions.js       # 题目修复脚本
├── index/
│   └── questions.json          # 练习题索引数据库
└── teacher/runtime/preview/   # 预习输出目录
```

## 主要功能

### 1. 预习 Agent

自动分析课件、提取知识点、推荐练习题。

**使用方式：**

```javascript
import { PreparerAgent } from './agents/preparer/index.js';

const agent = new PreparerAgent();
const result = await agent.prepare('电场强度');
// result: { knowledgePoint, summary, examples, mistakes, recommendations }
```

**CLI 测试：**
```bash
node scripts/test-preparer-e2e.js 电场强度
```

### 2. 练习题索引系统

支持按知识点、难度、题型、年份、单元查询题目。

**查询题目：**
```javascript
const index = new QuestionIndex('./index');
const questions = index.search({ topic: '电场强度', difficulty: '基础' });
```

### 3. 图片理解 API

解析课件 PDF 中的物理实验图、公式。

**环境变量：**
```bash
export DASHSCOPE_API_KEY="sk-xxxx"  # 阿里云 API Key
export PADDLEOCR_MODEL_PATH="/root/.openclaw/models/paddleocr"
```

**调用方式：**
```bash
python3 scripts/image-api-bridge.py parse /path/to/slides.pdf
python3 scripts/image-api-bridge.py ocr /path/to/image.png
python3 scripts/image-api-bridge.py vl /path/to/image.png "描述这张图"
```

## 题目库

- **总题目**：222 道
- **MC 总数**：196 道
- **FRQ 总数**：26 道
- **完整题目（含题干+选项）**：153 道
- **知识点**：电场、电容、电路、磁场、电磁感应
- **单元**：U1-U5 + AP 真题

## 题目格式

```json
{
  "id": "U1-MC-001",
  "topic": "电场",
  "subTopic": "Electrostatics",
  "difficulty": "基础",
  "type": "MC",
  "year": "2024",
  "unit": "U1",
  "content": "In the figure below, two point charges...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ...", "E. ..."],
  "answer": "D"
}
```

## 运行测试

```bash
# 测试预习 Agent
node scripts/test-preparer-e2e.js

# 测试索引系统
node scripts/test-index.js

# 测试全部知识点
node scripts/test-preparer-e2e.js 电场强度 电容 电路 磁场 电磁感应
```

## GitHub

https://github.com/Jeremy-xuan/socrates-learning