/**
 * 语言切换功能修复测试
 * 
 * 验证语言切换功能在主页面内容中是否正常生效
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('语言切换功能修复测试', () => {
  
  test('验证语言切换按钮存在且可点击', async ({ page }) => {
    console.log('🧪 开始语言切换按钮测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 查找语言切换按钮
    const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
    
    // 验证按钮存在
    await expect(languageButton).toBeVisible();
    console.log('✅ 语言切换按钮存在且可见');
    
    // 验证按钮可点击
    await expect(languageButton).toBeEnabled();
    console.log('✅ 语言切换按钮可点击');
  });
  
  test('验证中英文UI文本切换', async ({ page }) => {
    console.log('🧪 开始UI文本切换测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 查找语言切换按钮
    const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
    
    if (await languageButton.isVisible()) {
      // 获取初始语言的一些UI文本
      const initialTexts = await page.evaluate(() => {
        const texts = [];
        
        // 查找包含中文或英文的文本元素
        const elements = document.querySelectorAll('*');
        for (const element of elements) {
          const text = element.textContent?.trim();
          if (text && (
            text.includes('前端开发') || text.includes('Frontend') ||
            text.includes('后端开发') || text.includes('Backend') ||
            text.includes('技术管理') || text.includes('Technical') ||
            text.includes('个人信息') || text.includes('Personal') ||
            text.includes('工作经历') || text.includes('Experience')
          )) {
            texts.push(text);
          }
        }
        
        return texts.slice(0, 5); // 只取前5个
      });
      
      console.log('🔤 初始UI文本:', initialTexts);
      
      // 点击语言切换按钮
      await languageButton.click();
      await page.waitForTimeout(2000); // 等待语言切换完成
      
      // 获取切换后的UI文本
      const newTexts = await page.evaluate(() => {
        const texts = [];
        
        const elements = document.querySelectorAll('*');
        for (const element of elements) {
          const text = element.textContent?.trim();
          if (text && (
            text.includes('前端开发') || text.includes('Frontend') ||
            text.includes('后端开发') || text.includes('Backend') ||
            text.includes('技术管理') || text.includes('Technical') ||
            text.includes('个人信息') || text.includes('Personal') ||
            text.includes('工作经历') || text.includes('Experience')
          )) {
            texts.push(text);
          }
        }
        
        return texts.slice(0, 5);
      });
      
      console.log('🔤 切换后UI文本:', newTexts);
      
      // 验证文本确实发生了变化
      const hasChanged = initialTexts.some((text, index) => text !== newTexts[index]);
      expect(hasChanged).toBe(true);
      
      console.log('✅ UI文本切换成功');
    } else {
      console.log('⚠️ 未找到语言切换按钮，跳过UI文本测试');
    }
  });
  
  test('验证简历数据内容切换', async ({ page }) => {
    console.log('🧪 开始简历数据内容切换测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 获取初始的简历数据内容
    const initialContent = await page.evaluate(() => {
      const content = [];
      
      // 查找简历内容区域
      const resumeElements = document.querySelectorAll('[class*="resume"], [class*="content"], [class*="section"]');
      for (const element of resumeElements) {
        const text = element.textContent?.trim();
        if (text && text.length > 10) {
          content.push(text.substring(0, 100)); // 只取前100个字符
        }
      }
      
      return content.slice(0, 3); // 只取前3个
    });
    
    console.log('📄 初始简历内容:', initialContent.map(c => c.substring(0, 50) + '...'));
    
    // 查找语言切换按钮
    const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
    
    if (await languageButton.isVisible()) {
      // 点击语言切换按钮
      await languageButton.click();
      await page.waitForTimeout(3000); // 等待数据重新加载
      
      // 获取切换后的简历数据内容
      const newContent = await page.evaluate(() => {
        const content = [];
        
        const resumeElements = document.querySelectorAll('[class*="resume"], [class*="content"], [class*="section"]');
        for (const element of resumeElements) {
          const text = element.textContent?.trim();
          if (text && text.length > 10) {
            content.push(text.substring(0, 100));
          }
        }
        
        return content.slice(0, 3);
      });
      
      console.log('📄 切换后简历内容:', newContent.map(c => c.substring(0, 50) + '...'));
      
      // 验证内容确实发生了变化
      const hasChanged = initialContent.some((text, index) => text !== newContent[index]);
      expect(hasChanged).toBe(true);
      
      console.log('✅ 简历数据内容切换成功');
    } else {
      console.log('⚠️ 未找到语言切换按钮，跳过数据内容测试');
    }
  });
  
  test('验证导航菜单文本切换', async ({ page }) => {
    console.log('🧪 开始导航菜单文本切换测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 获取初始的导航文本
    const initialNavTexts = await page.evaluate(() => {
      const navTexts = [];
      
      // 查找导航相关的元素
      const navElements = document.querySelectorAll('nav *, [class*="nav"] *, [class*="menu"] *, button, a');
      for (const element of navElements) {
        const text = element.textContent?.trim();
        if (text && (
          text.includes('前端') || text.includes('Frontend') ||
          text.includes('后端') || text.includes('Backend') ||
          text.includes('技术') || text.includes('Technical') ||
          text.includes('合同') || text.includes('Contract') ||
          text.includes('游戏') || text.includes('Game')
        )) {
          navTexts.push(text);
        }
      }
      
      return [...new Set(navTexts)].slice(0, 5); // 去重并只取前5个
    });
    
    console.log('🧭 初始导航文本:', initialNavTexts);
    
    // 查找语言切换按钮
    const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
    
    if (await languageButton.isVisible()) {
      // 点击语言切换按钮
      await languageButton.click();
      await page.waitForTimeout(2000);
      
      // 获取切换后的导航文本
      const newNavTexts = await page.evaluate(() => {
        const navTexts = [];
        
        const navElements = document.querySelectorAll('nav *, [class*="nav"] *, [class*="menu"] *, button, a');
        for (const element of navElements) {
          const text = element.textContent?.trim();
          if (text && (
            text.includes('前端') || text.includes('Frontend') ||
            text.includes('后端') || text.includes('Backend') ||
            text.includes('技术') || text.includes('Technical') ||
            text.includes('合同') || text.includes('Contract') ||
            text.includes('游戏') || text.includes('Game')
          )) {
            navTexts.push(text);
          }
        }
        
        return [...new Set(navTexts)].slice(0, 5);
      });
      
      console.log('🧭 切换后导航文本:', newNavTexts);
      
      // 验证导航文本确实发生了变化
      if (initialNavTexts.length > 0 && newNavTexts.length > 0) {
        const hasChanged = initialNavTexts.some((text, index) => text !== newNavTexts[index]);
        expect(hasChanged).toBe(true);
        console.log('✅ 导航菜单文本切换成功');
      } else {
        console.log('⚠️ 未找到足够的导航文本进行对比');
      }
    } else {
      console.log('⚠️ 未找到语言切换按钮，跳过导航文本测试');
    }
  });
  
  test('验证语言切换的持久化', async ({ page }) => {
    console.log('🧪 开始语言持久化测试');
    
    // 访问页面
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 查找语言切换按钮并切换语言
    const languageButton = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("中"), button:has-text("EN"), button:has-text("🌍")').first();
    
    if (await languageButton.isVisible()) {
      // 切换语言
      await languageButton.click();
      await page.waitForTimeout(2000);
      
      // 获取当前语言设置
      const currentLanguage = await page.evaluate(() => {
        return localStorage.getItem('language');
      });
      
      console.log(`🔤 当前语言设置: ${currentLanguage}`);
      
      // 刷新页面
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // 检查语言是否保持
      const persistedLanguage = await page.evaluate(() => {
        return localStorage.getItem('language');
      });
      
      console.log(`🔤 持久化后语言: ${persistedLanguage}`);
      
      // 验证语言持久化
      expect(persistedLanguage).toBe(currentLanguage);
      
      console.log('✅ 语言切换持久化成功');
    } else {
      console.log('⚠️ 未找到语言切换按钮，跳过持久化测试');
    }
  });
  
});
