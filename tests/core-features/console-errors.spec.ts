import { test, expect } from '@playwright/test';

test.describe('控制台错误检查', () => {
  let consoleErrors: string[] = [];
  let consoleWarnings: string[] = [];

  test.beforeEach(async ({ page }) => {
    // 清空错误和警告数组
    consoleErrors = [];
    consoleWarnings = [];

    // 监听控制台消息
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    // 监听页面错误
    page.on('pageerror', (error) => {
      consoleErrors.push(`Page Error: ${error.message}`);
    });

    // 访问页面
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('页面加载时不应该有控制台错误', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 检查是否有错误
    if (consoleErrors.length > 0) {
      console.log('发现控制台错误:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // 检查是否有警告
    if (consoleWarnings.length > 0) {
      console.log('发现控制台警告:');
      consoleWarnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    // 断言没有错误
    expect(consoleErrors).toHaveLength(0);
  });

  test('切换主题时不应该有控制台错误', async ({ page }) => {
    // 点击主题切换按钮
    const themeSwitcher = page.locator('[data-testid="theme-switcher"]');
    await themeSwitcher.click();
    await page.waitForTimeout(1000);

    // 再次切换
    await themeSwitcher.click();
    await page.waitForTimeout(1000);

    // 检查错误
    expect(consoleErrors).toHaveLength(0);
  });

  test('切换语言时不应该有控制台错误', async ({ page }) => {
    // 点击语言切换按钮
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    await languageSwitcher.click();
    await page.waitForTimeout(1000);

    // 再次切换
    await languageSwitcher.click();
    await page.waitForTimeout(1000);

    // 检查错误
    expect(consoleErrors).toHaveLength(0);
  });

  test('PDF导出时不应该有控制台错误', async ({ page }) => {
    // 监听打印事件
    await page.addInitScript(() => {
      const originalPrint = window.print;
      window.print = () => {
        // 不实际触发打印，避免测试环境问题
      };
    });

    // 点击PDF导出按钮
    const exportButton = page.locator('.pdf-export-btn, .pdf-download-btn').first();
    if (await exportButton.isVisible()) {
      await exportButton.click();
      await page.waitForTimeout(3000);
    }

    // 检查错误
    expect(consoleErrors).toHaveLength(0);
  });

  test('导航到不同路由时不应该有控制台错误', async ({ page }) => {
    // 测试不同的路由
    const routes = ['/fullstack', '/games', '/tools', '/operations', '/automation', '/management'];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // 检查当前路由是否有错误
      if (consoleErrors.length > 0) {
        console.log(`路由 ${route} 发现错误:`, consoleErrors);
        break;
      }
    }

    // 检查错误
    expect(consoleErrors).toHaveLength(0);
  });

  test('展开和折叠组件时不应该有控制台错误', async ({ page }) => {
    // 查找可折叠的元素
    const collapseButtons = page.locator('[data-testid*="collapse"], .collapse-icon, .timeline-title').first();
    
    if (await collapseButtons.isVisible()) {
      // 点击折叠/展开
      await collapseButtons.click();
      await page.waitForTimeout(500);
      
      // 再次点击
      await collapseButtons.click();
      await page.waitForTimeout(500);
    }

    // 检查错误
    expect(consoleErrors).toHaveLength(0);
  });

  test('Mermaid图表渲染时不应该有控制台错误', async ({ page }) => {
    // 等待Mermaid图表加载
    await page.waitForSelector('.mermaid, [data-mermaid]', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // 检查是否有Mermaid相关的错误
    const mermaidErrors = consoleErrors.filter(error => 
      error.toLowerCase().includes('mermaid') || 
      error.toLowerCase().includes('svg') ||
      error.toLowerCase().includes('chart')
    );

    if (mermaidErrors.length > 0) {
      console.log('Mermaid相关错误:', mermaidErrors);
    }

    // 检查错误
    expect(consoleErrors).toHaveLength(0);
  });

  test('控制面板操作时不应该有控制台错误', async ({ page }) => {
    // 查找控制面板
    const controlPanel = page.locator('[data-testid="control-panel"]');
    
    if (await controlPanel.isVisible()) {
      // 如果是可折叠的，先展开
      const toggleButton = controlPanel.locator('button').first();
      if (await toggleButton.isVisible()) {
        await toggleButton.click();
        await page.waitForTimeout(500);
      }

      // 测试控制面板中的各种按钮
      const buttons = controlPanel.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible() && await button.isEnabled()) {
          await button.click();
          await page.waitForTimeout(300);
        }
      }
    }

    // 检查错误
    expect(consoleErrors).toHaveLength(0);
  });
});
