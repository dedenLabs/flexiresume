/**
 * 统一分析配置管理
 * Unified Analytics Configuration
 *
 * 支持百度统计和ELK Stack双重方案
 */

import { getLogger } from "../utils/Logger";

 

// Debug logger
const debugAnalyticsConfig = getLogger('analytics-config');

export interface BaiduAnalyticsConfig {
  enabled: boolean;
  siteId: string;
  domain?: string;
  autoTrack?: boolean;
  debug?: boolean;
}

export interface ELKAnalyticsConfig {
  enabled: boolean;
  endpoint: string;
  batchSize?: number;
  flushInterval?: number;
  debug?: boolean;
}

export interface GoogleAnalyticsConfig {
  enabled: boolean;
  measurementId: string;
  debug?: boolean;
  customDimensions?: Record<string, string>;
  customMetrics?: Record<string, number>;
  useFirebase?: boolean; // 是否使用Firebase Analytics
  dynamicLoading?: boolean; // 是否使用动态加载
}

export interface AnalyticsConfig {
  baidu: BaiduAnalyticsConfig;
  google: GoogleAnalyticsConfig;
  elk: ELKAnalyticsConfig;
  enablePerformanceMonitoring: boolean;
  enableErrorTracking: boolean;
  enableUserBehaviorTracking: boolean;
}

/**
 * 默认配置
 */
const defaultConfig: AnalyticsConfig = {
  baidu: {
    enabled: false,
    siteId: '',
    domain: '',
    autoTrack: true,
    debug: false
  },
  google: {
    enabled: false,
    measurementId: '',
    debug: false,
    customDimensions: {},
    customMetrics: {},
    useFirebase: true, // 默认使用Firebase Analytics
    dynamicLoading: true // 默认使用动态加载
  },
  elk: {
    enabled: false,
    endpoint: 'http://localhost:5000',
    batchSize: 10,
    flushInterval: 5000,
    debug: false
  },
  enablePerformanceMonitoring: true,
  enableErrorTracking: true,
  enableUserBehaviorTracking: true
};

/**
 * 分析配置管理器
 */
export class AnalyticsConfigManager {
  private static instance: AnalyticsConfigManager;
  private config: AnalyticsConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): AnalyticsConfigManager {
    if (!AnalyticsConfigManager.instance) {
      AnalyticsConfigManager.instance = new AnalyticsConfigManager();
    }
    return AnalyticsConfigManager.instance;
  }

  /**
   * 加载配置
   */
  private loadConfig(): AnalyticsConfig {
    const config = { ...defaultConfig };

    // 从环境变量加载百度统计配置
    config.baidu = {
      enabled: import.meta.env.VITE_BAIDU_ENABLED === 'true',
      siteId: import.meta.env.VITE_BAIDU_SITE_ID || '',
      domain: import.meta.env.VITE_BAIDU_DOMAIN || window.location.hostname,
      autoTrack: true,
      debug: import.meta.env.DEV || false
    };

    // 从环境变量加载Google Analytics配置
    config.google = {
      enabled: import.meta.env.VITE_GOOGLE_ENABLED === 'true',
      measurementId: import.meta.env.VITE_GOOGLE_MEASUREMENT_ID || '',
      debug: import.meta.env.DEV || false,
      customDimensions: {},
      customMetrics: {},
      useFirebase: import.meta.env.VITE_GOOGLE_USE_FIREBASE !== 'false', // 默认true
      dynamicLoading: import.meta.env.VITE_GOOGLE_DYNAMIC_LOADING !== 'false' // 默认true
    };

    // 从环境变量加载ELK配置
    config.elk = {
      enabled: import.meta.env.VITE_ELK_ENABLED === 'true',
      endpoint: import.meta.env.VITE_ELK_ENDPOINT || 'http://localhost:5000',
      batchSize: parseInt(import.meta.env.VITE_ELK_BATCH_SIZE || '10'),
      flushInterval: parseInt(import.meta.env.VITE_ELK_FLUSH_INTERVAL || '5000'),
      debug: import.meta.env.DEV || false
    };

    // 从localStorage加载用户偏好设置
    try {
      const userConfig = localStorage.getItem('analytics_config');
      if (userConfig) {
        const parsed = JSON.parse(userConfig);
        Object.assign(config, parsed);
      }
    } catch (error) {
      debugAnalyticsConfig('Failed to load user analytics config: %O', error);
    }

    return config;
  }

  /**
   * 获取配置
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * 获取百度统计配置
   */
  getBaiduConfig(): BaiduAnalyticsConfig {
    return { ...this.config.baidu };
  }

  /**
   * 获取Google Analytics配置
   */
  getGoogleConfig(): GoogleAnalyticsConfig {
    return { ...this.config.google };
  }

  /**
   * 获取ELK配置
   */
  getELKConfig(): ELKAnalyticsConfig {
    return { ...this.config.elk };
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // 保存到localStorage
    try {
      localStorage.setItem('analytics_config', JSON.stringify(this.config));
    } catch (error) {
      debugAnalyticsConfig('Failed to save analytics config: %O', error);
    }
  }

  /**
   * 启用/禁用百度统计
   */
  setBaiduEnabled(enabled: boolean): void {
    this.config.baidu.enabled = enabled;
    this.updateConfig({ baidu: this.config.baidu });
  }

  /**
   * 启用/禁用Google Analytics
   */
  setGoogleEnabled(enabled: boolean): void {
    this.config.google.enabled = enabled;
    this.updateConfig({ google: this.config.google });
  }

  /**
   * 启用/禁用ELK统计
   */
  setELKEnabled(enabled: boolean): void {
    this.config.elk.enabled = enabled;
    this.updateConfig({ elk: this.config.elk });
  }

  /**
   * 检查是否有任何分析服务启用
   */
  isAnyAnalyticsEnabled(): boolean {
    return this.config.baidu.enabled || this.config.google.enabled || this.config.elk.enabled;
  }

  /**
   * 获取配置摘要
   */
  getConfigSummary(): {
    baiduEnabled: boolean;
    googleEnabled: boolean;
    elkEnabled: boolean;
    performanceMonitoring: boolean;
    errorTracking: boolean;
    userBehaviorTracking: boolean;
  } {
    return {
      baiduEnabled: this.config.baidu.enabled,
      googleEnabled: this.config.google.enabled,
      elkEnabled: this.config.elk.enabled,
      performanceMonitoring: this.config.enablePerformanceMonitoring,
      errorTracking: this.config.enableErrorTracking,
      userBehaviorTracking: this.config.enableUserBehaviorTracking
    };
  }
}

// 导出单例实例
export const analyticsConfig = AnalyticsConfigManager.getInstance();
