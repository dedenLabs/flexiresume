import { test, expect } from '@playwright/test';

test('三个任务完成验证测试', async ({ page }) => {
  console.log('=== 三个任务完成验证测试开始 ===');

  // 监听控制台消息
  const consoleMessages: string[] = [];
  const fontErrors: string[] = [];
  
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push(`[${type}] ${text}`);
    
    // 检查字体相关错误
    if (text.includes('Failed to decode downloaded font') || 
        text.includes('OTS parsing error') ||
        text.includes('font')) {
      fontErrors.push(text);
    }
  });

  // 步骤1: 访问页面
  console.log('\n=== 步骤1: 访问xuanzang页面 ===');
  await page.goto('http://localhost:5174/xuanzang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // 任务1验证: 汉仪尚巍手书W字体
  console.log('\n=== 任务1验证: 汉仪尚巍手书W字体 ===');
  
  const hanyiFontTest = await page.evaluate(() => {
    // 创建测试元素
    const testElement = document.createElement('div');
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.style.fontSize = '24px';
    testElement.className = 'font-hanyi-shangwei';
    testElement.textContent = '汉仪尚巍手书W字体测试';
    document.body.appendChild(testElement);
    
    const computedStyle = getComputedStyle(testElement);
    const fontFamily = computedStyle.fontFamily;
    const fontSize = computedStyle.fontSize;
    const letterSpacing = computedStyle.letterSpacing;
    const lineHeight = computedStyle.lineHeight;
    
    document.body.removeChild(testElement);
    
    return {
      fontFamily,
      fontSize,
      letterSpacing,
      lineHeight,
      hasCustomFont: fontFamily.includes('HYShangWeiShouShuW') || fontFamily.includes('Ma Shan Zheng')
    };
  });
  
  console.log('汉仪尚巍手书W字体测试结果:');
  console.log(`  字体族: ${hanyiFontTest.fontFamily}`);
  console.log(`  字体大小: ${hanyiFontTest.fontSize}`);
  console.log(`  字距: ${hanyiFontTest.letterSpacing}`);
  console.log(`  行高: ${hanyiFontTest.lineHeight}`);
  console.log(`  自定义字体: ${hanyiFontTest.hasCustomFont ? '✅' : '❌'}`);

  // 检查FontConfig.ts中是否包含汉仪字体配置
  const fontConfigCheck = await page.evaluate(() => {
    // 检查是否有汉仪字体的CSS文件被加载
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const hanyiCSSLoaded = links.some(link => 
      link.getAttribute('href')?.includes('hanyi-shangwei.css')
    );
    
    return {
      hanyiCSSLoaded,
      totalStylesheets: links.length
    };
  });
  
  console.log(`汉仪字体CSS加载: ${fontConfigCheck.hanyiCSSLoaded ? '✅' : '❌'}`);

  // 任务2验证: Header组件TODO完成
  console.log('\n=== 任务2验证: Header组件TODO完成 ===');
  
  const headerTest = await page.evaluate(() => {
    // 检查Header中是否有Name和Home链接的响应式布局
    const nameContainer = document.querySelector('h1'); // Name组件
    const homeLinks = document.querySelectorAll('a[href*="http"]'); // 主页链接
    const ioHomeIcons = document.querySelectorAll('svg'); // IoHome图标
    
    // 检查是否有响应式容器类
    const responsiveContainers = document.querySelectorAll('[class*="NameAndHome"], [class*="HomePageGroup"]');
    
    return {
      hasNameElement: !!nameContainer,
      homeLinksCount: homeLinks.length,
      ioHomeIconsCount: ioHomeIcons.length,
      responsiveContainersCount: responsiveContainers.length,
      nameText: nameContainer?.textContent || '',
      homeLinksText: Array.from(homeLinks).map(link => link.textContent).join(', ')
    };
  });
  
  console.log('Header组件测试结果:');
  console.log(`  Name元素: ${headerTest.hasNameElement ? '✅' : '❌'}`);
  console.log(`  主页链接数: ${headerTest.homeLinksCount}`);
  console.log(`  IoHome图标数: ${headerTest.ioHomeIconsCount}`);
  console.log(`  响应式容器数: ${headerTest.responsiveContainersCount}`);
  console.log(`  Name文本: ${headerTest.nameText}`);
  console.log(`  主页链接: ${headerTest.homeLinksText}`);

  // 任务3验证: 开发提示组件优化
  console.log('\n=== 任务3验证: 开发提示组件优化 ===');
  
  // 等待足够时间让开发提示显示
  await page.waitForTimeout(5000);
  
  const devNoticeTest = await page.evaluate(() => {
    const devNotice = document.querySelector('[data-testid="development-notice"]');
    const isVisible = devNotice ? getComputedStyle(devNotice).display !== 'none' : false;
    
    // 检查页面关键元素
    const resumeContent = document.querySelector('[data-testid="resume-content"]');
    const header = document.querySelector('header');
    const tabs = document.querySelector('[data-testid="navigation-tabs"]');
    
    return {
      devNoticeExists: !!devNotice,
      devNoticeVisible: isVisible,
      resumeContentExists: !!resumeContent,
      headerExists: !!header,
      tabsExists: !!tabs,
      pageContentLength: document.body.textContent?.length || 0
    };
  });
  
  console.log('开发提示组件测试结果:');
  console.log(`  开发提示存在: ${devNoticeTest.devNoticeExists ? '✅' : '❌'}`);
  console.log(`  开发提示可见: ${devNoticeTest.devNoticeVisible ? '✅' : '❌'}`);
  console.log(`  Resume内容存在: ${devNoticeTest.resumeContentExists ? '✅' : '❌'}`);
  console.log(`  Header存在: ${devNoticeTest.headerExists ? '✅' : '❌'}`);
  console.log(`  Tabs存在: ${devNoticeTest.tabsExists ? '✅' : '❌'}`);
  console.log(`  页面内容长度: ${devNoticeTest.pageContentLength}`);

  // 检查字体错误
  console.log('\n=== 字体错误检查 ===');
  console.log(`总控制台消息数: ${consoleMessages.length}`);
  console.log(`字体相关错误数: ${fontErrors.length}`);
  
  if (fontErrors.length > 0) {
    console.log('发现的字体错误:');
    fontErrors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  } else {
    console.log('✅ 没有发现字体解码错误');
  }

  // 截图验证
  console.log('\n=== 截图验证 ===');
  
  await page.screenshot({ 
    path: 'tests/screenshots/three-tasks-verification.png',
    fullPage: true 
  });
  console.log('✅ 已保存验证截图: tests/screenshots/three-tasks-verification.png');

  // 总结
  console.log('\n=== 三个任务完成验证总结 ===');
  
  const task1Success = hanyiFontTest.hasCustomFont;
  const task2Success = headerTest.hasNameElement && headerTest.homeLinksCount > 0;
  const task3Success = devNoticeTest.devNoticeExists && 
                      devNoticeTest.resumeContentExists && 
                      devNoticeTest.headerExists && 
                      devNoticeTest.tabsExists;
  
  console.log(`✅ 任务1 - 汉仪尚巍手书W字体: ${task1Success ? '完成' : '未完成'}`);
  console.log(`✅ 任务2 - Header组件TODO: ${task2Success ? '完成' : '未完成'}`);
  console.log(`✅ 任务3 - 开发提示优化: ${task3Success ? '完成' : '未完成'}`);
  console.log(`✅ 字体错误: ${fontErrors.length <= 1 ? '正常' : '有问题'}`);
  
  const allTasksSuccess = task1Success && task2Success && task3Success && fontErrors.length <= 1;
  console.log(`\n🎯 总体结果: ${allTasksSuccess ? '✅ 所有任务完成' : '❌ 部分任务未完成'}`);
  
  if (!allTasksSuccess) {
    console.log('\n未完成的任务:');
    if (!task1Success) console.log('  - 任务1: 汉仪尚巍手书W字体配置');
    if (!task2Success) console.log('  - 任务2: Header组件TODO实现');
    if (!task3Success) console.log('  - 任务3: 开发提示组件优化');
    if (fontErrors.length > 1) console.log('  - 字体错误过多');
  }

  console.log('\n=== 三个任务完成验证测试结束 ===');
});
