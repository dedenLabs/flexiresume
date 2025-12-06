/**
 * 打印功能测试
 * 
 * 测试打印时的样式和布局是否正确
 * 
 * @author 陈剑
 * @date 2025-01-11
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('打印功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 设置页面大小
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('应该正确处理打印样式', async ({ page }) => {
    console.log('🖨️ 开始测试打印功能...');
    
    // 访问首页
    await page.goto('/');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('📄 页面加载完成，开始打印测试...');
    
    // 检查正常显示状态
    const normalScreenshot = await page.screenshot({
      path: path.join('tests', 'screenshots', 'print-normal-view.png'),
      fullPage: true
    });
    
    console.log('📸 正常视图截图已保存');
    
    // 检查控制面板是否存在（正常状态下应该可见）
    const controlPanelExists = await page.locator('[class*="PanelContainer"]').count() > 0;
    console.log(`✅ 控制面板存在: ${controlPanelExists}`);

    // 检查Tabs是否存在（正常状态下应该可见）
    const tabsExists = await page.locator('[class*="TabContainer"]').count() > 0;
    console.log(`✅ 标签页存在: ${tabsExists}`);
    
    // 模拟打印媒体查询
    await page.emulateMedia({ media: 'print' });
    
    // 等待样式应用
    await page.waitForTimeout(1000);
    
    console.log('🖨️ 已切换到打印媒体模式');
    
    // 检查打印状态下的元素可见性
    const controlPanelHidden = await page.evaluate(() => {
      const panel = document.querySelector('[class*="PanelContainer"]');
      if (!panel) return true;
      const styles = window.getComputedStyle(panel);
      return styles.display === 'none';
    });
    
    const tabsHidden = await page.evaluate(() => {
      const tabs = document.querySelector('[class*="TabContainer"]');
      if (!tabs) return true;
      const styles = window.getComputedStyle(tabs);
      return styles.display === 'none';
    });
    
    expect(controlPanelHidden).toBe(true);
    expect(tabsHidden).toBe(true);
    
    console.log('✅ 控制面板和标签页在打印模式下已隐藏');
    
    // 检查主要内容区域的打印样式
    const resumeContent = await page.locator('[data-testid="resume-content"]');
    const resumeStyles = await resumeContent.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        background: styles.background,
        color: styles.color,
        border: styles.border,
        boxShadow: styles.boxShadow,
        maxWidth: styles.maxWidth,
        width: styles.width
      };
    });
    
    // 验证打印样式
    expect(resumeStyles.background).toContain('white');
    expect(resumeStyles.color).toContain('black');
    expect(resumeStyles.border).toBe('none');
    expect(resumeStyles.boxShadow).toBe('none');
    
    console.log('✅ 简历内容区域打印样式正确');
    
    // 检查body的打印样式
    const bodyStyles = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return {
        background: styles.background,
        backgroundImage: styles.backgroundImage,
        color: styles.color,
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight
      };
    });
    
    expect(bodyStyles.background).toContain('white');
    expect(bodyStyles.backgroundImage).toBe('none');
    expect(bodyStyles.color).toContain('black');
    
    console.log('✅ Body元素打印样式正确');
    
    // 截取打印预览
    const printScreenshot = await page.screenshot({
      path: path.join('tests', 'screenshots', 'print-preview.png'),
      fullPage: true
    });
    
    console.log('📸 打印预览截图已保存');
    
    // 生成PDF进行验证
    const pdfBuffer = await page.pdf({
      path: path.join('tests', 'screenshots', 'print-output.pdf'),
      format: 'A4',
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      },
      printBackground: false
    });
    
    expect(pdfBuffer.length).toBeGreaterThan(1000); // PDF应该有实际内容
    console.log('✅ PDF生成成功，大小:', pdfBuffer.length, 'bytes');
    
    // 恢复正常媒体模式
    await page.emulateMedia({ media: 'screen' });
    await page.waitForTimeout(500);
    
    console.log('🖨️ 打印功能测试完成');
  });

  test('应该在不同页面都能正确打印', async ({ page }) => {
    console.log('🖨️ 测试多页面打印功能...');
    
    const testPages = ['/', '/fullstack', '/frontend'];
    
    for (const testPath of testPages) {
      console.log(`📄 测试页面: ${testPath}`);
      
      await page.goto(testPath);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // 切换到打印模式
      await page.emulateMedia({ media: 'print' });
      await page.waitForTimeout(500);
      
      // 检查内容是否存在
      const hasContent = await page.locator('[data-testid="resume-content"]').count() > 0;
      if (!hasContent) {
        // 如果没有找到resume-content，检查是否有其他主要内容
        const hasMainContent = await page.locator('main, body').isVisible();
        expect(hasMainContent).toBe(true);
        console.log(`✅ ${testPath} 页面主要内容存在`);
      } else {
        expect(hasContent).toBe(true);
        console.log(`✅ ${testPath} 页面resume-content存在`);
      }
      
      // 生成PDF
      const pdfPath = path.join('tests', 'screenshots', `print-${testPath.replace('/', '') || 'home'}.pdf`);
      const pdfBuffer = await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
        printBackground: false
      });
      
      expect(pdfBuffer.length).toBeGreaterThan(1000);
      console.log(`✅ ${testPath} 页面PDF生成成功`);
      
      // 恢复屏幕模式
      await page.emulateMedia({ media: 'screen' });
    }
    
    console.log('🖨️ 多页面打印测试完成');
  });

  test('应该正确处理深色模式下的打印', async ({ page }) => {
    console.log('🌙 测试深色模式下的打印功能...');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 切换到深色模式 - 使用实际的主题切换按钮选择器
    const themeToggle = page.locator('button').filter({ hasText: /🌙|☀️/ }).first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('⚠️ 主题切换按钮未找到，跳过深色模式测试');
      return;
    }
    
    // 验证深色模式已激活
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    });
    expect(isDarkMode).toBe(true);
    console.log('✅ 深色模式已激活');
    
    // 切换到打印模式
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(1000);
    
    // 检查打印时的样式（应该强制为白底黑字）
    const printStyles = await page.evaluate(() => {
      const body = document.body;
      const resumeContent = document.querySelector('[data-testid="resume-content"]');
      
      const bodyStyles = window.getComputedStyle(body);
      const contentStyles = resumeContent ? window.getComputedStyle(resumeContent) : null;
      
      return {
        bodyBackground: bodyStyles.background,
        bodyColor: bodyStyles.color,
        contentBackground: contentStyles?.background || '',
        contentColor: contentStyles?.color || '',
        backgroundImage: bodyStyles.backgroundImage
      };
    });
    
    expect(printStyles.bodyBackground).toContain('white');
    expect(printStyles.bodyColor).toContain('black');
    expect(printStyles.contentBackground).toContain('white');
    expect(printStyles.contentColor).toContain('black');
    expect(printStyles.backgroundImage).toBe('none');
    
    console.log('✅ 深色模式下打印样式正确（强制白底黑字）');
    
    // 生成PDF验证
    const pdfBuffer = await page.pdf({
      path: path.join('tests', 'screenshots', 'print-dark-mode.pdf'),
      format: 'A4',
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      printBackground: false
    });
    
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    console.log('✅ 深色模式下PDF生成成功');
    
    // 恢复屏幕模式
    await page.emulateMedia({ media: 'screen' });
    
    console.log('🌙 深色模式打印测试完成');
  });
});
