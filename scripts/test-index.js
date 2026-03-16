// 练习题索引系统 - 演示脚本
// 按知识点/难度/题型/年份索引

import fs from 'fs';
import path from 'path';

class QuestionIndex {
  constructor(baseDir = './index') {
    this.baseDir = baseDir;
    this.questions = [];
    this.indexes = {
      byTopic: {},
      byDifficulty: {},
      byType: {},
      byYear: {}
    };
  }

  // 添加题目
  addQuestion(question) {
    const { id, topic, difficulty, type, year } = question;
    
    this.questions.push(question);
    this.indexQuestion(question);
  }

  // 索引单题
  indexQuestion({ id, topic, difficulty, type, year }) {
    // 按知识点
    if (!this.indexes.byTopic[topic]) this.indexes.byTopic[topic] = [];
    this.indexes.byTopic[topic].push(id);
    
    // 按难度
    if (!this.indexes.byDifficulty[difficulty]) this.indexes.byDifficulty[difficulty] = [];
    this.indexes.byDifficulty[difficulty].push(id);
    
    // 按题型
    if (!this.indexes.byType[type]) this.indexes.byType[type] = [];
    this.indexes.byType[type].push(id);
    
    // 按年份
    if (!this.indexes.byYear[year]) this.indexes.byYear[year] = [];
    this.indexes.byYear[year].push(id);
  }

  // 查询
  search(query = {}) {
    let result = this.questions.map(q => q.id);
    
    if (query.topic) {
      result = result.filter(id => 
        this.indexes.byTopic[query.topic]?.includes(id)
      );
    }
    if (query.difficulty) {
      result = result.filter(id => 
        this.indexes.byDifficulty[query.difficulty]?.includes(id)
      );
    }
    if (query.type) {
      result = result.filter(id => 
        this.indexes.byType[query.type]?.includes(id)
      );
    }
    if (query.year) {
      result = result.filter(id => 
        this.indexes.byYear[query.year]?.includes(id)
      );
    }
    
    return result;
  }

  // 保存索引
  save() {
    fs.mkdirSync(this.baseDir, { recursive: true });
    fs.writeFileSync(
      path.join(this.baseDir, 'questions.json'),
      JSON.stringify(this.questions, null, 2)
    );
    fs.writeFileSync(
      path.join(this.baseDir, 'by-topic.json'),
      JSON.stringify(this.indexes.byTopic, null, 2)
    );
    console.log('[索引] 已保存到', this.baseDir);
  }
}

// 演示
const index = new QuestionIndex();

// 添加模拟题目
const sampleQuestions = [
  { id: 'Q001', topic: '电场强度', difficulty: '基础', type: 'MC', year: '2024' },
  { id: 'Q002', topic: '电场强度', difficulty: '进阶', type: 'FRQ', year: '2024' },
  { id: 'Q003', topic: '电场强度', difficulty: '基础', type: 'MC', year: '2023' },
  { id: 'Q004', topic: '电势能', difficulty: '进阶', type: 'FRQ', year: '2024' },
  { id: 'Q005', topic: '电势能', difficulty: '综合', type: 'FRQ', year: '2023' },
];

sampleQuestions.forEach(q => index.addQuestion(q));

// 查询测试
console.log('\n[测试] 查询"电场强度"相关题目:');
console.log(index.search({ topic: '电场强度' }));

console.log('\n[测试] 查询"电场强度" + 基础难度:');
console.log(index.search({ topic: '电场强度', difficulty: '基础' }));

// 保存
index.save();

console.log('\n✅ 索引系统测试完成');