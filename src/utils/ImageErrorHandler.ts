/**
 * 图片错误处理器
 * 
 * 全局监听图片加载错误，自动进行CDN切换
 * 
 * @author dedenlabs
 * @date 2025-07-30
 */

import { getCDNConfig } from '../config/ProjectConfig';
import { cdnManager } from './CDNManager';
import { getLogger } from './Logger';
import { getCurrentLanguage, getTranslations } from '../i18n';
import { joinURL, removeBaseURL } from './URLPathJoiner';
import { imageCache } from './MemoryManager';
import { ResourceLoader, loadImage } from './ResourceLoader';
import { getImageLoadingConfig } from '../config/ResourceLoadingConfig';

const logImageError = getLogger('ImageErrorHandler');

interface ImageRetryInfo {
  element: HTMLImageElement;
  originalSrc: string;
  retryCount: number;
  cdnIndex: number;
  maxRetries: number;
  useResourceLoader: boolean; // 是否使用ResourceLoader
  resourceLoaderFailed: boolean; // ResourceLoader是否已失败
}

/**
 * 图片错误处理器类
 */
class ImageErrorHandler {
  private retryMap = new Map<HTMLImageElement, ImageRetryInfo>();
  private isInitialized = false;
  private maxRetries = 0;
  private errorHandler: ((event: Event) => void) | null = null;

  /**
   * 初始化图片错误处理器
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    this.setupGlobalErrorHandler();
    this.setupMutationObserver();
    this.isInitialized = true;

    const t = getTranslations(getCurrentLanguage());
    logImageError(t.common.imageErrorHandlerInitialized);
  }

  /**
   * 设置全局错误处理器
   */
  private setupGlobalErrorHandler(): void {
    // 创建错误处理函数并保存引用
    this.errorHandler = (event) => {
      // 异步处理错误，避免阻塞主线程
      this.handleImageError(event).catch((error) => {
        logImageError.extend('error')('异步错误处理失败:', error);
      });
    };

    // 使用事件委托监听所有图片错误
    document.addEventListener('error', this.errorHandler, true);

    // 监听已存在的图片
    this.processExistingImages();
  }

  /**
   * 设置变化观察器，监听新添加的图片
   */
  private setupMutationObserver(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // 检查是否是图片元素
            if (element.tagName === 'IMG') {
              this.setupImageErrorHandling(element as HTMLImageElement);
            }

            // 检查子元素中的图片
            const images = element.querySelectorAll('img');
            images.forEach((img) => {
              this.setupImageErrorHandling(img);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 处理已存在的图片
   */
  private processExistingImages(): void {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      this.setupImageErrorHandling(img);
    });
  }

  /**
   * 检测是否为SmartImage组件的img元素
   * 使用多重检测机制，确保在各种情况下都能正确识别
   */
  private isSmartImageElement(img: HTMLImageElement): boolean {
    try {
      // 方法1: 检查data属性 (最可靠)
      if (img.dataset.smartImage === 'true') {
        return true;
      }
      // 方法2: 检查CSS类名 (向后兼容)
      if (img.closest('.smart-image-loading, .smart-image-error')) {
        return true;
      }
      return false;
    } catch (error) {
      // 如果检测过程中出现错误，默认认为不是SmartImage
      // 这可以防止检测逻辑本身导致的问题
      logImageError.extend('warn')('SmartImage检测失败:', error);
      return false;
    }
  }

  /**
   * 为图片元素设置错误处理
   */
  private setupImageErrorHandling(img: HTMLImageElement): void {
    // 跳过已经处理过的图片
    if (this.retryMap.has(img)) {
      return;
    }

    // 跳过SmartImage组件（避免重复处理）- 使用多重检测机制
    if (this.isSmartImageElement(img)) {
      return;
    }

    // 跳过data:和blob:协议的图片
    if (img.src.startsWith('data:') || img.src.startsWith('blob:')) {
      return;
    }

    // 初始化重试信息
    this.retryMap.set(img, {
      element: img,
      originalSrc: img.src,
      retryCount: 0,
      cdnIndex: 0,
      maxRetries: this.maxRetries,
      useResourceLoader: true, // 优先使用ResourceLoader
      resourceLoaderFailed: false
    });

    // 添加图片加载成功监听器
    img.addEventListener('load', this.handleImageLoad.bind(this, img));
  }

  /**
   * 处理图片加载成功事件
   */
  private handleImageLoad(img: HTMLImageElement): void {
    // 缓存成功加载的图片
    if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('blob:')) {
      try {
        // 获取图片数据（这里缓存URL信息，实际图片数据由浏览器缓存）
        const imageData = {
          url: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          timestamp: Date.now()
        };

        const cacheKey = cdnManager.getImageCacheKey(img.src);
        imageCache.set(cacheKey, imageData);
        logImageError(`图片加载成功并缓存: ${img.src}`);
      } catch (error) {
        logImageError.extend('warn')('缓存图片失败:', error);
      }
    }

    // 清理重试信息
    this.retryMap.delete(img);
  }

  /**
   * 处理图片错误事件 - 支持异步ResourceLoader
   */
  private async handleImageError(event: Event): Promise<void> {
    const target = event.target as HTMLImageElement;

    // 只处理img标签
    if (target.tagName !== 'IMG') {
      return;
    }

    const retryInfo = this.retryMap.get(target);
    if (!retryInfo) {
      return;
    }

    const t = getTranslations(getCurrentLanguage());
    logImageError.extend('warn')(`${t.common.imageLoadFailed}: ${target.src}`);

    // 从缓存中删除失败的图片
    const cacheKey = cdnManager.getImageCacheKey(target.src);
    imageCache.delete(cacheKey);

    // 尝试CDN切换（异步）
    try {
      await this.tryNextCDN(retryInfo);
    } catch (error) {
      logImageError.extend('error')('处理图片错误时发生异常:', error);
      this.handleFinalFailure(retryInfo);
    }
  }

  /**
   * 尝试下一个CDN - 使用ResourceLoader
   */
  private async tryNextCDN(retryInfo: ImageRetryInfo): Promise<void> {
    const { element, originalSrc, retryCount, useResourceLoader, resourceLoaderFailed } = retryInfo;
    const cdnConfig = getCDNConfig();

    // 优先使用ResourceLoader统一处理（内置CDN切换和回退逻辑）
    if (useResourceLoader && !resourceLoaderFailed) {
      logImageError(`🚀 尝试使用ResourceLoader加载: ${originalSrc}`);

      const imageConfig = getImageLoadingConfig();
      const customConfig = {
        ...imageConfig,
        enableCDNFallback: true,
        maxRetries: cdnConfig.baseUrls.length, // 允许ResourceLoader尝试所有CDN
        useSmartSelection: true
      };

      const result = await ResourceLoader.loadImage(originalSrc, customConfig);

      if (result.success) {
        element.src = result.url;
        logImageError(`✅ ResourceLoader加载成功: ${result.url} (耗时: ${result.loadTime?.toFixed(2)}ms)`);
        return;
      } else {
        logImageError.extend('warn')(`⚠️ ResourceLoader所有CDN尝试均失败: ${result.error}`);
        retryInfo.resourceLoaderFailed = true;
        retryInfo.useResourceLoader = false;

      }
    }
    await this.handleFinalFailure(retryInfo);
  }

  /**
   * 处理最终失败
   */
  private handleFinalFailure(retryInfo: ImageRetryInfo): void {
    const { element, originalSrc } = retryInfo;

    const t = getTranslations(getCurrentLanguage());
    logImageError.extend('error')(t.common.imageFinalLoadFailed + `: ${originalSrc}`);

    // 创建错误占位符
    const placeholder = document.createElement('div');
    placeholder.className = 'image-error-placeholder';
    placeholder.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 100px;
      min-width: 150px;
      background-color: #f5f5f5;
      color: #999;
      font-size: 14px;
      border: 1px dashed #ddd;
      border-radius: 4px;
    `;
    placeholder.textContent = t.common.imageLoadFailed;

    // 复制原始图片的样式
    if (element.style.width) placeholder.style.width = element.style.width;
    if (element.style.height) placeholder.style.height = element.style.height;
    if (element.className) placeholder.className += ` ${element.className}`;

    // 替换图片元素
    element.parentNode?.replaceChild(placeholder, element);

    // 清理重试信息
    this.retryMap.delete(element);
  }

  /**
   * 销毁处理器
   */
  public destroy(): void {
    if (!this.isInitialized) {
      return;
    }

    // 移除事件监听器
    if (this.errorHandler) {
      document.removeEventListener('error', this.errorHandler, true);
      this.errorHandler = null;
    }

    this.retryMap.clear();
    this.isInitialized = false;

    const t = getTranslations(getCurrentLanguage());
    logImageError(t.common.imageErrorHandlerDestroyed);
  }

  /**
   * 设置最大重试次数
   */
  public setMaxRetries(maxRetries: number): void {
    this.maxRetries = Math.max(0, maxRetries);
  }

  /**
   * 获取重试统计信息
   */
  public getRetryStats(): { total: number; failed: number; retrying: number } {
    const total = this.retryMap.size;
    let failed = 0;
    let retrying = 0;

    this.retryMap.forEach((info) => {
      if (info.retryCount >= info.maxRetries) {
        failed++;
      } else {
        retrying++;
      }
    });

    return { total, failed, retrying };
  }
}

// 创建全局实例
export const imageErrorHandler = new ImageErrorHandler();

// 自动初始化
if (typeof window !== 'undefined') {
  // 等待DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      imageErrorHandler.initialize();
    });
  } else {
    imageErrorHandler.initialize();
  }
}

export default imageErrorHandler;
