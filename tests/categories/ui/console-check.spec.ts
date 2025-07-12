/**
 * 控制台错误检查测试
 * Console Error Check Test
 */

import { test, expect } from '@playwright/test';

test.describe('控制台错误检查', () => {
  test('应用启动时控制台不应该有严重错误', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 监听控制台消息
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error') {
        errors.push(text);
      } else if (msg.type() === 'warning') {
        warnings.push(text);
      }
    });

    // 访问应用
    await page.goto('/');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 等待一段时间让所有异步操作完成
    await page.waitForTimeout(5000);
    
    // 输出收集到的错误和警告
    console.log('收集到的错误:', errors);
    console.log('收集到的警告:', warnings);
    
    // 过滤掉一些已知的非关键错误
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_') &&
      !error.includes('Failed to load resource') &&
      !error.toLowerCase().includes('process is not defined')
    );
    
    // 验证没有关键错误
    expect(criticalErrors.length).toBe(0);
    
    // 如果有关键错误，输出详细信息
    if (criticalErrors.length > 0) {
      console.error('发现关键错误:', criticalErrors);
    }
  });

  test('CDN检测功能应该正常工作', async ({ page }) => {
    const cdnLogs: string[] = [];
    
    // 监听控制台消息，特别是CDN相关的
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('CDN') || text.includes('cdn')) {
        cdnLogs.push(text);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000); // 等待CDN检测完成
    
    console.log('CDN相关日志:', cdnLogs);
    
    // 验证有CDN相关的日志输出
    expect(cdnLogs.length).toBeGreaterThan(0);
  });
});
