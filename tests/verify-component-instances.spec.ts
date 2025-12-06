import { test, expect } from '@playwright/test';

test('验证组件实例和useEffect触发', async ({ page }) => {
  console.log('=== 验证组件实例和useEffect触发 ===');

  // 添加页面脚本来监控组件实例
  await page.addInitScript(() => {
    // 全局计数器
    (window as any).flexiResumeInstances = [];
    (window as any).useEffectCalls = [];
    
    // 拦截console.log来捕获调试信息
    const originalLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('FlexiResume') || message.includes('useEffect')) {
        (window as any).useEffectCalls.push(message);
      }
      originalLog.apply(console, args);
    };
  });

  // 访问xuanzang页面
  console.log('\n=== 步骤1: 访问xuanzang页面 ===');
  await page.goto('http://localhost:5174/xuanzang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // 检查初始状态
  const initialState = await page.evaluate(() => {
    return {
      instances: (window as any).flexiResumeInstances?.length || 0,
      useEffectCalls: (window as any).useEffectCalls?.length || 0,
      pathname: window.location.pathname,
      title: document.title
    };
  });
  
  console.log('初始状态:', JSON.stringify(initialState, null, 2));
  
  // 切换到wukong页面
  console.log('\n=== 步骤2: 切换到wukong页面 ===');
  const wukongTab = page.locator('[data-testid="navigation-tabs"] a[href="/wukong"]');
  
  if (await wukongTab.count() > 0) {
    await wukongTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查切换后的状态
    const afterSwitchState = await page.evaluate(() => {
      return {
        instances: (window as any).flexiResumeInstances?.length || 0,
        useEffectCalls: (window as any).useEffectCalls?.length || 0,
        pathname: window.location.pathname,
        title: document.title,
        allUseEffectCalls: (window as any).useEffectCalls || []
      };
    });
    
    console.log('切换后状态:', JSON.stringify(afterSwitchState, null, 2));
    
    // 分析变化
    const changes = {
      instancesChanged: initialState.instances !== afterSwitchState.instances,
      useEffectCallsChanged: initialState.useEffectCalls !== afterSwitchState.useEffectCalls,
      pathnameChanged: initialState.pathname !== afterSwitchState.pathname,
      titleChanged: initialState.title !== afterSwitchState.title
    };
    
    console.log('\n=== 变化分析 ===');
    console.log(JSON.stringify(changes, null, 2));
    
    if (afterSwitchState.allUseEffectCalls.length > 0) {
      console.log('\n=== useEffect调用记录 ===');
      afterSwitchState.allUseEffectCalls.forEach((call, index) => {
        console.log(`${index + 1}. ${call}`);
      });
    } else {
      console.log('\n❌ 没有捕获到useEffect调用');
    }
  }
  
  // 手动检查FlexiResume组件是否存在
  const componentExists = await page.evaluate(() => {
    // 检查是否有FlexiResume相关的DOM元素
    const resumeContent = document.querySelector('[data-testid="resume-content"]');
    const header = document.querySelector('header');
    const tabs = document.querySelector('[data-testid="navigation-tabs"]');
    
    return {
      resumeContent: !!resumeContent,
      header: !!header,
      tabs: !!tabs,
      bodyContent: document.body.textContent?.length || 0
    };
  });
  
  console.log('\n=== 组件存在性检查 ===');
  console.log(JSON.stringify(componentExists, null, 2));
  
  console.log('\n=== 验证完成 ===');
});
