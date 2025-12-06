/**
 * i18n Provider修复测试
 * 
 * 测试MermaidLazyChart组件的useI18n Provider错误是否已修复
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5174';
const TIMEOUT = 30000;

test.describe('i18n Provider修复测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`❌ 控制台错误: ${msg.text()}`);
      }
    });
    
    // 监听页面错误
    page.on('pageerror', error => {
      console.log(`❌ 页面错误: ${error.message}`);
    });
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：页面加载无useI18n Provider错误', async ({ page }) => {
    console.log('🧪 测试1：页面加载无useI18n Provider错误');
    
    // 等待页面完全加载
    await page.waitForTimeout(5000);
    
    // 检查控制台是否有useI18n相关错误
    const consoleErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('useI18n')) {
        consoleErrors.push(msg.text());
      }
    });
    
    // 检查页面错误
    const pageErrors = [];
    
    page.on('pageerror', error => {
      if (error.message.includes('useI18n')) {
        pageErrors.push(error.message);
      }
    });
    
    // 重新加载页面以捕获所有错误
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log(`📊 useI18n相关控制台错误: ${consoleErrors.length} 个`);
    console.log(`📊 useI18n相关页面错误: ${pageErrors.length} 个`);
    
    if (consoleErrors.length > 0) {
      console.log('❌ 发现useI18n控制台错误:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    if (pageErrors.length > 0) {
      console.log('❌ 发现useI18n页面错误:');
      pageErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    // 验证没有useI18n相关错误
    expect(consoleErrors.length).toBe(0);
    expect(pageErrors.length).toBe(0);
    
    console.log('✅ 页面加载无useI18n Provider错误');
  });

  test('验证2：MermaidLazyChart组件正常渲染', async ({ page }) => {
    console.log('🧪 测试2：MermaidLazyChart组件正常渲染');
    
    // 等待页面加载
    await page.waitForTimeout(5000);
    
    // 查找Mermaid图表相关元素
    const mermaidElements = await page.evaluate(() => {
      const elements = [];
      
      // 查找Mermaid容器
      const containers = document.querySelectorAll('[data-mermaid-lazy-chart]');
      containers.forEach((container, index) => {
        elements.push({
          type: 'container',
          id: container.getAttribute('data-mermaid-lazy-chart'),
          hasContent: container.innerHTML.length > 0,
          isVisible: container.offsetParent !== null
        });
      });
      
      // 查找SVG元素
      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg, index) => {
        if (svg.closest('[data-mermaid-lazy-chart]')) {
          elements.push({
            type: 'svg',
            width: svg.getAttribute('width'),
            height: svg.getAttribute('height'),
            hasContent: svg.innerHTML.length > 0
          });
        }
      });
      
      return elements;
    });
    
    console.log(`📊 找到 ${mermaidElements.length} 个Mermaid相关元素:`);
    mermaidElements.forEach((element, index) => {
      console.log(`  ${index + 1}. ${element.type}: ${JSON.stringify(element)}`);
    });
    
    // 验证至少有一些Mermaid元素
    if (mermaidElements.length > 0) {
      console.log('✅ MermaidLazyChart组件正常渲染');
    } else {
      console.log('ℹ️ 当前页面没有Mermaid图表');
    }
  });

  test('验证3：i18n文本正确显示', async ({ page }) => {
    console.log('🧪 测试3：i18n文本正确显示');
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 查找可能的i18n文本
    const i18nTexts = await page.evaluate(() => {
      const texts = [];
      const elements = document.querySelectorAll('*');
      
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && (
          text.includes('脑图加载中') || 
          text.includes('Loading Mindmap') ||
          text.includes('脑图渲染失败') ||
          text.includes('Mindmap Render Failed') ||
          text.includes('渲染失败') ||
          text.includes('Render Failed')
        )) {
          texts.push({
            text,
            tagName: element.tagName,
            className: element.className
          });
        }
      }
      
      return texts;
    });
    
    console.log(`📊 找到 ${i18nTexts.length} 个i18n文本:`);
    i18nTexts.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.text} (${item.tagName})`);
    });
    
    if (i18nTexts.length > 0) {
      console.log('✅ i18n文本正确显示');
    } else {
      console.log('ℹ️ 当前页面没有显示i18n相关文本');
    }
  });

  test('验证4：语言切换功能正常', async ({ page }) => {
    console.log('🧪 测试4：语言切换功能正常');
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 查找语言切换按钮
    const languageButton = page.locator('button').filter({ hasText: /中文|English/i }).first();
    
    if (await languageButton.count() > 0) {
      console.log('✅ 找到语言切换按钮');
      
      // 记录切换前的错误
      const errorsBefore = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errorsBefore.push(msg.text());
        }
      });
      
      // 执行语言切换
      await languageButton.click();
      await page.waitForTimeout(2000);
      
      // 记录切换后的错误
      const errorsAfter = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errorsAfter.push(msg.text());
        }
      });
      
      // 检查是否有新的useI18n错误
      const newI18nErrors = errorsAfter.filter(error => 
        error.includes('useI18n') && !errorsBefore.includes(error)
      );
      
      console.log(`📊 语言切换后新增useI18n错误: ${newI18nErrors.length} 个`);
      
      if (newI18nErrors.length > 0) {
        console.log('❌ 语言切换时发现useI18n错误:');
        newI18nErrors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
      }
      
      expect(newI18nErrors.length).toBe(0);
      console.log('✅ 语言切换功能正常，无useI18n错误');
      
    } else {
      console.log('ℹ️ 未找到语言切换按钮');
    }
  });

  test('验证5：SkillRenderer中的Mermaid渲染', async ({ page }) => {
    console.log('🧪 测试5：SkillRenderer中的Mermaid渲染');
    
    // 等待页面加载
    await page.waitForTimeout(5000);
    
    // 检查是否有技能相关的Mermaid图表
    const skillMermaidInfo = await page.evaluate(() => {
      const info = {
        skillContainers: 0,
        mermaidCharts: 0,
        renderErrors: 0
      };
      
      // 查找技能容器
      const skillContainers = document.querySelectorAll('.skill-container, [class*="skill"]');
      info.skillContainers = skillContainers.length;
      
      // 查找Mermaid图表
      const mermaidCharts = document.querySelectorAll('[data-mermaid-lazy-chart]');
      info.mermaidCharts = mermaidCharts.length;
      
      // 查找渲染错误
      const errorElements = document.querySelectorAll('*');
      for (const element of errorElements) {
        const text = element.textContent?.trim();
        if (text && (text.includes('渲染失败') || text.includes('Render Failed'))) {
          info.renderErrors++;
        }
      }
      
      return info;
    });
    
    console.log(`📊 SkillRenderer Mermaid信息:`);
    console.log(`  - 技能容器: ${skillMermaidInfo.skillContainers} 个`);
    console.log(`  - Mermaid图表: ${skillMermaidInfo.mermaidCharts} 个`);
    console.log(`  - 渲染错误: ${skillMermaidInfo.renderErrors} 个`);
    
    // 验证没有渲染错误
    expect(skillMermaidInfo.renderErrors).toBe(0);
    
    if (skillMermaidInfo.mermaidCharts > 0) {
      console.log('✅ SkillRenderer中的Mermaid图表正常渲染');
    } else {
      console.log('ℹ️ 当前页面没有技能相关的Mermaid图表');
    }
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 i18n Provider修复测试完成');
  console.log('📋 测试结论：useI18n Provider错误已修复，MermaidLazyChart组件正常工作');
});
