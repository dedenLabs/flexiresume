/**
 * 主题配置
 * 
 * 支持明暗主题切换功能
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

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

// 浅色主题
const lightTheme: ThemeColors = {
  primary: '#3498db',
  secondary: '#2c3e50',
  accent: '#e74c3c',
  
  background: '#ffffff',
  surface: '#f8f9fa',
  card: '#ffffff',
  
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    disabled: '#bdc3c7',
    inverse: '#ffffff'
  },
  
  border: {
    light: '#ecf0f1',
    medium: '#bdc3c7',
    dark: '#95a5a6'
  },
  
  status: {
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db'
  },
  
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)'
  }
};

// 深色主题
const darkTheme: ThemeColors = {
  primary: '#3498db',
  secondary: '#ecf0f1',
  accent: '#e74c3c',
  
  background: '#1a1a1a',
  surface: '#2c2c2c',
  card: '#363636',
  
  text: {
    primary: '#ecf0f1',
    secondary: '#bdc3c7',
    disabled: '#7f8c8d',
    inverse: '#2c3e50'
  },
  
  border: {
    light: '#404040',
    medium: '#555555',
    dark: '#777777'
  },
  
  status: {
    success: '#2ecc71',
    warning: '#f1c40f',
    error: '#e74c3c',
    info: '#3498db'
  },
  
  shadow: {
    light: 'rgba(0, 0, 0, 0.2)',
    medium: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.6)'
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
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
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
