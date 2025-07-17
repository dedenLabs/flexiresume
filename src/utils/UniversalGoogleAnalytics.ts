/**
 * 通用版Google Analytics集成
 * Universal Google Analytics Integration
 * 
 * 提供简单易用的Google Analytics集成，支持参数提取和配置
 * Simple and easy-to-use Google Analytics integration with parameter extraction and configuration
 */

import { analyticsConfig } from '../config/AnalyticsConfig';

interface UniversalGAConfig {
  measurementId: string;
  enabled?: boolean;
  debug?: boolean;
  customDimensions?: Record<string, string>;
  customMetrics?: Record<string, number>;
}

interface UniversalGAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface UniversalGAPageView {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  content_group1?: string;
  content_group2?: string;
  content_group3?: string;
  content_group4?: string;
  content_group5?: string;
}

/**
 * 通用Google Analytics类
 */
export class UniversalGoogleAnalytics {
  private static instance: UniversalGoogleAnalytics;
  private measurementId: string = '';
  private isInitialized: boolean = false;
  private config: UniversalGAConfig | null = null;

  private constructor() {}

  static getInstance(): UniversalGoogleAnalytics {
    if (!UniversalGoogleAnalytics.instance) {
      UniversalGoogleAnalytics.instance = new UniversalGoogleAnalytics();
    }
    return UniversalGoogleAnalytics.instance;
  }

  /**
   * 初始化Google Analytics
   */
  async initialize(config?: Partial<UniversalGAConfig>): Promise<boolean> {
    try {
      // 获取配置
      this.config = this.getConfig(config);
      
      if (!this.config.enabled) {
        console.info('[UniversalGA] Disabled by configuration');
        return false;
      }

      if (!this.config.measurementId) {
        console.warn('[UniversalGA] Measurement ID not provided');
        return false;
      }

      if (this.isInitialized) {
        console.log('[UniversalGA] Already initialized');
        return true;
      }

      this.measurementId = this.config.measurementId;

      // 加载gtag.js
      const success = await this.loadGtagScript();
      
      if (success) {
        this.setupGtag();
        this.isInitialized = true;
        
        if (this.config.debug) {
          console.log('[UniversalGA] Initialized successfully with ID:', this.measurementId);
        }
        
        return true;
      }

      return false;

    } catch (error) {
      console.error('[UniversalGA] Initialization failed:', error);
      return false;
    }
  }

  /**
   * 获取配置
   */
  private getConfig(customConfig?: Partial<UniversalGAConfig>): UniversalGAConfig {
    // 从环境变量获取默认配置
    const envConfig = analyticsConfig.getGoogleConfig();
    
    // 合并配置
    const config: UniversalGAConfig = {
      measurementId: envConfig.measurementId || '',
      enabled: envConfig.enabled,
      debug: envConfig.debug,
      customDimensions: envConfig.customDimensions || {},
      customMetrics: envConfig.customMetrics || {},
      ...customConfig
    };

    return config;
  }

  /**
   * 加载gtag.js脚本
   */
  private async loadGtagScript(): Promise<boolean> {
    return new Promise((resolve) => {
      // 检查是否已经加载
      if (window.gtag) {
        resolve(true);
        return;
      }

      // 创建script标签
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      
      script.onload = () => {
        if (this.config?.debug) {
          console.log('[UniversalGA] gtag.js script loaded');
        }
        resolve(true);
      };
      
      script.onerror = () => {
        console.error('[UniversalGA] Failed to load gtag.js script');
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  /**
   * 设置gtag
   */
  private setupGtag(): void {
    // 初始化dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // 定义gtag函数
    window.gtag = function() {
      window.dataLayer!.push(arguments);
    };

    // 设置初始配置
    window.gtag('js', new Date());
    
    // 配置Google Analytics
    const configParams: Record<string, any> = {
      debug_mode: this.config?.debug || false
    };

    // 添加自定义维度
    if (this.config?.customDimensions) {
      Object.entries(this.config.customDimensions).forEach(([key, value]) => {
        configParams[key] = value;
      });
    }

    window.gtag('config', this.measurementId, configParams);
  }

  /**
   * 跟踪页面浏览
   */
  trackPageView(pageView?: UniversalGAPageView): void {
    if (!this.isReady()) return;

    const eventData: Record<string, any> = {
      page_title: pageView?.page_title || document.title,
      page_location: pageView?.page_location || window.location.href,
      page_path: pageView?.page_path || window.location.pathname
    };

    // 添加内容分组
    if (pageView?.content_group1) eventData.content_group1 = pageView.content_group1;
    if (pageView?.content_group2) eventData.content_group2 = pageView.content_group2;
    if (pageView?.content_group3) eventData.content_group3 = pageView.content_group3;
    if (pageView?.content_group4) eventData.content_group4 = pageView.content_group4;
    if (pageView?.content_group5) eventData.content_group5 = pageView.content_group5;

    try {
      window.gtag('event', 'page_view', eventData);
      
      if (this.config?.debug) {
        console.log('[UniversalGA] Page view tracked:', eventData);
      }
    } catch (error) {
      console.error('[UniversalGA] Page view tracking failed:', error);
    }
  }

  /**
   * 跟踪事件
   */
  trackEvent(event: UniversalGAEvent): void {
    if (!this.isReady()) return;

    const { action, category, label, value, custom_parameters } = event;

    if (!action) {
      console.warn('[UniversalGA] Event action is required');
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
      window.gtag('event', action, eventData);
      
      if (this.config?.debug) {
        console.log('[UniversalGA] Event tracked:', { action, ...eventData });
      }
    } catch (error) {
      console.error('[UniversalGA] Event tracking failed:', error);
    }
  }

  /**
   * 设置用户属性
   */
  setUserProperty(propertyName: string, propertyValue: string): void {
    if (!this.isReady()) return;

    try {
      window.gtag('config', this.measurementId, {
        user_properties: {
          [propertyName]: propertyValue
        }
      });

      if (this.config?.debug) {
        console.log('[UniversalGA] User property set:', { propertyName, propertyValue });
      }
    } catch (error) {
      console.error('[UniversalGA] Set user property failed:', error);
    }
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string): void {
    if (!this.isReady()) return;

    try {
      window.gtag('config', this.measurementId, {
        user_id: userId
      });

      if (this.config?.debug) {
        console.log('[UniversalGA] User ID set:', userId);
      }
    } catch (error) {
      console.error('[UniversalGA] Set user ID failed:', error);
    }
  }

  /**
   * 检查是否准备就绪
   */
  private isReady(): boolean {
    if (!this.isInitialized || !this.config?.enabled) {
      if (this.config?.debug) {
        console.log('[UniversalGA] Not ready:', { 
          initialized: this.isInitialized, 
          enabled: this.config?.enabled 
        });
      }
      return false;
    }

    if (!window.gtag) {
      console.warn('[UniversalGA] gtag not available');
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
    hasGtag: boolean;
    config: UniversalGAConfig | null;
  } {
    return {
      initialized: this.isInitialized,
      enabled: this.config?.enabled || false,
      measurementId: this.measurementId ? this.measurementId.substring(0, 8) + '...' : '',
      hasGtag: !!window.gtag,
      config: this.config
    };
  }

  /**
   * 重置状态（用于测试）
   */
  reset(): void {
    this.isInitialized = false;
    this.measurementId = '';
    this.config = null;
  }
}

// 导出单例实例
export const universalGA = UniversalGoogleAnalytics.getInstance();

// 导出便捷函数
export const initializeGA = (config?: Partial<UniversalGAConfig>) => universalGA.initialize(config);
export const trackPageView = (pageView?: UniversalGAPageView) => universalGA.trackPageView(pageView);
export const trackEvent = (event: UniversalGAEvent) => universalGA.trackEvent(event);
export const setUserProperty = (name: string, value: string) => universalGA.setUserProperty(name, value);
export const setUserId = (userId: string) => universalGA.setUserId(userId);
export const getGAStatus = () => universalGA.getStatus();
