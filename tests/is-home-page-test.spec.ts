import { test, expect } from '@playwright/test';

test('验证is_home_page功能是否正常工作', async ({ page }) => {
  // 监听控制台消息
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  // 访问根路径
  await page.goto('http://localhost:5174/');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // 获取当前URL
  const currentUrl = page.url();
  console.log('当前URL:', currentUrl);

  // 检查是否正确重定向到home page
  const urlPath = new URL(currentUrl).pathname;
  console.log('URL路径:', urlPath);

  // 获取所有tabs
  const tabs = await page.locator('[data-testid="navigation-tabs"] a').all();
  console.log('找到tabs数量:', tabs.length);

  // 检查每个tab的信息
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    const tabText = await tab.textContent();
    const tabHref = await tab.getAttribute('href');
    const isActive = await tab.evaluate(el => el.classList.contains('active'));
    
    console.log(`Tab ${i + 1}: "${tabText}" -> ${tabHref} (active: ${isActive})`);
  }

  // 检查是否有默认的home page
  const hasHomePage = urlPath !== '/' && urlPath !== '';
  console.log('是否有默认主页:', hasHomePage);

  if (hasHomePage) {
    console.log('✅ is_home_page功能正常工作，已重定向到:', urlPath);
  } else {
    console.log('❌ is_home_page功能可能失效，仍在根路径');
  }

  // 手动检查数据结构
  const dataCheck = await page.evaluate(() => {
    // 尝试访问全局数据或store
    const store = (window as any).flexiResumeStore;
    if (store && store.data && store.data.expected_positions) {
      const positions = store.data.expected_positions;
      const homePagePositions = Object.keys(positions).filter(key => 
        positions[key].is_home_page === true
      );
      return {
        hasStore: true,
        totalPositions: Object.keys(positions).length,
        homePagePositions: homePagePositions,
        positions: Object.keys(positions).map(key => ({
          key,
          isHomePage: positions[key].is_home_page,
          name: positions[key].header_info?.name
        }))
      };
    }
    return { hasStore: false };
  });

  console.log('数据结构检查:', JSON.stringify(dataCheck, null, 2));

  // 截图保存当前状态
  await page.screenshot({ 
    path: 'tests/screenshots/is-home-page-test.png',
    fullPage: true 
  });

  // 输出所有控制台消息用于调试
  console.log('\n=== 控制台消息 ===');
  consoleMessages.forEach(msg => console.log(msg));
});
