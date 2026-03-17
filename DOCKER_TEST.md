# Docker 测试指南

## ⚠️ 重要说明

**OpenClaw 运行环境：** OpenClaw 需要在宿主环境或 Discord 中运行，Docker 容器主要用于：
- 验证项目文件结构
- 提供持久化存储（状态文件/课件缓存）
- 运行辅助工具（如 PDF 转换）

**实际使用：** 在 Discord 中通过 OpenClaw 命令启动系统，容器提供后端存储支持。

---

## 🚀 快速启动

### 方式一：一键启动（推荐）

```bash
cd socrates-learning
./scripts/docker-test.sh
```

### 方式二：手动启动

```bash
# 构建镜像
docker-compose build

# 启动容器
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

---

## 📋 容器配置

| 服务 | 容器名 | 说明 |
|-----|-------|------|
| `socrates` | `socrates-learning` | 主容器，包含 OpenClaw 和项目文件 |
| `pdf-converter` | `socrates-pdf-converter` | PDF 转换工具（按需启动） |

---

## 🔧 常用命令

### 进入容器

```bash
docker-compose exec socrates sh
```

### 运行 OpenClaw 测试

```bash
# 进入容器后
openclaw status
openclaw session start
```

### 启动 PDF 转换服务

```bash
docker-compose --profile tools up pdf-converter
```

### 查看实时日志

```bash
docker-compose logs -f socrates
```

### 停止容器

```bash
docker-compose down
```

### 重启容器

```bash
docker-compose restart
```

### 重建容器（清除缓存）

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 持久化存储

以下目录已挂载到宿主机，数据持久化：

| 容器路径 | 宿主机路径 | 说明 |
|---------|-----------|------|
| `/app/teacher/runtime` | `./teacher/runtime` | 状态文件（进度/复习/错题） |
| `/app/materials/cache` | `./materials/cache` | PDF 转换缓存 |
| `/root/.gitconfig` | `~/.gitconfig` | Git 配置（用于提交） |

---

## 🧪 测试清单

### 基础测试

- [ ] 容器正常启动
- [ ] OpenClaw CLI 可用
- [ ] 项目文件完整
- [ ] 状态文件自动创建

### 功能测试

- [ ] 读取 `progress.md`
- [ ] 读取角色文档
- [ ] 读取教材章节
- [ ] 写入课后更新

### Agent 测试

- [ ] 主 Agent 启动
- [ ] 讲师 Agent 创建
- [ ] 课件阅读 Agent 创建
- [ ] Agent 间通信正常

---

## ⚠️ 故障排查

### 容器启动失败

```bash
# 查看详细日志
docker-compose logs

# 检查 Docker 状态
docker info
```

### OpenClaw 不可用

```bash
# 进入容器
docker-compose exec socrates sh

# 检查 OpenClaw 安装
openclaw --version

# 重新安装
npm install -g openclaw
```

### 文件权限问题

```bash
# 在宿主机上修复权限
chown -R $(whoami) teacher/runtime
chown -R $(whoami) materials/cache
```

---

## 📦 镜像信息

- **基础镜像：** `node:20-alpine`
- **镜像大小：** ~500MB
- **启动时间：** ~10 秒

---

## 🆘 清理

### 删除容器

```bash
docker-compose down
```

### 删除镜像

```bash
docker rmi socrates-learning_socrates
```

### 完全清理

```bash
docker-compose down -v
docker rmi socrates-learning_socrates
rm -rf teacher/runtime/*
rm -rf materials/cache/*
```

---

**负责人：** 工部尚书
**最后更新：** 2026-03-17
