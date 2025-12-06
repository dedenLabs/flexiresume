/**
 * CDN管理器
 * CDN Manager
 * 
 * 统一管理CDN资源加载和健康检查
 * Unified management of CDN resource loading and health checking
 */

import { getCDNConfig, isDebugEnabled, isDevelopment } from '../config/ProjectConfig';
import { cdnHealthChecker, CDNHealthResult } from './CDNHealthChecker';
import { getLogger } from './Logger';
import { pulse } from '../styles/global/animations';
import { joinURL, removeBaseURL } from './URLPathJoiner';
import { imageCache } from './MemoryManager';

const debugCDN = getLogger('cdn');

/**
 * 本地开发环境检测缓存
 * Local development environment detection cache
 */
let localDevelopmentCache: boolean | null = null;


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

  /** CDN资源加载统计 */
  private cdnStats: Map<string, {
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    lastAttemptTime: number;
    consecutiveFailures: number;
    averageResponseTime: number;
  }> = new Map();

  private constructor() {
    this.setupCDNHealthCheckerCallbacks();
  }

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
   * 设置CDN健康检查器的回调函数
   * Setup CDN health checker callbacks
   */
  private setupCDNHealthCheckerCallbacks(): void {
    // 设置浏览器清理回调
    cdnHealthChecker.setBrowserCleanupCallback((removedCDNs) => {
      this.removeInvalidCDNsInBrowser();
    });

    // 设置状态显示回调
    cdnHealthChecker.setStatusDisplayCallback(() => {
      this.displayCDNStatusInBrowser();
    });
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
      debugCDN('CDN is disabled, skipping health check');
      this.isInitialized = true;
      return;
    }

    // 检查是否为本地开发环境
    if (isDevelopment()) {
      debugCDN('Local development environment detected, skipping CDN health check and using local resources');
      this.isInitialized = true;
      return;
    }

    if (!cdnConfig.healthCheck.enabled) {
      if (isDebugEnabled()) {
        debugCDN('[CDN Manager] CDN health check is disabled');
      }
      this.isInitialized = true;
      return;
    }

    try {
      if (isDebugEnabled()) {
        debugCDN('[CDN Manager] Starting CDN health check...');
      }

      // 执行CDN健康检查
      await cdnHealthChecker.checkAllCDNs();

      if (isDebugEnabled()) {
        const availableCDNs = cdnHealthChecker.getAvailableCDNs();
        debugCDN(`[CDN Manager] CDN health check completed. Available CDNs: ${availableCDNs.length}`);
      }

    } catch (error) {
      debugCDN.extend('error')('[CDN Manager] CDN health check failed:', error);
    } finally {
      this.isInitialized = true;
      this.initPromise = null;
    }
  }

  /**
   * 获取资源URL
   * Get resource URL
   */
  public async getResourceUrl(resourcePath: string, options: CDNLoadOptions = {}): Promise<string> {
    resourcePath = this.extractResourcePath(resourcePath);
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
    if (isDevelopment()) {
      const localUrl = this.buildLocalUrl(resourcePath, localBasePath);
      if (cacheUrls) {
        this.urlCache.set(resourcePath, localUrl);
      }

      if (isDebugEnabled()) {
        debugCDN(`[CDN Manager] Local development: using local resource: ${localUrl}`);
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

    // 获取所有可用CDN，按优先级排序，并过滤掉需要移除的CDN
    let availableCDNs = cdnHealthChecker.getAvailableCDNs();
    
    // 应用成功率统计和自动移除逻辑
    availableCDNs = this.filterCDNsByStats(availableCDNs);
    
    if (availableCDNs.length > 0) {
      // 尝试所有可用CDN，直到找到一个可用的，并记录统计
      for (const cdnUrl of availableCDNs) {
        const startTime = Date.now();
        try {
          const resourceUrl = this.buildCDNUrl(cdnUrl, resourcePath);
          
          // 快速验证资源是否可访问
          const isAccessible = await this.quickValidateResource(resourceUrl);
          const responseTime = Date.now() - startTime;
          
          // 记录成功统计
          this.recordCDNStats(cdnUrl, true, responseTime);
          
          if (isAccessible) {
            if (cacheUrls) {
              this.urlCache.set(resourcePath, resourceUrl);
            }
            
            if (isDebugEnabled()) {
              debugCDN(`[CDN Manager] Using CDN: ${cdnUrl} for resource: ${resourcePath} (${responseTime}ms)`);
            }
            
            return resourceUrl;
          }
        } catch (error) {
          const responseTime = Date.now() - startTime;
          // 记录失败统计
          this.recordCDNStats(cdnUrl, false, responseTime);
          
          if (isDebugEnabled()) {
            debugCDN.extend('warn')(`[CDN Manager] CDN ${cdnUrl} failed for resource ${resourcePath}:`, error);
          }
          // 继续尝试下一个CDN
        }
      }
      
      // 所有CDN都尝试过了，都失败了，准备降级到本地
      if (isDebugEnabled()) {
        debugCDN.extend('warn')(`[CDN Manager] All ${availableCDNs.length} CDNs failed for resource: ${resourcePath}`);
      }
    }

    // 检查健康检查是否已完成
    const allResults = cdnHealthChecker.getAllResults();
    const hasCompletedCheck = allResults.length === cdnConfig.baseUrls.length;

    if (hasCompletedCheck) {
      // 健康检查已完成，所有CDN都不可用，直接降级到本地
      if (enableFallback) {
        const localUrl = this.buildLocalUrl(resourcePath, localBasePath);

        if (isDebugEnabled()) {
          debugCDN.extend('warn')(`[CDN Manager] All CDNs failed health check, falling back to local: ${localUrl}`);
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
          debugCDN.extend('warn')(`[CDN Manager] Health check in progress, using first CDN: ${fallbackCDN}`);
        }

        // 不缓存这个临时URL，等健康检查完成后重新获取
        return cdnUrl;
      }
    }

    // 最后降级到本地资源
    if (enableFallback) {
      const localUrl = this.buildLocalUrl(resourcePath, localBasePath);

      if (isDebugEnabled()) {
        debugCDN.extend('warn')(`[CDN Manager] No CDN available, falling back to local: ${localUrl}`);
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
  public buildCDNUrl(baseUrl: string, resourcePath: string): string {
    resourcePath = removeBaseURL(resourcePath, cdnManager.getProjectBasePath());
    // 如果resourcePath已经是完整URL，提取路径部分
    let cleanResourcePath = resourcePath;
    try {
      const url = new URL(resourcePath);
      cleanResourcePath = url.pathname;
    } catch {
      // 不是完整URL，直接使用
    }

    // 如果resourcePath已经包含CDN URL，需要清理
    const cdnConfig = getCDNConfig();
    cdnConfig.baseUrls.forEach(cdnUrl => {
      if (cleanResourcePath.startsWith(cdnUrl)) {
        cleanResourcePath = cleanResourcePath.substring(cdnUrl.length);
      }
      // 处理带有/结尾的CDN URL
      const cdnUrlWithSlash = cdnUrl.endsWith('/') ? cdnUrl : cdnUrl + '/';
      if (cleanResourcePath.startsWith(cdnUrlWithSlash)) {
        cleanResourcePath = cleanResourcePath.substring(cdnUrlWithSlash.length);
      }
    });
    if (isDevelopment()) {
      debugCDN('Local development environment detected, skipping CDN health check and using local resources');
      return cleanResourcePath;
    }
    return joinURL(baseUrl, cleanResourcePath)
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
  public getProjectBasePath(): string {
    if (this.projectBasePathCache !== null) {
      return this.projectBasePathCache;
    }

    try {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);

      // 获取协议、主机和端口
      const origin = url.origin;

      // 获取路径部分并处理
      let pathname = url.pathname;


      // 分割路径
      const pathSegments = pathname.split('/').slice(0, -1);

      // 根据路径段数量确定项目根路径
      this.projectBasePathCache = origin + pathSegments.join("/") + "/";


      return this.projectBasePathCache;

    } catch (error) {
      debugCDN.extend('error')('获取项目根路径失败:', error);

      // 降级处理：返回当前域名根路径
      const fallbackPath = window.location.origin + '/';
      this.projectBasePathCache = fallbackPath;

      return fallbackPath;
    }
  }

  /**
   * 构建本地URL（优化版）
   * Build local URL (optimized)
   */
  private buildLocalUrl(resourcePath: string, basePath: string): string {
    return (this.getProjectBasePath() || basePath) + resourcePath;
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
        const url = await this.getResourceUrl(resourcePath, options);

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
          debugCDN(`[CDN Manager] Preloaded resource: ${url} `);
        }

      } catch (error) {
        debugCDN.extend('error')(`[CDN Manager] Failed to preload resource: ${resourcePath} `, error);
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

  /**
   * 记录CDN使用统计
   * Record CDN usage statistics
   */
  private recordCDNStats(cdnUrl: string, success: boolean, responseTime: number): void {
    const config = getCDNConfig();
    if (!config.autoRemoval.enabled) return;

    const stats = this.cdnStats.get(cdnUrl) || {
      totalAttempts: 0,
      successfulAttempts: 0,
      failedAttempts: 0,
      lastAttemptTime: 0,
      consecutiveFailures: 0,
      averageResponseTime: 0,
    };

    stats.totalAttempts++;
    stats.lastAttemptTime = Date.now();

    if (success) {
      stats.successfulAttempts++;
      stats.consecutiveFailures = 0;
    } else {
      stats.failedAttempts++;
      stats.consecutiveFailures++;
    }

    // 计算平均响应时间
    stats.averageResponseTime = Math.round(
      (stats.averageResponseTime * (stats.totalAttempts - 1) + responseTime) / stats.totalAttempts
    );

    this.cdnStats.set(cdnUrl, stats);

    // 检查是否需要自动移除CDN
    this.checkAndRemoveCDN(cdnUrl, stats);

    if (isDebugEnabled()) {
      const successRate = ((stats.successfulAttempts / stats.totalAttempts) * 100).toFixed(1);
      debugCDN(`[CDN Stats] ${cdnUrl}: ${successRate}% (${stats.successfulAttempts}/${stats.totalAttempts}) ${responseTime}ms`);
    }
  }

  /**
   * 根据统计信息过滤CDN
   * Filter CDNs based on statistics
   */
  private filterCDNsByStats(availableCDNs: string[]): string[] {
    const config = getCDNConfig();
    if (!config.autoRemoval.enabled) return availableCDNs;

    return availableCDNs.filter(cdnUrl => {
      const stats = this.cdnStats.get(cdnUrl);
      if (!stats) return true; // 没有统计信息，保留

      const successRate = stats.successfulAttempts / stats.totalAttempts;
      const failureThreshold = config.autoRemoval.failureThreshold;
      const successRateThreshold = config.autoRemoval.successRateThreshold / 100; // 转换为小数

      // 如果成功率为0%（全部失败）且尝试次数超过阈值，移除
      if (successRate === 0 && stats.totalAttempts >= failureThreshold) {
        debugCDN.extend('warn')(`[CDN Filter] Removing ${cdnUrl}: 0% success rate (${stats.totalAttempts} attempts)`);
        return false;
      }

      // 如果连续失败次数超过阈值，移除
      if (stats.consecutiveFailures >= failureThreshold) {
        debugCDN.extend('warn')(`[CDN Filter] Removing ${cdnUrl}: ${stats.consecutiveFailures} consecutive failures`);
        return false;
      }

      // 如果成功率低于配置的阈值且尝试次数超过阈值，移除
      if (successRate < successRateThreshold && stats.totalAttempts >= failureThreshold) {
        debugCDN.extend('warn')(`[CDN Filter] Removing ${cdnUrl}: ${(successRate * 100).toFixed(1)}% success rate below threshold ${config.autoRemoval.successRateThreshold}% (${stats.totalAttempts} attempts)`);
        return false;
      }

      return true;
    });
  }

  /**
   * 检查并移除CDN
   * Check and remove CDN if needed
   */
  private checkAndRemoveCDN(cdnUrl: string, stats: any): void {
    const config = getCDNConfig();
    if (!config.autoRemoval.enabled) return;

    const successRate = stats.successfulAttempts / stats.totalAttempts;
    const failureThreshold = config.autoRemoval.failureThreshold;
    const minCDNCount = config.autoRemoval.minCDNCount;
    const successRateThreshold = config.autoRemoval.successRateThreshold / 100; // 转换为小数

    // 检查是否满足移除条件
    const shouldRemove = (
      (successRate === 0 && stats.totalAttempts >= failureThreshold) ||
      (stats.consecutiveFailures >= failureThreshold) ||
      (successRate < successRateThreshold && stats.totalAttempts >= failureThreshold)
    );

    if (shouldRemove) {
      // 检查剩余CDN数量是否足够
      const currentConfig = getCDNConfig();
      const remainingCDNs = currentConfig.baseUrls.filter(url => url !== cdnUrl);
      
      if (remainingCDNs.length >= minCDNCount) {
        // 执行移除
        this.removeCDNFromConfig(cdnUrl, stats);
      } else {
        debugCDN.extend('warn')(`[CDN Removal] Cannot remove ${cdnUrl}: only ${remainingCDNs.length} CDNs left (minimum: ${minCDNCount})`);
      }
    }
  }

  /**
   * 从配置中移除CDN
   * Remove CDN from configuration
   */
  private removeCDNFromConfig(cdnUrl: string, stats: any): void {
    try {
      const config = getCDNConfig();
      const successRate = (stats.successfulAttempts / stats.totalAttempts) * 100;
      const successRateThreshold = config.autoRemoval.successRateThreshold;
      
      let removalReason: string;
      
      if (stats.consecutiveFailures >= config.autoRemoval.failureThreshold) {
        removalReason = `${stats.consecutiveFailures} consecutive failures`;
      } else if (successRate === 0) {
        removalReason = `0% success rate (${stats.totalAttempts} attempts)`;
      } else {
        removalReason = `${successRate.toFixed(1)}% success rate below threshold ${successRateThreshold}% (${stats.totalAttempts} attempts)`;
      }

      // 调用CDNHealthChecker的移除方法
      cdnHealthChecker.removeCDNPermanently(cdnUrl, removalReason);

      // 清除相关统计
      this.cdnStats.delete(cdnUrl);

      // 清除URL缓存中与该CDN相关的内容
      this.clearCDNRelatedCache(cdnUrl);

      debugCDN.extend('warn')(`[CDN Removal] Permanently removed ${cdnUrl}: ${removalReason}`);
    } catch (error) {
      debugCDN.extend('error')(`[CDN Removal] Error removing CDN ${cdnUrl}:`, error);
    }
  }

  /**
   * 清除与特定CDN相关的缓存
   * Clear cache related to specific CDN
   */
  private clearCDNRelatedCache(cdnUrl: string): void {
    // 清除URL缓存
    const keysToRemove: string[] = [];
    this.urlCache.forEach((cachedUrl, key) => {
      if (cachedUrl.includes(cdnUrl)) {
        keysToRemove.push(key);
      }
    });

    keysToRemove.forEach(key => {
      this.urlCache.delete(key);
    });

    if (keysToRemove.length > 0) {
      debugCDN(`[CDN Cache] Cleared ${keysToRemove.length} cached entries for removed CDN: ${cdnUrl}`);
    }
  }

  /**
   * 获取CDN统计信息
   * Get CDN statistics
   */
  public getCDNStatistics(): {
    cdnUrl: string;
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    successRate: number;
    consecutiveFailures: number;
    averageResponseTime: number;
    lastAttemptTime: number;
  }[] {
    return Array.from(this.cdnStats.entries()).map(([cdnUrl, stats]) => ({
      cdnUrl,
      totalAttempts: stats.totalAttempts,
      successfulAttempts: stats.successfulAttempts,
      failedAttempts: stats.failedAttempts,
      successRate: stats.totalAttempts > 0 ? (stats.successfulAttempts / stats.totalAttempts) * 100 : 0,
      consecutiveFailures: stats.consecutiveFailures,
      averageResponseTime: stats.averageResponseTime,
      lastAttemptTime: stats.lastAttemptTime,
    }));
  }

  /**
   * 重置CDN统计信息
   * Reset CDN statistics
   */
  public resetCDNStatistics(): void {
    this.cdnStats.clear();
    debugCDN('[CDN Stats] All CDN statistics have been reset');
  }

  /**
   * 快速验证资源是否可访问
   * Quick validate if resource is accessible
   */
  private async quickValidateResource(resourceUrl: string): Promise<boolean> {
    try {
      // 使用图片加载方式快速验证（避免跨域问题）
      return new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => {
          resolve(false);
        }, 3000); // 3秒超时

        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
 
        img.src = resourceUrl;
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取图片缓存键（去除CDN前缀的相对路径）
   */
  public getImageCacheKey(imageUrl: string): string {
    return this.extractResourcePath(imageUrl);
  }
  /**
   * 获取去除CDN前缀的相对路径
   */
  public extractResourcePath(url: string): string {
    let cleanPath = this.buildCDNUrl("", url);
    return cleanPath;
  }

  /**
   * 在浏览器中删除无效的CDN地址
   * Remove invalid CDN addresses in browser
   */
  public removeInvalidCDNsInBrowser(): void {
    try {
      // 获取已移除的CDN列表
      const removedCDNs = cdnHealthChecker.getRemovedCDNs();

      if (removedCDNs.length === 0) {
        debugCDN('[CDN Browser Cleanup] No invalid CDNs to remove');
        return;
      }

      // 在浏览器环境中执行删除操作
      if (typeof window !== 'undefined') {
        // 清除相关的缓存
        this.clearRemovedCDNsCache(removedCDNs);

        // 更新浏览器存储中的CDN配置
        this.updateBrowserCDNConfig(removedCDNs);

        // 清除DOM中相关的预加载链接
        this.removeCDNPreloadLinks(removedCDNs);

        // 输出删除信息到控制台（确保在生产环境也能看到）
        this.logCDNRemovalInfo(removedCDNs);
      }

      debugCDN(`[CDN Browser Cleanup] Removed ${removedCDNs.length} invalid CDN addresses from browser`);
    } catch (error) {
      debugCDN.extend('error')('[CDN Browser Cleanup] Error removing invalid CDNs:', error);
    }
  }

  /**
   * 清除与已移除CDN相关的缓存
   * Clear cache related to removed CDNs
   */
  private clearRemovedCDNsCache(removedCDNs: Array<{ url: string; removedAt: number; reason: string; failureCount: number }>): void {
    // 清除URL缓存中与已移除CDN相关的条目
    const cacheKeysToRemove: string[] = [];

    this.urlCache.forEach((cachedUrl, key) => {
      removedCDNs.forEach(removed => {
        if (cachedUrl.includes(removed.url)) {
          cacheKeysToRemove.push(key);
        }
      });
    });

    cacheKeysToRemove.forEach(key => {
      this.urlCache.delete(key);
    });

    // 清除图片缓存中相关的条目
    if (imageCache && typeof imageCache.clear === 'function') {
      // 这里可以添加更精确的缓存清理逻辑
      debugCDN('[CDN Browser Cleanup] Cleared related image cache entries');
    }

    debugCDN(`[CDN Browser Cleanup] Cleared ${cacheKeysToRemove.length} cache entries`);
  }

  /**
   * 更新浏览器存储中的CDN配置
   * Update CDN configuration in browser storage
   */
  private updateBrowserCDNConfig(removedCDNs: Array<{ url: string; removedAt: number; reason: string; failureCount: number }>): void {
    try {
      // 更新localStorage中的CDN配置（如果存在）
      const storageKey = 'cdn-config';
      const storedConfig = localStorage.getItem(storageKey);

      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        const removedUrls = removedCDNs.map(cdn => cdn.url);

        if (config.baseUrls && Array.isArray(config.baseUrls)) {
          config.baseUrls = config.baseUrls.filter((url: string) => !removedUrls.includes(url));
          localStorage.setItem(storageKey, JSON.stringify(config));
          debugCDN('[CDN Browser Cleanup] Updated localStorage CDN config');
        }
      }

      // 更新sessionStorage中的CDN配置（如果存在）
      const sessionConfig = sessionStorage.getItem(storageKey);
      if (sessionConfig) {
        const config = JSON.parse(sessionConfig);
        const removedUrls = removedCDNs.map(cdn => cdn.url);

        if (config.baseUrls && Array.isArray(config.baseUrls)) {
          config.baseUrls = config.baseUrls.filter((url: string) => !removedUrls.includes(url));
          sessionStorage.setItem(storageKey, JSON.stringify(config));
          debugCDN('[CDN Browser Cleanup] Updated sessionStorage CDN config');
        }
      }
    } catch (error) {
      debugCDN.extend('error')('[CDN Browser Cleanup] Error updating browser storage:', error);
    }
  }

  /**
   * 移除DOM中相关的预加载链接
   * Remove related preload links from DOM
   */
  private removeCDNPreloadLinks(removedCDNs: Array<{ url: string; removedAt: number; reason: string; failureCount: number }>): void {
    try {
      const removedUrls = removedCDNs.map(cdn => cdn.url);

      // 查找并移除相关的预加载链接
      const preloadLinks = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"], link[rel="dns-prefetch"]');
      let removedLinksCount = 0;

      preloadLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          removedUrls.forEach(removedUrl => {
            if (href.includes(removedUrl)) {
              link.remove();
              removedLinksCount++;
            }
          });
        }
      });

      debugCDN(`[CDN Browser Cleanup] Removed ${removedLinksCount} preload links`);
    } catch (error) {
      debugCDN.extend('error')('[CDN Browser Cleanup] Error removing preload links:', error);
    }
  }

  /**
   * 输出CDN移除信息到控制台
   * Log CDN removal information to console
   */
  private logCDNRemovalInfo(removedCDNs: Array<{ url: string; removedAt: number; reason: string; failureCount: number }>): void {
    // 使用console.group确保信息在生产环境也能看到
    console.group('🗑️ CDN自动移除报告 / CDN Auto Removal Report');
    console.log(`📊 移除数量 / Removed Count: ${removedCDNs.length}`);
    console.log(`⏰ 移除时间 / Removal Time: ${new Date().toLocaleString()}`);

    removedCDNs.forEach((removed, index) => {
      console.log(`${index + 1}. ${removed.url}`);
      console.log(`   📅 移除时间 / Removed At: ${new Date(removed.removedAt).toLocaleString()}`);
      console.log(`   ❌ 失败次数 / Failure Count: ${removed.failureCount}`);
      console.log(`   📝 移除原因 / Reason: ${removed.reason}`);
    });

    // 显示当前剩余的CDN
    const currentConfig = getCDNConfig();
    console.log(`\n✅ 剩余CDN / Remaining CDNs: ${currentConfig.baseUrls.length}`);
    currentConfig.baseUrls.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });

    console.groupEnd();

    // 额外的警告信息
    if (removedCDNs.length > 0) {
      console.warn(`⚠️ 已自动移除 ${removedCDNs.length} 个无响应的CDN地址，请检查网络连接或CDN服务状态`);
    }
  }

  /**
   * 获取CDN移除统计信息
   * Get CDN removal statistics
   */
  public getCDNRemovalStats(): {
    removedCount: number;
    removedCDNs: Array<{ url: string; removedAt: number; reason: string; failureCount: number }>;
    remainingCount: number;
    remainingCDNs: string[];
  } {
    const removedCDNs = cdnHealthChecker.getRemovedCDNs();
    const currentConfig = getCDNConfig();

    return {
      removedCount: removedCDNs.length,
      removedCDNs: removedCDNs,
      remainingCount: currentConfig.baseUrls.length,
      remainingCDNs: currentConfig.baseUrls
    };
  }

  /**
   * 强制在浏览器中显示CDN状态（用于生产环境调试）
   * Force display CDN status in browser (for production debugging)
   */
  public displayCDNStatusInBrowser(): void {
    if (typeof window === 'undefined') return;

    const stats = this.getCDNRemovalStats();
    const healthResults = this.getCDNHealthStatus();

    // 创建一个临时的状态显示元素
    const statusDiv = document.createElement('div');
    statusDiv.id = 'cdn-status-display';
    statusDiv.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 400px;
      max-height: 300px;
      overflow-y: auto;
    `;

    const statusHTML = `
      <div style="font-weight: bold; margin-bottom: 10px;">CDN状态报告</div>
      <div>剩余CDN: ${stats.remainingCount}</div>
      <div>已移除: ${stats.removedCount}</div>
      <div style="margin-top: 10px;">
        ${healthResults.map(result =>
      `<div>${result.available ? '✅' : '❌'} ${result.url} (${result.responseTime}ms)</div>`
    ).join('')}
      </div>
      ${stats.removedCDNs.length > 0 ? `
        <div style="margin-top: 10px; color: #ff6b6b;">
          <div>已移除的CDN:</div>
          ${stats.removedCDNs.map(removed =>
      `<div>❌ ${removed.url} (${removed.failureCount}次失败)</div>`
    ).join('')}
        </div>
      ` : ''}
      <div style="margin-top: 10px; text-align: center;">
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        ">关闭</button>
      </div>
    `;

    statusDiv.innerHTML = statusHTML;

    // 移除之前的状态显示（如果存在）
    const existingStatus = document.getElementById('cdn-status-display');
    if (existingStatus) {
      existingStatus.remove();
    }

    document.body.appendChild(statusDiv);

    // 5秒后自动移除
    setTimeout(() => {
      if (statusDiv.parentNode) {
        statusDiv.remove();
      }
    }, 5000);
  }
}

/**
 * 导出单例实例
 * Export singleton instance
 */
export const cdnManager = CDNManager.getInstance();

// 在浏览器环境中添加全局调试方法
if (typeof window !== 'undefined') {
  // 添加全局CDN调试方法
  (window as any).cdnDebug = {
    // 显示CDN状态
    showStatus: () => cdnManager.displayCDNStatusInBrowser(),

    // 获取CDN移除统计信息
    getStats: () => cdnManager.getCDNRemovalStats(),

    // 获取CDN使用统计信息
    getUsageStats: () => cdnManager.getCDNStatistics(),

    // 手动触发CDN清理
    cleanup: () => {
      // 使用已导入的cdnHealthChecker实例，避免动态导入警告
      cdnHealthChecker.triggerBrowserCDNCleanup();
    },

    // 获取CDN健康状态
    getHealth: () => cdnManager.getCDNHealthStatus(),

    // 强制执行健康检查
    checkHealth: () => {
      // 使用已导入的cdnHealthChecker实例，避免动态导入警告
      cdnHealthChecker.checkAllCDNs().then(results => {
        console.log('CDN健康检查结果:', results);
        cdnManager.displayCDNStatusInBrowser();
      });
    },

    // 重置CDN统计信息
    resetStats: () => {
      cdnManager.resetCDNStatistics();
      console.log('CDN统计信息已重置');
    },

    // 手动移除CDN
    removeCDN: (cdnUrl: string, reason?: string) => {
      cdnHealthChecker.removeCDNPermanently(cdnUrl, reason || '手动移除');
      console.log(`已手动移除CDN: ${cdnUrl}`);
    },

    // 恢复已移除的CDN
    restoreCDN: (cdnUrl: string) => {
      const success = cdnHealthChecker.restoreRemovedCDN(cdnUrl);
      console.log(success ? `已恢复CDN: ${cdnUrl}` : `恢复CDN失败: ${cdnUrl}`);
    },

    // 显示帮助信息
    help: () => {
      console.log(`
🔧 CDN调试工具 / CDN Debug Tools

可用方法 / Available Methods:
- cdnDebug.showStatus()   : 显示CDN状态面板
- cdnDebug.getStats()     : 获取CDN移除统计信息
- cdnDebug.getUsageStats() : 获取CDN使用统计信息
- cdnDebug.cleanup()      : 手动触发CDN清理
- cdnDebug.getHealth()    : 获取CDN健康状态
- cdnDebug.checkHealth()  : 强制执行健康检查
- cdnDebug.resetStats()   : 重置CDN统计信息
- cdnDebug.removeCDN()    : 手动移除CDN
- cdnDebug.restoreCDN()   : 恢复已移除的CDN
- cdnDebug.help()         : 显示此帮助信息

示例 / Examples:
> cdnDebug.showStatus()
> cdnDebug.checkHealth()
> cdnDebug.getUsageStats()
> cdnDebug.removeCDN('https://example.com/')
> cdnDebug.restoreCDN('https://example.com/')
      `);
    }
  };

  // 在控制台显示CDN调试工具可用信息
  console.log('🔧 CDN调试工具已加载，输入 cdnDebug.help() 查看可用方法');
}
