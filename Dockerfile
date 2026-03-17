# 苏格拉底 AI 家教系统 — Docker 测试镜像
# 用途：验证项目文件结构 + 运行测试

FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装 Git 和运行时依赖
RUN apk add --no-cache git curl

# 复制项目文件
COPY . .

# 创建运行时目录
RUN mkdir -p teacher/runtime materials/cache

# 初始化状态文件
RUN echo "# 学习进度\n\n待开始" > teacher/runtime/progress.md && \
    echo "# 复习队列\n\n暂无待复习内容" > teacher/runtime/review_queue.md && \
    echo "# 错题本\n\n暂无错题记录" > teacher/runtime/mistake_log.md && \
    echo "# 会话日志\n" > teacher/runtime/session_log.md

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD test -d /app/teacher && test -f /app/teacher/runtime/progress.md || exit 1

# 默认命令：运行对话模拟测试
CMD ["sh", "-c", "/app/scripts/simulate-conversation.sh"]
