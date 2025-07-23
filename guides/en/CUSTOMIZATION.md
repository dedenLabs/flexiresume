# 🎨 Customization Guide for FlexiResume

This guide provides detailed instructions on customizing various aspects of FlexiResume, including themes, components, modules, etc.

## 📋 Table of Contents

- [Environment Variables Configuration](#environment-variables-configuration)
- [Analytics Configuration](#analytics-configuration)
- [Theme Customization](#theme-customization)
- [Component Customization](#component-customization)
- [Module Customization](#module-customization)
- [Style Customization](#style-customization)
- [Internationalization Customization](#internationalization-customization)
- [Advanced Customization](#advanced-customization)

---

## ⚙️ Environment Variables Configuration

FlexiResume supports flexible configuration through environment variables. All user-configurable settings have been extracted to the `.env` file.

### Configuration Files

1. **`.env`** - Current environment configuration file
2. **`.env.example`** - Configuration template with all available options and detailed descriptions

### Quick Start

```bash
# 1. Copy configuration template
cp .env.example .env
# cp .env.example .env.local # Takes effect when running npm run dev
# cp .env.example .env.production # Configuration for production environment, takes effect when running npm run build

# 2. Modify configuration as needed
vim .env

# 3. Restart development server
npm run dev
```

### Main Configuration Categories

#### 📊 Analytics Configuration
```bash
# Baidu Analytics
VITE_BAIDU_ENABLED=false
VITE_BAIDU_SITE_ID=your_baidu_site_id

# Google Analytics
VITE_GOOGLE_ENABLED=false
VITE_GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX

# ELK Stack
VITE_ELK_ENABLED=false
VITE_ELK_ENDPOINT=http://localhost:5000/api/analytics
```

#### 🚀 CDN Configuration
```bash
# CDN enable and URL configuration
VITE_CDN_ENABLED=true
VITE_CDN_BASE_URLS=https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/,https://flexiresume-static.web.app/

# CDN health check
VITE_CDN_HEALTH_CHECK_TIMEOUT=5000
VITE_CDN_SORTING_MODE=speed
```

#### 🎨 Theme Configuration
```bash
# Default theme settings
VITE_DEFAULT_THEME=auto
VITE_ENABLE_THEME_TRANSITIONS=true
VITE_THEME_TRANSITION_DURATION=300
```

#### ⚡ Performance Configuration
```bash
# Lazy loading settings
VITE_ENABLE_LAZY_LOADING=true
VITE_LAZY_LOADING_THRESHOLD=100

# Preload resources
VITE_ENABLE_PRELOADING=true
VITE_PRELOAD_RESOURCES=/images/avatar.webp,/images/background.webp
```

#### 🔧 Build Configuration
```bash
# Static route pages
VITE_STATIC_ROUTE_PAGES=game,frontend,backend,cto,agent,contracttask,fullstack

# Project information
VITE_APP_NAME=FlexiResume
VITE_APP_VERSION=1.0.1
VITE_DEBUG=false
```

### Configuration Priority

1. **Environment Variables** (Highest priority)
2. **`.env` File**
3. **Default Values in Code** (Lowest priority)

### Deployment Configuration

#### Docker Deployment
```bash
# Pass configuration through environment variables
docker run -e VITE_CDN_ENABLED=true -e VITE_DEBUG=false your-image

# Or use docker-compose
environment:
  - VITE_CDN_ENABLED=true
  - VITE_DEFAULT_THEME=dark
```

#### Static Deployment
```bash
# Set environment variables before build
export VITE_CDN_ENABLED=true
export VITE_DEBUG=false
npm run build
```

---

## 📈 Analytics Configuration

FlexiResume supports multiple analytics solutions that can be used individually or in combination.

### Supported Analytics Solutions

#### 1. Baidu Analytics (Recommended for Chinese users)

**Configuration Steps:**

1. **Get Site ID**
   - Visit [Baidu Analytics](https://tongji.baidu.com/)
   - Create a site and get the site ID

2. **Configure Environment Variables**
```bash
# Enable Baidu Analytics
VITE_BAIDU_ENABLED=true

# Set Site ID (Required)
VITE_BAIDU_SITE_ID=your_actual_site_id

# Set Domain (Optional)
VITE_BAIDU_DOMAIN=your-domain.com
```

3. **Verify Configuration**
   - Check browser console after starting the app
   - Confirm Baidu Analytics script loads properly

#### 2. Google Analytics (Recommended for international users)

**Configuration Steps:**

1. **Create GA4 Property**
   - Visit [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property and get the measurement ID

2. **Configure Environment Variables**
```bash
# Enable Google Analytics
VITE_GOOGLE_ENABLED=true

# Set Measurement ID (Required)
VITE_GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Analytics settings (Optional)
VITE_GOOGLE_USE_FIREBASE=true
VITE_GOOGLE_DYNAMIC_LOADING=true
```

3. **Firebase Configuration** (If using Firebase Analytics)
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### 3. ELK Stack (Advanced users)

**Configuration Steps:**

1. **Configure Environment Variables**
```bash
VITE_ELK_ENABLED=true

VITE_ELK_ENDPOINT=http://esk-host

VITE_ELK_BATCH_SIZE=10
VITE_ELK_FLUSH_INTERVAL=5000
```

2. **Access the Analytics Interface**
   - Kibana: http://kibana-host
   - Grafana: http://grafana-host



### Analytics Features

#### Automatic Event Tracking
- **Page Views**: Automatically record page visits
- **User Interactions**: Button clicks, link visits
- **Performance Metrics**: Page load time, resource loading status
- **Error Monitoring**: JavaScript errors, network errors

#### Privacy Protection
- **Default Disabled**: All analytics features are disabled by default
- **User Control**: Users can choose to enable/disable analytics
- **Data Minimization**: Only collect necessary anonymous data
- **Local First**: ELK solution supports fully local deployment

#### Debug Mode
```bash
# Enable analytics debug logs
VITE_DEBUG=true

# View analytics logs
DEBUG=app:* npm run dev
```
### View Statistics Data

#### Baidu Statistics
- Log in to the Baidu Statistics backend to view detailed reports
- Supports real-time visitors, source analysis, page analysis, etc.

#### Google Analytics
- Log in to the GA4 backend to view analytical reports
- Supports real-time reporting, audience segments, customer acquisition, etc.

#### ELK Stack
- **Kibana**: Flexible data querying and visualization
- **Grafana**: Professional monitoring dashboards
- **Custom analytics**: Supports complex data analysis needs

### Best Practices

1. **Choose Appropriate Solution**
   - Personal Resume: Recommend disabling all analytics
   - Portfolio Website: Choose Baidu Analytics or Google Analytics
   - Technical Showcase: Can use ELK Stack to demonstrate technical capabilities

2. **Privacy Protection**
   - Explain data collection in privacy policy
   - Provide user opt-out options
   - Regularly clean unnecessary data

3. **Performance Optimization**
   - Use dynamic loading to avoid affecting page performance
   - Set reasonable batch size and flush intervals
   - Disable debug logs in production

---

## 🌈 Theme Customization

### Creating Custom Themes

1. **Extending Theme Configuration**

Add a new theme in `src/theme/index.tsx`:

```typescript
// Custom theme colors
const customTheme: ThemeColors = {
  primary: '#6366f1',      // Primary color
  secondary: '#8b5cf6',    // Secondary color
  accent: '#f59e0b',       // Accent color
  
  background: '#fafafa',   // Background color
  surface: '#ffffff',      // Surface color
  card: '#f8fafc',         // Card color
  
  text: {
    primary: '#1f2937',    // Primary text
    secondary: '#6b7280',  // Secondary text
    disabled: '#d1d5db',   // Disabled text
    inverse: '#ffffff'     // Inverse text
  },
  
  border: {
    light: '#f3f4f6',     // Light border
    medium: '#d1d5db',     // Medium border
    dark: '#9ca3af'        // Dark border
  },
  
  status: {
    success: '#10b981',    // Success color
    warning: '#f59e0b',    // Warning color
    error: '#ef4444',      // Error color
    info: '#3b82f6'        // Info color
  }
};
```

2. **CSS Variables Customization**

Use CSS variables for dynamic theme switching:

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

## 🧩 Custom Components

### Create a Custom Card Component

```typescript
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

### Register Custom Components

Add to `src/pages/FlexiResume.tsx`:

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

## 📝 Module Customization

### Skill Module Customization

FlexiResume provides two ways to display skills, you can choose one or use both as needed:

#### 1. Skill Tree Module (Recommended for detailed display)

```typescript
export default [
  {
    name: 'Skill Category Name',
    content: `- **Expertise**: Skill1, Skill2
- **Proficiency**: Skill3, Skill4`,
    children: [
      {
        name: 'Subcategory',
        content: 'Subcategory skill description'
      }
    ]
  }
];
```

#### 2. Skill Proficiency Module (Recommended for quick display)

```typescript
export const getSkillsData = () => {
  return {
    type: "skill_level",
    name: "Skill Proficiency",
    list: [
      ["Skill Name", 3],  // 3=Expertise, 2=Proficiency, 1=Knowledge
      ["Another Skill", 2],
      // ... More skills
    ]
  };
};
```

### Create Custom Modules

1. **Define Module Data Structure**

```typescript
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

2. **Create Module Data**

```typescript
export const DataAchievements: CustomModuleData = {
  type: 'custom_achievements',
  name: 'Personal Achievements',
  achievements: [
    {
      title: 'Innovation Award',
      description: 'Received first prize in the company\'s annual innovation competition',
      date: '2023-12',
      category: 'Innovation',
      impact: 'Improved team development efficiency by 30%'
    }
  ]
};
```

3. **Create Module Component**

```typescript
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
            <p><strong>Impact:</strong> {achievement.impact}</p>
          )}
        </AchievementItem>
      ))}
    </div>
  );
};
```

---

## 🎨 Style Customization

### Global Style Customization

Customize global styles in `src/styles/GlobalStyle.tsx`:

```typescript
const GlobalStyle = createGlobalStyle`
  /* Custom Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  /* Custom CSS Variables */
  :root {
    --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-family-mono: 'Fira Code', 'Monaco', 'Consolas', monospace;
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
  }
  
  /* Custom Scrollbars */
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
  
  /* Custom Text Selection */
  ::selection {
    background: var(--color-primary);
    color: white;
  }
  
  /* Custom Print Styles */
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

### Responsive Breakpoints Customization

```typescript
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

// Example Usage
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

## 🌍 Internationalization Customization

### Add New Language

1. **Extend Language Types**

```typescript
export type Language = 'zh' | 'en' | 'ja' | 'ko';
```

2. **Add Language Texts**

```typescript
// Japanese Texts
const jaTexts: I18nTexts = {
  nav: {
    frontend: 'Frontend Development',
    backend: 'Backend Engineer',
    cto: 'Technology Management',
    // ... other translations
  },
  // ... complete translations
};

// Update Text Mapping
const texts: Record<Language, I18nTexts> = {
  zh: zhTexts,
  en: enTexts,
  ja: jaTexts,
  ko: koTexts
};
```

3. **Update Language Switcher**

```typescript
const languages = [
  { code: 'zh', name: 'Chinese', icon: '🇨🇳', nativeName: '中文' },
  { code: 'en', name: 'English', icon: '🇺🇸', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', icon: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', icon: '🇰🇷', nativeName: '한국어' }
];
```

---

## 🚀 Advanced Customization

### Custom Build Configuration

```typescript
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

### Environment Variable Configuration

```bash
# .env.local
VITE_APP_TITLE=My Custom Resume
VITE_API_BASE_URL=https://api.example.com
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=YOUR_SENTRY_DSN
```

```typescript
// Use Environment Variables
const config = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'FlexiResume',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN
};
```

### SEO and Search Engine Configuration

#### robots.txt Customization

Customize search engine crawling strategies based on different usage scenarios:

```txt
# Personal Resume - Full Privacy Protection
User-agent: *
Disallow: /
```

#### Meta Tag Customization

Customize SEO tags in `src/components/SEOHead.tsx`:

```typescript
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  robots = "noindex, nofollow" // Default to prohibiting indexing
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />

      {/* Privacy Protection */}
      <meta name="referrer" content="no-referrer" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};
```

#### Privacy Protection Best Practices

1. **Default to No Indexing**: Use `noindex, nofollow`
2. **Remove Sensitive Information**: Do not include personal contact information in meta tags
3. **Disable Phone Detection**: Prevent mobile devices from automatically identifying phone numbers
4. **Control Referrer**: Use `no-referrer` to protect referrer information

---

## 📚 Best Practices

### 1. Component Design Principles

- **Single Responsibility**: Each component should only handle one function
- **Reusability**: Design general and configurable components
- **Type Safety**: Use TypeScript to ensure type safety
- **Performance Optimization**: Use React.memo and useMemo to optimize performance

### 2. Style Management

- **Consistency**: Use a design system to ensure visual consistency
- **Maintainability**: Use CSS variables and a theme system
- **Responsiveness**: Mobile-first responsive design
- **Accessibility**: Follow WCAG accessibility standards

### 3. Data Management

- **Modularity**: Organize data by module
- **Type Definitions**: Define TypeScript types for all data structures
- **Validation**: Validate data structures at runtime
- **Caching**: Use caching appropriately to improve performance

---

## 🔗 Related Resources

- [React Official Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Styled Components Documentation](https://styled-components.com/docs)
- [Vite Configuration Guide](https://vitejs.dev/config/)

---

<div align="center">

**Customization Made Easy! 🎨**

With these customization options, you can create a unique resume display effect.

</div>


## 🌐 Language Versions

- [🇨🇳 中文版本](../zh/CUSTOMIZATION.md)
- 🇺🇸 English Version (Current)
