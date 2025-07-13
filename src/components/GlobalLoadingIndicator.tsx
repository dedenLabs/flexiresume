/**
 * 全局加载状态指示器
 * 
 * 提供全局加载状态的可视化展示，包括进度条、任务信息等
 * 
 * 主要功能：
 * - 📊 实时显示加载进度
 * - 📱 响应式设计和主题支持
 * - 🎯 当前任务信息展示
 * - ⏱️ 剩余时间估算
 * - 🔄 网络状态指示
 * 
 * @author 陈剑
 * @date 2025-01-13
 */

import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../theme';
import {
  addLoadingStateListener,
  GlobalLoadingState
} from '../utils/LoadingManager';
import {
  addNetworkStatusListener,
  NetworkStatus
} from '../utils/NetworkManager';

// 动画定义
const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

// 样式组件
const LoadingContainer = styled.div<{ 
  isVisible: boolean; 
  isDark: boolean;
  position: 'top' | 'bottom';
}>`
  position: fixed;
  ${props => props.position === 'top' ? 'top: 0' : 'bottom: 0'};
  left: 0;
  right: 0;
  z-index: 9999;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, rgba(26, 32, 44, 0.95), rgba(45, 55, 72, 0.95))'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))'
  };
  backdrop-filter: blur(10px);
  border-bottom: ${props => props.position === 'top' 
    ? `1px solid ${props.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
    : 'none'
  };
  border-top: ${props => props.position === 'bottom' 
    ? `1px solid ${props.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
    : 'none'
  };
  box-shadow: ${props => props.position === 'top'
    ? '0 2px 20px rgba(0,0,0,0.1)'
    : '0 -2px 20px rgba(0,0,0,0.1)'
  };
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-out;
  transition: all 0.3s ease;
`;

const LoadingContent = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    padding: 10px 16px;
  }
`;

const LoadingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const LoadingIcon = styled.div<{ isDark: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
  border-top: 2px solid ${props => props.isDark ? 'var(--color-primary)' : '#007bff'};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TaskInfo = styled.div<{ isDark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .task-name {
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  .task-details {
    font-size: 12px;
    color: ${props => props.isDark ? 'var(--color-text-secondary)' : '#666'};
  }
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ProgressBar = styled.div<{ isDark: boolean }>`
  width: 200px;
  height: 4px;
  background: ${props => props.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    width: 150px;
  }
`;

const ProgressFill = styled.div<{ progress: number; isDark: boolean }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${props => props.isDark 
    ? 'linear-gradient(90deg, var(--color-primary), var(--color-primary-hover))'
    : 'linear-gradient(90deg, #007bff, #0056b3)'
  };
  border-radius: 2px;
  transition: width 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressText = styled.span<{ isDark: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};
  min-width: 40px;
  text-align: right;
`;

const NetworkIndicator = styled.div<{ 
  status: 'online' | 'offline' | 'poor'; 
  isDark: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${props => {
    if (props.status === 'offline') return '#dc3545';
    if (props.status === 'poor') return '#ffc107';
    return props.isDark ? 'var(--color-text-secondary)' : '#666';
  }};
  
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      if (props.status === 'offline') return '#dc3545';
      if (props.status === 'poor') return '#ffc107';
      return '#28a745';
    }};
    animation: ${props => props.status !== 'online' ? pulse : 'none'} 1s ease-in-out infinite;
  }
`;

const CloseButton = styled.button<{ isDark: boolean }>`
  background: none;
  border: none;
  color: ${props => props.isDark ? 'var(--color-text-secondary)' : '#666'};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
    color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};
  }
`;

// 组件属性
interface Props {
  position?: 'top' | 'bottom';
  autoHide?: boolean;
  autoHideDelay?: number;
  showNetworkStatus?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
}

/**
 * 全局加载状态指示器组件
 */
const GlobalLoadingIndicator: React.FC<Props> = ({
  position = 'top',
  autoHide = true,
  autoHideDelay = 3000,
  showNetworkStatus = true,
  showCloseButton = true,
  onClose
}) => {
  const { isDark } = useTheme();
  const [loadingState, setLoadingState] = useState<GlobalLoadingState | null>(null);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);

  // 监听加载状态变化
  useEffect(() => {
    const unsubscribe = addLoadingStateListener((state) => {
      setLoadingState(state);
      
      if (state.isLoading && !isManuallyHidden) {
        setIsVisible(true);
      } else if (!state.isLoading && autoHide) {
        // 延迟隐藏，让用户看到完成状态
        setTimeout(() => {
          setIsVisible(false);
        }, autoHideDelay);
      }
    });

    return unsubscribe;
  }, [autoHide, autoHideDelay, isManuallyHidden]);

  // 监听网络状态变化
  useEffect(() => {
    if (!showNetworkStatus) return;

    const unsubscribe = addNetworkStatusListener((status) => {
      setNetworkStatus(status);
    });

    return unsubscribe;
  }, [showNetworkStatus]);

  // 手动关闭
  const handleClose = () => {
    setIsVisible(false);
    setIsManuallyHidden(true);
    onClose?.();
  };

  // 如果没有加载状态或手动隐藏，不显示
  if (!loadingState || isManuallyHidden || (!loadingState.isLoading && !isVisible)) {
    return null;
  }

  // 获取网络状态指示
  const getNetworkIndicatorStatus = (): 'online' | 'offline' | 'poor' => {
    if (!networkStatus?.isOnline) return 'offline';
    if (networkStatus.effectiveType === '2g' || networkStatus.rtt > 500) return 'poor';
    return 'online';
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  return (
    <LoadingContainer 
      isVisible={isVisible} 
      isDark={isDark}
      position={position}
    >
      <LoadingContent>
        <LoadingInfo>
          <LoadingIcon isDark={isDark} />
          <TaskInfo isDark={isDark}>
            <div className="task-name">
              {loadingState.currentTask?.name || '正在加载...'}
            </div>
            <div className="task-details">
              {loadingState.totalTasks > 1 && (
                <>
                  {loadingState.completedTasks}/{loadingState.totalTasks} 个任务
                  {loadingState.estimatedTimeRemaining && (
                    <> · 预计还需 {formatTime(loadingState.estimatedTimeRemaining)}</>
                  )}
                </>
              )}
            </div>
          </TaskInfo>
        </LoadingInfo>

        <ProgressSection>
          <ProgressBar isDark={isDark}>
            <ProgressFill 
              progress={loadingState.overallProgress} 
              isDark={isDark} 
            />
          </ProgressBar>
          <ProgressText isDark={isDark}>
            {loadingState.overallProgress}%
          </ProgressText>
          
          {showNetworkStatus && networkStatus && (
            <NetworkIndicator 
              status={getNetworkIndicatorStatus()} 
              isDark={isDark}
            >
              <div className="indicator" />
              {networkStatus.isOnline ? '在线' : '离线'}
            </NetworkIndicator>
          )}
          
          {showCloseButton && (
            <CloseButton isDark={isDark} onClick={handleClose}>
              ×
            </CloseButton>
          )}
        </ProgressSection>
      </LoadingContent>
    </LoadingContainer>
  );
};

export default GlobalLoadingIndicator;
