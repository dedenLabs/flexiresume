/**
 * FontPerformanceMonitor开发版本显示测试
 * 
 * 测试FontPerformanceMonitor组件在开发版本中是否默认显示
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5175';
const TIMEOUT = 30000;

test.describe('FontPerformanceMonitor开发版本显示测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：FontPerformanceMonitor在开发版本中默认显示', async ({ page }) => {
    console.log('🧪 测试1：FontPerformanceMonitor在开发版本中默认显示');
    
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
      path: 'tests/screenshots/font-monitor-visible.png',
      fullPage: true 
    });
    console.log('📸 已保存FontPerformanceMonitor显示截图');
  });

  test('验证2：FontPerformanceMonitor可以展开和收起', async ({ page }) => {
    console.log('🧪 测试2：FontPerformanceMonitor可以展开和收起');
    
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
      path: 'tests/screenshots/font-monitor-expanded.png',
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

  test('验证3：FontPerformanceMonitor显示字体统计信息', async ({ page }) => {
    console.log('🧪 测试3：FontPerformanceMonitor显示字体统计信息');
    
    // 等待组件和字体加载
    await page.waitForTimeout(5000);
    
    const fontMonitor = page.locator('text=🎨 字体性能监控');
    await expect(fontMonitor).toBeVisible();
    
    // 展开组件
    await fontMonitor.click();
    await page.waitForTimeout(1000);
    
    // 检查统计信息
    const statsContent = await page.textContent('div:has-text("📊 基本统计")');
    console.log('📊 基本统计内容:', statsContent);
    
    // 验证是否包含预期的统计项
    const hasLoadedFonts = await page.locator('text=/已加载字体: \\d+/').isVisible();
    const hasCacheItems = await page.locator('text=/缓存项目: \\d+/').isVisible();
    const hasCacheMemory = await page.locator('text=/缓存内存: [\\d.]+MB/').isVisible();
    
    expect(hasLoadedFonts).toBeTruthy();
    expect(hasCacheItems).toBeTruthy();
    expect(hasCacheMemory).toBeTruthy();
    
    console.log('✅ 统计信息显示正常');
    
    // 检查性能指标
    const hasLoadTime = await page.locator('text=/加载时间: \\d+ms/').isVisible();
    const hasCacheHitRate = await page.locator('text=/缓存命中率: [\\d.]+%/').isVisible();
    const hasAverageAccess = await page.locator('text=/平均访问: [\\d.]+/').isVisible();
    
    expect(hasLoadTime).toBeTruthy();
    expect(hasCacheHitRate).toBeTruthy();
    expect(hasAverageAccess).toBeTruthy();
    
    console.log('✅ 性能指标显示正常');
  });

  test('验证4：FontPerformanceMonitor操作按钮功能', async ({ page }) => {
    console.log('🧪 测试4：FontPerformanceMonitor操作按钮功能');
    
    // 等待组件加载
    await page.waitForTimeout(3000);
    
    const fontMonitor = page.locator('text=🎨 字体性能监控');
    await fontMonitor.click();
    await page.waitForTimeout(1000);
    
    // 查找清理缓存按钮
    const clearCacheButton = page.locator('button:has-text("🗑️ 清理缓存")');
    if (await clearCacheButton.isVisible()) {
      console.log('✅ 找到清理缓存按钮');
      
      // 点击清理缓存按钮
      await clearCacheButton.click();
      await page.waitForTimeout(1000);
      
      console.log('✅ 清理缓存按钮可点击');
    }
    
    // 查找内存清理按钮
    const memoryCleanupButton = page.locator('button:has-text("🧹 内存清理")');
    if (await memoryCleanupButton.isVisible()) {
      console.log('✅ 找到内存清理按钮');
      
      // 点击内存清理按钮
      await memoryCleanupButton.click();
      await page.waitForTimeout(1000);
      
      console.log('✅ 内存清理按钮可点击');
    }
  });

  test('验证5：FontPerformanceMonitor样式和布局', async ({ page }) => {
    console.log('🧪 测试5：FontPerformanceMonitor样式和布局');
    
    // 等待组件加载
    await page.waitForTimeout(3000);
    
    const fontMonitor = page.locator('text=🎨 字体性能监控');
    const monitorContainer = fontMonitor.locator('..').first();
    
    // 检查样式属性
    const styles = await monitorContainer.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        zIndex: computed.zIndex,
        fontFamily: computed.fontFamily
      };
    });
    
    // 验证样式
    expect(styles.position).toBe('fixed');
    expect(styles.zIndex).toBe('9999');
    expect(styles.fontFamily).toContain('monospace');
    
    console.log('✅ 样式属性正确:', styles);
    
    // 检查组件尺寸
    const boundingBox = await monitorContainer.boundingBox();
    if (boundingBox) {
      expect(boundingBox.width).toBeGreaterThan(200);
      expect(boundingBox.width).toBeLessThan(400);
      console.log('✅ 组件尺寸合理:', boundingBox);
    }
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 FontPerformanceMonitor测试完成');
});
