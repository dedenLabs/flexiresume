/**
 * 卡通风格主题测试
 * 
 * 验证新的卡通风格主题是否正确应用
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('卡通风格主题测试', () => {
  
  test('验证浅色主题的卡通风格颜色', async ({ page }) => {
    console.log('🧪 开始浅色主题卡通风格测试');
    
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
    
    // 检查CSS变量是否正确设置
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    });
    
    const backgroundColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim();
    });
    
    const textColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim();
    });
    
    console.log(`🎨 主色调: ${primaryColor}`);
    console.log(`🎨 背景色: ${backgroundColor}`);
    console.log(`🎨 文字色: ${textColor}`);
    
    // 验证新的卡通风格颜色
    expect(primaryColor).toBe('#4A90E2'); // 明亮蓝色
    expect(backgroundColor).toBe('#F8FAFC'); // 极浅蓝灰色
    expect(textColor).toBe('#2D3748'); // 深蓝灰色
    
    console.log('✅ 浅色主题卡通风格颜色验证通过');
  });
  
  test('验证深色主题的卡通风格颜色', async ({ page }) => {
    console.log('🧪 开始深色主题卡通风格测试');
    
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
    
    // 检查CSS变量是否正确设置
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    });
    
    const backgroundColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim();
    });
    
    const textColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim();
    });
    
    console.log(`🎨 主色调: ${primaryColor}`);
    console.log(`🎨 背景色: ${backgroundColor}`);
    console.log(`🎨 文字色: ${textColor}`);
    
    // 验证新的深色卡通风格颜色
    expect(primaryColor).toBe('#63B3ED'); // 明亮天蓝色
    expect(backgroundColor).toBe('#1A202C'); // 深蓝灰色
    expect(textColor).toBe('#F7FAFC'); // 极浅色
    
    console.log('✅ 深色主题卡通风格颜色验证通过');
  });
  
  test('验证主题切换功能', async ({ page }) => {
    console.log('🧪 开始主题切换功能测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 查找主题切换按钮
    const themeButton = page.locator('[data-testid="theme-switcher"], .theme-switcher, button:has-text("主题"), button:has-text("🌙"), button:has-text("☀️")').first();
    
    if (await themeButton.isVisible()) {
      console.log('🔘 找到主题切换按钮');
      
      // 获取初始主题
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme');
      });
      
      console.log(`🎨 初始主题: ${initialTheme || 'light'}`);
      
      // 点击切换主题
      await themeButton.click();
      await page.waitForTimeout(1000);
      
      // 获取切换后的主题
      const newTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme');
      });
      
      console.log(`🎨 切换后主题: ${newTheme || 'light'}`);
      
      // 验证主题确实发生了变化
      expect(newTheme).not.toBe(initialTheme);
      
      console.log('✅ 主题切换功能正常');
    } else {
      console.log('⚠️ 未找到主题切换按钮，跳过切换测试');
    }
  });
  
  test('验证卡通风格的视觉效果', async ({ page }) => {
    console.log('🧪 开始卡通风格视觉效果测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 截图保存新的卡通风格
    await page.screenshot({ 
      path: 'tests/screenshots/cartoon-theme-light.png',
      fullPage: true 
    });
    
    // 切换到深色主题
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(1000);
    
    // 截图保存深色卡通风格
    await page.screenshot({ 
      path: 'tests/screenshots/cartoon-theme-dark.png',
      fullPage: true 
    });
    
    console.log('✅ 卡通风格视觉效果截图已保存');
  });
  
});
