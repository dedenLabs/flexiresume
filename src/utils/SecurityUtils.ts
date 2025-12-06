/**
 * 安全工具类
 * 提供XSS防护、数据验证、内容清理等安全功能
 */

import DOMPurify from 'dompurify';
import { getLogger } from './Logger';


// Debug logger
const logSecurityUtils = getLogger('SecurityUtils');
const debugSecurity = getLogger('security');

/**
 * XSS防护配置
 */
const XSS_CONFIG = {
  // 允许的HTML标签
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img', 'video',
    'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'svg', 'g', 'path', 'circle', 'rect', 'line', 'text', 'defs', 'marker'
  ],

  // 允许的属性
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id',
    'width', 'height', 'style', 'align',
    'controls', 'onplay', 'onpause', 'onclick',
    'target', 'rel',
    // SVG相关属性
    'viewBox', 'xmlns', 'd', 'fill', 'stroke', 'stroke-width',
    'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
    'transform', 'text-anchor', 'font-size', 'font-family',
    // SkillItem相关属性
    'data-skill-name', 'data-skill-level',
    // Mermaid相关属性
    'data-mermaid-chart', 'data-mermaid-id',
    // SmartImage相关属性
    'data-smart-image', 'data-cdn-index', 'data-retry-count',
    // 其他安全的data属性
    'data-testid', 'data-content-hash', 'data-observer-attached', 'loading'
  ],

  // 允许的协议
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

  // 禁止的标签
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],

  // 禁止的属性
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
};

/**
 * 数据验证规则
 */
export const ValidationRules = {
  // 邮箱验证
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // 电话号码验证（支持国际格式）
  phone: /^[\+]?[1-9][\d]{0,15}$/,

  // URL验证
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

  // 用户名验证（字母、数字、下划线、中文）
  username: /^[\w\u4e00-\u9fa5]{2,20}$/,

  // 安全的文件名
  filename: /^[a-zA-Z0-9._-]+$/,

  // Markdown内容基础验证
  markdown: /^[\s\S]*$/,

  // 技能名称验证
  skillName: /^[\w\u4e00-\u9fa5\s\.\+\-#]{1,50}$/,

  // 日期格式验证
  date: /^\d{4}-\d{2}-\d{2}$/,

  // 年月格式验证
  yearMonth: /^\d{4}-\d{2}$/
};

/**
 * 安全工具类
 */
export class SecurityUtils {
  /**
   * 清理HTML内容，防止XSS攻击
   */
  static sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') {
      return '';
    }

    try {
      let opt = {
        ALLOWED_TAGS: XSS_CONFIG.ALLOWED_TAGS,
        ALLOWED_ATTR: XSS_CONFIG.ALLOWED_ATTR,
        ALLOWED_URI_REGEXP: XSS_CONFIG.ALLOWED_URI_REGEXP,
        FORBID_TAGS: XSS_CONFIG.FORBID_TAGS,
        FORBID_ATTR: XSS_CONFIG.FORBID_ATTR,
        KEEP_CONTENT: true,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_DOM_IMPORT: false,
        SANITIZE_DOM: true,
        WHOLE_DOCUMENT: false,
        // 允许自定义协议（如 mailto:, tel:）
        ALLOW_UNKNOWN_PROTOCOLS: false,
        // 移除空属性
        ALLOW_EMPTY_ATTR: false
      };
      // 提取Mermaid相关属性
      const dataMermaidCharts = html.match(/data-mermaid-chart="[^"]*"/g) || [];
      const dataMermaidIds = html.match(/data-mermaid-id="[^"]*"/g) || [];

      let result = DOMPurify.sanitize(html, opt);

      // 检查是否有Mermaid属性被异常清理
      const resultMermaidCharts = result.match(/data-mermaid-chart="[^"]*"/g) || [];
      const resultMermaidIds = result.match(/data-mermaid-id="[^"]*"/g) || [];

      if (dataMermaidCharts.length !== resultMermaidCharts.length ||
        dataMermaidIds.length !== resultMermaidIds.length) {

        logSecurityUtils('🔧 SecurityUtils: 检测到Mermaid属性被清理，正在修复...', {
          originalCharts: dataMermaidCharts.length,
          resultCharts: resultMermaidCharts.length,
          originalIds: dataMermaidIds.length,
          resultIds: resultMermaidIds.length
        });

        // 修复被清理的Mermaid属性
        result = this.restoreMermaidAttributes(result, dataMermaidCharts, dataMermaidIds);
      }

      return result;

    } catch (error) {
      debugSecurity.extend('error')('HTML sanitization failed: %O', error);
      return '';
    }
  }

  /**
   * 修复被DOMPurify清理的Mermaid属性
   */
  private static restoreMermaidAttributes(
    html: string,
    originalCharts: string[],
    originalIds: string[]
  ): string {
    try {
      // 创建临时DOM来处理
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // 查找所有可能的Mermaid占位符
      const placeholders = tempDiv.querySelectorAll('.mermaid-placeholder, .mermaid-lazy-placeholder');

      let chartIndex = 0;
      let idIndex = 0;

      placeholders.forEach((placeholder) => {
        // 只恢复data-mermaid-id属性（图表数据现在存储在内存中）
        if (idIndex < originalIds.length && !placeholder.hasAttribute('data-mermaid-id')) {
          const idAttr = originalIds[idIndex];
          const idValue = idAttr.match(/data-mermaid-id="([^"]*)"/)?.[1];
          if (idValue) {
            placeholder.setAttribute('data-mermaid-id', idValue);
            idIndex++;
          }
        }
      });

      const restoredHtml = tempDiv.innerHTML;
      // 调试日志已移除: console.log('✅ SecurityUtils: Mermaid属性修复完成');
      return restoredHtml;

    } catch (error) {
      logSecurityUtils.extend('error')('❌ SecurityUtils: Mermaid属性修复失败:', error);
      return html; // 返回原始结果
    }
  }

  /**
   * 验证数据格式
   */
  static validateData(data: any, rules: { [key: string]: RegExp | ((value: any) => boolean) }): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];

      if (value === undefined || value === null) {
        continue; // 跳过未定义的字段
      }

      let isValid = false;

      if (rule instanceof RegExp) {
        isValid = rule.test(String(value));
      } else if (typeof rule === 'function') {
        isValid = rule(value);
      }

      if (!isValid) {
        errors.push(`字段 ${field} 格式不正确`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 清理用户输入
   */
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // 移除尖括号
      .replace(/javascript:/gi, '') // 移除javascript协议
      .replace(/vbscript:/gi, '') // 移除vbscript协议
      .replace(/on\w+=/gi, '') // 移除事件处理器
      .substring(0, 1000); // 限制长度
  }

  /**
   * 验证URL安全性
   */
  static isSecureURL(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      const urlObj = new URL(url);

      // 只允许HTTP和HTTPS协议
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }

      // 检查是否为恶意域名（简单黑名单）
      const maliciousDomains = ['malware.com', 'phishing.com'];
      if (maliciousDomains.some(domain => urlObj.hostname.includes(domain))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * 验证邮箱地址
   */
  static validateEmail(email: string): boolean {
    return ValidationRules.email.test(email);
  }

  /**
   * 验证电话号码
   */
  static validatePhone(phone: string): boolean {
    return ValidationRules.phone.test(phone);
  }

  /**
   * 生成安全的文件名
   */
  static generateSecureFileName(originalName: string): string {
    if (!originalName) {
      return `file_${Date.now()}`;
    }

    const extension = originalName.split('.').pop() || '';
    const baseName = originalName.replace(/\.[^/.]+$/, '');

    // 清理文件名
    const cleanName = baseName
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5._-]/g, '_')
      .substring(0, 50);

    return `${cleanName}_${Date.now()}.${extension}`;
  }

  /**
   * 检查内容是否包含敏感信息
   */
  static containsSensitiveInfo(content: string): {
    hasSensitive: boolean;
    types: string[];
  } {
    const sensitivePatterns = {
      creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
      ssn: /\b\d{3}-\d{2}-\d{4}\b/,
      idCard: /\b\d{17}[\dXx]\b/,
      bankAccount: /\b\d{16,19}\b/,
      password: /password\s*[:=]\s*\S+/i,
      apiKey: /api[_-]?key\s*[:=]\s*\S+/i
    };

    const foundTypes: string[] = [];

    for (const [type, pattern] of Object.entries(sensitivePatterns)) {
      if (pattern.test(content)) {
        foundTypes.push(type);
      }
    }

    return {
      hasSensitive: foundTypes.length > 0,
      types: foundTypes
    };
  }

  /**
   * 内容安全策略（CSP）头部生成
   */
  static generateCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }

  /**
   * 安全日志记录
   */
  static logSecurityEvent(event: {
    type: 'xss_attempt' | 'invalid_input' | 'suspicious_activity';
    details: string;
    userAgent?: string;
    timestamp?: number;
  }): void {
    const logEntry = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      userAgent: event.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown')
    };

    // 在生产环境中，这里应该发送到安全监控系统
    debugSecurity('🔒 Security Event: %O', logEntry);

    // 存储到本地存储（仅用于调试）
    try {
      const existingLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      existingLogs.push(logEntry);

      // 只保留最近100条记录
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }

      localStorage.setItem('security_logs', JSON.stringify(existingLogs));
    } catch (error) {
      debugSecurity.extend('error')('Failed to log security event: %O', error);
    }
  }

  /**
   * 获取安全日志
   */
  static getSecurityLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('security_logs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * 清理安全日志
   */
  static clearSecurityLogs(): void {
    try {
      localStorage.removeItem('security_logs');
    } catch (error) {
      debugSecurity.extend('error')('Failed to clear security logs: %O', error);
    }
  }
}
