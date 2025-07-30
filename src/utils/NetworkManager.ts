/**
 * 网络管理器
 * 
 * 提供网络状态检测、请求重试、离线处理等功能
 * 
 * 主要功能：
 * - 🌐 网络状态实时监控
 * - 🔄 智能重试机制
 * - 📡 离线状态处理
 * - ⏱️ 请求超时管理
 * - 📊 网络质量评估
 * 
 * @author 陈剑
 * @date 2025-01-13
 */

import { isDebugEnabled } from '../config/ProjectConfig'; 
import { getLogger } from './Logger';

const logNetworkManager = getLogger('NetworkManager');

// 网络状态类型
export interface NetworkStatus {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

// 重试配置
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

// 请求配置
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retry?: RetryConfig;
  onProgress?: (loaded: number, total: number) => void;
}

// 默认重试配置
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error) => {
    // 网络错误或5xx服务器错误才重试
    return error.name === 'TypeError' || 
           (error.status >= 500 && error.status < 600);
  }
};

// 网络状态监听器
type NetworkStatusListener = (status: NetworkStatus) => void;
const networkListeners = new Set<NetworkStatusListener>();

// 当前网络状态
let currentNetworkStatus: NetworkStatus = {
  isOnline: navigator.onLine,
  connectionType: 'unknown',
  effectiveType: 'unknown',
  downlink: 0,
  rtt: 0,
  saveData: false
};

/**
 * 获取网络连接信息
 */
function getConnectionInfo(): Partial<NetworkStatus> {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (connection) {
    return {
      connectionType: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false
    };
  }
  
  return {};
}

/**
 * 更新网络状态
 */
function updateNetworkStatus() {
  const connectionInfo = getConnectionInfo();
  const newStatus: NetworkStatus = {
    isOnline: navigator.onLine,
    ...connectionInfo,
    connectionType: connectionInfo.connectionType || 'unknown',
    effectiveType: connectionInfo.effectiveType || 'unknown',
    downlink: connectionInfo.downlink || 0,
    rtt: connectionInfo.rtt || 0,
    saveData: connectionInfo.saveData || false
  };
  
  // 只有状态真正改变时才通知
  if (JSON.stringify(newStatus) !== JSON.stringify(currentNetworkStatus)) {
    currentNetworkStatus = newStatus;
    
    if (isDebugEnabled()) {
      logNetworkManager('[NetworkManager] Network status updated:', newStatus);
    }
    
    // 通知所有监听器
    networkListeners.forEach(listener => {
      try {
        listener(newStatus);
      } catch (error) {
        logNetworkManager.extend('error')('[NetworkManager] Error in network status listener:', error);
      }
    });
  }
}

/**
 * 初始化网络状态监控
 */
export function initializeNetworkMonitoring() {
  // 监听在线/离线状态变化
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  
  // 监听连接信息变化
  const connection = (navigator as any).connection;
  if (connection) {
    connection.addEventListener('change', updateNetworkStatus);
  }
  
  // 初始化状态
  updateNetworkStatus();
  
  if (isDebugEnabled()) {
    logNetworkManager('[NetworkManager] Network monitoring initialized');
  }
}

/**
 * 添加网络状态监听器
 */
export function addNetworkStatusListener(listener: NetworkStatusListener): () => void {
  networkListeners.add(listener);
  
  // 立即调用一次，提供当前状态
  listener(currentNetworkStatus);
  
  // 返回取消监听的函数
  return () => {
    networkListeners.delete(listener);
  };
}

/**
 * 获取当前网络状态
 */
export function getCurrentNetworkStatus(): NetworkStatus {
  return { ...currentNetworkStatus };
}

/**
 * 检查网络质量
 */
export function getNetworkQuality(): 'excellent' | 'good' | 'fair' | 'poor' | 'offline' {
  if (!currentNetworkStatus.isOnline) {
    return 'offline';
  }
  
  const { effectiveType, rtt, downlink } = currentNetworkStatus;
  
  // 基于有效连接类型判断
  if (effectiveType === '4g' && rtt < 100 && downlink > 10) {
    return 'excellent';
  } else if (effectiveType === '4g' || (effectiveType === '3g' && rtt < 200)) {
    return 'good';
  } else if (effectiveType === '3g' || effectiveType === '2g') {
    return 'fair';
  } else {
    return 'poor';
  }
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 计算重试延迟时间
 */
function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  const delay = Math.min(
    config.baseDelay * Math.pow(config.backoffFactor, attempt),
    config.maxDelay
  );
  
  // 添加随机抖动，避免雷群效应
  const jitter = delay * 0.1 * Math.random();
  return delay + jitter;
}

/**
 * 带重试的fetch请求
 */
export async function fetchWithRetry(
  url: string, 
  config: RequestConfig = {}
): Promise<Response> {
  const {
    timeout = 10000,
    retry = DEFAULT_RETRY_CONFIG,
    onProgress,
    ...fetchConfig
  } = config;
  
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retry };
  let lastError: any;
  
  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      // 检查网络状态
      if (!currentNetworkStatus.isOnline) {
        throw new Error('Network is offline');
      }
      
      // 创建AbortController用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      if (isDebugEnabled() && attempt > 0) {
        logNetworkManager(`[NetworkManager] Retry attempt ${attempt} for ${url}`);
      }
      
      // 发送请求
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // 检查响应状态
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }
      
      if (isDebugEnabled() && attempt > 0) {
        logNetworkManager(`[NetworkManager] Request succeeded after ${attempt} retries`);
      }
      
      return response;
      
    } catch (error: any) {
      lastError = error;
      clearTimeout(timeoutId);
      
      // 检查是否应该重试
      if (attempt >= retryConfig.maxRetries || 
          !retryConfig.retryCondition?.(error)) {
        break;
      }
      
      // 计算延迟时间并等待
      const delayTime = calculateRetryDelay(attempt, retryConfig);
      
      if (isDebugEnabled()) {
        logNetworkManager.extend('warn')(`[NetworkManager] Request failed, retrying in ${delayTime}ms:`, error.message);
      }
      
      await delay(delayTime);
    }
  }
  
  // 所有重试都失败了
  if (isDebugEnabled()) {
    logNetworkManager.extend('error')(`[NetworkManager] Request failed after ${retryConfig.maxRetries} retries:`, lastError);
  }
  
  throw lastError;
}

/**
 * 检查URL是否可访问
 */
export async function checkUrlAccessibility(url: string, timeout = 5000): Promise<boolean> {
  try {
    const response = await fetchWithRetry(url, {
      method: 'HEAD',
      timeout,
      retry: { maxRetries: 1, baseDelay: 500, maxDelay: 1000, backoffFactor: 1 }
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 清理网络监控
 */
export function cleanupNetworkMonitoring() {
  window.removeEventListener('online', updateNetworkStatus);
  window.removeEventListener('offline', updateNetworkStatus);
  
  const connection = (navigator as any).connection;
  if (connection) {
    connection.removeEventListener('change', updateNetworkStatus);
  }
  
  networkListeners.clear();
  
  if (isDebugEnabled()) {
    logNetworkManager('[NetworkManager] Network monitoring cleaned up');
  }
}
