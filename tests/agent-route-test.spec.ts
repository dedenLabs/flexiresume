/**
 * Agent页面路由访问测试
 * 
 * 验证agent页面可以通过URL直接访问，但不显示在tab标签中
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('Agent页面路由访问测试', () => {
  
  test('agent页面应该可以通过URL直接访问', async ({ page }) => {
    // 直接访问agent页面
    await page.goto(`${BASE_URL}/agent`);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 验证页面内容加载正确
    const content = await page.textContent('body');
    expect(content).toContain('AI Agent'); // 应该包含相关内容
    
    // 验证页面标题
    const title = await page.title();
    expect(title).toContain('AI Agent'); // 标题应该包含AI Agent
    
    console.log('✅ Agent页面可以通过URL直接访问');
  });

  test('agent页面不应该显示在tab标签中', async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 检查导航标签
    const tabs = await page.locator('[data-testid="navigation-tabs"] a').all();
    
    // 获取所有标签的文本
    const tabTexts = await Promise.all(tabs.map(tab => tab.textContent()));
    
    // 验证不包含AI Agent相关的标签
    const hasAgentTab = tabTexts.some(text => 
      text && (text.includes('AI Agent') || text.includes('agent'))
    );
    
    expect(hasAgentTab).toBe(false);
    
    console.log('✅ Agent页面不显示在tab标签中');
    console.log('当前标签:', tabTexts);
  });

  test('从其他页面可以导航到agent页面', async ({ page }) => {
    // 先访问首页
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 直接导航到agent页面
    await page.goto(`${BASE_URL}/agent`);
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    
    // 验证URL正确
    expect(page.url()).toContain('/agent');
    
    // 验证页面内容
    const content = await page.textContent('body');
    expect(content).toContain('AI Agent');
    
    console.log('✅ 可以从其他页面导航到agent页面');
  });

  test('agent.html后缀也应该可以访问', async ({ page }) => {
    // 访问带.html后缀的agent页面
    await page.goto(`${BASE_URL}/agent.html`);
    
    // 应该重定向到无后缀版本
    await page.waitForURL(`${BASE_URL}/agent`);
    
    // 验证页面内容
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: 10000 });
    const content = await page.textContent('body');
    expect(content).toContain('AI Agent');
    
    console.log('✅ agent.html后缀可以正确重定向');
  });

});
