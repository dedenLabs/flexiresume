# FlexiResume Deployment Guide

This guide provides detailed instructions on how to deploy FlexiResume to various environments, including static hosting, cloud servers, containerized deployment, and more.

## Table of Contents

- [Build Preparation](#build-preparation)
- [Static Hosting Deployment](#static-hosting-deployment)
- [Cloud Server Deployment](#cloud-server-deployment)
- [Containerized Deployment](#containerized-deployment)
- [CI/CD Automation](#cicd-automation)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Build Preparation

### Environment Check

Before starting the deployment, ensure your environment meets the requirements:

```bash
# Check Node.js version
node --version    # >= 16.0.0

# Check npm version  
npm --version     # >= 8.0.0

# Check project dependencies
npm list
```

### Build Process

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Verify build output
ls -la docs/
```

The build process will:
- Generate optimized static files
- Create the `docs/` directory
- Optimize images and assets
- Generate service worker (if enabled)

---

## Static Hosting Deployment

### GitHub Pages

1. **Enable GitHub Pages**

- Go to repository Settings
- Navigate to Pages section
- Select source: Deploy from a branch
- Choose branch: `main` and folder: `/docs`

2. **Automatic Deployment**

```bash
# Build and commit
npm run build
git add docs/
git commit -m "Update build"
git push origin main
```

3. **Custom Domain (Optional)**

Create `docs/CNAME` file:
```
your-domain.com
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

### Firebase Hosting Deployment


1. **Manual Firebase Deployment**

If not using the automated script, you can deploy manually:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Deploy
firebase deploy
```

2. **Firebase Configuration Example**

Create or update `firebase.json`:

```json
{
  "hosting": {
    "public": "docs",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Vercel Deployment

1. **Connect Repository**

- Import project from Git
- Configure build settings:
  - Framework Preset: Other
  - Build Command: `npm run build`
  - Output Directory: `docs`

2. **Configure vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "docs",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Cloud Server Deployment

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
    root /var/www/flexiresume/docs;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

3. **Deploy Files**

```bash
# Upload build files
scp -r docs/ user@server:/var/www/flexiresume/

# Enable site
sudo ln -s /etc/nginx/sites-available/flexiresume /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Apache Deployment

1. **Configure Apache**

Create `.htaccess` in docs directory:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

---

## Containerized Deployment

### Docker Deployment

1. **Create Dockerfile**

```dockerfile
FROM nginx:alpine

# Copy build files
COPY docs/ /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

3. **Build and Run**

```bash
# Build image
docker build -t flexiresume .

# Run container
docker run -d -p 80:80 --name flexiresume flexiresume
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
    volumes:
      - ./docs:/usr/share/nginx/html:ro
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
```

Run with:
```bash
docker-compose up -d
```

---

## CI/CD Automation

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy FlexiResume

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

variables:
  NODE_VERSION: "18"

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - docs/
    expire_in: 1 hour

deploy:
  stage: deploy
  script:
    - echo "Deploying to production"
  only:
    - main
```

---

## Performance Optimization

### Build Optimization

1. **Bundle Analysis**

```bash
# Analyze bundle size
npm run build:analyze

# Check for unused dependencies
npx depcheck
```

2. **Asset Optimization**

```bash
# Optimize images
npm run optimize:images

# Minify CSS and JS
npm run build:production
```

### CDN Configuration

1. **Configure CDN URLs**

Update `ProjectConfig.ts`:

```typescript
export const CDN_CONFIG = {
  baseUrls: [
    'https://cdn.jsdelivr.net/npm/',
    'https://unpkg.com/',
    'https://cdnjs.cloudflare.com/ajax/libs/'
  ],
  healthCheck: true,
  timeout: 3000
};
```

2. **Implement CDN Fallback**

```javascript
// Automatic CDN fallback
const loadResource = async (resource) => {
  for (const baseUrl of CDN_CONFIG.baseUrls) {
    try {
      const response = await fetch(`${baseUrl}${resource}`, {
        timeout: CDN_CONFIG.timeout
      });
      if (response.ok) return response;
    } catch (error) {
      console.warn(`CDN ${baseUrl} failed, trying next...`);
    }
  }
  // Fallback to local resources
  return fetch(`/assets/${resource}`);
};
```

---

## Monitoring and Maintenance

### Health Checks

1. **Basic Health Check**

```bash
#!/bin/bash
# health-check.sh

URL="https://your-domain.com"
STATUS=$(curl -o /dev/null -s -w "%{http_code}" $URL)

if [ $STATUS -eq 200 ]; then
    echo "✅ Site is healthy"
else
    echo "❌ Site is down (Status: $STATUS)"
    # Send alert notification
fi
```

2. **Performance Monitoring**

```javascript
// Performance monitoring
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'navigation') {
      console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
    }
  }
});

observer.observe({ entryTypes: ['navigation'] });
```

### Backup Strategy

1. **Automated Backup**

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/flexiresume"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf "$BACKUP_DIR/flexiresume_$DATE.tar.gz" /var/www/flexiresume/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "flexiresume_*.tar.gz" -mtime +7 -delete
```

2. **Database Backup** (if applicable)

```bash
# Backup configuration and user data
cp -r /var/www/flexiresume/config/ "$BACKUP_DIR/config_$DATE/"
```

### Security Considerations

1. **HTTPS Configuration**

```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com
```

2. **Security Headers**

Add to Nginx configuration:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

---

## Troubleshooting

### Common Issues

1. **Build Failures**

```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

2. **Routing Issues**

Ensure your server is configured for SPA routing:
- Nginx: `try_files $uri $uri/ /index.html;`
- Apache: RewriteRule in `.htaccess`

3. **Performance Issues**

```bash
# Check bundle size
npm run build:analyze

# Optimize images
npm run optimize:images

# Enable compression
# Configure gzip in server settings
```

### Support

For additional support:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review the [Documentation](../README.md)
- Join our [Community Discord](https://discord.gg/your-invite)

---

*Last updated: 2024-01-17*
