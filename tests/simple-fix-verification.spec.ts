import { test, expect } from '@playwright/test';

test('简化修复验证测试', async ({ page }) => {
  console.log('=== 开始简化修复验证测试 ===');

  // 监听控制台错误
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 监听页面错误
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  // 测试1: 验证首次加载
  console.log('\n=== 测试1: 首次加载验证 ===');
  
  await page.goto('http://localhost:5174/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const currentUrl = page.url();
  const currentPath = new URL(currentUrl).pathname;
  console.log(`首次加载重定向到: ${currentPath}`);
  
  const pageTitle = await page.title();
  console.log(`页面标题: ${pageTitle}`);
  
  // 检查简历内容是否存在
  const resumeContent = await page.locator('[data-testid="resume-content"]').count();
  console.log(`简历内容区域: ${resumeContent > 0 ? '存在' : '不存在'}`);
  
  // 截图记录首次加载
  await page.screenshot({ 
    path: 'tests/screenshots/simple-fix-verification-initial.png',
    fullPage: true 
  });

  // 测试2: 验证页签切换
  console.log('\n=== 测试2: 页签切换验证 ===');
  
  // 获取当前页面的基本信息
  const getBasicPageInfo = async () => {
    const title = await page.title();
    const url = page.url();
    const bodyText = await page.textContent('body');
    return {
      title,
      url,
      contentLength: bodyText?.length || 0,
      path: new URL(url).pathname
    };
  };
  
  // 记录xuanzang页面信息
  const xuanzangInfo = await getBasicPageInfo();
  console.log('xuanzang页面信息:', JSON.stringify(xuanzangInfo, null, 2));
  
  // 查找并点击wukong页签
  const tabs = await page.locator('[data-testid="navigation-tabs"] a').all();
  console.log(`找到${tabs.length}个页签`);
  
  let wukongTab = null;
  for (const tab of tabs) {
    const href = await tab.getAttribute('href');
    if (href === '/wukong') {
      wukongTab = tab;
      break;
    }
  }
  
  if (wukongTab) {
    console.log('点击wukong页签...');
    await wukongTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const wukongInfo = await getBasicPageInfo();
    console.log('wukong页面信息:', JSON.stringify(wukongInfo, null, 2));
    
    // 验证页面是否真的切换了
    const switched = {
      urlChanged: xuanzangInfo.url !== wukongInfo.url,
      titleChanged: xuanzangInfo.title !== wukongInfo.title,
      contentChanged: Math.abs(xuanzangInfo.contentLength - wukongInfo.contentLength) > 100
    };
    
    console.log('页面切换验证:', JSON.stringify(switched, null, 2));
    
    // 截图记录wukong页面
    await page.screenshot({ 
      path: 'tests/screenshots/simple-fix-verification-wukong.png',
      fullPage: true 
    });
    
    // 测试3: 切换回xuanzang
    console.log('\n=== 测试3: 切换回xuanzang ===');
    
    let xuanzangTab = null;
    const tabsAgain = await page.locator('[data-testid="navigation-tabs"] a').all();
    for (const tab of tabsAgain) {
      const href = await tab.getAttribute('href');
      if (href === '/xuanzang') {
        xuanzangTab = tab;
        break;
      }
    }
    
    if (xuanzangTab) {
      console.log('点击xuanzang页签...');
      await xuanzangTab.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const xuanzangInfo2 = await getBasicPageInfo();
      console.log('返回xuanzang页面信息:', JSON.stringify(xuanzangInfo2, null, 2));
      
      // 验证数据一致性
      const consistent = {
        urlSame: xuanzangInfo.url === xuanzangInfo2.url,
        titleSame: xuanzangInfo.title === xuanzangInfo2.title,
        contentSimilar: Math.abs(xuanzangInfo.contentLength - xuanzangInfo2.contentLength) < 200
      };
      
      console.log('数据一致性验证:', JSON.stringify(consistent, null, 2));
      
      // 截图记录返回xuanzang
      await page.screenshot({ 
        path: 'tests/screenshots/simple-fix-verification-return.png',
        fullPage: true 
      });
    }
  } else {
    console.log('❌ 未找到wukong页签');
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
  console.log(`✅ 首次加载重定向: ${currentPath === '/xuanzang' ? '正常' : '异常'}`);
  console.log(`✅ 页面内容加载: ${resumeContent > 0 ? '正常' : '异常'}`);
  console.log(`✅ 控制台错误: ${consoleErrors.length === 0 ? '无错误' : `${consoleErrors.length}个错误`}`);
  console.log(`✅ 页面错误: ${pageErrors.length === 0 ? '无错误' : `${pageErrors.length}个错误`}`);
  
  // 最终截图
  await page.screenshot({ 
    path: 'tests/screenshots/simple-fix-verification-final.png',
    fullPage: true 
  });
  
  console.log('\n=== 测试完成 ===');
});
