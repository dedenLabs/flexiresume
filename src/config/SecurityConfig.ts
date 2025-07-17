/**
 * 安全配置文件
 * 集中管理应用的安全策略和配置
 */

/**
 * 安全配置接口
 */
export interface SecurityConfig {
  // XSS防护配置
  xss: {
    enabled: boolean;
    allowedTags: string[];
    allowedAttributes: string[];
    forbiddenTags: string[];
    forbiddenAttributes: string[];
    maxContentLength: number;
  };

  // 内容安全策略
  csp: {
    enabled: boolean;
    directives: {
      defaultSrc: string[];
      scriptSrc: string[];
      styleSrc: string[];
      imgSrc: string[];
      fontSrc: string[];
      connectSrc: string[];
      frameSrc: string[];
      objectSrc: string[];
    };
  };

  // 数据验证配置
  validation: {
    enabled: boolean;
    maxFieldLength: number;
    maxNestingDepth: number;
    strictMode: boolean;
    sanitizeInput: boolean;
  };

  // 日志和监控配置
  logging: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    maxLogEntries: number;
    enableRemoteLogging: boolean;
    remoteEndpoint?: string;
  };

  // 隐私保护配置
  privacy: {
    enableDataMinimization: boolean;
    enableSensitiveDataDetection: boolean;
    enableDataEncryption: boolean;
    dataRetentionDays: number;
  };

  // 访问控制配置
  access: {
    enableRateLimit: boolean;
    maxRequestsPerMinute: number;
    enableIPWhitelist: boolean;
    allowedIPs: string[];
    enableUserAgentValidation: boolean;
  };
}

/**
 * 默认安全配置
 */
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  xss: {
    enabled: true,
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'svg', 'g', 'path', 'circle', 'rect', 'line', 'text', 'defs', 'marker'
    ],
    allowedAttributes: [
      'href', 'src', 'alt', 'title', 'class', 'id',
      'width', 'height', 'style',
      'target', 'rel',
      'viewBox', 'xmlns', 'd', 'fill', 'stroke', 'stroke-width',
      'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
      'transform', 'text-anchor', 'font-size', 'font-family'
    ],
    forbiddenTags: [
      'script', 'object', 'embed', 'form', 'input', 'textarea', 
      'select', 'button', 'iframe', 'frame', 'frameset'
    ],
    forbiddenAttributes: [
      'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 
      'onblur', 'onchange', 'onsubmit', 'onreset', 'onselect',
      'onkeydown', 'onkeyup', 'onkeypress'
    ],
    maxContentLength: 50000
  },

  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "'unsafe-eval'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https:",
        "blob:"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net"
      ],
      connectSrc: [
        "'self'",
        "https:",
        "wss:"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },

  validation: {
    enabled: true,
    maxFieldLength: 10000,
    maxNestingDepth: 10,
    strictMode: true,
    sanitizeInput: true
  },

  logging: {
    enabled: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    maxLogEntries: 1000,
    enableRemoteLogging: false,
    remoteEndpoint: undefined
  },

  privacy: {
    enableDataMinimization: true,
    enableSensitiveDataDetection: true,
    enableDataEncryption: false, // 前端加密有限，主要依赖HTTPS
    dataRetentionDays: 30
  },

  access: {
    enableRateLimit: false, // 前端应用通常不需要
    maxRequestsPerMinute: 60,
    enableIPWhitelist: false,
    allowedIPs: [],
    enableUserAgentValidation: false
  }
};

/**
 * 环境特定的安全配置
 */
export const ENVIRONMENT_CONFIGS: Record<string, Partial<SecurityConfig>> = {
  development: {
    logging: {
      enabled: true,
      logLevel: 'debug',
      maxLogEntries: 500,
      enableRemoteLogging: false
    },
    validation: {
      enabled: true,
      strictMode: false,
      sanitizeInput: true
    }
  },

  production: {
    logging: {
      enabled: true,
      logLevel: 'error',
      maxLogEntries: 100,
      enableRemoteLogging: false
    },
    validation: {
      enabled: true,
      strictMode: true,
      sanitizeInput: true
    },
    xss: {
      enabled: true,
      maxContentLength: 30000 // 生产环境更严格
    }
  },

  test: {
    logging: {
      enabled: false,
      logLevel: 'error',
      maxLogEntries: 50,
      enableRemoteLogging: false
    },
    validation: {
      enabled: true,
      strictMode: true,
      sanitizeInput: true
    }
  }
};

/**
 * 安全配置管理器
 */
export class SecurityConfigManager {
  private static instance: SecurityConfigManager;
  private config: SecurityConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): SecurityConfigManager {
    if (!SecurityConfigManager.instance) {
      SecurityConfigManager.instance = new SecurityConfigManager();
    }
    return SecurityConfigManager.instance;
  }

  /**
   * 加载配置
   */
  private loadConfig(): SecurityConfig {
    const environment = process.env.NODE_ENV || 'development';
    const envConfig = ENVIRONMENT_CONFIGS[environment] || {};
    
    // 深度合并配置
    return this.deepMerge(DEFAULT_SECURITY_CONFIG, envConfig);
  }

  /**
   * 深度合并对象
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * 获取配置
   */
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  /**
   * 获取特定配置项
   */
  get<T>(path: string): T | undefined {
    const keys = path.split('.');
    let current: any = this.config;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current as T;
  }

  /**
   * 更新配置
   */
  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = this.deepMerge(this.config, updates);
  }

  /**
   * 验证配置有效性
   */
  validateConfig(): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 验证XSS配置
    if (this.config.xss.enabled) {
      if (!Array.isArray(this.config.xss.allowedTags)) {
        errors.push('XSS allowedTags must be an array');
      }
      if (this.config.xss.maxContentLength <= 0) {
        errors.push('XSS maxContentLength must be positive');
      }
    }

    // 验证CSP配置
    if (this.config.csp.enabled) {
      const requiredDirectives = ['defaultSrc', 'scriptSrc', 'styleSrc'];
      for (const directive of requiredDirectives) {
        if (!Array.isArray(this.config.csp.directives[directive as keyof typeof this.config.csp.directives])) {
          errors.push(`CSP directive ${directive} must be an array`);
        }
      }
    }

    // 验证验证配置
    if (this.config.validation.maxFieldLength <= 0) {
      errors.push('Validation maxFieldLength must be positive');
    }
    if (this.config.validation.maxNestingDepth <= 0) {
      errors.push('Validation maxNestingDepth must be positive');
    }

    // 验证日志配置
    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(this.config.logging.logLevel)) {
      errors.push(`Invalid log level: ${this.config.logging.logLevel}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 生成CSP头部字符串
   */
  generateCSPHeader(): string {
    if (!this.config.csp.enabled) {
      return '';
    }

    const directives: string[] = [];
    
    for (const [directive, sources] of Object.entries(this.config.csp.directives)) {
      if (Array.isArray(sources) && sources.length > 0) {
        const kebabDirective = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
        directives.push(`${kebabDirective} ${sources.join(' ')}`);
      }
    }

    return directives.join('; ');
  }

  /**
   * 检查是否启用了特定安全功能
   */
  isFeatureEnabled(feature: string): boolean {
    switch (feature) {
      case 'xss':
        return this.config.xss.enabled;
      case 'csp':
        return this.config.csp.enabled;
      case 'validation':
        return this.config.validation.enabled;
      case 'logging':
        return this.config.logging.enabled;
      case 'sensitiveDataDetection':
        return this.config.privacy.enableSensitiveDataDetection;
      default:
        return false;
    }
  }

  /**
   * 获取配置摘要
   */
  getConfigSummary(): {
    environment: string;
    enabledFeatures: string[];
    securityLevel: 'low' | 'medium' | 'high';
  } {
    const enabledFeatures: string[] = [];
    
    if (this.config.xss.enabled) enabledFeatures.push('XSS Protection');
    if (this.config.csp.enabled) enabledFeatures.push('CSP');
    if (this.config.validation.enabled) enabledFeatures.push('Data Validation');
    if (this.config.logging.enabled) enabledFeatures.push('Security Logging');
    if (this.config.privacy.enableSensitiveDataDetection) enabledFeatures.push('Sensitive Data Detection');

    let securityLevel: 'low' | 'medium' | 'high' = 'low';
    if (enabledFeatures.length >= 4) {
      securityLevel = 'high';
    } else if (enabledFeatures.length >= 2) {
      securityLevel = 'medium';
    }

    return {
      environment: process.env.NODE_ENV || 'development',
      enabledFeatures,
      securityLevel
    };
  }
}

// 导出单例实例
export const securityConfig = SecurityConfigManager.getInstance();
