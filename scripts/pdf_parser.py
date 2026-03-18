#!/usr/bin/env python3
"""
PDF 解析服务 - 将 PDF 课件转换为 Markdown
支持：文字识别、公式提取、图表理解
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import List, Dict, Any

# 尝试导入 marker（首选方案）
try:
    from marker.converters.pdf import PdfConverter
    from marker.models import create_model_dict
    from marker.output import text_from_rendered
    HAS_MARKER = True
except ImportError:
    HAS_MARKER = False
    print("⚠️  未安装 marker-pdf，使用备用方案")
    print("   安装：pip install marker-pdf")

# 备用方案依赖
try:
    import fitz  # PyMuPDF
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False

try:
    from paddleocr import PaddleOCR
    HAS_PADDLEOCR = True
except ImportError:
    HAS_PADDLEOCR = False


class PDFFormatter:
    """PDF 解析器"""
    
    def __init__(self, use_marker: bool = True):
        """
        初始化解析器
        
        Args:
            use_marker: 是否使用 marker 库（推荐）
        """
        self.use_marker = use_marker and HAS_MARKER
        self.model = None
        
        if self.use_marker:
            print("✓ 使用 Marker 解析器（深度学习方案）")
            self._load_marker_model()
        else:
            print("⚠️  使用备用解析器（OCR 方案）")
            if HAS_PYMUPDF and HAS_PADDLEOCR:
                self.ocr = PaddleOCR(use_angle_cls=True, lang='ch')
    
    def _load_marker_model(self):
        """加载 Marker 模型（只需一次）"""
        if self.model is None:
            print("📦 加载 Marker 模型（首次约需 1-2 分钟）...")
            self.model = PdfConverter(
                artifact_dict=create_model_dict(),
                config={"output_format": "markdown", "pdftext_workers": 1}
            )
            print("✓ 模型加载完成")
    
    def parse(self, pdf_path: str, output_path: str = None) -> Dict[str, Any]:
        """
        解析单个 PDF 文件
        
        Args:
            pdf_path: PDF 文件路径
            output_path: 输出 Markdown 路径（可选）
        
        Returns:
            {
                "success": True,
                "markdown": str,
                "pages": int,
                "output_path": str
            }
        """
        if not os.path.exists(pdf_path):
            return {"success": False, "error": f"文件不存在：{pdf_path}"}
        
        print(f"📄 解析：{pdf_path}")
        
        try:
            if self.use_marker:
                result = self._parse_with_marker(pdf_path)
            else:
                result = self._parse_with_ocr(pdf_path)
            
            # 保存输出
            if output_path:
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(result["markdown"])
                result["output_path"] = output_path
                print(f"✓ 已保存：{output_path}")
            
            return result
        
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _parse_with_marker(self, pdf_path: str) -> Dict[str, Any]:
        """使用 Marker 解析 PDF"""
        rendered = self.model(pdf_path)
        text, _, _ = text_from_rendered(rendered)
        
        return {
            "success": True,
            "markdown": text,
            "pages": rendered.page_count,
            "method": "marker"
        }
    
    def _parse_with_ocr(self, pdf_path: str) -> Dict[str, Any]:
        """使用 OCR 备用方案解析 PDF"""
        if not HAS_PYMUPDF:
            raise ImportError("需要安装 PyMuPDF：pip install pymupdf")
        
        # PDF 转图片
        doc = fitz.open(pdf_path)
        pages_text = []
        
        for i, page in enumerate(doc):
            # 提取文字（如果有）
            text = page.get_text()
            
            # 如果文字为空或很少，使用 OCR
            if len(text.strip()) < 50:
                # 渲染为图片
                mat = fitz.Matrix(2, 2)  # 2x 缩放
                pix = page.get_pixmap(matrix=mat)
                img_data = pix.tobytes("png")
                
                # 临时保存
                img_path = f"/tmp/pdf_page_{i}.png"
                with open(img_path, "wb") as f:
                    f.write(img_data)
                
                # OCR 识别
                if HAS_PADDLEOCR:
                    ocr_result = self.ocr.ocr(img_path, cls=True)
                    if ocr_result[0]:
                        text = "\n".join([line[1][0] for line in ocr_result[0]])
            
            pages_text.append(f"## 第 {i+1} 页\n\n{text}")
        
        doc.close()
        
        return {
            "success": True,
            "markdown": "\n\n".join(pages_text),
            "pages": len(pages_text),
            "method": "ocr"
        }
    
    def batch_parse(self, input_dir: str, output_dir: str, pattern: str = "*.pdf") -> List[Dict[str, Any]]:
        """
        批量解析 PDF
        
        Args:
            input_dir: 输入目录
            output_dir: 输出目录
            pattern: 文件匹配模式
        
        Returns:
            解析结果列表
        """
        from glob import glob
        
        # 创建输出目录
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # 查找所有 PDF
        pdf_files = glob(os.path.join(input_dir, pattern))
        
        if not pdf_files:
            print(f"⚠️  未找到 PDF 文件：{input_dir}/{pattern}")
            return []
        
        print(f"📚 找到 {len(pdf_files)} 个 PDF 文件")
        
        results = []
        for i, pdf_path in enumerate(pdf_files, 1):
            pdf_name = os.path.basename(pdf_path)
            md_name = os.path.splitext(pdf_name)[0] + ".md"
            md_path = os.path.join(output_dir, md_name)
            
            print(f"\n[{i}/{len(pdf_files)}] 处理：{pdf_name}")
            result = self.parse(pdf_path, md_path)
            results.append(result)
        
        # 汇总统计
        success_count = sum(1 for r in results if r.get("success"))
        print(f"\n✅ 完成：{success_count}/{len(pdf_files)} 个文件成功")
        
        return results


def main():
    """CLI 入口"""
    parser = argparse.ArgumentParser(description="PDF 解析服务")
    parser.add_argument("action", choices=["parse", "batch"], help="操作类型")
    parser.add_argument("input", help="输入文件/目录")
    parser.add_argument("-o", "--output", help="输出文件/目录")
    parser.add_argument("--no-marker", action="store_true", help="不使用 Marker 库")
    
    args = parser.parse_args()
    
    # 创建解析器
    formatter = PDFFormatter(use_marker=not args.no_marker)
    
    if args.action == "parse":
        # 单个文件解析
        result = formatter.parse(args.input, args.output)
        
        if result.get("success"):
            print(f"\n✅ 解析成功")
            print(f"   页数：{result.get('pages')}")
            print(f"   方法：{result.get('method')}")
            if result.get("output_path"):
                print(f"   输出：{result['output_path']}")
        else:
            print(f"\n❌ 解析失败：{result.get('error')}")
            sys.exit(1)
    
    elif args.action == "batch":
        # 批量解析
        output_dir = args.output or os.path.join(args.input, "md")
        results = formatter.batch_parse(args.input, output_dir)
        
        # 输出汇总
        print("\n📊 汇总:")
        for r in results:
            status = "✓" if r.get("success") else "✗"
            print(f"   {status} {os.path.basename(r.get('output_path', 'N/A'))}")


if __name__ == "__main__":
    main()
