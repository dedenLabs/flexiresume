import { test, expect } from '@playwright/test';

/**
 * 简化的PDF导出修复验证测试
 */

test.describe('PDF导出修复简化验证', () => {
  test('验证PDF导出修复效果', async ({ page }) => {
    console.log('🔍 开始验证PDF导出修复效果...');
    
    // 1. 导航到首页
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 2. 检查开发环境提示是否存在
    const developmentNotice = page.locator('[data-testid="development-notice"]');
    const noticeExists = await developmentNotice.count() > 0;
    console.log(`开发环境提示存在: ${noticeExists}`);
    
    // 3. 切换到深色模式
    const themeButton = page.locator('[data-testid="theme-switcher"]').first();
    await themeButton.click();
    await page.waitForTimeout(1000);
    
    // 验证深色模式已激活
    const htmlElement = page.locator('html');
    const themeAttr = await htmlElement.getAttribute('data-theme');
    expect(themeAttr).toBe('dark');
    console.log('✅ 深色模式已激活');
    
    // 4. 获取resume-content的深色模式背景色
    const resumeContent = page.locator('[data-testid="resume-content"]');
    const darkBgColor = await resumeContent.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log(`深色模式resume-content背景色: ${darkBgColor}`);
    
    // 5. 点击PDF下载按钮
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 6. 选择原版模式
    const originalModeButton = page.locator('button:has-text("原版")');
    await originalModeButton.click();
    await page.waitForTimeout(2000);
    
    // 7. 验证打印样式中的修复
    const printStyleCheck = await page.evaluate(() => {
      const styleElements = document.querySelectorAll('style');
      let hasBackgroundPreservation = false;
      let hasDevelopmentNoticeHiding = false;
      let hasResumeContentDarkBg = false;
      
      for (const style of styleElements) {
        const content = style.textContent || '';
        if (content.includes('@media print')) {
          // 检查背景色保留
          if (content.includes('color-adjust: exact') && 
              content.includes('print-color-adjust: exact')) {
            hasBackgroundPreservation = true;
          }
          
          // 检查DevelopmentNotice隐藏
          if (content.includes('[data-testid="development-notice"]') &&
              content.includes('display: none')) {
            hasDevelopmentNoticeHiding = true;
          }
          
          // 检查resume-content深色背景
          if (content.includes('[data-testid="resume-content"]') &&
              content.includes('#2d3748')) {
            hasResumeContentDarkBg = true;
          }
        }
      }
      
      return {
        hasBackgroundPreservation,
        hasDevelopmentNoticeHiding,
        hasResumeContentDarkBg,
        totalStyles: styleElements.length
      };
    });
    
    console.log('打印样式检查结果:', JSON.stringify(printStyleCheck, null, 2));
    
    // 验证修复效果
    expect(printStyleCheck.hasBackgroundPreservation).toBe(true);
    expect(printStyleCheck.hasDevelopmentNoticeHiding).toBe(true);
    expect(printStyleCheck.hasResumeContentDarkBg).toBe(true);
    
    console.log('✅ PDF原版模式修复验证通过');
    
    // 8. 测试Ctrl+P快捷键
    await page.keyboard.down('Control');
    await page.keyboard.press('p');
    await page.keyboard.up('Control');
    await page.waitForTimeout(1000);
    
    // 9. 验证全局打印样式
    const globalPrintStyleCheck = await page.evaluate(() => {
      const hasPrintModeActive = document.body.classList.contains('print-mode-active');
      
      // 检查全局样式中的DevelopmentNotice隐藏
      const styleElements = document.querySelectorAll('style');
      let hasGlobalDevelopmentNoticeHiding = false;
      
      for (const style of styleElements) {
        const content = style.textContent || '';
        if (content.includes('body.print-mode-active') && 
            content.includes('[data-testid="development-notice"]') &&
            content.includes('display: none')) {
          hasGlobalDevelopmentNoticeHiding = true;
          break;
        }
      }
      
      return {
        hasPrintModeActive,
        hasGlobalDevelopmentNoticeHiding
      };
    });
    
    console.log('全局打印样式检查结果:', JSON.stringify(globalPrintStyleCheck, null, 2));
    
    expect(globalPrintStyleCheck.hasPrintModeActive).toBe(true);
    expect(globalPrintStyleCheck.hasGlobalDevelopmentNoticeHiding).toBe(true);
    
    console.log('✅ Ctrl+P快捷键修复验证通过');
    
    // 10. 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/simple-pdf-fixes-verification.png',
      fullPage: true 
    });
    console.log('✅ 修复效果截图已保存');
    
    console.log('🎉 所有PDF导出修复验证通过！');
  });

  test('验证所有PDF模式的元素隐藏', async ({ page }) => {
    console.log('🔍 开始验证所有PDF模式的元素隐藏...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const modes = ['原版', '彩色', '黑白'];
    
    for (const mode of modes) {
      console.log(`测试${mode}模式...`);
      
      // 点击PDF下载按钮
      const pdfButton = page.locator('[data-pdf-downloader]').first();
      await pdfButton.click();
      await page.waitForTimeout(500);
      
      // 选择对应模式
      const modeButton = page.locator(`button:has-text("${mode}")`);
      await modeButton.click();
      await page.waitForTimeout(1500);
      
      // 检查隐藏元素
      const hiddenCheck = await page.evaluate(() => {
        const requiredHiddenElements = [
          '[data-testid="control-panel"]',
          '[data-testid="development-notice"]',
          '[data-pdf-downloader]'
        ];
        
        const styleElements = document.querySelectorAll('style');
        const hiddenInStyles: string[] = [];
        
        for (const style of styleElements) {
          const content = style.textContent || '';
          if (content.includes('@media print')) {
            requiredHiddenElements.forEach(selector => {
              if (content.includes(selector) && content.includes('display: none')) {
                hiddenInStyles.push(selector);
              }
            });
          }
        }
        
        return {
          hiddenElements: [...new Set(hiddenInStyles)],
          requiredElements: requiredHiddenElements
        };
      });
      
      console.log(`${mode}模式隐藏元素:`, hiddenCheck.hiddenElements);
      
      // 验证所有必要元素都被隐藏
      for (const requiredElement of hiddenCheck.requiredElements) {
        expect(hiddenCheck.hiddenElements).toContain(requiredElement);
      }
      
      console.log(`✅ ${mode}模式元素隐藏验证通过`);
      
      // 等待一下再测试下一个模式
      await page.waitForTimeout(1000);
    }
    
    console.log('🎉 所有PDF模式的元素隐藏验证通过！');
  });
});
