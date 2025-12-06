import { test, expect } from '@playwright/test';

/**
 * 控制台错误检查测试
 * 确保所有页面都没有JavaScript错误
 */

const pages = [
  { path: '/game', name: '游戏开发' },
  { path: '/contracttask', name: '外包任务' },
  { path: '/fullstack', name: '全栈开发' },
  { path: '/frontend', name: '前端开发' }
];

test.describe('控制台错误检查', () => {
  
  test('所有页面控制台错误检查', async ({ page }) => {
    console.log('\n=== 控制台错误检查 ===');
    
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 收集所有控制台消息
    const consoleMessages: { type: string; text: string; page: string }[] = [];
    
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        page: page.url()
      });
    });

    // 收集页面错误
    const pageErrors: { message: string; page: string }[] = [];
    
    page.on('pageerror', error => {
      pageErrors.push({
        message: error.message,
        page: page.url()
      });
    });

    // 测试每个页面
    for (const pageInfo of pages) {
      console.log(`\n检查页面: ${pageInfo.name} (${pageInfo.path})`);
      
      await page.goto(`http://localhost:5174${pageInfo.path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // 检查页面是否正常加载
      const resumeContent = page.locator('[data-testid="resume-content"]');
      await expect(resumeContent).toBeVisible({ timeout: 10000 });

      // 等待一段时间收集可能的错误
      await page.waitForTimeout(2000);
    }

    // 测试语言切换
    console.log('\n检查语言切换功能');
    await page.goto('http://localhost:5174/');
    await page.waitForLoadState('networkidle');
    
    const langButton = page.locator('[data-testid="language-toggle"]');
    if (await langButton.isVisible()) {
      await langButton.click();
      await page.waitForTimeout(1000);
      await langButton.click();
      await page.waitForTimeout(1000);
    }

    // 测试主题切换
    console.log('\n检查主题切换功能');
    const themeButton = page.locator('[data-testid="theme-toggle"]');
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(1000);
      await themeButton.click();
      await page.waitForTimeout(1000);
    }

    // 分析控制台消息
    const errors = consoleMessages.filter(msg => msg.type === 'error');
    const warnings = consoleMessages.filter(msg => msg.type === 'warning');
    
    console.log(`\n=== 控制台消息统计 ===`);
    console.log(`总消息数: ${consoleMessages.length}`);
    console.log(`错误数: ${errors.length}`);
    console.log(`警告数: ${warnings.length}`);
    console.log(`页面错误数: ${pageErrors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ 控制台错误:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.text}`);
      });
    } else {
      console.log('\n✅ 无控制台错误');
    }

    if (warnings.length > 0) {
      console.log('\n⚠️ 控制台警告:');
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.text}`);
      });
    } else {
      console.log('\n✅ 无控制台警告');
    }

    if (pageErrors.length > 0) {
      console.log('\n❌ 页面错误:');
      pageErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
      });
    } else {
      console.log('\n✅ 无页面错误');
    }

    // 验证不应该有严重错误
    expect(pageErrors.length).toBe(0);
    
    // 过滤掉一些可以忽略的错误（如网络请求失败等）
    const criticalErrors = errors.filter(error => 
      !error.text.includes('Failed to load resource') &&
      !error.text.includes('net::ERR_') &&
      !error.text.includes('favicon.ico') &&
      !error.text.includes('404')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
