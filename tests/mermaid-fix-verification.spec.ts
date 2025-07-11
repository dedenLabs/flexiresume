import { test, expect } from '@playwright/test';

test.describe('Mermaid循环渲染修复验证', () => {
  test('检查控制台错误和无限循环问题', async ({ page }) => {
    // 监听控制台消息
    const consoleMessages: string[] = [];
    const errorMessages: string[] = [];
    
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(text);
      
      if (msg.type() === 'error') {
        errorMessages.push(text);
      }
    });

    // 访问页面
    await page.goto('http://localhost:5179');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待Mermaid图表渲染
    await page.waitForTimeout(3000);
    
    // 检查是否有Mermaid图表
    const mermaidCharts = await page.locator('.mermaid-lazy-chart').count();
    console.log(`找到 ${mermaidCharts} 个Mermaid图表`);
    
    // 等待更长时间观察是否有循环渲染
    console.log('等待10秒观察是否有循环渲染...');
    await page.waitForTimeout(10000);
    
    // 统计Mermaid相关的日志消息
    const mermaidLogs = consoleMessages.filter(msg => 
      msg.includes('MermaidLazyChart') || 
      msg.includes('mermaid') ||
      msg.includes('🔄') ||
      msg.includes('定时检查')
    );
    
    console.log('\n=== Mermaid相关日志 ===');
    mermaidLogs.forEach((log, index) => {
      console.log(`${index + 1}. ${log}`);
    });
    
    // 检查错误消息
    console.log('\n=== 控制台错误 ===');
    if (errorMessages.length > 0) {
      errorMessages.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ 没有控制台错误');
    }
    
    // 检查是否有过多的重复渲染日志
    const renderLogs = mermaidLogs.filter(log => 
      log.includes('开始渲染') || 
      log.includes('重新渲染') ||
      log.includes('timer-')
    );
    
    console.log(`\n=== 渲染统计 ===`);
    console.log(`总Mermaid日志: ${mermaidLogs.length}`);
    console.log(`渲染相关日志: ${renderLogs.length}`);
    
    // 验证没有过多的重复渲染（允许一些正常的重新渲染）
    expect(renderLogs.length).toBeLessThan(20); // 如果超过20次渲染可能有问题
    
    // 验证没有控制台错误
    expect(errorMessages.length).toBe(0);
    
    // 截图保存
    await page.screenshot({ 
      path: 'tests/screenshots/mermaid-fix-verification.png',
      fullPage: true 
    });
    
    console.log('✅ 测试完成，截图已保存');
  });

  test('验证Mermaid图表正常显示', async ({ page }) => {
    await page.goto('http://localhost:5179');
    await page.waitForLoadState('networkidle');
    
    // 等待Mermaid图表加载
    await page.waitForTimeout(5000);
    
    // 检查是否有SVG元素
    const svgElements = await page.locator('svg').count();
    console.log(`找到 ${svgElements} 个SVG元素`);
    
    // 验证至少有一些SVG图表
    expect(svgElements).toBeGreaterThan(0);
    
    // 检查SVG内容是否有效
    const firstSvg = page.locator('svg').first();
    if (await firstSvg.count() > 0) {
      const svgContent = await firstSvg.innerHTML();
      expect(svgContent.length).toBeGreaterThan(100);
      expect(svgContent).toContain('<g');
    }
    
    console.log('✅ Mermaid图表显示正常');
  });
});
