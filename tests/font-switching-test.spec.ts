import { test, expect } from '@playwright/test';

test('字体切换面板测试', async ({ page }) => {
  console.log('=== 字体切换面板测试开始 ===');

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

  // 步骤2: 查找字体选择面板
  console.log('\n=== 步骤2: 查找字体选择面板 ===');
  
  // 查找字体选择器（可能的选择器）
  const fontSelectors = [
    '[data-testid="control-panel"]',
    '.control-panel',
    '.floating-controls',
    '[data-testid="font-selector"]',
    '.font-selector',
    '.font-panel',
    '.font-control',
    'select[name*="font"]',
    'button[aria-label*="字体"]',
    'button[title*="字体"]'
  ];
  
  let fontSelector = null;
  let selectorUsed = '';

  // 首先查找控制面板
  const controlPanel = page.locator('[data-testid="control-panel"]').first();
  if (await controlPanel.count() > 0) {
    console.log(`✅ 找到控制面板`);

    // 检查控制面板是否折叠，如果折叠则展开
    const toggleButton = controlPanel.locator('button').first(); // 第一个按钮通常是展开/折叠按钮
    const toggleText = await toggleButton.textContent();

    if (toggleText && toggleText.includes('⚙️')) {
      console.log(`📂 控制面板已折叠，正在展开...`);
      await toggleButton.click();
      await page.waitForTimeout(1000); // 等待展开动画
    }

    // 在控制面板中查找字体相关的按钮
    const fontButton = controlPanel.locator('button').filter({ hasText: /字体|Font/ }).first();
    if (await fontButton.count() > 0) {
      fontSelector = fontButton;
      selectorUsed = 'control-panel font button';
      console.log(`✅ 找到字体按钮`);
    } else {
      // 查找包含字体名称的按钮
      const fontNameButtons = await controlPanel.locator('button').all();
      for (const button of fontNameButtons) {
        const text = await button.textContent();
        if (text && (text.includes('康熙') || text.includes('宋体') || text.includes('楷体') || text.includes('古典'))) {
          fontSelector = button;
          selectorUsed = `control-panel button: ${text}`;
          console.log(`✅ 找到字体选择按钮: ${text}`);
          break;
        }
      }
    }
  }

  if (!fontSelector) {
    for (const selector of fontSelectors) {
      const element = page.locator(selector).first();
      if (await element.count() > 0) {
        fontSelector = element;
        selectorUsed = selector;
        console.log(`✅ 找到字体选择器: ${selector}`);
        break;
      }
    }
  }
  
  if (!fontSelector) {
    console.log('❌ 未找到字体选择器，尝试查找控制面板');
    
    // 查找控制面板
    const controlPanels = [
      '.control-panel',
      '.floating-controls',
      '.settings-panel',
      '[data-testid="controls"]'
    ];
    
    for (const panelSelector of controlPanels) {
      const panel = page.locator(panelSelector).first();
      if (await panel.count() > 0) {
        console.log(`✅ 找到控制面板: ${panelSelector}`);
        
        // 在控制面板中查找字体相关按钮
        const fontButtons = panel.locator('button').all();
        const buttons = await fontButtons;
        
        for (const button of buttons) {
          const text = await button.textContent();
          if (text && (text.includes('字体') || text.includes('Font') || text.includes('康熙') || text.includes('宋体'))) {
            fontSelector = button;
            selectorUsed = `${panelSelector} button containing "${text}"`;
            console.log(`✅ 找到字体按钮: ${text}`);
            break;
          }
        }
        break;
      }
    }
  }

  // 步骤3: 测试字体切换
  console.log('\n=== 步骤3: 测试字体切换 ===');
  
  if (fontSelector) {
    console.log(`使用选择器: ${selectorUsed}`);
    
    // 获取当前字体
    const initialFont = await page.evaluate(() => {
      const element = document.querySelector('body') || document.documentElement;
      return getComputedStyle(element).fontFamily;
    });
    console.log(`初始字体: ${initialFont}`);
    
    // 点击字体选择器
    await fontSelector.click();
    await page.waitForTimeout(1000);
    
    // 查找字体选项
    const fontOptions = [
      'text=康熙字典体',
      'text=宋体古风', 
      'text=楷体',
      'text=仿宋',
      'text=隶书',
      'text=装饰字体',
      '[data-font="kangxi"]',
      '[data-font="songti"]',
      '[data-font="kaiti"]',
      '[data-font="fangsong"]',
      '[data-font="lishu"]'
    ];
    
    const testedFonts = [];
    
    for (const optionSelector of fontOptions) {
      const option = page.locator(optionSelector).first();
      if (await option.count() > 0) {
        const optionText = await option.textContent();
        console.log(`\n🎨 测试字体: ${optionText}`);
        
        // 点击字体选项
        await option.click();
        await page.waitForTimeout(2000); // 等待字体加载
        
        // 获取切换后的字体
        const newFont = await page.evaluate(() => {
          const element = document.querySelector('body') || document.documentElement;
          return getComputedStyle(element).fontFamily;
        });
        
        console.log(`   切换后字体: ${newFont}`);
        
        // 检查字体是否真的改变了
        const fontChanged = newFont !== initialFont;
        console.log(`   字体是否改变: ${fontChanged ? '✅' : '❌'}`);
        
        // 截图保存
        const screenshotName = `font-${optionText?.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '') || 'unknown'}.png`;
        await page.screenshot({ 
          path: `tests/screenshots/${screenshotName}`,
          fullPage: false,
          clip: { x: 0, y: 0, width: 1200, height: 800 }
        });
        console.log(`   截图保存: ${screenshotName}`);
        
        testedFonts.push({
          name: optionText,
          fontFamily: newFont,
          changed: fontChanged,
          screenshot: screenshotName
        });
        
        // 重新打开字体选择器（如果需要）
        if (fontOptions.indexOf(optionSelector) < fontOptions.length - 1) {
          await fontSelector.click();
          await page.waitForTimeout(500);
        }
      }
    }
    
    console.log(`\n📊 字体测试统计:`);
    console.log(`✅ 测试字体数: ${testedFonts.length}`);
    console.log(`✅ 成功切换: ${testedFonts.filter(f => f.changed).length}`);
    console.log(`❌ 未切换: ${testedFonts.filter(f => !f.changed).length}`);
    
    // 显示详细结果
    console.log('\n📋 详细测试结果:');
    testedFonts.forEach((font, index) => {
      const status = font.changed ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${font.name}`);
      console.log(`   字体族: ${font.fontFamily}`);
      console.log(`   截图: ${font.screenshot}`);
    });
    
  } else {
    console.log('❌ 未找到字体选择器，无法进行字体切换测试');
    
    // 尝试手动测试字体加载
    console.log('\n🔧 手动测试字体加载...');
    
    const manualFontTest = await page.evaluate(() => {
      // 创建测试元素
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.fontSize = '24px';
      testElement.textContent = '古之学者必有师。师者，所以传道受业解惑也。';
      document.body.appendChild(testElement);
      
      const fonts = [
        'Noto Serif SC',
        'Ma Shan Zheng',
        'ZCOOL XiaoWei',
        'Liu Jian Mao Cao',
        'ZCOOL KuaiLe'
      ];
      
      const results = [];
      
      fonts.forEach(font => {
        testElement.style.fontFamily = `"${font}", serif`;
        const computedStyle = getComputedStyle(testElement);
        const actualFont = computedStyle.fontFamily;
        
        results.push({
          requested: font,
          actual: actualFont,
          loaded: actualFont.includes(font) || actualFont.includes(font.replace(/\s+/g, ''))
        });
      });
      
      document.body.removeChild(testElement);
      return results;
    });
    
    console.log('手动字体测试结果:');
    manualFontTest.forEach(result => {
      const status = result.loaded ? '✅' : '❌';
      console.log(`  ${status} ${result.requested}: ${result.loaded ? '已加载' : '未加载'}`);
    });
  }

  // 步骤4: 检查字体错误
  console.log('\n=== 步骤4: 检查字体错误 ===');
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

  // 步骤5: 生成对比截图
  console.log('\n=== 步骤5: 生成字体对比截图 ===');
  
  // 创建字体对比页面
  await page.evaluate(() => {
    document.body.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.cssText = `
      padding: 20px;
      background: white;
      font-size: 18px;
      line-height: 1.8;
      max-width: 1000px;
      margin: 0 auto;
    `;
    
    const testText = '古之学者必有师。师者，所以传道受业解惑也。人非生而知之者，孰能无惑？';
    
    const fontConfigs = [
      { name: 'Noto Serif SC', title: '康熙字典体', class: 'font-kangxi' },
      { name: 'Noto Serif SC', title: '宋体古风', class: 'font-songti' },
      { name: 'Ma Shan Zheng', title: '楷体', class: 'font-kaiti' },
      { name: 'ZCOOL XiaoWei', title: '仿宋', class: 'font-fangsong' },
      { name: 'Liu Jian Mao Cao', title: '隶书', class: 'font-lishu' },
      { name: 'ZCOOL KuaiLe', title: '装饰字体', class: 'font-decorative' }
    ];
    
    fontConfigs.forEach(config => {
      const section = document.createElement('div');
      section.style.cssText = 'margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;';
      
      const title = document.createElement('h3');
      title.textContent = config.title;
      title.style.cssText = 'margin: 0 0 10px 0; color: #333; font-size: 16px;';
      
      const text = document.createElement('div');
      text.style.fontFamily = `"${config.name}", serif`;
      text.style.fontSize = '20px';
      text.style.lineHeight = '1.8';
      text.style.color = '#444';
      text.textContent = testText;
      
      section.appendChild(title);
      section.appendChild(text);
      container.appendChild(section);
    });
    
    document.body.appendChild(container);
  });
  
  // 等待字体加载
  await page.waitForTimeout(3000);
  
  // 截取字体对比截图
  await page.screenshot({ 
    path: 'tests/screenshots/font-comparison-all.png',
    fullPage: true 
  });
  
  console.log('✅ 已保存字体对比截图: tests/screenshots/font-comparison-all.png');

  console.log('\n=== 字体切换面板测试完成 ===');
});
