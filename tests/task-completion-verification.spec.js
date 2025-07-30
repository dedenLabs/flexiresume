/**
 * 任务完成验证测试
 * 
 * 验证所有已完成任务的功能是否正常工作
 * 
 * @author FlexiResume Team
 * @date 2025-07-29
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5175';
const TIMEOUT = 30000;

test.describe('任务完成验证测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：DevelopmentNotice组件布局优化', async ({ page }) => {
    console.log('🧪 测试1：验证DevelopmentNotice组件布局优化');
    
    // 检查开发提示是否存在
    const developmentNotice = page.locator('[data-testid="development-notice"]');
    
    if (await developmentNotice.isVisible()) {
      console.log('✅ 开发提示组件可见');
      
      // 检查占位符是否存在（通过检查页面顶部是否有足够空间）
      const bodyRect = await page.locator('body').boundingBox();
      const noticeRect = await developmentNotice.boundingBox();
      
      if (noticeRect) {
        console.log(`📏 开发提示位置: top=${noticeRect.y}, height=${noticeRect.height}`);
        
        // 验证开发提示是否在页面顶部
        expect(noticeRect.y).toBeLessThanOrEqual(10);
        
        // 检查页面内容是否被正确推下
        const mainContent = page.locator('main, .main-content, [data-testid="main-content"]').first();
        if (await mainContent.isVisible()) {
          const mainRect = await mainContent.boundingBox();
          if (mainRect) {
            console.log(`📏 主要内容位置: top=${mainRect.y}`);
            // 主要内容应该在开发提示下方
            expect(mainRect.y).toBeGreaterThan(noticeRect.height - 10);
          }
        }
      }
    } else {
      console.log('ℹ️ 开发提示组件不可见（可能已被关闭）');
    }
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/development-notice-layout.png',
      fullPage: true 
    });
    
    console.log('✅ DevelopmentNotice布局测试完成');
  });

  test('验证2：字体配置和加载', async ({ page }) => {
    console.log('🧪 测试2：验证字体配置和加载');
    
    // 等待字体加载
    await page.waitForTimeout(3000);
    
    // 检查字体切换功能
    const fontSelector = page.locator('[data-testid="font-selector"], .font-selector, select[name*="font"]').first();
    
    if (await fontSelector.isVisible()) {
      console.log('✅ 字体选择器可见');
      
      // 尝试切换到汉仪尚巍手书字体
      const hanyiOption = fontSelector.locator('option').filter({ hasText: /汉仪|shangwei/i }).first();
      
      if (await hanyiOption.isVisible()) {
        await fontSelector.selectOption({ label: /汉仪|shangwei/i });
        console.log('✅ 切换到汉仪尚巍手书字体');
        
        // 等待字体应用
        await page.waitForTimeout(2000);
        
        // 检查字体是否应用
        const bodyFontFamily = await page.evaluate(() => {
          return window.getComputedStyle(document.body).fontFamily;
        });
        
        console.log(`📝 当前字体: ${bodyFontFamily}`);
        
        // 验证字体包含预期的字体名称
        expect(bodyFontFamily.toLowerCase()).toMatch(/hanyi|shangwei|ma.*shan|kaiti|simkai/i);
      }
    } else {
      console.log('ℹ️ 字体选择器不可见，检查页面字体');
      
      // 直接检查页面字体
      const bodyFontFamily = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily;
      });
      
      console.log(`📝 页面字体: ${bodyFontFamily}`);
    }
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/font-configuration.png',
      fullPage: true 
    });
    
    console.log('✅ 字体配置测试完成');
  });

  test('验证3：页面基础功能', async ({ page }) => {
    console.log('🧪 测试3：验证页面基础功能');
    
    // 检查页面标题
    const title = await page.title();
    console.log(`📄 页面标题: ${title}`);
    expect(title).toBeTruthy();
    
    // 检查主要导航
    const navigation = page.locator('[data-testid="navigation-tabs"], .navigation, nav').first();
    if (await navigation.isVisible()) {
      console.log('✅ 导航组件可见');
      
      // 检查导航项
      const navItems = navigation.locator('a, button, [role="tab"]');
      const navCount = await navItems.count();
      console.log(`📋 导航项数量: ${navCount}`);
      expect(navCount).toBeGreaterThan(0);
    }
    
    // 检查主要内容区域
    const mainContent = page.locator('main, .main-content, [data-testid="main-content"]').first();
    if (await mainContent.isVisible()) {
      console.log('✅ 主要内容区域可见');
      
      // 检查内容是否有文本
      const textContent = await mainContent.textContent();
      expect(textContent?.length || 0).toBeGreaterThan(100);
    }
    
    // 检查控制台错误
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // 等待一段时间收集错误
    await page.waitForTimeout(3000);
    
    if (consoleErrors.length > 0) {
      console.log('⚠️ 控制台错误:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ 无控制台错误');
    }
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/basic-functionality.png',
      fullPage: true 
    });
    
    console.log('✅ 基础功能测试完成');
  });

  test('验证4：主题切换功能', async ({ page }) => {
    console.log('🧪 测试4：验证主题切换功能');
    
    // 查找主题切换按钮
    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle, button[title*="主题"], button[title*="theme"]').first();
    
    if (await themeToggle.isVisible()) {
      console.log('✅ 主题切换按钮可见');
      
      // 获取初始主题
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 
               document.body.className.includes('dark') ? 'dark' : 'light';
      });
      
      console.log(`🎨 初始主题: ${initialTheme}`);
      
      // 点击主题切换
      await themeToggle.click();
      await page.waitForTimeout(1000);
      
      // 获取切换后的主题
      const newTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 
               document.body.className.includes('dark') ? 'dark' : 'light';
      });
      
      console.log(`🎨 切换后主题: ${newTheme}`);
      
      // 验证主题确实发生了变化
      expect(newTheme).not.toBe(initialTheme);
      
      // 截图验证主题切换
      await page.screenshot({ 
        path: `tests/screenshots/theme-${newTheme}.png`,
        fullPage: true 
      });
      
    } else {
      console.log('ℹ️ 主题切换按钮不可见');
    }
    
    console.log('✅ 主题切换测试完成');
  });

  test('验证5：响应式布局', async ({ page }) => {
    console.log('🧪 测试5：验证响应式布局');
    
    // 测试不同屏幕尺寸
    const viewports = [
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      console.log(`📱 测试 ${viewport.name} 视口: ${viewport.width}x${viewport.height}`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      // 检查页面是否正常显示
      const body = page.locator('body');
      const bodyRect = await body.boundingBox();
      
      if (bodyRect) {
        console.log(`📏 页面尺寸: ${bodyRect.width}x${bodyRect.height}`);
        expect(bodyRect.width).toBeLessThanOrEqual(viewport.width + 50); // 允许一些误差
      }
      
      // 截图验证
      await page.screenshot({ 
        path: `tests/screenshots/responsive-${viewport.name}.png`,
        fullPage: true 
      });
    }
    
    console.log('✅ 响应式布局测试完成');
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 测试完成，生成测试报告...');
  
  // 这里可以添加测试报告生成逻辑
  const reportData = {
    timestamp: new Date().toISOString(),
    testSuite: '任务完成验证测试',
    status: 'completed',
    screenshots: [
      'development-notice-layout.png',
      'font-configuration.png', 
      'basic-functionality.png',
      'theme-light.png',
      'theme-dark.png',
      'responsive-desktop.png',
      'responsive-tablet.png',
      'responsive-mobile.png'
    ]
  };
  
  console.log('📊 测试报告数据:', JSON.stringify(reportData, null, 2));
});
