/**
 * CDN健康检查测试
 * CDN Health Check Tests
 * 
 * 测试CDN可用性检测功能和降级机制
 * Test CDN availability detection and fallback mechanisms
 */

import { test, expect, Page } from '@playwright/test';

// 测试配置
const TEST_CONFIG = {
  timeout: 30000, // 30秒超时
  cdnUrls: [
    'https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/',
    'https://deden.web.app/flexiresume-static/',
    'https://dedenlabs.github.io/flexiresume-static/',
  ],
  testResource: 'favicon.ico',
};

/**
 * 等待CDN检测完成
 */
async function waitForCDNCheck(page: Page, timeout = 15000) {
  // 等待CDN状态指示器出现
  await page.waitForSelector('div:has-text("检测CDN")', { timeout: 5000 });
  
  // 等待CDN检测完成（状态变为"就绪"或"失败"）
  await page.waitForFunction(
    () => {
      const indicator = document.querySelector('div:has-text("CDN")');
      return indicator && (
        indicator.textContent?.includes('就绪') || 
        indicator.textContent?.includes('失败')
      );
    },
    { timeout }
  );
}

/**
 * 获取CDN状态
 */
async function getCDNStatus(page: Page): Promise<'ready' | 'error' | 'checking'> {
  const indicator = await page.locator('div:has-text("CDN")').first();
  const text = await indicator.textContent();
  
  if (text?.includes('就绪')) return 'ready';
  if (text?.includes('失败')) return 'error';
  return 'checking';
}

/**
 * 检查控制台错误
 */
async function checkConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return errors;
}

test.describe('CDN健康检查功能', () => {
  test.beforeEach(async ({ page }) => {
    // 设置较长的超时时间
    test.setTimeout(TEST_CONFIG.timeout);
    
    // 监听控制台消息
    await checkConsoleErrors(page);
  });

  test('应用启动时应该执行CDN健康检查', async ({ page }) => {
    // 访问应用
    await page.goto('/');
    
    // 等待CDN检测开始
    await page.waitForSelector('div:has-text("检测CDN")', { timeout: 5000 });
    
    // 验证CDN检测状态指示器存在
    const indicator = page.locator('div:has-text("CDN")');
    await expect(indicator).toBeVisible();
    
    // 等待CDN检测完成
    await waitForCDNCheck(page);
    
    // 验证最终状态
    const finalStatus = await getCDNStatus(page);
    expect(['ready', 'error']).toContain(finalStatus);
  });

  test('CDN检测完成后应该正确加载页面内容', async ({ page }) => {
    await page.goto('/');
    
    // 等待CDN检测完成
    await waitForCDNCheck(page);
    
    // 等待页面主要内容加载
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 验证页面内容已加载
    const content = page.locator('[data-testid="resume-content"]');
    await expect(content).toBeVisible();
    
    // 验证导航标签已加载
    const tabs = page.locator('[data-testid="navigation-tabs"]');
    await expect(tabs).toBeVisible();
  });

  test('应该能够处理CDN不可用的情况', async ({ page }) => {
    // 拦截CDN请求，模拟CDN不可用
    await page.route('**/cdn.jsdelivr.net/**', (route) => {
      route.abort('failed');
    });
    
    await page.route('**/deden.web.app/**', (route) => {
      route.abort('failed');
    });
    
    await page.route('**/dedenlabs.github.io/**', (route) => {
      route.abort('failed');
    });
    
    await page.goto('/');
    
    // 等待CDN检测完成
    await waitForCDNCheck(page, 20000); // 更长的超时时间
    
    // 验证应用仍然可以正常工作（使用本地资源）
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 15000 });
    
    const content = page.locator('[data-testid="resume-content"]');
    await expect(content).toBeVisible();
  });

  test('应该能够处理部分CDN不可用的情况', async ({ page }) => {
    // 只拦截第一个CDN，让其他CDN正常工作
    await page.route('**/cdn.jsdelivr.net/**', (route) => {
      route.abort('failed');
    });
    
    await page.goto('/');
    
    // 等待CDN检测完成
    await waitForCDNCheck(page);
    
    // 验证CDN状态为就绪（因为还有其他可用的CDN）
    const status = await getCDNStatus(page);
    expect(status).toBe('ready');
    
    // 验证页面正常加载
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    const content = page.locator('[data-testid="resume-content"]');
    await expect(content).toBeVisible();
  });

  test('CDN检测不应该阻塞应用主要功能', async ({ page }) => {
    // 拦截CDN健康检查请求，使其超时
    await page.route('**/favicon.ico', (route) => {
      // 延迟响应以模拟慢速CDN
      setTimeout(() => route.continue(), 10000);
    });
    
    await page.goto('/');
    
    // 即使CDN检测较慢，页面内容也应该能够加载
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 15000 });
    
    const content = page.locator('[data-testid="resume-content"]');
    await expect(content).toBeVisible();
  });

  test('应该正确显示CDN状态指示器', async ({ page }) => {
    await page.goto('/');
    
    // 验证初始状态
    const indicator = page.locator('div:has-text("检测CDN")');
    await expect(indicator).toBeVisible();
    
    // 等待状态变化
    await waitForCDNCheck(page);
    
    // 验证最终状态指示器
    const finalIndicator = page.locator('div:has-text("CDN")');
    await expect(finalIndicator).toBeVisible();
    
    const text = await finalIndicator.textContent();
    expect(text).toMatch(/(就绪|失败)/);
  });

  test('应该能够在不同语言间切换时保持CDN功能', async ({ page }) => {
    await page.goto('/');
    
    // 等待CDN检测完成
    await waitForCDNCheck(page);
    
    // 切换到英文
    const languageSwitch = page.locator('[data-testid="language-switcher"]');
    if (await languageSwitch.isVisible()) {
      await languageSwitch.click();
      
      // 等待语言切换完成
      await page.waitForTimeout(2000);
      
      // 验证页面仍然正常工作
      const content = page.locator('[data-testid="resume-content"]');
      await expect(content).toBeVisible();
    }
  });

  test('应该能够处理网络错误', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/*', (route) => {
      if (route.request().url().includes('favicon.ico')) {
        route.abort('internetdisconnected');
      } else {
        route.continue();
      }
    });
    
    await page.goto('/');
    
    // 等待CDN检测完成（应该失败）
    await waitForCDNCheck(page, 20000);
    
    // 验证应用仍然可以工作
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 15000 });
    const content = page.locator('[data-testid="resume-content"]');
    await expect(content).toBeVisible();
  });
});

test.describe('CDN资源加载测试', () => {
  test('应该能够从CDN加载图片资源', async ({ page }) => {
    await page.goto('/');
    
    // 等待CDN检测完成
    await waitForCDNCheck(page);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查图片是否正确加载
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // 验证至少有一张图片成功加载
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      // 检查图片是否有正确的src属性
      const src = await firstImage.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('应该能够正确处理资源加载失败', async ({ page }) => {
    // 拦截图片请求，模拟加载失败
    await page.route('**/*.{png,jpg,jpeg,webp,svg}', (route) => {
      route.abort('failed');
    });
    
    await page.goto('/');
    
    // 等待CDN检测完成
    await waitForCDNCheck(page);
    
    // 验证页面仍然可以正常显示（即使图片加载失败）
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    const content = page.locator('[data-testid="resume-content"]');
    await expect(content).toBeVisible();
  });
});
