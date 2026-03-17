#!/usr/bin/env node
/**
 * U1-U5 练习册题目导入
 * 基于 AP Physics C 教材内容
 */

import fs from 'fs';
import path from 'path';

// U1-U5 知识点题目
const questions = [
  // ========== U1: Electrostatics ==========
  {
    id: 'U1-FRQ-01',
    topic: '电场强度',
    subTopic: '电场力',
    difficulty: '基础',
    type: 'FRQ',
    year: '2024',
    unit: 'U1',
    content: '两个点电荷 q1=+2μC 和 q2=-3μC 相距 0.1m，求它们之间的库仑力大小和方向',
    skills: ['库仑定律', '电场力计算']
  },
  {
    id: 'U1-FRQ-02',
    topic: '电场强度',
    subTopic: '电场叠加',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U1',
    content: '三个点电荷位于一条直线上：+q, -2q, +q（间距均为 d），求中间电荷处的电场强度',
    skills: ['电场叠加原理', '矢量相加']
  },
  {
    id: 'U1-FRQ-03',
    topic: '电势',
    subTopic: '电势能',
    difficulty: '基础',
    type: 'FRQ',
    year: '2024',
    unit: 'U1',
    content: '将电子从无穷远移动到距点电荷 Q=5μC 的 0.2m 处，求电势能变化',
    skills: ['电势能', '功能关系']
  },
  {
    id: 'U1-FRQ-04',
    topic: '电场强度',
    subTopic: '高斯定理',
    difficulty: '综合',
    type: 'FRQ',
    year: '2024',
    unit: 'U1',
    content: '半径为 R 的均匀带电球体（总电荷 Q），用高斯定理求距球心 r<R 处的电场强度',
    skills: ['高斯定理', '对称性']
  },
  {
    id: 'U1-MC-01',
    topic: '电场强度',
    subTopic: '基本概念',
    difficulty: '基础',
    type: 'MC',
    year: '2024',
    unit: 'U1',
    content: '关于电场强度的说法正确的是？',
    options: ['A. 电场强度是标量', 'B. 电场强度与试探电荷成反比', 'C. 电场强度是矢量', 'D. 电场强度与试探电荷无关'],
    answer: 'C'
  },

  // ========== U2: Conductors, Capacitors, Dielectrics ==========
  {
    id: 'U2-FRQ-01',
    topic: '电容',
    subTopic: '电容定义',
    difficulty: '基础',
    type: 'FRQ',
    year: '2024',
    unit: 'U2',
    content: '平行板电容器极板面积 A=0.01m²，间距 d=0.001m，求电容值',
    skills: ['电容公式', '平行板电容器']
  },
  {
    id: 'U2-FRQ-02',
    topic: '电容',
    subTopic: '能量储存',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U2',
    content: '电容器 C=10μF 充电至电压 V=100V，计算储存的电场能量',
    skills: ['电容储能公式', '电能计算']
  },
  {
    id: 'U2-FRQ-03',
    topic: '电容',
    subTopic: '串并联',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U2',
    content: '三个电容 C1=2μF, C2=3μF, C3=6μF 分别串联和并联，求等效电容',
    skills: ['串并联等效', '电容计算']
  },
  {
    id: 'U2-FRQ-04',
    topic: '电容',
    subTopic: '介质影响',
    difficulty: '综合',
    type: 'FRQ',
    year: '2024',
    unit: 'U2',
    content: '平行板电容器插入介质（κ=4），保持电荷不变，求电压变化和能量变化',
    skills: ['介质常数', '能量守恒']
  },
  {
    id: 'U2-MC-01',
    topic: '电容',
    subTopic: '基本概念',
    difficulty: '基础',
    type: 'MC',
    year: '2024',
    unit: 'U2',
    content: '平行板电容器极板间距减半，电容如何变化？',
    options: ['A. 不变', 'B. 加倍', 'C. 减半', 'D. 变为1/4'],
    answer: 'B'
  },

  // ========== U3: Electric Circuits ==========
  {
    id: 'U3-FRQ-01',
    topic: '欧姆定律',
    subTopic: '电阻计算',
    difficulty: '基础',
    type: 'FRQ',
    year: '2024',
    unit: 'U3',
    content: '电阻 R=100Ω 两端加电压 V=12V，求电流 I 和功率 P',
    skills: ['欧姆定律', '功率公式']
  },
  {
    id: 'U3-FRQ-02',
    topic: '电路',
    subTopic: '串并联',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U3',
    content: '电路如图：电源 E=10V，R1=2Ω, R2=3Ω, R3=6Ω，求等效电阻和总电流',
    skills: ['串并联分析', '基尔霍夫定律']
  },
  {
    id: 'U3-FRQ-03',
    topic: '电路',
    subTopic: 'RC 电路',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U3',
    content: 'RC 电路中 R=10kΩ, C=100μF，求时间常数 τ 和充电到 95% 所需时间',
    skills: ['RC 电路', '时间常数']
  },
  {
    id: 'U3-FRQ-04',
    topic: '电路',
    subTopic: '功率分析',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U3',
    content: '电路中 4 个相同电阻 R=10Ω 组成.square，求等效电阻和各电阻功率比',
    skills: ['等效电阻', '功率分配']
  },
  {
    id: 'U3-MC-01',
    topic: '欧姆定律',
    subTopic: '基本概念',
    difficulty: '基础',
    type: 'MC',
    year: '2024',
    unit: 'U3',
    content: '电阻两端电压加倍，电阻如何变化？',
    options: ['A. 加倍', 'B. 减半', 'C. 不变', 'D. 不确定'],
    answer: 'C'
  },

  // ========== U4: Magnetic Fields ==========
  {
    id: 'U4-FRQ-01',
    topic: '磁场',
    subTopic: '安培力',
    difficulty: '基础',
    type: 'FRQ',
    year: '2024',
    unit: 'U4',
    content: '长直导线电流 I=10A，垂直进入磁场 B=0.5T，长度 L=0.2m，求安培力大小',
    skills: ['安培力公式', '左手定则']
  },
  {
    id: 'U4-FRQ-02',
    topic: '磁场',
    subTopic: '洛伦兹力',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U4',
    content: '电子速度 v=10⁶m/s 垂直进入 B=0.1T 磁场，求回旋半径和周期',
    skills: ['洛伦兹力', '回旋运动']
  },
  {
    id: 'U4-FRQ-03',
    topic: '磁场',
    subTopic: '安培环路定理',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U4',
    content: '用安培环路定理求无限长直导线产生的磁场（B 与距离 r 的关系）',
    skills: ['安培环路定理', '磁场分布']
  },
  {
    id: 'U4-FRQ-04',
    topic: '磁场',
    subTopic: '磁场叠加',
    difficulty: '综合',
    type: 'FRQ',
    year: '2024',
    unit: 'U4',
    content: '两根平行长直导线电流 I1=I2=5A（同向），间距 d=0.1m，求中点处合磁场',
    skills: ['磁场叠加', '右手定则']
  },
  {
    id: 'U4-MC-01',
    topic: '磁场',
    subTopic: '基本概念',
    difficulty: '基础',
    type: 'MC',
    year: '2024',
    unit: 'U4',
    content: '关于磁场线的说法正确的是？',
    options: ['A. 从 N 极出发到 S 极', 'B. 磁场线是封闭曲线', 'C. 磁场线可以相交', 'D. 磁场线密度与磁场强度无关'],
    answer: 'B'
  },

  // ========== U5: Electromagnetic Induction ==========
  {
    id: 'U5-FRQ-01',
    topic: '电磁感应',
    subTopic: '法拉第定律',
    difficulty: '基础',
    type: 'FRQ',
    year: '2024',
    unit: 'U5',
    content: '线圈面积 A=0.1m²，匝数 N=100，磁场变化率 dB/dt=0.5T/s，求感应电动势',
    skills: ['法拉第定律', '感应电动势']
  },
  {
    id: 'U5-FRQ-02',
    topic: '电磁感应',
    subTopic: '楞次定律',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U5',
    content: '磁铁 N 极插入线圈，判断感应电流方向并解释',
    skills: ['楞次定律', '感应电流方向']
  },
  {
    id: 'U5-FRQ-03',
    topic: '电磁感应',
    subTopic: '自感',
    difficulty: '进阶',
    type: 'FRQ',
    year: '2024',
    unit: 'U5',
    content: '线圈自感 L=0.5H，电流从 2A 减到 0 需要 0.1s，求自感电动势',
    skills: ['自感电动势', '楞次定律']
  },
  {
    id: 'U5-FRQ-04',
    topic: '电磁感应',
    subTopic: '能量',
    difficulty: '综合',
    type: 'FRQ',
    year: '2024',
    unit: 'U5',
    content: '金属棒在磁场中滑动（v=2m/s, B=0.3T, L=0.5m），求感应电动势和焦耳热功率',
    skills: ['动生电动势', '能量转换']
  },
  {
    id: 'U5-MC-01',
    topic: '电磁感应',
    subTopic: '基本概念',
    difficulty: '基础',
    type: 'MC',
    year: '2024',
    unit: 'U5',
    content: '线圈平面与磁场方向垂直时，磁通量最大，此时感应电动势？',
    options: ['A. 最大', 'B. 最小', 'C. 为零', 'D. 无法确定'],
    answer: 'C'
  }
];

// 索引
const indexes = {
  byTopic: {},
  byDifficulty: { '基础': [], '进阶': [], '综合': [] },
  byType: { 'MC': [], 'FRQ': [] },
  byYear: { '2024': [], '2023': [], '2022': [], '2021': [] },
  byUnit: { 'U1': [], 'U2': [], 'U3': [], 'U4': [], 'U5': [] }
};

questions.forEach(q => {
  if (!indexes.byTopic[q.topic]) indexes.byTopic[q.topic] = [];
  indexes.byTopic[q.topic].push(q.id);
  indexes.byDifficulty[q.difficulty].push(q.id);
  indexes.byType[q.type].push(q.id);
  indexes.byYear[q.year].push(q.id);
  if (q.unit) indexes.byUnit[q.unit].push(q.id);
});

// 加载现有题目并合并
const indexDir = './index';
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(path.join(indexDir, 'questions.json'), 'utf8'));
} catch (e) {}

const allQuestions = [...existing, ...questions];

// 保存
fs.writeFileSync(path.join(indexDir, 'questions.json'), JSON.stringify(allQuestions, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-topic.json'), JSON.stringify(indexes.byTopic, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-difficulty.json'), JSON.stringify(indexes.byDifficulty, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-type.json'), JSON.stringify(indexes.byType, null, 2));
fs.writeFileSync(path.join(indexDir, 'by-year.json'), JSON.stringify(indexes.byYear, null, 2));

console.log(`✅ 已导入 U1-U5 共 ${questions.length} 道题目`);
console.log(`📚 总计: ${allQuestions.length} 道题目`);
console.log('\n按单元分布:');
Object.entries(indexes.byUnit).forEach(([k, v]) => console.log(`  ${k}: ${v.length} 题`));
console.log('\n按知识点分布:');
Object.entries(indexes.byTopic).forEach(([k, v]) => console.log(`  ${k}: ${v.length} 题`));