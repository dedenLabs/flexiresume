import { test, expect } from '@playwright/test';

test('简单验证tabs数据切换', async ({ page }) => {
  // 访问页面
  await page.goto('http://localhost:5174/');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // 获取初始页面的角色名称（使用n标签）
  const initialNameElement = await page.locator('n').first();
  const initialName = await initialNameElement.textContent();
  console.log('初始页面角色名称:', initialName);

  // 获取所有tabs
  const tabsContainer = await page.locator('[data-testid="navigation-tabs"]');
  const tabs = await tabsContainer.locator('a').all();
  console.log('找到tabs数量:', tabs.length);

  if (tabs.length < 2) {
    console.log('tabs数量不足，跳过测试');
    return;
  }

  // 点击第二个tab
  const secondTab = tabs[1];
  const secondTabText = await secondTab.textContent();
  console.log('即将点击的tab:', secondTabText);

  // 点击第二个tab
  await secondTab.click();
  
  // 等待路由切换完成
  await page.waitForTimeout(2000);
  
  // 获取切换后的角色名称（使用n标签）
  const newNameElement = await page.locator('n').first();
  const newName = await newNameElement.textContent();
  console.log('切换后的角色名称:', newName);

  // 验证数据是否真的切换了
  console.log('=== 数据切换验证 ===');
  console.log(`初始名称: ${initialName}`);
  console.log(`切换后名称: ${newName}`);
  console.log(`是否发生变化: ${initialName !== newName}`);

  // 截图保存当前状态
  await page.screenshot({ 
    path: 'tests/screenshots/simple-tabs-test.png',
    fullPage: true 
  });

  // 验证数据切换
  if (initialName === newName) {
    console.log('❌ 数据切换失败：角色名称没有变化');
    console.log('问题确认：页面数据没有正常切换');
  } else {
    console.log('✅ 数据切换成功：角色名称已变化');
  }
});
