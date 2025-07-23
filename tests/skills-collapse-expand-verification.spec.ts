/**
 * 技能标签折叠展开验证测试
 * 
 * 验证技能标签在折叠后再展开时是否正常显示
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('技能标签折叠展开验证', () => {
  test('验证XCast技能标签折叠展开功能', async ({ page }) => {
    console.log('🧪 开始验证XCast技能标签折叠展开功能');
    
    // 访问fullstack页面
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('✅ 已访问fullstack页面');
    
    // 查找包含"XCast"文本的元素
    const xcastElements = await page.locator('*').filter({ hasText: /XCast/ }).allTextContents();
    console.log('包含XCast的元素:', xcastElements);
    
    // 查找包含"配置生成协同工具"的元素
    const configElements = await page.locator('*').filter({ hasText: /配置生成协同工具/ }).allTextContents();
    console.log('包含配置生成协同工具的元素:', configElements);
    
    // 查找包含"XCast 配置生成协同工具"的完整文本
    const xcastConfigElement = page.locator('*').filter({ hasText: /XCast.*配置生成协同工具/ });
    const xcastConfigCount = await xcastConfigElement.count();
    console.log(`找到XCast配置生成协同工具元素数量: ${xcastConfigCount}`);
    
    if (xcastConfigCount > 0) {
      // 找到目标元素，查找其父级容器
      const targetElement = xcastConfigElement.first();
      
      // 截图展开状态（步骤3）
      await page.screenshot({
        path: path.join('tests', 'screenshots', 'skills-expanded-before.png'),
        fullPage: true
      });
      console.log('📸 技能展开前状态截图已保存');
      
      // 查找Timeline节点的CategoryTitle（可点击的标题）
      const timelineNode = targetElement.locator('xpath=ancestor::*[contains(@class, "Node")]').first();
      const categoryTitle = timelineNode.locator('[class*="CategoryTitle"], [class*="category-title"]').first();

      // 如果没找到CategoryTitle，尝试查找包含XCast的可点击标题
      const collapseButton = categoryTitle.count() > 0 ? categoryTitle :
        page.locator('*').filter({ hasText: /XCast/ }).locator('xpath=ancestor::*[contains(@class, "Node")]//div[contains(@class, "CategoryTitle")]').first();
      
      const buttonCount = await collapseButton.count();
      console.log(`找到CategoryTitle数量: ${buttonCount}`);

      // 如果还是没找到，尝试直接查找包含XCast的Timeline节点标题
      if (buttonCount === 0) {
        const directTitle = page.locator('*').filter({ hasText: /XCast.*配置生成协同工具/ }).locator('xpath=preceding-sibling::*[1] | parent::*/preceding-sibling::*[1]').first();
        const directTitleCount = await directTitle.count();
        console.log(`直接查找标题数量: ${directTitleCount}`);

        if (directTitleCount > 0) {
          const collapseButton = directTitle;
        }
      }
      
      if (buttonCount > 0) {
        // 点击折叠按钮（步骤4）
        await collapseButton.click();
        await page.waitForTimeout(1000);
        
        // 截图折叠状态（步骤5）
        await page.screenshot({
          path: path.join('tests', 'screenshots', 'skills-collapsed.png'),
          fullPage: true
        });
        console.log('📸 技能折叠状态截图已保存');
        
        // 再次点击展开按钮（步骤6）
        await collapseButton.click();
        await page.waitForTimeout(1000);
        
        // 截图重新展开状态（步骤7）
        await page.screenshot({
          path: path.join('tests', 'screenshots', 'skills-expanded-after.png'),
          fullPage: true
        });
        console.log('📸 技能重新展开后状态截图已保存');
        
        // 验证内容是否完整显示（步骤8）
        const afterExpandElements = await page.locator('*').filter({ hasText: /XCast.*配置生成协同工具/ }).count();
        console.log(`重新展开后XCast元素数量: ${afterExpandElements}`);
        
        if (afterExpandElements === 0) {
          console.log('❌ 重新展开后XCast内容丢失');
          console.log('技能标签折叠展开功能存在问题');
        } else {
          console.log('✅ 重新展开后XCast内容正常显示');
        }
        
      } else {
        console.log('❌ 未找到折叠按钮，尝试查找其他可能的交互元素');
        
        // 查找所有可能的交互元素
        const allButtons = await page.locator('button').allTextContents();
        console.log('页面上的所有按钮:', allButtons);
        
        const allClickable = await page.locator('[role="button"], .clickable, .toggle').allTextContents();
        console.log('页面上的所有可点击元素:', allClickable);
      }
      
    } else {
      console.log('❌ 未找到XCast配置生成协同工具相关内容');
      
      // 查找所有技能相关的内容
      const allSkillElements = await page.locator('*').filter({ hasText: /技能|skill|项目|project/ }).allTextContents();
      console.log('页面上的技能相关内容:', allSkillElements.slice(0, 10)); // 只显示前10个
    }
    
    console.log('✅ XCast技能标签折叠展开验证完成');
  });

  test('查找页面上的所有折叠展开元素', async ({ page }) => {
    console.log('🔍 查找页面上的所有折叠展开元素');
    
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 查找所有可能的折叠展开元素
    const collapsibleElements = await page.locator('[class*="collaps"], [class*="expand"], [class*="toggle"], [class*="fold"]').allTextContents();
    console.log('可折叠元素:', collapsibleElements);
    
    // 查找所有按钮
    const buttons = await page.locator('button').all();
    console.log(`页面按钮数量: ${buttons.length}`);
    
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const buttonText = await buttons[i].textContent();
      const buttonClass = await buttons[i].getAttribute('class');
      console.log(`按钮${i+1}: "${buttonText}" - 类名: ${buttonClass}`);
    }
    
    // 查找包含箭头或展开符号的元素
    const arrowElements = await page.locator('*').filter({ hasText: /▼|▲|▶|◀|⬇|⬆|➤|➜|›|‹/ }).allTextContents();
    console.log('包含箭头符号的元素:', arrowElements);
    
    // 截图整个页面用于分析
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'fullstack-page-analysis.png'),
      fullPage: true
    });
    console.log('📸 fullstack页面分析截图已保存');
    
    console.log('✅ 页面元素分析完成');
  });

  test('测试SkillRenderer组件的渲染', async ({ page }) => {
    console.log('🧪 测试SkillRenderer组件的渲染');
    
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 查找SkillRenderer相关的元素
    const skillRendererElements = await page.locator('[class*="skill"], [class*="Skill"]').all();
    console.log(`找到技能相关元素数量: ${skillRendererElements.length}`);
    
    // 检查是否有Mermaid图表
    const mermaidElements = await page.locator('.mermaid, [class*="mermaid"]').all();
    console.log(`找到Mermaid元素数量: ${mermaidElements.length}`);
    
    if (mermaidElements.length > 0) {
      console.log('发现Mermaid图表，检查其渲染状态');
      
      for (let i = 0; i < Math.min(mermaidElements.length, 3); i++) {
        const mermaidContent = await mermaidElements[i].textContent();
        const mermaidClass = await mermaidElements[i].getAttribute('class');
        console.log(`Mermaid${i+1}: 类名=${mermaidClass}, 内容长度=${mermaidContent?.length || 0}`);
      }
    }
    
    // 检查控制台错误
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (consoleMessages.length > 0) {
      console.log('控制台错误信息:', consoleMessages);
    } else {
      console.log('✅ 无控制台错误');
    }
    
    console.log('✅ SkillRenderer组件渲染测试完成');
  });
});
