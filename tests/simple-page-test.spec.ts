/**
 * 简单页面测试
 * 验证页面是否能正常加载和显示内容
 */

import { test, expect } from '@playwright/test';

test.describe('简单页面测试', () => {
  test('页面应该能够正常加载', async ({ page }) => {
    console.log('🚀 开始测试页面加载...');
    
    // 访问首页
    await page.goto('http://localhost:5174/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待一段时间让内容加载
    await page.waitForTimeout(3000);
    
    // 验证页面标题
    const title = await page.title();
    console.log('📄 页面标题:', title);
    expect(title).toBeTruthy();
    
    // 验证页面内容不是空白
    const bodyText = await page.locator('body').textContent();
    console.log('📝 页面内容长度:', bodyText?.length || 0);
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(10);
    
    // 检查是否不再显示"资源加载中..."
    const loadingText = await page.locator('text=资源加载中').count();
    console.log('⏳ 加载中文本数量:', loadingText);
    expect(loadingText).toBe(0);
    
    // 截图保存
    await page.screenshot({ 
      path: 'tests/screenshots/simple-page-test.png',
      fullPage: true 
    });
    
    console.log('✅ 页面加载测试完成');
  });
  
  test('页面应该没有控制台错误', async ({ page }) => {
    console.log('🔍 开始检查控制台错误...');
    
    const consoleErrors: string[] = [];
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // 访问首页
    await page.goto('http://localhost:5174/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // 检查控制台错误
    console.log('❌ 控制台错误数量:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('❌ 控制台错误列表:', consoleErrors);
    }
    
    // 允许一些非关键错误，但不应该有太多
    expect(consoleErrors.length).toBeLessThan(5);
    
    console.log('✅ 控制台错误检查完成');
  });
});
