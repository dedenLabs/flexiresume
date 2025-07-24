import { Page, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * 测试工具函数集合
 * 提供通用的测试功能，如语言切换、截图、错误收集等
 */

export interface TestError {
  type: 'console' | 'network' | 'javascript';
  message: string;
  timestamp: string;
  url?: string;
  stack?: string;
}

export interface LanguageTestResult {
  success: boolean;
  language: string;
  errors: TestError[];
  screenshotPath?: string;
}

/**
 * 页面错误收集器
 */
export class ErrorCollector {
  private errors: TestError[] = [];
  
  constructor(private page: Page) {
    this.setupErrorListeners();
  }
  
  private setupErrorListeners() {
    // 监听控制台错误
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.errors.push({
          type: 'console',
          message: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // 监听页面错误
    this.page.on('pageerror', error => {
      this.errors.push({
        type: 'javascript',
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      });
    });
    
    // 监听网络请求失败
    this.page.on('requestfailed', request => {
      this.errors.push({
        type: 'network',
        message: `Failed to load: ${request.url()}`,
        timestamp: new Date().toISOString(),
        url: request.url()
      });
    });
  }
  
  getErrors(): TestError[] {
    return [...this.errors];
  }
  
  clearErrors() {
    this.errors = [];
  }
  
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}

/**
 * 语言切换测试工具
 */
export class LanguageSwitcher {
  constructor(private page: Page) {}
  
  /**
   * 切换到指定语言
   */
  async switchToLanguage(language: 'zh' | 'en'): Promise<void> {
    // 查找语言切换器
    const languageSwitcher = this.page.locator('[data-language-switcher]');
    await expect(languageSwitcher).toBeVisible({ timeout: 10000 });

    // 检查当前语言，如果已经是目标语言则跳过
    const currentText = await languageSwitcher.textContent();
    const isAlreadyTargetLanguage = language === 'zh'
      ? currentText?.includes('中文')
      : currentText?.includes('English');

    if (isAlreadyTargetLanguage) {
      console.log(`已经是 ${language} 语言，跳过切换`);
      return;
    }

    // 点击语言切换器打开下拉菜单
    await languageSwitcher.click();

    // 等待下拉菜单出现
    await this.page.waitForTimeout(1000);

    // 根据语言选择对应选项，使用更精确的选择器
    if (language === 'zh') {
      // 查找下拉菜单中的中文选项
      const zhOption = this.page.locator('[data-language-switcher] + div button:has-text("中文")').first();
      await zhOption.click();
    } else {
      // 查找下拉菜单中的英文选项
      const enOption = this.page.locator('[data-language-switcher] + div button:has-text("English")').first();
      await enOption.click();
    }

    // 等待语言切换完成
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * 验证当前语言
   */
  async verifyCurrentLanguage(expectedLanguage: 'zh' | 'en'): Promise<boolean> {
    try {
      // 检查语言切换器显示的当前语言
      const languageSwitcher = this.page.locator('[data-language-switcher]');
      const switcherText = await languageSwitcher.textContent();
      
      if (expectedLanguage === 'zh') {
        return switcherText?.includes('中文') || switcherText?.includes('简体') || false;
      } else {
        return switcherText?.includes('English') || switcherText?.includes('EN') || false;
      }
    } catch (error) {
      console.error('验证语言失败:', error);
      return false;
    }
  }
}

/**
 * Mermaid图表测试工具
 */
export class MermaidTester {
  constructor(private page: Page) {}
  
  /**
   * 等待Mermaid图表渲染完成
   */
  async waitForMermaidCharts(): Promise<number> {
    // 等待页面加载完成
    await this.page.waitForLoadState('networkidle');
    
    // 等待Mermaid图表容器出现
    await this.page.waitForTimeout(2000);
    
    // 查找所有Mermaid图表
    const charts = await this.page.locator('svg[id^="mermaid-"]').count();
    
    if (charts > 0) {
      // 等待SVG元素完全渲染
      await this.page.waitForTimeout(3000);
    }
    
    return charts;
  }
  
  /**
   * 验证Mermaid图表是否正确渲染
   */
  async verifyMermaidCharts(): Promise<{ total: number; rendered: number; errors: string[] }> {
    const errors: string[] = [];
    
    // 获取所有Mermaid图表
    const charts = this.page.locator('svg[id^="mermaid-"]');
    const total = await charts.count();
    let rendered = 0;
    
    for (let i = 0; i < total; i++) {
      const chart = charts.nth(i);
      
      try {
        // 检查SVG是否可见
        await expect(chart).toBeVisible();
        
        // 检查SVG是否有内容
        const content = await chart.innerHTML();
        if (content.trim().length > 0) {
          rendered++;
        } else {
          errors.push(`图表 ${i + 1} 没有内容`);
        }
      } catch (error) {
        errors.push(`图表 ${i + 1} 渲染失败: ${error}`);
      }
    }
    
    return { total, rendered, errors };
  }
}

/**
 * 截图工具
 */
export class ScreenshotHelper {
  constructor(private page: Page) {}
  
  /**
   * 截取页面截图
   */
  async takeScreenshot(
    filename: string, 
    language: 'zh' | 'en',
    options?: { fullPage?: boolean; clip?: { x: number; y: number; width: number; height: number } }
  ): Promise<string> {
    const screenshotDir = `tests/screenshots/${language}`;
    const screenshotPath = path.join(screenshotDir, `${filename}.png`);
    
    // 确保目录存在
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    // 截图
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: options?.fullPage ?? true,
      clip: options?.clip
    });
    
    return screenshotPath;
  }
  
  /**
   * 截取元素截图
   */
  async takeElementScreenshot(
    selector: string,
    filename: string,
    language: 'zh' | 'en'
  ): Promise<string> {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();
    
    const screenshotDir = `tests/screenshots/${language}`;
    const screenshotPath = path.join(screenshotDir, `${filename}.png`);
    
    // 确保目录存在
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    await element.screenshot({ path: screenshotPath });
    
    return screenshotPath;
  }
}

/**
 * 响应式测试工具
 */
export class ResponsiveTester {
  constructor(private page: Page) {}
  
  /**
   * 测试不同屏幕尺寸
   */
  async testViewports(viewports: { name: string; width: number; height: number }[]): Promise<void> {
    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(1000); // 等待布局调整
      
      // 验证页面在当前视口下正常显示
      await expect(this.page.locator('body')).toBeVisible();
    }
  }
}

/**
 * 性能测试工具
 */
export class PerformanceTester {
  constructor(private page: Page) {}
  
  /**
   * 测量页面加载性能
   */
  async measurePageLoad(): Promise<{ loadTime: number; domContentLoaded: number; firstPaint: number }> {
    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      // 添加错误处理和备用值
      const loadTime = navigation && navigation.loadEventEnd && navigation.navigationStart
        ? navigation.loadEventEnd - navigation.navigationStart
        : 0;

      const domContentLoaded = navigation && navigation.domContentLoadedEventEnd && navigation.navigationStart
        ? navigation.domContentLoadedEventEnd - navigation.navigationStart
        : 0;

      const firstPaint = performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-paint')?.startTime || 0;

      return {
        loadTime: loadTime > 0 ? loadTime : 0,
        domContentLoaded: domContentLoaded > 0 ? domContentLoaded : 0,
        firstPaint: firstPaint > 0 ? firstPaint : 0
      };
    });

    return performanceMetrics;
  }
}
