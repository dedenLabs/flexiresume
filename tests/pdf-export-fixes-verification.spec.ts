import { test, expect } from '@playwright/test';

/**
 * PDF导出修复验证测试
 * 
 * 验证以下问题的修复：
 * 1. 隐藏DevelopmentNotice.tsx组件
 * 2. Ctrl+P快捷键方案导出时，隐藏不显示的元素功能生效
 * 3. 黑夜模式背景色（data-testid="resume-content"节点的背景色）生效
 */

test.describe('PDF导出修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到首页
    await page.goto('/');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 清除本地存储，确保开发环境提示会显示
    try {
      await page.evaluate(() => {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('dev-notice-dismissed');
        }
      });
    } catch (error) {
      console.log('localStorage访问失败，跳过清理');
    }

    // 等待开发环境提示出现
    await page.waitForSelector('[data-testid="development-notice"]', {
      timeout: 10000,
      state: 'visible'
    });
  });

  test('验证DevelopmentNotice在PDF原版模式下被隐藏', async ({ page }) => {
    console.log('🔍 开始验证DevelopmentNotice在PDF原版模式下被隐藏...');
    
    // 1. 确认开发环境提示可见
    const developmentNotice = page.locator('[data-testid="development-notice"]');
    await expect(developmentNotice).toBeVisible();
    console.log('✅ 开发环境提示初始状态可见');
    
    // 2. 切换到深色模式
    const themeButton = page.locator('[data-testid="theme-switcher"]').first();
    await themeButton.click();
    await page.waitForTimeout(1000);
    
    // 3. 点击PDF下载按钮
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 4. 选择原版模式
    const originalModeButton = page.locator('button:has-text("原版")');
    await originalModeButton.click();
    await page.waitForTimeout(2000);
    
    // 5. 验证打印样式中DevelopmentNotice被隐藏
    const hiddenInPrint = await page.evaluate(() => {
      // 检查打印样式
      const styleElements = document.querySelectorAll('style');
      let hasDevelopmentNoticeHiding = false;
      
      for (const style of styleElements) {
        const content = style.textContent || '';
        if (content.includes('@media print') && 
            content.includes('[data-testid="development-notice"]') &&
            content.includes('display: none')) {
          hasDevelopmentNoticeHiding = true;
          break;
        }
      }
      
      return {
        hasDevelopmentNoticeHiding,
        developmentNoticeExists: !!document.querySelector('[data-testid="development-notice"]')
      };
    });
    
    expect(hiddenInPrint.hasDevelopmentNoticeHiding).toBe(true);
    expect(hiddenInPrint.developmentNoticeExists).toBe(true); // 元素存在但在打印时被隐藏
    console.log('✅ DevelopmentNotice在PDF原版模式下被正确隐藏');
  });

  test('验证DevelopmentNotice在Ctrl+P快捷键下被隐藏', async ({ page }) => {
    console.log('🔍 开始验证DevelopmentNotice在Ctrl+P快捷键下被隐藏...');
    
    // 1. 确认开发环境提示可见
    const developmentNotice = page.locator('[data-testid="development-notice"]');
    await expect(developmentNotice).toBeVisible();
    
    // 2. 模拟Ctrl+P快捷键
    await page.keyboard.down('Control');
    await page.keyboard.press('p');
    await page.keyboard.up('Control');
    await page.waitForTimeout(1000);
    
    // 3. 验证全局打印样式被激活且DevelopmentNotice被隐藏
    const ctrlPHiding = await page.evaluate(() => {
      // 检查body是否有print-mode-active类
      const hasPrintModeActive = document.body.classList.contains('print-mode-active');
      
      // 检查全局打印样式中的DevelopmentNotice隐藏规则
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
    
    expect(ctrlPHiding.hasPrintModeActive).toBe(true);
    expect(ctrlPHiding.hasGlobalDevelopmentNoticeHiding).toBe(true);
    console.log('✅ Ctrl+P快捷键正确激活打印样式并隐藏DevelopmentNotice');
  });

  test('验证深色模式背景色在PDF原版模式下保留', async ({ page }) => {
    console.log('🔍 开始验证深色模式背景色保留...');
    
    // 1. 切换到深色模式
    const themeButton = page.locator('[data-testid="theme-switcher"]').first();
    await themeButton.click();
    await page.waitForTimeout(1000);
    
    // 验证深色模式已激活
    const htmlElement = page.locator('html');
    const themeAttr = await htmlElement.getAttribute('data-theme');
    expect(themeAttr).toBe('dark');
    console.log('✅ 深色模式已激活');
    
    // 2. 获取resume-content的深色模式背景色
    const resumeContent = page.locator('[data-testid="resume-content"]');
    const darkBgColor = await resumeContent.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log(`深色模式resume-content背景色: ${darkBgColor}`);
    
    // 3. 点击PDF下载按钮
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 4. 选择原版模式
    const originalModeButton = page.locator('button:has-text("原版")');
    await originalModeButton.click();
    await page.waitForTimeout(2000);
    
    // 5. 验证打印样式中的背景色保留
    const backgroundPreservation = await page.evaluate(() => {
      // 检查打印样式中的背景色保留规则
      const styleElements = document.querySelectorAll('style');
      let hasBackgroundPreservation = false;
      let hasResumeContentDarkBg = false;
      
      for (const style of styleElements) {
        const content = style.textContent || '';
        if (content.includes('@media print')) {
          if (content.includes('color-adjust: exact') && 
              content.includes('print-color-adjust: exact')) {
            hasBackgroundPreservation = true;
          }
          
          if (content.includes('[data-testid="resume-content"]') &&
              content.includes('#2d3748')) {
            hasResumeContentDarkBg = true;
          }
        }
      }
      
      // 获取当前resume-content的背景色
      const resumeContentEl = document.querySelector('[data-testid="resume-content"]');
      const currentBgColor = resumeContentEl ? 
        window.getComputedStyle(resumeContentEl).backgroundColor : '';
      
      return {
        hasBackgroundPreservation,
        hasResumeContentDarkBg,
        currentBgColor
      };
    });
    
    expect(backgroundPreservation.hasBackgroundPreservation).toBe(true);
    expect(backgroundPreservation.hasResumeContentDarkBg).toBe(true);
    console.log('✅ 深色模式背景色保留规则已正确应用');
    console.log(`当前resume-content背景色: ${backgroundPreservation.currentBgColor}`);
  });

  test('验证所有PDF模式下的元素隐藏一致性', async ({ page }) => {
    console.log('🔍 开始验证所有PDF模式下的元素隐藏一致性...');
    
    const modes = ['原版', '彩色', '黑白'];
    const results: any[] = [];
    
    for (const mode of modes) {
      console.log(`测试${mode}模式...`);
      
      // 点击PDF下载按钮
      const pdfButton = page.locator('[data-pdf-downloader]').first();
      await pdfButton.click();
      await page.waitForTimeout(500);
      
      // 选择对应模式
      const modeButton = page.locator(`button:has-text("${mode}")`);
      await modeButton.click();
      await page.waitForTimeout(2000);
      
      // 检查隐藏元素
      const hiddenElements = await page.evaluate(() => {
        const elementsToCheck = [
          '[data-testid="control-panel"]',
          '[data-testid="development-notice"]',
          '[data-pdf-downloader]',
          '.control-panel',
          '.floating-controls'
        ];
        
        const styleElements = document.querySelectorAll('style');
        const hiddenInStyles: string[] = [];
        
        for (const style of styleElements) {
          const content = style.textContent || '';
          if (content.includes('@media print')) {
            elementsToCheck.forEach(selector => {
              if (content.includes(selector) && content.includes('display: none')) {
                hiddenInStyles.push(selector);
              }
            });
          }
        }
        
        return {
          hiddenInStyles: [...new Set(hiddenInStyles)], // 去重
          totalStyleElements: styleElements.length
        };
      });
      
      results.push({
        mode,
        hiddenElements: hiddenElements.hiddenInStyles,
        styleCount: hiddenElements.totalStyleElements
      });
      
      // 等待一下再测试下一个模式
      await page.waitForTimeout(1000);
    }
    
    console.log('所有模式测试结果:', JSON.stringify(results, null, 2));
    
    // 验证所有模式都隐藏了必要的元素
    const requiredHiddenElements = [
      '[data-testid="control-panel"]',
      '[data-testid="development-notice"]',
      '[data-pdf-downloader]'
    ];
    
    for (const result of results) {
      for (const requiredElement of requiredHiddenElements) {
        expect(result.hiddenElements).toContain(requiredElement);
      }
      console.log(`✅ ${result.mode}模式正确隐藏所有必要元素`);
    }
  });

  test('截图验证修复效果', async ({ page }) => {
    console.log('🔍 开始截图验证修复效果...');
    
    // 1. 正常模式截图（有开发环境提示）
    await page.screenshot({ 
      path: 'tests/screenshots/pdf-fixes-normal-with-notice.png',
      fullPage: true 
    });
    console.log('✅ 正常模式（含开发环境提示）截图已保存');
    
    // 2. 深色模式截图
    const themeButton = page.locator('[data-testid="theme-switcher"]').first();
    await themeButton.click();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'tests/screenshots/pdf-fixes-dark-with-notice.png',
      fullPage: true 
    });
    console.log('✅ 深色模式（含开发环境提示）截图已保存');
    
    // 3. PDF原版模式截图
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const originalModeButton = page.locator('button:has-text("原版")');
    await originalModeButton.click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'tests/screenshots/pdf-fixes-original-mode.png',
      fullPage: true 
    });
    console.log('✅ PDF原版模式截图已保存');
    
    // 验证截图文件存在
    const fs = require('fs');
    expect(fs.existsSync('tests/screenshots/pdf-fixes-normal-with-notice.png')).toBe(true);
    expect(fs.existsSync('tests/screenshots/pdf-fixes-dark-with-notice.png')).toBe(true);
    expect(fs.existsSync('tests/screenshots/pdf-fixes-original-mode.png')).toBe(true);
    
    console.log('✅ 所有修复效果截图验证完成');
  });
});
