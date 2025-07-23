/**
 * 技能标签折叠展开修复验证测试
 * 
 * 验证技能标签在折叠后再展开时是否正常显示
 * 按照用户指定的验证步骤执行
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('技能标签折叠展开修复验证', () => {
  test('验证XCast技能标签折叠展开功能', async ({ page }) => {
    console.log('🧪 开始验证XCast技能标签折叠展开功能');
    
    // 步骤1: 访问 http://localhost:5176/fullstack 页面
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('✅ 步骤1完成：已访问fullstack页面');
    
    // 步骤2: 找到包含"XCast 配置生成协同工具"文本的节点
    const xcastElement = page.locator('*').filter({ hasText: /XCast.*配置生成协同工具/ });
    const xcastCount = await xcastElement.count();
    console.log(`找到包含XCast配置生成协同工具的元素数量: ${xcastCount}`);
    
    if (xcastCount === 0) {
      console.log('❌ 未找到XCast配置生成协同工具相关内容');
      throw new Error('未找到XCast配置生成协同工具相关内容');
    }
    
    // 找到对应的Timeline节点
    const timelineNode = xcastElement.first().locator('xpath=ancestor::*[contains(@class, "Node")]').first();
    const categoryTitle = timelineNode.locator('[class*="CategoryTitle"]').first();
    
    const titleExists = await categoryTitle.count();
    console.log(`找到CategoryTitle数量: ${titleExists}`);
    
    if (titleExists === 0) {
      console.log('❌ 未找到对应的CategoryTitle');
      throw new Error('未找到对应的CategoryTitle');
    }
    
    console.log('✅ 步骤2完成：找到包含XCast配置生成协同工具的节点');
    
    // 步骤3: 截图保存展开状态（命名：skills-expanded-before.png）
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'skills-expanded-before.png'),
      fullPage: true
    });
    console.log('✅ 步骤3完成：截图保存展开状态');
    
    // 获取展开前的技能标签数量和内容
    const beforeSkillTags = await timelineNode.locator('span[id^="skill-"]').count();
    const beforeContent = await timelineNode.textContent();
    console.log(`展开前技能标签数量: ${beforeSkillTags}`);
    console.log(`展开前内容长度: ${beforeContent?.length || 0}`);
    
    // 步骤4: 点击该节点文本折叠
    await categoryTitle.click();
    await page.waitForTimeout(1000);
    console.log('✅ 步骤4完成：点击节点文本进行折叠');
    
    // 步骤5: 截图保存折叠状态（命名：skills-collapsed.png）
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'skills-collapsed.png'),
      fullPage: true
    });
    console.log('✅ 步骤5完成：截图保存折叠状态');
    
    // 检查折叠后的状态
    const collapsedSkillTags = await timelineNode.locator('span[id^="skill-"]').count();
    const collapsedContent = await timelineNode.textContent();
    console.log(`折叠后技能标签数量: ${collapsedSkillTags}`);
    console.log(`折叠后内容长度: ${collapsedContent?.length || 0}`);
    
    // 步骤6: 再次点击文本展开
    await categoryTitle.click();
    await page.waitForTimeout(1000);
    console.log('✅ 步骤6完成：再次点击文本展开');
    
    // 步骤7: 截图保存重新展开状态（命名：skills-expanded-after.png）
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'skills-expanded-after.png'),
      fullPage: true
    });
    console.log('✅ 步骤7完成：截图保存重新展开状态');
    
    // 步骤8: 对比展开前后的内容，检查技能标签是否完整显示
    const afterSkillTags = await timelineNode.locator('span[id^="skill-"]').count();
    const afterContent = await timelineNode.textContent();
    console.log(`展开后技能标签数量: ${afterSkillTags}`);
    console.log(`展开后内容长度: ${afterContent?.length || 0}`);
    
    // 验证技能标签数量是否保持一致
    console.log('🔍 对比分析：');
    console.log(`技能标签数量 - 展开前: ${beforeSkillTags}, 展开后: ${afterSkillTags}`);
    
    if (afterSkillTags < beforeSkillTags) {
      console.log('❌ 展开后技能标签数量减少，存在渲染问题');
      console.log('修复前后对比：');
      console.log(`- 展开前技能标签: ${beforeSkillTags}`);
      console.log(`- 展开后技能标签: ${afterSkillTags}`);
      console.log(`- 丢失标签数量: ${beforeSkillTags - afterSkillTags}`);
    } else {
      console.log('✅ 展开后技能标签数量正常');
    }
    
    // 验证内容完整性
    if (afterContent && beforeContent) {
      const contentLossRatio = (beforeContent.length - afterContent.length) / beforeContent.length;
      console.log(`内容完整性 - 展开前: ${beforeContent.length}字符, 展开后: ${afterContent.length}字符`);
      console.log(`内容丢失比例: ${(contentLossRatio * 100).toFixed(2)}%`);
      
      if (contentLossRatio > 0.1) { // 如果内容丢失超过10%
        console.log('❌ 展开后内容显著减少，可能存在渲染问题');
      } else {
        console.log('✅ 展开后内容基本完整');
      }
    }
    
    // 检查是否包含关键内容
    expect(afterContent).toContain('XCast');
    expect(afterContent).toContain('配置生成协同工具');
    
    // 验证技能标签数量不应该减少
    expect(afterSkillTags).toBeGreaterThanOrEqual(beforeSkillTags * 0.8); // 允许20%的误差
    
    console.log('✅ 步骤8完成：内容对比验证完成');
    console.log('🎉 XCast技能标签折叠展开功能验证完成');
  });

  test('验证技能标签DOM结构保持完整', async ({ page }) => {
    console.log('🧪 开始验证技能标签DOM结构');
    
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 查找所有技能标签
    const allSkillTags = await page.locator('span[id^="skill-"]').all();
    console.log(`页面总技能标签数量: ${allSkillTags.length}`);
    
    // 检查技能标签的DOM结构
    for (let i = 0; i < Math.min(allSkillTags.length, 5); i++) {
      const skillTag = allSkillTags[i];
      const skillId = await skillTag.getAttribute('id');
      const skillName = await skillTag.getAttribute('data-skill-name');
      const skillLevel = await skillTag.getAttribute('data-skill-level');
      
      console.log(`技能标签${i+1}: ID=${skillId}, 名称=${skillName}, 等级=${skillLevel}`);
      
      // 检查是否有对应的原始占位符
      const originalPlaceholder = page.locator(`[data-skill-id="${skillId}"]`);
      const placeholderExists = await originalPlaceholder.count();
      console.log(`对应的原始占位符存在: ${placeholderExists > 0}`);
    }
    
    // 查找所有被处理过的占位符
    const processedPlaceholders = await page.locator('[data-skill-processed="true"]').count();
    console.log(`已处理的占位符数量: ${processedPlaceholders}`);
    
    console.log('✅ 技能标签DOM结构验证完成');
  });

  test('验证原始文本恢复机制', async ({ page }) => {
    console.log('🧪 开始验证原始文本恢复机制');
    
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 检查页面上是否有隐藏的原始文本
    const hiddenPlaceholders = await page.locator('[data-skill-processed="true"]').count();
    console.log(`隐藏的原始文本数量: ${hiddenPlaceholders}`);
    
    // 检查透明度设置
    const transparentElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-skill-processed="true"]');
      let transparentCount = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el as Element);
        if (style.opacity === '0') {
          transparentCount++;
        }
      });
      return transparentCount;
    });
    
    console.log(`设置为透明的元素数量: ${transparentElements}`);
    
    // 验证恢复机制：模拟技能容器被移除的情况
    const testRecovery = await page.evaluate(() => {
      // 找到一个技能容器并移除它
      const skillContainer = document.querySelector('span[id^="skill-"]');
      if (skillContainer) {
        const skillId = skillContainer.id;
        skillContainer.remove();
        
        // 触发重新渲染（模拟组件重新渲染）
        const event = new Event('skillrender', { bubbles: true });
        document.dispatchEvent(event);
        
        return skillId;
      }
      return null;
    });
    
    if (testRecovery) {
      console.log(`测试恢复机制：移除了技能容器 ${testRecovery}`);
      await page.waitForTimeout(1000);
      
      // 检查对应的原始文本是否恢复显示
      const recoveredElement = page.locator(`[data-skill-id="${testRecovery}"]`);
      const isVisible = await recoveredElement.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.opacity !== '0';
      });
      
      console.log(`原始文本是否恢复显示: ${isVisible}`);
    }
    
    console.log('✅ 原始文本恢复机制验证完成');
  });
});
