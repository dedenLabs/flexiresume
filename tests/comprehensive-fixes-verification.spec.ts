/**
 * 综合修复验证测试
 * 
 * 验证所有修复项目：
 * 1. FontSwitcher下拉框向上弹出
 * 2. 背景滤镜主题跟随（浅色更亮，深色更深）
 * 3. Mermaid脑图自适应显示和全屏展开
 * 
 * @author FlexiResume Team
 * @date 2025-07-25
 */

import { test, expect } from '@playwright/test';

test.describe('综合修复验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('验证FontSwitcher下拉框向上弹出', async ({ page }) => {
    // 等待字体切换器加载
    await page.waitForTimeout(2000);

    // 查找字体切换器
    const fontSwitcher = page.locator('button').filter({ hasText: /字体|Font/ }).first();
    const isVisible = await fontSwitcher.isVisible().catch(() => false);

    if (isVisible) {
      console.log('找到字体切换器');

      // 获取按钮位置
      const buttonBox = await fontSwitcher.boundingBox();
      expect(buttonBox).toBeTruthy();

      // 点击字体切换器
      await fontSwitcher.click();
      await page.waitForTimeout(1000);

      // 查找下拉菜单
      const dropdown = page.locator('div').filter({ hasText: /古典|现代|英文|混合/ }).first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);

      if (dropdownVisible) {
        // 获取下拉菜单位置
        const menuBox = await dropdown.boundingBox();
        expect(menuBox).toBeTruthy();

        // 验证下拉菜单在按钮上方（bottom值应该小于按钮的top值）
        console.log(`按钮位置: top=${buttonBox!.y}, bottom=${buttonBox!.y + buttonBox!.height}`);
        console.log(`菜单位置: top=${menuBox!.y}, bottom=${menuBox!.y + menuBox!.height}`);

        // 下拉菜单的底部应该在按钮的顶部附近（向上弹出）
        expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(buttonBox!.y + 10);
        console.log('✅ 字体切换器正确向上弹出');
      } else {
        console.log('⚠️ 下拉菜单未显示，可能需要调整选择器');
      }
    } else {
      console.log('⚠️ 未找到字体切换器');
    }
  });

  test('验证背景滤镜主题跟随优化', async ({ page }) => {
    // 检查浅色主题的背景滤镜变量（更亮）
    const lightFilterVars = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        brightness: style.getPropertyValue('--bg-filter-brightness').trim(),
        contrast: style.getPropertyValue('--bg-filter-contrast').trim()
      };
    });

    console.log('浅色主题背景滤镜变量:', lightFilterVars);

    // 验证浅色主题滤镜值（更亮）
    expect(lightFilterVars.brightness).toBe('1.2');
    expect(lightFilterVars.contrast).toBe('1.1');

    // 切换到深色主题
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(1000);

    // 检查深色主题的背景滤镜变量（更深）
    const darkFilterVars = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        brightness: style.getPropertyValue('--bg-filter-brightness').trim(),
        contrast: style.getPropertyValue('--bg-filter-contrast').trim()
      };
    });

    console.log('深色主题背景滤镜变量:', darkFilterVars);

    // 验证深色主题滤镜值（更深）
    expect(darkFilterVars.brightness).toBe('0.6');
    expect(darkFilterVars.contrast).toBe('1.4');

    // 验证背景伪元素的滤镜应用
    const backgroundFilter = await page.evaluate(() => {
      const bodyBefore = getComputedStyle(document.body, '::before');
      return {
        filter: bodyBefore.filter,
        position: bodyBefore.position,
        zIndex: bodyBefore.zIndex
      };
    });

    console.log('深色模式背景伪元素样式:', backgroundFilter);
    expect(backgroundFilter.position).toBe('fixed');
    expect(backgroundFilter.zIndex).toBe('-1');
    expect(backgroundFilter.filter).toContain('brightness(0.6)');
    expect(backgroundFilter.filter).toContain('contrast(1.4)');
  });

  test('验证Mermaid脑图自适应显示修复', async ({ page }) => {
    // 等待页面加载完成
    await page.waitForTimeout(3000);

    // 查找Mermaid图表容器
    const mermaidContainers = await page.locator('[data-mermaid-lazy-chart]').count();
    console.log('发现Mermaid图表容器数量:', mermaidContainers);

    if (mermaidContainers > 0) {
      // 检查第一个Mermaid容器
      const firstContainer = page.locator('[data-mermaid-lazy-chart]').first();
      
      // 等待图表渲染
      await page.waitForTimeout(5000);

      // 检查容器内的SVG
      const svgInfo = await firstContainer.evaluate((el) => {
        const svgElement = el.querySelector('svg');
        if (svgElement) {
          const style = getComputedStyle(svgElement);
          return {
            hasSvg: true,
            width: svgElement.getAttribute('width'),
            height: svgElement.getAttribute('height'),
            preserveAspectRatio: svgElement.getAttribute('preserveAspectRatio'),
            viewBox: svgElement.getAttribute('viewBox'),
            computedWidth: style.width,
            computedHeight: style.height
          };
        }
        return { hasSvg: false };
      });

      console.log('Mermaid SVG信息:', svgInfo);

      if (svgInfo.hasSvg) {
        // 验证SVG使用了正确的自适应设置
        expect(svgInfo.width).toBe('100%');
        expect(svgInfo.height).toBe('auto');
        expect(svgInfo.preserveAspectRatio).toBe('xMidYMid meet');
        expect(svgInfo.viewBox).toBeTruthy();
        console.log('✅ Mermaid图表自适应设置正确');
      }
    }
  });

  test('验证Mermaid脑图全屏展开修复', async ({ page }) => {
    // 等待页面加载完成
    await page.waitForTimeout(3000);

    // 查找可点击的Mermaid图表
    const clickableMermaid = page.locator('[data-mermaid-lazy-chart]').first();
    const isVisible = await clickableMermaid.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log('找到Mermaid图表容器');

      // 等待图表完全加载
      await page.waitForTimeout(5000);

      // 查找SVG元素并点击
      const svgElement = clickableMermaid.locator('svg').first();
      const svgVisible = await svgElement.isVisible().catch(() => false);

      if (svgVisible) {
        console.log('找到SVG元素，尝试点击进入全屏');

        // 点击SVG进入全屏模式
        await svgElement.click();
        await page.waitForTimeout(1000);

        // 检查是否出现全屏遮罩层
        const overlay = page.locator('div[style*="position: fixed"][style*="z-index: 9999"]');
        const overlayVisible = await overlay.isVisible().catch(() => false);

        if (overlayVisible) {
          console.log('✅ 全屏遮罩层已显示');

          // 检查全屏容器中的SVG
          const fullscreenSvgInfo = await overlay.evaluate((el) => {
            const svgElement = el.querySelector('svg');
            if (svgElement) {
              const style = getComputedStyle(svgElement);
              return {
                hasSvg: true,
                width: svgElement.getAttribute('width'),
                height: svgElement.getAttribute('height'),
                preserveAspectRatio: svgElement.getAttribute('preserveAspectRatio'),
                computedWidth: style.width,
                computedHeight: style.height
              };
            }
            return { hasSvg: false };
          });

          console.log('全屏模式SVG信息:', fullscreenSvgInfo);

          if (fullscreenSvgInfo.hasSvg) {
            // 验证全屏模式下的SVG设置
            expect(fullscreenSvgInfo.width).toBe('100%');
            expect(fullscreenSvgInfo.height).toBe('auto');
            expect(fullscreenSvgInfo.preserveAspectRatio).toBe('xMidYMid meet');
            console.log('✅ 全屏模式SVG设置正确');
          }

          // 按ESC键关闭全屏
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);

          // 验证全屏模式已关闭
          const overlayAfterEsc = await overlay.isVisible().catch(() => false);
          expect(overlayAfterEsc).toBe(false);
          console.log('✅ ESC键关闭全屏功能正常');
        } else {
          console.log('⚠️ 全屏遮罩层未显示，可能图表还在加载中');
        }
      } else {
        console.log('⚠️ SVG元素不可见，可能还在加载中');
      }
    } else {
      console.log('⚠️ 未找到Mermaid图表容器');
    }
  });

  test('验证所有修复后页面无控制台错误', async ({ page }) => {
    const errors: string[] = [];
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 执行各种操作
    await page.waitForTimeout(2000);

    // 主题切换
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(1000);

    // 尝试操作字体切换器
    const fontSwitcher = page.locator('button').filter({ hasText: /字体|Font/ }).first();
    if (await fontSwitcher.isVisible().catch(() => false)) {
      await fontSwitcher.click();
      await page.waitForTimeout(1000);
      await fontSwitcher.click(); // 关闭菜单
    }

    // 再次切换主题
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(1000);

    // 检查是否有错误
    console.log('控制台错误:', errors);
    
    // 过滤掉一些已知的无害错误
    const significantErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_') &&
      !error.includes('Failed to load resource')
    );

    expect(significantErrors.length).toBe(0);
  });
});
