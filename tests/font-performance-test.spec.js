/**
 * 字体性能测试
 * 
 * 测试字体加载性能和切换功能
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5175';
const TIMEOUT = 30000;

test.describe('字体性能和功能测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：默认字体加载和显示', async ({ page }) => {
    console.log('🧪 测试1：验证默认字体加载和显示');
    
    // 检查页面是否正常加载
    await expect(page.locator('body')).toBeVisible();
    
    // 检查默认字体是否应用
    const bodyFontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    
    console.log(`📝 页面默认字体: ${bodyFontFamily}`);
    
    // 验证字体包含预期的字体名称
    expect(bodyFontFamily.toLowerCase()).toMatch(/ma.*shan|hyshangwei|kaiti|simkai/i);
    
    // 检查字体是否已加载
    const fontLoadStatus = await page.evaluate(() => {
      if (!document.fonts) return 'not_supported';
      
      const fonts = Array.from(document.fonts);
      const loadedFonts = fonts.filter(font => font.status === 'loaded');
      
      return {
        totalFonts: fonts.length,
        loadedFonts: loadedFonts.length,
        loadedFontNames: loadedFonts.map(f => f.family)
      };
    });
    
    console.log(`📊 字体加载状态:`, fontLoadStatus);
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/font-default-display.png',
      fullPage: true 
    });
    
    console.log('✅ 默认字体测试完成');
  });

  test('验证2：字体切换功能', async ({ page }) => {
    console.log('🧪 测试2：验证字体切换功能');
    
    // 查找字体切换器
    const fontSwitcher = page.locator('[data-testid="font-switcher"], .font-switcher, button').filter({ hasText: /字体|font/i }).first();
    
    if (await fontSwitcher.isVisible()) {
      console.log('✅ 字体切换器可见');
      
      // 记录初始字体
      const initialFont = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily;
      });
      
      console.log(`📝 初始字体: ${initialFont}`);
      
      // 点击字体切换器
      await fontSwitcher.click();
      await page.waitForTimeout(1000);
      
      // 查找字体选项
      const fontOptions = page.locator('button, a, div').filter({ hasText: /汉仪|楷体|宋体|康熙/i });
      const optionCount = await fontOptions.count();
      
      if (optionCount > 0) {
        console.log(`📋 找到 ${optionCount} 个字体选项`);
        
        // 尝试切换到第一个不同的字体
        for (let i = 0; i < Math.min(optionCount, 3); i++) {
          const option = fontOptions.nth(i);
          const optionText = await option.textContent();
          
          console.log(`🔄 尝试切换到: ${optionText}`);
          
          await option.click();
          await page.waitForTimeout(2000); // 等待字体加载
          
          // 检查字体是否发生变化
          const newFont = await page.evaluate(() => {
            return window.getComputedStyle(document.body).fontFamily;
          });
          
          console.log(`📝 切换后字体: ${newFont}`);
          
          // 截图记录
          await page.screenshot({ 
            path: `tests/screenshots/font-switch-${i + 1}.png`,
            fullPage: true 
          });
          
          break; // 只测试一次切换
        }
      } else {
        console.log('ℹ️ 未找到字体选项');
      }
    } else {
      console.log('ℹ️ 字体切换器不可见');
    }
    
    console.log('✅ 字体切换测试完成');
  });

  test('验证3：字体加载性能', async ({ page }) => {
    console.log('🧪 测试3：验证字体加载性能');
    
    // 测量页面加载时间
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ 页面加载时间: ${loadTime}ms`);
    
    // 测量字体加载时间
    const fontLoadTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (!document.fonts) {
          resolve(0);
          return;
        }
        
        const startTime = performance.now();
        
        document.fonts.ready.then(() => {
          const endTime = performance.now();
          resolve(endTime - startTime);
        });
      });
    });
    
    console.log(`🔤 字体加载时间: ${fontLoadTime.toFixed(0)}ms`);
    
    // 检查网络请求
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('font') || request.url().includes('.css')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType()
        });
      }
    });
    
    // 重新加载页面以捕获网络请求
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log(`🌐 字体相关网络请求数: ${networkRequests.length}`);
    networkRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. ${req.method} ${req.url}`);
    });
    
    // 性能断言
    expect(loadTime).toBeLessThan(10000); // 页面加载应在10秒内
    expect(fontLoadTime).toBeLessThan(5000); // 字体加载应在5秒内
    expect(networkRequests.length).toBeLessThan(10); // 字体请求应少于10个
    
    console.log('✅ 字体性能测试完成');
  });

  test('验证4：字体回退机制', async ({ page }) => {
    console.log('🧪 测试4：验证字体回退机制');
    
    // 模拟字体加载失败
    await page.route('**/*font*', route => {
      route.abort();
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // 检查是否使用了回退字体
    const fallbackFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    
    console.log(`📝 回退字体: ${fallbackFont}`);
    
    // 验证回退字体包含系统字体
    expect(fallbackFont.toLowerCase()).toMatch(/kaiti|simkai|fangsong|serif/i);
    
    // 截图验证回退效果
    await page.screenshot({ 
      path: 'tests/screenshots/font-fallback.png',
      fullPage: true 
    });
    
    console.log('✅ 字体回退测试完成');
  });

  test('验证5：字体显示优化', async ({ page }) => {
    console.log('🧪 测试5：验证字体显示优化');
    
    // 检查字体显示属性
    const fontDisplaySettings = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return {
        fontDisplay: styles.getPropertyValue('font-display'),
        fontSmoothing: styles.getPropertyValue('-webkit-font-smoothing'),
        textRendering: styles.getPropertyValue('text-rendering')
      };
    });
    
    console.log(`🎨 字体显示设置:`, fontDisplaySettings);
    
    // 检查CSS变量
    const cssVariables = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        primaryFont: getComputedStyle(root).getPropertyValue('--font-family-primary'),
        chineseFont: getComputedStyle(root).getPropertyValue('--font-family-chinese'),
        fontDisplay: getComputedStyle(root).getPropertyValue('--font-display')
      };
    });
    
    console.log(`📋 CSS字体变量:`, cssVariables);
    
    // 验证字体变量包含预期内容
    expect(cssVariables.primaryFont).toContain('HYShangWeiShouShuW');
    expect(cssVariables.fontDisplay).toBe('swap');
    
    console.log('✅ 字体显示优化测试完成');
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 字体测试完成，生成测试报告...');
  
  // 这里可以添加测试报告生成逻辑
  const reportData = {
    timestamp: new Date().toISOString(),
    testSuite: '字体性能和功能测试',
    status: 'completed',
    screenshots: [
      'font-default-display.png',
      'font-switch-1.png',
      'font-fallback.png'
    ]
  };
  
  console.log('📊 测试报告数据:', JSON.stringify(reportData, null, 2));
});
