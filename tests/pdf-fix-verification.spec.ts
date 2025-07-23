import { test, expect } from '@playwright/test';

test.describe('PDF打印修复验证', () => {
  test('验证黑暗模式标准打印背景修复', async ({ page }) => {
    console.log('🧪 开始黑暗模式标准打印背景修复验证');
    
    await page.goto('http://localhost:5179/');
    await page.waitForLoadState('networkidle');
    
    // 切换到黑暗模式
    const themeButton = page.locator('[data-testid="theme-toggle"]');
    await themeButton.click();
    await page.waitForTimeout(1000);
    
    // 验证当前是黑暗模式
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('data-theme', 'dark');
    console.log('✅ 已切换到黑暗模式');
    
    // 打开PDF下载器
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 点击彩色打印
    const colorButton = page.locator('text=彩色打印');
    await colorButton.click();
    await page.waitForTimeout(2000);
    
    // 检查打印样式
    const printStylesInfo = await page.evaluate(() => {
      const styleElement = document.getElementById('temp-pdf-print-style');
      if (!styleElement) return { exists: false };
      
      const content = styleElement.textContent || '';
      return {
        exists: true,
        hasProblematicRule: content.includes('* { background-color: white !important;') || 
                           content.includes('*{background-color:white!important;'),
        hasCorrectRootRules: content.includes('html, body, #root') && 
                           content.includes('background: white !important'),
        hasResumeContentRules: content.includes('[data-testid="resume-content"]') &&
                              content.includes('background: white !important'),
        hasSkillSelectors: content.includes('span[title*="了解"]') && 
                          content.includes('span[title*="Basic"]'),
        contentLength: content.length
      };
    });
    
    expect(printStylesInfo.exists).toBe(true);
    expect(printStylesInfo.hasProblematicRule).toBe(false);
    expect(printStylesInfo.hasCorrectRootRules).toBe(true);
    expect(printStylesInfo.hasResumeContentRules).toBe(true);
    expect(printStylesInfo.hasSkillSelectors).toBe(true);
    
    console.log('✅ 打印样式验证通过:', printStylesInfo);
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/dark-mode-print-fix.png',
      fullPage: true 
    });
    
    console.log('🎉 黑暗模式标准打印背景修复验证完成');
  });

  test('验证技能标签多语言兼容性', async ({ page }) => {
    console.log('🧪 开始技能标签多语言兼容性验证');
    
    await page.goto('http://localhost:5179/');
    await page.waitForLoadState('networkidle');
    
    // 打开PDF下载器并测试
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const colorButton = page.locator('text=彩色打印');
    await colorButton.click();
    await page.waitForTimeout(1000);
    
    // 检查技能标签样式
    const skillStylesInfo = await page.evaluate(() => {
      const styleElement = document.getElementById('temp-pdf-print-style');
      if (!styleElement) return { exists: false };
      
      const content = styleElement.textContent || '';
      
      // 检查中文技能等级
      const zhSkills = ['了解', '熟练', '精通'];
      const hasZhSkills = zhSkills.every(skill => 
        content.includes(`span[title*="${skill}"]`)
      );
      
      // 检查英文技能等级
      const enSkills = ['Basic', 'Proficient', 'Expert', 'Familiar', 'Experienced', 'Advanced'];
      const hasEnSkills = enSkills.every(skill => 
        content.includes(`span[title*="${skill}"]`)
      );
      
      return {
        exists: true,
        hasZhSkills,
        hasEnSkills,
        hasCommonSkillStyles: content.includes('.skill-item') && 
                             content.includes('[class*="skill"]'),
        hasPrintColorAdjust: content.includes('-webkit-print-color-adjust: exact !important')
      };
    });
    
    expect(skillStylesInfo.exists).toBe(true);
    expect(skillStylesInfo.hasZhSkills).toBe(true);
    expect(skillStylesInfo.hasEnSkills).toBe(true);
    expect(skillStylesInfo.hasCommonSkillStyles).toBe(true);
    expect(skillStylesInfo.hasPrintColorAdjust).toBe(true);
    
    console.log('✅ 技能标签样式验证通过:', skillStylesInfo);
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/skill-multilang-fix.png',
      fullPage: true 
    });
    
    console.log('🎉 技能标签多语言兼容性验证完成');
  });

  test('验证样式常量优化', async ({ page }) => {
    console.log('🧪 开始样式常量优化验证');
    
    await page.goto('http://localhost:5179/');
    await page.waitForLoadState('networkidle');
    
    // 测试原版模式
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const originalButton = page.locator('text=原版模式');
    await originalButton.click();
    await page.waitForTimeout(1000);
    
    // 检查样式常量使用
    const styleConstantsInfo = await page.evaluate(() => {
      const styleElement = document.getElementById('temp-pdf-print-style');
      if (!styleElement) return { exists: false };
      
      const content = styleElement.textContent || '';
      
      // 检查是否使用了样式常量（通过检查重复的样式规则）
      const printColorAdjustCount = (content.match(/-webkit-print-color-adjust: exact !important/g) || []).length;
      const colorAdjustCount = (content.match(/color-adjust: exact !important/g) || []).length;
      
      return {
        exists: true,
        printColorAdjustCount,
        colorAdjustCount,
        hasSkillStyles: content.includes('.skill-item'),
        contentLength: content.length,
        isOptimized: printColorAdjustCount > 5 && colorAdjustCount > 5 // 说明使用了常量
      };
    });
    
    expect(styleConstantsInfo.exists).toBe(true);
    expect(styleConstantsInfo.isOptimized).toBe(true);
    
    console.log('✅ 样式常量优化验证通过:', styleConstantsInfo);
    
    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/style-constants-fix.png',
      fullPage: true 
    });
    
    console.log('🎉 样式常量优化验证完成');
  });
});
