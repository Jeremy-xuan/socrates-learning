#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2021 FRQ 紧急修复 - 单页串行，多模型重试
"""
import os
import sys
import json
import time
import fitz
from datetime import datetime
from dashscope import MultiModalConversation

DASHSCOPE_API_KEY = "sk-ce013fbefe7a41d796b0717cd2b070f6"
MODELS = ["qwen3-vl-235b-a22b-thinking", "qwen-vl-max-2025-08-13"]  # 多模型备选
MAX_RETRIES = 5
WAIT_BASE = 10  # 基础等待 10 秒

BASE_DIR = "/root/.openclaw/workspace-gongbu/socrates-learning/materials"
# Find 2021 directory
import glob
dirs_2021 = glob.glob(os.path.join(BASE_DIR, "*2021*md_vision"))
OUTPUT_DIR = dirs_2021[0] if dirs_2021 else None

# Find PDF
pdf_dir = os.path.join(BASE_DIR, "练习册")
pdf_files = glob.glob(os.path.join(pdf_dir, "*2021*.pdf"))
PDF_PATH = pdf_files[0] if pdf_files else None

def main():
    if not OUTPUT_DIR:
        print("错误：未找到 2021 输出目录")
        return
    if not PDF_PATH:
        print("错误：未找到 2021 PDF 文件")
        return
    
    print(f"输出目录：{OUTPUT_DIR}")
    print(f"PDF 路径：{PDF_PATH}\n")
    
    # 加载失败页
    failed_path = os.path.join(OUTPUT_DIR, "failed_pages_2021_round1.json")
    with open(failed_path, "r", encoding="utf-8") as f:
        failed_pages = json.load(f)
    
    if not failed_pages:
        print("没有失败页需要修复")
        return
    
    print(f"需要修复 {len(failed_pages)} 页\n")
    
    # 转换失败页为图片
    doc = fitz.open(PDF_PATH)
    temp_dir = os.path.join(OUTPUT_DIR, "temp_fix_final")
    os.makedirs(temp_dir, exist_ok=True)
    
    image_paths = {}
    for fail_info in failed_pages:
        page_num = fail_info["page"]
        idx = page_num - 1
        if idx < 0 or idx >= len(doc):
            continue
        page = doc[idx]
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        img_path = os.path.join(temp_dir, f"page_{page_num:03d}.png")
        pix.save(img_path)
        image_paths[page_num] = img_path
    doc.close()
    
    # 读取现有 MD，保留成功页
    existing_md = os.path.join(OUTPUT_DIR, "2021.md")
    results = {}
    
    with open(existing_md, "r", encoding="utf-8") as f:
        content = f.read()
    
    import re
    pattern = r'## 第 (\d+) 页\n\n(.*?)(?=\n\n## 第 \d+ 页|$)'
    matches = re.findall(pattern, content, re.DOTALL)
    for page_num, text in matches:
        page_num = int(page_num)
        if text.strip() != "[识别失败]":
            results[page_num] = text
    
    # 修复失败页 - 单页串行，多模型重试
    print(f"\n=== 紧急修复 ({len(failed_pages)} 页) ===")
    fixed_count = 0
    rerun_results = []
    api_log = []
    
    for fail_info in failed_pages:
        page_num = fail_info["page"]
        if page_num not in image_paths:
            print(f"跳过页码 {page_num} (无图片)")
            rerun_results.append({"page": page_num, "final_status": "failed", "reason": "no_image"})
            results[page_num] = "[识别失败]"
            continue
        
        img_path = image_paths[page_num]
        print(f"\n修复第 {page_num} 页...", end=" ", flush=True)
        
        success = False
        final_latency = 0
        final_model = None
        failure_reason = None
        attempts = 0
        
        for model in MODELS:
            if success:
                break
            
            for attempt in range(MAX_RETRIES):
                attempts += 1
                try:
                    start_time = time.time()
                    image_uri = f"file://{os.path.abspath(img_path)}"
                    prompt = "请完整识别这张图片中的所有文字内容，包括公式和符号。保持原有结构，不要遗漏任何内容。直接输出识别结果。"
                    
                    messages = [{
                        "role": "user",
                        "content": [
                            {"image": image_uri},
                            {"text": prompt}
                        ]
                    }]
                    
                    response = MultiModalConversation.call(
                        model=model,
                        messages=messages,
                        api_key=DASHSCOPE_API_KEY,
                        timeout=120
                    )
                    
                    latency_ms = int((time.time() - start_time) * 1000)
                    
                    # 记录 API 日志
                    api_log.append({
                        "timestamp": datetime.now().isoformat(),
                        "model": model,
                        "page": page_num,
                        "status": "success" if response.status_code == 200 else f"error_{response.code}",
                        "latency_ms": latency_ms,
                        "attempt": attempt + 1,
                        "round": 3  # 第三轮修复
                    })
                    
                    if response.status_code == 200:
                        text = response.output.choices[0].message.content[0]["text"]
                        if text and len(text.strip()) > 30:
                            results[page_num] = text
                            success = True
                            final_latency = latency_ms
                            final_model = model
                            print(f"✅ 模型={model}, 尝试={attempt+1}, 延迟={latency_ms}ms")
                            break
                        else:
                            print(f"[内容过短 模型={model} 尝试={attempt+1}/{MAX_RETRIES}]", end=" ", flush=True)
                    else:
                        failure_reason = f"{model}_error_{response.code}"
                        print(f"[API 错误={response.code} 模型={model} 尝试={attempt+1}/{MAX_RETRIES}]", end=" ", flush=True)
                    
                    # 指数退避
                    if attempt < MAX_RETRIES - 1:
                        wait_time = WAIT_BASE * (2 ** attempt)
                        wait_time = min(wait_time, 60)  # 最多等待 60 秒
                        print(f"等待{wait_time}秒...", end=" ", flush=True)
                        time.sleep(wait_time)
                        
                except Exception as e:
                    failure_reason = f"exception_{str(e)[:50]}"
                    api_log.append({
                        "timestamp": datetime.now().isoformat(),
                        "model": model,
                        "page": page_num,
                        "status": "exception",
                        "attempt": attempt + 1,
                        "round": 3
                    })
                    print(f"[异常 尝试={attempt+1}/{MAX_RETRIES}]", end=" ", flush=True)
                    if attempt < MAX_RETRIES - 1:
                        wait_time = WAIT_BASE * (2 ** attempt)
                        time.sleep(min(wait_time, 60))
        
        if not success:
            results[page_num] = "[识别失败]"
            rerun_results.append({
                "page": page_num,
                "final_status": "failed",
                "reason": failure_reason,
                "total_attempts": attempts,
                "models_tried": MODELS
            })
            print(f"❌ 最终失败 (尝试{attempts}次)")
        else:
            rerun_results.append({
                "page": page_num,
                "final_status": "success",
                "latency_ms": final_latency,
                "model": final_model,
                "total_attempts": attempts
            })
            fixed_count += 1
    
    # 重新生成 MD
    md_content = "# 物理电磁 C 练习册-2021 北美 FRQ 真题-P393-P416\n\n"
    for page_num in range(1, 25):
        text = results.get(page_num, "[识别失败]")
        md_content += f"## 第 {page_num} 页\n\n{text}\n\n"
    
    with open(existing_md, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    # 更新质量报告
    quality_stats = []
    for page_num in range(1, 25):
        text = results.get(page_num, "")
        quality_stats.append({
            "page": page_num,
            "success": text and text != "[识别失败]",
            "text_length": len(text) if text else 0
        })
    
    success_count = sum(1 for s in quality_stats if s["success"])
    
    quality_report = {
        "timestamp": datetime.now().isoformat(),
        "models_used": MODELS,
        "total_pages": 24,
        "successful_pages": success_count,
        "success_rate": (success_count / 24) * 100,
        "page_stats": quality_stats,
        "fixed_pages": fixed_count,
        "original_failed": len(failed_pages)
    }
    
    with open(os.path.join(OUTPUT_DIR, "quality_report_2021.json"), "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2, ensure_ascii=False)
    
    # 更新重试页报告
    with open(os.path.join(OUTPUT_DIR, "rerun_pages_2021_round2.json"), "w", encoding="utf-8") as f:
        json.dump(rerun_results, f, indent=2, ensure_ascii=False)
    
    # 保存 API 日志（第三轮）
    with open(os.path.join(OUTPUT_DIR, "vision_api_log_2021_round3.json"), "w", encoding="utf-8") as f:
        json.dump(api_log, f, indent=2, ensure_ascii=False)
    
    # 更新抽检表
    import random
    sample_pages = sorted(random.sample(range(1, 25), min(10, 24)))
    sample_table = []
    for pn in sample_pages:
        stat = quality_stats[pn - 1]
        sample_table.append({
            "page": pn,
            "success": stat["success"],
            "conclusion": "通过" if stat["success"] else "失败"
        })
    
    with open(os.path.join(OUTPUT_DIR, "sample_audit_2021_10pages.json"), "w", encoding="utf-8") as f:
        json.dump({
            "sample_pages": sample_pages,
            "audit_table": sample_table,
            "pass_rate": (sum(1 for s in sample_table if s["success"]) / len(sample_table)) * 100 if sample_table else 0
        }, f, indent=2, ensure_ascii=False)
    
    # 清理
    import shutil
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    print(f"\n=== 修复完成 ===")
    print(f"修复成功：{fixed_count}/{len(failed_pages)} 页")
    print(f"总成功率：{success_count}/24 ({quality_report['success_rate']:.1f}%)")

if __name__ == '__main__':
    main()
