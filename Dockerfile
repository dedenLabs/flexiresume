# 使用 Nginx 官方镜像
FROM nginx:latest

# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制 SSL 证书和私钥
COPY ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ssl/key.pem /etc/nginx/ssl/key.pem

# 复制 Web 应用的静态文件
COPY dist /usr/share/nginx/html
