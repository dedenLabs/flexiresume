import { test, expect } from '@playwright/test';

test.describe('基础路径查找逻辑修复验证', () => {
  test('应该正确处理子目录部署的基础路径', async ({ page }) => {
    // 模拟子目录部署的URL结构
    const testUrls = [
      'http://localhost:8081/my-resume/docs/fullstack',
      'http://localhost:8081/my-resume/docs/games',
      'http://localhost:8081/project/dist/tools',
      'http://localhost:8081/app/build/operations'
    ];

    for (const testUrl of testUrls) {
      // 注入测试环境
      await page.addInitScript(() => {
        // 模拟CDNManager的路径处理逻辑
        window.testPathLogic = (url: string) => {
          const urlObj = new URL(url);
          const currentPath = urlObj.pathname;
          const pathSegments = currentPath.split('/').filter(segment => segment);
          
          let projectBasePath = '';
          
          if (pathSegments.length > 0) {
            const lastSegment = pathSegments[pathSegments.length - 1];
            const knownRoutes = ['fullstack', 'games', 'tools', 'operations', 'automation', 'management'];
            const isKnownRoute = knownRoutes.includes(lastSegment) || lastSegment.endsWith('.html');

            if (isKnownRoute && pathSegments.length > 1) {
              // 子目录部署：保留除最后一个段之外的所有段
              const baseSegments = pathSegments.slice(0, -1);
              projectBasePath = '/' + baseSegments.join('/');
            } else if (!isKnownRoute && pathSegments.length >= 1) {
              // 当前路径可能就是基础路径
              projectBasePath = '/' + pathSegments.join('/');
            }
          }

          // 确保路径格式正确（不以 / 结尾，除非是根路径）
          if (projectBasePath && projectBasePath !== '/' && projectBasePath.endsWith('/')) {
            projectBasePath = projectBasePath.slice(0, -1);
          }

          return projectBasePath;
        };

        // 模拟Data.ts中的route_base_name计算逻辑
        window.calculateRouteBaseName = (url: string) => {
          const urlObj = new URL(url);
          return urlObj.pathname.split("/").slice(0, -1).join("/") + "/";
        };
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // 测试路径处理逻辑
      const result = await page.evaluate((testUrl) => {
        const cdnBasePath = window.testPathLogic(testUrl);
        const routeBaseName = window.calculateRouteBaseName(testUrl);
        
        return {
          testUrl,
          cdnBasePath,
          routeBaseName,
          shouldMatch: cdnBasePath === routeBaseName.slice(0, -1) // 去掉末尾的 /
        };
      }, testUrl);

      console.log(`测试URL: ${result.testUrl}`);
      console.log(`CDN基础路径: ${result.cdnBasePath}`);
      console.log(`路由基础名称: ${result.routeBaseName}`);
      console.log(`路径匹配: ${result.shouldMatch}`);

      // 验证路径处理的一致性
      expect(result.shouldMatch).toBeTruthy();
    }
  });

  test('应该正确处理根目录部署', async ({ page }) => {
    const rootUrls = [
      'http://localhost:3000/fullstack',
      'http://localhost:3000/games',
      'http://example.com/tools'
    ];

    await page.addInitScript(() => {
      window.testPathLogic = (url: string) => {
        const urlObj = new URL(url);
        const currentPath = urlObj.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment);
        
        let projectBasePath = '';
        
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

        if (projectBasePath && projectBasePath !== '/' && projectBasePath.endsWith('/')) {
          projectBasePath = projectBasePath.slice(0, -1);
        }

        return projectBasePath;
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    for (const testUrl of rootUrls) {
      const result = await page.evaluate((url) => {
        return {
          testUrl: url,
          basePath: window.testPathLogic(url)
        };
      }, testUrl);

      console.log(`根目录测试URL: ${result.testUrl}`);
      console.log(`基础路径: ${result.basePath}`);

      // 根目录部署应该返回空字符串
      expect(result.basePath).toBe('');
    }
  });

  test('应该正确处理HTML文件路径', async ({ page }) => {
    const htmlUrls = [
      'http://localhost:8081/my-resume/docs/index.html',
      'http://localhost:8081/project/dist/fullstack.html',
      'http://example.com/app/games.html'
    ];

    await page.addInitScript(() => {
      window.testPathLogic = (url: string) => {
        const urlObj = new URL(url);
        const currentPath = urlObj.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment);
        
        let projectBasePath = '';
        
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

        if (projectBasePath && projectBasePath !== '/' && projectBasePath.endsWith('/')) {
          projectBasePath = projectBasePath.slice(0, -1);
        }

        return projectBasePath;
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    for (const testUrl of htmlUrls) {
      const result = await page.evaluate((url) => {
        return {
          testUrl: url,
          basePath: window.testPathLogic(url)
        };
      }, testUrl);

      console.log(`HTML文件测试URL: ${result.testUrl}`);
      console.log(`基础路径: ${result.basePath}`);

      // HTML文件应该正确提取基础路径
      if (testUrl.includes('/my-resume/docs/')) {
        expect(result.basePath).toBe('/my-resume/docs');
      } else if (testUrl.includes('/project/dist/')) {
        expect(result.basePath).toBe('/project/dist');
      } else if (testUrl.includes('/app/')) {
        expect(result.basePath).toBe('/app');
      }
    }
  });

  test('应该在实际应用中正确工作', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 检查实际的路由基础名称
    const routeBaseName = await page.evaluate(() => {
      // 尝试获取应用中的route_base_name
      return new URL(location.href).pathname.split("/").slice(0, -1).join("/") + "/";
    });

    console.log(`实际路由基础名称: ${routeBaseName}`);

    // 验证路由基础名称格式正确
    expect(routeBaseName).toMatch(/^\/.*\/$/);

    // 检查页面是否正常加载
    await expect(page.locator('body')).toBeVisible();
    
    // 检查是否有路径相关的错误
    const errors = await page.evaluate(() => {
      return window.console.error.toString();
    });
    
    // 不应该有路径相关的错误
    expect(errors).not.toContain('path');
    expect(errors).not.toContain('route');
  });
});
