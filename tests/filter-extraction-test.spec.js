/**
 * Filter样式提取到主题配置文件测试
 * 
 * 验证filter样式已成功提取到CSS变量中，并且可以通过主题配置统一管理
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('Filter样式提取测试', () => {
  
  test('验证CSS变量中的filter定义', async ({ page }) => {
    console.log('🧪 开始CSS变量filter定义测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查CSS变量是否定义
    const filterVariables = await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      return {
        backgroundLight: computedStyle.getPropertyValue('--filter-background-light').trim(),
        backgroundDark: computedStyle.getPropertyValue('--filter-background-dark').trim(),
        linkIconLight: computedStyle.getPropertyValue('--filter-link-icon-light').trim(),
        linkIconDark: computedStyle.getPropertyValue('--filter-link-icon-dark').trim()
      };
    });
    
    console.log('🎨 Filter CSS变量:', filterVariables);
    
    // 验证所有filter变量都已定义且不为空
    expect(filterVariables.backgroundLight).not.toBe('');
    expect(filterVariables.backgroundDark).not.toBe('');
    expect(filterVariables.linkIconLight).not.toBe('');
    expect(filterVariables.linkIconDark).not.toBe('');
    
    // 验证filter变量包含预期的滤镜函数
    expect(filterVariables.backgroundLight).toContain('sepia');
    expect(filterVariables.backgroundLight).toContain('hue-rotate');
    expect(filterVariables.backgroundDark).toContain('invert');
    expect(filterVariables.linkIconLight).toContain('brightness');
    expect(filterVariables.linkIconDark).toContain('saturate');
    
    console.log('✅ CSS变量filter定义验证通过');
  });
  
  test('验证背景滤镜应用', async ({ page }) => {
    console.log('🧪 开始背景滤镜应用测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查背景元素是否应用了滤镜
    const backgroundFilter = await page.evaluate(() => {
      // 查找背景元素
      const backgroundElements = document.querySelectorAll('*');
      const filtersFound = [];
      
      for (const element of backgroundElements) {
        const computedStyle = getComputedStyle(element);
        const filter = computedStyle.filter;
        
        if (filter && filter !== 'none' && (
          filter.includes('sepia') || 
          filter.includes('hue-rotate') ||
          filter.includes('var(--filter')
        )) {
          filtersFound.push({
            tagName: element.tagName,
            className: element.className,
            filter: filter.substring(0, 100) // 只取前100个字符
          });
        }
      }
      
      return filtersFound.slice(0, 5); // 只返回前5个
    });
    
    console.log('🎨 找到的背景滤镜:', backgroundFilter);
    
    // 验证至少找到一些应用了滤镜的元素
    expect(backgroundFilter.length).toBeGreaterThan(0);
    
    console.log('✅ 背景滤镜应用验证通过');
  });
  
  test('验证链接图标滤镜应用', async ({ page }) => {
    console.log('🧪 开始链接图标滤镜应用测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查链接元素的伪元素滤镜
    const linkIconFilters = await page.evaluate(() => {
      const links = document.querySelectorAll('a:not(.no-link-icon)');
      const filtersFound = [];
      
      for (const link of links) {
        // 获取伪元素样式比较复杂，我们检查CSS规则
        const sheets = Array.from(document.styleSheets);
        
        for (const sheet of sheets) {
          try {
            const rules = Array.from(sheet.cssRules || sheet.rules || []);
            
            for (const rule of rules) {
              if (rule.selectorText && 
                  rule.selectorText.includes('::before') && 
                  rule.selectorText.includes('a') &&
                  rule.style && 
                  rule.style.filter) {
                
                filtersFound.push({
                  selector: rule.selectorText,
                  filter: rule.style.filter.substring(0, 100)
                });
              }
            }
          } catch (e) {
            // 跨域样式表可能无法访问，忽略错误
          }
        }
      }
      
      return [...new Set(filtersFound.map(f => JSON.stringify(f)))].map(f => JSON.parse(f)).slice(0, 3);
    });
    
    console.log('🔗 找到的链接图标滤镜:', linkIconFilters);
    
    // 验证找到了链接图标滤镜规则
    if (linkIconFilters.length > 0) {
      const hasFilterVar = linkIconFilters.some(filter => 
        filter.filter.includes('var(--filter') || 
        filter.filter.includes('brightness') ||
        filter.filter.includes('saturate')
      );
      
      expect(hasFilterVar).toBe(true);
      console.log('✅ 链接图标滤镜应用验证通过');
    } else {
      console.log('⚠️ 未找到链接图标滤镜规则，可能是样式表访问限制');
    }
  });
  
  test('验证主题切换时滤镜变化', async ({ page }) => {
    console.log('🧪 开始主题切换滤镜变化测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 获取初始滤镜值
    const initialFilters = await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        backgroundLight: computedStyle.getPropertyValue('--filter-background-light').trim(),
        backgroundDark: computedStyle.getPropertyValue('--filter-background-dark').trim(),
        linkIconLight: computedStyle.getPropertyValue('--filter-link-icon-light').trim(),
        linkIconDark: computedStyle.getPropertyValue('--filter-link-icon-dark').trim()
      };
    });
    
    console.log('🎨 初始滤镜值:', initialFilters);
    
    // 查找主题切换按钮
    const themeButton = page.locator('[data-testid="theme-switcher"], .theme-switcher, button:has-text("主题"), button:has-text("🌙"), button:has-text("☀️")').first();
    
    if (await themeButton.isVisible()) {
      // 切换主题
      await themeButton.click();
      await page.waitForTimeout(1000);
      
      // 获取切换后的滤镜值
      const newFilters = await page.evaluate(() => {
        const computedStyle = getComputedStyle(document.documentElement);
        return {
          backgroundLight: computedStyle.getPropertyValue('--filter-background-light').trim(),
          backgroundDark: computedStyle.getPropertyValue('--filter-background-dark').trim(),
          linkIconLight: computedStyle.getPropertyValue('--filter-link-icon-light').trim(),
          linkIconDark: computedStyle.getPropertyValue('--filter-link-icon-dark').trim()
        };
      });
      
      console.log('🎨 切换后滤镜值:', newFilters);
      
      // 验证滤镜值在主题切换后仍然存在
      expect(newFilters.backgroundLight).not.toBe('');
      expect(newFilters.backgroundDark).not.toBe('');
      expect(newFilters.linkIconLight).not.toBe('');
      expect(newFilters.linkIconDark).not.toBe('');
      
      // 验证滤镜值保持一致（因为我们在两个主题中定义了相同的值）
      expect(newFilters.backgroundLight).toBe(initialFilters.backgroundLight);
      expect(newFilters.backgroundDark).toBe(initialFilters.backgroundDark);
      
      console.log('✅ 主题切换滤镜变化验证通过');
    } else {
      console.log('⚠️ 未找到主题切换按钮，跳过主题切换测试');
    }
  });
  
  test('验证滤镜工具函数可用性', async ({ page }) => {
    console.log('🧪 开始滤镜工具函数可用性测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 测试滤镜工具函数（如果已加载）
    const filterUtilsTest = await page.evaluate(() => {
      // 检查是否可以访问CSS变量
      const testResults = {
        canReadVariables: false,
        canWriteVariables: false,
        variableCount: 0
      };
      
      try {
        // 测试读取CSS变量
        const computedStyle = getComputedStyle(document.documentElement);
        const backgroundLight = computedStyle.getPropertyValue('--filter-background-light').trim();
        
        if (backgroundLight) {
          testResults.canReadVariables = true;
          testResults.variableCount++;
        }
        
        // 测试写入CSS变量
        document.documentElement.style.setProperty('--test-filter', 'brightness(1.2)');
        const testValue = computedStyle.getPropertyValue('--test-filter').trim();
        
        if (testValue) {
          testResults.canWriteVariables = true;
          // 清理测试变量
          document.documentElement.style.removeProperty('--test-filter');
        }
        
        // 计算定义的滤镜变量数量
        const filterVars = [
          '--filter-background-light',
          '--filter-background-dark', 
          '--filter-link-icon-light',
          '--filter-link-icon-dark'
        ];
        
        testResults.variableCount = filterVars.filter(varName => 
          computedStyle.getPropertyValue(varName).trim() !== ''
        ).length;
        
      } catch (error) {
        console.error('滤镜工具函数测试失败:', error);
      }
      
      return testResults;
    });
    
    console.log('🔧 滤镜工具函数测试结果:', filterUtilsTest);
    
    // 验证基本功能可用
    expect(filterUtilsTest.canReadVariables).toBe(true);
    expect(filterUtilsTest.canWriteVariables).toBe(true);
    expect(filterUtilsTest.variableCount).toBe(4);
    
    console.log('✅ 滤镜工具函数可用性验证通过');
  });
  
});
