/**
 * CDN健康检查工具类
 * CDN Health Checker Utility
 * 
 * 用于检测CDN可用性并优化URL队列顺序
 * Used to detect CDN availability and optimize URL queue order
 */

import { getCDNConfig, updateCDNConfig, isDebugEnabled } from '../config/ProjectConfig';
import { getLogger } from './Logger';


const logCDNHealthChecker = getLogger('CDNHealthChecker');

export interface CDNHealthResult {
  /** CDN URL */
  url: string;
  
  /** 是否可用 / Whether available */
  available: boolean;
  
  /** 响应时间（毫秒） / Response time in milliseconds */
  responseTime: number;
  
  /** 错误信息 / Error message */
  error?: string;
  
  /** 检测时间戳 / Detection timestamp */
  timestamp: number;
}

export interface CDNHealthCheckOptions {
  /** 超时时间（毫秒） / Timeout in milliseconds */
  timeout?: number;
  
  /** 测试路径 / Test path */
  testPath?: string;
  
  /** 是否并发检测 / Whether to check concurrently */
  concurrent?: boolean;
  
  /** 最大并发数 / Maximum concurrency */
  maxConcurrency?: number;
}

/**
 * CDN健康检查器类
 * CDN Health Checker Class
 */
export class CDNHealthChecker {
  private static instance: CDNHealthChecker;
  private healthResults: Map<string, CDNHealthResult> = new Map();
  private isChecking = false;
  private checkPromise: Promise<CDNHealthResult[]> | null = null;

  /** CDN失败计数器 / CDN failure counters */
  private failureCounters: Map<string, number> = new Map();

  /** 已移除的CDN记录 / Removed CDN records */
  private removedCDNs: Map<string, {
    url: string;
    removedAt: number;
    reason: string;
    failureCount: number;
  }> = new Map();

  /** 浏览器清理回调函数 / Browser cleanup callback */
  private browserCleanupCallback?: (removedCDNs: Array<{ url: string; removedAt: number; reason: string; failureCount: number }>) => void;

  /** 状态显示回调函数 / Status display callback */
  private statusDisplayCallback?: () => void;

  private constructor() {}

  /**
   * 获取单例实例
   * Get singleton instance
   */
  public static getInstance(): CDNHealthChecker {
    if (!CDNHealthChecker.instance) {
      CDNHealthChecker.instance = new CDNHealthChecker();
    }
    return CDNHealthChecker.instance;
  }

  /**
   * 检测单个CDN URL的可用性
   * Check availability of a single CDN URL
   *
   * 使用多种检测方法避免跨域问题：
   * 1. 优先使用图片加载检测（避免跨域）
   * 2. 降级到fetch HEAD请求
   * 3. 最后尝试fetch GET请求
   */
  private async checkSingleCDN(
    baseUrl: string,
    testPath: string,
    timeout: number
  ): Promise<CDNHealthResult> {
    const startTime = Date.now();
    const timestamp = startTime;

    try {
      // 构建测试URL
      const testUrl = baseUrl.endsWith('/')
        ? `${baseUrl}${testPath}`
        : `${baseUrl}/${testPath}`;

      if (isDebugEnabled()) {
        logCDNHealthChecker(`[CDN Health Check] Testing: ${testUrl}`);
      }

      // 方法1: 使用图片加载检测（避免跨域问题）
      try {
        const result = await this.checkCDNWithImage(baseUrl, testUrl, timeout, startTime, timestamp);
        if (result.available) {
          return result;
        }
      } catch (imageError) {
        if (isDebugEnabled()) {
          logCDNHealthChecker(`[CDN Health Check] Image method failed for ${baseUrl}, trying fetch...`);
        }
      }

      // 方法2: 使用fetch HEAD请求
      try {
        const result = await this.checkCDNWithFetch(baseUrl, testUrl, timeout, startTime, timestamp, 'HEAD');
        if (result.available) {
          return result;
        }
      } catch (fetchError) {
        if (isDebugEnabled()) {
          logCDNHealthChecker(`[CDN Health Check] HEAD method failed for ${baseUrl}, trying GET...`);
        }
      }

      // 方法3: 使用fetch GET请求（最后尝试）
      try {
        return await this.checkCDNWithFetch(baseUrl, testUrl, timeout, startTime, timestamp, 'GET');
      } catch (getError) {
        throw getError;
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (isDebugEnabled()) {
        logCDNHealthChecker.extend('warn')(`[CDN Health Check] ${baseUrl}: FAILED - ${errorMessage} (${responseTime}ms)`);
      }

      return {
        url: baseUrl,
        available: false,
        responseTime,
        error: errorMessage,
        timestamp,
      };
    }
  }

  /**
   * 使用图片加载检测CDN可用性（避免跨域问题）
   * Check CDN availability using image loading (avoids CORS issues)
   */
  private async checkCDNWithImage(
    baseUrl: string,
    testUrl: string,
    timeout: number,
    startTime: number,
    timestamp: number
  ): Promise<CDNHealthResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let isResolved = false;

      // 设置超时
      const timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          reject(new Error('Image load timeout'));
        }
      }, timeout);

      // 成功加载
      img.onload = () => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          const responseTime = Date.now() - startTime;

          if (isDebugEnabled()) {
            logCDNHealthChecker(`[CDN Health Check] ${baseUrl}: OK via image (${responseTime}ms)`);
          }

          resolve({
            url: baseUrl,
            available: true,
            responseTime,
            timestamp,
          });
        }
      };

      // 加载失败
      img.onerror = () => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          const responseTime = Date.now() - startTime;

          reject(new Error(`Image load failed: ${testUrl}`));
        }
      };

      // 开始加载图片
      // 添加随机参数避免缓存
      const cacheBuster = `?_t=${Date.now()}&_r=${Math.random()}`;
      img.src = testUrl + cacheBuster;
    });
  }

  /**
   * 使用fetch检测CDN可用性
   * Check CDN availability using fetch
   */
  private async checkCDNWithFetch(
    baseUrl: string,
    testUrl: string,
    timeout: number,
    startTime: number,
    timestamp: number,
    method: 'HEAD' | 'GET' = 'HEAD'
  ): Promise<CDNHealthResult> {
    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // 发送请求检测可用性
      const response = await fetch(testUrl, {
        method,
        signal: controller.signal,
        cache: 'no-cache',
        mode: 'cors',
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      const result: CDNHealthResult = {
        url: baseUrl,
        available: response.ok,
        responseTime,
        timestamp,
      };

      if (!response.ok) {
        result.error = `HTTP ${response.status}: ${response.statusText}`;
      }

      if (isDebugEnabled()) {
        logCDNHealthChecker(`[CDN Health Check] ${baseUrl}: ${response.ok ? 'OK' : 'FAILED'} via ${method} (${responseTime}ms)`);
      }

      return result;

    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  }

  /**
   * 检测所有CDN的可用性
   * Check availability of all CDNs
   */
  public async checkAllCDNs(options: CDNHealthCheckOptions = {}): Promise<CDNHealthResult[]> {
    // 如果正在检测中，返回现有的Promise
    if (this.isChecking && this.checkPromise) {
      return this.checkPromise;
    }

    this.isChecking = true;
    
    const cdnConfig = getCDNConfig();
    const {
      timeout = cdnConfig.healthCheck.timeout,
      testPath = cdnConfig.healthCheck.testPath,
      concurrent = true,
      maxConcurrency = 3,
    } = options;

    if (isDebugEnabled()) {
      logCDNHealthChecker(`[CDN Health Check] Starting health check for ${cdnConfig.baseUrls.length} CDNs`);
    }

    this.checkPromise = this.performHealthCheck(cdnConfig.baseUrls, testPath, timeout, concurrent, maxConcurrency);
    
    try {
      const results = await this.checkPromise;
      
      // 缓存结果
      results.forEach(result => {
        this.healthResults.set(result.url, result);
      });

      // 检查并移除无响应的CDN
      const updatedUrls = this.checkAndRemoveUnresponsiveCDNs(results);

      // 如果有CDN被移除，更新配置并重新获取结果
      if (updatedUrls.length !== getCDNConfig().baseUrls.length) {
        updateCDNConfig({ baseUrls: updatedUrls });

        // 触发浏览器CDN清理操作
        this.triggerBrowserCleanup();

        // 过滤结果，只保留未被移除的CDN结果
        const filteredResults = results.filter(result => updatedUrls.includes(result.url));

        // 根据过滤后的结果重新排序CDN URLs
        this.reorderCDNUrls(filteredResults);

        if (isDebugEnabled()) {
          logCDNHealthChecker('[CDN Health Check] Health check completed with CDN removal:', filteredResults);
        }

        return filteredResults;
      } else {
        // 根据检测结果重新排序CDN URLs
        this.reorderCDNUrls(results);

        if (isDebugEnabled()) {
          logCDNHealthChecker('[CDN Health Check] Health check completed:', results);
        }

        return results;
      }

    } finally {
      this.isChecking = false;
      this.checkPromise = null;
    }
  }

  /**
   * 执行健康检查
   * Perform health check
   */
  private async performHealthCheck(
    urls: string[],
    testPath: string,
    timeout: number,
    concurrent: boolean,
    maxConcurrency: number
  ): Promise<CDNHealthResult[]> {
    if (concurrent) {
      // 并发检测，但限制并发数
      const results: CDNHealthResult[] = [];
      
      for (let i = 0; i < urls.length; i += maxConcurrency) {
        const batch = urls.slice(i, i + maxConcurrency);
        const batchPromises = batch.map(url => 
          this.checkSingleCDN(url, testPath, timeout)
        );
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }
      
      return results;
    } else {
      // 串行检测
      const results: CDNHealthResult[] = [];
      
      for (const url of urls) {
        const result = await this.checkSingleCDN(url, testPath, timeout);
        results.push(result);
      }
      
      return results;
    }
  }

  /**
   * 检查并移除无响应的CDN
   * Check and remove unresponsive CDNs
   */
  private checkAndRemoveUnresponsiveCDNs(results: CDNHealthResult[]): string[] {
    const cdnConfig = getCDNConfig();
    const { autoRemoval } = cdnConfig;

    if (!autoRemoval.enabled) {
      if (isDebugEnabled()) {
        logCDNHealthChecker('[CDN Auto Removal] Auto removal is disabled');
      }
      return cdnConfig.baseUrls;
    }

    const toRemove: string[] = [];

    // 更新失败计数器
    results.forEach(result => {
      if (!result.available) {
        // 增加失败计数
        const currentCount = this.failureCounters.get(result.url) || 0;
        const newCount = currentCount + 1;
        this.failureCounters.set(result.url, newCount);

        if (isDebugEnabled()) {
          logCDNHealthChecker(`[CDN Auto Removal] ${result.url}: failure count ${newCount}/${autoRemoval.failureThreshold}`);
        }

        // 检查是否达到移除阈值
        if (newCount >= autoRemoval.failureThreshold) {
          toRemove.push(result.url);
        }
      } else {
        // 重置失败计数
        const previousCount = this.failureCounters.get(result.url) || 0;
        if (previousCount > 0) {
          this.failureCounters.set(result.url, 0);
          if (isDebugEnabled()) {
            logCDNHealthChecker(`[CDN Auto Removal] ${result.url}: failure count reset (was ${previousCount})`);
          }
        }
      }
    });

    if (toRemove.length === 0) {
      return cdnConfig.baseUrls;
    }

    // 计算移除后剩余的CDN
    const remainingCDNs = cdnConfig.baseUrls.filter(url => !toRemove.includes(url));

    // 确保不会移除所有CDN，至少保留最小数量
    if (remainingCDNs.length < autoRemoval.minCDNCount) {
      // 从要移除的CDN中选择响应时间最好的保留
      const candidatesForKeeping = results
        .filter(r => toRemove.includes(r.url))
        .sort((a, b) => {
          // 优先保留有响应的CDN，即使失败次数达到阈值
          if (a.available !== b.available) {
            return b.available ? 1 : -1;
          }
          // 其次按响应时间排序
          return a.responseTime - b.responseTime;
        });

      const keepCount = autoRemoval.minCDNCount - remainingCDNs.length;
      const toKeep = candidatesForKeeping.slice(0, keepCount).map(r => r.url);

      // 从移除列表中排除要保留的CDN
      toKeep.forEach(url => {
        const index = toRemove.indexOf(url);
        if (index > -1) {
          toRemove.splice(index, 1);
          // 重置失败计数，给它们一次机会
          this.failureCounters.set(url, Math.floor(autoRemoval.failureThreshold / 2));
        }
      });

      if (isDebugEnabled()) {
        logCDNHealthChecker(`[CDN Auto Removal] Keeping ${toKeep.length} CDNs to maintain minimum count:`, toKeep);
      }
    }

    // 执行移除并记录
    toRemove.forEach(url => {
      const failureCount = this.failureCounters.get(url) || 0;
      this.removedCDNs.set(url, {
        url,
        removedAt: Date.now(),
        reason: `连续${failureCount}次健康检查失败`,
        failureCount
      });

      // 清除失败计数器
      this.failureCounters.delete(url);

      if (isDebugEnabled()) {
        logCDNHealthChecker(`[CDN Auto Removal] Removed CDN: ${url} (${failureCount} consecutive failures)`);
      }
    });

    const finalUrls = cdnConfig.baseUrls.filter(url => !toRemove.includes(url));

    if (isDebugEnabled() && toRemove.length > 0) {
      logCDNHealthChecker(`[CDN Auto Removal] Removed ${toRemove.length} CDNs, ${finalUrls.length} remaining`);
    }

    return finalUrls;
  }

  /**
   * 根据健康检查结果重新排序CDN URLs
   * Reorder CDN URLs based on health check results
   */
  private reorderCDNUrls(results: CDNHealthResult[]): void {
    const cdnConfig = getCDNConfig();
    const strategy = cdnConfig.sortingStrategy;

    if (!strategy.enabled) {
      if (isDebugEnabled()) {
        logCDNHealthChecker('[CDN Health Check] Sorting strategy disabled, keeping original order');
      }
      return;
    }

    let reorderedUrls: string[];

    if (strategy.mode === 'availability') {
      // 可用性优先策略：响应正常的URL排前面，无响应的移至末尾
      const availableCDNs = results
        .filter(result => result.available)
        .sort((a, b) => a.responseTime - b.responseTime);

      const unavailableCDNs = results
        .filter(result => !result.available);

      reorderedUrls = [
        ...availableCDNs.map(result => result.url),
        ...unavailableCDNs.map(result => result.url),
      ];

      if (isDebugEnabled()) {
        logCDNHealthChecker('[CDN Health Check] Using availability-first strategy');
        logCDNHealthChecker('[CDN Health Check] Available CDNs:', availableCDNs.length);
        logCDNHealthChecker('[CDN Health Check] Unavailable CDNs:', unavailableCDNs.length);
      }

    } else if (strategy.mode === 'speed') {
      // 速度优先策略：按响应速度排序，响应快的排前面
      const sortedResults = results
        .filter(result => result.available) // 只考虑可用的CDN
        .sort((a, b) => {
          // 计算综合得分：速度权重 + 可用性权重
          const scoreA = (1 / a.responseTime) * strategy.speedWeight +
                        (a.available ? 1 : 0) * strategy.availabilityWeight;
          const scoreB = (1 / b.responseTime) * strategy.speedWeight +
                        (b.available ? 1 : 0) * strategy.availabilityWeight;
          return scoreB - scoreA; // 得分高的排前面
        });

      const unavailableCDNs = results.filter(result => !result.available);

      reorderedUrls = [
        ...sortedResults.map(result => result.url),
        ...unavailableCDNs.map(result => result.url),
      ];

      if (isDebugEnabled()) {
        logCDNHealthChecker('[CDN Health Check] Using speed-first strategy');
        logCDNHealthChecker('[CDN Health Check] Speed weight:', strategy.speedWeight);
        logCDNHealthChecker('[CDN Health Check] Availability weight:', strategy.availabilityWeight);
        logCDNHealthChecker('[CDN Health Check] Sorted by performance:',
          sortedResults.map(r => `${r.url} (${r.responseTime}ms)`));
      }

    } else {
      logCDNHealthChecker.extend('warn')('[CDN Health Check] Unknown sorting strategy:', strategy.mode);
      return;
    }

    // 更新CDN配置中的URL顺序
    updateCDNConfig({
      baseUrls: reorderedUrls,
    });

    if (isDebugEnabled()) {
      logCDNHealthChecker('[CDN Health Check] CDN URLs reordered:', reorderedUrls);
    }
  }

  /**
   * 获取健康检查结果
   * Get health check results
   */
  public getHealthResults(): CDNHealthResult[] {
    return Array.from(this.healthResults.values());
  }

  /**
   * 获取可用的CDN URLs
   * Get available CDN URLs
   */
  public getAvailableCDNs(): string[] {
    return Array.from(this.healthResults.values())
      .filter(result => result.available)
      .sort((a, b) => a.responseTime - b.responseTime)
      .map(result => result.url);
  }

  /**
   * 检查特定CDN是否可用
   * Check if a specific CDN is available
   */
  public isCDNAvailable(url: string): boolean {
    const result = this.healthResults.get(url);
    return result ? result.available : false;
  }

  /**
   * 清除健康检查缓存
   * Clear health check cache
   */
  public clearCache(): void {
    this.healthResults.clear();
  }

  /**
   * 获取最佳CDN URL
   * Get the best CDN URL
   */
  public getBestCDN(): string | null {
    const availableCDNs = this.getAvailableCDNs();
    return availableCDNs.length > 0 ? availableCDNs[0] : null;
  }

  /**
   * 获取所有健康检查结果
   * Get all health check results
   */
  public getAllResults(): CDNHealthResult[] {
    return Array.from(this.healthResults.values());
  }

  /**
   * 获取已移除的CDN列表
   * Get removed CDN list
   */
  public getRemovedCDNs(): Array<{ url: string; removedAt: number; reason: string; failureCount: number }> {
    return Array.from(this.removedCDNs.values());
  }

  /**
   * 获取CDN失败计数
   * Get CDN failure counts
   */
  public getFailureCounts(): Map<string, number> {
    return new Map(this.failureCounters);
  }

  /**
   * 手动恢复已移除的CDN
   * Manually restore removed CDN
   */
  public restoreRemovedCDN(url: string): boolean {
    if (this.removedCDNs.has(url)) {
      this.removedCDNs.delete(url);
      this.failureCounters.set(url, 0); // 重置失败计数

      // 将CDN重新添加到配置中
      const cdnConfig = getCDNConfig();
      if (!cdnConfig.baseUrls.includes(url)) {
        updateCDNConfig({
          baseUrls: [...cdnConfig.baseUrls, url]
        });
      }

      if (isDebugEnabled()) {
        logCDNHealthChecker(`[CDN Auto Removal] Manually restored CDN: ${url}`);
      }

      return true;
    }
    return false;
  }

  /**
   * 清除所有移除记录
   * Clear all removal records
   */
  public clearRemovedCDNs(): void {
    this.removedCDNs.clear();
    if (isDebugEnabled()) {
      logCDNHealthChecker('[CDN Auto Removal] Cleared all removal records');
    }
  }

  /**
   * 永久移除CDN（基于统计数据）
   * Permanently remove CDN (based on statistics)
   */
  public removeCDNPermanently(cdnUrl: string, reason: string): void {
    try {
      const cdnConfig = getCDNConfig();
      
      // 如果CDN不在当前配置中，直接返回
      if (!cdnConfig.baseUrls.includes(cdnUrl)) {
        return;
      }

      // 记录移除信息
      const failureCount = this.failureCounters.get(cdnUrl) || 0;
      this.removedCDNs.set(cdnUrl, {
        url: cdnUrl,
        removedAt: Date.now(),
        reason,
        failureCount
      });

      // 清除失败计数器和健康检查结果
      this.failureCounters.delete(cdnUrl);
      this.healthResults.delete(cdnUrl);

      // 从配置中移除CDN
      const updatedUrls = cdnConfig.baseUrls.filter(url => url !== cdnUrl);
      updateCDNConfig({ baseUrls: updatedUrls });

      // 触发浏览器清理
      this.triggerBrowserCleanup();

      if (isDebugEnabled()) {
        logCDNHealthChecker(`[CDN Permanent Removal] Removed ${cdnUrl}: ${reason}`);
      }

    } catch (error) {
      logCDNHealthChecker.extend('error')(`[CDN Permanent Removal] Error removing ${cdnUrl}:`, error);
    }
  }

  /**
   * 触发浏览器CDN清理操作
   * Trigger browser CDN cleanup operation
   */
  private triggerBrowserCleanup(): void {
    try {
      // 使用回调函数避免循环依赖
      if (this.browserCleanupCallback) {
        this.browserCleanupCallback(this.getRemovedCDNs());
      }
    } catch (error) {
      if (isDebugEnabled()) {
        logCDNHealthChecker.extend('error')('[CDN Auto Removal] Error triggering browser cleanup:', error);
      }
    }
  }

  /**
   * 手动触发浏览器CDN清理（用于调试）
   * Manually trigger browser CDN cleanup (for debugging)
   */
  public triggerBrowserCDNCleanup(): void {
    this.triggerBrowserCleanup();

    // 同时显示CDN状态
    if (this.statusDisplayCallback) {
      this.statusDisplayCallback();
    }
  }

  /**
   * 设置浏览器清理回调函数
   * Set browser cleanup callback
   */
  public setBrowserCleanupCallback(callback: (removedCDNs: Array<{ url: string; removedAt: number; reason: string; failureCount: number }>) => void): void {
    this.browserCleanupCallback = callback;
  }

  /**
   * 设置状态显示回调函数
   * Set status display callback
   */
  public setStatusDisplayCallback(callback: () => void): void {
    this.statusDisplayCallback = callback;
  }
}

/**
 * 导出单例实例
 * Export singleton instance
 */
export const cdnHealthChecker = CDNHealthChecker.getInstance();
