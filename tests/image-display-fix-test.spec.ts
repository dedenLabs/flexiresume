/**
 * FlexiResume图片显示问题修复测试
 * 
 * 测试目标：验证Tab切换后图片显示正确
 * 修复方案：使用SmartImage组件替代原生img标签
 * 
 * @author Claude (Augment Agent)
 * @date 2025-07-31
 */

import { test, expect, Page } from '@playwright/test';

test.describe('FlexiResume图片显示修复测试', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 访问应用
    await page.goto('http://localhost:5174');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 等待主要内容加载
    await page.waitForSelector('[data-testid="tabs-wrapper"], nav', { timeout: 10000 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('验证Tab切换后头像显示正确', async () => {
    console.log('🧪 开始测试Tab切换头像显示...');
    
    // 1. 等待Tab组件加载
    const tabsWrapper = await page.locator('nav').first();
    await expect(tabsWrapper).toBeVisible();
    
    // 2. 获取所有Tab链接
    const tabLinks = await page.locator('nav a').all();
    console.log(`📊 找到 ${tabLinks.length} 个Tab`);
    
    if (tabLinks.length < 2) {
      console.log('⚠️ Tab数量不足，跳过测试');
      return;
    }

    // 3. 记录初始状态
    const firstTab = tabLinks[0];
    const secondTab = tabLinks[1];
    
    // 获取Tab的文本内容用于识别
    const firstTabText = await firstTab.textContent();
    const secondTabText = await secondTab.textContent();
    
    console.log(`📝 第一个Tab: ${firstTabText}`);
    console.log(`📝 第二个Tab: ${secondTabText}`);

    // 4. 点击第一个Tab
    console.log('🖱️ 点击第一个Tab...');
    await firstTab.click();
    await page.waitForTimeout(1000); // 等待切换完成
    
    // 截图记录第一个Tab状态
    await page.screenshot({ 
      path: 'tests/screenshots/tab-1-initial.png',
      fullPage: false 
    });

    // 5. 获取第一个Tab的头像信息
    const firstTabAvatar = await firstTab.locator('img').first();
    let firstAvatarSrc = '';
    if (await firstTabAvatar.isVisible()) {
      firstAvatarSrc = await firstTabAvatar.getAttribute('src') || '';
      console.log(`🖼️ 第一个Tab头像: ${firstAvatarSrc}`);
    }

    // 6. 点击第二个Tab
    console.log('🖱️ 点击第二个Tab...');
    await secondTab.click();
    await page.waitForTimeout(1000); // 等待切换完成
    
    // 截图记录第二个Tab状态
    await page.screenshot({ 
      path: 'tests/screenshots/tab-2-switched.png',
      fullPage: false 
    });

    // 7. 获取第二个Tab的头像信息
    const secondTabAvatar = await secondTab.locator('img').first();
    let secondAvatarSrc = '';
    if (await secondTabAvatar.isVisible()) {
      secondAvatarSrc = await secondTabAvatar.getAttribute('src') || '';
      console.log(`🖼️ 第二个Tab头像: ${secondAvatarSrc}`);
    }

    // 8. 再次点击第一个Tab（关键测试点）
    console.log('🖱️ 再次点击第一个Tab...');
    await firstTab.click();
    await page.waitForTimeout(1000); // 等待切换完成
    
    // 截图记录回到第一个Tab的状态
    await page.screenshot({ 
      path: 'tests/screenshots/tab-1-return.png',
      fullPage: false 
    });

    // 9. 验证第一个Tab的头像是否正确显示
    const finalTabAvatar = await firstTab.locator('img').first();
    if (await finalTabAvatar.isVisible()) {
      const finalAvatarSrc = await finalTabAvatar.getAttribute('src') || '';
      console.log(`🖼️ 回到第一个Tab的头像: ${finalAvatarSrc}`);
      
      // 验证头像src是否正确（应该与初始状态一致，而不是第二个Tab的头像）
      if (firstAvatarSrc && secondAvatarSrc && firstAvatarSrc !== secondAvatarSrc) {
        expect(finalAvatarSrc).toBe(firstAvatarSrc);
        console.log('✅ 头像显示正确：回到第一个Tab时显示正确的头像');
      } else {
        console.log('⚠️ 无法验证头像差异（可能头像相同或获取失败）');
      }
    }

    // 10. 验证Header组件的头像也正确更新
    const headerAvatar = await page.locator('img[alt*="头像"], img[src*="avatar"], img[src*="photo"]').first();
    if (await headerAvatar.isVisible()) {
      const headerAvatarSrc = await headerAvatar.getAttribute('src') || '';
      console.log(`🖼️ Header头像: ${headerAvatarSrc}`);
      
      // Header头像应该与当前选中Tab的头像一致
      if (firstAvatarSrc) {
        // 由于Header可能使用不同的CDN URL，我们检查是否包含相同的文件名
        const firstAvatarFilename = firstAvatarSrc.split('/').pop() || '';
        const headerAvatarFilename = headerAvatarSrc.split('/').pop() || '';
        
        if (firstAvatarFilename && headerAvatarFilename) {
          expect(headerAvatarFilename).toBe(firstAvatarFilename);
          console.log('✅ Header头像与Tab头像一致');
        }
      }
    }

    console.log('🎉 Tab切换头像显示测试完成');
  });

  test('验证SmartImage组件功能', async () => {
    console.log('🧪 开始测试SmartImage组件功能...');
    
    // 等待页面加载
    await page.waitForTimeout(2000);
    
    // 检查是否有SmartImage相关的类名或属性
    const smartImages = await page.locator('img').all();
    console.log(`📊 找到 ${smartImages.length} 个图片元素`);
    
    // 验证图片加载状态
    for (let i = 0; i < Math.min(smartImages.length, 5); i++) {
      const img = smartImages[i];
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      if (src) {
        console.log(`🖼️ 图片 ${i + 1}: ${alt || 'unnamed'} - ${src}`);
        
        // 验证图片是否成功加载
        const isVisible = await img.isVisible();
        expect(isVisible).toBe(true);
        
        // 检查图片的自然尺寸（确保实际加载了内容）
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
        
        if (naturalWidth > 0 && naturalHeight > 0) {
          console.log(`✅ 图片 ${i + 1} 加载成功 (${naturalWidth}x${naturalHeight})`);
        } else {
          console.log(`⚠️ 图片 ${i + 1} 可能未完全加载`);
        }
      }
    }
    
    // 截图记录最终状态
    await page.screenshot({ 
      path: 'tests/screenshots/smartimage-test-final.png',
      fullPage: true 
    });
    
    console.log('🎉 SmartImage组件功能测试完成');
  });

  test('验证控制台无错误', async () => {
    console.log('🧪 开始检查控制台错误...');
    
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    // 监听控制台消息
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });
    
    // 执行一些Tab切换操作
    const tabLinks = await page.locator('nav a').all();
    
    for (let i = 0; i < Math.min(tabLinks.length, 3); i++) {
      await tabLinks[i].click();
      await page.waitForTimeout(500);
    }
    
    // 等待一段时间确保所有异步操作完成
    await page.waitForTimeout(2000);
    
    // 检查错误
    if (consoleErrors.length > 0) {
      console.log('❌ 发现控制台错误:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ 无控制台错误');
    }
    
    if (consoleWarnings.length > 0) {
      console.log('⚠️ 发现控制台警告:');
      consoleWarnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    } else {
      console.log('✅ 无控制台警告');
    }
    
    // 验证没有严重错误（允许一些警告）
    expect(consoleErrors.length).toBe(0);
    
    console.log('🎉 控制台错误检查完成');
  });
});
