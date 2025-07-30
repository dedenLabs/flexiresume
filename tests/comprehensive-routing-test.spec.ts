import { test, expect } from '@playwright/test';

test('综合路由测试', async ({ page }) => {
  console.log('=== 综合路由测试开始 ===');

  // 测试1: 根页面重定向
  console.log('\n1. 测试根页面重定向');
  await page.goto('http://localhost:5174/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const rootRedirectUrl = page.url();
  const rootPath = new URL(rootRedirectUrl).pathname;
  console.log(`根页面重定向到: ${rootPath}`);
  
  // 测试2: 直接访问xuanzang页面
  console.log('\n2. 测试直接访问xuanzang页面');
  await page.goto('http://localhost:5174/xuanzang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const xuanzangUrl = page.url();
  const xuanzangPath = new URL(xuanzangUrl).pathname;
  console.log(`xuanzang页面路径: ${xuanzangPath}`);
  
  // 测试3: 检查getDefaultPath方法
  console.log('\n3. 检查getDefaultPath方法');
  const defaultPathResult = await page.evaluate(() => {
    // 尝试访问全局的App组件或store
    const store = (window as any).flexiResumeStore;
    if (store && store.data && store.data.expected_positions) {
      const positions = store.data.expected_positions;
      const homePagePosition = Object.keys(positions).find(key => 
        positions[key].is_home_page === true
      );
      return {
        hasStore: true,
        homePagePosition: homePagePosition,
        allPositions: Object.keys(positions),
        homePageData: homePagePosition ? positions[homePagePosition] : null
      };
    }
    return { hasStore: false };
  });
  
  console.log('getDefaultPath检查结果:', JSON.stringify(defaultPathResult, null, 2));
  
  // 测试4: 检查tabs切换
  console.log('\n4. 测试tabs切换');
  const tabs = await page.locator('[data-testid="navigation-tabs"] a').all();
  console.log(`找到${tabs.length}个tabs`);
  
  for (let i = 0; i < Math.min(tabs.length, 3); i++) {
    const tab = tabs[i];
    const tabText = await tab.textContent();
    const tabHref = await tab.getAttribute('href');
    
    console.log(`点击tab: "${tabText}" -> ${tabHref}`);
    await tab.click();
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    const currentPath = new URL(currentUrl).pathname;
    console.log(`切换后路径: ${currentPath}`);
    
    // 检查页面内容是否变化
    const pageContent = await page.textContent('body');
    console.log(`页面内容长度: ${pageContent?.length || 0}`);
  }
  
  // 测试5: 再次访问根页面确认一致性
  console.log('\n5. 再次测试根页面重定向一致性');
  await page.goto('http://localhost:5174/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const finalUrl = page.url();
  const finalPath = new URL(finalUrl).pathname;
  console.log(`最终重定向到: ${finalPath}`);
  
  // 截图保存
  await page.screenshot({ 
    path: 'tests/screenshots/comprehensive-routing-test.png',
    fullPage: true 
  });
  
  // 总结
  console.log('\n=== 路由测试总结 ===');
  console.log(`根页面重定向: ${rootPath === finalPath ? '✅ 一致' : '❌ 不一致'}`);
  console.log(`重定向目标: ${rootPath}`);
  console.log(`is_home_page功能: ${defaultPathResult.hasStore ? '✅ 正常' : '❌ 异常'}`);
  console.log(`默认页面: ${defaultPathResult.homePagePosition || '未找到'}`);
});
