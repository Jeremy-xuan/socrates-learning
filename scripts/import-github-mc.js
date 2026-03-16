#!/usr/bin/env node
/**
 * 从 GitHub 仓库导入 U1-U5 题目
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

units.forEach(unit => {
  const mcDir = path.join(baseDir, `${unit.id}-${unit.name}/mc`);
  
  if (!fs.existsSync(mcDir)) {
    console.log(`⚠️ ${unit.id} mc 目录不存在`);
    return;
  }
  
  const files = fs.readdirSync(mcDir).filter(f => f.endsWith('.md'));
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(mcDir, file), 'utf8');
    const lines = content.split('\n');
    
    // 解析题目
    const id = file.replace('.md', '');
    const questionMatch = content.match(/#\s+(.+)/);
    const question = questionMatch ? questionMatch[1].trim() : id;
    
    // 解析选项
    const options = [];
    let answer = '';
    
    lines.forEach(line => {
      const optMatch = line.match(/^\(([A-E])\)\s+(.+)/);
      if (optMatch) {
        options.push(`${optMatch[1]}. ${optMatch[2].trim()}`);
      }
    });
    
    // 尝试确定答案（通常在题目最后）
    const answerMatch = content.match(/Answer:\s*([A-E])/i);
    if (answerMatch) {
      answer = answerMatch[1].toUpperCase();
    }
    
    allQuestions.push({
      id: `${unit.id}-MC-${id.replace('Q', '').padStart(3, '0')}`,
      topic: unit.topic,
      subTopic: unit.name,
      difficulty: '基础',
      type: 'MC',
      year: '2024',
      unit: unit.id,
      content: question,
      options: options,
      answer: answer
    });
  });
  
  console.log(`✅ ${unit.id}: ${files.length} 题`);
});

// 合并
const merged = [...existing, ...allQuestions];

// 重新索引
const indexes = { byTopic: {}, byUnit: {}, byDifficulty: { '基础': [], '进阶': [], '综合': [] }, byType: { 'MC': [], 'FRQ': [] } };
merged.forEach(x => {
  if (!indexes.byTopic[x.topic]) indexes.byTopic[x.topic] = [];
  indexes.byTopic[x.topic].push(x.id);
  if (x.unit) {
    if (!indexes.byUnit[x.unit]) indexes.byUnit[x.unit] = [];
    indexes.byUnit[x.unit].push(x.id);
  }
  indexes.byDifficulty[x.difficulty] = indexes.byDifficulty[x.difficulty] || [];
  indexes.byDifficulty[x.difficulty].push(x.id);
  indexes.byType[x.type] = indexes.byType[x.type] || [];
  indexes.byType[x.type].push(x.id);
});

// 保存
fs.writeFileSync('./index/questions.json', JSON.stringify(merged, null, 2));
fs.writeFileSync('./index/by-topic.json', JSON.stringify(indexes.byTopic, null, 2));
fs.writeFileSync('./index/by-unit.json', JSON.stringify(indexes.byUnit, null, 2));
fs.writeFileSync('./index/by-type.json', JSON.stringify(indexes.byType, null, 2));

console.log(`\n📚 总计: ${merged.length} 道题目`);
console.log('\n按单元:');
Object.entries(indexes.byUnit).forEach(([k, v]) => console.log(`  ${k}: ${v.length} 题`));