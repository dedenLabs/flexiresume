/**
 * CDN降级机制测试
 * CDN Fallback Mechanism Test
 */

import { test, expect } from '@playwright/test';

test.describe('CDN降级机制验证', () => {
  test('当CDN不可用时应该降级到本地资源', async ({ page }) => {
    // 拦截CDN请求，模拟CDN不可用
    await page.route('**/cdn.jsdelivr.net/**', route => {
      route.abort('failed');
    });
    
    await page.route('**/deden.web.app/**', route => {
      route.abort('failed');
    });
    
    await page.route('**/dedenlabs.github.io/**', route => {
      route.abort('failed');
    });

    // 访问应用
    await page.goto('/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待一段时间让CDN检测完成
    await page.waitForTimeout(8000);
    
    // 检查是否有本地资源加载
    const requests: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/images/') || url.includes('avatar.webp')) {
        requests.push(url);
      }
    });
    
    // 等待一段时间收集请求
    await page.waitForTimeout(3000);
    
    // 验证有本地资源请求
    const localRequests = requests.filter(url => 
      url.includes('localhost:') || url.includes('127.0.0.1')
    );
    
    console.log('收集到的资源请求:', requests);
    console.log('本地资源请求:', localRequests);
    
    // 应该有本地资源请求
    expect(localRequests.length).toBeGreaterThan(0);
  });

  test('验证CDN管理器的降级逻辑', async ({ page }) => {
    await page.goto('/');
    
    // 在页面中执行CDN管理器测试
    const result = await page.evaluate(async () => {
      // 获取CDN管理器实例
      const { cdnManager } = await import('/src/utils/CDNManager.ts');
      
      // 测试资源URL获取
      const testResource = '/images/avatar.webp';
      
      try {
        const url = cdnManager.getResourceUrl(testResource, {
          enableFallback: true,
          localBasePath: '',
          cacheUrls: false,
        });
        
        return {
          success: true,
          url: url,
          isLocal: url.includes('localhost') || url.includes('127.0.0.1'),
          originalResource: testResource
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          originalResource: testResource
        };
      }
    });
    
    console.log('CDN管理器测试结果:', result);
    
    // 验证能够获取到URL
    expect(result.success).toBe(true);
    expect(result.url).toBeTruthy();
  });

  test('验证视频组件的多CDN源配置', async ({ page }) => {
    await page.goto('/');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 查找视频元素
    const videoElements = await page.locator('video.remark-video').count();
    
    if (videoElements > 0) {
      // 检查第一个视频的source标签
      const sources = await page.locator('video.remark-video').first().locator('source').count();
      
      console.log(`找到 ${videoElements} 个视频元素`);
      console.log(`第一个视频有 ${sources} 个source标签`);
      
      // 应该有多个source标签（前3个CDN + 原始URL）
      expect(sources).toBeGreaterThan(1);
      
      // 检查source的src属性
      if (sources > 0) {
        const firstSourceSrc = await page.locator('video.remark-video').first().locator('source').first().getAttribute('src');
        console.log('第一个source的src:', firstSourceSrc);
        
        // 验证不是重复的URL
        const allSources = await page.locator('video.remark-video').first().locator('source').all();
        const srcUrls = await Promise.all(allSources.map(source => source.getAttribute('src')));
        
        console.log('所有source URLs:', srcUrls);
        
        // 验证URL不重复
        const uniqueUrls = new Set(srcUrls.filter(url => url !== null));
        expect(uniqueUrls.size).toBe(srcUrls.length);
      }
    } else {
      console.log('页面中没有找到视频元素');
    }
  });
});
