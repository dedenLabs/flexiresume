import { test, expect } from '@playwright/test';

test.describe('图片点击功能测试', () => {
  test('应该能够点击图片并打开大图面板', async ({ page }) => {
    // 启动开发服务器
    await page.goto('http://localhost:5181/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 查找页面中的图片
    const images = await page.locator('img').all();
    console.log(`找到 ${images.length} 张图片`);
    
    if (images.length === 0) {
      test.skip('页面中没有找到图片');
      return;
    }
    
    // 点击第一张图片
    const firstImage = images[0];
    
    // 获取图片URL
    const imageUrl = await firstImage.getAttribute('src');
    console.log('图片URL:', imageUrl);
    
    // 确保图片可见
    await firstImage.waitFor({ state: 'visible' });
    
    // 点击图片
    await firstImage.click();
    
    // 等待模态框出现
    await page.waitForTimeout(1000);
    
    // 检查是否有模态框出现
    const modal = page.locator('div[style*="position: fixed"]').first();
    const modalVisible = await modal.isVisible();
    
    console.log('模态框是否可见:', modalVisible);
    
    // 如果模态框可见，检查其中是否有图片
    if (modalVisible) {
      const modalImage = modal.locator('img').first();
      const modalImageVisible = await modalImage.isVisible();
      console.log('模态框中的图片是否可见:', modalImageVisible);
      
      // 验证模态框中的图片URL与原图片URL相同
      if (modalImageVisible) {
        const modalImageUrl = await modalImage.getAttribute('src');
        console.log('模态框中的图片URL:', modalImageUrl);
        expect(modalImageUrl).toBe(imageUrl);
      }
    }
    
    // 如果没有模态框，检查控制台是否有错误
    if (!modalVisible) {
      const consoleErrors = await page.evaluate(() => {
        return (window as any).consoleErrors || [];
      });
      console.log('控制台错误:', consoleErrors);
    }
    
    // 基本验证：点击后应该有某种反应（模态框或者控制台日志）
    expect(modalVisible).toBe(true);
  });
  
  test('应该能够通过全局函数测试图片点击', async ({ page }) => {
    await page.goto('http://localhost:5181/');
    await page.waitForLoadState('networkidle');
    
    // 检查全局函数是否存在
    const globalFunctionExists = await page.evaluate(() => {
      return typeof (window as any).$handleImageClick === 'function';
    });
    
    console.log('全局函数 $handleImageClick 是否存在:', globalFunctionExists);
    expect(globalFunctionExists).toBe(true);
    
    // 查找一张图片的URL
    const images = await page.locator('img').all();
    if (images.length > 0) {
      const firstImage = images[0];
      const imageUrl = await firstImage.getAttribute('src');
      
      if (imageUrl) {
        // 直接调用全局函数
        const modalOpened = await page.evaluate((url) => {
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
            
            // 调用全局函数
            if ((window as any).$handleImageClick) {
              (window as any).$handleImageClick(url);
            }
            
            // 5秒后超时
            setTimeout(() => {
              observer.disconnect();
              resolve(false);
            }, 5000);
          });
        }, imageUrl);
        
        console.log('通过全局函数打开模态框:', modalOpened);
        expect(modalOpened).toBe(true);
      }
    }
  });
});