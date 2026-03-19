#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
U1 失败页修复 - 使用 qwen-vl-plus-latest（单页重试，更稳健）
"""
import os
import sys
import json
import time
import fitz
import glob
from datetime import datetime
from dashscope import MultiModalConversation

DASHSCOPE_API_KEY = "sk-ce013fbefe7a41d796b0717cd2b070f6"
VISION_MODEL = "qwen-vl-plus-latest"

OUTPUT_DIR = "/root/.openclaw/workspace-gongbu/socrates-learning/materials/练习册_md_vision_u1_strict"
BASE_DIR = "/root/.openclaw/workspace-gongbu/socrates-learning"
PDF_DIR = os.path.join(BASE_DIR, "materials/练习册")
TEMP_DIR = os.path.join(OUTPUT_DIR, "temp_images_fix")

def pdf_to_images_for_pages(pdf_path, output_dir, page_nums):
    """只转换指定页码为图片"""
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    image_paths = {}
    
    for page_num in page_nums:
        idx = page_num - 1  # 0-indexed
        if idx < 0 or idx >= len(doc):
            print(f"警告：页码 {page_num} 超出范围 (1-{len(doc)})")
            continue
        page = doc[idx]
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        img_path = os.path.join(output_dir, f"page_{page_num:03d}.png")
        pix.save(img_path)
        image_paths[page_num] = img_path
    
    doc.close()
    return image_paths

def recognize_page_with_retry(image_path, page_num, max_retries=3):
    """单页识别，带重试"""
    for attempt in range(max_retries):
        start_time = time.time()
        try:
            image_uri = f"file://{os.path.abspath(image_path)}"
            prompt = "请完整识别这张图片中的所有文字内容，包括公式和符号。保持原有结构，不要遗漏任何内容。直接输出识别结果，不要添加任何解释性文字。"
            
            messages = [{
                "role": "user",
                "content": [
                    {"image": image_uri},
                    {"text": prompt}
                ]
            }]
            
            response = MultiModalConversation.call(
                model=VISION_MODEL,
                messages=messages,
                api_key=DASHSCOPE_API_KEY,
                timeout=60
            )
            
            latency_ms = int((time.time() - start_time) * 1000)
            
            if response.status_code == 200:
                text = response.output.choices[0].message.content[0]["text"]
                if text and len(text.strip()) > 50:  # 确保有实际内容
                    return text, "success", latency_ms
                else:
                    print(f"[内容过短，重试 {attempt+1}/{max_retries}]", end=" ", flush=True)
                    time.sleep(2 ** attempt)  # 指数退避
                    continue
            else:
                print(f"[API 错误 {response.code}, 重试 {attempt+1}/{max_retries}]", end=" ", flush=True)
                time.sleep(2 ** attempt)
        except Exception as e:
            print(f"[异常，重试 {attempt+1}/{max_retries}]", end=" ", flush=True)
            time.sleep(2 ** attempt)
    
    return None, "failed_after_retries", 0

def main():
    # 加载失败页
    failed_pages_path = os.path.join(OUTPUT_DIR, "failed_pages_u1_round1.json")
    if not os.path.exists(failed_pages_path):
        print("错误：未找到失败页记录")
        sys.exit(1)
    
    with open(failed_pages_path, "r", encoding="utf-8") as f:
        failed_pages = json.load(f)
    
    if not failed_pages:
        print("没有失败页需要修复")
        sys.exit(0)
    
    print(f"需要修复 {len(failed_pages)} 页\n")
    
    # 获取 PDF 路径
    pdf_files = glob.glob(os.path.join(PDF_DIR, "*U1*.pdf"))
    if not pdf_files:
        print("错误：未找到 U1 PDF 文件")
        sys.exit(1)
    
    pdf_path = pdf_files[0]
    print(f"使用 PDF: {os.path.basename(pdf_path)}")
    
    # 获取失败页码列表
    failed_page_nums = [fp["page"] for fp in failed_pages]
    
    # 转换为图片（只转换失败页）
    print(f"\n转换 {len(failed_page_nums)} 个失败页为图片...")
    image_paths = pdf_to_images_for_pages(pdf_path, TEMP_DIR, failed_page_nums)
    
    # 重建 results - 读取现有 MD，保留成功页
    existing_md_path = os.path.join(OUTPUT_DIR, "U1.md")
    results = {}
    total_pages = 86  # 已知总页数
    
    if os.path.exists(existing_md_path):
        with open(existing_md_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        import re
        pattern = r'## 第 (\d+) 页\n\n(.*?)(?=\n\n## 第 \d+ 页|$)'
        matches = re.findall(pattern, content, re.DOTALL)
        for page_num, text in matches:
            page_num = int(page_num)
            if text.strip() != "[识别失败]":
                results[page_num] = text
                if page_num not in failed_page_nums:
                    print(f"保留成功页：{page_num}")
    
    # 修复失败页
    print(f"\n=== 修复失败页 ({len(failed_page_nums)} 页) ===")
    fixed_count = 0
    rerun_results = []
    
    for page_num in failed_page_nums:
        if page_num not in image_paths:
            print(f"跳过页码 {page_num} (图片转换失败)")
            rerun_results.append({"page": page_num, "final_status": "failed", "reason": "no_image"})
            results[page_num] = "[识别失败]"
            continue
        
        img_path = image_paths[page_num]
        print(f"修复第 {page_num} 页...", end=" ", flush=True)
        text, status, latency = recognize_page_with_retry(img_path, page_num)
        
        if text:
            results[page_num] = text
            fixed_count += 1
            rerun_results.append({"page": page_num, "final_status": "success", "latency_ms": latency})
            print(f"✅ ({latency}ms)")
        else:
            results[page_num] = "[识别失败]"
            rerun_results.append({"page": page_num, "final_status": "failed", "reason": status})
            print(f"❌ {status}")
    
    # 重新生成 MD
    md_content = "# 物理电磁 C 练习册-U1-P1-P86\n\n"
    
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "[识别失败]")
        md_content += f"## 第 {page_num} 页\n\n{text}\n\n"
    
    md_path = os.path.join(OUTPUT_DIR, "U1.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    # 生成质量统计
    quality_stats = []
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "")
        quality_stats.append({
            "page": page_num,
            "success": text and text != "[识别失败]",
            "text_length": len(text) if text else 0
        })
    
    success_count = sum(1 for s in quality_stats if s["success"])
    
    # 生成质量报告
    quality_report = {
        "timestamp": datetime.now().isoformat(),
        "model": VISION_MODEL,
        "total_pages": total_pages,
        "successful_pages": success_count,
        "success_rate": (success_count / total_pages) * 100 if total_pages else 0,
        "page_stats": quality_stats,
        "fixed_pages": fixed_count,
        "original_failed": len(failed_pages)
    }
    
    with open(os.path.join(OUTPUT_DIR, "quality_report_u1.json"), "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2, ensure_ascii=False)
    
    # 生成重试页报告
    with open(os.path.join(OUTPUT_DIR, "rerun_pages_u1_round2.json"), "w", encoding="utf-8") as f:
        json.dump(rerun_results, f, indent=2, ensure_ascii=False)
    
    # 生成抽检表
    import random
    sample_pages = sorted(random.sample(range(1, total_pages + 1), min(10, total_pages)))
    sample_table = []
    for pn in sample_pages:
        stat = quality_stats[pn - 1]
        sample_table.append({
            "page": pn,
            "success": stat["success"],
            "conclusion": "通过" if stat["success"] else "失败"
        })
    
    with open(os.path.join(OUTPUT_DIR, "sample_audit_u1_10pages.json"), "w", encoding="utf-8") as f:
        json.dump({
            "sample_pages": sample_pages,
            "audit_table": sample_table,
            "pass_rate": (sum(1 for s in sample_table if s["success"]) / len(sample_table)) * 100 if sample_table else 0
        }, f, indent=2, ensure_ascii=False)
    
    # 清理
    import shutil
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    
    print(f"\n=== 修复完成 ===")
    print(f"修复成功：{fixed_count}/{len(failed_pages)} 页")
    print(f"总成功率：{success_count}/{total_pages} ({quality_report['success_rate']:.1f}%)")
    print(f"输出：{md_path}")
    
    # 如果未达到 100%，输出警告
    if success_count < total_pages:
        remaining_failed = [qs["page"] for qs in quality_stats if not qs["success"]]
        print(f"\n⚠️ 仍有 {len(remaining_failed)} 页失败：{remaining_failed[:10]}..." if len(remaining_failed) > 10 else f"\n⚠️ 仍有 {len(remaining_failed)} 页失败：{remaining_failed}")

if __name__ == '__main__':
    main()
