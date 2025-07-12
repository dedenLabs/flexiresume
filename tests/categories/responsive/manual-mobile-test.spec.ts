import { test, expect } from '@playwright/test';

/**
 * 手动移动端测试 - 简化版本
 * 快速验证移动端溢出修复效果
 */

test.describe('手动移动端测试', () => {
  
  test('iPhone SE 竖屏模式测试', async ({ page }) => {
    console.log('\n=== iPhone SE 竖屏模式测试 ===');
    
    // 设置iPhone SE视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 测试游戏开发页面
    await page.goto('http://localhost:5174/game');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 检查页面是否正常加载
    const resumeContent = page.locator('[data-testid="resume-content"]');
    await expect(resumeContent).toBeVisible({ timeout: 10000 });

    // 检查是否有横向滚动条
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    const hasHorizontalOverflow = bodyScrollWidth > bodyClientWidth;
    
    console.log(`页面宽度: ${bodyClientWidth}px, 内容宽度: ${bodyScrollWidth}px`);
    console.log(`是否有横向溢出: ${hasHorizontalOverflow ? '是' : '否'}`);
    
    if (hasHorizontalOverflow) {
      console.log(`溢出量: ${bodyScrollWidth - bodyClientWidth}px`);
    }

    // 检查主要容器的宽度
    const resumeWrapper = page.locator('[data-testid="resume-content"]');
    const wrapperBox = await resumeWrapper.boundingBox();
    
    if (wrapperBox) {
      console.log(`简历容器宽度: ${wrapperBox.width}px`);
      console.log(`容器是否超出视口: ${wrapperBox.width > 375 ? '是' : '否'}`);
    }

    // 检查导航标签
    const tabs = page.locator('[data-testid="navigation-tabs"]');
    if (await tabs.isVisible()) {
      const tabsBox = await tabs.boundingBox();
      if (tabsBox) {
        console.log(`导航标签宽度: ${tabsBox.width}px`);
        console.log(`标签是否超出视口: ${tabsBox.width > 375 ? '是' : '否'}`);
      }
    }

    // 截图
    await page.screenshot({ 
      path: 'tests/screenshots/manual-iphone-se-game.png',
      fullPage: true 
    });
    console.log('截图已保存: tests/screenshots/manual-iphone-se-game.png');

    // 验证不应该有横向溢出
    expect(hasHorizontalOverflow).toBeFalsy();
    
    // 验证容器宽度不超出视口
    if (wrapperBox) {
      expect(wrapperBox.width).toBeLessThanOrEqual(375);
    }
  });

  test('Samsung Galaxy S21 竖屏模式测试', async ({ page }) => {
    console.log('\n=== Samsung Galaxy S21 竖屏模式测试 ===');
    
    // 设置Samsung Galaxy S21视口
    await page.setViewportSize({ width: 360, height: 800 });
    
    // 测试全栈开发页面
    await page.goto('http://localhost:5174/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // 检查页面是否正常加载
    const resumeContent = page.locator('[data-testid="resume-content"]');
    await expect(resumeContent).toBeVisible({ timeout: 10000 });

    // 检查是否有横向滚动条
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    const hasHorizontalOverflow = bodyScrollWidth > bodyClientWidth;
    
    console.log(`页面宽度: ${bodyClientWidth}px, 内容宽度: ${bodyScrollWidth}px`);
    console.log(`是否有横向溢出: ${hasHorizontalOverflow ? '是' : '否'}`);
    
    if (hasHorizontalOverflow) {
      console.log(`溢出量: ${bodyScrollWidth - bodyClientWidth}px`);
    }

    // 检查主要容器的宽度
    const resumeWrapper = page.locator('[data-testid="resume-content"]');
    const wrapperBox = await resumeWrapper.boundingBox();
    
    if (wrapperBox) {
      console.log(`简历容器宽度: ${wrapperBox.width}px`);
      console.log(`容器是否超出视口: ${wrapperBox.width > 360 ? '是' : '否'}`);
    }

    // 截图
    await page.screenshot({ 
      path: 'tests/screenshots/manual-galaxy-s21-fullstack.png',
      fullPage: true 
    });
    console.log('截图已保存: tests/screenshots/manual-galaxy-s21-fullstack.png');

    // 验证不应该有横向溢出
    expect(hasHorizontalOverflow).toBeFalsy();
    
    // 验证容器宽度不超出视口
    if (wrapperBox) {
      expect(wrapperBox.width).toBeLessThanOrEqual(360);
    }
  });

  test('所有页面快速检查', async ({ page }) => {
    console.log('\n=== 所有页面快速检查 ===');
    
    const pages = [
      { path: '/game', name: '游戏开发' },
      { path: '/contracttask', name: '外包任务' },
      { path: '/fullstack', name: '全栈开发' },
      { path: '/frontend', name: '前端开发' }
    ];

    // 设置iPhone SE视口
    await page.setViewportSize({ width: 375, height: 667 });

    for (const pageInfo of pages) {
      console.log(`\n检查页面: ${pageInfo.name} (${pageInfo.path})`);
      
      await page.goto(`http://localhost:5174${pageInfo.path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // 检查是否有横向溢出
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
      const hasHorizontalOverflow = bodyScrollWidth > bodyClientWidth;
      
      console.log(`  页面宽度: ${bodyClientWidth}px, 内容宽度: ${bodyScrollWidth}px`);
      console.log(`  横向溢出: ${hasHorizontalOverflow ? '❌ 是' : '✅ 否'}`);
      
      // 验证不应该有横向溢出
      expect(hasHorizontalOverflow).toBeFalsy();
    }
  });
});
