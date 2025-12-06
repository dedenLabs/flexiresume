import { test, expect } from '@playwright/test';

test.describe('Mermaid简单验证测试', () => {
  test('验证页面加载和基本功能', async ({ page }) => {
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
    
    // 等待5秒观察
    await page.waitForTimeout(5000);
    
    // 检查是否有SVG元素
    const svgElements = await page.locator('svg').count();
    console.log(`找到 ${svgElements} 个SVG元素`);
    
    // 统计Mermaid相关的日志消息
    const mermaidLogs = consoleMessages.filter(msg => 
      msg.includes('MermaidLazyChart') || 
      msg.includes('mermaid') ||
      msg.includes('🔄') ||
      msg.includes('定时检查')
    );
    
    console.log('\n=== Mermaid相关日志统计 ===');
    console.log(`总Mermaid日志: ${mermaidLogs.length}`);
    
    // 检查是否有过多的重复渲染日志
    const renderLogs = mermaidLogs.filter(log => 
      log.includes('开始渲染') || 
      log.includes('重新渲染') ||
      log.includes('timer-') ||
      log.includes('定时检查')
    );
    
    console.log(`渲染相关日志: ${renderLogs.length}`);
    
    // 过滤掉CORS相关的错误（这些不是我们的问题）
    const relevantErrors = errorMessages.filter(error => 
      !error.includes('CORS') && 
      !error.includes('Access-Control-Allow-Origin') &&
      !error.includes('Failed to load resource') &&
      !error.includes('preload')
    );
    
    console.log(`相关错误数量: ${relevantErrors.length}`);
    if (relevantErrors.length > 0) {
      console.log('相关错误:', relevantErrors);
    }
    
    // 验证基本功能
    expect(svgElements).toBeGreaterThan(0);
    expect(renderLogs.length).toBeLessThan(15); // 应该大大减少
    expect(relevantErrors.length).toBe(0); // 不应该有相关错误
    
    // 截图保存
    await page.screenshot({ 
      path: 'tests/screenshots/mermaid-simple-test.png',
      fullPage: true 
    });
    
    console.log('✅ 简单测试完成');
  });
});
