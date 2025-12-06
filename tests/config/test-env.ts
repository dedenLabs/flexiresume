/**
 * 测试环境配置
 * 
 * 统一管理测试环境变量和配置
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

export interface TestConfig {
  // 基础配置
  baseUrl: string;
  timeout: number;
  headless: boolean;
  
  // 浏览器配置
  browser: 'chromium' | 'firefox' | 'webkit';
  viewport: {
    width: number;
    height: number;
  };
  
  // 截图配置
  screenshot: {
    onFailure: boolean;
    dir: string;
  };
  
  // 报告配置
  report: {
    dir: string;
    generateHtml: boolean;
  };
  
  // CDN测试配置
  cdn: {
    timeout: number;
    healthCheckEnabled: boolean;
  };
  
  // 移动端测试配置
  mobile: {
    devices: string[];
  };
}


/**
 * 默认测试配置
 */
export const defaultTestConfig: TestConfig = {
  baseUrl: 'http://localhost:5177',
  timeout: 30000,
  headless: false,
  
  browser: 'chromium',
  viewport: {
    width: 1280,
    height: 720,
  },
  
  screenshot: {
    onFailure: true,
    dir: 'tests/screenshots',
  },
  
  report: {
    dir: 'tests/reports',
    generateHtml: true,
  },
  
  cdn: {
    timeout: 8000,
    healthCheckEnabled: true,
  },
  
  mobile: {
    devices: ['iPhone', 'Samsung'],
  },
};



/**
 * 获取环境变量值，支持默认值
 */
function getEnvValue<T>(key: string, defaultValue: T, parser?: (value: string) => T): T {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  
  if (parser) {
    try {
      return parser(value);
    } catch {
      console.warn(`Failed to parse env var ${key}=${value}, using default: ${defaultValue}`);
      return defaultValue;
    }
  }
  
  return value as unknown as T;
}

/**
 * 解析布尔值
 */
function parseBoolean(value: string): boolean {
  return value.toLowerCase() === 'true';
}

/**
 * 解析数字
 */
function parseNumber(value: string): number {
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return num;
}

/**
 * 解析数组
 */
function parseArray(value: string): string[] {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

/**
 * 从环境变量加载测试配置
 */
export function loadTestConfig(): TestConfig {
  return {
    baseUrl: getEnvValue('TEST_BASE_URL', defaultTestConfig.baseUrl),
    timeout: getEnvValue('TEST_TIMEOUT', defaultTestConfig.timeout, parseNumber),
    headless: getEnvValue('TEST_HEADLESS', defaultTestConfig.headless, parseBoolean),
    
    browser: getEnvValue('TEST_BROWSER', defaultTestConfig.browser) as 'chromium' | 'firefox' | 'webkit',
    viewport: {
      width: getEnvValue('TEST_VIEWPORT_WIDTH', defaultTestConfig.viewport.width, parseNumber),
      height: getEnvValue('TEST_VIEWPORT_HEIGHT', defaultTestConfig.viewport.height, parseNumber),
    },
    
    screenshot: {
      onFailure: getEnvValue('SCREENSHOT_ON_FAILURE', defaultTestConfig.screenshot.onFailure, parseBoolean),
      dir: getEnvValue('SCREENSHOT_DIR', defaultTestConfig.screenshot.dir),
    },
    
    report: {
      dir: getEnvValue('TEST_REPORT_DIR', defaultTestConfig.report.dir),
      generateHtml: getEnvValue('GENERATE_HTML_REPORT', defaultTestConfig.report.generateHtml, parseBoolean),
    },
    
    cdn: {
      timeout: getEnvValue('CDN_TEST_TIMEOUT', defaultTestConfig.cdn.timeout, parseNumber),
      healthCheckEnabled: getEnvValue('CDN_HEALTH_CHECK_ENABLED', defaultTestConfig.cdn.healthCheckEnabled, parseBoolean),
    },
    
    mobile: {
      devices: getEnvValue('MOBILE_TEST_DEVICES', defaultTestConfig.mobile.devices, parseArray),
    },
  };
}

/**
 * 全局测试配置实例
 */
export const testConfig = loadTestConfig();

/**
 * 打印当前配置（用于调试）
 */
export function printTestConfig(): void {
  console.log('🧪 Test Configuration:');
  console.log(`  Base URL: ${testConfig.baseUrl}`);
  console.log(`  Timeout: ${testConfig.timeout}ms`);
  console.log(`  Headless: ${testConfig.headless}`);
  console.log(`  Browser: ${testConfig.browser}`);
  console.log(`  Viewport: ${testConfig.viewport.width}x${testConfig.viewport.height}`);
  console.log(`  Screenshot on failure: ${testConfig.screenshot.onFailure}`);
  console.log(`  Screenshot dir: ${testConfig.screenshot.dir}`);
  console.log(`  Report dir: ${testConfig.report.dir}`);
  console.log(`  CDN timeout: ${testConfig.cdn.timeout}ms`);
  console.log(`  Mobile devices: ${testConfig.mobile.devices.join(', ')}`);
}

/**
 * 验证配置有效性
 */
export function validateTestConfig(): void {
  const config = testConfig;
  
  // 验证URL格式
  try {
    new URL(config.baseUrl);
  } catch {
    throw new Error(`Invalid base URL: ${config.baseUrl}`);
  }
  
  // 验证超时时间
  if (config.timeout <= 0) {
    throw new Error(`Invalid timeout: ${config.timeout}`);
  }
  
  // 验证视口尺寸
  if (config.viewport.width <= 0 || config.viewport.height <= 0) {
    throw new Error(`Invalid viewport size: ${config.viewport.width}x${config.viewport.height}`);
  }
  
  // 验证浏览器类型
  const validBrowsers = ['chromium', 'firefox', 'webkit'];
  if (!validBrowsers.includes(config.browser)) {
    throw new Error(`Invalid browser: ${config.browser}. Must be one of: ${validBrowsers.join(', ')}`);
  }
}

// 在模块加载时验证配置
validateTestConfig();
