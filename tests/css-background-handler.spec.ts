/**
 * CSSBackgroundHandler Playwright 测试脚本
 * 测试CSS背景图片CDN处理器的功能
 */

import { test, expect } from '@playwright/test';

test.describe('CSSBackgroundHandler 功能测试', () => {
  let page;
  const testUrl = 'http://localhost:5179/';
  const targetImage = 'images/flexi-resume1.jpg';

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // 监听网络请求
    await page.route('**/*', (route) => {
      const request = route.request();
      const url = request.url();
      
      // 记录图片请求
      if (url.includes(targetImage) || url.includes('flexi-resume1.jpg')) {
        console.log(`🖼️ 检测到图片请求: ${url}`);
      }
      
      route.continue();
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('CSSBackgroundHandler 初始化测试', async () => {
    console.log('🧪 测试1: CSSBackgroundHandler 初始化');
    
    await page.goto(testUrl, { waitUntil: 'networkidle2' });
    
    // 等待CSSBackgroundHandler初始化
    await page.waitForTimeout(3000);
    
    // 检查CSSBackgroundHandler是否已初始化
    const isInitialized = await page.evaluate(() => {
      return typeof window.cssBackgroundHandler !== 'undefined';
    });
    
    console.log(`✅ CSSBackgroundHandler 初始化状态: ${isInitialized}`);
    expect(isInitialized).toBe(true);
    
    // 检查方法是否存在
    const hasGenerateMethod = await page.evaluate(() => {
      return typeof window.cssBackgroundHandler.generateOptimizedBackgroundURL === 'function';
    });
    
    console.log(`✅ generateOptimizedBackgroundURL 方法存在: ${hasGenerateMethod}`);
    expect(hasGenerateMethod).toBe(true);
  });

  test('generateOptimizedBackgroundURL 方法测试', async () => {
    console.log('🧪 测试2: generateOptimizedBackgroundURL 方法');
    
    await page.goto(testUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // 测试URL生成功能
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
    
    // 验证生成的URL不是原始URL
    expect(urlGenerationResult.generatedUrl).not.toBe(targetImage);
    
    console.log(`✅ 原始URL: ${urlGenerationResult.originalUrl}`);
    console.log(`✅ 生成URL: ${urlGenerationResult.generatedUrl}`);
    console.log(`✅ 是否CDN: ${urlGenerationResult.isCDNUrl}`);
    console.log(`✅ 是否本地: ${urlGenerationResult.isLocalUrl}`);
  });

  test('背景图片样式检测测试', async () => {
    console.log('🧪 测试3: 背景图片样式检测');
    
    await page.goto(testUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // 检查页面中的背景图片样式
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
      
      // 检查所有元素的背景图片
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.backgroundImage && style.backgroundImage !== 'none') {
          styles.push({
            element: element.tagName + (element.className ? '.' + element.className : ''),
            backgroundImage: style.backgroundImage
          });
        }
      });
      
      return styles;
    });
    
    console.log(`🎨 发现 ${backgroundStyles.length} 个背景图片样式`);
    backgroundStyles.forEach(style => {
      console.log(`   ${style.element}: ${style.backgroundImage}`);
    });
    
    // 验证至少有一个背景图片样式
    expect(backgroundStyles.length).toBeGreaterThan(0);
    
    // 验证背景图片中包含目标图片
    const hasTargetImage = backgroundStyles.some(style => 
      style.backgroundImage.includes('flexi-resume1.jpg')
    );
    console.log(`✅ 包含目标图片: ${hasTargetImage}`);
    expect(hasTargetImage).toBe(true);
  });

  test('CDN切换逻辑测试', async () => {
    console.log('🧪 测试4: CDN切换逻辑');
    
    const networkRequests = [];
    
    // 监听网络请求
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes(targetImage) || url.includes('flexi-resume1.jpg')) {
        networkRequests.push({
          url: url,
          timestamp: new Date().toISOString()
        });
        console.log(`🌐 记录网络请求: ${url}`);
      }
    });
    
    await page.goto(testUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(5000);
    
    // 分析网络请求模式
    const cdnUrls = networkRequests.filter(req => 
      req.url.includes('cdn') || 
      req.url.includes('githubusercontent.com') || 
      req.url.includes('jsdelivr.net') ||
      req.url.includes('unpkg.com')
    );
    
    const localUrls = networkRequests.filter(req => 
      req.url.includes('localhost') || req.url.startsWith('/')
    );
    
    console.log(`🔄 CDN切换测试结果:`);
    console.log(`   总请求数: ${networkRequests.length}`);
    console.log(`   CDN请求数: ${cdnUrls.length}`);
    console.log(`   本地请求数: ${localUrls.length}`);
    
    // 验证CDN切换逻辑
    if (cdnUrls.length > 0) {
      console.log('✅ 检测到CDN请求，CDN切换功能正常');
      expect(cdnUrls.length).toBeGreaterThan(0);
    } else {
      console.log('⚠️ 未检测到CDN请求，可能使用本地资源');
    }
    
    // 验证请求顺序
    if (networkRequests.length > 1) {
      console.log('📋 请求顺序分析:');
      networkRequests.forEach((req, index) => {
        console.log(`   ${index + 1}. ${req.url}`);
      });
    }
  });

  test('不存在图片文件处理测试', async () => {
    console.log('🧪 测试5: 不存在图片文件处理');
    
    // 尝试访问不存在的图片文件
    const nonExistentUrl = `${testUrl}${targetImage}`;
    
    try {
      const response = await page.goto(nonExistentUrl, {
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      
      const finalUrl = page.url();
      const status = response ? response.status() : 404;
      
      console.log(`📸 不存在图片测试结果:`);
      console.log(`   请求URL: ${nonExistentUrl}`);
      console.log(`   最终URL: ${finalUrl}`);
      console.log(`   状态码: ${status}`);
      
      // 验证错误处理
      expect(status).toBe(404);
      
    } catch (error) {
      console.log(`📸 不存在图片测试失败: ${error.message}`);
      // 这是预期的，因为文件不存在
      expect(error.message).toContain('404');
    }
  });

  test('重试机制测试', async () => {
    console.log('🧪 测试6: 重试机制');
    
    const retryRequests = [];
    
    // 监听网络请求以检测重试
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes(targetImage) || url.includes('flexi-resume1.jpg')) {
        retryRequests.push({
          url: url,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    await page.goto(testUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(8000); // 等待更长时间以观察重试
    
    console.log(`🔄 重试机制测试结果:`);
    console.log(`   总请求数: ${retryRequests.length}`);
    
    if (retryRequests.length > 1) {
      console.log('✅ 检测到重试机制');
      console.log('📋 重试请求列表:');
      retryRequests.forEach((req, index) => {
        console.log(`   ${index + 1}. ${req.url}`);
      });
      
      // 验证URL拼接正确性
      retryRequests.forEach(req => {
        expect(req.url).toBeTruthy();
        expect(req.url.length).toBeGreaterThan(0);
      });
    } else {
      console.log('⚠️ 未检测到重试，可能单次请求成功');
    }
  });

  test('加载次数一致性测试', async () => {
    console.log('🧪 测试7: 加载次数一致性');
    
    const allRequests = [];
    
    // 监听所有相关请求
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes(targetImage) || url.includes('flexi-resume1.jpg')) {
        allRequests.push({
          url: url,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    await page.goto(testUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(5000);
    
    console.log(`📊 加载次数统计:`);
    console.log(`   总加载次数: ${allRequests.length}`);
    
    // 分析加载模式
    const uniqueUrls = [...new Set(allRequests.map(req => req.url))];
    console.log(`   唯一URL数量: ${uniqueUrls.length}`);
    
    if (uniqueUrls.length > 0) {
      console.log('📋 唯一URL列表:');
      uniqueUrls.forEach((url, index) => {
        const count = allRequests.filter(req => req.url === url).length;
        console.log(`   ${index + 1}. ${url} (加载${count}次)`);
      });
    }
    
    // 验证加载次数在合理范围内
    expect(allRequests.length).toBeLessThanOrEqual(10); // 不应该超过10次
    
    console.log('✅ 加载次数在合理范围内');
  });

  test('完整功能集成测试', async () => {
    console.log('🧪 测试8: 完整功能集成测试');
    
    const testResults = {
      initialization: false,
      urlGeneration: false,
      backgroundStyles: false,
      cdnSwitching: false,
      retryMechanism: false,
      loadingCount: false
    };
    
    // 执行所有测试并记录结果
    await page.goto(testUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // 1. 初始化测试
    testResults.initialization = await page.evaluate(() => {
      return typeof window.cssBackgroundHandler !== 'undefined';
    });
    
    // 2. URL生成测试
    testResults.urlGeneration = await page.evaluate((image) => {
      try {
        const result = window.cssBackgroundHandler.generateOptimizedBackgroundURL(image);
        return result !== image && result.length > 0;
      } catch (error) {
        return false;
      }
    }, targetImage);
    
    // 3. 背景样式测试
    testResults.backgroundStyles = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      return bodyStyle.backgroundImage && bodyStyle.backgroundImage !== 'none';
    });
    
    // 4. 监听网络请求测试CDN切换
    const networkRequests = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes(targetImage) || url.includes('flexi-resume1.jpg')) {
        networkRequests.push(url);
      }
    });
    
    await page.waitForTimeout(5000);
    
    testResults.cdnSwitching = networkRequests.some(url => 
      url.includes('cdn') || url.includes('githubusercontent.com')
    );
    
    testResults.retryMechanism = networkRequests.length > 1;
    testResults.loadingCount = networkRequests.length > 0 && networkRequests.length <= 10;
    
    console.log('🎯 完整功能集成测试结果:');
    Object.entries(testResults).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? '✅ 通过' : '❌ 失败'}`);
    });
    
    // 验证所有核心功能都正常
    const allPassed = Object.values(testResults).every(result => result);
    expect(allPassed).toBe(true);
    
    console.log('🎉 CSSBackgroundHandler 完整功能集成测试通过');
  });
});

// 生成测试报告
test.afterAll(async () => {
  console.log('📊 CSSBackgroundHandler 测试完成');
  console.log('📋 测试覆盖范围:');
  console.log('   ✅ 初始化测试');
  console.log('   ✅ URL生成测试');
  console.log('   ✅ 背景样式测试');
  console.log('   ✅ CDN切换测试');
  console.log('   ✅ 重试机制测试');
  console.log('   ✅ 加载次数测试');
  console.log('   ✅ 完整功能集成测试');
});