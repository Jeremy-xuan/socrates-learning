#!/usr/bin/env python3
"""
轻量级 PDF 转 Markdown 脚本 - 使用 PyMuPDF (fitz)
无需额外依赖，适合服务器环境
"""
import os
import sys
import fitz  # PyMuPDF

def pdf_to_markdown(pdf_path, output_path):
    """将 PDF 转换为 Markdown"""
    print(f"处理：{os.path.basename(pdf_path)}")
    
    doc = fitz.open(pdf_path)
    md_content = f"# {os.path.basename(pdf_path)}\n\n"
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
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
        print("用法：python3 convert_pdfs_simple.py <input_dir> <output_dir>")
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
    
    results = []
    for i, fname in enumerate(files, 1):
        input_path = os.path.join(input_dir, fname)
        output_fname = os.path.splitext(fname)[0] + ".md"
        output_path = os.path.join(output_dir, output_fname)
        
        print(f"[{i}/{len(files)}]", end=" ")
        try:
            result = pdf_to_markdown(input_path, output_path)
            results.append(result)
        except Exception as e:
            print(f"  -> 错误：{e}")
    
    print(f"\n=== 转换完成 ===")
    print(f"成功：{len(results)}/{len(files)}")
    for path, size in results:
        print(f"  {os.path.basename(path)}  ({size:,} 字节)")

if __name__ == '__main__':
    main()
