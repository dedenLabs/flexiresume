import { test, expect } from '@playwright/test';

/**
 * 页面验证测试
 * 
 * 验证所有页面是否能正常显示和访问
 */

const TEST_PAGES = [
  { name: 'agent', url: '/agent.html', description: 'AI Agent Engineer' },
  { name: 'fullstack', url: '/fullstack.html', description: 'Full Stack Developer' },
  { name: 'contracttask', url: '/contracttask.html', description: 'Contract Task' },
  { name: 'cto', url: '/cto.html', description: 'CTO' },
  { name: 'frontend', url: '/frontend.html', description: 'Frontend Developer' }
];

test.describe('页面显示验证', () => {
  
  test('验证所有页面正常显示', async ({ page }) => {
    const results: { page: string; status: string; title: string; error?: string }[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`\n🔍 验证页面: ${pageConfig.name} (${pageConfig.description})`);
      
      try {
        // 导航到页面
        const response = await page.goto(pageConfig.url);
        
        // 检查HTTP状态
        const status = response?.status() || 0;
        if (status !== 200) {
          throw new Error(`HTTP状态错误: ${status}`);
        }
        
        // 等待页面加载
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000); // 等待动态内容加载
        
        // 检查页面标题
        const title = await page.title();
        
        // 检查主要内容是否存在
        const hasMainContent = await page.locator('main, body').isVisible();
        if (!hasMainContent) {
          throw new Error('主要内容未找到');
        }
        
        // 检查是否有语言切换器
        const hasLanguageSwitcher = await page.locator('[data-language-switcher]').isVisible();
        
        // 检查是否有控制面板
        const hasControlPanel = await page.locator('[data-testid="control-panel"], .control-panel').count() > 0;
        
        // 截图记录
        await page.screenshot({ 
          path: `tests/screenshots/verification-${pageConfig.name}.png`,
          fullPage: true 
        });
        
        results.push({
          page: pageConfig.name,
          status: '✅ 正常',
          title: title
        });
        
        console.log(`✅ ${pageConfig.name} 页面验证成功`);
        console.log(`   - 标题: "${title}"`);
        console.log(`   - 语言切换器: ${hasLanguageSwitcher ? '✅' : '❌'}`);
        console.log(`   - 控制面板: ${hasControlPanel ? '✅' : '❌'}`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        results.push({
          page: pageConfig.name,
          status: '❌ 失败',
          title: 'N/A',
          error: errorMessage
        });
        
        console.log(`❌ ${pageConfig.name} 页面验证失败: ${errorMessage}`);
        
        // 截图记录错误状态
        try {
          await page.screenshot({ 
            path: `tests/screenshots/verification-${pageConfig.name}-error.png`,
            fullPage: true 
          });
        } catch (screenshotError) {
          console.log(`截图失败: ${screenshotError}`);
        }
      }
    }
    
    // 生成验证报告
    console.log('\n📊 页面验证报告:');
    console.log('='.repeat(60));
    
    const successCount = results.filter(r => r.status.includes('✅')).length;
    const failCount = results.filter(r => r.status.includes('❌')).length;
    
    console.log(`总页面数: ${results.length}`);
    console.log(`成功: ${successCount}`);
    console.log(`失败: ${failCount}`);
    console.log(`成功率: ${((successCount / results.length) * 100).toFixed(1)}%`);
    
    console.log('\n详细结果:');
    results.forEach(result => {
      console.log(`${result.status} ${result.page.padEnd(12)} - ${result.title}`);
      if (result.error) {
        console.log(`     错误: ${result.error}`);
      }
    });
    
    // 保存验证报告
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount,
        successRate: `${((successCount / results.length) * 100).toFixed(1)}%`
      },
      results: results
    };

    // 使用 import 代替 require
    const fs = await import('fs');
    fs.writeFileSync(
      'tests/reports/page-verification-report.json',
      JSON.stringify(report, null, 2)
    );
    
    // 断言：所有页面都应该成功加载
    expect(failCount).toBe(0);
  });
  
  test('验证页面间导航', async ({ page }) => {
    console.log('\n🔄 测试页面间导航...');
    
    for (let i = 0; i < TEST_PAGES.length; i++) {
      const currentPage = TEST_PAGES[i];
      const nextPage = TEST_PAGES[(i + 1) % TEST_PAGES.length];
      
      console.log(`导航: ${currentPage.name} → ${nextPage.name}`);
      
      // 导航到当前页面
      await page.goto(currentPage.url);
      await page.waitForLoadState('networkidle');
      
      // 验证当前页面加载成功
      const currentTitle = await page.title();
      expect(currentTitle).toBeTruthy();
      
      // 导航到下一个页面
      await page.goto(nextPage.url);
      await page.waitForLoadState('networkidle');
      
      // 验证下一个页面加载成功
      const nextTitle = await page.title();
      expect(nextTitle).toBeTruthy();
      
      console.log(`✅ ${currentPage.name} → ${nextPage.name} 导航成功`);
    }
    
    console.log('✅ 所有页面导航测试完成');
  });
  
  test('验证语言切换功能', async ({ page }) => {
    console.log('\n🌐 测试语言切换功能...');
    
    // 选择一个页面进行语言切换测试
    const testPage = TEST_PAGES[0];
    await page.goto(testPage.url);
    await page.waitForLoadState('networkidle');
    
    // 查找语言切换器
    const languageSwitcher = page.locator('[data-language-switcher]');
    const hasLanguageSwitcher = await languageSwitcher.isVisible();
    
    if (hasLanguageSwitcher) {
      console.log('✅ 找到语言切换器');
      
      // 点击语言切换器
      await languageSwitcher.click();
      await page.waitForTimeout(1000);
      
      // 检查下拉菜单是否出现
      const dropdownVisible = await page.locator('[data-language-switcher] + div').isVisible();
      
      if (dropdownVisible) {
        console.log('✅ 语言切换下拉菜单正常显示');
        
        // 截图记录
        await page.screenshot({ 
          path: 'tests/screenshots/language-switcher-dropdown.png' 
        });
        
        // 点击页面其他地方关闭下拉菜单
        await page.click('body');
        await page.waitForTimeout(500);
        
      } else {
        console.log('⚠️ 语言切换下拉菜单未显示');
      }
      
    } else {
      console.log('⚠️ 未找到语言切换器');
    }
    
    console.log('✅ 语言切换功能验证完成');
  });
  
});
