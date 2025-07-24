/**
 * Timeline折叠展开测试
 * 
 * 专门测试Timeline组件的折叠展开功能
 */

import { test } from '@playwright/test';
import path from 'path';

test.describe('Timeline折叠展开测试', () => {
  test('查找并测试Timeline节点的折叠展开', async ({ page }) => {
    console.log('🧪 开始查找Timeline节点的折叠展开功能');
    
    // 访问fullstack页面
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('✅ 已访问fullstack页面');
    
    // 查找所有Timeline节点
    const timelineNodes = await page.locator('[class*="Node"]').all();
    console.log(`找到Timeline节点数量: ${timelineNodes.length}`);
    
    // 查找CategoryTitle元素
    const categoryTitles = await page.locator('[class*="CategoryTitle"]').all();
    console.log(`找到CategoryTitle数量: ${categoryTitles.length}`);
    
    if (categoryTitles.length > 0) {
      // 获取所有CategoryTitle的文本内容
      for (let i = 0; i < Math.min(categoryTitles.length, 5); i++) {
        const titleText = await categoryTitles[i].textContent();
        console.log(`CategoryTitle${i+1}: "${titleText}"`);
      }
      
      // 查找包含XCast的CategoryTitle
      const xcastTitle = page.locator('[class*="CategoryTitle"]').filter({ hasText: /XCast/ });
      const xcastTitleCount = await xcastTitle.count();
      console.log(`包含XCast的CategoryTitle数量: ${xcastTitleCount}`);
      
      if (xcastTitleCount > 0) {
        console.log('🎯 找到XCast的CategoryTitle，开始测试折叠展开');
        
        // 截图展开前状态
        await page.screenshot({
          path: path.join('tests', 'screenshots', 'skills-expanded-before.png'),
          fullPage: true
        });
        console.log('📸 展开前状态截图已保存');
        
        // 获取展开前的内容
        const beforeContent = await page.locator('text=XCast 配置生成协同工具').locator('xpath=ancestor::*[contains(@class, "Node")]').textContent();
        console.log(`展开前内容长度: ${beforeContent?.length || 0}`);
        
        // 点击CategoryTitle进行折叠
        await xcastTitle.first().click();
        await page.waitForTimeout(1000);
        console.log('✅ 已点击CategoryTitle进行折叠');
        
        // 截图折叠状态
        await page.screenshot({
          path: path.join('tests', 'screenshots', 'skills-collapsed.png'),
          fullPage: true
        });
        console.log('📸 折叠状态截图已保存');
        
        // 检查内容是否被折叠
        const collapsedContent = await page.locator('text=XCast 配置生成协同工具').locator('xpath=ancestor::*[contains(@class, "Node")]').textContent();
        console.log(`折叠后内容长度: ${collapsedContent?.length || 0}`);
        
        // 再次点击展开
        await xcastTitle.first().click();
        await page.waitForTimeout(1000);
        console.log('✅ 已点击CategoryTitle进行展开');
        
        // 截图展开后状态
        await page.screenshot({
          path: path.join('tests', 'screenshots', 'skills-expanded-after.png'),
          fullPage: true
        });
        console.log('📸 展开后状态截图已保存');
        
        // 检查展开后的内容
        const afterContent = await page.locator('text=XCast 配置生成协同工具').locator('xpath=ancestor::*[contains(@class, "Node")]').textContent();
        console.log(`展开后内容长度: ${afterContent?.length || 0}`);
        
        // 验证内容是否完整恢复
        if (beforeContent && afterContent) {
          const beforeLength = beforeContent.length;
          const afterLength = afterContent.length;
          
          console.log(`内容长度对比: 展开前=${beforeLength}, 展开后=${afterLength}`);
          
          if (afterLength < beforeLength * 0.8) {
            console.log('❌ 展开后内容丢失，存在渲染问题');
            console.log('需要修复SkillRenderer组件的重新渲染逻辑');
          } else {
            console.log('✅ 展开后内容完整，折叠展开功能正常');
          }
        }
        
        // 检查是否有技能标签
        const skillTags = await page.locator('span[id^="skill-"]').count();
        console.log(`当前页面技能标签数量: ${skillTags}`);
        
      } else {
        console.log('❌ 未找到包含XCast的CategoryTitle');
        
        // 查找所有包含XCast的元素
        const allXcastElements = await page.locator('*').filter({ hasText: /XCast/ }).allTextContents();
        console.log('所有包含XCast的元素:', allXcastElements);
      }
      
    } else {
      console.log('❌ 未找到任何CategoryTitle元素');
      
      // 查找所有可能的标题元素
      const allTitles = await page.locator('h1, h2, h3, h4, h5, h6, [class*="title"], [class*="Title"]').allTextContents();
      console.log('页面上的所有标题元素:', allTitles.slice(0, 10));
    }
    
    console.log('✅ Timeline折叠展开测试完成');
  });

  test('检查CollapseIcon的状态变化', async ({ page }) => {
    console.log('🧪 检查CollapseIcon的状态变化');
    
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 查找CollapseIcon
    const collapseIcons = await page.locator('[class*="IconWrapper"]').all();
    console.log(`找到CollapseIcon数量: ${collapseIcons.length}`);
    
    if (collapseIcons.length > 0) {
      // 检查第一个CollapseIcon的状态
      const firstIcon = collapseIcons[0];
      const iconContent = await firstIcon.innerHTML();
      console.log('第一个CollapseIcon内容:', iconContent);
      
      // 查找对应的CategoryTitle
      const parentTitle = firstIcon.locator('xpath=parent::*');
      const titleText = await parentTitle.textContent();
      console.log('对应的标题:', titleText);
      
      // 点击标题切换状态
      await parentTitle.click();
      await page.waitForTimeout(500);
      
      // 检查图标是否变化
      const newIconContent = await firstIcon.innerHTML();
      console.log('点击后CollapseIcon内容:', newIconContent);
      
      if (iconContent !== newIconContent) {
        console.log('✅ CollapseIcon状态正常切换');
      } else {
        console.log('❌ CollapseIcon状态未切换');
      }
    }
    
    console.log('✅ CollapseIcon状态检查完成');
  });

  test('验证SkillRenderer在折叠展开后的渲染', async ({ page }) => {
    console.log('🧪 验证SkillRenderer在折叠展开后的渲染');
    
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 查找包含技能标签的节点
    const skillElements = await page.locator('span[id^="skill-"]').all();
    console.log(`初始技能标签数量: ${skillElements.length}`);
    
    // 如果有技能标签，记录它们的ID
    const initialSkillIds = [];
    for (let i = 0; i < Math.min(skillElements.length, 5); i++) {
      const skillId = await skillElements[i].getAttribute('id');
      initialSkillIds.push(skillId);
    }
    console.log('初始技能标签ID:', initialSkillIds);
    
    // 查找并点击包含技能标签的节点的标题
    const categoryTitles = await page.locator('[class*="CategoryTitle"]').all();
    
    for (let i = 0; i < categoryTitles.length; i++) {
      const title = categoryTitles[i];
      const titleText = await title.textContent();
      
      // 检查这个标题下是否有技能标签
      const nodeContainer = title.locator('xpath=ancestor::*[contains(@class, "Node")]');
      const nodeSkillTags = await nodeContainer.locator('span[id^="skill-"]').count();
      
      if (nodeSkillTags > 0) {
        console.log(`找到包含${nodeSkillTags}个技能标签的节点: "${titleText}"`);
        
        // 折叠这个节点
        await title.click();
        await page.waitForTimeout(1000);
        
        // 检查技能标签是否被隐藏
        const collapsedSkillTags = await nodeContainer.locator('span[id^="skill-"]').count();
        console.log(`折叠后技能标签数量: ${collapsedSkillTags}`);
        
        // 展开这个节点
        await title.click();
        await page.waitForTimeout(1000);
        
        // 检查技能标签是否恢复
        const expandedSkillTags = await nodeContainer.locator('span[id^="skill-"]').count();
        console.log(`展开后技能标签数量: ${expandedSkillTags}`);
        
        if (expandedSkillTags < nodeSkillTags) {
          console.log('❌ 展开后技能标签数量减少，存在渲染问题');
        } else {
          console.log('✅ 展开后技能标签数量正常');
        }
        
        break; // 只测试第一个包含技能标签的节点
      }
    }
    
    console.log('✅ SkillRenderer渲染验证完成');
  });
});
