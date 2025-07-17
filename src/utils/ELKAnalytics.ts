/**
 * ELK Stack 统计集成类
 * ELK Stack Analytics Integration
 * 
 * 将数据发送到本地ELK Stack进行分析
 */

import { analyticsConfig } from '../config/AnalyticsConfig';
import debug from 'debug';

// Debug logger
const debugELK = debug('app:elk');

export interface ELKEvent {
  timestamp: string;
  event_type: string;
  page: string;
  source: string;
  user_agent: string;
  referrer: string;
  data: Record<string, any>;
}

export class ELKAnalytics {
  private static instance: ELKAnalytics;
  private eventQueue: ELKEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupAutoFlush();
    this.setupPageUnloadHandler();
  }

  static getInstance(): ELKAnalytics {
    if (!ELKAnalytics.instance) {
      ELKAnalytics.instance = new ELKAnalytics();
    }
    return ELKAnalytics.instance;
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 设置自动刷新
   */
  private setupAutoFlush(): void {
    const config = analyticsConfig.getELKConfig();
    if (config.enabled) {
      this.flushTimer = setInterval(() => {
        this.flushEvents();
      }, config.flushInterval || 5000);
    }
  }

  /**
   * 设置页面卸载处理器
   */
  private setupPageUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      this.flushEvents(true);
    });
  }

  /**
   * 创建基础事件
   */
  private createBaseEvent(eventType: string, data: Record<string, any>): ELKEvent {
    return {
      timestamp: new Date().toISOString(),
      event_type: eventType,
      page: window.location.pathname,
      source: 'flexiresume',
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      data: {
        session_id: this.sessionId,
        ...data
      }
    };
  }

  /**
   * 添加事件到队列
   */
  private addEvent(event: ELKEvent): void {
    const config = analyticsConfig.getELKConfig();
    
    if (!config.enabled) {
      if (config.debug) {
        debugELK('Disabled, event not added: %O', event);
      }
      return;
    }

    this.eventQueue.push(event);

    // 如果队列满了，立即发送
    if (this.eventQueue.length >= (config.batchSize || 10)) {
      this.flushEvents();
    }

    if (config.debug) {
      debugELK('Event added to queue: %O', event);
    }
  }

  /**
   * 发送事件到ELK Stack
   */
  private async flushEvents(immediate = false): Promise<void> {
    const config = analyticsConfig.getELKConfig();
    
    if (!config.enabled || this.eventQueue.length === 0) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const payload = {
        events: events,
        source: 'flexiresume',
        timestamp: new Date().toISOString()
      };

      if (immediate && navigator.sendBeacon) {
        // 页面卸载时使用sendBeacon确保数据发送
        navigator.sendBeacon(config.endpoint, JSON.stringify(payload));
      } else {
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          debugELK('Failed to send events: %s', response.statusText);
          // 重新加入队列（最多重试一次）
          if (events.length < (config.batchSize || 10)) {
            this.eventQueue.unshift(...events);
          }
        } else if (config.debug) {
          debugELK('Events sent successfully: %d', events.length);
        }
      }
    } catch (error) {
      debugELK('Error sending events: %O', error);
      // 重新加入队列（最多重试一次）
      if (events.length < (config.batchSize || 10)) {
        this.eventQueue.unshift(...events);
      }
    }
  }

  /**
   * 跟踪页面访问
   */
  trackPageView(title?: string, url?: string): void {
    const event = this.createBaseEvent('page_view', {
      title: title || document.title,
      url: url || window.location.href,
      timestamp: Date.now()
    });
    this.addEvent(event);
  }

  /**
   * 跟踪用户交互
   */
  trackUserInteraction(action: string, element: string, elementText?: string, value?: string): void {
    const event = this.createBaseEvent('user_interaction', {
      action,
      element,
      element_text: elementText,
      value,
      timestamp: Date.now()
    });
    this.addEvent(event);
  }

  /**
   * 跟踪性能指标
   */
  trackPerformance(metricName: string, metricValue: number, metricUnit: string, additionalData?: Record<string, any>): void {
    const event = this.createBaseEvent('performance', {
      metric_name: metricName,
      metric_value: metricValue,
      metric_unit: metricUnit,
      additional_data: additionalData,
      timestamp: Date.now()
    });
    this.addEvent(event);
  }

  /**
   * 跟踪错误
   */
  trackError(errorType: string, errorMessage: string, errorStack?: string, component?: string, severity: string = 'medium'): void {
    const event = this.createBaseEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      error_stack: errorStack,
      component,
      severity,
      timestamp: Date.now()
    });
    this.addEvent(event);
  }

  /**
   * 跟踪技能点击
   */
  trackSkillClick(skillName: string, skillCategory: string): void {
    this.trackUserInteraction('skill_click', 'skill_tag', skillName, skillCategory);
  }

  /**
   * 跟踪项目查看
   */
  trackProjectView(projectName: string, projectType: string): void {
    this.trackUserInteraction('project_view', 'project_card', projectName, projectType);
  }

  /**
   * 跟踪联系方式点击
   */
  trackContactClick(contactType: string, contactValue?: string): void {
    this.trackUserInteraction('contact_click', 'contact_info', contactType, contactValue);
  }

  /**
   * 跟踪语言切换
   */
  trackLanguageSwitch(fromLang: string, toLang: string): void {
    this.trackUserInteraction('language_switch', 'language_toggle', `${fromLang}_to_${toLang}`);
  }

  /**
   * 跟踪主题切换
   */
  trackThemeSwitch(fromTheme: string, toTheme: string): void {
    this.trackUserInteraction('theme_switch', 'theme_toggle', `${fromTheme}_to_${toTheme}`);
  }

  /**
   * 跟踪下载
   */
  trackDownload(downloadType: string, fileName?: string): void {
    this.trackUserInteraction('download', 'download_button', downloadType, fileName);
  }

  /**
   * 获取状态信息
   */
  getStatus(): {
    enabled: boolean;
    sessionId: string;
    queueSize: number;
    endpoint: string;
  } {
    const config = analyticsConfig.getELKConfig();
    return {
      enabled: config.enabled,
      sessionId: this.sessionId,
      queueSize: this.eventQueue.length,
      endpoint: config.endpoint
    };
  }

  /**
   * 启用/禁用ELK统计
   */
  setEnabled(enabled: boolean): void {
    analyticsConfig.setELKEnabled(enabled);
    
    if (enabled) {
      this.setupAutoFlush();
    } else {
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
        this.flushTimer = null;
      }
      this.eventQueue = [];
    }
  }
}

// 导出单例实例
export const elkAnalytics = ELKAnalytics.getInstance();

// 自动收集页面性能数据
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      elkAnalytics.trackPerformance('page_load_time', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
      elkAnalytics.trackPerformance('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
      elkAnalytics.trackPerformance('first_contentful_paint', performance.getEntriesByType('paint')[1]?.startTime || 0, 'ms');
    }
  });

  // 收集错误信息
  window.addEventListener('error', (event) => {
    elkAnalytics.trackError(
      'javascript_error',
      event.message,
      event.error?.stack,
      undefined,
      'high'
    );
  });

  // 收集未处理的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    elkAnalytics.trackError(
      'unhandled_promise_rejection',
      event.reason?.message || 'Unhandled promise rejection',
      event.reason?.stack,
      undefined,
      'high'
    );
  });
}
