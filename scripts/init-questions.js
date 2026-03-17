// 练习题数据初始化脚本
import fs from 'fs';
import path from 'path';

const questions = [
  // 电场强度
  { id: 'Q001', topic: '电场强度', difficulty: '基础', type: 'MC', year: '2024', content: '关于电场强度的说法正确的是？' },
  { id: 'Q002', topic: '电场强度', difficulty: '进阶', type: 'FRQ', year: '2024', content: '求两个点电荷连线中点的电场强度' },
  { id: 'Q003', topic: '电场强度', difficulty: '基础', type: 'MC', year: '2023', content: '电场强度与试探电荷的关系' },
  { id: 'Q006', topic: '电场强度', difficulty: '综合', type: 'FRQ', year: '2023', content: '均匀电场中带电粒子的运动' },
  
  // 电势能
  { id: 'Q004', topic: '电势能', difficulty: '进阶', type: 'FRQ', year: '2024', content: '计算电荷在电场中的电势能变化' },
  { id: 'Q005', topic: '电势能', difficulty: '综合', type: 'FRQ', year: '2023', content: '电势能与动能的综合问题' },
  { id: 'Q007', topic: '电势能', difficulty: '基础', type: 'MC', year: '2024', content: '关于电势能的正负判断' },
  
  // 库仑定律
  { id: 'Q008', topic: '库仑定律', difficulty: '基础', type: 'MC', year: '2024', content: '库仑定律的适用条件' },
  { id: 'Q009', topic: '库仑定律', difficulty: '进阶', type: 'FRQ', year: '2024', content: '三个电荷的平衡问题' },
  { id: 'Q010', topic: '库仑定律', difficulty: '综合', type: 'FRQ', year: '2023', content: '库仑力与万有引力的比较' },
  
  // 电容
  { id: 'Q011', topic: '电容', difficulty: '基础', type: 'MC', year: '2024', content: '电容的定义式' },
  { id: 'Q012', topic: '电容', difficulty: '进阶', type: 'FRQ', year: '2024', content: '平行板电容器的电容计算' },
  
  // 欧姆定律
  { id: 'Q013', topic: '欧姆定律', difficulty: '基础', type: 'MC', year: '2024', content: '欧姆定律的适用范围' },
  { id: 'Q014', topic: '欧姆定律', difficulty: '进阶', type: 'FRQ', year: '2023', content: '复杂电路的等效电阻' },
  
  // 电磁感应
  { id: 'Q015', topic: '电磁感应', difficulty: '基础', type: 'MC', year: '2024', content: '感应电流的方向判断' },
  { id: 'Q016', topic: '电磁感应', difficulty: '进阶', type: 'FRQ', year: '2024', content: '楞次定律的应用' },
  { id: 'Q017', topic: '电磁感应', difficulty: '综合', type: 'FRQ', year: '2023', content: '电磁感应中的能量转化' },
];

// 索引
const indexes = {
  byTopic: {},
  byDifficulty: { '基础': [], '进阶': [], '综合': [] },
  byType: { 'MC': [], 'FRQ': [] },
  byYear: {}
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
  if (!indexes.byYear[q.year]) indexes.byYear[q.year] = [];
  indexes.byYear[q.year].push(q.id);
});

// 保存
const indexDir = './index';
fs.mkdirSync(indexDir, { recursive: true });
fs.writeFileSync(path.join(indexDir, 'questions.json'), JSON.stringify(questions, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-topic.json'), JSON.stringify(indexes.byTopic, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-difficulty.json'), JSON.stringify(indexes.byDifficulty, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-type.json'), JSON.stringify(indexes.byType, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-year.json'), JSON.stringify(indexes.byYear, null, 2));

console.log(`✅ 已导入 ${questions.length} 道练习题`);
console.log('知识点:', Object.keys(indexes.byTopic));