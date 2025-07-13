/**
 * CDN管理器
 * CDN Manager
 * 
 * 统一管理CDN资源加载和健康检查
 * Unified management of CDN resource loading and health checking
 */

import { getCDNConfig, isDebugEnabled } from '../config/ProjectConfig';
import { cdnHealthChecker, CDNHealthResult } from './CDNHealthChecker';

/**
 * 本地开发环境检测缓存
 * Local development environment detection cache
 */
let localDevelopmentCache: boolean | null = null;

/**
 * 检测是否为本地开发环境（优化版）
 * Detect if running in local development environment (optimized)
 */
function isLocalDevelopment(): boolean {
  // 使用缓存避免重复检测
  if (localDevelopmentCache !== null) {
    return localDevelopmentCache;
  }

  const cdnConfig = getCDNConfig();

  // 检查配置是否禁用了本地优化
  if (!cdnConfig.localOptimization.enabled) {
    localDevelopmentCache = false;
    return false;
  }

  // 检查是否强制使用本地资源
  if (cdnConfig.localOptimization.forceLocal) {
    localDevelopmentCache = true;
    return true;
  }

  // 使用自定义检测函数（如果提供）
  if (cdnConfig.localOptimization.customDetection) {
    try {
      const result = cdnConfig.localOptimization.customDetection();
      localDevelopmentCache = result;
      return result;
    } catch (error) {
      if (isDebugEnabled()) {
        console.warn('[CDN Manager] Custom detection function failed:', error);
      }
    }
  }

  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') {
    localDevelopmentCache = false;
    return false;
  }

  const { hostname, port } = window.location;

  // 本地开发环境的常见特征
  const isLocalHost = hostname === 'localhost' ||
                     hostname === '127.0.0.1' ||
                     hostname === '0.0.0.0' ||
                     hostname.endsWith('.local');

  // 开发服务器常用端口（优化：使用数字比较而非字符串）
  const portNum = parseInt(port, 10);
  const isDevelopmentPort = port && (
    (portNum >= 3000 && portNum < 4000) ||  // 3000-3999
    (portNum >= 4000 && portNum < 5000) ||  // 4000-4999
    (portNum >= 5000 && portNum < 6000) ||  // 5000-5999
    (portNum >= 8000 && portNum < 9000) ||  // 8000-8999
    (portNum >= 9000 && portNum < 10000)    // 9000-9999
  );

  // 检查是否为开发环境（浏览器兼容性优化）
  let isDevEnvironment = false;
  try {
    // 安全地检查 process 环境变量
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      isDevEnvironment = true;
    }
    // 安全地检查 import.meta 环境变量
    // 注意：import 是关键字，不能用 typeof 检测
    try {
      if (import.meta?.env?.DEV) {
        isDevEnvironment = true;
      }
    } catch (importMetaError) {
      // import.meta 在某些环境中不可用，忽略错误
    }
  } catch (error) {
    // 忽略环境变量检测错误，依赖其他检测方式
    if (isDebugEnabled()) {
      console.log('[CDN Manager] Environment variable detection failed, using hostname/port detection');
    }
  }

  const result = isLocalHost && (isDevelopmentPort || isDevEnvironment);

  // 缓存结果
  localDevelopmentCache = result;

  if (isDebugEnabled()) {
    console.log(`[CDN Manager] Local development detection: ${result}`, {
      hostname,
      port,
      isLocalHost,
      isDevelopmentPort,
      isDevEnvironment,
      configEnabled: cdnConfig.localOptimization.enabled,
      forceLocal: cdnConfig.localOptimization.forceLocal
    });
  }

  return result;
}

/**
 * 重置本地开发环境检测缓存（用于测试）
 * Reset local development environment detection cache (for testing)
 */
export function resetLocalDevelopmentCache(): void {
  localDevelopmentCache = null;
}

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

    // 检查是否为本地开发环境
    if (isLocalDevelopment()) {
      if (isDebugEnabled()) {
        console.log('[CDN Manager] Local development environment detected, skipping CDN health check and using local resources');
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

    // 如果是本地开发环境，直接使用本地资源，不走网络
    if (isLocalDevelopment()) {
      const localUrl = this.buildLocalUrl(resourcePath, localBasePath);
      if (cacheUrls) {
        this.urlCache.set(resourcePath, localUrl);
      }

      if (isDebugEnabled()) {
        console.log(`[CDN Manager] Local development: using local resource: ${localUrl}`);
      }

      return localUrl;
    }

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

    // 检查健康检查是否已完成
    const allResults = cdnHealthChecker.getAllResults();
    const hasCompletedCheck = allResults.length === cdnConfig.baseUrls.length;

    if (hasCompletedCheck) {
      // 健康检查已完成，所有CDN都不可用，直接降级到本地
      if (enableFallback) {
        const localUrl = this.buildLocalUrl(resourcePath, localBasePath);

        if (isDebugEnabled()) {
          console.warn(`[CDN Manager] All CDNs failed health check, falling back to local: ${localUrl}`);
        }

        if (cacheUrls) {
          this.urlCache.set(resourcePath, localUrl);
        }
        return localUrl;
      }
    } else {
      // 健康检查还未完成，使用第一个配置的CDN作为临时方案
      if (cdnConfig.baseUrls.length > 0) {
        const fallbackCDN = cdnConfig.baseUrls[0];
        const cdnUrl = this.buildCDNUrl(fallbackCDN, resourcePath);

        if (isDebugEnabled()) {
          console.warn(`[CDN Manager] Health check in progress, using first CDN: ${fallbackCDN}`);
        }

        // 不缓存这个临时URL，等健康检查完成后重新获取
        return cdnUrl;
      }
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
   * 项目基础路径缓存
   * Project base path cache
   */
  private projectBasePathCache: string | null = null;

  /**
   * 获取项目基础路径（缓存版）
   * Get project base path (cached version)
   */
  private getProjectBasePath(): string {
    if (this.projectBasePathCache !== null) {
      return this.projectBasePathCache;
    }

    let projectBasePath = '';
    if (typeof window !== 'undefined') {
      try {
        // 从当前URL获取项目基础路径
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment);

        // 如果路径包含项目目录（如 my-resume/docs），保留这些段
        if (pathSegments.length > 0) {
          // 检查是否是开发环境（使用优化的检测逻辑）
          const isDev = isLocalDevelopment();

          if (!isDev && pathSegments.length >= 1) {
            // 生产环境，保留路径段作为基础路径
            // 例如：/my-resume/docs/fullstack -> /my-resume/docs/
            const baseSegments = pathSegments.slice(0, -1); // 移除最后一个段（页面名）
            if (baseSegments.length > 0) {
              projectBasePath = '/' + baseSegments.join('/') + '/';
            }
          }
        }
      } catch (error) {
        if (isDebugEnabled()) {
          console.warn('[CDN Manager] Failed to determine project base path:', error);
        }
      }
    }

    // 缓存结果
    this.projectBasePathCache = projectBasePath;

    if (isDebugEnabled()) {
      console.log(`[CDN Manager] Project base path determined: "${projectBasePath}"`);
    }

    return projectBasePath;
  }

  /**
   * 构建本地URL（优化版）
   * Build local URL (optimized)
   */
  private buildLocalUrl(resourcePath: string, basePath: string): string {
    const cdnConfig = getCDNConfig();

    // 优先级：参数 > 配置 > 自动检测
    let effectiveBasePath = basePath;
    if (!effectiveBasePath && cdnConfig.localOptimization.localBasePath) {
      effectiveBasePath = cdnConfig.localOptimization.localBasePath;
    }

    // 如果提供了基础路径，直接使用
    if (effectiveBasePath) {
      const cleanBasePath = effectiveBasePath.endsWith('/') ? effectiveBasePath.slice(0, -1) : effectiveBasePath;
      const cleanResourcePath = resourcePath.startsWith('/') ? resourcePath.slice(1) : resourcePath;
      return `${cleanBasePath}/${cleanResourcePath}`;
    }

    // 获取项目基础路径（使用缓存）
    const projectBasePath = this.getProjectBasePath();

    // 确保资源路径格式正确
    const cleanResourcePath = resourcePath.startsWith('/') ? resourcePath.slice(1) : resourcePath;
    const fullResourcePath = projectBasePath + cleanResourcePath;

    // 如果是开发环境，使用当前域 + 端口
    if (typeof window !== 'undefined') {
      const { protocol, hostname, port } = window.location;
      const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : '';
      return `${protocol}//${hostname}${portSuffix}${fullResourcePath}`;
    }

    return fullResourcePath;
  }

  /**
   * 重置路径缓存（用于测试或环境变化）
   * Reset path cache (for testing or environment changes)
   */
  public resetPathCache(): void {
    this.projectBasePathCache = null;
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
