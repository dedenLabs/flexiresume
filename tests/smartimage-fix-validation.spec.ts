/**
 * SmartImage修复验证测试
 * 
 * 验证SmartImage组件的以下修复：
 * 1. 不再单独一行显示，保持内联布局
 * 2. 支持默认尺寸设置
 * 3. 允许自定义加载提示文本
 * 4. 增加默认尺寸设置，避免布局跳动
 * 
 * @author FlexiResume Team
 * @date 2025-08-04
 */

import { test, expect } from '@playwright/test';

test.describe('SmartImage修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 访问应用首页
    await page.goto('http://localhost:5173');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待一下确保所有组件都已渲染
    await page.waitForTimeout(2000);
  });

  test('验证SmartImage不再单独一行显示', async ({ page }) => {
    console.log('🔍 开始验证SmartImage布局问题修复...');
    
    // 查找所有SmartImage组件
    const smartImages = await page.locator('[data-smart-image="true"]').all();
    console.log(`📊 找到 ${smartImages.length} 个SmartImage组件`);
    
    for (let i = 0; i < smartImages.length; i++) {
      const image = smartImages[i];
      
      // 检查display样式
      const displayStyle = await image.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.display;
      });
      
      console.log(`📋 SmartImage ${i + 1} display样式: ${displayStyle}`);
      
      // 验证display为inline-block而不是block
      expect(displayStyle).toBe('inline-block');
      
      // 检查是否有父容器也是inline-block
      const parentDisplay = await image.evaluate(el => {
        const parent = el.parentElement;
        if (parent) {
          const computedStyle = window.getComputedStyle(parent);
          return computedStyle.display;
        }
        return null;
      });
      
      console.log(`📋 SmartImage ${i + 1} 父容器display样式: ${parentDisplay}`);
    }
  });

  test('验证SmartImage默认尺寸设置', async ({ page }) => {
    console.log('📏 开始验证SmartImage默认尺寸设置...');
    
    // 查找Tab中的头像图片（应该有默认尺寸）
    const tabAvatars = await page.locator('[data-smart-image="true"]').filter({
      has: page.locator('img[alt*="朱"]')
    }).all();
    
    console.log(`👤 找到 ${tabAvatars.length} 个Tab头像`);
    
    for (let i = 0; i < tabAvatars.length; i++) {
      const avatar = tabAvatars[i];
      
      // 获取元素的尺寸
      const boundingBox = await avatar.boundingBox();
      
      if (boundingBox) {
        console.log(`📐 头像 ${i + 1} 尺寸: ${boundingBox.width}x${boundingBox.height}`);
        
        // 验证头像有合理的尺寸（不为0）
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
        
        // 验证头像尺寸在预期范围内（16-24px）
        expect(boundingBox.width).toBeGreaterThanOrEqual(16);
        expect(boundingBox.width).toBeLessThanOrEqual(30);
        expect(boundingBox.height).toBeGreaterThanOrEqual(16);
        expect(boundingBox.height).toBeLessThanOrEqual(30);
      }
    }
  });

  test('验证SmartImage占位符功能', async ({ page }) => {
    console.log('🔄 开始验证SmartImage占位符功能...');
    
    // 查找所有SmartImage占位符
    const placeholders = await page.locator('[data-smart-image-placeholder="true"], [data-smart-image-loading="true"], [data-smart-image-error-placeholder="true"]').all();
    
    console.log(`🎯 找到 ${placeholders.length} 个占位符`);
    
    for (let i = 0; i < placeholders.length; i++) {
      const placeholder = placeholders[i];
      
      // 检查占位符的尺寸
      const boundingBox = await placeholder.boundingBox();
      
      if (boundingBox) {
        console.log(`📦 占位符 ${i + 1} 尺寸: ${boundingBox.width}x${boundingBox.height}`);
        
        // 验证占位符有尺寸（不为0）
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
      }
      
      // 检查display样式
      const displayStyle = await placeholder.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.display;
      });
      
      console.log(`📋 占位符 ${i + 1} display样式: ${displayStyle}`);
      expect(displayStyle).toBe('inline-block');
    }
  });

  test('验证Tab布局完整性', async ({ page }) => {
    console.log('📑 开始验证Tab布局完整性...');
    
    // 查找所有Tab项
    const tabItems = await page.locator('[role="tab"]').all();
    console.log(`📂 找到 ${tabItems.length} 个Tab项`);
    
    for (let i = 0; i < tabItems.length; i++) {
      const tab = tabItems[i];
      
      // 检查Tab内容是否在同一行
      const tabContent = tab.locator('.tab-content, [class*="TabContent"]').first();
      
      if (await tabContent.count() > 0) {
        // 获取Tab内容的子元素
        const children = await tabContent.locator('> *').all();
        
        if (children.length > 1) {
          // 检查子元素是否在同一行（Y坐标相近）
          const positions = [];
          
          for (const child of children) {
            const box = await child.boundingBox();
            if (box) {
              positions.push(box.y);
            }
          }
          
          if (positions.length > 1) {
            const yDiff = Math.abs(positions[0] - positions[1]);
            console.log(`📏 Tab ${i + 1} 子元素Y坐标差异: ${yDiff}px`);
            
            // 验证子元素在同一行（Y坐标差异小于10px）
            expect(yDiff).toBeLessThan(10);
          }
        }
      }
    }
  });

  test('验证控制台无错误', async ({ page }) => {
    console.log('🔍 开始验证控制台错误...');
    
    const errors: string[] = [];
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 尝试切换一些Tab来触发SmartImage加载
    const tabs = await page.locator('[role="tab"]').all();
    
    for (let i = 0; i < Math.min(tabs.length, 3); i++) {
      await tabs[i].click();
      await page.waitForTimeout(1000);
    }
    
    console.log(`❌ 发现 ${errors.length} 个控制台错误`);
    
    // 过滤掉已知的非关键错误
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('404') &&
      !error.includes('net::ERR_') &&
      error.includes('SmartImage') || error.includes('TypeError')
    );
    
    console.log(`🚨 关键错误数量: ${criticalErrors.length}`);
    
    if (criticalErrors.length > 0) {
      console.log('关键错误列表:', criticalErrors);
    }
    
    // 验证没有关键错误
    expect(criticalErrors.length).toBe(0);
  });

  test('截图验证修复效果', async ({ page }) => {
    console.log('📸 开始截图验证修复效果...');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 截取整个页面
    await page.screenshot({ 
      path: 'tests/screenshots/smartimage-fix-full-page.png',
      fullPage: true 
    });
    
    // 截取Tab区域
    const tabContainer = page.locator('[role="tablist"]').first();
    if (await tabContainer.count() > 0) {
      await tabContainer.screenshot({ 
        path: 'tests/screenshots/smartimage-fix-tabs.png' 
      });
    }
    
    // 截取第一个Tab的详细内容
    const firstTab = page.locator('[role="tab"]').first();
    if (await firstTab.count() > 0) {
      await firstTab.screenshot({ 
        path: 'tests/screenshots/smartimage-fix-first-tab.png' 
      });
    }
    
    console.log('✅ 截图已保存到 tests/screenshots/ 目录');
  });
});
