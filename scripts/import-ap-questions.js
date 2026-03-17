#!/usr/bin/env node
/**
 * 练习册题目导入脚本
 * 从 AP Physics C 真题提取题目到索引系统
 */

import fs from 'fs';
import path from 'path';

// AP Physics C 2021 真题
const questions = [
  // Question 1: 电路 - 电容 + 电阻
  {
    id: 'AP2021-E&M-Q1-a',
    topic: '电路',
    subTopic: '电容充电',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '计算开关关闭后瞬间通过 R1 的电流（电容初始未充电）',
    parts: ['计算电流', '稳态电位差', '计算电荷', '开关打开后的电流', '画电压-时间图']
  },
  {
    id: 'AP2021-E&M-Q1-b',
    topic: '电路',
    subTopic: '稳态电路',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '计算稳态时 R1 两端的电位差'
  },
  {
    id: 'AP2021-E&M-Q1-c',
    topic: '电路',
    subTopic: '电容串联',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '计算电容器 C2 正极板上的电荷，并比较 C3 与 C2 的电荷大小'
  },
  {
    id: 'AP2021-E&M-Q1-d',
    topic: '电路',
    subTopic: '电容放电',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '开关打开后计算 R1 和 R2 的电流'
  },
  {
    id: 'AP2021-E&M-Q1-e',
    topic: '电路',
    subTopic: 'RC 电路',
    difficulty: '综合',
    type: 'FRQ',
    year: '2021',
    content: '画电容器 C2 两端电压随时间变化的图像'
  },
  {
    id: 'AP2021-E&M-Q1-f',
    topic: '电路',
    subTopic: '等效电容',
    difficulty: '综合',
    type: 'FRQ',
    year: '2021',
    content: 'C3 替换为两个串联的 10μF 电容，分析电压随时间变化曲线'
  },

  // Question 2: 库仑定律
  {
    id: 'AP2021-E&M-Q2-a',
    topic: '库仑定律',
    subTopic: '点电荷力',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '分析 F 与 1/d² 的关系，计算电荷 Q 的值'
  },
  {
    id: 'AP2021-E&M-Q2-b',
    topic: '库仑定律',
    subTopic: '电荷泄漏',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '分析电荷泄漏是否可以解释实验偏差'
  },
  {
    id: 'AP2021-E&M-Q2-c',
    topic: '库仑定律',
    subTopic: '极化效应',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '分析导体极化对实验结果的影响'
  },
  {
    id: 'AP2021-E&M-Q2-d',
    topic: '库仑定律',
    subTopic: '异种电荷',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '分析异性电荷与同性电荷情况下力的大小关系'
  },

  // Question 3: 电磁感应
  {
    id: 'AP2021-E&M-Q3-a',
    topic: '电磁感应',
    subTopic: '法拉第定律',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '推导感应电流 I 与时间 t 的函数关系'
  },
  {
    id: 'AP2021-E&M-Q3-b',
    topic: '电磁感应',
    subTopic: '能量耗散',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '计算 1s 到 2s 期间环内耗散的 electrical energy'
  },
  {
    id: 'AP2021-E&M-Q3-c',
    topic: '电磁感应',
    subTopic: '磁通量',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2021',
    content: '分析环平面与磁场夹角变化时能量耗散的变化'
  },
  {
    id: 'AP2021-E&M-Q3-d',
    topic: '电磁感应',
    subTopic: '旋转感应',
    difficulty: '综合',
    type: 'FRQ',
    year: '2021',
    content: '计算旋转环的角速度 ω'
  },
  {
    id: 'AP2021-E&M-Q3-e',
    topic: '电磁感应',
    subTopic: '感应电动势',
    difficulty: '综合',
    type: 'FRQ',
    year: '2021',
    content: '计算感应电动势的最大值 emax'
  },
  {
    id: 'AP2021-E&M-Q3-f',
    topic: '电磁感应',
    subTopic: '感应电动势',
    difficulty: '综合',
    type: 'FRQ',
    year: '2021',
    content: '分析角速度加倍时感应电动势图像的变化'
  }
];

// 索引
const indexes = {
  byTopic: {},
  byDifficulty: { '基础': [], '进阶': [], '综合': [] },
  byType: { 'MC': [], 'FRQ': [] },
  byYear: { '2021': [], '2022': [], '2023': [], '2024': [] },
  bySubTopic: {}
};

questions.forEach(q => {
  // 按知识点
  if (!indexes.byTopic[q.topic]) indexes.byTopic[q.topic] = [];
  indexes.byTopic[q.topic].push(q.id);
  
  // 按难度
  indexes.byDifficulty[q.difficulty].push(q.id);
  
  // 按题型
  indexes.byType[q.type].push(q.id);
  
  // 按年份
  indexes.byYear[q.year].push(q.id);
  
  // 按子主题
  if (!indexes.bySubTopic[q.subTopic]) indexes.bySubTopic[q.subTopic] = [];
  indexes.bySubTopic[q.subTopic].push(q.id);
});

// 保存到索引目录
const indexDir = './index';
fs.mkdirSync(indexDir, { recursive: true });

// 合并现有题目
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(path.join(indexDir, 'questions.json'), 'utf8'));
} catch (e) {}

const allQuestions = [...existing, ...questions];

fs.writeFileSync(path.join(indexDir, 'questions.json'), JSON.stringify(allQuestions, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-topic.json'), JSON.stringify(indexes.byTopic, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-difficulty.json'), JSON.stringify(indexes.byDifficulty, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-type.json'), JSON.stringify(indexes.byType, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-year.json'), JSON.stringify(indexes.byYear, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-subtopic.json'), JSON.stringify(indexes.bySubTopic, null, 2));

console.log(`✅ 已导入 ${questions.length} 道 AP 真题`);
console.log(`📚 总计: ${allQuestions.length} 道题目`);
console.log('\n知识点分布:');
Object.entries(indexes.byTopic).forEach(([k, v]) => console.log(`  ${k}: ${v.length} 题`));