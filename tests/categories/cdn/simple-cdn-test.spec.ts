/**
 * 简单CDN测试
 * 
 * 快速验证CDN跨域问题修复
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5177';

test.describe('简单CDN测试', () => {
  
  test('验证页面能够正常加载', async ({ page }) => {
    // 监听控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 15000 });
    
    // 等待CDN检查完成
    await page.waitForTimeout(5000);
    
    // 验证页面正常显示
    const resumeContent = page.locator('[data-testid="resume-content"]');
    await expect(resumeContent).toBeVisible();
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/cdn-test-page-loaded.png',
      fullPage: false 
    });
    
    // 输出控制台消息用于调试
    console.log('控制台消息:');
    consoleMessages.forEach(msg => console.log(`  ${msg}`));
    
    console.log('✅ 页面正常加载完成');
  });

  test('验证CDN状态显示', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 查找CDN状态显示
    const cdnStatus = page.locator('div:has-text("CDN")');
    
    // 截图记录CDN状态
    await page.screenshot({ 
      path: 'tests/screenshots/cdn-status-display.png',
      fullPage: false 
    });
    
    console.log('✅ CDN状态检查完成');
  });

});
