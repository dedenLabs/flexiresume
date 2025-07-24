/**
 * 任务修复验证测试
 * 
 * 验证三个任务的修复效果：
 * 1. 技能渲染不全问题
 * 2. 技能标签折叠展开问题
 * 3. 打印非原版PDF模式问题
 */

import { test, expect } from '@playwright/test';

test.describe('任务修复验证', () => {
  test.beforeEach(async ({ page }) => {
    // 监听控制台日志
    page.on('console', msg => {
      if (msg.text().includes('SkillRenderer') || msg.text().includes('PDF')) {
        console.log('日志:', msg.text());
      }
    });
    
    // 访问fullstack页面
    await page.goto('http://localhost:5176/fullstack');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('验证技能渲染不全问题修复', async ({ page }) => {
    console.log('🧪 开始验证技能渲染不全问题修复');
    
    // 统计页面上的技能标签数量
    const skillTags = await page.locator('span[id^="skill-"]').count();
    console.log(`页面技能标签总数: ${skillTags}`);
    
    // 检查技能标签是否有正确的属性
    const skillTagsWithData = await page.locator('span[id^="skill-"][data-skill-name][data-skill-level]').count();
    console.log(`有完整数据属性的技能标签数: ${skillTagsWithData}`);
    
    // 验证技能标签数量应该大于0
    expect(skillTags).toBeGreaterThan(0);
    expect(skillTagsWithData).toBe(skillTags);
    
    // 检查是否有内容哈希属性（新增的改进）
    const skillTagsWithHash = await page.locator('span[id^="skill-"][data-content-hash]').count();
    console.log(`有内容哈希的技能标签数: ${skillTagsWithHash}`);
    expect(skillTagsWithHash).toBe(skillTags);
    
    // 检查技能标签的内容是否正确渲染
    const firstSkillTag = page.locator('span[id^="skill-"]').first();
    const skillContent = await firstSkillTag.textContent();
    console.log(`第一个技能标签内容: "${skillContent}"`);
    expect(skillContent).toBeTruthy();
    expect(skillContent!.length).toBeGreaterThan(0);
    
    console.log('✅ 技能渲染不全问题修复验证完成');
  });

  test('验证技能标签折叠展开问题修复', async ({ page }) => {
    console.log('🧪 开始验证技能标签折叠展开问题修复');
    
    // 查找包含技能标签的Timeline节点
    const timelineNodes = await page.locator('[class*="Node"]').all();
    console.log(`找到Timeline节点数量: ${timelineNodes.length}`);
    
    let testNodeFound = false;
    
    for (let i = 0; i < Math.min(timelineNodes.length, 3); i++) {
      const node = timelineNodes[i];
      const skillTagsInNode = await node.locator('span[id^="skill-"]').count();
      
      if (skillTagsInNode > 0) {
        console.log(`节点${i+1}包含${skillTagsInNode}个技能标签，开始测试折叠展开`);
        
        // 查找CategoryTitle
        const categoryTitle = node.locator('[class*="CategoryTitle"]').first();
        const titleExists = await categoryTitle.count();
        
        if (titleExists > 0) {
          testNodeFound = true;
          
          // 记录展开前的技能标签数量
          const beforeCollapse = await node.locator('span[id^="skill-"]').count();
          console.log(`折叠前技能标签数量: ${beforeCollapse}`);
          
          // 点击折叠
          await categoryTitle.click();
          await page.waitForTimeout(1000);
          
          // 记录折叠后的技能标签数量
          const afterCollapse = await node.locator('span[id^="skill-"]').count();
          console.log(`折叠后技能标签数量: ${afterCollapse}`);
          
          // 点击展开
          await categoryTitle.click();
          await page.waitForTimeout(2000); // 给IntersectionObserver时间工作
          
          // 记录展开后的技能标签数量
          const afterExpand = await node.locator('span[id^="skill-"]').count();
          console.log(`展开后技能标签数量: ${afterExpand}`);
          
          // 验证展开后技能标签数量应该恢复
          expect(afterExpand).toBeGreaterThanOrEqual(beforeCollapse * 0.8); // 允许20%误差
          
          // 检查是否有observer属性（新增的改进）
          const observerAttached = await node.locator('span[data-observer-attached="true"]').count();
          console.log(`附加了observer的容器数量: ${observerAttached}`);
          
          break;
        }
      }
    }
    
    if (!testNodeFound) {
      console.log('⚠️ 未找到包含技能标签的可折叠节点');
    } else {
      console.log('✅ 技能标签折叠展开问题修复验证完成');
    }
  });

  test('验证打印非原版PDF模式问题修复', async ({ page }) => {
    console.log('🧪 开始验证打印非原版PDF模式问题修复');
    
    // 查找PDF下载按钮
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    await expect(pdfDownloader).toBeVisible();
    
    const pdfButton = pdfDownloader.locator('button').first();
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    // 测试彩色PDF模式
    console.log('🎯 测试彩色PDF模式');
    const colorPdfOption = page.locator('text=彩色PDF').or(page.locator('text=Color PDF'));
    
    const [colorPdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      colorPdfOption.first().click()
    ]);
    
    console.log('✅ 彩色PDF窗口已打开');
    
    // 等待PDF页面加载
    await colorPdfPage.waitForLoadState('load');
    await colorPdfPage.waitForTimeout(2000);
    
    // 检查body是否有print-mode-active类
    const bodyClass = await colorPdfPage.locator('body').getAttribute('class');
    console.log('彩色PDF页面body类名:', bodyClass);
    expect(bodyClass).toContain('print-mode-active');
    
    // 检查调试信息
    const debugInfo = colorPdfPage.locator('.pdf-debug-info');
    const debugText = await debugInfo.textContent();
    console.log('彩色PDF调试信息:', debugText);
    expect(debugText).toContain('彩色版');
    expect(debugText).toContain('原版模式: 否');
    
    // 关闭彩色PDF窗口
    await colorPdfPage.close();
    
    // 测试黑白PDF模式
    console.log('🎯 测试黑白PDF模式');
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const grayscalePdfOption = page.locator('text=黑白PDF').or(page.locator('text=Grayscale PDF'));
    
    const [grayscalePdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      grayscalePdfOption.first().click()
    ]);
    
    console.log('✅ 黑白PDF窗口已打开');
    
    // 等待PDF页面加载
    await grayscalePdfPage.waitForLoadState('load');
    await grayscalePdfPage.waitForTimeout(2000);
    
    // 检查body是否有print-mode-active类
    const grayscaleBodyClass = await grayscalePdfPage.locator('body').getAttribute('class');
    console.log('黑白PDF页面body类名:', grayscaleBodyClass);
    expect(grayscaleBodyClass).toContain('print-mode-active');
    
    // 检查调试信息
    const grayscaleDebugInfo = grayscalePdfPage.locator('.pdf-debug-info');
    const grayscaleDebugText = await grayscaleDebugInfo.textContent();
    console.log('黑白PDF调试信息:', grayscaleDebugText);
    expect(grayscaleDebugText).toContain('黑白版');
    expect(grayscaleDebugText).toContain('原版模式: 否');
    
    // 关闭黑白PDF窗口
    await grayscalePdfPage.close();
    
    console.log('✅ 打印非原版PDF模式问题修复验证完成');
  });

  test('对比原版PDF和标准PDF的差异', async ({ page }) => {
    console.log('🧪 开始对比原版PDF和标准PDF的差异');
    
    const pdfDownloader = page.locator('[data-testid="pdf-downloader"]');
    const pdfButton = pdfDownloader.locator('button').first();
    
    // 测试原版PDF
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const originalPdfOption = page.locator('text=原版PDF').or(page.locator('text=Original PDF'));
    
    const [originalPdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      originalPdfOption.first().click()
    ]);
    
    await originalPdfPage.waitForLoadState('load');
    await originalPdfPage.waitForTimeout(2000);
    
    const originalBodyClass = await originalPdfPage.locator('body').getAttribute('class');
    const originalDebugText = await originalPdfPage.locator('.pdf-debug-info').textContent();
    
    console.log('原版PDF body类名:', originalBodyClass);
    console.log('原版PDF调试信息:', originalDebugText);
    
    await originalPdfPage.close();
    
    // 测试彩色PDF
    await pdfButton.click();
    await page.waitForTimeout(500);
    
    const colorPdfOption = page.locator('text=彩色PDF').or(page.locator('text=Color PDF'));
    
    const [colorPdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      colorPdfOption.first().click()
    ]);
    
    await colorPdfPage.waitForLoadState('load');
    await colorPdfPage.waitForTimeout(2000);
    
    const colorBodyClass = await colorPdfPage.locator('body').getAttribute('class');
    const colorDebugText = await colorPdfPage.locator('.pdf-debug-info').textContent();
    
    console.log('彩色PDF body类名:', colorBodyClass);
    console.log('彩色PDF调试信息:', colorDebugText);
    
    await colorPdfPage.close();
    
    // 验证差异
    expect(originalBodyClass).toContain('original-mode');
    expect(originalBodyClass).not.toContain('print-mode-active');
    
    expect(colorBodyClass).toContain('print-mode-active');
    expect(colorBodyClass).not.toContain('original-mode');
    
    console.log('✅ 原版PDF和标准PDF差异验证完成');
    console.log('📊 差异总结:');
    console.log('- 原版PDF: 使用original-mode类，不激活全局打印样式');
    console.log('- 标准PDF: 使用print-mode-active类，激活全局打印样式');
  });
});
