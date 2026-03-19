#!/usr/bin/env python3
"""
使用 Qwen-VL 多模态 API 重新识别失败的 PDF
"""
import os
import sys
import fitz
from dashscope import MultiModalConversation

DASHSCOPE_API_KEY = "sk-ce013fbefe7a41d796b0717cd2b070f6"

def pdf_to_images(pdf_path, output_dir, max_dpi=300):
    """将 PDF 转换为高分辨率图片"""
    os.makedirs(output_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    image_paths = []
    
    zoom = max_dpi / 72
    mat = fitz.Matrix(zoom, zoom)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=mat)
        
        img_path = os.path.join(output_dir, f"page_{page_num + 1:03d}.png")
        pix.save(img_path)
        image_paths.append(img_path)
    
    doc.close()
    return image_paths

def recognize_with_qwen_vl(image_path):
    """使用 Qwen-VL 识别图片"""
    try:
        image_uri = f"file://{os.path.abspath(image_path)}"
        
        messages = [{
            "role": "user",
            "content": [
                {"image": image_uri},
                {"text": "请完整识别这张图片中的所有文字内容，包括物理公式、符号、图表标签。保持原有格式，如果是题目请完整保留题号和内容。"}
            ]
        }]
        
        response = MultiModalConversation.call(
            model="qwen-vl-max",
            messages=messages,
            api_key=DASHSCOPE_API_KEY
        )
        
        if response.status_code == 200:
            return response.output.choices[0].message.content[0]["text"]
        else:
            print(f"  API 错误：{response.code} - {response.message}")
            return None
            
    except Exception as e:
        print(f"  识别错误：{e}")
        return None

def process_pdf(pdf_path, output_md_path):
    """处理单个 PDF 文件"""
    fname = os.path.basename(pdf_path)
    print(f"\n重新处理：{fname}")
    
    temp_dir = os.path.join(os.path.dirname(output_md_path), f"temp_retry_{os.path.basename(pdf_path)[:15]}")
    
    print(f"  转换为图片（300 DPI）...")
    image_paths = pdf_to_images(pdf_path, temp_dir, max_dpi=300)
    print(f"  转换为 {len(image_paths)} 张图片")
    
    md_content = f"# {fname}\n\n"
    success_count = 0
    
    for i, img_path in enumerate(image_paths, 1):
        print(f"  识别第 {i}/{len(image_paths)} 页...", end=" ", flush=True)
        text = recognize_with_qwen_vl(img_path)
        
        if text and len(text.strip()) > 10:
            md_content += f"## 第 {i} 页\n\n{text}\n\n"
            print(f"完成 ({len(text)} 字)")
            success_count += 1
        else:
            md_content += f"## 第 {i} 页\n\n[识别失败]\n\n"
            print("失败")
    
    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    import shutil
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    size = os.path.getsize(output_md_path)
    print(f"  -> 保存：{output_md_path} ({size:,} 字节)")
    print(f"  -> 成功率：{success_count}/{len(image_paths)} ({100*success_count/len(image_paths):.1f}%)")
    return output_md_path, size, success_count, len(image_paths)

def main():
    # 使用相对路径
    input_dir = "materials/练习册"
    output_dir = "materials/练习册_md"
    
    # 只处理失败的文件（文件大小 < 1000 字节）
    failed_files = []
    for f in os.listdir(output_dir):
        if f.endswith('.md'):
            path = os.path.join(output_dir, f)
            size = os.path.getsize(path)
            if size < 1000:
                pdf_fname = f.replace('.md', '.pdf')
                failed_files.append((pdf_fname, f))
    
    if not failed_files:
        print("没有需要重试的文件！")
        return
    
    print(f"需要重试的文件：{len(failed_files)}")
    for pdf_f, md_f in failed_files:
        print(f"  - {pdf_f}")
    
    results = []
    errors = []
    
    for i, (pdf_fname, md_fname) in enumerate(failed_files, 1):
        input_path = os.path.join(input_dir, pdf_fname)
        output_path = os.path.join(output_dir, md_fname)
        
        print(f"\n[{i}/{len(failed_files)}]", end=" ")
        try:
            result = process_pdf(input_path, output_path)
            results.append(result)
        except Exception as e:
            print(f"  -> 错误：{e}")
            errors.append((pdf_fname, str(e)))
    
    print(f"\n\n=== 重试完成 ===")
    print(f"成功：{len(results)}/{len(failed_files)}")
    
    total_pages = sum(r[3] for r in results) if results else 0
    success_pages = sum(r[2] for r in results) if results else 0
    if total_pages > 0:
        print(f"总页数：{total_pages}")
        print(f"成功识别：{success_pages} 页 ({100*success_pages/total_pages:.1f}%)")

if __name__ == '__main__':
    main()
