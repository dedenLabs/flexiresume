# 🔥 Firebase Development Environment Docker Image

[![Docker Pulls](https://img.shields.io/docker/pulls/jackchen86/firebase-dev-cn)](https://hub.docker.com/r/jackchen86/firebase-dev-cn)
[![Docker Image Size](https://img.shields.io/docker/image-size/jackchen86/firebase-dev-cn/latest)](https://hub.docker.com/r/jackchen86/firebase-dev-cn)
[![Docker Image Version](https://img.shields.io/docker/v/jackchen86/firebase-dev-cn?sort=semver)](https://hub.docker.com/r/jackchen86/firebase-dev-cn)

Integrated Firebase development environment Docker image, solving issues like slow network access and complex configuration.

## 🌟 Core Features

- ✅ **China Network Optimization**: Configured with domestic mirror sources, download speed improved by 10x+
- ✅ **Firebase CLI**: Pre-installed latest Firebase CLI and all emulators
- ✅ **Complete Development Tools**: Includes nodemon, pm2, webpack, jest and other common tools
- ✅ **Proxy Support**: Built-in proxy environment variables, supports enterprise network environments
- ✅ **Multi-port Support**: Exposes all common ports for Firebase and development servers
- ✅ **Security Design**: Uses non-root user, follows security best practices
- ✅ **Ready to Use**: Start complete development environment with one command

## 🚀 Quick Start

### Basic Usage

```bash
# Pull the image
docker pull jackchen86/firebase-dev-cn:latest

# Persist login state
docker volume create firebase-config

# Quick start development environment
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

### Using Docker Compose (Recommended)

> **Persist Login State**
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
      - "8080:8080"    # Firestore Emulator
      - "8085:8085"    # Auth Emulator
      - "9000:9000"    # Database Emulator
      - "9005:9005"    # Firebase Login Verification Callback Port
      - "9099:9099"    # Storage Emulator
      - "4000:4000"    # Emulator UI
      - "5173:5173"    # Vite Development Server
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

### Enterprise Proxy Environment

```bash
# Persist login state
docker volume create firebase-config

# If you need to use proxy
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

## 🛠️ Included Tools

### Firebase Tools
- **Firebase CLI**: Latest version, supports all Firebase services
- **Firebase Emulators**: Hosting, Functions, Firestore, Auth, Database, Storage, Pub/Sub

### Development Tools
- **Node.js**: v20 LTS version
- **npm**: Latest version, configured with domestic mirror sources
- **Development Servers**: nodemon, pm2, http-server, live-server
- **Build Tools**: webpack, webpack-cli
- **Testing Tools**: jest
- **Code Quality**: eslint, prettier

### System Tools
- **Version Control**: git
- **Network Tools**: curl, wget
- **Editors**: vim, nano
- **System Monitoring**: htop, tree
- **Java Runtime**: OpenJDK 11 (required for Firebase emulators)

## 📋 Port Description

| Port | Service | Description |
|------|---------|-------------|
| 5000 | Firebase Hosting | Static website hosting |
| 5001 | Firebase Functions | Cloud functions |
| 8080 | Firestore Emulator | NoSQL database |
| 8085 | Auth Emulator | User authentication |
| 9000 | Database Emulator | Realtime database |
| 9005 | Firebase Login Verification Callback Port | Login verification |
| 9099 | Storage Emulator | File storage |
| 4000 | Emulator UI | Unified management interface |
| 5173-5180 | Development Server | Vite/Webpack etc. |

## 🌏 China Optimization Details

### Mirror Source Optimization
- **Alpine Linux**: Uses USTC mirror source
- **npm**: Uses npmmirror.com mirror source
- **Node.js**: Uses domestic CDN accelerated download

### Network Optimization
- **Pre-configured Proxy Variables**: Supports http_proxy, https_proxy
- **DNS Optimization**: Configured with domestic DNS resolution
- **Timeout Settings**: Optimized timeout settings for domestic network environment

## 📖 Usage Tutorial

### 1. Create Firebase Project

```bash
# Execute after entering container
firebase login
firebase init
```

### 2. Start Development Server

```bash
# Start Hosting
firebase serve --only hosting

# Start all emulators
firebase emulators:start
```

### 3. Deploy Project

```bash
# Build project
npm run build

# Deploy to Firebase
firebase deploy
```

## 🔧 Common Issues

### Q: How to use on Windows?
A: Recommend using WSL2 or Docker Desktop, mount paths using Linux format.

### Q: How to persist Firebase login state?
A: Mount Firebase configuration directory:
```bash
docker volume create firebase-config
... -v firebase-config:/home/firebase/.config  jackchen86/firebase-dev-cn:latest
```

### Q: How to customize npm mirror source?
A: Execute after entering container:
```bash
npm config set registry https://your-registry.com/
```

### Q: What to do with port conflicts?
A: Modify port mapping:
```bash
-p 15000:5000  # Map local port 15000 to container port 5000
```

## 📊 Performance Comparison

| Operation | Native Environment | This Image | Improvement |
|-----------|-------------------|------------|-------------|
| npm install | 5-10 minutes | 1-2 minutes | 5x+ |
| Firebase CLI Installation | 2-5 minutes | Ready to use | Infinite |
| Emulator Startup | 30-60 seconds | 10-15 seconds | 3x+ |
| Project Initialization | Complex configuration | One-click start | 10x+ |

## 🤝 Support & Feedback

- **GitHub**: [Project Repository](https://github.com/your-repo/firebase-docker-cn)
- **Issues**: [Issue Feedback](https://github.com/your-repo/firebase-docker-cn/issues)
- **Documentation**: [Detailed Tutorial](https://github.com/your-repo/firebase-docker-cn/tree/main/docs)

## 📄 License

MIT License - Free to use, contributions welcome

---

**🔥 Make Firebase development easier, make developers more efficient!**

If this image helps you, please give a ⭐Star for support!
