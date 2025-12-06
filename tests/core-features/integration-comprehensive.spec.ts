/**
 * 核心功能综合集成测试
 * 测试Mermaid、CDN、主题切换等功能的协同工作
 */

import { test, expect, Page } from '@playwright/test';
import { ErrorCollector } from '../utils/ErrorCollector';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

class IntegrationTester {
  constructor(private page: Page) {}

  /**
   * 执行完整的功能流程测试
   */
  async executeFullWorkflow(): Promise<{
    steps: Array<{
      step: string;
      success: boolean;
      duration: number;
      error?: string;
    }>;
    totalDuration: number;
    successRate: number;
  }> {
    const steps: Array<{
      step: string;
      success: boolean;
      duration: number;
      error?: string;
    }> = [];
    
    const startTime = Date.now();

    // 步骤1: 页面加载
    const step1Start = Date.now();
    try {
      await this.page.goto('/');
      await this.page.waitForLoadState('networkidle');
      steps.push({
        step: '页面加载',
        success: true,
        duration: Date.now() - step1Start
      });
    } catch (error) {
      steps.push({
        step: '页面加载',
        success: false,
        duration: Date.now() - step1Start,
        error: error.toString()
      });
    }

    // 步骤2: CDN资源加载
    const step2Start = Date.now();
    try {
      await this.page.waitForTimeout(3000); // 等待CDN健康检查
      const cdnStatus = await this.page.evaluate(() => {
        return (window as any).cdnManager?.getBestCDN?.() || null;
      });
      
      steps.push({
        step: 'CDN资源加载',
        success: cdnStatus !== null,
        duration: Date.now() - step2Start
      });
    } catch (error) {
      steps.push({
        step: 'CDN资源加载',
        success: false,
        duration: Date.now() - step2Start,
        error: error.toString()
      });
    }

    // 步骤3: Mermaid图表渲染
    const step3Start = Date.now();
    try {
      await this.page.waitForSelector('svg', { timeout: 10000 });
      const chartCount = await this.page.locator('svg').count();
      
      steps.push({
        step: 'Mermaid图表渲染',
        success: chartCount > 0,
        duration: Date.now() - step3Start
      });
    } catch (error) {
      steps.push({
        step: 'Mermaid图表渲染',
        success: false,
        duration: Date.now() - step3Start,
        error: error.toString()
      });
    }

    // 步骤4: 主题切换
    const step4Start = Date.now();
    try {
      const initialTheme = await this.page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 'light';
      });

      // 查找并点击主题切换按钮
      const themeButton = this.page.locator('[data-testid="theme-toggle"], .theme-toggle, .theme-switch');
      if (await themeButton.count() > 0) {
        await themeButton.click();
      } else {
        await this.page.keyboard.press('Control+Shift+T');
      }

      await this.page.waitForTimeout(500);

      const finalTheme = await this.page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 'light';
      });

      steps.push({
        step: '主题切换',
        success: initialTheme !== finalTheme,
        duration: Date.now() - step4Start
      });
    } catch (error) {
      steps.push({
        step: '主题切换',
        success: false,
        duration: Date.now() - step4Start,
        error: error.toString()
      });
    }

    // 步骤5: 语言切换
    const step5Start = Date.now();
    try {
      const langButton = this.page.locator('[data-testid="language-toggle"], .language-toggle, .lang-switch');
      if (await langButton.count() > 0) {
        await langButton.click();
        await this.page.waitForTimeout(1000);
      }

      steps.push({
        step: '语言切换',
        success: true,
        duration: Date.now() - step5Start
      });
    } catch (error) {
      steps.push({
        step: '语言切换',
        success: false,
        duration: Date.now() - step5Start,
        error: error.toString()
      });
    }

    // 步骤6: 图表交互测试
    const step6Start = Date.now();
    try {
      const charts = await this.page.locator('svg').all();
      if (charts.length > 0) {
        await charts[0].click();
        await this.page.waitForTimeout(1000);
        
        // 检查是否有放大覆盖层
        const overlay = this.page.locator('.mermaid-overlay');
        const overlayVisible = await overlay.isVisible().catch(() => false);
        
        if (overlayVisible) {
          await overlay.click();
        }
      }

      steps.push({
        step: '图表交互测试',
        success: true,
        duration: Date.now() - step6Start
      });
    } catch (error) {
      steps.push({
        step: '图表交互测试',
        success: false,
        duration: Date.now() - step6Start,
        error: error.toString()
      });
    }

    const totalDuration = Date.now() - startTime;
    const successfulSteps = steps.filter(s => s.success).length;
    const successRate = successfulSteps / steps.length;

    return {
      steps,
      totalDuration,
      successRate
    };
  }

  /**
   * 测试功能间的相互影响
   */
  async testFeatureInteractions(): Promise<{
    themeAffectsMermaid: boolean;
    cdnAffectsTheme: boolean;
    languageAffectsMermaid: boolean;
    allFeaturesStable: boolean;
  }> {
    // 记录初始状态
    const initialChartCount = await this.page.locator('svg').count();
    const initialTheme = await this.page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );

    // 测试主题切换对Mermaid的影响
    const themeButton = this.page.locator('[data-testid="theme-toggle"], .theme-toggle, .theme-switch');
    if (await themeButton.count() > 0) {
      await themeButton.click();
      await this.page.waitForTimeout(2000);
    }

    const chartCountAfterTheme = await this.page.locator('svg').count();
    const themeAffectsMermaid = chartCountAfterTheme === initialChartCount;

    // 测试CDN切换对主题的影响
    // 模拟CDN故障
    await this.page.route('**/cdn/**', route => route.abort('failed'));
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');

    const themeAfterCDNFailure = await this.page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    const cdnAffectsTheme = themeAfterCDNFailure !== null;

    // 清除路由拦截
    await this.page.unroute('**/cdn/**');

    // 测试语言切换对Mermaid的影响
    const langButton = this.page.locator('[data-testid="language-toggle"], .language-toggle, .lang-switch');
    if (await langButton.count() > 0) {
      await langButton.click();
      await this.page.waitForTimeout(2000);
    }

    const chartCountAfterLang = await this.page.locator('svg').count();
    const languageAffectsMermaid = chartCountAfterLang > 0;

    // 检查所有功能是否稳定
    const finalChartCount = await this.page.locator('svg').count();
    const finalTheme = await this.page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );

    const allFeaturesStable = finalChartCount > 0 && finalTheme !== null;

    return {
      themeAffectsMermaid,
      cdnAffectsTheme,
      languageAffectsMermaid,
      allFeaturesStable
    };
  }

  /**
   * 压力测试 - 快速切换多个功能
   */
  async stressTest(): Promise<{
    iterations: number;
    failures: number;
    averageResponseTime: number;
    memoryLeaks: boolean;
  }> {
    const iterations = 10;
    let failures = 0;
    const responseTimes: number[] = [];
    
    const initialMemory = await this.page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      try {
        // 快速切换主题
        const themeButton = this.page.locator('[data-testid="theme-toggle"], .theme-toggle, .theme-switch');
        if (await themeButton.count() > 0) {
          await themeButton.click();
        }
        
        await this.page.waitForTimeout(100);
        
        // 快速切换语言
        const langButton = this.page.locator('[data-testid="language-toggle"], .language-toggle, .lang-switch');
        if (await langButton.count() > 0) {
          await langButton.click();
        }
        
        await this.page.waitForTimeout(100);
        
        // 检查图表是否仍然存在
        const chartCount = await this.page.locator('svg').count();
        if (chartCount === 0) {
          failures++;
        }
        
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);
        
      } catch (error) {
        failures++;
        console.warn(`压力测试第${i + 1}次迭代失败:`, error);
      }
    }

    const finalMemory = await this.page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const memoryIncrease = finalMemory - initialMemory;
    const memoryLeaks = memoryIncrease > 10 * 1024 * 1024; // 10MB阈值

    return {
      iterations,
      failures,
      averageResponseTime,
      memoryLeaks
    };
  }
}

test.describe('核心功能综合集成测试', () => {
  let errorCollector: ErrorCollector;
  let screenshotHelper: ScreenshotHelper;
  let integrationTester: IntegrationTester;

  test.beforeEach(async ({ page }) => {
    errorCollector = new ErrorCollector(page);
    screenshotHelper = new ScreenshotHelper(page);
    integrationTester = new IntegrationTester(page);
  });

  test('完整功能流程测试', async ({ page }) => {
    const workflowResult = await integrationTester.executeFullWorkflow();
    
    console.log('完整功能流程测试结果:');
    console.log(`总耗时: ${workflowResult.totalDuration}ms`);
    console.log(`成功率: ${(workflowResult.successRate * 100).toFixed(2)}%`);
    
    workflowResult.steps.forEach((step, index) => {
      const status = step.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${step.step}: ${step.duration}ms`);
      if (step.error) {
        console.log(`   错误: ${step.error}`);
      }
    });

    // 截图记录最终状态
    await screenshotHelper.takeScreenshot('integration-workflow-complete', 'zh');

    // 断言
    expect(workflowResult.successRate).toBeGreaterThan(0.8); // 80%以上步骤成功
    expect(workflowResult.totalDuration).toBeLessThan(30000); // 总耗时小于30秒

    // 检查关键步骤
    const criticalSteps = ['页面加载', 'Mermaid图表渲染'];
    const criticalStepResults = workflowResult.steps.filter(step => 
      criticalSteps.includes(step.step)
    );
    
    criticalStepResults.forEach(step => {
      expect(step.success).toBe(true);
    });
  });

  test('功能间相互影响测试', async ({ page }) => {
    const interactionResult = await integrationTester.testFeatureInteractions();
    
    console.log('功能间相互影响测试结果:', interactionResult);

    // 截图记录交互测试状态
    await screenshotHelper.takeScreenshot('integration-feature-interactions', 'zh');

    // 断言
    expect(interactionResult.themeAffectsMermaid).toBe(true); // 主题切换不应影响图表显示
    expect(interactionResult.cdnAffectsTheme).toBe(true); // CDN故障不应影响主题功能
    expect(interactionResult.languageAffectsMermaid).toBe(true); // 语言切换不应影响图表
    expect(interactionResult.allFeaturesStable).toBe(true); // 所有功能应保持稳定
  });

  test('系统压力测试', async ({ page }) => {
    const stressResult = await integrationTester.stressTest();
    
    console.log('系统压力测试结果:', stressResult);

    // 截图记录压力测试后状态
    await screenshotHelper.takeScreenshot('integration-stress-test', 'zh');

    // 断言
    expect(stressResult.failures).toBeLessThan(stressResult.iterations * 0.1); // 失败率小于10%
    expect(stressResult.averageResponseTime).toBeLessThan(1000); // 平均响应时间小于1秒
    expect(stressResult.memoryLeaks).toBe(false); // 无明显内存泄漏
  });

  test('错误恢复能力测试', async ({ page }) => {
    // 模拟各种错误情况
    const errorScenarios = [
      {
        name: 'CDN完全故障',
        setup: async () => {
          await page.route('**/cdn/**', route => route.abort('failed'));
          await page.route('**/jsdelivr/**', route => route.abort('failed'));
          await page.route('**/unpkg/**', route => route.abort('failed'));
        },
        cleanup: async () => {
          await page.unrouteAll();
        }
      },
      {
        name: '网络延迟',
        setup: async () => {
          await page.route('**/*', (route, request) => {
            setTimeout(() => route.continue(), 2000);
          });
        },
        cleanup: async () => {
          await page.unrouteAll();
        }
      }
    ];

    const results: any[] = [];

    for (const scenario of errorScenarios) {
      console.log(`测试错误场景: ${scenario.name}`);
      
      try {
        // 设置错误场景
        await scenario.setup();
        
        // 重新加载页面
        await page.goto('/');
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        
        // 检查页面是否仍然可用
        const title = await page.title();
        const mainContent = await page.locator('main, .main-content, #root').isVisible();
        const chartCount = await page.locator('svg').count();
        
        results.push({
          scenario: scenario.name,
          pageLoaded: title.length > 0,
          contentVisible: mainContent,
          chartsRendered: chartCount > 0,
          success: title.length > 0 && mainContent
        });
        
        // 截图记录错误场景状态
        await screenshotHelper.takeScreenshot(`integration-error-${scenario.name.replace(/\s+/g, '-')}`, 'zh');
        
      } catch (error) {
        results.push({
          scenario: scenario.name,
          error: error.toString(),
          success: false
        });
      } finally {
        // 清理错误场景
        await scenario.cleanup();
      }
    }

    console.log('错误恢复测试结果:', results);

    // 验证系统在错误情况下的恢复能力
    const successfulRecoveries = results.filter(r => r.success).length;
    expect(successfulRecoveries).toBeGreaterThan(0); // 至少有一种错误场景能够恢复
  });

  test.afterEach(async ({ page }) => {
    // 收集所有错误
    const errors = errorCollector.getErrors();
    if (errors.length > 0) {
      console.log('集成测试中发现的错误:', errors);
    }

    // 检查性能指标
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });

    console.log('性能指标:', performanceMetrics);

    // 清理所有路由拦截
    await page.unrouteAll();
  });
});
