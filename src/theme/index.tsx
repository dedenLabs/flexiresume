/**
 * 主题配置
 * 
 * 支持明暗主题切换功能
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { recordThemeChangeTime } from '../utils/PerformanceMonitor';

// 主题类型
export type ThemeMode = 'light' | 'dark';

// 主题颜色配置接口
export interface ThemeColors {
  // 基础颜色
  primary: string;
  secondary: string;
  accent: string;
  
  // 背景颜色
  background: string;
  surface: string;
  card: string;
  
  // 文本颜色
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  
  // 边框颜色
  border: {
    light: string;
    medium: string;
    dark: string;
  };
  
  // 状态颜色
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // 阴影
  shadow: {
    light: string;
    medium: string;
    dark: string;
  };
}

// 浅色主题 - 西游记古典风格
const lightTheme: ThemeColors = {
  primary: '#D4AF37',        // 金色 - 象征佛法和功德
  secondary: '#8B4513',      // 棕色 - 象征大地和稳重
  accent: '#DC143C',         // 深红色 - 象征力量和热情

  background: '#FFF8DC',     // 米色背景 - 古典纸张色
  surface: '#F5F5DC',       // 米白色表面 - 古典书卷色
  card: '#FFFAF0',          // 花白色卡片 - 古典宣纸色

  text: {
    primary: '#2F4F4F',     // 深灰绿色 - 古典墨色
    secondary: '#696969',   // 暗灰色 - 古典副文本
    disabled: '#A9A9A9',    // 浅灰色 - 禁用文本
    inverse: '#FFFAF0'      // 反色文本
  },

  border: {
    light: '#F0E68C',       // 卡其色浅边框 - 古典装饰
    medium: '#DAA520',      // 金棒色中边框 - 如意金箍棒
    dark: '#B8860B'         // 深金色边框 - 古典金属
  },

  status: {
    success: '#228B22',     // 森林绿 - 象征生机和成功
    warning: '#FF8C00',     // 深橙色 - 象征警示和火焰
    error: '#B22222',       // 火砖红 - 象征危险和战斗
    info: '#4682B4'         // 钢蓝色 - 象征智慧和冷静
  },

  shadow: {
    light: 'rgba(212, 175, 55, 0.1)',   // 金色阴影
    medium: 'rgba(139, 69, 19, 0.15)',  // 棕色阴影
    dark: 'rgba(47, 79, 79, 0.2)'       // 深色阴影
  }
};

// 深色主题 - 西游记夜晚风格
const darkTheme: ThemeColors = {
  primary: '#FFD700',        // 金色 - 夜晚的月光金辉
  secondary: '#F0E68C',      // 卡其色 - 夜晚的温暖光芒
  accent: '#FF6347',         // 番茄红 - 夜晚的火焰色彩

  background: '#1C1C1C',     // 深炭色背景 - 夜晚的深邃
  surface: '#2F2F2F',       // 深灰色表面 - 夜晚的山石
  card: '#3A3A3A',          // 深灰卡片 - 夜晚的洞穴

  text: {
    primary: '#F5DEB3',     // 小麦色主文本 - 夜晚的温暖光线
    secondary: '#D2B48C',   // 棕褐色次要文本 - 夜晚的柔和光
    disabled: '#808080',    // 灰色禁用文本 - 夜晚的阴影
    inverse: '#1C1C1C'      // 反色文本
  },

  border: {
    light: '#4A4A4A',       // 深灰浅边框 - 夜晚的轮廓
    medium: '#696969',      // 暗灰中边框 - 夜晚的分界
    dark: '#8B7D6B'         // 深棕边框 - 夜晚的古铜
  },

  status: {
    success: '#32CD32',     // 酸橙绿 - 夜晚的生机
    warning: '#FFA500',     // 橙色 - 夜晚的火光警示
    error: '#FF4500',       // 橙红色 - 夜晚的危险火焰
    info: '#87CEEB'         // 天蓝色 - 夜晚的星空智慧
  },

  shadow: {
    light: 'rgba(255, 215, 0, 0.1)',    // 金色轻阴影
    medium: 'rgba(255, 215, 0, 0.2)',   // 金色中阴影
    dark: 'rgba(0, 0, 0, 0.4)'          // 深色重阴影
  }
};

// 主题映射
const themes: Record<ThemeMode, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme
};

// 主题上下文接口
interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  colors: ThemeColors;
  isDark: boolean;
}

// 主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // 从localStorage读取保存的主题设置
    const saved = localStorage.getItem('theme') as ThemeMode;
    if (saved && (saved === 'light' || saved === 'dark')) {
      return saved;
    }
    
    // 根据系统主题自动选择
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const toggleMode = () => {
    const startTime = performance.now();
    const currentMode = mode;

    setMode(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';

      // 记录主题切换性能
      setTimeout(() => {
        const changeTime = performance.now() - startTime;
        recordThemeChangeTime(currentMode, newMode, changeTime);
      }, 0);

      return newMode;
    });
  };

  useEffect(() => {
    // 保存主题设置到localStorage
    localStorage.setItem('theme', mode);
    
    // 更新document的data-theme属性，用于CSS变量
    document.documentElement.setAttribute('data-theme', mode);
    
    // 更新meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themes[mode].background);
    }
  }, [mode]);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在用户没有手动设置过主题时才自动跟随系统
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value: ThemeContextType = {
    mode,
    setMode,
    toggleMode,
    colors: themes[mode],
    isDark: mode === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 使用主题的Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// CSS变量生成器
export const generateCSSVariables = (colors: ThemeColors): string => {
  return `
    --color-primary: ${colors.primary};
    --color-secondary: ${colors.secondary};
    --color-accent: ${colors.accent};
    
    --color-background: ${colors.background};
    --color-surface: ${colors.surface};
    --color-card: ${colors.card};
    
    --color-text-primary: ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --color-text-disabled: ${colors.text.disabled};
    --color-text-inverse: ${colors.text.inverse};
    
    --color-border-light: ${colors.border.light};
    --color-border-medium: ${colors.border.medium};
    --color-border-dark: ${colors.border.dark};
    
    --color-success: ${colors.status.success};
    --color-warning: ${colors.status.warning};
    --color-error: ${colors.status.error};
    --color-info: ${colors.status.info};
    
    --shadow-light: ${colors.shadow.light};
    --shadow-medium: ${colors.shadow.medium};
    --shadow-dark: ${colors.shadow.dark};
  `;
};

// 导出主题
export { lightTheme, darkTheme, themes };
