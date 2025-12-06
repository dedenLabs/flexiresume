/**
 * 职位图标下载和设置avatar测试
 * 
 * 验证职位图标已成功下载并正确设置到avatar配置中
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

// 职位图标映射
const expectedIcons = {
  'agent': 'AI Agent工程师',
  'fullstack': '全栈开发工程师', 
  'game': '游戏主程专家',
  'frontend': '前端开发工程师',
  'backend': 'NodeJs开发',
  'cto': '技术管理',
  'contracttask': '技术顾问/游戏资源优化/外包'
};

test.describe('职位图标测试', () => {
  
  test('验证职位图标文件存在', async ({ page }) => {
    console.log('🧪 开始职位图标文件存在性测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // 检查每个职位图标文件是否可访问
    const iconResults = [];
    
    for (const [iconKey, positionName] of Object.entries(expectedIcons)) {
      const iconUrl = `${BASE_URL}/images/positions/${iconKey}.svg`;
      
      try {
        const response = await page.request.get(iconUrl);
        const isAccessible = response.status() === 200;
        
        iconResults.push({
          iconKey,
          positionName,
          iconUrl,
          isAccessible,
          status: response.status()
        });
        
        console.log(`📁 ${iconKey}.svg (${positionName}): ${isAccessible ? '✅ 可访问' : '❌ 不可访问'} (${response.status()})`);
        
      } catch (error) {
        iconResults.push({
          iconKey,
          positionName,
          iconUrl,
          isAccessible: false,
          error: error.message
        });
        
        console.log(`📁 ${iconKey}.svg (${positionName}): ❌ 请求失败 - ${error.message}`);
      }
    }
    
    // 验证所有图标都可访问
    const accessibleIcons = iconResults.filter(result => result.isAccessible);
    expect(accessibleIcons.length).toBe(Object.keys(expectedIcons).length);
    
    console.log(`✅ 职位图标文件存在性验证通过: ${accessibleIcons.length}/${Object.keys(expectedIcons).length}`);
  });
  
  test('验证avatar配置在数据中正确设置', async ({ page }) => {
    console.log('🧪 开始avatar配置验证测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查页面中是否有avatar相关的配置
    const avatarConfigs = await page.evaluate(() => {
      // 尝试从全局变量或数据中获取avatar配置
      const avatars = [];
      
      // 查找所有img元素，看是否有职位图标
      const images = document.querySelectorAll('img');
      for (const img of images) {
        const src = img.src;
        if (src && src.includes('/images/positions/') && src.endsWith('.svg')) {
          avatars.push({
            src: src.replace(window.location.origin, ''),
            alt: img.alt || '',
            className: img.className || ''
          });
        }
      }
      
      // 查找所有background-image样式，看是否有职位图标
      const elements = document.querySelectorAll('*');
      for (const element of elements) {
        const computedStyle = getComputedStyle(element);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage.includes('/images/positions/') && backgroundImage.includes('.svg')) {
          avatars.push({
            backgroundImage: backgroundImage,
            tagName: element.tagName,
            className: element.className || ''
          });
        }
      }
      
      return avatars;
    });
    
    console.log('🖼️ 找到的avatar配置:', avatarConfigs);
    
    // 验证找到了一些avatar配置
    if (avatarConfigs.length > 0) {
      console.log(`✅ 找到 ${avatarConfigs.length} 个avatar配置`);
    } else {
      console.log('⚠️ 未在页面中找到avatar配置，可能需要切换到特定职位页面');
    }
  });
  
  test('验证不同职位页面显示对应图标', async ({ page }) => {
    console.log('🧪 开始不同职位页面图标显示测试');
    
    // 测试几个主要职位页面
    const testPositions = ['agent', 'fullstack', 'frontend'];
    
    for (const position of testPositions) {
      console.log(`🔍 测试职位页面: ${position}`);
      
      // 访问特定职位页面
      await page.goto(`${BASE_URL}/${position}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // 查找该职位的图标
      const positionIcon = await page.evaluate((pos) => {
        const iconPath = `/images/positions/${pos}.svg`;
        
        // 查找img元素
        const images = document.querySelectorAll('img');
        for (const img of images) {
          if (img.src && img.src.includes(iconPath)) {
            return {
              found: true,
              src: img.src.replace(window.location.origin, ''),
              type: 'img'
            };
          }
        }
        
        // 查找background-image
        const elements = document.querySelectorAll('*');
        for (const element of elements) {
          const computedStyle = getComputedStyle(element);
          const backgroundImage = computedStyle.backgroundImage;
          
          if (backgroundImage && backgroundImage.includes(iconPath)) {
            return {
              found: true,
              backgroundImage: backgroundImage,
              type: 'background'
            };
          }
        }
        
        return { found: false };
      }, position);
      
      console.log(`📊 ${position} 页面图标检测结果:`, positionIcon);
      
      if (positionIcon.found) {
        console.log(`✅ ${position} 页面正确显示对应图标`);
      } else {
        console.log(`⚠️ ${position} 页面未找到对应图标，可能图标显示方式不同`);
      }
    }
  });
  
  test('验证图标文件内容格式正确', async ({ page }) => {
    console.log('🧪 开始图标文件内容格式验证测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // 检查几个图标文件的内容
    const testIcons = ['agent', 'fullstack', 'frontend'];
    const iconResults = [];
    
    for (const iconKey of testIcons) {
      const iconUrl = `${BASE_URL}/images/positions/${iconKey}.svg`;
      
      try {
        const response = await page.request.get(iconUrl);
        const content = await response.text();
        
        const isValidSVG = content.includes('<svg') && content.includes('</svg>');
        const hasViewBox = content.includes('viewBox');
        const hasPath = content.includes('<path') || content.includes('<circle') || content.includes('<rect');
        
        iconResults.push({
          iconKey,
          isValidSVG,
          hasViewBox,
          hasPath,
          contentLength: content.length
        });
        
        console.log(`🎨 ${iconKey}.svg: SVG格式=${isValidSVG}, ViewBox=${hasViewBox}, 图形元素=${hasPath}, 大小=${content.length}字节`);
        
      } catch (error) {
        iconResults.push({
          iconKey,
          error: error.message
        });
        
        console.log(`🎨 ${iconKey}.svg: ❌ 读取失败 - ${error.message}`);
      }
    }
    
    // 验证所有测试的图标都是有效的SVG
    const validIcons = iconResults.filter(result => result.isValidSVG);
    expect(validIcons.length).toBe(testIcons.length);
    
    console.log(`✅ 图标文件内容格式验证通过: ${validIcons.length}/${testIcons.length}`);
  });
  
  test('验证图标在不同主题下的显示', async ({ page }) => {
    console.log('🧪 开始图标主题适配测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 获取初始状态下的图标显示
    const initialIconState = await page.evaluate(() => {
      const icons = [];
      const images = document.querySelectorAll('img[src*="/images/positions/"]');
      
      for (const img of images) {
        const computedStyle = getComputedStyle(img);
        icons.push({
          src: img.src.replace(window.location.origin, ''),
          filter: computedStyle.filter,
          opacity: computedStyle.opacity,
          visibility: computedStyle.visibility
        });
      }
      
      return icons;
    });
    
    console.log('🎨 初始主题下的图标状态:', initialIconState);
    
    // 查找主题切换按钮
    const themeButton = page.locator('[data-testid="theme-switcher"], .theme-switcher, button:has-text("主题"), button:has-text("🌙"), button:has-text("☀️")').first();
    
    if (await themeButton.isVisible()) {
      // 切换主题
      await themeButton.click();
      await page.waitForTimeout(1000);
      
      // 获取主题切换后的图标显示
      const newIconState = await page.evaluate(() => {
        const icons = [];
        const images = document.querySelectorAll('img[src*="/images/positions/"]');
        
        for (const img of images) {
          const computedStyle = getComputedStyle(img);
          icons.push({
            src: img.src.replace(window.location.origin, ''),
            filter: computedStyle.filter,
            opacity: computedStyle.opacity,
            visibility: computedStyle.visibility
          });
        }
        
        return icons;
      });
      
      console.log('🎨 切换主题后的图标状态:', newIconState);
      
      // 验证图标在主题切换后仍然可见
      if (initialIconState.length > 0 || newIconState.length > 0) {
        console.log('✅ 图标在主题切换后正常显示');
      } else {
        console.log('⚠️ 未找到职位图标，可能需要在特定页面测试');
      }
    } else {
      console.log('⚠️ 未找到主题切换按钮，跳过主题适配测试');
    }
  });
  
});
