/**
 * 增强的错误边界组件
 * 
 * 提供更完善的错误处理、用户友好的错误提示和恢复机制
 * 
 * 主要功能：
 * - 🛡️ 全面的错误捕获和处理
 * - 🔄 智能重试机制
 * - 📊 错误统计和上报
 * - 🎨 用户友好的错误界面
 * - 📱 响应式设计和主题支持
 * 
 * @author dedenlabs
 * @date 2025-01-13
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components'; 
import { useTheme } from '../theme';
import { useI18n } from '../i18n';
import { getCurrentNetworkStatus, addNetworkStatusListener } from '../utils/NetworkManager';
import { getLogger } from '../utils/Logger';

// Debug logger
import { isDebugEnabled } from '../config/ProjectConfig';
const debugErrorBoundary = getLogger('error-boundary');

// 错误类型
export type ErrorType = 'network' | 'chunk' | 'runtime' | 'unknown';

// 错误信息接口
export interface ErrorDetails {
  type: ErrorType;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  networkStatus: any;
  retryCount: number;
}

// 组件属性
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: ErrorDetails) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  level?: 'page' | 'section' | 'component';
  isDark?: boolean;
  t?: any; // i18n翻译函数
}

// 组件状态
interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorDetails?: ErrorDetails;
  retryCount: number;
  isRetrying: boolean;
}

// 样式组件
const ErrorContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark' && prop !== 'level',
})<{ level: string; isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.level) {
      case 'page': return '60px 20px';
      case 'section': return '40px 20px';
      default: return '20px';
    }
  }};
  min-height: ${props => props.level === 'page' ? '400px' : '200px'};
  background: ${props => props.isDark ? 'var(--color-card)' : '#fff'};
  border: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : '#e0e0e0'};
  border-radius: 8px;
  margin: 16px 0;
  text-align: center;
  transition: all 0.3s ease;
`;

const ErrorIcon = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'level',
})<{ level: string }>`
  font-size: ${props => {
    switch (props.level) {
      case 'page': return '48px';
      case 'section': return '36px';
      default: return '24px';
    }
  }};
  margin-bottom: 16px;
  opacity: 0.8;
`;

const ErrorTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
`;

const ErrorMessage = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  color: ${props => props.isDark ? 'var(--color-text-secondary)' : '#666'};
  margin: 0 0 24px 0;
  line-height: 1.5;
  max-width: 500px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark' && prop !== 'variant',
})<{ variant: 'primary' | 'secondary'; isDark: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  
  ${props => props.variant === 'primary' ? `
    background: ${props.isDark ? 'var(--color-primary)' : '#007bff'};
    color: white;
    
    &:hover {
      background: ${props.isDark ? 'var(--color-primary-hover)' : '#0056b3'};
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    color: ${props.isDark ? 'var(--color-text-secondary)' : '#666'};
    border: 1px solid ${props.isDark ? 'var(--color-border-medium)' : '#ddd'};
    
    &:hover {
      background: ${props.isDark ? 'var(--color-hover)' : '#f8f9fa'};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorDetails = styled.details.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  margin-top: 24px;
  max-width: 600px;
  text-align: left;
  
  summary {
    cursor: pointer;
    color: ${props => props.isDark ? 'var(--color-text-secondary)' : '#666'};
    font-size: 14px;
    margin-bottom: 8px;
    
    &:hover {
      color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};
    }
  }
  
  pre {
    background: ${props => props.isDark ? '#1a1a1a' : '#f8f9fa'};
    border: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : '#e0e0e0'};
    border-radius: 4px;
    padding: 12px;
    font-size: 12px;
    line-height: 1.4;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};
  }
`;

const NetworkStatus = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  margin-top: 16px;
  padding: 8px 12px;
  background: ${props => props.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
  border-radius: 4px;
  font-size: 12px;
  color: ${props => props.isDark ? 'var(--color-text-secondary)' : '#666'};
`;

/**
 * 错误类型检测
 */
function detectErrorType(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || 
      message.includes('fetch') || 
      message.includes('timeout') ||
      error.name === 'TypeError' && message.includes('failed to fetch')) {
    return 'network';
  }
  
  if (message.includes('chunk') || 
      message.includes('loading') ||
      message.includes('import')) {
    return 'chunk';
  }
  
  return 'runtime';
}

/**
 * 获取用户友好的错误消息
 */
function getUserFriendlyMessage(errorType: ErrorType, isOnline: boolean): string {
  if (!isOnline) {
    return '网络连接已断开，请检查您的网络连接后重试。';
  }
  
  switch (errorType) {
    case 'network':
      return '网络请求失败，请检查网络连接或稍后重试。';
    case 'chunk':
      return '页面资源加载失败，可能是网络问题，请尝试刷新页面。';
    case 'runtime':
      return '页面运行时出现错误，请尝试刷新页面或联系技术支持。';
    default:
      return '页面遇到了一些问题，请尝试刷新页面或稍后再试。';
  }
}

/**
 * 错误边界组件内部实现
 */
class EnhancedErrorBoundaryImpl extends Component<Props & { isDark: boolean }, State> {
  private networkStatusUnsubscribe?: () => void;
  
  constructor(props: Props & { isDark: boolean }) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0,
      isRetrying: false
    };
  }
  
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorType = detectErrorType(error);
    const networkStatus = getCurrentNetworkStatus();
    
    const errorDetails: ErrorDetails = {
      type: errorType,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      networkStatus,
      retryCount: this.state.retryCount
    };
    
    this.setState({
      error,
      errorInfo,
      errorDetails
    });
    
    // 调用错误回调
    this.props.onError?.(errorDetails);
    
    // 开发环境下打印详细错误信息
    if (isDebugEnabled()) {
      debugErrorBoundary.extend('error')('EnhancedErrorBoundary caught an error:', error, errorInfo);
      debugErrorBoundary('Error details:', errorDetails);
    }
    
    // 监听网络状态变化
    this.networkStatusUnsubscribe = addNetworkStatusListener((status) => {
      if (status.isOnline && this.state.hasError) {
        // 网络恢复时提示用户可以重试
        debugErrorBoundary('Network recovered, user can retry');
      }
    });
  }
  
  componentWillUnmount() {
    this.networkStatusUnsubscribe?.();
  }
  
  handleRetry = async () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount >= maxRetries) {
      return;
    }
    
    this.setState({ isRetrying: true });
    
    // 等待一小段时间再重试
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorDetails: undefined,
      retryCount: this.state.retryCount + 1,
      isRetrying: false
    });
  };
  
  handleReload = () => {
    window.location.reload();
  };
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      const { level = 'component', showErrorDetails = false } = this.props;
      const { errorDetails, retryCount, isRetrying } = this.state;
      const maxRetries = this.props.maxRetries || 3;
      const networkStatus = getCurrentNetworkStatus();
      
      const errorType = errorDetails?.type || 'unknown';
      const userMessage = getUserFriendlyMessage(errorType, networkStatus.isOnline);
      
      return (
        <ErrorContainer level={level} isDark={this.props.isDark}>
          <ErrorIcon level={level}>
            {errorType === 'network' ? '🌐' : 
             errorType === 'chunk' ? '📦' : 
             errorType === 'runtime' ? '⚠️' : '❌'}
          </ErrorIcon>
          
          <ErrorTitle isDark={this.props.isDark}>
            {errorType === 'network' ? (this.props.t?.common?.networkError || '网络连接问题') :
             errorType === 'chunk' ? (this.props.t?.common?.resourceLoadError || '资源加载失败') :
             errorType === 'runtime' ? (this.props.t?.common?.runtimeError || '运行时错误') : (this.props.t?.common?.pageLoadError || '页面加载出错了')}
          </ErrorTitle>
          
          <ErrorMessage isDark={this.props.isDark}>
            {userMessage}
            {retryCount > 0 && (
              <><br />已重试 {retryCount} 次</>
            )}
          </ErrorMessage>
          
          <ButtonGroup>
            <ActionButton
              variant="primary"
              isDark={this.props.isDark}
              onClick={this.handleRetry}
              disabled={isRetrying || retryCount >= maxRetries}
            >
              {isRetrying ? (this.props.t?.common?.retrying || '重试中...') :
               retryCount >= maxRetries ? (this.props.t?.common?.maxRetriesReached || '已达最大重试次数') : (this.props.t?.common?.reload || '重新加载')}
            </ActionButton>
            
            <ActionButton
              variant="secondary"
              isDark={this.props.isDark}
              onClick={this.handleReload}
            >
              刷新页面
            </ActionButton>
          </ButtonGroup>
          
          {!networkStatus.isOnline && (
            <NetworkStatus isDark={this.props.isDark}>
              🔴 网络连接已断开
            </NetworkStatus>
          )}
          
          {showErrorDetails && errorDetails && (
            <ErrorDetails isDark={this.props.isDark}>
              <summary>错误详情 (开发模式)</summary>
              <pre>
                错误类型: {errorDetails.type}
                {'\n'}错误消息: {errorDetails.message}
                {'\n'}时间戳: {new Date(errorDetails.timestamp).toLocaleString()}
                {'\n'}网络状态: {JSON.stringify(errorDetails.networkStatus, null, 2)}
                {errorDetails.stack && `\n\n堆栈跟踪:\n${errorDetails.stack}`}
                {errorDetails.componentStack && `\n\n组件堆栈:\n${errorDetails.componentStack}`}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }
    
    return this.props.children;
  }
}

/**
 * 增强的错误边界组件
 */
const EnhancedErrorBoundary: React.FC<Props> = (props) => {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <EnhancedErrorBoundaryImpl
      {...props}
      isDark={isDark}
      t={t}
      showErrorDetails={props.showErrorDetails ?? process.env.NODE_ENV === 'development'}
    />
  );
};

export default EnhancedErrorBoundary;

/**
 * 导出错误类型和接口供其他组件使用
 */
export type { ErrorType, ErrorDetails };
