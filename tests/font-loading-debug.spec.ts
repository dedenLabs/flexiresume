import { test, expect } from '@playwright/test';

test('字体加载调试测试', async ({ page }) => {
  console.log('=== 字体加载调试测试开始 ===');

  // 监听网络请求
  const fontRequests: string[] = [];
  const cssRequests: string[] = [];
  
  page.on('request', request => {
    const url = request.url();
    if (url.includes('.woff2') || url.includes('.woff')) {
      fontRequests.push(url);
      console.log(`🔍 字体请求: ${url}`);
    }
    if (url.includes('.css') && url.includes('font')) {
      cssRequests.push(url);
      console.log(`🔍 CSS请求: ${url}`);
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('.woff2') || url.includes('.woff')) {
      console.log(`📥 字体响应: ${url} - ${response.status()}`);
    }
    if (url.includes('.css') && url.includes('font')) {
      console.log(`📥 CSS响应: ${url} - ${response.status()}`);
    }
  });

  // 步骤1: 访问页面
  console.log('\n=== 步骤1: 访问xuanzang页面 ===');
  await page.goto('http://localhost:5174/xuanzang');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // 步骤2: 手动加载字体CSS文件
  console.log('\n=== 步骤2: 手动加载字体CSS文件 ===');
  
  const fontCSSFiles = [
    './fonts/kangxi.css',
    './fonts/songti.css', 
    './fonts/kaiti.css',
    './fonts/fangsong.css',
    './fonts/lishu.css',
    './fonts/decorative.css',
    './fonts/modern-sans.css'
  ];
  
  for (const cssFile of fontCSSFiles) {
    await page.evaluate((cssPath) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.onload = () => console.log(`✅ CSS加载成功: ${cssPath}`);
      link.onerror = () => console.log(`❌ CSS加载失败: ${cssPath}`);
      document.head.appendChild(link);
    }, cssFile);
  }
  
  // 等待CSS加载
  await page.waitForTimeout(3000);

  // 步骤3: 检查字体是否真正可用
  console.log('\n=== 步骤3: 检查字体是否真正可用 ===');
  
  const fontAvailabilityTest = await page.evaluate(() => {
    // 创建一个canvas来测试字体渲染差异
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    
    const testText = '古典字体测试';
    const fonts = [
      'serif', // 基准字体
      'Ma Shan Zheng',
      'ZCOOL XiaoWei', 
      'Liu Jian Mao Cao',
      'ZCOOL KuaiLe',
      'Noto Serif SC'
    ];
    
    const results = [];
    
    fonts.forEach(font => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `24px "${font}", serif`;
      ctx.fillStyle = 'black';
      ctx.fillText(testText, 10, 30);
      
      // 获取像素数据来检测渲染差异
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = Array.from(imageData.data);
      const nonZeroPixels = pixels.filter(p => p > 0).length;
      
      results.push({
        font,
        pixelCount: nonZeroPixels,
        available: font === 'serif' ? true : nonZeroPixels !== results[0]?.pixelCount
      });
    });
    
    return results;
  });
  
  console.log('字体可用性测试结果:');
  fontAvailabilityTest.forEach(result => {
    const status = result.available ? '✅' : '❌';
    console.log(`  ${status} ${result.font}: ${result.available ? '可用' : '不可用'} (像素数: ${result.pixelCount})`);
  });

  // 步骤4: 创建强制字体差异的测试页面
  console.log('\n=== 步骤4: 创建强制字体差异的测试页面 ===');
  
  await page.evaluate(() => {
    document.body.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.cssText = `
      padding: 20px;
      background: white;
      max-width: 1200px;
      margin: 0 auto;
    `;
    
    const testText = '古典字体测试：古之学者必有师';
    
    const fontTests = [
      { 
        name: 'serif (系统默认)', 
        style: 'font-family: serif; font-size: 32px; color: #333;'
      },
      { 
        name: 'Ma Shan Zheng (楷体)', 
        style: 'font-family: "Ma Shan Zheng", serif; font-size: 32px; color: #333; font-weight: 400;'
      },
      { 
        name: 'ZCOOL XiaoWei (仿宋)', 
        style: 'font-family: "ZCOOL XiaoWei", serif; font-size: 32px; color: #333; font-weight: 400;'
      },
      { 
        name: 'Liu Jian Mao Cao (隶书)', 
        style: 'font-family: "Liu Jian Mao Cao", serif; font-size: 32px; color: #333; font-weight: 400;'
      },
      { 
        name: 'ZCOOL KuaiLe (装饰)', 
        style: 'font-family: "ZCOOL KuaiLe", serif; font-size: 32px; color: #333; font-weight: 400;'
      },
      { 
        name: 'Noto Serif SC (宋体)', 
        style: 'font-family: "Noto Serif SC", serif; font-size: 32px; color: #333; font-weight: 400;'
      }
    ];
    
    fontTests.forEach((test, index) => {
      const section = document.createElement('div');
      section.style.cssText = 'margin-bottom: 30px; padding: 20px; border: 2px solid #ddd; border-radius: 8px;';
      
      const title = document.createElement('h3');
      title.textContent = `${index + 1}. ${test.name}`;
      title.style.cssText = 'margin: 0 0 15px 0; color: #666; font-size: 16px; font-family: monospace;';
      
      const text = document.createElement('div');
      text.style.cssText = test.style + ' line-height: 1.5; padding: 10px; background: #f9f9f9; border-radius: 4px;';
      text.textContent = testText;
      
      // 添加计算样式信息
      section.appendChild(title);
      section.appendChild(text);
      container.appendChild(section);
      
      // 延迟获取计算样式
      setTimeout(() => {
        const computedStyle = getComputedStyle(text);
        const info = document.createElement('div');
        info.style.cssText = 'margin-top: 10px; font-size: 12px; color: #888; font-family: monospace;';
        info.textContent = `实际字体: ${computedStyle.fontFamily}`;
        section.appendChild(info);
      }, 100);
    });
    
    document.body.appendChild(container);
  });
  
  // 等待字体渲染
  await page.waitForTimeout(2000);

  // 步骤5: 测量实际渲染差异
  console.log('\n=== 步骤5: 测量实际渲染差异 ===');
  
  const renderingMetrics = await page.evaluate(() => {
    const sections = document.querySelectorAll('div[style*="font-family"]');
    const metrics = [];
    
    sections.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const computedStyle = getComputedStyle(element);
      
      metrics.push({
        index: index + 1,
        fontFamily: computedStyle.fontFamily.split(',')[0].replace(/"/g, ''),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        fontSize: computedStyle.fontSize
      });
    });
    
    return metrics;
  });
  
  console.log('渲染指标:');
  renderingMetrics.forEach(metric => {
    console.log(`  ${metric.index}. ${metric.fontFamily}: ${metric.width}x${metric.height}px (${metric.fontSize})`);
  });
  
  // 计算差异
  const differences = [];
  for (let i = 1; i < renderingMetrics.length; i++) {
    const baseline = renderingMetrics[0];
    const current = renderingMetrics[i];
    const widthDiff = Math.abs(current.width - baseline.width);
    const heightDiff = Math.abs(current.height - baseline.height);
    
    differences.push({
      font: current.fontFamily,
      widthDiff,
      heightDiff,
      significant: widthDiff > 20 || heightDiff > 10
    });
  }
  
  console.log('\n与基准字体的差异:');
  differences.forEach(diff => {
    const status = diff.significant ? '✅ 显著' : '⚠️ 轻微';
    console.log(`  ${status} ${diff.font}: 宽度差${diff.widthDiff}px, 高度差${diff.heightDiff}px`);
  });

  // 步骤6: 截图
  console.log('\n=== 步骤6: 截图验证 ===');
  
  await page.screenshot({ 
    path: 'tests/screenshots/font-loading-debug.png',
    fullPage: true 
  });
  console.log('✅ 已保存调试截图: tests/screenshots/font-loading-debug.png');

  // 总结
  console.log('\n=== 字体加载调试总结 ===');
  console.log(`📥 字体请求数: ${fontRequests.length}`);
  console.log(`📥 CSS请求数: ${cssRequests.length}`);
  
  const availableFonts = fontAvailabilityTest.filter(f => f.available && f.font !== 'serif').length;
  const significantDiffs = differences.filter(d => d.significant).length;
  
  console.log(`✅ 可用字体: ${availableFonts}/${fontAvailabilityTest.length - 1}`);
  console.log(`✅ 显著差异: ${significantDiffs}/${differences.length}`);
  
  if (fontRequests.length === 0) {
    console.log('⚠️ 没有检测到字体文件请求，可能字体CSS未正确加载');
  }
  
  if (availableFonts < 3) {
    console.log('⚠️ 可用字体数量不足，需要检查字体文件和CSS配置');
  }

  console.log('\n=== 字体加载调试测试完成 ===');
});
