#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
补全失败页面 - 使用 qwen-vl-plus-latest 模型
"""
import os
import sys
import json
import time
import fitz
from datetime import datetime
from dashscope import MultiModalConversation

DASHSCOPE_API_KEY = "sk-ce013fbefe7a41d796b0717cd2b070f6"
VISION_MODEL = "qwen-vl-plus-latest"

def pdf_to_images(pdf_path, output_dir, pages=None):
    """将 PDF 转换为图片，可选择只转换特定页面"""
    os.makedirs(output_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    image_paths = []
    
    start_page = 0
    end_page = len(doc)
    
    if pages:
        start_page = min(pages) - 1  # 转为 0-indexed
        end_page = max(pages)
    
    for page_num in range(start_page, end_page):
        page = doc[page_num]
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        
        img_path = os.path.join(output_dir, f"page_{page_num + 1:03d}.png")
        pix.save(img_path)
        image_paths.append((page_num + 1, img_path))
    
    doc.close()
    return image_paths

def recognize_with_vision(image_path, page_num):
    """使用视觉模型识别图片"""
    start_time = time.time()
    try:
        image_uri = f"file://{os.path.abspath(image_path)}"
        
        messages = [{
            "role": "user",
            "content": [
                {"image": image_uri},
                {"text": "请识别这张图片中的所有文字内容，包括公式和符号。如果是物理题目，请完整保留题目内容和格式。"}
            ]
        }]
        
        response = MultiModalConversation.call(
            model=VISION_MODEL,
            messages=messages,
            api_key=DASHSCOPE_API_KEY
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        if response.status_code == 200:
            text = response.output.choices[0].message.content[0]["text"]
            print(f"  第 {page_num} 页 ✅ ({latency_ms}ms)")
            return page_num, text, "success"
        else:
            print(f"  第 {page_num} 页 ❌ {response.code} - {response.message}")
            return page_num, None, f"error_{response.code}"
            
    except Exception as e:
        print(f"  第 {page_num} 页 ❌ {str(e)[:100]}")
        return page_num, None, f"exception"

def fix_failed_pdf(pdf_path, existing_md_path, failed_pages, output_md_path):
    """修复失败的页面"""
    fname = os.path.basename(pdf_path)
    print(f"\n修复：{fname}")
    print(f"失败页面：{failed_pages}")
    
    # 读取现有 MD 文件
    with open(existing_md_path, "r", encoding="utf-8") as f:
        existing_content = f.read()
    
    # 创建临时目录
    temp_dir = os.path.join(os.path.dirname(output_md_path), "temp_fix_images")
    
    # 只转换失败页面
    image_paths = pdf_to_images(pdf_path, temp_dir, failed_pages)
    print(f"已转换 {len(image_paths)} 张图片")
    
    # 逐页识别
    results = {}
    success_count = 0
    
    for page_num, img_path in image_paths:
        print(f"识别第 {page_num} 页...", end=" ")
        page_num, text, status = recognize_with_vision(img_path, page_num)
        if text:
            results[page_num] = text
            success_count += 1
    
    # 替换失败页面的内容
    new_content = existing_content
    for page_num in failed_pages:
        old_section = f"## 第 {page_num} 页\n\n[识别失败]\n\n"
        if page_num in results:
            new_section = f"## 第 {page_num} 页\n\n{results[page_num]}\n\n"
            new_content = new_content.replace(old_section, new_section)
    
    # 保存结果
    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    # 清理临时图片
    import shutil
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    size = os.path.getsize(output_md_path)
    rate = (success_count / len(failed_pages)) * 100 if failed_pages else 0
    print(f"\n-> 保存：{output_md_path} ({size:,} 字节)")
    print(f"   修复成功率：{rate:.1f}% ({success_count}/{len(failed_pages)})")
    
    return {
        "pdf": fname,
        "total_failed": len(failed_pages),
        "fixed": success_count,
        "success_rate": rate
    }

def main():
    base_dir = "/root/.openclaw/workspace-gongbu/socrates-learning"
    pdf_dir = os.path.join(base_dir, "materials/练习册")
    md_dir = os.path.join(base_dir, "materials/练习册_md_vision")
    
    # 读取报告
    report_path = os.path.join(md_dir, "vision_conversion_report.json")
    with open(report_path, "r", encoding="utf-8") as f:
        report = json.load(f)
    
    # 找到有失败页面的文件
    files_to_fix = [r for r in report["results"] if r["failed_pages"]]
    
    if not files_to_fix:
        print("✅ 没有需要修复的文件！")
        return
    
    print(f"发现 {len(files_to_fix)} 个文件需要修复\n")
    print(f"开始时间：{datetime.now().isoformat()}")
    print(f"使用模型：{VISION_MODEL}")
    print("=" * 60)
    
    results = []
    for file_info in files_to_fix:
        pdf_path = os.path.join(pdf_dir, file_info["pdf"])
        # output 路径可能是相对路径，取文件名
        output_fname = os.path.basename(file_info["output"])
        existing_md = os.path.join(md_dir, output_fname)
        
        result = fix_failed_pdf(
            pdf_path,
            existing_md,
            file_info["failed_pages"],
            existing_md  # 覆盖原文件
        )
        results.append(result)
    
    print("\n" + "=" * 60)
    print("=== 修复完成 ===")
    print(f"结束时间：{datetime.now().isoformat()}")
    
    total_failed = sum(r["total_failed"] for r in results)
    total_fixed = sum(r["fixed"] for r in results)
    overall_rate = (total_fixed / total_failed) * 100 if total_failed else 0
    
    print(f"总失败页数：{total_failed}")
    print(f"修复成功：{total_fixed}")
    print(f"修复率：{overall_rate:.1f}%")
    
    for r in results:
        status = "✅" if r["success_rate"] == 100 else "⚠️"
        print(f"{status} {r['pdf']}: {r['fixed']}/{r['total_failed']}")

if __name__ == '__main__':
    main()
