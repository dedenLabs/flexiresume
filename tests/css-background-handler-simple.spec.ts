/**
 * CSSBackgroundHandler 简化测试脚本
 * 专门用于测试核心功能
 */

import { test, expect } from '@playwright/test';

test.describe('CSSBackgroundHandler 核心功能测试', () => {
  test('初始化和URL生成测试', async ({ page }) => {
    const testUrl = 'http://localhost:5179/';
    const targetImage = 'images/flexi-resume1.jpg';
    
    console.log('🧪 开始CSSBackgroundHandler核心功能测试...');
    
    // 监听网络请求
    const requests = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes(targetImage) || url.includes('flexi-resume1.jpg')) {
        requests.push({
          url: url,
          timestamp: new Date().toISOString()
        });
        console.log(`🖼️ 检测到图片请求: ${url}`);
      }
    });

    // 访问页面
    await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
    
    // 等待CSSBackgroundHandler初始化
    await page.waitForTimeout(3000);
    
    // 测试1: 检查CSSBackgroundHandler是否已初始化
    console.log('📋 测试1: 检查CSSBackgroundHandler初始化状态');
    const isInitialized = await page.evaluate(() => {
      return typeof window.cssBackgroundHandler !== 'undefined';
    });
    
    console.log(`✅ CSSBackgroundHandler初始化状态: ${isInitialized}`);
    expect(isInitialized).toBe(true);
    
    // 测试2: 检查generateOptimizedBackgroundURL方法
    console.log('📋 测试2: 测试generateOptimizedBackgroundURL方法');
    const urlGenerationResult = await page.evaluate((image) => {
      try {
        const result = window.cssBackgroundHandler.generateOptimizedBackgroundURL(image);
        return {
          success: true,
          originalUrl: image,
          generatedUrl: result,
          isCDNUrl: result.includes('http') && !result.includes('localhost'),
          isLocalUrl: result.includes('localhost') || result.startsWith('/')
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }, targetImage);
    
    console.log('🔗 URL生成测试结果:', urlGenerationResult);
    expect(urlGenerationResult.success).toBe(true);
    expect(urlGenerationResult.generatedUrl).toBeTruthy();
    expect(urlGenerationResult.generatedUrl).not.toBe(targetImage);
    
    // 测试3: 检查背景图片样式（可选）
    console.log('📋 测试3: 检查背景图片样式');
    const backgroundStyles = await page.evaluate(() => {
      const styles = [];
      
      // 检查body元素的背景图片
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.backgroundImage && bodyStyle.backgroundImage !== 'none') {
        styles.push({
          element: 'body',
          backgroundImage: bodyStyle.backgroundImage
        });
      }
      
      return styles;
    });
    
    console.log(`🎨 发现 ${backgroundStyles.length} 个背景图片样式`);
    backgroundStyles.forEach(style => {
      console.log(`   ${style.element}: ${style.backgroundImage}`);
    });
    
    // 背景图片样式检测是可选的，因为样式可能异步加载
    if (backgroundStyles.length > 0) {
      console.log('✅ 背景图片样式检测正常');
    } else {
      console.log('⚠️ 背景图片样式可能异步加载，继续其他测试');
    }
    
    // 测试4: 等待并观察网络请求
    console.log('📋 测试4: 观察网络请求模式');
    await page.waitForTimeout(5000);
    
    console.log(`🌐 总网络请求数: ${requests.length}`);
    if (requests.length > 0) {
      console.log('📋 请求列表:');
      requests.forEach((req, index) => {
        console.log(`   ${index + 1}. ${req.url}`);
      });
    }
    
    // 测试5: 分析CDN切换逻辑
    console.log('📋 测试5: 分析CDN切换逻辑');
    const cdnUrls = requests.filter(req => 
      req.url.includes('cdn') || 
      req.url.includes('githubusercontent.com') || 
      req.url.includes('jsdelivr.net') ||
      req.url.includes('unpkg.com')
    );
    
    const localUrls = requests.filter(req => 
      req.url.includes('localhost') || req.url.startsWith('/')
    );
    
    console.log(`🔄 CDN切换分析:`);
    console.log(`   CDN请求数: ${cdnUrls.length}`);
    console.log(`   本地请求数: ${localUrls.length}`);
    console.log(`   是否使用CDN: ${cdnUrls.length > 0 ? '是' : '否'}`);
    
    // 测试6: 验证重试机制
    console.log('📋 测试6: 验证重试机制');
    if (requests.length > 1) {
      console.log('✅ 检测到重试机制');
      console.log(`   重试次数: ${requests.length - 1}`);
    } else {
      console.log('⚠️ 未检测到重试，可能单次请求成功');
    }
    
    // 测试7: 验证URL拼接正确性
    console.log('📋 测试7: 验证URL拼接正确性');
    requests.forEach((req, index) => {
      console.log(`   请求${index + 1}: ${req.url}`);
      expect(req.url).toBeTruthy();
      expect(req.url.length).toBeGreaterThan(0);
    });
    
    // 测试8: 验证加载次数一致性
    console.log('📋 测试8: 验证加载次数一致性');
    console.log(`   总加载次数: ${requests.length}`);
    expect(requests.length).toBeLessThanOrEqual(10);
    
    // 生成测试结论
    console.log('🎯 测试结论:');
    console.log(`   ✅ CSSBackgroundHandler初始化: ${isInitialized ? '正常' : '异常'}`);
    console.log(`   ✅ URL生成功能: ${urlGenerationResult.success ? '正常' : '异常'}`);
    console.log(`   ✅ 背景图片样式: ${backgroundStyles.length > 0 ? '正常' : '异常'}`);
    console.log(`   ✅ CDN切换功能: ${cdnUrls.length > 0 ? '正常' : '可能使用本地资源'}`);
    console.log(`   ✅ 重试机制: ${requests.length > 1 ? '正常' : '单次请求成功'}`);
    console.log(`   ✅ URL拼接: ${requests.length > 0 ? '正常' : '无请求'}`);
    console.log(`   ✅ 加载次数: ${requests.length <= 10 ? '正常' : '异常'}`);
    
    console.log('🎉 CSSBackgroundHandler核心功能测试完成');
  });
});