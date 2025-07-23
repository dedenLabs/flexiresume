/**
 * 手动PDF验证测试
 * 
 * 简化的手动验证流程
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('手动PDF验证', () => {
  test('手动验证原版PDF模式', async ({ page }) => {
    console.log('🧪 开始手动验证原版PDF模式');
    
    // 访问主页
    await page.goto('http://localhost:5176/');
    await page.waitForLoadState('networkidle');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 截图正常显示状态
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'normal-display.png'),
      fullPage: true
    });
    console.log('📸 正常显示状态截图已保存');
    
    // 获取正常显示的样式信息
    const normalStyles = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      const p = document.querySelector('p');
      
      return {
        h1Color: h1 ? window.getComputedStyle(h1).color : 'not found',
        h2Color: h2 ? window.getComputedStyle(h2).color : 'not found',
        pColor: p ? window.getComputedStyle(p).color : 'not found',
        bodyBg: window.getComputedStyle(document.body).backgroundColor
      };
    });
    
    console.log('正常显示样式信息:', normalStyles);
    
    // 查找PDF下载按钮
    const pdfButtons = await page.locator('button').allTextContents();
    console.log('页面上的所有按钮:', pdfButtons);
    
    // 查找包含PDF相关文本的元素
    const pdfElements = await page.locator('*').filter({ hasText: /PDF|pdf/ }).allTextContents();
    console.log('包含PDF文本的元素:', pdfElements);
    
    // 尝试点击控制面板
    const controlPanel = page.locator('[data-testid="control-panel"]');
    const controlPanelExists = await controlPanel.count();
    console.log(`控制面板存在: ${controlPanelExists > 0}`);
    
    if (controlPanelExists > 0) {
      // 查找PDF相关按钮
      const pdfDownloader = controlPanel.locator('[data-testid="pdf-downloader"]');
      const pdfDownloaderExists = await pdfDownloader.count();
      console.log(`PDF下载器存在: ${pdfDownloaderExists > 0}`);
      
      if (pdfDownloaderExists > 0) {
        const pdfButton = pdfDownloader.locator('button').first();
        await pdfButton.click();
        await page.waitForTimeout(1000);
        
        // 截图下拉菜单
        await page.screenshot({
          path: path.join('tests', 'screenshots', 'pdf-dropdown-menu.png'),
          fullPage: true
        });
        console.log('📸 PDF下拉菜单截图已保存');
        
        // 查找原版PDF选项
        const dropdownOptions = await page.locator('[data-testid="pdf-downloader"] *').allTextContents();
        console.log('下拉菜单选项:', dropdownOptions);
        
        // 尝试点击原版PDF
        const originalPdfButton = page.locator('text=原版PDF').or(page.locator('text=Original PDF'));
        const originalExists = await originalPdfButton.count();
        console.log(`原版PDF选项存在: ${originalExists > 0}`);
        
        if (originalExists > 0) {
          console.log('🎯 找到原版PDF选项，准备点击');
          
          // 监听新窗口
          const [pdfPage] = await Promise.all([
            page.context().waitForEvent('page'),
            originalPdfButton.first().click()
          ]);
          
          console.log('✅ PDF窗口已打开');
          
          // 等待PDF页面加载
          await pdfPage.waitForLoadState('load');
          await pdfPage.waitForTimeout(3000);
          
          // 截图PDF页面
          await pdfPage.screenshot({
            path: path.join('tests', 'screenshots', 'original-pdf-mode.png'),
            fullPage: true
          });
          console.log('📸 原版PDF模式截图已保存');
          
          // 获取PDF页面的样式信息
          const pdfStyles = await pdfPage.evaluate(() => {
            const h1 = document.querySelector('h1');
            const h2 = document.querySelector('h2');
            const p = document.querySelector('p');
            
            return {
              h1Color: h1 ? window.getComputedStyle(h1).color : 'not found',
              h2Color: h2 ? window.getComputedStyle(h2).color : 'not found',
              pColor: p ? window.getComputedStyle(p).color : 'not found',
              bodyBg: window.getComputedStyle(document.body).backgroundColor,
              hasOriginalMode: document.documentElement.hasAttribute('data-original-mode'),
              hasOverrideStyle: !!document.getElementById('original-mode-override'),
              debugInfo: document.querySelector('.pdf-debug-info')?.textContent || 'no debug info'
            };
          });
          
          console.log('PDF页面样式信息:', pdfStyles);
          
          // 验证修复效果
          const isStyleFixed = pdfStyles.h1Color !== 'rgb(0, 0, 0)' && 
                              pdfStyles.h1Color !== 'black' &&
                              pdfStyles.h1Color !== 'not found';
          
          console.log(`样式修复状态: ${isStyleFixed ? '✅ 成功' : '❌ 失败'}`);
          
          if (!isStyleFixed) {
            console.log('❌ 原版PDF模式样式仍被强制覆盖');
            console.log('需要进一步分析和修复');
          } else {
            console.log('✅ 原版PDF模式样式修复成功');
          }
          
          // 关闭PDF窗口
          await pdfPage.close();
        } else {
          console.log('❌ 未找到原版PDF选项');
        }
      } else {
        console.log('❌ 未找到PDF下载器');
      }
    } else {
      console.log('❌ 未找到控制面板');
    }
    
    console.log('✅ 手动验证完成');
  });
});
