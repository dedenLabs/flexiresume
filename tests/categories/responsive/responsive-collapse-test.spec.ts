/**
 * 响应式折叠功能测试
 * 
 * 测试控制面板根据屏幕尺寸的响应式折叠行为：
 * - 大于768px时默认展开
 * - 小于768px时默认折叠
 * - 语言切换功能在所有尺寸下都可用
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5177';

test.describe('响应式折叠功能测试', () => {
  
  test('大屏幕(>768px)时控制面板默认展开', async ({ page }) => {
    // 设置大屏幕尺寸
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查控制面板是否展开（语言切换器可见）
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).toBeVisible();
    
    // 检查主题切换器也可见
    const themeSwitcher = page.locator('[data-theme-switcher]');
    await expect(themeSwitcher).toBeVisible();
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/large-screen-expanded-panel.png',
      fullPage: false 
    });
    
    console.log('✅ 大屏幕控制面板默认展开正常');
  });

  test('小屏幕(<768px)时控制面板默认折叠', async ({ page }) => {
    // 设置小屏幕尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查控制面板是否折叠（只有切换按钮可见）
    const toggleButton = page.locator('button[title*="控制面板"], button[aria-label*="控制面板"]');
    await expect(toggleButton).toBeVisible();
    
    // 检查面板内容是否隐藏
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).not.toBeVisible();
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/small-screen-collapsed-panel.png',
      fullPage: false 
    });
    
    console.log('✅ 小屏幕控制面板默认折叠正常');
  });

  test('小屏幕点击展开后语言切换功能可用', async ({ page }) => {
    // 设置小屏幕尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 点击展开控制面板
    const toggleButton = page.locator('button[title*="控制面板"], button[aria-label*="控制面板"]');
    await toggleButton.click();
    
    // 等待展开动画
    await page.waitForTimeout(300);
    
    // 检查语言切换器现在可见
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).toBeVisible();
    
    // 检查主题切换器也可见
    const themeSwitcher = page.locator('[data-theme-switcher]');
    await expect(themeSwitcher).toBeVisible();
    
    // 测试语言切换功能
    await languageSwitcher.click();
    await page.waitForTimeout(200);
    
    // 截图验证展开状态
    await page.screenshot({ 
      path: 'tests/screenshots/small-screen-expanded-panel.png',
      fullPage: false 
    });
    
    console.log('✅ 小屏幕展开后语言切换功能正常');
  });

  test('屏幕尺寸变化时响应式折叠行为', async ({ page }) => {
    // 开始时设置大屏幕
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 验证大屏幕时面板展开
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).toBeVisible();
    
    // 截图：大屏幕状态
    await page.screenshot({ 
      path: 'tests/screenshots/responsive-test-large.png',
      fullPage: false 
    });
    
    // 调整到小屏幕尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 等待响应式逻辑生效
    await page.waitForTimeout(500);
    
    // 验证小屏幕时面板折叠
    await expect(languageSwitcher).not.toBeVisible();
    
    // 但切换按钮应该可见
    const toggleButton = page.locator('button[title*="控制面板"], button[aria-label*="控制面板"]');
    await expect(toggleButton).toBeVisible();
    
    // 截图：小屏幕状态
    await page.screenshot({ 
      path: 'tests/screenshots/responsive-test-small.png',
      fullPage: false 
    });
    
    // 再次调整回大屏幕
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // 等待响应式逻辑生效
    await page.waitForTimeout(500);
    
    // 验证重新展开
    await expect(languageSwitcher).toBeVisible();
    
    // 截图：恢复大屏幕状态
    await page.screenshot({ 
      path: 'tests/screenshots/responsive-test-restored.png',
      fullPage: false 
    });
    
    console.log('✅ 屏幕尺寸变化时响应式折叠行为正常');
  });

  test('用户手动操作后不受屏幕尺寸变化影响', async ({ page }) => {
    // 设置小屏幕尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 用户手动展开面板
    const toggleButton = page.locator('button[title*="控制面板"], button[aria-label*="控制面板"]');
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    // 验证面板已展开
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).toBeVisible();
    
    // 调整到大屏幕尺寸
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);
    
    // 验证面板仍然展开（用户意图保持）
    await expect(languageSwitcher).toBeVisible();
    
    // 再调整回小屏幕
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // 验证面板仍然展开（用户意图保持）
    await expect(languageSwitcher).toBeVisible();
    
    console.log('✅ 用户手动操作后状态保持正常');
  });

  test('测试多个页面的响应式折叠行为', async ({ page }) => {
    const testPages = ['/game', '/contracttask', '/fullstack', '/frontend'];
    
    for (const pagePath of testPages) {
      console.log(`测试页面: ${pagePath}`);
      
      // 大屏幕测试
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
      
      const languageSwitcher = page.locator('[data-language-switcher]');
      await expect(languageSwitcher).toBeVisible();
      
      // 小屏幕测试
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      await expect(languageSwitcher).not.toBeVisible();
      
      // 验证可以手动展开
      const toggleButton = page.locator('button[title*="控制面板"], button[aria-label*="控制面板"]');
      await toggleButton.click();
      await page.waitForTimeout(300);
      await expect(languageSwitcher).toBeVisible();
      
      console.log(`✅ 页面 ${pagePath} 响应式折叠行为正常`);
    }
  });

});
