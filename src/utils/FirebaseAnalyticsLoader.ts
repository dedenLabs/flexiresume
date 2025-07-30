/**
 * Firebase Analytics 动态加载器
 * Firebase Analytics Dynamic Loader
 * 
 * 通过网络动态加载Firebase Analytics，不依赖npm包
 * Dynamically loads Firebase Analytics via network without npm dependencies
 */

import { analyticsConfig } from '../config/AnalyticsConfig';
import { getLogger } from './Logger';

const logFirebaseAnalyticsLoader = getLogger('FirebaseAnalyticsLoader');

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

interface FirebaseApp {
  name: string;
  options: FirebaseConfig;
}

interface FirebaseAnalytics {
  app: FirebaseApp;
}

interface FirebaseSDK {
  initializeApp: (config: FirebaseConfig) => FirebaseApp;
  getAnalytics: (app: FirebaseApp) => FirebaseAnalytics;
  isSupported: () => Promise<boolean>;
  logEvent: (analytics: FirebaseAnalytics, eventName: string, eventParams?: Record<string, any>) => void;
  setUserProperties: (analytics: FirebaseAnalytics, properties: Record<string, any>) => void;
  setUserId: (analytics: FirebaseAnalytics, userId: string) => void;
  setCurrentScreen: (analytics: FirebaseAnalytics, screenName: string) => void;
}

/**
 * Firebase Analytics 动态加载器类
 */
export class FirebaseAnalyticsLoader {
  private static instance: FirebaseAnalyticsLoader;
  private firebaseSDK: FirebaseSDK | null = null;
  private analytics: FirebaseAnalytics | null = null;
  private app: FirebaseApp | null = null;
  private isLoading = false;
  private isLoaded = false;
  private loadPromise: Promise<boolean> | null = null;

  private constructor() {}

  static getInstance(): FirebaseAnalyticsLoader {
    if (!FirebaseAnalyticsLoader.instance) {
      FirebaseAnalyticsLoader.instance = new FirebaseAnalyticsLoader();
    }
    return FirebaseAnalyticsLoader.instance;
  }

  /**
   * 动态加载Firebase SDK
   */
  private async loadFirebaseSDK(): Promise<FirebaseSDK | null> {
    try {
      // 检查是否在浏览器环境
      if (typeof window === 'undefined') {
        logFirebaseAnalyticsLoader.extend('warn')('[FirebaseLoader] Not in browser environment');
        return null;
      }

      // 检查是否已经加载
      if (this.firebaseSDK) {
        return this.firebaseSDK;
      }

      logFirebaseAnalyticsLoader('[FirebaseLoader] Loading Firebase SDK from CDN...');

      // 动态加载Firebase App SDK
      const firebaseAppScript = document.createElement('script');
      firebaseAppScript.type = 'module';
      firebaseAppScript.innerHTML = `
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
        import { 
          getAnalytics, 
          isSupported, 
          logEvent, 
          setUserProperties, 
          setUserId,
          setCurrentScreen 
        } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';
        
        window.__firebaseSDK = {
          initializeApp,
          getAnalytics,
          isSupported,
          logEvent,
          setUserProperties,
          setUserId,
          setCurrentScreen
        };
        
        window.dispatchEvent(new CustomEvent('firebaseSDKLoaded'));
      `;

      // 等待SDK加载完成
      const loadPromise = new Promise<FirebaseSDK | null>((resolve) => {
        const handleLoad = () => {
          window.removeEventListener('firebaseSDKLoaded', handleLoad);
          const sdk = (window as any).__firebaseSDK;
          if (sdk) {
            this.firebaseSDK = sdk;
            logFirebaseAnalyticsLoader('[FirebaseLoader] Firebase SDK loaded successfully');
            resolve(sdk);
          } else {
            logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Firebase SDK not found on window');
            resolve(null);
          }
        };

        const handleError = () => {
          logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Failed to load Firebase SDK');
          resolve(null);
        };

        window.addEventListener('firebaseSDKLoaded', handleLoad);
        firebaseAppScript.addEventListener('error', handleError);

        // 超时处理
        setTimeout(() => {
          window.removeEventListener('firebaseSDKLoaded', handleLoad);
          logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Firebase SDK load timeout');
          resolve(null);
        }, 10000);
      });

      document.head.appendChild(firebaseAppScript);
      return await loadPromise;

    } catch (error) {
      logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Error loading Firebase SDK:', error);
      return null;
    }
  }

  /**
   * 获取Firebase配置
   */
  private getFirebaseConfig(): FirebaseConfig | null {
    const config = analyticsConfig.getGoogleConfig();
    
    if (!config.enabled) {
      logFirebaseAnalyticsLoader('[FirebaseLoader] Firebase Analytics disabled in config');
      return null;
    }

    const firebaseConfig: FirebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      measurementId: config.measurementId || import.meta.env.VITE_GOOGLE_MEASUREMENT_ID || ''
    };

    // 验证必要的配置
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.measurementId) {
      logFirebaseAnalyticsLoader.extend('warn')('[FirebaseLoader] Firebase configuration incomplete:', {
        hasApiKey: !!firebaseConfig.apiKey,
        hasProjectId: !!firebaseConfig.projectId,
        hasMeasurementId: !!firebaseConfig.measurementId
      });
      return null;
    }

    return firebaseConfig;
  }

  /**
   * 初始化Firebase Analytics
   */
  async initialize(): Promise<boolean> {
    // 如果已经在加载中，返回加载Promise
    if (this.isLoading && this.loadPromise) {
      return await this.loadPromise;
    }

    // 如果已经加载完成
    if (this.isLoaded && this.analytics) {
      return true;
    }

    // 开始加载
    this.isLoading = true;
    this.loadPromise = this._doInitialize();
    
    const result = await this.loadPromise;
    this.isLoading = false;
    this.isLoaded = result;
    
    return result;
  }

  /**
   * 执行初始化
   */
  private async _doInitialize(): Promise<boolean> {
    try {
      logFirebaseAnalyticsLoader('[FirebaseLoader] Initializing Firebase Analytics...');

      // 获取配置
      const config = this.getFirebaseConfig();
      if (!config) {
        return false;
      }

      // 加载SDK
      const sdk = await this.loadFirebaseSDK();
      if (!sdk) {
        return false;
      }

      // 检查浏览器支持
      const supported = await sdk.isSupported();
      if (!supported) {
        logFirebaseAnalyticsLoader.extend('warn')('[FirebaseLoader] Firebase Analytics not supported in this browser');
        return false;
      }

      // 初始化Firebase App
      this.app = sdk.initializeApp(config);
      logFirebaseAnalyticsLoader('[FirebaseLoader] Firebase App initialized');

      // 初始化Analytics
      this.analytics = sdk.getAnalytics(this.app);
      logFirebaseAnalyticsLoader('[FirebaseLoader] Firebase Analytics initialized');

      return true;

    } catch (error) {
      logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Firebase initialization failed:', error);
      return false;
    }
  }

  /**
   * 记录事件
   */
  async logEvent(eventName: string, eventParams?: Record<string, any>): Promise<void> {
    if (!await this.initialize()) {
      logFirebaseAnalyticsLoader.extend('warn')('[FirebaseLoader] Firebase not initialized, skipping event:', eventName);
      return;
    }

    try {
      if (this.firebaseSDK && this.analytics) {
        this.firebaseSDK.logEvent(this.analytics, eventName, eventParams);
        
        const config = analyticsConfig.getGoogleConfig();
        if (config.debug) {
          logFirebaseAnalyticsLoader('[FirebaseLoader] Event logged:', { eventName, eventParams });
        }
      }
    } catch (error) {
      logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Failed to log event:', error);
    }
  }

  /**
   * 设置用户属性
   */
  async setUserProperties(properties: Record<string, any>): Promise<void> {
    if (!await this.initialize()) {
      logFirebaseAnalyticsLoader.extend('warn')('[FirebaseLoader] Firebase not initialized, skipping user properties');
      return;
    }

    try {
      if (this.firebaseSDK && this.analytics) {
        this.firebaseSDK.setUserProperties(this.analytics, properties);
        
        const config = analyticsConfig.getGoogleConfig();
        if (config.debug) {
          logFirebaseAnalyticsLoader('[FirebaseLoader] User properties set:', properties);
        }
      }
    } catch (error) {
      logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Failed to set user properties:', error);
    }
  }

  /**
   * 设置用户ID
   */
  async setUserId(userId: string): Promise<void> {
    if (!await this.initialize()) {
      logFirebaseAnalyticsLoader.extend('warn')('[FirebaseLoader] Firebase not initialized, skipping user ID');
      return;
    }

    try {
      if (this.firebaseSDK && this.analytics) {
        this.firebaseSDK.setUserId(this.analytics, userId);
        
        const config = analyticsConfig.getGoogleConfig();
        if (config.debug) {
          logFirebaseAnalyticsLoader('[FirebaseLoader] User ID set:', userId);
        }
      }
    } catch (error) {
      logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Failed to set user ID:', error);
    }
  }

  /**
   * 设置当前屏幕
   */
  async setCurrentScreen(screenName: string): Promise<void> {
    if (!await this.initialize()) {
      logFirebaseAnalyticsLoader.extend('warn')('[FirebaseLoader] Firebase not initialized, skipping screen tracking');
      return;
    }

    try {
      if (this.firebaseSDK && this.analytics) {
        this.firebaseSDK.setCurrentScreen(this.analytics, screenName);
        
        const config = analyticsConfig.getGoogleConfig();
        if (config.debug) {
          logFirebaseAnalyticsLoader('[FirebaseLoader] Current screen set:', screenName);
        }
      }
    } catch (error) {
      logFirebaseAnalyticsLoader.extend('error')('[FirebaseLoader] Failed to set current screen:', error);
    }
  }

  /**
   * 获取状态信息
   */
  getStatus(): {
    isLoaded: boolean;
    isLoading: boolean;
    hasAnalytics: boolean;
    hasApp: boolean;
    configValid: boolean;
  } {
    const config = this.getFirebaseConfig();
    
    return {
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      hasAnalytics: !!this.analytics,
      hasApp: !!this.app,
      configValid: !!config
    };
  }

  /**
   * 重置状态（用于测试）
   */
  reset(): void {
    this.firebaseSDK = null;
    this.analytics = null;
    this.app = null;
    this.isLoading = false;
    this.isLoaded = false;
    this.loadPromise = null;
    
    // 清理全局变量
    if (typeof window !== 'undefined') {
      delete (window as any).__firebaseSDK;
    }
  }
}

// 导出单例实例
export const firebaseAnalyticsLoader = FirebaseAnalyticsLoader.getInstance();
