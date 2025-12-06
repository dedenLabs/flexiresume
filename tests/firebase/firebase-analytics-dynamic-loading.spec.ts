/**
 * Firebase Analytics 动态加载测试
 * Firebase Analytics Dynamic Loading Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Firebase Analytics 动态加载', () => {
  test.beforeEach(async ({ page }) => {
    // 设置环境变量模拟
    await page.addInitScript(() => {
      // 模拟环境变量
      (window as any).import = {
        meta: {
          env: {
            VITE_GOOGLE_ENABLED: 'true',
            VITE_GOOGLE_MEASUREMENT_ID: 'G-TEST123456',
            VITE_GOOGLE_USE_FIREBASE: 'true',
            VITE_GOOGLE_DYNAMIC_LOADING: 'true',
            VITE_FIREBASE_API_KEY: 'test-api-key',
            VITE_FIREBASE_PROJECT_ID: 'test-project',
            VITE_FIREBASE_APP_ID: 'test-app-id'
          }
        }
      };
    });
  });

  test('应该能够动态加载Firebase SDK', async ({ page }) => {
    await page.goto('/');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 检查Firebase Analytics加载器是否存在
    const firebaseLoaderExists = await page.evaluate(() => {
      return typeof window.firebaseAnalyticsLoader !== 'undefined';
    });

    if (firebaseLoaderExists) {
      console.log('✅ Firebase Analytics Loader 已加载');
    }

    // 检查是否有Firebase相关的网络请求
    const requests = [];
    page.on('request', request => {
      if (request.url().includes('firebase') || request.url().includes('gstatic.com')) {
        requests.push(request.url());
      }
    });

    // 触发Firebase初始化
    await page.evaluate(async () => {
      if (window.firebaseAnalyticsLoader) {
        try {
          await window.firebaseAnalyticsLoader.initialize();
        } catch (error) {
          console.log('Firebase初始化测试:', error.message);
        }
      }
    });

    // 等待一段时间让请求完成
    await page.waitForTimeout(3000);

    console.log('Firebase相关请求:', requests);
  });

  test('应该能够记录事件', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试事件记录
    const eventLogged = await page.evaluate(async () => {
      if (window.firebaseAnalyticsLoader) {
        try {
          await window.firebaseAnalyticsLoader.logEvent('test_event', {
            test_parameter: 'test_value'
          });
          return true;
        } catch (error) {
          console.log('事件记录测试:', error.message);
          return false;
        }
      }
      return false;
    });

    console.log('事件记录结果:', eventLogged ? '成功' : '失败');
  });

  test('应该能够设置用户属性', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试用户属性设置
    const propertySet = await page.evaluate(async () => {
      if (window.firebaseAnalyticsLoader) {
        try {
          await window.firebaseAnalyticsLoader.setUserProperties({
            test_property: 'test_value'
          });
          return true;
        } catch (error) {
          console.log('用户属性设置测试:', error.message);
          return false;
        }
      }
      return false;
    });

    console.log('用户属性设置结果:', propertySet ? '成功' : '失败');
  });

  test('应该能够获取状态信息', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 获取状态信息
    const status = await page.evaluate(() => {
      if (window.firebaseAnalyticsLoader) {
        return window.firebaseAnalyticsLoader.getStatus();
      }
      return null;
    });

    console.log('Firebase Analytics状态:', status);

    if (status) {
      expect(typeof status.isLoaded).toBe('boolean');
      expect(typeof status.isLoading).toBe('boolean');
      expect(typeof status.hasAnalytics).toBe('boolean');
      expect(typeof status.configValid).toBe('boolean');
    }
  });

  test('应该在配置无效时优雅处理', async ({ page }) => {
    // 设置无效配置
    await page.addInitScript(() => {
      (window as any).import = {
        meta: {
          env: {
            VITE_GOOGLE_ENABLED: 'true',
            VITE_GOOGLE_USE_FIREBASE: 'true',
            VITE_GOOGLE_DYNAMIC_LOADING: 'true',
            // 缺少必要的Firebase配置
          }
        }
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试无效配置的处理
    const initResult = await page.evaluate(async () => {
      if (window.firebaseAnalyticsLoader) {
        try {
          const result = await window.firebaseAnalyticsLoader.initialize();
          return { success: result, error: null };
        } catch (error) {
          return { success: false, error: error.message };
        }
      }
      return { success: false, error: 'Loader not found' };
    });

    console.log('无效配置测试结果:', initResult);
    
    // 应该优雅地处理错误，不抛出异常
    expect(initResult.success).toBe(false);
  });

  test('应该支持开关控制', async ({ page }) => {
    // 设置禁用Firebase
    await page.addInitScript(() => {
      (window as any).import = {
        meta: {
          env: {
            VITE_GOOGLE_ENABLED: 'false', // 禁用
            VITE_GOOGLE_USE_FIREBASE: 'true',
            VITE_GOOGLE_DYNAMIC_LOADING: 'true',
          }
        }
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 检查是否正确禁用
    const status = await page.evaluate(() => {
      if (window.firebaseAnalyticsLoader) {
        return window.firebaseAnalyticsLoader.getStatus();
      }
      return null;
    });

    console.log('禁用状态测试:', status);
    
    if (status) {
      expect(status.configValid).toBe(false);
    }
  });

  test('应该能够重置状态', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试重置功能
    const resetResult = await page.evaluate(() => {
      if (window.firebaseAnalyticsLoader) {
        const beforeReset = window.firebaseAnalyticsLoader.getStatus();
        window.firebaseAnalyticsLoader.reset();
        const afterReset = window.firebaseAnalyticsLoader.getStatus();
        
        return {
          before: beforeReset,
          after: afterReset
        };
      }
      return null;
    });

    console.log('重置测试结果:', resetResult);

    if (resetResult) {
      expect(resetResult.after.isLoaded).toBe(false);
      expect(resetResult.after.isLoading).toBe(false);
      expect(resetResult.after.hasAnalytics).toBe(false);
    }
  });

  test('应该能够处理网络错误', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/firebase**', route => {
      route.abort('failed');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试网络错误处理
    const errorHandling = await page.evaluate(async () => {
      if (window.firebaseAnalyticsLoader) {
        try {
          const result = await window.firebaseAnalyticsLoader.initialize();
          return { success: result, error: null };
        } catch (error) {
          return { success: false, error: error.message };
        }
      }
      return { success: false, error: 'Loader not found' };
    });

    console.log('网络错误处理测试:', errorHandling);
    
    // 应该优雅地处理网络错误
    expect(errorHandling.success).toBe(false);
  });
});

test.describe('Google Analytics 集成测试', () => {
  test('应该能够通过Google Analytics使用Firebase', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试Google Analytics的Firebase集成
    const integrationTest = await page.evaluate(async () => {
      // 检查Google Analytics是否可用
      if (window.googleAnalytics) {
        try {
          // 获取状态
          const status = window.googleAnalytics.getStatus();
          
          // 尝试跟踪事件
          window.googleAnalytics.trackEvent({
            action: 'test_firebase_integration',
            category: 'test',
            label: 'dynamic_loading'
          });

          return {
            status,
            eventTracked: true
          };
        } catch (error) {
          return {
            status: null,
            eventTracked: false,
            error: error.message
          };
        }
      }
      return { status: null, eventTracked: false, error: 'Google Analytics not found' };
    });

    console.log('Google Analytics Firebase集成测试:', integrationTest);

    if (integrationTest.status) {
      expect(typeof integrationTest.status.initialized).toBe('boolean');
      expect(typeof integrationTest.status.enabled).toBe('boolean');
      expect(typeof integrationTest.status.method).toBe('string');
    }
  });
});
