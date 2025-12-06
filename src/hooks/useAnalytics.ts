/**
 * 统一分析统计Hook
 * Unified Analytics Hook
 *
 * 支持百度统计和ELK Stack双重方案
 */

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { baiduAnalytics } from '../utils/BaiduAnalytics';
import { googleAnalytics } from '../utils/GoogleAnalytics';
import { elkAnalytics } from '../utils/ELKAnalytics';
import { universalGA } from '../utils/UniversalGoogleAnalytics';
import { analyticsConfig } from '../config/AnalyticsConfig';

interface UseAnalyticsOptions {
  /** 是否自动跟踪页面访问 */
  autoTrackPageViews?: boolean;
  /** 是否自动跟踪点击事件 */
  autoTrackClicks?: boolean;
  /** 是否自动跟踪滚动事件 */
  autoTrackScrolls?: boolean;
  /** 用户ID */
  userId?: string;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const {
    autoTrackPageViews = true,
    autoTrackClicks = true,
    autoTrackScrolls = true,
    userId
  } = options;

  const location = useLocation();
  const scrollDepthRef = useRef<number>(0);
  const pageStartTimeRef = useRef<number>(Date.now());

  // 设置用户ID
  useEffect(() => {
    if (userId) {
      analyticsLogger.setUserId(userId);
    }
  }, [userId]);

  // 自动跟踪页面访问
  useEffect(() => {
    if (autoTrackPageViews) {
      const pageTitle = document.title;
      const pageUrl = location.pathname + location.search;
      const loadTime = Date.now() - pageStartTimeRef.current;
      
      analyticsLogger.trackPageView(pageTitle, pageUrl, loadTime);
      
      // 重置页面开始时间
      pageStartTimeRef.current = Date.now();
      scrollDepthRef.current = 0;
    }
  }, [location, autoTrackPageViews]);

  // 自动跟踪点击事件
  useEffect(() => {
    if (!autoTrackClicks) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const tagName = target.tagName.toLowerCase();
      const elementText = target.textContent?.trim().substring(0, 100) || '';
      const elementId = target.id || '';
      const elementClass = target.className || '';
      
      let elementIdentifier = tagName;
      if (elementId) elementIdentifier += `#${elementId}`;
      if (elementClass) elementIdentifier += `.${elementClass.split(' ')[0]}`;

      analyticsLogger.trackUserInteraction(
        'click',
        elementIdentifier,
        elementText,
        { x: event.clientX, y: event.clientY }
      );
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [autoTrackClicks]);

  // 自动跟踪滚动深度
  useEffect(() => {
    if (!autoTrackScrolls) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

      // 只在滚动深度增加时记录
      if (scrollPercent > scrollDepthRef.current) {
        scrollDepthRef.current = scrollPercent;
        
        // 记录重要的滚动里程碑
        if (scrollPercent >= 25 && scrollPercent < 50) {
          analyticsLogger.trackUserInteraction('scroll', 'page', '25%');
        } else if (scrollPercent >= 50 && scrollPercent < 75) {
          analyticsLogger.trackUserInteraction('scroll', 'page', '50%');
        } else if (scrollPercent >= 75 && scrollPercent < 90) {
          analyticsLogger.trackUserInteraction('scroll', 'page', '75%');
        } else if (scrollPercent >= 90) {
          analyticsLogger.trackUserInteraction('scroll', 'page', '90%');
        }
      }
    };

    const throttledScroll = throttle(handleScroll, 1000);
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [autoTrackScrolls]);

  // 手动跟踪函数
  const trackEvent = useCallback((
    action: string,
    element: string,
    elementText?: string,
    value?: string
  ) => {
    // 百度统计
    baiduAnalytics.trackEvent({
      category: 'user_interaction',
      action,
      label: element,
      value: value ? parseInt(value) : undefined
    });

    // Google Analytics
    googleAnalytics.trackEvent({
      action,
      category: 'user_interaction',
      label: element,
      value: value ? parseInt(value) : undefined,
      custom_parameters: {
        element_text: elementText
      }
    });

    // ELK统计
    elkAnalytics.trackUserInteraction(action, element, elementText, value);
  }, []);

  const trackPageView = useCallback((pageTitle?: string, pageUrl?: string) => {
    const title = pageTitle || document.title;
    const url = pageUrl || (location.pathname + location.search);

    // 百度统计
    baiduAnalytics.trackPageView(url, title);

    // Google Analytics
    googleAnalytics.trackPageView({
      page_title: title,
      page_location: window.location.href,
      page_path: location.pathname
    });

    // ELK统计
    elkAnalytics.trackPageView(title, url);
  }, [location]);

  const trackPerformance = useCallback((
    metricName: string,
    metricValue: number,
    metricUnit: string = 'ms',
    additionalData?: Record<string, any>
  ) => {
    analyticsLogger.trackPerformance(metricName, metricValue, metricUnit, additionalData);
  }, []);

  const trackError = useCallback((
    errorType: string,
    errorMessage: string,
    component?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    analyticsLogger.trackError(errorType, errorMessage, undefined, component, severity);
  }, []);

  // 简历项目特定的跟踪函数
  const trackSkillClick = useCallback((skillName: string, skillCategory: string) => {
    trackEvent('skill_click', 'skill_tag', skillName, skillCategory);
  }, [trackEvent]);

  const trackProjectView = useCallback((projectName: string, projectType: string) => {
    trackEvent('project_view', 'project_card', projectName, projectType);
  }, [trackEvent]);

  const trackContactClick = useCallback((contactType: string, contactValue?: string) => {
    trackEvent('contact_click', 'contact_info', contactType, contactValue);
  }, [trackEvent]);

  const trackLanguageSwitch = useCallback((fromLang: string, toLang: string) => {
    trackEvent('language_switch', 'language_toggle', `${fromLang}_to_${toLang}`);
  }, [trackEvent]);

  const trackThemeSwitch = useCallback((fromTheme: string, toTheme: string) => {
    trackEvent('theme_switch', 'theme_toggle', `${fromTheme}_to_${toTheme}`);
  }, [trackEvent]);

  const trackSectionView = useCallback((sectionName: string) => {
    trackEvent('section_view', 'resume_section', sectionName);
  }, [trackEvent]);

  const trackDownload = useCallback((downloadType: string, fileName?: string) => {
    trackEvent('download', 'download_button', downloadType, fileName);
  }, [trackEvent]);

  // 获取分析状态
  const getAnalyticsStatus = useCallback(() => {
    return analyticsLogger.getStatus();
  }, []);

  // 启用/禁用分析
  const setAnalyticsEnabled = useCallback((enabled: boolean) => {
    analyticsLogger.setEnabled(enabled);
  }, []);

  return {
    // 通用跟踪函数
    trackEvent,
    trackPageView,
    trackPerformance,
    trackError,
    
    // 简历项目特定跟踪函数
    trackSkillClick,
    trackProjectView,
    trackContactClick,
    trackLanguageSwitch,
    trackThemeSwitch,
    trackSectionView,
    trackDownload,
    
    // 工具函数
    getAnalyticsStatus,
    setAnalyticsEnabled
  };
};

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

export default useAnalytics;
