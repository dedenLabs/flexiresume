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

// 主题颜色配置接口（保留用于类型定义，实际颜色值在CSS文件中定义）
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

// 从CSS变量中读取当前主题颜色的工具函数
const getCurrentThemeColors = (): ThemeColors => {
  const computedStyle = getComputedStyle(document.documentElement);

  return {
    primary: computedStyle.getPropertyValue('--color-primary').trim(),
    secondary: computedStyle.getPropertyValue('--color-secondary').trim(),
    accent: computedStyle.getPropertyValue('--color-accent').trim(),

    background: computedStyle.getPropertyValue('--color-background').trim(),
    surface: computedStyle.getPropertyValue('--color-surface').trim(),
    card: computedStyle.getPropertyValue('--color-card').trim(),

    text: {
      primary: computedStyle.getPropertyValue('--color-text-primary').trim(),
      secondary: computedStyle.getPropertyValue('--color-text-secondary').trim(),
      disabled: computedStyle.getPropertyValue('--color-text-disabled').trim(),
      inverse: computedStyle.getPropertyValue('--color-text-inverse').trim(),
    },

    border: {
      light: computedStyle.getPropertyValue('--color-border-light').trim(),
      medium: computedStyle.getPropertyValue('--color-border-medium').trim(),
      dark: computedStyle.getPropertyValue('--color-border-dark').trim(),
    },

    status: {
      success: computedStyle.getPropertyValue('--color-status-success').trim(),
      warning: computedStyle.getPropertyValue('--color-status-warning').trim(),
      error: computedStyle.getPropertyValue('--color-status-error').trim(),
      info: computedStyle.getPropertyValue('--color-status-info').trim(),
    },

    shadow: {
      light: computedStyle.getPropertyValue('--color-shadow-light').trim(),
      medium: computedStyle.getPropertyValue('--color-shadow-medium').trim(),
      dark: computedStyle.getPropertyValue('--color-shadow-dark').trim(),
    }
  };
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

  // 状态用于强制重新渲染以获取最新的CSS变量值
  const [, forceUpdate] = useState({});

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

    // 强制更新以获取新的CSS变量值
    setTimeout(() => {
      forceUpdate({});

      // 更新meta theme-color（从CSS变量中读取）
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        const backgroundColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--color-background').trim();
        metaThemeColor.setAttribute('content', backgroundColor);
      }
    }, 0);
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
    colors: getCurrentThemeColors(), // 从CSS变量中读取当前颜色
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

// 工具函数：获取当前主题模式
export const getCurrentThemeMode = (): ThemeMode => {
  const dataTheme = document.documentElement.getAttribute('data-theme');
  return (dataTheme === 'dark' ? 'dark' : 'light') as ThemeMode;
};

// 工具函数：检查是否为深色模式
export const isDarkMode = (): boolean => {
  return getCurrentThemeMode() === 'dark';
};
