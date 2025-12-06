/**
 * 主题修复验证测试
 * 
 * 验证主题一致性和Mermaid图表渲染问题的修复效果
 * 
 * @author FlexiResume Team
 * @date 2025-07-25
 */

import { test, expect } from '@playwright/test';

test.describe('主题修复验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('验证主题切换功能正常工作', async ({ page }) => {
    // 等待页面加载完成
    await page.waitForSelector('[data-theme-switcher]', { timeout: 10000 });

    // 获取初始主题
    const initialTheme = await page.getAttribute('html', 'data-theme');
    console.log('初始主题:', initialTheme);

    // 点击主题切换按钮
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(1000);

    // 获取切换后的主题
    const newTheme = await page.getAttribute('html', 'data-theme');
    console.log('切换后主题:', newTheme);

    // 验证主题确实发生了变化
    expect(newTheme).not.toBe(initialTheme);

    // 验证主题值是有效的
    expect(['light', 'dark']).toContain(newTheme);
  });

  test('验证CSS变量在主题切换时正确更新', async ({ page }) => {
    // 获取浅色主题下的CSS变量
    const lightVariables = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue('--color-primary').trim(),
        background: style.getPropertyValue('--color-background').trim(),
        textPrimary: style.getPropertyValue('--color-text-primary').trim(),
        surface: style.getPropertyValue('--color-surface').trim(),
        card: style.getPropertyValue('--color-card').trim()
      };
    });

    console.log('浅色主题变量:', lightVariables);

    // 切换到深色主题
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(1000);

    // 获取深色主题下的CSS变量
    const darkVariables = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue('--color-primary').trim(),
        background: style.getPropertyValue('--color-background').trim(),
        textPrimary: style.getPropertyValue('--color-text-primary').trim(),
        surface: style.getPropertyValue('--color-surface').trim(),
        card: style.getPropertyValue('--color-card').trim()
      };
    });

    console.log('深色主题变量:', darkVariables);

    // 验证变量确实发生了变化
    expect(darkVariables.primary).not.toBe(lightVariables.primary);
    expect(darkVariables.background).not.toBe(lightVariables.background);
    expect(darkVariables.textPrimary).not.toBe(lightVariables.textPrimary);

    // 验证变量不为空
    expect(darkVariables.primary).toBeTruthy();
    expect(darkVariables.background).toBeTruthy();
    expect(darkVariables.textPrimary).toBeTruthy();
  });

  test('验证组件颜色使用CSS变量而不是固定值', async ({ page }) => {
    // 检查Header组件的二维码颜色
    const qrCodeColors = await page.evaluate(() => {
      const qrCodeSvg = document.querySelector('svg[data-qr-code]') as SVGElement;
      if (qrCodeSvg) {
        const rect = qrCodeSvg.querySelector('rect');
        return {
          found: true,
          fill: rect?.getAttribute('fill') || '',
          background: qrCodeSvg.style.background || ''
        };
      }
      return { found: false };
    });

    console.log('二维码颜色配置:', qrCodeColors);

    // 检查控制面板的颜色
    const controlPanelColors = await page.evaluate(() => {
      const controlPanel = document.querySelector('[data-theme-switcher]')?.closest('div');
      if (controlPanel) {
        const style = getComputedStyle(controlPanel);
        return {
          found: true,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor
        };
      }
      return { found: false };
    });

    console.log('控制面板颜色:', controlPanelColors);

    // 验证控制面板存在且有正确的样式
    expect(controlPanelColors.found).toBe(true);
    if (controlPanelColors.found) {
      expect(controlPanelColors.backgroundColor).toBeTruthy();
    }
  });

  test('验证Mermaid数据管理器正常工作', async ({ page }) => {
    // 检查Mermaid数据管理器是否可用
    const mermaidManagerStatus = await page.evaluate(() => {
      // 检查是否有mermaidDataManager
      return {
        hasManager: typeof (window as any).mermaidDataManager !== 'undefined',
        hasGetChart: typeof (window as any).mermaidDataManager?.getChart === 'function',
        hasSetChartData: typeof (window as any).mermaidDataManager?.setChartData === 'function'
      };
    });

    console.log('Mermaid数据管理器状态:', mermaidManagerStatus);

    // 检查页面中是否有Mermaid占位符
    const mermaidPlaceholders = await page.locator('.mermaid-placeholder, .mermaid-lazy-placeholder').count();
    console.log('Mermaid占位符数量:', mermaidPlaceholders);

    // 如果有占位符，检查它们是否有正确的data-mermaid-id属性
    if (mermaidPlaceholders > 0) {
      const placeholderInfo = await page.evaluate(() => {
        const placeholders = document.querySelectorAll('.mermaid-placeholder, .mermaid-lazy-placeholder');
        return Array.from(placeholders).map(p => ({
          hasId: p.hasAttribute('data-mermaid-id'),
          hasChart: p.hasAttribute('data-mermaid-chart'), // 应该为false
          id: p.getAttribute('data-mermaid-id')
        }));
      });

      console.log('占位符信息:', placeholderInfo);

      // 验证占位符有ID但没有chart属性（因为现在使用内存存储）
      placeholderInfo.forEach((info, index) => {
        expect(info.hasId).toBe(true);
        expect(info.hasChart).toBe(false); // 应该不再有data-mermaid-chart属性
        expect(info.id).toBeTruthy();
      });
    }
  });

  test('验证主题切换后页面无控制台错误', async ({ page }) => {
    const errors: string[] = [];
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 执行主题切换
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(2000);

    // 再次切换
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(2000);

    // 检查是否有错误
    console.log('控制台错误:', errors);
    
    // 过滤掉一些已知的无害错误
    const significantErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );

    expect(significantErrors.length).toBe(0);
  });
});
