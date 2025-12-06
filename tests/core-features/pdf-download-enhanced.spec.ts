/**
 * PDF下载功能增强版测试
 * 
 * 测试新增的原版PDF模式和Chrome兼容性修复
 */

import { test, expect, Page } from '@playwright/test';
import path from 'path';

test.describe('PDF下载功能增强版', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主页
    await page.goto('/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待控制面板出现
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 10000 });
  });

  test('PDF下载组件应该显示三种模式', async ({ page }) => {
    console.log('🧪 测试PDF下载三种模式显示');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 点击PDF按钮打开下拉菜单
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 检查三种模式选项
    const originalOption = page.locator('text=原版PDF, text=Original PDF').first();
    const colorOption = page.locator('text=彩色PDF, text=Color PDF').first();
    const grayscaleOption = page.locator('text=黑白PDF, text=Grayscale PDF').first();
    
    await expect(originalOption).toBeVisible();
    await expect(colorOption).toBeVisible();
    await expect(grayscaleOption).toBeVisible();
    
    console.log('✅ 三种PDF模式选项显示正常');
  });

  test('原版PDF模式应该正确工作', async ({ page }) => {
    console.log('🧪 测试原版PDF模式');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 打开下拉菜单
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 监听新窗口打开
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=原版PDF, text=Original PDF').first().click()
    ]);
    
    // 验证新窗口已打开
    expect(newPage).toBeTruthy();
    
    // 等待新窗口加载
    await newPage.waitForLoadState('load');
    
    // 检查新窗口内容
    const bodyContent = await newPage.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    expect(bodyContent!.length).toBeGreaterThan(100);
    
    // 检查原版PDF特有的样式保持
    const bodyStyle = await newPage.locator('body').getAttribute('style');
    console.log('原版PDF body样式:', bodyStyle);
    
    // 关闭新窗口
    await newPage.close();
    
    console.log('✅ 原版PDF模式工作正常');
  });

  test('Chrome浏览器兼容性测试', async ({ page, browserName }) => {
    console.log('🧪 测试Chrome浏览器兼容性');
    
    // 只在Chrome浏览器中运行此测试
    if (browserName !== 'chromium') {
      test.skip();
      return;
    }
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 测试多次快速点击（模拟可能导致中断的场景）
    await pdfButton.click();
    await page.waitForTimeout(300);
    
    // 点击彩色PDF
    const [newPage1] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=彩色PDF, text=Color PDF').first().click()
    ]);
    
    // 验证第一个窗口正常
    await newPage1.waitForLoadState('load');
    expect(newPage1).toBeTruthy();
    
    // 立即测试第二个PDF生成（测试并发处理）
    await page.waitForTimeout(1000);
    await pdfButton.click();
    await page.waitForTimeout(300);
    
    const [newPage2] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=黑白PDF, text=Grayscale PDF').first().click()
    ]);
    
    // 验证第二个窗口也正常
    await newPage2.waitForLoadState('load');
    expect(newPage2).toBeTruthy();
    
    // 清理
    await newPage1.close();
    await newPage2.close();
    
    console.log('✅ Chrome浏览器兼容性测试通过');
  });

  test('PDF生成稳定性测试', async ({ page }) => {
    console.log('🧪 测试PDF生成稳定性');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 连续生成多个PDF测试稳定性
    const modes = ['原版PDF', '彩色PDF', '黑白PDF'];
    const englishModes = ['Original PDF', 'Color PDF', 'Grayscale PDF'];
    
    for (let i = 0; i < modes.length; i++) {
      console.log(`测试模式: ${modes[i]}`);
      
      await pdfButton.click();
      await page.waitForTimeout(500);
      
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        page.locator(`text=${modes[i]}, text=${englishModes[i]}`).first().click()
      ]);
      
      // 验证窗口正常打开和加载
      await newPage.waitForLoadState('load');
      expect(newPage).toBeTruthy();
      
      // 检查内容不为空
      const content = await newPage.locator('body').textContent();
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(50);
      
      await newPage.close();
      
      // 等待一段时间再测试下一个模式
      await page.waitForTimeout(1000);
    }
    
    console.log('✅ PDF生成稳定性测试通过');
  });

  test('PDF加载优化验证', async ({ page }) => {
    console.log('🧪 测试PDF加载优化');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 记录开始时间
    const startTime = Date.now();
    
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=彩色PDF, text=Color PDF').first().click()
    ]);
    
    // 等待页面完全加载
    await newPage.waitForLoadState('networkidle');
    
    // 记录结束时间
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`PDF加载时间: ${loadTime}ms`);
    
    // 验证加载时间在合理范围内（应该在5秒内）
    expect(loadTime).toBeLessThan(5000);
    
    // 验证页面内容正确加载
    const title = await newPage.title();
    expect(title).toContain('简历');
    
    await newPage.close();
    
    console.log('✅ PDF加载优化验证通过');
  });

  test('多语言环境下的PDF生成', async ({ page }) => {
    console.log('🧪 测试多语言环境下的PDF生成');
    
    // 切换到英文
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    await languageSwitcher.click();
    await page.locator('text=English').click();
    await page.waitForTimeout(1000);
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 测试英文环境下的PDF生成
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('text=Original PDF').click()
    ]);
    
    await newPage.waitForLoadState('load');
    
    // 验证PDF标题是英文
    const title = await newPage.title();
    expect(title).toContain('Resume');
    
    await newPage.close();
    
    console.log('✅ 多语言环境下的PDF生成测试通过');
  });

  test('截图验证PDF下载界面更新', async ({ page }) => {
    console.log('📸 截图验证PDF下载界面更新');
    
    // 打开PDF下载下拉菜单
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 截图保存
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'pdf-download-enhanced-menu.png'),
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      }
    });
    
    console.log('📸 PDF下载增强界面截图已保存');
  });
});

test.describe('PDF下载功能 - 错误处理测试', () => {
  test('网络中断情况下的处理', async ({ page }) => {
    console.log('🧪 测试网络中断情况下的处理');
    
    // 模拟网络中断
    await page.route('**/*', route => route.abort());
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 尝试生成PDF，应该有适当的错误处理
    await page.locator('text=彩色PDF, text=Color PDF').first().click();
    
    // 等待一段时间，确保错误处理机制生效
    await page.waitForTimeout(3000);
    
    // 验证按钮状态恢复正常
    await expect(pdfButton).not.toBeDisabled();
    
    console.log('✅ 网络中断情况下的处理测试通过');
  });
});
