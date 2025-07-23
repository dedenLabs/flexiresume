/**
 * 技能渲染器修复测试
 * 
 * 测试折叠/展开后技能标签渲染问题的修复
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('技能渲染器修复测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问全栈开发页面
    await page.goto('http://localhost:5174/fullstack');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('折叠后再展开应该正确显示技能标签', async ({ page }) => {
    console.log('🧪 测试折叠/展开后技能标签渲染');
    
    // 查找包含"XCast 配置生成协同工具"的折叠按钮
    const xcastSection = page.locator('text=XCast 配置生成协同工具').first();
    await expect(xcastSection).toBeVisible();
    console.log('✅ 找到XCast配置生成协同工具节点');
    
    // 获取折叠按钮
    const collapseButton = xcastSection.locator('xpath=ancestor::div[contains(@class, "CategoryTitle")]');
    await expect(collapseButton).toBeVisible();
    
    // 检查初始状态下是否有技能标签
    const initialSkillTags = await page.locator('span[id^="skill-"]').count();
    console.log(`初始技能标签数量: ${initialSkillTags}`);
    
    // 截图保存初始状态
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'skill-renderer-before-collapse.png'),
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      }
    });
    
    // 点击折叠按钮
    await collapseButton.click();
    await page.waitForTimeout(500);
    console.log('✅ 已折叠XCast节点');
    
    // 截图保存折叠状态
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'skill-renderer-collapsed.png'),
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      }
    });
    
    // 再次点击展开
    await collapseButton.click();
    await page.waitForTimeout(1000); // 等待内容重新渲染
    console.log('✅ 已展开XCast节点');
    
    // 检查展开后是否仍然有技能标签
    const expandedSkillTags = await page.locator('span[id^="skill-"]').count();
    console.log(`展开后技能标签数量: ${expandedSkillTags}`);
    
    // 截图保存展开后状态
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'skill-renderer-after-expand.png'),
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      }
    });
    
    // 验证展开后技能标签数量不应该为0
    expect(expandedSkillTags).toBeGreaterThan(0);
    
    // 验证展开后的技能标签数量应该与初始状态相近
    // 注意：可能不完全相同，因为可能有其他组件的变化
    expect(expandedSkillTags).toBeGreaterThanOrEqual(initialSkillTags * 0.8);
    
    console.log('✅ 折叠/展开后技能标签渲染正常');
  });

  test('多次折叠展开应该保持稳定', async ({ page }) => {
    console.log('🧪 测试多次折叠/展开的稳定性');
    
    // 查找包含"XCast 配置生成协同工具"的折叠按钮
    const xcastSection = page.locator('text=XCast 配置生成协同工具').first();
    const collapseButton = xcastSection.locator('xpath=ancestor::div[contains(@class, "CategoryTitle")]');
    
    // 执行多次折叠/展开操作
    for (let i = 0; i < 3; i++) {
      console.log(`第${i+1}次折叠/展开测试`);
      
      // 折叠
      await collapseButton.click();
      await page.waitForTimeout(300);
      
      // 展开
      await collapseButton.click();
      await page.waitForTimeout(500);
      
      // 检查技能标签是否存在
      const skillTags = await page.locator('span[id^="skill-"]').count();
      console.log(`第${i+1}次展开后技能标签数量: ${skillTags}`);
      
      // 验证技能标签数量不为0
      expect(skillTags).toBeGreaterThan(0);
    }
    
    // 最终截图
    await page.screenshot({
      path: path.join('tests', 'screenshots', 'skill-renderer-multiple-toggles.png'),
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      }
    });
    
    console.log('✅ 多次折叠/展开后技能标签渲染稳定');
  });

  test('检查技能标签内容是否正确', async ({ page }) => {
    console.log('🧪 测试技能标签内容正确性');
    
    // 查找包含"XCast 配置生成协同工具"的折叠按钮
    const xcastSection = page.locator('text=XCast 配置生成协同工具').first();
    const collapseButton = xcastSection.locator('xpath=ancestor::div[contains(@class, "CategoryTitle")]');
    
    // 获取初始内容
    const initialContent = await page.locator('text=XCast 配置生成协同工具').locator('xpath=ancestor::div[contains(@class, "Node")]').textContent();
    console.log('初始内容长度:', initialContent?.length);
    
    // 折叠
    await collapseButton.click();
    await page.waitForTimeout(300);
    
    // 展开
    await collapseButton.click();
    await page.waitForTimeout(500);
    
    // 获取展开后内容
    const expandedContent = await page.locator('text=XCast 配置生成协同工具').locator('xpath=ancestor::div[contains(@class, "Node")]').textContent();
    console.log('展开后内容长度:', expandedContent?.length);
    
    // 验证内容长度不应该显著减少
    if (initialContent && expandedContent) {
      const initialLength = initialContent.length;
      const expandedLength = expandedContent.length;
      
      console.log(`内容长度比较: 初始=${initialLength}, 展开后=${expandedLength}`);
      
      // 展开后内容长度应该至少是初始内容的80%
      expect(expandedLength).toBeGreaterThanOrEqual(initialLength * 0.8);
    }
    
    // 检查是否包含关键内容
    expect(expandedContent).toContain('XCast');
    expect(expandedContent).toContain('Excel');
    
    console.log('✅ 折叠/展开后内容保持完整');
  });
});
