/**
 * 主题工具类
 * 
 * 提供统一的主题相关工具函数，避免重复定义
 * 支持服务器端渲染和客户端渲染
 * 
 * @author FlexiResume Team
 * @date 2025-07-26
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../theme';

/**
 * 从DOM获取主题状态
 * 当组件在独立的React根中渲染时使用
 */
const getThemeFromDOM = (): boolean => {
    if (typeof window === 'undefined') {
        return false; // 服务器端渲染默认为浅色主题
    }

    // 检查多个可能的主题指示器
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    const bodyTheme = document.body.getAttribute('data-theme');
    const htmlClass = document.documentElement.className;
    const bodyClass = document.body.className;
    const localStorageTheme = localStorage.getItem('theme');

    // 优先级：data-theme属性 > class > localStorage > 系统偏好
    if (htmlTheme === 'dark' || bodyTheme === 'dark') {
        return true;
    }
    
    if (htmlTheme === 'light' || bodyTheme === 'light') {
        return false;
    }
    
    if (htmlClass.includes('dark') || bodyClass.includes('dark')) {
        return true;
    }
    
    if (htmlClass.includes('light') || bodyClass.includes('light')) {
        return false;
    }
    
    if (localStorageTheme === 'dark') {
        return true;
    }
    
    if (localStorageTheme === 'light') {
        return false;
    }

    // 最后检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
    }

    return false; // 默认浅色主题
};

/**
 * 检测主题变化
 * 统一的主题检测逻辑
 */
const detectTheme = (): boolean => {
    return getThemeFromDOM();
};

/**
 * 安全地使用主题hook
 * 
 * 支持多种使用场景：
 * 1. 在ThemeProvider内部使用 - 直接使用useTheme
 * 2. 在独立React根中使用 - 从DOM获取主题状态
 * 3. 服务器端渲染 - 返回默认值
 * 
 * @returns 包含isDark属性和其他主题相关方法的对象
 */
export const useSafeTheme = () => {
    const [isDark, setIsDark] = useState<boolean>(() => {
        // 初始化时从DOM获取主题状态
        return detectTheme();
    });

    useEffect(() => {
        // 在服务器端渲染时，跳过所有DOM操作
        if (typeof window === 'undefined') {
            return;
        }

        // 初始化主题状态
        setIsDark(detectTheme());

        // 监听主题变化的多种方式
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme') {
                setIsDark(detectTheme());
            }
        };

        // 监听DOM变化
        const observer = new MutationObserver(() => {
            setIsDark(detectTheme());
        });

        // 观察body和html的属性变化
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });

        // 监听localStorage变化
        window.addEventListener('storage', handleStorageChange);

        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleMediaChange = () => {
            setIsDark(detectTheme());
        };

        mediaQuery.addEventListener('change', handleMediaChange);

        // 清理函数
        return () => {
            observer.disconnect();
            window.removeEventListener('storage', handleStorageChange);
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    // 尝试使用ThemeProvider的useTheme，如果失败则使用DOM检测
    try {
        const themeContext = useTheme();
        return {
            isDark: themeContext.isDark,
            mode: themeContext.mode,
            colors: themeContext.colors,
            toggleMode: themeContext.toggleMode,
            setMode: themeContext.setMode
        };
    } catch (error) {
        // 在独立React根或ThemeProvider外部使用时的降级方案
        return {
            isDark,
            mode: isDark ? 'dark' : 'light' as const,
            colors: null, // 在独立根中无法获取完整的颜色配置
            toggleMode: () => {
                // 简单的主题切换实现
                const newTheme = isDark ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);
            },
            setMode: (mode: 'light' | 'dark') => {
                localStorage.setItem('theme', mode);
                document.documentElement.setAttribute('data-theme', mode);
            }
        };
    }
};

/**
 * 向后兼容的主题hook
 * @deprecated 推荐直接使用 useSafeTheme
 * @returns 包含isDark属性的对象
 */
export const useThemeCompat = () => {
    const { isDark } = useSafeTheme();
    return { isDark };
};

/**
 * 简化版本的主题hook，只返回isDark状态
 * 适用于只需要知道是否为深色主题的场景
 */
export const useIsDark = (): boolean => {
    const { isDark } = useSafeTheme();
    return isDark;
};

/**
 * 主题工具函数
 */
export const ThemeUtils = {
    /**
     * 获取当前主题状态
     */
    getCurrentTheme: (): 'light' | 'dark' => {
        return detectTheme() ? 'dark' : 'light';
    },

    /**
     * 检查是否为深色主题
     */
    isDarkTheme: (): boolean => {
        return detectTheme();
    },

    /**
     * 设置主题
     */
    setTheme: (theme: 'light' | 'dark') => {
        if (typeof window === 'undefined') return;
        
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        
        // 触发存储事件，通知其他组件
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'theme',
            newValue: theme,
            oldValue: localStorage.getItem('theme')
        }));
    },

    /**
     * 切换主题
     */
    toggleTheme: () => {
        const currentTheme = ThemeUtils.getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        ThemeUtils.setTheme(newTheme);
    },

    /**
     * 从DOM获取主题状态（静态方法）
     */
    getThemeFromDOM,

    /**
     * 检测主题变化（静态方法）
     */
    detectTheme
};

export default ThemeUtils;
