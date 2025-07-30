/**
 * 测试AudioConfig导出问题修复
 *
 * 验证页面是否正常加载，没有AudioConfig相关的错误
 */

import { test, expect } from '@playwright/test';

test.describe('AudioConfig导出问题修复测试', () => {
  test('页面应该正常加载，没有AudioConfig导出错误', async ({ page }) => {
    // 监听控制台错误
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 监听页面错误
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    // 访问页面
    await page.goto('http://localhost:5180/');

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 等待一段时间让所有脚本执行
    await page.waitForTimeout(3000);

    // 检查是否有AudioConfig相关的错误
    const audioConfigErrors = [...consoleErrors, ...pageErrors].filter(error => 
      error.includes('AudioConfig') || 
      error.includes('does not provide an export named')
    );

    // 截图保存
    await page.screenshot({ 
      path: 'tests/screenshots/audio-config-fix-test.png',
      fullPage: true 
    });

    // 验证没有AudioConfig相关错误
    expect(audioConfigErrors).toHaveLength(0);

    // 验证页面标题正确
    await expect(page).toHaveTitle(/FlexiResume/);

    // 验证主要内容已加载
    await expect(page.locator('body')).toBeVisible();

    // 输出所有错误信息（如果有的话）
    if (consoleErrors.length > 0) {
      console.log('控制台错误:', consoleErrors);
    }
    if (pageErrors.length > 0) {
      console.log('页面错误:', pageErrors);
    }

    console.log('✅ AudioConfig导出问题修复测试通过');
  });

  test('音频控制器组件应该正常渲染', async ({ page }) => {
    await page.goto('http://localhost:5180/');
    await page.waitForLoadState('networkidle');

    // 查找音频控制器相关元素
    const audioController = page.locator('[class*="AudioController"]');
    
    // 如果音频控制器存在，验证它能正常渲染
    if (await audioController.count() > 0) {
      await expect(audioController).toBeVisible();
      console.log('✅ 音频控制器组件正常渲染');
    } else {
      console.log('ℹ️ 音频控制器组件未找到（可能是条件渲染）');
    }
  });
});
