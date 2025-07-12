import { test, expect } from '@playwright/test';
import { PerformanceTester } from './utils/test-helpers';

/**
 * 性能测试专项
 * 
 * 测试内容：
 * - 页面加载性能
 * - 首屏渲染时间
 * - 交互响应时间
 * - 内存使用情况
 * - Mermaid图表渲染性能
 */

const TEST_PAGES = [
  { name: 'agent', url: '/agent.html' },
  { name: 'fullstack', url: '/fullstack.html' },
  { name: 'contracttask', url: '/contracttask.html' },
  { name: 'cto', url: '/cto.html' },
  { name: 'frontend', url: '/frontend.html' }
];

// 性能阈值配置
const PERFORMANCE_THRESHOLDS = {
  loadTime: 5000,        // 页面加载时间 < 5秒
  domContentLoaded: 3000, // DOM加载时间 < 3秒
  firstPaint: 2000,      // 首次绘制 < 2秒
  mermaidRender: 5000    // Mermaid渲染 < 5秒
};

test.describe('性能测试专项', () => {
  
  test('页面加载性能测试', async ({ page }) => {
    const performanceResults: any[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`测试 ${pageConfig.name} 页面加载性能`);
      
      const performanceTester = new PerformanceTester(page);
      
      // 清除缓存，确保真实的加载性能
      await page.context().clearCookies();
      
      const startTime = Date.now();
      
      // 导航到页面
      await page.goto(pageConfig.url);
      await page.waitForLoadState('networkidle');
      
      const endTime = Date.now();
      const totalLoadTime = endTime - startTime;
      
      // 获取详细性能指标
      const metrics = await performanceTester.measurePageLoad();
      
      const result = {
        page: pageConfig.name,
        totalLoadTime,
        ...metrics,
        timestamp: new Date().toISOString()
      };
      
      performanceResults.push(result);
      
      console.log(`${pageConfig.name} 性能指标:`);
      console.log(`  总加载时间: ${totalLoadTime}ms`);
      console.log(`  DOM加载时间: ${metrics.domContentLoaded}ms`);
      console.log(`  首次绘制: ${metrics.firstPaint}ms`);
      
      // 性能断言
      expect.soft(totalLoadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.loadTime);
      expect.soft(metrics.domContentLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.domContentLoaded);
      
      if (metrics.firstPaint > 0) {
        expect.soft(metrics.firstPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstPaint);
      }
    }
    
    // 生成性能报告
    const performanceReport = {
      timestamp: new Date().toISOString(),
      thresholds: PERFORMANCE_THRESHOLDS,
      results: performanceResults,
      summary: {
        averageLoadTime: performanceResults.reduce((sum, r) => sum + r.totalLoadTime, 0) / performanceResults.length,
        slowestPage: performanceResults.reduce((prev, curr) => 
          prev.totalLoadTime > curr.totalLoadTime ? prev : curr
        ),
        fastestPage: performanceResults.reduce((prev, curr) => 
          prev.totalLoadTime < curr.totalLoadTime ? prev : curr
        )
      }
    };
    
    console.log('性能测试摘要:', performanceReport.summary);
    
    // 保存性能报告
    const fs = require('fs');
    fs.writeFileSync(
      'tests/reports/performance-report.json', 
      JSON.stringify(performanceReport, null, 2)
    );
  });
  
  test('Mermaid图表渲染性能测试', async ({ page }) => {
    const mermaidPerformance: any[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`测试 ${pageConfig.name} 页面Mermaid渲染性能`);
      
      // 导航到页面
      await page.goto(pageConfig.url);
      await page.waitForLoadState('networkidle');
      
      const mermaidStartTime = Date.now();
      
      // 等待Mermaid图表出现
      await page.waitForTimeout(1000);
      
      // 检查Mermaid图表数量
      const chartCount = await page.locator('svg[id^="mermaid-"]').count();
      
      if (chartCount > 0) {
        // 等待所有图表渲染完成
        await page.waitForTimeout(3000);
        
        const mermaidEndTime = Date.now();
        const renderTime = mermaidEndTime - mermaidStartTime;
        
        // 验证图表是否正确渲染
        const renderedCharts = await page.locator('svg[id^="mermaid-"]:visible').count();
        
        const result = {
          page: pageConfig.name,
          chartCount,
          renderedCharts,
          renderTime,
          renderSuccess: renderedCharts === chartCount,
          timestamp: new Date().toISOString()
        };
        
        mermaidPerformance.push(result);
        
        console.log(`${pageConfig.name} Mermaid性能:`);
        console.log(`  图表数量: ${chartCount}`);
        console.log(`  渲染成功: ${renderedCharts}`);
        console.log(`  渲染时间: ${renderTime}ms`);
        
        // 性能断言
        expect.soft(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.mermaidRender);
        expect.soft(renderedCharts).toBe(chartCount);
        
      } else {
        console.log(`${pageConfig.name} 没有Mermaid图表`);
      }
    }
    
    // 生成Mermaid性能报告
    if (mermaidPerformance.length > 0) {
      const mermaidReport = {
        timestamp: new Date().toISOString(),
        results: mermaidPerformance,
        summary: {
          totalCharts: mermaidPerformance.reduce((sum, r) => sum + r.chartCount, 0),
          totalRendered: mermaidPerformance.reduce((sum, r) => sum + r.renderedCharts, 0),
          averageRenderTime: mermaidPerformance.reduce((sum, r) => sum + r.renderTime, 0) / mermaidPerformance.length,
          successRate: mermaidPerformance.filter(r => r.renderSuccess).length / mermaidPerformance.length
        }
      };
      
      console.log('Mermaid性能摘要:', mermaidReport.summary);
      
      // 保存报告
      const fs = require('fs');
      fs.writeFileSync(
        'tests/reports/mermaid-performance-report.json', 
        JSON.stringify(mermaidReport, null, 2)
      );
    }
  });
  
  test('内存使用测试', async ({ page }) => {
    const memoryResults: any[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`测试 ${pageConfig.name} 页面内存使用`);
      
      // 导航到页面
      await page.goto(pageConfig.url);
      await page.waitForLoadState('networkidle');
      
      // 等待页面完全加载
      await page.waitForTimeout(3000);
      
      // 获取内存使用情况
      const memoryInfo = await page.evaluate(() => {
        // @ts-ignore
        if (performance.memory) {
          // @ts-ignore
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (memoryInfo) {
        const result = {
          page: pageConfig.name,
          ...memoryInfo,
          memoryUsagePercent: (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100,
          timestamp: new Date().toISOString()
        };
        
        memoryResults.push(result);
        
        console.log(`${pageConfig.name} 内存使用:`);
        console.log(`  已用内存: ${(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`  总内存: ${(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`  使用率: ${result.memoryUsagePercent.toFixed(2)}%`);
        
        // 内存使用断言（不应超过100MB）
        expect.soft(memoryInfo.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024);
      }
    }
    
    // 生成内存报告
    if (memoryResults.length > 0) {
      const memoryReport = {
        timestamp: new Date().toISOString(),
        results: memoryResults,
        summary: {
          averageMemoryUsage: memoryResults.reduce((sum, r) => sum + r.usedJSHeapSize, 0) / memoryResults.length,
          highestMemoryUsage: Math.max(...memoryResults.map(r => r.usedJSHeapSize)),
          averageUsagePercent: memoryResults.reduce((sum, r) => sum + r.memoryUsagePercent, 0) / memoryResults.length
        }
      };
      
      console.log('内存使用摘要:', memoryReport.summary);
      
      // 保存报告
      const fs = require('fs');
      fs.writeFileSync(
        'tests/reports/memory-report.json', 
        JSON.stringify(memoryReport, null, 2)
      );
    }
  });
  
});
