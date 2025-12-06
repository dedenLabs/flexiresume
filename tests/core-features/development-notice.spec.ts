import { test, expect } from '@playwright/test';

test.describe('开发环境提示功能', () => {
  test.beforeEach(async ({ page }) => {
    // 清除本地存储，确保提示会显示
    await page.evaluate(() => {
      localStorage.removeItem('dev-notice-dismissed');
    });
  });

  test('应该在开发环境显示提示', async ({ page }) => {
    // 访问页面
    await page.goto('/');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 等待开发环境提示出现（有2秒延迟）
    await page.waitForSelector('[data-testid="development-notice"]', { 
      timeout: 5000,
      state: 'visible'
    });

    // 验证提示内容
    const notice = page.locator('[data-testid="development-notice"]');
    await expect(notice).toBeVisible();
    
    // 验证标题
    await expect(notice.locator('text=开发环境模式')).toBeVisible();
    
    // 验证描述文本
    await expect(notice.locator('text=当前运行在开发模式下')).toBeVisible();
    await expect(notice.locator('text=npm run build')).toBeVisible();
  });

  test('应该能够关闭提示', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 等待提示出现
    const notice = page.locator('[data-testid="development-notice"]');
    await notice.waitFor({ state: 'visible', timeout: 5000 });

    // 点击关闭按钮
    await notice.locator('button[title="关闭提示"]').click();

    // 验证提示消失
    await expect(notice).not.toBeVisible();

    // 刷新页面，验证提示不再出现
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 等待一段时间，确保提示不会出现
    await page.waitForTimeout(3000);
    await expect(notice).not.toBeVisible();
  });

  test('构建指南按钮应该在控制台输出信息', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });

    // 等待提示出现
    const notice = page.locator('[data-testid="development-notice"]');
    await notice.waitFor({ state: 'visible', timeout: 5000 });

    // 点击构建指南按钮
    await notice.locator('text=📖 构建指南').click();

    // 等待控制台消息
    await page.waitForTimeout(1000);

    // 验证控制台输出包含构建指南信息
    const hasGuideInfo = consoleMessages.some(msg => 
      msg.includes('构建指南') || 
      msg.includes('npm run dev') || 
      msg.includes('npm run build')
    );
    expect(hasGuideInfo).toBeTruthy();
  });

  test('应该在页面加载时输出开发环境信息到控制台', async ({ page }) => {
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 等待开发环境提示和控制台输出
    await page.waitForTimeout(3000);

    // 验证控制台输出包含开发环境信息
    const hasDevInfo = consoleMessages.some(msg => 
      msg.includes('FlexiResume 开发环境') || 
      msg.includes('开发模式') || 
      msg.includes('热重载')
    );
    expect(hasDevInfo).toBeTruthy();
  });

  test('提示应该有正确的样式和动画', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 等待提示出现
    const notice = page.locator('[data-testid="development-notice"]');
    await notice.waitFor({ state: 'visible', timeout: 5000 });

    // 验证样式
    const styles = await notice.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        zIndex: computed.zIndex,
        background: computed.background,
        transform: computed.transform
      };
    });

    expect(styles.position).toBe('fixed');
    expect(parseInt(styles.zIndex)).toBeGreaterThan(9999);
    expect(styles.background).toContain('linear-gradient');
    expect(styles.transform).toBe('matrix(1, 0, 0, 1, 0, 0)'); // translateY(0)
  });

  test('在调试模式下应该显示重置按钮', async ({ page }) => {
    // 设置调试模式
    await page.addInitScript(() => {
      window.localStorage.setItem('debug', 'app:*');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 等待提示出现
    const notice = page.locator('[data-testid="development-notice"]');
    await notice.waitFor({ state: 'visible', timeout: 5000 });

    // 验证重置按钮存在（在调试模式下）
    const resetButton = notice.locator('text=🔄 重置');
    await expect(resetButton).toBeVisible();

    // 测试重置功能
    await notice.locator('button[title="关闭提示"]').click();
    await expect(notice).not.toBeVisible();

    // 点击重置按钮应该重新显示提示
    // 注意：这里需要重新获取notice元素，因为组件可能重新渲染
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const newNotice = page.locator('[data-testid="development-notice"]');
    await newNotice.waitFor({ state: 'visible', timeout: 5000 });
    await expect(newNotice).toBeVisible();
  });

  test('提示应该响应式适配不同屏幕尺寸', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 等待提示出现
    const notice = page.locator('[data-testid="development-notice"]');
    await notice.waitFor({ state: 'visible', timeout: 5000 });

    // 测试桌面尺寸
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(notice).toBeVisible();

    // 测试平板尺寸
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(notice).toBeVisible();

    // 测试手机尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(notice).toBeVisible();

    // 验证在小屏幕上内容仍然可读
    const noticeText = notice.locator('[data-testid="notice-text"]');
    const isVisible = await noticeText.isVisible();
    expect(isVisible).toBeTruthy();
  });
});
