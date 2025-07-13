/**
 * 控制面板位置测试
 * 
 * 验证控制面板是否正确定位在右下角
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5177';

test.describe('控制面板位置测试', () => {
  
  test('控制面板应该定位在右下角', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 查找控制面板
    const controlPanel = page.locator('[data-testid="control-panel"]');
    await expect(controlPanel).toBeVisible();
    
    // 获取控制面板的位置
    const boundingBox = await controlPanel.boundingBox();
    expect(boundingBox).not.toBeNull();
    
    if (boundingBox) {
      const viewportSize = page.viewportSize();
      expect(viewportSize).not.toBeNull();
      
      if (viewportSize) {
        console.log('控制面板位置:', boundingBox);
        console.log('视口尺寸:', viewportSize);
        
        // 验证控制面板在右下角
        // 控制面板应该在视口的右侧（x坐标大于视口宽度的70%）
        expect(boundingBox.x).toBeGreaterThan(viewportSize.width * 0.7);
        
        // 控制面板应该在视口的下方（y坐标大于视口高度的70%）
        expect(boundingBox.y).toBeGreaterThan(viewportSize.height * 0.7);
      }
    }
    
    console.log('✅ 控制面板位置正确');
  });

  test('控制面板不应该出现在页面顶部', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查页面顶部100px内是否有控制面板相关内容
    const topAreaText = await page.evaluate(() => {
      const topElements = Array.from(document.querySelectorAll('*'));
      return topElements
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 100;
        })
        .map(el => el.textContent)
        .join(' ');
    });
    
    console.log('页面顶部100px内的文本:', topAreaText.substring(0, 200));
    
    // 检查是否包含控制面板的特征文本
    const hasControlPanelText = topAreaText.includes('主题') && 
                               topAreaText.includes('语言') && 
                               topAreaText.includes('中文') &&
                               topAreaText.includes('English');
    
    // 控制面板内容不应该出现在页面顶部
    expect(hasControlPanelText).toBe(false);
    
    console.log('✅ 页面顶部没有控制面板内容');
  });

  test('控制面板在不同屏幕尺寸下的位置', async ({ page }) => {
    const screenSizes = [
      { width: 1280, height: 720, name: '桌面端' },
      { width: 768, height: 1024, name: '平板端' },
      { width: 375, height: 667, name: '移动端' }
    ];
    
    for (const size of screenSizes) {
      console.log(`测试 ${size.name} (${size.width}x${size.height})`);
      
      // 设置视口尺寸
      await page.setViewportSize({ width: size.width, height: size.height });
      
      // 访问首页
      await page.goto(BASE_URL);
      await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
      
      // 查找控制面板
      const controlPanel = page.locator('[data-testid="control-panel"]');
      await expect(controlPanel).toBeVisible();
      
      // 获取控制面板位置
      const boundingBox = await controlPanel.boundingBox();
      
      if (boundingBox) {
        console.log(`  ${size.name} 控制面板位置: (${boundingBox.x}, ${boundingBox.y})`);
        
        // 验证控制面板在右下角
        expect(boundingBox.x).toBeGreaterThan(size.width * 0.6);
        expect(boundingBox.y).toBeGreaterThan(size.height * 0.6);
      }
      
      // 截图记录
      await page.screenshot({ 
        path: `tests/screenshots/control-panel-${size.name}.png`,
        fullPage: false 
      });
    }
    
    console.log('✅ 所有屏幕尺寸下控制面板位置正确');
  });

  test('控制面板CSS样式检查', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 查找控制面板
    const controlPanel = page.locator('[data-testid="control-panel"]');
    await expect(controlPanel).toBeVisible();
    
    // 检查CSS样式
    const styles = await controlPanel.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        position: computedStyle.position,
        bottom: computedStyle.bottom,
        right: computedStyle.right,
        zIndex: computedStyle.zIndex,
        display: computedStyle.display
      };
    });
    
    console.log('控制面板CSS样式:', styles);
    
    // 验证关键样式
    expect(styles.position).toBe('fixed');
    expect(styles.bottom).toBe('20px');
    expect(styles.right).toBe('20px');
    expect(parseInt(styles.zIndex)).toBeGreaterThan(999);
    
    console.log('✅ 控制面板CSS样式正确');
  });

});
