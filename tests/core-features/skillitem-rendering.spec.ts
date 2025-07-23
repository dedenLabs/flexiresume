import { test, expect } from '@playwright/test';

test.describe('SkillItem渲染验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('应该正确渲染skillitem组件', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 查找包含skillitem的元素
    const skillItems = page.locator('[data-skill-name]');
    
    // 验证至少有一些skillitem被渲染
    const skillItemCount = await skillItems.count();
    console.log(`找到 ${skillItemCount} 个skillitem元素`);
    
    if (skillItemCount > 0) {
      // 验证第一个skillitem的属性
      const firstSkillItem = skillItems.first();
      const skillName = await firstSkillItem.getAttribute('data-skill-name');
      const skillLevel = await firstSkillItem.getAttribute('data-skill-level');
      
      console.log(`第一个skillitem: ${skillName}, 等级: ${skillLevel}`);
      
      expect(skillName).toBeTruthy();
      expect(skillLevel).toBeTruthy();
      
      // 验证skillitem是可见的
      await expect(firstSkillItem).toBeVisible();
    }
  });

  test('SecureContentRenderer应该保留skill相关的data属性', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 检查页面中是否有skill相关的data属性
    const elementsWithSkillData = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-skill-name], [data-skill-level]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        skillName: el.getAttribute('data-skill-name'),
        skillLevel: el.getAttribute('data-skill-level'),
        textContent: el.textContent?.trim().substring(0, 50)
      }));
    });

    console.log('找到的skill元素:', elementsWithSkillData);
    
    // 验证至少有一些元素包含skill数据
    expect(elementsWithSkillData.length).toBeGreaterThan(0);
    
    // 验证这些元素有正确的属性
    for (const element of elementsWithSkillData) {
      if (element.skillName) {
        expect(element.skillName).toBeTruthy();
      }
      if (element.skillLevel) {
        expect(element.skillLevel).toBeTruthy();
      }
    }
  });

  test('SkillRenderer应该正确处理HTML内容中的skillitem', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 检查是否有SkillRenderer组件
    const skillRenderers = page.locator('.skill-renderer, [data-skill-renderer]');
    const rendererCount = await skillRenderers.count();
    
    console.log(`找到 ${rendererCount} 个SkillRenderer组件`);
    
    if (rendererCount > 0) {
      // 在SkillRenderer内部查找skillitem
      const skillItemsInRenderer = skillRenderers.locator('[data-skill-name]');
      const itemCount = await skillItemsInRenderer.count();
      
      console.log(`SkillRenderer内部找到 ${itemCount} 个skillitem`);
      
      if (itemCount > 0) {
        // 验证skillitem在SkillRenderer中正确渲染
        const firstItem = skillItemsInRenderer.first();
        await expect(firstItem).toBeVisible();
        
        const skillName = await firstItem.getAttribute('data-skill-name');
        expect(skillName).toBeTruthy();
      }
    }
  });

  test('不同路由页面的skillitem都应该正确渲染', async ({ page }) => {
    const routes = ['/fullstack', '/games', '/tools', '/operations'];
    
    for (const route of routes) {
      console.log(`测试路由: ${route}`);
      
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // 查找skillitem
      const skillItems = page.locator('[data-skill-name]');
      const count = await skillItems.count();
      
      console.log(`路由 ${route} 找到 ${count} 个skillitem`);
      
      // 每个路由至少应该有一些skillitem（如果该路由包含技能内容）
      if (count > 0) {
        const firstItem = skillItems.first();
        await expect(firstItem).toBeVisible();
        
        const skillName = await firstItem.getAttribute('data-skill-name');
        expect(skillName).toBeTruthy();
      }
    }
  });

  test('SecureContentRenderer的trustedZone模式应该正常工作', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 检查控制台是否有SecureContentRenderer相关的错误
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('SecureContentRenderer')) {
        consoleErrors.push(msg.text());
      }
    });

    // 等待一段时间收集可能的错误
    await page.waitForTimeout(2000);

    // 验证没有SecureContentRenderer相关的错误
    expect(consoleErrors).toHaveLength(0);

    // 验证页面中有正确渲染的内容
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('切换主题时skillitem应该保持正确渲染', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 记录初始的skillitem数量
    const initialSkillItems = await page.locator('[data-skill-name]').count();
    console.log(`初始skillitem数量: ${initialSkillItems}`);

    // 切换主题
    const themeButton = page.locator('[data-testid="theme-switcher"]');
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(1000);
    }

    // 检查主题切换后的skillitem数量
    const afterThemeSkillItems = await page.locator('[data-skill-name]').count();
    console.log(`主题切换后skillitem数量: ${afterThemeSkillItems}`);

    // 验证skillitem数量没有变化
    expect(afterThemeSkillItems).toBe(initialSkillItems);

    // 如果有skillitem，验证它们仍然可见
    if (afterThemeSkillItems > 0) {
      const firstItem = page.locator('[data-skill-name]').first();
      await expect(firstItem).toBeVisible();
    }
  });

  test('切换语言时skillitem应该保持正确渲染', async ({ page }) => {
    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 记录初始的skillitem数量
    const initialSkillItems = await page.locator('[data-skill-name]').count();
    console.log(`初始skillitem数量: ${initialSkillItems}`);

    // 切换语言
    const languageButton = page.locator('[data-testid="language-switcher"]');
    if (await languageButton.isVisible()) {
      await languageButton.click();
      await page.waitForTimeout(1000);
    }

    // 检查语言切换后的skillitem数量
    const afterLanguageSkillItems = await page.locator('[data-skill-name]').count();
    console.log(`语言切换后skillitem数量: ${afterLanguageSkillItems}`);

    // 验证skillitem数量没有变化
    expect(afterLanguageSkillItems).toBe(initialSkillItems);

    // 如果有skillitem，验证它们仍然可见
    if (afterLanguageSkillItems > 0) {
      const firstItem = page.locator('[data-skill-name]').first();
      await expect(firstItem).toBeVisible();
    }
  });
});
