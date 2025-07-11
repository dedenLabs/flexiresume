/**
 * CDN管理器
 * CDN Manager
 * 
 * 统一管理CDN资源加载和健康检查
 * Unified management of CDN resource loading and health checking
 */

import { getCDNConfig, isDebugEnabled } from '../config/ProjectConfig';
import { cdnHealthChecker, CDNHealthResult } from './CDNHealthChecker';

export interface CDNLoadOptions {
  /** 是否启用降级到本地资源 / Whether to enable fallback to local resources */
  enableFallback?: boolean;
  
  /** 本地资源基础路径 / Local resource base path */
  localBasePath?: string;
  
  /** 是否缓存资源URL / Whether to cache resource URLs */
  cacheUrls?: boolean;
}

/**
 * CDN管理器类
 * CDN Manager Class
 */
export class CDNManager {
  private static instance: CDNManager;
  private urlCache: Map<string, string> = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  /**
   * 获取单例实例
   * Get singleton instance
   */
  public static getInstance(): CDNManager {
    if (!CDNManager.instance) {
      CDNManager.instance = new CDNManager();
    }
    return CDNManager.instance;
  }

  /**
   * 初始化CDN管理器
   * Initialize CDN manager
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    await this.initPromise;
  }

  /**
   * 执行初始化
   * Perform initialization
   */
  private async performInitialization(): Promise<void> {
    const cdnConfig = getCDNConfig();
    
    if (!cdnConfig.enabled) {
      if (isDebugEnabled()) {
        console.log('[CDN Manager] CDN is disabled, skipping health check');
      }
      this.isInitialized = true;
      return;
    }

    if (!cdnConfig.healthCheck.enabled) {
      if (isDebugEnabled()) {
        console.log('[CDN Manager] CDN health check is disabled');
      }
      this.isInitialized = true;
      return;
    }

    try {
      if (isDebugEnabled()) {
        console.log('[CDN Manager] Starting CDN health check...');
      }

      // 执行CDN健康检查
      await cdnHealthChecker.checkAllCDNs();
      
      if (isDebugEnabled()) {
        const availableCDNs = cdnHealthChecker.getAvailableCDNs();
        console.log(`[CDN Manager] CDN health check completed. Available CDNs: ${availableCDNs.length}`);
      }

    } catch (error) {
      console.error('[CDN Manager] CDN health check failed:', error);
    } finally {
      this.isInitialized = true;
      this.initPromise = null;
    }
  }

  /**
   * 获取资源URL
   * Get resource URL
   */
  public getResourceUrl(resourcePath: string, options: CDNLoadOptions = {}): string {
    const {
      enableFallback = true,
      localBasePath = '',
      cacheUrls = true,
    } = options;

    // 如果缓存中有，直接返回
    if (cacheUrls && this.urlCache.has(resourcePath)) {
      return this.urlCache.get(resourcePath)!;
    }

    const cdnConfig = getCDNConfig();
    
    // 如果CDN未启用，返回本地路径
    if (!cdnConfig.enabled) {
      const localUrl = this.buildLocalUrl(resourcePath, localBasePath);
      if (cacheUrls) {
        this.urlCache.set(resourcePath, localUrl);
      }
      return localUrl;
    }

    // 获取最佳CDN URL
    const bestCDN = cdnHealthChecker.getBestCDN();
    
    if (bestCDN) {
      const cdnUrl = this.buildCDNUrl(bestCDN, resourcePath);
      if (cacheUrls) {
        this.urlCache.set(resourcePath, cdnUrl);
      }
      return cdnUrl;
    }

    // 如果没有可用的CDN，尝试使用第一个配置的CDN
    if (cdnConfig.baseUrls.length > 0) {
      const fallbackCDN = cdnConfig.baseUrls[0];
      const cdnUrl = this.buildCDNUrl(fallbackCDN, resourcePath);
      
      if (isDebugEnabled()) {
        console.warn(`[CDN Manager] No healthy CDN found, using fallback: ${fallbackCDN}`);
      }
      
      if (cacheUrls) {
        this.urlCache.set(resourcePath, cdnUrl);
      }
      return cdnUrl;
    }

    // 最后降级到本地资源
    if (enableFallback) {
      const localUrl = this.buildLocalUrl(resourcePath, localBasePath);
      
      if (isDebugEnabled()) {
        console.warn(`[CDN Manager] No CDN available, falling back to local: ${localUrl}`);
      }
      
      if (cacheUrls) {
        this.urlCache.set(resourcePath, localUrl);
      }
      return localUrl;
    }

    // 如果不允许降级，抛出错误
    throw new Error(`[CDN Manager] No CDN available and fallback is disabled for resource: ${resourcePath}`);
  }

  /**
   * 构建CDN URL
   * Build CDN URL
   */
  private buildCDNUrl(baseUrl: string, resourcePath: string): string {
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanResourcePath = resourcePath.startsWith('/') ? resourcePath.slice(1) : resourcePath;
    return `${cleanBaseUrl}/${cleanResourcePath}`;
  }

  /**
   * 构建本地URL
   * Build local URL
   */
  private buildLocalUrl(resourcePath: string, basePath: string): string {
    if (basePath) {
      const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
      const cleanResourcePath = resourcePath.startsWith('/') ? resourcePath.slice(1) : resourcePath;
      return `${cleanBasePath}/${cleanResourcePath}`;
    }
    
    return resourcePath.startsWith('/') ? resourcePath : `/${resourcePath}`;
  }

  /**
   * 预加载资源
   * Preload resources
   */
  public async preloadResources(resourcePaths: string[], options: CDNLoadOptions = {}): Promise<void> {
    const preloadPromises = resourcePaths.map(async (resourcePath) => {
      try {
        const url = this.getResourceUrl(resourcePath, options);
        
        // 创建预加载链接
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        
        // 根据文件扩展名设置as属性
        const extension = resourcePath.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'jpg':
          case 'jpeg':
          case 'png':
          case 'webp':
          case 'svg':
            link.as = 'image';
            break;
          case 'css':
            link.as = 'style';
            break;
          case 'js':
            link.as = 'script';
            break;
          case 'woff':
          case 'woff2':
            link.as = 'font';
            link.crossOrigin = 'anonymous';
            break;
          default:
            link.as = 'fetch';
            link.crossOrigin = 'anonymous';
        }
        
        document.head.appendChild(link);
        
        if (isDebugEnabled()) {
          console.log(`[CDN Manager] Preloaded resource: ${url}`);
        }
        
      } catch (error) {
        console.error(`[CDN Manager] Failed to preload resource: ${resourcePath}`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  /**
   * 获取CDN健康状态
   * Get CDN health status
   */
  public getCDNHealthStatus(): CDNHealthResult[] {
    return cdnHealthChecker.getHealthResults();
  }

  /**
   * 刷新CDN健康检查
   * Refresh CDN health check
   */
  public async refreshCDNHealth(): Promise<CDNHealthResult[]> {
    cdnHealthChecker.clearCache();
    this.clearUrlCache();
    return await cdnHealthChecker.checkAllCDNs();
  }

  /**
   * 清除URL缓存
   * Clear URL cache
   */
  public clearUrlCache(): void {
    this.urlCache.clear();
  }

  /**
   * 获取初始化状态
   * Get initialization status
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * 获取缓存统计
   * Get cache statistics
   */
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.urlCache.size,
      keys: Array.from(this.urlCache.keys()),
    };
  }
}

/**
 * 导出单例实例
 * Export singleton instance
 */
export const cdnManager = CDNManager.getInstance();
