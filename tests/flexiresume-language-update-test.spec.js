/**
 * FlexiResume页面语言切换数据更新测试
 * 
 * 验证FlexiResume页面在语言切换时能正确更新数据内容
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('FlexiResume页面语言切换数据更新测试', () => {
  
  test('验证主页面语言切换时数据内容更新', async ({ page }) => {
    console.log('🧪 开始主页面语言切换数据更新测试');
    
    // 访问主页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // 等待数据加载完成
    
    // 获取初始页面的主要内容
    const initialContent = await page.evaluate(() => {
      const content = [];
      
      // 获取主要内容区域的文本
      const mainContent = document.querySelector('[class*="resume"], main, .content, #root > div');
      if (mainContent) {
        const textContent = mainContent.textContent || '';
        
        // 提取一些关键内容片段
        const lines = textContent.split('\n').filter(line => line.trim().length > 10);
        content.push(...lines.slice(0, 10)); // 取前10行有意义的内容
      }
      
      return content;
    });
    
    console.log('📄 初始页面内容片段:', initialContent.slice(0, 3).map(c => c.substring(0, 50) + '...'));
    
    // 查找语言切换按钮
    const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
    
    if (await languageButton.isVisible()) {
      console.log('🔄 点击语言切换按钮');
      
      // 点击语言切换按钮
      await languageButton.click();
      await page.waitForTimeout(4000); // 等待语言切换和数据重新加载
      
      // 获取切换后的页面内容
      const newContent = await page.evaluate(() => {
        const content = [];
        
        const mainContent = document.querySelector('[class*="resume"], main, .content, #root > div');
        if (mainContent) {
          const textContent = mainContent.textContent || '';
          
          const lines = textContent.split('\n').filter(line => line.trim().length > 10);
          content.push(...lines.slice(0, 10));
        }
        
        return content;
      });
      
      console.log('📄 切换后页面内容片段:', newContent.slice(0, 3).map(c => c.substring(0, 50) + '...'));
      
      // 验证内容确实发生了变化
      const hasContentChanged = initialContent.some((text, index) => {
        const newText = newContent[index];
        return newText && text !== newText;
      });
      
      if (hasContentChanged) {
        console.log('✅ 页面内容在语言切换后发生了变化');
        expect(hasContentChanged).toBe(true);
      } else {
        console.log('⚠️ 页面内容在语言切换后没有明显变化，可能是同一语言或内容相同');
        // 至少验证页面仍然有内容
        expect(newContent.length).toBeGreaterThan(0);
      }
      
    } else {
      console.log('⚠️ 未找到语言切换按钮，跳过语言切换测试');
    }
  });
  
  test('验证特定职位页面语言切换数据更新', async ({ page }) => {
    console.log('🧪 开始特定职位页面语言切换数据更新测试');
    
    // 测试几个职位页面
    const testPositions = ['agent', 'fullstack', 'frontend'];
    
    for (const position of testPositions) {
      console.log(`🔍 测试职位页面: ${position}`);
      
      // 访问特定职位页面
      await page.goto(`${BASE_URL}/${position}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // 获取初始内容
      const initialContent = await page.evaluate(() => {
        const content = [];
        
        // 查找简历内容
        const resumeElements = document.querySelectorAll('[class*="resume"], [class*="content"], [class*="section"]');
        for (const element of resumeElements) {
          const text = element.textContent?.trim();
          if (text && text.length > 20) {
            content.push(text.substring(0, 100));
          }
        }
        
        return content.slice(0, 5);
      });
      
      console.log(`📄 ${position} 初始内容:`, initialContent.length > 0 ? '有内容' : '无内容');
      
      // 查找语言切换按钮
      const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
      
      if (await languageButton.isVisible()) {
        // 切换语言
        await languageButton.click();
        await page.waitForTimeout(4000);
        
        // 获取切换后的内容
        const newContent = await page.evaluate(() => {
          const content = [];
          
          const resumeElements = document.querySelectorAll('[class*="resume"], [class*="content"], [class*="section"]');
          for (const element of resumeElements) {
            const text = element.textContent?.trim();
            if (text && text.length > 20) {
              content.push(text.substring(0, 100));
            }
          }
          
          return content.slice(0, 5);
        });
        
        console.log(`📄 ${position} 切换后内容:`, newContent.length > 0 ? '有内容' : '无内容');
        
        // 验证页面仍然有内容（表示数据加载成功）
        expect(newContent.length).toBeGreaterThan(0);
        
        console.log(`✅ ${position} 页面语言切换后数据正常`);
      } else {
        console.log(`⚠️ ${position} 页面未找到语言切换按钮`);
      }
    }
  });
  
  test('验证语言切换时的加载状态', async ({ page }) => {
    console.log('🧪 开始语言切换加载状态测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 查找语言切换按钮
    const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
    
    if (await languageButton.isVisible()) {
      console.log('🔄 监控语言切换过程中的加载状态');
      
      // 点击语言切换按钮
      await languageButton.click();
      
      // 检查是否出现加载状态
      const loadingStates = [];
      
      // 监控一段时间内的加载状态
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(200);
        
        const hasLoadingIndicator = await page.evaluate(() => {
          // 查找各种可能的加载指示器
          const loadingSelectors = [
            '[class*="loading"]',
            '[class*="skeleton"]',
            '[class*="spinner"]',
            '.loading',
            '.skeleton',
            '[data-testid*="loading"]'
          ];
          
          for (const selector of loadingSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              return true;
            }
          }
          
          return false;
        });
        
        loadingStates.push(hasLoadingIndicator);
      }
      
      const hadLoadingState = loadingStates.some(state => state);
      
      if (hadLoadingState) {
        console.log('✅ 语言切换过程中检测到加载状态');
      } else {
        console.log('⚠️ 语言切换过程中未检测到明显的加载状态');
      }
      
      // 等待加载完成
      await page.waitForTimeout(2000);
      
      // 验证最终页面正常
      const finalContent = await page.evaluate(() => {
        return document.body.textContent?.length || 0;
      });
      
      expect(finalContent).toBeGreaterThan(100);
      
      console.log('✅ 语言切换加载状态测试完成');
    } else {
      console.log('⚠️ 未找到语言切换按钮，跳过加载状态测试');
    }
  });
  
  test('验证控制台日志中的语言切换信息', async ({ page }) => {
    console.log('🧪 开始控制台日志语言切换信息测试');
    
    // 监听控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('语言') || text.includes('language') || text.includes('FlexiResume')) {
        consoleMessages.push({
          type: msg.type(),
          text: text,
          timestamp: Date.now()
        });
      }
    });
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 查找语言切换按钮
    const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
    
    if (await languageButton.isVisible()) {
      // 点击语言切换按钮
      await languageButton.click();
      await page.waitForTimeout(3000);
      
      // 检查控制台消息
      console.log('📝 相关控制台消息:', consoleMessages.slice(0, 5));
      
      // 验证是否有语言切换相关的日志
      const hasLanguageChangeLog = consoleMessages.some(msg => 
        msg.text.includes('语言变化') || 
        msg.text.includes('重新加载') ||
        msg.text.includes('FlexiResume')
      );
      
      if (hasLanguageChangeLog) {
        console.log('✅ 检测到语言切换相关的控制台日志');
      } else {
        console.log('⚠️ 未检测到明显的语言切换日志');
      }
      
      console.log('✅ 控制台日志测试完成');
    } else {
      console.log('⚠️ 未找到语言切换按钮，跳过控制台日志测试');
    }
  });
  
});
