/**
 * 安全的Markdown处理器
 * 提供XSS防护的Markdown到HTML转换功能
 */

import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import debug from 'debug';
import { SecurityUtils } from './SecurityUtils';
import { remarkQRCodeLazyLoad, remarkVideoLazyLoad, remarkImagesLazyLoad, remarkMermaidLazyLoad } from './ParseAndReplaceSkills';
import { replaceVariables } from './Tools';
import flexiResumeStore from '../store/Store';

// Debug logger
const debugMarkdown = debug('app:markdown');

/**
 * 安全的Markdown处理配置
 */
const SECURE_MARKDOWN_CONFIG = {
  // 启用安全模式
  sanitize: true,
  
  // 允许的HTML标签（更严格的控制）
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img',
    'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'td', 'th'
  ],
  
  // 最大内容长度
  maxContentLength: 50000,
  
  // 最大嵌套深度
  maxNestingDepth: 10
};

/**
 * 安全的Markdown处理器类
 */
export class SecureMarkdownProcessor {
  private static instance: SecureMarkdownProcessor;
  private processingCache = new Map<string, string>();
  private cacheMaxSize = 100;

  private constructor() {}

  static getInstance(): SecureMarkdownProcessor {
    if (!SecureMarkdownProcessor.instance) {
      SecureMarkdownProcessor.instance = new SecureMarkdownProcessor();
    }
    return SecureMarkdownProcessor.instance;
  }

  /**
   * 安全地将Markdown转换为HTML
   */
  async processMarkdown(content: string, options: {
    enableLazyLoad?: boolean;
    enableVariableReplacement?: boolean;
    enableMermaid?: boolean;
    maxLength?: number;
  } = {}): Promise<string> {
    // 输入验证
    if (!content || typeof content !== 'string') {
      return '';
    }

    // 长度限制
    const maxLength = options.maxLength || SECURE_MARKDOWN_CONFIG.maxContentLength;
    if (content.length > maxLength) {
      SecurityUtils.logSecurityEvent({
        type: 'suspicious_activity',
        details: `Markdown content exceeds maximum length: ${content.length} > ${maxLength}`
      });
      content = content.substring(0, maxLength) + '...';
    }

    // 检查缓存
    const cacheKey = this.generateCacheKey(content, options);
    if (this.processingCache.has(cacheKey)) {
      return this.processingCache.get(cacheKey)!;
    }

    try {
      // 预处理：检查敏感信息
      const sensitiveCheck = SecurityUtils.containsSensitiveInfo(content);
      if (sensitiveCheck.hasSensitive) {
        SecurityUtils.logSecurityEvent({
          type: 'suspicious_activity',
          details: `Potential sensitive information detected: ${sensitiveCheck.types.join(', ')}`
        });
      }

      // 构建remark处理链
      let processor = remark();

      // 添加插件（按需启用）
      if (options.enableLazyLoad) {
        processor = processor
          .use(remarkQRCodeLazyLoad)
          .use(remarkVideoLazyLoad)
          .use(remarkImagesLazyLoad);
      }

      if (options.enableMermaid) {
        processor = processor.use(remarkMermaidLazyLoad);
      }

      // 转换为HTML（启用安全模式）
      processor = processor.use(html, { 
        sanitize: true,
        allowDangerousHtml: false
      });

      const result = await processor.process(content);
      let processedContent = String(result);

      // 变量替换（如果启用）
      if (options.enableVariableReplacement && flexiResumeStore.data) {
        processedContent = this.secureVariableReplacement(processedContent, flexiResumeStore.data);
      }

      // 最终的HTML清理
      processedContent = SecurityUtils.sanitizeHTML(processedContent);

      // 验证处理结果
      if (!this.validateProcessedContent(processedContent)) {
        SecurityUtils.logSecurityEvent({
          type: 'xss_attempt',
          details: 'Processed content failed security validation'
        });
        return '';
      }

      // 缓存结果
      this.cacheResult(cacheKey, processedContent);

      return processedContent;

    } catch (error) {
      debugMarkdown('Secure markdown processing failed:', error);
      SecurityUtils.logSecurityEvent({
        type: 'xss_attempt',
        details: `Markdown processing error: ${error}`
      });
      return '';
    }
  }

  /**
   * 同步版本的安全Markdown处理（用于兼容现有代码）
   */
  processMarkdownSync(content: string, options: {
    enableLazyLoad?: boolean;
    enableVariableReplacement?: boolean;
    enableMermaid?: boolean;
    maxLength?: number;
  } = {}): string {
    // 输入验证
    if (!content || typeof content !== 'string') {
      return '';
    }

    // 长度限制
    const maxLength = options.maxLength || SECURE_MARKDOWN_CONFIG.maxContentLength;
    if (content.length > maxLength) {
      content = content.substring(0, maxLength) + '...';
    }

    try {
      // 构建remark处理链
      let processor = remark();

      if (options.enableLazyLoad) {
        processor = processor
          .use(remarkQRCodeLazyLoad)
          .use(remarkVideoLazyLoad)
          .use(remarkImagesLazyLoad);
      }

      if (options.enableMermaid) {
        processor = processor.use(remarkMermaidLazyLoad);
      }

      processor = processor.use(html, { 
        sanitize: true,
        allowDangerousHtml: false
      });

      const result = processor.processSync(content);
      let processedContent = String(result);

      // 变量替换
      if (options.enableVariableReplacement && flexiResumeStore.data) {
        processedContent = this.secureVariableReplacement(processedContent, flexiResumeStore.data);
      }

      // HTML清理
      processedContent = SecurityUtils.sanitizeHTML(processedContent);

      return processedContent;

    } catch (error) {
      debugMarkdown('Secure markdown sync processing failed:', error);
      return '';
    }
  }

  /**
   * 安全的变量替换
   */
  private secureVariableReplacement(content: string, data: any): string {
    try {
      return content.replace(/\$\{([\w.]+)\}/g, (match, path) => {
        // 验证变量路径格式
        if (!/^[\w.]+$/.test(path)) {
          SecurityUtils.logSecurityEvent({
            type: 'xss_attempt',
            details: `Invalid variable path format: ${path}`
          });
          return match;
        }

        const keys = path.split('.');
        let value = data;
        
        // 限制嵌套深度
        if (keys.length > SECURE_MARKDOWN_CONFIG.maxNestingDepth) {
          SecurityUtils.logSecurityEvent({
            type: 'suspicious_activity',
            details: `Variable path exceeds maximum nesting depth: ${path}`
          });
          return match;
        }

        for (const key of keys) {
          value = value ? value[key] : undefined;
          if (value === undefined) return match;
        }

        // 清理替换值
        if (typeof value === 'string') {
          return SecurityUtils.sanitizeInput(value);
        }

        return String(value);
      });
    } catch (error) {
      debugMarkdown('Variable replacement failed:', error);
      return content;
    }
  }

  /**
   * 验证处理后的内容
   */
  private validateProcessedContent(content: string): boolean {
    // 检查是否包含潜在的XSS向量
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<form/i
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(content)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(content: string, options: any): string {
    const optionsStr = JSON.stringify(options);
    return `${content.length}_${this.simpleHash(content + optionsStr)}`;
  }

  /**
   * 简单哈希函数
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 缓存结果
   */
  private cacheResult(key: string, value: string): void {
    // 如果缓存已满，删除最旧的条目
    if (this.processingCache.size >= this.cacheMaxSize) {
      const firstKey = this.processingCache.keys().next().value;
      this.processingCache.delete(firstKey);
    }
    
    this.processingCache.set(key, value);
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.processingCache.clear();
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
  } {
    return {
      size: this.processingCache.size,
      maxSize: this.cacheMaxSize,
      hitRate: 0 // 简化实现，实际项目中可以添加命中率统计
    };
  }
}

/**
 * 安全的Markdown转换Hook
 */
export const useSecureMarkdown = (content: string, options: {
  enableLazyLoad?: boolean;
  enableVariableReplacement?: boolean;
  enableMermaid?: boolean;
  maxLength?: number;
} = {}) => {
  const [htmlContent, setHtmlContent] = React.useState<string>('');
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const processContent = async () => {
      if (!content) {
        setHtmlContent('');
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const processor = SecureMarkdownProcessor.getInstance();
        const result = await processor.processMarkdown(content, {
          enableLazyLoad: true,
          enableVariableReplacement: true,
          enableMermaid: true,
          ...options
        });
        
        setHtmlContent(result);
      } catch (err) {
        debugMarkdown('Markdown processing error:', err);
        setError('内容处理失败');
        setHtmlContent('');
      } finally {
        setIsProcessing(false);
      }
    };

    processContent();
  }, [content, JSON.stringify(options)]);

  return {
    htmlContent,
    isProcessing,
    error
  };
};

/**
 * 兼容性函数：替换原有的不安全函数
 */
export const checkConvertMarkdownToHtmlSecure = (content: string): string => {
  const processor = SecureMarkdownProcessor.getInstance();
  return processor.processMarkdownSync(content, {
    enableLazyLoad: true,
    enableVariableReplacement: true,
    enableMermaid: false
  });
};

export const parseMarkdownWithMmdLazyLoadSecure = (content: string): string => {
  const processor = SecureMarkdownProcessor.getInstance();
  return processor.processMarkdownSync(content, {
    enableLazyLoad: true,
    enableVariableReplacement: true,
    enableMermaid: true
  });
};
