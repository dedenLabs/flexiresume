# 📖 FlexiResume 使用教程

欢迎使用 FlexiResume！本教程将详细介绍如何使用和配置这个智能化多职位简历生成器。

## 📋 目录

- [快速开始](#快速开始)
- [基础配置](#基础配置)
- [职位定制](#职位定制)
- [模块管理](#模块管理)
- [主题和语言](#主题和语言)
- [高级功能](#高级功能)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 1. 环境准备

确保您的开发环境满足以下要求：

```bash
# 检查 Node.js 版本
node --version  # 应该 >= 16.0.0

# 检查 npm 版本
npm --version   # 应该 >= 8.0.0
```

### 2. 项目安装

```bash
# 克隆项目
git clone https://github.com/dedenLabs/FlexiResume.git

# 进入项目目录
cd FlexiResume

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. 访问应用

打开浏览器访问 `http://localhost:5174`，您将看到默认的简历页面。

---

## ⚙️ 基础配置

### 个人信息配置

编辑 `src/data/Data.ts` 文件，配置您的基本信息：

```typescript
export const Data: IFlexiResume = {
  header_info: {
    name: "您的姓名",
    position: "求职意向",
    phone: "联系电话",
    email: "邮箱地址",
    location: "所在城市",
    home_page: "个人网站",
    github: "GitHub用户名",
    avatar: "头像图片路径",
    route_base_name: "/",  // 路由基础路径
    expected_positions: {
      // 职位配置将在下一节详细介绍
    }
  },
  // ... 其他配置
};
```

### 技能配置

在 `src/data/module/` 目录下配置您的技能：

```typescript
// src/data/module/DataSkills.ts
export const DataSkills = {
  type: "skills",
  name: "技能清单",
  list: [
    {
      name: "前端开发",
      level: 90,  // 熟练度 0-100
      list: ["React", "Vue", "TypeScript", "JavaScript"]
    },
    {
      name: "后端开发", 
      level: 85,
      list: ["Node.js", "Python", "Java", "Go"]
    }
    // ... 更多技能
  ]
};
```

---

## 🎯 职位定制

### 创建新职位

1. **创建职位数据文件**

在 `src/data/position/` 目录下创建新文件，例如 `DataFullStack.ts`：

```typescript
import { IFlexiResume } from "../../types/IFlexiResume";

const DataFullStack: Partial<IFlexiResume> = {
  personal_strengths: {
    type: "personal_strengths",
    name: "个人优势",
    content: `
### 🚀 全栈开发专家
- **前后端一体化**: 精通React/Vue前端框架和Node.js/Python后端开发
- **架构设计能力**: 具备微服务架构设计和系统优化经验
- **DevOps实践**: 熟练使用Docker、K8s等容器化技术
    `
  },
  
  skills: {
    type: "skills",
    name: "技能清单",
    list: [
      {
        name: "前端技术",
        level: 95,
        list: ["React", "Vue", "TypeScript", "Next.js", "Nuxt.js"]
      }
    ]
  }
};

export default DataFullStack;
```

2. **注册职位配置**

在 `src/data/Data.ts` 中添加新职位：

```typescript
import DataFullStack from './position/DataFullStack';

export const Data: IFlexiResume = {
  header_info: {
    // ... 其他配置
    expected_positions: {
      fullstack: {
        title: "全栈工程师",
        path: "/fullstack",
        data: DataFullStack
      },
      // ... 其他职位
    }
  }
};
```

---

## 🧩 模块管理

### 可用模块类型

FlexiResume 支持以下模块类型：

| 模块类型 | 说明 | 文件位置 |
|---------|------|----------|
| `personal_strengths` | 个人优势 | `src/data/module/DataPersonalStrengths.ts` |
| `skills` | 技能清单 | `src/data/module/DataSkills.ts` |
| `employment_history` | 工作经历 | `src/data/module/DataEmploymentHistory.ts` |
| `project_experience` | 项目经历 | `src/data/module/DataProjectExperience.ts` |
| `education_history` | 教育背景 | `src/data/module/DataEducationHistory.ts` |

### Markdown 语法支持

FlexiResume 支持丰富的 Markdown 语法：

```markdown
### 标题

**粗体文本** 和 *斜体文本*

- 无序列表项
- 另一个列表项

1. 有序列表项
2. 另一个有序列表项

[链接文本](https://example.com)

`行内代码`

> 引用文本
```

---

## 🎨 主题和语言

### 主题切换

FlexiResume 支持明暗两种主题：

1. **使用控制面板**
   - 点击右上角的控制面板
   - 点击主题切换按钮（🌙/☀️）

2. **程序化切换**

```typescript
import { useTheme } from '../theme';

function MyComponent() {
  const { mode, toggleMode, colors, isDark } = useTheme();
  
  return (
    <button onClick={toggleMode}>
      切换到{isDark ? '浅色' : '深色'}模式
    </button>
  );
}
```

### 语言切换

支持中英文界面切换：

1. **使用语言切换器**
   - 点击右上角的语言切换按钮
   - 选择目标语言

2. **程序化切换**

```typescript
import { useI18n } from '../i18n';

function MyComponent() {
  const { language, setLanguage, t } = useI18n();
  
  return (
    <div>
      <h1>{t.resume.personalInfo}</h1>
      <button onClick={() => setLanguage('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

---

## 🔧 高级功能

### QR码生成

在 Markdown 内容中使用 QR 码：

```markdown
<!-- 生成指定URL的QR码 -->
!QRCode:https://your-website.com size=100

<!-- 生成当前页面URL的QR码 -->
!QRCode:true size=120

<!-- 居中显示QR码 -->
<p align="center">
  !QRCode:https://github.com/your-username size=100
</p>
```

### 自定义CSS类

使用特殊CSS类控制样式：

```markdown
<!-- 移除链接图标 -->
<a href="mailto:your@email.com" className="no-link-icon">your@email.com</a>

<!-- 移除图片效果 -->
<img src="image.jpg" className="no-effect-icon" alt="描述" />
```

### SEO 和隐私配置

FlexiResume 默认配置为**保护个人隐私**，禁止搜索引擎抓取：

```txt
# public/robots.txt
User-agent: *
Disallow: /
```

#### 为什么默认禁止抓取？

1. **个人隐私保护**: 简历包含个人敏感信息（联系方式、工作经历等）
2. **定向投放**: 简历通常用于特定职位申请，不需要公开搜索
3. **避免信息滥用**: 防止个人信息被恶意收集或滥用

#### 修改搜索引擎策略

根据您的使用场景，可以选择不同的配置：

**1. 保持隐私（推荐用于求职）**
```txt
# 完全禁止抓取
User-agent: *
Disallow: /
```

**2. 部分开放（适用于作品集）**
```txt
# 允许抓取技能展示，禁止联系信息
User-agent: *
Allow: /
Disallow: /contact
Disallow: /personal
```

**3. 完全开放（适用于技术博客）**
```txt
# 允许所有内容被抓取
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

#### 配置方法

1. 编辑 `public/robots.txt` 文件
2. 选择适合的配置内容
3. 重新构建和部署：`npm run build`

详细的SEO配置请参考 [部署指南](DEPLOYMENT.md#seo-和搜索引擎配置)

---

## ❓ 常见问题

### Q: 如何添加新的职位类型？

A: 按照以下步骤：
1. 在 `src/data/position/` 创建新的职位数据文件
2. 在 `src/data/Data.ts` 的 `expected_positions` 中注册
3. 重启开发服务器

### Q: 如何自定义简历模块的顺序？

A: 在职位数据文件中，模块的定义顺序就是显示顺序。您可以调整模块的定义顺序来改变显示顺序。

### Q: 如何隐藏某个模块？

A: 在特定职位的数据文件中，不包含该模块的定义即可。

### Q: 如何部署到生产环境？

A: 请参考 [部署指南](DEPLOYMENT.md) 获取详细的部署说明。

---

## 🆘 获取帮助

如果您在使用过程中遇到问题：

1. **查看文档**: 首先查看相关文档和示例
2. **搜索Issues**: 在 GitHub Issues 中搜索类似问题
3. **提交Issue**: 如果没有找到解决方案，请提交新的 Issue
4. **社区讨论**: 参与 GitHub Discussions 讨论

---

## 🔗 相关链接

- [部署指南](DEPLOYMENT.md)
- [自定义指南](CUSTOMIZATION.md)
- [API文档](API.md)
- [贡献指南](CONTRIBUTING.md)
- [GitHub仓库](https://github.com/dedenLabs/FlexiResume)

---

<div align="center">

**感谢使用 FlexiResume！**

如有问题或建议，欢迎随时联系我们。

</div>
