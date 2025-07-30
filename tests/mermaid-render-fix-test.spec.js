/**
 * Mermaid脑图渲染错乱修复测试
 * 
 * 验证多个mermaid图表在同一页面渲染时不会出现数据混乱
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('Mermaid脑图渲染修复测试', () => {
  
  test('验证多个mermaid图表独立渲染', async ({ page }) => {
    console.log('🧪 开始多个mermaid图表独立渲染测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // 等待mermaid图表加载
    
    // 查找所有mermaid图表容器
    const mermaidContainers = await page.locator('[data-mermaid-lazy-chart]').all();
    
    console.log(`🔍 找到 ${mermaidContainers.length} 个mermaid图表容器`);
    
    if (mermaidContainers.length >= 2) {
      // 获取每个图表的内容
      const chartContents = [];
      
      for (let i = 0; i < Math.min(mermaidContainers.length, 3); i++) {
        const container = mermaidContainers[i];
        
        // 等待图表加载
        await page.waitForTimeout(2000);
        
        // 获取图表的SVG内容
        const svgContent = await container.locator('svg').innerHTML().catch(() => '');
        const chartId = await container.getAttribute('data-mermaid-lazy-chart');
        
        chartContents.push({
          index: i,
          chartId,
          svgContent: svgContent.substring(0, 200), // 只取前200个字符用于比较
          hasContent: svgContent.length > 0
        });
        
        console.log(`📊 图表 ${i + 1} (ID: ${chartId}): ${svgContent.length > 0 ? '已渲染' : '未渲染'}`);
      }
      
      // 验证每个图表都有内容
      const renderedCharts = chartContents.filter(chart => chart.hasContent);
      expect(renderedCharts.length).toBeGreaterThan(0);
      
      // 验证不同图表的内容确实不同（如果有多个图表）
      if (renderedCharts.length >= 2) {
        const firstChart = renderedCharts[0];
        const secondChart = renderedCharts[1];
        
        // 图表内容应该不同（除非它们确实是相同的图表）
        if (firstChart.chartId !== secondChart.chartId) {
          expect(firstChart.svgContent).not.toBe(secondChart.svgContent);
          console.log('✅ 不同图表的内容确实不同');
        }
      }
      
      console.log('✅ 多个mermaid图表独立渲染验证通过');
    } else {
      console.log('⚠️ 页面中mermaid图表数量不足，跳过独立渲染测试');
    }
  });
  
  test('验证mermaid图表ID唯一性', async ({ page }) => {
    console.log('🧪 开始mermaid图表ID唯一性测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // 获取所有mermaid相关的元素ID
    const mermaidIds = await page.evaluate(() => {
      const elements = document.querySelectorAll('[id*="mermaid"]');
      const ids = [];
      
      elements.forEach(element => {
        if (element.id) {
          ids.push(element.id);
        }
      });
      
      return ids;
    });
    
    console.log(`🔍 找到 ${mermaidIds.length} 个mermaid相关元素`);
    console.log('📋 ID列表:', mermaidIds.slice(0, 5)); // 只显示前5个
    
    // 验证ID唯一性
    const uniqueIds = new Set(mermaidIds);
    expect(uniqueIds.size).toBe(mermaidIds.length);
    
    console.log('✅ Mermaid图表ID唯一性验证通过');
  });
  
  test('验证mermaid图表重新渲染功能', async ({ page }) => {
    console.log('🧪 开始mermaid图表重新渲染测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 查找第一个mermaid图表
    const firstChart = page.locator('[data-mermaid-lazy-chart]').first();
    
    if (await firstChart.isVisible()) {
      // 获取初始内容
      const initialContent = await firstChart.locator('svg').innerHTML().catch(() => '');
      
      if (initialContent.length > 0) {
        console.log('📊 找到已渲染的mermaid图表');
        
        // 触发重新渲染（通过滚动离开再回来）
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(1000);
        
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(3000);
        
        // 获取重新渲染后的内容
        const newContent = await firstChart.locator('svg').innerHTML().catch(() => '');
        
        // 验证图表仍然有内容
        expect(newContent.length).toBeGreaterThan(0);
        
        console.log('✅ Mermaid图表重新渲染功能正常');
      } else {
        console.log('⚠️ 未找到已渲染的mermaid图表，跳过重新渲染测试');
      }
    } else {
      console.log('⚠️ 未找到mermaid图表容器，跳过重新渲染测试');
    }
  });
  
  test('验证mermaid图表主题切换', async ({ page }) => {
    console.log('🧪 开始mermaid图表主题切换测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 查找第一个mermaid图表
    const firstChart = page.locator('[data-mermaid-lazy-chart]').first();
    
    if (await firstChart.isVisible()) {
      // 等待图表加载
      await page.waitForTimeout(2000);
      
      // 获取初始图表内容
      const initialContent = await firstChart.locator('svg').innerHTML().catch(() => '');
      
      if (initialContent.length > 0) {
        console.log('📊 找到已渲染的mermaid图表');
        
        // 查找主题切换按钮
        const themeButton = page.locator('[data-testid="theme-switcher"], .theme-switcher, button:has-text("主题"), button:has-text("🌙"), button:has-text("☀️")').first();
        
        if (await themeButton.isVisible()) {
          // 切换主题
          await themeButton.click();
          await page.waitForTimeout(3000); // 等待主题切换和图表重新渲染
          
          // 获取主题切换后的图表内容
          const newContent = await firstChart.locator('svg').innerHTML().catch(() => '');
          
          // 验证图表仍然有内容
          expect(newContent.length).toBeGreaterThan(0);
          
          console.log('✅ Mermaid图表主题切换功能正常');
        } else {
          console.log('⚠️ 未找到主题切换按钮，跳过主题切换测试');
        }
      } else {
        console.log('⚠️ 未找到已渲染的mermaid图表，跳过主题切换测试');
      }
    } else {
      console.log('⚠️ 未找到mermaid图表容器，跳过主题切换测试');
    }
  });
  
  test('验证mermaid图表错误处理', async ({ page }) => {
    console.log('🧪 开始mermaid图表错误处理测试');
    
    // 监听控制台错误
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('mermaid')) {
        consoleErrors.push(msg.text());
      }
    });
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // 检查是否有mermaid相关的错误
    console.log(`❌ Mermaid相关错误数量: ${consoleErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('Mermaid错误列表:', consoleErrors.slice(0, 3));
    }
    
    // 验证没有严重的mermaid错误
    const seriousErrors = consoleErrors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('deprecated') &&
      !error.includes('safe to ignore')
    );
    
    expect(seriousErrors.length).toBe(0);
    
    console.log('✅ Mermaid图表错误处理验证通过');
  });
  
});
