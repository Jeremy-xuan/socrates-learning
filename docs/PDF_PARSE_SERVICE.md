# PDF 解析服务技术方案

## 一、项目概述

**目标：** 让 Claude Code 能够阅读 PDF 课件，提取文字、公式、图表并转换为 Markdown 格式。

**使用场景：**
- 预习 Agent 自动分析 PDF 课件
- 学生上传课件自动生成学习笔记
- 批量处理教材 PDF 转换为可搜索格式

---

## 二、技术架构

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  PDF 文件    │ ──→ │ PDF 解析服务  │ ──→ │ Markdown    │
│ (课件/教材)  │     │ (Python)     │     │ (文字/公式)  │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              ┌─────▼─────┐ ┌────▼──────┐
              │ PaddleOCR │ │ Qwen-VL   │
              │ (文字识别) │ │ (图表理解) │
              └───────────┘ └───────────┘
```

---

## 三、核心功能

### 3.1 PDF 转图片

使用 `pdf2image` 或 `PyMuPDF` 将 PDF 每页转换为高分辨率图片。

```python
import fitz  # PyMuPDF

def pdf_to_images(pdf_path: str, dpi: int = 200) -> list:
    """PDF 转图片列表"""
    doc = fitz.open(pdf_path)
    images = []
    for page in doc:
        mat = fitz.Matrix(dpi/72, dpi/72)
        pix = page.get_pixmap(matrix=mat)
        img_data = pix.tobytes("jpg")
        images.append(img_data)
    doc.close()
    return images
```

### 3.2 文字识别（OCR）

使用 PaddleOCR 识别图片中的文字（支持中英文、公式）。

```python
from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='ch')
result = ocr.ocr(image_path, cls=True)

# 输出格式
{
  "texts": [
    {"text": "电场强度 E = F/q", "confidence": 0.98, "bbox": [...]},
    {"text": "单位：N/C", "confidence": 0.95, "bbox": [...]}
  ]
}
```

### 3.3 图表理解（AI）

使用 Qwen-VL 理解图表并生成文字描述。

```python
import requests

def describe_image(image_data: bytes, prompt: str = "描述这张物理图表") -> str:
    """调用 Qwen-VL 理解图片"""
    import base64
    
    url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    img_b64 = base64.b64encode(image_data).decode()
    payload = {
        "model": "qwen-vl-max",
        "messages": [{
            "role": "user",
            "content": [
                {"image": f"data:image/jpeg;base64,{img_b64}"},
                {"text": prompt}
            ]
        }]
    }
    
    resp = requests.post(url, headers=headers, json=payload)
    return resp.json()["choices"][0]["message"]["content"]
```

### 3.4 公式提取（LaTeX）

使用 Nougat 或 Pix2Tex 提取公式为 LaTeX 格式。

```python
# 方案 A：使用 Nougat（Meta 开源）
from nougat import NougatModel

model = NougatModel.from_pretrained("facebook/nougat-small")
latex = model(image_path)  # 输出：E = \\frac{F}{q}

# 方案 B：使用 Pix2Tex
from pix2tex.cli import LatexOCR
pix2tex = LatexOCR()
latex = pix2tex(image_path)  # 输出：E = \frac{F}{q}
```

### 3.5 输出 Markdown

整合所有内容为结构化 Markdown。

```markdown
# 课件标题：电场强度

## 第 1 页

### 文字内容
- 电场强度定义：E = F/q
- 单位：N/C（牛顿/库仑）
- 方向：正电荷受力方向

### 公式
$$E = \\frac{F}{q}$$

### 图表描述
图中显示两个点电荷 q1 和 q2，电场线从正电荷指向负电荷...

---

## 第 2 页
...
```

---

## 四、实现方案

### 方案 A：Marker（推荐）

使用 `marker` 库（基于深度学习，支持公式和表格）。

**优点：**
- 一键转换 PDF → Markdown
- 自动识别公式、表格、图表
- 输出质量高

**缺点：**
- 模型较大（首次下载约 2GB）
- 需要 GPU 加速（CPU 较慢）

**安装：**
```bash
pip install marker-pdf
```

**使用：**
```python
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

converter = PdfConverter(
    artifact_dict=create_model_dict(),
    config={"output_format": "markdown"}
)
rendered = converter("lecture.pdf")
text, _, _ = text_from_rendered(rendered)
```

### 方案 B：自建流水线

组合多个工具实现定制化流程。

**流程：**
1. `PyMuPDF`：PDF → 图片
2. `PaddleOCR`：图片 → 文字
3. `Qwen-VL`：图片 → 图表描述
4. `Pix2Tex`：公式图片 → LaTeX
5. 整合 → Markdown

**优点：**
- 可定制每个环节
- 可替换组件
- 轻量级

**缺点：**
- 需要集成多个 API
- 维护成本较高

---

## 五、推荐配置

### 5.1 本地部署（陛下服务器）

```bash
# 1. 安装依赖
pip install marker-pdf paddleocr paddlepaddle

# 2. 下载模型（首次）
marker-download-models

# 3. 转换 PDF
marker "materials/lecture.pdf" --output-dir "materials/md"
```

### 5.2 Docker 部署

```dockerfile
FROM python:3.11-slim

RUN pip install marker-pdf paddleocr

COPY pdf_parser.py /app/
WORKDIR /app

CMD ["python", "pdf_parser.py"]
```

### 5.3 API 服务

```python
from fastapi import FastAPI, UploadFile

app = FastAPI()

@app.post("/api/parse/pdf")
async def parse_pdf(file: UploadFile):
    # 保存上传的 PDF
    with open(f"/tmp/{file.filename}", "wb") as f:
        f.write(await file.read())
    
    # 调用解析
    result = parse_slides(f"/tmp/{file.filename}")
    
    return {"markdown": result["markdown"]}
```

---

## 六、性能优化

| 优化项 | 方案 | 效果 |
|--------|------|------|
| 并行处理 | 多进程处理多页 PDF | 速度提升 3-5x |
| 模型缓存 | 启动时加载模型，避免重复加载 | 减少 50% 延迟 |
| GPU 加速 | 使用 CUDA 运行 OCR 和 AI 模型 | 速度提升 10x |
| 批量处理 | 一次性处理多个 PDF | 减少 I/O 开销 |

---

## 七、成本估算

### 本地部署（推荐）

| 项目 | 成本 |
|------|------|
| 服务器 | 已有（陛下服务器） |
| 存储 | 约 5GB（模型 + 缓存） |
| 电费 | 可忽略 |
| **总计** | **¥0/月** |

### 云端 API

| 项目 | 单价 | 月用量 | 月成本 |
|------|------|--------|--------|
| Qwen-VL | ¥0.006/张 | 1000 张 | ¥6 |
| PaddleOCR | 免费 | - | ¥0 |
| **总计** | - | - | **¥6/月** |

---

## 八、实施计划

### P0（本周完成）

1. ✅ 安装 `marker-pdf` 库
2. ✅ 测试单个 PDF 转换
3. ✅ 创建批量处理脚本

### P1（下周完成）

4. ✅ 集成到预习 Agent
5. ✅ 添加错误处理和日志
6. ✅ 编写使用文档

### P2（本月完成）

7. ⏳ 添加 API 服务（可选）
8. ⏳ 配置 GPU 加速
9. ⏳ 性能基准测试

---

## 九、使用示例

### CLI 使用

```bash
# 转换单个 PDF
python scripts/pdf_parser.py parse "materials/U1-电场.pdf"

# 批量转换
python scripts/pdf_parser.py batch "materials/" --output "materials/md/"

# 指定页面范围
python scripts/pdf_parser.py parse "materials/U1.pdf" --pages 1-10
```

### Python 调用

```python
from scripts.pdf_parser import PDFFormatter

parser = PDFFormatter()
result = parser.parse("lecture.pdf")

print(result["markdown"])  # 输出 Markdown
print(result["knowledge_points"])  # 提取的知识点
```

### 预习 Agent 集成

```javascript
const { PreparerAgent } = require('./agents/preparer');

const agent = new PreparerAgent({
  pdfParser: 'python scripts/pdf_parser.py'
});

await agent.prepare('电场强度', {
  pdfPath: 'materials/U1-电场.pdf'
});
```

---

## 十、风险与应对

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 公式识别错误 | 中 | 中 | 人工校验 + 后处理修正 |
| 图表理解偏差 | 中 | 低 | 保留原始图片链接 |
| 模型加载失败 | 低 | 高 | 添加重试机制 + 备用模型 |
| 内存溢出 | 低 | 中 | 分页处理 + 内存限制 |

---

## 十一、验收标准

- [ ] 单个 PDF 转换时间 < 30 秒（10 页以内）
- [ ] 文字识别准确率 > 95%
- [ ] 公式提取准确率 > 90%
- [ ] 输出 Markdown 格式正确
- [ ] 支持批量处理（10+ PDF）
- [ ] 错误处理完善（日志 + 告警）

---

臣工部复命！请司礼监大人审阅！🙇‍♂️
