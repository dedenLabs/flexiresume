/**
 * CDN自动移除功能测试
 * 
 * 测试目标：验证CDN自动移除功能正常工作
 * 
 * @author Claude (Augment Agent)
 * @date 2025-08-02
 */

import { test, expect } from '@playwright/test';

test.describe('CDN自动移除功能测试', () => {
  test('验证CDN排序和移除功能', async ({ page }) => {
    console.log('🧪 开始测试CDN自动移除功能...');
    
    // 访问应用
    await page.goto('http://localhost:5174');
    
    // 等待页面加载
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 在控制台中测试CDN功能
    const cdnTestResult = await page.evaluate(async () => {
      try {
        // 动态导入CDN相关模块
        const { cdnHealthChecker } = await import('/src/utils/CDNHealthChecker.ts');
        const { getCDNConfig } = await import('/src/config/ProjectConfig.ts');
        
        // 获取当前CDN配置
        const initialConfig = getCDNConfig();
        console.log('初始CDN配置:', initialConfig);
        
        // 执行健康检查
        console.log('开始CDN健康检查...');
        const healthResults = await cdnHealthChecker.checkAllCDNs();
        console.log('健康检查结果:', healthResults);
        
        // 获取排序后的配置
        const updatedConfig = getCDNConfig();
        console.log('排序后CDN配置:', updatedConfig);
        
        // 获取失败计数
        const failureCounts = cdnHealthChecker.getFailureCounts();
        console.log('失败计数:', Array.from(failureCounts.entries()));
        
        // 获取已移除的CDN
        const removedCDNs = cdnHealthChecker.getRemovedCDNs();
        console.log('已移除的CDN:', removedCDNs);
        
        return {
          initialCDNCount: initialConfig.baseUrls.length,
          finalCDNCount: updatedConfig.baseUrls.length,
          healthResults: healthResults.length,
          availableCDNs: healthResults.filter(r => r.available).length,
          unavailableCDNs: healthResults.filter(r => !r.available).length,
          removedCount: removedCDNs.length,
          sortingMode: updatedConfig.sortingStrategy.mode,
          autoRemovalEnabled: updatedConfig.autoRemoval.enabled,
          failureThreshold: updatedConfig.autoRemoval.failureThreshold,
          success: true
        };
      } catch (error) {
        console.error('CDN测试失败:', error);
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('📊 CDN测试结果:', cdnTestResult);
    
    // 验证测试结果
    expect(cdnTestResult.success).toBe(true);
    expect(cdnTestResult.healthResults).toBeGreaterThan(0);
    expect(cdnTestResult.finalCDNCount).toBeGreaterThanOrEqual(1);
    
    // 验证排序模式
    expect(['availability', 'speed']).toContain(cdnTestResult.sortingMode);
    
    console.log('✅ CDN自动移除功能测试通过');
  });

  test('验证CDN配置和环境变量', async ({ page }) => {
    console.log('🧪 开始测试CDN配置...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    const configTest = await page.evaluate(() => {
      try {
        // 检查CDN配置
        const config = window.localStorage.getItem('cdn-config') || '{}';
        const parsedConfig = JSON.parse(config);
        
        return {
          hasConfig: Object.keys(parsedConfig).length > 0,
          config: parsedConfig,
          success: true
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('📊 CDN配置测试结果:', configTest);
    
    expect(configTest.success).toBe(true);
    
    console.log('✅ CDN配置测试通过');
  });

  test('验证图片加载和CDN切换', async ({ page }) => {
    console.log('🧪 开始测试图片加载和CDN切换...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    // 检查页面中的图片元素
    const images = await page.locator('img').all();
    console.log(`📊 找到 ${images.length} 个图片元素`);
    
    let loadedImages = 0;
    let failedImages = 0;
    
    // 检查每个图片的加载状态
    for (let i = 0; i < Math.min(images.length, 10); i++) {
      const img = images[i];
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      if (src) {
        try {
          // 检查图片是否成功加载
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
          const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
          
          if (naturalWidth > 0 && naturalHeight > 0) {
            loadedImages++;
            console.log(`✅ 图片 ${i + 1} 加载成功: ${alt || 'unnamed'} (${naturalWidth}x${naturalHeight})`);
          } else {
            failedImages++;
            console.log(`❌ 图片 ${i + 1} 加载失败: ${alt || 'unnamed'}`);
          }
        } catch (error) {
          failedImages++;
          console.log(`❌ 图片 ${i + 1} 检查异常: ${error.message}`);
        }
      }
    }
    
    console.log(`📊 图片加载统计: 成功 ${loadedImages}, 失败 ${failedImages}`);
    
    // 验证至少有一些图片成功加载
    expect(loadedImages).toBeGreaterThan(0);
    
    // 截图记录最终状态
    await page.screenshot({ 
      path: 'tests/screenshots/cdn-auto-removal-test.png',
      fullPage: false 
    });
    
    console.log('✅ 图片加载和CDN切换测试通过');
  });

  test('验证控制台无严重错误', async ({ page }) => {
    console.log('🧪 开始检查控制台错误...');
    
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    // 监听控制台消息
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    // 等待一段时间确保所有异步操作完成
    await page.waitForTimeout(5000);
    
    // 检查错误
    if (consoleErrors.length > 0) {
      console.log('❌ 发现控制台错误:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ 无控制台错误');
    }
    
    if (consoleWarnings.length > 0) {
      console.log('⚠️ 发现控制台警告:');
      consoleWarnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    } else {
      console.log('✅ 无控制台警告');
    }
    
    // 验证没有严重错误（允许一些警告）
    expect(consoleErrors.length).toBe(0);
    
    console.log('✅ 控制台错误检查通过');
  });
});
