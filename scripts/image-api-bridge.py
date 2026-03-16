#!/usr/bin/env python3
"""
工部图片理解 API - Python 桥接脚本
供兵部预习官 Agent 调用
"""

import os
import sys
import json
import base64

# 环境变量
API_KEY = os.getenv("DASHSCOPE_API_KEY")
PADDLEOCR_PATH = os.getenv("PADDLEOCR_MODEL_PATH", "/root/.openclaw/models/paddleocr")


def call_qwen_vl(image_path: str, prompt: str = "描述这张图片") -> dict:
    """调用 Qwen-VL 理解图片"""
    import requests
    
    url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # 图片转 base64
    with open(image_path, "rb") as f:
        img_data = base64.b64encode(f.read()).decode()
    
    payload = {
        "model": "qwen-vl-max",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"image": f"data:image/jpeg;base64,{img_data}"},
                    {"text": prompt}
                ]
            }
        ]
    }
    
    resp = requests.post(url, headers=headers, json=payload)
    return resp.json()


def call_paddleocr(image_path: str) -> dict:
    """调用 PaddleOCR 识别文字"""
    from paddleocr import PaddleOCR
    
    ocr = PaddleOCR(use_angle_cls=True, lang='ch', model_dir=PADDLEOCR_PATH)
    result = ocr.ocr(image_path, cls=True)
    
    texts = []
    for line in result[0]:
        texts.append({"text": line[1][0], "confidence": line[1][1]})
    
    return {"texts": texts}


def parse_slides(pdf_path: str) -> dict:
    """解析课件 PDF"""
    import pdf2image
    
    # PDF 转图片
    images = pdf2image.convert_from_path(pdf_path)
    
    all_texts = []
    all_formulas = []
    knowledge_points = []
    
    for i, img in enumerate(images):
        img_path = f"/tmp/slide_{i}.jpg"
        img.save(img_path)
        
        # OCR 文字识别
        ocr_result = call_paddleocr(img_path)
        all_texts.extend([t["text"] for t in ocr_result["texts"]])
        
        # AI 理解（提取公式和知识点）
        ai_result = call_qwen_vl(
            img_path,
            "提取其中的公式和知识点，用中文回复"
        )
        
        # 解析 AI 响应...
    
    return {
        "pages": len(images),
        "text": "\n".join(all_texts),
        "formulas": all_formulas,
        "knowledge_points": knowledge_points
    }


# CLI 入口
if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "parse"
    file_path = sys.argv[2] if len(sys.argv) > 2 else ""
    
    if action == "parse":
        result = parse_slides(file_path)
    elif action == "ocr":
        result = call_paddleocr(file_path)
    elif action == "vl":
        prompt = sys.argv[3] if len(sys.argv) > 3 else "描述这张图片"
        result = call_qwen_vl(file_path, prompt)
    else:
        result = {"error": "unknown action"}
    
    print(json.dumps(result, ensure_ascii=False))