import { test, expect } from '@playwright/test';

test('检查控制台错误 - Tools.ts debug 初始化问题', async ({ page }) => {
  // 监听控制台消息
  const consoleMessages: string[] = [];
  const consoleErrors: string[] = [];
  
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(`[${msg.type()}] ${text}`);
    
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  // 监听页面错误
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  // 访问页面
  await page.goto('http://localhost:5174/');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  
  // 等待一段时间确保所有脚本都执行完毕
  await page.waitForTimeout(3000);

  // 输出所有控制台消息
  console.log('=== 所有控制台消息 ===');
  consoleMessages.forEach(msg => console.log(msg));
  
  console.log('\n=== 控制台错误 ===');
  consoleErrors.forEach(error => console.log(`ERROR: ${error}`));
  
  console.log('\n=== 页面错误 ===');
  pageErrors.forEach(error => console.log(`PAGE ERROR: ${error}`));

  // 检查是否有Tools.ts相关的错误
  const toolsErrors = [...consoleErrors, ...pageErrors].filter(error => 
    error.includes('Tools.ts') || 
    error.includes('debug') || 
    error.includes('Cannot access') ||
    error.includes('before initialization')
  );

  console.log('\n=== Tools.ts相关错误 ===');
  toolsErrors.forEach(error => console.log(`TOOLS ERROR: ${error}`));

  // 如果有Tools.ts相关错误，输出详细信息
  if (toolsErrors.length > 0) {
    console.log('\n=== 错误详细分析 ===');
    console.log('发现Tools.ts相关错误，需要修复');
    
    // 检查页面是否正常加载
    const title = await page.title();
    console.log(`页面标题: ${title}`);
    
    // 检查页面内容
    const bodyText = await page.textContent('body');
    console.log(`页面内容长度: ${bodyText?.length || 0}`);
  } else {
    console.log('未发现Tools.ts相关错误');
  }

  // 截图保存
  await page.screenshot({ 
    path: 'tests/screenshots/console-error-debug.png',
    fullPage: true 
  });
});
