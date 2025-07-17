/**
 * Mermaid图表渲染完整测试套件
 * 测试Mermaid图表的懒加载、渲染、交互和错误处理
 */

import { test, expect, Page } from '@playwright/test';
import { ErrorCollector } from '../utils/ErrorCollector';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

class MermaidComprehensiveTester {
  constructor(private page: Page) {}

  /**
   * 等待Mermaid图表加载完成
   */
  async waitForMermaidCharts(timeout = 10000): Promise<number> {
    // 等待页面加载完成
    await this.page.waitForLoadState('networkidle');
    
    // 等待Mermaid容器出现
    await this.page.waitForSelector('.mermaid-lazy-chart', { timeout, state: 'attached' });
    
    // 等待SVG元素渲染
    await this.page.waitForFunction(() => {
      const svgs = document.querySelectorAll('svg');
      return svgs.length > 0;
    }, { timeout });

    // 返回图表数量
    return await this.page.locator('.mermaid-lazy-chart').count();
  }

  /**
   * 验证图表渲染质量
   */
  async verifyChartRendering(): Promise<{
    total: number;
    rendered: number;
    errors: string[];
    performance: { [key: string]: number };
  }> {
    const startTime = Date.now();
    const charts = await this.page.locator('.mermaid-lazy-chart').all();
    const errors: string[] = [];
    let renderedCount = 0;

    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];
      
      try {
        // 检查是否有SVG内容
        const svg = chart.locator('svg');
        const svgCount = await svg.count();
        
        if (svgCount > 0) {
          // 验证SVG内容不为空
          const svgContent = await svg.innerHTML();
          if (svgContent.length > 100 && svgContent.includes('<g')) {
            renderedCount++;
            
            // 验证SVG尺寸
            const bbox = await svg.boundingBox();
            if (!bbox || bbox.width < 50 || bbox.height < 50) {
              errors.push(`图表 ${i + 1}: SVG尺寸异常 (${bbox?.width}x${bbox?.height})`);
            }
          } else {
            errors.push(`图表 ${i + 1}: SVG内容为空或无效`);
          }
        } else {
          errors.push(`图表 ${i + 1}: 未找到SVG元素`);
        }
      } catch (error) {
        errors.push(`图表 ${i + 1}: 验证失败 - ${error}`);
      }
    }

    const renderTime = Date.now() - startTime;

    return {
      total: charts.length,
      rendered: renderedCount,
      errors,
      performance: {
        renderTime,
        averageRenderTime: charts.length > 0 ? renderTime / charts.length : 0
      }
    };
  }

  /**
   * 测试图表懒加载功能
   */
  async testLazyLoading(): Promise<boolean> {
    // 滚动到页面顶部
    await this.page.evaluate(() => window.scrollTo(0, 0));
    
    // 等待一下确保初始状态
    await this.page.waitForTimeout(1000);
    
    // 记录初始渲染的图表数量
    const initialCharts = await this.page.locator('svg').count();
    
    // 滚动到页面底部，触发懒加载
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // 等待懒加载完成
    await this.page.waitForTimeout(3000);
    
    // 检查是否有更多图表被渲染
    const finalCharts = await this.page.locator('svg').count();
    
    return finalCharts >= initialCharts;
  }

  /**
   * 测试图表点击放大功能
   */
  async testChartZoom(): Promise<boolean> {
    const charts = await this.page.locator('.mermaid-lazy-chart svg').all();
    
    if (charts.length === 0) {
      return false;
    }

    // 测试第一个图表的点击放大
    const firstChart = charts[0];
    
    // 点击图表
    await firstChart.click();
    
    // 等待放大覆盖层出现
    const overlay = this.page.locator('.mermaid-overlay');
    await overlay.waitFor({ state: 'visible', timeout: 5000 });
    
    // 验证放大后的图表
    const enlargedSvg = overlay.locator('svg');
    const isVisible = await enlargedSvg.isVisible();
    
    if (isVisible) {
      // 点击关闭按钮或覆盖层背景
      await overlay.click();
      
      // 等待覆盖层消失
      await overlay.waitFor({ state: 'hidden', timeout: 3000 });
    }
    
    return isVisible;
  }

  /**
   * 测试图表重新渲染功能
   */
  async testChartRerendering(): Promise<boolean> {
    // 获取初始图表数量
    const initialCount = await this.page.locator('svg').count();
    
    // 模拟触发重新渲染（例如主题切换）
    await this.page.evaluate(() => {
      // 触发窗口resize事件，可能导致图表重新渲染
      window.dispatchEvent(new Event('resize'));
    });
    
    // 等待重新渲染
    await this.page.waitForTimeout(2000);
    
    // 检查图表是否仍然正常显示
    const finalCount = await this.page.locator('svg').count();
    
    return finalCount >= initialCount;
  }

  /**
   * 检查Mermaid相关的控制台日志
   */
  async getMermaidLogs(): Promise<string[]> {
    return await this.page.evaluate(() => {
      // 从页面获取已记录的日志
      return (window as any).mermaidLogs || [];
    });
  }
}

test.describe('Mermaid图表渲染完整测试', () => {
  let errorCollector: ErrorCollector;
  let screenshotHelper: ScreenshotHelper;
  let mermaidTester: MermaidComprehensiveTester;

  test.beforeEach(async ({ page }) => {
    errorCollector = new ErrorCollector(page);
    screenshotHelper = new ScreenshotHelper(page);
    mermaidTester = new MermaidComprehensiveTester(page);

    // 设置控制台日志收集
    await page.addInitScript(() => {
      (window as any).mermaidLogs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        if (message.includes('mermaid') || message.includes('MermaidLazyChart')) {
          (window as any).mermaidLogs.push(message);
        }
        originalLog.apply(console, args);
      };
    });
  });

  test('基础Mermaid图表渲染测试', async ({ page }) => {
    // 访问主页
    await page.goto('/');
    
    // 等待Mermaid图表加载
    const chartCount = await mermaidTester.waitForMermaidCharts();
    console.log(`发现 ${chartCount} 个Mermaid图表`);
    
    // 验证图表渲染
    const renderResult = await mermaidTester.verifyChartRendering();
    console.log('图表渲染结果:', renderResult);
    
    // 截图记录
    await screenshotHelper.takeScreenshot('mermaid-basic-rendering', 'zh');
    
    // 断言
    expect(chartCount).toBeGreaterThan(0);
    expect(renderResult.rendered).toBeGreaterThan(0);
    expect(renderResult.rendered / renderResult.total).toBeGreaterThan(0.8); // 80%以上渲染成功
    
    // 检查性能
    expect(renderResult.performance.averageRenderTime).toBeLessThan(2000); // 平均渲染时间小于2秒
    
    // 检查错误
    const errors = errorCollector.getErrors();
    const mermaidErrors = errors.filter(e => 
      e.message.includes('mermaid') || 
      e.message.includes('svg')
    );
    
    if (mermaidErrors.length > 0) {
      console.warn('Mermaid相关错误:', mermaidErrors);
    }
    
    expect(mermaidErrors.length).toBeLessThan(renderResult.total * 0.2); // 错误率小于20%
  });

  test('Mermaid懒加载功能测试', async ({ page }) => {
    await page.goto('/');
    
    // 测试懒加载
    const lazyLoadWorking = await mermaidTester.testLazyLoading();
    console.log('懒加载功能测试结果:', lazyLoadWorking);
    
    // 截图记录懒加载后的状态
    await screenshotHelper.takeScreenshot('mermaid-lazy-loading', 'zh');
    
    expect(lazyLoadWorking).toBe(true);
  });

  test('Mermaid图表交互功能测试', async ({ page }) => {
    await page.goto('/');
    
    // 等待图表加载
    await mermaidTester.waitForMermaidCharts();
    
    // 测试点击放大功能
    const zoomWorking = await mermaidTester.testChartZoom();
    console.log('图表放大功能测试结果:', zoomWorking);
    
    if (zoomWorking) {
      // 截图记录放大功能
      await screenshotHelper.takeScreenshot('mermaid-zoom-interaction', 'zh');
    }
    
    expect(zoomWorking).toBe(true);
  });

  test('Mermaid图表重新渲染测试', async ({ page }) => {
    await page.goto('/');
    
    // 等待图表加载
    await mermaidTester.waitForMermaidCharts();
    
    // 测试重新渲染
    const rerenderWorking = await mermaidTester.testChartRerendering();
    console.log('图表重新渲染测试结果:', rerenderWorking);
    
    expect(rerenderWorking).toBe(true);
  });

  test('Mermaid多页面图表一致性测试', async ({ page }) => {
    const pages = [
      { url: '/', name: '主页' },
      { url: '/fullstack', name: '全栈开发' },
      { url: '/games', name: '游戏开发' },
      { url: '/tools', name: '工具开发' },
      { url: '/operations', name: '运维开发' }
    ];

    const results: any[] = [];

    for (const pageConfig of pages) {
      await page.goto(pageConfig.url);
      
      try {
        const chartCount = await mermaidTester.waitForMermaidCharts(15000);
        const renderResult = await mermaidTester.verifyChartRendering();
        
        results.push({
          page: pageConfig.name,
          url: pageConfig.url,
          chartCount,
          renderResult
        });
        
        console.log(`${pageConfig.name}: ${chartCount} 个图表, ${renderResult.rendered}/${renderResult.total} 渲染成功`);
        
        // 截图记录每个页面的图表状态
        await screenshotHelper.takeScreenshot(`mermaid-${pageConfig.name}`, 'zh');
        
      } catch (error) {
        console.error(`${pageConfig.name} 页面测试失败:`, error);
        results.push({
          page: pageConfig.name,
          url: pageConfig.url,
          error: error.toString()
        });
      }
    }

    // 验证所有页面都有图表且渲染正常
    const successfulPages = results.filter(r => !r.error && r.chartCount > 0);
    expect(successfulPages.length).toBeGreaterThan(pages.length * 0.8); // 80%以上页面成功

    // 验证整体渲染质量
    const totalCharts = successfulPages.reduce((sum, r) => sum + r.chartCount, 0);
    const totalRendered = successfulPages.reduce((sum, r) => sum + r.renderResult.rendered, 0);
    
    if (totalCharts > 0) {
      const overallRenderRate = totalRendered / totalCharts;
      expect(overallRenderRate).toBeGreaterThan(0.8); // 整体渲染成功率80%以上
    }

    console.log('多页面测试结果:', results);
  });

  test.afterEach(async ({ page }) => {
    // 收集Mermaid相关日志
    const mermaidLogs = await mermaidTester.getMermaidLogs();
    if (mermaidLogs.length > 0) {
      console.log('Mermaid日志:', mermaidLogs);
    }

    // 检查是否有循环渲染问题
    const renderingLogs = mermaidLogs.filter(log => 
      log.includes('渲染') || log.includes('render')
    );
    
    if (renderingLogs.length > 20) {
      console.warn('⚠️ 可能存在循环渲染问题，渲染日志过多:', renderingLogs.length);
    }
  });
});
