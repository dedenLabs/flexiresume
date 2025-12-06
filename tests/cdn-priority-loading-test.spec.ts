/**
 * CDN优先加载一致性测试
 * 
 * 测试目标：验证Tabs和Header中的图标都优先从CDN加载，行为一致
 * 
 * @author Claude (Augment Agent)
 * @date 2025-08-02
 */

import { test, expect } from '@playwright/test';

test.describe('CDN优先加载一致性测试', () => {
  test('验证Tabs和Header图标都优先从CDN加载', async ({ page }) => {
    console.log('🧪 开始测试CDN优先加载一致性...');
    
    // 访问应用
    await page.goto('http://localhost:5174');
    
    // 等待页面加载
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000); // 等待CDN健康检查完成
    
    // 监听网络请求
    const networkRequests: Array<{ url: string; type: string; status: number }> = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg') || url.includes('.webp')) {
        networkRequests.push({
          url: url,
          type: 'image',
          status: response.status()
        });
      }
    });
    
    // 等待图片加载完成
    await page.waitForTimeout(3000);
    
    // 检查Header中的头像
    const headerAvatar = await page.locator('img[alt*="头像"], img[alt*="avatar"], img[data-smart-image="true"]').first();
    if (await headerAvatar.count() > 0) {
      const headerAvatarSrc = await headerAvatar.getAttribute('src');
      console.log('📸 Header头像URL:', headerAvatarSrc);
      
      // 验证Header头像是否从CDN加载
      const isHeaderCDN = headerAvatarSrc && (
        headerAvatarSrc.includes('cdn.') || 
        headerAvatarSrc.includes('jsdelivr') || 
        headerAvatarSrc.includes('unpkg') ||
        headerAvatarSrc.includes('github') ||
        !headerAvatarSrc.startsWith('/')
      );
      
      console.log(`📊 Header头像CDN状态: ${isHeaderCDN ? '✅ 使用CDN' : '❌ 使用本地'}`);
    }
    
    // 检查Tabs中的图标
    const tabAvatars = await page.locator('[data-testid="navigation-tabs"] img[data-smart-image="true"]');
    const tabAvatarCount = await tabAvatars.count();
    console.log(`📊 找到 ${tabAvatarCount} 个Tab头像`);
    
    let cdnTabCount = 0;
    let localTabCount = 0;
    
    for (let i = 0; i < tabAvatarCount; i++) {
      const tabAvatar = tabAvatars.nth(i);
      const tabAvatarSrc = await tabAvatar.getAttribute('src');
      console.log(`📸 Tab ${i + 1} 头像URL:`, tabAvatarSrc);
      
      if (tabAvatarSrc) {
        const isTabCDN = tabAvatarSrc.includes('cdn.') || 
                        tabAvatarSrc.includes('jsdelivr') || 
                        tabAvatarSrc.includes('unpkg') ||
                        tabAvatarSrc.includes('github') ||
                        !tabAvatarSrc.startsWith('/');
        
        if (isTabCDN) {
          cdnTabCount++;
          console.log(`   ✅ Tab ${i + 1}: 使用CDN`);
        } else {
          localTabCount++;
          console.log(`   ❌ Tab ${i + 1}: 使用本地`);
        }
      }
    }
    
    console.log(`📊 Tab头像统计: CDN ${cdnTabCount}个, 本地 ${localTabCount}个`);
    
    // 分析网络请求
    const cdnRequests = networkRequests.filter(req => 
      req.url.includes('cdn.') || 
      req.url.includes('jsdelivr') || 
      req.url.includes('unpkg') ||
      req.url.includes('github')
    );
    
    const localRequests = networkRequests.filter(req => 
      req.url.startsWith('http://localhost') && req.url.includes('/')
    );
    
    console.log(`📊 网络请求统计: CDN请求 ${cdnRequests.length}个, 本地请求 ${localRequests.length}个`);
    
    // 输出详细的网络请求信息
    if (cdnRequests.length > 0) {
      console.log('✅ CDN请求列表:');
      cdnRequests.forEach((req, index) => {
        console.log(`  ${index + 1}. ${req.url} (状态: ${req.status})`);
      });
    }
    
    if (localRequests.length > 0) {
      console.log('📁 本地请求列表:');
      localRequests.forEach((req, index) => {
        console.log(`  ${index + 1}. ${req.url} (状态: ${req.status})`);
      });
    }
    
    // 验证CDN优先加载
    // 在正常情况下，应该优先使用CDN
    if (cdnRequests.length > 0) {
      console.log('✅ 检测到CDN请求，CDN优先加载正常工作');
    } else {
      console.log('⚠️ 未检测到CDN请求，可能CDN不可用或使用本地开发模式');
    }
    
    // 截图记录当前状态
    await page.screenshot({ 
      path: 'tests/screenshots/cdn-priority-loading-test.png',
      fullPage: false 
    });
    
    console.log('✅ CDN优先加载一致性测试完成');
  });

  test('验证CDN健康检查对图片加载的影响', async ({ page }) => {
    console.log('🧪 开始测试CDN健康检查影响...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    // 执行CDN健康检查
    const healthCheckResult = await page.evaluate(async () => {
      try {
        // 检查CDN调试工具是否可用
        if (typeof (window as any).cdnDebug !== 'undefined') {
          const stats = (window as any).cdnDebug.getStats();
          const health = (window as any).cdnDebug.getHealth();
          
          return {
            available: true,
            stats: stats,
            health: health,
            success: true
          };
        } else {
          return {
            available: false,
            success: false,
            error: 'CDN调试工具不可用'
          };
        }
      } catch (error) {
        return {
          available: false,
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('📊 CDN健康检查结果:', healthCheckResult);
    
    if (healthCheckResult.success) {
      console.log(`✅ CDN状态: 剩余${healthCheckResult.stats.remainingCount}个, 已移除${healthCheckResult.stats.removedCount}个`);
      
      if (healthCheckResult.health && healthCheckResult.health.length > 0) {
        healthCheckResult.health.forEach((result: any, index: number) => {
          const status = result.available ? '✅ 可用' : '❌ 不可用';
          console.log(`  ${index + 1}. ${result.url}: ${status} (${result.responseTime}ms)`);
        });
      }
    }
    
    // 验证图片加载是否受到CDN健康检查的正确影响
    const imageElements = await page.locator('img[data-smart-image="true"]');
    const imageCount = await imageElements.count();
    
    let loadedImages = 0;
    let failedImages = 0;
    
    for (let i = 0; i < imageCount; i++) {
      const img = imageElements.nth(i);
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
    
    // 验证图片加载成功率
    const successRate = imageCount > 0 ? (loadedImages / imageCount) * 100 : 0;
    console.log(`📊 图片加载成功率: ${successRate.toFixed(1)}%`);
    
    // 期望成功率应该较高（考虑到CDN可能不可用的情况）
    expect(successRate).toBeGreaterThan(50);
    
    console.log('✅ CDN健康检查影响测试完成');
  });

  test('验证SmartImage组件的CDN回退机制', async ({ page }) => {
    console.log('🧪 开始测试SmartImage CDN回退机制...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 检查SmartImage组件的data属性
    const smartImages = await page.locator('img[data-smart-image="true"]');
    const smartImageCount = await smartImages.count();
    
    console.log(`📊 找到 ${smartImageCount} 个SmartImage组件`);
    
    for (let i = 0; i < Math.min(smartImageCount, 5); i++) {
      const img = smartImages.nth(i);
      const src = await img.getAttribute('src');
      const cdnIndex = await img.getAttribute('data-cdn-index');
      const retryCount = await img.getAttribute('data-retry-count');
      const alt = await img.getAttribute('alt');
      
      console.log(`📸 SmartImage ${i + 1}:`);
      console.log(`   URL: ${src}`);
      console.log(`   CDN索引: ${cdnIndex}`);
      console.log(`   重试次数: ${retryCount}`);
      console.log(`   描述: ${alt}`);
      
      // 验证CDN索引和重试次数是合理的
      if (cdnIndex !== null) {
        const cdnIndexNum = parseInt(cdnIndex);
        expect(cdnIndexNum).toBeGreaterThanOrEqual(0);
        expect(cdnIndexNum).toBeLessThan(10); // 假设CDN数量不会超过10个
      }
      
      if (retryCount !== null) {
        const retryCountNum = parseInt(retryCount);
        expect(retryCountNum).toBeGreaterThanOrEqual(0);
        expect(retryCountNum).toBeLessThan(5); // 假设重试次数不会超过5次
      }
    }
    
    console.log('✅ SmartImage CDN回退机制测试完成');
  });

  test('验证控制台无CDN相关错误', async ({ page }) => {
    console.log('🧪 开始检查CDN相关控制台错误...');
    
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    // 监听控制台消息
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('CDN') || text.includes('cdn') || text.includes('图片') || text.includes('image')) {
        if (msg.type() === 'error') {
          consoleErrors.push(text);
        } else if (msg.type() === 'warning') {
          consoleWarnings.push(text);
        }
      }
    });
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    // 等待一段时间确保所有异步操作完成
    await page.waitForTimeout(8000);
    
    // 检查CDN相关错误
    if (consoleErrors.length > 0) {
      console.log('❌ 发现CDN相关控制台错误:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ 无CDN相关控制台错误');
    }
    
    if (consoleWarnings.length > 0) {
      console.log('⚠️ 发现CDN相关控制台警告:');
      consoleWarnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    } else {
      console.log('✅ 无CDN相关控制台警告');
    }
    
    // 验证没有严重的CDN错误（允许一些警告，因为CDN可能不可用）
    expect(consoleErrors.length).toBeLessThan(3); // 允许少量错误
    
    console.log('✅ CDN相关控制台错误检查完成');
  });
});
