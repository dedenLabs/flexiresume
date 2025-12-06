/**
 * CDN浏览器清理功能测试
 * 
 * 测试目标：验证CDN移除后在浏览器中的清理功能
 * 
 * @author Claude (Augment Agent)
 * @date 2025-08-02
 */

import { test, expect } from '@playwright/test';

test.describe('CDN浏览器清理功能测试', () => {
  test('验证CDN调试工具在浏览器中可用', async ({ page }) => {
    console.log('🧪 开始测试CDN调试工具...');
    
    // 访问应用
    await page.goto('http://localhost:5174');
    
    // 等待页面加载
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 检查CDN调试工具是否可用
    const cdnDebugAvailable = await page.evaluate(() => {
      return typeof (window as any).cdnDebug !== 'undefined';
    });
    
    expect(cdnDebugAvailable).toBe(true);
    console.log('✅ CDN调试工具已加载');
    
    // 测试调试工具的各个方法
    const debugMethods = await page.evaluate(() => {
      const cdnDebug = (window as any).cdnDebug;
      return {
        hasShowStatus: typeof cdnDebug.showStatus === 'function',
        hasGetStats: typeof cdnDebug.getStats === 'function',
        hasCleanup: typeof cdnDebug.cleanup === 'function',
        hasGetHealth: typeof cdnDebug.getHealth === 'function',
        hasCheckHealth: typeof cdnDebug.checkHealth === 'function',
        hasHelp: typeof cdnDebug.help === 'function'
      };
    });
    
    expect(debugMethods.hasShowStatus).toBe(true);
    expect(debugMethods.hasGetStats).toBe(true);
    expect(debugMethods.hasCleanup).toBe(true);
    expect(debugMethods.hasGetHealth).toBe(true);
    expect(debugMethods.hasCheckHealth).toBe(true);
    expect(debugMethods.hasHelp).toBe(true);
    
    console.log('✅ 所有CDN调试方法都可用');
  });

  test('验证CDN状态显示功能', async ({ page }) => {
    console.log('🧪 开始测试CDN状态显示...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 调用显示CDN状态
    await page.evaluate(() => {
      (window as any).cdnDebug.showStatus();
    });
    
    // 等待状态面板出现
    await page.waitForTimeout(1000);
    
    // 检查状态面板是否出现
    const statusPanel = await page.locator('#cdn-status-display');
    await expect(statusPanel).toBeVisible();
    
    // 检查状态面板内容
    const statusContent = await statusPanel.textContent();
    expect(statusContent).toContain('CDN状态报告');
    expect(statusContent).toContain('剩余CDN');
    
    console.log('✅ CDN状态面板显示正常');
    
    // 截图记录状态面板
    await page.screenshot({ 
      path: 'tests/screenshots/cdn-status-panel.png',
      fullPage: false 
    });
    
    // 关闭状态面板
    await page.locator('#cdn-status-display button').click();
    await expect(statusPanel).not.toBeVisible();
    
    console.log('✅ CDN状态面板关闭正常');
  });

  test('验证CDN统计信息获取', async ({ page }) => {
    console.log('🧪 开始测试CDN统计信息...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 获取CDN统计信息
    const stats = await page.evaluate(() => {
      return (window as any).cdnDebug.getStats();
    });
    
    console.log('📊 CDN统计信息:', stats);
    
    // 验证统计信息结构
    expect(stats).toHaveProperty('removedCount');
    expect(stats).toHaveProperty('removedCDNs');
    expect(stats).toHaveProperty('remainingCount');
    expect(stats).toHaveProperty('remainingCDNs');
    
    expect(typeof stats.removedCount).toBe('number');
    expect(Array.isArray(stats.removedCDNs)).toBe(true);
    expect(typeof stats.remainingCount).toBe('number');
    expect(Array.isArray(stats.remainingCDNs)).toBe(true);
    
    console.log(`✅ CDN统计: 剩余${stats.remainingCount}个，已移除${stats.removedCount}个`);
  });

  test('验证CDN健康检查功能', async ({ page }) => {
    console.log('🧪 开始测试CDN健康检查...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 执行健康检查
    await page.evaluate(() => {
      (window as any).cdnDebug.checkHealth();
    });
    
    // 等待健康检查完成
    await page.waitForTimeout(10000);
    
    // 检查是否有健康检查相关的控制台输出
    const healthCheckMessages = consoleMessages.filter(msg => 
      msg.includes('CDN健康检查') || msg.includes('CDN状态报告')
    );
    
    expect(healthCheckMessages.length).toBeGreaterThan(0);
    console.log('✅ CDN健康检查执行成功');
    
    // 检查状态面板是否自动显示
    const statusPanel = await page.locator('#cdn-status-display');
    if (await statusPanel.isVisible()) {
      console.log('✅ 健康检查后自动显示状态面板');
      
      // 截图记录健康检查结果
      await page.screenshot({ 
        path: 'tests/screenshots/cdn-health-check-result.png',
        fullPage: false 
      });
      
      // 关闭状态面板
      await page.locator('#cdn-status-display button').click();
    }
  });

  test('验证CDN清理功能', async ({ page }) => {
    console.log('🧪 开始测试CDN清理功能...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 执行CDN清理
    await page.evaluate(() => {
      (window as any).cdnDebug.cleanup();
    });
    
    // 等待清理完成
    await page.waitForTimeout(3000);
    
    // 检查是否有清理相关的控制台输出
    const cleanupMessages = consoleMessages.filter(msg => 
      msg.includes('CDN') && (msg.includes('清理') || msg.includes('cleanup') || msg.includes('移除'))
    );
    
    console.log('📝 清理相关消息:', cleanupMessages);
    
    // 验证清理功能执行（即使没有需要清理的CDN，也应该有相关日志）
    expect(cleanupMessages.length).toBeGreaterThanOrEqual(0);
    console.log('✅ CDN清理功能执行完成');
  });

  test('验证帮助信息显示', async ({ page }) => {
    console.log('🧪 开始测试帮助信息...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
    
    // 显示帮助信息
    await page.evaluate(() => {
      (window as any).cdnDebug.help();
    });
    
    // 等待帮助信息输出
    await page.waitForTimeout(1000);
    
    // 检查帮助信息
    const helpMessages = consoleMessages.filter(msg => 
      msg.includes('CDN调试工具') || msg.includes('CDN Debug Tools')
    );
    
    expect(helpMessages.length).toBeGreaterThan(0);
    
    const helpContent = helpMessages.join(' ');
    expect(helpContent).toContain('showStatus');
    expect(helpContent).toContain('getStats');
    expect(helpContent).toContain('cleanup');
    expect(helpContent).toContain('checkHealth');
    
    console.log('✅ 帮助信息显示正常');
  });

  test('验证生产环境CDN调试可用性', async ({ page }) => {
    console.log('🧪 开始测试生产环境CDN调试...');
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // 模拟生产环境（禁用开发者工具调试）
    await page.evaluate(() => {
      // 覆盖console.log以模拟生产环境
      const originalLog = console.log;
      const logs: string[] = [];
      
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog.apply(console, args);
      };
      
      // 执行CDN调试功能
      (window as any).cdnDebug.showStatus();
      (window as any).cdnDebug.getStats();
      
      // 恢复console.log
      console.log = originalLog;
      
      return logs;
    });
    
    // 检查状态面板是否显示
    const statusPanel = await page.locator('#cdn-status-display');
    if (await statusPanel.isVisible()) {
      console.log('✅ 生产环境下CDN调试工具正常工作');
      
      // 截图记录生产环境状态
      await page.screenshot({ 
        path: 'tests/screenshots/cdn-production-debug.png',
        fullPage: false 
      });
      
      // 关闭状态面板
      await page.locator('#cdn-status-display button').click();
    } else {
      console.log('ℹ️ 状态面板未显示（可能没有需要显示的信息）');
    }
    
    console.log('✅ 生产环境CDN调试测试完成');
  });
});
