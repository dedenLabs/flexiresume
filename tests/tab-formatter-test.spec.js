/**
 * 测试页签格式化功能
 * 
 * 验证环境变量配置的页签标签格式是否正常工作
 */

import { test, expect } from '@playwright/test';

test.describe('页签格式化功能测试', () => {
  test('页签应该正常显示，使用配置的格式', async ({ page }) => {
    // 监听控制台错误
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 访问页面
    await page.goto('http://localhost:5181/');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 等待页签加载
    await page.waitForSelector('[data-testid="navigation-tabs"]', { timeout: 10000 });

    // 验证页签容器存在
    const tabsContainer = page.locator('[data-testid="navigation-tabs"]');
    await expect(tabsContainer).toBeVisible();

    // 获取所有页签
    const tabs = page.locator('[data-testid="navigation-tabs"] a');
    const tabCount = await tabs.count();
    
    console.log(`找到 ${tabCount} 个页签`);
    expect(tabCount).toBeGreaterThan(0);

    // 验证每个页签都有文本内容
    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      const tabText = await tab.textContent();
      
      console.log(`页签 ${i + 1}: "${tabText}"`);
      expect(tabText).toBeTruthy();
      expect(tabText.trim()).not.toBe('');
    }

    // 截图保存
    await page.screenshot({ 
      path: 'tests/screenshots/tab-formatter-test.png',
      fullPage: true 
    });

    // 验证没有严重错误
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('TabFormatter') || 
      error.includes('formatTabLabel') ||
      error.includes('extractRoleTitle')
    );

    expect(criticalErrors).toHaveLength(0);

    console.log('✅ 页签格式化功能测试通过');
  });

  test('页签点击应该正常工作', async ({ page }) => {
    await page.goto('http://localhost:5181/');
    await page.waitForLoadState('networkidle');

    // 等待页签加载
    await page.waitForSelector('[data-testid="navigation-tabs"]', { timeout: 10000 });

    // 获取第一个页签
    const firstTab = page.locator('[data-testid="navigation-tabs"] a').first();
    await expect(firstTab).toBeVisible();

    // 点击第一个页签
    await firstTab.click();

    // 等待页面导航完成
    await page.waitForLoadState('networkidle');

    // 验证URL已改变
    const currentUrl = page.url();
    console.log(`当前URL: ${currentUrl}`);
    
    // URL应该包含页签路径
    expect(currentUrl).toMatch(/\/[a-z]+$/);

    console.log('✅ 页签点击功能测试通过');
  });
});
