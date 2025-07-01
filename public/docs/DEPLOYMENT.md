# 🚀 FlexiResume 部署指南

本指南将详细介绍如何将 FlexiResume 部署到各种环境中，包括静态托管、云服务器、容器化部署等多种方式。

## 📋 目录

- [构建准备](#构建准备)
- [静态托管部署](#静态托管部署)
- [云服务器部署](#云服务器部署)
- [容器化部署](#容器化部署)
- [CI/CD 自动化](#cicd-自动化)
- [性能优化](#性能优化)
- [监控和维护](#监控和维护)

---

## 🛠️ 构建准备

### 环境检查

在开始部署之前，确保您的环境满足要求：

```bash
# 检查 Node.js 版本
node --version  # >= 16.0.0

# 检查 npm 版本  
npm --version   # >= 8.0.0

# 检查项目依赖
npm audit
```

### 构建项目

```bash
# 安装依赖
npm install

# 运行测试（如果有）
npm test

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建完成后，`docs/` 目录将包含所有静态文件。

---

## 🌐 静态托管部署

### GitHub Pages

1. **配置 GitHub Actions**

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
```

2. **配置仓库设置**

- 进入仓库 Settings → Pages
- Source 选择 "Deploy from a branch"
- Branch 选择 "gh-pages"
- 保存设置

### Vercel 部署

1. **安装 Vercel CLI**

```bash
npm i -g vercel
```

2. **部署项目**

```bash
# 登录 Vercel
vercel login

# 部署项目
vercel

# 生产环境部署
vercel --prod
```

3. **配置 vercel.json**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "docs"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Netlify 部署

1. **通过 Git 连接**

- 登录 Netlify
- 点击 "New site from Git"
- 选择您的仓库
- 配置构建设置：
  - Build command: `npm run build`
  - Publish directory: `docs`

2. **配置 netlify.toml**

```toml
[build]
  publish = "docs"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 🖥️ 云服务器部署

### Nginx 部署

1. **安装 Nginx**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. **配置 Nginx**

创建 `/etc/nginx/sites-available/flexiresume`：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/flexiresume;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

3. **启用站点**

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/flexiresume /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

4. **部署文件**

```bash
# 上传构建文件
scp -r docs/* user@your-server:/var/www/flexiresume/

# 设置权限
sudo chown -R www-data:www-data /var/www/flexiresume
sudo chmod -R 755 /var/www/flexiresume
```

### SSL 证书配置

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🐳 容器化部署

### Docker 部署

1. **创建 Dockerfile**

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产镜像
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/docs /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

2. **构建和运行**

```bash
# 构建镜像
docker build -t flexiresume .

# 运行容器
docker run -d -p 80:80 --name flexiresume flexiresume

# 查看日志
docker logs flexiresume
```

### Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  flexiresume:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/var/log/nginx
```

运行：

```bash
docker-compose up -d
```

---

## 🔄 CI/CD 自动化

### GitHub Actions 完整流程

创建 `.github/workflows/ci-cd.yml`：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run linting
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: docs/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: docs/
          
      - name: Deploy to server
        run: |
          # 部署脚本
          echo "Deploying to production..."
```

---

## ⚡ 性能优化

### 构建优化

1. **代码分割**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['styled-components'],
          utils: ['lodash', 'dayjs']
        }
      }
    }
  }
})
```

2. **资源优化**

```bash
# 图片压缩
npm install -g imagemin-cli
imagemin public/images/* --out-dir=public/images/optimized

# 使用 WebP 格式
cwebp input.jpg -q 80 -o output.webp
```

### 服务器优化

1. **启用 HTTP/2**

```nginx
server {
    listen 443 ssl http2;
    # ... 其他配置
}
```

2. **配置 CDN**

使用 CloudFlare、AWS CloudFront 或阿里云 CDN 加速静态资源。

---

## 🤖 SEO 和搜索引擎配置

### robots.txt 配置

FlexiResume 默认配置为**禁止搜索引擎抓取**，因为简历包含个人敏感信息，通常用于定向投放：

```txt
# 当前配置 - 禁止所有搜索引擎抓取
User-agent: *
Disallow: /
```

#### 配置选项

**1. 完全禁止抓取（推荐用于个人简历）**

```txt
# 禁止所有搜索引擎抓取
User-agent: *
Disallow: /
```

**2. 允许部分抓取（适用于公开展示）**

```txt
# 允许抓取，但排除敏感页面
User-agent: *
Allow: /
Disallow: /contact
Disallow: /private

# 指定sitemap位置
Sitemap: https://your-domain.com/sitemap.xml
```

**3. 完全开放（适用于作品集网站）**

```txt
# 允许所有搜索引擎抓取
User-agent: *
Allow: /

# 指定sitemap位置
Sitemap: https://your-domain.com/sitemap.xml
```

#### 修改方法

编辑 `public/robots.txt` 文件，选择适合您需求的配置：

```bash
# 编辑robots.txt
nano public/robots.txt

# 重新构建和部署
npm run build
```

#### 使用场景建议

| 场景 | 推荐配置 | 说明 |
|------|----------|------|
| **个人求职简历** | 完全禁止 | 保护个人隐私，定向分享 |
| **公开作品集** | 允许部分抓取 | 展示技能，保护联系方式 |
| **技术博客** | 完全开放 | 提高曝光度，吸引机会 |
| **企业展示** | 完全开放 | 提升品牌知名度 |

---

## 📊 监控和维护

### 性能监控

1. **Google Analytics**

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. **Web Vitals 监控**

```javascript
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 错误监控

使用 Sentry 进行错误追踪：

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

---

## 🔧 故障排除

### 常见问题

1. **路由 404 错误**
   - 确保服务器配置了 SPA 路由回退
   - 检查 `base` 配置是否正确

2. **静态资源加载失败**
   - 检查资源路径配置
   - 确认 CORS 设置

3. **构建失败**
   - 检查 Node.js 版本
   - 清除缓存：`npm cache clean --force`

---

## 📞 获取支持

如果在部署过程中遇到问题：

1. 查看 [GitHub Issues](https://github.com/dedenLabs/FlexiResume/issues)
2. 参考 [使用教程](USAGE.md)
3. 提交新的 Issue 或 Discussion

---

<div align="center">

**部署成功！🎉**

现在您的 FlexiResume 已经成功部署，可以开始使用了！

</div>
