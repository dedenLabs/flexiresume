/**
 * 顶部异常显示问题检测测试
 * 
 * 检查页面顶部是否有不应该显示的内容
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5177';

test.describe('顶部异常显示问题检测', () => {
  
  test('检查页面顶部是否有异常内容', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 截图记录当前状态
    await page.screenshot({ 
      path: 'tests/screenshots/top-display-check.png',
      fullPage: true 
    });
    
    // 检查页面顶部区域
    const topArea = page.locator('body').first();
    
    // 获取页面顶部的所有可见元素
    const topElements = await page.locator('body > *').all();
    
    console.log('页面顶部元素数量:', topElements.length);
    
    // 检查每个顶部元素
    for (let i = 0; i < topElements.length; i++) {
      const element = topElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class') || '';
      const id = await element.getAttribute('id') || '';
      const isVisible = await element.isVisible();
      
      console.log(`元素 ${i + 1}: ${tagName}, class="${className}", id="${id}", visible=${isVisible}`);
      
      // 如果是可见元素，获取其文本内容
      if (isVisible) {
        const textContent = await element.textContent();
        const innerHTML = await element.innerHTML();
        
        console.log(`  文本内容: ${textContent?.substring(0, 100)}...`);
        console.log(`  HTML内容: ${innerHTML?.substring(0, 200)}...`);
      }
    }
    
    // 检查是否有意外的顶部内容
    const unexpectedElements = await page.locator('body > div:not([id="root"]):not([class*="control"]):not([class*="theme"])').all();
    
    if (unexpectedElements.length > 0) {
      console.log('⚠️ 发现可能的异常顶部元素:');
      for (const element of unexpectedElements) {
        const tagName = await element.evaluate(el => el.tagName);
        const className = await element.getAttribute('class') || '';
        const textContent = await element.textContent();
        console.log(`  - ${tagName}.${className}: ${textContent?.substring(0, 50)}`);
      }
    }
    
    console.log('✅ 顶部显示检查完成');
  });

  test('检查控制面板是否正常显示', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查控制面板
    const controlPanel = page.locator('[data-testid="control-panel"]');
    const isVisible = await controlPanel.isVisible();
    
    console.log('控制面板可见性:', isVisible);
    
    if (isVisible) {
      // 检查控制面板位置
      const boundingBox = await controlPanel.boundingBox();
      console.log('控制面板位置:', boundingBox);
      
      // 检查是否在正确位置（右下角）
      if (boundingBox) {
        const viewportSize = page.viewportSize();
        if (viewportSize) {
          const isBottomRight = boundingBox.x > viewportSize.width * 0.7 && 
                               boundingBox.y > viewportSize.height * 0.7;
          console.log('控制面板是否在右下角:', isBottomRight);
        }
      }
    }
    
    console.log('✅ 控制面板检查完成');
  });

  test('检查页面头部区域内容', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查页面头部区域（前100px）
    const headerArea = page.locator('body').first();
    
    // 获取页面顶部100px内的所有元素
    const topElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 100 && rect.width > 0 && rect.height > 0;
        })
        .map(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          textContent: el.textContent?.substring(0, 50),
          top: el.getBoundingClientRect().top,
          left: el.getBoundingClientRect().left,
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height
        }));
    });
    
    console.log('页面顶部100px内的元素:');
    topElements.forEach((el, index) => {
      console.log(`${index + 1}. ${el.tagName}${el.className ? '.' + el.className : ''}${el.id ? '#' + el.id : ''}`);
      console.log(`   位置: (${el.left}, ${el.top}) 尺寸: ${el.width}x${el.height}`);
      console.log(`   内容: ${el.textContent}`);
    });
    
    console.log('✅ 页面头部区域检查完成');
  });

  test('检查不同页面的顶部显示', async ({ page }) => {
    const testPages = ['/', '/game', '/fullstack', '/frontend'];
    
    for (const pagePath of testPages) {
      console.log(`检查页面: ${pagePath}`);
      
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
      
      // 截图记录
      await page.screenshot({ 
        path: `tests/screenshots/top-display-${pagePath.replace('/', 'home')}.png`,
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 200 } // 只截取顶部200px
      });
      
      // 检查顶部是否有异常内容
      const topContent = await page.evaluate(() => {
        const topElements = Array.from(document.querySelectorAll('body > *'));
        return topElements.map(el => ({
          tagName: el.tagName,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          className: el.className,
          textContent: el.textContent?.substring(0, 30)
        }));
      });
      
      console.log(`  页面 ${pagePath} 顶部元素:`, topContent.filter(el => el.visible));
    }
    
    console.log('✅ 多页面顶部显示检查完成');
  });

});
