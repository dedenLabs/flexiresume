/**
 * SmartImage快速测试 - 验证display属性修复
 */

import { test, expect } from '@playwright/test';

test('验证SmartImage display属性修复', async ({ page }) => {
  console.log('🔍 开始快速验证SmartImage display属性...');
  
  // 访问应用首页
  await page.goto('http://localhost:5173');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // 查找所有SmartImage组件
  const smartImages = await page.locator('[data-smart-image="true"]').all();
  console.log(`📊 找到 ${smartImages.length} 个SmartImage组件`);
  
  let inlineBlockCount = 0;
  let blockCount = 0;
  
  for (let i = 0; i < smartImages.length; i++) {
    const image = smartImages[i];
    
    // 检查display样式
    const displayStyle = await image.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.display;
    });
    
    console.log(`📋 SmartImage ${i + 1} display样式: ${displayStyle}`);
    
    if (displayStyle === 'inline-block') {
      inlineBlockCount++;
    } else if (displayStyle === 'block') {
      blockCount++;
    }
  }
  
  console.log(`✅ inline-block: ${inlineBlockCount}, ❌ block: ${blockCount}`);
  
  // 截图保存
  await page.screenshot({ 
    path: 'tests/screenshots/smartimage-quick-test.png',
    fullPage: true 
  });
  
  // 验证至少有一些SmartImage是inline-block
  expect(inlineBlockCount).toBeGreaterThan(0);
  
  console.log('✅ SmartImage display属性验证完成');
});
