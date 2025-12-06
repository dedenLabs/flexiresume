/**
 * Tabs路由切换性能测试
 * 
 * 测试目标：
 * 1. 测量当前路由切换速度
 * 2. 验证无感知切换效果
 * 3. 监控性能指标
 * 4. 检测内存泄漏
 */

import { test, expect, Page } from '@playwright/test';

interface PerformanceMetrics {
  routeChangeTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
}

class TabsPerformanceTester {
  private page: Page;
  private metrics: PerformanceMetrics[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * 测量单次路由切换性能
   */
  async measureRouteChange(fromTab: string, toTab: string): Promise<PerformanceMetrics> {
    console.log(`🔄 测量路由切换: ${fromTab} -> ${toTab}`);

    // 记录开始时间
    const startTime = Date.now();

    // 记录网络请求数量
    let networkRequestCount = 0;
    this.page.on('request', () => networkRequestCount++);

    // 获取内存使用情况（如果支持）
    const memoryBefore = await this.getMemoryUsage();

    // 执行路由切换
    const tabLink = this.page.locator(`[data-testid="navigation-tabs"] a[href="${toTab}"]`);
    await tabLink.click();

    // 等待页面稳定
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500); // 额外等待确保渲染完成

    // 计算性能指标
    const endTime = Date.now();
    const routeChangeTime = endTime - startTime;

    // 获取渲染时间（通过Performance API）
    const renderTime = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation.loadEventEnd - navigation.loadEventStart;
    });

    const memoryAfter = await this.getMemoryUsage();

    const metrics: PerformanceMetrics = {
      routeChangeTime,
      renderTime,
      memoryUsage: memoryAfter - memoryBefore,
      networkRequests: networkRequestCount
    };

    this.metrics.push(metrics);
    console.log(`📊 性能指标:`, metrics);

    return metrics;
  }

  /**
   * 获取内存使用情况
   */
  private async getMemoryUsage(): Promise<number> {
    try {
      const memInfo = await this.page.evaluate(() => {
        // @ts-ignore
        return (performance as any).memory?.usedJSHeapSize || 0;
      });
      return memInfo;
    } catch {
      return 0;
    }
  }

  /**
   * 执行压力测试
   */
  async performStressTest(iterations: number = 10): Promise<void> {
    console.log(`🔥 开始压力测试，迭代次数: ${iterations}`);

    const tabs = ['/frontend', '/backend', '/fullstack', '/game'];
    
    for (let i = 0; i < iterations; i++) {
      const fromTab = tabs[i % tabs.length];
      const toTab = tabs[(i + 1) % tabs.length];
      
      await this.measureRouteChange(fromTab, toTab);
      
      // 短暂延迟，模拟真实用户行为
      await this.page.waitForTimeout(100);
    }
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    if (this.metrics.length === 0) {
      return '❌ 没有性能数据';
    }

    const avgRouteChangeTime = this.metrics.reduce((sum, m) => sum + m.routeChangeTime, 0) / this.metrics.length;
    const avgRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / this.metrics.length;
    const avgMemoryUsage = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / this.metrics.length;
    const avgNetworkRequests = this.metrics.reduce((sum, m) => sum + m.networkRequests, 0) / this.metrics.length;

    const maxRouteChangeTime = Math.max(...this.metrics.map(m => m.routeChangeTime));
    const minRouteChangeTime = Math.min(...this.metrics.map(m => m.routeChangeTime));

    return `
📊 Tabs路由切换性能报告
========================

🔄 路由切换性能:
- 平均切换时间: ${avgRouteChangeTime.toFixed(2)}ms
- 最快切换时间: ${minRouteChangeTime}ms
- 最慢切换时间: ${maxRouteChangeTime}ms

🎨 渲染性能:
- 平均渲染时间: ${avgRenderTime.toFixed(2)}ms

💾 内存使用:
- 平均内存变化: ${(avgMemoryUsage / 1024 / 1024).toFixed(2)}MB

🌐 网络请求:
- 平均请求数量: ${avgNetworkRequests.toFixed(1)}个

📈 性能评级:
${this.getPerformanceGrade(avgRouteChangeTime)}

🎯 优化建议:
${this.getOptimizationSuggestions(avgRouteChangeTime, avgNetworkRequests)}
`;
  }

  /**
   * 获取性能评级
   */
  private getPerformanceGrade(avgTime: number): string {
    if (avgTime < 100) return '🟢 优秀 (< 100ms)';
    if (avgTime < 300) return '🟡 良好 (100-300ms)';
    if (avgTime < 1000) return '🟠 一般 (300-1000ms)';
    return '🔴 需要优化 (> 1000ms)';
  }

  /**
   * 获取优化建议
   */
  private getOptimizationSuggestions(avgTime: number, avgRequests: number): string {
    const suggestions = [];

    if (avgTime > 300) {
      suggestions.push('- 实现数据预加载机制');
      suggestions.push('- 优化组件渲染逻辑');
    }

    if (avgRequests > 5) {
      suggestions.push('- 减少不必要的网络请求');
      suggestions.push('- 实现更好的缓存策略');
    }

    if (avgTime > 100) {
      suggestions.push('- 添加页面切换动画掩盖延迟');
      suggestions.push('- 实现虚拟化渲染');
    }

    return suggestions.length > 0 ? suggestions.join('\n') : '- 性能表现良好，无需特别优化';
  }
}

test.describe('Tabs路由切换性能测试', () => {
  test('基准性能测试', async ({ page }) => {
    console.log('🚀 开始Tabs路由切换基准性能测试...');

    // 访问首页
    await page.goto('http://localhost:5175/');
    await page.waitForLoadState('networkidle');

    const tester = new TabsPerformanceTester(page);

    // 测试各种路由切换组合
    const testCases = [
      { from: '/', to: '/frontend' },
      { from: '/frontend', to: '/backend' },
      { from: '/backend', to: '/fullstack' },
      { from: '/fullstack', to: '/game' },
      { from: '/game', to: '/frontend' }
    ];

    for (const testCase of testCases) {
      await tester.measureRouteChange(testCase.from, testCase.to);
    }

    // 生成并输出报告
    const report = tester.generateReport();
    console.log(report);

    // 验证性能基准
    const metrics = tester['metrics'];
    const avgTime = metrics.reduce((sum, m) => sum + m.routeChangeTime, 0) / metrics.length;
    
    // 期望切换时间小于1秒
    expect(avgTime).toBeLessThan(1000);
    
    console.log('✅ 基准性能测试完成');
  });

  test('压力测试', async ({ page }) => {
    console.log('🔥 开始Tabs路由切换压力测试...');

    await page.goto('http://localhost:5175/');
    await page.waitForLoadState('networkidle');

    const tester = new TabsPerformanceTester(page);

    // 执行压力测试
    await tester.performStressTest(20);

    // 生成报告
    const report = tester.generateReport();
    console.log(report);

    // 验证压力测试结果
    const metrics = tester['metrics'];
    const avgTime = metrics.reduce((sum, m) => sum + m.routeChangeTime, 0) / metrics.length;
    
    // 压力测试下期望切换时间仍然合理
    expect(avgTime).toBeLessThan(2000);

    console.log('✅ 压力测试完成');
  });

  test('内存泄漏检测', async ({ page }) => {
    console.log('🧠 开始内存泄漏检测...');

    await page.goto('http://localhost:5175/');
    await page.waitForLoadState('networkidle');

    const tester = new TabsPerformanceTester(page);

    // 记录初始内存
    const initialMemory = await tester['getMemoryUsage']();
    console.log(`📊 初始内存使用: ${(initialMemory / 1024 / 1024).toFixed(2)}MB`);

    // 执行多次切换
    await tester.performStressTest(50);

    // 记录最终内存
    const finalMemory = await tester['getMemoryUsage']();
    console.log(`📊 最终内存使用: ${(finalMemory / 1024 / 1024).toFixed(2)}MB`);

    const memoryIncrease = finalMemory - initialMemory;
    console.log(`📈 内存增长: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);

    // 验证内存增长在合理范围内（小于50MB）
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);

    console.log('✅ 内存泄漏检测完成');
  });
});
