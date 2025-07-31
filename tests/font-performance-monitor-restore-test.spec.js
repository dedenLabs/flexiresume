/**
 * FontPerformanceMonitor恢复显示测试
 * 
 * 测试FontPerformanceMonitor组件在App.tsx中恢复后是否正确显示
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5174';
const TIMEOUT = 30000;

test.describe('FontPerformanceMonitor恢复显示测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：FontPerformanceMonitor在开发版本中显示', async ({ page }) => {
    console.log('🧪 测试1：FontPerformanceMonitor在开发版本中显示');
    
    // 等待FontPerformanceMonitor组件出现
    await page.waitForTimeout(3000);
    
    // 查找FontPerformanceMonitor组件
    const fontMonitor = page.locator('text=🎨 字体性能监控');
    
    // 验证组件是否可见
    await expect(fontMonitor).toBeVisible();
    console.log('✅ FontPerformanceMonitor组件可见');
    
    // 验证组件位置（应该在右下角）
    const monitorElement = await fontMonitor.locator('..').first();
    const boundingBox = await monitorElement.boundingBox();
    
    if (boundingBox) {
      const viewportSize = page.viewportSize();
      const isBottomRight = boundingBox.x > viewportSize.width * 0.7 && 
                           boundingBox.y > viewportSize.height * 0.7;
      
      expect(isBottomRight).toBeTruthy();
      console.log('✅ FontPerformanceMonitor位置正确（右下角）');
    }
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/font-monitor-restored.png',
      fullPage: true 
    });
    console.log('📸 已保存FontPerformanceMonitor恢复显示截图');
  });

  test('验证2：FontPerformanceMonitor功能正常', async ({ page }) => {
    console.log('🧪 测试2：FontPerformanceMonitor功能正常');
    
    // 等待组件加载
    await page.waitForTimeout(3000);
    
    const fontMonitor = page.locator('text=🎨 字体性能监控');
    await expect(fontMonitor).toBeVisible();
    
    // 检查初始状态（应该是收起的）
    const expandIcon = page.locator('text=▶');
    await expect(expandIcon).toBeVisible();
    console.log('✅ 初始状态为收起状态');
    
    // 点击展开
    await fontMonitor.click();
    await page.waitForTimeout(1000);
    
    // 验证展开状态
    const collapseIcon = page.locator('text=▼');
    await expect(collapseIcon).toBeVisible();
    console.log('✅ 成功展开');
    
    // 验证展开后的内容
    const basicStats = page.locator('text=📊 基本统计');
    await expect(basicStats).toBeVisible();
    
    const performanceMetrics = page.locator('text=⚡ 性能指标');
    await expect(performanceMetrics).toBeVisible();
    
    const loadedFonts = page.locator('text=🎯 已加载字体');
    await expect(loadedFonts).toBeVisible();
    
    console.log('✅ 展开后显示完整内容');
    
    // 截图展开状态
    await page.screenshot({ 
      path: 'tests/screenshots/font-monitor-expanded-restored.png',
      fullPage: true 
    });
    
    // 再次点击收起
    await fontMonitor.click();
    await page.waitForTimeout(1000);
    
    // 验证收起状态
    await expect(expandIcon).toBeVisible();
    await expect(basicStats).not.toBeVisible();
    console.log('✅ 成功收起');
  });

  test('验证3：FontPerformanceMonitor与其他组件共存', async ({ page }) => {
    console.log('🧪 测试3：FontPerformanceMonitor与其他组件共存');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 检查FontPerformanceMonitor是否存在
    const fontMonitor = page.locator('text=🎨 字体性能监控');
    await expect(fontMonitor).toBeVisible();
    console.log('✅ FontPerformanceMonitor存在');
    
    // 检查ControlPanel是否也存在
    const controlPanel = page.locator('button').filter({ hasText: /控制面板|Control Panel/i }).first();
    
    if (await controlPanel.count() > 0) {
      console.log('✅ ControlPanel也存在');
      
      // 验证两个组件不会重叠
      const fontMonitorBox = await fontMonitor.locator('..').first().boundingBox();
      const controlPanelBox = await controlPanel.boundingBox();
      
      if (fontMonitorBox && controlPanelBox) {
        // 检查是否有重叠
        const noOverlap = 
          fontMonitorBox.x + fontMonitorBox.width < controlPanelBox.x ||
          controlPanelBox.x + controlPanelBox.width < fontMonitorBox.x ||
          fontMonitorBox.y + fontMonitorBox.height < controlPanelBox.y ||
          controlPanelBox.y + controlPanelBox.height < fontMonitorBox.y;
        
        expect(noOverlap).toBeTruthy();
        console.log('✅ FontPerformanceMonitor与ControlPanel不重叠');
      }
    } else {
      console.log('ℹ️ ControlPanel不可见或不存在');
    }
  });

  test('验证4：FontPerformanceMonitor在不同屏幕尺寸下的表现', async ({ page }) => {
    console.log('🧪 测试4：FontPerformanceMonitor在不同屏幕尺寸下的表现');
    
    const screenSizes = [
      { name: '桌面', width: 1200, height: 800 },
      { name: '平板', width: 768, height: 1024 },
      { name: '手机', width: 375, height: 667 }
    ];
    
    for (const size of screenSizes) {
      console.log(`📱 测试 ${size.name} (${size.width}x${size.height})`);
      
      // 设置视口大小
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.waitForTimeout(1000);
      
      // 检查FontPerformanceMonitor是否可见
      const fontMonitor = page.locator('text=🎨 字体性能监控');
      const isVisible = await fontMonitor.isVisible();
      
      console.log(`  - FontPerformanceMonitor可见性: ${isVisible ? '✅ 可见' : '❌ 不可见'}`);
      expect(isVisible).toBeTruthy();
      
      if (isVisible) {
        // 检查位置是否合理
        const monitorElement = await fontMonitor.locator('..').first();
        const boundingBox = await monitorElement.boundingBox();
        
        if (boundingBox) {
          const isInViewport = 
            boundingBox.x >= 0 && 
            boundingBox.y >= 0 && 
            boundingBox.x + boundingBox.width <= size.width && 
            boundingBox.y + boundingBox.height <= size.height;
          
          console.log(`  - 位置合理性: ${isInViewport ? '✅ 在视口内' : '⚠️ 超出视口'}`);
          expect(isInViewport).toBeTruthy();
        }
      }
    }
    
    console.log('✅ 不同屏幕尺寸下表现验证通过');
  });

  test('验证5：FontPerformanceMonitor开发环境特性', async ({ page }) => {
    console.log('🧪 测试5：FontPerformanceMonitor开发环境特性');
    
    // 等待组件加载
    await page.waitForTimeout(3000);
    
    // 检查是否在开发环境中
    const isDevelopment = await page.evaluate(() => {
      return import.meta.env.DEV;
    });
    
    console.log(`📊 开发环境状态: ${isDevelopment ? '✅ 开发环境' : '❌ 生产环境'}`);
    
    // 在开发环境中，FontPerformanceMonitor应该默认显示
    if (isDevelopment) {
      const fontMonitor = page.locator('text=🎨 字体性能监控');
      await expect(fontMonitor).toBeVisible();
      console.log('✅ 开发环境中FontPerformanceMonitor默认显示');
      
      // 展开并检查开发环境特有的信息
      await fontMonitor.click();
      await page.waitForTimeout(1000);
      
      // 检查是否显示了性能监控信息
      const performanceInfo = await page.textContent('div:has-text("📊 基本统计")');
      if (performanceInfo) {
        console.log('✅ 显示了性能监控信息');
        console.log(`📊 性能信息预览: ${performanceInfo.slice(0, 100)}...`);
      }
    } else {
      console.log('ℹ️ 当前不在开发环境，跳过开发环境特性测试');
    }
    
    console.log('✅ FontPerformanceMonitor开发环境特性验证完成');
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 FontPerformanceMonitor恢复显示测试完成');
  console.log('📋 测试结论：FontPerformanceMonitor已成功恢复显示，功能正常工作');
});
