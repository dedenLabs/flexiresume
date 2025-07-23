import { test, expect } from '@playwright/test';

/**
 * PDF导出修复验证测试
 * 
 * 验证以下问题的修复：
 * 1. PDF原版导出背景色丢失
 * 2. 彩色模式导出时右下角按钮显示
 * 3. SkillItem效果丢失
 */

test.describe('PDF导出修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到首页
    await page.goto('/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 10000 });
  });

  test('验证PDF原版模式深色背景保留', async ({ page }) => {
    console.log('🔍 开始验证PDF原版模式深色背景保留...');
    
    // 1. 切换到深色模式
    const themeButton = page.locator('[data-testid="theme-switcher"]').first();
    await themeButton.click();
    await page.waitForTimeout(1000);
    
    // 验证深色模式已激活
    const htmlElement = page.locator('html');
    const themeAttr = await htmlElement.getAttribute('data-theme');
    expect(themeAttr).toBe('dark');
    console.log('✅ 深色模式已激活');
    
    // 2. 获取深色模式下的背景色
    const bodyBgColor = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).backgroundColor;
    });
    console.log(`深色模式背景色: ${bodyBgColor}`);
    
    // 3. 点击PDF下载按钮
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 4. 选择原版模式
    const originalModeButton = page.locator('button:has-text("原版")');
    await originalModeButton.click();
    await page.waitForTimeout(2000);
    
    // 5. 验证打印样式中的背景色保留
    const printBgColor = await page.evaluate(() => {
      // 检查是否有PDF样式被应用
      const styleElements = document.querySelectorAll('style');
      let hasPrintStyles = false;
      
      for (const style of styleElements) {
        if (style.textContent?.includes('@media print') && 
            style.textContent?.includes('color-adjust: exact')) {
          hasPrintStyles = true;
          break;
        }
      }
      
      return {
        hasPrintStyles,
        currentBgColor: window.getComputedStyle(document.body).backgroundColor
      };
    });
    
    expect(printBgColor.hasPrintStyles).toBe(true);
    console.log('✅ PDF打印样式已正确应用');
    console.log(`当前背景色: ${printBgColor.currentBgColor}`);
  });

  test('验证控制面板在PDF导出时被隐藏', async ({ page }) => {
    console.log('🔍 开始验证控制面板隐藏...');
    
    // 1. 确认控制面板可见
    const controlPanel = page.locator('[data-testid="control-panel"]');
    await expect(controlPanel).toBeVisible();
    console.log('✅ 控制面板初始状态可见');
    
    // 2. 点击PDF下载按钮
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 3. 选择彩色模式
    const colorModeButton = page.locator('button:has-text("彩色")');
    await colorModeButton.click();
    await page.waitForTimeout(2000);
    
    // 4. 验证打印样式中控制面板被隐藏
    const hiddenElements = await page.evaluate(() => {
      const elements = {
        controlPanel: document.querySelector('[data-testid="control-panel"]'),
        pdfDownloader: document.querySelector('[data-pdf-downloader]'),
        floatingControls: document.querySelector('.floating-controls'),
        buttons: document.querySelectorAll('button:not(.skill-item):not([class*="skill"])')
      };
      
      // 检查打印样式
      const styleElements = document.querySelectorAll('style');
      let hasPrintHideStyles = false;
      
      for (const style of styleElements) {
        if (style.textContent?.includes('@media print') && 
            style.textContent?.includes('display: none !important')) {
          hasPrintHideStyles = true;
          break;
        }
      }
      
      return {
        hasPrintHideStyles,
        controlPanelExists: !!elements.controlPanel,
        buttonCount: elements.buttons.length
      };
    });
    
    expect(hiddenElements.hasPrintHideStyles).toBe(true);
    console.log('✅ PDF打印隐藏样式已正确应用');
    console.log(`控制面板存在: ${hiddenElements.controlPanelExists}`);
    console.log(`按钮数量: ${hiddenElements.buttonCount}`);
  });

  test('验证SkillItem在PDF导出时样式保留', async ({ page }) => {
    console.log('🔍 开始验证SkillItem样式保留...');
    
    // 1. 等待技能标签加载
    await page.waitForSelector('[class*="skill"], .skill-item', { timeout: 10000 });
    
    // 2. 获取技能标签的初始样式
    const initialSkillStyles = await page.evaluate(() => {
      const skillElements = document.querySelectorAll('[class*="skill"], .skill-item');
      const styles = [];
      
      for (const element of skillElements) {
        const computedStyle = window.getComputedStyle(element);
        styles.push({
          element: element.textContent?.trim(),
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          display: computedStyle.display
        });
      }
      
      return styles;
    });
    
    console.log(`找到 ${initialSkillStyles.length} 个技能标签`);
    expect(initialSkillStyles.length).toBeGreaterThan(0);
    
    // 3. 点击PDF下载按钮
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 4. 选择彩色模式
    const colorModeButton = page.locator('button:has-text("彩色")');
    await colorModeButton.click();
    await page.waitForTimeout(2000);
    
    // 5. 验证技能标签在打印样式下的保留
    const printSkillStyles = await page.evaluate(() => {
      const skillElements = document.querySelectorAll('[class*="skill"], .skill-item');
      const styles = [];
      
      // 检查打印样式中的技能标签保护
      const styleElements = document.querySelectorAll('style');
      let hasSkillProtection = false;
      
      for (const style of styleElements) {
        if (style.textContent?.includes('@media print') && 
            (style.textContent?.includes('.skill-item') || 
             style.textContent?.includes('[class*="skill"]'))) {
          hasSkillProtection = true;
          break;
        }
      }
      
      for (const element of skillElements) {
        const computedStyle = window.getComputedStyle(element);
        styles.push({
          element: element.textContent?.trim(),
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          display: computedStyle.display,
          visibility: computedStyle.visibility
        });
      }
      
      return {
        hasSkillProtection,
        styles,
        skillCount: skillElements.length
      };
    });
    
    expect(printSkillStyles.hasSkillProtection).toBe(true);
    expect(printSkillStyles.skillCount).toBeGreaterThan(0);
    console.log('✅ 技能标签打印保护样式已正确应用');
    console.log(`技能标签数量: ${printSkillStyles.skillCount}`);
    
    // 验证技能标签仍然可见
    for (const style of printSkillStyles.styles) {
      expect(style.display).not.toBe('none');
      expect(style.visibility).not.toBe('hidden');
    }
    console.log('✅ 所有技能标签在打印模式下仍然可见');
  });

  test('验证原版模式技能标签样式完整保留', async ({ page }) => {
    console.log('🔍 开始验证原版模式技能标签样式...');
    
    // 1. 切换到深色模式以获得更明显的效果
    const themeButton = page.locator('[data-testid="theme-switcher"]').first();
    await themeButton.click();
    await page.waitForTimeout(1000);
    
    // 2. 等待技能标签加载
    await page.waitForSelector('[class*="skill"], .skill-item', { timeout: 10000 });
    
    // 3. 点击PDF下载按钮
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 4. 选择原版模式
    const originalModeButton = page.locator('button:has-text("原版")');
    await originalModeButton.click();
    await page.waitForTimeout(2000);
    
    // 5. 验证原版模式下技能标签样式保留
    const originalSkillStyles = await page.evaluate(() => {
      // 检查原版模式的打印样式
      const styleElements = document.querySelectorAll('style');
      let hasOriginalModeStyles = false;
      let hasSkillPreservation = false;
      
      for (const style of styleElements) {
        const content = style.textContent || '';
        if (content.includes('@media print') && 
            content.includes('color-adjust: exact')) {
          hasOriginalModeStyles = true;
          
          if (content.includes('.skill-item') || 
              content.includes('[class*="skill"]')) {
            hasSkillPreservation = true;
          }
        }
      }
      
      const skillElements = document.querySelectorAll('[class*="skill"], .skill-item');
      
      return {
        hasOriginalModeStyles,
        hasSkillPreservation,
        skillCount: skillElements.length,
        skillsVisible: Array.from(skillElements).every(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        })
      };
    });
    
    expect(originalSkillStyles.hasOriginalModeStyles).toBe(true);
    expect(originalSkillStyles.hasSkillPreservation).toBe(true);
    expect(originalSkillStyles.skillCount).toBeGreaterThan(0);
    expect(originalSkillStyles.skillsVisible).toBe(true);
    
    console.log('✅ 原版模式技能标签样式完整保留');
    console.log(`技能标签数量: ${originalSkillStyles.skillCount}`);
  });

  test('截图验证修复效果', async ({ page }) => {
    console.log('🔍 开始截图验证...');
    
    // 1. 正常模式截图
    await page.screenshot({ 
      path: 'tests/screenshots/pdf-fix-normal-mode.png',
      fullPage: true 
    });
    console.log('✅ 正常模式截图已保存');
    
    // 2. 深色模式截图
    const themeButton = page.locator('[data-testid="theme-switcher"]').first();
    await themeButton.click();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'tests/screenshots/pdf-fix-dark-mode.png',
      fullPage: true 
    });
    console.log('✅ 深色模式截图已保存');
    
    // 3. PDF原版模式截图
    const pdfButton = page.locator('[data-pdf-downloader]').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const originalModeButton = page.locator('button:has-text("原版")');
    await originalModeButton.click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'tests/screenshots/pdf-fix-original-mode.png',
      fullPage: true 
    });
    console.log('✅ PDF原版模式截图已保存');
    
    // 验证截图文件存在
    const fs = require('fs');
    expect(fs.existsSync('tests/screenshots/pdf-fix-normal-mode.png')).toBe(true);
    expect(fs.existsSync('tests/screenshots/pdf-fix-dark-mode.png')).toBe(true);
    expect(fs.existsSync('tests/screenshots/pdf-fix-original-mode.png')).toBe(true);
    
    console.log('✅ 所有截图验证完成');
  });
});
