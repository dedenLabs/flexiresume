/**
 * 截图助手工具类
 * 用于在测试过程中捕获屏幕截图，支持多语言和主题
 */

import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface ScreenshotOptions {
  fullPage?: boolean;
  quality?: number;
  type?: 'png' | 'jpeg';
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  mask?: string[];
  animations?: 'disabled' | 'allow';
}

export class ScreenshotHelper {
  private screenshotDir: string;
  private screenshotCounter: number = 0;

  constructor(
    private page: Page,
    baseDir: string = 'tests/screenshots'
  ) {
    this.screenshotDir = baseDir;
    this.ensureScreenshotDirectory();
  }

  /**
   * 确保截图目录存在
   */
  private ensureScreenshotDirectory(): void {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  /**
   * 生成截图文件名
   */
  private generateFileName(
    name: string,
    language?: string,
    theme?: string,
    suffix?: string
  ): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const counter = String(++this.screenshotCounter).padStart(3, '0');
    
    let fileName = `${counter}-${name}`;
    
    if (language) {
      fileName += `-${language}`;
    }
    
    if (theme) {
      fileName += `-${theme}`;
    }
    
    if (suffix) {
      fileName += `-${suffix}`;
    }
    
    fileName += `-${timestamp}.png`;
    
    return fileName;
  }

  /**
   * 获取当前页面的语言和主题
   */
  private async getCurrentPageState(): Promise<{
    language: string;
    theme: string;
    url: string;
  }> {
    const pageState = await this.page.evaluate(() => {
      return {
        language: localStorage.getItem('language') || 'zh',
        theme: document.documentElement.getAttribute('data-theme') || 'light',
        url: window.location.pathname
      };
    });

    return pageState;
  }

  /**
   * 拍摄基础截图
   */
  async takeScreenshot(
    name: string,
    language?: string,
    theme?: string,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    // 如果没有指定语言和主题，自动获取
    if (!language || !theme) {
      const pageState = await this.getCurrentPageState();
      language = language || pageState.language;
      theme = theme || pageState.theme;
    }

    const fileName = this.generateFileName(name, language, theme);
    const filePath = path.join(this.screenshotDir, fileName);

    // 等待页面稳定
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    // 默认截图选项
    const screenshotOptions = {
      path: filePath,
      fullPage: options.fullPage !== false,
      quality: options.quality || 90,
      type: options.type || 'png' as const,
      animations: options.animations || 'disabled' as const,
      ...options
    };

    await this.page.screenshot(screenshotOptions);

    console.log(`📸 截图已保存: ${fileName}`);
    return filePath;
  }

  /**
   * 拍摄对比截图（前后对比）
   */
  async takeComparisonScreenshots(
    name: string,
    beforeAction: () => Promise<void>,
    afterAction: () => Promise<void>,
    options: ScreenshotOptions = {}
  ): Promise<{
    before: string;
    after: string;
  }> {
    // 拍摄前置截图
    await beforeAction();
    const beforePath = await this.takeScreenshot(name, undefined, undefined, {
      ...options,
      // 在文件名中添加 'before' 后缀
    });

    // 执行操作
    await afterAction();

    // 拍摄后置截图
    const afterPath = await this.takeScreenshot(name, undefined, undefined, {
      ...options,
      // 在文件名中添加 'after' 后缀
    });

    return {
      before: beforePath,
      after: afterPath
    };
  }

  /**
   * 拍摄元素截图
   */
  async takeElementScreenshot(
    selector: string,
    name: string,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });

    const pageState = await this.getCurrentPageState();
    const fileName = this.generateFileName(
      `element-${name}`,
      pageState.language,
      pageState.theme
    );
    const filePath = path.join(this.screenshotDir, fileName);

    await element.screenshot({
      path: filePath,
      quality: options.quality || 90,
      type: options.type || 'png',
      animations: options.animations || 'disabled'
    });

    console.log(`📸 元素截图已保存: ${fileName}`);
    return filePath;
  }

  /**
   * 拍摄多个视口尺寸的截图
   */
  async takeResponsiveScreenshots(
    name: string,
    viewports: Array<{ width: number; height: number; name: string }> = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ],
    options: ScreenshotOptions = {}
  ): Promise<string[]> {
    const screenshots: string[] = [];

    for (const viewport of viewports) {
      await this.page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      await this.page.waitForTimeout(1000); // 等待布局调整

      const fileName = this.generateFileName(
        name,
        undefined,
        undefined,
        viewport.name
      );
      const filePath = path.join(this.screenshotDir, fileName);

      await this.page.screenshot({
        path: filePath,
        fullPage: options.fullPage !== false,
        quality: options.quality || 90,
        type: options.type || 'png',
        animations: options.animations || 'disabled'
      });

      screenshots.push(filePath);
      console.log(`📸 响应式截图已保存: ${fileName} (${viewport.width}x${viewport.height})`);
    }

    return screenshots;
  }

  /**
   * 拍摄主题对比截图
   */
  async takeThemeComparisonScreenshots(
    name: string,
    options: ScreenshotOptions = {}
  ): Promise<{
    light: string;
    dark: string;
  }> {
    // 切换到明亮主题
    await this.page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    });
    await this.page.waitForTimeout(500);

    const lightPath = await this.takeScreenshot(name, undefined, 'light', options);

    // 切换到暗色主题
    await this.page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    });
    await this.page.waitForTimeout(500);

    const darkPath = await this.takeScreenshot(name, undefined, 'dark', options);

    return {
      light: lightPath,
      dark: darkPath
    };
  }

  /**
   * 拍摄语言对比截图
   */
  async takeLanguageComparisonScreenshots(
    name: string,
    options: ScreenshotOptions = {}
  ): Promise<{
    zh: string;
    en: string;
  }> {
    // 切换到中文
    await this.page.evaluate(() => {
      localStorage.setItem('language', 'zh');
      window.location.reload();
    });
    await this.page.waitForLoadState('networkidle');

    const zhPath = await this.takeScreenshot(name, 'zh', undefined, options);

    // 切换到英文
    await this.page.evaluate(() => {
      localStorage.setItem('language', 'en');
      window.location.reload();
    });
    await this.page.waitForLoadState('networkidle');

    const enPath = await this.takeScreenshot(name, 'en', undefined, options);

    return {
      zh: zhPath,
      en: enPath
    };
  }

  /**
   * 拍摄滚动截图（长页面）
   */
  async takeScrollingScreenshot(
    name: string,
    options: ScreenshotOptions = {}
  ): Promise<string> {
    // 滚动到页面顶部
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);

    return await this.takeScreenshot(name, undefined, undefined, {
      ...options,
      fullPage: true
    });
  }

  /**
   * 清理旧截图
   */
  async cleanupOldScreenshots(daysOld: number = 7): Promise<void> {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

    try {
      const files = fs.readdirSync(this.screenshotDir);
      
      for (const file of files) {
        const filePath = path.join(this.screenshotDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ 已删除旧截图: ${file}`);
        }
      }
    } catch (error) {
      console.warn('清理旧截图时出错:', error);
    }
  }

  /**
   * 获取截图统计信息
   */
  getScreenshotStats(): {
    totalScreenshots: number;
    totalSize: number;
    averageSize: number;
  } {
    try {
      const files = fs.readdirSync(this.screenshotDir);
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(this.screenshotDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }

      return {
        totalScreenshots: files.length,
        totalSize,
        averageSize: files.length > 0 ? totalSize / files.length : 0
      };
    } catch {
      return {
        totalScreenshots: 0,
        totalSize: 0,
        averageSize: 0
      };
    }
  }
}
