# 🎨 FlexiResume 自定义指南

本指南将详细介绍如何自定义 FlexiResume 的各个方面，包括主题、组件、模块等。

## 📋 目录

- [环境变量配置](#环境变量配置)
- [统计功能配置](#统计功能配置)
- [主题自定义](#主题自定义)
- [组件自定义](#组件自定义)
- [模块自定义](#模块自定义)
- [样式自定义](#样式自定义)
- [国际化自定义](#国际化自定义)
- [高级自定义](#高级自定义)

---

## ⚙️ 环境变量配置

FlexiResume 支持通过环境变量进行灵活配置，所有用户可能需要修改的配置都已提取到 `.env` 文件中。

### 配置文件说明

1. **`.env`** - 当前环境的配置文件
2. **`.env.example`** - 配置模板文件，包含所有可用配置项和详细说明

### 快速开始

```bash
# 1. 复制配置模板
cp .env.example .env
# cp .env.example .env.local # npm run dev 时生效
# cp .env.example .env.production # 用于生产环境的配置 npm run build 时生效
# 根据需要修改 .env.* 文件中的配置项

# 2. 根据需要修改配置
vim .env

# 3. 重启开发服务器
npm run dev
```


### 主要配置分类

#### 📊 统计配置
```bash
# 百度统计
VITE_BAIDU_ENABLED=false
VITE_BAIDU_SITE_ID=your_baidu_site_id

# Google Analytics
VITE_GOOGLE_ENABLED=false
VITE_GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX

# ELK Stack
VITE_ELK_ENABLED=false
VITE_ELK_ENDPOINT=http://localhost:5000/api/analytics
```

#### 🚀 CDN配置
```bash
# CDN启用和URL配置
VITE_CDN_ENABLED=true
VITE_CDN_BASE_URLS=https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/,https://flexiresume-static.web.app/

# CDN健康检查
VITE_CDN_HEALTH_CHECK_TIMEOUT=5000
VITE_CDN_SORTING_MODE=speed
```

#### 🎨 主题配置
```bash
# 默认主题设置
VITE_DEFAULT_THEME=auto
VITE_ENABLE_THEME_TRANSITIONS=true
VITE_THEME_TRANSITION_DURATION=300
```

#### ⚡ 性能配置
```bash
# 懒加载设置
VITE_ENABLE_LAZY_LOADING=true
VITE_LAZY_LOADING_THRESHOLD=100

# 预加载资源
VITE_ENABLE_PRELOADING=true
VITE_PRELOAD_RESOURCES=/images/avatar.webp,/images/background.webp
```

#### 🔧 构建配置
```bash
# 静态路由页面
VITE_STATIC_ROUTE_PAGES=game,frontend,backend,cto,agent,contracttask,fullstack

# 项目信息
VITE_APP_NAME=FlexiResume
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

### 配置优先级

1. **环境变量** (最高优先级)
2. **`.env` 文件**
3. **代码中的默认值** (最低优先级)

### 部署时配置

#### Docker 部署
```bash
# 通过环境变量传递配置
docker run -e VITE_CDN_ENABLED=true -e VITE_DEBUG=false your-image

# 或使用 docker-compose
environment:
  - VITE_CDN_ENABLED=true
  - VITE_DEFAULT_THEME=dark
```

#### 静态部署
```bash
# 构建前设置环境变量
export VITE_CDN_ENABLED=true
export VITE_DEBUG=false
npm run build
```

---

## 📈 统计功能配置

FlexiResume 支持多种统计方案，可以单独使用或组合使用。

### 支持的统计方案

#### 1. 百度统计 (推荐国内用户)

**配置步骤：**

1. **获取站点ID**
   - 访问 [百度统计](https://tongji.baidu.com/)
   - 创建站点并获取站点ID

2. **配置环境变量**
```bash
# 启用百度统计
VITE_BAIDU_ENABLED=true

# 设置站点ID (必填)
VITE_BAIDU_SITE_ID=your_actual_site_id

# 设置域名 (可选)
VITE_BAIDU_DOMAIN=your-domain.com
```

3. **验证配置**
   - 启动应用后检查浏览器控制台
   - 确认百度统计脚本正常加载

#### 2. Google Analytics (推荐国际用户)

**配置步骤：**

1. **创建GA4属性**
   - 访问 [Google Analytics](https://analytics.google.com/)
   - 创建新的GA4属性并获取测量ID

2. **配置环境变量**
```bash
# 启用Google Analytics
VITE_GOOGLE_ENABLED=true

# 设置测量ID (必填)
VITE_GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Analytics设置 (可选)
VITE_GOOGLE_USE_FIREBASE=true
VITE_GOOGLE_DYNAMIC_LOADING=true
```

3. **Firebase配置** (如果使用Firebase Analytics)
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### 3. ELK Stack (高级用户)

**配置步骤：**

1. **配置环境变量**
```bash
# 启用ELK统计
VITE_ELK_ENABLED=true

# ELK端点 
VITE_ELK_ENDPOINT=http://esk-host

# 批量设置
VITE_ELK_BATCH_SIZE=10
VITE_ELK_FLUSH_INTERVAL=5000
```

2. **访问分析界面**
   - Kibana: http://kibana-host
   - Grafana: http://grafana-host

### 统计功能特性

#### 自动跟踪事件
- **页面访问**: 自动记录页面浏览
- **用户交互**: 按钮点击、链接访问
- **性能指标**: 页面加载时间、资源加载状态
- **错误监控**: JavaScript错误、网络错误

#### 隐私保护
- **默认禁用**: 所有统计功能默认关闭
- **用户控制**: 用户可以选择启用/禁用统计
- **数据最小化**: 只收集必要的匿名数据
- **本地优先**: ELK方案支持完全本地化部署

#### 调试模式
```bash
# 启用统计调试日志
VITE_DEBUG=true

# 查看统计日志
DEBUG=app:* npm run dev
```

### 统计数据查看

#### 百度统计
- 登录百度统计后台查看详细报告
- 支持实时访客、来源分析、页面分析等

#### Google Analytics
- 登录GA4后台查看分析报告
- 支持实时报告、受众群体、获客等分析

#### ELK Stack
- **Kibana**: 灵活的数据查询和可视化
- **Grafana**: 专业的监控仪表板
- **自定义分析**: 支持复杂的数据分析需求

### 最佳实践

1. **选择合适的方案**
   - 个人简历：建议禁用所有统计
   - 作品集网站：选择百度统计或Google Analytics
   - 技术展示：可以使用ELK Stack展示技术能力

2. **隐私保护**
   - 在隐私政策中说明数据收集情况
   - 提供用户选择退出的选项
   - 定期清理不必要的数据

3. **性能优化**
   - 使用动态加载避免影响页面性能
   - 合理设置批量大小和刷新间隔
   - 在生产环境禁用调试日志

---

## 🌈 主题自定义

### 创建自定义主题

1. **扩展主题配置**

在 `src/theme/index.tsx` 中添加新主题：

```typescript
// 自定义主题颜色
const customTheme: ThemeColors = {
  primary: '#6366f1',      // 主色调
  secondary: '#8b5cf6',    // 次要色
  accent: '#f59e0b',       // 强调色
  
  background: '#fafafa',   // 背景色
  surface: '#ffffff',      // 表面色
  card: '#f8fafc',         // 卡片色
  
  text: {
    primary: '#1f2937',    // 主文本
    secondary: '#6b7280',  // 次要文本
    disabled: '#d1d5db',   // 禁用文本
    inverse: '#ffffff'     // 反色文本
  },
  
  border: {
    light: '#f3f4f6',     // 浅边框
    medium: '#d1d5db',     // 中等边框
    dark: '#9ca3af'        // 深边框
  },
  
  status: {
    success: '#10b981',    // 成功色
    warning: '#f59e0b',    // 警告色
    error: '#ef4444',      // 错误色
    info: '#3b82f6'        // 信息色
  }
};
```

2. **CSS 变量自定义**

使用 CSS 变量进行动态主题切换：

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-background: #ffffff;
  --color-text: #1f2937;
  
  --border-radius: 8px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-secondary: #94a3b8;
  --color-background: #1f2937;
  --color-text: #f9fafb;
}
```

---

## 🧩 组件自定义

### 创建自定义卡片组件

```typescript
// src/components/cards/CustomCard.tsx
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../theme';

const CardContainer = styled.div<{ isDark: boolean }>`
  background: ${props => props.isDark ? '#2d3748' : '#ffffff'};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h3<{ isDark: boolean }>`
  color: ${props => props.isDark ? '#f7fafc' : '#2d3748'};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ title, children, className }) => {
  const { isDark } = useTheme();
  
  return (
    <CardContainer isDark={isDark} className={className}>
      <CardTitle isDark={isDark}>{title}</CardTitle>
      {children}
    </CardContainer>
  );
};

export default CustomCard;
```

### 注册自定义组件

在 `src/pages/FlexiResume.tsx` 中添加：

```typescript
case 'custom_module':
  return (
    <Section key={i} title={m.name} {...args}>
      <CustomCard title={m.name} {...args}>
        <BaseCard id={key} {...args} />
      </CustomCard>
    </Section>
  );
```

---

## 📝 模块自定义

### 技能模块自定义

FlexiResume 提供两种技能展示方式，您可以根据需要选择或同时使用：

#### 1. 技能树模块 (推荐用于详细展示)

```typescript
// src/data/module/DataSkills.ts
export default [
  {
    name: '技能分类名称',
    content: `- **精通**: 技能1, 技能2
- **熟练**: 技能3, 技能4`,
    children: [
      {
        name: '子分类',
        content: '子分类技能描述'
      }
    ]
  }
];
```

#### 2. 技能熟练度模块 (推荐用于快速展示)

```typescript
// src/data/SkillsData.ts
export const getSkillsData = () => {
  return {
    type: "skill_level",
    name: "技能熟练度",
    list: [
      ["技能名称", 3],  // 3=精通, 2=熟练, 1=了解
      ["另一个技能", 2],
      // ... 更多技能
    ]
  };
};
```

### 创建自定义模块

1. **定义模块数据结构**

```typescript
// src/types/CustomModule.ts
export interface CustomModuleData {
  type: 'custom_achievements';
  name: string;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    category: string;
    impact?: string;
  }>;
}
```

2. **创建模块数据**

```typescript
// src/data/module/DataAchievements.ts
export const DataAchievements: CustomModuleData = {
  type: 'custom_achievements',
  name: '个人成就',
  achievements: [
    {
      title: '技术创新奖',
      description: '在公司年度技术创新大赛中获得一等奖',
      date: '2023-12',
      category: '技术创新',
      impact: '提升团队开发效率30%'
    }
  ]
};
```

3. **创建模块组件**

```typescript
// src/components/cards/AchievementsCard.tsx
import React from 'react';
import styled from 'styled-components';

const AchievementItem = styled.div`
  border-left: 3px solid #3b82f6;
  padding-left: 16px;
  margin-bottom: 20px;
`;

const AchievementTitle = styled.h4`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const AchievementsCard: React.FC<{ data: CustomModuleData }> = ({ data }) => {
  return (
    <div>
      {data.achievements.map((achievement, index) => (
        <AchievementItem key={index}>
          <AchievementTitle>{achievement.title}</AchievementTitle>
          <p>{achievement.description}</p>
          {achievement.impact && (
            <p><strong>影响:</strong> {achievement.impact}</p>
          )}
        </AchievementItem>
      ))}
    </div>
  );
};
```

---

## 🎨 样式自定义

### 全局样式自定义

在 `src/styles/GlobalStyle.tsx` 中自定义全局样式：

```typescript
const GlobalStyle = createGlobalStyle`
  /* 自定义字体 */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  /* 自定义CSS变量 */
  :root {
    --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-family-mono: 'Fira Code', 'Monaco', 'Consolas', monospace;
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
  }
  
  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--color-surface);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--color-border-medium);
    border-radius: 4px;
  }
  
  /* 自定义选择文本样式 */
  ::selection {
    background: var(--color-primary);
    color: white;
  }
  
  /* 自定义打印样式 */
  @media print {
    body {
      font-size: 12pt;
      line-height: 1.4;
    }
    
    .no-print {
      display: none !important;
    }
    
    .page-break {
      page-break-before: always;
    }
  }
`;
```

### 响应式断点自定义

```typescript
// src/styles/breakpoints.ts
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const media = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`
};

// 使用示例
const ResponsiveComponent = styled.div`
  padding: 16px;
  
  ${media.md} {
    padding: 24px;
  }
  
  ${media.lg} {
    padding: 32px;
  }
`;
```

---

## 🌍 国际化自定义

### 添加新语言

1. **扩展语言类型**

```typescript
// src/i18n/index.tsx
export type Language = 'zh' | 'en' | 'ja' | 'ko';
```

2. **添加语言文本**

```typescript
// 日语文本
const jaTexts: I18nTexts = {
  nav: {
    frontend: 'フロントエンド開発',
    backend: 'バックエンドエンジニア',
    cto: '技術管理',
    // ... 其他翻译
  },
  // ... 完整翻译
};

// 更新文本映射
const texts: Record<Language, I18nTexts> = {
  zh: zhTexts,
  en: enTexts,
  ja: jaTexts,
  ko: koTexts
};
```

3. **更新语言切换器**

```typescript
const languages = [
  { code: 'zh', name: 'Chinese', icon: '🇨🇳', nativeName: '中文' },
  { code: 'en', name: 'English', icon: '🇺🇸', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', icon: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', icon: '🇰🇷', nativeName: '한국어' }
];
```

---

## 🚀 高级自定义

### 自定义构建配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@data': resolve(__dirname, 'src/data'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@types': resolve(__dirname, 'src/types')
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
```

### 环境变量配置

```bash
# .env.local
VITE_APP_TITLE=My Custom Resume
VITE_API_BASE_URL=https://api.example.com
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=YOUR_SENTRY_DSN
```

```typescript
// 使用环境变量
const config = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'FlexiResume',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN
};
```

### SEO 和搜索引擎配置

#### robots.txt 自定义

根据不同的使用场景，自定义搜索引擎抓取策略：

```txt
# 个人简历 - 完全隐私保护
User-agent: *
Disallow: /
```

#### Meta 标签自定义

在 `src/components/SEOHead.tsx` 中自定义SEO标签：

```typescript
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  robots = "noindex, nofollow" // 默认禁止索引
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />

      {/* 隐私保护 */}
      <meta name="referrer" content="no-referrer" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};
```

#### 隐私保护最佳实践

1. **默认禁止索引**: 使用 `noindex, nofollow`
2. **移除敏感信息**: 不在meta标签中包含个人联系方式
3. **禁用电话检测**: 防止移动端自动识别电话号码
4. **控制引用来源**: 使用 `no-referrer` 保护访问来源

---

## 📚 最佳实践

### 1. 组件设计原则

- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 设计通用的、可配置的组件
- **类型安全**: 使用 TypeScript 确保类型安全
- **性能优化**: 使用 React.memo 和 useMemo 优化性能

### 2. 样式管理

- **一致性**: 使用设计系统确保视觉一致性
- **可维护性**: 使用 CSS 变量和主题系统
- **响应式**: 移动优先的响应式设计
- **可访问性**: 遵循 WCAG 无障碍访问标准

### 3. 数据管理

- **模块化**: 将数据按模块组织
- **类型定义**: 为所有数据结构定义 TypeScript 类型
- **验证**: 在运行时验证数据结构
- **缓存**: 合理使用缓存提升性能

---

## 🔗 相关资源

- [React 官方文档](https://reactjs.org/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Styled Components 文档](https://styled-components.com/docs)
- [Vite 配置指南](https://vitejs.dev/config/)

---

<div align="center">

**自定义愉快！🎨**

通过这些自定义选项，您可以打造独一无二的简历展示效果。

</div>

## 🌐 Language Versions

- 🇨🇳 中文版本 (当前)
- [🇺🇸 English Version](../en/CUSTOMIZATION.md)
