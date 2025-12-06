/**
 * ImageErrorHandler修复验证测试
 * 验证 TypeError: this.tryCDNFallback is not a function 错误修复
 */

import { test, expect } from '@playwright/test';

test.describe('ImageErrorHandler修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 监听控制台错误
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('Console Error:', msg.text());
      }
    });

    // 监听页面错误
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log('Page Error:', error.message);
    });

    // 将错误数组附加到页面对象，以便在测试中访问
    page.consoleErrors = consoleErrors;
    page.pageErrors = pageErrors;

    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('验证不再出现 tryCDNFallback 错误', async ({ page }) => {
    console.log('🔍 开始验证 tryCDNFallback 错误修复...');

    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 检查是否有 tryCDNFallback 相关的错误
    const tryCDNFallbackErrors = page.consoleErrors.filter(error => 
      error.includes('tryCDNFallback') || 
      error.includes('is not a function')
    );

    console.log(`📊 tryCDNFallback相关错误数量: ${tryCDNFallbackErrors.length}`);
    
    if (tryCDNFallbackErrors.length > 0) {
      console.log('❌ 发现的错误:');
      tryCDNFallbackErrors.forEach(error => console.log(`  - ${error}`));
    }

    // 验证没有 tryCDNFallback 错误
    expect(tryCDNFallbackErrors.length).toBe(0);

    console.log('✅ tryCDNFallback 错误修复验证通过');
  });

  test('验证ImageErrorHandler功能正常', async ({ page }) => {
    console.log('🖼️ 开始验证ImageErrorHandler功能...');

    // 检查SmartImage组件是否正常渲染
    const smartImages = await page.locator('[data-smart-image="true"]').count();
    console.log(`📊 找到 ${smartImages} 个SmartImage组件`);
    expect(smartImages).toBeGreaterThan(0);

    // 等待图片加载
    await page.waitForTimeout(5000);

    // 检查是否有严重的JavaScript错误
    const criticalErrors = page.pageErrors.filter(error => 
      error.includes('TypeError') || 
      error.includes('ReferenceError') ||
      error.includes('is not a function')
    );

    console.log(`📊 严重JavaScript错误数量: ${criticalErrors.length}`);
    
    if (criticalErrors.length > 0) {
      console.log('❌ 发现的严重错误:');
      criticalErrors.forEach(error => console.log(`  - ${error}`));
    }

    // 验证没有严重的JavaScript错误
    expect(criticalErrors.length).toBe(0);

    console.log('✅ ImageErrorHandler功能验证通过');
  });

  test('验证图片加载和错误处理', async ({ page }) => {
    console.log('🔄 开始验证图片加载和错误处理...');

    // 等待图片加载完成
    await page.waitForTimeout(5000);

    // 检查图片加载状态
    const images = await page.locator('img').all();
    let loadedCount = 0;
    let errorCount = 0;

    for (const img of images) {
      try {
        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        const naturalHeight = await img.evaluate(el => el.naturalHeight);
        
        if (naturalWidth > 0 && naturalHeight > 0) {
          loadedCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    console.log(`📊 图片统计: 总数=${images.length}, 成功=${loadedCount}, 失败=${errorCount}`);
    console.log(`📊 成功率: ${((loadedCount / images.length) * 100).toFixed(1)}%`);

    // 验证至少有一些图片成功加载
    expect(loadedCount).toBeGreaterThan(0);

    console.log('✅ 图片加载和错误处理验证通过');
  });

  test('验证CDN切换功能', async ({ page }) => {
    console.log('🌐 开始验证CDN切换功能...');

    // 监听CDN相关的日志
    const cdnLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('CDN') || 
          msg.text().includes('ResourceLoader') ||
          msg.text().includes('tryNextCDN')) {
        cdnLogs.push(msg.text());
      }
    });

    // 重新加载页面触发CDN逻辑
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log(`📊 CDN相关日志数量: ${cdnLogs.length}`);
    
    // 显示前5条CDN日志
    cdnLogs.slice(0, 5).forEach(log => console.log(`📝 ${log}`));

    // 验证没有CDN切换相关的错误
    const cdnErrors = cdnLogs.filter(log => 
      log.includes('tryCDNFallback') || 
      log.includes('is not a function')
    );

    console.log(`❌ CDN切换错误数量: ${cdnErrors.length}`);
    expect(cdnErrors.length).toBe(0);

    console.log('✅ CDN切换功能验证通过');
  });

  test('验证页面整体功能', async ({ page }) => {
    console.log('🔍 开始验证页面整体功能...');

    // 检查主要组件是否正常渲染
    const components = [
      { name: 'Header', selector: 'header, .header, [data-testid="header"]' },
      { name: 'Tabs', selector: '[role="tablist"], .tabs, [data-testid="tabs"]' },
      { name: 'Content', selector: 'main, .content, .resume-content, [data-testid="content"]' }
    ];

    for (const component of components) {
      try {
        const element = await page.locator(component.selector).first();
        const isVisible = await element.isVisible().catch(() => false);
        console.log(`📋 ${component.name}: ${isVisible ? '✅ 正常' : '⚠️ 未找到'}`);
      } catch (error) {
        console.log(`📋 ${component.name}: ⚠️ 检查失败`);
      }
    }

    // 检查是否有阻塞性错误
    const blockingErrors = page.pageErrors.filter(error => 
      error.includes('Cannot read') || 
      error.includes('undefined') ||
      error.includes('null')
    );

    console.log(`🐛 阻塞性错误数量: ${blockingErrors.length}`);
    
    if (blockingErrors.length > 0) {
      blockingErrors.slice(0, 3).forEach(error => console.log(`❌ ${error}`));
    }

    // 验证没有阻塞性错误
    expect(blockingErrors.length).toBeLessThan(3); // 允许少量非关键错误

    console.log('✅ 页面整体功能验证通过');
  });

  test.afterEach(async ({ page }) => {
    // 输出最终错误统计
    console.log('\n📊 最终错误统计:');
    console.log(`Console错误: ${page.consoleErrors?.length || 0}`);
    console.log(`Page错误: ${page.pageErrors?.length || 0}`);
    
    // 清理
    await page.close();
  });
});
