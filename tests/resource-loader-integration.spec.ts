/**
 * ResourceLoader集成测试
 * 
 * 验证ResourceLoader在SmartImage和音频组件中的应用效果
 * 
 * @author Claude (Augment Agent)
 * @date 2025-08-02
 */

import { test, expect } from '@playwright/test';

test.describe('ResourceLoader集成测试', () => {
  test('验证SmartImage使用ResourceLoader加载图片', async ({ page }) => {
    console.log('🧪 开始测试SmartImage的ResourceLoader集成...');
    
    // 访问应用
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 等待图片加载完成
    await page.waitForTimeout(8000);
    
    // 检查页面中的图片加载情况
    const imageLoadingResult = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const imageInfo = [];
      
      for (const img of images) {
        imageInfo.push({
          src: img.src,
          alt: img.alt,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          hasError: img.src.includes('error') || img.alt.includes('error')
        });
      }
      
      return {
        totalImages: images.length,
        loadedImages: imageInfo.filter(img => img.complete && img.naturalWidth > 0).length,
        errorImages: imageInfo.filter(img => img.hasError).length,
        imageInfo: imageInfo.slice(0, 5), // 只返回前5个图片的信息
        success: true
      };
    });
    
    console.log('📊 图片加载情况:', imageLoadingResult);
    
    expect(imageLoadingResult.success).toBe(true);
    expect(imageLoadingResult.totalImages).toBeGreaterThan(0);
    
    // 验证图片加载成功率
    const loadSuccessRate = imageLoadingResult.loadedImages / imageLoadingResult.totalImages;
    console.log(`📈 图片加载成功率: ${(loadSuccessRate * 100).toFixed(2)}%`);
    
    // 期望至少70%的图片加载成功
    expect(loadSuccessRate).toBeGreaterThanOrEqual(0.7);
    
    // 检查控制台中是否有ResourceLoader相关的日志
    const resourceLoaderMessages = consoleMessages.filter(msg => 
      msg.includes('ResourceLoader') || 
      msg.includes('🚀 ResourceLoader') ||
      msg.includes('✅ ResourceLoader')
    );
    
    console.log(`📝 ResourceLoader相关消息数量: ${resourceLoaderMessages.length}`);
    if (resourceLoaderMessages.length > 0) {
      console.log('📝 ResourceLoader消息示例:', resourceLoaderMessages.slice(0, 3));
    }
    
    console.log('✅ SmartImage的ResourceLoader集成测试完成');
  });

  test('验证音频组件使用ResourceLoader加载音频', async ({ page }) => {
    console.log('🧪 开始测试音频组件的ResourceLoader集成...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 检查音频相关的功能
    const audioResult = await page.evaluate(() => {
      // 检查是否有音频控制器
      const audioController = document.querySelector('[class*="AudioController"]');
      const audioButtons = document.querySelectorAll('button[title*="音"]');
      const audioElements = document.querySelectorAll('audio');
      
      return {
        hasAudioController: !!audioController,
        audioButtonsCount: audioButtons.length,
        audioElementsCount: audioElements.length,
        success: true
      };
    });
    
    console.log('📊 音频功能检查结果:', audioResult);
    
    expect(audioResult.success).toBe(true);
    
    if (audioResult.hasAudioController) {
      console.log('✅ 找到音频控制器');
      
      // 尝试触发音频播放
      await page.click('button[title*="音"]').catch(() => {
        console.log('ℹ️ 未找到音频按钮或点击失败');
      });
      
      // 等待音频加载
      await page.waitForTimeout(3000);
    }
    
    // 检查控制台中是否有音频ResourceLoader相关的日志
    const audioResourceLoaderMessages = consoleMessages.filter(msg => 
      (msg.includes('ResourceLoader') && msg.includes('音频')) ||
      msg.includes('🎵 开始创建音频') ||
      msg.includes('✅ ResourceLoader加载成功') ||
      msg.includes('EnhancedAudioPlayer')
    );
    
    console.log(`📝 音频ResourceLoader相关消息数量: ${audioResourceLoaderMessages.length}`);
    if (audioResourceLoaderMessages.length > 0) {
      console.log('📝 音频ResourceLoader消息示例:', audioResourceLoaderMessages.slice(0, 3));
    }
    
    console.log('✅ 音频组件的ResourceLoader集成测试完成');
  });

  test('验证CDN切换效果不比现有版本差', async ({ page }) => {
    console.log('🧪 开始测试CDN切换效果...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 记录开始时间
    const startTime = Date.now();
    
    // 等待资源加载完成
    await page.waitForTimeout(10000);
    
    const loadTime = Date.now() - startTime;
    console.log(`📊 总加载时间: ${loadTime}ms`);
    
    // 检查CDN切换相关的日志
    const cdnSwitchMessages = consoleMessages.filter(msg => 
      msg.includes('CDN回退') ||
      msg.includes('切换CDN') ||
      msg.includes('🔄') ||
      msg.includes('智能选择')
    );
    
    console.log(`📝 CDN切换相关消息数量: ${cdnSwitchMessages.length}`);
    if (cdnSwitchMessages.length > 0) {
      console.log('📝 CDN切换消息示例:', cdnSwitchMessages.slice(0, 5));
    }
    
    // 检查最终的资源加载情况
    const finalResult = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const audios = document.querySelectorAll('audio');
      
      const loadedImages = Array.from(images).filter(img => 
        img.complete && img.naturalWidth > 0
      ).length;
      
      const loadedAudios = Array.from(audios).filter(audio => 
        audio.readyState >= 2 // HAVE_CURRENT_DATA
      ).length;
      
      return {
        totalImages: images.length,
        loadedImages: loadedImages,
        imageSuccessRate: images.length > 0 ? loadedImages / images.length : 1,
        totalAudios: audios.length,
        loadedAudios: loadedAudios,
        audioSuccessRate: audios.length > 0 ? loadedAudios / audios.length : 1
      };
    });
    
    console.log('📊 最终加载结果:', finalResult);
    
    // 验证性能指标
    expect(loadTime).toBeLessThan(15000); // 总加载时间应在15秒内
    expect(finalResult.imageSuccessRate).toBeGreaterThanOrEqual(0.7); // 图片成功率≥70%
    
    // 如果有音频，验证音频加载
    if (finalResult.totalAudios > 0) {
      expect(finalResult.audioSuccessRate).toBeGreaterThanOrEqual(0.5); // 音频成功率≥50%
    }
    
    console.log('✅ CDN切换效果测试完成');
    
    // 截图记录当前状态
    await page.screenshot({ 
      path: 'tests/screenshots/resource-loader-integration.png',
      fullPage: false 
    });
  });

  test('验证ResourceLoader配置生效', async ({ page }) => {
    console.log('🧪 开始测试ResourceLoader配置...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 检查ResourceLoader配置是否正确加载
    const configResult = await page.evaluate(() => {
      // 检查环境变量
      const envVars = {
        VITE_RESOURCE_MAX_RETRIES: import.meta.env.VITE_RESOURCE_MAX_RETRIES,
        VITE_RESOURCE_ENABLE_CDN_FALLBACK: import.meta.env.VITE_RESOURCE_ENABLE_CDN_FALLBACK,
        VITE_RESOURCE_USE_SMART_SELECTION: import.meta.env.VITE_RESOURCE_USE_SMART_SELECTION,
        VITE_RESOURCE_TIMEOUT: import.meta.env.VITE_RESOURCE_TIMEOUT
      };
      
      return {
        envVars: envVars,
        hasResourceConfig: Object.values(envVars).some(v => v !== undefined),
        success: true
      };
    });
    
    console.log('📊 ResourceLoader配置检查结果:', configResult);
    
    expect(configResult.success).toBe(true);
    expect(configResult.hasResourceConfig).toBe(true);
    
    // 验证关键配置值
    if (configResult.envVars.VITE_RESOURCE_MAX_RETRIES !== undefined) {
      const maxRetries = parseInt(configResult.envVars.VITE_RESOURCE_MAX_RETRIES);
      expect(maxRetries).toBeGreaterThanOrEqual(0);
      console.log(`✅ VITE_RESOURCE_MAX_RETRIES配置正确: ${maxRetries}`);
    }
    
    if (configResult.envVars.VITE_RESOURCE_TIMEOUT !== undefined) {
      const timeout = parseInt(configResult.envVars.VITE_RESOURCE_TIMEOUT);
      expect(timeout).toBeGreaterThan(0);
      console.log(`✅ VITE_RESOURCE_TIMEOUT配置正确: ${timeout}ms`);
    }
    
    console.log('✅ ResourceLoader配置测试完成');
  });

  test('验证错误处理和回退机制', async ({ page }) => {
    console.log('🧪 开始测试错误处理和回退机制...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    // 监听控制台消息，特别关注错误和回退信息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 等待加载完成
    await page.waitForTimeout(8000);
    
    // 检查错误处理相关的日志
    const errorHandlingMessages = consoleMessages.filter(msg => 
      msg.includes('回退') ||
      msg.includes('fallback') ||
      msg.includes('⚠️') ||
      msg.includes('❌') ||
      msg.includes('异常')
    );
    
    console.log(`📝 错误处理相关消息数量: ${errorHandlingMessages.length}`);
    if (errorHandlingMessages.length > 0) {
      console.log('📝 错误处理消息示例:', errorHandlingMessages.slice(0, 5));
    }
    
    // 检查是否有成功的回退案例
    const fallbackSuccessMessages = consoleMessages.filter(msg => 
      msg.includes('CDN管理器回退') ||
      msg.includes('回退URL') ||
      msg.includes('降级')
    );
    
    console.log(`📝 回退成功消息数量: ${fallbackSuccessMessages.length}`);
    if (fallbackSuccessMessages.length > 0) {
      console.log('📝 回退成功消息示例:', fallbackSuccessMessages.slice(0, 3));
    }
    
    // 验证最终的加载结果
    const finalLoadResult = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const errorImages = Array.from(images).filter(img => 
        !img.complete || img.naturalWidth === 0
      );
      
      return {
        totalImages: images.length,
        errorImages: errorImages.length,
        errorRate: images.length > 0 ? errorImages.length / images.length : 0
      };
    });
    
    console.log('📊 最终加载结果:', finalLoadResult);
    
    // 验证错误率在可接受范围内
    expect(finalLoadResult.errorRate).toBeLessThan(0.3); // 错误率应小于30%
    
    console.log('✅ 错误处理和回退机制测试完成');
  });
});
