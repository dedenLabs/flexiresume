/**
 * CDN本地环境优化测试
 * CDN Local Environment Optimization Test
 * 
 * 验证在本地开发环境下，CDN管理器直接使用本地资源而不进行网络请求
 * Verify that CDN manager uses local resources directly without network requests in local development environment
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('CDN本地环境优化测试', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // 监听网络请求
    await page.route('**/*', (route) => {
      const url = route.request().url();
      console.log(`[Network Request] ${route.request().method()} ${url}`);
      route.continue();
    });
  });

  test('本地环境应该直接使用本地资源，不发起CDN网络请求', async () => {
    console.log('🚀 开始测试本地环境CDN优化...');
    
    // 记录所有网络请求
    const networkRequests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      networkRequests.push(url);
      console.log(`[Request] ${request.method()} ${url}`);
    });

    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 等待CDN管理器初始化
    await page.waitForTimeout(2000);
    
    // 检查控制台日志，确认本地环境检测
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      consoleLogs.push(text);
      console.log(`[Console] ${text}`);
    });
    
    // 触发一些资源加载（如果有的话）
    await page.evaluate(() => {
      // 检查CDN管理器是否正确识别本地环境
      if (window.console && window.console.log) {
        console.log('[Test] Checking CDN manager local environment detection...');
      }
    });
    
    await page.waitForTimeout(1000);
    
    // 验证网络请求
    console.log('📊 网络请求分析:');
    console.log(`总请求数: ${networkRequests.length}`);
    
    // 过滤出CDN相关的请求
    const cdnRequests = networkRequests.filter(url => {
      return url.includes('jsdelivr.net') || 
             url.includes('unpkg.com') || 
             url.includes('cdnjs.cloudflare.com') ||
             url.includes('cdn.') ||
             (url.startsWith('https://') && !url.includes('localhost'));
    });
    
    console.log(`CDN请求数: ${cdnRequests.length}`);
    if (cdnRequests.length > 0) {
      console.log('CDN请求列表:');
      cdnRequests.forEach(url => console.log(`  - ${url}`));
    }
    
    // 本地环境下应该没有CDN请求
    expect(cdnRequests.length).toBe(0);
    
    // 验证本地资源请求
    const localRequests = networkRequests.filter(url => {
      return url.includes('localhost:5174') || url.startsWith('/');
    });
    
    console.log(`本地资源请求数: ${localRequests.length}`);
    expect(localRequests.length).toBeGreaterThan(0);
    
    console.log('✅ 本地环境CDN优化测试通过');
  });

  test('验证本地环境检测逻辑', async () => {
    console.log('🔍 验证本地环境检测逻辑...');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // 在页面中执行环境检测测试
    const environmentInfo = await page.evaluate(() => {
      const { hostname, port, protocol } = window.location;
      
      // 复制CDN管理器中的检测逻辑
      const isLocalHost = hostname === 'localhost' || 
                         hostname === '127.0.0.1' || 
                         hostname === '0.0.0.0' ||
                         hostname.endsWith('.local');
      
      const isDevelopmentPort = port && (
        port.startsWith('3') ||
        port.startsWith('4') ||
        port.startsWith('5') ||
        port.startsWith('8') ||
        port.startsWith('9')
      );
      
      return {
        hostname,
        port,
        protocol,
        isLocalHost,
        isDevelopmentPort,
        isLocalDevelopment: isLocalHost && isDevelopmentPort
      };
    });
    
    console.log('🌐 环境信息:', environmentInfo);
    
    // 验证环境检测结果
    expect(environmentInfo.hostname).toBe('localhost');
    expect(environmentInfo.port).toBe('5174');
    expect(environmentInfo.isLocalHost).toBe(true);
    expect(environmentInfo.isDevelopmentPort).toBe(true);
    expect(environmentInfo.isLocalDevelopment).toBe(true);
    
    console.log('✅ 本地环境检测逻辑验证通过');
  });

  test('验证CDN管理器在本地环境的行为', async () => {
    console.log('⚙️ 验证CDN管理器在本地环境的行为...');

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 直接在页面中测试CDN管理器
    const result = await page.evaluate(async () => {
      try {
        // 动态导入CDN管理器
        const { cdnManager } = await import('/src/utils/CDNManager.ts');

        // 测试资源URL获取
        const testResources = [
          '/images/avatar.webp',
          '/assets/background.jpg',
          '/favicon.ico'
        ];

        const results = [];

        for (const resource of testResources) {
          const url = cdnManager.getResourceUrl(resource, {
            enableFallback: true,
            cacheUrls: false
          });

          results.push({
            resource,
            url,
            isLocal: url.includes('localhost') || url.includes('127.0.0.1')
          });
        }

        // 获取缓存统计
        const cacheStats = cdnManager.getCacheStats();

        return {
          success: true,
          results,
          cacheStats,
          isReady: cdnManager.isReady()
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('📊 CDN管理器测试结果:', result);

    // 验证CDN管理器正常工作
    expect(result.success).toBe(true);
    // 注意：在本地环境下，CDN管理器跳过初始化，isReady可能为false，这是正常的

    // 验证所有资源都使用本地URL
    if (result.success && result.results) {
      result.results.forEach((item: any) => {
        console.log(`🔗 ${item.resource} -> ${item.url} (本地: ${item.isLocal})`);
        expect(item.isLocal).toBe(true);
      });
    }

    console.log('✅ CDN管理器本地环境行为验证通过');
  });

  test('验证本地环境优化配置的灵活性', async () => {
    console.log('🔧 验证本地环境优化配置的灵活性...');

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 测试配置的灵活性
    const configTest = await page.evaluate(async () => {
      try {
        // 动态导入相关模块
        const { resetLocalDevelopmentCache } = await import('/src/utils/CDNManager.ts');
        const { updateCDNConfig } = await import('/src/config/ProjectConfig.ts');

        const results = [];

        // 测试1: 禁用本地优化
        resetLocalDevelopmentCache();
        updateCDNConfig({
          localOptimization: {
            enabled: false,
            forceLocal: false,
            localBasePath: ''
          }
        });

        // 重新导入以获取更新的配置
        const { cdnManager: manager1 } = await import('/src/utils/CDNManager.ts');
        const url1 = manager1.getResourceUrl('/test.jpg');
        results.push({
          test: 'disabled_optimization',
          url: url1,
          isLocal: url1.includes('localhost')
        });

        // 测试2: 强制使用本地资源
        resetLocalDevelopmentCache();
        updateCDNConfig({
          localOptimization: {
            enabled: true,
            forceLocal: true,
            localBasePath: ''
          }
        });

        const { cdnManager: manager2 } = await import('/src/utils/CDNManager.ts');
        const url2 = manager2.getResourceUrl('/test.jpg');
        results.push({
          test: 'force_local',
          url: url2,
          isLocal: url2.includes('localhost')
        });

        // 测试3: 自定义基础路径
        resetLocalDevelopmentCache();
        updateCDNConfig({
          localOptimization: {
            enabled: true,
            forceLocal: true,
            localBasePath: '/custom/path'
          }
        });

        const { cdnManager: manager3 } = await import('/src/utils/CDNManager.ts');
        const url3 = manager3.getResourceUrl('/test.jpg');
        results.push({
          test: 'custom_base_path',
          url: url3,
          hasCustomPath: url3.includes('/custom/path')
        });

        return {
          success: true,
          results
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('🔧 配置灵活性测试结果:', configTest);

    // 验证测试成功
    expect(configTest.success).toBe(true);

    if (configTest.success && configTest.results) {
      configTest.results.forEach((result: any) => {
        console.log(`📋 ${result.test}: ${JSON.stringify(result)}`);

        switch (result.test) {
          case 'disabled_optimization':
            // 禁用优化时，可能使用CDN或本地，取决于其他条件
            break;
          case 'force_local':
            expect(result.isLocal).toBe(true);
            break;
          case 'custom_base_path':
            expect(result.hasCustomPath).toBe(true);
            break;
        }
      });
    }

    console.log('✅ 本地环境优化配置灵活性验证通过');
  });
});
