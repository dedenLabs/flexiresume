import { test, expect } from '@playwright/test';

test('调试useEffect触发情况', async ({ page }) => {
  console.log('=== 调试useEffect触发情况 ===');

  // 监听控制台消息，特别关注FlexiResume的调试日志
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push(`[${type}] ${text}`);
    
    // 实时输出FlexiResume相关的日志
    if (text.includes('FlexiResume') || text.includes('useEffect') || text.includes('position')) {
      console.log(`🔍 FlexiResume Log [${type}]: ${text}`);
    }
  });

  // 访问xuanzang页面
  console.log('\n=== 步骤1: 访问xuanzang页面 ===');
  await page.goto('http://localhost:5174/xuanzang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('xuanzang页面加载完成');
  
  // 切换到wukong页面
  console.log('\n=== 步骤2: 切换到wukong页面 ===');
  const wukongTab = page.locator('[data-testid="navigation-tabs"] a[href="/wukong"]');
  
  if (await wukongTab.count() > 0) {
    console.log('点击wukong页签...');
    await wukongTab.click();
    
    // 等待路由切换
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('wukong页面切换完成');
  }
  
  // 切换到bajie页面
  console.log('\n=== 步骤3: 切换到bajie页面 ===');
  const bajieTab = page.locator('[data-testid="navigation-tabs"] a[href="/bajie"]');
  
  if (await bajieTab.count() > 0) {
    console.log('点击bajie页签...');
    await bajieTab.click();
    
    // 等待路由切换
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('bajie页面切换完成');
  }

  // 输出所有FlexiResume相关的控制台消息
  console.log('\n=== FlexiResume相关日志分析 ===');
  const flexiResumeLogs = consoleMessages.filter(msg => 
    msg.includes('FlexiResume') || 
    msg.includes('useEffect') || 
    msg.includes('position') ||
    msg.includes('首次加载') ||
    msg.includes('快速位置切换') ||
    msg.includes('使用缓存数据')
  );
  
  console.log(`找到${flexiResumeLogs.length}条FlexiResume相关日志:`);
  flexiResumeLogs.forEach((log, index) => {
    console.log(`${index + 1}. ${log}`);
  });
  
  // 检查是否有数据更新相关的日志
  const dataUpdateLogs = consoleMessages.filter(msg => 
    msg.includes('updateCurrentResumeStore') ||
    msg.includes('数据加载') ||
    msg.includes('数据更新') ||
    msg.includes('store')
  );
  
  console.log(`\n=== 数据更新相关日志 (${dataUpdateLogs.length}条) ===`);
  dataUpdateLogs.forEach((log, index) => {
    console.log(`${index + 1}. ${log}`);
  });
  
  // 检查是否有错误
  const errorLogs = consoleMessages.filter(msg => 
    msg.includes('[error]') && 
    !msg.includes('Failed to decode downloaded font') &&
    !msg.includes('OTS parsing error')
  );
  
  if (errorLogs.length > 0) {
    console.log(`\n=== 错误日志 (${errorLogs.length}条) ===`);
    errorLogs.forEach((log, index) => {
      console.log(`${index + 1}. ${log}`);
    });
  } else {
    console.log('\n✅ 没有发现相关错误日志');
  }
  
  console.log('\n=== 调试完成 ===');
});
