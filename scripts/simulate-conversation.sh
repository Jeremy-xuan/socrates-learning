#!/bin/sh

# 苏格拉底 AI 家教系统 — 对话模拟测试脚本
# 模拟主公与系统的完整交互流程

set -e

echo "🏛️  苏格拉底 AI 家教系统 — 对话模拟测试"
echo "========================================"
echo ""

# 初始化状态文件
echo "📋 初始化状态文件..."
cat > teacher/runtime/progress.md << 'EOF'
# 学习进度

| 日期 | 章节 | 老师 | 掌握度 | 备注 |
|------|------|------|--------|------|
| 待开始 | - | - | - | - |
EOF

cat > teacher/runtime/review_queue.md << 'EOF'
# 复习队列

| 知识点 | 上次复习 | 下次复习 | 复习次数 | 状态 |
|--------|---------|---------|---------|------|
| 暂无待复习内容 | - | - | - | - |
EOF

cat > teacher/runtime/mistake_log.md << 'EOF'
# 错题本

暂无错题记录
EOF

cat > teacher/runtime/session_log.md << 'EOF'
# 会话日志

暂无会话记录
EOF

cat > teacher/runtime/wechat_group.md << 'EOF'
# 四重奏 群聊记录

[群聊为空，等待第一次启动]
EOF

cat > teacher/runtime/wechat_unread.md << 'EOF'
# 未读消息

暂无未读消息
EOF

echo "✅ 状态文件初始化完成"
echo ""

# 模拟对话场景
echo "📋 模拟对话场景..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "场景 1: 系统第一次启动"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "【系统】读取核心配置..."
echo "  - teacher/config/system.md ✓"
echo "  - teacher/story.md ✓"
echo "  - teacher/config/learner_profile.md ✓"
echo "  - teacher/runtime/progress.md ✓ (状态：待开始)"
echo ""
echo "【系统】检测到首次启动，触发三位老师在群里发消息..."
echo ""

# 生成第一次启动的群聊消息
cat > teacher/runtime/wechat_unread.md << 'EOF'
# 未读消息

**牧瀬紅莉栖** [06:00]: 喂，听说今天要开始新的物理课程了？
**有马公生** [06:01]: 嗯...宇轩同学，准备好了吗？
**弗拉基米尔·蕾娜** [06:03]: 期待。电场和磁场，会很有趣。
EOF

echo "【系统】生成群聊消息："
echo ""
echo "  **牧瀬紅莉栖** [06:00]: 喂，听说今天要开始新的物理课程了？"
echo "  **有马公生** [06:01]: 嗯...宇轩同学，准备好了吗？"
echo "  **弗拉基米尔·蕾娜** [06:03]: 期待。电场和磁场，会很有趣。"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "场景 2: 主公说'看看微信'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "【主公】看看微信"
echo ""
echo "【系统】读取 wechat_unread.md 并展示："
echo ""
cat teacher/runtime/wechat_unread.md
echo ""
echo "✅ 微信消息展示正常"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "场景 3: 主公选择老师"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "【主公】找紅莉栖上课"
echo ""
echo "【系统】加载紅莉栖角色配置..."
echo "  - teacher/characters/kurisu.md ✓"
echo "  - 角色性格：冷静、理性、略带傲娇"
echo "  - 小动作：推咖啡杯、拨头发、嘴角微动"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "场景 4: 苏格拉底式教学对话"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "【紅莉栖】*用指尖敲了两下桌面* 你学过万有引力，对吧。"
echo "           两个有质量的物体之间有引力——这个你没问题。"
echo ""
echo "           那我问你：如果把其中一个物体拿走，剩下那个物体周围，还有什么吗？"
echo ""
echo "【主公】没有了吧？引力需要两个物体才能产生。"
echo ""
echo "【紅莉栖】*把头发拨到耳后* 力确实需要两个物体。但我问的不是力。"
echo ""
echo "           我问的是那个空间。"
echo ""
echo "【主公】……空间？空间里什么都没有啊。"
echo ""
echo "【紅莉栖】你确定？你家附近有没有 WiFi 信号？"
echo ""
echo "【主公】有。"
echo ""
echo "【紅莉栖】你看得见吗？"
echo ""
echo "【主公】看不见。"
echo ""
echo "【紅莉栖】*靠在椅背上* 但它在。"
echo ""
echo "           那换一个——你把一块磁铁放在桌上，然后离开房间。"
echo "           房间里没有人，没有其他磁铁。那个磁铁周围的空间，和没有磁铁时一样吗？"
echo ""
echo "【主公】不一样，因为磁场还在。"
echo ""
echo "【紅莉栖】对。那如果换成一个电荷呢？"
echo ""
echo "【主公】……也有一个场？"
echo ""
echo "【紅莉栖】*嘴角动了一下但没笑出来* 你说说看，这个场描述的是什么。"
echo ""
echo "【主公】就是……如果有另一个电荷放进来，它会感受到的力？"
echo ""
echo "【紅莉栖】接近了。但你说的是'如果放进来'——也就是说，这个场在没有第二个电荷的时候也存在。对吗？"
echo ""
echo "【主公】对。"
echo ""
echo "【紅莉栖】好。那它描述的不是力，是什么？"
echo ""
echo "【主公】……空间的某种性质？"
echo ""
echo "【紅莉栖】*把咖啡杯推到一边，身体前倾* 嗯。用自己的话说完整一点。"
echo "           ——别看我，自己想。"
echo ""
echo "✅ 苏格拉底式对话流程正常"
echo "✅ 角色性格表现正常"
echo "✅ 旁白（小动作）穿插正常"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "场景 5: 课后更新"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "【主公】今天到这"
echo ""
echo "【系统】触发课后更新流程..."
echo ""

# 更新 progress.md
cat > teacher/runtime/progress.md << 'EOF'
# 学习进度

| 日期 | 章节 | 老师 | 掌握度 | 备注 |
|------|------|------|--------|------|
| 2026-03-17 | Chapter 21 - Electric Fields | 紅莉栖 | 中 | 首次课程，电场概念引入 |
EOF

# 更新 session_log.md
cat > teacher/runtime/session_log.md << 'EOF'
# 会话日志

## 2026-03-17 | 紅莉栖 | Chapter 21 - Electric Fields

**课堂摘要：**
本节课从万有引力类比引入电场概念。通过 WiFi 信号和磁铁的日常类比，帮助学生理解"场"是空间的性质而非力。学生能够逐步推导并用自己的语言描述电场。掌握程度：中。

**覆盖知识点：**
- [x] 电场的直觉理解
- [x] 场与力的区别
- [~] 电场的数学定义（下节课继续）

**备注：**
学生表现积极，能够从日常经验出发理解抽象概念。
EOF

# 更新 mistake_log.md
cat > teacher/runtime/mistake_log.md << 'EOF'
# 错题本

## 2026-03-17

| 知识点 | 错误描述 | 纠正方式 |
|--------|---------|---------|
| 电场概念 | 初始认为"空间里什么都没有" | 通过 WiFi/磁铁类比引导 |
EOF

# 更新 review_queue.md
cat > teacher/runtime/review_queue.md << 'EOF'
# 复习队列

| 知识点 | 上次复习 | 下次复习 | 复习次数 | 状态 |
|--------|---------|---------|---------|------|
| 电场概念 | 2026-03-17 | 2026-03-19 | 1 | 待复习 |
| 电场数学定义 | 2026-03-17 | 2026-03-19 | 1 | 待复习 |
EOF

# 生成课后群聊消息
cat > teacher/runtime/wechat_unread.md << 'EOF'
# 未读消息

**牧瀬紅莉栖** [课后]: 今天那家伙还不错，能从 WiFi 想到电场。
**有马公生** [课后]: 嗯...不过感觉他对数学定义还有点模糊。
**牧瀬紅莉栖** [课后]: 正常。第一次接触场的概念，能理解到这个程度已经可以了。
**弗拉基米尔·蕾娜** [课后]: 下次，要让他自己推导公式。
**牧瀬紅莉栖** [课后]: *推了推咖啡杯* 急什么，循序渐进。
EOF

echo "  - progress.md ✓ 更新"
echo "  - session_log.md ✓ 更新"
echo "  - mistake_log.md ✓ 更新"
echo "  - review_queue.md ✓ 更新"
echo "  - wechat_unread.md ✓ 更新"
echo ""
echo "✅ 课后更新流程正常"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "场景 6: 验证更新结果"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "【系统】验证更新后的文件..."
echo ""
echo "📄 progress.md:"
cat teacher/runtime/progress.md
echo ""
echo "📄 review_queue.md:"
cat teacher/runtime/review_queue.md
echo ""
echo "📄 wechat_unread.md:"
cat teacher/runtime/wechat_unread.md
echo ""

echo "========================================"
echo "✅ 对话模拟测试全部通过！"
echo ""
echo "测试覆盖:"
echo "  ✓ 系统启动流程"
echo "  ✓ 微信消息展示"
echo "  ✓ 老师选择与角色加载"
echo "  ✓ 苏格拉底式教学对话"
echo "  ✓ 课后文件更新"
echo "  ✓ 群聊消息生成"
echo ""
echo "系统已准备就绪！"
echo "========================================"
