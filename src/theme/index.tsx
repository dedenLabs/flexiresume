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

// 深色主题 - 护眼优化版本
const darkTheme: ThemeColors = {
  primary: '#4a9eff',        // 更柔和的蓝色
  secondary: '#e2e8f0',      // 更温和的浅色
  accent: '#ff6b6b',         // 更柔和的红色

  background: '#0f1419',     // 更深的背景，减少眼部疲劳
  surface: '#1a202c',       // 温和的表面色
  card: '#2d3748',          // 更舒适的卡片背景

  text: {
    primary: '#e2e8f0',     // 柔和的主文本色
    secondary: '#a0aec0',   // 温和的次要文本色
    disabled: '#718096',    // 适中的禁用文本色
    inverse: '#1a202c'      // 反色文本
  },

  border: {
    light: '#2d3748',       // 更柔和的浅边框
    medium: '#4a5568',      // 适中的边框色
    dark: '#718096'         // 深边框色
  },

  status: {
    success: '#48bb78',     // 护眼的成功色
    warning: '#ed8936',     // 温和的警告色
    error: '#f56565',       // 柔和的错误色
    info: '#4299e1'         // 舒适的信息色
  },

  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',    // 更轻的阴影
    medium: 'rgba(0, 0, 0, 0.25)',  // 适中的阴影
    dark: 'rgba(0, 0, 0, 0.4)'      // 深阴影
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
