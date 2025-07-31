/**
 * 字体性能监控组件 - 动态加载版本
 * 
 * 只在开发模式下动态加载，避免生产环境的额外开销
 * 
 * @author FlexiResume Team
 * @date 2025-07-31
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { getLogger } from '../utils/Logger';

const logFontMonitorLazy = getLogger('FontPerformanceMonitorLazy');

// 动态导入FontPerformanceMonitor组件
const FontPerformanceMonitor = lazy(() => 
  import('./FontPerformanceMonitor').then(module => ({
    default: module.FontPerformanceMonitor
  }))
);

interface FontPerformanceMonitorLazyProps {
  visible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  enableHotkey?: boolean; // 是否启用快捷键切换
  hotkey?: string; // 快捷键组合，默认 Ctrl+Shift+F
}

export const FontPerformanceMonitorLazy: React.FC<FontPerformanceMonitorLazyProps> = ({
  visible,
  position = 'bottom-right',
  enableHotkey = true,
  hotkey = 'ctrl+shift+f'
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(visible ?? import.meta.env.DEV);

  // 检查是否应该加载组件
  useEffect(() => {
    // 只在开发环境下加载
    if (import.meta.env.DEV) {
      // 延迟加载，避免影响初始页面性能
      const timer = setTimeout(() => {
        setShouldLoad(true);
        logFontMonitorLazy('🎨 FontPerformanceMonitor 动态加载已启用');
      }, 2000); // 2秒后加载

      return () => clearTimeout(timer);
    } else {
      logFontMonitorLazy('🚫 生产环境，跳过FontPerformanceMonitor加载');
    }
  }, []);

  // 快捷键支持
  useEffect(() => {
    if (!enableHotkey || !import.meta.env.DEV) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const keys = hotkey.toLowerCase().split('+');
      const isCtrlPressed = keys.includes('ctrl') && event.ctrlKey;
      const isShiftPressed = keys.includes('shift') && event.shiftKey;
      const isAltPressed = keys.includes('alt') && event.altKey;
      const keyPressed = event.key.toLowerCase();
      const targetKey = keys[keys.length - 1]; // 最后一个是目标键

      if (isCtrlPressed && isShiftPressed && keyPressed === targetKey) {
        event.preventDefault();
        setIsVisible(prev => {
          const newVisible = !prev;
          logFontMonitorLazy(`🎨 快捷键切换FontPerformanceMonitor: ${newVisible ? '显示' : '隐藏'}`);
          return newVisible;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableHotkey, hotkey]);

  // 如果不应该加载或不可见，则不渲染
  if (!shouldLoad || !isVisible) {
    return null;
  }

  return (
    <Suspense 
      fallback={
        <div
          data-testid="font-performance-monitor"
          className="font-performance-monitor"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            opacity: 0.7
          }}
        >
          🎨 加载中...
        </div>
      }
    >
      <FontPerformanceMonitor 
        visible={isVisible} 
        position={position}
      />
    </Suspense>
  );
};

// 开发环境快捷键提示
if (import.meta.env.DEV) {
  console.log(
    '%c🎨 FontPerformanceMonitor 开发工具已启用\n' +
    '%c快捷键: Ctrl+Shift+F 切换显示/隐藏\n' +
    '%c位置: 右下角\n' +
    '%c功能: 字体性能监控、缓存统计、内存使用',
    'color: #4CAF50; font-weight: bold; font-size: 14px;',
    'color: #2196F3; font-size: 12px;',
    'color: #FF9800; font-size: 12px;',
    'color: #9C27B0; font-size: 12px;'
  );
}

export default FontPerformanceMonitorLazy;
