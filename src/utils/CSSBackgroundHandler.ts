/**
 * CSS背景图片CDN处理器
 * 处理CSS中的background-image URL，支持CDN切换和错误处理
 */
import { cdnManager } from './CDNManager';
import { cdnHealthChecker } from './CDNHealthChecker';
import { getLogger } from './Logger';

const debug = getLogger('css-background-handler');

/**
 * CSS背景图片处理器类
 */
export class CSSBackgroundHandler {
  private static instance: CSSBackgroundHandler;
  private processedStyles: Set<string> = new Set();
  private observer: MutationObserver | null = null;
  private styleProcessorTimer: number | null = null;

  private constructor() {
    this.initializeObserver();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): CSSBackgroundHandler {
    if (!CSSBackgroundHandler.instance) {
      CSSBackgroundHandler.instance = new CSSBackgroundHandler();
    }
    return CSSBackgroundHandler.instance;
  }

  /**
   * 初始化DOM观察器
   */
  private initializeObserver(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      this.scheduleStyleProcessing();
    });

    // 观察整个文档的变化
    this.observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
  }

  /**
   * 调度样式处理（防抖）
   */
  private scheduleStyleProcessing(): void {
    if (this.styleProcessorTimer) {
      clearTimeout(this.styleProcessorTimer);
    }
    
    this.styleProcessorTimer = window.setTimeout(() => {
      this.processAllStyles();
    }, 100);
  }

  /**
   * 处理所有样式
   */
  private processAllStyles(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // 处理内联样式
    this.processInlineStyles();
    
    // 处理样式表
    this.processStyleSheets();
  }

  /**
   * 处理内联样式
   */
  private processInlineStyles(): void {
    const elements = document.querySelectorAll('[style*="background-image"]');
    
    elements.forEach((element, index) => {
      const style = element.getAttribute('style');
      if (style) {
        const processedStyle = this.processBackgroundImageURLs(style);
        if (processedStyle !== style) {
          element.setAttribute('style', processedStyle);
        }
      }
    });
  }

  /**
   * 处理样式表
   */
  private processStyleSheets(): void {
    const styleSheets = document.styleSheets;
    
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const styleSheet = styleSheets[i];
        this.processStyleSheet(styleSheet);
      } catch (error) {
        debug.extend('error')('Failed to process stylesheet: %O', error);
      }
    }
  }

  /**
   * 处理单个样式表
   */
  private processStyleSheet(styleSheet: CSSStyleSheet): void {
    const rules = styleSheet.cssRules || styleSheet.rules;
    
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      
      if (rule instanceof CSSStyleRule) {
        this.processStyleRule(rule, styleSheet, i);
      } else if (rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
        // 递归处理嵌套规则
        this.processStyleSheet(rule);
      }
    }
  }

  /**
   * 处理样式规则
   */
  private processStyleRule(rule: CSSStyleRule, styleSheet: CSSStyleSheet, index: number): void {
    const styleText = rule.style.cssText;
    
    if (styleText.includes('background-image')) {
      const processedStyleText = this.processBackgroundImageURLs(styleText);
      
      if (processedStyleText !== styleText) {
        try {
          // 创建新规则
          const newRule = `${rule.selectorText} { ${processedStyleText} }`;
          styleSheet.insertRule(newRule, index + 1);
          styleSheet.deleteRule(index);
        } catch (error) {
          debug.extend('error')('Failed to update style rule: %O', error);
        }
      }
    }
  }

  /**
   * 处理背景图片URL
   */
  private processBackgroundImageURLs(styleText: string): string {
    const urlPattern = /background-image:\s*url\(['"]([^'"]+)['"]\)/g;
    let processedStyle = styleText;
    let match;

    while ((match = urlPattern.exec(styleText)) !== null) {
      const originalUrl = match[1];
      const processedUrl = this.processSingleURL(originalUrl);
      
      if (processedUrl !== originalUrl) {
        processedStyle = processedStyle.replace(match[0], `background-image: url('${processedUrl}')`);
      }
    }

    return processedStyle;
  }

  /**
   * 处理单个URL
   */
  private processSingleURL(originalUrl: string): string {
    // 如果已经是数据URL或相对路径，直接返回
    if (originalUrl.startsWith('data:') || originalUrl.startsWith('.') || originalUrl.startsWith('/')) {
      return originalUrl;
    }

    // 尝试从缓存获取
    if (this.processedStyles.has(originalUrl)) {
      return originalUrl;
    }

    // 获取最佳CDN
    const bestCDN = cdnHealthChecker.getBestCDN();
    if (bestCDN) {
      try {
        const processedUrl = cdnManager.buildCDNUrl(bestCDN, originalUrl);
        this.processedStyles.add(originalUrl);
        debug.extend('success')('Processed background image URL: %s -> %s', originalUrl, processedUrl);
        return processedUrl;
      } catch (error) {
        debug.extend('error')('Failed to process background image URL: %s, error: %O', originalUrl, error);
      }
    }

    // 处理失败，返回原始URL
    this.processedStyles.add(originalUrl);
    return originalUrl;
  }

  /**
   * 为GlobalStyle生成优化的背景图片URL
   */
  public generateOptimizedBackgroundURL(originalUrl: string): string {
    if (typeof window === 'undefined') {
      // 服务器端或构建时，返回原始URL
      return originalUrl;
    }

    // 获取最佳CDN
    const bestCDN = cdnHealthChecker.getBestCDN();
    if (bestCDN) {
      try {
        const processedUrl = cdnManager.buildCDNUrl(bestCDN, originalUrl);
        debug.extend('success')('Generated optimized background URL: %s -> %s', originalUrl, processedUrl);
        return processedUrl;
      } catch (error) {
        debug.extend('error')('Failed to generate optimized background URL: %s, error: %O', originalUrl, error);
      }
    }

    return originalUrl;
  }

  /**
   * 清理资源
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.styleProcessorTimer) {
      clearTimeout(this.styleProcessorTimer);
      this.styleProcessorTimer = null;
    }
    
    this.processedStyles.clear();
  }
}

/**
 * 获取CSS背景图片处理器实例
 */
export const cssBackgroundHandler = CSSBackgroundHandler.getInstance();

// 暴露到全局作用域，用于测试和验证
// if (typeof window !== 'undefined') {
//   window.cssBackgroundHandler = cssBackgroundHandler;
// }

/**
 * 为GlobalStyle生成优化的背景图片URL的便捷函数
 */
export function generateOptimizedBackgroundURL(originalUrl: string): string {
  return cssBackgroundHandler.generateOptimizedBackgroundURL(originalUrl);
}