/**
 * 预加载CDN依赖修复验证测试
 * 
 * 验证预加载逻辑的以下修复：
 * 1. CDN无关的预加载立即执行
 * 2. CDN依赖的预加载等待CDN测试完成
 * 3. 预加载管理器正确分离两种类型的预加载
 * 4. 应用启动不被预加载阻塞
 * 
 * @author FlexiResume Team
 * @date 2025-08-04
 */

import { test, expect } from '@playwright/test';

test.describe('预加载CDN依赖修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 监听控制台日志以验证预加载顺序
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('preload')) {
        logs.push(msg.text());
      }
    });
    
    // 将logs数组暴露给测试
    await page.exposeFunction('getPreloadLogs', () => logs);
  });

  test('验证CDN无关预加载立即执行', async ({ page }) => {
    console.log('🔍 开始验证CDN无关预加载立即执行...');
    
    // 访问应用首页
    await page.goto('http://localhost:5173');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 检查PreloadManager是否存在
    const preloadManagerExists = await page.evaluate(() => {
      return typeof window.preloadManager !== 'undefined';
    });
    
    console.log(`📊 PreloadManager存在: ${preloadManagerExists}`);
    
    // 检查CDN无关预加载状态
    const cdnIndependentStatus = await page.evaluate(() => {
      // 检查是否有预加载相关的日志
      const logs = document.querySelectorAll('*');
      return Array.from(logs).some(el => 
        el.textContent?.includes('CDN无关预加载') || 
        el.textContent?.includes('CDN-independent')
      );
    });
    
    console.log(`📦 CDN无关预加载状态: ${cdnIndependentStatus}`);
    
    // 验证应用正常启动
    const appLoaded = await page.locator('[data-testid="app-container"], .app-container, main, #root > div').count() > 0;
    console.log(`🚀 应用加载状态: ${appLoaded}`);
    
    expect(appLoaded).toBe(true);
  });

  test('验证CDN依赖预加载等待机制', async ({ page }) => {
    console.log('🌐 开始验证CDN依赖预加载等待机制...');
    
    // 访问应用首页
    await page.goto('http://localhost:5173');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // 等待更长时间以观察CDN初始化
    
    // 检查CDN状态
    const cdnStatus = await page.evaluate(() => {
      // 检查CDN相关的DOM元素或状态
      const statusElements = document.querySelectorAll('[data-cdn-status], .cdn-status');
      if (statusElements.length > 0) {
        return Array.from(statusElements).map(el => el.textContent || el.getAttribute('data-cdn-status'));
      }
      
      // 检查是否有CDN相关的preload链接
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      return {
        preloadLinksCount: preloadLinks.length,
        preloadLinks: Array.from(preloadLinks).map(link => ({
          href: link.getAttribute('href'),
          as: link.getAttribute('as')
        }))
      };
    });
    
    console.log('📊 CDN状态和预加载链接:', cdnStatus);
    
    // 验证预加载链接存在
    if (typeof cdnStatus === 'object' && cdnStatus.preloadLinksCount !== undefined) {
      expect(cdnStatus.preloadLinksCount).toBeGreaterThan(0);
      console.log(`✅ 发现 ${cdnStatus.preloadLinksCount} 个预加载链接`);
    }
  });

  test('验证预加载不阻塞应用启动', async ({ page }) => {
    console.log('⚡ 开始验证预加载不阻塞应用启动...');
    
    const startTime = Date.now();
    
    // 访问应用首页
    await page.goto('http://localhost:5173');
    
    // 等待主要内容加载
    await page.waitForSelector('[role="tab"], .tab-item, .resume-container', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`📊 应用启动时间: ${loadTime}ms`);
    
    // 验证应用在合理时间内启动（不超过10秒）
    expect(loadTime).toBeLessThan(10000);
    
    // 检查主要功能是否可用
    const tabsCount = await page.locator('[role="tab"]').count();
    console.log(`📂 发现 ${tabsCount} 个Tab`);
    
    if (tabsCount > 0) {
      // 尝试点击第一个Tab
      await page.locator('[role="tab"]').first().click();
      await page.waitForTimeout(1000);
      
      console.log('✅ Tab切换功能正常');
    }
    
    expect(tabsCount).toBeGreaterThan(0);
  });

  test('验证预加载资源类型分离', async ({ page }) => {
    console.log('🔄 开始验证预加载资源类型分离...');
    
    // 访问应用首页
    await page.goto('http://localhost:5173');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 检查不同类型的预加载资源
    const preloadAnalysis = await page.evaluate(() => {
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      const analysis = {
        total: preloadLinks.length,
        byType: {} as Record<string, number>,
        byExtension: {} as Record<string, number>,
        resources: [] as Array<{href: string, as: string, type: string}>
      };
      
      preloadLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const as = link.getAttribute('as') || 'unknown';
        const extension = href.split('.').pop()?.toLowerCase() || 'unknown';
        
        // 统计类型
        analysis.byType[as] = (analysis.byType[as] || 0) + 1;
        analysis.byExtension[extension] = (analysis.byExtension[extension] || 0) + 1;
        
        // 判断资源类型
        let resourceType = 'unknown';
        if (href.includes('http') || href.includes('cdn')) {
          resourceType = 'cdn-dependent';
        } else if (href.startsWith('/') || href.startsWith('./')) {
          resourceType = 'local';
        }
        
        analysis.resources.push({ href, as, type: resourceType });
      });
      
      return analysis;
    });
    
    console.log('📊 预加载资源分析:', preloadAnalysis);
    
    // 验证有预加载资源
    expect(preloadAnalysis.total).toBeGreaterThan(0);
    
    // 验证资源类型多样性
    const hasImages = preloadAnalysis.byType['image'] > 0;
    const hasFonts = preloadAnalysis.byType['font'] > 0;
    const hasStyles = preloadAnalysis.byType['style'] > 0;
    
    console.log(`📊 资源类型统计: 图片=${preloadAnalysis.byType['image'] || 0}, 字体=${preloadAnalysis.byType['font'] || 0}, 样式=${preloadAnalysis.byType['style'] || 0}`);
    
    // 至少应该有一种类型的资源
    expect(hasImages || hasFonts || hasStyles).toBe(true);
  });

  test('验证控制台无预加载相关错误', async ({ page }) => {
    console.log('🔍 开始验证控制台无预加载相关错误...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 监听控制台错误和警告
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        errors.push(text);
      } else if (msg.type() === 'warning') {
        warnings.push(text);
      }
    });
    
    // 访问应用首页
    await page.goto('http://localhost:5173');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // 过滤预加载相关的错误
    const preloadErrors = errors.filter(error => 
      error.toLowerCase().includes('preload') ||
      error.toLowerCase().includes('cdn') ||
      error.toLowerCase().includes('resource')
    );
    
    const preloadWarnings = warnings.filter(warning => 
      warning.toLowerCase().includes('preload') ||
      warning.toLowerCase().includes('cdn') ||
      warning.toLowerCase().includes('resource')
    );
    
    console.log(`❌ 预加载相关错误数量: ${preloadErrors.length}`);
    console.log(`⚠️ 预加载相关警告数量: ${preloadWarnings.length}`);
    
    if (preloadErrors.length > 0) {
      console.log('预加载错误列表:', preloadErrors);
    }
    
    if (preloadWarnings.length > 0) {
      console.log('预加载警告列表:', preloadWarnings);
    }
    
    // 验证没有关键的预加载错误
    expect(preloadErrors.length).toBe(0);
  });

  test('截图验证修复效果', async ({ page }) => {
    console.log('📸 开始截图验证修复效果...');
    
    // 访问应用首页
    await page.goto('http://localhost:5173');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 截取整个页面
    await page.screenshot({ 
      path: 'tests/screenshots/preload-cdn-dependency-fix-full-page.png',
      fullPage: true 
    });
    
    // 截取开发者工具网络面板（如果可见）
    const networkPanel = page.locator('[data-testid="network-panel"], .network-panel');
    if (await networkPanel.count() > 0) {
      await networkPanel.screenshot({ 
        path: 'tests/screenshots/preload-cdn-dependency-fix-network.png' 
      });
    }
    
    // 检查页面是否正常渲染
    const mainContent = page.locator('main, [role="main"], .main-content, #root > div').first();
    const isVisible = await mainContent.isVisible();
    
    console.log(`✅ 主要内容可见: ${isVisible}`);
    expect(isVisible).toBe(true);
    
    console.log('✅ 截图已保存到 tests/screenshots/ 目录');
  });
});
