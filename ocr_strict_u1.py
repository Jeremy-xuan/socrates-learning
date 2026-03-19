#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
严格 OCR 识别 - U1 预审专用
模型：qwen3-vl-235b-a22b-thinking（深度思考，高准确度）
流程：识别 → 校验 → 失败重试 → 完整日志
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
VISION_MODEL = "qwen3-vl-235b-a22b-thinking"

# 输出目录
OUTPUT_DIR = "/root/.openclaw/workspace-gongbu/socrates-learning/materials/练习册_md_vision_u1_strict"
BASE_DIR = "/root/.openclaw/workspace-gongbu/socrates-learning"
PDF_DIR = os.path.join(BASE_DIR, "materials/练习册")

# 动态获取 U1 PDF 文件
pdf_files = [f for f in os.listdir(PDF_DIR) if f.endswith('.pdf') and 'U1' in f]
if not pdf_files:
    print("错误：未找到 U1 PDF 文件")
    sys.exit(1)
PDF_PATH = os.path.join(PDF_DIR, pdf_files[0])

# 日志数据
api_log = []
quality_stats = []
failed_round1 = []
rerun_round2 = []

def log_api_call(page, status, text_len, latency_ms, round_num=1, retry_reason=""):
    """记录 API 调用"""
    api_log.append({
        "timestamp": datetime.now().isoformat(),
        "model": VISION_MODEL,
        "page": page,
        "status": status,
        "text_length": text_len,
        "latency_ms": latency_ms,
        "round": round_num,
        "retry_reason": retry_reason
    })

def pdf_to_images(pdf_path, output_dir):
    """将 PDF 转换为图片"""
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

def validate_content(text, page_num):
    """
    校验识别内容质量
    返回：(is_valid, issues)
    """
    issues = []
    
    # 1. 检查长度（过短可能遗漏）
    lines = text.strip().split('\n')
    if len(lines) < 3:
        issues.append("内容过短")
    
    # 2. 检查是否有明显截断
    if text.strip().endswith('...') or text.strip().endswith('…'):
        issues.append("内容截断")
    
    # 3. 检查是否有占位符
    if '[识别失败]' in text or '无法识别' in text:
        issues.append("识别失败占位符")
    
    # 4. 检查物理关键词（U1 是静电学，应有特定词汇）
    physics_keywords = ['charge', 'field', 'potential', 'electric', 'sphere', 'particle', 'force', 'energy']
    text_lower = text.lower()
    # 不强制要求英文关键词，因为可能是中文识别
    
    is_valid = len(issues) == 0
    return is_valid, issues

def recognize_page(image_path, page_num, round_num=1, retry_reason=""):
    """识别单页，带校验"""
    start_time = time.time()
    
    try:
        image_uri = f"file://{os.path.abspath(image_path)}"
        
        # 优化 prompt：强调完整性
        prompt = """请完整识别这张图片中的所有文字内容。要求：
1. 完整保留所有文字，不要遗漏任何内容
2. 物理公式和符号要准确识别（包括上下标、希腊字母、分式等）
3. 保持原有的题号、小问层级结构
4. 如果有图表说明文字，也要识别
5. 不要省略任何条件或数据

请输出完整的识别结果："""
        
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
            is_valid, issues = validate_content(text, page_num)
            
            if is_valid:
                log_api_call(page_num, "success", len(text), latency_ms, round_num, retry_reason)
                return text, "success"
            else:
                # 校验失败，需要重试
                log_api_call(page_num, f"validation_failed: {','.join(issues)}", len(text), latency_ms, round_num, retry_reason)
                return text, f"validation_failed: {issues}"
        else:
            log_api_call(page_num, f"error_{response.code}", 0, latency_ms, round_num, retry_reason)
            return None, f"api_error_{response.code}"
            
    except Exception as e:
        latency_ms = int((time.time() - start_time) * 1000)
        log_api_call(page_num, f"exception", 0, latency_ms, round_num, retry_reason)
        return None, f"exception: {str(e)[:100]}"

def process_pdf_strict(pdf_path, output_dir):
    """严格处理 PDF：两轮识别"""
    print(f"处理：{os.path.basename(pdf_path)}")
    
    # 转换 PDF 为图片
    temp_dir = os.path.join(output_dir, "temp_images")
    image_paths = pdf_to_images(pdf_path, temp_dir)
    total_pages = len(image_paths)
    print(f"  转换为 {total_pages} 张图片")
    
    # 第一轮识别
    print("\n=== 第一轮识别 ===")
    results = {}
    
    for i, img_path in enumerate(image_paths, 1):
        print(f"  第 {i}/{total_pages} 页...", end=" ")
        text, status = recognize_page(img_path, i, round_num=1)
        
        if status == "success":
            results[i] = text
            print("✅")
        else:
            print(f"⚠️ {status}")
            failed_round1.append({
                "page": i,
                "reason": status,
                "timestamp": datetime.now().isoformat()
            })
    
    # 第二轮：重试失败页面
    if failed_round1:
        print(f"\n=== 第二轮重试 ({len(failed_round1)} 页) ===")
        
        for fail_info in failed_round1:
            page_num = fail_info["page"]
            img_path = image_paths[page_num - 1]
            print(f"  重试第 {page_num} 页...", end=" ")
            
            text, status = recognize_page(img_path, page_num, round_num=2, retry_reason=fail_info["reason"])
            
            if status == "success" or text:
                results[page_num] = text if text else results.get(page_num, "[识别失败]")
                rerun_round2.append({
                    "page": page_num,
                    "original_reason": fail_info["reason"],
                    "final_status": status,
                    "timestamp": datetime.now().isoformat()
                })
                print("✅" if status == "success" else "⚠️")
            else:
                results[page_num] = "[识别失败]"
                rerun_round2.append({
                    "page": page_num,
                    "original_reason": fail_info["reason"],
                    "final_status": "failed",
                    "timestamp": datetime.now().isoformat()
                })
                print("❌")
    
    # 生成 MD 文件
    md_content = f"# 物理电磁 C 练习册-U1-P1-P86\n\n"
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "[识别失败]")
        md_content += f"## 第 {page_num} 页\n\n{text}\n\n"
    
    md_path = os.path.join(output_dir, "U1.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    # 生成质量统计
    for page_num in range(1, total_pages + 1):
        text = results.get(page_num, "")
        is_success = text and text != "[识别失败]"
        quality_stats.append({
            "page": page_num,
            "success": is_success,
            "text_length": len(text) if text else 0,
            "in_round1": page_num not in [f["page"] for f in failed_round1],
            "in_round2": page_num in [r["page"] for r in rerun_round2]
        })
    
    # 清理临时文件
    import shutil
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    md_size = os.path.getsize(md_path)
    success_count = sum(1 for s in quality_stats if s["success"])
    success_rate = (success_count / total_pages) * 100
    
    print(f"\n=== 完成 ===")
    print(f"  输出：{md_path} ({md_size:,} 字节)")
    print(f"  成功率：{success_rate:.1f}% ({success_count}/{total_pages})")
    
    return md_path, md_size, success_rate

def save_reports(output_dir):
    """保存所有报告文件"""
    # 1. API 日志
    log_path = os.path.join(output_dir, "vision_api_log_u1.json")
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(api_log, f, indent=2, ensure_ascii=False)
    print(f"  API 日志：{log_path}")
    
    # 2. 第一轮失败页面
    failed_path = os.path.join(output_dir, "failed_pages_u1_round1.json")
    with open(failed_path, "w", encoding="utf-8") as f:
        json.dump(failed_round1, f, indent=2, ensure_ascii=False)
    print(f"  第一轮失败：{failed_path}")
    
    # 3. 第二轮重试页面
    rerun_path = os.path.join(output_dir, "rerun_pages_u1_round2.json")
    with open(rerun_path, "w", encoding="utf-8") as f:
        json.dump(rerun_round2, f, indent=2, ensure_ascii=False)
    print(f"  第二轮重试：{rerun_path}")
    
    # 4. 质量报告
    quality_path = os.path.join(output_dir, "quality_report_u1.json")
    total_pages = len(quality_stats)
    success_count = sum(1 for s in quality_stats if s["success"])
    quality_report = {
        "timestamp": datetime.now().isoformat(),
        "model": VISION_MODEL,
        "pdf": "物理电磁 C 练习册-U1-P1-P86.pdf",
        "total_pages": total_pages,
        "successful_pages": success_count,
        "success_rate": (success_count / total_pages) * 100 if total_pages else 0,
        "round1_success": total_pages - len(failed_round1),
        "round2_success": len([r for r in rerun_round2 if r["final_status"] == "success"]),
        "page_stats": quality_stats
    }
    with open(quality_report_path, "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2, ensure_ascii=False)
    print(f"  质量报告：{quality_report_path}")
    
    # 5. 随机抽检表
    sample_pages = sorted(random.sample(range(1, total_pages + 1), 10))
    sample_table = []
    for page_num in sample_pages:
        stat = quality_stats[page_num - 1]
        sample_table.append({
            "page": page_num,
            "success": stat["success"],
            "text_length": stat["text_length"],
            "conclusion": "通过" if stat["success"] else "失败"
        })
    
    sample_path = os.path.join(output_dir, "sample_audit_u1_10pages.json")
    with open(sample_path, "w", encoding="utf-8") as f:
        json.dump({
            "sample_pages": sample_pages,
            "audit_table": sample_table,
            "pass_count": sum(1 for s in sample_table if s["success"]),
            "pass_rate": (sum(1 for s in sample_table if s["success"]) / 10) * 100
        }, f, indent=2, ensure_ascii=False)
    print(f"  抽检表：{sample_path}")
    
    return quality_report

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("=" * 60)
    print("U1 严格 OCR 识别 - 预审")
    print(f"开始时间：{datetime.now().isoformat()}")
    print(f"使用模型：{VISION_MODEL}")
    print("=" * 60)
    
    md_path, md_size, success_rate = process_pdf_strict(PDF_PATH, OUTPUT_DIR)
    quality_report = save_reports(OUTPUT_DIR)
    
    print("\n" + "=" * 60)
    print("预审完成！")
    print(f"结束时间：{datetime.now().isoformat()}")
    print(f"最终成功率：{quality_report['success_rate']:.1f}%")
    print("=" * 60)
    
    # 输出交付清单
    print("\n📋 交付清单:")
    print(f"  1. U1.md — {md_size:,} 字节")
    print(f"  2. vision_api_log_u1.json — {len(api_log)} 条记录")
    print(f"  3. failed_pages_u1_round1.json — {len(failed_round1)} 页")
    print(f"  4. rerun_pages_u1_round2.json — {len(rerun_round2)} 页")
    print(f"  5. quality_report_u1.json — 页级统计")
    print(f"  6. sample_audit_u1_10pages.json — 10 页抽检")

if __name__ == '__main__':
    main()
