/**
 * 页面顶部渐变遮罩检测测试
 * 
 * 检查页面顶部是否有不应该存在的渐变遮罩
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('页面顶部渐变遮罩检测', () => {
  
  test('检查页面顶部是否有渐变遮罩', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 截图记录当前状态
    await page.screenshot({ 
      path: 'tests/screenshots/gradient-mask-check-full.png',
      fullPage: true 
    });
    
    // 截图页面顶部区域
    await page.screenshot({ 
      path: 'tests/screenshots/gradient-mask-check-top.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 300 }
    });
    
    // 检查页面顶部是否有渐变相关的元素
    const gradientElements = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      const gradientRelated = [];
      
      allElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        // 检查是否在页面顶部200px内
        if (rect.top >= 0 && rect.top <= 200) {
          // 检查是否有渐变相关样式
          const hasGradient = 
            computedStyle.background.includes('gradient') ||
            computedStyle.backgroundImage.includes('gradient') ||
            el.className.toLowerCase().includes('gradient') ||
            el.className.toLowerCase().includes('mask') ||
            el.className.toLowerCase().includes('overlay');
            
          if (hasGradient) {
            gradientRelated.push({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              background: computedStyle.background,
              backgroundImage: computedStyle.backgroundImage,
              position: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
              },
              zIndex: computedStyle.zIndex,
              opacity: computedStyle.opacity
            });
          }
        }
      });
      
      return gradientRelated;
    });
    
    console.log('发现的渐变相关元素:', gradientRelated);
    
    // 检查是否有可疑的渐变遮罩
    const suspiciousMasks = gradientElements.filter(el => 
      el.position.top < 100 && 
      el.position.width > 500 && 
      (el.background.includes('gradient') || el.backgroundImage.includes('gradient'))
    );
    
    if (suspiciousMasks.length > 0) {
      console.log('⚠️ 发现可疑的渐变遮罩:', suspiciousMasks);
    } else {
      console.log('✅ 未发现可疑的渐变遮罩');
    }
    
    console.log('✅ 渐变遮罩检测完成');
  });

  test('检查特定CSS类名的渐变元素', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 查找可能的渐变遮罩类名
    const suspiciousClasses = [
      '.gradient',
      '.mask',
      '.overlay',
      '.fade',
      '.backdrop',
      '[class*="gradient"]',
      '[class*="mask"]',
      '[class*="overlay"]'
    ];
    
    for (const selector of suspiciousClasses) {
      const elements = await page.locator(selector).all();
      
      if (elements.length > 0) {
        console.log(`发现 ${selector} 元素: ${elements.length} 个`);
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const boundingBox = await element.boundingBox();
          const className = await element.getAttribute('class');
          
          if (boundingBox && boundingBox.top < 200) {
            console.log(`  - 元素 ${i + 1}: class="${className}", 位置: (${boundingBox.x}, ${boundingBox.y})`);
          }
        }
      }
    }
    
    console.log('✅ CSS类名检查完成');
  });

  test('检查伪元素的渐变效果', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查伪元素的渐变效果
    const pseudoElementsWithGradient = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const results = [];
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        // 只检查页面顶部的元素
        if (rect.top >= 0 && rect.top <= 200) {
          // 检查 ::before 伪元素
          const beforeStyle = window.getComputedStyle(el, '::before');
          if (beforeStyle.background.includes('gradient') || beforeStyle.backgroundImage.includes('gradient')) {
            results.push({
              element: el.tagName + (el.className ? '.' + el.className : ''),
              pseudoElement: '::before',
              background: beforeStyle.background,
              backgroundImage: beforeStyle.backgroundImage,
              position: rect
            });
          }
          
          // 检查 ::after 伪元素
          const afterStyle = window.getComputedStyle(el, '::after');
          if (afterStyle.background.includes('gradient') || afterStyle.backgroundImage.includes('gradient')) {
            results.push({
              element: el.tagName + (el.className ? '.' + el.className : ''),
              pseudoElement: '::after',
              background: afterStyle.background,
              backgroundImage: afterStyle.backgroundImage,
              position: rect
            });
          }
        }
      });
      
      return results;
    });
    
    console.log('伪元素渐变检查结果:', pseudoElementsWithGradient);
    
    if (pseudoElementsWithGradient.length > 0) {
      console.log('⚠️ 发现伪元素渐变效果');
    } else {
      console.log('✅ 未发现伪元素渐变效果');
    }
    
    console.log('✅ 伪元素检查完成');
  });

  test('检查不同页面的渐变遮罩', async ({ page }) => {
    const testPages = ['/', '/game', '/fullstack', '/frontend'];
    
    for (const pagePath of testPages) {
      console.log(`检查页面: ${pagePath}`);
      
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
      
      // 截图记录
      await page.screenshot({ 
        path: `tests/screenshots/gradient-check-${pagePath.replace('/', 'home')}.png`,
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 200 }
      });
      
      // 检查渐变元素
      const gradientCount = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        let count = 0;
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          
          if (rect.top >= 0 && rect.top <= 200) {
            if (style.background.includes('gradient') || style.backgroundImage.includes('gradient')) {
              count++;
            }
          }
        });
        
        return count;
      });
      
      console.log(`  页面 ${pagePath} 发现 ${gradientCount} 个渐变元素`);
    }
    
    console.log('✅ 多页面渐变检查完成');
  });

  test('检查可能的CSS文件中的渐变样式', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 获取所有CSS规则中包含渐变的样式
    const gradientRules = await page.evaluate(() => {
      const rules = [];
      
      // 遍历所有样式表
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || sheet.rules || []).forEach(rule => {
            if (rule.style) {
              const cssText = rule.cssText;
              if (cssText.includes('gradient') && 
                  (cssText.includes('top') || cssText.includes('position') || cssText.includes('z-index'))) {
                rules.push({
                  selector: rule.selectorText,
                  cssText: cssText
                });
              }
            }
          });
        } catch (e) {
          // 跨域样式表可能无法访问
        }
      });
      
      return rules;
    });
    
    console.log('CSS中的渐变规则:', gradientRules);
    
    console.log('✅ CSS规则检查完成');
  });

});
