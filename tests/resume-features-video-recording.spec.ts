/**
 * 简历特性展示视频录制脚本
 * 录制高清视频展示FlexiResume的核心特性
 * @author dedenlabs
 * @date 2025-08-04
 */

import { test, expect } from '@playwright/test';

test.describe('FlexiResume特性展示视频录制', () => {
  test('录制简历核心特性展示视频', async ({ page }) => {
    // 设置视频录制
    const context = page.context();
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true
    });

    // 访问简历页面
    await page.goto('http://localhost:5175/');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('🎬 开始录制简历特性展示视频...');

    // 1. 展示页面整体布局
    console.log('📱 展示页面整体布局');
    await page.waitForTimeout(2000);
    
    // 滚动展示整个页面
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // 2. 展示主题切换功能
    console.log('🎨 展示主题切换功能');
    const themeButton = page.locator('[data-testid="theme-switcher"], .theme-switcher, button:has-text("主题")').first();
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(1500);
      
      // 切换回原主题
      await themeButton.click();
      await page.waitForTimeout(1500);
    }

    // 3. 展示语言切换功能
    console.log('🌐 展示语言切换功能');
    const langButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("EN"), button:has-text("中")').first();
    if (await langButton.isVisible()) {
      await langButton.click();
      await page.waitForTimeout(2000);
      
      // 切换回中文
      const zhButton = page.locator('button:has-text("中"), button:has-text("ZH")').first();
      if (await zhButton.isVisible()) {
        await zhButton.click();
        await page.waitForTimeout(2000);
      }
    }

    // 4. 展示控制面板功能
    console.log('⚙️ 展示控制面板功能');
    const controlButton = page.locator('[data-testid="control-panel"], .control-panel-toggle, button[title*="控制"], button[title*="设置"]').first();
    if (await controlButton.isVisible()) {
      await controlButton.click();
      await page.waitForTimeout(2000);
      
      // 关闭控制面板
      await controlButton.click();
      await page.waitForTimeout(1000);
    }

    // 5. 展示PDF导出功能
    console.log('📄 展示PDF导出功能');
    const pdfButton = page.locator('[data-testid="pdf-download"], .pdf-download, button:has-text("PDF"), button:has-text("导出")').first();
    if (await pdfButton.isVisible()) {
      await pdfButton.hover();
      await page.waitForTimeout(1500);
    }

    // 6. 展示音频控制功能
    console.log('🎵 展示音频控制功能');
    const audioButton = page.locator('[data-testid="audio-controller"], .audio-controller, button[title*="音频"], button[title*="音乐"]').first();
    if (await audioButton.isVisible()) {
      await audioButton.click();
      await page.waitForTimeout(2000);
      
      // 关闭音频
      await audioButton.click();
      await page.waitForTimeout(1000);
    }

    // 7. 展示字体切换功能
    console.log('🔤 展示字体切换功能');
    const fontButton = page.locator('[data-testid="font-switcher"], .font-switcher, button:has-text("字体")').first();
    if (await fontButton.isVisible()) {
      await fontButton.click();
      await page.waitForTimeout(1500);
      
      // 选择不同字体
      const fontOption = page.locator('.font-option, [data-font]').first();
      if (await fontOption.isVisible()) {
        await fontOption.click();
        await page.waitForTimeout(2000);
      }
    }

    // 8. 展示标签页切换
    console.log('📑 展示标签页切换');
    const tabs = page.locator('.tab, [role="tab"], .nav-item');
    const tabCount = await tabs.count();
    
    for (let i = 0; i < Math.min(tabCount, 4); i++) {
      const tab = tabs.nth(i);
      if (await tab.isVisible()) {
        await tab.click();
        await page.waitForTimeout(1500);
        
        // 滚动展示内容
        await page.evaluate(() => {
          window.scrollTo({ top: 200, behavior: 'smooth' });
        });
        await page.waitForTimeout(1000);
      }
    }

    // 9. 展示图片查看功能
    console.log('🖼️ 展示图片查看功能');
    const images = page.locator('img[src*="avatar"], .avatar img, .profile-image');
    if (await images.first().isVisible()) {
      await images.first().click();
      await page.waitForTimeout(2000);
      
      // 关闭图片查看器
      const closeButton = page.locator('.close, [aria-label="关闭"], .modal-close').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      } else {
        // 点击背景关闭
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      }
    }

    // 10. 展示响应式设计
    console.log('📱 展示响应式设计');
    
    // 切换到平板视图
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);
    
    // 滚动展示平板布局
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    // 切换到手机视图
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    // 滚动展示手机布局
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    // 恢复桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(2000);

    // 11. 最终展示 - 完整页面浏览
    console.log('🎯 最终完整页面展示');
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // 慢速滚动展示整个页面
    await page.evaluate(() => {
      const scrollHeight = document.body.scrollHeight;
      let currentScroll = 0;
      const scrollStep = 100;
      const scrollInterval = setInterval(() => {
        currentScroll += scrollStep;
        window.scrollTo({ top: currentScroll, behavior: 'smooth' });
        if (currentScroll >= scrollHeight) {
          clearInterval(scrollInterval);
        }
      }, 200);
    });
    
    await page.waitForTimeout(8000);

    // 回到顶部
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    console.log('✅ 视频录制完成！');

    // 停止录制并保存
    await context.tracing.stop({
      path: 'tests/videos/resume-features-showcase.zip'
    });

    // 验证页面功能正常
    await expect(page.locator('body')).toBeVisible();
    
    // 截取最终截图
    await page.screenshot({
      path: 'tests/screenshots/resume-features-final.png',
      fullPage: true
    });

    console.log('📸 截图已保存到 tests/screenshots/resume-features-final.png');
    console.log('🎬 录制文件已保存到 tests/videos/resume-features-showcase.zip');
  });

  test('录制简历打印预览功能', async ({ page }) => {
    await page.goto('http://localhost:5175/');
    await page.waitForLoadState('networkidle');

    console.log('🖨️ 录制打印预览功能...');

    // 触发打印预览
    await page.keyboard.press('Control+P');
    await page.waitForTimeout(3000);

    // 取消打印对话框
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // 截图保存
    await page.screenshot({
      path: 'tests/screenshots/resume-print-preview.png',
      fullPage: true
    });

    console.log('✅ 打印预览录制完成！');
  });
});

test.describe('性能测试录制', () => {
  test('录制页面加载性能', async ({ page }) => {
    console.log('⚡ 开始性能测试录制...');

    // 开始性能监控
    await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });

    // 测量加载时间
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });

    console.log(`📊 页面加载时间: ${loadTime}ms`);

    // 测试交互性能
    const themeButton = page.locator('[data-testid="theme-switcher"], .theme-switcher').first();
    if (await themeButton.isVisible()) {
      const startTime = Date.now();
      await themeButton.click();
      await page.waitForTimeout(500);
      const endTime = Date.now();
      console.log(`🎨 主题切换响应时间: ${endTime - startTime}ms`);
    }

    await page.screenshot({
      path: 'tests/screenshots/performance-test.png'
    });

    console.log('✅ 性能测试录制完成！');
  });
});
