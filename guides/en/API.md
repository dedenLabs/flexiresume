# 🔧 FlexiResume API Documentation

This document details the component API, data structures, and interface definitions of FlexiResume.

## 📋 Table of Contents

- [Core Component API](#core-component-api)
- [Data Structures](#data-structures)
- [Hook API](#hook-api)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)

---

## 🧩 Core Component API

### FlexiResume

The main resume display component.

```typescript
interface FlexiResumeProps {
  path: string;           // Current route path
  className?: string;     // Custom CSS class name
}
```

**Usage Example:**

```typescript
<FlexiResume path="/frontend" />
```

### ControlPanel

Control panel component, integrates theme and language switch functionality.

```typescript
interface ControlPanelProps {
  className?: string;           // Custom CSS class name
  collapsible?: boolean;        // Whether it is collapsible, default false
  defaultCollapsed?: boolean;   // Default whether to collapse, default false
}
```

**Usage Example:**

```typescript
<ControlPanel collapsible={true} defaultCollapsed={false} />
```

### ThemeSwitcher

Theme switching component.

```typescript
interface ThemeSwitcherProps {
  className?: string;     // Custom CSS class name
  showTooltip?: boolean;  // Whether to show tooltip, default true
}
```

**Usage Example:**

```typescript
<ThemeSwitcher showTooltip={false} />
```

### LanguageSwitcher

Language switching component.

```typescript
interface LanguageSwitcherProps {
  className?: string;     // Custom CSS class name
}
```

**Usage Example:**

```typescript
<LanguageSwitcher />
```

### SkeletonComponents

Skeleton screen component collection.

```typescript
// Text skeleton screen
interface SkeletonTextProps {
  width?: string;         // Width, default '100%'
  height?: string;        // Height, default '16px'
  margin?: string;        // Margin, default '8px 0'
}

// Title skeleton screen
interface SkeletonTitleProps {
  size?: 'small' | 'medium' | 'large';  // Size, default 'medium'
}

// Avatar skeleton screen
interface SkeletonAvatarProps {
  size?: number;          // Size, default 80
}

// Button skeleton screen
interface SkeletonButtonProps {
  width?: string;         // Width, default '100px'
}

// List item skeleton screen
interface SkeletonListItemProps {
  showAvatar?: boolean;   // Whether to show avatar, default false
}

// Table skeleton screen
interface SkeletonTableProps {
  rows?: number;          // Number of rows, default 3
  columns?: number;       // Number of columns, default 4
}
```

**Usage Example:**

```typescript
<SkeletonText width="80%" height="20px" />
<SkeletonTitle size="large" />
<SkeletonAvatar size={100} />
<SkeletonListItem showAvatar={true} />
<SkeletonTable rows={5} columns={3} />
```

---

## 📊 Data Structures

### IFlexiResume

The main resume data interface.

```typescript
interface IFlexiResume {
  header_info: HeaderInfo;
  personal_strengths?: PersonalStrengths;
  skills?: Skills;
  employment_history?: EmploymentHistory;
  project_experience?: ProjectExperience;
  education_history?: EducationHistory;
  personal_influence?: PersonalInfluence;
  career_planning?: CareerPlanning;
  open_source_projects?: OpenSourceProjects;
}
```

### HeaderInfo

Header information data structure.

```typescript
interface HeaderInfo {
  name: string;                    // Name
  position: string;                // Position
  phone: string;                   // Phone
  email: string;                   // Email
  location: string;                // Address
  home_page?: string;              // Personal website
  github?: string;                 // GitHub username
  avatar?: string;                 // Avatar path
  route_base_name: string;         // Route base name
  expected_positions: ExpectedPositions;  // Expected position configuration
}
```

### ExpectedPositions

Expected position configuration.

```typescript
interface ExpectedPositions {
  [key: string]: {
    title: string;                 // Position title
    path: string;                  // Route path
    data: Partial<IFlexiResume>;   // Position specific data
  };
}
```

### Skills

FlexiResume supports two skill data structures:

#### 1. Skill tree structure (DataSkills.ts)

```typescript
interface SkillTreeNode {
  name: string;                    // Skill category name
  content?: string;                // Skill description content (supports Markdown)
  children?: SkillTreeNode[];      // Sub-skill categories
}

// Usage example
const skillTree: SkillTreeNode[] = [
  {
    name: 'Programming Languages',
    content: '- **Proficient**: JavaScript, TypeScript\n- **Familiar**: Python, Java'
  },
  {
    name: 'Frontend Development',
    children: [
      {
        name: 'Frameworks/Libraries',
        content: '- **Proficient**: React, Vue\n- **Familiar**: Angular'
      }
    ]
  }
];
```

#### 2. Skill proficiency structure (SkillsData.ts)

```typescript
interface SkillLevel {
  type: 'skill_level';
  name: string;                    // Module name
  list: [string, number][];        // [Skill name, Proficiency level]
}

// Proficiency level definition
type SkillProficiency = 1 | 2 | 3;
// 1: Familiar (Basic mastery, requires guidance)
// 2: Skilled (Can independently complete complex tasks)
// 3: Expert (Deep mastery, can guide others)

// Usage example
const skillLevels: SkillLevel = {
  type: 'skill_level',
  name: 'Skill Proficiency',
  list: [
    ['JavaScript', 3],    // Expert
    ['Python', 2],        // Skilled
    ['Golang', 1]         // Familiar
  ]
};
```

### EmploymentHistory

Work experience data structure.

```typescript
interface EmploymentHistory {
  type: 'employment_history';
  name: string;                    // Module name
  list: Employment[];              // Work experience list
}

interface Employment {
  company_name: string;            // Company name
  start_time: string;              // Start time
  end_time: string;                // End time
  position: string;                // Position
  description: string;             // Work description (supports Markdown)
}
```

### ProjectExperience

Project experience data structure.

```typescript
interface ProjectExperience {
  type: 'project_experience';
  name: string;                    // Module name
  list: Project[];                 // Project list
}

interface Project {
  name: string;                    // Project name
  start_time: string;              // Start time
  end_time: string;                // End time
  description: string;             // Project description (supports Markdown)
  tech_stack?: string[];           // Technology stack
  role?: string;                   // Role
  team_size?: number;              // Team size
  url?: string;                    // Project link
}
```

---

## 🎣 Hook API

### useTheme

Theme management hook.

```typescript
interface ThemeContextType {
  mode: ThemeMode;                 // Current theme mode
  setMode: (mode: ThemeMode) => void;  // Set theme mode
  toggleMode: () => void;          // Switch theme mode
  colors: ThemeColors;             // Current theme colors
  isDark: boolean;                 // Whether it is dark mode
}

const useTheme = (): ThemeContextType;
```

**Usage Example:**

```typescript
const { mode, toggleMode, colors, isDark } = useTheme();

// Switch theme
const handleToggle = () => {
  toggleMode();
};

// Use theme colors
const StyledComponent = styled.div`
  background: ${colors.background};
  color: ${colors.text.primary};
`;
```

### useI18n

Internationalization management hook.

```typescript
interface I18nContextType {
  language: Language;              // Current language
  setLanguage: (lang: Language) => void;  // Set language
  t: I18nTexts;                    // Translated text
}

const useI18n = (): I18nContextType;
```

**Usage Example:**

```typescript
const { language, setLanguage, t } = useI18n();

// Switch language
const handleLanguageChange = (newLang: Language) => {
  setLanguage(newLang);
};

// Use translated text
<h1>{t.resume.personalInfo}</h1>
<button>{t.common.switchLanguage}</button>
```

---

## 🛠️ Utility Functions

### assignDeep

Utility function for deeply merging objects.

```typescript
function assignDeep<T>(target: T, ...sources: Partial<T>[]): T;
```

**Usage Example:**

```typescript
const merged = assignDeep({}, baseData, positionData, skillsData);
```



### formatDate

Date formatting utility function.

```typescript
function formatDate(date: string, format?: string): string;
```

**Usage Example:**

```typescript
const formatted = formatDate('2023-12-01', 'YYYY年MM月');
// Output: "2023年12月"
```

---

## 📝 Type Definitions

### ThemeMode

Theme mode type.

```typescript
type ThemeMode = 'light' | 'dark';
```

### Language

Supported language type.

```typescript
type Language = 'zh' | 'en';
```

### ThemeColors

Theme color configuration type.

```typescript
interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  shadow: {
    light: string;
    medium: string;
    dark: string;
  };
}
```

### I18nTexts

Internationalization text type.

```typescript
interface I18nTexts {
  nav: {
    frontend: string;
    backend: string;
    cto: string;
    contract: string;
    agent: string;
    gamedev: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    contact: string;
    download: string;
    print: string;
    share: string;
    switchLanguage: string;
    switchTheme: string;
    lightMode: string;
    darkMode: string;
  };
  resume: {
    personalInfo: string;
    personalStrengths: string;
    skills: string;
    employmentHistory: string;
    projectExperience: string;
    educationHistory: string;
    personalInfluence: string;
    careerPlanning: string;
    openSourceProjects: string;
  };
  // ... other text categories
}
```

---

## 🔌 Extension Interfaces

### Custom Module Interface

```typescript
interface CustomModule {
  type: string;                    // Module type
  name: string;                    // Module name
  [key: string]: any;              // Other custom properties
}
```

### Plugin Interface

```typescript
interface Plugin {
  name: string;                    // Plugin name
  version: string;                 // Plugin version
  install: (app: any) => void;     // Install function
  uninstall?: (app: any) => void;  // Uninstall function
}
```

---

## 📚 Usage Examples

### Complete Component Usage Example

```typescript
import React from 'react';
import { useTheme, useI18n } from '../hooks';
import { ControlPanel, SkeletonResume } from '../components';

const MyResumeApp: React.FC = () => {
  const { isDark, colors } = useTheme();
  const { t } = useI18n();

  return (
    <div style={{ 
      background: colors.background,
      color: colors.text.primary,
      minHeight: '100vh'
    }}>
      <ControlPanel collapsible={true} />
      
      <main>
        <h1>{t.resume.personalInfo}</h1>
        <React.Suspense fallback={<SkeletonResume />}>
          <FlexiResume path="/frontend" />
        </React.Suspense>
      </main>
    </div>
  );
};
```

---

## 🔗 Related Links

- [Usage Guide](USAGE.md)
- [Customization Guide](CUSTOMIZATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)

---

<div align="center">

**API Documentation Complete! 📚**

Through these APIs, you can make full use of all the features of FlexiResume. 

</div>

## 🌐 Language Versions

- [🇨🇳 中文版本](../zh/API.md) 
- [🇺🇸 English Version](API.md)(Current)


