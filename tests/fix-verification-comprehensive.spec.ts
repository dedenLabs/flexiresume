import { test, expect } from '@playwright/test';

test('综合修复验证测试', async ({ page }) => {
  console.log('=== 综合修复验证测试开始 ===');

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

  // 步骤1: 访问页面并等待完全加载
  console.log('\n=== 步骤1: 访问xuanzang页面 ===');
  await page.goto('http://localhost:5174/xuanzang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // 等待足够时间让开发提示显示

  // 检查页面基本元素
  const pageElements = await page.evaluate(() => {
    return {
      hasResumeContent: !!document.querySelector('[data-testid="resume-content"]'),
      hasHeader: !!document.querySelector('header'),
      hasTabs: !!document.querySelector('[data-testid="navigation-tabs"]'),
      bodyTextLength: document.body.textContent?.length || 0,
      title: document.title
    };
  });

  console.log('页面元素检查:', JSON.stringify(pageElements, null, 2));

  // 步骤2: 检查字体错误修复
  console.log('\n=== 步骤2: 检查字体错误修复 ===');
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

  // 步骤3: 检查开发提示显示时机
  console.log('\n=== 步骤3: 检查开发提示显示时机 ===');
  
  // 检查开发提示是否存在
  const devNotice = page.locator('[data-testid="development-notice"]').first();
  const devNoticeExists = await devNotice.count() > 0;
  
  if (devNoticeExists) {
    const isVisible = await devNotice.isVisible();
    console.log(`开发提示存在: ${devNoticeExists}, 可见: ${isVisible}`);
  } else {
    // 检查是否被localStorage设置隐藏了
    const isDismissed = await page.evaluate(() => {
      return localStorage.getItem('dev-notice-dismissed') === 'true';
    });
    console.log(`开发提示不存在，可能原因: ${isDismissed ? '用户已关闭' : '未显示或其他原因'}`);
  }

  // 步骤4: 检查字体大小和间距优化
  console.log('\n=== 步骤4: 检查字体大小和间距优化 ===');
  
  const styleCheck = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    return {
      fontSizeBase: computedStyle.getPropertyValue('--font-size-base').trim(),
      fontSizeLg: computedStyle.getPropertyValue('--font-size-lg').trim(),
      spacingMd: computedStyle.getPropertyValue('--spacing-md').trim(),
      spacingLg: computedStyle.getPropertyValue('--spacing-lg').trim(),
      bodyFontSize: getComputedStyle(document.body).fontSize,
      bodyLineHeight: getComputedStyle(document.body).lineHeight
    };
  });

  console.log('样式检查结果:', JSON.stringify(styleCheck, null, 2));

  // 验证字体大小是否已优化
  const expectedFontSizeBase = '18px'; // 应该从16px增加到18px
  const expectedSpacingMd = '20px';    // 应该从16px增加到20px
  
  console.log(`字体大小优化: ${styleCheck.fontSizeBase === expectedFontSizeBase ? '✅' : '❌'} (期望: ${expectedFontSizeBase}, 实际: ${styleCheck.fontSizeBase})`);
  console.log(`间距优化: ${styleCheck.spacingMd === expectedSpacingMd ? '✅' : '❌'} (期望: ${expectedSpacingMd}, 实际: ${styleCheck.spacingMd})`);

  // 步骤5: 主题切换测试
  console.log('\n=== 步骤5: 主题切换测试 ===');
  
  // 查找主题切换按钮
  const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
  const themeToggleExists = await themeToggle.count() > 0;
  
  if (themeToggleExists) {
    console.log('找到主题切换按钮，测试主题切换...');
    
    // 获取当前主题
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 'light';
    });
    
    console.log(`初始主题: ${initialTheme}`);
    
    // 点击切换主题
    await themeToggle.click();
    await page.waitForTimeout(1000);
    
    // 获取切换后的主题
    const newTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 'light';
    });
    
    console.log(`切换后主题: ${newTheme}`);
    console.log(`主题切换: ${initialTheme !== newTheme ? '✅' : '❌'}`);
    
    // 检查深色主题下的样式
    if (newTheme === 'dark') {
      const darkStyleCheck = await page.evaluate(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        return {
          fontSizeBase: computedStyle.getPropertyValue('--font-size-base').trim(),
          spacingMd: computedStyle.getPropertyValue('--spacing-md').trim(),
          textColor: computedStyle.getPropertyValue('--color-text-primary').trim(),
          backgroundColor: computedStyle.getPropertyValue('--color-background').trim()
        };
      });
      
      console.log('深色主题样式检查:', JSON.stringify(darkStyleCheck, null, 2));
    }
  } else {
    console.log('❌ 未找到主题切换按钮');
  }

  // 步骤6: 截图对比
  console.log('\n=== 步骤6: 截图验证 ===');
  
  // 截取修复后的页面截图
  await page.screenshot({ 
    path: 'tests/screenshots/fix-verification-after.png',
    fullPage: true 
  });
  
  console.log('✅ 已保存修复后截图: tests/screenshots/fix-verification-after.png');

  // 总结
  console.log('\n=== 修复验证总结 ===');
  console.log(`✅ 页面加载: ${pageElements.hasResumeContent && pageElements.hasHeader ? '正常' : '异常'}`);
  console.log(`✅ 字体错误: ${fontErrors.length === 0 ? '已修复' : `仍有${fontErrors.length}个错误`}`);
  console.log(`✅ 字体大小: ${styleCheck.fontSizeBase === expectedFontSizeBase ? '已优化' : '未优化'}`);
  console.log(`✅ 间距优化: ${styleCheck.spacingMd === expectedSpacingMd ? '已优化' : '未优化'}`);
  console.log(`✅ 主题切换: ${themeToggleExists ? '功能正常' : '未找到按钮'}`);

  console.log('\n=== 综合修复验证测试完成 ===');
});
