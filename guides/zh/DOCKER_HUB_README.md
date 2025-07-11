# 🔥 Firebase开发环境Docker镜像

[![Docker Pulls](https://img.shields.io/docker/pulls/jackchen86/firebase-dev-cn)](https://hub.docker.com/r/jackchen86/firebase-dev-cn)
[![Docker Image Size](https://img.shields.io/docker/image-size/jackchen86/firebase-dev-cn/latest)](https://hub.docker.com/r/jackchen86/firebase-dev-cn)
[![Docker Image Version](https://img.shields.io/docker/v/jackchen86/firebase-dev-cn?sort=semver)](https://hub.docker.com/r/jackchen86/firebase-dev-cn)

集成Firebase开发环境Docker镜像，解决网络访问慢、配置复杂等问题。

## 🌟 核心特性

- ✅ **国内网络优化**: 配置了国内镜像源，下载速度提升10倍+
- ✅ **Firebase CLI**: 预装最新版Firebase CLI和所有模拟器
- ✅ **开发工具齐全**: 包含nodemon、pm2、webpack、jest等常用工具
- ✅ **代理支持**: 内置代理环境变量，支持企业网络环境
- ✅ **多端口支持**: 暴露Firebase和开发服务器所有常用端口
- ✅ **安全设计**: 使用非root用户，符合安全最佳实践
- ✅ **即开即用**: 一条命令启动完整开发环境

## 🚀 快速开始

### 基本使用

```bash
# 拉取镜像
docker pull jackchen86/firebase-dev-cn:latest

# 持久化登入状态
docker volume create firebase-config

# 快速启动开发环境
docker run -it --rm \
  -p 5000:5000 \
  -p 5001:5001 \
  -p 8080:8080 \
  -p 4000:4000 \
  -p 9005:9005 \
  -v $(pwd):/workspace \
  -v firebase-config:/home/firebase/.config \
  jackchen86/firebase-dev-cn:latest
```

### 使用Docker Compose（推荐）

> **持久化登入状态**
> docker volume create firebase-config

---

```yaml
version: '3.8'
services:
  firebase-dev:
    image: jackchen86/firebase-dev-cn:latest
    ports:
      - "5000:5000"    # Firebase Hosting
      - "5001:5001"    # Firebase Functions
      - "8080:8080"    # Firestore模拟器
      - "8085:8085"    # Auth模拟器
      - "9000:9000"    # Database模拟器
      - "9005:9005"    # Firebase 登入验证回调端口
      - "9099:9099"    # Storage模拟器
      - "4000:4000"    # 模拟器UI
      - "5173:5173"    # Vite开发服务器
    volumes:
      - .:/workspace
    environment:
      - NODE_ENV=development
    tty: true
    stdin_open: true

volumes:
  firebase-config:
    external: true
```

### 企业代理环境

```bash
# 持久化登入状态
docker volume create firebase-config

# 如果需要使用代理
docker run -it --rm \
  -e http_proxy=http://proxy.company.com:8080 \
  -e https_proxy=http://proxy.company.com:8080 \
  -p 5000:5000 \
  -p 5001:5001 \
  -p 8080:8080 \
  -p 4000:4000 \
  -p 9005:9005 \
  -v $(pwd):/workspace \
  -v firebase-config:/home/firebase/.config \
  jackchen86/firebase-dev-cn:latest
```

## 🛠️ 包含的工具

### Firebase工具
- **Firebase CLI**: 最新版本，支持所有Firebase服务
- **Firebase模拟器**: Hosting、Functions、Firestore、Auth、Database、Storage、Pub/Sub

### 开发工具
- **Node.js**: v20 LTS版本
- **npm**: 最新版本，配置国内镜像源
- **开发服务器**: nodemon、pm2、http-server、live-server
- **构建工具**: webpack、webpack-cli
- **测试工具**: jest
- **代码质量**: eslint、prettier

### 系统工具
- **版本控制**: git
- **网络工具**: curl、wget
- **编辑器**: vim、nano
- **系统监控**: htop、tree
- **Java运行时**: OpenJDK 11 (Firebase模拟器需要)

## 📋 端口说明

| 端口 | 服务 | 说明 |
|------|------|------|
| 5000 | Firebase Hosting | 静态网站托管 |
| 5001 | Firebase Functions | 云函数 |
| 8080 | Firestore模拟器 | NoSQL数据库 |
| 8085 | Auth模拟器 | 用户认证 |
| 9000 | Database模拟器 | 实时数据库 |
| 9005 | Firebase 登入验证回调端口 | 登入验证 |
| 9099 | Storage模拟器 | 文件存储 |
| 4000 | 模拟器UI | 统一管理界面 |
| 5173-5180 | 开发服务器 | Vite/Webpack等 |

## 🌏 国内优化详情

### 镜像源优化
- **Alpine Linux**: 使用中科大镜像源
- **npm**: 使用npmmirror.com镜像源
- **Node.js**: 使用国内CDN加速下载

### 网络优化
- **预配置代理变量**: 支持http_proxy、https_proxy
- **DNS优化**: 配置国内DNS解析
- **超时设置**: 针对国内网络环境优化超时时间

## 📖 使用教程

### 1. 创建Firebase项目

```bash
# 进入容器后执行
firebase login
firebase init
```

### 2. 启动开发服务器

```bash
# 启动Hosting
firebase serve --only hosting

# 启动所有模拟器
firebase emulators:start
```

### 3. 部署项目

```bash
# 构建项目
npm run build

# 部署到Firebase
firebase deploy
```

## 🔧 常见问题

### Q: 如何在Windows上使用？
A: 推荐使用WSL2或Docker Desktop，挂载路径使用Linux格式。

### Q: 如何持久化Firebase登录状态？
A: 挂载Firebase配置目录：
```bash
docker volume create firebase-config
... -v firebase-config:/home/firebase/.config  jackchen86/firebase-dev-cn:latest
```

### Q: 如何自定义npm镜像源？
A: 进入容器后执行：
```bash
npm config set registry https://your-registry.com/
```

### Q: 端口冲突怎么办？
A: 修改端口映射：
```bash
-p 15000:5000  # 将本地15000端口映射到容器5000端口
```

## 📊 性能对比

| 操作 | 原生环境 | 本镜像 | 提升 |
|------|----------|--------|------|
| npm install | 5-10分钟 | 1-2分钟 | 5倍+ |
| Firebase CLI安装 | 2-5分钟 | 即开即用 | 无限 |
| 模拟器启动 | 30-60秒 | 10-15秒 | 3倍+ |
| 项目初始化 | 复杂配置 | 一键启动 | 10倍+ |

## 🤝 支持与反馈

- **GitHub**: [项目地址](https://github.com/your-repo/firebase-docker-cn)
- **Issues**: [问题反馈](https://github.com/your-repo/firebase-docker-cn/issues)
- **文档**: [详细教程](https://github.com/your-repo/firebase-docker-cn/tree/main/docs)

## 📄 许可证

MIT License - 自由使用，欢迎贡献

---

**🔥 让Firebase开发更简单，让开发者更高效！**

如果这个镜像对您有帮助，请给个⭐Star支持一下！
