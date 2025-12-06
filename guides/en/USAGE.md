# 📖 FlexiResume Tutorial

Welcome to FlexiResume! This tutorial will detail how to use and configure this intelligent multi-job resume generator.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Basic Configuration](#basic-configuration)
- [Job Customization](#job-customization)
- [Module Management](#module-management)
- [Themes and Languages](#themes-and-languages)
- [Advanced Features](#advanced-features)
- [FAQ](#faq)

---

## 🚀 Quick Start

### 1. Environment Setup

Ensure your development environment meets the following requirements:

```bash
# Check Node.js version
node --version  # Should be >= 16.0.0

# Check npm version
npm --version   # Should be >= 8.0.0
```

### 2. Project Installation

```bash
# Clone the project
git clone https://github.com/dedenLabs/FlexiResume.git

# Navigate to the project directory
cd FlexiResume

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. Access the Application

Open your browser to `http://localhost:5174` to see the default resume page.

---

## ⚙️ Basic Configuration

### Personal Information Configuration

Edit the `src/data/Data.ts` file to configure your basic information:

```typescript
export const Data: IFlexiResume = {
  header_info: {
    name: "Your Name",
    position: "Job Objective",
    phone: "Phone Number",
    email: "Email Address",
    location: "City",
    home_page: "Personal Website",
    github: "GitHub Username",
    avatar: "Avatar Image Path",
    route_base_name: "/",  // Base route path
    expected_positions: {
      // Job configuration will be detailed in the next section
    }
  },
  // ... Other configurations
};
```

### Skills Configuration

FlexiResume supports two methods of displaying skills:

#### 1. Skills Tree Structure (DataSkills.ts)

Configure the skills tree structure in `src/data/module/DataSkills.ts`:

```typescript
// src/data/module/DataSkills.ts - Skills tree structure
export default [
  {
    name: 'Programming Languages',
    content: `- **Proficient**: Node, TypeScript, JavaScript, C#
- **Familiar**: C/C++, Java, Python, Golang`
  },
  {
    name: 'Frontend Development',
    children: [
      {
        name: 'Frameworks/Libraries',
        content: `- **Proficient**: React, Vue, Redux/MobX
- **Familiar**: Angular, Web3.js`
      },
      {
        name: 'Game Development',
        content: `- **Proficient/Experienced**: Unity, Cocos Creator, Three.js`
      }
    ],
    content: `*Experienced in efficient collaboration with UI/UX teams...*`
  }
];
```

#### 2. Skills Proficiency (SkillsData.ts)

Configure the skill proficiency levels in `src/data/SkillsData.ts`:

```typescript
// src/data/SkillsData.ts - Skills proficiency configuration
export const getSkillsData = () => {
  return {
    type: "skill_level",
    name: "Skill Proficiency",
    list: [
      ["JavaScript", 3],    // 3: Proficient
      ["TypeScript", 3],    // 3: Proficient
      ["Python", 2],        // 2: Familiar
      ["Golang", 1],        // 1: Basics
      // ... More skills
    ]
  };
};
```

**Proficiency Level Explanation**:
- `3`: Proficient (Deeply mastered, able to guide others) - Highlighted
- `2`: Familiar (Able to independently complete complex tasks) - Medium display
- `1`: Basics (Fundamentally mastered, requires guidance) - Normal display

---

## 🎯 Job Customization

### Creating a New Job

1. **Create a new job data file**

Create a new file in the `src/data/position/` directory, for example `DataFullStack.ts`:

```typescript
import { IFlexiResume } from "../../types/IFlexiResume";

const DataFullStack: Partial<IFlexiResume> = {
  personal_strengths: {
    type: "personal_strengths",
    name: "Personal Strengths",
    content: `
### 🚀 Full Stack Development Expert
- **Full-Stack Integration**: Proficient in React/Vue front-end frameworks and Node.js/Python back-end development
- **Architectural Design Capabilities**: Experienced in microservice architecture design and system optimization
- **DevOps Practice**: Skilled in using containerization technologies such as Docker, K8s
    `
  },
  
  skills: {
    type: "skills",
    name: "Skills List",
    list: [
      {
        name: "Frontend Technologies",
        level: 95,
        list: ["React", "Vue", "TypeScript", "Next.js", "Nuxt.js"]
      }
    ]
  }
};

export default DataFullStack;
```

2. **Register the job configuration**

Add the new job in `src/data/Data.ts`:

```typescript
import DataFullStack from './position/DataFullStack';

export const Data: IFlexiResume = {
  header_info: {
    // ... Other configurations
    expected_positions: {
      fullstack: {
        title: "Full Stack Engineer",
        path: "/fullstack",
        data: DataFullStack
      },
      // ... Other jobs
    }
  }
};
```

---

## 🧩 Module Management

### Available Module Types

FlexiResume supports the following module types:

| Module Type | Description | File Location |
|---------|------|----------|
| `personal_strengths` | Personal Strengths | `src/data/module/DataPersonalStrengths.ts` |
| `skills` | Skills List | `src/data/module/DataSkills.ts` |
| `employment_history` | Employment History | `src/data/module/DataEmploymentHistory.ts` |
| `project_experience` | Project Experience | `src/data/module/DataProjectExperience.ts` |
| `education_history` | Education History | `src/data/module/DataEducationHistory.ts` | |

### Markdown Syntax Support

FlexiResume supports rich Markdown syntax:

```markdown
### Title

**Bold Text** and *Italic Text*

- Unordered list item
- Another list item

1. Ordered list item
2. Another ordered list item

[Link Text](https://example.com)

`Inline Code`

> Blockquote text
```

---

## 🎨 Themes and Language

### Theme Switching

FlexiResume supports two themes: light and dark:

1. **Using the control panel**
   - Click the control panel in the upper right corner
   - Click the theme switch button (🌙/☀️)

2. **Programmatic switching**

```typescript
import { useTheme } from '../theme';

function MyComponent() {
  const { mode, toggleMode, colors, isDark } = useTheme();
  
  return (
    <button onClick={toggleMode}>
      Switch to {isDark ? 'light' : 'dark'} mode
    </button>
  );
}
```

### Language Switching

Supports switching between Chinese and English interfaces:

1. **Using the language switcher**
   - Click the language switch button in the upper right corner
   - Select the target language

2. **Programmatic switching**

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

## 🔧 Advanced Features

### QR Code Generation

Use QR codes in Markdown content:

```markdown
<!-- Generate QR code for specified URL -->
!QRCode:https://your-website.com size=100

<!-- Generate QR code for current page URL -->
!QRCode:true size=120

<!-- Center QR code display -->
<p align="center">
  !QRCode:https://github.com/your-username size=100
</p>
```

### Custom CSS Classes

Use special CSS classes to control styles:

```markdown
<!-- Remove link icon -->
<a href="mailto:your@email.com" className="no-link-icon">your@email.com</a>

<!-- Remove image effects -->
<img src="image.jpg" className="no-effect-icon" alt="Description" />
```

### SEO and Privacy Configuration

FlexiResume is default configured to **protect personal privacy** and disallows search engines from crawling:

```txt
# public/robots.txt
User-agent: *
Disallow: /
```

#### Why default to disallow crawling?

1. **Personal Privacy Protection**: Resumes contain sensitive personal information (contact details, work experience, etc.)
2. **Targeted Distribution**: Resumes are typically used for specific job applications and do not need to be publicly searchable
3. **Prevent Misuse**: Prevent personal information from being maliciously collected or misused

#### Modify Search Engine Strategy

Depending on your use case, you can choose different configurations:

**1. Maintain Privacy (Recommended for job applications)**
```txt
# Fully disallow crawling
User-agent: *
Disallow: /
```

**2. Partially Open (Suitable for portfolios)**
```txt
# Allow crawling skill sections, disallow contact information
User-agent: *
Allow: /
Disallow: /contact
Disallow: /personal
```

**3. Fully Open (Suitable for technical blogs)**
```txt
# Allow all content to be crawled
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

#### Configuration Method

1. Edit the `public/robots.txt` file
2. Choose the appropriate configuration
3. Rebuild and deploy: `npm run build`

For detailed SEO configurations, see [Deployment Guide](DEPLOYMENT.md#seo-和搜索引擎配置)

--- 

## ❓ FAQs

### Q: How to add new position types?

A: Follow these steps:
1. Create a new position data file in `src/data/position/`
2. Register it in `src/data/Data.ts`'s `expected_positions`
3. Restart the development server

### Q: How to customize the order of resume sections?

A: The order of module definitions in the position data file determines the display order. You can adjust the definition order to change the display order.

### Q: How to hide a module?

A: Simply omit the module's definition in the specific position data file.

### Q: How to deploy to production environment?

A: Please refer to [Deployment Guide](DEPLOYMENT.md) for detailed deployment instructions.

--- 

## 🆘 Get Help

If you encounter issues while using FlexiResume:

1. **Check Documentation**: First, consult relevant documentation and examples
2. **Search Issues**: Search GitHub Issues for similar problems
3. **Submit an Issue**: If no solution is found, please submit a new issue
4. **Community Discussion**: Participate in GitHub Discussions

--- 

## 🔗 Related Links

- [Deployment Guide](DEPLOYMENT.md)
- [Customization Guide](CUSTOMIZATION.md)
- [API Documentation](API.md)
- [Contributing Guide](CONTRIBUTING.md)
- [GitHub Repository](https://github.com/dedenLabs/FlexiResume)

--- 

<div align="center">

**Thank you for using FlexiResume!**

If you have questions or suggestions, feel free to contact us.

</div>

## 🌐 Language Versions

- [🇨🇳 中文版本](../zh/USAGE.md) 
- [🇺🇸 English Version](USAGE.md)(Current)
