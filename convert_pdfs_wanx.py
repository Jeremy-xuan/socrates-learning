#!/usr/bin/env python3
"""
使用 Wanx-v1 视觉模型 API 识别扫描版 PDF
必须使用 wanx-v1 模型 - 陛下旨意
"""
import os
import sys
import base64
import json
import time
import fitz  # PyMuPDF
from datetime import datetime
from dashscope import MultiModalConversation

DASHSCOPE_API_KEY = "sk-ce013fbefe7a41d796b0717cd2b070f6"

# API 调用日志
api_log = []

def log_api_call(model, page, status, pdf_name):
    """记录 API 调用"""
    api_log.append({
        "timestamp": datetime.now().isoformat(),
        "model": model,
        "pdf": pdf_name,
        "page": page,
        "status": status
    })

def pdf_to_images(pdf_path, output_dir):
    """将 PDF 转换为图片"""
    os.makedirs(output_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    image_paths = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        mat = fitz.Matrix(2, 2)  # 2 倍缩放
        pix = page.get_pixmap(matrix=mat)
        
        img_path = os.path.join(output_dir, f"page_{page_num + 1:03d}.png")
        pix.save(img_path)
        image_paths.append(img_path)
    
    doc.close()
    return image_paths

def recognize_with_wanx(image_path, pdf_name, page_num):
    """使用 Wanx-v1 识别图片"""
    try:
        # 使用 base64 编码图片
        with open(image_path, "rb") as f:
            image_base64 = base64.b64encode(f.read()).decode("utf-8")
        image_uri = f"data:image/png;base64,{image_base64}"
        
        messages = [{
            "role": "user",
            "content": [
                {"image": image_uri},
                {"text": "请识别这张图片中的所有文字内容，包括公式和符号。如果是物理题目，请完整保留题目内容和格式。"}
            ]
        }]
        
        response = MultiModalConversation.call(
            model="wanx-v1",
            messages=messages,
            api_key=DASHSCOPE_API_KEY
        )
        
        if response.status_code == 200:
            log_api_call("wanx-v1", page_num, "success", pdf_name)
            return response.output.choices[0].message.content[0]["text"]
        else:
            log_api_call("wanx-v1", page_num, f"error_{response.code}", pdf_name)
            print(f"  API 错误：{response.code} - {response.message}")
            return None
            
    except Exception as e:
        log_api_call("wanx-v1", page_num, f"exception_{str(e)[:50]}", pdf_name)
        print(f"  识别错误：{e}")
        return None

def process_pdf(pdf_path, output_md_path):
    """处理单个 PDF 文件"""
    fname = os.path.basename(pdf_path)
    print(f"处理：{fname}")
    
    # 创建临时目录存放图片
    temp_dir = os.path.join(os.path.dirname(output_md_path), "temp_wanx_images")
    
    # 转换 PDF 为图片
    image_paths = pdf_to_images(pdf_path, temp_dir)
    print(f"  转换为 {len(image_paths)} 张图片")
    
    # 逐页识别
    md_content = f"# {fname}\n\n"
    success_count = 0
    failed_pages = []
    
    for i, img_path in enumerate(image_paths, 1):
        print(f"  识别第 {i}/{len(image_paths)} 页...", end=" ", flush=True)
        text = recognize_with_wanx(img_path, fname, i)
        
        if text:
            md_content += f"## 第 {i} 页\n\n{text}\n\n"
            success_count += 1
            print("完成")
        else:
            md_content += f"## 第 {i} 页\n\n[识别失败]\n\n"
            failed_pages.append(i)
            print("失败")
    
    # 保存结果
    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    # 清理临时图片
    import shutil
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    size = os.path.getsize(output_md_path)
    rate = (success_count / len(image_paths)) * 100 if image_paths else 0
    print(f"  -> 保存：{output_md_path} ({size:,} 字节) | 成功率：{rate:.1f}% ({success_count}/{len(image_paths)})")
    
    return {
        "pdf": fname,
        "output": output_md_path,
        "size": size,
        "total_pages": len(image_paths),
        "success_pages": success_count,
        "failed_pages": failed_pages,
        "success_rate": rate
    }

def save_api_log(output_dir):
    """保存 API 调用日志"""
    log_path = os.path.join(output_dir, "wanx_api_log.json")
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(api_log, f, indent=2, ensure_ascii=False)
    print(f"\nAPI 日志已保存：{log_path}")
    return log_path

def main():
    if len(sys.argv) < 3:
        print("用法：python3 convert_pdfs_wanx.py <input_dir> <output_dir>")
        sys.exit(1)
    
    input_dir = sys.argv[1]
    output_dir = sys.argv[2]
    
    os.makedirs(output_dir, exist_ok=True)
    
    # 获取所有 PDF 文件
    files = sorted([f for f in os.listdir(input_dir) if f.endswith('.pdf')])
    
    if not files:
        print(f"在 {input_dir} 中未找到 PDF 文件")
        sys.exit(0)
    
    print(f"找到 {len(files)} 个 PDF 文件\n")
    print(f"开始时间：{datetime.now().isoformat()}")
    print("=" * 60)
    
    results = []
    errors = []
    
    for i, fname in enumerate(files, 1):
        input_path = os.path.join(input_dir, fname)
        output_fname = os.path.splitext(fname)[0] + ".md"
        output_path = os.path.join(output_dir, output_fname)
        
        print(f"\n[{i}/{len(files)}]", end=" ")
        try:
            result = process_pdf(input_path, output_path)
            results.append(result)
        except Exception as e:
            print(f"  -> 错误：{e}")
            errors.append((fname, str(e)))
    
    # 保存 API 日志
    save_api_log(output_dir)
    
    # 汇总报告
    print("\n" + "=" * 60)
    print("=== 转换完成 ===")
    print(f"结束时间：{datetime.now().isoformat()}")
    print(f"成功：{len(results)}/{len(files)}")
    
    total_pages = sum(r["total_pages"] for r in results) if results else 0
    total_success = sum(r["success_pages"] for r in results) if results else 0
    overall_rate = (total_success / total_pages) * 100 if total_pages else 0
    
    print(f"总页数：{total_pages}")
    print(f"成功页数：{total_success}")
    print(f"总体成功率：{overall_rate:.2f}%")
    
    if errors:
        print(f"失败文件：{len(errors)}")
        for fname, err in errors:
            print(f"  - {fname}: {err}")
    
    # 详细结果
    print("\n=== 详细结果 ===")
    for r in results:
        status = "✅" if r["success_rate"] == 100 else "⚠️"
        print(f"{status} {r['pdf']}: {r['success_pages']}/{r['total_pages']} ({r['success_rate']:.1f}%)")
        if r["failed_pages"]:
            print(f"   失败页：{r['failed_pages'][:10]}{'...' if len(r['failed_pages']) > 10 else ''}")
    
    # 保存汇总报告
    report = {
        "timestamp": datetime.now().isoformat(),
        "model": "wanx-v1",
        "total_files": len(files),
        "successful_files": len(results),
        "failed_files": len(errors),
        "total_pages": total_pages,
        "successful_pages": total_success,
        "overall_success_rate": overall_rate,
        "results": results,
        "errors": errors
    }
    
    report_path = os.path.join(output_dir, "wanx_conversion_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"\n汇总报告已保存：{report_path}")

if __name__ == '__main__':
    main()
