import { test, expect } from '@playwright/test';

test('手动验证tabs数据切换', async ({ page }) => {
  // 访问页面
  await page.goto('http://localhost:5174/');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  // 截图初始状态
  await page.screenshot({ 
    path: 'tests/screenshots/manual-initial.png',
    fullPage: true 
  });

  console.log('页面已加载，请手动检查：');
  console.log('1. 页面是否正常显示');
  console.log('2. tabs是否可见');
  console.log('3. 点击不同tabs时数据是否切换');

  // 等待足够长的时间进行手动测试
  await page.waitForTimeout(30000);

  // 最终截图
  await page.screenshot({ 
    path: 'tests/screenshots/manual-final.png',
    fullPage: true 
  });
});
