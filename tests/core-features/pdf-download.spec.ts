/**
 * PDF下载功能测试
 * 
 * 测试PDF下载组件的功能和用户交互
 */

import { test, expect, Page } from '@playwright/test';
import path from 'path';

test.describe('PDF下载功能', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主页
    await page.goto('/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 10000 });
  });

  test('PDF下载组件应该正确显示', async ({ page }) => {
    console.log('🧪 测试PDF下载组件显示');
    
    // 查找PDF下载组件
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    await expect(pdfDownloader).toBeVisible();
    
    // 检查PDF按钮
    const pdfButton = pdfDownloader.locator('button').first();
    await expect(pdfButton).toBeVisible();
    await expect(pdfButton).toContainText('PDF');
    
    console.log('✅ PDF下载组件显示正常');
  });

  test('PDF下载下拉菜单应该正确工作', async ({ page }) => {
    console.log('🧪 测试PDF下载下拉菜单');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 点击PDF按钮打开下拉菜单
    await pdfButton.click();
    
    // 等待下拉菜单出现
    await page.waitForTimeout(500);
    
    // 检查下拉菜单选项
    const colorOption = page.locator('text=彩色PDF, text=Color PDF').first();
    const grayscaleOption = page.locator('text=黑白PDF, text=Grayscale PDF').first();
    
    await expect(colorOption).toBeVisible();
    await expect(grayscaleOption).toBeVisible();
    
    console.log('✅ PDF下载下拉菜单工作正常');
  });

  test('应该支持语言切换后的PDF下载', async ({ page }) => {
    console.log('🧪 测试语言切换后的PDF下载');
    
    // 切换到英文
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    await languageSwitcher.click();
    
    // 选择英文
    await page.locator('text=English').click();
    await page.waitForTimeout(1000);
    
    // 检查PDF下载组件的英文显示
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 检查英文选项
    const colorOption = page.locator('text=Color PDF');
    const grayscaleOption = page.locator('text=Grayscale PDF');
    
    await expect(colorOption).toBeVisible();
    await expect(grayscaleOption).toBeVisible();
    
    console.log('✅ 语言切换后PDF下载功能正常');
  });

  test('应该支持主题切换后的PDF下载', async ({ page }) => {
    console.log('🧪 测试主题切换后的PDF下载');
    
    // 切换到深色主题
    const themeSwitcher = page.locator('[data-theme-switcher]');
    await themeSwitcher.click();
    await page.waitForTimeout(1000);
    
    // 检查PDF下载组件在深色主题下的显示
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    await expect(pdfDownloader).toBeVisible();
    
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 检查下拉菜单在深色主题下的显示
    const colorOption = page.locator('text=彩色PDF, text=Color PDF').first();
    await expect(colorOption).toBeVisible();
    
    console.log('✅ 主题切换后PDF下载功能正常');
  });

  test('PDF生成功能应该正确触发', async ({ page }) => {
    console.log('🧪 测试PDF生成功能');
    
    // 监听新窗口打开
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      (async () => {
        const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
        const pdfButton = pdfDownloader.locator('button').first();
        
        // 打开下拉菜单
        await pdfButton.click();
        await page.waitForTimeout(500);
        
        // 点击彩色PDF选项
        const colorOption = page.locator('text=彩色PDF, text=Color PDF').first();
        await colorOption.click();
      })()
    ]);
    
    // 验证新窗口已打开
    expect(newPage).toBeTruthy();
    
    // 等待新窗口加载
    await newPage.waitForLoadState('load');
    
    // 检查新窗口内容
    const bodyContent = await newPage.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    expect(bodyContent!.length).toBeGreaterThan(100);
    
    // 关闭新窗口
    await newPage.close();
    
    console.log('✅ PDF生成功能正确触发');
  });

  test('PDF下载在不同页面路由下应该正常工作', async ({ page }) => {
    console.log('🧪 测试不同页面路由下的PDF下载');
    
    const routes = ['/frontend', '/backend', '/game'];
    
    for (const route of routes) {
      console.log(`测试路由: ${route}`);
      
      // 导航到指定路由
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      // 等待控制面板出现
      await page.waitForSelector('[data-testid="control-panel"]', { timeout: 10000 });
      
      // 检查PDF下载组件
      const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
      await expect(pdfDownloader).toBeVisible();
      
      // 测试下拉菜单
      const pdfButton = pdfDownloader.locator('button').first();
      await pdfButton.click();
      await page.waitForTimeout(500);
      
      const colorOption = page.locator('text=彩色PDF, text=Color PDF').first();
      await expect(colorOption).toBeVisible();
      
      // 关闭下拉菜单
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    
    console.log('✅ 不同页面路由下PDF下载功能正常');
  });

  test('PDF下载组件应该正确处理加载状态', async ({ page }) => {
    console.log('🧪 测试PDF下载加载状态');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 打开下拉菜单
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 点击彩色PDF选项并立即检查加载状态
    const colorOption = page.locator('text=彩色PDF, text=Color PDF').first();
    
    // 监听新窗口，但不等待
    const newPagePromise = page.context().waitForEvent('page');
    await colorOption.click();
    
    // 检查按钮是否显示加载状态
    await page.waitForTimeout(100);
    
    // 等待新窗口并关闭
    const newPage = await newPagePromise;
    await newPage.close();
    
    // 等待加载状态结束
    await page.waitForTimeout(2000);
    
    // 检查按钮是否恢复正常状态
    await expect(pdfButton).toContainText('PDF');
    await expect(pdfButton).not.toBeDisabled();
    
    console.log('✅ PDF下载加载状态处理正确');
  });

  test('截图验证PDF下载界面', async ({ page }) => {
    console.log('📸 截图验证PDF下载界面');
    
    // 打开PDF下载下拉菜单
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 截图保存
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'pdf-download-menu.png'),
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      }
    });
    
    console.log('📸 PDF下载界面截图已保存');
  });
});

test.describe('PDF下载功能 - 响应式测试', () => {
  test('移动端PDF下载功能', async ({ page }) => {
    console.log('📱 测试移动端PDF下载功能');
    
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 10000 });
    
    // 检查PDF下载组件在移动端的显示
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    await expect(pdfDownloader).toBeVisible();
    
    console.log('✅ 移动端PDF下载功能正常');
  });
});
