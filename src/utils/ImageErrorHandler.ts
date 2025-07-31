/**
 * 图片错误处理器
 * 
 * 全局监听图片加载错误，自动进行CDN切换
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { getCDNConfig } from '../config/ProjectConfig';
import { cdnManager } from './CDNManager';
import { getLogger } from './Logger';
import { getCurrentLanguage, getTranslations } from '../i18n';
import { joinURL, removeBaseURL } from './URLPathJoiner';

const logImageError = getLogger('ImageErrorHandler');

interface ImageRetryInfo {
  element: HTMLImageElement;
  originalSrc: string;
  retryCount: number;
  cdnIndex: number;
  maxRetries: number;
}

/**
 * 图片错误处理器类
 */
class ImageErrorHandler {
  private retryMap = new Map<HTMLImageElement, ImageRetryInfo>();
  private isInitialized = false;
  private maxRetries = 3;

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
    // 使用事件委托监听所有图片错误
    document.addEventListener('error', this.handleImageError.bind(this), true);

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
   * 为图片元素设置错误处理
   */
  private setupImageErrorHandling(img: HTMLImageElement): void {
    // 跳过已经处理过的图片
    if (this.retryMap.has(img)) {
      return;
    }

    // 跳过SmartImage组件（避免重复处理）
    if (img.closest('.smart-image-loading, .smart-image-error')) {
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
      maxRetries: this.maxRetries
    });
  }

  /**
   * 处理图片错误事件
   */
  private handleImageError(event: Event): void {
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

    // 尝试CDN切换
    this.tryNextCDN(retryInfo);
  }

  /**
   * 尝试下一个CDN
   */
  private tryNextCDN(retryInfo: ImageRetryInfo): void {
    const { element, originalSrc, retryCount, cdnIndex } = retryInfo;
    const cdnConfig = getCDNConfig();

    // 如果CDN未启用，直接返回
    if (!cdnConfig.enabled || cdnConfig.baseUrls.length === 0) {
      this.handleFinalFailure(retryInfo);
      return;
    }

    // 尝试下一个CDN
    if (cdnIndex < cdnConfig.baseUrls.length - 1) {
      const nextCdnIndex = cdnIndex + 1;
      const nextCdnUrl = this.buildCDNUrl(cdnConfig.baseUrls[nextCdnIndex], originalSrc);

      retryInfo.cdnIndex = nextCdnIndex;
      element.src = nextCdnUrl;

      logImageError(`尝试CDN ${nextCdnIndex + 1}/${cdnConfig.baseUrls.length}: ${nextCdnUrl}`);
    } else if (retryCount < retryInfo.maxRetries) {
      // 重试第一个CDN
      const nextRetryCount = retryCount + 1;
      retryInfo.retryCount = nextRetryCount;
      retryInfo.cdnIndex = 0;

      setTimeout(() => {
        const firstCdnUrl = this.buildCDNUrl(cdnConfig.baseUrls[0], originalSrc);
        element.src = firstCdnUrl;
        logImageError(`重试 ${nextRetryCount}/${retryInfo.maxRetries}: ${firstCdnUrl}`);
      }, 1000 * nextRetryCount);
    } else {
      // 尝试本地回退
      this.tryLocalFallback(retryInfo);
    }
  }

  /**
   * 尝试本地回退
   */
  private tryLocalFallback(retryInfo: ImageRetryInfo): void {
    const { element, originalSrc } = retryInfo;

    try {
      // 使用CDN管理器的本地回退逻辑
      const localUrl = cdnManager.getResourceUrl(originalSrc, {
        enableFallback: true,
        cacheUrls: false
      });

      if (localUrl !== element.src) {
        element.src = localUrl;
        logImageError(`尝试本地回退: ${localUrl}`);
        return;
      }
    } catch (error) {
      logImageError.extend('error')('本地回退失败:', error);
    }

    // 最终失败
    this.handleFinalFailure(retryInfo);
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
   * 构建CDN URL
   */
  private buildCDNUrl(baseUrl: string, resourcePath: string): string {
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

    // 处理baseUrl，移除末尾的/，如果resourcePath以/开头，则移除
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    cleanResourcePath = cleanResourcePath.startsWith('/') ? cleanResourcePath.slice(1) : cleanResourcePath;

    return `${cleanBaseUrl}/${cleanResourcePath}`;
  }

  /**
   * 销毁处理器
   */
  public destroy(): void {
    if (!this.isInitialized) {
      return;
    }

    document.removeEventListener('error', this.handleImageError.bind(this), true);
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
