/**
 * 默认项目配置
 * Default project configuration
 */
export const defaultProjectConfig: ProjectConfig = {
  cdn: {
    enabled: true,
    baseUrls: [
      "https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/",
      "https://flexiresume-static.web.app/",
      "https://dedenlabs.github.io/flexiresume-static/",
    ],
    healthCheck: {
      timeout: 5000, // 5秒超时
      testPath: "favicon.ico", // 使用favicon作为测试文件
      enabled: true,
    },
    sortingStrategy: {
      mode: 'speed', // 默认使用速度优先策略
      enabled: true,
      speedWeight: 0.7, // 速度权重70%
      availabilityWeight: 0.3, // 可用性权重30%
    },
  },
  
  api: {
    baseUrl: (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) || "",
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
    // 大型库预加载配置
    preloadLibraries: {
      mermaid: true,        // 预加载Mermaid图表库
      svgPanZoom: true,     // 预加载SVG缩放库
      katex: false,         // 按需加载数学公式库
      cytoscape: false,     // 按需加载图形布局库
    },
  },
  
  app: {
    name: "FlexiResume",
    version: (typeof process !== 'undefined' && process.env?.REACT_APP_VERSION) || "1.0.0",
    buildTime: (typeof process !== 'undefined' && process.env?.REACT_APP_BUILD_TIME) || new Date().toISOString(),
    isDevelopment: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || false,
  },
  
  debug: {
    enabled: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || false,
    showPerformanceMonitor: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || false,
    verboseLogging: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || false,
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

  /** CDN智能排序策略 / CDN intelligent sorting strategy */
  sortingStrategy: {
    /** 排序模式 / Sorting mode
     * 'availability': 可用性优先 - 响应正常的URL排前面，无响应的移至末尾
     * 'speed': 速度优先 - 按响应速度排序，响应快的排前面
     */
    mode: 'availability' | 'speed';

    /** 是否启用智能排序 / Whether to enable intelligent sorting */
    enabled: boolean;

    /** 速度权重因子（仅在speed模式下有效） / Speed weight factor (only effective in speed mode) */
    speedWeight: number;

    /** 可用性权重因子 / Availability weight factor */
    availabilityWeight: number;
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

  /** 大型库预加载配置 / Large library preloading configuration */
  preloadLibraries: {
    /** 是否预加载Mermaid图表库 / Whether to preload Mermaid chart library */
    mermaid: boolean;
    /** 是否预加载SVG缩放库 / Whether to preload SVG pan-zoom library */
    svgPanZoom: boolean;
    /** 是否预加载数学公式库 / Whether to preload KaTeX library */
    katex: boolean;
    /** 是否预加载图形布局库 / Whether to preload Cytoscape library */
    cytoscape: boolean;
  };
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
