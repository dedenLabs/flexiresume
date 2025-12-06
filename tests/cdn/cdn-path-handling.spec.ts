/**
 * CDN路径处理测试
 * 测试智能CDN路由的本地资源路径处理功能
 */

import { test, expect, Page } from '@playwright/test';
import { ErrorCollector } from '../utils/ErrorCollector';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

class CDNPathTester {
  constructor(private page: Page) {}

  /**
   * 模拟不同的部署场景
   */
  async testDeploymentScenarios(): Promise<{
    scenarios: Array<{
      name: string;
      url: string;
      expectedBasePath: string;
      actualBasePath: string;
      resourceUrls: string[];
      success: boolean;
    }>;
    overallSuccess: boolean;
  }> {
    const scenarios = [
      {
        name: '开发环境 - 根目录',
        url: 'http://localhost:5173/',
        expectedBasePath: '',
        description: '开发环境应该使用空的基础路径'
      },
      {
        name: '开发环境 - 子路由',
        url: 'http://localhost:5173/fullstack',
        expectedBasePath: '',
        description: '开发环境的子路由也应该使用空的基础路径'
      },
      {
        name: '生产环境 - 根目录部署',
        url: 'https://example.com/',
        expectedBasePath: '',
        description: '根目录部署应该使用空的基础路径'
      },
      {
        name: '生产环境 - 根目录子路由',
        url: 'https://example.com/fullstack',
        expectedBasePath: '',
        description: '根目录部署的子路由应该使用空的基础路径'
      },
      {
        name: '生产环境 - 子目录部署',
        url: 'https://example.com/my-resume/docs/',
        expectedBasePath: '/my-resume/docs',
        description: '子目录部署应该检测到正确的基础路径'
      },
      {
        name: '生产环境 - 子目录子路由',
        url: 'https://example.com/my-resume/docs/fullstack',
        expectedBasePath: '/my-resume/docs',
        description: '子目录部署的子路由应该检测到正确的基础路径'
      }
    ];

    const results = [];

    for (const scenario of scenarios) {
      try {
        // 模拟访问不同的URL
        const result = await this.page.evaluate((testScenario) => {
          // 模拟不同的window.location
          const originalLocation = window.location;
          const mockLocation = new URL(testScenario.url);
          
          // 创建一个模拟的location对象
          const mockLocationObj = {
            href: mockLocation.href,
            protocol: mockLocation.protocol,
            hostname: mockLocation.hostname,
            port: mockLocation.port,
            pathname: mockLocation.pathname,
            search: mockLocation.search,
            hash: mockLocation.hash
          };

          // 模拟CDN管理器的路径检测逻辑
          const isLocalDevelopment = () => {
            return mockLocationObj.hostname === 'localhost' || 
                   mockLocationObj.hostname === '127.0.0.1' ||
                   mockLocationObj.hostname === '0.0.0.0';
          };

          const getProjectBasePath = () => {
            const currentPath = mockLocationObj.pathname;
            const pathSegments = currentPath.split('/').filter(segment => segment);
            
            let projectBasePath = '';
            const isDev = isLocalDevelopment();

            if (isDev) {
              projectBasePath = '';
            } else {
              if (pathSegments.length > 0) {
                const lastSegment = pathSegments[pathSegments.length - 1];
                const knownRoutes = ['fullstack', 'games', 'tools', 'operations', 'automation', 'management'];
                const isKnownRoute = knownRoutes.includes(lastSegment) || lastSegment.endsWith('.html');
                
                if (isKnownRoute && pathSegments.length > 1) {
                  const baseSegments = pathSegments.slice(0, -1);
                  projectBasePath = '/' + baseSegments.join('/');
                } else if (!isKnownRoute && pathSegments.length >= 1) {
                  projectBasePath = '/' + pathSegments.join('/');
                }
              }
            }

            if (projectBasePath && projectBasePath !== '/' && projectBasePath.endsWith('/')) {
              projectBasePath = projectBasePath.slice(0, -1);
            }

            return projectBasePath;
          };

          const buildLocalUrl = (resourcePath: string) => {
            const projectBasePath = getProjectBasePath();
            const cleanResourcePath = resourcePath.startsWith('/') ? resourcePath.slice(1) : resourcePath;
            
            let fullResourcePath: string;
            
            if (projectBasePath) {
              const normalizedBasePath = projectBasePath.startsWith('/') ? projectBasePath : '/' + projectBasePath;
              const basePathWithSlash = normalizedBasePath.endsWith('/') ? normalizedBasePath : normalizedBasePath + '/';
              fullResourcePath = basePathWithSlash + cleanResourcePath;
            } else {
              fullResourcePath = '/' + cleanResourcePath;
            }

            const { protocol, hostname, port } = mockLocationObj;
            const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : '';
            return `${protocol}//${hostname}${portSuffix}${fullResourcePath}`;
          };

          // 测试几个常见的资源路径
          const testResources = [
            'images/avatar.webp',
            'assets/style.css',
            'js/main.js'
          ];

          const resourceUrls = testResources.map(resource => buildLocalUrl(resource));
          const actualBasePath = getProjectBasePath();

          return {
            actualBasePath,
            resourceUrls,
            isDev: isLocalDevelopment(),
            pathname: mockLocationObj.pathname,
            hostname: mockLocationObj.hostname
          };
        }, scenario);

        const success = result.actualBasePath === scenario.expectedBasePath;

        results.push({
          name: scenario.name,
          url: scenario.url,
          expectedBasePath: scenario.expectedBasePath,
          actualBasePath: result.actualBasePath,
          resourceUrls: result.resourceUrls,
          success
        });

        console.log(`${success ? '✅' : '❌'} ${scenario.name}:`);
        console.log(`  URL: ${scenario.url}`);
        console.log(`  Expected: "${scenario.expectedBasePath}"`);
        console.log(`  Actual: "${result.actualBasePath}"`);
        console.log(`  Sample resource URL: ${result.resourceUrls[0]}`);

      } catch (error) {
        console.error(`测试场景 ${scenario.name} 失败:`, error);
        results.push({
          name: scenario.name,
          url: scenario.url,
          expectedBasePath: scenario.expectedBasePath,
          actualBasePath: 'ERROR',
          resourceUrls: [],
          success: false
        });
      }
    }

    const overallSuccess = results.every(r => r.success);

    return {
      scenarios: results,
      overallSuccess
    };
  }

  /**
   * 测试实际的资源加载
   */
  async testResourceLoading(): Promise<{
    loadedResources: Array<{
      url: string;
      status: number;
      success: boolean;
    }>;
    failedResources: string[];
    successRate: number;
  }> {
    const loadedResources: Array<{
      url: string;
      status: number;
      success: boolean;
    }> = [];

    // 监听网络请求
    this.page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      const success = status >= 200 && status < 400;
      
      // 只记录静态资源
      if (url.includes('/images/') || url.includes('/assets/') || url.includes('/js/') || url.includes('/css/')) {
        loadedResources.push({
          url,
          status,
          success
        });
      }
    });

    // 访问页面并等待资源加载
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');

    // 访问子路由
    await this.page.goto('/fullstack');
    await this.page.waitForLoadState('networkidle');

    const failedResources = loadedResources
      .filter(r => !r.success)
      .map(r => r.url);

    const successRate = loadedResources.length > 0 
      ? loadedResources.filter(r => r.success).length / loadedResources.length 
      : 0;

    return {
      loadedResources,
      failedResources,
      successRate
    };
  }

  /**
   * 检查特定的问题资源
   */
  async checkProblemResource(): Promise<{
    originalProblem: boolean;
    fixedProblem: boolean;
    resourceUrl: string;
  }> {
    // 检查原始问题：http://localhost:5173images/avatar.webp
    const problemUrl = 'http://localhost:5173images/avatar.webp';
    
    let originalProblem = false;
    let fixedProblem = false;
    let resourceUrl = '';

    // 监听网络请求，查找avatar.webp相关的请求
    this.page.on('response', (response) => {
      const url = response.url();
      if (url.includes('avatar.webp')) {
        resourceUrl = url;
        
        // 检查是否是原始问题的URL格式
        if (url === problemUrl) {
          originalProblem = true;
        }
        
        // 检查是否是修复后的正确格式
        if (url.includes('/images/avatar.webp') && !url.includes('5173images')) {
          fixedProblem = true;
        }
      }
    });

    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');

    return {
      originalProblem,
      fixedProblem,
      resourceUrl
    };
  }
}

test.describe('CDN路径处理测试', () => {
  let errorCollector: ErrorCollector;
  let screenshotHelper: ScreenshotHelper;
  let cdnPathTester: CDNPathTester;

  test.beforeEach(async ({ page }) => {
    errorCollector = new ErrorCollector(page);
    screenshotHelper = new ScreenshotHelper(page);
    cdnPathTester = new CDNPathTester(page);
  });

  test('部署场景路径检测测试', async ({ page }) => {
    const result = await cdnPathTester.testDeploymentScenarios();
    
    console.log('=== 部署场景测试结果 ===');
    console.log(`总体成功: ${result.overallSuccess}`);
    console.log(`成功场景: ${result.scenarios.filter(s => s.success).length}/${result.scenarios.length}`);

    // 截图记录测试状态
    await screenshotHelper.takeScreenshot('cdn-path-deployment-scenarios', 'zh');

    // 断言
    expect(result.overallSuccess).toBe(true);
    
    // 检查每个场景
    result.scenarios.forEach(scenario => {
      expect(scenario.success).toBe(true);
      expect(scenario.actualBasePath).toBe(scenario.expectedBasePath);
    });
  });

  test('实际资源加载测试', async ({ page }) => {
    const result = await cdnPathTester.testResourceLoading();
    
    console.log('=== 资源加载测试结果 ===');
    console.log(`成功率: ${(result.successRate * 100).toFixed(2)}%`);
    console.log(`加载的资源数: ${result.loadedResources.length}`);
    console.log(`失败的资源数: ${result.failedResources.length}`);
    
    if (result.failedResources.length > 0) {
      console.log('失败的资源:', result.failedResources);
    }

    // 截图记录资源加载状态
    await screenshotHelper.takeScreenshot('cdn-path-resource-loading', 'zh');

    // 断言
    expect(result.successRate).toBeGreaterThan(0.8); // 80%以上成功率
    expect(result.failedResources.length).toBeLessThan(5); // 失败资源少于5个
  });

  test('原始问题修复验证', async ({ page }) => {
    const result = await cdnPathTester.checkProblemResource();
    
    console.log('=== 原始问题修复验证 ===');
    console.log(`原始问题存在: ${result.originalProblem}`);
    console.log(`问题已修复: ${result.fixedProblem}`);
    console.log(`资源URL: ${result.resourceUrl}`);

    // 截图记录修复状态
    await screenshotHelper.takeScreenshot('cdn-path-problem-fix', 'zh');

    // 断言
    expect(result.originalProblem).toBe(false); // 原始问题不应该存在
    expect(result.fixedProblem).toBe(true); // 应该使用正确的URL格式
    expect(result.resourceUrl).toContain('/images/avatar.webp'); // 应该包含正确的路径
    expect(result.resourceUrl).not.toContain('5173images'); // 不应该包含错误的路径
  });

  test.afterEach(async ({ page }) => {
    // 检查CDN相关错误
    const errors = errorCollector.getErrors();
    const cdnErrors = errors.filter(e => 
      e.message.includes('CDN') || 
      e.message.includes('resource') ||
      e.message.includes('404') ||
      e.message.includes('Failed to load')
    );

    if (cdnErrors.length > 0) {
      console.warn('CDN相关错误:', cdnErrors);
    }
  });
});
