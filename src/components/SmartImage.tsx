/**
 * 智能图片组件 - 支持CDN自动切换
 * 
 * 当图片加载失败时，自动尝试其他CDN源
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import React, { useState, useCallback, useEffect } from 'react';
import { cdnManager } from '../utils/CDNManager';
import { getCDNConfig } from '../config/ProjectConfig';
import { getLogger } from '../utils/Logger';
import { useI18n } from '../i18n';
import { useSafeTheme } from './skill/SkillRenderer';
import { removeBaseURL } from '../utils/URLPathJoiner';

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
  maxRetries = 3,
  fallbackContent,
  loadingContent,
  onError,
  onLoad,
  ...imgProps
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cdnIndex, setCdnIndex] = useState(0);
  const { t } = useI18n();
  const { isDark } = useSafeTheme();

  // 获取CDN配置
  const cdnConfig = getCDNConfig();
  const availableCDNs = enableCDNFallback ? cdnConfig.baseUrls : [];

  /**
   * 构建图片URL
   */
  const buildImageUrl = useCallback((resourcePath: string, cdnBaseUrl?: string): string => {
    if (!enableCDNFallback || !cdnBaseUrl) {
      // 使用CDN管理器获取最佳URL
      return cdnManager.getResourceUrl(resourcePath, {
        enableFallback: true,
        cacheUrls: false // 不缓存，允许重试
      });
    }

    // 移除基础路径，只保留相对路径
    const relativePath = removeBaseURL(resourcePath, cdnManager.getProjectBasePath());

    // 使用指定的CDN构建URL
    const cleanBaseUrl = cdnBaseUrl.endsWith('/') ? cdnBaseUrl.slice(0, -1) : cdnBaseUrl;
    const cleanResourcePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    return `${cleanBaseUrl}/${cleanResourcePath}`;
  }, [enableCDNFallback]);

  /**
   * 尝试加载图片
   */
  const tryLoadImage = useCallback((resourcePath: string, cdnIndex: number = 0) => {
    setIsLoading(true);
    setHasError(false);

    let imageUrl: string;

    if (enableCDNFallback && cdnIndex < availableCDNs.length) {
      // 尝试指定的CDN
      imageUrl = buildImageUrl(resourcePath, availableCDNs[cdnIndex]);
      logSmartImage(`尝试CDN ${cdnIndex + 1}/${availableCDNs.length}: ${availableCDNs[cdnIndex]}`);
    } else {
      // 使用CDN管理器的默认逻辑（包括本地回退）
      imageUrl = buildImageUrl(resourcePath);
      logSmartImage(`使用CDN管理器默认逻辑: ${imageUrl}`);
    }

    setCurrentSrc(imageUrl);
  }, [enableCDNFallback, availableCDNs, buildImageUrl]);

  /**
   * 处理图片加载成功
   */
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    logSmartImage(`${t.common.imageLoadSuccess}: ${currentSrc}`);
    onLoad?.();
  }, [currentSrc, onLoad]);

  /**
   * 处理图片加载失败
   */
  const handleImageError = useCallback(() => {
    const error = new Error(`${t.common.imageLoadFailed}: ${currentSrc}`);
    logSmartImage.extend('warn')(`${t.common.imageLoadFailed}: ${currentSrc}, 重试次数: ${retryCount}, CDN索引: ${cdnIndex}`);

    if (enableCDNFallback && cdnIndex < availableCDNs.length - 1) {
      // 尝试下一个CDN
      const nextCdnIndex = cdnIndex + 1;
      setCdnIndex(nextCdnIndex);
      tryLoadImage(src, nextCdnIndex);
    } else if (retryCount < maxRetries) {
      // 重试当前CDN或使用CDN管理器的回退逻辑
      const nextRetryCount = retryCount + 1;
      setRetryCount(nextRetryCount);
      
      setTimeout(() => {
        if (enableCDNFallback && availableCDNs.length > 0) {
          // 重置CDN索引，从第一个CDN重新开始
          setCdnIndex(0);
          tryLoadImage(src, 0);
        } else {
          // 使用CDN管理器的回退逻辑
          tryLoadImage(src);
        }
      }, 1000 * nextRetryCount); // 递增延迟
    } else {
      // 所有重试都失败了
      setIsLoading(false);
      setHasError(true);
      logSmartImage.extend('error')(`${t.common.imageFinalLoadFailed}: ${src}, 已尝试所有CDN和重试`);
      onError?.(error);
    }
  }, [currentSrc, retryCount, cdnIndex, enableCDNFallback, availableCDNs, maxRetries, src, tryLoadImage, onError]);

  /**
   * 初始化图片加载
   */
  useEffect(() => {
    if (src) {
      setRetryCount(0);
      setCdnIndex(0);
      tryLoadImage(src, 0);
    }
  }, [src, tryLoadImage]);

  // 加载中状态
  if (isLoading) {
    return (
      <div className="smart-image-loading" style={{ display: 'inline-block', ...imgProps.style }}>
        {loadingContent || (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px',
            backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
            color: isDark ? '#ccc' : '#666',
            fontSize: '14px',
            borderRadius: '4px'
          }}>
            {t.common.imageLoading}
          </div>
        )}
      </div>
    );
  }

  // 错误状态
  if (hasError) {
    return (
      <div className="smart-image-error" style={{ display: 'inline-block', ...imgProps.style }}>
        {fallbackContent || (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px',
            backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
            color: isDark ? '#999' : '#999',
            fontSize: '14px',
            border: `1px dashed ${isDark ? '#555' : '#ddd'}`,
            borderRadius: '4px'
          }}>
            {t.common.imageLoadFailed}
          </div>
        )}
      </div>
    );
  }

  // 正常显示图片
  return (
    <img
      {...imgProps}
      src={currentSrc}
      alt={alt}
      onLoad={handleImageLoad}
      onError={handleImageError}
      style={{
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
