/**
 * 原版PDF模式样式验证测试
 * 
 * 验证原版PDF模式是否保持与在线显示相同的样式
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('原版PDF模式样式验证', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主页
    await page.goto('http://localhost:5176/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 15000 });
  });

  test('验证原版PDF模式样式问题', async ({ page }) => {
    console.log('🧪 开始验证原版PDF模式样式问题');
    
    // 步骤1: 截图保存正常显示状态
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'normal-display.png'),
      fullPage: true
    });
    console.log('📸 正常显示状态截图已保存');
    
    // 获取正常显示状态下的文字颜色样本
    const normalTextColor = await page.locator('h1, h2, h3, p, span').first().evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log(`正常显示文字颜色: ${normalTextColor}`);
    
    // 步骤2: 点击PDF下载 → 选择"原版PDF"模式
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 监听新窗口打开
    const [pdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=原版PDF, text=Original PDF').first().click()
    ]);
    
    // 等待PDF窗口加载
    await pdfPage.waitForLoadState('load');
    await pdfPage.waitForTimeout(2000); // 等待样式完全应用
    
    console.log('✅ 原版PDF窗口已打开');
    
    // 步骤3: 在PDF窗口中截图
    await pdfPage.screenshot({
      path: path.join('tests', 'screenshots', 'original-pdf-mode.png'),
      fullPage: true
    });
    console.log('📸 原版PDF模式截图已保存');
    
    // 步骤4: 检查PDF窗口中文字元素的computed styles
    const pdfTextElements = await pdfPage.locator('h1, h2, h3, p, span').all();
    const pdfTextColors = [];
    
    for (let i = 0; i < Math.min(5, pdfTextElements.length); i++) {
      const color = await pdfTextElements[i].evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      pdfTextColors.push(color);
    }
    
    console.log('PDF模式文字颜色样本:', pdfTextColors);
    
    // 步骤5: 对比正常显示和PDF模式下的文字颜色差异
    const isColorForced = pdfTextColors.every(color => 
      color === 'rgb(0, 0, 0)' || color === 'black'
    );
    
    if (isColorForced) {
      console.log('❌ 检测到原版PDF模式文字颜色被强制为黑色');
      console.log('问题确认：原版PDF模式样式被全局打印样式覆盖');
      
      // 检查是否有原版模式标记
      const hasOriginalMode = await pdfPage.locator('html[data-original-mode="true"]').count();
      console.log(`原版模式标记存在: ${hasOriginalMode > 0}`);
      
      // 检查是否有覆盖样式
      const hasOverrideStyle = await pdfPage.locator('#original-mode-override').count();
      console.log(`覆盖样式存在: ${hasOverrideStyle > 0}`);
      
      expect(isColorForced).toBe(false);
    } else {
      console.log('✅ 原版PDF模式样式正常，未被强制覆盖');
    }
    
    // 关闭PDF窗口
    await pdfPage.close();
    
    console.log('✅ 原版PDF模式样式验证完成');
  });

  test('分析样式冲突根本原因', async ({ page }) => {
    console.log('🔍 分析样式冲突根本原因');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const [pdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=原版PDF, text=Original PDF').first().click()
    ]);
    
    await pdfPage.waitForLoadState('load');
    await pdfPage.waitForTimeout(2000);
    
    // 分析样式应用情况
    const styleAnalysis = await pdfPage.evaluate(() => {
      const styles = Array.from(document.querySelectorAll('style'));
      const analysis = {
        totalStyles: styles.length,
        hasGlobalPrintStyle: false,
        hasOriginalModeOverride: false,
        printStyleContent: '',
        overrideStyleContent: ''
      };
      
      styles.forEach((style, index) => {
        const content = style.textContent || '';
        if (content.includes('@media print') && content.includes('color: black !important')) {
          analysis.hasGlobalPrintStyle = true;
          analysis.printStyleContent = content.substring(0, 200) + '...';
        }
        if (style.id === 'original-mode-override') {
          analysis.hasOriginalModeOverride = true;
          analysis.overrideStyleContent = content.substring(0, 200) + '...';
        }
      });
      
      return analysis;
    });
    
    console.log('样式分析结果:', styleAnalysis);
    
    // 检查样式优先级
    const priorityTest = await pdfPage.locator('body').evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return {
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        fontSize: computedStyle.fontSize
      };
    });
    
    console.log('Body元素计算样式:', priorityTest);
    
    await pdfPage.close();
    
    console.log('✅ 样式冲突分析完成');
  });
});
