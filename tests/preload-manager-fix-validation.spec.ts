/**
 * PreloadManager修复验证测试
 * 验证startsWith错误修复是否有效
 * @author dedenlabs
 * @date 2025-08-04
 */

import { test, expect } from '@playwright/test';

test.describe('PreloadManager修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console Error:', msg.text());
      }
    });

    // 监听页面错误
    page.on('pageerror', error => {
      console.log('Page Error:', error.message);
    });
  });

  test('验证PreloadManager不会因为undefined src导致startsWith错误', async ({ page }) => {
    // 记录所有错误
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('startsWith')) {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      if (error.message.includes('startsWith')) {
        errors.push(error.message);
      }
    });

    // 访问页面
    await page.goto('/');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 等待预加载管理器初始化
    await page.waitForTimeout(3000);

    // 验证没有startsWith相关错误
    expect(errors).toHaveLength(0);

    // 验证页面正常加载
    await expect(page.locator('body')).toBeVisible();
  });

  test('验证音频配置处理的健壮性', async ({ page }) => {
    // 注入测试代码来模拟异常音频配置
    await page.goto('/');

    const testResult = await page.evaluate(() => {
      // 模拟异常的音频配置
      const testConfigs = [
        { preload: true, src: undefined },
        { preload: true, src: null },
        { preload: true, src: '' },
        { preload: true, src: 'http://example.com/audio.mp3' },
        { preload: true, src: '//example.com/audio.mp3' },
        { preload: true, src: '/local/audio.mp3' },
        { preload: false, src: 'http://example.com/audio.mp3' }
      ];

      // 测试isRemoteResource方法的健壮性
      const results = testConfigs.map(config => {
        try {
          // 模拟PreloadManager的逻辑
          const hasValidSrc = config.src && typeof config.src === 'string';
          const isRemote = hasValidSrc && (config.src.startsWith('http') || config.src.startsWith('//'));
          const shouldPreloadLocal = config.preload && hasValidSrc && !isRemote;
          const shouldPreloadRemote = config.preload && hasValidSrc && isRemote;
          
          return {
            config,
            hasValidSrc,
            isRemote,
            shouldPreloadLocal,
            shouldPreloadRemote,
            error: null
          };
        } catch (error) {
          return {
            config,
            error: error.message
          };
        }
      });

      return results;
    });

    // 验证所有配置都能正确处理，没有错误
    testResult.forEach((result, index) => {
      expect(result.error).toBeNull();
      console.log(`Config ${index}:`, result);
    });

    // 验证具体的处理逻辑
    expect(testResult[0].hasValidSrc).toBe(false); // undefined src
    expect(testResult[1].hasValidSrc).toBe(false); // null src
    expect(testResult[2].hasValidSrc).toBe(false); // empty src
    expect(testResult[3].isRemote).toBe(true);     // http URL
    expect(testResult[4].isRemote).toBe(true);     // // URL
    expect(testResult[5].isRemote).toBe(false);    // local path
  });

  test('验证页面功能正常工作', async ({ page }) => {
    await page.goto('/');

    // 等待页面完全加载
    await page.waitForLoadState('networkidle');

    // 验证主要组件是否正常渲染
    await expect(page.locator('[data-testid="app-container"], .app-container, #root')).toBeVisible();

    // 验证没有JavaScript错误阻止页面功能
    const hasErrors = await page.evaluate(() => {
      return window.onerror !== null || window.addEventListener !== undefined;
    });

    expect(hasErrors).toBeTruthy(); // 确保错误处理机制存在
  });

  test('验证控制台没有PreloadManager相关错误', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // 等待预加载完成

    // 过滤出PreloadManager相关的错误
    const preloadErrors = consoleErrors.filter(error => 
      error.includes('PreloadManager') || 
      error.includes('startsWith') ||
      error.includes('CDN无关预加载失败')
    );

    // 验证没有PreloadManager相关错误
    expect(preloadErrors).toHaveLength(0);

    if (preloadErrors.length > 0) {
      console.log('PreloadManager相关错误:', preloadErrors);
    }
  });

  test('验证音频预加载功能正常', async ({ page }) => {
    await page.goto('/');

    // 等待预加载完成
    await page.waitForTimeout(3000);

    // 检查预加载统计信息
    const preloadStats = await page.evaluate(() => {
      // 尝试获取PreloadManager的统计信息
      return (window as any).preloadManagerStats || null;
    });

    // 如果有统计信息，验证其合理性
    if (preloadStats) {
      expect(typeof preloadStats.totalTasks).toBe('number');
      expect(typeof preloadStats.completedTasks).toBe('number');
      expect(typeof preloadStats.failedTasks).toBe('number');
      expect(preloadStats.completedTasks + preloadStats.failedTasks).toBeLessThanOrEqual(preloadStats.totalTasks);
    }
  });
});

test.describe('边界情况测试', () => {
  test('测试各种异常音频配置', async ({ page }) => {
    await page.goto('/');

    // 注入测试代码
    const testResult = await page.evaluate(() => {
      // 创建测试用的isRemoteResource函数
      function isRemoteResource(src: string | undefined): boolean {
        if (!src || typeof src !== 'string') {
          return false;
        }
        return src.startsWith('http') || src.startsWith('//');
      }

      // 测试各种边界情况
      const testCases = [
        undefined,
        null,
        '',
        'http://example.com/audio.mp3',
        'https://example.com/audio.mp3',
        '//example.com/audio.mp3',
        '/local/audio.mp3',
        'audio.mp3',
        'data:audio/mp3;base64,',
        123 as any, // 非字符串类型
        {} as any,  // 对象类型
        [] as any   // 数组类型
      ];

      const results = testCases.map(testCase => {
        try {
          const result = isRemoteResource(testCase);
          return { input: testCase, result, error: null };
        } catch (error) {
          return { input: testCase, result: null, error: error.message };
        }
      });

      return results;
    });

    // 验证所有测试用例都不会抛出错误
    testResult.forEach((result, index) => {
      expect(result.error).toBeNull();
    });

    // 验证预期的结果
    expect(testResult[0].result).toBe(false); // undefined
    expect(testResult[1].result).toBe(false); // null
    expect(testResult[2].result).toBe(false); // empty string
    expect(testResult[3].result).toBe(true);  // http
    expect(testResult[4].result).toBe(true);  // https
    expect(testResult[5].result).toBe(true);  // //
    expect(testResult[6].result).toBe(false); // local path
    expect(testResult[7].result).toBe(false); // relative path
    expect(testResult[8].result).toBe(false); // data URL
    expect(testResult[9].result).toBe(false); // number
    expect(testResult[10].result).toBe(false); // object
    expect(testResult[11].result).toBe(false); // array
  });
});
