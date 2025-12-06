/**
 * 渐变遮罩修复验证测试
 * 
 * 验证页面顶部的渐变遮罩已被正确移除
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('渐变遮罩修复验证', () => {
  
  test('桌面端不应该显示导航栏渐变遮罩', async ({ page }) => {
    // 设置桌面端尺寸
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 截图记录修复后的状态
    await page.screenshot({ 
      path: 'tests/screenshots/gradient-mask-fix-desktop.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 300 }
    });
    
    // 检查导航栏的::after伪元素是否被隐藏
    const navGradientVisible = await page.evaluate(() => {
      const navElement = document.querySelector('[data-testid="navigation-tabs"]');
      if (!navElement) return false;
      
      const afterStyle = window.getComputedStyle(navElement, '::after');
      const display = afterStyle.display;
      const content = afterStyle.content;
      
      console.log('导航栏::after样式:', { display, content });
      
      // 检查是否被隐藏
      return display !== 'none' && content !== 'none' && content !== '""';
    });
    
    // 桌面端不应该显示渐变遮罩
    expect(navGradientVisible).toBe(false);
    
    console.log('✅ 桌面端导航栏渐变遮罩已正确隐藏');
  });

  test('移动端也不应该显示导航栏渐变遮罩（已完全移除）', async ({ page }) => {
    // 设置移动端尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 截图记录移动端状态
    await page.screenshot({ 
      path: 'tests/screenshots/gradient-mask-fix-mobile.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 300 }
    });
    
    // 检查导航栏的::after伪元素是否显示
    const navGradientVisible = await page.evaluate(() => {
      const navElement = document.querySelector('[data-testid="navigation-tabs"]');
      if (!navElement) return false;
      
      const afterStyle = window.getComputedStyle(navElement, '::after');
      const display = afterStyle.display;
      const content = afterStyle.content;
      const background = afterStyle.background;
      
      console.log('移动端导航栏::after样式:', { display, content, background });
      
      // 检查是否被隐藏
      return display !== 'none' && content !== 'none' && content !== '""';
    });

    // 移动端也不应该显示渐变遮罩（已完全移除）
    expect(navGradientVisible).toBe(false);

    console.log('✅ 移动端导航栏渐变遮罩已正确隐藏');
  });

  test('检查页面顶部是否还有其他渐变遮罩', async ({ page }) => {
    // 设置桌面端尺寸
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查页面顶部200px内是否还有其他渐变元素
    const topGradientElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const gradientElements = [];
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        
        // 检查页面顶部200px内的元素
        if (rect.top >= 0 && rect.top <= 200) {
          // 检查是否有渐变背景
          if (style.background.includes('gradient') || style.backgroundImage.includes('gradient')) {
            gradientElements.push({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              background: style.background,
              position: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
              }
            });
          }
          
          // 检查伪元素
          const beforeStyle = window.getComputedStyle(el, '::before');
          const afterStyle = window.getComputedStyle(el, '::after');
          
          if (beforeStyle.background.includes('gradient') && beforeStyle.display !== 'none') {
            gradientElements.push({
              tagName: el.tagName + '::before',
              className: el.className,
              background: beforeStyle.background,
              position: rect
            });
          }
          
          if (afterStyle.background.includes('gradient') && afterStyle.display !== 'none') {
            gradientElements.push({
              tagName: el.tagName + '::after',
              className: el.className,
              background: afterStyle.background,
              position: rect
            });
          }
        }
      });
      
      return gradientElements;
    });
    
    console.log('页面顶部发现的渐变元素:', topGradientElements);
    
    // 过滤掉合理的渐变元素（如技能标签的渐变文字等）
    const suspiciousGradients = topGradientElements.filter(el => 
      // 排除技能相关的渐变
      !el.className.includes('skill') &&
      // 排除按钮的渐变效果
      !el.tagName.includes('BUTTON') &&
      // 排除小尺寸的装饰性渐变
      el.position.width > 100 && el.position.height > 10
    );
    
    if (suspiciousGradients.length > 0) {
      console.log('⚠️ 发现可疑的渐变遮罩:', suspiciousGradients);
    } else {
      console.log('✅ 未发现可疑的渐变遮罩');
    }
    
    // 页面顶部不应该有大面积的渐变遮罩
    expect(suspiciousGradients.length).toBe(0);
    
    console.log('✅ 页面顶部渐变检查完成');
  });

  test('验证不同页面的渐变遮罩修复', async ({ page }) => {
    const testPages = ['/', '/game', '/fullstack', '/frontend'];
    
    // 设置桌面端尺寸
    await page.setViewportSize({ width: 1280, height: 720 });
    
    for (const pagePath of testPages) {
      console.log(`检查页面: ${pagePath}`);
      
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
      
      // 截图记录
      await page.screenshot({ 
        path: `tests/screenshots/gradient-fix-${pagePath.replace('/', 'home')}.png`,
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 200 }
      });
      
      // 检查导航栏渐变是否被隐藏
      const navGradientHidden = await page.evaluate(() => {
        const navElement = document.querySelector('[data-testid="navigation-tabs"]');
        if (!navElement) return true; // 如果没有导航栏，认为是隐藏的
        
        const afterStyle = window.getComputedStyle(navElement, '::after');
        return afterStyle.display === 'none' || afterStyle.content === 'none';
      });
      
      expect(navGradientHidden).toBe(true);
      console.log(`  ✅ 页面 ${pagePath} 导航栏渐变已隐藏`);
    }
    
    console.log('✅ 所有页面的渐变遮罩修复验证完成');
  });

  test('验证深色模式下的渐变遮罩修复', async ({ page }) => {
    // 设置桌面端尺寸
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 切换到深色模式
    const themeSwitcher = page.locator('[data-theme-switcher]');
    if (await themeSwitcher.isVisible()) {
      await themeSwitcher.click();
      await page.waitForTimeout(500); // 等待主题切换完成
    }
    
    // 截图记录深色模式状态
    await page.screenshot({ 
      path: 'tests/screenshots/gradient-fix-dark-mode.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 300 }
    });
    
    // 检查深色模式下导航栏渐变是否仍然被隐藏
    const navGradientHidden = await page.evaluate(() => {
      const navElement = document.querySelector('[data-testid="navigation-tabs"]');
      if (!navElement) return true;
      
      const afterStyle = window.getComputedStyle(navElement, '::after');
      return afterStyle.display === 'none' || afterStyle.content === 'none';
    });
    
    expect(navGradientHidden).toBe(true);
    
    console.log('✅ 深色模式下导航栏渐变遮罩修复正常');
  });

});
