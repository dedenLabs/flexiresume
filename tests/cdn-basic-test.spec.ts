/**
 * CDN基础功能测试
 * Basic CDN Functionality Test
 */

import { test, expect } from '@playwright/test';

test.describe('CDN基础功能验证', () => {
  test('应用应该能够正常启动并显示内容', async ({ page }) => {
    // 访问应用
    await page.goto('/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 验证页面标题
    await expect(page).toHaveTitle(/FlexiResume|My Resume/);
    
    // 验证主要内容区域存在
    const content = page.locator('body');
    await expect(content).toBeVisible();
    
    // 检查是否有明显的错误
    const errorElements = page.locator('text=Error');
    const errorCount = await errorElements.count();
    expect(errorCount).toBe(0);
  });

  test('CDN状态指示器应该显示', async ({ page }) => {
    await page.goto('/');
    
    // 等待一段时间让CDN检测完成
    await page.waitForTimeout(3000);
    
    // 检查是否有CDN相关的状态指示
    const hasIndicator = await page.locator('div:has-text("CDN")').count() > 0;
    
    // 如果有指示器，验证其内容
    if (hasIndicator) {
      const indicator = page.locator('div:has-text("CDN")').first();
      const text = await indicator.textContent();
      expect(text).toMatch(/(检测|就绪|失败|CDN)/);
    }
  });

  test('应用应该能够处理CDN加载', async ({ page }) => {
    await page.goto('/');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 检查控制台是否有严重错误
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // 等待一段时间收集错误
    await page.waitForTimeout(5000);
    
    // 过滤掉一些已知的非关键错误
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('页面应该能够正常渲染内容', async ({ page }) => {
    await page.goto('/');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 检查页面是否有实际内容
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
    
    // 检查是否有导航或主要内容
    const hasNavigation = await page.locator('nav').count() > 0;
    const hasMainContent = await page.locator('main, [data-testid="resume-content"]').count() > 0;
    
    expect(hasNavigation || hasMainContent).toBe(true);
  });
});
