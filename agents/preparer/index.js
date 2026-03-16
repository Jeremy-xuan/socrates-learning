// 预习官 Agent - 课前预习，自动翻阅课件、总结知识点、推荐题目
// 依赖: 工部图片理解 API (Qwen-VL + PaddleOCR), 索引系统

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const CONFIG = {
  materialsDir: './materials/讲义',
  workbookDir: './materials/练习册',
  outputDir: './teacher/runtime/preview',
  indexDir: './index',
  // 工部图片理解 API 配置
  imageApiUrl: process.env.IMAGE_API_URL || 'http://localhost:8080/api/understand'
};

class PreparerAgent {
  constructor(config = {}) {
    this.config = { ...CONFIG, ...config };
  }

  // 预习主流程
  async prepare(knowledgePoint) {
    console.log(`[预习官] 开始预习: ${knowledgePoint}`);
    
    // 1. 查找对应课件
    const slides = await this.readSlides(knowledgePoint);
    if (!slides) {
      return { error: `未找到课件: ${knowledgePoint}` };
    }

    // 2. 调用工部图片理解 API 解析课件
    const parsed = await this.parseSlides(slides);
    
    // 3. 总结核心概念
    const summary = this.summarize(parsed);
    
    // 4. 提取典型例题
    const examples = this.extractExamples(parsed);
    
    // 5. 识别易错点
    const mistakes = this.identifyMistakes(parsed);
    
    // 6. 从练习册推荐相关题目
    const recommendations = await this.recommendQuestions(knowledgePoint);
    
    // 7. 输出到 preview 目录
    const result = {
      knowledgePoint,
      summary,
      examples,
      mistakes,
      recommendations,
      timestamp: new Date().toISOString()
    };

    await this.saveOutput(knowledgePoint, result);
    return result;
  }

  // 读取课件文件
  async readSlides(topic) {
    const pdfPath = path.join(this.config.materialsDir, `${topic}.pdf`);
    
    if (!fs.existsSync(pdfPath)) {
      console.log(`[预习官] 课件不存在: ${pdfPath}，使用模拟数据`);
      // 课件不存在时返回虚拟路径，parseSlides 会使用模拟数据
      return `mock://${topic}`;
    }
    
    return pdfPath;
  }

  // 调用工部图片理解 API 解析课件
  async parseSlides(slidesPath) {
    if (!slidesPath || slidesPath.startsWith('mock://')) {
      console.log(`[预习官] 使用模拟数据`);
      return this.getMockData();
    }
    
    console.log(`[预习官] 调用工部图片理解 API: ${slidesPath}`);
    
    try {
      // 调用 Python 桥接脚本
      const result = await new Promise((resolve, reject) => {
        const py = spawn('python3', [
          'scripts/image-api-bridge.py', 'parse', slidesPath
        ], { cwd: '/root/.openclaw/workspace-bingbu' });
        
        let output = '';
        py.stdout.on('data', d => output += d);
        py.stderr.on('data', d => console.log('[OCR]', d.toString()));
        py.on('close', code => {
          if (code === 0) resolve(JSON.parse(output));
          else reject(new Error(`Python exited ${code}`));
        });
      });
      
      console.log(`[预习官] 解析完成`);
      return result;
    } catch (e) {
      console.log(`[预习官] API 调用失败，使用模拟数据: ${e.message}`);
      return this.getMockData();
    }
  }

  // 模拟数据（工部服务未就绪时使用）
  getMockData() {
    return {
      pages: [
        { text: '电场强度', formulas: ['E = F/q'], knowledge_points: ['电场强度定义'] },
        { text: '库仑定律', formulas: ['F = kQq/r²'], knowledge_points: ['库仑定律'] }
      ],
      text: '电场强度 定义：试探电荷在电场中某点所受电场力与试探电荷量的比值...',
      formulas: ['E = F/q', 'E = kQ/r²', 'E = U/d'],
      knowledge_points: ['电场强度', '库仑定律', '电势']
    };
  }

  // 总结核心概念
  summarize(parsed) {
    if (!parsed) {
      return { coreConcepts: [], formulas: [], keyPoints: [] };
    }
    
    return {
      coreConcepts: parsed.knowledge_points || [],
      formulas: parsed.formulas || [],
      keyPoints: parsed.text ? parsed.text.slice(0, 200).split('。').filter(Boolean) : []
    };
  }

  // 提取典型例题
  extractExamples(parsed) {
    if (!parsed || !parsed.pages) return [];
    
    // 从课件页面中提取例题
    const examples = [];
    parsed.pages.forEach((page, i) => {
      if (page.text && page.text.includes('例')) {
        examples.push({
          page: i + 1,
          content: page.text,
          formulas: page.formulas || []
        });
      }
    });
    
    // 如果没有找到例题，返回模拟数据
    if (examples.length === 0) {
      return [{
        title: `典型例题：${parsed.knowledge_points?.[0] || '电场强度'}`,
        content: '详见课件内容',
        solution: '见课堂讲解'
      }];
    }
    
    return examples;
  }

  // 识别易错点
  identifyMistakes(parsed) {
    // 基于知识点预定义易错点
    const mistakeDB = {
      '电场强度': [
        '混淆电场强度与电势的概念',
        '忘记电场强度是矢量，需要考虑方向',
        '库仑常数 k 取值错误（应为 9×10⁹ N·m²/C²）',
        '计算时忘记试探电荷 q 的正负'
      ],
      '电势能': [
        '电势能是标量，但有正负',
        '混淆电势能与电场力的功',
        '零势能面选择不当'
      ],
      '库仑定律': [
        '忘记库仑力是矢量，需满足平行四边形定则',
        '混淆作用力与反作用力',
        '距离趋近于零时库仑力趋向无穷大（物理上不成立）'
      ]
    };
    
    const topics = parsed?.knowledge_points || [];
    let mistakes = [];
    
    topics.forEach(topic => {
      if (mistakeDB[topic]) {
        mistakes = [...mistakes, ...mistakeDB[topic]];
      }
    });
    
    // 默认易错点
    if (mistakes.length === 0) {
      mistakes = ['理解概念定义', '注意公式适用条件', '区分相似概念'];
    }
    
    return [...new Set(mistakes)]; // 去重
  }

  // 推荐练习题
  async recommendQuestions(topic) {
    const index = this.loadIndex();
    if (!index) return [];
    return index.search({ topic });
  }

  // 加载索引
  loadIndex() {
    try {
      const byTopic = JSON.parse(
        fs.readFileSync(path.join(this.config.indexDir, 'by-topic.json'), 'utf8')
      );
      const questions = JSON.parse(
        fs.readFileSync(path.join(this.config.indexDir, 'questions.json'), 'utf8')
      );
      return {
        search: (query) => {
          const ids = byTopic[query.topic] || [];
          return ids.map(id => questions.find(q => q.id === id)).filter(Boolean);
        }
      };
    } catch (e) {
      console.log('[预习官] 索引未建立');
      return null;
    }
  }

  // 保存输出
  async saveOutput(topic, data) {
    const outputPath = path.join(this.config.outputDir, `${topic}.json`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`[预习官] 输出已保存: ${outputPath}`);
  }
}

// CLI 入口
async function main() {
  const topic = process.argv[2] || '电场强度';
  const agent = new PreparerAgent();
  const result = await agent.prepare(topic);
  console.log(JSON.stringify(result, null, 2));
}

export { PreparerAgent };
export default PreparerAgent;