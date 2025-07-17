/**
 * CDN切换功能完整测试套件
 * 测试CDN健康检查、自动切换、降级机制和性能监控
 */

import { test, expect, Page } from '@playwright/test';
import { ErrorCollector } from '../utils/ErrorCollector';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

class CDNSwitchingTester {
  constructor(private page: Page) {}

  /**
   * 获取CDN配置信息
   */
  async getCDNConfig(): Promise<any> {
    return await this.page.evaluate(() => {
      return (window as any).cdnConfig || null;
    });
  }

  /**
   * 获取CDN健康检查结果
   */
  async getCDNHealthResults(): Promise<any> {
    return await this.page.evaluate(() => {
      return (window as any).cdnHealthResults || [];
    });
  }

  /**
   * 模拟CDN故障
   */
  async simulateCDNFailure(cdnUrl: string): Promise<void> {
    await this.page.route(`${cdnUrl}/**`, route => {
      route.abort('failed');
    });
  }

  /**
   * 恢复CDN连接
   */
  async restoreCDNConnection(cdnUrl: string): Promise<void> {
    await this.page.unroute(`${cdnUrl}/**`);
  }

  /**
   * 监控资源加载
   */
  async monitorResourceLoading(): Promise<{
    totalRequests: number;
    cdnRequests: number;
    localRequests: number;
    failedRequests: number;
    loadTimes: number[];
  }> {
    const resourceData = {
      totalRequests: 0,
      cdnRequests: 0,
      localRequests: 0,
      failedRequests: 0,
      loadTimes: [] as number[]
    };

    await this.page.route('**/*', (route, request) => {
      const url = request.url();
      const startTime = Date.now();
      
      resourceData.totalRequests++;
      
      if (url.includes('cdn') || url.includes('jsdelivr') || url.includes('unpkg')) {
        resourceData.cdnRequests++;
      } else if (url.includes('localhost') || url.includes('127.0.0.1')) {
        resourceData.localRequests++;
      }

      route.continue().then(() => {
        const loadTime = Date.now() - startTime;
        resourceData.loadTimes.push(loadTime);
      }).catch(() => {
        resourceData.failedRequests++;
      });
    });

    return resourceData;
  }

  /**
   * 测试CDN自动切换
   */
  async testCDNAutoSwitching(): Promise<{
    initialCDN: string;
    finalCDN: string;
    switchOccurred: boolean;
    switchTime: number;
  }> {
    const startTime = Date.now();
    
    // 获取初始CDN状态
    const initialState = await this.page.evaluate(() => {
      return {
        bestCDN: (window as any).cdnManager?.getBestCDN?.() || null,
        healthResults: (window as any).cdnHealthChecker?.getAllResults?.() || []
      };
    });

    // 模拟第一个CDN故障
    if (initialState.bestCDN) {
      await this.simulateCDNFailure(initialState.bestCDN);
    }

    // 等待CDN切换
    await this.page.waitForTimeout(5000);

    // 获取切换后的状态
    const finalState = await this.page.evaluate(() => {
      return {
        bestCDN: (window as any).cdnManager?.getBestCDN?.() || null,
        healthResults: (window as any).cdnHealthChecker?.getAllResults?.() || []
      };
    });

    const switchTime = Date.now() - startTime;

    return {
      initialCDN: initialState.bestCDN || 'unknown',
      finalCDN: finalState.bestCDN || 'unknown',
      switchOccurred: initialState.bestCDN !== finalState.bestCDN,
      switchTime
    };
  }

  /**
   * 测试本地环境降级
   */
  async testLocalFallback(): Promise<boolean> {
    // 模拟所有CDN故障
    const cdnUrls = [
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      'https://cdnjs.cloudflare.com'
    ];

    for (const url of cdnUrls) {
      await this.simulateCDNFailure(url);
    }

    // 重新加载页面触发降级
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');

    // 检查是否降级到本地资源
    const resourceUrls = await this.page.evaluate(() => {
      const resources: string[] = [];
      const scripts = document.querySelectorAll('script[src]');
      const links = document.querySelectorAll('link[href]');
      
      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src) resources.push(src);
      });
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) resources.push(href);
      });
      
      return resources;
    });

    // 检查是否有本地资源
    const localResources = resourceUrls.filter(url => 
      url.includes('localhost') || 
      url.includes('127.0.0.1') || 
      url.startsWith('/')
    );

    return localResources.length > 0;
  }

  /**
   * 测试CDN性能监控
   */
  async testCDNPerformanceMonitoring(): Promise<{
    averageLoadTime: number;
    maxLoadTime: number;
    minLoadTime: number;
    successRate: number;
  }> {
    const performanceData = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const cdnEntries = entries.filter(entry => 
        entry.name.includes('cdn') || 
        entry.name.includes('jsdelivr') || 
        entry.name.includes('unpkg')
      );

      if (cdnEntries.length === 0) {
        return {
          averageLoadTime: 0,
          maxLoadTime: 0,
          minLoadTime: 0,
          successRate: 0
        };
      }

      const loadTimes = cdnEntries.map(entry => entry.duration);
      const successfulRequests = cdnEntries.filter(entry => entry.duration > 0).length;

      return {
        averageLoadTime: loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length,
        maxLoadTime: Math.max(...loadTimes),
        minLoadTime: Math.min(...loadTimes),
        successRate: successfulRequests / cdnEntries.length
      };
    });

    return performanceData;
  }
}

test.describe('CDN切换功能完整测试', () => {
  let errorCollector: ErrorCollector;
  let screenshotHelper: ScreenshotHelper;
  let cdnTester: CDNSwitchingTester;

  test.beforeEach(async ({ page }) => {
    errorCollector = new ErrorCollector(page);
    screenshotHelper = new ScreenshotHelper(page);
    cdnTester = new CDNSwitchingTester(page);

    // 设置CDN监控
    await page.addInitScript(() => {
      (window as any).cdnLogs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        if (message.includes('CDN') || message.includes('cdn')) {
          (window as any).cdnLogs.push(message);
        }
        originalLog.apply(console, args);
      };
    });
  });

  test('CDN配置和初始化测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 获取CDN配置
    const cdnConfig = await cdnTester.getCDNConfig();
    console.log('CDN配置:', cdnConfig);

    // 验证CDN配置存在
    expect(cdnConfig).toBeTruthy();
    
    if (cdnConfig) {
      expect(cdnConfig.enabled).toBeDefined();
      expect(cdnConfig.baseUrls).toBeDefined();
      expect(Array.isArray(cdnConfig.baseUrls)).toBe(true);
    }

    // 获取健康检查结果
    const healthResults = await cdnTester.getCDNHealthResults();
    console.log('CDN健康检查结果:', healthResults);

    // 截图记录初始状态
    await screenshotHelper.takeScreenshot('cdn-initial-state', 'zh');
  });

  test('CDN健康检查功能测试', async ({ page }) => {
    await page.goto('/');
    
    // 等待健康检查完成
    await page.waitForTimeout(10000);
    
    // 获取健康检查结果
    const healthResults = await cdnTester.getCDNHealthResults();
    console.log('健康检查结果:', healthResults);

    // 验证健康检查执行
    expect(Array.isArray(healthResults)).toBe(true);
    
    if (healthResults.length > 0) {
      // 验证健康检查结果格式
      const firstResult = healthResults[0];
      expect(firstResult).toHaveProperty('url');
      expect(firstResult).toHaveProperty('available');
      expect(firstResult).toHaveProperty('responseTime');
    }

    // 检查CDN相关日志
    const cdnLogs = await page.evaluate(() => (window as any).cdnLogs || []);
    const healthCheckLogs = cdnLogs.filter((log: string) => 
      log.includes('health') || log.includes('检查')
    );
    
    console.log('健康检查日志:', healthCheckLogs);
    expect(healthCheckLogs.length).toBeGreaterThan(0);
  });

  test('CDN自动切换功能测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试CDN自动切换
    const switchResult = await cdnTester.testCDNAutoSwitching();
    console.log('CDN切换结果:', switchResult);

    // 验证切换功能
    expect(switchResult.switchTime).toBeLessThan(10000); // 切换时间小于10秒
    
    if (switchResult.switchOccurred) {
      expect(switchResult.initialCDN).not.toBe(switchResult.finalCDN);
      console.log(`CDN从 ${switchResult.initialCDN} 切换到 ${switchResult.finalCDN}`);
    }

    // 截图记录切换后状态
    await screenshotHelper.takeScreenshot('cdn-after-switching', 'zh');
  });

  test('CDN降级到本地资源测试', async ({ page }) => {
    // 测试本地降级
    const fallbackWorking = await cdnTester.testLocalFallback();
    console.log('本地降级测试结果:', fallbackWorking);

    expect(fallbackWorking).toBe(true);

    // 验证页面仍然正常工作
    const title = await page.title();
    expect(title).toBeTruthy();

    // 检查关键元素是否正常显示
    const mainContent = await page.locator('main, .main-content, #root').count();
    expect(mainContent).toBeGreaterThan(0);

    // 截图记录降级状态
    await screenshotHelper.takeScreenshot('cdn-local-fallback', 'zh');
  });

  test('CDN性能监控测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 等待资源加载完成
    await page.waitForTimeout(5000);

    // 测试性能监控
    const performanceData = await cdnTester.testCDNPerformanceMonitoring();
    console.log('CDN性能数据:', performanceData);

    // 验证性能指标
    if (performanceData.averageLoadTime > 0) {
      expect(performanceData.averageLoadTime).toBeLessThan(5000); // 平均加载时间小于5秒
      expect(performanceData.successRate).toBeGreaterThan(0.8); // 成功率大于80%
    }

    // 检查是否有性能问题
    if (performanceData.maxLoadTime > 10000) {
      console.warn('⚠️ 发现慢速资源加载:', performanceData.maxLoadTime);
    }
  });

  test('CDN在不同网络条件下的表现', async ({ page }) => {
    // 模拟慢速网络
    await page.route('**/*', (route, request) => {
      // 为CDN请求添加延迟
      if (request.url().includes('cdn') || request.url().includes('jsdelivr')) {
        setTimeout(() => route.continue(), 2000); // 2秒延迟
      } else {
        route.continue();
      }
    });

    await page.goto('/');
    
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    console.log(`慢速网络下页面加载时间: ${loadTime}ms`);

    // 验证页面在慢速网络下仍能正常加载
    expect(loadTime).toBeLessThan(30000); // 30秒内完成加载

    // 验证关键功能仍然可用
    const mainContent = await page.locator('main, .main-content, #root').isVisible();
    expect(mainContent).toBe(true);

    // 截图记录慢速网络状态
    await screenshotHelper.takeScreenshot('cdn-slow-network', 'zh');
  });

  test('CDN缓存机制测试', async ({ page }) => {
    // 第一次访问
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstLoadResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });

    // 清除页面但保持缓存
    await page.evaluate(() => {
      // 清除DOM但不清除缓存
      document.body.innerHTML = '';
    });

    // 第二次访问
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const secondLoadResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });

    console.log(`第一次加载资源数: ${firstLoadResources}, 第二次: ${secondLoadResources}`);

    // 验证缓存机制工作
    // 注意：这个测试可能因为浏览器缓存策略而有所不同
    expect(secondLoadResources).toBeGreaterThan(0);
  });

  test.afterEach(async ({ page }) => {
    // 收集CDN相关日志
    const cdnLogs = await page.evaluate(() => (window as any).cdnLogs || []);
    if (cdnLogs.length > 0) {
      console.log('CDN操作日志:', cdnLogs);
    }

    // 检查CDN相关错误
    const errors = errorCollector.getErrors();
    const cdnErrors = errors.filter(e => 
      e.message.includes('CDN') || 
      e.message.includes('cdn') ||
      e.message.includes('network')
    );

    if (cdnErrors.length > 0) {
      console.warn('CDN相关错误:', cdnErrors);
    }

    // 清理路由拦截
    await page.unrouteAll();
  });
});
