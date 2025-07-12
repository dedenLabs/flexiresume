import { test, expect } from '@playwright/test';

/**
 * 移动端响应式测试
 * 测试所有页面在竖屏模式下的显示情况
 */

const pages = [
  { path: '/game', name: '游戏开发' },
  { path: '/contracttask', name: '外包任务' },
  { path: '/fullstack', name: '全栈开发' },
  { path: '/frontend', name: '前端开发' }
];

const languages = ['zh', 'en'];

// 移动端设备配置
const mobileViewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800 },
  { name: 'iPad Mini', width: 768, height: 1024 }
];

test.describe('移动端响应式测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置较长的超时时间
    page.setDefaultTimeout(30000);
  });

  for (const viewport of mobileViewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        // 设置移动端视口
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      for (const lang of languages) {
        test(`${lang.toUpperCase()} - 所有页面响应式测试`, async ({ page }) => {
          console.log(`\n=== 测试 ${viewport.name} - ${lang.toUpperCase()} 语言 ===`);
          
          // 首先访问首页设置语言
          await page.goto('http://localhost:5174/');
          await page.waitForLoadState('networkidle');
          
          // 切换到指定语言
          if (lang === 'en') {
            const langButton = page.locator('[data-testid="language-toggle"]');
            if (await langButton.isVisible()) {
              await langButton.click();
              await page.waitForTimeout(1000);
            }
          }

          // 测试每个页面
          for (const pageInfo of pages) {
            console.log(`  测试页面: ${pageInfo.name} (${pageInfo.path})`);
            
            await page.goto(`http://localhost:5174${pageInfo.path}`);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // 检查页面是否正常加载
            const resumeContent = page.locator('[data-testid="resume-content"]');
            await expect(resumeContent).toBeVisible({ timeout: 10000 });

            // 检查是否有横向滚动条（溢出问题）
            const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
            const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
            const hasHorizontalOverflow = bodyScrollWidth > bodyClientWidth;
            
            console.log(`    页面宽度: ${bodyClientWidth}px, 内容宽度: ${bodyScrollWidth}px`);
            
            if (hasHorizontalOverflow) {
              console.log(`    ⚠️  检测到横向溢出: ${bodyScrollWidth - bodyClientWidth}px`);
            }

            // 检查主要容器的宽度
            const resumeWrapper = page.locator('[data-testid="resume-content"]');
            const wrapperBox = await resumeWrapper.boundingBox();
            
            if (wrapperBox) {
              console.log(`    简历容器宽度: ${wrapperBox.width}px`);
              
              // 确保容器不超出视口宽度
              expect(wrapperBox.width).toBeLessThanOrEqual(viewport.width);
            }

            // 检查导航标签是否正常显示
            const tabs = page.locator('[data-testid="navigation-tabs"]');
            if (await tabs.isVisible()) {
              const tabsBox = await tabs.boundingBox();
              if (tabsBox) {
                console.log(`    导航标签宽度: ${tabsBox.width}px`);
                expect(tabsBox.width).toBeLessThanOrEqual(viewport.width);
              }
            }

            // 截图保存
            const screenshotPath = `tests/screenshots/mobile-${viewport.name.replace(/\s+/g, '-')}-${lang}-${pageInfo.path.replace('/', '')}.png`;
            await page.screenshot({ 
              path: screenshotPath,
              fullPage: true 
            });
            console.log(`    截图已保存: ${screenshotPath}`);

            // 检查控制台错误
            const errors: string[] = [];
            page.on('console', msg => {
              if (msg.type() === 'error') {
                errors.push(msg.text());
              }
            });

            // 等待一段时间收集可能的错误
            await page.waitForTimeout(1000);
            
            if (errors.length > 0) {
              console.log(`    ⚠️  控制台错误:`, errors);
            }

            // 验证不应该有横向溢出
            expect(hasHorizontalOverflow).toBeFalsy();
          }
        });
      }
    });
  }

  test('主题切换测试', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('http://localhost:5174/');
    await page.waitForLoadState('networkidle');

    // 测试主题切换
    const themeButton = page.locator('[data-testid="theme-toggle"]');
    if (await themeButton.isVisible()) {
      // 切换到深色模式
      await themeButton.click();
      await page.waitForTimeout(1000);
      
      // 检查深色模式是否应用
      const body = page.locator('body');
      const dataTheme = await body.getAttribute('data-theme');
      expect(dataTheme).toBe('dark');
      
      // 截图深色模式
      await page.screenshot({ 
        path: 'tests/screenshots/mobile-dark-theme.png',
        fullPage: true 
      });
      
      // 切换回浅色模式
      await themeButton.click();
      await page.waitForTimeout(1000);
      
      const dataThemeLight = await body.getAttribute('data-theme');
      expect(dataThemeLight).toBe('light');
    }
  });
});
