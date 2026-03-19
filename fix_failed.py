#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复失败页 - 单页多次重试，增加等待时间
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
MAX_RETRIES = 5  # 最多重试 5 次

def main():
    if len(sys.argv) < 2:
        print("用法：python3 fix_failed.py <关键词>")
        sys.exit(1)
    
    keyword = sys.argv[1]
    
    # 查找输出目录
    base = "/root/.openclaw/workspace-gongbu/socrates-learning/materials"
    output_dir = None
    for item in os.listdir(base):
        if keyword in item and "md_vision" in item:
            output_dir = os.path.join(base, item)
            break
    
    if not output_dir:
        print("错误：未找到输出目录")
        sys.exit(1)
    
    print(f"输出目录：{output_dir}")
    
    # 加载失败页
    failed_path = os.path.join(output_dir, f"failed_pages_{keyword}_round1.json")
    if not os.path.exists(failed_path):
        print("错误：未找到失败页记录")
        sys.exit(1)
    
    with open(failed_path, "r", encoding="utf-8") as f:
        failed_pages = json.load(f)
    
    if not failed_pages:
        print("没有失败页需要修复")
        sys.exit(0)
    
    print(f"需要修复 {len(failed_pages)} 页\n")
    
    # 查找 PDF
    pdf_dir = "/root/.openclaw/workspace-gongbu/socrates-learning/materials/练习册"
    pdf_files = glob.glob(os.path.join(pdf_dir, f"*{keyword}*.pdf"))
    if not pdf_files:
        print(f"错误：未找到包含 '{keyword}' 的 PDF 文件")
        sys.exit(1)
    
    pdf_path = pdf_files[0]
    print(f"使用 PDF: {os.path.basename(pdf_path)}")
    
    # 获取总页数
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    doc.close()
    
    # 转换失败页为图片
    temp_dir = os.path.join(output_dir, "temp_fix")
    os.makedirs(temp_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
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
    existing_md = os.path.join(output_dir, f"{keyword}.md")
    results = {}
    
    if os.path.exists(existing_md):
        with open(existing_md, "r", encoding="utf-8") as f:
            content = f.read()
        
        import re
        pattern = r'## 第 (\d+) 页\n\n(.*?)(?=\n\n## 第 \d+ 页|$)'
        matches = re.findall(pattern, content, re.DOTALL)
        for page_num, text in matches:
            page_num = int(page_num)
            if text.strip() != "[识别失败]":
                results[page_num] = text
    
    # 修复失败页 - 单页多次重试
    print(f"\n=== 修复失败页 ({len(failed_pages)} 页) ===")
    fixed_count = 0
    rerun_results = []
    
    for fail_info in failed_pages:
        page_num = fail_info["page"]
        if page_num not in image_paths:
            print(f"跳过页码 {page_num} (无图片)")
            rerun_results.append({"page": page_num, "final_status": "failed", "reason": "no_image"})
            results[page_num] = "[识别失败]"
            continue
        
        img_path = image_paths[page_num]
        print(f"修复第 {page_num} 页...", end=" ", flush=True)
        
        success = False
        final_latency = 0
        
        for attempt in range(MAX_RETRIES):
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
                    model=VISION_MODEL,
                    messages=messages,
                    api_key=DASHSCOPE_API_KEY,
                    timeout=120
                )
                
                latency_ms = int((time.time() - start_time) * 1000)
                final_latency = latency_ms
                
                if response.status_code == 200:
                    text = response.output.choices[0].message.content[0]["text"]
                    if text and len(text.strip()) > 30:
                        results[page_num] = text
                        success = True
                        print(f"✅ (尝试 {attempt+1}/{MAX_RETRIES}, {latency_ms}ms)")
                        break
                    else:
                        print(f"[内容过短 尝试 {attempt+1}/{MAX_RETRIES}]", end=" ", flush=True)
                else:
                    print(f"[API 错误 {response.code} 尝试 {attempt+1}/{MAX_RETRIES}]", end=" ", flush=True)
                
                # 指数退避
                if attempt < MAX_RETRIES - 1:
                    wait_time = min(30, 5 * (2 ** attempt))
                    print(f"等待 {wait_time}秒...", end=" ", flush=True)
                    time.sleep(wait_time)
                    
            except Exception as e:
                print(f"[异常 尝试 {attempt+1}/{MAX_RETRIES}]", end=" ", flush=True)
                if attempt < MAX_RETRIES - 1:
                    wait_time = min(30, 5 * (2 ** attempt))
                    time.sleep(wait_time)
        
        if not success:
            results[page_num] = "[识别失败]"
            rerun_results.append({"page": page_num, "final_status": "failed", "reason": "all_retries_exhausted"})
            print(f"❌ 最终失败")
        else:
            rerun_results.append({"page": page_num, "final_status": "success", "latency_ms": final_latency, "attempts": attempt + 1})
            fixed_count += 1
    
    # 重新生成 MD
    md_content = f"# {keyword}\n\n"
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "[识别失败]")
        md_content += f"## 第 {page_num} 页\n\n{text}\n\n"
    
    with open(existing_md, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    # 更新质量报告
    quality_stats = []
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "")
        quality_stats.append({
            "page": page_num,
            "success": text and text != "[识别失败]",
            "text_length": len(text) if text else 0
        })
    
    success_count = sum(1 for s in quality_stats if s["success"])
    
    quality_report = {
        "timestamp": datetime.now().isoformat(),
        "model": VISION_MODEL,
        "total_pages": total_pages,
        "successful_pages": success_count,
        "success_rate": (success_count / total_pages) * 100 if total_pages else 0,
        "page_stats": quality_stats,
        "fixed_pages": fixed_count
    }
    
    with open(os.path.join(output_dir, f"quality_report_{keyword}.json"), "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2, ensure_ascii=False)
    
    # 更新重试页报告
    with open(os.path.join(output_dir, f"rerun_pages_{keyword}_round2.json"), "w", encoding="utf-8") as f:
        json.dump(rerun_results, f, indent=2, ensure_ascii=False)
    
    # 更新抽检表
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
    
    with open(os.path.join(output_dir, f"sample_audit_{keyword}_10pages.json"), "w", encoding="utf-8") as f:
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
    print(f"总成功率：{success_count}/{total_pages} ({quality_report['success_rate']:.1f}%)")

if __name__ == '__main__':
    main()
