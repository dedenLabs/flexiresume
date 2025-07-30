/**
 * 增强的安全工具类
 * Enhanced Security Utils
 * 
 * 提供更全面的XSS防护、数据验证和安全监控功能
 * Provides comprehensive XSS protection, data validation, and security monitoring
 */

import DOMPurify from 'dompurify'; 
import { SecurityUtils } from './SecurityUtils';
import { getLogger } from './Logger';

// Debug logger
const debugEnhancedSecurity = getLogger('enhanced-security');

/**
 * 增强的XSS防护配置
 */
const ENHANCED_XSS_CONFIG = {
  // 危险的HTML标签模式
  DANGEROUS_PATTERNS: [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
    /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
    /<embed[\s\S]*?>/gi,
    /<form[\s\S]*?>[\s\S]*?<\/form>/gi,
    /<input[\s\S]*?>/gi,
    /<textarea[\s\S]*?>[\s\S]*?<\/textarea>/gi,
    /<select[\s\S]*?>[\s\S]*?<\/select>/gi,
    /<button[\s\S]*?>[\s\S]*?<\/button>/gi,
    /<link[\s\S]*?>/gi,
    /<meta[\s\S]*?>/gi,
    /<style[\s\S]*?>[\s\S]*?<\/style>/gi
  ],

  // 危险的事件处理器
  EVENT_HANDLERS: [
    /on\w+\s*=/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi
  ],

  // 危险的CSS属性
  DANGEROUS_CSS: [
    /expression\s*\(/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /behavior\s*:/gi,
    /-moz-binding/gi,
    /url\s*\(\s*javascript:/gi
  ],

  // 允许的URL协议
  ALLOWED_PROTOCOLS: [
    'http:', 'https:', 'mailto:', 'tel:', 'ftp:', 'ftps:'
  ],

  // 最大内容长度限制
  MAX_CONTENT_LENGTH: 50000,
  MAX_ATTRIBUTE_LENGTH: 2000,
  MAX_URL_LENGTH: 2048
};

/**
 * 安全事件类型
 */
export enum SecurityEventType {
  XSS_ATTEMPT = 'xss_attempt',
  INJECTION_ATTEMPT = 'injection_attempt',
  SUSPICIOUS_CONTENT = 'suspicious_content',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_INPUT = 'invalid_input',
  SECURITY_VIOLATION = 'security_violation'
}

/**
 * 安全事件接口
 */
export interface SecurityEvent {
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
  timestamp: number;
  userAgent?: string;
  ip?: string;
  url?: string;
}

/**
 * 增强的安全工具类
 */
export class EnhancedSecurityUtils {
  private static instance: EnhancedSecurityUtils;
  private securityEvents: SecurityEvent[] = [];
  private rateLimitMap = new Map<string, number[]>();

  private constructor() { }

  static getInstance(): EnhancedSecurityUtils {
    if (!EnhancedSecurityUtils.instance) {
      EnhancedSecurityUtils.instance = new EnhancedSecurityUtils();
    }
    return EnhancedSecurityUtils.instance;
  }

  /**
   * 增强的HTML清理功能
   */
  static sanitizeHTMLEnhanced(html: string, options: {
    allowCustomTags?: string[];
    allowCustomAttributes?: string[];
    maxLength?: number;
    strictMode?: boolean;
  } = {}): string {
    if (!html || typeof html !== 'string') {
      return '';
    }

    const {
      allowCustomTags = [],
      allowCustomAttributes = [],
      maxLength = ENHANCED_XSS_CONFIG.MAX_CONTENT_LENGTH,
      strictMode = true
    } = options;

    // 长度检查
    if (html.length > maxLength) {
      this.logSecurityEvent({
        type: SecurityEventType.SUSPICIOUS_CONTENT,
        severity: 'medium',
        message: `Content length exceeds limit: ${html.length} > ${maxLength}`,
        details: { contentLength: html.length, maxLength }
      });
      html = html.substring(0, maxLength) + '...';
    }

    // 预处理：检测危险模式
    if (strictMode) {
      for (const pattern of ENHANCED_XSS_CONFIG.DANGEROUS_PATTERNS) {
        if (pattern.test(html)) {
          this.logSecurityEvent({
            type: SecurityEventType.XSS_ATTEMPT,
            severity: 'high',
            message: 'Dangerous HTML pattern detected',
            details: { pattern: pattern.source }
          });
          html = html.replace(pattern, '');
        }
      }
    }

    // 使用DOMPurify进行清理
    const cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [...SecurityUtils.getAllowedTags(), ...allowCustomTags],
      ALLOWED_ATTR: [...SecurityUtils.getAllowedAttributes(), ...allowCustomAttributes],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      SANITIZE_DOM: true,
      WHOLE_DOCUMENT: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      ALLOW_EMPTY_ATTR: false,
      // 自定义钩子函数
      HOOKS: {
        beforeSanitizeElements: (node: Element) => {
          // 检查元素的属性长度
          if (node.attributes) {
            for (let i = 0; i < node.attributes.length; i++) {
              const attr = node.attributes[i];
              if (attr.value && attr.value.length > ENHANCED_XSS_CONFIG.MAX_ATTRIBUTE_LENGTH) {
                this.logSecurityEvent({
                  type: SecurityEventType.SUSPICIOUS_CONTENT,
                  severity: 'medium',
                  message: `Attribute value too long: ${attr.name}`,
                  details: { attributeName: attr.name, length: attr.value.length }
                });
                attr.value = attr.value.substring(0, ENHANCED_XSS_CONFIG.MAX_ATTRIBUTE_LENGTH);
              }
            }
          }
        },
        afterSanitizeAttributes: (node: Element) => {
          // 检查URL属性
          const urlAttributes = ['href', 'src', 'action', 'formaction'];
          urlAttributes.forEach(attrName => {
            const attrValue = node.getAttribute(attrName);
            if (attrValue && !this.isValidURL(attrValue)) {
              this.logSecurityEvent({
                type: SecurityEventType.SUSPICIOUS_CONTENT,
                severity: 'medium',
                message: `Invalid URL in ${attrName} attribute`,
                details: { attribute: attrName, url: attrValue }
              });
              node.removeAttribute(attrName);
            }
          });

          // 检查style属性中的危险CSS
          const styleAttr = node.getAttribute('style');
          if (styleAttr) {
            const cleanStyle = this.sanitizeCSS(styleAttr);
            if (cleanStyle !== styleAttr) {
              node.setAttribute('style', cleanStyle);
            }
          }
        }
      }
    });

    return cleanHtml;
  }

  /**
   * CSS清理功能
   */
  private static sanitizeCSS(css: string): string {
    if (!css || typeof css !== 'string') {
      return '';
    }

    let cleanCSS = css;

    // 移除危险的CSS模式
    for (const pattern of ENHANCED_XSS_CONFIG.DANGEROUS_CSS) {
      if (pattern.test(cleanCSS)) {
        this.logSecurityEvent({
          type: SecurityEventType.XSS_ATTEMPT,
          severity: 'high',
          message: 'Dangerous CSS pattern detected',
          details: { pattern: pattern.source, css: css }
        });
        cleanCSS = cleanCSS.replace(pattern, '');
      }
    }

    return cleanCSS;
  }

  /**
   * URL验证
   */
  private static isValidURL(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    // 长度检查
    if (url.length > ENHANCED_XSS_CONFIG.MAX_URL_LENGTH) {
      return false;
    }

    try {
      const urlObj = new URL(url, window.location.origin);

      // 协议检查
      if (!ENHANCED_XSS_CONFIG.ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
        return false;
      }

      // 检查是否包含危险字符
      const dangerousChars = ['<', '>', '"', "'", '`'];
      if (dangerousChars.some(char => url.includes(char))) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 增强的输入验证
   */
  static validateInputEnhanced(input: any, rules: {
    type?: 'string' | 'number' | 'email' | 'url' | 'phone' | 'date';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    allowedValues?: any[];
    customValidator?: (value: any) => boolean;
  }): {
    isValid: boolean;
    sanitizedValue: any;
    errors: string[];
  } {
    const errors: string[] = [];
    let sanitizedValue = input;

    // 必填检查
    if (rules.required && (input === null || input === undefined || input === '')) {
      errors.push('该字段为必填项');
      return { isValid: false, sanitizedValue: null, errors };
    }

    // 如果不是必填且为空，直接返回
    if (!rules.required && (input === null || input === undefined || input === '')) {
      return { isValid: true, sanitizedValue: null, errors: [] };
    }

    // 类型验证和清理
    switch (rules.type) {
      case 'string':
        if (typeof input !== 'string') {
          sanitizedValue = String(input);
        }
        sanitizedValue = SecurityUtils.sanitizeInput(sanitizedValue);
        break;

      case 'number':
        const num = Number(input);
        if (isNaN(num)) {
          errors.push('必须是有效的数字');
        } else {
          sanitizedValue = num;
        }
        break;

      case 'email':
        if (typeof input === 'string') {
          sanitizedValue = SecurityUtils.sanitizeInput(input);
          if (!SecurityUtils.validateEmail(sanitizedValue)) {
            errors.push('邮箱格式不正确');
          }
        } else {
          errors.push('邮箱必须是字符串');
        }
        break;

      case 'url':
        if (typeof input === 'string') {
          sanitizedValue = SecurityUtils.sanitizeInput(input);
          if (!this.isValidURL(sanitizedValue)) {
            errors.push('URL格式不正确');
          }
        } else {
          errors.push('URL必须是字符串');
        }
        break;

      case 'phone':
        if (typeof input === 'string') {
          sanitizedValue = SecurityUtils.sanitizeInput(input);
          if (!SecurityUtils.validatePhone(sanitizedValue)) {
            errors.push('电话号码格式不正确');
          }
        } else {
          errors.push('电话号码必须是字符串');
        }
        break;

      case 'date':
        const date = new Date(input);
        if (isNaN(date.getTime())) {
          errors.push('日期格式不正确');
        } else {
          sanitizedValue = date.toISOString();
        }
        break;
    }

    // 长度验证
    if (typeof sanitizedValue === 'string') {
      if (rules.minLength && sanitizedValue.length < rules.minLength) {
        errors.push(`长度不能少于${rules.minLength}个字符`);
      }
      if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
        errors.push(`长度不能超过${rules.maxLength}个字符`);
        sanitizedValue = sanitizedValue.substring(0, rules.maxLength);
      }
    }

    // 模式验证
    if (rules.pattern && typeof sanitizedValue === 'string') {
      if (!rules.pattern.test(sanitizedValue)) {
        errors.push('格式不符合要求');
      }
    }

    // 允许值验证
    if (rules.allowedValues && !rules.allowedValues.includes(sanitizedValue)) {
      errors.push('值不在允许的范围内');
    }

    // 自定义验证
    if (rules.customValidator && !rules.customValidator(sanitizedValue)) {
      errors.push('自定义验证失败');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue,
      errors
    };
  }

  /**
   * 记录安全事件
   */
  private static logSecurityEvent(event: Omit<SecurityEvent, 'timestamp' | 'userAgent' | 'url'>): void {
    const instance = EnhancedSecurityUtils.getInstance();

    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    instance.securityEvents.push(fullEvent);

    // 保持事件日志在合理范围内
    if (instance.securityEvents.length > 1000) {
      instance.securityEvents = instance.securityEvents.slice(-500);
    }

    // 根据严重程度决定是否立即报告
    if (event.severity === 'critical' || event.severity === 'high') {
      debugEnhancedSecurity('[Security Alert] %O', fullEvent);

      // 可以在这里添加远程日志上报逻辑
      // this.reportSecurityEvent(fullEvent);
    }
  }

  /**
   * 获取安全事件日志
   */
  static getSecurityEvents(filter?: {
    type?: SecurityEventType;
    severity?: string;
    since?: number;
  }): SecurityEvent[] {
    const instance = EnhancedSecurityUtils.getInstance();
    let events = instance.securityEvents;

    if (filter) {
      events = events.filter(event => {
        if (filter.type && event.type !== filter.type) return false;
        if (filter.severity && event.severity !== filter.severity) return false;
        if (filter.since && event.timestamp < filter.since) return false;
        return true;
      });
    }

    return events;
  }

  /**
   * 清除安全事件日志
   */
  static clearSecurityEvents(): void {
    const instance = EnhancedSecurityUtils.getInstance();
    instance.securityEvents = [];
  }

  /**
   * 生成安全报告
   */
  static generateSecurityReport(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    recentEvents: SecurityEvent[];
    recommendations: string[];
  } {
    const events = this.getSecurityEvents();
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const recommendations: string[] = [];

    events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    });

    // 生成建议
    if (eventsByType[SecurityEventType.XSS_ATTEMPT] > 0) {
      recommendations.push('检测到XSS攻击尝试，建议加强输入验证');
    }
    if (eventsBySeverity.high > 5) {
      recommendations.push('高危安全事件较多，建议立即检查安全配置');
    }
    if (eventsByType[SecurityEventType.RATE_LIMIT_EXCEEDED] > 0) {
      recommendations.push('检测到频率限制超出，建议检查是否有异常访问');
    }

    return {
      totalEvents: events.length,
      eventsByType,
      eventsBySeverity,
      recentEvents: events.slice(-10),
      recommendations
    };
  }

  /**
   * 速率限制检查
   */
  static checkRateLimit(key: string, maxRequests: number = 100, timeWindow: number = 60000): boolean {
    const instance = EnhancedSecurityUtils.getInstance();
    const now = Date.now();
    const windowStart = now - timeWindow;

    // 获取或创建请求记录
    if (!instance.rateLimitMap.has(key)) {
      instance.rateLimitMap.set(key, []);
    }

    const requests = instance.rateLimitMap.get(key)!;

    // 清理过期的请求记录
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    instance.rateLimitMap.set(key, validRequests);

    // 检查是否超出限制
    if (validRequests.length >= maxRequests) {
      this.logSecurityEvent({
        type: SecurityEventType.RATE_LIMIT_EXCEEDED,
        severity: 'medium',
        message: `Rate limit exceeded for key: ${key}`,
        details: { key, requests: validRequests.length, maxRequests, timeWindow }
      });
      return false;
    }

    // 记录当前请求
    validRequests.push(now);
    instance.rateLimitMap.set(key, validRequests);

    return true;
  }

  /**
   * 内容安全策略违规检测
   */
  static detectCSPViolation(violationReport: any): void {
    this.logSecurityEvent({
      type: SecurityEventType.SECURITY_VIOLATION,
      severity: 'high',
      message: 'Content Security Policy violation detected',
      details: violationReport
    });
  }

  /**
   * 检测可疑的用户行为
   */
  static detectSuspiciousBehavior(behavior: {
    rapidClicks?: number;
    unusualNavigation?: boolean;
    suspiciousInput?: boolean;
    automatedBehavior?: boolean;
  }): void {
    const suspiciousIndicators = [];

    if (behavior.rapidClicks && behavior.rapidClicks > 10) {
      suspiciousIndicators.push('rapid_clicking');
    }

    if (behavior.unusualNavigation) {
      suspiciousIndicators.push('unusual_navigation');
    }

    if (behavior.suspiciousInput) {
      suspiciousIndicators.push('suspicious_input');
    }

    if (behavior.automatedBehavior) {
      suspiciousIndicators.push('automated_behavior');
    }

    if (suspiciousIndicators.length > 0) {
      this.logSecurityEvent({
        type: SecurityEventType.SUSPICIOUS_CONTENT,
        severity: 'medium',
        message: 'Suspicious user behavior detected',
        details: { indicators: suspiciousIndicators, behavior }
      });
    }
  }
}

export default EnhancedSecurityUtils;
