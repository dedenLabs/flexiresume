import { test, expect } from '@playwright/test';

test.describe('PDF导出功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问页面
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('应该显示PDF导出按钮', async ({ page }) => {
    // 等待控制面板加载
    await page.waitForSelector('[data-testid="control-panel"]', { timeout: 10000 });

    // 查找PDF导出按钮
    const exportButton = page.locator('.pdf-export-btn');
    await expect(exportButton).toBeVisible();

    // 验证按钮文本
    await expect(exportButton).toContainText('导出PDF');
    
    // 验证按钮图标
    await expect(exportButton.locator('.icon')).toContainText('📄');
  });

  test('应该在可折叠控制面板中显示PDF导出按钮', async ({ page }) => {
    // 如果控制面板是折叠的，先展开它
    const toggleButton = page.locator('[data-testid="control-panel"] button').first();
    const isCollapsed = await toggleButton.textContent() === '⚙️';
    
    if (isCollapsed) {
      await toggleButton.click();
      await page.waitForTimeout(500); // 等待展开动画
    }

    // 验证PDF导出按钮在展开的面板中可见
    const exportButton = page.locator('.pdf-export-btn');
    await expect(exportButton).toBeVisible();
  });

  test('点击PDF导出按钮应该触发打印对话框', async ({ page }) => {
    // 监听打印事件
    await page.addInitScript(() => {
      const originalPrint = window.print;
      window.print = () => {
        window.printTriggered = true;
        // 不实际触发打印，避免测试环境问题
      };
    });

    // 点击PDF导出按钮
    const exportButton = page.locator('.pdf-export-btn');
    await exportButton.click();

    // 验证加载提示出现
    await expect(page.locator('#pdf-loading-indicator')).toBeVisible();
    await expect(page.locator('#pdf-loading-indicator')).toContainText('正在准备PDF导出');

    // 等待处理完成
    await page.waitForTimeout(3000);

    // 验证打印被触发
    const printTriggered = await page.evaluate(() => window.printTriggered);
    expect(printTriggered).toBeTruthy();

    // 验证加载提示消失
    await expect(page.locator('#pdf-loading-indicator')).not.toBeVisible();
  });

  test('PDF导出应该应用正确的打印样式', async ({ page }) => {
    // 点击PDF导出按钮
    const exportButton = page.locator('.pdf-export-btn');
    await exportButton.click();

    // 等待打印样式应用
    await page.waitForTimeout(1000);

    // 检查打印样式是否被添加
    const printStyles = await page.evaluate(() => {
      const styleElements = document.querySelectorAll('style');
      for (const style of styleElements) {
        if (style.textContent?.includes('@media print')) {
          return style.textContent;
        }
      }
      return null;
    });

    expect(printStyles).toBeTruthy();
    expect(printStyles).toContain('@media print');
    expect(printStyles).toContain('.no-print');
    expect(printStyles).toContain('visibility: hidden');
    expect(printStyles).toContain('[data-testid="resume-content"]');
  });

  test('PDF导出应该隐藏不需要的元素', async ({ page }) => {
    // 点击PDF导出按钮
    const exportButton = page.locator('.pdf-export-btn');
    await exportButton.click();

    // 等待打印样式应用
    await page.waitForTimeout(1000);

    // 检查打印样式中隐藏的元素
    const printStyles = await page.evaluate(() => {
      const styleElements = document.querySelectorAll('style');
      for (const style of styleElements) {
        if (style.textContent?.includes('@media print')) {
          return style.textContent;
        }
      }
      return null;
    });

    // 验证控制面板被隐藏
    expect(printStyles).toContain('.control-panel');
    expect(printStyles).toContain('display: none !important');
    
    // 验证导航标签被隐藏
    expect(printStyles).toContain('.tabs-container');
    
    // 验证PDF导出按钮自身被隐藏
    expect(printStyles).toContain('.pdf-export-btn');
  });

  test('PDF导出应该等待图片加载完成', async ({ page }) => {
    // 添加一个测试图片
    await page.addInitScript(() => {
      const img = document.createElement('img');
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwZiIvPjwvc3ZnPg==';
      img.id = 'test-image';
      document.body.appendChild(img);
    });

    // 点击PDF导出按钮
    const exportButton = page.locator('.pdf-export-btn');
    await exportButton.click();

    // 验证加载提示出现
    await expect(page.locator('#pdf-loading-indicator')).toBeVisible();

    // 等待处理完成（包括图片加载）
    await page.waitForTimeout(4000);

    // 验证图片已加载
    const imageLoaded = await page.evaluate(() => {
      const img = document.getElementById('test-image') as HTMLImageElement;
      return img && img.complete;
    });

    expect(imageLoaded).toBeTruthy();
  });

  test('PDF导出按钮应该在导出过程中显示加载状态', async ({ page }) => {
    const exportButton = page.locator('.pdf-export-btn');
    
    // 验证初始状态
    await expect(exportButton).toContainText('导出PDF');
    await expect(exportButton).not.toBeDisabled();

    // 点击导出按钮
    await exportButton.click();

    // 验证加载状态
    await expect(exportButton).toContainText('导出中');
    await expect(exportButton).toBeDisabled();

    // 等待导出完成
    await page.waitForTimeout(4000);

    // 验证恢复正常状态
    await expect(exportButton).toContainText('导出PDF');
    await expect(exportButton).not.toBeDisabled();
  });

  test('PDF导出应该支持英文界面', async ({ page }) => {
    // 切换到英文
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    await languageSwitcher.click();

    // 等待语言切换完成
    await page.waitForTimeout(1000);

    // 验证PDF导出按钮文本变为英文
    const exportButton = page.locator('.pdf-export-btn');
    await expect(exportButton).toContainText('Export PDF');
  });

  test('PDF导出应该在深色模式下正常工作', async ({ page }) => {
    // 切换到深色模式
    const themeSwitcher = page.locator('[data-testid="theme-switcher"]');
    await themeSwitcher.click();

    // 等待主题切换完成
    await page.waitForTimeout(1000);

    // 点击PDF导出按钮
    const exportButton = page.locator('.pdf-export-btn');
    await expect(exportButton).toBeVisible();
    await exportButton.click();

    // 验证加载提示出现
    await expect(page.locator('#pdf-loading-indicator')).toBeVisible();

    // 等待处理完成
    await page.waitForTimeout(3000);

    // 验证打印样式包含颜色优化
    const printStyles = await page.evaluate(() => {
      const styleElements = document.querySelectorAll('style');
      for (const style of styleElements) {
        if (style.textContent?.includes('@media print')) {
          return style.textContent;
        }
      }
      return null;
    });

    expect(printStyles).toContain('color: #000 !important');
    expect(printStyles).toContain('background: white !important');
  });

  test('PDF导出应该优化简历内容的打印样式', async ({ page }) => {
    // 点击PDF导出按钮
    const exportButton = page.locator('.pdf-export-btn');
    await exportButton.click();

    // 等待打印样式应用
    await page.waitForTimeout(1000);

    // 检查简历特定的打印样式
    const printStyles = await page.evaluate(() => {
      const styleElements = document.querySelectorAll('style');
      for (const style of styleElements) {
        if (style.textContent?.includes('@media print')) {
          return style.textContent;
        }
      }
      return null;
    });

    // 验证简历特定样式
    expect(printStyles).toContain('.resume-wrapper');
    expect(printStyles).toContain('max-width: none !important');
    expect(printStyles).toContain('box-shadow: none !important');
    
    // 验证分页控制
    expect(printStyles).toContain('page-break-inside: avoid !important');
    expect(printStyles).toContain('.timeline-item');
    expect(printStyles).toContain('.skill-item');
    expect(printStyles).toContain('.project-item');
  });

  test('PDF导出应该在当前页面弹出打印对话框，不新开窗口', async ({ page }) => {
    // 监听打印事件
    await page.addInitScript(() => {
      const originalPrint = window.print;
      window.print = () => {
        window.printTriggered = true;
      };
    });

    // 记录初始页面数量
    const initialPageCount = page.context().pages().length;

    // 展开控制面板并点击PDF导出
    const toggleButton = page.locator('[data-testid="control-panel"] button').first();
    const isCollapsed = await toggleButton.textContent() === '⚙️';

    if (isCollapsed) {
      await toggleButton.click();
      await page.waitForTimeout(500);
    }

    const exportButton = page.locator('.pdf-export-btn');
    await exportButton.click();
    await page.waitForTimeout(1000);

    // 点击原版模式
    const originalButton = page.locator('text=原版');
    if (await originalButton.isVisible()) {
      await originalButton.click();
    }
    await page.waitForTimeout(1000);

    // 验证没有新窗口被打开
    const finalPageCount = page.context().pages().length;
    expect(finalPageCount).toBe(initialPageCount);

    // 验证打印被触发
    const printTriggered = await page.evaluate(() => window.printTriggered);
    expect(printTriggered).toBe(true);
  });

  test('原版模式应该保留深色主题样式', async ({ page }) => {
    // 切换到深色模式
    const themeButton = page.locator('[data-testid="theme-switcher"]');
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(500);
    }

    // 验证当前是深色模式
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    });

    if (isDarkMode) {
      // 监听打印样式的添加
      await page.addInitScript(() => {
        const originalPrint = window.print;
        window.print = () => {
          // 检查是否有保留深色模式的打印样式
          const printStyles = Array.from(document.querySelectorAll('style')).find(style =>
            style.textContent?.includes('data-theme="dark"') &&
            style.textContent?.includes('color-adjust: exact')
          );
          window.darkModePrintStyleFound = !!printStyles;
        };
      });

      // 展开控制面板并触发PDF导出
      const toggleButton = page.locator('[data-testid="control-panel"] button').first();
      const isCollapsed = await toggleButton.textContent() === '⚙️';

      if (isCollapsed) {
        await toggleButton.click();
        await page.waitForTimeout(500);
      }

      const exportButton = page.locator('.pdf-export-btn');
      await exportButton.click();
      await page.waitForTimeout(1000);

      const originalButton = page.locator('text=原版');
      if (await originalButton.isVisible()) {
        await originalButton.click();
      }
      await page.waitForTimeout(1000);

      // 验证深色模式打印样式被正确添加
      const darkModePrintStyleFound = await page.evaluate(() => window.darkModePrintStyleFound);
      expect(darkModePrintStyleFound).toBe(true);
    }
  });
});
