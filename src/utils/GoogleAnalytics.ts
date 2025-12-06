/**
 * Google Analytics 4 集成类
 * Google Analytics 4 Integration
 * 
 * 基于Firebase Analytics实现的Google Analytics 4集成
 */

import { analyticsConfig } from '../config/AnalyticsConfig';
import { firebaseAnalyticsLoader } from './FirebaseAnalyticsLoader'; 
import { getLogger } from './Logger';

const logGoogleAnalytics = getLogger('GoogleAnalytics');

// Firebase Analytics类型定义
interface FirebaseApp {
  name: string;
  options: Record<string, any>;
}

interface Analytics {
  app: FirebaseApp;
}

// 全局Firebase对象类型
declare global {
  interface Window {
    firebase?: any;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface GoogleAnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface GoogleAnalyticsPageView {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  content_group1?: string;
  content_group2?: string;
}

export class GoogleAnalytics {
  private static instance: GoogleAnalytics;
  private isInitialized = false;
  private analytics: Analytics | null = null;
  private measurementId = '';

  private constructor() {}

  static getInstance(): GoogleAnalytics {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics();
    }
    return GoogleAnalytics.instance;
  }

  /**
   * 初始化Google Analytics
   */
  async initialize(): Promise<void> {
    const config = analyticsConfig.getGoogleConfig();
    
    if (!config.enabled) {
      logGoogleAnalytics('[GoogleAnalytics] Disabled by configuration');
      return;
    }

    if (!config.measurementId) {
      logGoogleAnalytics.extend('warn')('[GoogleAnalytics] Measurement ID not provided');
      return;
    }

    if (this.isInitialized) {
      logGoogleAnalytics('[GoogleAnalytics] Already initialized');
      return;
    }

    this.measurementId = config.measurementId;

    try {
      // 方法1: 尝试使用Firebase Analytics (推荐)
      if (await this.initializeWithFirebase()) {
        this.isInitialized = true;
        if (config.debug) {
          logGoogleAnalytics('[GoogleAnalytics] Initialized with Firebase Analytics');
        }
        return;
      }

      // 方法2: 回退到gtag.js
      if (await this.initializeWithGtag()) {
        this.isInitialized = true;
        if (config.debug) {
          logGoogleAnalytics('[GoogleAnalytics] Initialized with gtag.js');
        }
        return;
      }

      throw new Error('Failed to initialize with any method');

    } catch (error) {
      logGoogleAnalytics.extend('error')('[GoogleAnalytics] Initialization failed:', error);
    }
  }

  /**
   * 使用Firebase Analytics初始化（通过动态加载器）
   */
  private async initializeWithFirebase(): Promise<boolean> {
    try {
      logGoogleAnalytics('[GoogleAnalytics] Initializing with Firebase Analytics Loader...');

      // 使用新的Firebase动态加载器
      const success = await firebaseAnalyticsLoader.initialize();

      if (success) {
        // 标记为已初始化，但不直接持有analytics实例
        // 所有Firebase操作都通过firebaseAnalyticsLoader进行
        this.analytics = {} as any; // 占位符，表示Firebase已初始化
        logGoogleAnalytics('[GoogleAnalytics] Firebase Analytics initialized via dynamic loader');
        return true;
      } else {
        logGoogleAnalytics.extend('warn')('[GoogleAnalytics] Firebase Analytics initialization failed');
        return false;
      }
    } catch (error) {
      logGoogleAnalytics.extend('warn')('[GoogleAnalytics] Firebase initialization failed:', error);
      return false;
    }
  }

  /**
   * 使用gtag.js初始化
   */
  private async initializeWithGtag(): Promise<boolean> {
    try {
      // 初始化dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer!.push(arguments);
      };

      // 设置初始配置
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        debug_mode: analyticsConfig.getGoogleConfig().debug
      });

      // 加载gtag.js脚本
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      
      return new Promise((resolve) => {
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
      });
    } catch (error) {
      logGoogleAnalytics.extend('warn')('[GoogleAnalytics] gtag.js initialization failed:', error);
      return false;
    }
  }

  /**
   * 跟踪页面访问
   */
  trackPageView(pageView?: GoogleAnalyticsPageView): void {
    if (!this.isReady()) return;

    const config = analyticsConfig.getGoogleConfig();
    const eventData = {
      page_title: pageView?.page_title || document.title,
      page_location: pageView?.page_location || window.location.href,
      page_path: pageView?.page_path || window.location.pathname,
      ...pageView
    };

    try {
      if (this.analytics) {
        // 使用Firebase Analytics - 使用字符串拼接避免Vite预处理
        const firebaseAnalytics = 'firebase' + '/analytics';
        import(/* @vite-ignore */ firebaseAnalytics).then(({ logEvent }) => {
          logEvent(this.analytics!, 'page_view', eventData);
        }).catch(error => {
          logGoogleAnalytics.extend('warn')('[GoogleAnalytics] Firebase analytics import failed:', error);
        });
      } else if (window.gtag) {
        // 使用gtag.js
        window.gtag('event', 'page_view', eventData);
      }

      if (config.debug) {
        logGoogleAnalytics('[GoogleAnalytics] Page view tracked:', eventData);
      }
    } catch (error) {
      logGoogleAnalytics.extend('error')('[GoogleAnalytics] Page view tracking failed:', error);
    }
  }

  /**
   * 跟踪事件
   */
  trackEvent(event: GoogleAnalyticsEvent): void {
    if (!this.isReady()) return;

    const config = analyticsConfig.getGoogleConfig();
    const { action, category, label, value, custom_parameters } = event;

    if (!action) {
      logGoogleAnalytics.extend('warn')('[GoogleAnalytics] Event action is required');
      return;
    }

    const eventData: Record<string, any> = {
      event_category: category || 'engagement',
      event_label: label,
      value: value,
      ...custom_parameters
    };

    // 移除undefined值
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === undefined) {
        delete eventData[key];
      }
    });

    try {
      if (this.analytics) {
        // 使用Firebase Analytics动态加载器
        firebaseAnalyticsLoader.logEvent(action, eventData).catch(error => {
          logGoogleAnalytics.extend('warn')('[GoogleAnalytics] Firebase analytics event failed:', error);
        });
      } else if (window.gtag) {
        // 使用gtag.js
        window.gtag('event', action, eventData);
      }

      if (config.debug) {
        logGoogleAnalytics('[GoogleAnalytics] Event tracked:', { action, ...eventData });
      }
    } catch (error) {
      logGoogleAnalytics.extend('error')('[GoogleAnalytics] Event tracking failed:', error);
    }
  }

  /**
   * 跟踪技能点击
   */
  trackSkillClick(skillName: string, skillCategory: string): void {
    this.trackEvent({
      action: 'skill_click',
      category: 'user_interaction',
      label: skillName,
      custom_parameters: {
        skill_category: skillCategory,
        interaction_type: 'click'
      }
    });
  }

  /**
   * 跟踪项目查看
   */
  trackProjectView(projectName: string, projectType: string): void {
    this.trackEvent({
      action: 'project_view',
      category: 'content',
      label: projectName,
      custom_parameters: {
        project_type: projectType,
        content_type: 'project'
      }
    });
  }

  /**
   * 跟踪联系方式点击
   */
  trackContactClick(contactType: string, contactValue?: string): void {
    this.trackEvent({
      action: 'contact_click',
      category: 'user_interaction',
      label: contactType,
      custom_parameters: {
        contact_method: contactType,
        contact_value: contactValue
      }
    });
  }

  /**
   * 跟踪语言切换
   */
  trackLanguageSwitch(fromLang: string, toLang: string): void {
    this.trackEvent({
      action: 'language_change',
      category: 'user_preference',
      label: `${fromLang}_to_${toLang}`,
      custom_parameters: {
        previous_language: fromLang,
        new_language: toLang
      }
    });
  }

  /**
   * 跟踪主题切换
   */
  trackThemeSwitch(fromTheme: string, toTheme: string): void {
    this.trackEvent({
      action: 'theme_change',
      category: 'user_preference',
      label: `${fromTheme}_to_${toTheme}`,
      custom_parameters: {
        previous_theme: fromTheme,
        new_theme: toTheme
      }
    });
  }

  /**
   * 跟踪下载
   */
  trackDownload(downloadType: string, fileName?: string): void {
    this.trackEvent({
      action: 'file_download',
      category: 'engagement',
      label: fileName || downloadType,
      custom_parameters: {
        file_type: downloadType,
        file_name: fileName
      }
    });
  }

  /**
   * 跟踪错误
   */
  trackError(errorType: string, errorMessage: string, fatal: boolean = false): void {
    this.trackEvent({
      action: 'exception',
      category: 'error',
      label: errorType,
      custom_parameters: {
        description: errorMessage,
        fatal: fatal
      }
    });
  }

  /**
   * 设置用户属性
   */
  setUserProperty(propertyName: string, propertyValue: string): void {
    if (!this.isReady()) return;

    const config = analyticsConfig.getGoogleConfig();

    try {
      if (this.analytics) {
        // 使用Firebase Analytics动态加载器
        firebaseAnalyticsLoader.setUserProperties({
          [propertyName]: propertyValue
        }).catch(error => {
          logGoogleAnalytics.extend('warn')('[GoogleAnalytics] Firebase analytics user property failed:', error);
        });
      } else if (window.gtag) {
        // 使用gtag.js
        window.gtag('config', this.measurementId, {
          user_properties: {
            [propertyName]: propertyValue
          }
        });
      }

      if (config.debug) {
        logGoogleAnalytics('[GoogleAnalytics] User property set:', { propertyName, propertyValue });
      }
    } catch (error) {
      logGoogleAnalytics.extend('error')('[GoogleAnalytics] Set user property failed:', error);
    }
  }

  /**
   * 检查是否准备就绪
   */
  private isReady(): boolean {
    const config = analyticsConfig.getGoogleConfig();
    
    if (!this.isInitialized || !config.enabled) {
      if (config.debug) {
        logGoogleAnalytics('[GoogleAnalytics] Not ready:', { 
          initialized: this.isInitialized, 
          enabled: config.enabled 
        });
      }
      return false;
    }

    if (!this.analytics && !window.gtag) {
      logGoogleAnalytics.extend('warn')('[GoogleAnalytics] No analytics instance available');
      return false;
    }

    return true;
  }

  /**
   * 获取状态信息
   */
  getStatus(): {
    initialized: boolean;
    enabled: boolean;
    measurementId: string;
    method: 'firebase' | 'gtag' | 'none';
    firebaseLoader?: {
      isLoaded: boolean;
      isLoading: boolean;
      hasAnalytics: boolean;
      configValid: boolean;
    };
  } {
    const config = analyticsConfig.getGoogleConfig();
    let method: 'firebase' | 'gtag' | 'none' = 'none';

    if (this.analytics) {
      method = 'firebase';
    } else if (window.gtag) {
      method = 'gtag';
    }

    const status = {
      initialized: this.isInitialized,
      enabled: config.enabled,
      measurementId: this.measurementId.substring(0, 8) + '...',
      method
    };

    // 如果使用Firebase，添加加载器状态
    if (method === 'firebase') {
      status.firebaseLoader = firebaseAnalyticsLoader.getStatus();
    }

    return status;
  }
}

// 导出单例实例
export const googleAnalytics = GoogleAnalytics.getInstance();
