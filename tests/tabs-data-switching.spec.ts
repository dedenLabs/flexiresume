import { test, expect } from '@playwright/test';

test('验证tabs页签数据切换功能', async ({ page }) => {
  // 监听控制台消息
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  // 访问页面
  await page.goto('http://localhost:5174/');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 获取初始页面的角色名称
  const initialName = await page.textContent('h1');
  console.log('初始页面角色名称:', initialName);

  // 获取所有tabs
  const tabs = await page.locator('[data-testid="navigation-tabs"] a').all();
  console.log('找到tabs数量:', tabs.length);

  if (tabs.length < 2) {
    console.log('tabs数量不足，跳过测试');
    return;
  }

  // 点击第二个tab（假设是不同的角色）
  const secondTab = tabs[1];
  const secondTabText = await secondTab.textContent();
  console.log('即将点击的tab:', secondTabText);

  // 点击第二个tab
  await secondTab.click();
  
  // 等待路由切换完成
  await page.waitForTimeout(1000);
  
  // 获取切换后的角色名称
  const newName = await page.textContent('h1');
  console.log('切换后的角色名称:', newName);

  // 验证数据是否真的切换了
  console.log('=== 数据切换验证 ===');
  console.log(`初始名称: ${initialName}`);
  console.log(`切换后名称: ${newName}`);
  console.log(`是否发生变化: ${initialName !== newName}`);

  // 检查URL是否正确切换
  const currentUrl = page.url();
  console.log('当前URL:', currentUrl);

  // 检查页面内容是否真的变化了
  const pageContent = await page.textContent('body');
  
  // 截图保存当前状态
  await page.screenshot({ 
    path: 'tests/screenshots/tabs-data-switching.png',
    fullPage: true 
  });

  // 验证数据切换
  if (initialName === newName) {
    console.log('❌ 数据切换失败：角色名称没有变化');
    console.log('这确认了用户报告的问题：页面数据没有正常切换');
  } else {
    console.log('✅ 数据切换成功：角色名称已变化');
  }

  // 再次切换到第一个tab验证
  if (tabs.length > 0) {
    console.log('\n=== 切换回第一个tab验证 ===');
    await tabs[0].click();
    await page.waitForTimeout(1000);
    
    const backToFirstName = await page.textContent('h1');
    console.log('切换回第一个tab后的名称:', backToFirstName);
    
    if (backToFirstName === initialName) {
      console.log('✅ 切换回第一个tab成功');
    } else {
      console.log('❌ 切换回第一个tab失败');
    }
  }

  // 输出所有控制台消息用于调试
  console.log('\n=== 控制台消息 ===');
  consoleMessages.forEach(msg => console.log(msg));
});
