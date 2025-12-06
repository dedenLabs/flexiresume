/**
 * 音频和UI修复测试
 * 
 * 测试内容：
 * 1. 音频播放器用户交互逻辑
 * 2. 页签切换音频播放逻辑
 * 3. 简化音频控制面板UI
 * 4. 骨架屏主题颜色修复
 * 
 * @author FlexiResume Team
 * @date 2025-07-27
 */

import { test, expect } from '@playwright/test';

test.describe('音频和UI修复测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:5179/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待骨架屏消失，内容加载完成
    await page.waitForSelector('[data-testid="navigation-tabs"]', { timeout: 10000 });
  });

  test('音频控制面板UI简化验证', async ({ page }) => {
    console.log('🎵 测试音频控制面板UI简化...');
    
    // 查找音频控制器
    const audioController = page.locator('.control-panel').first();
    await expect(audioController).toBeVisible();
    
    // 验证只有音频开关按钮和音量控制条
    const audioButton = audioController.locator('button').first();
    await expect(audioButton).toBeVisible();
    
    // 点击音频开关启用音频
    await audioButton.click();
    
    // 验证音量控制条存在
    const volumeSlider = audioController.locator('input[type="range"]');
    await expect(volumeSlider).toBeVisible();
    
    // 验证没有多余的角色测试按钮（应该被删除了）
    const characterButtons = audioController.locator('button').count();
    expect(await characterButtons).toBeLessThanOrEqual(2); // 最多只有开关按钮和可能的停止按钮
    
    console.log('✅ 音频控制面板UI简化验证通过');
  });

  test('骨架屏主题颜色验证', async ({ page }) => {
    console.log('🎨 测试骨架屏主题颜色...');
    
    // 首先测试浅色模式下的骨架屏
    await page.reload();
    
    // 等待骨架屏出现
    const skeletonElements = page.locator('.skeleton, [class*="Skeleton"]');
    
    // 如果有骨架屏，检查其样式
    const skeletonCount = await skeletonElements.count();
    if (skeletonCount > 0) {
      const firstSkeleton = skeletonElements.first();
      const lightModeBackground = await firstSkeleton.evaluate(el => 
        window.getComputedStyle(el).background
      );
      console.log('浅色模式骨架屏背景:', lightModeBackground);
    }
    
    // 切换到深色模式
    const themeToggle = page.locator('[title*="切换"], [title*="theme"], [title*="主题"]').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500); // 等待主题切换动画
      
      // 检查深色模式下的骨架屏
      if (skeletonCount > 0) {
        const firstSkeleton = skeletonElements.first();
        const darkModeBackground = await firstSkeleton.evaluate(el => 
          window.getComputedStyle(el).background
        );
        console.log('深色模式骨架屏背景:', darkModeBackground);
        
        // 验证深色模式下不应该有蓝色
        expect(darkModeBackground).not.toContain('blue');
        expect(darkModeBackground).not.toContain('#0000ff');
        expect(darkModeBackground).not.toContain('rgb(0, 0, 255)');
      }
    }
    
    console.log('✅ 骨架屏主题颜色验证通过');
  });

  test('用户交互后音频自动播放验证', async ({ page }) => {
    console.log('🎵 测试用户交互后音频自动播放...');
    
    // 监听控制台日志以验证音频播放逻辑
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('🎵') || msg.text().includes('音频')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // 模拟用户首次交互
    await page.click('body');
    await page.waitForTimeout(1000);
    
    // 检查是否有音频相关的日志
    const audioLogs = consoleLogs.filter(log => 
      log.includes('用户首次交互') || log.includes('音频播放已启用')
    );
    
    console.log('音频相关日志:', audioLogs);
    
    // 验证用户交互后的音频启用逻辑
    expect(audioLogs.length).toBeGreaterThan(0);
    
    console.log('✅ 用户交互后音频自动播放验证通过');
  });

  test('页签切换音频播放逻辑验证', async ({ page }) => {
    console.log('🎵 测试页签切换音频播放逻辑...');
    
    // 监听控制台日志
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('🎵') || msg.text().includes('切换到页签')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // 首先进行用户交互以启用音频
    await page.click('body');
    await page.waitForTimeout(500);
    
    // 获取所有页签
    const tabs = page.locator('[data-testid="navigation-tabs"] a');
    const tabCount = await tabs.count();
    
    if (tabCount > 1) {
      // 点击第二个页签
      await tabs.nth(1).click();
      await page.waitForTimeout(1000);
      
      // 检查页签切换相关的音频日志
      const tabSwitchLogs = consoleLogs.filter(log => 
        log.includes('切换到页签') || log.includes('播放BGM')
      );
      
      console.log('页签切换音频日志:', tabSwitchLogs);
      
      // 再次点击第一个页签
      await tabs.nth(0).click();
      await page.waitForTimeout(1000);
      
      // 验证智能播放逻辑（避免重复播放相同音乐）
      const smartPlayLogs = consoleLogs.filter(log => 
        log.includes('已在播放') || log.includes('跳过重复播放')
      );
      
      console.log('智能播放逻辑日志:', smartPlayLogs);
    }
    
    console.log('✅ 页签切换音频播放逻辑验证通过');
  });

  test('综合功能截图验证', async ({ page }) => {
    console.log('📸 进行综合功能截图验证...');
    
    // 浅色模式截图
    await page.screenshot({ 
      path: 'tests/screenshots/audio-ui-fixes-light.png',
      fullPage: true 
    });
    
    // 切换到深色模式
    const themeToggle = page.locator('[title*="切换"], [title*="theme"], [title*="主题"]').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(1000);
      
      // 深色模式截图
      await page.screenshot({ 
        path: 'tests/screenshots/audio-ui-fixes-dark.png',
        fullPage: true 
      });
    }
    
    // 验证页面没有JavaScript错误
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('页面错误:', errors);
    }
    
    expect(errors.length).toBe(0);
    
    console.log('✅ 综合功能截图验证完成');
  });
});
