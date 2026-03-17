// 练习题索引系统
// 按知识点/难度/题型/年份索引

const fs = require('fs');
const path = require('path');

class QuestionIndex {
  constructor(baseDir = './index') {
    this.baseDir = baseDir;
    this.indexes = {
      byTopic: {},      // 按知识点
      byDifficulty: {}, // 按难度: 基础/进阶/综合
      byType: {},       // 按题型: MC/FRQ
      byYear: {}        // 按年份
    };
  }

  // 索引一道题
  indexQuestion(question) {
    const { id, topic, difficulty, type, year } = question;
    
    // 按知识点索引
    if (!this.indexes.byTopic[topic]) {
      this.indexes.byTopic[topic] = [];
    }
    this.indexes.byTopic[topic].push(id);
    
    // 按难度索引
    if (!this.indexes.byDifficulty[difficulty]) {
      this.indexes.byDifficulty[difficulty] = [];
    }
    this.indexes.byDifficulty[difficulty].push(id);
    
    // 按题型索引
    if (!this.indexes.byType[type]) {
      this.indexes.byType[type] = [];
    }
    this.indexes.byType[type].push(id);
    
    // 按年份索引
    if (!this.indexes.byYear[year]) {
      this.indexes.byYear[year] = [];
    }
    this.indexes.byYear[year].push(id);
  }

  // 查询题目
  search({ topic, difficulty, type, year }) {
    let result = null;
    
    if (topic) {
      result = this.indexes.byTopic[topic] || [];
    }
    if (difficulty) {
      result = result 
        ? result.filter(id => this.indexes.byDifficulty[difficulty]?.includes(id))
        : this.indexes.byDifficulty[difficulty] || [];
    }
    if (type) {
      result = result
        ? result.filter(id => this.indexes.byType[type]?.includes(id))
        : this.indexes.byType[type] || [];
    }
    if (year) {
      result = result
        ? result.filter(id => this.indexes.byYear[year]?.includes(id))
        : this.indexes.byYear[year] || [];
    }
    
    return result || [];
  }

  // 保存索引
  save() {
    fs.writeFileSync(
      path.join(this.baseDir, 'by-topic.json'),
      JSON.stringify(this.indexes.byTopic, null, 2)
    );
    fs.writeFileSync(
      path.join(this.baseDir, 'by-difficulty.json'),
      JSON.stringify(this.indexes.byDifficulty, null, 2)
    );
    fs.writeFileSync(
      path.join(this.baseDir, 'by-type.json'),
      JSON.stringify(this.indexes.byType, null, 2)
    );
    fs.writeFileSync(
      path.join(this.baseDir, 'by-year.json'),
      JSON.stringify(this.indexes.byYear, null, 2)
    );
  }

  // 加载索引
  load() {
    try {
      this.indexes.byTopic = JSON.parse(
        fs.readFileSync(path.join(this.baseDir, 'by-topic.json'))
      );
      this.indexes.byDifficulty = JSON.parse(
        fs.readFileSync(path.join(this.baseDir, 'by-difficulty.json'))
      );
      this.indexes.byType = JSON.parse(
        fs.readFileSync(path.join(this.baseDir, 'by-type.json'))
      );
      this.indexes.byYear = JSON.parse(
        fs.readFileSync(path.join(this.baseDir, 'by-year.json'))
      );
    } catch (e) {
      console.log('索引文件不存在，将创建新索引');
    }
  }
}

module.exports = QuestionIndex;