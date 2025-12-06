import { test, expect } from '@playwright/test';

/**
 * Game 页面专项测试
 * 重点验证 EmploymentHistoryCard 组件的 TypeError 错误是否已修复
 */

test.describe('Game 页面测试', () => {
  
  test('验证 game 页面无控制台错误', async ({ page }) => {
    const consoleErrors: any[] = [];
    const consoleWarnings: any[] = [];
    
    // 监听控制台错误
    page.on('console', msg => {
      const msgType = msg.type();
      const msgText = msg.text();
      
      if (msgType === 'error') {
        consoleErrors.push({
          type: msgType,
          text: msgText,
          location: msg.location()
        });
        console.log(`🚨 [ERROR] ${msgText}`);
      } else if (msgType === 'warning') {
        consoleWarnings.push({
          type: msgType,
          text: msgText,
          location: msg.location()
        });
        console.log(`⚠️ [WARNING] ${msgText}`);
      }
    });
    
    // 监听页面错误
    page.on('pageerror', error => {
      consoleErrors.push({
        type: 'pageerror',
        text: error.message,
        stack: error.stack
      });
      console.log(`💥 [PAGE ERROR] ${error.message}`);
    });
    
    console.log('🔍 导航到 game 页面...');
    
    // 导航到 game 页面
    await page.goto('http://localhost:5177/game', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('⏳ 等待页面完全加载...');
    
    // 等待页面加载完成
    await page.waitForTimeout(8000);
    
    // 检查页面基本信息
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        hasReactRoot: !!document.querySelector('#root'),
        reactRootContent: document.querySelector('#root')?.innerHTML?.length || 0,
        bodyTextLength: document.body?.textContent?.length || 0,
        employmentHistoryCards: document.querySelectorAll('[class*="employment"], [class*="Employment"]').length,
        hasEmploymentContent: document.body?.textContent?.includes('工作经历') || document.body?.textContent?.includes('Work Experience') || false
      };
    });
    
    console.log('📄 页面信息:');
    console.log(`   标题: "${pageInfo.title}"`);
    console.log(`   React根节点: ${pageInfo.hasReactRoot ? '✅' : '❌'}`);
    console.log(`   根节点内容长度: ${pageInfo.reactRootContent}字符`);
    console.log(`   页面文本长度: ${pageInfo.bodyTextLength}字符`);
    console.log(`   就业历史卡片: ${pageInfo.employmentHistoryCards}个`);
    console.log(`   包含就业内容: ${pageInfo.hasEmploymentContent ? '✅' : '❌'}`);
    
    // 截图
    await page.screenshot({ 
      path: 'tests/screenshots/game-page-test.png',
      fullPage: true 
    });
    
    console.log('📊 错误统计:');
    console.log(`   控制台错误: ${consoleErrors.length}个`);
    console.log(`   控制台警告: ${consoleWarnings.length}个`);
    
    // 详细输出错误信息
    if (consoleErrors.length > 0) {
      console.log('🚨 控制台错误详情:');
      consoleErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. [${error.type}] ${error.text}`);
        if (error.location) {
          console.log(`      位置: ${error.location.url}:${error.location.lineNumber}`);
        }
      });
    }
    
    if (consoleWarnings.length > 0) {
      console.log('⚠️ 控制台警告详情:');
      consoleWarnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. [${warning.type}] ${warning.text}`);
      });
    }
    
    // 验证页面基本功能
    expect(pageInfo.hasReactRoot).toBe(true);
    expect(pageInfo.bodyTextLength).toBeGreaterThan(100); // 页面应该有实际内容
    
    // 验证没有严重的控制台错误
    const criticalErrors = consoleErrors.filter(error => 
      error.text.includes('TypeError') || 
      error.text.includes('is not a function') ||
      error.text.includes('Cannot read properties') ||
      error.type === 'pageerror'
    );
    
    if (criticalErrors.length > 0) {
      console.log('❌ 发现严重错误:');
      criticalErrors.forEach(error => {
        console.log(`   - ${error.text}`);
      });
      throw new Error(`发现 ${criticalErrors.length} 个严重的控制台错误`);
    }
    
    console.log('✅ Game 页面测试通过 - 无严重控制台错误');
  });
  
});
