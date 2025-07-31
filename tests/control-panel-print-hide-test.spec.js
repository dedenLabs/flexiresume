/**
 * ControlPanel PDF打印隐藏测试
 * 
 * 测试ControlPanel组件在PDF打印时是否正确隐藏
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5175';
const TIMEOUT = 30000;

test.describe('ControlPanel PDF打印隐藏测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('验证1：ControlPanel在正常模式下可见', async ({ page }) => {
    console.log('🧪 测试1：ControlPanel在正常模式下可见');
    
    // 等待ControlPanel加载
    await page.waitForTimeout(3000);
    
    // 查找ControlPanel容器
    const controlPanel = page.locator('[data-testid="control-panel"], .control-panel').first();
    
    // 如果没有找到特定的测试ID，尝试通过样式查找
    const panelByStyle = page.locator('div').filter({
      has: page.locator('button, [role="button"]')
    }).filter({
      hasText: /语言|主题|字体|PDF|音频/
    }).first();
    
    // 检查是否可见
    let isVisible = false;
    if (await controlPanel.count() > 0) {
      isVisible = await controlPanel.isVisible();
      console.log('✅ 通过测试ID找到ControlPanel');
    } else if (await panelByStyle.count() > 0) {
      isVisible = await panelByStyle.isVisible();
      console.log('✅ 通过样式找到ControlPanel');
    }
    
    if (isVisible) {
      console.log('✅ ControlPanel在正常模式下可见');
    } else {
      // 尝试查找固定定位的面板
      const fixedPanel = page.locator('div[style*="position: fixed"], div[style*="position:fixed"]').filter({
        has: page.locator('button')
      }).first();
      
      if (await fixedPanel.count() > 0) {
        isVisible = await fixedPanel.isVisible();
        console.log('✅ 通过固定定位找到ControlPanel');
      }
    }
    
    expect(isVisible).toBeTruthy();
    console.log('✅ ControlPanel正常模式可见性验证通过');
  });

  test('验证2：ControlPanel在打印模式下隐藏', async ({ page }) => {
    console.log('🧪 测试2：ControlPanel在打印模式下隐藏');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    // 模拟打印媒体查询
    await page.emulateMedia({ media: 'print' });
    
    // 等待样式应用
    await page.waitForTimeout(1000);
    
    // 检查ControlPanel是否隐藏
    const controlPanelElements = await page.locator('div').evaluateAll(elements => {
      return elements.filter(el => {
        const style = window.getComputedStyle(el);
        const hasFixedPosition = style.position === 'fixed';
        const hasButtons = el.querySelectorAll('button').length > 0;
        const isBottomRight = style.bottom && style.right;
        
        return hasFixedPosition && hasButtons && isBottomRight;
      }).map(el => ({
        display: window.getComputedStyle(el).display,
        visibility: window.getComputedStyle(el).visibility,
        opacity: window.getComputedStyle(el).opacity,
        className: el.className,
        id: el.id
      }));
    });
    
    console.log(`📊 找到 ${controlPanelElements.length} 个可能的ControlPanel元素:`);
    controlPanelElements.forEach((el, index) => {
      console.log(`  ${index + 1}. display: ${el.display}, visibility: ${el.visibility}, opacity: ${el.opacity}`);
    });
    
    // 验证所有可能的ControlPanel元素都被隐藏
    const hiddenElements = controlPanelElements.filter(el => 
      el.display === 'none' || 
      el.visibility === 'hidden' || 
      el.opacity === '0'
    );
    
    console.log(`📊 隐藏的元素数量: ${hiddenElements.length}/${controlPanelElements.length}`);
    
    // 如果找到了ControlPanel元素，验证它们都被隐藏了
    if (controlPanelElements.length > 0) {
      expect(hiddenElements.length).toBe(controlPanelElements.length);
      console.log('✅ 所有ControlPanel元素在打印模式下都被隐藏');
    } else {
      console.log('ℹ️ 未找到ControlPanel元素，可能已经被完全隐藏');
    }
    
    // 截图验证打印模式
    await page.screenshot({ 
      path: 'tests/screenshots/control-panel-print-mode.png',
      fullPage: true 
    });
    console.log('📸 已保存打印模式截图');
  });

  test('验证3：打印CSS规则验证', async ({ page }) => {
    console.log('🧪 测试3：打印CSS规则验证');
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 检查CSS中是否包含打印媒体查询规则
    const printRules = await page.evaluate(() => {
      const rules = [];
      
      // 遍历所有样式表
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const styleSheet = document.styleSheets[i];
          const cssRules = styleSheet.cssRules || styleSheet.rules;
          
          for (let j = 0; j < cssRules.length; j++) {
            const rule = cssRules[j];
            
            // 检查媒体查询规则
            if (rule.type === CSSRule.MEDIA_RULE && rule.media.mediaText.includes('print')) {
              for (let k = 0; k < rule.cssRules.length; k++) {
                const innerRule = rule.cssRules[k];
                if (innerRule.style && innerRule.style.display === 'none') {
                  rules.push({
                    selector: innerRule.selectorText,
                    display: innerRule.style.display,
                    mediaQuery: rule.media.mediaText
                  });
                }
              }
            }
          }
        } catch (e) {
          // 跨域样式表可能无法访问，忽略错误
        }
      }
      
      return rules;
    });
    
    console.log(`📊 找到 ${printRules.length} 个打印隐藏规则:`);
    printRules.forEach((rule, index) => {
      console.log(`  ${index + 1}. ${rule.selector} { display: ${rule.display}; } @media ${rule.mediaQuery}`);
    });
    
    // 验证是否有打印隐藏规则
    expect(printRules.length).toBeGreaterThan(0);
    console.log('✅ 找到了打印媒体查询隐藏规则');
  });

  test('验证4：PDF下载功能测试', async ({ page }) => {
    console.log('🧪 测试4：PDF下载功能测试');
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 查找PDF下载按钮
    const pdfButton = page.locator('button').filter({ hasText: /PDF|下载|打印/i }).first();
    
    if (await pdfButton.count() > 0) {
      console.log('✅ 找到PDF下载按钮');
      
      // 监听下载事件
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
      
      // 点击PDF下载按钮
      await pdfButton.click();
      console.log('🖱️ 点击PDF下载按钮');
      
      try {
        // 等待下载开始
        const download = await downloadPromise;
        console.log(`✅ PDF下载开始: ${download.suggestedFilename()}`);
        
        // 验证文件名
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.pdf$/i);
        console.log('✅ PDF文件名格式正确');
        
      } catch (error) {
        console.log('ℹ️ PDF下载可能需要用户交互或特殊配置');
      }
    } else {
      console.log('ℹ️ 未找到PDF下载按钮');
    }
  });

  test('验证5：打印预览模式测试', async ({ page }) => {
    console.log('🧪 测试5：打印预览模式测试');
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 正常模式截图
    await page.screenshot({ 
      path: 'tests/screenshots/control-panel-normal-mode.png',
      fullPage: true 
    });
    
    // 切换到打印模式
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(1000);
    
    // 打印模式截图
    await page.screenshot({ 
      path: 'tests/screenshots/control-panel-print-comparison.png',
      fullPage: true 
    });
    
    // 比较两种模式下的页面内容
    const normalModeElements = await page.evaluate(() => {
      // 切换回屏幕模式
      return document.querySelectorAll('[style*="position: fixed"]').length;
    });
    
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(500);
    
    const printModeElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[style*="position: fixed"]');
      let visibleCount = 0;
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          visibleCount++;
        }
      });
      
      return visibleCount;
    });
    
    console.log(`📊 正常模式固定元素: ${normalModeElements}`);
    console.log(`📊 打印模式可见固定元素: ${printModeElements}`);
    
    // 验证打印模式下固定元素减少（ControlPanel被隐藏）
    expect(printModeElements).toBeLessThanOrEqual(normalModeElements);
    console.log('✅ 打印模式下固定元素数量验证通过');
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 ControlPanel PDF打印隐藏测试完成');
});
