# 🔧 FlexiResume API 文档

本文档详细介绍了 FlexiResume 的组件 API、数据结构和接口定义。

## 📋 目录

- [核心组件 API](#核心组件-api)
- [数据结构](#数据结构)
- [Hook API](#hook-api)
- [工具函数](#工具函数)
- [类型定义](#类型定义)

---

## 🧩 核心组件 API

### FlexiResume

主要的简历展示组件。

```typescript
interface FlexiResumeProps {
  path: string;           // 当前路由路径
  className?: string;     // 自定义CSS类名
}
```

**使用示例:**

```typescript
<FlexiResume path="/frontend" />
```

### ControlPanel

控制面板组件，集成主题和语言切换功能。

```typescript
interface ControlPanelProps {
  className?: string;           // 自定义CSS类名
  collapsible?: boolean;        // 是否可折叠，默认 false
  defaultCollapsed?: boolean;   // 默认是否折叠，默认 false
}
```

**使用示例:**

```typescript
<ControlPanel collapsible={true} defaultCollapsed={false} />
```

### ThemeSwitcher

主题切换组件。

```typescript
interface ThemeSwitcherProps {
  className?: string;     // 自定义CSS类名
  showTooltip?: boolean;  // 是否显示提示，默认 true
}
```

**使用示例:**

```typescript
<ThemeSwitcher showTooltip={false} />
```

### LanguageSwitcher

语言切换组件。

```typescript
interface LanguageSwitcherProps {
  className?: string;     // 自定义CSS类名
}
```

**使用示例:**

```typescript
<LanguageSwitcher />
```

### SkeletonComponents

骨架屏组件集合。

```typescript
// 文本骨架屏
interface SkeletonTextProps {
  width?: string;         // 宽度，默认 '100%'
  height?: string;        // 高度，默认 '16px'
  margin?: string;        // 外边距，默认 '8px 0'
}

// 标题骨架屏
interface SkeletonTitleProps {
  size?: 'small' | 'medium' | 'large';  // 尺寸，默认 'medium'
}

// 头像骨架屏
interface SkeletonAvatarProps {
  size?: number;          // 尺寸，默认 80
}

// 按钮骨架屏
interface SkeletonButtonProps {
  width?: string;         // 宽度，默认 '100px'
}

// 列表项骨架屏
interface SkeletonListItemProps {
  showAvatar?: boolean;   // 是否显示头像，默认 false
}

// 表格骨架屏
interface SkeletonTableProps {
  rows?: number;          // 行数，默认 3
  columns?: number;       // 列数，默认 4
}
```

**使用示例:**

```typescript
<SkeletonText width="80%" height="20px" />
<SkeletonTitle size="large" />
<SkeletonAvatar size={100} />
<SkeletonListItem showAvatar={true} />
<SkeletonTable rows={5} columns={3} />
```

---

## 📊 数据结构

### IFlexiResume

主要的简历数据接口。

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

头部信息数据结构。

```typescript
interface HeaderInfo {
  name: string;                    // 姓名
  position: string;                // 职位
  phone: string;                   // 电话
  email: string;                   // 邮箱
  location: string;                // 地址
  home_page?: string;              // 个人网站
  github?: string;                 // GitHub用户名
  avatar?: string;                 // 头像路径
  route_base_name: string;         // 路由基础路径
  expected_positions: ExpectedPositions;  // 期望职位配置
}
```

### ExpectedPositions

期望职位配置。

```typescript
interface ExpectedPositions {
  [key: string]: {
    title: string;                 // 职位标题
    path: string;                  // 路由路径
    data: Partial<IFlexiResume>;   // 职位特定数据
  };
}
```

### Skills

FlexiResume 支持两种技能数据结构：

#### 1. 技能树结构 (DataSkills.ts)

```typescript
interface SkillTreeNode {
  name: string;                    // 技能分类名称
  content?: string;                // 技能描述内容 (支持Markdown)
  children?: SkillTreeNode[];      // 子技能分类
}

// 使用示例
const skillTree: SkillTreeNode[] = [
  {
    name: '编程语言',
    content: '- **精通**: JavaScript, TypeScript\n- **熟练**: Python, Java'
  },
  {
    name: '前端开发',
    children: [
      {
        name: '框架/库',
        content: '- **精通**: React, Vue\n- **熟练**: Angular'
      }
    ]
  }
];
```

#### 2. 技能熟练度结构 (SkillsData.ts)

```typescript
interface SkillLevel {
  type: 'skill_level';
  name: string;                    // 模块名称
  list: [string, number][];        // [技能名称, 熟练度等级]
}

// 熟练度等级定义
type SkillProficiency = 1 | 2 | 3;
// 1: 了解 (基本掌握，需要指导)
// 2: 熟练 (能够独立完成复杂任务)
// 3: 精通 (深度掌握，能够指导他人)

// 使用示例
const skillLevels: SkillLevel = {
  type: 'skill_level',
  name: '技能熟练度',
  list: [
    ['JavaScript', 3],    // 精通
    ['Python', 2],        // 熟练
    ['Golang', 1]         // 了解
  ]
};
```

### EmploymentHistory

工作经历数据结构。

```typescript
interface EmploymentHistory {
  type: 'employment_history';
  name: string;                    // 模块名称
  list: Employment[];              // 工作经历列表
}

interface Employment {
  company_name: string;            // 公司名称
  start_time: string;              // 开始时间
  end_time: string;                // 结束时间
  position: string;                // 职位
  description: string;             // 工作描述 (支持Markdown)
}
```

### ProjectExperience

项目经历数据结构。

```typescript
interface ProjectExperience {
  type: 'project_experience';
  name: string;                    // 模块名称
  list: Project[];                 // 项目列表
}

interface Project {
  name: string;                    // 项目名称
  start_time: string;              // 开始时间
  end_time: string;                // 结束时间
  description: string;             // 项目描述 (支持Markdown)
  tech_stack?: string[];           // 技术栈
  role?: string;                   // 担任角色
  team_size?: number;              // 团队规模
  url?: string;                    // 项目链接
}
```

---

## 🎣 Hook API

### useTheme

主题管理 Hook。

```typescript
interface ThemeContextType {
  mode: ThemeMode;                 // 当前主题模式
  setMode: (mode: ThemeMode) => void;  // 设置主题模式
  toggleMode: () => void;          // 切换主题模式
  colors: ThemeColors;             // 当前主题颜色
  isDark: boolean;                 // 是否为深色模式
}

const useTheme = (): ThemeContextType;
```

**使用示例:**

```typescript
const { mode, toggleMode, colors, isDark } = useTheme();

// 切换主题
const handleToggle = () => {
  toggleMode();
};

// 使用主题颜色
const StyledComponent = styled.div`
  background: ${colors.background};
  color: ${colors.text.primary};
`;
```

### useI18n

国际化管理 Hook。

```typescript
interface I18nContextType {
  language: Language;              // 当前语言
  setLanguage: (lang: Language) => void;  // 设置语言
  t: I18nTexts;                    // 翻译文本
}

const useI18n = (): I18nContextType;
```

**使用示例:**

```typescript
const { language, setLanguage, t } = useI18n();

// 切换语言
const handleLanguageChange = (newLang: Language) => {
  setLanguage(newLang);
};

// 使用翻译文本
<h1>{t.resume.personalInfo}</h1>
<button>{t.common.switchLanguage}</button>
```

### useFont

字体管理 Hook，支持多CDN源和性能监控。

```typescript
interface FontContextType {
  currentFont: string;                    // 当前字体
  isLoading: boolean;                     // 是否正在加载
  error: string | null;                   // 错误信息
  switchFont: (fontFamily: string) => void;  // 切换字体
  performance: FontPerformanceMetrics;    // 性能指标
}

interface FontPerformanceMetrics {
  loadTime: number;                       // 加载时间
  successRate: number;                    // 成功率
  cdnResponseTimes: Record<string, number>; // CDN响应时间
  errorCount: number;                     // 错误次数
}

const useFont = (): FontContextType;
```

**使用示例:**

```typescript
const {
  currentFont,
  isLoading,
  error,
  switchFont,
  performance
} = useFont();

// 切换字体
const handleFontChange = (fontFamily: string) => {
  switchFont(fontFamily);
};

// 显示加载状态
if (isLoading) {
  return <div>字体加载中...</div>;
}

// 显示错误信息
if (error) {
  return <div>字体加载失败: {error}</div>;
}

// 使用字体
return (
  <div style={{ fontFamily: currentFont }}>
    内容文本
  </div>
);
```

### useAudio

音频管理 Hook，支持背景音乐和音效控制。

```typescript
interface AudioContextType {
  isPlaying: boolean;                     // 是否正在播放
  volume: number;                         // 音量 (0-1)
  isMuted: boolean;                       // 是否静音
  playBackgroundMusic: () => void;        // 播放背景音乐
  pauseBackgroundMusic: () => void;       // 暂停背景音乐
  playSoundEffect: (effect: string) => void; // 播放音效
  setVolume: (volume: number) => void;    // 设置音量
  toggleMute: () => void;                 // 切换静音
}

const useAudio = (): AudioContextType;
```

**使用示例:**

```typescript
const {
  isPlaying,
  volume,
  isMuted,
  playBackgroundMusic,
  pauseBackgroundMusic,
  playSoundEffect,
  setVolume,
  toggleMute
} = useAudio();

// 播放/暂停背景音乐
const handleToggleMusic = () => {
  if (isPlaying) {
    pauseBackgroundMusic();
  } else {
    playBackgroundMusic();
  }
};

// 播放点击音效
const handleClick = () => {
  playSoundEffect('click');
};

// 调整音量
const handleVolumeChange = (newVolume: number) => {
  setVolume(newVolume);
};
```

---

## 🛠️ 工具函数

### assignDeep

深度合并对象的工具函数。

```typescript
function assignDeep<T>(target: T, ...sources: Partial<T>[]): T;
```

**使用示例:**

```typescript
const merged = assignDeep({}, baseData, positionData, skillsData);
```



### formatDate

日期格式化工具函数。

```typescript
function formatDate(date: string, format?: string): string;
```

**使用示例:**

```typescript
const formatted = formatDate('2023-12-01', 'YYYY年MM月');
// 输出: "2023年12月"
```

### Logger

统一日志系统，支持分级日志和性能监控。

```typescript
class Logger {
  static debug(message: string, data?: any): void;
  static info(message: string, data?: any): void;
  static warn(message: string, data?: any): void;
  static error(message: string, error?: Error): void;
  static performance(label: string, duration: number): void;
}
```

**使用示例:**

```typescript
import { Logger } from '@/utils/Logger';

// 调试信息
Logger.debug('组件渲染', { componentName: 'FlexiResume' });

// 一般信息
Logger.info('用户操作', { action: 'theme-switch' });

// 警告信息
Logger.warn('性能警告', { loadTime: 3000 });

// 错误信息
Logger.error('加载失败', new Error('Network error'));

// 性能监控
Logger.performance('字体加载', 1200);
```

### MemoryManager

内存管理器，智能缓存和垃圾回收。

```typescript
class MemoryManager {
  static setCache<T>(key: string, value: T, ttl?: number): void;
  static getCache<T>(key: string): T | null;
  static clearCache(key?: string): void;
  static getMemoryUsage(): MemoryUsage;
  static cleanup(): void;
}

interface MemoryUsage {
  used: number;        // 已使用内存
  total: number;       // 总内存
  percentage: number;  // 使用百分比
}
```

**使用示例:**

```typescript
import { MemoryManager } from '@/utils/MemoryManager';

// 设置缓存
MemoryManager.setCache('user-data', userData, 300000); // 5分钟TTL

// 获取缓存
const cachedData = MemoryManager.getCache('user-data');

// 清理缓存
MemoryManager.clearCache('user-data');

// 获取内存使用情况
const memoryUsage = MemoryManager.getMemoryUsage();
console.log(`内存使用: ${memoryUsage.percentage}%`);

// 手动清理
MemoryManager.cleanup();
```

### ThemeUtils

主题工具类，统一主题管理和切换。

```typescript
class ThemeUtils {
  static applyTheme(theme: ThemeColors): void;
  static validateTheme(theme: ThemeColors): boolean;
  static mergeThemes(base: ThemeColors, override: Partial<ThemeColors>): ThemeColors;
  static getContrastRatio(color1: string, color2: string): number;
}
```

**使用示例:**

```typescript
import { ThemeUtils } from '@/utils/ThemeUtils';

// 应用主题
ThemeUtils.applyTheme(customTheme);

// 验证主题
const isValid = ThemeUtils.validateTheme(userTheme);

// 合并主题
const mergedTheme = ThemeUtils.mergeThemes(baseTheme, customizations);

// 检查对比度
const contrast = ThemeUtils.getContrastRatio('#ffffff', '#000000');
```

### EnhancedAudioPlayer

增强音频播放器，支持高级音频控制。

```typescript
class EnhancedAudioPlayer {
  constructor(config?: AudioConfig);

  playBackgroundMusic(url?: string): Promise<void>;
  pauseBackgroundMusic(): void;
  resumeBackgroundMusic(): void;
  stopBackgroundMusic(): void;

  playSoundEffect(effectName: string): Promise<void>;

  setVolume(volume: number): void;
  getVolume(): number;

  mute(): void;
  unmute(): void;
  isMuted(): boolean;

  fadeIn(duration: number): Promise<void>;
  fadeOut(duration: number): Promise<void>;
}
```

**使用示例:**

```typescript
import { EnhancedAudioPlayer } from '@/utils/EnhancedAudioPlayer';

const audioPlayer = new EnhancedAudioPlayer({
  volume: 0.5,
  loop: true
});

// 播放背景音乐
await audioPlayer.playBackgroundMusic('/audio/background.mp3');

// 播放音效
await audioPlayer.playSoundEffect('click');

// 音量控制
audioPlayer.setVolume(0.3);

// 淡入淡出
await audioPlayer.fadeIn(2000);
await audioPlayer.fadeOut(1000);
```

---

## 📝 类型定义

### ThemeMode

主题模式类型。

```typescript
type ThemeMode = 'light' | 'dark';
```

### Language

支持的语言类型。

```typescript
type Language = 'zh' | 'en';
```

### ThemeColors

主题颜色配置类型。

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

国际化文本类型。

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
  // ... 其他文本分类
}
```

---

## 🔌 扩展接口

### 自定义模块接口

```typescript
interface CustomModule {
  type: string;                    // 模块类型
  name: string;                    // 模块名称
  [key: string]: any;              // 其他自定义属性
}
```

### 插件接口

```typescript
interface Plugin {
  name: string;                    // 插件名称
  version: string;                 // 插件版本
  install: (app: any) => void;     // 安装函数
  uninstall?: (app: any) => void;  // 卸载函数
}
```

---

## 📚 使用示例

### 完整的组件使用示例

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

## 🔗 相关链接

- [使用教程](USAGE.md)
- [自定义指南](CUSTOMIZATION.md)
- [部署指南](DEPLOYMENT.md)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

---

<div align="center">

**API 文档完成！📚**

通过这些 API，您可以充分利用 FlexiResume 的所有功能。

</div>

## 🌐 Language Versions

- 🇨🇳 中文版本 (当前)
- [🇺🇸 English Version](../en/API.md)
