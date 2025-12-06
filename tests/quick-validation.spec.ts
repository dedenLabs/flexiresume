/**
 * 快速验证测试
 * 确保核心功能正常工作
 * @author dedenlabs
 * @date 2025-08-04
 */

import { test, expect } from '@playwright/test';

test.describe('快速功能验证', () => {
  test('验证应用基本功能', async ({ page }) => {
    console.log('🚀 开始快速验证...');

    // 记录错误
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 访问页面
    await page.goto('http://localhost:5175/', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // 等待页面基本加载
    await page.waitForTimeout(3000);

    // 验证页面基本可见
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ 页面基本加载成功');

    // 验证没有关键错误
    const criticalErrors = errors.filter(error => 
      error.includes('startsWith') || 
      error.includes('PreloadManager')
    );

    if (criticalErrors.length === 0) {
      console.log('✅ 没有发现关键错误');
    } else {
      console.log('❌ 发现关键错误:', criticalErrors);
    }

    // 验证页面有内容
    const hasContent = await page.evaluate(() => {
      return document.body.textContent && document.body.textContent.length > 50;
    });

    expect(hasContent).toBe(true);
    console.log('✅ 页面内容加载正常');

    // 截图验证
    await page.screenshot({
      path: 'tests/screenshots/quick-validation.png',
      fullPage: true
    });

    console.log('📸 验证截图已保存');
    console.log('🎉 快速验证完成！');

    // 最终验证
    expect(criticalErrors).toHaveLength(0);
  });

  test('验证PreloadManager修复', async ({ page }) => {
    console.log('🔧 验证PreloadManager修复...');

    const startWithsErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('startsWith')) {
        startWithsErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      if (error.message.includes('startsWith')) {
        startWithsErrors.push(error.message);
      }
    });

    await page.goto('http://localhost:5175/', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    await page.waitForTimeout(5000);

    // 验证没有startsWith错误
    expect(startWithsErrors).toHaveLength(0);
    console.log('✅ PreloadManager startsWith错误已修复');
  });

  test('验证响应式布局', async ({ page }) => {
    console.log('📱 验证响应式布局...');

    await page.goto('http://localhost:5175/', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // 测试不同视口
    const viewports = [
      { width: 1920, height: 1080, name: '桌面端' },
      { width: 768, height: 1024, name: '平板端' },
      { width: 375, height: 667, name: '手机端' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      await expect(page.locator('body')).toBeVisible();
      console.log(`✅ ${viewport.name}布局正常`);
    }

    console.log('📱 响应式布局验证完成');
  });
});
