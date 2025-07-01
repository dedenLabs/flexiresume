/**
 * 性能监控工具
 * 
 * 提供Web性能指标监控，包括：
 * - Core Web Vitals (LCP, FID, CLS)
 * - 自定义性能指标
 * - 资源加载时间
 * - 用户交互延迟
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import { getLogger } from './Tools';

const logger = getLogger('PerformanceMonitor');

/**
 * 性能指标接口
 */
interface PerformanceMetrics {
  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay  
  CLS?: number; // Cumulative Layout Shift
  
  // 其他重要指标
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
  TTI?: number; // Time to Interactive
  
  // 自定义指标
  pageLoadTime?: number;
  resourceLoadTime?: number;
  componentRenderTime?: number;
}

/**
 * 性能监控类
 */
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  
  constructor() {
    this.init();
  }

  /**
   * 初始化性能监控
   */
  private init() {
    // 监控页面加载性能
    this.observeNavigation();
    
    // 监控Core Web Vitals
    this.observeWebVitals();
    
    // 监控资源加载
    this.observeResources();
    
    // 页面卸载时上报数据
    this.setupReporting();
  }

  /**
   * 监控页面导航性能
   */
  private observeNavigation() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            this.metrics.TTFB = navEntry.responseStart - navEntry.requestStart;
            this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.navigationStart;
            
            logger('Navigation metrics:', {
              TTFB: this.metrics.TTFB,
              pageLoadTime: this.metrics.pageLoadTime
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  /**
   * 监控Core Web Vitals
   */
  private observeWebVitals() {
    // LCP - Largest Contentful Paint
    this.observeLCP();
    
    // FID - First Input Delay
    this.observeFID();
    
    // CLS - Cumulative Layout Shift
    this.observeCLS();
    
    // FCP - First Contentful Paint
    this.observeFCP();
  }

  /**
   * 监控LCP
   */
  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.LCP = lastEntry.startTime;
        logger('LCP:', this.metrics.LCP);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  /**
   * 监控FID
   */
  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            this.metrics.FID = fidEntry.processingStart - fidEntry.startTime;
            logger('FID:', this.metrics.FID);
          }
        }
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }

  /**
   * 监控CLS
   */
  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.CLS = clsValue;
        logger('CLS:', this.metrics.CLS);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }

  /**
   * 监控FCP
   */
  private observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime;
            logger('FCP:', this.metrics.FCP);
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  /**
   * 监控资源加载性能
   */
  private observeResources() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // 记录慢资源
            const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;
            if (loadTime > 1000) { // 超过1秒的资源
              logger('Slow resource:', {
                name: resourceEntry.name,
                loadTime,
                size: resourceEntry.transferSize
              });
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  /**
   * 设置性能数据上报
   */
  private setupReporting() {
    // 页面可见性变化时上报
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics();
      }
    });

    // 页面卸载前上报
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });
  }

  /**
   * 上报性能指标
   */
  private reportMetrics() {
    logger('Performance Metrics:', this.metrics);
    
    // 这里可以发送到分析服务
    // 例如：Google Analytics, 自建分析系统等
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        url: window.location.href,
        timestamp: Date.now(),
        metrics: this.metrics,
        userAgent: navigator.userAgent
      });
      
      // 发送到分析端点（示例）
      // navigator.sendBeacon('/api/analytics/performance', data);
    }
  }

  /**
   * 手动记录自定义指标
   */
  public recordCustomMetric(name: string, value: number) {
    (this.metrics as any)[name] = value;
    logger(`Custom metric ${name}:`, value);
  }

  /**
   * 获取当前性能指标
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 清理监控器
   */
  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// 创建全局实例
const performanceMonitor = new PerformanceMonitor();

// 导出工具函数
export const recordMetric = (name: string, value: number) => {
  performanceMonitor.recordCustomMetric(name, value);
};

export const getPerformanceMetrics = () => {
  return performanceMonitor.getMetrics();
};

export default performanceMonitor;
