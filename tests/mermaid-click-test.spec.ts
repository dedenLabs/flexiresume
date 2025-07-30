import { test, expect } from '@playwright/test';

test.describe('Mermaid图表点击功能测试', () => {
  test('应该能够点击mermaid图表并打开大图面板', async ({ page }) => {
    // 启动开发服务器
    await page.goto('http://localhost:5181/wukong');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 查找页面中的mermaid图表
    const mermaidElements = await page.locator('.mermaid-placeholder, .mermaid-lazy-placeholder, [data-mermaid-id]').all();
    console.log(`找到 ${mermaidElements.length} 个mermaid相关元素`);
    
    if (mermaidElements.length === 0) {
      test.skip('页面中没有找到mermaid图表');
      return;
    }
    
    // 等待mermaid图表加载完成
    await page.waitForTimeout(3000);
    
    // 查找已渲染的SVG图表
    const svgElements = await page.locator('svg').all();
    console.log(`找到 ${svgElements.length} 个SVG元素`);
    
    if (svgElements.length === 0) {
      test.skip('页面中没有找到SVG图表');
      return;
    }
    
    // 点击第一个SVG图表
    const firstSvg = svgElements[0];
    
    // 确保SVG可见
    await firstSvg.waitFor({ state: 'visible' });
    
    // 记录点击前的状态
    const beforeClick = await page.evaluate(() => {
      return {
        modalExists: document.querySelector('div[style*="position: fixed"][style*="background: rgba"]') !== null,
        bodyOverflow: document.body.style.overflow
      };
    });
    
    console.log('点击前状态:', beforeClick);
    
    // 点击SVG图表
    await firstSvg.click();
    
    // 等待模态框出现
    await page.waitForTimeout(2000);
    
    // 检查是否有模态框出现
    const afterClick = await page.evaluate(() => {
      const modal = document.querySelector('div[style*="position: fixed"][style*="background: rgba"]');
      return {
        modalExists: modal !== null,
        modalStyle: modal ? modal.getAttribute('style') : null,
        bodyOverflow: document.body.style.overflow,
        hasCloseButton: document.querySelector('button[title*="关闭"], div[style*="position: absolute"]') !== null
      };
    });
    
    console.log('点击后状态:', afterClick);
    
    // 验证模态框是否出现
    expect(afterClick.modalExists).toBe(true);
    
    // 如果模态框存在，检查其内容
    if (afterClick.modalExists) {
      // 检查是否有图片或iframe
      const hasImageOrIframe = await page.evaluate(() => {
        const img = document.querySelector('div[style*="position: fixed"] img');
        const iframe = document.querySelector('div[style*="position: fixed"] iframe');
        return {
          hasImage: img !== null,
          hasIframe: iframe !== null,
          imageSrc: img ? img.getAttribute('src') : null,
          iframeSrc: iframe ? iframe.getAttribute('src') : null
        };
      });
      
      console.log('模态框内容:', hasImageOrIframe);
      
      // 应该有图片或iframe
      expect(hasImageOrIframe.hasImage || hasImageOrIframe.hasIframe).toBe(true);
    }
    
    // 关闭模态框
    if (afterClick.modalExists) {
      // 尝试点击关闭按钮或背景
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      
      const afterClose = await page.evaluate(() => {
        const modal = document.querySelector('div[style*="position: fixed"][style*="background: rgba"]');
        return {
          modalExists: modal !== null,
          bodyOverflow: document.body.style.overflow
        };
      });
      
      console.log('关闭后状态:', afterClose);
    }
  });
  
  test('应该能够通过全局函数测试mermaid图表点击', async ({ page }) => {
    await page.goto('http://localhost:5181/wukong');
    await page.waitForLoadState('networkidle');
    
    // 等待mermaid图表加载
    await page.waitForTimeout(3000);
    
    // 检查全局函数是否存在
    const globalFunctionExists = await page.evaluate(() => {
      return typeof (window as any).$handleImageClick === 'function';
    });
    
    console.log('全局函数 $handleImageClick 是否存在:', globalFunctionExists);
    expect(globalFunctionExists).toBe(true);
    
    // 查找SVG图表并获取其内容
    const svgElements = await page.locator('svg').all();
    if (svgElements.length > 0) {
      const firstSvg = svgElements[0];
      const svgContent = await firstSvg.innerHTML();
      
      console.log('找到SVG内容，长度:', svgContent.length);
      
      // 模拟将SVG转换为图片URL并调用全局函数
      const modalOpened = await page.evaluate((svgContent) => {
        return new Promise((resolve) => {
          // 监听模态框的出现
          const observer = new MutationObserver((mutations) => {
            const modal = document.querySelector('div[style*="position: fixed"][style*="background: rgba"]');
            if (modal) {
              observer.disconnect();
              resolve(true);
            }
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
          // 创建SVG blob URL
          try {
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            // 调用全局函数
            if ((window as any).$handleImageClick) {
              (window as any).$handleImageClick(url);
            }
            
            // 清理URL
            setTimeout(() => {
              URL.revokeObjectURL(url);
            }, 1000);
          } catch (error) {
            console.error('创建SVG URL失败:', error);
            resolve(false);
          }
          
          // 10秒后超时
          setTimeout(() => {
            observer.disconnect();
            resolve(false);
          }, 10000);
        });
      }, svgContent);
      
      console.log('通过全局函数打开模态框:', modalOpened);
      expect(modalOpened).toBe(true);
    }
  });
});