import { test, expect } from '@playwright/test';
import { ErrorCollector } from './utils/test-helpers';

/**
 * 错误检测专项测试
 * 
 * 专门用于检测和分析各种类型的错误：
 * - JavaScript运行时错误
 * - 控制台错误和警告
 * - 网络请求失败
 * - 资源加载失败
 * - React组件错误
 */

const TEST_PAGES = [
  { name: 'agent', url: '/agent.html' },
  { name: 'fullstack', url: '/fullstack.html' },
  { name: 'contracttask', url: '/contracttask.html' },
  { name: 'cto', url: '/cto.html' },
  { name: 'frontend', url: '/frontend.html' }
];

test.describe('错误检测专项测试', () => {
  
  test('JavaScript错误检测', async ({ page }) => {
    const allErrors: { page: string; errors: any[] }[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`检测 ${pageConfig.name} 页面的JavaScript错误`);
      
      const errorCollector = new ErrorCollector(page);
      
      // 导航到页面
      await page.goto(pageConfig.url);
      await page.waitForLoadState('networkidle');
      
      // 等待页面完全加载和渲染
      await page.waitForTimeout(5000);
      
      // 收集错误
      const errors = errorCollector.getErrors();
      allErrors.push({ page: pageConfig.name, errors });
      
      // 分析错误类型
      const jsErrors = errors.filter(e => e.type === 'javascript');
      const consoleErrors = errors.filter(e => e.type === 'console');
      const networkErrors = errors.filter(e => e.type === 'network');
      
      console.log(`${pageConfig.name} 错误统计:`);
      console.log(`  JavaScript错误: ${jsErrors.length}`);
      console.log(`  控制台错误: ${consoleErrors.length}`);
      console.log(`  网络错误: ${networkErrors.length}`);
      
      // 记录严重错误
      const criticalErrors = jsErrors.concat(
        consoleErrors.filter(e => e.message.includes('Error'))
      );
      
      if (criticalErrors.length > 0) {
        console.warn(`${pageConfig.name} 严重错误:`, criticalErrors);
      }
      
      // 软断言：严重错误不应超过阈值
      expect.soft(criticalErrors.length).toBeLessThan(5);
    }
    
    // 生成错误报告
    const errorReport = {
      timestamp: new Date().toISOString(),
      totalPages: TEST_PAGES.length,
      pageErrors: allErrors,
      summary: {
        totalErrors: allErrors.reduce((sum, p) => sum + p.errors.length, 0),
        pagesWithErrors: allErrors.filter(p => p.errors.length > 0).length,
        criticalErrorPages: allErrors.filter(p => 
          p.errors.some(e => e.type === 'javascript' || 
            (e.type === 'console' && e.message.includes('Error')))
        ).length
      }
    };
    
    console.log('错误检测报告:', errorReport.summary);
    
    // 保存详细报告
    const fs = require('fs');
    fs.writeFileSync(
      'tests/reports/error-report.json', 
      JSON.stringify(errorReport, null, 2)
    );
  });
  
  test('网络请求失败检测', async ({ page }) => {
    const failedRequests: { page: string; failures: any[] }[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`检测 ${pageConfig.name} 页面的网络请求`);
      
      const requestFailures: any[] = [];
      
      // 监听请求失败
      page.on('requestfailed', request => {
        requestFailures.push({
          url: request.url(),
          method: request.method(),
          failure: request.failure()?.errorText,
          timestamp: new Date().toISOString()
        });
      });
      
      // 监听响应错误
      page.on('response', response => {
        if (response.status() >= 400) {
          requestFailures.push({
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // 导航到页面
      await page.goto(pageConfig.url);
      await page.waitForLoadState('networkidle');
      
      // 等待所有异步请求完成
      await page.waitForTimeout(3000);
      
      failedRequests.push({ 
        page: pageConfig.name, 
        failures: [...requestFailures] 
      });
      
      console.log(`${pageConfig.name} 网络请求失败: ${requestFailures.length}`);
      
      if (requestFailures.length > 0) {
        console.warn(`${pageConfig.name} 失败的请求:`, requestFailures);
      }
    }
    
    // 生成网络错误报告
    const networkReport = {
      timestamp: new Date().toISOString(),
      totalPages: TEST_PAGES.length,
      pageFailures: failedRequests,
      summary: {
        totalFailures: failedRequests.reduce((sum, p) => sum + p.failures.length, 0),
        pagesWithFailures: failedRequests.filter(p => p.failures.length > 0).length
      }
    };
    
    console.log('网络请求报告:', networkReport.summary);
    
    // 保存报告
    const fs = require('fs');
    fs.writeFileSync(
      'tests/reports/network-report.json', 
      JSON.stringify(networkReport, null, 2)
    );
    
    // 断言：网络失败不应过多
    expect(networkReport.summary.totalFailures).toBeLessThan(10);
  });
  
  test('资源加载检测', async ({ page }) => {
    const resourceErrors: { page: string; resources: any[] }[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`检测 ${pageConfig.name} 页面的资源加载`);
      
      const missingResources: any[] = [];
      
      // 监听资源加载失败
      page.on('response', response => {
        const url = response.url();
        const status = response.status();
        
        // 检查关键资源
        if (status === 404 || status === 500) {
          const resourceType = getResourceType(url);
          missingResources.push({
            url,
            status,
            type: resourceType,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // 导航到页面
      await page.goto(pageConfig.url);
      await page.waitForLoadState('networkidle');
      
      // 检查关键元素是否加载
      const criticalElements = [
        'img', 'link[rel="stylesheet"]', 'script[src]'
      ];
      
      for (const selector of criticalElements) {
        const elements = await page.locator(selector).count();
        console.log(`${pageConfig.name} ${selector}: ${elements} 个`);
      }
      
      resourceErrors.push({ 
        page: pageConfig.name, 
        resources: [...missingResources] 
      });
      
      if (missingResources.length > 0) {
        console.warn(`${pageConfig.name} 资源加载失败:`, missingResources);
      }
    }
    
    // 生成资源报告
    const resourceReport = {
      timestamp: new Date().toISOString(),
      totalPages: TEST_PAGES.length,
      pageResources: resourceErrors,
      summary: {
        totalMissing: resourceErrors.reduce((sum, p) => sum + p.resources.length, 0),
        pagesWithMissing: resourceErrors.filter(p => p.resources.length > 0).length
      }
    };
    
    console.log('资源加载报告:', resourceReport.summary);
    
    // 保存报告
    const fs = require('fs');
    fs.writeFileSync(
      'tests/reports/resource-report.json', 
      JSON.stringify(resourceReport, null, 2)
    );
  });
  
});

/**
 * 根据URL判断资源类型
 */
function getResourceType(url: string): string {
  if (url.includes('.css')) return 'stylesheet';
  if (url.includes('.js')) return 'script';
  if (url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) return 'image';
  if (url.includes('.woff') || url.includes('.ttf')) return 'font';
  return 'other';
}
