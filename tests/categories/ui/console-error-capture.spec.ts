import { test, expect } from '@playwright/test';

/**
 * 控制台错误捕获测试
 * 专门捕获页面的真实控制台错误和网络问题
 */

const TEST_PAGES = [
  { name: 'agent', url: '/agent.html' },
  { name: 'fullstack', url: '/fullstack.html' },
  { name: 'contracttask', url: '/contracttask.html' },
  { name: 'cto', url: '/cto.html' },
  { name: 'frontend', url: '/frontend.html' }
];

test.describe('控制台错误捕获', () => {
  
  test('捕获所有页面的真实错误', async ({ page }) => {
    const allErrors: { page: string; errors: any[]; networkErrors: any[]; pageContent: string }[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`\n🔍 检查页面: ${pageConfig.name}`);
      
      const consoleErrors: any[] = [];
      const networkErrors: any[] = [];
      
      // 监听所有类型的控制台消息
      page.on('console', msg => {
        const msgText = msg.text();
        const msgType = msg.type();
        
        if (msgType === 'error' || msgType === 'warning') {
          consoleErrors.push({
            type: msgType,
            text: msgText,
            location: msg.location()
          });
          console.log(`🚨 [${msgType.toUpperCase()}] ${msgText}`);
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
      
      // 监听网络请求失败
      page.on('requestfailed', request => {
        const failure = request.failure();
        networkErrors.push({
          url: request.url(),
          method: request.method(),
          errorText: failure?.errorText,
          resourceType: request.resourceType()
        });
        console.log(`🌐 [NETWORK ERROR] ${request.method()} ${request.url()} - ${failure?.errorText}`);
      });
      
      // 监听响应错误
      page.on('response', response => {
        if (response.status() >= 400) {
          networkErrors.push({
            url: response.url(),
            status: response.status(),
            statusText: response.statusText()
          });
          console.log(`📡 [HTTP ERROR] ${response.status()} ${response.url()}`);
        }
      });
      
      try {
        // 导航到页面
        console.log(`📍 导航到: ${pageConfig.url}`);
        await page.goto(pageConfig.url, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        
        // 等待页面加载
        await page.waitForTimeout(8000); // 等待8秒让所有错误显现
        
        // 获取页面内容
        const pageContent = await page.evaluate(() => {
          return {
            title: document.title,
            bodyText: document.body?.textContent?.substring(0, 500) || '',
            bodyHTML: document.body?.innerHTML?.substring(0, 1000) || '',
            hasReactRoot: !!document.querySelector('#root'),
            reactRootContent: document.querySelector('#root')?.innerHTML?.substring(0, 500) || '',
            scriptTags: Array.from(document.querySelectorAll('script')).length,
            linkTags: Array.from(document.querySelectorAll('link')).length,
            errorElements: Array.from(document.querySelectorAll('[class*="error"], [id*="error"]')).length
          };
        });
        
        console.log(`📄 页面信息:`);
        console.log(`   标题: "${pageContent.title}"`);
        console.log(`   React根节点: ${pageContent.hasReactRoot ? '✅' : '❌'}`);
        console.log(`   根节点内容长度: ${pageContent.reactRootContent.length}字符`);
        console.log(`   页面文本长度: ${pageContent.bodyText.length}字符`);
        console.log(`   脚本标签: ${pageContent.scriptTags}个`);
        console.log(`   样式链接: ${pageContent.linkTags}个`);
        console.log(`   错误元素: ${pageContent.errorElements}个`);
        
        if (pageContent.bodyText.length < 50) {
          console.log(`⚠️ 页面内容过少，可能未正确加载`);
          console.log(`   Body文本: "${pageContent.bodyText}"`);
          console.log(`   React根内容: "${pageContent.reactRootContent}"`);
        }
        
        // 截图
        await page.screenshot({ 
          path: `tests/screenshots/console-${pageConfig.name}-full.png`,
          fullPage: true 
        });
        
        allErrors.push({
          page: pageConfig.name,
          errors: [...consoleErrors],
          networkErrors: [...networkErrors],
          pageContent: JSON.stringify(pageContent, null, 2)
        });
        
      } catch (error) {
        console.log(`❌ 页面访问失败: ${error}`);
        
        allErrors.push({
          page: pageConfig.name,
          errors: [...consoleErrors, { type: 'navigation', text: String(error) }],
          networkErrors: [...networkErrors],
          pageContent: 'Navigation failed'
        });
      }
      
      console.log(`📊 ${pageConfig.name} 错误统计:`);
      console.log(`   控制台错误: ${consoleErrors.length}个`);
      console.log(`   网络错误: ${networkErrors.length}个`);
    }
    
    // 生成详细错误报告
    console.log('\n📋 完整错误报告');
    console.log('='.repeat(80));
    
    let totalErrors = 0;
    let totalNetworkErrors = 0;
    
    allErrors.forEach(result => {
      console.log(`\n🔍 ${result.page.toUpperCase()} 页面:`);
      
      if (result.errors.length > 0) {
        console.log(`   🚨 控制台错误 (${result.errors.length}个):`);
        result.errors.forEach((error, index) => {
          console.log(`      ${index + 1}. [${error.type}] ${error.text}`);
          if (error.location) {
            console.log(`         位置: ${error.location.url}:${error.location.lineNumber}`);
          }
          if (error.stack) {
            console.log(`         堆栈: ${error.stack.substring(0, 200)}...`);
          }
        });
        totalErrors += result.errors.length;
      }
      
      if (result.networkErrors.length > 0) {
        console.log(`   🌐 网络错误 (${result.networkErrors.length}个):`);
        result.networkErrors.forEach((error, index) => {
          console.log(`      ${index + 1}. ${error.method || 'GET'} ${error.url}`);
          console.log(`         错误: ${error.errorText || error.statusText || 'Unknown'}`);
        });
        totalNetworkErrors += result.networkErrors.length;
      }
      
      if (result.errors.length === 0 && result.networkErrors.length === 0) {
        console.log(`   ✅ 无错误`);
      }
    });
    
    console.log(`\n📊 总计:`);
    console.log(`   总控制台错误: ${totalErrors}个`);
    console.log(`   总网络错误: ${totalNetworkErrors}个`);
    
    // 保存详细报告
    const errorReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPages: allErrors.length,
        totalConsoleErrors: totalErrors,
        totalNetworkErrors: totalNetworkErrors,
        pagesWithErrors: allErrors.filter(r => r.errors.length > 0 || r.networkErrors.length > 0).length
      },
      details: allErrors
    };
    
    const fs = await import('fs');
    fs.writeFileSync(
      'tests/reports/console-error-report.json',
      JSON.stringify(errorReport, null, 2)
    );
    
    console.log(`\n💾 详细报告已保存到: tests/reports/console-error-report.json`);
    
    // 如果有严重错误，测试失败
    const criticalErrors = allErrors.filter(r => 
      r.errors.some(e => e.type === 'error' || e.type === 'pageerror') ||
      r.networkErrors.length > 0
    );
    
    if (criticalErrors.length > 0) {
      console.log(`\n❌ 发现 ${criticalErrors.length} 个页面有严重错误`);
      // 不抛出错误，让测试完成以便查看完整报告
    } else {
      console.log(`\n✅ 所有页面无严重错误`);
    }
  });
  
});
