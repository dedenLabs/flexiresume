/**
 * 简化的图片显示修复测试
 * 
 * @author Claude (Augment Agent)
 * @date 2025-07-31
 */

import { test, expect } from '@playwright/test';

test.describe('简化图片显示测试', () => {
  test('验证页面基本加载和图片显示', async ({ page }) => {
    console.log('🧪 开始简化图片显示测试...');
    
    // 访问应用
    await page.goto('http://localhost:5174');
    
    // 等待页面加载
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 截图记录初始状态
    await page.screenshot({ 
      path: 'tests/screenshots/simple-test-initial.png',
      fullPage: false 
    });
    
    // 检查是否有Tab导航
    const tabs = await page.locator('nav a').count();
    console.log(`📊 找到 ${tabs} 个Tab`);
    
    if (tabs > 0) {
      // 点击第一个Tab
      await page.locator('nav a').first().click();
      await page.waitForTimeout(1000);
      
      // 截图记录第一个Tab状态
      await page.screenshot({ 
        path: 'tests/screenshots/simple-test-tab1.png',
        fullPage: false 
      });
      
      if (tabs > 1) {
        // 点击第二个Tab
        await page.locator('nav a').nth(1).click();
        await page.waitForTimeout(1000);
        
        // 截图记录第二个Tab状态
        await page.screenshot({ 
          path: 'tests/screenshots/simple-test-tab2.png',
          fullPage: false 
        });
        
        // 再次点击第一个Tab
        await page.locator('nav a').first().click();
        await page.waitForTimeout(1000);
        
        // 截图记录回到第一个Tab的状态
        await page.screenshot({ 
          path: 'tests/screenshots/simple-test-tab1-return.png',
          fullPage: false 
        });
      }
    }
    
    // 检查图片元素
    const images = await page.locator('img').count();
    console.log(`🖼️ 找到 ${images} 个图片元素`);
    
    // 验证至少有一些图片
    expect(images).toBeGreaterThan(0);
    
    // 检查控制台错误
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // 等待一段时间收集错误
    await page.waitForTimeout(2000);
    
    if (consoleErrors.length > 0) {
      console.log('⚠️ 发现控制台错误:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ 无控制台错误');
    }
    
    console.log('🎉 简化图片显示测试完成');
  });
});
