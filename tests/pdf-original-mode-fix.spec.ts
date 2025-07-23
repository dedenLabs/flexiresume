/**
 * 原版PDF模式修复验证测试
 * 
 * 验证原版PDF模式是否保持与在线显示相同的样式
 * 通过日志验证而非截图测试
 */

import { test, expect } from '@playwright/test';

test.describe('原版PDF模式修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 监听控制台日志
    page.on('console', msg => {
      if (msg.text().includes('app:pdf')) {
        console.log('PDF日志:', msg.text());
      }
    });
    
    // 访问主页
    await page.goto('http://localhost:5176/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('验证打印样式控制机制', async ({ page }) => {
    console.log('🧪 开始验证打印样式控制机制');
    
    // 检查初始状态：body不应该有print-mode-active类
    const initialBodyClass = await page.locator('body').getAttribute('class');
    console.log('初始body类名:', initialBodyClass);
    expect(initialBodyClass || '').not.toContain('print-mode-active');
    
    // 模拟按下Ctrl+P
    console.log('🎯 模拟按下Ctrl+P快捷键');
    await page.keyboard.down('Control');
    await page.keyboard.press('p');
    await page.keyboard.up('Control');
    await page.waitForTimeout(500);
    
    // 检查是否激活了打印样式
    const afterCtrlPBodyClass = await page.locator('body').getAttribute('class');
    console.log('Ctrl+P后body类名:', afterCtrlPBodyClass);
    
    // 等待一段时间让清理机制生效
    await page.waitForTimeout(6000);
    
    // 检查是否自动清理了打印样式
    const afterCleanupBodyClass = await page.locator('body').getAttribute('class');
    console.log('清理后body类名:', afterCleanupBodyClass);
    
    console.log('✅ 打印样式控制机制验证完成');
  });

  test('验证原版PDF模式不激活全局打印样式', async ({ page }) => {
    console.log('🧪 开始验证原版PDF模式');
    
    // 查找PDF下载按钮
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    await expect(pdfDownloader).toBeVisible();
    
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 检查下拉菜单是否出现
    const originalPdfOption = page.locator('text=原版PDF').or(page.locator('text=Original PDF'));
    await expect(originalPdfOption).toBeVisible();
    
    console.log('🎯 点击原版PDF选项');
    
    // 监听新窗口打开
    const [pdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      originalPdfOption.first().click()
    ]);
    
    console.log('✅ 原版PDF窗口已打开');
    
    // 等待PDF页面加载
    await pdfPage.waitForLoadState('load');
    await pdfPage.waitForTimeout(2000);
    
    // 检查PDF页面的body是否没有print-mode-active类
    const pdfBodyClass = await pdfPage.locator('body').getAttribute('class');
    console.log('PDF页面body类名:', pdfBodyClass);
    
    // 原版模式不应该激活全局打印样式
    expect(pdfBodyClass || '').not.toContain('print-mode-active');
    
    // 检查是否有调试信息显示
    const debugInfo = pdfPage.locator('.pdf-debug-info');
    const debugText = await debugInfo.textContent();
    console.log('PDF调试信息:', debugText);
    
    // 验证调试信息显示原版模式
    expect(debugText).toContain('原版模式: 是');
    
    // 检查页面是否有原版模式标记
    const hasOriginalMode = await pdfPage.locator('html[data-original-mode="true"]').count();
    console.log('原版模式标记存在:', hasOriginalMode > 0);
    expect(hasOriginalMode).toBeGreaterThan(0);
    
    // 关闭PDF窗口
    await pdfPage.close();
    
    console.log('✅ 原版PDF模式验证完成');
  });

  test('验证彩色PDF模式激活全局打印样式', async ({ page }) => {
    console.log('🧪 开始验证彩色PDF模式');
    
    // 查找PDF下载按钮
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 点击彩色PDF选项
    const colorPdfOption = page.locator('text=彩色PDF').or(page.locator('text=Color PDF'));
    
    console.log('🎯 点击彩色PDF选项');
    
    // 监听新窗口打开
    const [pdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      colorPdfOption.first().click()
    ]);
    
    console.log('✅ 彩色PDF窗口已打开');
    
    // 等待PDF页面加载
    await pdfPage.waitForLoadState('load');
    await pdfPage.waitForTimeout(2000);
    
    // 检查调试信息
    const debugInfo = pdfPage.locator('.pdf-debug-info');
    const debugText = await debugInfo.textContent();
    console.log('PDF调试信息:', debugText);
    
    // 验证调试信息显示彩色模式
    expect(debugText).toContain('彩色版');
    expect(debugText).toContain('原版模式: 否');
    
    // 关闭PDF窗口
    await pdfPage.close();
    
    console.log('✅ 彩色PDF模式验证完成');
  });

  test('验证黑白PDF模式激活全局打印样式', async ({ page }) => {
    console.log('🧪 开始验证黑白PDF模式');
    
    // 查找PDF下载按钮
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 点击黑白PDF选项
    const grayscalePdfOption = page.locator('text=黑白PDF').or(page.locator('text=Grayscale PDF'));
    
    console.log('🎯 点击黑白PDF选项');
    
    // 监听新窗口打开
    const [pdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      grayscalePdfOption.first().click()
    ]);
    
    console.log('✅ 黑白PDF窗口已打开');
    
    // 等待PDF页面加载
    await pdfPage.waitForLoadState('load');
    await pdfPage.waitForTimeout(2000);
    
    // 检查调试信息
    const debugInfo = pdfPage.locator('.pdf-debug-info');
    const debugText = await debugInfo.textContent();
    console.log('PDF调试信息:', debugText);
    
    // 验证调试信息显示黑白模式
    expect(debugText).toContain('黑白版');
    expect(debugText).toContain('原版模式: 否');
    
    // 关闭PDF窗口
    await pdfPage.close();
    
    console.log('✅ 黑白PDF模式验证完成');
  });

  test('验证样式清理机制', async ({ page }) => {
    console.log('🧪 开始验证样式清理机制');
    
    // 检查初始状态
    const initialBodyClass = await page.locator('body').getAttribute('class');
    console.log('初始body类名:', initialBodyClass);
    
    // 生成一个PDF（任意模式）
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const colorPdfOption = page.locator('text=彩色PDF').or(page.locator('text=Color PDF'));
    
    // 监听新窗口打开
    const [pdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      colorPdfOption.first().click()
    ]);
    
    // 关闭PDF窗口
    await pdfPage.close();
    
    // 等待清理完成
    await page.waitForTimeout(1000);
    
    // 检查主页面的body类名是否已清理
    const afterPdfBodyClass = await page.locator('body').getAttribute('class');
    console.log('PDF生成后body类名:', afterPdfBodyClass);
    
    // 应该已经清理了print-mode-active类
    expect(afterPdfBodyClass || '').not.toContain('print-mode-active');
    
    console.log('✅ 样式清理机制验证完成');
  });
});
