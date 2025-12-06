import { test, expect } from '@playwright/test';

test('检查根页面路由问题', async ({ page }) => {
  // 监听控制台消息
  const consoleMessages: string[] = [];
  const consoleErrors: string[] = [];
  
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push(`[${type}] ${text}`);
    
    if (type === 'error') {
      consoleErrors.push(text);
    }
  });

  // 监听页面错误
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  console.log('=== 访问根页面 ===');
  
  // 访问根页面
  await page.goto('http://localhost:5174/');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  
  // 等待一段时间确保所有脚本都执行完毕
  await page.waitForTimeout(5000);

  // 获取当前URL
  const currentUrl = page.url();
  console.log('当前URL:', currentUrl);
  
  // 检查是否重定向
  const urlPath = new URL(currentUrl).pathname;
  console.log('URL路径:', urlPath);
  
  // 检查页面标题
  const title = await page.title();
  console.log('页面标题:', title);
  
  // 检查页面内容
  const bodyText = await page.textContent('body');
  console.log('页面内容长度:', bodyText?.length || 0);
  
  // 检查是否有React根节点
  const reactRoot = await page.locator('#root').count();
  console.log('React根节点:', reactRoot > 0 ? '存在' : '不存在');
  
  // 检查根节点内容
  const rootContent = await page.locator('#root').textContent();
  console.log('根节点内容长度:', rootContent?.length || 0);
  
  // 检查是否有tabs
  const tabs = await page.locator('[data-testid="navigation-tabs"] a').count();
  console.log('导航tabs数量:', tabs);
  
  // 检查是否有主要内容区域
  const mainContent = await page.locator('main, .main-content, [role="main"]').count();
  console.log('主要内容区域:', mainContent);
  
  // 检查是否有Header组件
  const header = await page.locator('header, .header').count();
  console.log('Header组件:', header);
  
  // 检查是否有错误边界显示
  const errorBoundary = await page.locator('.error-boundary, [data-testid="error-boundary"]').count();
  console.log('错误边界:', errorBoundary);

  // 截图保存
  await page.screenshot({ 
    path: 'tests/screenshots/root-page-routing.png',
    fullPage: true 
  });

  // 输出控制台错误
  if (consoleErrors.length > 0) {
    console.log('\n=== 控制台错误 ===');
    consoleErrors.forEach(error => console.log(`ERROR: ${error}`));
  }
  
  if (pageErrors.length > 0) {
    console.log('\n=== 页面错误 ===');
    pageErrors.forEach(error => console.log(`PAGE ERROR: ${error}`));
  }

  // 分析路由问题
  console.log('\n=== 路由分析 ===');
  if (urlPath === '/') {
    console.log('❌ 根页面没有重定向到默认页面');
  } else {
    console.log(`✅ 根页面已重定向到: ${urlPath}`);
  }
  
  if (bodyText && bodyText.length < 100) {
    console.log('❌ 页面内容过少，可能没有正确加载');
  } else {
    console.log('✅ 页面内容正常');
  }
  
  // 检查是否是空白页面
  const isBlankPage = !bodyText || bodyText.trim().length < 50;
  if (isBlankPage) {
    console.log('❌ 检测到空白页面');
  } else {
    console.log('✅ 页面有内容');
  }
});
