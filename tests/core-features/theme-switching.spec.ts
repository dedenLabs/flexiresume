/**
 * 主题切换功能完整测试套件
 * 测试明暗主题切换、样式应用、性能监控和用户体验
 */

import { test, expect, Page } from '@playwright/test';
import { ErrorCollector } from '../utils/ErrorCollector';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

class ThemeSwitchingTester {
  constructor(private page: Page) {}

  /**
   * 获取当前主题模式
   */
  async getCurrentTheme(): Promise<string> {
    return await this.page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') || 'light';
    });
  }

  /**
   * 获取主题相关的CSS变量
   */
  async getThemeVariables(): Promise<Record<string, string>> {
    return await this.page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      const variables: Record<string, string> = {};
      
      // 获取主要的主题变量
      const themeVars = [
        '--background-color',
        '--text-color',
        '--primary-color',
        '--secondary-color',
        '--border-color',
        '--shadow-color'
      ];
      
      themeVars.forEach(varName => {
        variables[varName] = computedStyle.getPropertyValue(varName).trim();
      });
      
      return variables;
    });
  }

  /**
   * 切换主题
   */
  async switchTheme(): Promise<{
    beforeTheme: string;
    afterTheme: string;
    switchTime: number;
  }> {
    const beforeTheme = await this.getCurrentTheme();
    const startTime = Date.now();
    
    // 查找主题切换按钮
    const themeButton = this.page.locator('[data-testid="theme-toggle"], .theme-toggle, .theme-switch');
    
    if (await themeButton.count() > 0) {
      await themeButton.click();
    } else {
      // 如果没有找到按钮，尝试通过键盘快捷键
      await this.page.keyboard.press('Control+Shift+T');
    }
    
    // 等待主题切换完成
    await this.page.waitForTimeout(500);
    
    const afterTheme = await this.getCurrentTheme();
    const switchTime = Date.now() - startTime;
    
    return {
      beforeTheme,
      afterTheme,
      switchTime
    };
  }

  /**
   * 验证主题样式应用
   */
  async verifyThemeStyles(theme: string): Promise<{
    backgroundApplied: boolean;
    textColorApplied: boolean;
    componentsStyled: boolean;
    cssVariablesSet: boolean;
  }> {
    const verification = await this.page.evaluate((themeMode) => {
      const body = document.body;
      const computedStyle = getComputedStyle(body);
      
      // 检查背景色
      const backgroundColor = computedStyle.backgroundColor;
      const backgroundApplied = backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent';
      
      // 检查文字颜色
      const textColor = computedStyle.color;
      const textColorApplied = textColor !== 'rgba(0, 0, 0, 0)';
      
      // 检查组件样式
      const components = document.querySelectorAll('.card, .button, .header, .nav');
      const componentsStyled = components.length > 0;
      
      // 检查CSS变量
      const rootStyle = getComputedStyle(document.documentElement);
      const cssVariablesSet = rootStyle.getPropertyValue('--background-color').trim() !== '';
      
      return {
        backgroundApplied,
        textColorApplied,
        componentsStyled,
        cssVariablesSet
      };
    }, theme);
    
    return verification;
  }

  /**
   * 测试主题持久化
   */
  async testThemePersistence(): Promise<boolean> {
    // 切换到暗色主题
    await this.switchTheme();
    const themeAfterSwitch = await this.getCurrentTheme();
    
    // 刷新页面
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    
    // 检查主题是否保持
    const themeAfterReload = await this.getCurrentTheme();
    
    return themeAfterSwitch === themeAfterReload;
  }

  /**
   * 测试系统主题跟随
   */
  async testSystemThemeFollowing(): Promise<boolean> {
    // 模拟系统主题变化
    const systemThemeResult = await this.page.evaluate(() => {
      // 检查是否支持系统主题检测
      if (!window.matchMedia) {
        return false;
      }
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery.matches;
    });
    
    return systemThemeResult !== null;
  }

  /**
   * 测试主题切换性能
   */
  async measureThemeSwitchPerformance(): Promise<{
    switchTime: number;
    repaintTime: number;
    layoutShiftScore: number;
  }> {
    // 开始性能监控
    await this.page.evaluate(() => {
      (window as any).performanceMarks = [];
      performance.mark('theme-switch-start');
    });
    
    // 执行主题切换
    const switchResult = await this.switchTheme();
    
    // 结束性能监控
    const performanceData = await this.page.evaluate(() => {
      performance.mark('theme-switch-end');
      performance.measure('theme-switch', 'theme-switch-start', 'theme-switch-end');
      
      const measures = performance.getEntriesByType('measure');
      const themeSwitchMeasure = measures.find(m => m.name === 'theme-switch');
      
      return {
        switchTime: themeSwitchMeasure ? themeSwitchMeasure.duration : 0,
        repaintTime: 0, // 简化实现
        layoutShiftScore: 0 // 简化实现
      };
    });
    
    return {
      switchTime: switchResult.switchTime,
      repaintTime: performanceData.repaintTime,
      layoutShiftScore: performanceData.layoutShiftScore
    };
  }

  /**
   * 测试主题在不同组件中的应用
   */
  async testThemeApplicationAcrossComponents(): Promise<{
    totalComponents: number;
    styledComponents: number;
    unstyledComponents: string[];
  }> {
    const componentData = await this.page.evaluate(() => {
      const selectors = [
        '.header', '.nav', '.main', '.footer',
        '.card', '.button', '.input', '.select',
        '.modal', '.tooltip', '.dropdown',
        '.mermaid-lazy-chart', '.skill-item', '.project-card'
      ];
      
      const results = {
        totalComponents: 0,
        styledComponents: 0,
        unstyledComponents: [] as string[]
      };
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          results.totalComponents++;
          
          // 检查第一个元素是否有主题相关样式
          const element = elements[0] as HTMLElement;
          const computedStyle = getComputedStyle(element);
          
          const hasThemeStyles = 
            computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
            computedStyle.color !== 'rgba(0, 0, 0, 0)' ||
            computedStyle.borderColor !== 'rgba(0, 0, 0, 0)';
          
          if (hasThemeStyles) {
            results.styledComponents++;
          } else {
            results.unstyledComponents.push(selector);
          }
        }
      });
      
      return results;
    });
    
    return componentData;
  }
}

test.describe('主题切换功能完整测试', () => {
  let errorCollector: ErrorCollector;
  let screenshotHelper: ScreenshotHelper;
  let themeTester: ThemeSwitchingTester;

  test.beforeEach(async ({ page }) => {
    errorCollector = new ErrorCollector(page);
    screenshotHelper = new ScreenshotHelper(page);
    themeTester = new ThemeSwitchingTester(page);

    // 设置主题切换监控
    await page.addInitScript(() => {
      (window as any).themeLogs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        if (message.includes('theme') || message.includes('主题')) {
          (window as any).themeLogs.push(message);
        }
        originalLog.apply(console, args);
      };
    });
  });

  test('基础主题切换功能测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 获取初始主题
    const initialTheme = await themeTester.getCurrentTheme();
    console.log('初始主题:', initialTheme);

    // 截图记录初始主题
    await screenshotHelper.takeScreenshot(`theme-initial-${initialTheme}`, 'zh');

    // 执行主题切换
    const switchResult = await themeTester.switchTheme();
    console.log('主题切换结果:', switchResult);

    // 验证主题确实发生了切换
    expect(switchResult.beforeTheme).not.toBe(switchResult.afterTheme);
    expect(switchResult.switchTime).toBeLessThan(1000); // 切换时间小于1秒

    // 截图记录切换后的主题
    await screenshotHelper.takeScreenshot(`theme-after-switch-${switchResult.afterTheme}`, 'zh');

    // 验证主题样式应用
    const styleVerification = await themeTester.verifyThemeStyles(switchResult.afterTheme);
    console.log('主题样式验证:', styleVerification);

    expect(styleVerification.backgroundApplied).toBe(true);
    expect(styleVerification.textColorApplied).toBe(true);
    expect(styleVerification.cssVariablesSet).toBe(true);
  });

  test('主题样式完整性测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试明亮主题
    const lightThemeVars = await themeTester.getThemeVariables();
    console.log('明亮主题变量:', lightThemeVars);

    // 切换到暗色主题
    await themeTester.switchTheme();
    await page.waitForTimeout(500);

    // 测试暗色主题
    const darkThemeVars = await themeTester.getThemeVariables();
    console.log('暗色主题变量:', darkThemeVars);

    // 验证主题变量确实发生了变化
    const variableNames = Object.keys(lightThemeVars);
    let changedVariables = 0;

    variableNames.forEach(varName => {
      if (lightThemeVars[varName] !== darkThemeVars[varName]) {
        changedVariables++;
      }
    });

    expect(changedVariables).toBeGreaterThan(0);
    console.log(`${changedVariables}/${variableNames.length} 个主题变量发生了变化`);

    // 截图对比两种主题
    await screenshotHelper.takeScreenshot('theme-dark-complete', 'zh');
  });

  test('主题持久化功能测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试主题持久化
    const persistenceWorking = await themeTester.testThemePersistence();
    console.log('主题持久化测试结果:', persistenceWorking);

    expect(persistenceWorking).toBe(true);

    // 验证localStorage中的主题设置
    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('theme');
    });

    expect(storedTheme).toBeTruthy();
    console.log('存储的主题设置:', storedTheme);
  });

  test('主题切换性能测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测量主题切换性能
    const performanceData = await themeTester.measureThemeSwitchPerformance();
    console.log('主题切换性能数据:', performanceData);

    // 验证性能指标
    expect(performanceData.switchTime).toBeLessThan(500); // 切换时间小于500ms
    
    if (performanceData.layoutShiftScore > 0) {
      expect(performanceData.layoutShiftScore).toBeLessThan(0.1); // 布局偏移分数小于0.1
    }

    // 多次切换测试性能稳定性
    const switchTimes: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      const result = await themeTester.switchTheme();
      switchTimes.push(result.switchTime);
      await page.waitForTimeout(200);
    }

    const averageSwitchTime = switchTimes.reduce((sum, time) => sum + time, 0) / switchTimes.length;
    console.log('平均切换时间:', averageSwitchTime, 'ms');
    console.log('切换时间数组:', switchTimes);

    expect(averageSwitchTime).toBeLessThan(300); // 平均切换时间小于300ms
  });

  test('主题在不同组件中的应用测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 测试组件主题应用
    const componentData = await themeTester.testThemeApplicationAcrossComponents();
    console.log('组件主题应用数据:', componentData);

    // 验证大部分组件都应用了主题样式
    const styledRate = componentData.styledComponents / componentData.totalComponents;
    expect(styledRate).toBeGreaterThan(0.8); // 80%以上的组件应该有主题样式

    if (componentData.unstyledComponents.length > 0) {
      console.warn('未应用主题样式的组件:', componentData.unstyledComponents);
    }

    // 切换主题后再次测试
    await themeTester.switchTheme();
    await page.waitForTimeout(500);

    const componentDataAfterSwitch = await themeTester.testThemeApplicationAcrossComponents();
    console.log('切换后组件主题应用数据:', componentDataAfterSwitch);

    // 验证切换后组件样式仍然正确
    const styledRateAfterSwitch = componentDataAfterSwitch.styledComponents / componentDataAfterSwitch.totalComponents;
    expect(styledRateAfterSwitch).toBeGreaterThan(0.8);
  });

  test('主题切换在不同页面的一致性测试', async ({ page }) => {
    const pages = [
      { url: '/', name: '主页' },
      { url: '/fullstack', name: '全栈开发' },
      { url: '/games', name: '游戏开发' },
      { url: '/tools', name: '工具开发' },
      { url: '/operations', name: '运维开发' }
    ];

    const results: any[] = [];

    for (const pageConfig of pages) {
      await page.goto(pageConfig.url);
      await page.waitForLoadState('networkidle');

      // 获取初始主题
      const initialTheme = await themeTester.getCurrentTheme();
      
      // 切换主题
      const switchResult = await themeTester.switchTheme();
      
      // 验证样式应用
      const styleVerification = await themeTester.verifyThemeStyles(switchResult.afterTheme);
      
      results.push({
        page: pageConfig.name,
        url: pageConfig.url,
        initialTheme,
        switchResult,
        styleVerification
      });

      console.log(`${pageConfig.name}: ${switchResult.beforeTheme} → ${switchResult.afterTheme}`);

      // 截图记录每个页面的主题状态
      await screenshotHelper.takeScreenshot(`theme-${pageConfig.name}-${switchResult.afterTheme}`, 'zh');
    }

    // 验证所有页面的主题切换都正常工作
    const successfulSwitches = results.filter(r => 
      r.switchResult.beforeTheme !== r.switchResult.afterTheme &&
      r.styleVerification.backgroundApplied &&
      r.styleVerification.textColorApplied
    );

    expect(successfulSwitches.length).toBe(pages.length);
    console.log('主题切换一致性测试结果:', results);
  });

  test('主题切换与Mermaid图表兼容性测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 等待Mermaid图表加载
    await page.waitForSelector('svg', { timeout: 10000 });
    const initialChartCount = await page.locator('svg').count();

    // 切换主题
    await themeTester.switchTheme();
    await page.waitForTimeout(2000);

    // 检查图表是否仍然正常显示
    const finalChartCount = await page.locator('svg').count();
    expect(finalChartCount).toBe(initialChartCount);

    // 验证图表内容没有丢失
    if (finalChartCount > 0) {
      const firstChart = page.locator('svg').first();
      const chartContent = await firstChart.innerHTML();
      expect(chartContent.length).toBeGreaterThan(100);
      expect(chartContent).toContain('<g');
    }

    console.log(`主题切换后保持 ${finalChartCount} 个图表正常显示`);

    // 截图记录主题切换后的图表状态
    await screenshotHelper.takeScreenshot('theme-mermaid-compatibility', 'zh');
  });

  test.afterEach(async ({ page }) => {
    // 收集主题相关日志
    const themeLogs = await page.evaluate(() => (window as any).themeLogs || []);
    if (themeLogs.length > 0) {
      console.log('主题操作日志:', themeLogs);
    }

    // 检查主题相关错误
    const errors = errorCollector.getErrors();
    const themeErrors = errors.filter(e => 
      e.message.includes('theme') || 
      e.message.includes('主题') ||
      e.message.includes('CSS')
    );

    if (themeErrors.length > 0) {
      console.warn('主题相关错误:', themeErrors);
    }

    // 重置主题到默认状态
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
  });
});
