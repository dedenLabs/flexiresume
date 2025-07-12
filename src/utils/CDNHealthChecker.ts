/**
 * CDN健康检查工具类
 * CDN Health Checker Utility
 * 
 * 用于检测CDN可用性并优化URL队列顺序
 * Used to detect CDN availability and optimize URL queue order
 */

import { getCDNConfig, updateCDNConfig, isDebugEnabled } from '../config/ProjectConfig';

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
        console.log(`[CDN Health Check] Testing: ${testUrl}`);
      }

      // 方法1: 使用图片加载检测（避免跨域问题）
      try {
        const result = await this.checkCDNWithImage(baseUrl, testUrl, timeout, startTime, timestamp);
        if (result.available) {
          return result;
        }
      } catch (imageError) {
        if (isDebugEnabled()) {
          console.log(`[CDN Health Check] Image method failed for ${baseUrl}, trying fetch...`);
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
          console.log(`[CDN Health Check] HEAD method failed for ${baseUrl}, trying GET...`);
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
        console.warn(`[CDN Health Check] ${baseUrl}: FAILED - ${errorMessage} (${responseTime}ms)`);
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
            console.log(`[CDN Health Check] ${baseUrl}: OK via image (${responseTime}ms)`);
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
        console.log(`[CDN Health Check] ${baseUrl}: ${response.ok ? 'OK' : 'FAILED'} via ${method} (${responseTime}ms)`);
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
      console.log(`[CDN Health Check] Starting health check for ${cdnConfig.baseUrls.length} CDNs`);
    }

    this.checkPromise = this.performHealthCheck(cdnConfig.baseUrls, testPath, timeout, concurrent, maxConcurrency);
    
    try {
      const results = await this.checkPromise;
      
      // 缓存结果
      results.forEach(result => {
        this.healthResults.set(result.url, result);
      });

      // 根据检测结果重新排序CDN URLs
      this.reorderCDNUrls(results);

      if (isDebugEnabled()) {
        console.log('[CDN Health Check] Health check completed:', results);
      }

      return results;

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
   * 根据健康检查结果重新排序CDN URLs
   * Reorder CDN URLs based on health check results
   */
  private reorderCDNUrls(results: CDNHealthResult[]): void {
    const cdnConfig = getCDNConfig();
    const strategy = cdnConfig.sortingStrategy;

    if (!strategy.enabled) {
      if (isDebugEnabled()) {
        console.log('[CDN Health Check] Sorting strategy disabled, keeping original order');
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
        console.log('[CDN Health Check] Using availability-first strategy');
        console.log('[CDN Health Check] Available CDNs:', availableCDNs.length);
        console.log('[CDN Health Check] Unavailable CDNs:', unavailableCDNs.length);
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
        console.log('[CDN Health Check] Using speed-first strategy');
        console.log('[CDN Health Check] Speed weight:', strategy.speedWeight);
        console.log('[CDN Health Check] Availability weight:', strategy.availabilityWeight);
        console.log('[CDN Health Check] Sorted by performance:',
          sortedResults.map(r => `${r.url} (${r.responseTime}ms)`));
      }

    } else {
      console.warn('[CDN Health Check] Unknown sorting strategy:', strategy.mode);
      return;
    }

    // 更新CDN配置中的URL顺序
    updateCDNConfig({
      baseUrls: reorderedUrls,
    });

    if (isDebugEnabled()) {
      console.log('[CDN Health Check] CDN URLs reordered:', reorderedUrls);
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
}

/**
 * 导出单例实例
 * Export singleton instance
 */
export const cdnHealthChecker = CDNHealthChecker.getInstance();
