import { test, expect } from '@playwright/test';

test('基本页面加载测试', async ({ page }) => {
  console.log('=== 基本页面加载测试开始 ===');

  // 监听控制台消息
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push(`[${type}] ${text}`);
    console.log(`Console [${type}]: ${text}`);
  });

  // 监听页面错误
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.log(`Page Error: ${error.message}`);
  });

  // 访问xuanzang页面
  console.log('\n=== 访问xuanzang页面 ===');
  await page.goto('http://localhost:5174/xuanzang');
  
  // 等待页面加载
  console.log('等待页面加载...');
  await page.waitForLoadState('networkidle');
  
  // 等待更长时间确保数据加载完成
  console.log('等待数据加载完成...');
  await page.waitForTimeout(5000);
  
  // 检查页面基本信息
  const title = await page.title();
  console.log(`页面标题: "${title}"`);
  
  const url = page.url();
  console.log(`当前URL: ${url}`);
  
  // 检查页面内容
  const bodyText = await page.textContent('body');
  console.log(`页面内容长度: ${bodyText?.length || 0}`);
  
  // 检查是否有React根节点
  const reactRoot = await page.locator('#root').count();
  console.log(`React根节点: ${reactRoot > 0 ? '存在' : '不存在'}`);
  
  // 检查是否有header
  const header = await page.locator('header').count();
  console.log(`Header组件: ${header > 0 ? '存在' : '不存在'}`);
  
  // 检查是否有tabs
  const tabs = await page.locator('[data-testid="navigation-tabs"]').count();
  console.log(`导航tabs: ${tabs > 0 ? '存在' : '不存在'}`);
  
  // 检查tabs内容
  if (tabs > 0) {
    const tabLinks = await page.locator('[data-testid="navigation-tabs"] a').all();
    console.log(`找到${tabLinks.length}个tab链接`);
    
    for (let i = 0; i < tabLinks.length; i++) {
      const link = tabLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`  Tab ${i + 1}: "${text}" -> ${href}`);
    }
  }
  
  // 检查是否有主要内容区域
  const mainContent = await page.locator('main, .main-content, [role="main"]').count();
  console.log(`主要内容区域: ${mainContent > 0 ? '存在' : '不存在'}`);
  
  // 检查是否有简历内容
  const resumeContent = await page.locator('[data-testid="resume-content"]').count();
  console.log(`简历内容区域: ${resumeContent > 0 ? '存在' : '不存在'}`);
  
  // 截图保存
  await page.screenshot({ 
    path: 'tests/screenshots/basic-page-load.png',
    fullPage: true 
  });

  // 输出错误信息
  if (consoleErrors.length > 0) {
    console.log('\n=== 控制台错误 ===');
    consoleErrors.forEach(error => console.log(`ERROR: ${error}`));
  }
  
  if (pageErrors.length > 0) {
    console.log('\n=== 页面错误 ===');
    pageErrors.forEach(error => console.log(`PAGE ERROR: ${error}`));
  }

  // 输出所有控制台消息
  console.log('\n=== 所有控制台消息 ===');
  consoleMessages.forEach((msg, index) => {
    console.log(`${index + 1}. ${msg}`);
  });
  
  console.log('\n=== 基本页面加载测试完成 ===');
});
