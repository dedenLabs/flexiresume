/**
 * 数据加载测试
 * 验证数据加载器是否正常工作
 */

import { test, expect } from '@playwright/test';

test.describe('数据加载测试', () => {
  test('应该能够加载中文数据', async ({ page }) => {
    console.log('🔍 测试数据加载...');
    
    // 监听控制台消息和网络错误
    const consoleMessages: string[] = [];
    const errorMessages: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(`[${msg.type()}] ${text}`);

      if (msg.type() === 'error') {
        errorMessages.push(text);
      }
    });

    page.on('response', response => {
      if (!response.ok()) {
        networkErrors.push(`${response.status()} ${response.url()}`);
      }
    });
    
    // 访问页面
    await page.goto('http://localhost:5174/');
    
    // 等待更长时间让数据加载
    await page.waitForTimeout(10000);
    
    // 检查页面内容
    const bodyText = await page.locator('body').textContent();
    console.log('📝 页面内容长度:', bodyText?.length || 0);
    console.log('📝 页面内容预览:', bodyText?.substring(0, 200) || '');
    
    // 检查是否有数据相关的元素
    const hasName = await page.locator('text=陈剑').count();
    console.log('👤 姓名元素数量:', hasName);
    
    // 检查是否有简历内容
    const hasResumeContent = await page.locator('[data-testid="resume-content"]').count();
    console.log('📄 简历内容元素数量:', hasResumeContent);
    
    // 输出控制台消息
    console.log('📋 控制台消息数量:', consoleMessages.length);
    if (consoleMessages.length > 0) {
      console.log('📋 控制台消息:', consoleMessages.slice(0, 10));
    }
    
    if (errorMessages.length > 0) {
      console.log('❌ 错误消息:', errorMessages);
    }

    if (networkErrors.length > 0) {
      console.log('🌐 网络错误:', networkErrors);
    }
    
    // 截图保存
    await page.screenshot({ 
      path: 'tests/screenshots/data-loading-test.png',
      fullPage: true 
    });
    
    console.log('✅ 数据加载测试完成');
  });
});
