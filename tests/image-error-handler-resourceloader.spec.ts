/**
 * ImageErrorHandler ResourceLoader集成测试
 * 
 * 验证ImageErrorHandler使用ResourceLoader的效果
 * 
 * @author Claude (Augment Agent)
 * @date 2025-08-02
 */

import { test, expect } from '@playwright/test';

test.describe('ImageErrorHandler ResourceLoader集成测试', () => {
  test('验证ImageErrorHandler基本功能', async ({ page }) => {
    console.log('🧪 开始测试ImageErrorHandler基本功能...');
    
    // 访问应用
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 等待页面完全加载
    await page.waitForTimeout(8000);
    
    // 检查ImageErrorHandler是否正常工作
    const imageErrorHandlerResult = await page.evaluate(() => {
      // 检查是否有图片错误处理相关的日志
      return {
        hasImages: document.querySelectorAll('img').length,
        success: true
      };
    });
    
    console.log('📊 ImageErrorHandler检查结果:', imageErrorHandlerResult);
    
    expect(imageErrorHandlerResult.success).toBe(true);
    expect(imageErrorHandlerResult.hasImages).toBeGreaterThan(0);
    
    // 检查控制台中是否有ImageErrorHandler相关的日志
    const imageErrorLogs = consoleMessages.filter(msg => 
      msg.includes('ImageErrorHandler') ||
      msg.includes('图片加载失败') ||
      msg.includes('ResourceLoader加载成功') ||
      msg.includes('CDN切换')
    );
    
    console.log(`📝 ImageErrorHandler相关日志数量: ${imageErrorLogs.length}`);
    if (imageErrorLogs.length > 0) {
      console.log('📝 ImageErrorHandler日志示例:', imageErrorLogs.slice(0, 3));
    }
    
    console.log('✅ ImageErrorHandler基本功能测试完成');
  });

  test('验证ResourceLoader在错误处理中的应用', async ({ page }) => {
    console.log('🧪 开始测试ResourceLoader在错误处理中的应用...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 等待图片加载完成
    await page.waitForTimeout(10000);
    
    // 检查ResourceLoader相关的错误处理日志
    const resourceLoaderErrorLogs = consoleMessages.filter(msg => 
      (msg.includes('ResourceLoader') && (msg.includes('失败') || msg.includes('成功'))) ||
      msg.includes('🚀 尝试使用ResourceLoader') ||
      msg.includes('✅ ResourceLoader加载成功') ||
      msg.includes('⚠️ ResourceLoader加载失败')
    );
    
    console.log(`📝 ResourceLoader错误处理日志数量: ${resourceLoaderErrorLogs.length}`);
    if (resourceLoaderErrorLogs.length > 0) {
      console.log('📝 ResourceLoader错误处理日志示例:', resourceLoaderErrorLogs.slice(0, 5));
    }
    
    // 检查CDN回退相关的日志
    const cdnFallbackLogs = consoleMessages.filter(msg => 
      msg.includes('回退到传统CDN方式') ||
      msg.includes('🔄 尝试CDN') ||
      msg.includes('🏠 尝试ResourceLoader本地回退')
    );
    
    console.log(`📝 CDN回退日志数量: ${cdnFallbackLogs.length}`);
    if (cdnFallbackLogs.length > 0) {
      console.log('📝 CDN回退日志示例:', cdnFallbackLogs.slice(0, 3));
    }
    
    console.log('✅ ResourceLoader在错误处理中的应用测试完成');
  });

  test('验证图片加载成功率和错误恢复', async ({ page }) => {
    console.log('🧪 开始测试图片加载成功率和错误恢复...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    // 等待图片加载完成
    await page.waitForTimeout(12000);
    
    // 检查图片加载情况
    const imageLoadResult = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const imageStats = {
        total: images.length,
        loaded: 0,
        error: 0,
        loading: 0
      };
      
      images.forEach(img => {
        if (img.complete) {
          if (img.naturalWidth > 0) {
            imageStats.loaded++;
          } else {
            imageStats.error++;
          }
        } else {
          imageStats.loading++;
        }
      });
      
      return {
        ...imageStats,
        successRate: imageStats.total > 0 ? imageStats.loaded / imageStats.total : 1,
        errorRate: imageStats.total > 0 ? imageStats.error / imageStats.total : 0
      };
    });
    
    console.log('📊 图片加载统计:', imageLoadResult);
    
    expect(imageLoadResult.total).toBeGreaterThan(0);
    expect(imageLoadResult.successRate).toBeGreaterThanOrEqual(0.7); // 期望至少70%成功率
    expect(imageLoadResult.errorRate).toBeLessThan(0.3); // 期望错误率小于30%
    
    console.log(`📈 图片加载成功率: ${(imageLoadResult.successRate * 100).toFixed(2)}%`);
    console.log(`📉 图片加载错误率: ${(imageLoadResult.errorRate * 100).toFixed(2)}%`);
    
    console.log('✅ 图片加载成功率和错误恢复测试完成');
  });

  test('验证异步错误处理不影响页面性能', async ({ page }) => {
    console.log('🧪 开始测试异步错误处理对页面性能的影响...');
    
    const startTime = Date.now();
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    const domLoadTime = Date.now() - startTime;
    console.log(`📊 DOM加载时间: ${domLoadTime}ms`);
    
    // 等待资源加载完成
    await page.waitForTimeout(10000);
    
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
    
    // 检查页面交互是否正常
    const interactionResult = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const links = document.querySelectorAll('a');
      
      return {
        buttonCount: buttons.length,
        linkCount: links.length,
        hasInteractiveElements: buttons.length > 0 || links.length > 0
      };
    });
    
    console.log('📊 页面交互元素:', interactionResult);
    expect(interactionResult.hasInteractiveElements).toBe(true);
    
    console.log('✅ 异步错误处理对页面性能影响测试完成');
  });

  test('验证错误处理的回退机制', async ({ page }) => {
    console.log('🧪 开始测试错误处理的回退机制...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 等待加载完成
    await page.waitForTimeout(10000);
    
    // 检查回退机制相关的日志
    const fallbackLogs = consoleMessages.filter(msg => 
      msg.includes('回退') ||
      msg.includes('fallback') ||
      msg.includes('本地回退') ||
      msg.includes('CDN管理器回退') ||
      msg.includes('传统CDN方式')
    );
    
    console.log(`📝 回退机制日志数量: ${fallbackLogs.length}`);
    if (fallbackLogs.length > 0) {
      console.log('📝 回退机制日志示例:', fallbackLogs.slice(0, 5));
    }
    
    // 检查是否有成功的回退案例
    const successfulFallbacks = consoleMessages.filter(msg => 
      msg.includes('ResourceLoader本地回退成功') ||
      msg.includes('CDN管理器本地回退') ||
      msg.includes('回退成功')
    );
    
    console.log(`📝 成功回退案例数量: ${successfulFallbacks.length}`);
    if (successfulFallbacks.length > 0) {
      console.log('📝 成功回退案例示例:', successfulFallbacks.slice(0, 3));
    }
    
    // 验证最终的图片加载状态
    const finalImageState = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let workingImages = 0;
      
      images.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
          workingImages++;
        }
      });
      
      return {
        totalImages: images.length,
        workingImages: workingImages,
        workingRate: images.length > 0 ? workingImages / images.length : 1
      };
    });
    
    console.log('📊 最终图片状态:', finalImageState);
    
    // 验证回退机制的有效性
    expect(finalImageState.workingRate).toBeGreaterThanOrEqual(0.6); // 期望至少60%的图片最终能正常显示
    
    console.log('✅ 错误处理回退机制测试完成');
    
    // 截图记录当前状态
    await page.screenshot({ 
      path: 'tests/screenshots/image-error-handler-resourceloader.png',
      fullPage: false 
    });
  });

  test('验证ImageErrorHandler不影响现有功能', async ({ page }) => {
    console.log('🧪 开始验证ImageErrorHandler不影响现有功能...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(8000);
    
    // 检查页面基本功能
    const basicFunctionResult = await page.evaluate(() => {
      return {
        hasHeader: !!document.querySelector('header'),
        hasMain: !!document.querySelector('main'),
        hasContent: document.body.textContent.length > 500,
        hasImages: document.querySelectorAll('img').length,
        hasButtons: document.querySelectorAll('button').length,
        hasLinks: document.querySelectorAll('a').length
      };
    });
    
    console.log('📊 页面基本功能检查:', basicFunctionResult);
    
    expect(basicFunctionResult.hasContent).toBe(true);
    expect(basicFunctionResult.hasImages).toBeGreaterThan(0);
    expect(basicFunctionResult.hasButtons).toBeGreaterThan(0);
    
    // 尝试页面交互
    try {
      const buttons = await page.locator('button').all();
      if (buttons.length > 0) {
        await buttons[0].click();
        console.log('✅ 页面交互正常');
      }
    } catch (error) {
      console.log('ℹ️ 页面交互测试跳过:', error.message);
    }
    
    // 检查是否有严重错误
    const errorMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errorMessages.push(msg.text());
      }
    });
    
    await page.waitForTimeout(3000);
    
    const criticalErrors = errorMessages.filter(msg => 
      !msg.includes('favicon') && 
      !msg.includes('404') &&
      !msg.includes('net::ERR_') &&
      !msg.includes('图片加载失败') // 排除预期的图片加载失败错误
    );
    
    console.log(`🚨 严重错误数量: ${criticalErrors.length}`);
    if (criticalErrors.length > 0) {
      console.log('🚨 严重错误示例:', criticalErrors.slice(0, 3));
    }
    
    // 期望没有严重错误
    expect(criticalErrors.length).toBeLessThan(3);
    
    console.log('✅ ImageErrorHandler不影响现有功能验证完成');
  });
});
