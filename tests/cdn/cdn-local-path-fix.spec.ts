import { test, expect } from '@playwright/test';

/**
 * CDN本地路径修复测试
 * 验证修复后的CDN管理器能正确处理本地资源路径
 */

test.describe('CDN本地路径修复验证', () => {
  test('验证本地环境资源路径正确性', async ({ page }) => {
    // 访问首页
    await page.goto('/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 在页面中测试CDN管理器的路径处理
    const result = await page.evaluate(async () => {
      try {
        // 动态导入CDN管理器
        const { cdnManager } = await import('/src/utils/CDNManager.ts');
        
        // 等待CDN管理器初始化
        await cdnManager.initialize();
        
        // 测试多个资源路径
        const testResources = [
          'images/avatar.webp',
          '/images/avatar.webp',
          'assets/background.jpg',
          '/assets/background.jpg',
          'favicon.ico',
          '/favicon.ico'
        ];
        
        const results = [];
        
        for (const resource of testResources) {
          const url = cdnManager.getResourceUrl(resource, {
            enableFallback: true,
            localBasePath: '',
            cacheUrls: false
          });
          
          // 检查URL格式是否正确
          const isValidUrl = url.includes('://') && !url.includes('://localhost:5173images');
          const hasCorrectSeparator = !url.match(/localhost:\d+[^\/:]/);
          
          results.push({
            resource,
            url,
            isValidUrl,
            hasCorrectSeparator,
            isLocal: url.includes('localhost') || url.includes('127.0.0.1')
          });
        }
        
        return {
          success: true,
          results,
          currentLocation: {
            hostname: window.location.hostname,
            port: window.location.port,
            pathname: window.location.pathname,
            protocol: window.location.protocol
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    });
    
    console.log('CDN路径修复测试结果:', JSON.stringify(result, null, 2));
    
    // 验证测试成功
    expect(result.success).toBe(true);
    
    // 验证所有资源URL都是有效的
    for (const resourceResult of result.results) {
      expect(resourceResult.isValidUrl).toBe(true);
      expect(resourceResult.hasCorrectSeparator).toBe(true);
      expect(resourceResult.url).not.toContain('localhost:5173images');
      expect(resourceResult.url).not.toContain('localhost:5173assets');
      expect(resourceResult.url).not.toContain('localhost:5173favicon');
      
      // 验证URL格式正确
      if (resourceResult.isLocal) {
        expect(resourceResult.url).toMatch(/^https?:\/\/localhost:\d+\/.+/);
      }
    }
  });

  test('验证不同部署场景的路径处理', async ({ page }) => {
    // 测试不同的URL场景
    const scenarios = [
      {
        name: '根目录部署 - 直接访问',
        url: '/',
        expectedBasePath: ''
      },
      {
        name: '根目录部署 - 路由访问',
        url: '/fullstack',
        expectedBasePath: ''
      },
      {
        name: '子目录部署模拟',
        url: '/my-resume/docs/',
        expectedBasePath: '/my-resume/docs'
      }
    ];

    for (const scenario of scenarios) {
      await test.step(`测试场景: ${scenario.name}`, async () => {
        // 模拟不同的URL场景
        const result = await page.evaluate(async (testScenario) => {
          try {
            // 模拟不同的location对象
            const originalLocation = window.location;
            const mockLocation = {
              ...originalLocation,
              pathname: testScenario.url,
              hostname: 'example.com', // 模拟生产环境
              port: '443',
              protocol: 'https:'
            };

            // 临时替换location对象进行测试
            Object.defineProperty(window, 'location', {
              value: mockLocation,
              writable: true
            });

            // 动态导入CDN管理器
            const { cdnManager } = await import('/src/utils/CDNManager.ts');
            
            // 重置缓存以确保使用新的location
            cdnManager.resetPathCache();
            
            // 测试资源URL获取
            const testResource = 'images/avatar.webp';
            const url = cdnManager.getResourceUrl(testResource, {
              enableFallback: true,
              localBasePath: '',
              cacheUrls: false
            });

            // 恢复原始location
            Object.defineProperty(window, 'location', {
              value: originalLocation,
              writable: true
            });

            return {
              success: true,
              url,
              scenario: testScenario.name,
              mockPathname: testScenario.url,
              expectedBasePath: testScenario.expectedBasePath
            };
          } catch (error) {
            return {
              success: false,
              error: error.message,
              scenario: testScenario.name
            };
          }
        }, scenario);

        console.log(`场景 "${scenario.name}" 测试结果:`, result);
        
        expect(result.success).toBe(true);
        expect(result.url).toBeTruthy();
      });
    }
  });

  test('验证资源加载实际可用性', async ({ page }) => {
    await page.goto('/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 检查页面中的图片资源是否正确加载
    const imageElements = await page.locator('img').all();
    
    for (const img of imageElements) {
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        // 验证图片URL格式正确
        expect(src).not.toContain('localhost:5173images');
        expect(src).not.toContain('localhost:5173assets');
        
        // 验证图片能够加载
        const response = await page.request.get(src);
        expect(response.status()).toBeLessThan(400);
      }
    }
  });
});
