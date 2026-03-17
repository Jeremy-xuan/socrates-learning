# 课件阅读 Agent 配置

## Agent ID
`materials_reader`

## 职责
专门负责读取和解析课件材料，供教学使用。

---

## 能力

### 1. PDF 读取
- 使用 browser 工具打开 PDF
- 用 snapshot 提取文本内容
- 支持扫描件（需预处理）

### 2. 内容提取
- 提取章节标题
- 提取关键公式
- 提取例题
- 提取知识点总结

### 3. 知识点整理
- 按章节整理
- 标注重点
- 列出需要深入讲解的概念

---

## 使用场景

### 场景1：课前预习
```
主Agent：需要读取 U1-Electrostatics/lecture03.pdf
materials_reader → 提取内容 → 返回知识点清单
```

### 场景2：教学时查找
```
讲师Agent：需要解释高斯定律
materials_reader → 读取相关章节 → 返回解释
```

### 场景3：出题
```
讲师Agent：需要一道关于电场强度的练习题
materials_reader → 搜索练习册 → 返回题目位置
```

---

## 输出格式

### 知识点清单
```json
{
  "chapter": "U1-03",
  "title": "电场强度",
  "key_concepts": [
    "电场定义",
    "电场强度公式 E = F/q",
    "点电荷电场"
  ],
  "formulas": [
    "E = F/q",
    "E = kQ/r²"
  ],
  "examples": [
    {"page": 15, "topic": "电场强度计算"},
    {"page": 18, "topic": "多个点电荷"}
  ]
}
```

---

## 技术实现

### 方式1：browser + snapshot
```python
# 打开 PDF
browser(action="open", url="file.pdf")
# 提取内容
browser(action="snapshot")
```

### 方式2：web_fetch（在线 PDF）
```
web_fetch(url="https://.../lecture.pdf")
```

### 方式3：预转换（推荐）
提前将 PDF 转为 Markdown，存于仓库
```
materials/
├── U1-Electrostatics/
│   ├── lecture01.md
│   ├── lecture02.md
│   └── ...
```

---

## 文件位置

课件存储：
- GitHub: `https://github.com/Jeremy-xuan/socrates-learning/tree/main/materials/`
- 本地转换后：`materials/**/*.md`