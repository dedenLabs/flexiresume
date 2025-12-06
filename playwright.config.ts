import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 测试配置
 * 用于 FlexiResume 项目的全面功能测试
 * 
 * 测试覆盖：
 * - 5个简历页面的功能测试
 * - 语言切换功能验证
 * - Mermaid图表渲染测试
 * - 主题切换功能测试
 * - 响应式设计验证
 * - 错误检测和性能监控
 */
export default defineConfig({
  // 测试文件目录
  testDir: './tests',
  
  // 测试超时设置
  timeout: 60000, // 60秒超时
  expect: {
    timeout: 10000 // 断言超时10秒
  },
  
  // 并行执行设置
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  // 重试设置
  retries: process.env.CI ? 2 : 1,
  
  // 工作进程数
  workers: process.env.CI ? 1 : undefined,
  
  // 测试报告配置
  reporter: [
    ['html', { 
      outputFolder: 'tests/reports/html',
      open: 'never' 
    }],
    ['json', { 
      outputFile: 'tests/reports/test-results.json' 
    }],
    ['junit', { 
      outputFile: 'tests/reports/junit.xml' 
    }],
    ['list']
  ],
  
  // 全局测试配置
  use: {
    // 基础URL - 开发服务器地址
    baseURL: 'http://localhost:5174',
    
    // 浏览器配置
    headless: true, // 无头模式，CI环境下使用
    viewport: { width: 1280, height: 720 },
    
    // 截图配置
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // 等待策略
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // 忽略HTTPS错误
    ignoreHTTPSErrors: true,
    
    // 额外的浏览器上下文选项
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  },
  
  // 测试项目配置 - 多浏览器支持
  projects: [
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },
    
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },
    
    // 移动端测试
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'] 
      },
    },
    
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'] 
      },
    },
    
    // 平板测试
    {
      name: 'tablet-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 }
      },
    }
  ],
  
  // 开发服务器配置
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2分钟启动超时
    stdout: 'ignore',
    stderr: 'pipe',
  },
  
  // 全局设置和清理
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',
  
  // 输出目录
  outputDir: 'tests/test-results',
});
