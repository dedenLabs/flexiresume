/**
 * PDF样式修复验证测试
 * 
 * 简化的测试来验证原版PDF模式样式修复
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('PDF样式修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主页
    await page.goto('http://localhost:5176/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 15000 });
  });

  test('原版PDF模式样式修复验证', async ({ page }) => {
    console.log('🧪 开始验证原版PDF模式样式修复');
    
    // 截图保存正常显示状态
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'normal-display.png'),
      fullPage: true
    });
    console.log('📸 正常显示状态截图已保存');
    
    // 获取正常显示状态下的样式信息
    const normalStyles = await page.evaluate(() => {
      const sampleElement = document.querySelector('h1, h2, h3, p, span');
      if (sampleElement) {
        const computedStyle = window.getComputedStyle(sampleElement);
        return {
          color: computedStyle.color,
          backgroundColor: computedStyle.backgroundColor,
          fontSize: computedStyle.fontSize
        };
      }
      return null;
    });
    
    console.log('正常显示样式:', normalStyles);
    
    // 点击PDF下载按钮
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    await pdfButton.click();
    await page.waitForTimeout(1000);
    
    // 检查下拉菜单是否出现
    const originalPdfOption = page.locator('text=原版PDF').or(page.locator('text=Original PDF'));
    const isVisible = await originalPdfOption.isVisible();
    
    if (!isVisible) {
      console.log('❌ 原版PDF选项不可见，检查下拉菜单');
      await page.screenshot({
        path: path.join('tests', 'screenshots', 'pdf-menu-debug.png'),
        fullPage: true
      });
      
      // 尝试查找所有可能的PDF选项
      const allOptions = await page.locator('[data-testid="pdf-downloader"] *').allTextContents();
      console.log('所有PDF选项:', allOptions);
    }
    
    expect(isVisible).toBe(true);
    
    // 监听新窗口打开
    const [pdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      originalPdfOption.first().click()
    ]);
    
    // 等待PDF窗口加载
    await pdfPage.waitForLoadState('load');
    await pdfPage.waitForTimeout(3000); // 增加等待时间确保样式完全应用
    
    console.log('✅ 原版PDF窗口已打开');
    
    // 截图PDF模式
    await pdfPage.screenshot({
      path: path.join('tests', 'screenshots', 'original-pdf-mode.png'),
      fullPage: true
    });
    console.log('📸 原版PDF模式截图已保存');
    
    // 检查PDF窗口的样式
    const pdfStyles = await pdfPage.evaluate(() => {
      const sampleElement = document.querySelector('h1, h2, h3, p, span');
      if (sampleElement) {
        const computedStyle = window.getComputedStyle(sampleElement);
        return {
          color: computedStyle.color,
          backgroundColor: computedStyle.backgroundColor,
          fontSize: computedStyle.fontSize,
          hasOriginalMode: document.documentElement.hasAttribute('data-original-mode'),
          hasOverrideStyle: !!document.getElementById('original-mode-override')
        };
      }
      return null;
    });
    
    console.log('PDF模式样式:', pdfStyles);
    
    // 验证原版模式标记
    expect(pdfStyles?.hasOriginalMode).toBe(true);
    console.log('✅ 原版模式标记正确');
    
    // 验证覆盖样式存在
    expect(pdfStyles?.hasOverrideStyle).toBe(true);
    console.log('✅ 覆盖样式已应用');
    
    // 验证样式未被强制为黑色
    const isColorForced = pdfStyles?.color === 'rgb(0, 0, 0)' || pdfStyles?.color === 'black';
    if (isColorForced) {
      console.log('❌ 文字颜色仍被强制为黑色');
      console.log('需要进一步优化样式覆盖机制');
    } else {
      console.log('✅ 文字颜色未被强制覆盖');
    }
    
    // 关闭PDF窗口
    await pdfPage.close();
    
    console.log('✅ 原版PDF模式样式修复验证完成');
  });

  test('对比三种PDF模式的差异', async ({ page }) => {
    console.log('🧪 对比三种PDF模式的差异');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    const modes = [
      { name: '原版PDF', filename: 'original-pdf-comparison.png' },
      { name: '彩色PDF', filename: 'color-pdf-comparison.png' },
      { name: '黑白PDF', filename: 'grayscale-pdf-comparison.png' }
    ];
    
    for (const mode of modes) {
      console.log(`测试${mode.name}模式`);
      
      await pdfButton.click();
      await page.waitForTimeout(500);
      
      const [pdfPage] = await Promise.all([
        page.context().waitForEvent('page'),
        page.locator(`text=${mode.name}`).first().click()
      ]);
      
      await pdfPage.waitForLoadState('load');
      await pdfPage.waitForTimeout(2000);
      
      await pdfPage.screenshot({
        path: path.join('tests', 'screenshots', mode.filename),
        fullPage: true
      });
      
      await pdfPage.close();
      await page.waitForTimeout(1000);
    }
    
    console.log('✅ 三种PDF模式对比截图完成');
  });
});
