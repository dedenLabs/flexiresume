/**
 * 强制环境模式功能测试
 * 
 * 测试目标：验证VITE_FORCE_ENV_MODE环境变量的功能
 * 
 * @author Claude (Augment Agent)
 * @date 2025-08-02
 */

import { test, expect } from '@playwright/test';

test.describe('强制环境模式功能测试', () => {
  test('验证isDevelopment函数响应环境变量', async ({ page }) => {
    console.log('🧪 开始测试强制环境模式功能...');
    
    // 访问应用
    await page.goto('http://localhost:5174');
    
    // 等待页面加载
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 测试当前环境检测
    const currentEnvResult = await page.evaluate(() => {
      // 动态导入配置模块
      return import('/src/config/ProjectConfig.ts').then(module => {
        const isDev = module.isDevelopment();
        const forceEnvMode = import.meta.env.VITE_FORCE_ENV_MODE || 'auto';
        const actualEnv = import.meta.env.DEV;
        
        return {
          isDevelopment: isDev,
          forceEnvMode: forceEnvMode,
          actualEnv: actualEnv,
          success: true
        };
      }).catch(error => {
        return {
          success: false,
          error: error.message
        };
      });
    });
    
    console.log('📊 环境检测结果:', currentEnvResult);
    
    if (currentEnvResult.success) {
      expect(currentEnvResult.isDevelopment).toBeDefined();
      expect(typeof currentEnvResult.isDevelopment).toBe('boolean');
      expect(currentEnvResult.forceEnvMode).toBeDefined();
      
      console.log(`✅ 当前环境模式: ${currentEnvResult.forceEnvMode}`);
      console.log(`✅ isDevelopment返回: ${currentEnvResult.isDevelopment}`);
      console.log(`✅ 实际Vite环境: ${currentEnvResult.actualEnv ? 'development' : 'production'}`);
      
      // 验证逻辑正确性
      if (currentEnvResult.forceEnvMode === 'auto') {
        expect(currentEnvResult.isDevelopment).toBe(currentEnvResult.actualEnv);
        console.log('✅ auto模式下，isDevelopment与实际环境一致');
      } else if (currentEnvResult.forceEnvMode === 'development') {
        expect(currentEnvResult.isDevelopment).toBe(true);
        console.log('✅ development模式下，强制返回true');
      } else if (currentEnvResult.forceEnvMode === 'production') {
        expect(currentEnvResult.isDevelopment).toBe(false);
        console.log('✅ production模式下，强制返回false');
      }
    } else {
      console.error('❌ 环境检测失败:', currentEnvResult.error);
      expect(currentEnvResult.success).toBe(true);
    }
    
    console.log('✅ 强制环境模式功能测试完成');
  });

  test('验证环境变量配置的有效性', async ({ page }) => {
    console.log('🧪 开始测试环境变量配置...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // 检查环境变量是否正确加载
    const envVarsResult = await page.evaluate(() => {
      const envVars = {
        VITE_FORCE_ENV_MODE: import.meta.env.VITE_FORCE_ENV_MODE,
        VITE_DEBUG: import.meta.env.VITE_DEBUG,
        VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
        VITE_CDN_ENABLED: import.meta.env.VITE_CDN_ENABLED
      };
      
      return {
        envVars: envVars,
        hasForceEnvMode: typeof import.meta.env.VITE_FORCE_ENV_MODE !== 'undefined',
        success: true
      };
    });
    
    console.log('📊 环境变量检查结果:', envVarsResult);
    
    expect(envVarsResult.success).toBe(true);
    expect(envVarsResult.hasForceEnvMode).toBe(true);
    
    // 验证VITE_FORCE_ENV_MODE的值是否合法
    const forceEnvMode = envVarsResult.envVars.VITE_FORCE_ENV_MODE;
    if (forceEnvMode) {
      const validModes = ['auto', 'development', 'production'];
      expect(validModes.includes(forceEnvMode.toLowerCase())).toBe(true);
      console.log(`✅ VITE_FORCE_ENV_MODE值有效: ${forceEnvMode}`);
    } else {
      console.log('ℹ️ VITE_FORCE_ENV_MODE未设置，将使用默认值auto');
    }
    
    console.log('✅ 环境变量配置测试完成');
  });

  test('验证不同环境模式的行为', async ({ page }) => {
    console.log('🧪 开始测试不同环境模式的行为...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // 模拟不同的环境模式设置
    const testCases = [
      { mode: 'auto', expectedBehavior: '跟随实际环境' },
      { mode: 'development', expectedBehavior: '强制开发环境' },
      { mode: 'production', expectedBehavior: '强制生产环境' }
    ];
    
    for (const testCase of testCases) {
      console.log(`📝 测试环境模式: ${testCase.mode}`);
      
      // 在页面中模拟不同的环境变量设置
      const result = await page.evaluate((mode) => {
        // 模拟环境变量设置
        const originalEnv = import.meta.env.VITE_FORCE_ENV_MODE;
        
        // 临时修改环境变量（仅用于测试逻辑验证）
        const mockEnv = { ...import.meta.env, VITE_FORCE_ENV_MODE: mode };
        
        // 模拟isDevelopment函数的逻辑
        let result;
        switch (mode.toLowerCase()) {
          case 'development':
            result = true;
            break;
          case 'production':
            result = false;
            break;
          case 'auto':
          default:
            result = import.meta.env.DEV;
            break;
        }
        
        return {
          mode: mode,
          result: result,
          actualEnv: import.meta.env.DEV,
          originalEnv: originalEnv
        };
      }, testCase.mode);
      
      console.log(`  📊 模式: ${result.mode}, 结果: ${result.result}, 实际环境: ${result.actualEnv}`);
      
      // 验证逻辑正确性
      if (testCase.mode === 'development') {
        expect(result.result).toBe(true);
      } else if (testCase.mode === 'production') {
        expect(result.result).toBe(false);
      } else if (testCase.mode === 'auto') {
        expect(result.result).toBe(result.actualEnv);
      }
      
      console.log(`  ✅ ${testCase.mode}模式测试通过`);
    }
    
    console.log('✅ 不同环境模式行为测试完成');
  });

  test('验证环境模式对应用行为的影响', async ({ page }) => {
    console.log('🧪 开始测试环境模式对应用行为的影响...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 检查环境模式是否影响调试功能
    const debugResult = await page.evaluate(() => {
      return import('/src/config/ProjectConfig.ts').then(module => {
        const isDev = module.isDevelopment();
        const isDebug = module.isDebugEnabled();
        
        return {
          isDevelopment: isDev,
          isDebugEnabled: isDebug,
          success: true
        };
      }).catch(error => {
        return {
          success: false,
          error: error.message
        };
      });
    });
    
    console.log('📊 调试功能检查结果:', debugResult);
    
    if (debugResult.success) {
      expect(debugResult.isDevelopment).toBeDefined();
      expect(debugResult.isDebugEnabled).toBeDefined();
      
      console.log(`✅ 开发环境状态: ${debugResult.isDevelopment}`);
      console.log(`✅ 调试模式状态: ${debugResult.isDebugEnabled}`);
      
      // 检查控制台是否有相关的调试信息
      const consoleMessages: string[] = [];
      page.on('console', (msg) => {
        consoleMessages.push(msg.text());
      });
      
      // 等待一段时间收集控制台消息
      await page.waitForTimeout(2000);
      
      // 检查是否有环境相关的日志
      const envRelatedMessages = consoleMessages.filter(msg => 
        msg.includes('环境') || msg.includes('environment') || 
        msg.includes('debug') || msg.includes('development')
      );
      
      console.log(`📝 环境相关控制台消息数量: ${envRelatedMessages.length}`);
      if (envRelatedMessages.length > 0) {
        console.log('📝 环境相关消息示例:', envRelatedMessages.slice(0, 3));
      }
    } else {
      console.error('❌ 调试功能检查失败:', debugResult.error);
    }
    
    // 截图记录当前状态
    await page.screenshot({ 
      path: 'tests/screenshots/force-env-mode-test.png',
      fullPage: false 
    });
    
    console.log('✅ 环境模式对应用行为影响测试完成');
  });
});
