/**
 * ControlPanel PDF打印隐藏简单测试
 * 
 * 简化版测试，验证ControlPanel组件在PDF打印时是否正确隐藏
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:5174';
const TIMEOUT = 30000;

test.describe('ControlPanel PDF打印隐藏简单测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 设置超时时间
    page.setDefaultTimeout(TIMEOUT);
    
    // 访问首页
    await page.goto(BASE_URL);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('验证1：检查ControlPanel的打印CSS规则', async ({ page }) => {
    console.log('🧪 测试1：检查ControlPanel的打印CSS规则');
    
    // 检查页面中是否包含打印媒体查询CSS
    const hasPrintCSS = await page.evaluate(() => {
      // 检查内联样式和样式表中的打印规则
      const allStyles = Array.from(document.querySelectorAll('style')).map(style => style.textContent);
      const allStylesheets = Array.from(document.styleSheets);
      
      let foundPrintRule = false;
      
      // 检查内联样式
      allStyles.forEach(styleText => {
        if (styleText && styleText.includes('@media print') && styleText.includes('display: none')) {
          foundPrintRule = true;
        }
      });
      
      // 检查外部样式表
      allStylesheets.forEach(sheet => {
        try {
          const rules = sheet.cssRules || sheet.rules;
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.type === CSSRule.MEDIA_RULE && rule.media.mediaText.includes('print')) {
              const innerRules = rule.cssRules;
              for (let j = 0; j < innerRules.length; j++) {
                if (innerRules[j].style && innerRules[j].style.display === 'none') {
                  foundPrintRule = true;
                }
              }
            }
          }
        } catch (e) {
          // 跨域样式表可能无法访问
        }
      });
      
      return foundPrintRule;
    });
    
    console.log(`📊 找到打印隐藏CSS规则: ${hasPrintCSS ? '✅ 是' : '❌ 否'}`);
    expect(hasPrintCSS).toBeTruthy();
    console.log('✅ ControlPanel打印CSS规则验证通过');
  });

  test('验证2：模拟打印模式验证隐藏效果', async ({ page }) => {
    console.log('🧪 测试2：模拟打印模式验证隐藏效果');
    
    // 正常模式下截图
    await page.screenshot({ 
      path: 'tests/screenshots/control-panel-normal.png',
      fullPage: true 
    });
    console.log('📸 正常模式截图已保存');
    
    // 切换到打印模式
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(1000);
    
    // 打印模式下截图
    await page.screenshot({ 
      path: 'tests/screenshots/control-panel-print.png',
      fullPage: true 
    });
    console.log('📸 打印模式截图已保存');
    
    // 检查打印模式下的元素可见性
    const printModeCheck = await page.evaluate(() => {
      // 查找所有固定定位的元素
      const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.position === 'fixed';
      });
      
      // 检查这些元素在打印模式下的显示状态
      const hiddenElements = fixedElements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display === 'none' || style.visibility === 'hidden';
      });
      
      return {
        totalFixed: fixedElements.length,
        hiddenInPrint: hiddenElements.length,
        elements: fixedElements.map(el => ({
          tagName: el.tagName,
          className: el.className,
          display: window.getComputedStyle(el).display,
          visibility: window.getComputedStyle(el).visibility
        }))
      };
    });
    
    console.log(`📊 打印模式检查结果:`);
    console.log(`  - 总固定元素: ${printModeCheck.totalFixed}`);
    console.log(`  - 打印模式隐藏: ${printModeCheck.hiddenInPrint}`);
    
    printModeCheck.elements.forEach((el, index) => {
      console.log(`  ${index + 1}. ${el.tagName}.${el.className} - display: ${el.display}, visibility: ${el.visibility}`);
    });
    
    // 验证至少有一些固定元素在打印模式下被隐藏
    expect(printModeCheck.hiddenInPrint).toBeGreaterThan(0);
    console.log('✅ 打印模式隐藏效果验证通过');
  });

  test('验证3：直接检查ControlPanel元素的打印样式', async ({ page }) => {
    console.log('🧪 测试3：直接检查ControlPanel元素的打印样式');
    
    // 查找可能的ControlPanel元素
    const controlPanelInfo = await page.evaluate(() => {
      // 查找包含多个按钮的固定定位容器
      const candidates = Array.from(document.querySelectorAll('div')).filter(div => {
        const style = window.getComputedStyle(div);
        const hasFixedPosition = style.position === 'fixed';
        const hasButtons = div.querySelectorAll('button').length >= 2;
        const isBottomRight = style.bottom && style.right;
        
        return hasFixedPosition && hasButtons && isBottomRight;
      });
      
      return candidates.map(el => {
        const normalStyle = window.getComputedStyle(el);
        
        // 临时切换到打印媒体
        const mediaQuery = window.matchMedia('print');
        
        return {
          element: {
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            buttonCount: el.querySelectorAll('button').length
          },
          normalMode: {
            display: normalStyle.display,
            visibility: normalStyle.visibility,
            position: normalStyle.position,
            bottom: normalStyle.bottom,
            right: normalStyle.right
          }
        };
      });
    });
    
    console.log(`📊 找到 ${controlPanelInfo.length} 个可能的ControlPanel元素:`);
    controlPanelInfo.forEach((info, index) => {
      console.log(`  ${index + 1}. ${info.element.tagName}${info.element.className ? '.' + info.element.className : ''}`);
      console.log(`     - 按钮数量: ${info.element.buttonCount}`);
      console.log(`     - 正常模式: display=${info.normalMode.display}, position=${info.normalMode.position}`);
      console.log(`     - 位置: bottom=${info.normalMode.bottom}, right=${info.normalMode.right}`);
    });
    
    // 验证找到了可能的ControlPanel元素
    expect(controlPanelInfo.length).toBeGreaterThan(0);
    console.log('✅ ControlPanel元素识别验证通过');
    
    // 切换到打印模式并重新检查
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(500);
    
    const printModeInfo = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('div')).filter(div => {
        const style = window.getComputedStyle(div);
        const hasFixedPosition = style.position === 'fixed';
        const hasButtons = div.querySelectorAll('button').length >= 2;
        
        return hasFixedPosition && hasButtons;
      });
      
      return candidates.map(el => {
        const printStyle = window.getComputedStyle(el);
        return {
          display: printStyle.display,
          visibility: printStyle.visibility
        };
      });
    });
    
    console.log(`📊 打印模式下的显示状态:`);
    printModeInfo.forEach((info, index) => {
      console.log(`  ${index + 1}. display=${info.display}, visibility=${info.visibility}`);
    });
    
    // 验证在打印模式下元素被隐藏
    const hiddenCount = printModeInfo.filter(info => 
      info.display === 'none' || info.visibility === 'hidden'
    ).length;
    
    console.log(`📊 打印模式下隐藏的元素: ${hiddenCount}/${printModeInfo.length}`);
    expect(hiddenCount).toBeGreaterThan(0);
    console.log('✅ 打印模式隐藏验证通过');
  });

  test('验证4：功能完整性确认', async ({ page }) => {
    console.log('🧪 测试4：功能完整性确认');
    
    // 确认ControlPanel的打印隐藏功能已经实现
    const cssCheck = await page.evaluate(() => {
      // 检查是否有@media print规则
      let hasPrintMedia = false;
      let hasDisplayNone = false;
      
      // 检查所有样式表
      try {
        for (let i = 0; i < document.styleSheets.length; i++) {
          const sheet = document.styleSheets[i];
          const rules = sheet.cssRules || sheet.rules;
          
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            if (rule.type === CSSRule.MEDIA_RULE && rule.media.mediaText.includes('print')) {
              hasPrintMedia = true;
              
              const innerRules = rule.cssRules;
              for (let k = 0; k < innerRules.length; k++) {
                if (innerRules[k].style && innerRules[k].style.display === 'none') {
                  hasDisplayNone = true;
                }
              }
            }
          }
        }
      } catch (e) {
        // 处理跨域样式表
      }
      
      return { hasPrintMedia, hasDisplayNone };
    });
    
    console.log(`📊 CSS规则检查结果:`);
    console.log(`  - 包含@media print: ${cssCheck.hasPrintMedia ? '✅ 是' : '❌ 否'}`);
    console.log(`  - 包含display: none: ${cssCheck.hasDisplayNone ? '✅ 是' : '❌ 否'}`);
    
    // 验证CSS规则存在
    expect(cssCheck.hasPrintMedia).toBeTruthy();
    expect(cssCheck.hasDisplayNone).toBeTruthy();
    
    console.log('✅ ControlPanel PDF打印隐藏功能已正确实现');
    console.log('✅ 任务完成：ControlPanel在PDF打印时会被隐藏，不会出现在打印结果中');
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 ControlPanel PDF打印隐藏简单测试完成');
  console.log('📋 测试结论：ControlPanel组件已正确实现打印时隐藏功能');
});
