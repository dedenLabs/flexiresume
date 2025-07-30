/**
 * 字体优化功能测试
 * 
 * 测试字体缓存、性能监控和优化功能
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5175';
const TIMEOUT = 30000;

test.describe('字体优化功能测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：字体缓存功能', async ({ page }) => {
    console.log('🧪 测试1：验证字体缓存功能');
    
    // 检查字体加载器是否可用
    const fontLoaderAvailable = await page.evaluate(() => {
      return typeof window.fontLoader !== 'undefined';
    });
    
    if (fontLoaderAvailable) {
      console.log('✅ FontLoader可用');
      
      // 测试缓存统计
      const cacheStats = await page.evaluate(() => {
        return window.fontLoader.getCacheStats();
      });
      
      console.log(`📊 缓存统计:`, cacheStats);
      
      // 验证缓存统计结构
      expect(cacheStats).toHaveProperty('size');
      expect(cacheStats).toHaveProperty('memoryUsage');
      expect(cacheStats).toHaveProperty('memoryUsageMB');
      
    } else {
      console.log('ℹ️ FontLoader不可用，跳过缓存测试');
    }
    
    console.log('✅ 字体缓存测试完成');
  });

  test('验证2：字体加载性能', async ({ page }) => {
    console.log('🧪 测试2：验证字体加载性能');
    
    // 测量字体加载时间
    const fontLoadTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            const endTime = performance.now();
            resolve(endTime - startTime);
          });
        } else {
          resolve(0);
        }
      });
    });
    
    console.log(`⏱️ 字体加载时间: ${fontLoadTime.toFixed(0)}ms`);
    
    // 检查字体加载状态
    const fontStatus = await page.evaluate(() => {
      if (!document.fonts) return { supported: false };
      
      const fonts = Array.from(document.fonts);
      const loadedFonts = fonts.filter(font => font.status === 'loaded');
      
      return {
        supported: true,
        totalFonts: fonts.length,
        loadedFonts: loadedFonts.length,
        loadedFontNames: loadedFonts.map(f => f.family).slice(0, 5) // 只显示前5个
      };
    });
    
    console.log(`📊 字体状态:`, fontStatus);
    
    if (fontStatus.supported) {
      expect(fontLoadTime).toBeLessThan(10000); // 字体加载应在10秒内
      expect(fontStatus.loadedFonts).toBeGreaterThan(0); // 应该有已加载的字体
    }
    
    console.log('✅ 字体性能测试完成');
  });

  test('验证3：内存管理功能', async ({ page }) => {
    console.log('🧪 测试3：验证内存管理功能');
    
    // 检查内存监控器是否可用
    const memoryMonitorAvailable = await page.evaluate(() => {
      return typeof window.memoryMonitor !== 'undefined';
    });
    
    if (memoryMonitorAvailable) {
      console.log('✅ MemoryMonitor可用');
      
      // 触发内存监控
      await page.evaluate(() => {
        window.memoryMonitor.logMemoryUsage();
      });
      
      console.log('📊 内存监控已触发');
      
    } else {
      console.log('ℹ️ MemoryMonitor不可用，跳过内存测试');
    }
    
    // 检查浏览器内存使用情况
    const memoryInfo = await page.evaluate(() => {
      const memory = performance.memory;
      if (memory) {
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          usedMB: memory.usedJSHeapSize / 1024 / 1024,
          totalMB: memory.totalJSHeapSize / 1024 / 1024
        };
      }
      return null;
    });
    
    if (memoryInfo) {
      console.log(`🧠 内存使用: ${memoryInfo.usedMB.toFixed(2)}MB / ${memoryInfo.totalMB.toFixed(2)}MB`);
      
      // 验证内存使用合理
      expect(memoryInfo.usedMB).toBeLessThan(500); // 使用内存应少于500MB
    }
    
    console.log('✅ 内存管理测试完成');
  });

  test('验证4：字体切换优化', async ({ page }) => {
    console.log('🧪 测试4：验证字体切换优化');
    
    // 查找字体切换器
    const fontSwitcher = page.locator('[data-testid="font-switcher"], .font-switcher, button').filter({ hasText: /字体|font/i }).first();
    
    if (await fontSwitcher.isVisible()) {
      console.log('✅ 字体切换器可见');
      
      // 记录切换前的性能
      const beforeSwitch = await page.evaluate(() => {
        return {
          timestamp: performance.now(),
          fontCount: document.fonts ? document.fonts.size : 0
        };
      });
      
      // 点击字体切换器
      await fontSwitcher.click();
      await page.waitForTimeout(1000);
      
      // 查找字体选项并切换
      const fontOptions = page.locator('button, a, div').filter({ hasText: /汉仪|楷体|宋体/i });
      const optionCount = await fontOptions.count();
      
      if (optionCount > 0) {
        console.log(`📋 找到 ${optionCount} 个字体选项`);
        
        // 切换到第一个选项
        await fontOptions.first().click();
        await page.waitForTimeout(2000);
        
        // 记录切换后的性能
        const afterSwitch = await page.evaluate(() => {
          return {
            timestamp: performance.now(),
            fontCount: document.fonts ? document.fonts.size : 0
          };
        });
        
        const switchTime = afterSwitch.timestamp - beforeSwitch.timestamp;
        console.log(`⏱️ 字体切换时间: ${switchTime.toFixed(0)}ms`);
        
        // 验证切换性能
        expect(switchTime).toBeLessThan(5000); // 切换应在5秒内完成
        
        // 截图记录
        await page.screenshot({ 
          path: 'tests/screenshots/font-optimization-switch.png',
          fullPage: true 
        });
        
      } else {
        console.log('ℹ️ 未找到字体选项');
      }
    } else {
      console.log('ℹ️ 字体切换器不可见');
    }
    
    console.log('✅ 字体切换优化测试完成');
  });

  test('验证5：CDN回退机制', async ({ page }) => {
    console.log('🧪 测试5：验证CDN回退机制');
    
    // 模拟CDN失败
    await page.route('**/fonts.loli.net/**', route => {
      route.abort();
    });
    
    await page.route('**/cdn.jsdelivr.net/**', route => {
      route.abort();
    });
    
    // 重新加载页面测试回退
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 检查字体是否仍然可用（使用回退字体）
    const fallbackFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    
    console.log(`📝 回退字体: ${fallbackFont}`);
    
    // 验证回退字体包含系统字体
    expect(fallbackFont.toLowerCase()).toMatch(/serif|sans-serif|kaiti|simkai|fangsong/i);
    
    // 截图验证回退效果
    await page.screenshot({ 
      path: 'tests/screenshots/font-optimization-fallback.png',
      fullPage: true 
    });
    
    console.log('✅ CDN回退机制测试完成');
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 字体优化测试完成，生成测试报告...');
  
  const reportData = {
    timestamp: new Date().toISOString(),
    testSuite: '字体优化功能测试',
    status: 'completed',
    features: [
      '字体缓存功能',
      '字体加载性能',
      '内存管理功能',
      '字体切换优化',
      'CDN回退机制'
    ],
    screenshots: [
      'font-optimization-switch.png',
      'font-optimization-fallback.png'
    ]
  };
  
  console.log('📊 测试报告数据:', JSON.stringify(reportData, null, 2));
});
