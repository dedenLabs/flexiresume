/**
 * 默认项目配置
 * Default project configuration
 */
export const defaultProjectConfig: ProjectConfig = {
  cdn: {
    enabled: true,
    baseUrls: [
      "https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/",
      "https://flexi-77796.web.app/",
      "https://dedenlabs.github.io/flexiresume-static/",
    ],
    healthCheck: {
      timeout: 5000, // 5秒超时
      testPath: "favicon.ico", // 使用favicon作为测试文件
      enabled: true,
    },
  },
  
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || "",
    timeout: 10000, // 10秒超时
    version: "v1",
  },
  
  theme: {
    defaultTheme: 'auto',
    enableTransitions: true,
    transitionDuration: 300,
  },
  
  performance: {
    enableLazyLoading: true,
    lazyLoadingThreshold: 100,
    enablePreloading: true,
    preloadResources: [
      "/images/avatar.webp",
      "/images/background.webp",
    ],
  },
  
  app: {
    name: "FlexiResume",
    version: process.env.REACT_APP_VERSION || "1.0.0",
    buildTime: process.env.REACT_APP_BUILD_TIME || new Date().toISOString(),
    isDevelopment: process.env.NODE_ENV === 'development',
  },
  
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    showPerformanceMonitor: process.env.NODE_ENV === 'development',
    verboseLogging: process.env.NODE_ENV === 'development',
  },
};

/**
 * 获取项目配置
 * Get project configuration
 */
export const getProjectConfig = (): ProjectConfig => {
  // 在生产环境中，可以从远程配置服务加载配置
  // In production, configuration can be loaded from remote config service
  return defaultProjectConfig;
};

/**
 * 更新CDN配置（运行时）
 * Update CDN configuration at runtime
 */
export const updateCDNConfig = (newConfig: Partial<CDNConfig>): void => {
  Object.assign(defaultProjectConfig.cdn, newConfig);
};

/**
 * 获取当前CDN配置
 * Get current CDN configuration
 */
export const getCDNConfig = (): CDNConfig => {
  return defaultProjectConfig.cdn;
};

/**
 * 检查是否为开发环境
 * Check if in development environment
 */
export const isDevelopment = (): boolean => {
  return defaultProjectConfig.app.isDevelopment;
};

/**
 * 检查是否启用调试模式
 * Check if debug mode is enabled
 */
export const isDebugEnabled = (): boolean => {
  return defaultProjectConfig.debug.enabled;
};


/**
 * FlexiResume 项目全局配置
 * Global Project Configuration for FlexiResume
 * 
 * 此文件包含项目级别的配置，与具体简历数据无关
 * This file contains project-level configurations, independent of specific resume data
 */

export interface CDNConfig {
  /** 是否启用CDN加载静态资源 / Whether to use CDN for loading static assets */
  enabled: boolean;
  
  /** CDN基础URL列表，按优先级排序 / CDN base URLs list, sorted by priority */
  baseUrls: string[];
  
  /** CDN健康检查配置 / CDN health check configuration */
  healthCheck: {
    /** 检测超时时间（毫秒） / Detection timeout in milliseconds */
    timeout: number;
    
    /** 检测路径，用于验证CDN可用性 / Detection path for CDN availability verification */
    testPath: string;
    
    /** 是否启用健康检查 / Whether to enable health check */
    enabled: boolean;
  };
}

export interface APIConfig {
  /** API基础URL / API base URL */
  baseUrl: string;
  
  /** API超时时间（毫秒） / API timeout in milliseconds */
  timeout: number;
  
  /** API版本 / API version */
  version: string;
}

export interface ThemeConfig {
  /** 默认主题 / Default theme */
  defaultTheme: 'light' | 'dark' | 'auto';
  
  /** 是否启用主题切换动画 / Whether to enable theme transition animations */
  enableTransitions: boolean;
  
  /** 主题切换动画持续时间（毫秒） / Theme transition duration in milliseconds */
  transitionDuration: number;
}

export interface PerformanceConfig {
  /** 是否启用懒加载 / Whether to enable lazy loading */
  enableLazyLoading: boolean;
  
  /** 图片懒加载阈值（像素） / Image lazy loading threshold in pixels */
  lazyLoadingThreshold: number;
  
  /** 是否启用预加载 / Whether to enable preloading */
  enablePreloading: boolean;
  
  /** 预加载资源列表 / Preload resources list */
  preloadResources: string[];
}

export interface ProjectConfig {
  /** CDN配置 / CDN configuration */
  cdn: CDNConfig;
  
  /** API配置 / API configuration */
  api: APIConfig;
  
  /** 主题配置 / Theme configuration */
  theme: ThemeConfig;
  
  /** 性能配置 / Performance configuration */
  performance: PerformanceConfig;
  
  /** 应用信息 / Application information */
  app: {
    /** 应用名称 / Application name */
    name: string;
    
    /** 应用版本 / Application version */
    version: string;
    
    /** 构建时间 / Build time */
    buildTime: string;
    
    /** 是否为开发模式 / Whether in development mode */
    isDevelopment: boolean;
  };
  
  /** 调试配置 / Debug configuration */
  debug: {
    /** 是否启用调试模式 / Whether to enable debug mode */
    enabled: boolean;
    
    /** 是否显示性能监控 / Whether to show performance monitoring */
    showPerformanceMonitor: boolean;
    
    /** 是否启用详细日志 / Whether to enable verbose logging */
    verboseLogging: boolean;
  };
}
