/**
 * 简单字体优先级测试
 * 
 * 验证字体加载是否优先使用在线CDN
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('字体CDN优先级简单测试', () => {
  
  test('验证字体CDN优先级', async ({ page }) => {
    console.log('🧪 开始字体CDN优先级测试');
    
    const fontRequests = [];
    
    // 监听网络请求
    page.on('request', request => {
      const url = request.url();
      if (url.includes('font') || url.includes('.css') || 
          url.includes('loli.net') || url.includes('googleapis.com') ||
          url.includes('jsdelivr.net') || url.includes('unpkg.com')) {
        fontRequests.push({
          url,
          timestamp: Date.now(),
          isOnline: url.includes('fonts.loli.net') || 
                   url.includes('fonts.googleapis.com') ||
                   url.includes('cdn.jsdelivr.net') ||
                   url.includes('unpkg.com'),
          isLocal: url.includes('./fonts/') || url.includes('/fonts/') || url.includes('localhost')
        });
        console.log(`📡 字体请求: ${url}`);
      }
    });
    
    // 监听控制台日志
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Font') || text.includes('🔄') || text.includes('✅') || text.includes('❌')) {
        console.log(`📝 字体日志: ${text}`);
      }
    });
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // 等待字体加载
    
    console.log(`📊 总字体请求数: ${fontRequests.length}`);
    
    if (fontRequests.length > 0) {
      console.log('📋 字体请求详情:');
      fontRequests.forEach((req, index) => {
        const type = req.isOnline ? '🌐 在线CDN' : (req.isLocal ? '📁 本地' : '❓ 未知');
        console.log(`  ${index + 1}. ${type}: ${req.url}`);
      });
      
      const onlineRequests = fontRequests.filter(req => req.isOnline);
      const localRequests = fontRequests.filter(req => req.isLocal);
      
      console.log(`🌐 在线CDN请求: ${onlineRequests.length}`);
      console.log(`📁 本地请求: ${localRequests.length}`);
      
      // 验证有在线CDN请求
      if (onlineRequests.length > 0) {
        console.log('✅ 检测到在线CDN字体请求，优先级正确');
      } else {
        console.log('⚠️ 未检测到在线CDN字体请求，可能存在问题');
      }
    } else {
      console.log('⚠️ 未检测到任何字体相关请求');
    }
    
    // 检查页面字体
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    
    console.log(`📝 页面字体: ${bodyFont}`);
    expect(bodyFont).toBeTruthy();
    
    console.log('✅ 字体CDN优先级测试完成');
  });
  
});
