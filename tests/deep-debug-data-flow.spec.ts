import { test, expect } from '@playwright/test';

test('深度调试数据流', async ({ page }) => {
  console.log('=== 深度调试数据流开始 ===');

  // 监听所有控制台消息
  const allConsoleMessages: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    allConsoleMessages.push(`[${type}] ${text}`);
  });

  // 步骤1: 访问xuanzang页面
  console.log('\n=== 步骤1: 访问xuanzang页面 ===');
  await page.goto('http://localhost:5174/xuanzang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // 获取页面数据
  const getPageData = async () => {
    return await page.evaluate(() => {
      const title = document.title;
      const url = window.location.href;
      const bodyText = document.body.textContent || '';
      
      // 尝试获取store数据
      let storeData = null;
      try {
        const store = (window as any).flexiResumeStore;
        if (store) {
          storeData = {
            hasData: !!store.data,
            dataKeys: Object.keys(store.data || {}),
            headerName: store.data?.header_info?.name || 'N/A',
            headerPosition: store.data?.header_info?.position || 'N/A',
            tabsCount: store.tabs?.length || 0
          };
        }
      } catch (e) {
        storeData = { error: e.message };
      }
      
      return {
        title,
        url,
        path: window.location.pathname,
        contentLength: bodyText.length,
        storeData
      };
    });
  };
  
  const xuanzangData = await getPageData();
  console.log('xuanzang页面数据:', JSON.stringify(xuanzangData, null, 2));
  
  // 步骤2: 切换到wukong页面
  console.log('\n=== 步骤2: 切换到wukong页面 ===');
  const wukongTab = page.locator('[data-testid="navigation-tabs"] a[href="/wukong"]');
  
  if (await wukongTab.count() > 0) {
    console.log('点击wukong页签...');
    
    // 记录点击前的控制台消息数量
    const messagesBefore = allConsoleMessages.length;
    
    await wukongTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 检查点击后的新消息
    const newMessages = allConsoleMessages.slice(messagesBefore);
    console.log(`点击后新增${newMessages.length}条控制台消息:`);
    newMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. ${msg}`);
    });
    
    const wukongData = await getPageData();
    console.log('wukong页面数据:', JSON.stringify(wukongData, null, 2));
    
    // 分析数据变化
    const changes = {
      urlChanged: xuanzangData.url !== wukongData.url,
      pathChanged: xuanzangData.path !== wukongData.path,
      titleChanged: xuanzangData.title !== wukongData.title,
      contentChanged: Math.abs(xuanzangData.contentLength - wukongData.contentLength) > 100,
      storeDataChanged: JSON.stringify(xuanzangData.storeData) !== JSON.stringify(wukongData.storeData)
    };
    
    console.log('\n=== 数据变化分析 ===');
    console.log(JSON.stringify(changes, null, 2));
    
    // 如果store数据没有变化，检查是否是同一个对象引用
    if (!changes.storeDataChanged) {
      console.log('\n⚠️ Store数据没有变化，可能的原因:');
      console.log('1. useEffect没有被触发');
      console.log('2. updateCurrentResumeStore没有被调用');
      console.log('3. MobX响应性问题');
      console.log('4. 组件没有重新渲染');
    }
  }
  
  // 步骤3: 检查FlexiResume相关的日志
  console.log('\n=== FlexiResume相关日志分析 ===');
  const flexiResumeLogs = allConsoleMessages.filter(msg => 
    msg.includes('FlexiResume') || 
    msg.includes('useEffect') ||
    msg.includes('🔄') ||
    msg.includes('📊') ||
    msg.includes('⚡') ||
    msg.includes('✅')
  );
  
  console.log(`找到${flexiResumeLogs.length}条FlexiResume相关日志:`);
  flexiResumeLogs.forEach((log, index) => {
    console.log(`${index + 1}. ${log}`);
  });
  
  if (flexiResumeLogs.length === 0) {
    console.log('❌ 没有找到FlexiResume的useEffect调试日志，说明useEffect可能没有被触发');
  }
  
  // 步骤4: 检查路由相关的日志
  console.log('\n=== 路由相关日志分析 ===');
  const routeLogs = allConsoleMessages.filter(msg => 
    msg.includes('navigate') ||
    msg.includes('router') ||
    msg.includes('route') ||
    msg.includes('path') ||
    msg.includes('location')
  );
  
  console.log(`找到${routeLogs.length}条路由相关日志:`);
  routeLogs.forEach((log, index) => {
    console.log(`${index + 1}. ${log}`);
  });
  
  console.log('\n=== 深度调试完成 ===');
});
