/**
 * 预加载管理器 - 统一管理CDN依赖和无关的预加载逻辑
 * Preload Manager - Unified management of CDN-dependent and independent preloading logic
 * 
 * 功能特性：
 * 1. 分离CDN依赖和无关的预加载逻辑
 * 2. 确保CDN依赖的预加载等待CDN测试完成
 * 3. 提供预加载状态管理和监控
 * 4. 优化资源加载性能
 * 
 * @author dedenlabs
 * @date 2025-08-04
 */

import { getLogger } from './Logger';
import { getProjectConfig } from '../config/ProjectConfig';
import { cdnManager } from './CDNManager';
import { libraryPreloader } from './LibraryPreloader';
import { fontLoader } from '../config/FontConfig';
import { preloadCommonIcons } from './IconOptimizer';
import { getAllAudioConfigs } from '../config/AudioConfig';

const debugPreloadManager = getLogger('preload-manager');

/**
 * 预加载状态接口
 */
export interface PreloadingStatus {
  /** CDN无关预加载是否完成 */
  cdnIndependent: boolean;
  /** CDN依赖预加载是否完成 */
  cdnDependent: boolean;
  /** 整体预加载是否完成 */
  overall: boolean;
  /** 预加载开始时间 */
  startTime?: number;
  /** CDN无关预加载完成时间 */
  cdnIndependentTime?: number;
  /** CDN依赖预加载完成时间 */
  cdnDependentTime?: number;
}

/**
 * 预加载统计信息
 */
export interface PreloadingStats {
  /** 总预加载任务数 */
  totalTasks: number;
  /** 成功任务数 */
  successfulTasks: number;
  /** 失败任务数 */
  failedTasks: number;
  /** CDN无关任务数 */
  cdnIndependentTasks: number;
  /** CDN依赖任务数 */
  cdnDependentTasks: number;
  /** 总耗时（毫秒） */
  totalTime: number;
}

/**
 * 预加载管理器类
 */
export class PreloadManager {
  private static instance: PreloadManager;
  private status: PreloadingStatus = {
    cdnIndependent: false,
    cdnDependent: false,
    overall: false
  };
  private stats: PreloadingStats = {
    totalTasks: 0,
    successfulTasks: 0,
    failedTasks: 0,
    cdnIndependentTasks: 0,
    cdnDependentTasks: 0,
    totalTime: 0
  };

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): PreloadManager {
    if (!PreloadManager.instance) {
      PreloadManager.instance = new PreloadManager();
    }
    return PreloadManager.instance;
  }

  /**
   * 开始预加载流程
   */
  public async startPreloading(): Promise<void> {
    debugPreloadManager('🚀 开始预加载流程');
    this.status.startTime = Date.now();

    try {
      // 第一阶段：执行CDN无关的预加载
      await this.executeCDNIndependentPreloading();

      // 第二阶段：等待CDN准备就绪后执行CDN依赖的预加载
      if (cdnManager.isReady()) {
        await this.executeCDNDependentPreloading();
      } else {
        debugPreloadManager('⏳ CDN未准备就绪，等待CDN初始化完成...');
        // 可以选择等待CDN或跳过CDN依赖的预加载
        this.waitForCDNAndPreload();
      }

      this.status.overall = this.status.cdnIndependent && this.status.cdnDependent;
      this.stats.totalTime = Date.now() - (this.status.startTime || 0);

      debugPreloadManager('✅ 预加载流程完成', {
        status: this.status,
        stats: this.stats
      });

    } catch (error) {
      debugPreloadManager.extend('error')('❌ 预加载流程失败:', error);
      throw error;
    }
  }

  /**
   * 执行CDN无关的预加载
   */
  public async executeCDNIndependentPreloading(): Promise<void> {
    debugPreloadManager('📦 开始CDN无关预加载');
    const startTime = Date.now();

    const tasks: Promise<void>[] = [];
    let taskCount = 0;

    try {
      // 1. 第三方库预加载（npm包，不依赖CDN）
      debugPreloadManager('📚 启动库预加载');
      tasks.push(
        libraryPreloader.startPreloading().catch(error => {
          debugPreloadManager.extend('warn')('库预加载失败:', error);
          this.stats.failedTasks++;
        })
      );
      taskCount++;

      // 2. 本地图标预加载
      const config = getProjectConfig();
      if (config.performance.enablePreloading) {
        debugPreloadManager('🎨 启动图标预加载');
        tasks.push(
          preloadCommonIcons().catch(error => {
            debugPreloadManager.extend('warn')('图标预加载失败:', error);
            this.stats.failedTasks++;
          })
        );
        taskCount++;
      }

      // 等待所有CDN无关的预加载完成
      const results = await Promise.allSettled(tasks);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      this.stats.cdnIndependentTasks = taskCount;
      this.stats.successfulTasks += successCount;
      this.stats.totalTasks += taskCount;

      this.status.cdnIndependent = true;
      this.status.cdnIndependentTime = Date.now();

      debugPreloadManager(`✅ CDN无关预加载完成: ${successCount}/${taskCount} 个任务成功`);

    } catch (error) {
      debugPreloadManager.extend('error')('❌ CDN无关预加载失败:', error);
      throw error;
    }
  }

  /**
   * 执行CDN依赖的预加载
   */
  public async executeCDNDependentPreloading(): Promise<void> {
    if (!cdnManager.isReady()) {
      throw new Error('CDN Manager not ready for dependent preloading');
    }

    debugPreloadManager('🌐 开始CDN依赖预加载');
    const startTime = Date.now();

    const tasks: Promise<void>[] = [];
    let taskCount = 0;

    try {
      const config = getProjectConfig();

      // 1. 静态资源预加载
      if (config.performance.enablePreloading && config.performance.preloadResources.length > 0) {
        debugPreloadManager(`📄 启动静态资源预加载 (${config.performance.preloadResources.length}个)`);
        tasks.push(
          cdnManager.preloadResources(config.performance.preloadResources).catch(error => {
            debugPreloadManager.extend('warn')('静态资源预加载失败:', error);
            this.stats.failedTasks++;
          })
        );
        taskCount++;
      }

      // 2. 关键字体预加载
      debugPreloadManager('🔤 启动字体预加载');
      tasks.push(
        fontLoader.preloadCriticalFonts().catch(error => {
          debugPreloadManager.extend('warn')('字体预加载失败:', error);
          this.stats.failedTasks++;
        })
      );
      taskCount++;

      // 3. 远程音频预加载
      const remoteAudioConfigs = getAllAudioConfigs().filter(config =>
        config.preload && config.src && this.isRemoteResource(config.src)
      );
      if (remoteAudioConfigs.length > 0) {
        debugPreloadManager(`🎵 启动远程音频预加载 (${remoteAudioConfigs.length}个)`);
        tasks.push(
          this.preloadRemoteAudios(remoteAudioConfigs).catch(error => {
            debugPreloadManager.extend('warn')('远程音频预加载失败:', error);
            this.stats.failedTasks++;
          })
        );
        taskCount++;
      }

      // 等待所有CDN依赖的预加载完成
      const results = await Promise.allSettled(tasks);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      this.stats.cdnDependentTasks = taskCount;
      this.stats.successfulTasks += successCount;
      this.stats.totalTasks += taskCount;

      this.status.cdnDependent = true;
      this.status.cdnDependentTime = Date.now();

      debugPreloadManager(`✅ CDN依赖预加载完成: ${successCount}/${taskCount} 个任务成功`);

    } catch (error) {
      debugPreloadManager.extend('error')('❌ CDN依赖预加载失败:', error);
      throw error;
    }
  }

  /**
   * 等待CDN准备就绪并执行CDN依赖的预加载
   */
  private async waitForCDNAndPreload(): Promise<void> {
    const maxWaitTime = 5000; // 最大等待5秒
    const checkInterval = 100; // 每100ms检查一次
    let waitTime = 0;

    const checkCDNReady = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        const check = () => {
          if (cdnManager.isReady()) {
            debugPreloadManager('✅ CDN准备就绪，开始CDN依赖预加载');
            this.executeCDNDependentPreloading().then(resolve).catch(reject);
          } else if (waitTime >= maxWaitTime) {
            debugPreloadManager.extend('warn')('⏰ CDN等待超时，跳过CDN依赖预加载');
            this.status.cdnDependent = true; // 标记为完成，避免阻塞
            resolve();
          } else {
            waitTime += checkInterval;
            setTimeout(check, checkInterval);
          }
        };
        check();
      });
    };

    await checkCDNReady();
  }

  /**
   * 检查资源是否为远程资源
   */
  private isRemoteResource(src: string | undefined): boolean {
    if (!src || typeof src !== 'string') {
      return false;
    }
    return src.startsWith('http') || src.startsWith('//');
  }

  /**
   * 预加载本地音频
   */
  private async preloadLocalAudios(audioConfigs: any[]): Promise<void> {
    // 这里可以实现本地音频预加载逻辑
    // 暂时使用简单的Promise.resolve()
    debugPreloadManager(`预加载 ${audioConfigs.length} 个本地音频文件`);
    return Promise.resolve();
  }

  /**
   * 预加载远程音频
   */
  private async preloadRemoteAudios(audioConfigs: any[]): Promise<void> {
    // 这里可以实现远程音频预加载逻辑
    // 暂时使用简单的Promise.resolve()
    debugPreloadManager(`预加载 ${audioConfigs.length} 个远程音频文件`);
    return Promise.resolve();
  }

  /**
   * 获取预加载状态
   */
  public getPreloadingStatus(): PreloadingStatus {
    return { ...this.status };
  }

  /**
   * 获取预加载统计信息
   */
  public getPreloadingStats(): PreloadingStats {
    return { ...this.stats };
  }

  /**
   * 重置预加载状态
   */
  public reset(): void {
    this.status = {
      cdnIndependent: false,
      cdnDependent: false,
      overall: false
    };
    this.stats = {
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      cdnIndependentTasks: 0,
      cdnDependentTasks: 0,
      totalTime: 0
    };
    debugPreloadManager('🔄 预加载状态已重置');
  }

  /**
   * 检查是否所有预加载都已完成
   */
  public isPreloadingComplete(): boolean {
    return this.status.overall;
  }
}

// 导出单例实例
export const preloadManager = PreloadManager.getInstance();
