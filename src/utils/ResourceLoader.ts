/**
 * 统一资源加载器
 * 
 * 为图片、音频等资源提供统一的加载策略
 * 
 * @author dedenlabs
 * @date 2025-08-02
 */

import { cdnManager } from './CDNManager';
import { 
  ResourceLoadingConfig, 
  getImageLoadingConfig, 
  getAudioLoadingConfig,
  getResourceLoadingConfig 
} from '../config/ResourceLoadingConfig';
import { getLogger } from './Logger';
import { getCDNConfig } from '../config/ProjectConfig';

const logResourceLoader = getLogger('ResourceLoader');

/**
 * 资源加载结果
 */
export interface ResourceLoadResult {
  /** 最终的资源URL */
  url: string;
  /** 是否成功 */
  success: boolean;
  /** 使用的CDN索引 */
  cdnIndex?: number;
  /** 错误信息 */
  error?: string;
  /** 加载耗时(毫秒) */
  loadTime: number;
}

/**
 * 统一资源加载器类
 */
export class ResourceLoader {
  /**
   * 加载图片资源
   */
  static async loadImage(src: string, config?: Partial<ResourceLoadingConfig>): Promise<ResourceLoadResult> {
    const startTime = performance.now();
    const finalConfig = { ...getImageLoadingConfig(), ...config };
    
    logResourceLoader(`🖼️ 开始加载图片: ${src}`);
    
    try {
      const result = await this.loadResource(src, finalConfig, 'image');
      const loadTime = performance.now() - startTime;
      
      // 记录CDN统计信息
      this.recordCDNStatistics(result.url, true, loadTime);
      
      logResourceLoader(`✅ 图片加载成功: ${result.url} (耗时: ${loadTime.toFixed(2)}ms)`);
      
      return {
        ...result,
        loadTime
      };
    } catch (error) {
      const loadTime = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // 记录CDN失败统计
      this.recordCDNStatistics(src, false, loadTime);
      
      logResourceLoader.extend('error')(`❌ 图片加载失败: ${src} (耗时: ${loadTime.toFixed(2)}ms)`, error);
      
      return {
        url: src,
        success: false,
        error: errorMessage,
        loadTime
      };
    }
  }

  /**
   * 加载音频资源
   */
  static async loadAudio(src: string, config?: Partial<ResourceLoadingConfig>): Promise<ResourceLoadResult> {
    const startTime = performance.now();
    const finalConfig = { ...getAudioLoadingConfig(), ...config };
    
    logResourceLoader(`🎵 开始加载音频: ${src}`);
    
    try {
      const result = await this.loadResource(src, finalConfig, 'audio');
      const loadTime = performance.now() - startTime;
      
      // 记录CDN统计信息
      this.recordCDNStatistics(result.url, true, loadTime);
      
      logResourceLoader(`✅ 音频加载成功: ${result.url} (耗时: ${loadTime.toFixed(2)}ms)`);
      
      return {
        ...result,
        loadTime
      };
    } catch (error) {
      const loadTime = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // 记录CDN失败统计
      this.recordCDNStatistics(src, false, loadTime);
      
      logResourceLoader.extend('error')(`❌ 音频加载失败: ${src} (耗时: ${loadTime.toFixed(2)}ms)`, error);
      
      return {
        url: src,
        success: false,
        error: errorMessage,
        loadTime
      };
    }
  }

  /**
   * 加载通用资源
   */
  static async loadResource(
    src: string, 
    config: ResourceLoadingConfig,
    type: 'image' | 'audio' | 'general' = 'general'
  ): Promise<ResourceLoadResult> {
    const startTime = performance.now();
    
    try {
      // 如果启用智能选择，使用CDN管理器
      if (config.useSmartSelection) {
        const resourceUrl = await cdnManager.getResourceUrl(src, {
          enableFallback: config.enableCDNFallback,
          localBasePath: '',
          cacheUrls: true
        });
        
        // 验证资源是否可访问
        const isAccessible = await this.validateResourceAccess(resourceUrl, config.timeoutMs, type);
        
        if (isAccessible) {
          return {
            url: resourceUrl,
            success: true,
            loadTime: performance.now() - startTime
          };
        }
        
        // 如果CDN资源不可访问且启用了回退，尝试本地资源
        if (config.enableCDNFallback) {
          const localUrl = cdnManager.extractResourcePath(src);
          if (localUrl && localUrl !== src) {
            const isLocalAccessible = await this.validateResourceAccess(localUrl, config.timeoutMs, type);
            if (isLocalAccessible) {
              return {
                url: localUrl,
                success: true,
                loadTime: performance.now() - startTime
              };
            }
          }
        }
      }
      
      // 降级到原始URL
      const isAccessible = await this.validateResourceAccess(src, config.timeoutMs, type);
      
      if (isAccessible) {
        return {
          url: src,
          success: true,
          loadTime: performance.now() - startTime
        };
      }
      
      // 如果原始URL也不可访问，尝试构建本地URL
      if (config.enableCDNFallback) {
        const localUrl = cdnManager.extractResourcePath(src);
        if (localUrl && localUrl !== src) {
          const isLocalAccessible = await this.validateResourceAccess(localUrl, config.timeoutMs, type);
          if (isLocalAccessible) {
            return {
              url: localUrl,
              success: true,
              loadTime: performance.now() - startTime
            };
          }
        }
      }
      
      throw new Error(`Resource not accessible: ${src}`);
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * 验证资源是否可访问
   */
  private static async validateResourceAccess(
    url: string, 
    timeoutMs: number,
    type: 'image' | 'audio' | 'general'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, timeoutMs);

      try {
        if (type === 'image') {
          // 图片验证
          const img = new Image();
          img.onload = () => {
            clearTimeout(timeout);
            resolve(true);
          };
          img.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };
          img.src = url;
        } else if (type === 'audio') {
          // 音频验证
          const audio = new Audio();
          audio.oncanplaythrough = () => {
            clearTimeout(timeout);
            resolve(true);
          };
          audio.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };
          audio.src = url;
        } else {
          // 通用验证 - 使用fetch
          fetch(url, { method: 'HEAD' })
            .then(response => {
              clearTimeout(timeout);
              resolve(response.ok);
            })
            .catch(() => {
              clearTimeout(timeout);
              resolve(false);
            });
        }
      } catch (error) {
        clearTimeout(timeout);
        resolve(false);
      }
    });
  }

  /**
   * 批量加载资源
   */
  static async loadResources(
    sources: string[],
    type: 'image' | 'audio' | 'general' = 'general',
    config?: Partial<ResourceLoadingConfig>
  ): Promise<ResourceLoadResult[]> {
    const loadFunction = type === 'image' ? this.loadImage : 
                       type === 'audio' ? this.loadAudio : 
                       (src: string) => this.loadResource(src, { ...getResourceLoadingConfig(), ...config });

    const results = await Promise.allSettled(
      sources.map(src => loadFunction(src, config))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          url: sources[index],
          success: false,
          error: result.reason?.message || 'Unknown error',
          loadTime: 0
        };
      }
    });
  }

  /**
   * 预加载资源
   */
  static async preloadResources(
    sources: string[],
    type: 'image' | 'audio' | 'general' = 'general',
    config?: Partial<ResourceLoadingConfig>
  ): Promise<void> {
    logResourceLoader(`🚀 开始预加载 ${sources.length} 个${type}资源`);
    
    const results = await this.loadResources(sources, type, config);
    const successCount = results.filter(r => r.success).length;
    
    logResourceLoader(`✅ 预加载完成: ${successCount}/${sources.length} 个资源成功`);
  }


  /**
   * 记录CDN统计信息
   * Record CDN statistics
   */
  private static recordCDNStatistics(url: string, success: boolean, loadTime: number): void {
    try {
      // 从URL中提取CDN基础URL
      const cdnUrl = this.extractCDNBaseUrl(url);
      if (!cdnUrl) return;

      // 调用CDNManager的统计方法
      // 注意：这里使用动态导入避免循环依赖
      import('./CDNManager').then(({ cdnManager }) => {
        // 使用私有方法记录统计
        (cdnManager as any).recordCDNStats?.(cdnUrl, success, loadTime);
      }).catch(error => {
        // 静默处理错误
        logResourceLoader.extend('warn')('[ResourceLoader] Failed to record CDN stats:', error);
      });
    } catch (error) {
      // 静默处理错误
      logResourceLoader.extend('warn')('[ResourceLoader] Error recording CDN stats:', error);
    }
  }

  /**
   * 从URL中提取CDN基础URL
   * Extract CDN base URL from URL
   */
  private static extractCDNBaseUrl(url: string): string | null {
    try {
      const cdnConfig = getCDNConfig();
      
      // 检查URL是否包含任何CDN基础URL
      for (const baseUrl of cdnConfig.baseUrls) {
        if (url.includes(baseUrl)) {
          return baseUrl;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 获取加载统计信息
   */
  static getLoadingStats(): {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLoadTime: number;
  } {
    // 这里可以实现加载统计逻辑
    // 暂时返回模拟数据
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLoadTime: 0
    };
  }
}

/**
 * 便捷的资源加载函数
 */

/**
 * 加载图片
 */
export async function loadImage(src: string, config?: Partial<ResourceLoadingConfig>): Promise<string> {
  const result = await ResourceLoader.loadImage(src, config);
  if (result.success) {
    return result.url;
  }
  throw new Error(result.error || 'Image loading failed');
}

/**
 * 加载音频
 */
export async function loadAudio(src: string, config?: Partial<ResourceLoadingConfig>): Promise<string> {
  const result = await ResourceLoader.loadAudio(src, config);
  if (result.success) {
    return result.url;
  }
  throw new Error(result.error || 'Audio loading failed');
}

/**
 * 预加载图片
 */
export async function preloadImages(sources: string[], config?: Partial<ResourceLoadingConfig>): Promise<void> {
  await ResourceLoader.preloadResources(sources, 'image', config);
}

/**
 * 预加载音频
 */
export async function preloadAudios(sources: string[], config?: Partial<ResourceLoadingConfig>): Promise<void> {
  await ResourceLoader.preloadResources(sources, 'audio', config);
}
