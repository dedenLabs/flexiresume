import { test, expect } from '@playwright/test';

test.describe('PDF打印修复测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5179/');
    await page.waitForLoadState('networkidle');
  });

  test('黑暗模式下标准打印背景应为白色', async ({ page }) => {
    // 切换到黑暗模式
    const themeButton = page.locator('[data-testid="theme-toggle"]');
    await themeButton.click();
    await page.waitForTimeout(1000);

    // 验证当前是黑暗模式
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('data-theme', 'dark');

    // 打开PDF下载器
    const pdfButton = page.locator('[data-testid="pdf-downloader-button"]');
    await pdfButton.click();
    await page.waitForTimeout(500);

    // 点击标准打印（彩色）
    const colorButton = page.locator('text=彩色打印');
    await colorButton.click();
    await page.waitForTimeout(2000);

    // 检查打印样式是否正确应用
    const printStyles = await page.evaluate(() => {
      const styleElement = document.getElementById('temp-pdf-print-style');
      return styleElement ? styleElement.textContent : null;
    });

    // 验证样式中不包含强制所有元素为白色背景的规则
    expect(printStyles).not.toContain('* { background-color: white !important;');
    
    // 验证包含正确的背景设置
    expect(printStyles).toContain('html, body, #root');
    expect(printStyles).toContain('[data-testid="resume-content"]');

    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/dark-mode-standard-print.png',
      fullPage: true 
    });

    console.log('✅ 黑暗模式标准打印背景修复验证通过');
  });

  test('技能标签多语言兼容性测试', async ({ page }) => {
    // 测试中文版技能标签
    await page.goto('http://localhost:5179/?lang=zh');
    await page.waitForLoadState('networkidle');

    // 打开PDF下载器
    const pdfButton = page.locator('[data-testid="pdf-downloader-button"]');
    await pdfButton.click();
    await page.waitForTimeout(500);

    // 点击标准打印
    const colorButton = page.locator('text=彩色打印');
    await colorButton.click();
    await page.waitForTimeout(1000);

    // 检查中文技能标签样式
    const zhSkillStyles = await page.evaluate(() => {
      const styleElement = document.getElementById('temp-pdf-print-style');
      const content = styleElement ? styleElement.textContent : '';
      return {
        hasZhSkills: content.includes('span[title*="了解"]'),
        hasEnSkills: content.includes('span[title*="Basic"]'),
        hasCommonStyles: content.includes('.skill-item')
      };
    });

    expect(zhSkillStyles.hasZhSkills).toBe(true);
    expect(zhSkillStyles.hasEnSkills).toBe(true);
    expect(zhSkillStyles.hasCommonStyles).toBe(true);

    // 切换到英文版
    await page.goto('http://localhost:5179/?lang=en');
    await page.waitForLoadState('networkidle');

    // 再次测试PDF打印
    const pdfButtonEn = page.locator('[data-testid="pdf-downloader-button"]');
    await pdfButtonEn.click();
    await page.waitForTimeout(500);

    const colorButtonEn = page.locator('text=Color Print');
    await colorButtonEn.click();
    await page.waitForTimeout(1000);

    // 验证英文版也包含所有技能标签样式
    const enSkillStyles = await page.evaluate(() => {
      const styleElement = document.getElementById('temp-pdf-print-style');
      const content = styleElement ? styleElement.textContent : '';
      return {
        hasZhSkills: content.includes('span[title*="了解"]'),
        hasEnSkills: content.includes('span[title*="Basic"]'),
        hasCommonStyles: content.includes('.skill-item')
      };
    });

    expect(enSkillStyles.hasZhSkills).toBe(true);
    expect(enSkillStyles.hasEnSkills).toBe(true);
    expect(enSkillStyles.hasCommonStyles).toBe(true);

    // 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/multilang-skill-styles.png',
      fullPage: true 
    });

    console.log('✅ 技能标签多语言兼容性验证通过');
  });

  test('样式常量优化验证', async ({ page }) => {
    // 打开PDF下载器
    const pdfButton = page.locator('[data-testid="pdf-downloader-button"]');
    await pdfButton.click();
    await page.waitForTimeout(500);

    // 测试原版模式
    const originalButton = page.locator('text=原版模式');
    await originalButton.click();
    await page.waitForTimeout(1000);

    const originalStyles = await page.evaluate(() => {
      const styleElement = document.getElementById('temp-pdf-print-style');
      return styleElement ? styleElement.textContent : '';
    });

    // 验证使用了样式常量
    expect(originalStyles).toContain('-webkit-print-color-adjust: exact !important');
    expect(originalStyles).toContain('color-adjust: exact !important');
    expect(originalStyles).toContain('print-color-adjust: exact !important');

    // 验证技能标签样式被正确应用
    expect(originalStyles).toContain('.skill-item');
    expect(originalStyles).toContain('[class*="skill"]');

    console.log('✅ 样式常量优化验证通过');
  });

  test('打印模式切换测试', async ({ page }) => {
    const pdfButton = page.locator('[data-testid="pdf-downloader-button"]');
    await pdfButton.click();
    await page.waitForTimeout(500);

    // 测试所有三种模式
    const modes = [
      { button: 'text=彩色打印', name: 'color' },
      { button: 'text=黑白打印', name: 'grayscale' },
      { button: 'text=原版模式', name: 'original' }
    ];

    for (const mode of modes) {
      const modeButton = page.locator(mode.button);
      await modeButton.click();
      await page.waitForTimeout(1000);

      const styles = await page.evaluate(() => {
        const styleElement = document.getElementById('temp-pdf-print-style');
        return styleElement ? styleElement.textContent : '';
      });

      // 验证样式不为空
      expect(styles.length).toBeGreaterThan(0);
      
      // 验证包含基本的打印样式
      expect(styles).toContain('@media print');
      expect(styles).toContain('@page');

      console.log(`✅ ${mode.name} 模式样式验证通过`);
    }

    // 最终截图
    await page.screenshot({ 
      path: 'tests/screenshots/print-modes-test.png',
      fullPage: true 
    });
  });
});
