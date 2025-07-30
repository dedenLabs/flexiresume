import { test, expect } from '@playwright/test';

test('综合修复验证 - PageTransition和数据切换', async ({ page }) => {
  console.log('=== 开始综合修复验证测试 ===');

  // 监听控制台消息和错误
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

  // 测试1: 验证首次加载时PageTransition不触发动画
  console.log('\n=== 测试1: 首次加载PageTransition行为 ===');
  
  const startTime = Date.now();
  await page.goto('http://localhost:5174/');
  await page.waitForLoadState('networkidle');
  
  // 等待页面完全加载
  await page.waitForTimeout(2000);
  
  const loadTime = Date.now() - startTime;
  console.log(`首次加载耗时: ${loadTime}ms`);
  
  // 检查页面是否正确重定向到xuanzang
  const currentUrl = page.url();
  const currentPath = new URL(currentUrl).pathname;
  console.log(`首次加载重定向到: ${currentPath}`);
  
  // 检查页面内容是否正确加载
  const pageTitle = await page.title();
  console.log(`页面标题: ${pageTitle}`);
  
  // 检查是否有主要内容
  const resumeContent = await page.locator('[data-testid="resume-content"]').count();
  console.log(`简历内容区域: ${resumeContent > 0 ? '存在' : '不存在'}`);
  
  // 截图记录首次加载状态
  await page.screenshot({ 
    path: 'tests/screenshots/fix-verification-initial-load.png',
    fullPage: true 
  });

  // 测试2: 验证页签切换时数据正确更新
  console.log('\n=== 测试2: 页签切换数据更新验证 ===');
  
  // 获取当前页面的关键数据
  const getPageData = async () => {
    const title = await page.title();
    const headerName = await page.locator('header h1, header .name, [data-testid="header-name"]').textContent() || '';
    const headerPosition = await page.locator('header .position, [data-testid="header-position"]').textContent() || '';
    const bodyText = await page.textContent('body');
    
    return {
      title,
      headerName: headerName.trim(),
      headerPosition: headerPosition.trim(),
      contentLength: bodyText?.length || 0,
      url: page.url()
    };
  };
  
  // 记录xuanzang页面数据
  const xuanzangData = await getPageData();
  console.log('xuanzang页面数据:', JSON.stringify(xuanzangData, null, 2));
  
  // 点击切换到wukong页签
  console.log('\n--- 切换到wukong页签 ---');
  const wukongTab = page.locator('[data-testid="navigation-tabs"] a[href="/wukong"]');
  
  if (await wukongTab.count() > 0) {
    const transitionStartTime = Date.now();
    await wukongTab.click();
    
    // 等待页面切换完成
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const transitionTime = Date.now() - transitionStartTime;
    console.log(`页签切换耗时: ${transitionTime}ms`);
    
    // 记录wukong页面数据
    const wukongData = await getPageData();
    console.log('wukong页面数据:', JSON.stringify(wukongData, null, 2));
    
    // 验证数据是否真正切换了
    const dataChanged = {
      titleChanged: xuanzangData.title !== wukongData.title,
      nameChanged: xuanzangData.headerName !== wukongData.headerName,
      positionChanged: xuanzangData.headerPosition !== wukongData.headerPosition,
      urlChanged: xuanzangData.url !== wukongData.url,
      contentChanged: Math.abs(xuanzangData.contentLength - wukongData.contentLength) > 100
    };
    
    console.log('数据变化检测:', JSON.stringify(dataChanged, null, 2));
    
    // 截图记录wukong页面
    await page.screenshot({ 
      path: 'tests/screenshots/fix-verification-wukong-page.png',
      fullPage: true 
    });
    
    // 测试3: 再次切换到bajie验证连续切换
    console.log('\n--- 切换到bajie页签 ---');
    const bajieTab = page.locator('[data-testid="navigation-tabs"] a[href="/bajie"]');
    
    if (await bajieTab.count() > 0) {
      await bajieTab.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const bajieData = await getPageData();
      console.log('bajie页面数据:', JSON.stringify(bajieData, null, 2));
      
      // 验证与wukong数据的差异
      const bajieVsWukong = {
        titleChanged: wukongData.title !== bajieData.title,
        nameChanged: wukongData.headerName !== bajieData.headerName,
        positionChanged: wukongData.headerPosition !== bajieData.headerPosition,
        urlChanged: wukongData.url !== bajieData.url,
        contentChanged: Math.abs(wukongData.contentLength - bajieData.contentLength) > 100
      };
      
      console.log('bajie vs wukong数据变化:', JSON.stringify(bajieVsWukong, null, 2));
      
      // 截图记录bajie页面
      await page.screenshot({ 
        path: 'tests/screenshots/fix-verification-bajie-page.png',
        fullPage: true 
      });
    }
    
    // 测试4: 切换回xuanzang验证数据一致性
    console.log('\n--- 切换回xuanzang页签 ---');
    const xuanzangTab = page.locator('[data-testid="navigation-tabs"] a[href="/xuanzang"]');
    
    if (await xuanzangTab.count() > 0) {
      await xuanzangTab.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const xuanzangData2 = await getPageData();
      console.log('返回xuanzang页面数据:', JSON.stringify(xuanzangData2, null, 2));
      
      // 验证数据一致性
      const dataConsistency = {
        titleConsistent: xuanzangData.title === xuanzangData2.title,
        nameConsistent: xuanzangData.headerName === xuanzangData2.headerName,
        positionConsistent: xuanzangData.headerPosition === xuanzangData2.headerPosition,
        contentSimilar: Math.abs(xuanzangData.contentLength - xuanzangData2.contentLength) < 100
      };
      
      console.log('xuanzang数据一致性检查:', JSON.stringify(dataConsistency, null, 2));
    }
  }

  // 输出错误信息
  if (consoleErrors.length > 0) {
    console.log('\n=== 控制台错误 ===');
    consoleErrors.forEach(error => console.log(`ERROR: ${error}`));
  }
  
  if (pageErrors.length > 0) {
    console.log('\n=== 页面错误 ===');
    pageErrors.forEach(error => console.log(`PAGE ERROR: ${error}`));
  }

  // 最终验证总结
  console.log('\n=== 修复验证总结 ===');
  console.log(`✅ 首次加载: ${currentPath === '/xuanzang' ? '正常重定向' : '重定向异常'}`);
  console.log(`✅ 页面内容: ${resumeContent > 0 ? '正常加载' : '加载异常'}`);
  console.log(`✅ 控制台错误: ${consoleErrors.length === 0 ? '无错误' : `${consoleErrors.length}个错误`}`);
  console.log(`✅ 页面错误: ${pageErrors.length === 0 ? '无错误' : `${pageErrors.length}个错误`}`);
  
  // 最终截图
  await page.screenshot({ 
    path: 'tests/screenshots/fix-verification-final.png',
    fullPage: true 
  });
});
