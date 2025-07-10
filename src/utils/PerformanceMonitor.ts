/**
 * 性能监控工具
 *
 * 提供Web性能指标监控，包括：
 * - Core Web Vitals (LCP, FID, CLS)
 * - 自定义性能指标
 * - 资源加载时间
 * - 用户交互延迟
 * - 组件渲染性能
 * - 数据加载性能
 * - 内存使用监控
 *
 * @author 陈剑
 * @date 2024-12-27
 * @updated 2024-12-27 - 增强性能监控功能
 */

import React from 'react';
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

  // 新增指标
  dataLoadTime?: number; // 数据加载时间
  skeletonDisplayTime?: number; // 骨架屏显示时间
  routeChangeTime?: number; // 路由切换时间
  themeChangeTime?: number; // 主题切换时间
  languageChangeTime?: number; // 语言切换时间
  memoryUsage?: number; // 内存使用量
  bundleSize?: number; // 包大小

  // 组件级别指标
  componentMetrics?: {
    [componentName: string]: {
      renderTime: number;
      mountTime: number;
      updateTime: number;
    };
  };
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
   * 记录组件渲染性能
   */
  public recordComponentMetric(componentName: string, metricType: 'render' | 'mount' | 'update', value: number) {
    if (!this.metrics.componentMetrics) {
      this.metrics.componentMetrics = {};
    }

    if (!this.metrics.componentMetrics[componentName]) {
      this.metrics.componentMetrics[componentName] = {
        renderTime: 0,
        mountTime: 0,
        updateTime: 0
      };
    }

    switch (metricType) {
      case 'render':
        this.metrics.componentMetrics[componentName].renderTime = value;
        break;
      case 'mount':
        this.metrics.componentMetrics[componentName].mountTime = value;
        break;
      case 'update':
        this.metrics.componentMetrics[componentName].updateTime = value;
        break;
    }

    logger(`Component ${componentName} ${metricType} time:`, value);
  }

  /**
   * 记录数据加载性能
   */
  public recordDataLoadTime(dataType: string, loadTime: number) {
    this.metrics.dataLoadTime = loadTime;
    logger(`Data load time for ${dataType}:`, loadTime);
  }

  /**
   * 记录骨架屏显示时间
   */
  public recordSkeletonDisplayTime(displayTime: number) {
    this.metrics.skeletonDisplayTime = displayTime;
    logger('Skeleton display time:', displayTime);
  }

  /**
   * 记录路由切换性能
   */
  public recordRouteChangeTime(fromRoute: string, toRoute: string, changeTime: number) {
    this.metrics.routeChangeTime = changeTime;
    logger(`Route change from ${fromRoute} to ${toRoute}:`, changeTime);
  }

  /**
   * 记录主题切换性能
   */
  public recordThemeChangeTime(fromTheme: string, toTheme: string, changeTime: number) {
    this.metrics.themeChangeTime = changeTime;
    logger(`Theme change from ${fromTheme} to ${toTheme}:`, changeTime);
  }

  /**
   * 记录语言切换性能
   */
  public recordLanguageChangeTime(fromLang: string, toLang: string, changeTime: number) {
    this.metrics.languageChangeTime = changeTime;
    logger(`Language change from ${fromLang} to ${toLang}:`, changeTime);
  }

  /**
   * 监控内存使用
   */
  public recordMemoryUsage() {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      this.metrics.memoryUsage = memInfo.usedJSHeapSize;
      logger('Memory usage:', {
        used: memInfo.usedJSHeapSize,
        total: memInfo.totalJSHeapSize,
        limit: memInfo.jsHeapSizeLimit
      });
    }
  }

  /**
   * 获取当前性能指标
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 获取性能评分
   */
  public getPerformanceScore(): { score: number; details: any } {
    const metrics = this.getMetrics();
    let score = 100;
    const details: any = {};

    // LCP评分 (理想 < 2.5s, 需要改进 < 4s)
    if (metrics.LCP) {
      if (metrics.LCP > 4000) {
        score -= 30;
        details.LCP = 'Poor';
      } else if (metrics.LCP > 2500) {
        score -= 15;
        details.LCP = 'Needs Improvement';
      } else {
        details.LCP = 'Good';
      }
    }

    // FID评分 (理想 < 100ms, 需要改进 < 300ms)
    if (metrics.FID) {
      if (metrics.FID > 300) {
        score -= 25;
        details.FID = 'Poor';
      } else if (metrics.FID > 100) {
        score -= 10;
        details.FID = 'Needs Improvement';
      } else {
        details.FID = 'Good';
      }
    }

    // CLS评分 (理想 < 0.1, 需要改进 < 0.25)
    if (metrics.CLS) {
      if (metrics.CLS > 0.25) {
        score -= 20;
        details.CLS = 'Poor';
      } else if (metrics.CLS > 0.1) {
        score -= 10;
        details.CLS = 'Needs Improvement';
      } else {
        details.CLS = 'Good';
      }
    }

    // 数据加载时间评分
    if (metrics.dataLoadTime) {
      if (metrics.dataLoadTime > 2000) {
        score -= 15;
        details.dataLoad = 'Slow';
      } else if (metrics.dataLoadTime > 1000) {
        score -= 5;
        details.dataLoad = 'Moderate';
      } else {
        details.dataLoad = 'Fast';
      }
    }

    return { score: Math.max(0, score), details };
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

export const recordComponentMetric = (componentName: string, metricType: 'render' | 'mount' | 'update', value: number) => {
  performanceMonitor.recordComponentMetric(componentName, metricType, value);
};

export const recordDataLoadTime = (dataType: string, loadTime: number) => {
  performanceMonitor.recordDataLoadTime(dataType, loadTime);
};

export const recordSkeletonDisplayTime = (displayTime: number) => {
  performanceMonitor.recordSkeletonDisplayTime(displayTime);
};

export const recordRouteChangeTime = (fromRoute: string, toRoute: string, changeTime: number) => {
  performanceMonitor.recordRouteChangeTime(fromRoute, toRoute, changeTime);
};

export const recordThemeChangeTime = (fromTheme: string, toTheme: string, changeTime: number) => {
  performanceMonitor.recordThemeChangeTime(fromTheme, toTheme, changeTime);
};

export const recordLanguageChangeTime = (fromLang: string, toLang: string, changeTime: number) => {
  performanceMonitor.recordLanguageChangeTime(fromLang, toLang, changeTime);
};

export const recordMemoryUsage = () => {
  performanceMonitor.recordMemoryUsage();
};

export const getPerformanceMetrics = () => {
  return performanceMonitor.getMetrics();
};

export const getPerformanceScore = () => {
  return performanceMonitor.getPerformanceScore();
};

/**
 * React Hook for component performance monitoring
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = React.useRef(performance.now());

  // 使用useCallback确保函数引用稳定
  const recordRender = React.useCallback(() => {
    const renderTime = performance.now() - startTimeRef.current;
    recordComponentMetric(componentName, 'render', renderTime);
  }, [componentName]);

  const recordMount = React.useCallback(() => {
    const mountTime = performance.now() - startTimeRef.current;
    recordComponentMetric(componentName, 'mount', mountTime);
  }, [componentName]);

  const recordUpdate = React.useCallback(() => {
    const updateTime = performance.now() - startTimeRef.current;
    recordComponentMetric(componentName, 'update', updateTime);
  }, [componentName]);

  return {
    recordRender,
    recordMount,
    recordUpdate
  };
};

/**
 * 高阶组件：为组件添加性能监控
 */
export const withPerformanceMonitor = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const MonitoredComponent: React.FC<P> = (props) => {
    const startTime = performance.now();

    React.useEffect(() => {
      // 记录组件挂载时间
      const mountTime = performance.now() - startTime;
      recordComponentMetric(displayName, 'mount', mountTime);
    }, []);

    React.useEffect(() => {
      // 记录组件更新时间
      const updateTime = performance.now() - startTime;
      recordComponentMetric(displayName, 'update', updateTime);
    });

    // 记录渲染时间
    const renderStartTime = performance.now();
    const result = React.createElement(WrappedComponent, props);
    const renderTime = performance.now() - renderStartTime;
    recordComponentMetric(displayName, 'render', renderTime);

    return result;
  };

  MonitoredComponent.displayName = `withPerformanceMonitor(${displayName})`;
  return MonitoredComponent;
};

export default performanceMonitor;
