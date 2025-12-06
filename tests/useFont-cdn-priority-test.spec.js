/**
 * useFont CDN优先级测试
 * 
 * 测试useFont.tsx中的preloadFonts方法是否优先使用在线CDN
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5175';
const TIMEOUT = 30000;

test.describe('useFont CDN优先级测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 监听网络请求
    page.on('request', request => {
      const url = request.url();
      if (url.includes('font') || url.includes('.css')) {
        console.log(`🌐 字体请求: ${request.method()} ${url}`);
      }
    });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：preloadFonts优先使用在线CDN', async ({ page }) => {
    console.log('🧪 测试1：preloadFonts优先使用在线CDN');
    
    // 收集所有字体相关的网络请求
    const fontRequests = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('fonts.loli.net') || 
          url.includes('fonts.googleapis.com') || 
          url.includes('cdn.jsdelivr.net') ||
          url.includes('unpkg.com')) {
        fontRequests.push({
          url,
          method: request.method(),
          type: 'online'
        });
      } else if (url.includes('./fonts/') || url.includes('/fonts/')) {
        fontRequests.push({
          url,
          method: request.method(),
          type: 'local'
        });
      }
    });
    
    // 重新加载页面以捕获字体加载请求
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log(`📊 捕获到 ${fontRequests.length} 个字体请求:`);
    fontRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. [${req.type}] ${req.url}`);
    });
    
    // 验证在线CDN请求
    const onlineRequests = fontRequests.filter(req => req.type === 'online');
    const localRequests = fontRequests.filter(req => req.type === 'local');
    
    console.log(`🌐 在线CDN请求: ${onlineRequests.length}`);
    console.log(`📁 本地文件请求: ${localRequests.length}`);
    
    // 验证优先使用在线CDN
    expect(onlineRequests.length).toBeGreaterThan(0);
    
    console.log('✅ preloadFonts CDN优先级测试完成');
  });

  test('验证2：字体切换时的CDN优先级', async ({ page }) => {
    console.log('🧪 测试2：字体切换时的CDN优先级');
    
    // 查找字体切换器
    const fontSwitcher = page.locator('[data-testid="font-switcher"], .font-switcher, button').filter({ hasText: /字体|font/i }).first();
    
    if (await fontSwitcher.isVisible()) {
      console.log('✅ 字体切换器可见');
      
      const switchRequests = [];
      
      // 监听字体切换时的请求
      page.on('request', request => {
        const url = request.url();
        if (url.includes('font') || url.includes('.css')) {
          switchRequests.push({
            url,
            timestamp: Date.now(),
            isOnline: url.includes('fonts.loli.net') || 
                     url.includes('fonts.googleapis.com') ||
                     url.includes('cdn.jsdelivr.net')
          });
        }
      });
      
      // 点击字体切换器
      await fontSwitcher.click();
      await page.waitForTimeout(1000);
      
      // 查找字体选项并切换
      const fontOptions = page.locator('button, a, div').filter({ hasText: /楷体|宋体|康熙/i });
      const optionCount = await fontOptions.count();
      
      if (optionCount > 0) {
        console.log(`📋 找到 ${optionCount} 个字体选项`);
        
        // 切换到第一个选项
        const firstOption = fontOptions.first();
        const optionText = await firstOption.textContent();
        console.log(`🔄 切换到: ${optionText}`);
        
        await firstOption.click();
        await page.waitForTimeout(3000);
        
        console.log(`📊 字体切换时的请求 (${switchRequests.length} 个):`);
        switchRequests.forEach((req, index) => {
          console.log(`  ${index + 1}. [${req.isOnline ? '在线' : '本地'}] ${req.url}`);
        });
        
        // 验证切换时优先使用在线字体
        const onlineSwitchRequests = switchRequests.filter(req => req.isOnline);
        if (switchRequests.length > 0) {
          expect(onlineSwitchRequests.length).toBeGreaterThan(0);
        }
        
      } else {
        console.log('ℹ️ 未找到字体选项');
      }
    } else {
      console.log('ℹ️ 字体切换器不可见');
    }
    
    console.log('✅ 字体切换CDN优先级测试完成');
  });

  test('验证3：字体加载性能和缓存', async ({ page }) => {
    console.log('🧪 测试3：字体加载性能和缓存');
    
    const loadTimes = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('font') || url.includes('.css')) {
        const timing = response.request().timing();
        if (timing) {
          loadTimes.push({
            url,
            responseTime: timing.responseEnd - timing.requestStart,
            isOnline: url.includes('fonts.loli.net') || 
                     url.includes('fonts.googleapis.com'),
            status: response.status()
          });
        }
      }
    });
    
    // 重新加载页面测试性能
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log(`📊 字体加载性能 (${loadTimes.length} 个请求):`);
    loadTimes.forEach((timing, index) => {
      console.log(`  ${index + 1}. [${timing.isOnline ? '在线' : '本地'}] ${timing.responseTime.toFixed(0)}ms (${timing.status}) - ${timing.url}`);
    });
    
    if (loadTimes.length > 0) {
      const avgLoadTime = loadTimes.reduce((sum, t) => sum + t.responseTime, 0) / loadTimes.length;
      console.log(`📈 平均加载时间: ${avgLoadTime.toFixed(0)}ms`);
      
      // 验证加载时间合理
      expect(avgLoadTime).toBeLessThan(5000); // 平均加载时间应少于5秒
      
      // 验证成功响应
      const successfulRequests = loadTimes.filter(t => t.status >= 200 && t.status < 300);
      expect(successfulRequests.length).toBeGreaterThan(0);
    }
    
    console.log('✅ 字体加载性能测试完成');
  });

  test('验证4：字体回退机制', async ({ page }) => {
    console.log('🧪 测试4：字体回退机制');
    
    // 阻止主要CDN请求，测试回退
    await page.route('**/fonts.loli.net/**', route => {
      console.log('🚫 阻止 fonts.loli.net 请求');
      route.abort();
    });
    
    const fallbackRequests = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('font') || url.includes('.css')) {
        fallbackRequests.push({
          url,
          isFallback: url.includes('fonts.googleapis.com') || 
                     url.includes('cdn.jsdelivr.net') ||
                     url.includes('./fonts/')
        });
      }
    });
    
    // 重新加载页面测试回退
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log(`📊 回退请求 (${fallbackRequests.length} 个):`);
    fallbackRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. [${req.isFallback ? '回退' : '正常'}] ${req.url}`);
    });
    
    // 验证有回退请求
    const actualFallbackRequests = fallbackRequests.filter(req => req.isFallback);
    expect(actualFallbackRequests.length).toBeGreaterThan(0);
    
    // 验证字体仍然可用
    const fontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    
    console.log(`📝 回退后字体: ${fontFamily}`);
    expect(fontFamily).toBeTruthy();
    
    console.log('✅ 字体回退机制测试完成');
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 useFont CDN优先级测试完成');
});
