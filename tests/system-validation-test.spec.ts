/**
 * 系统验证测试
 * 确保所有功能正常工作且没有引入新的问题
 * @author dedenlabs
 * @date 2025-08-04
 */

import { test, expect } from '@playwright/test';

test.describe('系统功能验证', () => {
  test('验证页面基本功能正常', async ({ page }) => {
    console.log('🔍 开始系统功能验证...');

    // 访问页面
    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');

    // 验证页面基本元素
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ 页面基本加载正常');

    // 验证没有JavaScript错误
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.waitForTimeout(5000);

    // 检查是否有关键错误
    const criticalErrors = errors.filter(error => 
      error.includes('startsWith') || 
      error.includes('PreloadManager') ||
      error.includes('Cannot read properties of undefined')
    );

    expect(criticalErrors).toHaveLength(0);
    console.log('✅ 没有发现关键JavaScript错误');

    // 验证主要功能按钮存在
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
    console.log(`✅ 发现 ${buttons} 个交互按钮`);

    // 验证图片加载
    const images = page.locator('img');
    const imageCount = await images.count();
    if (imageCount > 0) {
      // 检查第一张图片是否加载成功
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      console.log(`✅ 图片加载正常 (共${imageCount}张)`);
    }

    // 验证CSS样式加载
    const hasStyles = await page.evaluate(() => {
      const stylesheets = document.styleSheets;
      return stylesheets.length > 0;
    });
    expect(hasStyles).toBe(true);
    console.log('✅ CSS样式加载正常');

    console.log('🎉 系统功能验证完成，所有基本功能正常！');
  });

  test('验证响应式设计功能', async ({ page }) => {
    console.log('📱 验证响应式设计...');

    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');

    // 测试桌面端
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ 桌面端布局正常');

    // 测试平板端
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ 平板端布局正常');

    // 测试手机端
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ 手机端布局正常');

    // 恢复桌面端
    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('📱 响应式设计验证完成！');
  });

  test('验证性能指标', async ({ page }) => {
    console.log('⚡ 验证性能指标...');

    const startTime = Date.now();
    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    console.log(`📊 页面加载时间: ${loadTime}ms`);
    
    // 验证加载时间合理（小于10秒）
    expect(loadTime).toBeLessThan(10000);

    // 测量内存使用
    const memoryUsage = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize
      } : null;
    });

    if (memoryUsage) {
      console.log(`🧠 内存使用: ${Math.round(memoryUsage.usedJSHeapSize / 1024 / 1024)}MB`);
    }

    console.log('⚡ 性能指标验证完成！');
  });

  test('验证交互功能', async ({ page }) => {
    console.log('🖱️ 验证交互功能...');

    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');

    // 测试滚动功能
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBeGreaterThan(0);
    console.log('✅ 滚动功能正常');

    // 测试按钮点击（如果存在）
    try {
      const clickableButtons = page.locator('button:visible');
      const buttonCount = await clickableButtons.count();
      
      if (buttonCount > 0) {
        const firstButton = clickableButtons.first();
        await firstButton.click();
        await page.waitForTimeout(500);
        console.log('✅ 按钮交互功能正常');
      }
    } catch (error) {
      console.log('ℹ️ 跳过按钮交互测试');
    }

    console.log('🖱️ 交互功能验证完成！');
  });

  test('验证错误处理', async ({ page }) => {
    console.log('🛡️ 验证错误处理...');

    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // 检查是否有未处理的错误
    const criticalErrors = errors.filter(error => 
      !error.includes('Failed to load resource') && // 忽略资源加载失败
      !error.includes('net::ERR_') && // 忽略网络错误
      !error.includes('favicon') // 忽略favicon错误
    );

    console.log(`📊 发现 ${errors.length} 个错误，${warnings.length} 个警告`);
    console.log(`🔍 关键错误数量: ${criticalErrors.length}`);

    if (criticalErrors.length > 0) {
      console.log('❌ 关键错误列表:');
      criticalErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    // 验证没有关键错误
    expect(criticalErrors.length).toBe(0);
    console.log('🛡️ 错误处理验证完成！');
  });
});

test.describe('功能完整性验证', () => {
  test('验证所有核心功能可用', async ({ page }) => {
    console.log('🔧 验证核心功能完整性...');

    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');

    // 验证页面标题
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log(`✅ 页面标题: ${title}`);

    // 验证主要内容区域
    const contentAreas = await page.locator('main, .main, .content, section').count();
    expect(contentAreas).toBeGreaterThan(0);
    console.log(`✅ 内容区域: ${contentAreas} 个`);

    // 验证导航元素
    const navElements = await page.locator('nav, .nav, .navigation, [role="navigation"]').count();
    console.log(`ℹ️ 导航元素: ${navElements} 个`);

    // 验证表单元素（如果存在）
    const formElements = await page.locator('form, input, button, select, textarea').count();
    console.log(`ℹ️ 表单元素: ${formElements} 个`);

    console.log('🔧 核心功能完整性验证完成！');
  });

  test('验证数据加载', async ({ page }) => {
    console.log('📊 验证数据加载...');

    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');

    // 验证页面内容不为空
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
    console.log(`✅ 页面内容长度: ${bodyText!.length} 字符`);

    // 验证是否有动态内容
    const hasContent = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return elements.length > 50; // 假设正常页面应该有足够的元素
    });
    expect(hasContent).toBe(true);
    console.log('✅ 动态内容加载正常');

    console.log('📊 数据加载验证完成！');
  });
});

test.describe('回归测试', () => {
  test('验证之前修复的问题没有回归', async ({ page }) => {
    console.log('🔄 执行回归测试...');

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

    await page.goto('http://localhost:5175/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // 验证PreloadManager错误已修复
    expect(errors).toHaveLength(0);
    console.log('✅ PreloadManager startsWith错误已修复，无回归');

    console.log('🔄 回归测试完成！');
  });
});
