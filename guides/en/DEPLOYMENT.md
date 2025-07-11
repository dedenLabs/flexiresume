# 🚀 FlexiResume Deployment Guide

This guide provides detailed instructions on how to deploy FlexiResume to various environments, including static hosting, cloud servers, containerized deployment, and more.

## 📋 Table of Contents

- [Build Preparation](#build-preparation)
- [Static Hosting Deployment](#static-hosting-deployment)
- [Cloud Server Deployment](#cloud-server-deployment)
- [Containerized Deployment](#containerized-deployment)
- [CI/CD Automation](#cicd-automation)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## 🛠️ Build Preparation

### Environment Check

Before starting the deployment, ensure your environment meets the requirements:

```bash
# Check Node.js version
node --version  # >= 16.0.0

# Check npm version  
npm --version   # >= 8.0.0

# Check project dependencies
npm audit
```

### Build Project

```bash
# Install dependencies
npm install

# Run tests (if any)
npm test

# Build production version
npm run build

# Preview build results
npm run preview
```

After building, the `docs/` directory will contain all static files.

---

## 🌐 Static Hosting Deployment

### GitHub Pages

1. **Configure GitHub Actions**

Create `.github/workflows/deploy.yml`:

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

2. **Configure Repository Settings**

- Go to repository Settings → Pages
- Source choose "Deploy from a branch"
- Branch choose "gh-pages"
- Save settings

### Vercel Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy Project**

```bash
# Login to Vercel
vercel login

# Deploy project
vercel

# Production environment deployment
vercel --prod
```

3. **Configure vercel.json**

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

### Netlify Deployment

1. **Connect via Git**

- Log in to Netlify
- Click "New site from Git"
- Choose your repository
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `docs`

2. **Configure netlify.toml**

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

## 🖥️ Cloud Server Deployment

### Nginx Deployment

1. **Install Nginx**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

2. **Configure Nginx**

Create `/etc/nginx/sites-available/flexiresume`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/flexiresume;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache policy
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA route support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

3. **Enable Site**

```bash
# Create a symbolic link
sudo ln -s /etc/nginx/sites-available/flexiresume /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

4. **Deploy Files**

```bash
# Upload build files
scp -r docs/* user@your-server:/var/www/flexiresume/

# Set permissions
sudo chown -R www-data:www-data /var/www/flexiresume
sudo chmod -R 755 /var/www/flexiresume
```

### SSL Certificate Configuration

Use Let's Encrypt free certificate:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🐳 Containerized Deployment

### Docker Deployment

1. **Create Dockerfile**

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production image
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/docs /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

2. **Build and Run**

```bash
# Build image
docker build -t flexiresume .

# Run container
docker run -d -p 80:80 --name flexiresume flexiresume

# View logs
docker logs flexiresume
```

### Docker Compose

Create `docker-compose.yml`:

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

Run:

```bash
docker-compose up -d
```

---

## 🔄 CI/CD Automation

### GitHub Actions Full Process

Create `.github/workflows/ci-cd.yml`:

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
          # Deployment script
          echo "Deploying to production..."
```

---

## ⚡ Performance Optimization

### Build Optimization

1. **Code Splitting**

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

2. **Resource Optimization**

```bash
# Image compression
npm install -g imagemin-cli
imagemin public/images/* --out-dir=public/images/optimized

# Use WebP format
cwebp input.jpg -q 80 -o output.webp
```

### Server Optimization

1. **Enable HTTP/2**

```nginx
server {
    listen 443 ssl http2;
    # ... other configurations
}
```

2. **Configure CDN**

Use Cloudflare, AWS CloudFront, or Aliyun CDN to accelerate static resources.

---

## 🤖 SEO and Search Engine Configuration

### robots.txt Configuration

FlexiResume is configured by default to **prevent search engines from crawling**, as resumes contain personal sensitive information and are usually used for targeted distribution:

```txt
# Current configuration - Prevent all search engine crawling
User-agent: *
Disallow: /
```

#### Configuration Options

**1. Fully prevent crawling (Recommended for personal resumes)**

```txt
# Prevent all search engine crawling
User-agent: *
Disallow: /
```

**2. Allow partial crawling (Suitable for public display)**

```txt
# Allow crawling, but exclude sensitive pages
User-agent: *
Allow: /
Disallow: /contact
Disallow: /private

# Specify sitemap location
Sitemap: https://your-domain.com/sitemap.xml
```

**3. Fully open (Suitable for portfolio website)**

```txt
# Allow all search engines to crawl
User-agent: *
Allow: /

# Specify sitemap location
Sitemap: https://your-domain.com/sitemap.xml
```

#### Modification Method

Edit `public/robots.txt` file and choose the configuration that suits your needs:

```bash
# Edit robots.txt
nano public/robots.txt

# Rebuild and deploy
npm run build
```

#### Scene Suggestions

| Scene | Recommended Configuration | Description |
|-------|--------------------------|------------|
| **Personal Job Resume** | Fully prevent | Protect privacy, targeted sharing |
| **Public Portfolio** | Allow partial crawling | Showcase skills, protect contact information |
| **Technical Blog** | Fully open | Increase exposure, attract opportunities |
| **Corporate Showcase** | Fully open | Enhance brand awareness |

---

## 📊 Monitoring and Maintenance

### Performance Monitoring

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

2. **Web Vitals Monitoring**

```javascript
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Monitoring

Use Sentry for error tracking:

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

## 🔧 Troubleshooting

### Common Issues

1. **404 Route Error**
   - Ensure server is configured with SPA routing fallback
   - Check if `base` configuration is correct

2. **Static Resource Loading Failure**
   - Check resource path configuration
   - Confirm CORS settings

3. **Build Failure**
   - Check Node.js version
   - Clear cache: `npm cache clean --force`

---

## 📞 Get Support

If you encounter any issues during deployment:

1. Check [GitHub Issues](https://github.com/dedenLabs/FlexiResume/issues)
2. Refer to [Usage Guide](USAGE.md)
3. Submit a new Issue or Discussion

---

<div align="center">

**Deployment Successful! 🎉**

Your FlexiResume is now successfully deployed and ready to use!

</div>




## 🌐 Language Versions

- [🇨🇳 中文版本](../zh/DEPLOYMENT.md) 
- [🇺🇸 English Version](DEPLOYMENT.md)(Current)

