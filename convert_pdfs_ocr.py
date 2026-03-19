#!/usr/bin/env python3
"""
PDF OCR 转换脚本 - 使用 PaddleOCR 处理扫描版 PDF
"""
import os
import sys
import fitz  # PyMuPDF
from paddleocr import PaddleOCR

def init_ocr():
    """初始化 OCR 引擎"""
    print("初始化 PaddleOCR 引擎...")
    ocr = PaddleOCR(
        use_textline_orientation=True,
        lang='ch'  # 中英文混合
    )
    return ocr

def pdf_page_to_text(page, ocr):
    """对 PDF 页面进行 OCR 识别"""
    # 将页面渲染为图片
    mat = fitz.Matrix(2, 2)  # 2 倍缩放，提高识别精度
    pix = page.get_pixmap(matrix=mat)
    img_data = pix.tobytes("png")
    
    # OCR 识别
    result = ocr.predict(img_data)
    
    if not result or 'rec_texts' not in result:
        return ""
    
    # 提取文本
    texts = result.get('rec_texts', [])
    return "\n".join(texts)

def pdf_to_markdown_ocr(pdf_path, output_path, ocr):
    """将扫描版 PDF 转换为 Markdown"""
    fname = os.path.basename(pdf_path)
    print(f"处理：{fname}")
    
    doc = fitz.open(pdf_path)
    md_content = f"# {fname}\n\n"
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = pdf_page_to_text(page, ocr)
        
        if text.strip():
            md_content += f"## 第 {page_num + 1} 页\n\n"
            md_content += text + "\n\n"
    
    doc.close()
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    size = os.path.getsize(output_path)
    print(f"  -> 保存：{output_path} ({size:,} 字节)")
    return output_path, size

def main():
    if len(sys.argv) < 3:
        print("用法：python3 convert_pdfs_ocr.py <input_dir> <output_dir>")
        sys.exit(1)
    
    input_dir = sys.argv[1]
    output_dir = sys.argv[2]
    
    os.makedirs(output_dir, exist_ok=True)
    
    # 获取所有 PDF 文件
    files = [f for f in os.listdir(input_dir) if f.endswith('.pdf')]
    
    if not files:
        print(f"在 {input_dir} 中未找到 PDF 文件")
        sys.exit(0)
    
    print(f"找到 {len(files)} 个 PDF 文件\n")
    
    # 初始化 OCR
    ocr = init_ocr()
    
    results = []
    errors = []
    
    for i, fname in enumerate(files, 1):
        input_path = os.path.join(input_dir, fname)
        output_fname = os.path.splitext(fname)[0] + ".md"
        output_path = os.path.join(output_dir, output_fname)
        
        print(f"[{i}/{len(files)}]", end=" ")
        try:
            result = pdf_to_markdown_ocr(input_path, output_path, ocr)
            results.append(result)
        except Exception as e:
            print(f"  -> 错误：{e}")
            errors.append((fname, str(e)))
    
    print(f"\n=== 转换完成 ===")
    print(f"成功：{len(results)}/{len(files)}")
    if errors:
        print(f"失败：{len(errors)}")
        for fname, err in errors:
            print(f"  - {fname}: {err}")
    
    for path, size in results:
        print(f"  {os.path.basename(path)}  ({size:,} 字节)")

if __name__ == '__main__':
    main()
