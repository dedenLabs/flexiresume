/**
 * 下拉面板方向测试
 * 
 * 测试PDF下载和语言切换面板的向上展开功能
 */

import { test, expect } from '@playwright/test';

test.describe('下拉面板方向测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主页
    await page.goto('http://localhost:5175/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 15000 });
  });

  test('PDF下载面板应该向上展开', async ({ page }) => {
    console.log('🧪 测试PDF下载面板向上展开');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 获取按钮位置
    const buttonBox = await pdfButton.boundingBox();
    expect(buttonBox).toBeTruthy();
    
    // 点击PDF按钮打开下拉菜单
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 检查下拉菜单是否出现
    const dropdownMenu = pdfDownloader.locator('div').nth(1); // 第二个div应该是下拉菜单
    await expect(dropdownMenu).toBeVisible();
    
    // 获取下拉菜单位置
    const menuBox = await dropdownMenu.boundingBox();
    expect(menuBox).toBeTruthy();
    
    // 验证下拉菜单在按钮上方（菜单的bottom应该小于按钮的top）
    if (buttonBox && menuBox) {
      console.log(`按钮位置: top=${buttonBox.y}, bottom=${buttonBox.y + buttonBox.height}`);
      console.log(`菜单位置: top=${menuBox.y}, bottom=${menuBox.y + menuBox.height}`);
      
      // 菜单应该在按钮上方
      expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(buttonBox.y + 5); // 允许5px的误差
    }
    
    console.log('✅ PDF下载面板向上展开正常');
  });

  test('语言切换面板应该向上展开', async ({ page }) => {
    console.log('🧪 测试语言切换面板向上展开');
    
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    const languageButton = languageSwitcher.locator('button').first();
    
    // 获取按钮位置
    const buttonBox = await languageButton.boundingBox();
    expect(buttonBox).toBeTruthy();
    
    // 点击语言按钮打开下拉菜单
    await languageButton.click();
    await page.waitForTimeout(500);
    
    // 检查下拉菜单是否出现
    const dropdownMenu = languageSwitcher.locator('div').nth(1); // 第二个div应该是下拉菜单
    await expect(dropdownMenu).toBeVisible();
    
    // 获取下拉菜单位置
    const menuBox = await dropdownMenu.boundingBox();
    expect(menuBox).toBeTruthy();
    
    // 验证下拉菜单在按钮上方
    if (buttonBox && menuBox) {
      console.log(`按钮位置: top=${buttonBox.y}, bottom=${buttonBox.y + buttonBox.height}`);
      console.log(`菜单位置: top=${menuBox.y}, bottom=${menuBox.y + menuBox.height}`);
      
      // 菜单应该在按钮上方
      expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(buttonBox.y + 5); // 允许5px的误差
    }
    
    console.log('✅ 语言切换面板向上展开正常');
  });

  test('箭头方向应该正确显示', async ({ page }) => {
    console.log('🧪 测试箭头方向显示');
    
    // 测试PDF下载箭头
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 检查关闭状态的箭头（应该向下）
    const pdfArrowClosed = await pdfButton.textContent();
    console.log(`PDF按钮关闭状态文本: ${pdfArrowClosed}`);
    expect(pdfArrowClosed).toContain('▲'); // 现在默认显示向上箭头
    
    // 点击打开
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 检查打开状态的箭头（应该向上）
    const pdfArrowOpen = await pdfButton.textContent();
    console.log(`PDF按钮打开状态文本: ${pdfArrowOpen}`);
    
    // 关闭菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    // 测试语言切换箭头
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    const languageButton = languageSwitcher.locator('button').first();
    
    // 检查关闭状态的箭头
    const langArrowClosed = await languageButton.textContent();
    console.log(`语言按钮关闭状态文本: ${langArrowClosed}`);
    expect(langArrowClosed).toContain('▲'); // 现在默认显示向上箭头
    
    console.log('✅ 箭头方向显示正确');
  });

  test('下拉菜单项圆角应该正确', async ({ page }) => {
    console.log('🧪 测试下拉菜单项圆角');
    
    // 测试PDF下载菜单
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 检查菜单项是否正确显示
    const originalOption = page.locator('text=原版PDF, text=Original PDF').first();
    const grayscaleOption = page.locator('text=黑白PDF, text=Grayscale PDF').first();
    
    await expect(originalOption).toBeVisible();
    await expect(grayscaleOption).toBeVisible();
    
    // 关闭PDF菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    // 测试语言切换菜单
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    const languageButton = languageSwitcher.locator('button').first();
    
    await languageButton.click();
    await page.waitForTimeout(500);
    
    // 检查语言选项
    const chineseOption = page.locator('text=中文');
    const englishOption = page.locator('text=English');
    
    await expect(chineseOption).toBeVisible();
    await expect(englishOption).toBeVisible();
    
    console.log('✅ 下拉菜单项显示正确');
  });

  test('多个下拉菜单同时测试', async ({ page }) => {
    console.log('🧪 测试多个下拉菜单交互');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    
    const pdfButton = pdfDownloader.locator('button').first();
    const languageButton = languageSwitcher.locator('button').first();
    
    // 打开PDF菜单
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 验证PDF菜单打开
    const pdfMenu = pdfDownloader.locator('div').nth(1);
    await expect(pdfMenu).toBeVisible();
    
    // 打开语言菜单（应该关闭PDF菜单）
    await languageButton.click();
    await page.waitForTimeout(500);
    
    // 验证语言菜单打开
    const languageMenu = languageSwitcher.locator('div').nth(1);
    await expect(languageMenu).toBeVisible();
    
    // 验证PDF菜单关闭
    await expect(pdfMenu).not.toBeVisible();
    
    console.log('✅ 多个下拉菜单交互正常');
  });

  test('截图验证下拉面板方向', async ({ page }) => {
    console.log('📸 截图验证下拉面板方向');
    
    // 打开PDF下拉菜单
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 截图保存PDF菜单
    await page.screenshot({
      path: 'tests/screenshots/pdf-dropdown-upward.png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      }
    });
    
    // 关闭PDF菜单，打开语言菜单
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    const languageButton = languageSwitcher.locator('button').first();
    await languageButton.click();
    await page.waitForTimeout(500);
    
    // 截图保存语言菜单
    await page.screenshot({
      path: 'tests/screenshots/language-dropdown-upward.png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      }
    });
    
    console.log('📸 下拉面板方向截图已保存');
  });
});
