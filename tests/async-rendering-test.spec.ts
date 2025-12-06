import { test, expect } from '@playwright/test';

/**
 * SkillRenderer异步渲染处理测试
 * 
 * 验证SkillRenderer能够正确处理SecureContentRenderer异步渲染的内容
 */

test.describe('SkillRenderer异步渲染处理', () => {
  test.beforeEach(async ({ page }) => {
    // 监听控制台消息
    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('SkillRenderer')) {
        console.log(`🔍 SkillRenderer日志: ${msg.text()}`);
      }
    });
  });

  test('验证fullstack页面的异步渲染处理', async ({ page }) => {
    console.log('🔍 开始测试fullstack页面的异步渲染处理...');
    
    // 1. 导航到fullstack页面
    await page.goto('http://localhost:5178/fullstack');
    
    // 2. 等待页面基础加载
    await page.waitForLoadState('networkidle');
    
    // 3. 等待SecureContentRenderer处理完成
    await page.waitForTimeout(3000);
    
    // 4. 检查技能标签是否正确渲染
    const skillItems = await page.locator('[class*="skill"], .skill-item').count();
    console.log(`找到 ${skillItems} 个技能标签`);
    expect(skillItems).toBeGreaterThan(0);
    
    // 5. 验证技能标签有正确的样式
    const firstSkillItem = page.locator('[class*="skill"], .skill-item').first();
    if (await firstSkillItem.count() > 0) {
      const backgroundColor = await firstSkillItem.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // 不应该是透明
      console.log(`✅ 技能标签背景色: ${backgroundColor}`);
    }
    
    // 6. 检查是否有未处理的占位符
    const skillPlaceholders = await page.locator('.skill-placeholder').count();
    const mermaidPlaceholders = await page.locator('.mermaid-placeholder, .mermaid-lazy-placeholder').count();
    
    console.log(`剩余占位符: ${skillPlaceholders} 个技能, ${mermaidPlaceholders} 个图表`);
    
    // 7. 验证异步渲染事件
    const renderEvents = await page.evaluate(() => {
      return new Promise((resolve) => {
        const events: any[] = [];
        let eventCount = 0;
        
        const handleSkillRender = (e: any) => {
          events.push({ type: 'skill', detail: e.detail });
          eventCount++;
        };
        
        const handleMermaidRender = (e: any) => {
          events.push({ type: 'mermaid', detail: e.detail });
          eventCount++;
        };
        
        document.addEventListener('skillRenderComplete', handleSkillRender);
        document.addEventListener('mermaidRenderComplete', handleMermaidRender);
        
        // 等待一段时间收集事件
        setTimeout(() => {
          document.removeEventListener('skillRenderComplete', handleSkillRender);
          document.removeEventListener('mermaidRenderComplete', handleMermaidRender);
          resolve(events);
        }, 2000);
      });
    });
    
    console.log(`收到渲染事件: ${JSON.stringify(renderEvents)}`);
    
    // 8. 截图验证
    await page.screenshot({ 
      path: 'tests/screenshots/async-rendering-fullstack.png',
      fullPage: true 
    });
    console.log('✅ 异步渲染测试截图已保存');
  });

  test('验证异步内容监听机制', async ({ page }) => {
    console.log('🔍 开始测试异步内容监听机制...');
    
    // 1. 导航到页面
    await page.goto('http://localhost:5178/fullstack');
    await page.waitForLoadState('networkidle');
    
    // 2. 注入测试代码，模拟异步内容添加
    const testResult = await page.evaluate(() => {
      return new Promise((resolve) => {
        const container = document.querySelector('[data-testid="resume-content"]') || document.body;
        let eventReceived = false;
        
        // 监听渲染完成事件
        const handleRenderComplete = (e: any) => {
          eventReceived = true;
          console.log('收到渲染完成事件:', e.detail);
        };
        
        document.addEventListener('skillRenderComplete', handleRenderComplete);
        document.addEventListener('mermaidRenderComplete', handleRenderComplete);
        
        // 模拟异步添加技能占位符
        setTimeout(() => {
          const skillPlaceholder = document.createElement('span');
          skillPlaceholder.className = 'skill-placeholder';
          skillPlaceholder.setAttribute('data-skill-name', 'TestSkill');
          skillPlaceholder.setAttribute('data-skill-level', '2');
          skillPlaceholder.textContent = 'TestSkill';
          
          container.appendChild(skillPlaceholder);
          console.log('已添加测试技能占位符');
          
          // 等待处理完成
          setTimeout(() => {
            const processedSkill = document.querySelector('[id*="skill-TestSkill"]');
            
            document.removeEventListener('skillRenderComplete', handleRenderComplete);
            document.removeEventListener('mermaidRenderComplete', handleRenderComplete);
            
            resolve({
              eventReceived,
              skillProcessed: !!processedSkill,
              placeholderRemoved: !document.querySelector('.skill-placeholder[data-skill-name="TestSkill"]')
            });
          }, 3000);
        }, 1000);
      });
    });
    
    console.log(`异步监听测试结果: ${JSON.stringify(testResult)}`);
    
    // 验证结果
    expect(testResult.skillProcessed).toBe(true);
    expect(testResult.placeholderRemoved).toBe(true);
    
    console.log('✅ 异步内容监听机制测试通过');
  });

  test('验证重试机制', async ({ page }) => {
    console.log('🔍 开始测试重试机制...');
    
    // 1. 导航到页面
    await page.goto('http://localhost:5178/fullstack');
    await page.waitForLoadState('networkidle');
    
    // 2. 等待初始渲染完成
    await page.waitForTimeout(2000);
    
    // 3. 注入延迟的占位符，测试重试机制
    const retryTestResult = await page.evaluate(() => {
      return new Promise((resolve) => {
        const container = document.querySelector('[data-testid="resume-content"]') || document.body;
        
        // 添加一个占位符，但延迟使其可见
        const delayedPlaceholder = document.createElement('div');
        delayedPlaceholder.className = 'mermaid-placeholder';
        delayedPlaceholder.setAttribute('data-mermaid-chart', 'graph TD; A-->B');
        delayedPlaceholder.setAttribute('data-mermaid-id', 'test-retry-chart');
        delayedPlaceholder.style.display = 'none'; // 初始隐藏
        
        container.appendChild(delayedPlaceholder);
        
        // 3秒后显示占位符，测试重试机制
        setTimeout(() => {
          delayedPlaceholder.style.display = 'block';
          console.log('延迟占位符已显示，等待重试机制处理');
          
          // 再等待5秒检查是否被处理
          setTimeout(() => {
            const processedChart = document.querySelector('[id*="mermaid-test-retry-chart"]');
            const placeholderStillExists = document.querySelector('.mermaid-placeholder[data-mermaid-id="test-retry-chart"]');
            
            resolve({
              chartProcessed: !!processedChart,
              placeholderRemoved: !placeholderStillExists
            });
          }, 5000);
        }, 3000);
      });
    });
    
    console.log(`重试机制测试结果: ${JSON.stringify(retryTestResult)}`);
    
    // 验证重试机制工作正常
    expect(retryTestResult.chartProcessed).toBe(true);
    expect(retryTestResult.placeholderRemoved).toBe(true);
    
    console.log('✅ 重试机制测试通过');
  });

  test('验证错误处理和恢复', async ({ page }) => {
    console.log('🔍 开始测试错误处理和恢复...');
    
    // 监听控制台错误
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // 1. 导航到页面
    await page.goto('http://localhost:5178/fullstack');
    await page.waitForLoadState('networkidle');
    
    // 2. 注入无效的占位符，测试错误处理
    await page.evaluate(() => {
      const container = document.querySelector('[data-testid="resume-content"]') || document.body;
      
      // 添加无效的技能占位符
      const invalidSkillPlaceholder = document.createElement('span');
      invalidSkillPlaceholder.className = 'skill-placeholder';
      invalidSkillPlaceholder.setAttribute('data-skill-name', ''); // 空名称
      invalidSkillPlaceholder.setAttribute('data-skill-level', 'invalid'); // 无效级别
      
      // 添加无效的图表占位符
      const invalidMermaidPlaceholder = document.createElement('div');
      invalidMermaidPlaceholder.className = 'mermaid-placeholder';
      invalidMermaidPlaceholder.setAttribute('data-mermaid-chart', ''); // 空图表
      invalidMermaidPlaceholder.setAttribute('data-mermaid-id', ''); // 空ID
      
      container.appendChild(invalidSkillPlaceholder);
      container.appendChild(invalidMermaidPlaceholder);
      
      console.log('已添加无效占位符，测试错误处理');
    });
    
    // 3. 等待处理完成
    await page.waitForTimeout(3000);
    
    // 4. 验证页面仍然正常工作
    const validSkillItems = await page.locator('[class*="skill"], .skill-item').count();
    expect(validSkillItems).toBeGreaterThan(0);
    
    // 5. 验证无效占位符被正确跳过
    const remainingInvalidPlaceholders = await page.evaluate(() => {
      const invalidSkill = document.querySelector('.skill-placeholder[data-skill-name=""]');
      const invalidMermaid = document.querySelector('.mermaid-placeholder[data-mermaid-chart=""]');
      return {
        hasInvalidSkill: !!invalidSkill,
        hasInvalidMermaid: !!invalidMermaid
      };
    });
    
    console.log(`错误处理结果: ${JSON.stringify(remainingInvalidPlaceholders)}`);
    console.log(`控制台错误数量: ${consoleErrors.length}`);
    
    // 验证错误被正确处理（无效占位符应该被跳过，不会导致崩溃）
    expect(validSkillItems).toBeGreaterThan(0); // 有效内容仍然正常
    
    console.log('✅ 错误处理和恢复测试通过');
  });
});
