# 苏格拉底学习系统 - 完善需求文档

## 项目概述

**项目名称**：苏格拉底式AI家教系统  
**GitHub仓库**：https://github.com/Jeremy-xuan/socrates-learning  
**学科**：AP Physics C: Electricity and Magnetism（电磁学）  
**目标用户**：准备AP物理C考试的高中生

---

## 当前架构

### 角色系统
| 角色 | 职责 | 文件位置 |
|------|------|---------|
| 红莉栖 | 物理教学 | `teacher/characters/kurisu.md` |
| 公生 | 数学辅导 | `teacher/characters/kousei.md` |
| 蕾娜 | 学习监督 | `teacher/characters/lena.md` |

### 学习内容
- **U1**: Electrostatics（静电学）- ✅ 已转换
- **U2**: Conductors（导体）- ✅ 已转换
- **U3**: Circuits（电路）- ✅ 已转换
- **U4**: Magnetic Fields（磁场）- ✅ 已转换
- **U5**: Electromagnetism（电磁感应）- ✅ 已转换

### 配置文件
- `teacher/config/system.md` - 教学规则
- `teacher/config/learner_profile.md` - 学习者画像
- `teacher/config/curriculum.md` - 课程大纲
- `teacher/story.md` - 故事线

---

## 待完善任务（优先级排序）

### 🔴 P0 - 紧急

#### 1. 练习册OCR问题修复
**问题**：当前题目存储只有文字，没有图片，CC会幻想答案  
**需求**：
- 每道题目的Markdown里添加图片引用
- 图片路径格式：`![题目](./images/page_XX.png)`
- 确保图片和文字一一对应

**涉及文件**：
- `U1-Electrostatics/mc/*.md`
- `U2-Conductors/mc/*.md`
- `U3-Circuits/mc/*.md`
- `U4-MagneticFields/mc/*.md`
- `U5-Electromagnetism/mc/*.md`

---

#### 2. 多Agent架构升级
**问题**：当前没有调度层，红莉栖自己干所有活  
**需求**：参考boluobobo AI朝廷架构

**新增角色**：
- **司礼监**（调度）：负责任务分配，不自己执行
- **内阁**（优化）：负责Prompt优化和执行计划生成
- **都察院**（审查）：负责代码/内容审查

**修改文件**：
- `teacher/config/system.md` - 添加内阁前置流程
- 新增 `teacher/config/court_architecture.md`

---

### 🟡 P1 - 重要

#### 3. 题目索引完善
**问题**：U1有55道题，但没有索引目录  
**需求**：
- 每个Unit添加 `index.md`，包含：
  - 知识点列表（链接到`knowledge/`）
  - 题目列表（链接到`mc/`和`frq/`）
  - 难度标注（基础/进阶/综合）

---

#### 4. FRQ题目整理
**问题**：FRQ（自由回答题）散落在各处  
**需求**：
- 统一存放到 `FRQ/` 目录
- 按年份组织：`2018/`, `2019/`, `2021/`, `2022/`
- 每题包含：题目图片 + 评分标准 + 示例答案

---

#### 5. 学习者画像完善
**问题**：`learner_profile.md`信息不完整  
**需求**：
- 补充当前学习进度（哪个Unit学到哪了）
- 补充薄弱知识点（根据错题记录）
- 补充考试时间线（AP考试日期）

---

### 🟢 P2 - 优化

#### 6. 微信群聊系统
**需求**：
- 完善 `teacher/runtime/wechat_group.md`
- 添加群聊规则：允许跑题、角色之间有摩擦
- 添加历史对话存档

---

#### 7. 错题本系统
**需求**：
- 完善 `teacher/runtime/mistake_log.md`
- 添加错题归类（按知识点）
- 添加复习队列（艾宾浩斯遗忘曲线）

---

#### 8. 学习日记系统
**需求**：
- 完善 `teacher/runtime/diary.md`
- 每日学习总结模板
- 自动记录学习时长和进度

---

## 技术约束

### 图片存储
- 不要删除现有图片文件
- 新图片存放到对应Unit的`images/`目录
- 使用相对路径引用

### 文件命名规范
- Markdown：小写+连字符，如`electric-field.md`
- 图片：`page-XX.png`或`q-XX.png`
- 题目：`Q01.md`或`mc-01.md`

### 兼容性
- 保持现有文件结构不变
- 新增文件不要破坏现有引用

---

## 交付标准

### 必须完成（今晚）
- [ ] 所有题目添加图片引用
- [ ] 多Agent架构配置完成
- [ ] 每个Unit的index.md完善

### 争取完成
- [ ] FRQ整理完成
- [ ] learner_profile.md更新
- [ ] 错题本系统完善

---

## 联系方式

有问题在GitHub Issues提，或者钉钉群里@我。

**服务器**：已部署OpenClaw + AI朝廷架构  
**交互平台**：钉钉群（清一太极国学专业一班）

---

_文档版本：v1.0  
创建时间：2026-03-15  
最后更新：2026-03-15_
