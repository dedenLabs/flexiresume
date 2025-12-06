import { Page, Locator } from '@playwright/test';

/**
 * 页面对象模型 (Page Object Model)
 * 封装页面元素和操作，提高测试代码的可维护性
 */

/**
 * 基础页面类
 */
export class BasePage {
  protected page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  // 通用元素定位器
  get languageSwitcher(): Locator {
    return this.page.locator('[data-language-switcher]');
  }
  
  get themeToggle(): Locator {
    return this.page.locator('[data-theme-toggle]').or(
      this.page.locator('button:has-text("🌙")').or(
        this.page.locator('button:has-text("☀️")')
      )
    );
  }
  
  get mainContent(): Locator {
    return this.page.locator('main').or(
      this.page.locator('[role="main"]')
    ).or(
      this.page.locator('.main-content')
    );
  }
  
  get mermaidCharts(): Locator {
    return this.page.locator('svg[id^="mermaid-"]');
  }
  
  get loadingIndicators(): Locator {
    return this.page.locator('.loading').or(
      this.page.locator('.skeleton')
    ).or(
      this.page.locator('[data-loading]')
    );
  }
  
  // 通用操作方法
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
  
  async switchLanguage(language: 'zh' | 'en'): Promise<void> {
    await this.languageSwitcher.click();
    await this.page.waitForTimeout(500);
    
    if (language === 'zh') {
      await this.page.locator('text=中文').or(
        this.page.locator('text=简体中文')
      ).click();
    } else {
      await this.page.locator('text=English').or(
        this.page.locator('text=EN')
      ).click();
    }
    
    await this.page.waitForTimeout(1000);
  }
  
  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
    await this.page.waitForTimeout(1000);
  }
  
  async waitForMermaidCharts(): Promise<number> {
    await this.page.waitForTimeout(2000);
    const count = await this.mermaidCharts.count();
    if (count > 0) {
      await this.page.waitForTimeout(3000);
    }
    return count;
  }
}

/**
 * Agent页面对象
 */
export class AgentPage extends BasePage {
  readonly url = '/agent.html';
  
  get pageTitle(): Locator {
    return this.page.locator('h1').first();
  }
  
  get skillsSection(): Locator {
    return this.page.locator('[data-section="skills"]').or(
      this.page.locator('.skills-section')
    );
  }
  
  get experienceSection(): Locator {
    return this.page.locator('[data-section="experience"]').or(
      this.page.locator('.experience-section')
    );
  }
  
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }
}

/**
 * Fullstack页面对象
 */
export class FullstackPage extends BasePage {
  readonly url = '/fullstack.html';
  
  get pageTitle(): Locator {
    return this.page.locator('h1').first();
  }
  
  get techStackSection(): Locator {
    return this.page.locator('[data-section="tech-stack"]').or(
      this.page.locator('.tech-stack-section')
    );
  }
  
  get projectsSection(): Locator {
    return this.page.locator('[data-section="projects"]').or(
      this.page.locator('.projects-section')
    );
  }
  
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }
}

/**
 * Contract Task页面对象
 */
export class ContractTaskPage extends BasePage {
  readonly url = '/contracttask.html';
  
  get pageTitle(): Locator {
    return this.page.locator('h1').first();
  }
  
  get tasksSection(): Locator {
    return this.page.locator('[data-section="tasks"]').or(
      this.page.locator('.tasks-section')
    );
  }
  
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }
}

/**
 * CTO页面对象
 */
export class CTOPage extends BasePage {
  readonly url = '/cto.html';
  
  get pageTitle(): Locator {
    return this.page.locator('h1').first();
  }
  
  get leadershipSection(): Locator {
    return this.page.locator('[data-section="leadership"]').or(
      this.page.locator('.leadership-section')
    );
  }
  
  get managementSection(): Locator {
    return this.page.locator('[data-section="management"]').or(
      this.page.locator('.management-section')
    );
  }
  
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }
}

/**
 * Frontend页面对象
 */
export class FrontendPage extends BasePage {
  readonly url = '/frontend.html';
  
  get pageTitle(): Locator {
    return this.page.locator('h1').first();
  }
  
  get frontendSkillsSection(): Locator {
    return this.page.locator('[data-section="frontend-skills"]').or(
      this.page.locator('.frontend-skills-section')
    );
  }
  
  get portfolioSection(): Locator {
    return this.page.locator('[data-section="portfolio"]').or(
      this.page.locator('.portfolio-section')
    );
  }
  
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }
}

/**
 * 页面工厂类
 */
export class PageFactory {
  static createPage(pageName: string, page: Page): BasePage {
    switch (pageName.toLowerCase()) {
      case 'agent':
        return new AgentPage(page);
      case 'fullstack':
        return new FullstackPage(page);
      case 'contracttask':
        return new ContractTaskPage(page);
      case 'cto':
        return new CTOPage(page);
      case 'frontend':
        return new FrontendPage(page);
      default:
        throw new Error(`Unknown page: ${pageName}`);
    }
  }
}
