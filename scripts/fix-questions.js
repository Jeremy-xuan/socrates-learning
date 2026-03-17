#!/usr/bin/env node
/**
 * 修复题目内容 - 重新导入 U1-U5 题目，保留完整内容
 */

import fs from 'fs';
import path from 'path';

const baseDir = '/tmp/test-clone';
const units = [
  { id: 'U1', name: 'Electrostatics', topic: '电场' },
  { id: 'U2', name: 'Conductors', topic: '电容' },
  { id: 'U3', name: 'Circuits', topic: '电路' },
  { id: 'U4', name: 'MagneticFields', topic: '磁场' },
  { id: 'U5', name: 'Electromagnetism', topic: '电磁感应' }
];

const allQuestions = [];

// 读取现有题目
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync('./index/questions.json', 'utf8'));
} catch (e) {}

// 过滤掉之前导入的不完整题目
const filtered = existing.filter(q => !q.id.startsWith('U') || q.content.length > 20);

units.forEach(unit => {
  const mcDir = path.join(baseDir, `${unit.id}-${unit.name}/mc`);
  
  if (!fs.existsSync(mcDir)) {
    console.log(`⚠️ ${unit.id} mc 目录不存在`);
    return;
  }
  
  const files = fs.readdirSync(mcDir).filter(f => f.endsWith('.md'));
  
  files.forEach(file => {
    const fullContent = fs.readFileSync(path.join(mcDir, file), 'utf8');
    const lines = fullContent.split('\n');
    
    // 解析题目 ID
    const id = file.replace('.md', '');
    
    // 提取题目正文（排除标题和选项）
    let questionContent = '';
    const options = [];
    let isOptionsStarted = false;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // 跳过标题行
      if (trimmed.startsWith('# ')) {
        return;
      }
      
      // 选项行
      const optMatch = trimmed.match(/^\(([A-E])\)\s+(.+)/);
      if (optMatch) {
        options.push(`${optMatch[1]}. ${optMatch[2]}`);
        isOptionsStarted = true;
        return;
      }
      
      // 非选项、非空行，作为题目内容
      if (!isOptionsStarted && trimmed !== '' && !trimmed.startsWith('//')) {
        questionContent += trimmed + ' ';
      }
    });
    
    questionContent = questionContent.trim();
    
    // 题目内容为空则跳过
    if (questionContent.length < 5) {
      return;
    }
    
    // 确定难度（根据题目长度和复杂度）
    let difficulty = '基础';
    if (questionContent.length > 200) difficulty = '进阶';
    if (questionContent.includes('explain') || questionContent.includes('derive')) difficulty = '综合';
    
    allQuestions.push({
      id: `${unit.id}-MC-${id.replace('Q', '').padStart(3, '0')}`,
      topic: unit.topic,
      subTopic: unit.name,
      difficulty: difficulty,
      type: 'MC',
      year: '2024',
      unit: unit.id,
      content: questionContent,
      options: options,
      answer: '' // 待用户作答
    });
  });
  
  console.log(`✅ ${unit.id}: ${allQuestions.filter(q => q.unit === unit.id).length} 题`);
});

// 合并：保留非 U 开头的题目 + 新导入的完整题目
const merged = [...filtered.filter(q => !q.id.startsWith('U')), ...allQuestions];

// 重新索引
const indexes = { 
  byTopic: {}, 
  byUnit: {}, 
  byDifficulty: { '基础': [], '进阶': [], '综合': [] }, 
  byType: { 'MC': [], 'FRQ': [] } 
};

merged.forEach(x => {
  if (!indexes.byTopic[x.topic]) indexes.byTopic[x.topic] = [];
  indexes.byTopic[x.topic].push(x.id);
  if (x.unit) {
    if (!indexes.byUnit[x.unit]) indexes.byUnit[x.unit] = [];
    indexes.byUnit[x.unit].push(x.id);
  }
  if (indexes.byDifficulty[x.difficulty]) {
    indexes.byDifficulty[x.difficulty].push(x.id);
  }
  if (indexes.byType[x.type]) {
    indexes.byType[x.type].push(x.id);
  }
});

// 保存
fs.writeFileSync('./index/questions.json', JSON.stringify(merged, null, 2));
fs.writeFileSync('./index/by-topic.json', JSON.stringify(indexes.byTopic, null, 2));
fs.writeFileSync('./index/by-unit.json', JSON.stringify(indexes.byUnit, null, 2));
fs.writeFileSync('./index/by-type.json', JSON.stringify(indexes.byType, null, 2));

console.log(`\n📚 总计: ${merged.length} 道题目`);

// 显示示例
console.log('\n=== 题目示例 ===');
const sample = merged.find(q => q.unit === 'U1' && q.options.length > 0);
if (sample) {
  console.log('ID:', sample.id);
  console.log('内容:', sample.content.slice(0, 100) + '...');
  console.log('选项数:', sample.options.length);
}