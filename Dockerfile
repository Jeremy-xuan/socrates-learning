# 苏格拉底 AI 家教系统 — Docker 镜像
# 用途：验证项目文件结构 + 提供持久化存储
# 注意：OpenClaw 实际运行在宿主或 Discord 中

FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装 Git（用于克隆仓库和 Git 操作）
RUN apk add --no-cache git

# 复制项目文件
COPY . .

# 复制项目文件
COPY . .

# 创建运行时目录（挂载点）
RUN mkdir -p teacher/runtime materials/cache

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD test -d /app/teacher && test -d /app/materials || exit 1

# 默认命令：保持容器运行
CMD ["tail", "-f", "/dev/null"]
