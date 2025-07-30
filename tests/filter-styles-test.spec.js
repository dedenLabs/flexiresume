/**
 * 滤镜样式测试
 * 
 * 验证新的卡通风格主题下的滤镜效果
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('滤镜样式测试', () => {
  
  test('验证浅色主题背景滤镜效果', async ({ page }) => {
    console.log('🧪 开始浅色主题背景滤镜测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 确保是浅色主题
    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 检查背景伪元素的滤镜
    const backgroundFilter = await page.evaluate(() => {
      const bodyBefore = getComputedStyle(document.body, '::before');
      return bodyBefore.filter;
    });
    
    console.log(`🎨 浅色主题背景滤镜: ${backgroundFilter}`);
    
    // 验证新的卡通风格滤镜（蓝色调）
    expect(backgroundFilter).toContain('sepia(0.2)');
    expect(backgroundFilter).toContain('hue-rotate(200deg)');
    expect(backgroundFilter).toContain('saturate(1.2)');
    expect(backgroundFilter).toContain('brightness(1.1)');
    
    console.log('✅ 浅色主题背景滤镜验证通过');
  });
  
  test('验证深色主题背景滤镜效果', async ({ page }) => {
    console.log('🧪 开始深色主题背景滤镜测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 切换到深色主题
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 检查深色主题背景伪元素的滤镜
    const backgroundFilter = await page.evaluate(() => {
      const bodyBefore = getComputedStyle(document.body, '::before');
      return bodyBefore.filter;
    });
    
    console.log(`🎨 深色主题背景滤镜: ${backgroundFilter}`);
    
    // 验证新的深色卡通风格滤镜
    expect(backgroundFilter).toContain('invert(1)');
    expect(backgroundFilter).toContain('hue-rotate(220deg)');
    expect(backgroundFilter).toContain('saturate(0.8)');
    expect(backgroundFilter).toContain('brightness(0.7)');
    expect(backgroundFilter).toContain('contrast(1.1)');
    
    console.log('✅ 深色主题背景滤镜验证通过');
  });
  
  test('验证链接图标滤镜效果', async ({ page }) => {
    console.log('🧪 开始链接图标滤镜测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 查找链接元素
    const linkElements = await page.locator('a:not(.no-link-icon)').all();
    
    if (linkElements.length > 0) {
      console.log(`🔗 找到 ${linkElements.length} 个链接元素`);
      
      // 检查第一个链接的伪元素滤镜
      const linkFilter = await page.evaluate(() => {
        const firstLink = document.querySelector('a:not(.no-link-icon)');
        if (firstLink) {
          const linkBefore = getComputedStyle(firstLink, '::before');
          return linkBefore.filter;
        }
        return null;
      });
      
      if (linkFilter) {
        console.log(`🎨 链接图标滤镜: ${linkFilter}`);
        
        // 验证新的卡通风格链接图标滤镜
        expect(linkFilter).toContain('brightness(0)');
        expect(linkFilter).toContain('saturate(100%)');
        expect(linkFilter).toContain('hue-rotate(200deg)');
        
        console.log('✅ 链接图标滤镜验证通过');
      } else {
        console.log('⚠️ 未找到链接图标滤镜');
      }
    } else {
      console.log('⚠️ 未找到链接元素');
    }
  });
  
  test('验证SVG图标滤镜效果', async ({ page }) => {
    console.log('🧪 开始SVG图标滤镜测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 查找SVG图标元素
    const svgElements = await page.locator('svg, img[src$=".svg"]').all();
    
    if (svgElements.length > 0) {
      console.log(`🖼️ 找到 ${svgElements.length} 个SVG元素`);
      
      // 检查第一个SVG元素的滤镜
      const svgFilter = await page.evaluate(() => {
        const firstSvg = document.querySelector('svg, img[src$=".svg"]');
        if (firstSvg) {
          const computedStyle = getComputedStyle(firstSvg);
          return computedStyle.filter;
        }
        return null;
      });
      
      if (svgFilter && svgFilter !== 'none') {
        console.log(`🎨 SVG图标滤镜: ${svgFilter}`);
        
        // 验证SVG滤镜包含新的色调
        expect(svgFilter).toContain('brightness(0)');
        expect(svgFilter).toContain('saturate(100%)');
        
        console.log('✅ SVG图标滤镜验证通过');
      } else {
        console.log('⚠️ SVG元素未应用滤镜或滤镜为none');
      }
    } else {
      console.log('⚠️ 未找到SVG元素');
    }
  });
  
  test('验证滤镜效果的视觉对比', async ({ page }) => {
    console.log('🧪 开始滤镜效果视觉对比测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 截图保存浅色主题的滤镜效果
    await page.screenshot({ 
      path: 'tests/screenshots/filter-light-theme.png',
      fullPage: true 
    });
    
    // 切换到深色主题
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(1000);
    
    // 截图保存深色主题的滤镜效果
    await page.screenshot({ 
      path: 'tests/screenshots/filter-dark-theme.png',
      fullPage: true 
    });
    
    console.log('✅ 滤镜效果视觉对比截图已保存');
  });
  
});
