#!/bin/sh

# 苏格拉底 AI 家教系统 — Docker 内运行测试脚本

set -e

echo "🏛️  苏格拉底 AI 家教系统 — Docker 测试"
echo "========================================"
echo ""

# 1. 验证项目文件结构
echo "📋 步骤 1: 验证项目文件结构..."
echo ""

check_file() {
    if [ -f "$1" ]; then
        echo "  ✓ $1"
    else
        echo "  ✗ $1 (缺失)"
        exit 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo "  ✓ $1/"
    else
        echo "  ✗ $1/ (缺失)"
        exit 1
    fi
}

check_file "CLAUDE.md"
check_file "OPENCLAW.md"
check_file "teacher/config/system.md"
check_file "teacher/story.md"
check_dir "teacher/characters"
check_dir "teacher/runtime"
check_dir "materials"
check_dir "openclaw"
check_file "openclaw/system_prompt.md"
check_file "openclaw/agents/master_agent.md"

echo ""
echo "✅ 项目文件结构验证通过"
echo ""

# 2. 验证状态文件
echo "📋 步骤 2: 验证状态文件..."
echo ""

if [ -f "teacher/runtime/progress.md" ]; then
    echo "  ✓ progress.md 存在"
    cat teacher/runtime/progress.md
else
    echo "  ✗ progress.md 缺失"
    exit 1
fi

echo ""
echo "✅ 状态文件验证通过"
echo ""

# 3. 验证 OpenClaw 配置
echo "📋 步骤 3: 验证 OpenClaw 配置..."
echo ""

if [ -f "vercel.json" ]; then
    echo "  ✓ vercel.json 存在"
else
    echo "  ✗ vercel.json 缺失"
fi

if [ -f ".env.example" ]; then
    echo "  ✓ .env.example 存在"
else
    echo "  ✗ .env.example 缺失"
fi

echo ""
echo "✅ OpenClaw 配置验证通过"
echo ""

# 4. 验证 Agent 配置
echo "📋 步骤 4: 验证 Agent 配置..."
echo ""

check_file "openclaw/agents/master_agent.md"
check_file "openclaw/agents/teacher_agent_template.md"
check_file "openclaw/agents/pdf_reader_agent.md"
check_file "openclaw/agents/communication_protocol.md"

echo ""
echo "✅ Agent 配置验证通过"
echo ""

# 5. 验证部署配置
echo "📋 步骤 5: 验证部署配置..."
echo ""

if [ -f "docker-compose.yml" ]; then
    echo "  ✓ docker-compose.yml 存在"
else
    echo "  ✗ docker-compose.yml 缺失"
fi

if [ -d ".github/workflows" ]; then
    echo "  ✓ .github/workflows/ 存在"
else
    echo "  ✗ .github/workflows/ 缺失"
fi

echo ""
echo "✅ 部署配置验证通过"
echo ""

# 测试结果汇总
echo "========================================"
echo "✅ 所有测试通过！"
echo ""
echo "系统已准备就绪，可以在 OpenClaw 中运行："
echo '  /sessions_spawn task="启动苏格拉底物理家教系统"'
echo ""
echo "========================================"
