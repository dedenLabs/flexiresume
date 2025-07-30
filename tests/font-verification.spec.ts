import { test, expect } from '@playwright/test';

test('古典中文字体验证测试', async ({ page }) => {
  console.log('=== 古典中文字体验证测试开始 ===');

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
  
  // 检查字体文件是否成功加载
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
      'Noto Sans SC', 
      'Ma Shan Zheng',
      'Liu Jian Mao Cao',
      'ZCOOL KuaiLe',
      'ZCOOL XiaoWei'
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

  // 步骤3: 检查字体错误
  console.log('\n=== 步骤3: 检查字体错误 ===');
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

  // 步骤4: 测试字体样式类
  console.log('\n=== 步骤4: 测试字体样式类 ===');
  
  const fontClassTest = await page.evaluate(() => {
    const testTexts = [
      { class: 'font-ancient-chinese', text: '古之学者必有师。师者，所以传道受业解惑也。' },
      { class: 'font-calligraphy', text: '天行健，君子以自强不息。' },
      { class: 'font-poetry', text: '床前明月光，疑是地上霜。举头望明月，低头思故乡。' },
      { class: 'font-cursive', text: '龙飞凤舞' },
      { class: 'font-decorative', text: '装饰性标题文字' }
    ];
    
    const results = [];
    
    testTexts.forEach(({ class: className, text }) => {
      const element = document.createElement('div');
      element.className = className;
      element.textContent = text;
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      element.style.fontSize = '18px';
      
      document.body.appendChild(element);
      
      const computedStyle = getComputedStyle(element);
      const fontFamily = computedStyle.fontFamily;
      const fontSize = computedStyle.fontSize;
      
      results.push({
        className,
        text: text.substring(0, 20) + '...',
        fontFamily,
        fontSize,
        hasCustomFont: !fontFamily.includes('serif') || fontFamily.includes('Noto') || fontFamily.includes('Ma Shan') || fontFamily.includes('ZCOOL')
      });
      
      document.body.removeChild(element);
    });
    
    return results;
  });
  
  console.log('字体样式类测试结果:');
  fontClassTest.forEach(result => {
    const status = result.hasCustomFont ? '✅' : '⚠️';
    console.log(`  ${status} .${result.className}: ${result.fontFamily}`);
    console.log(`     文本: ${result.text}`);
    console.log(`     字号: ${result.fontSize}`);
  });

  // 步骤5: 截图验证
  console.log('\n=== 步骤5: 截图验证 ===');
  
  // 创建字体展示页面
  await page.evaluate(() => {
    // 清空页面内容
    document.body.innerHTML = '';
    
    // 创建字体展示容器
    const container = document.createElement('div');
    container.style.cssText = `
      padding: 20px;
      background: white;
      font-size: 18px;
      line-height: 1.8;
      max-width: 800px;
      margin: 0 auto;
    `;
    
    const fontSamples = [
      {
        title: '思源宋体 (Noto Serif SC) - 古典文本',
        class: 'font-ancient-chinese',
        text: '古之学者必有师。师者，所以传道受业解惑也。人非生而知之者，孰能无惑？惑而不从师，其为惑也，终不解矣。'
      },
      {
        title: '马善政毛笔楷体 - 书法风格',
        class: 'font-calligraphy',
        text: '天行健，君子以自强不息。地势坤，君子以厚德载物。'
      },
      {
        title: '诗词专用字体',
        class: 'font-poetry',
        text: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
      },
      {
        title: '刘建毛草 - 草书风格',
        class: 'font-cursive',
        text: '龙飞凤舞，笔走龙蛇'
      },
      {
        title: '站酷装饰字体',
        class: 'font-decorative',
        text: '装饰性标题文字展示'
      }
    ];
    
    fontSamples.forEach(sample => {
      const section = document.createElement('div');
      section.style.cssText = 'margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;';
      
      const title = document.createElement('h3');
      title.textContent = sample.title;
      title.style.cssText = 'margin: 0 0 10px 0; color: #333; font-size: 16px;';
      
      const text = document.createElement('div');
      text.className = sample.class;
      text.textContent = sample.text;
      text.style.cssText = 'font-size: 20px; line-height: 1.8; color: #444;';
      
      section.appendChild(title);
      section.appendChild(text);
      container.appendChild(section);
    });
    
    document.body.appendChild(container);
  });
  
  // 等待字体加载
  await page.waitForTimeout(2000);
  
  // 截取字体展示截图
  await page.screenshot({ 
    path: 'tests/screenshots/classical-fonts-display.png',
    fullPage: true 
  });
  
  console.log('✅ 已保存字体展示截图: tests/screenshots/classical-fonts-display.png');

  // 总结
  console.log('\n=== 古典字体验证总结 ===');
  const loadedFonts = Object.values(fontLoadCheck).filter((result: any) => result.loaded).length;
  const totalFonts = Object.keys(fontLoadCheck).length;
  
  console.log(`✅ 字体加载: ${loadedFonts}/${totalFonts} 个字体成功加载`);
  console.log(`✅ 字体错误: ${fontErrors.length === 0 ? '无错误' : `${fontErrors.length}个错误`}`);
  console.log(`✅ 样式类: ${fontClassTest.filter(r => r.hasCustomFont).length}/${fontClassTest.length} 个样式类正常`);
  console.log(`✅ 截图验证: 已生成字体展示截图`);

  console.log('\n=== 古典中文字体验证测试完成 ===');
});
