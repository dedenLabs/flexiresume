import { test, expect } from '@playwright/test';

/**
 * 数据结构全面验证测试
 * 测试所有页面的中英文切换功能和数据结构一致性
 */

const TEST_PAGES = [
  { name: 'agent', url: 'http://localhost:5177/agent', title_zh: 'AI智能体工程师', title_en: 'AI Agent Engineer' },
  { name: 'fullstack', url: 'http://localhost:5177/fullstack', title_zh: '全栈开发工程师', title_en: 'Full Stack Developer' },
  { name: 'contracttask', url: 'http://localhost:5177/contracttask', title_zh: '外包项目专家', title_en: 'Contract Task Expert' },
  { name: 'cto', url: 'http://localhost:5177/cto', title_zh: '前端/后端/CTO', title_en: 'Frontend/Backend/CTO' },
  { name: 'frontend', url: 'http://localhost:5177/frontend', title_zh: '游戏主程专家', title_en: 'Game Development Expert' }
];

test.describe('数据结构全面验证', () => {
  
  test('所有页面中英文切换完整测试', async ({ page }) => {
    const testResults: any[] = [];
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`\n🔍 测试页面: ${pageConfig.name}`);
      
      const pageResult = {
        page: pageConfig.name,
        url: pageConfig.url,
        chinese: { success: false, errors: [], content: '', title: '' },
        english: { success: false, errors: [], content: '', title: '' },
        switchTest: { success: false, errors: [] }
      };
      
      try {
        // 监听控制台错误
        const consoleErrors: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        page.on('pageerror', error => {
          consoleErrors.push(`Page Error: ${error.message}`);
        });
        
        // 1. 测试中文版本
        console.log(`📍 导航到中文版: ${pageConfig.url}`);
        await page.goto(pageConfig.url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);
        
        // 确保是中文状态
        const languageButton = page.locator('[data-testid="language-switcher"]').first();
        if (await languageButton.isVisible()) {
          const currentLang = await languageButton.textContent();
          if (currentLang?.includes('EN') || currentLang?.includes('English')) {
            await languageButton.click();
            await page.waitForTimeout(2000);
          }
        }
        
        // 获取中文页面信息
        const chineseInfo = await page.evaluate(() => {
          return {
            title: document.title,
            bodyText: document.body?.textContent || '',
            hasReactRoot: !!document.querySelector('#root'),
            reactRootContent: document.querySelector('#root')?.innerHTML?.length || 0,
            hasEmploymentHistory: document.body?.textContent?.includes('工作经历') || false,
            hasSkills: document.body?.textContent?.includes('技能') || document.body?.textContent?.includes('技术栈') || false,
            hasProjects: document.body?.textContent?.includes('项目') || document.body?.textContent?.includes('作品') || false,
            hasEducation: document.body?.textContent?.includes('教育') || document.body?.textContent?.includes('学历') || false
          };
        });
        
        pageResult.chinese = {
          success: chineseInfo.bodyText.length > 1000 && consoleErrors.length === 0,
          errors: [...consoleErrors],
          content: `${chineseInfo.bodyText.length}字符`,
          title: chineseInfo.title
        };
        
        console.log(`   中文版标题: "${chineseInfo.title}"`);
        console.log(`   中文版内容: ${chineseInfo.bodyText.length}字符`);
        console.log(`   中文版错误: ${consoleErrors.length}个`);
        
        // 截图中文版
        await page.screenshot({ 
          path: `tests/screenshots/data-validation-${pageConfig.name}-zh.png`,
          fullPage: true 
        });
        
        // 2. 切换到英文版本
        console.log(`🔄 切换到英文版`);
        consoleErrors.length = 0; // 清空错误记录
        
        if (await languageButton.isVisible()) {
          await languageButton.click();
          await page.waitForTimeout(3000); // 等待切换完成
        }
        
        // 获取英文页面信息
        const englishInfo = await page.evaluate(() => {
          return {
            title: document.title,
            bodyText: document.body?.textContent || '',
            hasReactRoot: !!document.querySelector('#root'),
            reactRootContent: document.querySelector('#root')?.innerHTML?.length || 0,
            hasEmploymentHistory: document.body?.textContent?.includes('Work Experience') || document.body?.textContent?.includes('Employment') || false,
            hasSkills: document.body?.textContent?.includes('Skills') || document.body?.textContent?.includes('Technology') || false,
            hasProjects: document.body?.textContent?.includes('Project') || document.body?.textContent?.includes('Works') || false,
            hasEducation: document.body?.textContent?.includes('Education') || false
          };
        });
        
        pageResult.english = {
          success: englishInfo.bodyText.length > 1000 && consoleErrors.length === 0,
          errors: [...consoleErrors],
          content: `${englishInfo.bodyText.length}字符`,
          title: englishInfo.title
        };
        
        console.log(`   英文版标题: "${englishInfo.title}"`);
        console.log(`   英文版内容: ${englishInfo.bodyText.length}字符`);
        console.log(`   英文版错误: ${consoleErrors.length}个`);
        
        // 截图英文版
        await page.screenshot({ 
          path: `tests/screenshots/data-validation-${pageConfig.name}-en.png`,
          fullPage: true 
        });
        
        // 3. 切换回中文验证
        console.log(`🔄 切换回中文验证`);
        consoleErrors.length = 0;
        
        if (await languageButton.isVisible()) {
          await languageButton.click();
          await page.waitForTimeout(3000);
        }
        
        const finalChineseInfo = await page.evaluate(() => {
          return {
            title: document.title,
            bodyText: document.body?.textContent || '',
            hasChineseContent: document.body?.textContent?.includes('工作经历') || false
          };
        });
        
        pageResult.switchTest = {
          success: finalChineseInfo.hasChineseContent && consoleErrors.length === 0,
          errors: [...consoleErrors]
        };
        
        console.log(`   切换测试: ${pageResult.switchTest.success ? '✅ 成功' : '❌ 失败'}`);
        
      } catch (error) {
        console.log(`❌ 页面测试失败: ${error}`);
        pageResult.chinese.errors.push(`Navigation error: ${error}`);
        pageResult.english.errors.push(`Navigation error: ${error}`);
        pageResult.switchTest.errors.push(`Navigation error: ${error}`);
      }
      
      testResults.push(pageResult);
    }
    
    // 生成详细测试报告
    console.log('\n📋 完整测试报告');
    console.log('='.repeat(80));
    
    let totalPages = testResults.length;
    let successfulChinese = 0;
    let successfulEnglish = 0;
    let successfulSwitch = 0;
    
    testResults.forEach(result => {
      console.log(`\n🔍 ${result.page.toUpperCase()} 页面:`);
      console.log(`   URL: ${result.url}`);
      console.log(`   中文版: ${result.chinese.success ? '✅' : '❌'} (${result.chinese.content})`);
      console.log(`   英文版: ${result.english.success ? '✅' : '❌'} (${result.english.content})`);
      console.log(`   切换测试: ${result.switchTest.success ? '✅' : '❌'}`);
      
      if (result.chinese.errors.length > 0) {
        console.log(`   中文版错误: ${result.chinese.errors.join(', ')}`);
      }
      if (result.english.errors.length > 0) {
        console.log(`   英文版错误: ${result.english.errors.join(', ')}`);
      }
      if (result.switchTest.errors.length > 0) {
        console.log(`   切换错误: ${result.switchTest.errors.join(', ')}`);
      }
      
      if (result.chinese.success) successfulChinese++;
      if (result.english.success) successfulEnglish++;
      if (result.switchTest.success) successfulSwitch++;
    });
    
    console.log(`\n📊 总体统计:`);
    console.log(`   总页面数: ${totalPages}`);
    console.log(`   中文版成功: ${successfulChinese}/${totalPages} (${Math.round(successfulChinese/totalPages*100)}%)`);
    console.log(`   英文版成功: ${successfulEnglish}/${totalPages} (${Math.round(successfulEnglish/totalPages*100)}%)`);
    console.log(`   切换测试成功: ${successfulSwitch}/${totalPages} (${Math.round(successfulSwitch/totalPages*100)}%)`);
    
    // 保存详细报告
    const testReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPages,
        successfulChinese,
        successfulEnglish,
        successfulSwitch,
        chineseSuccessRate: Math.round(successfulChinese/totalPages*100),
        englishSuccessRate: Math.round(successfulEnglish/totalPages*100),
        switchSuccessRate: Math.round(successfulSwitch/totalPages*100)
      },
      details: testResults
    };
    
    const fs = await import('fs');
    fs.writeFileSync(
      'tests/reports/data-structure-validation-report.json',
      JSON.stringify(testReport, null, 2)
    );
    
    console.log(`\n💾 详细报告已保存到: tests/reports/data-structure-validation-report.json`);
    
    // 验证测试结果
    const overallSuccess = successfulChinese === totalPages && 
                          successfulEnglish === totalPages && 
                          successfulSwitch === totalPages;
    
    if (overallSuccess) {
      console.log(`\n🎉 所有测试通过！数据结构修复成功！`);
    } else {
      console.log(`\n⚠️ 部分测试失败，需要进一步修复`);
    }
    
    // 使用软断言，让测试完成以便查看完整报告
    expect.soft(successfulChinese).toBe(totalPages);
    expect.soft(successfulEnglish).toBe(totalPages);
    expect.soft(successfulSwitch).toBe(totalPages);
  });
  
});
