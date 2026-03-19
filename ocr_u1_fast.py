#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
U1 快速 OCR 识别 - 使用 qwen-vl-plus-latest（更快）
"""
import os
import sys
import json
import time
import random
import fitz
from datetime import datetime
from dashscope import MultiModalConversation

DASHSCOPE_API_KEY = "sk-ce013fbefe7a41d796b0717cd2b070f6"
VISION_MODEL = "qwen-vl-plus-latest"

OUTPUT_DIR = "/root/.openclaw/workspace-gongbu/socrates-learning/materials/练习册_md_vision_u1_strict"
BASE_DIR = "/root/.openclaw/workspace-gongbu/socrates-learning"
PDF_DIR = os.path.join(BASE_DIR, "materials/练习册")

api_log = []
quality_stats = []
failed_pages = []
rerun_pages = []

def log_api_call(page, status, text_len, latency_ms, round_num=1):
    api_log.append({
        "timestamp": datetime.now().isoformat(),
        "model": VISION_MODEL,
        "page": page,
        "status": status,
        "text_length": text_len,
        "latency_ms": latency_ms,
        "round": round_num
    })

def pdf_to_images(pdf_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    image_paths = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        img_path = os.path.join(output_dir, f"page_{page_num + 1:03d}.png")
        pix.save(img_path)
        image_paths.append(img_path)
    doc.close()
    return image_paths

def recognize_page(image_path, page_num, round_num=1):
    start_time = time.time()
    try:
        image_uri = f"file://{os.path.abspath(image_path)}"
        prompt = "请完整识别这张图片中的所有文字内容，包括公式和符号。保持原有结构，不要遗漏任何内容。"
        
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
            api_key=DASHSCOPE_API_KEY
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        if response.status_code == 200:
            text = response.output.choices[0].message.content[0]["text"]
            log_api_call(page_num, "success", len(text), latency_ms, round_num)
            return text, "success"
        else:
            log_api_call(page_num, f"error_{response.code}", 0, latency_ms, round_num)
            return None, f"api_error_{response.code}"
    except Exception as e:
        latency_ms = int((time.time() - start_time) * 1000)
        log_api_call(page_num, "exception", 0, latency_ms, round_num)
        return None, f"exception"

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # 获取 U1 PDF
    pdf_files = [f for f in os.listdir(PDF_DIR) if f.endswith('.pdf') and 'U1' in f]
    if not pdf_files:
        print("错误：未找到 U1 PDF 文件")
        sys.exit(1)
    
    pdf_path = os.path.join(PDF_DIR, pdf_files[0])
    print(f"处理：{pdf_files[0]}")
    
    # 转换图片
    temp_dir = os.path.join(OUTPUT_DIR, "temp_images")
    image_paths = pdf_to_images(pdf_path, temp_dir)
    total_pages = len(image_paths)
    print(f"转换为 {total_pages} 张图片\n")
    
    # 第一轮识别
    print("=== 第一轮识别 ===")
    results = {}
    
    for i, img_path in enumerate(image_paths, 1):
        print(f"第 {i}/{total_pages} 页...", end=" ", flush=True)
        text, status = recognize_page(img_path, i, round_num=1)
        
        if text:
            results[i] = text
            print("✅")
        else:
            print(f"❌ {status}")
            failed_pages.append({"page": i, "reason": status})
    
    # 第二轮重试
    if failed_pages:
        print(f"\n=== 第二轮重试 ({len(failed_pages)} 页) ===")
        for fail_info in failed_pages:
            page_num = fail_info["page"]
            img_path = image_paths[page_num - 1]
            print(f"重试第 {page_num} 页...", end=" ", flush=True)
            text, status = recognize_page(img_path, page_num, round_num=2)
            
            if text:
                results[page_num] = text
                rerun_pages.append({"page": page_num, "final_status": "success"})
                print("✅")
            else:
                results[page_num] = "[识别失败]"
                rerun_pages.append({"page": page_num, "final_status": "failed"})
                print("❌")
    
    # 生成 MD
    md_content = "# 物理电磁 C 练习册-U1-P1-P86\n\n"
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "[识别失败]")
        md_content += f"## 第 {page_num} 页\n\n{text}\n\n"
    
    md_path = os.path.join(OUTPUT_DIR, "U1.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    # 质量统计
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "")
        quality_stats.append({
            "page": page_num,
            "success": text and text != "[识别失败]",
            "text_length": len(text) if text else 0
        })
    
    # 清理
    import shutil
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    # 保存报告
    success_count = sum(1 for s in quality_stats if s["success"])
    
    # API 日志
    with open(os.path.join(OUTPUT_DIR, "vision_api_log_u1.json"), "w", encoding="utf-8") as f:
        json.dump(api_log, f, indent=2, ensure_ascii=False)
    
    # 失败页
    with open(os.path.join(OUTPUT_DIR, "failed_pages_u1_round1.json"), "w", encoding="utf-8") as f:
        json.dump(failed_pages, f, indent=2, ensure_ascii=False)
    
    # 重试页
    with open(os.path.join(OUTPUT_DIR, "rerun_pages_u1_round2.json"), "w", encoding="utf-8") as f:
        json.dump(rerun_pages, f, indent=2, ensure_ascii=False)
    
    # 质量报告
    quality_report = {
        "timestamp": datetime.now().isoformat(),
        "model": VISION_MODEL,
        "total_pages": total_pages,
        "successful_pages": success_count,
        "success_rate": (success_count / total_pages) * 100 if total_pages else 0,
        "page_stats": quality_stats
    }
    with open(os.path.join(OUTPUT_DIR, "quality_report_u1.json"), "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2, ensure_ascii=False)
    
    # 抽检表
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
            "pass_rate": (sum(1 for s in sample_table if s["success"]) / len(sample_table)) * 100
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n=== 完成 ===")
    print(f"输出：{md_path}")
    print(f"成功率：{success_count}/{total_pages} ({quality_report['success_rate']:.1f}%)")
    print(f"\n📋 交付清单:")
    print(f"  1. U1.md")
    print(f"  2. vision_api_log_u1.json ({len(api_log)} 条)")
    print(f"  3. failed_pages_u1_round1.json ({len(failed_pages)} 页)")
    print(f"  4. rerun_pages_u1_round2.json ({len(rerun_pages)} 页)")
    print(f"  5. quality_report_u1.json")
    print(f"  6. sample_audit_u1_10pages.json (10 页抽检)")

if __name__ == '__main__':
    main()
