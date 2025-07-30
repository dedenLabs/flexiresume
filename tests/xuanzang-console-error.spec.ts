import { test, expect } from '@playwright/test';

test('检查xuanzang页面控制台错误', async ({ page }) => {
  // 监听控制台消息
  const consoleMessages: string[] = [];
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];
  
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push(`[${type}] ${text}`);
    
    if (type === 'error') {
      consoleErrors.push(text);
    } else if (type === 'warning') {
      consoleWarnings.push(text);
    }
  });

  // 监听页面错误
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  // 访问xuanzang页面
  await page.goto('http://localhost:5174/xuanzang');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  
  // 等待一段时间确保所有脚本都执行完毕
  await page.waitForTimeout(5000);

  // 输出所有控制台消息
  console.log('=== xuanzang页面控制台消息 ===');
  consoleMessages.forEach(msg => console.log(msg));
  
  console.log('\n=== 控制台错误 ===');
  consoleErrors.forEach(error => console.log(`ERROR: ${error}`));
  
  console.log('\n=== 控制台警告 ===');
  consoleWarnings.forEach(warning => console.log(`WARNING: ${warning}`));
  
  console.log('\n=== 页面错误 ===');
  pageErrors.forEach(error => console.log(`PAGE ERROR: ${error}`));

  // 检查页面是否正常加载
  const title = await page.title();
  console.log(`\n页面标题: ${title}`);
  
  // 检查页面内容
  const bodyText = await page.textContent('body');
  console.log(`页面内容长度: ${bodyText?.length || 0}`);
  
  // 检查是否有React根节点
  const reactRoot = await page.locator('#root').count();
  console.log(`React根节点: ${reactRoot > 0 ? '存在' : '不存在'}`);

  // 截图保存
  await page.screenshot({ 
    path: 'tests/screenshots/xuanzang-console-error.png',
    fullPage: true 
  });

  // 分析错误类型
  const criticalErrors = [...consoleErrors, ...pageErrors].filter(error => 
    !error.includes('Failed to load resource') &&
    !error.includes('net::ERR_') &&
    !error.includes('favicon.ico') &&
    !error.includes('404')
  );

  if (criticalErrors.length > 0) {
    console.log('\n=== 关键错误分析 ===');
    criticalErrors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
      
      // 分析错误类型
      if (error.includes('pathname')) {
        console.log('   -> 可能是路由相关错误');
      }
      if (error.includes('undefined')) {
        console.log('   -> 可能是变量未定义错误');
      }
      if (error.includes('Cannot read properties')) {
        console.log('   -> 可能是对象属性访问错误');
      }
    });
  }
});
