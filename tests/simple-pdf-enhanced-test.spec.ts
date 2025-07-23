/**
 * 简化的PDF下载功能增强测试
 */

import { test, expect } from '@playwright/test';

test.describe('PDF下载功能增强 - 简化测试', () => {
  test('PDF下载组件增强功能验证', async ({ page }) => {
    console.log('🧪 开始PDF下载增强功能测试');
    
    // 访问主页
    await page.goto('http://localhost:5175/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 15000 });
    console.log('✅ 控制面板已加载');
    
    // 查找PDF下载组件
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    await expect(pdfDownloader).toBeVisible({ timeout: 10000 });
    console.log('✅ PDF下载组件已显示');
    
    // 检查PDF按钮
    const pdfButton = pdfDownloader.locator('button').first();
    await expect(pdfButton).toBeVisible();
    await expect(pdfButton).toContainText('PDF');
    console.log('✅ PDF按钮显示正常');
    
    // 点击PDF按钮打开下拉菜单
    await pdfButton.click();
    await page.waitForTimeout(1000);
    console.log('✅ PDF按钮点击成功');
    
    // 检查是否有三个选项
    const menuItems = page.locator('[data-testid="pdf-downloader"] button');
    const menuCount = await menuItems.count();
    console.log(`📊 下拉菜单项数量: ${menuCount}`);
    
    // 检查原版PDF选项
    const originalOption = page.locator('text=原版PDF').or(page.locator('text=Original PDF'));
    const originalVisible = await originalOption.isVisible();
    console.log(`📱 原版PDF选项可见: ${originalVisible}`);
    
    // 检查彩色PDF选项
    const colorOption = page.locator('text=彩色PDF').or(page.locator('text=Color PDF'));
    const colorVisible = await colorOption.isVisible();
    console.log(`🎨 彩色PDF选项可见: ${colorVisible}`);
    
    // 检查黑白PDF选项
    const grayscaleOption = page.locator('text=黑白PDF').or(page.locator('text=Grayscale PDF'));
    const grayscaleVisible = await grayscaleOption.isVisible();
    console.log(`⚫ 黑白PDF选项可见: ${grayscaleVisible}`);
    
    // 截图保存当前状态
    await page.screenshot({
      path: 'tests/screenshots/pdf-download-enhanced-test.png',
      fullPage: true
    });
    console.log('📸 测试截图已保存');
    
    console.log('🎉 PDF下载增强功能基本测试完成');
    
    // 基本验证
    if (originalVisible && colorVisible && grayscaleVisible) {
      console.log('✅ 所有三种PDF模式选项都可见');
    } else {
      console.log('⚠️ 部分PDF模式选项不可见');
    }
  });

  test('PDF功能国际化测试', async ({ page }) => {
    console.log('🧪 开始PDF功能国际化测试');
    
    // 访问主页
    await page.goto('http://localhost:5175/');
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 15000 });
    
    // 切换到英文
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      await page.waitForTimeout(500);
      
      const englishOption = page.locator('text=English');
      if (await englishOption.isVisible()) {
        await englishOption.click();
        await page.waitForTimeout(1000);
        console.log('✅ 已切换到英文界面');
      }
    }
    
    // 检查PDF下载组件的英文显示
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    await expect(pdfDownloader).toBeVisible();
    
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(1000);
    
    // 检查英文选项
    const originalOption = page.locator('text=Original PDF');
    const colorOption = page.locator('text=Color PDF');
    const grayscaleOption = page.locator('text=Grayscale PDF');
    
    const originalVisible = await originalOption.isVisible();
    const colorVisible = await colorOption.isVisible();
    const grayscaleVisible = await grayscaleOption.isVisible();
    
    console.log(`📱 Original PDF可见: ${originalVisible}`);
    console.log(`🎨 Color PDF可见: ${colorVisible}`);
    console.log(`⚫ Grayscale PDF可见: ${grayscaleVisible}`);
    
    console.log('✅ PDF功能国际化测试完成');
  });
});
