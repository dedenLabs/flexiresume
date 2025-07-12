import { test, expect } from '@playwright/test';

/**
 * 深度验证测试 - 真实数据捕获 + 截图验证
 * 
 * 严格验证每个页面的实际工作状态
 * 1. 捕获控制台错误
 * 2. 验证真实DOM内容
 * 3. 截图记录实际显示效果
 * 4. 检查网络请求状态
 */

const TEST_PAGES = [
  { name: 'agent', url: '/agent.html', description: 'AI Agent Engineer' },
  { name: 'fullstack', url: '/fullstack.html', description: 'Full Stack Developer' },
  { name: 'contracttask', url: '/contracttask.html', description: 'Contract Task' },
  { name: 'cto', url: '/cto.html', description: 'CTO' },
  { name: 'frontend', url: '/frontend.html', description: 'Frontend Developer' }
];

interface PageTestResult {
  page: string;
  url: string;
  success: boolean;
  title: string;
  consoleErrors: string[];
  networkErrors: string[];
  domContent: {
    hasMainContent: boolean;
    hasPersonalInfo: boolean;
    hasSkillsSection: boolean;
    hasExperienceSection: boolean;
    textContentLength: number;
  };
  screenshots: {
    fullPage: string;
    viewport: string;
  };
  loadTime: number;
  errorDetails?: string;
}

test.describe('深度页面验证测试', () => {
  
  test('深度验证所有页面 - 真实数据捕获', async ({ page }) => {
    const results: PageTestResult[] = [];
    
    // 设置控制台和网络监听
    const consoleMessages: string[] = [];
    const networkErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      consoleMessages.push(`[PAGE ERROR] ${error.message}`);
    });
    
    page.on('requestfailed', request => {
      networkErrors.push(`Failed: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });
    
    for (const pageConfig of TEST_PAGES) {
      console.log(`\n🔍 深度测试页面: ${pageConfig.name}`);
      
      // 清空错误记录
      consoleMessages.length = 0;
      networkErrors.length = 0;
      
      const startTime = Date.now();
      let success = false;
      let errorDetails = '';
      
      try {
        // 导航到页面
        console.log(`📍 导航到: ${pageConfig.url}`);
        const response = await page.goto(pageConfig.url, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });
        
        if (!response || response.status() !== 200) {
          throw new Error(`HTTP错误: ${response?.status()}`);
        }
        
        // 等待页面完全加载
        await page.waitForTimeout(5000);
        
        // 获取页面标题
        const title = await page.title();
        console.log(`📄 页面标题: "${title}"`);
        
        // 检查DOM内容
        console.log(`🔍 检查DOM内容...`);
        const domContent = await page.evaluate(() => {
          // 检查主要内容区域
          const mainContent = document.querySelector('main') || document.querySelector('body');
          const hasMainContent = !!mainContent && mainContent.children.length > 0;
          
          // 检查个人信息区域
          const personalInfo = document.querySelector('[data-section="personal"], .personal-info, .header-info') ||
                              document.querySelector('h1, h2, h3').closest('section, div');
          const hasPersonalInfo = !!personalInfo;
          
          // 检查技能区域
          const skillsSection = document.querySelector('[data-section="skills"], .skills, .skill') ||
                               Array.from(document.querySelectorAll('*')).find(el => 
                                 el.textContent?.includes('技能') || el.textContent?.includes('Skills')
                               );
          const hasSkillsSection = !!skillsSection;
          
          // 检查经验区域
          const experienceSection = document.querySelector('[data-section="experience"], .experience, .work') ||
                                   Array.from(document.querySelectorAll('*')).find(el => 
                                     el.textContent?.includes('经验') || el.textContent?.includes('Experience')
                                   );
          const hasExperienceSection = !!experienceSection;
          
          // 获取页面文本内容长度
          const textContentLength = document.body.textContent?.trim().length || 0;
          
          return {
            hasMainContent,
            hasPersonalInfo,
            hasSkillsSection,
            hasExperienceSection,
            textContentLength
          };
        });
        
        console.log(`📊 DOM内容分析:`, domContent);
        
        // 截图 - 全页面
        const fullPageScreenshot = `tests/screenshots/deep-${pageConfig.name}-full.png`;
        await page.screenshot({ 
          path: fullPageScreenshot, 
          fullPage: true 
        });
        
        // 截图 - 视口
        const viewportScreenshot = `tests/screenshots/deep-${pageConfig.name}-viewport.png`;
        await page.screenshot({ 
          path: viewportScreenshot, 
          fullPage: false 
        });
        
        const loadTime = Date.now() - startTime;
        
        // 判断页面是否真正成功加载
        const hasRealContent = domContent.textContentLength > 100; // 至少100字符的内容
        const hasBasicStructure = domContent.hasMainContent;
        const noMajorErrors = consoleMessages.filter(msg => 
          msg.includes('ERROR') || msg.includes('Failed') || msg.includes('Cannot')
        ).length === 0;
        
        success = hasRealContent && hasBasicStructure && noMajorErrors;
        
        if (!success) {
          errorDetails = `内容不足(${domContent.textContentLength}字符) 或 结构缺失 或 有严重错误`;
        }
        
        console.log(`✅ 页面验证完成: ${success ? '成功' : '失败'}`);
        if (!success) {
          console.log(`❌ 失败原因: ${errorDetails}`);
        }
        
        results.push({
          page: pageConfig.name,
          url: pageConfig.url,
          success,
          title,
          consoleErrors: [...consoleMessages],
          networkErrors: [...networkErrors],
          domContent,
          screenshots: {
            fullPage: fullPageScreenshot,
            viewport: viewportScreenshot
          },
          loadTime,
          errorDetails: success ? undefined : errorDetails
        });
        
      } catch (error) {
        const loadTime = Date.now() - startTime;
        errorDetails = error instanceof Error ? error.message : String(error);
        
        console.log(`❌ 页面加载失败: ${errorDetails}`);
        
        // 尝试截图错误状态
        try {
          await page.screenshot({ 
            path: `tests/screenshots/deep-${pageConfig.name}-error.png`,
            fullPage: true 
          });
        } catch (screenshotError) {
          console.log(`截图失败: ${screenshotError}`);
        }
        
        results.push({
          page: pageConfig.name,
          url: pageConfig.url,
          success: false,
          title: 'N/A',
          consoleErrors: [...consoleMessages],
          networkErrors: [...networkErrors],
          domContent: {
            hasMainContent: false,
            hasPersonalInfo: false,
            hasSkillsSection: false,
            hasExperienceSection: false,
            textContentLength: 0
          },
          screenshots: {
            fullPage: `tests/screenshots/deep-${pageConfig.name}-error.png`,
            viewport: `tests/screenshots/deep-${pageConfig.name}-error.png`
          },
          loadTime,
          errorDetails
        });
      }
    }
    
    // 生成详细报告
    console.log('\n📊 深度验证报告');
    console.log('='.repeat(80));
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`总页面数: ${results.length}`);
    console.log(`成功页面: ${successCount}`);
    console.log(`失败页面: ${failCount}`);
    console.log(`真实成功率: ${((successCount / results.length) * 100).toFixed(1)}%`);
    
    console.log('\n📋 详细结果:');
    results.forEach(result => {
      const status = result.success ? '✅ 成功' : '❌ 失败';
      console.log(`\n${status} ${result.page.toUpperCase()}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   标题: "${result.title}"`);
      console.log(`   加载时间: ${result.loadTime}ms`);
      console.log(`   内容长度: ${result.domContent.textContentLength}字符`);
      console.log(`   主要内容: ${result.domContent.hasMainContent ? '✅' : '❌'}`);
      console.log(`   个人信息: ${result.domContent.hasPersonalInfo ? '✅' : '❌'}`);
      console.log(`   技能区域: ${result.domContent.hasSkillsSection ? '✅' : '❌'}`);
      console.log(`   经验区域: ${result.domContent.hasExperienceSection ? '✅' : '❌'}`);
      console.log(`   控制台错误: ${result.consoleErrors.length}个`);
      console.log(`   网络错误: ${result.networkErrors.length}个`);
      
      if (result.consoleErrors.length > 0) {
        console.log(`   🚨 控制台错误:`);
        result.consoleErrors.forEach(error => console.log(`      - ${error}`));
      }
      
      if (result.networkErrors.length > 0) {
        console.log(`   🌐 网络错误:`);
        result.networkErrors.forEach(error => console.log(`      - ${error}`));
      }
      
      if (result.errorDetails) {
        console.log(`   ❌ 错误详情: ${result.errorDetails}`);
      }
      
      console.log(`   📸 截图: ${result.screenshots.fullPage}`);
    });
    
    // 保存详细报告
    const detailedReport = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        success: successCount,
        failed: failCount,
        realSuccessRate: `${((successCount / results.length) * 100).toFixed(1)}%`
      },
      results: results
    };
    
    const fs = await import('fs');
    fs.writeFileSync(
      'tests/reports/deep-verification-report.json',
      JSON.stringify(detailedReport, null, 2)
    );
    
    // 如果有失败的页面，测试应该失败
    if (failCount > 0) {
      throw new Error(`${failCount}个页面验证失败，请检查控制台错误和截图`);
    }
  });
  
});
