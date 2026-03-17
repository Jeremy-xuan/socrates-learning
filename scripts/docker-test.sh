#!/bin/bash

# 苏格拉底 AI 家教系统 — Docker 测试脚本

set -e

echo "🏛️  苏格拉底 AI 家教系统 — Docker 测试"
echo "========================================"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose 未安装，请先安装"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build

echo ""
echo "🚀 启动容器..."
docker-compose up -d

echo ""
echo "⏳ 等待容器启动..."
sleep 5

# 检查容器状态
echo ""
echo "📊 容器状态:"
docker-compose ps

echo ""
echo "📋 容器日志:"
docker-compose logs --tail=20

echo ""
echo "========================================"
echo "✅ Docker 容器已启动！"
echo ""
echo "下一步操作:"
echo "1. 进入容器：docker-compose exec socrates sh"
echo "2. 查看日志：docker-compose logs -f"
echo "3. 停止容器：docker-compose down"
echo ""
echo "在 OpenClaw 中运行测试:"
echo '  /sessions_spawn task="启动苏格拉底物理家教系统"'
echo ""
