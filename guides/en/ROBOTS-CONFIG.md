# 🤖 robots.txt Configuration Guide

This document details the configuration options and use cases for robots.txt in FlexiResume.

## 📋 Table of Contents

- [Current Configuration](#current-configuration)
- [Configuration Options](#configuration-options)
- [Use Cases](#use-cases)
- [Security Considerations](#security-considerations)
- [Modification Methods](#modification-methods)

---

## 🔒 Current Configuration

FlexiResume defaults to a configuration that **completely prohibits scraping**:

```txt
# Block search engines from crawling
User-agent: *
Disallow: /
```

### Why Choose This Configuration?

1. **Personal Privacy Protection**: Resumes contain sensitive personal information
2. **Targeted Distribution**: Typically used for specific job applications
3. **Prevent Misuse of Information**: Prevent personal information from being maliciously collected
4. **Professional Image**: Demonstrates重视 of privacy security

---

## ⚙️ Configuration Options

### 1. Complete Prohibition (Default - Recommended)

**Applicable Scenario**: Personal job resumes

```txt
# Block all search engines from crawling
User-agent: *
Disallow: /
```

**Pros**:
- ✅ Maximum protection of personal privacy
- ✅ Prevents information from being maliciously collected
- ✅ Suitable for targeting specific employers

**Cons**:
- ❌ Cannot be discovered through search engines
- ❌不利于 to personal brand building

### 2. Partial Opening for Crawling

**Applicable Scenario**: Public portfolio, technical showcase

```txt
# Allow crawling of skills and projects, protect personal information
User-agent: *
Allow: /
Disallow: /contact
Disallow: /personal
Disallow: /resume/contact

# Optional: Specify crawl delay
Crawl-delay: 2

# Optional: Specify sitemap
Sitemap: https://your-domain.com/sitemap.xml
```

**Pros**:
- ✅ Showcase technical skills and project experience
- ✅ Protect sensitive personal information
- ✅ Balance exposure and privacy

**Cons**:
- ❌ Configuration is relatively complex
- ❌ Requires careful planning of what content can be public

### 3. Complete Opening for Crawling

**Applicable Scenario**: Technical blogs, personal brand websites

```txt
# Allow all search engines to crawl
User-agent: *
Allow: /

# Crawl delay (optional)
Crawl-delay: 1

# Specify sitemap location
Sitemap: https://your-domain.com/sitemap.xml

# Specific search engine configuration
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
```

**Pros**:
- ✅ Maximize online exposure
- ✅ 有利于 to personal brand building
- ✅ May bring more opportunities

**Cons**:
- ❌ Complete exposure of personal information
- ❌ May be misused for information collection
- ❌ Loses privacy protection

### 4. Specific Search Engine Configuration

**Applicable Scenario**: Fine-tuned control over different search engines

```txt
# Allow Google to crawl, block other search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Disallow: /

# Block all other search engines
User-agent: *
Disallow: /

# Block specific crawlers
User-agent: BadBot
Disallow: /

User-agent: ScrapeBot
Disallow: /
```

---

## 🎯 Use Case Recommendations

### Personal Job Resume

```txt
# Recommended configuration: Complete prohibition
User-agent: *
Disallow: /
```

**Reason**: 
- Protect personal privacy and contact information
- Avoid being maliciously collected by recruitment agencies
- Suitable for targeting specific companies

### Freelancer Portfolio

```txt
# Recommended configuration: Partial opening
User-agent: *
Allow: /
Disallow: /contact
Disallow: /personal
Disallow: /pricing

Sitemap: https://your-domain.com/sitemap.xml
```

**Reason**:
- Showcase skills and project experience
- Protect contact information and pricing details
- Obtain potential clients through search engines

### Technical Blog/Personal Brand

```txt
# Recommended configuration: Complete opening
User-agent: *
Allow: /

Crawl-delay: 1
Sitemap: https://your-domain.com/sitemap.xml
```

**Reason**:
- Maximize content exposure
- Build a personal technical brand
- Attract more technical exchange opportunities

### Corporate Website

```txt
# Recommended configuration: Complete opening + Optimization
User-agent: *
Allow: /

# Exclude backend and private pages
Disallow: /admin/
Disallow: /private/
Disallow: /api/

Crawl-delay: 1
Sitemap: https://your-domain.com/sitemap.xml
```

---

## 🛡️ Security Considerations

### Common Risks

1. **Information Leak**: Personal contact information is publicly exposed
2. **Malicious Scraping**: Abused by data collection companies
3. **Spam**: Email addresses are obtained by spammers
4. **Identity Theft**: Personal information is used for improper purposes

### Protective Measures

1. **Default Prohibition**: Use a conservative default configuration
2. **Layered Protection**: Even when allowing crawling, protect sensitive information
3. **Regular Checks**: Monitor if the website is accidentally crawled
4. **Contact Protection**: Use images or JavaScript to protect email addresses

### Checking Tools

```bash
# Check if robots.txt is working
curl https://your-domain.com/robots.txt

# Use Google Search Console to verify
# https://search.google.com/search-console

# Check if the website is indexed
site:your-domain.com
```

---

## 🔧 Modification Methods

### 1. Edit Configuration File

```bash
# Edit robots.txt
nano public/robots.txt

# Or use another editor
code public/robots.txt
```

### 2. Choose the Right Configuration

Select the appropriate configuration content based on the scenarios above, and copy it into `public/robots.txt`.

### 3. Rebuild

```bash
# Rebuild the project
npm run build

# Verify the build result
ls docs/robots.txt
```

### 4. Deploy Updates

```bash
# Deploy to server
rsync -avz docs/ user@server:/var/www/html/

# Or use other deployment methods
git push origin main  # If using GitHub Pages
```

### 5. Verify Configuration

```bash
# Check the online configuration
curl https://your-domain.com/robots.txt

# Confirm the configuration is correct
```

---

## 📊 Configuration Comparison Table

| Configuration Type | Privacy Protection | Exposure | Applicable Scenario | Recommendation Index |
|---------|---------|--------|----------|----------|
| **Complete Prohibition** | ⭐⭐⭐⭐⭐ | ⭐ | Personal Resume | ⭐⭐⭐⭐⭐ |
| **Partial Opening** | ⭐⭐⭐ | ⭐⭐⭐ | Portfolio | ⭐⭐⭐⭐ |
| **Complete Opening** | ⭐ | ⭐⭐⭐⭐⭐ | Technical Blog | ⭐⭐⭐ |
| **Fine-Tuned Control** | ⭐⭐⭐⭐ | ⭐⭐⭐ | Corporate Website | ⭐⭐⭐⭐ |

---

## 🔗 Related Resources

- [robots.txt Official Specification](https://www.robotstxt.org/)
- [Google robots.txt Guide](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Tutorial](USAGE.md#seo-and-privacy-configuration)
- [Deployment Guide](DEPLOYMENT.md#seo-and-search-engine-configuration)
- [Customization Guide](CUSTOMIZATION.md#seo-and-search-engine-configuration)

---

<div align="center">

**Protect Privacy, Make Smart Choices!🔒**

Choose the appropriate robots.txt configuration based on your specific needs.

</div>



## 🌐 Language Versions

- [🇨🇳 中文版本](../zh/ROBOTS-CONFIG.md) 
- [🇺🇸 English Version](ROBOTS-CONFIG.md)(Current)

