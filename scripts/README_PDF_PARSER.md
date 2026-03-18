# PDF 解析服务 - 快速指南

## 一、安装

### 方案 A：Marker（推荐，高质量）

```bash
# 安装依赖
pip install marker-pdf

# 首次运行会自动下载模型（约 2GB）
python scripts/pdf_parser.py parse "materials/lecture.pdf" -o "materials/lecture.md"
```

### 方案 B：OCR（轻量，备用）

```bash
# 安装依赖
pip install pymupdf paddlepaddle paddleocr

# 使用
python scripts/pdf_parser.py parse "materials/lecture.pdf" -o "materials/lecture.md" --no-marker
```

---

## 二、使用

### 1. 转换单个 PDF

```bash
python scripts/pdf_parser.py parse "input.pdf" -o "output.md"
```

### 2. 批量转换

```bash
python scripts/pdf_parser.py batch "materials/" -o "materials/md/"
```

### 3. Python 调用

```python
from scripts.pdf_parser import PDFFormatter

parser = PDFFormatter()
result = parser.parse("lecture.pdf")

print(result["markdown"])
```

---

## 三、输出示例

输入：`电场强度.pdf`

输出：`电场强度.md`

```markdown
# 电场强度

## 第 1 页

### 基本概念
- 电场强度定义：E = F/q
- 单位：N/C（牛顿/库仑）
- 方向：正电荷受力方向

### 公式
$$E = \frac{F}{q}$$

### 图表描述
图中显示两个点电荷 q1 和 q2，电场线从正电荷指向负电荷...

---

## 第 2 页
...
```

---

## 四、性能

| PDF 页数 | Marker 方案 | OCR 方案 |
|---------|-----------|---------|
| 10 页 | ~15 秒 | ~30 秒 |
| 50 页 | ~60 秒 | ~150 秒 |
| 100 页 | ~120 秒 | ~300 秒 |

**注意：** 使用 GPU 可提升 5-10 倍速度

---

## 五、常见问题

### Q1: 公式识别不准确？
**A:** 使用 Marker 方案（基于深度学习），准确率 > 90%

### Q2: 图表无法理解？
**A:** 集成 Qwen-VL API（需配置 DASHSCOPE_API_KEY）

### Q3: 内存溢出？
**A:** 分页处理或增加 `--no-marker` 使用轻量方案

---

臣工部复命！🙇‍♂️
