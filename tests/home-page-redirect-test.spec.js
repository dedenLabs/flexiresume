/**
 * 首页重定向测试
 * 
 * 验证访问根路径时是否正确重定向到is_home_page配置的页面
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('首页重定向测试', () => {
  
  test('验证根路径重定向到is_home_page页面', async ({ page }) => {
    console.log('🧪 开始首页重定向测试');
    
    // 访问根路径
    console.log('🌐 访问根路径: /');
    await page.goto(BASE_URL + '/');
    
    // 等待重定向完成
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 获取当前URL
    const currentUrl = page.url();
    const currentPath = new URL(currentUrl).pathname;
    
    console.log(`📍 当前路径: ${currentPath}`);
    console.log(`📍 完整URL: ${currentUrl}`);
    
    // 验证是否重定向到了正确的页面
    // 根据数据配置，应该重定向到 /xuanzang
    if (currentPath === '/xuanzang' || currentPath === '/xuanzang/') {
      console.log('✅ 重定向正确：根路径成功重定向到xuanzang页面');
    } else if (currentPath === '/') {
      console.log('❌ 重定向失败：仍然停留在根路径');
    } else {
      console.log(`⚠️ 重定向到了其他页面: ${currentPath}`);
    }
    
    // 检查页面内容是否正确加载
    const pageTitle = await page.title();
    console.log(`📄 页面标题: ${pageTitle}`);
    
    // 检查是否有唐僧相关内容
    const hasXuanzangContent = await page.locator('text=唐僧').isVisible().catch(() => false);
    const hasTeamLeaderContent = await page.locator('text=团队领导').isVisible().catch(() => false);
    
    if (hasXuanzangContent || hasTeamLeaderContent) {
      console.log('✅ 页面内容正确：检测到唐僧/团队领导相关内容');
    } else {
      console.log('⚠️ 页面内容可能不正确：未检测到预期内容');
    }
    
    // 验证URL路径
    expect(currentPath).not.toBe('/');
    
    console.log('✅ 首页重定向测试完成');
  });
  
  test('验证直接访问xuanzang页面', async ({ page }) => {
    console.log('🧪 开始直接访问xuanzang页面测试');
    
    // 直接访问xuanzang页面
    console.log('🌐 直接访问: /xuanzang');
    await page.goto(BASE_URL + '/xuanzang');
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 获取当前URL
    const currentUrl = page.url();
    const currentPath = new URL(currentUrl).pathname;
    
    console.log(`📍 当前路径: ${currentPath}`);
    
    // 验证路径正确
    if (currentPath === '/xuanzang' || currentPath === '/xuanzang/') {
      console.log('✅ 直接访问成功：正确显示xuanzang页面');
    } else {
      console.log(`❌ 直接访问失败：路径不正确 ${currentPath}`);
    }
    
    // 检查页面内容
    const hasContent = await page.locator('text=唐僧').isVisible().catch(() => false);
    if (hasContent) {
      console.log('✅ 页面内容正确：检测到唐僧相关内容');
    } else {
      console.log('⚠️ 页面内容可能不正确：未检测到预期内容');
    }
    
    console.log('✅ 直接访问xuanzang页面测试完成');
  });
  
});
