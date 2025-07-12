import { test, expect } from '@playwright/test';

/**
 * 移动端溢出修复验证测试
 * 快速验证所有页面在移动端是否还有横向溢出问题
 */

const pages = [
  { path: '/game', name: '游戏开发' },
  { path: '/contracttask', name: '外包任务' },
  { path: '/fullstack', name: '全栈开发' },
  { path: '/frontend', name: '前端开发' }
];

// 移动端设备配置
const mobileViewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800 }
];

test.describe('移动端溢出修复验证', () => {
  
  for (const viewport of mobileViewports) {
    test(`${viewport.name} - 横向溢出检查`, async ({ page }) => {
      console.log(`\n=== 测试 ${viewport.name} (${viewport.width}x${viewport.height}) ===`);
      
      // 设置移动端视口
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // 监听控制台错误
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

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
          console.log(`    ❌ 仍有横向溢出: ${bodyScrollWidth - bodyClientWidth}px`);
        } else {
          console.log(`    ✅ 无横向溢出`);
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
        const screenshotPath = `tests/screenshots/fixed-mobile-${viewport.name.replace(/\s+/g, '-')}-${pageInfo.path.replace('/', '')}.png`;
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        console.log(`    截图已保存: ${screenshotPath}`);

        // 验证不应该有横向溢出
        expect(hasHorizontalOverflow).toBeFalsy();
      }

      // 检查控制台错误
      if (errors.length > 0) {
        console.log(`  ⚠️  控制台错误:`, errors);
      }
    });
  }

  test('语言切换测试', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('http://localhost:5174/');
    await page.waitForLoadState('networkidle');

    // 测试语言切换
    const langButton = page.locator('[data-testid="language-toggle"]');
    if (await langButton.isVisible()) {
      // 切换到英文
      await langButton.click();
      await page.waitForTimeout(1000);
      
      // 检查是否有溢出
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
      const hasHorizontalOverflow = bodyScrollWidth > bodyClientWidth;
      
      console.log(`英文模式 - 页面宽度: ${bodyClientWidth}px, 内容宽度: ${bodyScrollWidth}px`);
      expect(hasHorizontalOverflow).toBeFalsy();
      
      // 切换回中文
      await langButton.click();
      await page.waitForTimeout(1000);
      
      const bodyScrollWidth2 = await page.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth2 = await page.evaluate(() => document.body.clientWidth);
      const hasHorizontalOverflow2 = bodyScrollWidth2 > bodyClientWidth2;
      
      console.log(`中文模式 - 页面宽度: ${bodyClientWidth2}px, 内容宽度: ${bodyScrollWidth2}px`);
      expect(hasHorizontalOverflow2).toBeFalsy();
    }
  });
});
