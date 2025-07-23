/**
 * 简化的PDF下载功能测试
 */

import { test, expect } from '@playwright/test';

test.describe('PDF下载功能 - 简化测试', () => {
  test('PDF下载组件基本功能验证', async ({ page }) => {
    console.log('🧪 开始PDF下载基本功能测试');
    
    // 访问主页
    await page.goto('http://localhost:5179/');
    
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
    
    // 截图保存当前状态
    await page.screenshot({
      path: 'tests/screenshots/pdf-download-test.png',
      fullPage: true
    });
    console.log('📸 测试截图已保存');
    
    console.log('🎉 PDF下载基本功能测试完成');
  });
});
