# 🎨 FlexiResume 自定义指南

本指南将详细介绍如何自定义 FlexiResume 的各个方面，包括主题、组件、模块等。

## 📋 目录

- [主题自定义](#主题自定义)
- [组件自定义](#组件自定义)
- [模块自定义](#模块自定义)
- [样式自定义](#样式自定义)
- [国际化自定义](#国际化自定义)
- [高级自定义](#高级自定义)

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

# 作品集网站 - 部分开放
User-agent: *
Allow: /
Disallow: /contact
Disallow: /resume/personal

# 技术博客 - 完全开放
User-agent: *
Allow: /
Crawl-delay: 1

Sitemap: https://your-domain.com/sitemap.xml
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
