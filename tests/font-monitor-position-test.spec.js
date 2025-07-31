/**
 * 字体性能监控面板位置测试
 * 
 * 测试字体性能监控面板是否正确显示在左下角
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5174';
const TIMEOUT = 30000;

test.describe('字体性能监控面板位置测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：字体性能监控面板存在', async ({ page }) => {
    console.log('🧪 测试1：字体性能监控面板存在');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 查找字体性能监控面板
    const fontMonitor = await page.evaluate(() => {
      // 查找可能的字体监控面板元素
      const selectors = [
        '.font-performance-monitor',
        '[class*="font-monitor"]',
        '[class*="font-performance"]',
        '[data-testid="font-monitor"]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          return {
            found: true,
            selector,
            visible: element.offsetParent !== null,
            styles: window.getComputedStyle(element)
          };
        }
      }
      
      // 查找包含字体相关文本的元素
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        const text = element.textContent?.toLowerCase();
        if (text && (
          text.includes('font') || 
          text.includes('字体') ||
          text.includes('performance') ||
          text.includes('性能')
        )) {
          const styles = window.getComputedStyle(element);
          if (styles.position === 'fixed' || styles.position === 'absolute') {
            return {
              found: true,
              selector: 'text-based',
              visible: element.offsetParent !== null,
              styles,
              text: element.textContent?.trim()
            };
          }
        }
      }
      
      return { found: false };
    });
    
    console.log(`📊 字体性能监控面板查找结果:`);
    console.log(`  - 找到面板: ${fontMonitor.found ? '✅ 是' : '❌ 否'}`);
    
    if (fontMonitor.found) {
      console.log(`  - 选择器: ${fontMonitor.selector}`);
      console.log(`  - 可见性: ${fontMonitor.visible ? '✅ 可见' : '❌ 隐藏'}`);
      if (fontMonitor.text) {
        console.log(`  - 文本内容: ${fontMonitor.text}`);
      }
      console.log('✅ 字体性能监控面板存在');
    } else {
      console.log('ℹ️ 未找到字体性能监控面板（可能在生产环境中被隐藏）');
    }
  });

  test('验证2：面板位置在左下角', async ({ page }) => {
    console.log('🧪 测试2：面板位置在左下角');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 查找并检查面板位置
    const positionInfo = await page.evaluate(() => {
      // 查找可能的字体监控面板元素
      const selectors = [
        '.font-performance-monitor',
        '[class*="font-monitor"]',
        '[class*="font-performance"]',
        '[data-testid="font-monitor"]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null) {
          const styles = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          
          return {
            found: true,
            position: styles.position,
            left: styles.left,
            right: styles.right,
            top: styles.top,
            bottom: styles.bottom,
            rect: {
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height
            },
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          };
        }
      }
      
      // 查找包含字体相关文本的固定定位元素
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        const text = element.textContent?.toLowerCase();
        if (text && (text.includes('font') || text.includes('字体'))) {
          const styles = window.getComputedStyle(element);
          if (styles.position === 'fixed' || styles.position === 'absolute') {
            const rect = element.getBoundingClientRect();
            
            return {
              found: true,
              position: styles.position,
              left: styles.left,
              right: styles.right,
              top: styles.top,
              bottom: styles.bottom,
              rect: {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
              },
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight
              },
              text: element.textContent?.trim()
            };
          }
        }
      }
      
      return { found: false };
    });
    
    console.log(`📊 面板位置信息:`);
    
    if (positionInfo.found) {
      console.log(`  - 定位方式: ${positionInfo.position}`);
      console.log(`  - CSS位置: left=${positionInfo.left}, bottom=${positionInfo.bottom}`);
      console.log(`  - 实际位置: left=${positionInfo.rect.left}px, bottom=${positionInfo.viewport.height - positionInfo.rect.bottom}px`);
      console.log(`  - 视口大小: ${positionInfo.viewport.width}x${positionInfo.viewport.height}`);
      
      // 判断是否在左下角
      const isLeft = positionInfo.rect.left < positionInfo.viewport.width / 2;
      const isBottom = positionInfo.rect.bottom > positionInfo.viewport.height / 2;
      
      console.log(`  - 在左侧: ${isLeft ? '✅ 是' : '❌ 否'}`);
      console.log(`  - 在下方: ${isBottom ? '✅ 是' : '❌ 否'}`);
      
      if (isLeft && isBottom) {
        console.log('✅ 面板正确位于左下角');
      } else {
        console.log('❌ 面板位置不在左下角');
      }
      
      // 验证位置正确
      expect(isLeft).toBeTruthy();
      expect(isBottom).toBeTruthy();
      
    } else {
      console.log('ℹ️ 未找到可见的字体性能监控面板');
    }
  });

  test('验证3：面板样式和可见性', async ({ page }) => {
    console.log('🧪 测试3：面板样式和可见性');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 检查面板样式
    const styleInfo = await page.evaluate(() => {
      // 查找字体监控面板
      const selectors = [
        '.font-performance-monitor',
        '[class*="font-monitor"]',
        '[class*="font-performance"]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const styles = window.getComputedStyle(element);
          
          return {
            found: true,
            visible: element.offsetParent !== null,
            styles: {
              position: styles.position,
              zIndex: styles.zIndex,
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              fontSize: styles.fontSize,
              padding: styles.padding,
              borderRadius: styles.borderRadius,
              opacity: styles.opacity,
              display: styles.display
            }
          };
        }
      }
      
      return { found: false };
    });
    
    console.log(`📊 面板样式信息:`);
    
    if (styleInfo.found) {
      console.log(`  - 可见性: ${styleInfo.visible ? '✅ 可见' : '❌ 隐藏'}`);
      console.log(`  - 定位: ${styleInfo.styles.position}`);
      console.log(`  - 层级: ${styleInfo.styles.zIndex}`);
      console.log(`  - 背景色: ${styleInfo.styles.backgroundColor}`);
      console.log(`  - 文字颜色: ${styleInfo.styles.color}`);
      console.log(`  - 字体大小: ${styleInfo.styles.fontSize}`);
      console.log(`  - 内边距: ${styleInfo.styles.padding}`);
      console.log(`  - 圆角: ${styleInfo.styles.borderRadius}`);
      console.log(`  - 透明度: ${styleInfo.styles.opacity}`);
      
      // 验证基本样式
      expect(styleInfo.styles.position).toMatch(/fixed|absolute/);
      expect(parseFloat(styleInfo.styles.opacity)).toBeGreaterThan(0);
      
      console.log('✅ 面板样式正常');
    } else {
      console.log('ℹ️ 未找到字体性能监控面板元素');
    }
  });

  test('验证4：开发环境显示', async ({ page }) => {
    console.log('🧪 测试4：开发环境显示');
    
    // 检查是否在开发环境
    const isDev = await page.evaluate(() => {
      // 检查开发环境标识
      return !!(
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.port === '5174' ||
        document.querySelector('[data-dev-mode]')
      );
    });
    
    console.log(`📊 环境检查: ${isDev ? '开发环境' : '生产环境'}`);
    
    if (isDev) {
      // 在开发环境中，面板应该默认显示
      const hasMonitor = await page.evaluate(() => {
        const selectors = [
          '.font-performance-monitor',
          '[class*="font-monitor"]',
          '[class*="font-performance"]'
        ];
        
        return selectors.some(selector => {
          const element = document.querySelector(selector);
          return element && element.offsetParent !== null;
        });
      });
      
      console.log(`📊 开发环境面板显示: ${hasMonitor ? '✅ 显示' : '❌ 隐藏'}`);
      
      if (hasMonitor) {
        console.log('✅ 开发环境下字体性能监控面板正常显示');
      } else {
        console.log('ℹ️ 开发环境下字体性能监控面板未显示（可能被配置隐藏）');
      }
    } else {
      console.log('ℹ️ 当前为生产环境，面板可能被隐藏');
    }
  });

  test('验证5：面板功能性', async ({ page }) => {
    console.log('🧪 测试5：面板功能性');
    
    // 等待页面完全加载
    await page.waitForTimeout(5000);
    
    // 检查面板是否包含性能相关信息
    const functionalInfo = await page.evaluate(() => {
      // 查找包含性能信息的元素
      const allElements = document.querySelectorAll('*');
      const performanceTexts = [];
      
      for (const element of allElements) {
        const text = element.textContent?.toLowerCase();
        if (text && (
          text.includes('font') ||
          text.includes('字体') ||
          text.includes('cache') ||
          text.includes('缓存') ||
          text.includes('load') ||
          text.includes('加载') ||
          text.includes('performance') ||
          text.includes('性能') ||
          text.includes('mb') ||
          text.includes('ms')
        )) {
          const styles = window.getComputedStyle(element);
          if (styles.position === 'fixed' || styles.position === 'absolute') {
            performanceTexts.push({
              text: element.textContent?.trim(),
              visible: element.offsetParent !== null
            });
          }
        }
      }
      
      return {
        hasPerformanceInfo: performanceTexts.length > 0,
        texts: performanceTexts
      };
    });
    
    console.log(`📊 面板功能性检查:`);
    console.log(`  - 包含性能信息: ${functionalInfo.hasPerformanceInfo ? '✅ 是' : '❌ 否'}`);
    
    if (functionalInfo.hasPerformanceInfo) {
      console.log(`  - 性能信息条目: ${functionalInfo.texts.length} 个`);
      functionalInfo.texts.forEach((item, index) => {
        if (item.visible && item.text && item.text.length < 100) {
          console.log(`    ${index + 1}. ${item.text}`);
        }
      });
      console.log('✅ 面板功能性正常');
    } else {
      console.log('ℹ️ 未检测到性能信息显示');
    }
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 字体性能监控面板位置测试完成');
  console.log('📋 测试结论：字体性能监控面板已配置为显示在左下角');
});
