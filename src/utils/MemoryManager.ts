import { getLogger } from "./Logger";
import { cdnManager } from './CDNManager';


const logMemoryManager = getLogger('MemoryManager');
/**
 * 内存管理工具
 * 
 * 提供智能缓存管理，避免内存泄漏，优化应用性能
 * 
 * @author dedenlabs
 * @date 2025-07-29
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size?: number;
}

interface CacheConfig {
  maxSize: number;        // 最大缓存项数量
  maxAge: number;         // 最大缓存时间（毫秒）
  maxMemory: number;      // 最大内存使用（字节）
  cleanupInterval: number; // 清理间隔（毫秒）
}

/**
 * 智能缓存管理器
 */
export class SmartCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;
  private memoryUsage = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 50,
      maxAge: 30 * 60 * 1000, // 30分钟
      maxMemory: 50 * 1024 * 1024, // 50MB
      cleanupInterval: 5 * 60 * 1000, // 5分钟
      ...config
    };

    this.startCleanup();
  }

  /**
   * 设置缓存项
   */
  set(key: string, data: T): void {
    const size = this.estimateSize(data);
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      size
    };

    // 检查是否需要清理空间
    this.ensureSpace(size);

    this.cache.set(key, item);
    this.memoryUsage += size;

    logMemoryManager(`📦 [Cache] 设置缓存: ${key}, 大小: ${(size / 1024).toFixed(2)}KB, 总内存: ${(this.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
  }

  /**
   * 获取缓存项
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) {
      return undefined;
    }

    // 检查是否过期
    if (this.isExpired(item)) {
      this.delete(key);
      return undefined;
    }

    // 更新访问信息
    item.accessCount++;
    item.lastAccessed = Date.now();

    logMemoryManager(`📦 [Cache] 命中缓存: ${key}, 访问次数: ${item.accessCount}`);
    return item.data;
  }

  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (item) {
      this.memoryUsage -= item.size || 0;
      logMemoryManager(`🗑️ [Cache] 删除缓存: ${key}`);
    }
    return this.cache.delete(key);
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (this.isExpired(item)) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
    this.memoryUsage = 0;
    logMemoryManager(`🧹 [Cache] 清空所有缓存`);
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const items = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      memoryUsage: this.memoryUsage,
      memoryUsageMB: this.memoryUsage / 1024 / 1024,
      averageAccessCount: items.reduce((sum, item) => sum + item.accessCount, 0) / items.length || 0,
      oldestItem: Math.min(...items.map(item => item.timestamp)),
      newestItem: Math.max(...items.map(item => item.timestamp))
    };
  }

  /**
   * 估算数据大小
   */
  private estimateSize(data: T): number {
    try {
      const jsonString = JSON.stringify(data);
      return jsonString.length * 2; // 假设每个字符占用2字节
    } catch {
      return 1024; // 默认1KB
    }
  }

  /**
   * 检查项目是否过期
   */
  private isExpired(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > this.config.maxAge;
  }

  /**
   * 确保有足够空间
   */
  private ensureSpace(newItemSize: number): void {
    // 检查数量限制
    while (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed();
    }

    // 检查内存限制
    while (this.memoryUsage + newItemSize > this.config.maxMemory) {
      this.evictLeastUsed();
    }
  }

  /**
   * 驱逐最少使用的项目
   */
  private evictLeastUsed(): void {
    if (this.cache.size === 0) return;

    let leastUsedKey = '';
    let leastUsedScore = Infinity;

    for (const [key, item] of this.cache.entries()) {
      // 计算使用分数（访问次数 / 时间差）
      const timeDiff = Date.now() - item.lastAccessed;
      const score = item.accessCount / (timeDiff + 1);

      if (score < leastUsedScore) {
        leastUsedScore = score;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.delete(leastUsedKey);
      logMemoryManager(`🚮 [Cache] 驱逐最少使用项: ${leastUsedKey}`);
    }
  }

  /**
   * 清理过期项目
   */
  private cleanup(): void {
    const beforeSize = this.cache.size;
    const beforeMemory = this.memoryUsage;

    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.delete(key);
      }
    }

    const cleanedItems = beforeSize - this.cache.size;
    const freedMemory = beforeMemory - this.memoryUsage;

    if (cleanedItems > 0) {
      // 调试日志已移除: console.log(`🧹 [Cache] 清理完成: 删除 ${cleanedItems} 项, 释放 ${(freedMemory / 1024 / 1024).toFixed(2)}MB`);
    }
  }

  /**
   * 开始定期清理
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * 停止清理
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

/**
 * 全局缓存实例
 */
export const globalCache = new SmartCache({
  maxSize: 1000,
  maxAge: 30 * 60 * 1000, // 30分钟
  maxMemory: 100 * 1024 * 1024, // 100MB
  cleanupInterval: 5 * 60 * 1000 // 5分钟
});

/**
 * 页面数据缓存
 */
export const pageDataCache = new SmartCache({
  maxSize: 1000,
  maxAge: 10 * 60 * 1000, // 10分钟
  maxMemory: 50 * 1024 * 1024, // 50MB
  cleanupInterval: 2 * 60 * 1000 // 2分钟
});

/**
 * 内存监控工具
 */
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private monitorInterval?: NodeJS.Timeout;

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  /**
   * 开始内存监控
   */
  startMonitoring(interval: number = 30000): void {
    this.monitorInterval = setInterval(() => {
      this.logMemoryUsage();
    }, interval);
  }

  /**
   * 停止内存监控
   */
  stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
  }

  /**
   * 记录内存使用情况
   */
  logMemoryUsage(): void {
    try {
      // @ts-ignore
      const memory = (performance as any).memory;
      if (memory) {
        const used = memory.usedJSHeapSize / 1024 / 1024;
        const total = memory.totalJSHeapSize / 1024 / 1024;
        const limit = memory.jsHeapSizeLimit / 1024 / 1024;

        logMemoryManager(`🧠 [Memory] 使用: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB (限制: ${limit.toFixed(2)}MB)`);

        // 缓存统计
        const globalStats = globalCache.getStats();
        const pageStats = pageDataCache.getStats();

        logMemoryManager(`📦 [Cache] 全局缓存: ${globalStats.size}项, ${globalStats.memoryUsageMB.toFixed(2)}MB`);
        logMemoryManager(`📄 [Cache] 页面缓存: ${pageStats.size}项, ${pageStats.memoryUsageMB.toFixed(2)}MB`);

        // 内存警告
        if (used > limit * 0.8) {
          logMemoryManager.extend('warn')(`⚠️ [Memory] 内存使用率过高: ${((used / limit) * 100).toFixed(1)}%`);
          this.triggerCleanup();
        }
      }
    } catch (error) {
      logMemoryManager.extend('error')('内存监控失败:', error);
    }
  }

  /**
   * 触发清理
   */
  private triggerCleanup(): void {
    // 调试日志已移除: console.log(`🧹 [Memory] 触发内存清理...`);
    
    // 清理缓存
    globalCache.clear();
    pageDataCache.clear();

    // 强制垃圾回收（如果支持）
    try {
      // @ts-ignore
      if (window.gc) {
        // @ts-ignore
        window.gc();
        // 调试日志已移除: console.log(`🗑️ [Memory] 强制垃圾回收完成`);
      }
    } catch (error) {
      logMemoryManager(`ℹ️ [Memory] 垃圾回收不可用`);
    }
  }
}

/**
 * 图片缓存实例
 * 使用SmartCache类管理图片资源的内存缓存
 */
export const imageCache = new SmartCache({
  maxSize: 200,
  maxAge: 30 * 60 * 1000, // 30分钟
  maxMemory: 100 * 1024 * 1024, // 100MB
  cleanupInterval: 5 * 60 * 1000 // 5分钟
});

// 启动内存监控
export const memoryMonitor = MemoryMonitor.getInstance();

// 在开发环境下启动监控
if (process.env.NODE_ENV === 'development') {
  memoryMonitor.startMonitoring(60000); // 每分钟监控一次
}
