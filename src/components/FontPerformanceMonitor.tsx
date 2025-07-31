/**
 * 字体性能监控组件
 * 
 * 监控字体加载性能和缓存使用情况
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import React, { useState, useEffect } from 'react';
import { fontLoader } from '../config/FontConfig';
import { memoryMonitor } from '../utils/MemoryManager';
import { getLogger } from '../utils/Logger';

const logFontMonitor = getLogger('FontPerformanceMonitor');

interface FontStats {
  loadedFonts: string[];
  cacheStats: {
    size: number;
    memoryUsage: number;
    memoryUsageMB: number;
    averageAccessCount: number;
  };
  performanceMetrics: {
    fontLoadTime: number;
    cacheHitRate: number;
    totalRequests: number;
    renderTime: number;
    lastUpdateTime: number;
  };
  systemInfo: {
    userAgent: string;
    platform: string;
    language: string;
    cookieEnabled: boolean;
    onlineStatus: boolean;
  };
}

interface FontPerformanceMonitorProps {
  visible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const FontPerformanceMonitor: React.FC<FontPerformanceMonitorProps> = ({
  visible = import.meta.env.DEV, // 开发版本默认显示
  position = 'bottom-right'
}) => {
  const [stats, setStats] = useState<FontStats>({
    loadedFonts: [],
    cacheStats: {
      size: 0,
      memoryUsage: 0,
      memoryUsageMB: 0,
      averageAccessCount: 0
    },
    performanceMetrics: {
      fontLoadTime: 0,
      cacheHitRate: 0,
      totalRequests: 0,
      renderTime: 0,
      lastUpdateTime: Date.now()
    },
    systemInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const updateStats = () => {
      try {
        const renderStartTime = performance.now();

        const loadedFonts = fontLoader.getLoadedFonts();
        const cacheStats = fontLoader.getCacheStats();

        // 计算字体加载时间
        const fontLoadTime = performance.getEntriesByType('navigation')[0]?.loadEventEnd || 0;

        // 计算渲染时间
        const renderTime = performance.now() - renderStartTime;

        setStats(prevStats => ({
          loadedFonts,
          cacheStats,
          performanceMetrics: {
            fontLoadTime,
            cacheHitRate: cacheStats.size > 0 ? (cacheStats.averageAccessCount / cacheStats.size) * 100 : 0,
            totalRequests: cacheStats.size,
            renderTime,
            lastUpdateTime: Date.now()
          },
          systemInfo: {
            ...prevStats.systemInfo,
            onlineStatus: navigator.onLine // 更新在线状态
          }
        }));

        logFontMonitor(`Font stats updated: ${loadedFonts.length} fonts loaded, ${cacheStats.memoryUsageMB.toFixed(2)}MB cached, render: ${renderTime.toFixed(2)}ms`);
      } catch (error) {
        logFontMonitor.extend('error')('Failed to update font stats:', error);
      }
    };

    // 初始更新
    updateStats();

    // 定期更新
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const positionStyles = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' }
  };

  const handleClearCache = () => {
    fontLoader.clearCache();
    logFontMonitor('Font cache cleared manually');
  };

  const handleMemoryCleanup = () => {
    memoryMonitor.logMemoryUsage();
    logFontMonitor('Memory cleanup triggered');
  };

  const handleExportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      stats,
      performance: {
        navigation: performance.getEntriesByType('navigation')[0],
        memory: (performance as any).memory,
        timing: performance.timing
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `font-performance-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    logFontMonitor('Performance data exported');
  };

  const handleResetStats = () => {
    // 重置性能计时器
    performance.clearMarks();
    performance.clearMeasures();

    // 强制更新统计
    setStats(prevStats => ({
      ...prevStats,
      performanceMetrics: {
        ...prevStats.performanceMetrics,
        lastUpdateTime: Date.now()
      }
    }));

    logFontMonitor('Performance stats reset');
  };

  return (
    <div
      data-testid="font-performance-monitor"
      className="font-performance-monitor"
      style={{
        position: 'fixed',
        ...positionStyles[position],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        minWidth: '200px',
        maxWidth: '400px',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: isExpanded ? '10px' : '0'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>🎨 字体性能监控</span>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div>
          <div style={{ marginBottom: '8px' }}>
            <strong>📊 基本统计</strong>
            <div>已加载字体: {stats.loadedFonts.length}</div>
            <div>缓存项目: {stats.cacheStats.size}</div>
            <div>缓存内存: {stats.cacheStats.memoryUsageMB.toFixed(2)}MB</div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <strong>⚡ 性能指标</strong>
            <div>加载时间: {stats.performanceMetrics.fontLoadTime.toFixed(0)}ms</div>
            <div>渲染时间: {stats.performanceMetrics.renderTime.toFixed(2)}ms</div>
            <div>缓存命中率: {stats.performanceMetrics.cacheHitRate.toFixed(1)}%</div>
            <div>平均访问: {stats.cacheStats.averageAccessCount.toFixed(1)}</div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>
              更新时间: {new Date(stats.performanceMetrics.lastUpdateTime).toLocaleTimeString()}
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <strong>🖥️ 系统信息</strong>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>
              <div>平台: {stats.systemInfo.platform}</div>
              <div>语言: {stats.systemInfo.language}</div>
              <div>在线: {stats.systemInfo.onlineStatus ? '✅' : '❌'}</div>
              <div>Cookie: {stats.systemInfo.cookieEnabled ? '✅' : '❌'}</div>
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <strong>🎯 已加载字体</strong>
            <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
              {stats.loadedFonts.length > 0 ? (
                stats.loadedFonts.map((font, index) => (
                  <div key={index} style={{ fontSize: '10px', opacity: 0.8 }}>
                    • {font}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '10px', opacity: 0.6 }}>暂无已加载字体</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={handleClearCache}
              style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '3px 6px',
                borderRadius: '3px',
                fontSize: '9px',
                cursor: 'pointer'
              }}
            >
              清理缓存
            </button>
            <button
              onClick={handleMemoryCleanup}
              style={{
                backgroundColor: '#4444ff',
                color: 'white',
                border: 'none',
                padding: '3px 6px',
                borderRadius: '3px',
                fontSize: '9px',
                cursor: 'pointer'
              }}
            >
              内存检查
            </button>
            <button
              onClick={handleExportData}
              style={{
                backgroundColor: '#44aa44',
                color: 'white',
                border: 'none',
                padding: '3px 6px',
                borderRadius: '3px',
                fontSize: '9px',
                cursor: 'pointer'
              }}
            >
              导出数据
            </button>
            <button
              onClick={handleResetStats}
              style={{
                backgroundColor: '#aa8844',
                color: 'white',
                border: 'none',
                padding: '3px 6px',
                borderRadius: '3px',
                fontSize: '9px',
                cursor: 'pointer'
              }}
            >
              重置统计
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontPerformanceMonitor;
