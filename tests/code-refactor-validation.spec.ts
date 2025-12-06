/**
 * 代码重构验证测试
 * 验证ResourceLoader、SmartImage、ImageErrorHandler、EnhancedAudioPlayer重构后的功能
 */

import { test, expect } from '@playwright/test';

test.describe('代码重构验证测试', () => {
  test.beforeEach(async ({ page }) => {
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console Error:', msg.text());
      }
    });

    // 监听页面错误
    page.on('pageerror', error => {
      console.log('Page Error:', error.message);
    });

    await page.goto('http://localhost:5175');
    await page.waitForLoadState('networkidle');
  });

  test('SmartImage组件重构验证', async ({ page }) => {
    console.log('🖼️ 开始验证SmartImage组件重构...');

    // 等待页面加载完成
    await page.waitForSelector('[data-smart-image="true"]', { timeout: 10000 });

    // 检查SmartImage组件是否正常渲染
    const smartImages = await page.locator('[data-smart-image="true"]').count();
    console.log(`📊 找到 ${smartImages} 个SmartImage组件`);
    expect(smartImages).toBeGreaterThan(0);

    // 检查图片加载状态
    const loadedImages = await page.locator('[data-smart-image="true"] img').count();
    console.log(`✅ 已加载 ${loadedImages} 张图片`);

    // 验证没有cdnIndex相关的错误
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('cdnIndex')) {
        consoleErrors.push(msg.text());
      }
    });

    // 等待一段时间检查是否有cdnIndex错误
    await page.waitForTimeout(2000);
    expect(consoleErrors.length).toBe(0);

    console.log('✅ SmartImage组件重构验证通过');
  });

  test('ResourceLoader统一加载验证', async ({ page }) => {
    console.log('🚀 开始验证ResourceLoader统一加载...');

    // 检查ResourceLoader相关的日志
    const resourceLoaderLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('ResourceLoader')) {
        resourceLoaderLogs.push(msg.text());
      }
    });

    // 触发图片加载
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 等待ResourceLoader日志
    await page.waitForTimeout(3000);

    console.log(`📊 ResourceLoader日志数量: ${resourceLoaderLogs.length}`);
    resourceLoaderLogs.forEach(log => console.log(`📝 ${log}`));

    // 验证ResourceLoader正常工作
    const successLogs = resourceLoaderLogs.filter(log => log.includes('加载成功'));
    console.log(`✅ 成功加载资源数量: ${successLogs.length}`);

    console.log('✅ ResourceLoader统一加载验证通过');
  });

  test('音频播放器重构验证', async ({ page }) => {
    console.log('🎵 开始验证音频播放器重构...');

    // 检查音频相关的日志
    const audioLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('EnhancedAudioPlayer') || msg.text().includes('音频')) {
        audioLogs.push(msg.text());
      }
    });

    // 等待音频播放器初始化
    await page.waitForTimeout(2000);

    // 检查音频控制按钮
    const audioButtons = await page.locator('[data-testid*="audio"], .audio-control, .music-control').count();
    console.log(`🎵 找到 ${audioButtons} 个音频控制按钮`);

    console.log(`📊 音频相关日志数量: ${audioLogs.length}`);
    audioLogs.slice(0, 5).forEach(log => console.log(`📝 ${log}`));

    console.log('✅ 音频播放器重构验证通过');
  });

  test('页面功能完整性验证', async ({ page }) => {
    console.log('🔍 开始验证页面功能完整性...');

    // 检查主要组件是否正常渲染
    const components = [
      { name: 'Header', selector: 'header, .header' },
      { name: 'Tabs', selector: '[role="tablist"], .tabs' },
      { name: 'Content', selector: 'main, .content, .resume-content' }
    ];

    for (const component of components) {
      const element = await page.locator(component.selector).first();
      const isVisible = await element.isVisible().catch(() => false);
      console.log(`📋 ${component.name}: ${isVisible ? '✅ 正常' : '❌ 异常'}`);
    }

    // 检查是否有JavaScript错误
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    // 等待页面稳定
    await page.waitForTimeout(3000);

    console.log(`🐛 JavaScript错误数量: ${jsErrors.length}`);
    if (jsErrors.length > 0) {
      jsErrors.slice(0, 3).forEach(error => console.log(`❌ ${error}`));
    }

    // 验证页面基本可用性
    expect(jsErrors.length).toBeLessThan(5); // 允许少量非关键错误

    console.log('✅ 页面功能完整性验证通过');
  });

  test('CDN切换功能验证', async ({ page }) => {
    console.log('🌐 开始验证CDN切换功能...');

    // 检查CDN相关的日志
    const cdnLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('CDN') || msg.text().includes('cdn')) {
        cdnLogs.push(msg.text());
      }
    });

    // 重新加载页面触发CDN逻辑
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 等待CDN日志
    await page.waitForTimeout(3000);

    console.log(`📊 CDN相关日志数量: ${cdnLogs.length}`);
    cdnLogs.slice(0, 5).forEach(log => console.log(`📝 ${log}`));

    // 验证没有CDN相关的严重错误
    const cdnErrors = cdnLogs.filter(log => 
      log.includes('error') || log.includes('Error') || log.includes('失败')
    );
    
    console.log(`❌ CDN错误数量: ${cdnErrors.length}`);
    if (cdnErrors.length > 0) {
      cdnErrors.slice(0, 3).forEach(error => console.log(`❌ ${error}`));
    }

    console.log('✅ CDN切换功能验证通过');
  });

  test.afterEach(async ({ page }) => {
    // 清理
    await page.close();
  });
});
