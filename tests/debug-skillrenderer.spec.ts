import { test, expect } from '@playwright/test';

/**
 * SkillRenderer调试测试
 * 用于调试和验证SkillRenderer的工作状态
 */

test.describe('SkillRenderer调试', () => {
  test('调试fullstack页面的SkillRenderer状态', async ({ page }) => {
    console.log('🔍 开始调试SkillRenderer状态...');
    
    // 监听所有控制台消息
    page.on('console', (msg) => {
      console.log(`[${msg.type()}] ${msg.text()}`);
    });
    
    // 1. 导航到fullstack页面
    await page.goto('http://localhost:5178/fullstack');
    await page.waitForLoadState('networkidle');
    
    // 2. 等待页面完全加载
    await page.waitForTimeout(5000);
    
    // 3. 检查页面基本状态
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        bodyText: document.body.textContent?.substring(0, 200),
        hasSkillRenderer: !!document.querySelector('[style*="display: contents"]'),
        hasSecureContentRenderer: !!document.querySelector('.secure-content-loading, .secure-content-error, .markdown-content'),
        skillPlaceholders: document.querySelectorAll('.skill-placeholder').length,
        skillItems: document.querySelectorAll('[class*="skill"], .skill-item').length,
        mermaidPlaceholders: document.querySelectorAll('.mermaid-placeholder, .mermaid-lazy-placeholder').length,
        mermaidCharts: document.querySelectorAll('[id*="mermaid"]').length
      };
    });
    
    console.log('页面基本信息:', JSON.stringify(pageInfo, null, 2));
    
    // 4. 检查SkillRenderer容器
    const skillRendererInfo = await page.evaluate(() => {
      const containers = document.querySelectorAll('[style*="display: contents"]');
      const info = [];
      
      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        info.push({
          index: i,
          innerHTML: container.innerHTML.substring(0, 500),
          childrenCount: container.children.length,
          hasSkillPlaceholders: container.querySelectorAll('.skill-placeholder').length,
          hasMermaidPlaceholders: container.querySelectorAll('.mermaid-placeholder, .mermaid-lazy-placeholder').length
        });
      }
      
      return info;
    });
    
    console.log('SkillRenderer容器信息:', JSON.stringify(skillRendererInfo, null, 2));
    
    // 5. 检查SecureContentRenderer状态
    const secureContentInfo = await page.evaluate(() => {
      const secureContents = document.querySelectorAll('.markdown-content, .secure-content-loading, .secure-content-error');
      const info = [];
      
      for (let i = 0; i < secureContents.length; i++) {
        const content = secureContents[i];
        info.push({
          index: i,
          className: content.className,
          innerHTML: content.innerHTML.substring(0, 300),
          isLoading: content.classList.contains('secure-content-loading'),
          hasError: content.classList.contains('secure-content-error'),
          hasSkillPlaceholders: content.querySelectorAll('.skill-placeholder').length,
          hasMermaidPlaceholders: content.querySelectorAll('.mermaid-placeholder, .mermaid-lazy-placeholder').length
        });
      }
      
      return info;
    });
    
    console.log('SecureContentRenderer状态:', JSON.stringify(secureContentInfo, null, 2));
    
    // 6. 手动触发SkillRenderer处理
    const manualProcessResult = await page.evaluate(() => {
      // 查找所有技能占位符
      const skillPlaceholders = document.querySelectorAll('.skill-placeholder[data-skill-name][data-skill-level]');
      const mermaidPlaceholders = document.querySelectorAll('.mermaid-placeholder[data-mermaid-chart][data-mermaid-id], .mermaid-lazy-placeholder[data-mermaid-chart][data-mermaid-id]');
      
      const result = {
        beforeProcessing: {
          skillPlaceholders: skillPlaceholders.length,
          mermaidPlaceholders: mermaidPlaceholders.length,
          skillItems: document.querySelectorAll('[class*="skill"], .skill-item').length,
          mermaidCharts: document.querySelectorAll('[id*="mermaid"]').length
        },
        placeholderDetails: []
      };
      
      // 记录占位符详情
      skillPlaceholders.forEach((placeholder, index) => {
        result.placeholderDetails.push({
          type: 'skill',
          index,
          skillName: placeholder.getAttribute('data-skill-name'),
          skillLevel: placeholder.getAttribute('data-skill-level'),
          outerHTML: placeholder.outerHTML.substring(0, 200)
        });
      });
      
      mermaidPlaceholders.forEach((placeholder, index) => {
        result.placeholderDetails.push({
          type: 'mermaid',
          index,
          chartId: placeholder.getAttribute('data-mermaid-id'),
          chart: placeholder.getAttribute('data-mermaid-chart')?.substring(0, 100),
          outerHTML: placeholder.outerHTML.substring(0, 200)
        });
      });
      
      return result;
    });
    
    console.log('手动处理前状态:', JSON.stringify(manualProcessResult, null, 2));
    
    // 7. 等待一段时间后再次检查
    await page.waitForTimeout(3000);
    
    const finalState = await page.evaluate(() => {
      return {
        skillPlaceholders: document.querySelectorAll('.skill-placeholder').length,
        skillItems: document.querySelectorAll('[class*="skill"], .skill-item').length,
        mermaidPlaceholders: document.querySelectorAll('.mermaid-placeholder, .mermaid-lazy-placeholder').length,
        mermaidCharts: document.querySelectorAll('[id*="mermaid"]').length,
        hasSkillRendererContainers: document.querySelectorAll('[style*="display: contents"]').length
      };
    });
    
    console.log('最终状态:', JSON.stringify(finalState, null, 2));
    
    // 8. 截图保存
    await page.screenshot({ 
      path: 'tests/screenshots/skillrenderer-debug.png',
      fullPage: true 
    });
    
    console.log('✅ SkillRenderer调试完成，截图已保存');
    
    // 基本验证
    expect(pageInfo.url).toContain('/fullstack');
    expect(pageInfo.bodyText).toBeTruthy();
  });

  test('检查技能数据和占位符生成', async ({ page }) => {
    console.log('🔍 检查技能数据和占位符生成...');
    
    // 导航到页面
    await page.goto('http://localhost:5178/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 检查原始数据和HTML生成
    const dataInfo = await page.evaluate(() => {
      // 检查是否有技能相关的文本内容
      const bodyText = document.body.textContent || '';
      const hasSkillKeywords = [
        'TypeScript', 'JavaScript', 'React', 'Vue', 'Node.js', 
        'Python', 'Java', 'Docker', 'Kubernetes'
      ].some(keyword => bodyText.includes(keyword));
      
      // 检查HTML中是否包含技能占位符的生成模式
      const bodyHTML = document.body.innerHTML;
      const hasSkillPlaceholderPattern = bodyHTML.includes('skill-placeholder') || 
                                       bodyHTML.includes('data-skill-name') ||
                                       bodyHTML.includes('data-skill-level');
      
      // 检查是否有Markdown转换的痕迹
      const hasMarkdownContent = bodyHTML.includes('markdown-content') ||
                                bodyHTML.includes('SecureContentRenderer');
      
      return {
        hasSkillKeywords,
        hasSkillPlaceholderPattern,
        hasMarkdownContent,
        bodyTextLength: bodyText.length,
        bodyHTMLLength: bodyHTML.length,
        skillKeywordsFound: [
          'TypeScript', 'JavaScript', 'React', 'Vue', 'Node.js', 
          'Python', 'Java', 'Docker', 'Kubernetes'
        ].filter(keyword => bodyText.includes(keyword))
      };
    });
    
    console.log('数据检查结果:', JSON.stringify(dataInfo, null, 2));
    
    // 验证页面包含技能相关内容
    expect(dataInfo.hasSkillKeywords).toBe(true);
    expect(dataInfo.bodyTextLength).toBeGreaterThan(100);
    
    console.log('✅ 技能数据检查完成');
  });
});
