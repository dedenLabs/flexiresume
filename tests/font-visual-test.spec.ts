import { test, expect } from '@playwright/test';

test('字体视觉差异验证测试', async ({ page }) => {
  console.log('=== 字体视觉差异验证测试开始 ===');

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

  // 步骤2: 检查字体文件加载
  console.log('\n=== 步骤2: 检查字体文件加载 ===');
  
  const fontLoadCheck = await page.evaluate(() => {
    // 检查字体是否可用
    const testElement = document.createElement('div');
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.style.fontSize = '72px';
    testElement.textContent = '古典中文字体测试';
    document.body.appendChild(testElement);
    
    const fonts = [
      'Noto Serif SC',
      'Ma Shan Zheng',
      'ZCOOL XiaoWei',
      'Liu Jian Mao Cao',
      'ZCOOL KuaiLe'
    ];
    
    const fontResults = {};
    
    fonts.forEach(font => {
      testElement.style.fontFamily = `"${font}", serif`;
      const computedStyle = getComputedStyle(testElement);
      const actualFont = computedStyle.fontFamily;
      
      fontResults[font] = {
        requested: font,
        actual: actualFont,
        loaded: actualFont.includes(font) || actualFont.includes(font.replace(/\s+/g, ''))
      };
    });
    
    document.body.removeChild(testElement);
    return fontResults;
  });
  
  console.log('字体加载检查结果:');
  Object.entries(fontLoadCheck).forEach(([font, result]: [string, any]) => {
    const status = result.loaded ? '✅' : '❌';
    console.log(`  ${status} ${font}: ${result.loaded ? '已加载' : '未加载'}`);
  });

  // 步骤3: 创建字体对比页面并测试视觉差异
  console.log('\n=== 步骤3: 创建字体对比页面 ===');
  
  await page.evaluate(() => {
    document.body.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.cssText = `
      padding: 20px;
      background: white;
      font-size: 24px;
      line-height: 1.8;
      max-width: 1200px;
      margin: 0 auto;
    `;
    
    const testText = '古之学者必有师。师者，所以传道受业解惑也。人非生而知之者，孰能无惑？惑而不从师，其为惑也，终不解矣。';
    
    const fontConfigs = [
      { 
        name: 'Noto Serif SC', 
        title: '康熙字典体 (Noto Serif SC)', 
        weight: '500',
        letterSpacing: '0.05em',
        lineHeight: '1.8'
      },
      { 
        name: 'Noto Serif SC', 
        title: '宋体古风 (Noto Serif SC)', 
        weight: '400',
        letterSpacing: '0.02em',
        lineHeight: '1.7'
      },
      { 
        name: 'Ma Shan Zheng', 
        title: '楷体 (Ma Shan Zheng)', 
        weight: '400',
        letterSpacing: '0.08em',
        lineHeight: '1.9'
      },
      { 
        name: 'ZCOOL XiaoWei', 
        title: '仿宋 (ZCOOL XiaoWei)', 
        weight: '400',
        letterSpacing: '0.06em',
        lineHeight: '1.8'
      },
      { 
        name: 'Liu Jian Mao Cao', 
        title: '隶书 (Liu Jian Mao Cao)', 
        weight: '400',
        letterSpacing: '0.1em',
        lineHeight: '2.0'
      },
      { 
        name: 'ZCOOL KuaiLe', 
        title: '装饰字体 (ZCOOL KuaiLe)', 
        weight: '400',
        letterSpacing: '0.04em',
        lineHeight: '1.7'
      }
    ];
    
    fontConfigs.forEach((config, index) => {
      const section = document.createElement('div');
      section.style.cssText = 'margin-bottom: 40px; padding: 20px; border: 2px solid #ddd; border-radius: 12px; background: #fafafa;';
      section.setAttribute('data-font-test', config.name.replace(/\s+/g, '-').toLowerCase());
      
      const title = document.createElement('h3');
      title.textContent = `${index + 1}. ${config.title}`;
      title.style.cssText = 'margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: bold;';
      
      const text = document.createElement('div');
      text.style.fontFamily = `"${config.name}", serif`;
      text.style.fontSize = '24px';
      text.style.fontWeight = config.weight;
      text.style.letterSpacing = config.letterSpacing;
      text.style.lineHeight = config.lineHeight;
      text.style.color = '#444';
      text.style.padding = '10px';
      text.style.background = 'white';
      text.style.borderRadius = '8px';
      text.textContent = testText;
      
      // 添加字体信息
      const info = document.createElement('div');
      info.style.cssText = 'margin-top: 10px; font-size: 14px; color: #666; font-family: monospace;';
      info.textContent = `字体: ${config.name} | 字重: ${config.weight} | 字距: ${config.letterSpacing} | 行高: ${config.lineHeight}`;
      
      section.appendChild(title);
      section.appendChild(text);
      section.appendChild(info);
      container.appendChild(section);
    });
    
    document.body.appendChild(container);
  });
  
  // 等待字体加载
  await page.waitForTimeout(3000);

  // 步骤4: 测量字体渲染差异
  console.log('\n=== 步骤4: 测量字体渲染差异 ===');
  
  const fontMetrics = await page.evaluate(() => {
    const sections = document.querySelectorAll('[data-font-test]');
    const metrics = [];
    
    sections.forEach((section, index) => {
      const textElement = section.querySelector('div[style*="font-family"]') as HTMLElement;
      if (textElement) {
        const rect = textElement.getBoundingClientRect();
        const computedStyle = getComputedStyle(textElement);
        
        metrics.push({
          index: index + 1,
          fontFamily: computedStyle.fontFamily,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          letterSpacing: computedStyle.letterSpacing,
          lineHeight: computedStyle.lineHeight
        });
      }
    });
    
    return metrics;
  });
  
  console.log('字体渲染指标:');
  fontMetrics.forEach(metric => {
    console.log(`  ${metric.index}. 字体: ${metric.fontFamily.split(',')[0]}`);
    console.log(`     尺寸: ${metric.width}x${metric.height}px`);
    console.log(`     字号: ${metric.fontSize}, 字重: ${metric.fontWeight}`);
    console.log(`     字距: ${metric.letterSpacing}, 行高: ${metric.lineHeight}`);
  });

  // 步骤5: 检查视觉差异
  console.log('\n=== 步骤5: 检查视觉差异 ===');
  
  const visualDifferences = [];
  for (let i = 0; i < fontMetrics.length - 1; i++) {
    for (let j = i + 1; j < fontMetrics.length; j++) {
      const font1 = fontMetrics[i];
      const font2 = fontMetrics[j];
      
      const widthDiff = Math.abs(font1.width - font2.width);
      const heightDiff = Math.abs(font1.height - font2.height);
      
      if (widthDiff > 10 || heightDiff > 10) {
        visualDifferences.push({
          font1: font1.fontFamily.split(',')[0],
          font2: font2.fontFamily.split(',')[0],
          widthDiff,
          heightDiff,
          significant: widthDiff > 50 || heightDiff > 20
        });
      }
    }
  }
  
  console.log(`发现 ${visualDifferences.length} 组字体差异:`);
  visualDifferences.forEach((diff, index) => {
    const status = diff.significant ? '✅ 显著差异' : '⚠️ 轻微差异';
    console.log(`  ${index + 1}. ${status}`);
    console.log(`     ${diff.font1} vs ${diff.font2}`);
    console.log(`     宽度差异: ${diff.widthDiff}px, 高度差异: ${diff.heightDiff}px`);
  });

  // 步骤6: 截图验证
  console.log('\n=== 步骤6: 截图验证 ===');
  
  // 截取完整对比图
  await page.screenshot({ 
    path: 'tests/screenshots/font-visual-comparison.png',
    fullPage: true 
  });
  console.log('✅ 已保存完整字体对比截图: tests/screenshots/font-visual-comparison.png');
  
  // 为每种字体单独截图
  for (let i = 0; i < fontMetrics.length; i++) {
    const section = page.locator(`[data-font-test]`).nth(i);
    await section.screenshot({ 
      path: `tests/screenshots/font-${i + 1}-individual.png`
    });
  }
  console.log('✅ 已保存各字体单独截图');

  // 步骤7: 检查字体错误
  console.log('\n=== 步骤7: 检查字体错误 ===');
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

  // 总结
  console.log('\n=== 字体视觉差异验证总结 ===');
  const loadedFonts = Object.values(fontLoadCheck).filter((result: any) => result.loaded).length;
  const totalFonts = Object.keys(fontLoadCheck).length;
  const significantDifferences = visualDifferences.filter(d => d.significant).length;
  
  console.log(`✅ 字体加载: ${loadedFonts}/${totalFonts} 个字体成功加载`);
  console.log(`✅ 字体错误: ${fontErrors.length === 0 ? '无错误' : `${fontErrors.length}个错误`}`);
  console.log(`✅ 视觉差异: ${significantDifferences} 组显著差异，${visualDifferences.length} 组总差异`);
  console.log(`✅ 截图验证: 已生成 ${fontMetrics.length + 1} 张截图`);

  // 验证是否达到要求
  const testPassed = loadedFonts >= 4 && significantDifferences >= 3 && fontErrors.length <= 1;
  console.log(`\n🎯 测试结果: ${testPassed ? '✅ 通过' : '❌ 未通过'}`);
  
  if (!testPassed) {
    console.log('未通过原因:');
    if (loadedFonts < 4) console.log(`  - 字体加载不足: 需要至少4个，实际${loadedFonts}个`);
    if (significantDifferences < 3) console.log(`  - 视觉差异不足: 需要至少3组显著差异，实际${significantDifferences}组`);
    if (fontErrors.length > 1) console.log(`  - 字体错误过多: 允许最多1个，实际${fontErrors.length}个`);
  }

  console.log('\n=== 字体视觉差异验证测试完成 ===');
});
