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

### useAudio

Audio management hook, supports background music and sound effects control.

```typescript
interface AudioContextType {
  isPlaying: boolean;                     // Whether playing
  volume: number;                         // Volume (0-1)
  isMuted: boolean;                       // Whether muted
  playBackgroundMusic: () => void;        // Play background music
  pauseBackgroundMusic: () => void;       // Pause background music
  playSoundEffect: (effect: string) => void; // Play sound effect
  setVolume: (volume: number) => void;    // Set volume
  toggleMute: () => void;                 // Toggle mute
}

const useAudio = (): AudioContextType;
```

**Usage Example:**

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

// Play/pause background music
const handleToggleMusic = () => {
  if (isPlaying) {
    pauseBackgroundMusic();
  } else {
    playBackgroundMusic();
  }
};

// Play click sound effect
const handleClick = () => {
  playSoundEffect('click');
};

// Adjust volume
const handleVolumeChange = (newVolume: number) => {
  setVolume(newVolume);
};
```

### useFont

Font management hook, supports multi-CDN sources and performance monitoring.

```typescript
interface FontContextType {
  currentFont: string;                    // Current font
  isLoading: boolean;                     // Whether loading
  error: string | null;                   // Error message
  switchFont: (fontFamily: string) => void;  // Switch font
  performance: FontPerformanceMetrics;    // Performance metrics
}

interface FontPerformanceMetrics {
  loadTime: number;                       // Load time
  successRate: number;                    // Success rate
  cdnResponseTimes: Record<string, number>; // CDN response times
  errorCount: number;                     // Error count
}

const useFont = (): FontContextType;
```

**Usage Example:**

```typescript
const {
  currentFont,
  isLoading,
  error,
  switchFont,
  performance
} = useFont();

// Switch font
const handleFontChange = (fontFamily: string) => {
  switchFont(fontFamily);
};

// Show loading status
if (isLoading) {
  return <div>Loading font...</div>;
}

// Show error message
if (error) {
  return <div>Font loading failed: {error}</div>;
}

// Use font
return (
  <div style={{ fontFamily: currentFont }}>
    Content text
  </div>
);
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
const formatted = formatDate('2023-12-01', 'YYYY/MM/DD');
// Output: "2023/12/01"
```

### Logger

Unified logging system, supports hierarchical logging and performance monitoring.

```typescript
class Logger {
  static debug(message: string, data?: any): void;
  static info(message: string, data?: any): void;
  static warn(message: string, data?: any): void;
  static error(message: string, error?: Error): void;
  static performance(label: string, duration: number): void;
}
```

**Usage Example:**

```typescript
import { Logger } from '@/utils/Logger';

// Debug information
Logger.debug('Component render', { componentName: 'FlexiResume' });

// General information
Logger.info('User action', { action: 'theme-switch' });

// Warning information
Logger.warn('Performance warning', { loadTime: 3000 });

// Error information
Logger.error('Loading failed', new Error('Network error'));

// Performance monitoring
Logger.performance('Font loading', 1200);
```

### MemoryManager

Memory manager, intelligent caching and garbage collection.

```typescript
class MemoryManager {
  static setCache<T>(key: string, value: T, ttl?: number): void;
  static getCache<T>(key: string): T | null;
  static clearCache(key?: string): void;
  static getMemoryUsage(): MemoryUsage;
  static cleanup(): void;
}

interface MemoryUsage {
  used: number;        // Used memory
  total: number;       // Total memory
  percentage: number;  // Usage percentage
}
```

**Usage Example:**

```typescript
import { MemoryManager } from '@/utils/MemoryManager';

// Set cache
MemoryManager.setCache('user-data', userData, 300000); // 5 minutes TTL

// Get cache
const cachedData = MemoryManager.getCache('user-data');

// Clear cache
MemoryManager.clearCache('user-data');

// Get memory usage
const memoryUsage = MemoryManager.getMemoryUsage();
console.log(`Memory usage: ${memoryUsage.percentage}%`);

// Manual cleanup
MemoryManager.cleanup();
```

### ThemeUtils

Theme utility class, unified theme management and switching.

```typescript
class ThemeUtils {
  static applyTheme(theme: ThemeColors): void;
  static validateTheme(theme: ThemeColors): boolean;
  static mergeThemes(base: ThemeColors, override: Partial<ThemeColors>): ThemeColors;
  static getContrastRatio(color1: string, color2: string): number;
}
```

**Usage Example:**

```typescript
import { ThemeUtils } from '@/utils/ThemeUtils';

// Apply theme
ThemeUtils.applyTheme(customTheme);

// Validate theme
const isValid = ThemeUtils.validateTheme(userTheme);

// Merge themes
const mergedTheme = ThemeUtils.mergeThemes(baseTheme, customizations);

// Check contrast ratio
const contrast = ThemeUtils.getContrastRatio('#ffffff', '#000000');
```

### EnhancedAudioPlayer

Enhanced audio player, supports advanced audio control.

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

**Usage Example:**

```typescript
import { EnhancedAudioPlayer } from '@/utils/EnhancedAudioPlayer';

const audioPlayer = new EnhancedAudioPlayer({
  volume: 0.5,
  loop: true
});

// Play background music
await audioPlayer.playBackgroundMusic('/audio/background.mp3');

// Play sound effect
await audioPlayer.playSoundEffect('click');

// Volume control
audioPlayer.setVolume(0.3);

// Fade in/out
await audioPlayer.fadeIn(2000);
await audioPlayer.fadeOut(1000);
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

### AudioContextType

Audio context type for audio management.

```typescript
interface AudioContextType {
  isPlaying: boolean;                     // Whether playing
  volume: number;                         // Volume (0-1)
  isMuted: boolean;                       // Whether muted
  playBackgroundMusic: () => void;        // Play background music
  pauseBackgroundMusic: () => void;       // Pause background music
  playSoundEffect: (effect: string) => void; // Play sound effect
  setVolume: (volume: number) => void;    // Set volume
  toggleMute: () => void;                 // Toggle mute
}
```

### FontContextType

Font context type for font management.

```typescript
interface FontContextType {
  currentFont: string;                    // Current font
  isLoading: boolean;                     // Whether loading
  error: string | null;                   // Error message
  switchFont: (fontFamily: string) => void;  // Switch font
  performance: FontPerformanceMetrics;    // Performance metrics
}
```

### FontPerformanceMetrics

Font performance metrics type.

```typescript
interface FontPerformanceMetrics {
  loadTime: number;                       // Load time
  successRate: number;                    // Success rate
  cdnResponseTimes: Record<string, number>; // CDN response times
  errorCount: number;                     // Error count
}
```

### AudioConfig

Audio configuration type.

```typescript
interface AudioConfig {
  volume?: number;           // Initial volume (0-1)
  loop?: boolean;            // Whether to loop
  fadeInDuration?: number;   // Fade in duration (ms)
  fadeOutDuration?: number;  // Fade out duration (ms)
  preload?: boolean;         // Whether to preload
}
```

### MemoryUsage

Memory usage information type.

```typescript
interface MemoryUsage {
  used: number;        // Used memory
  total: number;       // Total memory
  percentage: number;  // Usage percentage
}
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


