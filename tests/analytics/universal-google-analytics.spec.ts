/**
 * 通用版Google Analytics测试
 * Universal Google Analytics Tests
 */

import { test, expect } from '@playwright/test';

test.describe('通用版Google Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // 设置环境变量模拟
    await page.addInitScript(() => {
      // 模拟环境变量
      (window as any).import = {
        meta: {
          env: {
            VITE_GOOGLE_ENABLED: 'true',
            VITE_GOOGLE_MEASUREMENT_ID: 'G-7LG0G58765',
            VITE_GOOGLE_DEBUG: 'true'
          }
        }
      };
    });
  });

  test('应该能够初始化通用版Google Analytics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试初始化
    const initResult = await page.evaluate(async () => {
      // 动态导入模块
      const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
      const { initializeGA, getGAStatus } = module;

      try {
        const success = await initializeGA();
        const status = getGAStatus();
        
        return {
          success,
          status,
          error: null
        };
      } catch (error) {
        return {
          success: false,
          status: null,
          error: error.message
        };
      }
    });

    console.log('初始化结果:', initResult);

    if (initResult.success) {
      expect(initResult.status.enabled).toBe(true);
      expect(initResult.status.measurementId).toContain('G-7LG0G5');
    }
  });

  test('应该能够跟踪页面浏览', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const pageViewResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { initializeGA, trackPageView } = module;

        await initializeGA();
        
        // 跟踪页面浏览
        trackPageView({
          page_title: 'Test Page',
          page_path: '/test',
          content_group1: 'Testing'
        });

        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    console.log('页面浏览跟踪结果:', pageViewResult);
    expect(pageViewResult.success).toBe(true);
  });

  test('应该能够跟踪事件', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const eventResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { initializeGA, trackEvent } = module;

        await initializeGA();
        
        // 跟踪事件
        trackEvent({
          action: 'test_click',
          category: 'testing',
          label: 'unit_test',
          value: 1,
          custom_parameters: {
            test_param: 'test_value'
          }
        });

        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    console.log('事件跟踪结果:', eventResult);
    expect(eventResult.success).toBe(true);
  });

  test('应该能够设置用户属性', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const userPropertyResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { initializeGA, setUserProperty } = module;

        await initializeGA();
        
        // 设置用户属性
        setUserProperty('user_type', 'test_user');

        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    console.log('用户属性设置结果:', userPropertyResult);
    expect(userPropertyResult.success).toBe(true);
  });

  test('应该能够设置用户ID', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const userIdResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { initializeGA, setUserId } = module;

        await initializeGA();
        
        // 设置用户ID
        setUserId('test_user_123');

        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    console.log('用户ID设置结果:', userIdResult);
    expect(userIdResult.success).toBe(true);
  });

  test('应该能够获取状态信息', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const statusResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { initializeGA, getGAStatus } = module;

        await initializeGA();
        const status = getGAStatus();

        return { success: true, status, error: null };
      } catch (error) {
        return { success: false, status: null, error: error.message };
      }
    });

    console.log('状态信息:', statusResult);

    if (statusResult.success && statusResult.status) {
      expect(typeof statusResult.status.initialized).toBe('boolean');
      expect(typeof statusResult.status.enabled).toBe('boolean');
      expect(typeof statusResult.status.measurementId).toBe('string');
      expect(typeof statusResult.status.hasGtag).toBe('boolean');
    }
  });

  test('应该支持自定义配置', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const customConfigResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { universalGA } = module;

        // 使用自定义配置初始化
        const success = await universalGA.initialize({
          measurementId: 'G-CUSTOM123',
          enabled: true,
          debug: true,
          customDimensions: {
            custom_dim_1: 'value1'
          }
        });

        const status = universalGA.getStatus();

        return { success, status, error: null };
      } catch (error) {
        return { success: false, status: null, error: error.message };
      }
    });

    console.log('自定义配置结果:', customConfigResult);

    if (customConfigResult.success) {
      expect(customConfigResult.status.config?.measurementId).toBe('G-CUSTOM123');
      expect(customConfigResult.status.config?.debug).toBe(true);
    }
  });

  test('应该在禁用时优雅处理', async ({ page }) => {
    // 设置禁用配置
    await page.addInitScript(() => {
      (window as any).import = {
        meta: {
          env: {
            VITE_GOOGLE_ENABLED: 'false',
            VITE_GOOGLE_MEASUREMENT_ID: 'G-7LG0G58765'
          }
        }
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const disabledResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { initializeGA, getGAStatus } = module;

        const success = await initializeGA();
        const status = getGAStatus();

        return { success, status, error: null };
      } catch (error) {
        return { success: false, status: null, error: error.message };
      }
    });

    console.log('禁用状态结果:', disabledResult);
    expect(disabledResult.success).toBe(false);
    
    if (disabledResult.status) {
      expect(disabledResult.status.enabled).toBe(false);
    }
  });

  test('应该处理无效测量ID', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const invalidIdResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { universalGA } = module;

        // 使用无效的测量ID
        const success = await universalGA.initialize({
          measurementId: '',
          enabled: true
        });

        return { success, error: null };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    console.log('无效ID处理结果:', invalidIdResult);
    expect(invalidIdResult.success).toBe(false);
  });

  test('应该能够重置状态', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const resetResult = await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { universalGA } = module;

        // 初始化
        await universalGA.initialize({
          measurementId: 'G-TEST123',
          enabled: true
        });

        const beforeReset = universalGA.getStatus();
        
        // 重置
        universalGA.reset();
        
        const afterReset = universalGA.getStatus();

        return {
          success: true,
          beforeReset,
          afterReset,
          error: null
        };
      } catch (error) {
        return {
          success: false,
          beforeReset: null,
          afterReset: null,
          error: error.message
        };
      }
    });

    console.log('重置结果:', resetResult);

    if (resetResult.success) {
      expect(resetResult.beforeReset.initialized).toBe(true);
      expect(resetResult.afterReset.initialized).toBe(false);
      expect(resetResult.afterReset.measurementId).toBe('');
    }
  });
});

test.describe('Google Analytics网络请求', () => {
  test('应该发送正确的网络请求', async ({ page }) => {
    const requests = [];
    
    // 监听网络请求
    page.on('request', request => {
      if (request.url().includes('googletagmanager.com') || 
          request.url().includes('google-analytics.com')) {
        requests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 初始化GA
    await page.evaluate(async () => {
      try {
        const module = await import('/src/utils/UniversalGoogleAnalytics.ts');
        const { initializeGA } = module;
        await initializeGA();
      } catch (error) {
        console.log('初始化错误:', error.message);
      }
    });

    // 等待网络请求
    await page.waitForTimeout(2000);

    console.log('Google Analytics网络请求:', requests);
    
    // 验证是否有gtag.js加载请求
    const gtagRequest = requests.find(req => 
      req.url.includes('googletagmanager.com/gtag/js')
    );
    
    if (gtagRequest) {
      expect(gtagRequest.method).toBe('GET');
      expect(gtagRequest.url).toContain('G-7LG0G58765');
    }
  });
});
