#!/usr/bin/env python3
"""
使用 PaddleOCR 离线模型识别 PDF（无需 API Key）
"""
import os
import sys
import fitz
from paddleocr import PaddleOCR

# 初始化 OCR（中文）
ocr = PaddleOCR(use_textline_orientation=True, lang='ch')

def pdf_to_images(pdf_path, output_dir, dpi=200):
    """将 PDF 转换为图片"""
    os.makedirs(output_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    image_paths = []
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=mat)
        img_path = os.path.join(output_dir, f"page_{page_num + 1:03d}.png")
        pix.save(img_path)
        image_paths.append(img_path)
    
    doc.close()
    return image_paths

def recognize_with_paddle(image_path):
    """使用 PaddleOCR 识别图片"""
    try:
        result = ocr.ocr(image_path, cls=True)
        
        if not result or not result[0]:
            return ""
        
        texts = [line[1][0] for line in result[0] if line and len(line) > 1]
        return "\n".join(texts)
        
    except Exception as e:
        print(f"  识别错误：{e}")
        return ""

def process_pdf(pdf_path, output_md_path, report_data):
    """处理单个 PDF 文件"""
    fname = os.path.basename(pdf_path)
    print(f"\n使用 PaddleOCR 处理：{fname}")
    
    temp_dir = os.path.join(os.path.dirname(output_md_path), f"temp_paddle_{os.path.basename(pdf_path)[:15]}")
    
    print(f"  转换为图片（200 DPI）...")
    image_paths = pdf_to_images(pdf_path, temp_dir, dpi=200)
    print(f"  转换为 {len(image_paths)} 张图片")
    
    md_content = f"# {fname}\n\n"
    success_count = 0
    page_reports = []
    
    for i, img_path in enumerate(image_paths, 1):
        print(f"  识别第 {i}/{len(image_paths)} 页...", end=" ", flush=True)
        text = recognize_with_paddle(img_path)
        
        page_info = {
            "page": i,
            "success": bool(text and len(text.strip()) > 10),
            "char_count": len(text) if text else 0
        }
        
        if text and len(text.strip()) > 10:
            md_content += f"## 第 {i} 页\n\n{text}\n\n"
            print(f"完成 ({len(text)} 字)")
            success_count += 1
        else:
            md_content += f"## 第 {i} 页\n\n[识别失败]\n\n"
            print("失败")
        
        page_reports.append(page_info)
    
    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    import shutil
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    size = os.path.getsize(output_md_path)
    print(f"  -> 保存：{output_md_path} ({size:,} 字节)")
    print(f"  -> 成功率：{success_count}/{len(image_paths)} ({100*success_count/len(image_paths):.1f}%)")
    
    report_data[fname] = {
        "method": "PaddleOCR",
        "total_pages": len(image_paths),
        "success_pages": success_count,
        "success_rate": f"{100*success_count/len(image_paths):.1f}%",
        "output_size": size,
        "page_details": page_reports
    }
    
    return output_md_path, size, success_count, len(image_paths)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_dir = os.path.join(base_dir, "materials", "练习册")
    output_dir = os.path.join(base_dir, "materials", "练习册_md")
    
    # 只处理 U3 和 U4
    target_files = [
        ("物理电磁 C 练习册-U3-P117-P182.pdf", "物理电磁 C 练习册-U3-P117-P182.md"),
        ("物理电磁 C 练习册-U4-P183-P236.pdf", "物理电磁 C 练习册-U4-P183-P236.md"),
    ]
    
    report_data = {}
    
    for i, (pdf_fname, md_fname) in enumerate(target_files, 1):
        input_path = os.path.join(input_dir, pdf_fname)
        output_path = os.path.join(output_dir, md_fname)
        
        print(f"\n[{i}/{len(target_files)}]", end=" ")
        try:
            process_pdf(input_path, output_path, report_data)
        except Exception as e:
            print(f"  -> 错误：{e}")
            report_data[pdf_fname] = {"error": str(e)}
    
    # 保存质量报告
    import json
    report_path = "materials/练习册_md/quality_report_paddle.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n\n=== PaddleOCR 完成 ===")
    print(f"质量报告已保存：{report_path}")

if __name__ == '__main__':
    main()
