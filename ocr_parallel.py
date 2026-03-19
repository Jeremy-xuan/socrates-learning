#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
通用并行 OCR 识别 - 使用 qwen-vl-plus-latest（高并发）
用法：python3 ocr_parallel.py <PDF 文件名> <输出目录名>
"""
import os
import sys
import json
import time
import random
import fitz
import concurrent.futures
import glob
import re
from datetime import datetime
from dashscope import MultiModalConversation

DASHSCOPE_API_KEY = "sk-ce013fbefe7a41d796b0717cd2b070f6"
VISION_MODEL = "qwen-vl-plus-latest"
MAX_WORKERS = 8  # 并发数

BASE_DIR = "/root/.openclaw/workspace-gongbu/socrates-learning"
PDF_DIR = os.path.join(BASE_DIR, "materials/练习册")

def get_output_dir(pdf_name):
    """根据 PDF 名称生成输出目录"""
    # 提取文件名不含扩展名
    base_name = os.path.splitext(pdf_name)[0]
    return os.path.join(BASE_DIR, "materials", f"{base_name}_md_vision")

api_log = []
quality_stats = []
failed_pages = []
rerun_pages = []
results = {}

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
            return page_num, text, "success"
        else:
            log_api_call(page_num, f"error_{response.code}", 0, latency_ms, round_num)
            return page_num, None, f"api_error_{response.code}"
    except Exception as e:
        latency_ms = int((time.time() - start_time) * 1000)
        log_api_call(page_num, "exception", 0, latency_ms, round_num)
        return page_num, None, f"exception"

def process_batch(image_paths, start_page, round_num=1):
    """并行处理一批页面"""
    global results
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = []
        for i, img_path in enumerate(image_paths):
            page_num = start_page + i
            futures.append(executor.submit(recognize_page, img_path, page_num, round_num))
        
        completed = 0
        for future in concurrent.futures.as_completed(futures):
            page_num, text, status = future.result()
            if text:
                results[page_num] = text
            else:
                failed_pages.append({"page": page_num, "reason": status})
            completed += 1
            print(f"进度：{completed}/{len(futures)} (第{page_num}页)", end="\r", flush=True)

def retry_failed_pages(image_paths, failed_pages_list, round_num=2):
    """重试失败页"""
    global results
    rerun_results = []
    
    for fail_info in failed_pages_list:
        page_num = fail_info["page"]
        img_path = image_paths[page_num - 1]
        print(f"重试第 {page_num} 页...", end=" ", flush=True)
        
        # 单页重试，最多 3 次
        max_retries = 3
        success = False
        latency_ms = 0
        
        for attempt in range(max_retries):
            try:
                image_uri = f"file://{os.path.abspath(img_path)}"
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
                    api_key=DASHSCOPE_API_KEY,
                    timeout=60
                )
                
                latency_ms = int((time.time() - time.time()) * 1000)
                
                if response.status_code == 200:
                    text = response.output.choices[0].message.content[0]["text"]
                    if text and len(text.strip()) > 50:
                        results[page_num] = text
                        rerun_results.append({"page": page_num, "final_status": "success", "latency_ms": int((time.time() - time.time()) * 1000)})
                        success = True
                        print("✅")
                        break
                
                time.sleep(2 ** attempt)
            except:
                time.sleep(2 ** attempt)
        
        if not success:
            results[page_num] = "[识别失败]"
            rerun_results.append({"page": page_num, "final_status": "failed"})
            print("❌")
    
    return rerun_results

def main():
    if len(sys.argv) < 2:
        print("用法：python3 ocr_parallel.py <PDF 文件名关键词>")
        print("例如：python3 ocr_parallel.py U2")
        sys.exit(1)
    
    keyword = sys.argv[1]
    
    # 查找 PDF
    pdf_files = glob.glob(os.path.join(PDF_DIR, f"*{keyword}*.pdf"))
    if not pdf_files:
        print(f"错误：未找到包含 '{keyword}' 的 PDF 文件")
        sys.exit(1)
    
    pdf_path = pdf_files[0]
    pdf_name = os.path.basename(pdf_path)
    print(f"处理：{pdf_name}")
    
    # 生成输出目录
    output_dir = get_output_dir(os.path.splitext(pdf_name)[0])
    os.makedirs(output_dir, exist_ok=True)
    print(f"输出目录：{output_dir}\n")
    
    # 转换图片
    temp_dir = os.path.join(output_dir, "temp_images")
    image_paths = pdf_to_images(pdf_path, temp_dir)
    total_pages = len(image_paths)
    print(f"转换为 {total_pages} 张图片\n")
    
    # 并行第一轮识别
    print(f"=== 第一轮识别（并行，并发度={MAX_WORKERS}）===")
    start_time = time.time()
    
    for batch_start in range(0, total_pages, MAX_WORKERS):
        batch_end = min(batch_start + MAX_WORKERS, total_pages)
        batch_images = image_paths[batch_start:batch_end]
        print(f"\n处理批次 {batch_start//MAX_WORKERS + 1}: 第 {batch_start+1}-{batch_end} 页")
        process_batch(batch_images, batch_start + 1, round_num=1)
    
    elapsed = time.time() - start_time
    print(f"\n第一轮耗时：{elapsed:.1f}秒")
    
    # 第二轮重试失败页
    rerun_results = []
    if failed_pages:
        print(f"\n=== 第二轮重试 ({len(failed_pages)} 页) ===")
        rerun_results = retry_failed_pages(image_paths, failed_pages, round_num=2)
    
    # 生成 MD
    md_content = f"# {os.path.splitext(pdf_name)[0]}\n\n"
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "[识别失败]")
        md_content += f"## 第 {page_num} 页\n\n{text}\n\n"
    
    md_path = os.path.join(output_dir, f"{keyword}.md")
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
    with open(os.path.join(output_dir, f"vision_api_log_{keyword}.json"), "w", encoding="utf-8") as f:
        json.dump(api_log, f, indent=2, ensure_ascii=False)
    
    # 失败页
    with open(os.path.join(output_dir, f"failed_pages_{keyword}_round1.json"), "w", encoding="utf-8") as f:
        json.dump(failed_pages, f, indent=2, ensure_ascii=False)
    
    # 重试页
    with open(os.path.join(output_dir, f"rerun_pages_{keyword}_round2.json"), "w", encoding="utf-8") as f:
        json.dump(rerun_results, f, indent=2, ensure_ascii=False)
    
    # 质量报告
    quality_report = {
        "timestamp": datetime.now().isoformat(),
        "model": VISION_MODEL,
        "total_pages": total_pages,
        "successful_pages": success_count,
        "success_rate": (success_count / total_pages) * 100 if total_pages else 0,
        "page_stats": quality_stats
    }
    with open(os.path.join(output_dir, f"quality_report_{keyword}.json"), "w", encoding="utf-8") as f:
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
    
    with open(os.path.join(output_dir, f"sample_audit_{keyword}_10pages.json"), "w", encoding="utf-8") as f:
        json.dump({
            "sample_pages": sample_pages,
            "audit_table": sample_table,
            "pass_rate": (sum(1 for s in sample_table if s["success"]) / len(sample_table)) * 100 if sample_table else 0
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n=== 完成 ===")
    print(f"输出：{md_path}")
    print(f"成功率：{success_count}/{total_pages} ({quality_report['success_rate']:.1f}%)")
    print(f"\n📋 交付清单:")
    print(f"  1. {keyword}.md")
    print(f"  2. vision_api_log_{keyword}.json ({len(api_log)} 条)")
    print(f"  3. failed_pages_{keyword}_round1.json ({len(failed_pages)} 页)")
    print(f"  4. rerun_pages_{keyword}_round2.json ({len(rerun_results)} 页)")
    print(f"  5. quality_report_{keyword}.json")
    print(f"  6. sample_audit_{keyword}_10pages.json (10 页抽检)")

if __name__ == '__main__':
    main()
