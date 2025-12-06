/**
 * 资源加载配置
 * 
 * 统一管理图片、音频等资源的加载策略
 * 
 * @author dedenlabs
 * @date 2025-08-02
 */

// 本地解析函数
const parseEnvNumber = (envValue: string | undefined, defaultValue: number): number => {
  if (!envValue) return defaultValue;
  const parsed = parseInt(envValue, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseEnvBoolean = (envValue: string | undefined, defaultValue: boolean): boolean => {
  if (!envValue) return defaultValue;
  return envValue.toLowerCase() === 'true';
};

/**
 * 资源加载配置接口
 */
export interface ResourceLoadingConfig {
  /** 最大重试次数 */
  maxRetries: number;
  /** 是否启用CDN回退 */
  enableCDNFallback: boolean;
  /** 重试延迟时间(毫秒) */
  retryDelay: number;
  /** 请求超时时间(毫秒) */
  timeoutMs: number;
  /** 是否使用智能选择 */
  useSmartSelection: boolean;
}

/**
 * 默认资源加载配置
 */
export const DEFAULT_RESOURCE_LOADING_CONFIG: ResourceLoadingConfig = {
  maxRetries: parseEnvNumber(import.meta.env?.VITE_RESOURCE_MAX_RETRIES, 0),
  enableCDNFallback: parseEnvBoolean(import.meta.env?.VITE_RESOURCE_ENABLE_CDN_FALLBACK, true),
  retryDelay: parseEnvNumber(import.meta.env?.VITE_RESOURCE_RETRY_DELAY, 1000),
  timeoutMs: parseEnvNumber(import.meta.env?.VITE_RESOURCE_TIMEOUT, 5000),
  useSmartSelection: parseEnvBoolean(import.meta.env?.VITE_RESOURCE_USE_SMART_SELECTION, true),
};

/**
 * 图片加载专用配置
 */
export const IMAGE_LOADING_CONFIG: ResourceLoadingConfig = {
  ...DEFAULT_RESOURCE_LOADING_CONFIG,
  maxRetries: 0, // 图片不重试，直接切换CDN源
  timeoutMs: 8000, // 图片加载超时时间稍长
};

/**
 * 音频加载专用配置
 */
export const AUDIO_LOADING_CONFIG: ResourceLoadingConfig = {
  ...DEFAULT_RESOURCE_LOADING_CONFIG,
  maxRetries: 0, // 音频也不重试，保持一致性
  timeoutMs: 10000, // 音频文件通常较大，超时时间更长
};

/**
 * 获取资源加载配置
 */
export function getResourceLoadingConfig(type?: 'image' | 'audio'): ResourceLoadingConfig {
  switch (type) {
    case 'image':
      return { ...IMAGE_LOADING_CONFIG };
    case 'audio':
      return { ...AUDIO_LOADING_CONFIG };
    default:
      return { ...DEFAULT_RESOURCE_LOADING_CONFIG };
  }
}

/**
 * 获取图片加载配置
 */
export function getImageLoadingConfig(): ResourceLoadingConfig {
  return getResourceLoadingConfig('image');
}

/**
 * 获取音频加载配置
 */
export function getAudioLoadingConfig(): ResourceLoadingConfig {
  return getResourceLoadingConfig('audio');
}

/**
 * 更新资源加载配置
 */
export function updateResourceLoadingConfig(
  type: 'default' | 'image' | 'audio',
  updates: Partial<ResourceLoadingConfig>
): void {
  switch (type) {
    case 'image':
      Object.assign(IMAGE_LOADING_CONFIG, updates);
      break;
    case 'audio':
      Object.assign(AUDIO_LOADING_CONFIG, updates);
      break;
    case 'default':
      Object.assign(DEFAULT_RESOURCE_LOADING_CONFIG, updates);
      break;
  }
}

/**
 * 验证资源加载配置
 */
export function validateResourceLoadingConfig(config: ResourceLoadingConfig): boolean {
  return (
    typeof config.maxRetries === 'number' &&
    config.maxRetries >= 0 &&
    typeof config.enableCDNFallback === 'boolean' &&
    typeof config.retryDelay === 'number' &&
    config.retryDelay >= 0 &&
    typeof config.timeoutMs === 'number' &&
    config.timeoutMs > 0 &&
    typeof config.useSmartSelection === 'boolean'
  );
}

/**
 * 获取配置的调试信息
 */
export function getResourceLoadingConfigDebugInfo(): {
  default: ResourceLoadingConfig;
  image: ResourceLoadingConfig;
  audio: ResourceLoadingConfig;
} {
  return {
    default: { ...DEFAULT_RESOURCE_LOADING_CONFIG },
    image: { ...IMAGE_LOADING_CONFIG },
    audio: { ...AUDIO_LOADING_CONFIG },
  };
}
