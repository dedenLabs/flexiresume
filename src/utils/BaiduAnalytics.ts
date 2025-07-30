/**
 * 百度统计集成类
 * Baidu Analytics Integration
 * 
 * 基于用户提供的百度统计代码进行封装
 */

import { analyticsConfig } from '../config/AnalyticsConfig'; 
import { getLogger } from './Logger';

const logBaiduAnalytics = getLogger('BaiduAnalytics');

declare global {
  interface Window {
    _hmt: any[];
  }
}

export interface BaiduTrackingEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export class BaiduAnalytics {
  private static instance: BaiduAnalytics;
  private isInitialized = false;
  private siteId = 'fd188b066e21a8e15d579e5f0b7633a9'; // 用户提供的站点ID

  private constructor() {}

  static getInstance(): BaiduAnalytics {
    if (!BaiduAnalytics.instance) {
      BaiduAnalytics.instance = new BaiduAnalytics();
    }
    return BaiduAnalytics.instance;
  }

  /**
   * 初始化百度统计
   */
  async initialize(): Promise<void> {
    const config = analyticsConfig.getBaiduConfig();
    
    if (!config.enabled) {
      logBaiduAnalytics('[BaiduAnalytics] Disabled by configuration');
      return;
    }

    if (this.isInitialized) {
      logBaiduAnalytics('[BaiduAnalytics] Already initialized');
      return;
    }

    try {
      // 使用用户提供的百度统计代码
      window._hmt = window._hmt || [];
      
      const hm = document.createElement("script");
      hm.src = `https://hm.baidu.com/hm.js?${this.siteId}`;
      hm.async = true;
      
      const s = document.getElementsByTagName("script")[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(hm, s);
      } else {
        document.head.appendChild(hm);
      }

      this.isInitialized = true;
      
      if (config.debug) {
        logBaiduAnalytics('[BaiduAnalytics] Initialized successfully with site ID:', this.siteId);
      }

      // 自动跟踪页面访问
      if (config.autoTrack) {
        this.trackPageView();
      }

    } catch (error) {
      logBaiduAnalytics.extend('error')('[BaiduAnalytics] Initialization failed:', error);
    }
  }

  /**
   * 跟踪页面访问
   */
  trackPageView(page?: string, title?: string): void {
    if (!this.isReady()) return;

    const pagePath = page || location.pathname + location.search;
    
    window._hmt.push(['_trackPageview', pagePath]);
    
    const config = analyticsConfig.getBaiduConfig();
    if (config.debug) {
      logBaiduAnalytics('[BaiduAnalytics] Page view tracked:', { pagePath, title });
    }
  }

  /**
   * 跟踪事件
   */
  trackEvent(event: BaiduTrackingEvent): void {
    if (!this.isReady()) return;

    const { category, action, label, value } = event;

    if (!category || !action) {
      logBaiduAnalytics.extend('warn')('[BaiduAnalytics] Category and action are required for event tracking');
      return;
    }

    const eventData = ['_trackEvent', category, action];
    if (label) eventData.push(label);
    if (value !== undefined) eventData.push(value);

    window._hmt.push(eventData);

    const config = analyticsConfig.getBaiduConfig();
    if (config.debug) {
      logBaiduAnalytics('[BaiduAnalytics] Event tracked:', event);
    }
  }

  /**
   * 跟踪技能点击
   */
  trackSkillClick(skillName: string, skillCategory: string): void {
    this.trackEvent({
      category: 'skill',
      action: 'click',
      label: skillName,
      value: 1
    });
  }

  /**
   * 跟踪项目查看
   */
  trackProjectView(projectName: string, projectType: string): void {
    this.trackEvent({
      category: 'project',
      action: 'view',
      label: projectName,
      value: 1
    });
  }

  /**
   * 跟踪联系方式点击
   */
  trackContactClick(contactType: string): void {
    this.trackEvent({
      category: 'contact',
      action: 'click',
      label: contactType,
      value: 1
    });
  }

  /**
   * 跟踪语言切换
   */
  trackLanguageSwitch(fromLang: string, toLang: string): void {
    this.trackEvent({
      category: 'language',
      action: 'switch',
      label: `${fromLang}_to_${toLang}`,
      value: 1
    });
  }

  /**
   * 跟踪主题切换
   */
  trackThemeSwitch(fromTheme: string, toTheme: string): void {
    this.trackEvent({
      category: 'theme',
      action: 'switch',
      label: `${fromTheme}_to_${toTheme}`,
      value: 1
    });
  }

  /**
   * 跟踪下载
   */
  trackDownload(downloadType: string, fileName?: string): void {
    this.trackEvent({
      category: 'download',
      action: 'click',
      label: fileName || downloadType,
      value: 1
    });
  }

  /**
   * 跟踪错误
   */
  trackError(errorType: string, errorMessage: string): void {
    this.trackEvent({
      category: 'error',
      action: errorType,
      label: errorMessage,
      value: 1
    });
  }

  /**
   * 设置自定义变量
   */
  setCustomVar(index: number, name: string, value: string, scope: 1 | 2 | 3 = 3): void {
    if (!this.isReady()) return;

    if (index < 1 || index > 5) {
      logBaiduAnalytics.extend('warn')('[BaiduAnalytics] Custom variable index must be between 1 and 5');
      return;
    }

    window._hmt.push(['_setCustomVar', index, name, value, scope]);

    const config = analyticsConfig.getBaiduConfig();
    if (config.debug) {
      logBaiduAnalytics('[BaiduAnalytics] Custom variable set:', { index, name, value, scope });
    }
  }

  /**
   * 检查是否准备就绪
   */
  private isReady(): boolean {
    const config = analyticsConfig.getBaiduConfig();
    
    if (!this.isInitialized || !config.enabled) {
      if (config.debug) {
        logBaiduAnalytics('[BaiduAnalytics] Not ready:', { 
          initialized: this.isInitialized, 
          enabled: config.enabled 
        });
      }
      return false;
    }

    if (!window._hmt) {
      logBaiduAnalytics.extend('warn')('[BaiduAnalytics] _hmt object not available');
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
    siteId: string;
  } {
    const config = analyticsConfig.getBaiduConfig();
    return {
      initialized: this.isInitialized,
      enabled: config.enabled,
      siteId: this.siteId.substring(0, 8) + '...'
    };
  }
}

// 导出单例实例
export const baiduAnalytics = BaiduAnalytics.getInstance();

// 自动初始化
if (typeof window !== 'undefined') {
  // 延迟初始化，避免阻塞页面加载
  setTimeout(() => {
    baiduAnalytics.initialize();
  }, 1000);
}
