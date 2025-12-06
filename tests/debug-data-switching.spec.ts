import { test, expect } from '@playwright/test';

test('调试数据切换问题', async ({ page }) => {
  console.log('=== 开始调试数据切换问题 ===');

  // 监听控制台消息
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push(`[${type}] ${text}`);
  });

  // 访问xuanzang页面
  console.log('\n=== 步骤1: 访问xuanzang页面 ===');
  await page.goto('http://localhost:5174/xuanzang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // 获取xuanzang页面的详细信息
  const getDetailedPageInfo = async () => {
    const title = await page.title();
    const url = page.url();
    
    // 尝试获取header中的姓名
    let headerName = '';
    try {
      headerName = await page.locator('header h1').textContent() || '';
    } catch (e) {
      try {
        headerName = await page.locator('header').textContent() || '';
        headerName = headerName.split('\n')[0] || '';
      } catch (e2) {
        headerName = 'N/A';
      }
    }
    
    // 获取页面中的关键文本
    const bodyText = await page.textContent('body') || '';
    const hasXuanzang = bodyText.includes('玄奘') || bodyText.includes('唐僧');
    const hasWukong = bodyText.includes('悟空') || bodyText.includes('孙悟空');
    const hasBajie = bodyText.includes('八戒') || bodyText.includes('猪八戒');
    
    return {
      title,
      url,
      path: new URL(url).pathname,
      headerName: headerName.trim(),
      contentLength: bodyText.length,
      characterDetection: {
        hasXuanzang,
        hasWukong,
        hasBajie
      }
    };
  };
  
  const xuanzangInfo = await getDetailedPageInfo();
  console.log('xuanzang页面详细信息:', JSON.stringify(xuanzangInfo, null, 2));
  
  // 截图xuanzang页面
  await page.screenshot({ 
    path: 'tests/screenshots/debug-xuanzang-page.png',
    fullPage: true 
  });

  // 步骤2: 切换到wukong页面
  console.log('\n=== 步骤2: 切换到wukong页面 ===');
  
  const wukongTab = page.locator('[data-testid="navigation-tabs"] a[href="/wukong"]');
  const tabExists = await wukongTab.count() > 0;
  console.log(`wukong页签存在: ${tabExists}`);
  
  if (tabExists) {
    // 点击前记录控制台消息数量
    const messagesBefore = consoleMessages.length;
    
    await wukongTab.click();
    console.log('已点击wukong页签');
    
    // 等待页面响应
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 检查新的控制台消息
    const newMessages = consoleMessages.slice(messagesBefore);
    console.log(`点击后新增控制台消息: ${newMessages.length}条`);
    newMessages.forEach(msg => console.log(`  ${msg}`));
    
    const wukongInfo = await getDetailedPageInfo();
    console.log('wukong页面详细信息:', JSON.stringify(wukongInfo, null, 2));
    
    // 截图wukong页面
    await page.screenshot({ 
      path: 'tests/screenshots/debug-wukong-page.png',
      fullPage: true 
    });
    
    // 分析数据变化
    const changes = {
      urlChanged: xuanzangInfo.url !== wukongInfo.url,
      pathChanged: xuanzangInfo.path !== wukongInfo.path,
      titleChanged: xuanzangInfo.title !== wukongInfo.title,
      headerNameChanged: xuanzangInfo.headerName !== wukongInfo.headerName,
      contentLengthChanged: Math.abs(xuanzangInfo.contentLength - wukongInfo.contentLength) > 100,
      characterContentChanged: {
        xuanzangBefore: xuanzangInfo.characterDetection.hasXuanzang,
        xuanzangAfter: wukongInfo.characterDetection.hasXuanzang,
        wukongBefore: xuanzangInfo.characterDetection.hasWukong,
        wukongAfter: wukongInfo.characterDetection.hasWukong
      }
    };
    
    console.log('\n=== 数据变化分析 ===');
    console.log(JSON.stringify(changes, null, 2));
    
    // 步骤3: 检查store状态（通过页面执行）
    console.log('\n=== 步骤3: 检查store状态 ===');
    
    const storeInfo = await page.evaluate(() => {
      // 尝试访问全局store
      const store = (window as any).flexiResumeStore;
      if (store) {
        return {
          hasStore: true,
          dataKeys: Object.keys(store.data || {}),
          headerInfo: store.data?.header_info || null,
          tabsLength: store.tabs?.length || 0
        };
      }
      return { hasStore: false };
    });
    
    console.log('Store状态:', JSON.stringify(storeInfo, null, 2));
    
    // 步骤4: 再次切换到bajie验证
    console.log('\n=== 步骤4: 切换到bajie页面 ===');
    
    const bajieTab = page.locator('[data-testid="navigation-tabs"] a[href="/bajie"]');
    const bajieTabExists = await bajieTab.count() > 0;
    
    if (bajieTabExists) {
      await bajieTab.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const bajieInfo = await getDetailedPageInfo();
      console.log('bajie页面详细信息:', JSON.stringify(bajieInfo, null, 2));
      
      // 截图bajie页面
      await page.screenshot({ 
        path: 'tests/screenshots/debug-bajie-page.png',
        fullPage: true 
      });
      
      // 分析与wukong的差异
      const bajieChanges = {
        urlChanged: wukongInfo.url !== bajieInfo.url,
        titleChanged: wukongInfo.title !== bajieInfo.title,
        contentChanged: Math.abs(wukongInfo.contentLength - bajieInfo.contentLength) > 100,
        characterChanged: {
          wukongBefore: wukongInfo.characterDetection.hasWukong,
          wukongAfter: bajieInfo.characterDetection.hasWukong,
          bajieBefore: wukongInfo.characterDetection.hasBajie,
          bajieAfter: bajieInfo.characterDetection.hasBajie
        }
      };
      
      console.log('\n=== wukong到bajie变化分析 ===');
      console.log(JSON.stringify(bajieChanges, null, 2));
    }
  }

  // 输出所有控制台消息
  console.log('\n=== 所有控制台消息 ===');
  consoleMessages.forEach((msg, index) => {
    console.log(`${index + 1}. ${msg}`);
  });
  
  console.log('\n=== 调试完成 ===');
});
