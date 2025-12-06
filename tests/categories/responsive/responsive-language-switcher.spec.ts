/**
 * 响应式语言切换面板测试
 * 
 * 测试语言切换面板在不同屏幕尺寸下的显示行为：
 * - 大于768px时显示语言切换
 * - 小于768px时隐藏语言切换
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5177';

test.describe('响应式语言切换面板测试', () => {
  
  test('大屏幕(>768px)时应显示语言切换面板', async ({ page }) => {
    // 设置大屏幕尺寸
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查语言切换器是否存在且可见
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).toBeVisible();
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/large-screen-language-switcher.png',
      fullPage: false 
    });
    
    console.log('✅ 大屏幕语言切换面板显示正常');
  });

  test('小屏幕(<768px)时应隐藏语言切换面板', async ({ page }) => {
    // 设置小屏幕尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查语言切换器是否隐藏
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).not.toBeVisible();
    
    // 但主题切换器应该仍然可见
    const themeSwitcher = page.locator('[data-theme-switcher]');
    await expect(themeSwitcher).toBeVisible();
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/small-screen-no-language-switcher.png',
      fullPage: false 
    });
    
    console.log('✅ 小屏幕语言切换面板隐藏正常');
  });

  test('屏幕尺寸变化时语言切换面板应动态显示/隐藏', async ({ page }) => {
    // 开始时设置大屏幕
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 验证语言切换器在大屏幕时可见
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).toBeVisible();
    
    // 截图：大屏幕状态
    await page.screenshot({ 
      path: 'tests/screenshots/resize-test-large.png',
      fullPage: false 
    });
    
    // 调整到小屏幕尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 等待一下让响应式逻辑生效
    await page.waitForTimeout(500);
    
    // 验证语言切换器在小屏幕时隐藏
    await expect(languageSwitcher).not.toBeVisible();
    
    // 截图：小屏幕状态
    await page.screenshot({ 
      path: 'tests/screenshots/resize-test-small.png',
      fullPage: false 
    });
    
    // 再次调整回大屏幕
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // 等待响应式逻辑生效
    await page.waitForTimeout(500);
    
    // 验证语言切换器重新显示
    await expect(languageSwitcher).toBeVisible();
    
    // 截图：恢复大屏幕状态
    await page.screenshot({ 
      path: 'tests/screenshots/resize-test-restored.png',
      fullPage: false 
    });
    
    console.log('✅ 屏幕尺寸变化时语言切换面板响应正常');
  });

  test('可折叠面板在小屏幕时也应隐藏语言切换', async ({ page }) => {
    // 设置小屏幕尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 查找控制面板切换按钮
    const toggleButton = page.locator('button[title*="控制面板"], button[aria-label*="控制面板"]');
    
    // 如果面板是折叠的，点击展开
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(300); // 等待展开动画
    }
    
    // 检查展开的面板中是否没有语言切换器
    const languageSwitcher = page.locator('[data-language-switcher]');
    await expect(languageSwitcher).not.toBeVisible();
    
    // 但主题切换器应该存在
    const themeSwitcher = page.locator('[data-theme-switcher]');
    await expect(themeSwitcher).toBeVisible();
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/collapsible-panel-small-screen.png',
      fullPage: false 
    });
    
    console.log('✅ 可折叠面板在小屏幕时正确隐藏语言切换');
  });

  test('测试多个页面的响应式行为', async ({ page }) => {
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
      
      console.log(`✅ 页面 ${pagePath} 响应式行为正常`);
    }
  });

});
