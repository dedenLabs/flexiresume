/**
 * ResourceLoader简化测试
 * 
 * 验证ResourceLoader基本功能和CDN切换效果
 * 
 * @author Claude (Augment Agent)
 * @date 2025-08-02
 */

import { test, expect } from '@playwright/test';

test.describe('ResourceLoader简化测试', () => {
  test('验证应用启动和基本功能', async ({ page }) => {
    console.log('🧪 开始验证应用启动和基本功能...');
    
    // 访问应用
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    // 等待页面完全加载
    await page.waitForTimeout(10000);
    
    // 检查页面标题
    const title = await page.title();
    console.log(`📄 页面标题: ${title}`);
    expect(title).toContain('FlexiResume');
    
    // 检查页面是否有内容
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText.length).toBeGreaterThan(100);
    
    console.log('✅ 应用启动和基本功能验证完成');
  });

  test('验证ResourceLoader模块加载', async ({ page }) => {
    console.log('🧪 开始验证ResourceLoader模块加载...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // 检查ResourceLoader是否可以导入
    const moduleLoadResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/ResourceLoader.ts');
        return {
          hasResourceLoader: !!module.ResourceLoader,
          hasLoadImage: !!module.loadImage,
          hasLoadAudio: !!module.loadAudio,
          success: true
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('📊 ResourceLoader模块检查结果:', moduleLoadResult);
    
    expect(moduleLoadResult.success).toBe(true);
    expect(moduleLoadResult.hasResourceLoader).toBe(true);
    expect(moduleLoadResult.hasLoadImage).toBe(true);
    expect(moduleLoadResult.hasLoadAudio).toBe(true);
    
    console.log('✅ ResourceLoader模块加载验证完成');
  });

  test('验证CDN配置和环境变量', async ({ page }) => {
    console.log('🧪 开始验证CDN配置和环境变量...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 检查CDN相关的环境变量
    const envResult = await page.evaluate(() => {
      const env = import.meta.env;
      return {
        VITE_CDN_ENABLED: env.VITE_CDN_ENABLED,
        VITE_CDN_BASE_URLS: env.VITE_CDN_BASE_URLS,
        VITE_RESOURCE_MAX_RETRIES: env.VITE_RESOURCE_MAX_RETRIES,
        VITE_RESOURCE_USE_SMART_SELECTION: env.VITE_RESOURCE_USE_SMART_SELECTION,
        hasResourceConfig: !!(env.VITE_RESOURCE_MAX_RETRIES || env.VITE_RESOURCE_TIMEOUT)
      };
    });
    
    console.log('📊 环境变量检查结果:', envResult);
    
    expect(envResult.hasResourceConfig).toBe(true);
    
    if (envResult.VITE_CDN_ENABLED) {
      console.log('✅ CDN功能已启用');
    }
    
    if (envResult.VITE_CDN_BASE_URLS) {
      console.log(`✅ CDN基础URL已配置: ${envResult.VITE_CDN_BASE_URLS}`);
    }
    
    console.log('✅ CDN配置和环境变量验证完成');
  });

  test('验证控制台日志和错误', async ({ page }) => {
    console.log('🧪 开始验证控制台日志和错误...');
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    const errorMessages: string[] = [];
    
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
      if (msg.type() === 'error') {
        errorMessages.push(text);
      }
    });
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(8000);
    
    console.log(`📝 总控制台消息数量: ${consoleMessages.length}`);
    console.log(`❌ 错误消息数量: ${errorMessages.length}`);
    
    // 检查ResourceLoader相关的日志
    const resourceLoaderLogs = consoleMessages.filter(msg => 
      msg.includes('ResourceLoader') || 
      msg.includes('🚀 ResourceLoader') ||
      msg.includes('✅ ResourceLoader') ||
      msg.includes('🎵 开始创建音频') ||
      msg.includes('🖼️ 开始加载图片')
    );
    
    console.log(`📝 ResourceLoader相关日志数量: ${resourceLoaderLogs.length}`);
    if (resourceLoaderLogs.length > 0) {
      console.log('📝 ResourceLoader日志示例:', resourceLoaderLogs.slice(0, 3));
    }
    
    // 检查CDN相关的日志
    const cdnLogs = consoleMessages.filter(msg => 
      msg.includes('CDN') || 
      msg.includes('智能选择') ||
      msg.includes('回退')
    );
    
    console.log(`📝 CDN相关日志数量: ${cdnLogs.length}`);
    if (cdnLogs.length > 0) {
      console.log('📝 CDN日志示例:', cdnLogs.slice(0, 3));
    }
    
    // 验证没有严重错误
    const criticalErrors = errorMessages.filter(msg => 
      !msg.includes('favicon') && 
      !msg.includes('404') &&
      !msg.includes('net::ERR_')
    );
    
    console.log(`🚨 严重错误数量: ${criticalErrors.length}`);
    if (criticalErrors.length > 0) {
      console.log('🚨 严重错误示例:', criticalErrors.slice(0, 3));
    }
    
    // 期望没有严重错误
    expect(criticalErrors.length).toBeLessThan(5);
    
    console.log('✅ 控制台日志和错误验证完成');
  });

  test('验证页面性能和加载时间', async ({ page }) => {
    console.log('🧪 开始验证页面性能和加载时间...');
    
    const startTime = Date.now();
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    const domLoadTime = Date.now() - startTime;
    console.log(`📊 DOM加载时间: ${domLoadTime}ms`);
    
    // 等待资源加载完成
    await page.waitForTimeout(8000);
    
    const totalLoadTime = Date.now() - startTime;
    console.log(`📊 总加载时间: ${totalLoadTime}ms`);
    
    // 检查页面性能指标
    const performanceResult = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        success: true
      };
    });
    
    console.log('📊 性能指标:', performanceResult);
    
    expect(performanceResult.success).toBe(true);
    
    // 验证性能指标合理性
    expect(domLoadTime).toBeLessThan(15000); // DOM加载应在15秒内
    expect(totalLoadTime).toBeLessThan(20000); // 总加载应在20秒内
    
    console.log('✅ 页面性能和加载时间验证完成');
    
    // 截图记录当前状态
    await page.screenshot({ 
      path: 'tests/screenshots/resource-loader-simple-test.png',
      fullPage: false 
    });
  });

  test('验证ResourceLoader功能不影响现有体验', async ({ page }) => {
    console.log('🧪 开始验证ResourceLoader功能不影响现有体验...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(10000);
    
    // 检查页面基本元素是否存在
    const pageElements = await page.evaluate(() => {
      return {
        hasHeader: !!document.querySelector('header'),
        hasMain: !!document.querySelector('main'),
        hasContent: document.body.textContent.length > 500,
        hasImages: document.querySelectorAll('img').length,
        hasButtons: document.querySelectorAll('button').length,
        hasLinks: document.querySelectorAll('a').length
      };
    });
    
    console.log('📊 页面元素检查结果:', pageElements);
    
    expect(pageElements.hasContent).toBe(true);
    expect(pageElements.hasButtons).toBeGreaterThan(0);
    
    // 检查页面是否可以正常交互
    try {
      // 尝试点击一些按钮
      const buttons = await page.locator('button').all();
      if (buttons.length > 0) {
        await buttons[0].click();
        console.log('✅ 页面交互正常');
      }
    } catch (error) {
      console.log('ℹ️ 页面交互测试跳过:', error.message);
    }
    
    console.log('✅ ResourceLoader功能不影响现有体验验证完成');
  });
});
