/**
 * 主题管理器
 * 
 * 统一管理主题相关的样式导入和切换逻辑
 * 
 * @author FlexiResume Team
 * @date 2025-07-26
 */

// 导入主题样式文件
import './LightTheme.css';
import './DarkTheme.css';
import './PrintStyles.css'; 
import { getLogger } from '../../utils/Logger';

const logThemeManager = getLogger('ThemeManager');

/**
 * 主题类型枚举
 */
export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark'
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  type: ThemeType;
  name: string;
  description: string;
  cssClass: string;
}

/**
 * 可用主题配置
 */
export const AVAILABLE_THEMES: Record<ThemeType, ThemeConfig> = {
  [ThemeType.LIGHT]: {
    type: ThemeType.LIGHT,
    name: '浅色主题',
    description: '适合白天使用的明亮主题',
    cssClass: ''
  },
  [ThemeType.DARK]: {
    type: ThemeType.DARK,
    name: '深色主题',
    description: '适合夜晚使用的深色主题',
    cssClass: 'dark'
  }
};

/**
 * 主题管理器类
 */
export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeType = ThemeType.LIGHT;
  private observers: Array<(theme: ThemeType) => void> = [];

  private constructor() {
    this.initializeTheme();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * 初始化主题
   */
  private initializeTheme(): void {
    // 从localStorage读取保存的主题
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme && Object.values(ThemeType).includes(savedTheme)) {
      this.currentTheme = savedTheme;
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? ThemeType.DARK : ThemeType.LIGHT;
    }

    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
  }

  /**
   * 设置系统主题监听器
   */
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // 只有在没有手动设置主题时才跟随系统
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? ThemeType.DARK : ThemeType.LIGHT;
        this.setTheme(newTheme);
      }
    });
  }

  /**
   * 应用主题
   */
  private applyTheme(theme: ThemeType): void {
    const root = document.documentElement;
    
    // 移除所有主题类
    Object.values(AVAILABLE_THEMES).forEach(config => {
      if (config.cssClass) {
        root.classList.remove(config.cssClass);
      }
    });

    // 设置data-theme属性
    if (theme === ThemeType.DARK) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
    }

    // 应用主题特定的CSS类
    const themeConfig = AVAILABLE_THEMES[theme];
    if (themeConfig.cssClass) {
      root.classList.add(themeConfig.cssClass);
    }

    // 调试日志已移除: console.log(`🎨 主题已切换到: ${themeConfig.name}`);
  }

  /**
   * 设置主题
   */
  public setTheme(theme: ThemeType): void {
    if (this.currentTheme === theme) return;

    this.currentTheme = theme;
    this.applyTheme(theme);
    
    // 保存到localStorage
    localStorage.setItem('theme', theme);
    
    // 通知观察者
    this.notifyObservers(theme);
  }

  /**
   * 切换主题
   */
  public toggleTheme(): void {
    const newTheme = this.currentTheme === ThemeType.LIGHT ? ThemeType.DARK : ThemeType.LIGHT;
    this.setTheme(newTheme);
  }

  /**
   * 获取当前主题
   */
  public getCurrentTheme(): ThemeType {
    return this.currentTheme;
  }

  /**
   * 获取当前主题配置
   */
  public getCurrentThemeConfig(): ThemeConfig {
    return AVAILABLE_THEMES[this.currentTheme];
  }

  /**
   * 检查是否为深色主题
   */
  public isDarkTheme(): boolean {
    return this.currentTheme === ThemeType.DARK;
  }

  /**
   * 添加主题变化观察者
   */
  public addObserver(callback: (theme: ThemeType) => void): void {
    this.observers.push(callback);
  }

  /**
   * 移除主题变化观察者
   */
  public removeObserver(callback: (theme: ThemeType) => void): void {
    const index = this.observers.indexOf(callback);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * 通知所有观察者
   */
  private notifyObservers(theme: ThemeType): void {
    this.observers.forEach(callback => {
      try {
        callback(theme);
      } catch (error) {
        logThemeManager.extend('error')('主题观察者回调执行失败:', error);
      }
    });
  }

  /**
   * 获取所有可用主题
   */
  public getAvailableThemes(): ThemeConfig[] {
    return Object.values(AVAILABLE_THEMES);
  }

  /**
   * 重置主题为系统默认
   */
  public resetToSystemTheme(): void {
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? ThemeType.DARK : ThemeType.LIGHT;
    this.setTheme(systemTheme);
  }
}

// 导出单例实例
export const themeManager = ThemeManager.getInstance();

// 导出便捷函数
export const setTheme = (theme: ThemeType) => themeManager.setTheme(theme);
export const toggleTheme = () => themeManager.toggleTheme();
export const getCurrentTheme = () => themeManager.getCurrentTheme();
export const isDarkTheme = () => themeManager.isDarkTheme();
