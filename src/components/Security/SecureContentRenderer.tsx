/**
 * 安全内容渲染器组件
 * 提供安全的HTML内容渲染，防止XSS攻击
 */

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { SecurityUtils } from '../../utils/SecurityUtils';
import { SecureMarkdownProcessor } from '../../utils/SecureMarkdownProcessor';
import { securityConfig } from '../../config/SecurityConfig';

// 全局安全配置 - 从环境变量读取
const GLOBAL_SECURITY_CONFIG = {
  // 开发环境默认启用更多安全警告
  enableSecurityWarnings: import.meta.env.DEV || import.meta.env.VITE_ENABLE_SECURITY_WARNINGS === 'true'
};

/**
 * 安全内容渲染器属性
 */
export interface SecureContentRendererProps {
  /** 要渲染的内容 */
  content: string;
  /** 内容类型 */
  contentType?: 'html' | 'markdown' | 'text';
  /** 是否启用懒加载功能 */
  enableLazyLoad?: boolean;
  /** 是否启用变量替换 */
  enableVariableReplacement?: boolean;
  /** 是否启用Mermaid图表 */
  enableMermaid?: boolean;
  /** 最大内容长度 */
  maxLength?: number;
  /** 自定义CSS类名 */
  className?: string;
  /** 错误回调 */
  onError?: (error: string) => void;
  /** 安全事件回调 */
  onSecurityEvent?: (event: any) => void;
  /** 是否显示安全警告 */
  showSecurityWarnings?: boolean;
}

/**
 * 安全内容渲染器组件
 */
export const SecureContentRenderer: React.FC<SecureContentRendererProps> = ({
  content,
  contentType = 'html',
  enableLazyLoad = true,
  enableVariableReplacement = true,
  enableMermaid = false,
  maxLength,
  className = '',
  onError,
  onSecurityEvent,
  showSecurityWarnings = false
}) => {
  const [processedContent, setProcessedContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理内容
   */
  const processContent = useCallback(async () => {
    if (!content) {
      setProcessedContent('');
      setSecurityWarnings([]);
      setError(null);
      return;
    }

    setIsProcessing(true);
    setError(null);
    const warnings: string[] = [];

    try {
      let processed = content;

      // 长度检查
      const configMaxLength = securityConfig.get<number>('xss.maxContentLength') || 50000;
      const effectiveMaxLength = maxLength || configMaxLength;

      if (content.length > effectiveMaxLength) {
        warnings.push(`内容长度超过限制 (${content.length} > ${effectiveMaxLength})`);
        processed = content.substring(0, effectiveMaxLength) + '...';

        SecurityUtils.logSecurityEvent({
          type: 'suspicious_activity',
          details: `Content length exceeds limit: ${content.length} > ${effectiveMaxLength}`
        });
      }

      // 敏感信息检查
      const sensitiveCheck = SecurityUtils.containsSensitiveInfo(processed);
      if (sensitiveCheck.hasSensitive) {
        warnings.push(`检测到可能的敏感信息: ${sensitiveCheck.types.join(', ')}`);

        if (onSecurityEvent) {
          onSecurityEvent({
            type: 'sensitive_data_detected',
            types: sensitiveCheck.types,
            content: processed.substring(0, 100) + '...'
          });
        }
      }

      // 根据内容类型处理
      switch (contentType) {
        case 'markdown':
          const markdownProcessor = SecureMarkdownProcessor.getInstance();
          processed = await markdownProcessor.processMarkdown(processed, {
            enableLazyLoad,
            enableVariableReplacement,
            enableMermaid,
            maxLength: effectiveMaxLength
          });
          break;

        case 'html':
          // 始终进行HTML安全清理，确保安全性
          processed = SecurityUtils.sanitizeHTML(processed);
          break;

        case 'text':
          processed = SecurityUtils.sanitizeInput(processed);
          // 转换为HTML段落
          processed = `<p>${processed.replace(/\n/g, '<br>')}</p>`;
          break;

        default:
          throw new Error(`不支持的内容类型: ${contentType}`);
      }

      // 最终安全检查
      if (!processed || processed.trim() === '') {
        warnings.push('内容处理后为空，可能包含不安全的内容');
      }

      setProcessedContent(processed);
      setSecurityWarnings(warnings);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '内容处理失败';
      setError(errorMessage);
      setProcessedContent('');

      if (onError) {
        onError(errorMessage);
      }

      SecurityUtils.logSecurityEvent({
        type: 'xss_attempt',
        details: `Content processing failed: ${errorMessage}`
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    content,
    contentType,
    enableLazyLoad,
    enableVariableReplacement,
    enableMermaid,
    maxLength,
    onError,
    onSecurityEvent
  ]);

  // 内容变化时重新处理
  useEffect(() => {
    processContent();
  }, [processContent]);

  /**
   * 创建安全的HTML属性
   */
  const createSafeHtmlProps = useMemo(() => {
    if (!processedContent) {
      return {};
    }

    return {
      dangerouslySetInnerHTML: {
        __html: processedContent
      }
    };
  }, [processedContent]);

  /**
   * 渲染加载状态
   */
  if (isProcessing) {
    return (
      <div className={`secure-content-loading ${className}`}>
        <div className="loading-spinner">处理中...</div>
      </div>
    );
  }

  /**
   * 渲染错误状态
   */
  if (error) {
    return (
      <div className={`secure-content-error ${className}`}>
        <div className="error-message">
          ⚠️ 内容加载失败: {error}
        </div>
      </div>
    );
  }

  /**
   * 渲染空内容
   */
  if (!processedContent) {
    return (
      <div className={`secure-content-empty ${className}`}>
        <div className="empty-message">暂无内容</div>
      </div>
    );
  }

  return (
    <div className={`secure-content-renderer ${className}` }>
      {/* 安全警告 */}
      {showSecurityWarnings && securityWarnings.length > 0 && (
        <div className="security-warnings">
          <div className="warning-header">🔒 安全提示:</div>
          <ul className="warning-list">
            {securityWarnings.map((warning, index) => (
              <li key={index} className="warning-item">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 安全渲染的内容 */}
      <div
        className="secure-content"
        {...createSafeHtmlProps}
      />
    </div>
  );
};

/**
 * 安全文本渲染器（纯文本，无HTML）
 */
export const SecureTextRenderer: React.FC<{
  text: string;
  className?: string;
  maxLength?: number;
}> = ({ text, className = '', maxLength = 1000 }) => {
  const sanitizedText = useMemo(() => {
    if (!text) return '';

    let processed = SecurityUtils.sanitizeInput(text);

    if (processed.length > maxLength) {
      processed = processed.substring(0, maxLength) + '...';
    }

    return processed;
  }, [text, maxLength]);

  return (
    <span className={`secure-text ${className}`}>
      {sanitizedText}
    </span>
  );
};

/**
 * 安全链接渲染器
 */
export const SecureLinkRenderer: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}> = ({ href, children, className = '', target = '_blank', rel = 'noopener noreferrer' }) => {
  const safeHref = useMemo(() => {
    if (!href) return '#';

    if (!SecurityUtils.isSecureURL(href)) {
      SecurityUtils.logSecurityEvent({
        type: 'suspicious_activity',
        details: `Unsafe URL blocked: ${href}`
      });
      return '#';
    }

    return href;
  }, [href]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (safeHref === '#') {
      e.preventDefault();
      alert('此链接被安全策略阻止');
    }
  }, [safeHref]);

  return (
    <a
      href={safeHref}
      className={`secure-link ${className}`}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

/**
 * 安全图片渲染器
 */
export const SecureImageRenderer: React.FC<{
  src: string;
  alt: string;
  className?: string;
  maxWidth?: number;
  maxHeight?: number;
}> = ({ src, alt, className = '', maxWidth = 800, maxHeight = 600 }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setImageSrc('');
      return;
    }

    if (!SecurityUtils.isSecureURL(src)) {
      SecurityUtils.logSecurityEvent({
        type: 'suspicious_activity',
        details: `Unsafe image URL blocked: ${src}`
      });
      setImageError(true);
      return;
    }

    setImageSrc(src);
    setImageError(false);
  }, [src]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    SecurityUtils.logSecurityEvent({
      type: 'suspicious_activity',
      details: `Image failed to load: ${src}`
    });
  }, [src]);

  if (imageError || !imageSrc) {
    return (
      <div className={`secure-image-error ${className}`}>
        <span>🖼️ 图片加载失败</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={SecurityUtils.sanitizeInput(alt)}
      className={`secure-image ${className}`}
      style={{
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        objectFit: 'contain'
      }}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default SecureContentRenderer;
