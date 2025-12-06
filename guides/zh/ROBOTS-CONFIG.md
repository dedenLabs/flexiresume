# 🤖 robots.txt 配置指南

本文档详细介绍了 FlexiResume 中 robots.txt 的配置选项和使用场景。

## 📋 目录

- [当前配置](#当前配置)
- [配置选项](#配置选项)
- [使用场景](#使用场景)
- [安全考虑](#安全考虑)
- [修改方法](#修改方法)

---

## 🔒 当前配置

FlexiResume 默认采用**完全禁止抓取**的配置：

```txt
# 禁止搜索引擎抓取
User-agent: *
Disallow: /
```

### 为什么选择这种配置？

1. **个人隐私保护**: 简历包含个人敏感信息
2. **定向投放**: 通常用于特定职位申请
3. **避免信息滥用**: 防止个人信息被恶意收集
4. **专业形象**: 体现对隐私安全的重视

---

## ⚙️ 配置选项

### 1. 完全禁止抓取（默认 - 推荐）

**适用场景**: 个人求职简历

```txt
# 禁止所有搜索引擎抓取
User-agent: *
Disallow: /
```

**优点**:
- ✅ 最大程度保护个人隐私
- ✅ 避免信息被恶意收集
- ✅ 适合定向投放给特定雇主

**缺点**:
- ❌ 无法通过搜索引擎被发现
- ❌ 不利于个人品牌建设

### 2. 部分开放抓取

**适用场景**: 公开作品集、技术展示

```txt
# 允许抓取技能和项目，保护个人信息
User-agent: *
Allow: /
Disallow: /contact
Disallow: /personal
Disallow: /resume/contact

# 可选：指定抓取延迟
Crawl-delay: 2

# 可选：指定sitemap
Sitemap: https://your-domain.com/sitemap.xml
```

**优点**:
- ✅ 展示技术能力和项目经验
- ✅ 保护敏感个人信息
- ✅ 平衡曝光度和隐私

**缺点**:
- ❌ 配置相对复杂
- ❌ 需要仔细规划哪些内容可以公开

### 3. 完全开放抓取

**适用场景**: 技术博客、个人品牌网站

```txt
# 允许所有搜索引擎抓取
User-agent: *
Allow: /

# 抓取延迟（可选）
Crawl-delay: 1

# 指定sitemap位置
Sitemap: https://your-domain.com/sitemap.xml

# 特定搜索引擎配置
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
```

**优点**:
- ✅ 最大化网络曝光度
- ✅ 有利于个人品牌建设
- ✅ 可能带来更多机会

**缺点**:
- ❌ 个人信息完全公开
- ❌ 可能被恶意收集信息
- ❌ 失去隐私保护

### 4. 特定搜索引擎配置

**适用场景**: 精细化控制不同搜索引擎

```txt
# 允许Google抓取，禁止其他搜索引擎
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Disallow: /

# 禁止其他所有搜索引擎
User-agent: *
Disallow: /

# 禁止特定爬虫
User-agent: BadBot
Disallow: /

User-agent: ScrapeBot
Disallow: /
```

---

## 🎯 使用场景建议

### 个人求职简历

```txt
# 推荐配置：完全禁止
User-agent: *
Disallow: /
```

**理由**: 
- 保护个人隐私和联系信息
- 避免被招聘中介恶意收集
- 适合定向投放给目标公司

### 自由职业者作品集

```txt
# 推荐配置：部分开放
User-agent: *
Allow: /
Disallow: /contact
Disallow: /personal
Disallow: /pricing

Sitemap: https://your-domain.com/sitemap.xml
```

**理由**:
- 展示技能和项目经验
- 保护联系方式和报价信息
- 通过搜索引擎获得潜在客户

### 技术博客/个人品牌

```txt
# 推荐配置：完全开放
User-agent: *
Allow: /

Crawl-delay: 1
Sitemap: https://your-domain.com/sitemap.xml
```

**理由**:
- 最大化内容曝光度
- 建立个人技术品牌
- 吸引更多技术交流机会

### 企业官网

```txt
# 推荐配置：完全开放 + 优化
User-agent: *
Allow: /

# 排除后台和私有页面
Disallow: /admin/
Disallow: /private/
Disallow: /api/

Crawl-delay: 1
Sitemap: https://your-domain.com/sitemap.xml
```

---

## 🛡️ 安全考虑

### 常见风险

1. **信息泄露**: 个人联系方式被公开
2. **恶意抓取**: 被数据收集公司滥用
3. **垃圾邮件**: 邮箱地址被垃圾邮件发送者获取
4. **身份盗用**: 个人信息被用于不当目的

### 防护措施

1. **默认禁止**: 采用保守的默认配置
2. **分层保护**: 即使允许抓取，也要保护敏感信息
3. **定期检查**: 监控网站是否被意外抓取
4. **联系方式保护**: 使用图片或JavaScript保护邮箱

### 检查工具

```bash
# 检查robots.txt是否生效
curl https://your-domain.com/robots.txt

# 使用Google Search Console验证
# https://search.google.com/search-console

# 检查网站是否被索引
site:your-domain.com
```

---

## 🔧 修改方法

### 1. 编辑配置文件

```bash
# 编辑robots.txt
nano public/robots.txt

# 或使用其他编辑器
code public/robots.txt
```

### 2. 选择合适的配置

根据上述场景选择合适的配置内容，复制到 `public/robots.txt` 文件中。

### 3. 重新构建

```bash
# 重新构建项目
npm run build

# 验证构建结果
ls docs/robots.txt
```

### 4. 部署更新

```bash
# 部署到服务器
rsync -avz docs/ user@server:/var/www/html/

# 或使用其他部署方式
git push origin main  # 如果使用GitHub Pages
```

### 5. 验证配置

```bash
# 检查线上配置
curl https://your-domain.com/robots.txt

# 确认配置正确
```

---

## 📊 配置对比表

| 配置类型 | 隐私保护 | 曝光度 | 适用场景 | 推荐指数 |
|---------|---------|--------|----------|----------|
| **完全禁止** | ⭐⭐⭐⭐⭐ | ⭐ | 个人简历 | ⭐⭐⭐⭐⭐ |
| **部分开放** | ⭐⭐⭐ | ⭐⭐⭐ | 作品集 | ⭐⭐⭐⭐ |
| **完全开放** | ⭐ | ⭐⭐⭐⭐⭐ | 技术博客 | ⭐⭐⭐ |
| **精细控制** | ⭐⭐⭐⭐ | ⭐⭐⭐ | 企业网站 | ⭐⭐⭐⭐ |

---

## 🔗 相关资源

- [robots.txt 官方规范](https://www.robotstxt.org/)
- [Google robots.txt 指南](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [使用教程](USAGE.md#seo-和隐私配置)
- [部署指南](DEPLOYMENT.md#seo-和搜索引擎配置)
- [自定义指南](CUSTOMIZATION.md#seo-和搜索引擎配置)

---

<div align="center">

**保护隐私，明智选择！🔒**

根据您的具体需求选择合适的 robots.txt 配置。

</div>

## 🌐 Language Versions

- 🇨🇳 中文版本 (当前)
- [🇺🇸 English Version](../en/ROBOTS-CONFIG.md)