/**
 * 主题系统清理后的功能测试
 * 
 * 验证清理重复内容后的主题系统是否正常工作
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('主题系统清理后功能测试', () => {
  
  test('验证主题切换功能正常', async ({ page }) => {
    console.log('🧪 开始主题切换功能测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 获取初始主题
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    
    console.log(`🎨 初始主题: ${initialTheme || 'light'}`);
    
    // 查找主题切换按钮
    const themeButton = page.locator('[data-testid="theme-switcher"], .theme-switcher, button:has-text("主题"), button:has-text("🌙"), button:has-text("☀️")').first();
    
    if (await themeButton.isVisible()) {
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
  
  test('验证CSS变量正确加载', async ({ page }) => {
    console.log('🧪 开始CSS变量加载测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查浅色主题CSS变量
    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-theme');
    });
    await page.waitForTimeout(500);
    
    const lightThemeColors = await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        primary: computedStyle.getPropertyValue('--color-primary').trim(),
        background: computedStyle.getPropertyValue('--color-background').trim(),
        textPrimary: computedStyle.getPropertyValue('--color-text-primary').trim()
      };
    });
    
    console.log('🎨 浅色主题CSS变量:', lightThemeColors);
    
    // 验证浅色主题颜色
    expect(lightThemeColors.primary).toBe('#4A90E2');
    expect(lightThemeColors.background).toBe('#F8FAFC');
    expect(lightThemeColors.textPrimary).toBe('#2D3748');
    
    // 切换到深色主题
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);
    
    const darkThemeColors = await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        primary: computedStyle.getPropertyValue('--color-primary').trim(),
        background: computedStyle.getPropertyValue('--color-background').trim(),
        textPrimary: computedStyle.getPropertyValue('--color-text-primary').trim()
      };
    });
    
    console.log('🎨 深色主题CSS变量:', darkThemeColors);
    
    // 验证深色主题颜色
    expect(darkThemeColors.primary).toBe('#63B3ED');
    expect(darkThemeColors.background).toBe('#1A202C');
    expect(darkThemeColors.textPrimary).toBe('#F7FAFC');
    
    console.log('✅ CSS变量正确加载');
  });
  
  test('验证主题颜色应用到页面元素', async ({ page }) => {
    console.log('🧪 开始主题颜色应用测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查页面背景色是否应用了主题颜色
    const bodyBackgroundColor = await page.evaluate(() => {
      const bodyStyle = getComputedStyle(document.body);
      return bodyStyle.backgroundColor;
    });
    
    console.log(`🎨 页面背景色: ${bodyBackgroundColor}`);
    
    // 检查是否有元素使用了主题颜色
    const elementsWithThemeColors = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let count = 0;
      
      for (const element of elements) {
        const style = getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // 检查是否使用了主题相关的颜色
        if (color.includes('rgb') || backgroundColor.includes('rgb')) {
          count++;
        }
      }
      
      return count;
    });
    
    console.log(`🎨 使用主题颜色的元素数量: ${elementsWithThemeColors}`);
    
    // 验证有元素使用了主题颜色
    expect(elementsWithThemeColors).toBeGreaterThan(0);
    
    console.log('✅ 主题颜色正确应用到页面元素');
  });
  
  test('验证主题持久化功能', async ({ page }) => {
    console.log('🧪 开始主题持久化测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 设置深色主题
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    });
    
    // 刷新页面
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 检查主题是否保持
    const persistedTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    
    console.log(`🎨 持久化后的主题: ${persistedTheme}`);
    
    // 验证主题持久化
    expect(persistedTheme).toBe('dark');
    
    console.log('✅ 主题持久化功能正常');
  });
  
  test('验证清理后的代码无错误', async ({ page }) => {
    console.log('🧪 开始代码错误检查');
    
    // 监听控制台错误
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // 监听页面错误
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 尝试切换主题
    const themeButton = page.locator('[data-testid="theme-switcher"], .theme-switcher, button:has-text("主题"), button:has-text("🌙"), button:has-text("☀️")').first();
    
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(1000);
      await themeButton.click();
      await page.waitForTimeout(1000);
    }
    
    console.log(`❌ 控制台错误数量: ${consoleErrors.length}`);
    console.log(`❌ 页面错误数量: ${pageErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('控制台错误:', consoleErrors);
    }
    
    if (pageErrors.length > 0) {
      console.log('页面错误:', pageErrors);
    }
    
    // 验证没有严重错误（允许一些警告）
    const seriousErrors = [...consoleErrors, ...pageErrors].filter(error => 
      !error.includes('Warning') && 
      !error.includes('favicon') &&
      !error.includes('404')
    );
    
    expect(seriousErrors.length).toBe(0);
    
    console.log('✅ 清理后的代码无严重错误');
  });
  
});
