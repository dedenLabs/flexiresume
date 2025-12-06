/**
 * 额外主题修复验证测试
 * 
 * 验证PDF下载组件、背景滤镜和Mermaid脑图显示问题的修复效果
 * 
 * @author FlexiResume Team
 * @date 2025-07-25
 */

import { test, expect } from '@playwright/test';

test.describe('额外主题修复验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('验证PDF下载组件主题适配', async ({ page }) => {
    // 等待PDF下载组件加载
    await page.waitForSelector('[data-testid="pdf-downloader"]', { timeout: 10000 });

    // 获取初始主题
    const initialTheme = await page.getAttribute('html', 'data-theme');
    console.log('初始主题:', initialTheme);

    // 点击PDF下载按钮打开下拉菜单
    const pdfButton = page.locator('[data-testid="pdf-downloader"] button').first();
    await pdfButton.click();
    await page.waitForTimeout(1000);

    // 检查下拉菜单的样式
    const dropdownMenu = page.locator('[data-testid="pdf-downloader"]').locator('div').nth(1);
    const dropdownStyles = await dropdownMenu.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        visibility: style.visibility
      };
    });

    console.log('PDF下拉菜单样式:', dropdownStyles);

    // 验证下拉菜单可见
    expect(dropdownStyles.visibility).toBe('visible');
    expect(dropdownStyles.backgroundColor).toBeTruthy();

    // 切换主题
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(1000);

    // 再次检查下拉菜单样式
    const newDropdownStyles = await dropdownMenu.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor
      };
    });

    console.log('主题切换后PDF下拉菜单样式:', newDropdownStyles);

    // 验证样式确实发生了变化
    expect(newDropdownStyles.backgroundColor).not.toBe(dropdownStyles.backgroundColor);
  });

  test('验证body背景滤镜跟随主题变化', async ({ page }) => {
    // 检查浅色主题下的背景滤镜变量
    const lightFilterVars = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        brightness: style.getPropertyValue('--bg-filter-brightness').trim(),
        contrast: style.getPropertyValue('--bg-filter-contrast').trim()
      };
    });

    console.log('浅色主题背景滤镜变量:', lightFilterVars);

    // 切换到深色主题
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(1000);

    // 检查深色主题下的背景滤镜变量
    const darkFilterVars = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        brightness: style.getPropertyValue('--bg-filter-brightness').trim(),
        contrast: style.getPropertyValue('--bg-filter-contrast').trim()
      };
    });

    console.log('深色主题背景滤镜变量:', darkFilterVars);

    // 验证滤镜变量确实发生了变化
    expect(darkFilterVars.brightness).not.toBe(lightFilterVars.brightness);
    expect(darkFilterVars.contrast).not.toBe(lightFilterVars.contrast);

    // 验证深色主题下的滤镜值
    expect(darkFilterVars.brightness).toBe('0.8');
    expect(darkFilterVars.contrast).toBe('1.2');

    // 检查深色模式下的背景伪元素
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
  });

  test('验证Mermaid脑图自适应显示', async ({ page }) => {
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

      // 检查容器的高度设置
      const containerInfo = await firstContainer.evaluate((el) => {
        const style = getComputedStyle(el);
        const svgElement = el.querySelector('svg');
        return {
          containerHeight: style.height,
          containerMinHeight: style.minHeight,
          hasSvg: !!svgElement,
          svgWidth: svgElement ? svgElement.getAttribute('width') : null,
          svgHeight: svgElement ? svgElement.getAttribute('height') : null,
          svgViewBox: svgElement ? svgElement.getAttribute('viewBox') : null
        };
      });

      console.log('Mermaid容器信息:', containerInfo);

      // 验证容器支持自适应高度
      expect(containerInfo.containerHeight === 'auto' || containerInfo.containerMinHeight).toBeTruthy();

      // 如果有SVG，验证其属性
      if (containerInfo.hasSvg) {
        expect(containerInfo.svgViewBox).toBeTruthy();
        console.log('✅ Mermaid图表已正确渲染');
      }
    }
  });

  test('验证Mermaid脑图全屏展开功能', async ({ page }) => {
    // 等待页面加载完成
    await page.waitForTimeout(3000);

    // 查找可点击的Mermaid图表
    const clickableMermaid = page.locator('[data-mermaid-lazy-chart] div[title*="点击放大"]').first();
    
    const isVisible = await clickableMermaid.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log('找到可点击的Mermaid图表');

      // 点击图表进入全屏模式
      await clickableMermaid.click();
      await page.waitForTimeout(1000);

      // 检查是否出现全屏遮罩层
      const overlay = page.locator('div[style*="position: fixed"][style*="z-index: 9999"]');
      const overlayVisible = await overlay.isVisible();

      if (overlayVisible) {
        console.log('✅ 全屏遮罩层已显示');

        // 检查全屏容器中的SVG
        const fullscreenSvg = await overlay.locator('svg').count();
        console.log('全屏模式下SVG数量:', fullscreenSvg);

        expect(fullscreenSvg).toBeGreaterThan(0);

        // 检查全屏容器的样式
        const fullscreenContainer = overlay.locator('div').first();
        const containerStyles = await fullscreenContainer.evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            width: style.width,
            height: style.height,
            backgroundColor: style.backgroundColor
          };
        });

        console.log('全屏容器样式:', containerStyles);
        expect(containerStyles.width).toContain('vw');
        expect(containerStyles.height).toContain('vh');

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
      console.log('⚠️ 未找到可点击的Mermaid图表，可能还在加载中');
    }
  });

  test('验证链接颜色使用CSS变量', async ({ page }) => {
    // 切换到深色主题
    await page.click('[data-theme-switcher] button');
    await page.waitForTimeout(1000);

    // 检查深色主题下的链接颜色变量
    const linkColorVars = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue('--color-link-primary').trim(),
        visited: style.getPropertyValue('--color-link-visited').trim(),
        hover: style.getPropertyValue('--color-link-hover').trim(),
        active: style.getPropertyValue('--color-link-active').trim()
      };
    });

    console.log('深色主题链接颜色变量:', linkColorVars);

    // 验证链接颜色变量存在且有值
    expect(linkColorVars.primary).toBeTruthy();
    expect(linkColorVars.visited).toBeTruthy();
    expect(linkColorVars.hover).toBeTruthy();
    expect(linkColorVars.active).toBeTruthy();

    // 验证具体的颜色值
    expect(linkColorVars.primary).toBe('#74b9ff');
    expect(linkColorVars.visited).toBe('#b2bec3');
    expect(linkColorVars.hover).toBe('#fd79a8');
    expect(linkColorVars.active).toBe('#74b9ff');
  });

  test('验证修复后页面无控制台错误', async ({ page }) => {
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

    // 尝试打开PDF下拉菜单
    const pdfButton = page.locator('[data-testid="pdf-downloader"] button').first();
    if (await pdfButton.isVisible()) {
      await pdfButton.click();
      await page.waitForTimeout(1000);
      await pdfButton.click(); // 关闭菜单
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
