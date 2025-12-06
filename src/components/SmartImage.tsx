/**
 * 智能图片组件 - 支持CDN自动切换
 * 
 * 当图片加载失败时，自动尝试其他CDN源
 * 
 * @author dedenlabs
 * @date 2025-07-30
 */

import React, { useState, useCallback, useEffect } from 'react';
import { cdnManager } from '../utils/CDNManager';
import { isDevelopment } from '../config/ProjectConfig';
import { getLogger } from '../utils/Logger';
import { useI18n } from '../i18n';
import { useSafeTheme } from './skill/SkillRenderer';
import { imageCache } from '../utils/MemoryManager';
import { ResourceLoader } from '../utils/ResourceLoader';
import { getImageLoadingConfig } from '../config/ResourceLoadingConfig';

const logSmartImage = getLogger('SmartImage');

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 图片资源路径 */
  src: string;
  /** 替代文本 */
  alt: string;
  /** 是否启用CDN自动切换，默认true */
  enableCDNFallback?: boolean;
  /** 最大重试次数，默认3次 */
  maxRetries?: number;
  /** 加载失败时的占位符 */
  fallbackContent?: React.ReactNode;
  /** 加载中的占位符 */
  loadingContent?: React.ReactNode;
  /** 是否显示默认样式，默认true */
  showDefaultStyles?: boolean;
  /** 是否显示加载状态，默认true */
  showLoadingState?: boolean;
  /** 是否显示错误状态，默认true */
  showErrorState?: boolean;
  /** 加载中的提示文本，默认使用i18n */
  loadingText?: string;
  /** 默认占位尺寸，当图片加载中时显示 */
  defaultSize?: {
    width?: string | number;
    height?: string | number;
  };
  /** 错误回调 */
  onError?: (error: Error) => void;
  /** 成功加载回调 */
  onLoad?: () => void;
}

/**
 * 智能图片组件
 * 
 * 特性：
 * 1. 自动CDN切换：当主CDN失败时，自动尝试其他CDN
 * 2. 本地回退：所有CDN都失败时，回退到本地资源
 * 3. 加载状态：显示加载中和错误状态
 * 4. 重试机制：支持配置重试次数
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  enableCDNFallback = true,
  maxRetries = 0,
  fallbackContent,
  loadingContent,
  showDefaultStyles = true,
  showLoadingState = true,
  showErrorState = true,
  loadingText,
  defaultSize,
  onError,
  onLoad,
  ...imgProps
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { t } = useI18n();
  const { isDark } = useSafeTheme();

  /**
   * 使用ResourceLoader加载图片URL - 简化版
   */
  const loadImageUrl = useCallback(async (resourcePath: string): Promise<string> => {
    logSmartImage(`loadImageUrl called: resourcePath=${resourcePath}, enableCDNFallback=${enableCDNFallback}`);

    try {
      // 使用ResourceLoader统一加载图片（内置CDN切换和回退逻辑）
      const imageConfig = getImageLoadingConfig();
      const customConfig = {
        ...imageConfig,
        enableCDNFallback: enableCDNFallback,
        maxRetries: maxRetries || 0,
        useSmartSelection: true
      };

      const result = await ResourceLoader.loadImage(resourcePath, customConfig);

      if (result.success) {
        logSmartImage(`✅ ResourceLoader加载成功: ${result.url} (耗时: ${result.loadTime?.toFixed(2)}ms)`);
        return result.url;
      } else {
        // ResourceLoader已经处理了所有回退逻辑，如果还是失败就返回原始路径
        logSmartImage.extend('warn')(`⚠️ ResourceLoader所有尝试均失败: ${result.error}`);
        return resourcePath; // 返回原始路径作为最后的尝试
      }
    } catch (error) {
      logSmartImage.extend('error')(`❌ ResourceLoader异常:`, error);
      return resourcePath; // 返回原始路径作为最后的尝试
    }
  }, [enableCDNFallback, maxRetries]);

  /**
   * 尝试加载图片 - 简化版使用ResourceLoader
   */
  const tryLoadImage = useCallback(async (resourcePath: string) => {
    setIsLoading(true);
    setHasError(false);

    logSmartImage(`🖼️ 开始加载图片: resourcePath=${resourcePath}, enableCDNFallback=${enableCDNFallback}`);

    try {
      // 检查缓存中是否已有该图片的成功记录
      let cacheKey = cdnManager.getImageCacheKey(resourcePath);
      const cachedImage = imageCache.get(cacheKey);

      let imageUrl: string;

      if (cachedImage && cachedImage.hasLoaded) {
        // 使用缓存的URL
        imageUrl = cachedImage.url;
        logSmartImage(`📦 使用缓存的图片: ${imageUrl} (缓存键: ${cacheKey})`);
      } else {
        // 使用ResourceLoader的智能加载（内置所有CDN切换和回退逻辑）
        imageUrl = await loadImageUrl(resourcePath);
        logSmartImage(`🚀 ResourceLoader加载完成: ${imageUrl}`);

        // 验证构建的URL是否有效
        if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
          logSmartImage.extend('error')(`❌ 构建的URL无效: ${imageUrl}, resourcePath: ${resourcePath}`);
          imageUrl = resourcePath; // 降级使用原始路径
        }

        // 更新缓存
        const imageData = {
          url: imageUrl,
          timestamp: Date.now(),
          hasLoaded: false,
          cdnIndex: 0, // ResourceLoader内部处理CDN选择
          retryCount: 0
        };

        const newCacheKey = cdnManager.getImageCacheKey(imageUrl);
        imageCache.set(newCacheKey, imageData);
      }

      logSmartImage(`✅ 最终设置的imageUrl: ${imageUrl}`);

      // 在设置currentSrc之前进行最终验证
      if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'undefined' || imageUrl === 'null') {
        logSmartImage.extend('error')(`❌ URL验证失败，拒绝设置: ${imageUrl}`);
        setIsLoading(false);
        setHasError(true);
        return;
      }

      logSmartImage(`🎯 URL验证通过，设置currentSrc: ${imageUrl}`);
      setIsLoading(false);
      setHasError(false);
      setCurrentSrc(imageUrl);
    } catch (error) {
      logSmartImage.extend('error')(`❌ 图片加载异常:`, error);
      setIsLoading(false);
      setHasError(true);
    }
  }, [enableCDNFallback, loadImageUrl]);

  /**
   * 处理图片加载成功 - 简化版
   */
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    logSmartImage(`handleImageLoad: ${currentSrc}`);
    // 缓存成功加载的图片
    if (currentSrc && !currentSrc.startsWith('data:') && !currentSrc.startsWith('blob:')) {
      try {
        const imageData = {
          url: currentSrc,
          timestamp: Date.now(),
          hasLoaded: true,
          cdnIndex: 0, // ResourceLoader内部处理CDN选择
          retryCount: 0
        };

        const cacheKey = cdnManager.getImageCacheKey(currentSrc);
        imageCache.set(cacheKey, imageData);
        logSmartImage(`图片加载成功并缓存: ${currentSrc}`);
      } catch (error) {
        logSmartImage.extend('warn')('缓存图片失败:', error);
      }
    }

    logSmartImage(`${t.common.imageLoadSuccess}: ${currentSrc}`);
    onLoad?.();
  }, [currentSrc, onLoad]);

  /**
   * 处理图片加载失败 - 简化版
   */
  const handleImageError = useCallback(() => {
    const error = new Error(`${t.common.imageLoadFailed}: ${currentSrc}`);
    logSmartImage.extend('warn')(`❌ 图片加载失败: ${currentSrc}, 重试次数: ${retryCount}`);

    // 从缓存中删除失败的图片
    const cacheKey = cdnManager.getImageCacheKey(currentSrc);
    if (imageCache.has(cacheKey) && !imageCache.has(cacheKey).hasLoaded) {
      imageCache.delete(cacheKey);
    }

    if (retryCount < maxRetries) {
      // 重试加载（ResourceLoader内部会处理CDN切换和回退）
      const nextRetryCount = retryCount + 1;
      setRetryCount(nextRetryCount);

      setTimeout(() => {
        tryLoadImage(src);
      }, 1000 * nextRetryCount); // 递增延迟
    } else {
      // 最终失败
      setIsLoading(false);
      setHasError(true);
      logSmartImage.extend('error')(`${t.common.imageFinalLoadFailed}: ${src}, 已尝试所有重试和回退方案`);
      onError?.(error);
    }
  }, [currentSrc, retryCount, maxRetries, src, tryLoadImage, onError]);

  /**
   * 初始化图片加载 - 简化版
   */
  useEffect(() => {
    if (src) {
      setRetryCount(0);
      logSmartImage(`🚀 初始化加载图片: ${src}`);

      // 延迟一点执行，确保组件完全初始化
      setTimeout(async () => {
        if (isDevelopment()) {
          setCurrentSrc(src);
        } else {
          await tryLoadImage(src);
        }
      }, 0);
    }
  }, [src, tryLoadImage]);

  logSmartImage(`实际加载的图片URL: ${currentSrc} isLoading: ${isLoading} showLoadingState: ${showLoadingState}`);


  // 加载中状态 
  if (isLoading) {
    if (showLoadingState) {
      // 如果有默认尺寸或者imgProps有尺寸，始终显示占位符
      // const hasDefaultSize = defaultSize?.width || defaultSize?.height || imgProps.width || imgProps.height;

      // if (!hasDefaultSize) {
      //   return null; // 没有默认尺寸时不显示占位符
      // }
      // 显示加载状态
      return (
        <div
          className="smart-image-loading"
          data-smart-image="true"
          data-smart-image-loading="true"
          data-smart-image-container="true"
          style={{
            display: 'inline-block',
            width: defaultSize?.width || imgProps.width || 'auto',
            height: defaultSize?.height || imgProps.height || 'auto',
            ...imgProps.style
          }}
        >
          {loadingContent || (
            showDefaultStyles ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minHeight: defaultSize?.height || imgProps.height || '100px',
                minWidth: defaultSize?.width || imgProps.width || '100px',
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                color: isDark ? '#ccc' : '#666',
                fontSize: '14px',
                borderRadius: '4px'
              }}>
                {loadingText != null ? loadingText : t.common.imageLoading}
              </div>
            ) : (
              // 不显示默认样式时，显示一个透明占位符保持布局
              <div style={{
                width: defaultSize?.width || imgProps.width || '20px',
                height: defaultSize?.height || imgProps.height || '20px',
                backgroundColor: 'transparent'
              }} />
            )
          )}
        </div>
      );
    }
  }

  // 错误状态
  if (hasError && showErrorState) {
    // 显示错误状态
    return (
      <div
        className="smart-image-error"
        data-smart-image="true"
        data-smart-image-error="true"
        data-smart-image-container="true"
        style={{
          display: 'inline-block',
          width: defaultSize?.width || imgProps.width || 'auto',
          height: defaultSize?.height || imgProps.height || 'auto',
          ...imgProps.style
        }}
      >
        {fallbackContent || (
          showDefaultStyles ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              minHeight: defaultSize?.height || imgProps.height || '100px',
              minWidth: defaultSize?.width || imgProps.width || '100px',
              backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
              color: isDark ? '#999' : '#999',
              fontSize: '14px',
              border: `1px dashed ${isDark ? '#555' : '#ddd'}`,
              borderRadius: '4px'
            }}>
              {t.common.imageLoadFailed}
            </div>
          ) : null
        )}
      </div>
    );
  }
  if (currentSrc == "") return null;
  // 正常显示图片
  return (
    <img
      {...imgProps}
      src={currentSrc}
      alt={alt}
      onLoad={handleImageLoad}
      onError={handleImageError}
      data-smart-image="true"
      data-retry-count={retryCount}
      style={{
        display: 'inline-block',  // 强制设置为inline-block
        verticalAlign: 'middle',  // 垂直对齐
        ...imgProps.style,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

/**
 * 高阶组件：将普通img标签转换为SmartImage
 */
export const withSmartImage = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    return <WrappedComponent {...props} />;
  };
};

export default SmartImage;
