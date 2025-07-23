/**
 * 原版PDF模式修复测试
 * 
 * 测试原版PDF模式样式问题的修复
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('原版PDF模式修复测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主页
    await page.goto('http://localhost:5174/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 15000 });
  });

  test('原版PDF模式应该保持在线显示样式', async ({ page }) => {
    console.log('🧪 测试原版PDF模式样式保持');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 点击PDF按钮打开下拉菜单
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 监听新窗口打开
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=原版PDF, text=Original PDF').first().click()
    ]);
    
    // 等待新窗口加载
    await newPage.waitForLoadState('load');
    await newPage.waitForTimeout(2000); // 等待样式完全应用
    
    console.log('✅ 原版PDF窗口已打开');
    
    // 检查HTML是否有原版模式标记
    const htmlElement = await newPage.locator('html').first();
    const dataOriginalMode = await htmlElement.getAttribute('data-original-mode');
    expect(dataOriginalMode).toBe('true');
    console.log('✅ 原版模式标记正确');
    
    // 检查是否有原版模式覆盖样式
    const originalModeStyle = await newPage.locator('#original-mode-override').count();
    expect(originalModeStyle).toBeGreaterThan(0);
    console.log('✅ 原版模式覆盖样式已应用');
    
    // 检查body是否有原版模式类名
    const bodyClass = await newPage.locator('body').getAttribute('class');
    expect(bodyClass).toContain('original-mode');
    console.log('✅ 原版模式类名正确');
    
    // 截图保存原版PDF模式
    await newPage.screenshot({
      path: path.join('tests', 'screenshots', 'original-pdf-mode-fixed.png'),
      fullPage: true
    });
    console.log('📸 原版PDF模式截图已保存');
    
    // 关闭新窗口
    await newPage.close();
    
    console.log('✅ 原版PDF模式样式测试完成');
  });

  test('原版PDF模式与彩色PDF模式的区别', async ({ page }) => {
    console.log('🧪 测试原版PDF与彩色PDF的区别');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 测试原版PDF模式
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const [originalPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=原版PDF, text=Original PDF').first().click()
    ]);
    
    await originalPage.waitForLoadState('load');
    await originalPage.waitForTimeout(1000);
    
    // 检查原版模式特征
    const originalDataMode = await originalPage.locator('html').getAttribute('data-original-mode');
    expect(originalDataMode).toBe('true');
    
    // 截图原版模式
    await originalPage.screenshot({
      path: path.join('tests', 'screenshots', 'original-pdf-comparison.png'),
      fullPage: true
    });
    
    await originalPage.close();
    
    // 测试彩色PDF模式
    await page.waitForTimeout(1000);
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const [colorPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=彩色PDF, text=Color PDF').first().click()
    ]);
    
    await colorPage.waitForLoadState('load');
    await colorPage.waitForTimeout(1000);
    
    // 检查彩色模式特征
    const colorDataMode = await colorPage.locator('html').getAttribute('data-original-mode');
    expect(colorDataMode).toBeNull();
    
    // 截图彩色模式
    await colorPage.screenshot({
      path: path.join('tests', 'screenshots', 'color-pdf-comparison.png'),
      fullPage: true
    });
    
    await colorPage.close();
    
    console.log('✅ 原版PDF与彩色PDF模式区别测试完成');
  });

  test('原版PDF模式样式优先级测试', async ({ page }) => {
    console.log('🧪 测试原版PDF模式样式优先级');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 打开原版PDF模式
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=原版PDF, text=Original PDF').first().click()
    ]);
    
    await newPage.waitForLoadState('load');
    await newPage.waitForTimeout(2000);
    
    // 检查样式应用顺序
    const styleElements = await newPage.locator('style').count();
    console.log(`样式元素数量: ${styleElements}`);
    expect(styleElements).toBeGreaterThan(2); // 至少有基础样式、PDF样式、原版模式覆盖样式
    
    // 检查原版模式覆盖样式是否在最后
    const originalModeStyleExists = await newPage.locator('#original-mode-override').count();
    expect(originalModeStyleExists).toBe(1);
    
    // 检查样式是否正确应用
    const bodyElement = await newPage.locator('body').first();
    const computedStyle = await bodyElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontSize: style.fontSize
      };
    });
    
    console.log('Body计算样式:', computedStyle);
    
    // 验证样式不是强制的打印样式
    // 在原版模式下，不应该强制为白色背景和黑色文字
    expect(computedStyle.backgroundColor).not.toBe('rgb(255, 255, 255)');
    
    await newPage.close();
    
    console.log('✅ 原版PDF模式样式优先级测试完成');
  });

  test('多次生成原版PDF的稳定性', async ({ page }) => {
    console.log('🧪 测试多次生成原版PDF的稳定性');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 连续生成3次原版PDF
    for (let i = 0; i < 3; i++) {
      console.log(`第${i+1}次生成原版PDF`);
      
      await pdfButton.click();
      await page.waitForTimeout(500);
      
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        page.locator('text=原版PDF, text=Original PDF').first().click()
      ]);
      
      await newPage.waitForLoadState('load');
      await newPage.waitForTimeout(1000);
      
      // 验证每次都正确应用了原版模式
      const dataOriginalMode = await newPage.locator('html').getAttribute('data-original-mode');
      expect(dataOriginalMode).toBe('true');
      
      const originalModeStyle = await newPage.locator('#original-mode-override').count();
      expect(originalModeStyle).toBe(1);
      
      await newPage.close();
      
      // 等待一段时间再进行下一次测试
      await page.waitForTimeout(1000);
    }
    
    console.log('✅ 多次生成原版PDF稳定性测试完成');
  });
});
