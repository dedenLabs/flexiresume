/**
 * 简化版简历特性展示视频录制
 * 避免tracing冲突，专注于视频录制
 * @author dedenlabs
 * @date 2025-08-04
 */

import { test, expect } from '@playwright/test';

test.describe('简历特性视频录制', () => {
  test('录制简历核心特性展示', async ({ page }) => {
    console.log('🎬 开始录制简历特性展示视频...');

    // 访问简历页面
    await page.goto('http://localhost:5175/', { timeout: 60000 });
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('📱 展示页面整体布局');
    
    // 滚动展示整个页面
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // 展示主题切换功能
    console.log('🎨 展示主题切换功能');
    try {
      const themeButton = page.locator('button').filter({ hasText: /主题|Theme|🌙|☀️/ }).first();
      if (await themeButton.isVisible({ timeout: 5000 })) {
        await themeButton.click();
        await page.waitForTimeout(2000);
        await themeButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.log('主题切换按钮未找到，跳过');
    }

    // 展示语言切换功能
    console.log('🌐 展示语言切换功能');
    try {
      const langButton = page.locator('button').filter({ hasText: /EN|中|ZH|语言|Language/ }).first();
      if (await langButton.isVisible({ timeout: 5000 })) {
        await langButton.click();
        await page.waitForTimeout(3000);
        
        // 切换回中文
        const zhButton = page.locator('button').filter({ hasText: /中|ZH/ }).first();
        if (await zhButton.isVisible({ timeout: 5000 })) {
          await zhButton.click();
          await page.waitForTimeout(3000);
        }
      }
    } catch (error) {
      console.log('语言切换按钮未找到，跳过');
    }

    // 展示标签页切换
    console.log('📑 展示标签页切换');
    try {
      const tabs = page.locator('[role="tab"], .tab, .nav-item').filter({ hasText: /.+/ });
      const tabCount = await tabs.count();
      
      for (let i = 0; i < Math.min(tabCount, 4); i++) {
        const tab = tabs.nth(i);
        if (await tab.isVisible({ timeout: 3000 })) {
          await tab.click();
          await page.waitForTimeout(2000);
          
          // 滚动展示内容
          await page.evaluate(() => {
            window.scrollTo({ top: 300, behavior: 'smooth' });
          });
          await page.waitForTimeout(1500);
        }
      }
    } catch (error) {
      console.log('标签页未找到，跳过');
    }

    // 展示响应式设计
    console.log('📱 展示响应式设计');
    
    // 切换到平板视图
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);
    
    // 滚动展示平板布局
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);
    
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // 切换到手机视图
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    // 滚动展示手机布局
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);
    
    await page.evaluate(() => {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // 恢复桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(2000);

    // 最终展示 - 完整页面浏览
    console.log('🎯 最终完整页面展示');
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // 慢速滚动展示整个页面
    await page.evaluate(() => {
      const scrollHeight = document.body.scrollHeight;
      let currentScroll = 0;
      const scrollStep = 150;
      const scrollInterval = setInterval(() => {
        currentScroll += scrollStep;
        window.scrollTo({ top: currentScroll, behavior: 'smooth' });
        if (currentScroll >= scrollHeight) {
          clearInterval(scrollInterval);
        }
      }, 300);
    });
    
    await page.waitForTimeout(10000);

    // 回到顶部
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(3000);

    console.log('✅ 视频录制完成！');

    // 验证页面功能正常
    await expect(page.locator('body')).toBeVisible();
    
    // 截取最终截图
    await page.screenshot({
      path: 'tests/screenshots/resume-features-showcase.png',
      fullPage: true
    });

    console.log('📸 截图已保存到 tests/screenshots/resume-features-showcase.png');
  });

  test('录制简历打印样式展示', async ({ page }) => {
    console.log('🖨️ 录制打印样式展示...');

    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');

    // 模拟打印样式
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(2000);

    // 截图保存打印样式
    await page.screenshot({
      path: 'tests/screenshots/resume-print-style.png',
      fullPage: true
    });

    // 恢复屏幕样式
    await page.emulateMedia({ media: 'screen' });
    await page.waitForTimeout(1000);

    console.log('✅ 打印样式展示录制完成！');
  });
});

test.describe('性能展示录制', () => {
  test('录制页面加载性能展示', async ({ page }) => {
    console.log('⚡ 开始性能展示录制...');

    const startTime = Date.now();
    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();

    console.log(`📊 页面加载时间: ${endTime - startTime}ms`);

    // 测试交互性能
    try {
      const themeButton = page.locator('button').filter({ hasText: /主题|Theme/ }).first();
      if (await themeButton.isVisible({ timeout: 5000 })) {
        const interactionStart = Date.now();
        await themeButton.click();
        await page.waitForTimeout(500);
        const interactionEnd = Date.now();
        console.log(`🎨 主题切换响应时间: ${interactionEnd - interactionStart}ms`);
      }
    } catch (error) {
      console.log('主题切换测试跳过');
    }

    await page.screenshot({
      path: 'tests/screenshots/performance-showcase.png',
      fullPage: true
    });

    console.log('✅ 性能展示录制完成！');
  });
});
