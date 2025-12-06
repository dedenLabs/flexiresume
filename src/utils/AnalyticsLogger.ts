/**
 * 分析日志记录器
 * Analytics Logger for ELK Stack Integration
 *
 * 为简历项目提供统计数据收集和发送功能
 */

import { getLogger } from "./Logger";

 

// Debug logger
const debugAnalytics = getLogger('analytics');

interface AnalyticsEvent {
  timestamp: string;
  event_type: string;
  page: string;
  user_id?: string;
  session_id: string;
  user_agent: string;
  ip_address?: string;
  referrer: string;
  data: Record<string, any>;
}

interface PageViewEvent extends AnalyticsEvent {
  event_type: 'page_view';
  data: {
    page_title: string;
    page_url: string;
    load_time?: number;
    screen_resolution: string;
    language: string;
  };
}

interface UserInteractionEvent extends AnalyticsEvent {
  event_type: 'user_interaction';
  data: {
    action: string;
    element: string;
    element_text?: string;
    position?: { x: number; y: number };
    value?: string;
  };
}

interface PerformanceEvent extends AnalyticsEvent {
  event_type: 'performance';
  data: {
    metric_name: string;
    metric_value: number;
    metric_unit: string;
    additional_data?: Record<string, any>;
  };
}

interface ErrorEvent extends AnalyticsEvent {
  event_type: 'error';
  data: {
    error_type: string;
    error_message: string;
    error_stack?: string;
    component?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

export class AnalyticsLogger {
  private static instance: AnalyticsLogger;
  private sessionId: string;
  private userId?: string;
  private elkEndpoint: string;
  private isEnabled: boolean;
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: number = 5000; // 5秒
  private maxQueueSize: number = 100;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.elkEndpoint = this.getElkEndpoint();
    this.isEnabled = this.checkIfEnabled();
    
    if (this.isEnabled) {
      this.startPeriodicFlush();
      this.setupPageUnloadHandler();
    }
  }

  static getInstance(): AnalyticsLogger {
    if (!AnalyticsLogger.instance) {
      AnalyticsLogger.instance = new AnalyticsLogger();
    }
    return AnalyticsLogger.instance;
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 获取ELK Stack端点
   */
  private getElkEndpoint(): string {
    // 开发环境
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:5000'; // Logstash端点
    }
    
    // 生产环境
    return process.env.REACT_APP_ELK_ENDPOINT || 'http://localhost:5000';
  }

  /**
   * 检查是否启用分析
   */
  private checkIfEnabled(): boolean {
    // 检查环境变量
    if (process.env.REACT_APP_ANALYTICS_ENABLED === 'false') {
      return false;
    }
    
    // 检查本地存储中的用户偏好
    const userPreference = localStorage.getItem('analytics_enabled');
    if (userPreference === 'false') {
      return false;
    }
    
    return true;
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * 记录页面访问
   */
  trackPageView(pageTitle: string, pageUrl: string, loadTime?: number): void {
    if (!this.isEnabled) return;

    const event: PageViewEvent = {
      timestamp: new Date().toISOString(),
      event_type: 'page_view',
      page: pageUrl,
      user_id: this.userId,
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      data: {
        page_title: pageTitle,
        page_url: pageUrl,
        load_time: loadTime,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language
      }
    };

    this.addEvent(event);
  }

  /**
   * 记录用户交互
   */
  trackUserInteraction(
    action: string, 
    element: string, 
    elementText?: string, 
    position?: { x: number; y: number },
    value?: string
  ): void {
    if (!this.isEnabled) return;

    const event: UserInteractionEvent = {
      timestamp: new Date().toISOString(),
      event_type: 'user_interaction',
      page: window.location.pathname,
      user_id: this.userId,
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      data: {
        action,
        element,
        element_text: elementText,
        position,
        value
      }
    };

    this.addEvent(event);
  }

  /**
   * 记录性能指标
   */
  trackPerformance(metricName: string, metricValue: number, metricUnit: string, additionalData?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const event: PerformanceEvent = {
      timestamp: new Date().toISOString(),
      event_type: 'performance',
      page: window.location.pathname,
      user_id: this.userId,
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      data: {
        metric_name: metricName,
        metric_value: metricValue,
        metric_unit: metricUnit,
        additional_data: additionalData
      }
    };

    this.addEvent(event);
  }

  /**
   * 记录错误事件
   */
  trackError(
    errorType: string, 
    errorMessage: string, 
    errorStack?: string, 
    component?: string, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): void {
    if (!this.isEnabled) return;

    const event: ErrorEvent = {
      timestamp: new Date().toISOString(),
      event_type: 'error',
      page: window.location.pathname,
      user_id: this.userId,
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      data: {
        error_type: errorType,
        error_message: errorMessage,
        error_stack: errorStack,
        component,
        severity
      }
    };

    this.addEvent(event);
  }

  /**
   * 添加事件到队列
   */
  private addEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);
    
    // 如果队列满了，立即发送
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flushEvents();
    }
  }

  /**
   * 发送事件到ELK Stack
   */
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(this.elkEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: events,
          source: 'resume-app',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        debugAnalytics('Failed to send analytics events: %s', response.statusText);
        // 重新加入队列（最多重试一次）
        if (events.length < this.maxQueueSize) {
          this.eventQueue.unshift(...events);
        }
      }
    } catch (error) {
      debugAnalytics('Error sending analytics events: %O', error);
      // 重新加入队列（最多重试一次）
      if (events.length < this.maxQueueSize) {
        this.eventQueue.unshift(...events);
      }
    }
  }

  /**
   * 启动定期发送
   */
  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  /**
   * 设置页面卸载处理器
   */
  private setupPageUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      // 页面卸载时立即发送剩余事件
      if (this.eventQueue.length > 0) {
        // 使用sendBeacon API确保数据发送
        const data = JSON.stringify({
          events: this.eventQueue,
          source: 'resume-app',
          timestamp: new Date().toISOString()
        });
        
        if (navigator.sendBeacon) {
          navigator.sendBeacon(this.elkEndpoint, data);
        }
      }
    });
  }

  /**
   * 启用/禁用分析
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('analytics_enabled', enabled.toString());
    
    if (!enabled) {
      this.eventQueue = [];
    }
  }

  /**
   * 获取当前状态
   */
  getStatus(): {
    isEnabled: boolean;
    sessionId: string;
    userId?: string;
    queueSize: number;
    elkEndpoint: string;
  } {
    return {
      isEnabled: this.isEnabled,
      sessionId: this.sessionId,
      userId: this.userId,
      queueSize: this.eventQueue.length,
      elkEndpoint: this.elkEndpoint
    };
  }
}

// 导出单例实例
export const analyticsLogger = AnalyticsLogger.getInstance();

// 自动收集页面性能数据
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // 收集页面加载性能
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      analyticsLogger.trackPerformance('page_load_time', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
      analyticsLogger.trackPerformance('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
      analyticsLogger.trackPerformance('first_contentful_paint', performance.getEntriesByType('paint')[1]?.startTime || 0, 'ms');
    }
  });

  // 收集错误信息
  window.addEventListener('error', (event) => {
    analyticsLogger.trackError(
      'javascript_error',
      event.message,
      event.error?.stack,
      undefined,
      'high'
    );
  });

  // 收集未处理的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    analyticsLogger.trackError(
      'unhandled_promise_rejection',
      event.reason?.message || 'Unhandled promise rejection',
      event.reason?.stack,
      undefined,
      'high'
    );
  });
}

export default AnalyticsLogger;
