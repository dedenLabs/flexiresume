/**
 * 安全功能Hook
 * Security Hook
 * 
 * 提供安全相关的功能和状态管理
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { EnhancedSecurityUtils, SecurityEvent, SecurityEventType } from '../utils/EnhancedSecurityUtils';
import { SecurityUtils } from '../utils/SecurityUtils';

interface SecurityState {
  isSecure: boolean;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  eventCount: number;
  lastEvent?: SecurityEvent;
}

interface SecurityHookOptions {
  /** 是否启用实时监控 */
  enableRealTimeMonitoring?: boolean;
  /** 监控间隔（毫秒） */
  monitoringInterval?: number;
  /** 是否启用行为检测 */
  enableBehaviorDetection?: boolean;
  /** 是否启用速率限制 */
  enableRateLimit?: boolean;
  /** 速率限制配置 */
  rateLimitConfig?: {
    maxRequests: number;
    timeWindow: number;
  };
}

export const useSecurity = (options: SecurityHookOptions = {}) => {
  const {
    enableRealTimeMonitoring = true,
    monitoringInterval = 5000,
    enableBehaviorDetection = true,
    enableRateLimit = true,
    rateLimitConfig = { maxRequests: 100, timeWindow: 60000 }
  } = options;

  const [securityState, setSecurityState] = useState<SecurityState>({
    isSecure: true,
    threatLevel: 'low',
    eventCount: 0
  });

  const behaviorRef = useRef({
    clickCount: 0,
    lastClickTime: 0,
    navigationCount: 0,
    suspiciousInputCount: 0
  });

  const intervalRef = useRef<NodeJS.Timeout>();

  // 更新安全状态
  const updateSecurityState = useCallback(() => {
    const events = EnhancedSecurityUtils.getSecurityEvents();
    const recentEvents = events.filter(e => e.timestamp > Date.now() - 300000); // 最近5分钟

    let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (recentEvents.some(e => e.severity === 'critical')) {
      threatLevel = 'critical';
    } else if (recentEvents.some(e => e.severity === 'high')) {
      threatLevel = 'high';
    } else if (recentEvents.some(e => e.severity === 'medium')) {
      threatLevel = 'medium';
    }

    setSecurityState({
      isSecure: threatLevel === 'low',
      threatLevel,
      eventCount: events.length,
      lastEvent: events[events.length - 1]
    });
  }, []);

  // 验证输入内容
  const validateInput = useCallback((input: string, rules?: any) => {
    return EnhancedSecurityUtils.validateInputEnhanced(input, rules || {
      type: 'string',
      maxLength: 1000,
      required: false
    });
  }, []);

  // 清理HTML内容
  const sanitizeHTML = useCallback((html: string, options?: any) => {
    return EnhancedSecurityUtils.sanitizeHTMLEnhanced(html, options);
  }, []);

  // 检查速率限制
  const checkRateLimit = useCallback((key: string) => {
    if (!enableRateLimit) return true;
    
    return EnhancedSecurityUtils.checkRateLimit(
      key,
      rateLimitConfig.maxRequests,
      rateLimitConfig.timeWindow
    );
  }, [enableRateLimit, rateLimitConfig]);

  // 记录用户行为
  const trackBehavior = useCallback((action: string, data?: any) => {
    if (!enableBehaviorDetection) return;

    const now = Date.now();
    const behavior = behaviorRef.current;

    switch (action) {
      case 'click':
        behavior.clickCount++;
        
        // 检测快速点击
        if (now - behavior.lastClickTime < 100) {
          if (behavior.clickCount > 10) {
            EnhancedSecurityUtils.detectSuspiciousBehavior({
              rapidClicks: behavior.clickCount
            });
          }
        } else {
          behavior.clickCount = 1;
        }
        
        behavior.lastClickTime = now;
        break;

      case 'navigation':
        behavior.navigationCount++;
        
        // 检测异常导航
        if (behavior.navigationCount > 20) {
          EnhancedSecurityUtils.detectSuspiciousBehavior({
            unusualNavigation: true
          });
        }
        break;

      case 'input':
        // 检测可疑输入
        if (data && typeof data === 'string') {
          const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /vbscript:/i,
            /on\w+=/i
          ];
          
          if (suspiciousPatterns.some(pattern => pattern.test(data))) {
            behavior.suspiciousInputCount++;
            EnhancedSecurityUtils.detectSuspiciousBehavior({
              suspiciousInput: true
            });
          }
        }
        break;
    }
  }, [enableBehaviorDetection]);

  // 获取安全报告
  const getSecurityReport = useCallback(() => {
    return EnhancedSecurityUtils.generateSecurityReport();
  }, []);

  // 清除安全事件
  const clearSecurityEvents = useCallback(() => {
    EnhancedSecurityUtils.clearSecurityEvents();
    updateSecurityState();
  }, [updateSecurityState]);

  // 检测CSP违规
  const handleCSPViolation = useCallback((event: SecurityPolicyViolationEvent) => {
    EnhancedSecurityUtils.detectCSPViolation({
      blockedURI: event.blockedURI,
      documentURI: event.documentURI,
      effectiveDirective: event.effectiveDirective,
      originalPolicy: event.originalPolicy,
      referrer: event.referrer,
      violatedDirective: event.violatedDirective
    });
    updateSecurityState();
  }, [updateSecurityState]);

  // 启动实时监控
  useEffect(() => {
    if (enableRealTimeMonitoring) {
      updateSecurityState();
      intervalRef.current = setInterval(updateSecurityState, monitoringInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableRealTimeMonitoring, monitoringInterval, updateSecurityState]);

  // 监听CSP违规事件
  useEffect(() => {
    document.addEventListener('securitypolicyviolation', handleCSPViolation);
    
    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, [handleCSPViolation]);

  // 监听全局点击事件
  useEffect(() => {
    if (enableBehaviorDetection) {
      const handleClick = () => trackBehavior('click');
      document.addEventListener('click', handleClick);
      
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [enableBehaviorDetection, trackBehavior]);

  return {
    // 状态
    securityState,
    
    // 验证和清理函数
    validateInput,
    sanitizeHTML,
    
    // 行为跟踪
    trackBehavior,
    
    // 速率限制
    checkRateLimit,
    
    // 报告和管理
    getSecurityReport,
    clearSecurityEvents,
    updateSecurityState,
    
    // 工具函数
    isEmailValid: SecurityUtils.validateEmail,
    isPhoneValid: SecurityUtils.validatePhone,
    isURLValid: (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
  };
};

export default useSecurity;
