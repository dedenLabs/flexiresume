import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { isDevelopment, isDebugEnabled } from '../config/ProjectConfig';
import debug from 'debug';
import { useI18n } from '../i18n';


// Debug logger
const debugDev = debug('app:development');

/**
 * 开发环境提示组件样式
 * 使用shouldForwardProp防止isVisible传递到DOM
 */
const NoticeContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
}) <{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  z-index: 10000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(${props => props.isVisible ? '0' : '-100%'});
  transition: transform 0.3s ease-in-out;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
`;

const NoticeContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const NoticeText = styled.div`
  flex: 1;
  min-width: 300px;
`;

const NoticeTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NoticeDescription = styled.div`
  opacity: 0.9;
  font-size: 13px;
`;

const NoticeActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const WarningIcon = styled.span`
font-size: 16px;
`;
// tips内容移到i18n中

/**
 * 开发环境提示组件
 * 
 * 功能：
 * - 检测开发环境并显示提示
 * - 介绍开发模式的特点和限制
 * - 提供构建模式的建议
 * - 支持用户手动关闭
 */
const DevelopmentNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    // 只在开发环境显示
    if (!isDevelopment()) {
      debugDev('Not in development environment, notice hidden');
      return;
    }

    // 检查用户是否已经关闭过提示
    const dismissed = localStorage.getItem('dev-notice-dismissed');
    if (dismissed === 'true') {
      debugDev('Notice previously dismissed by user');
      setIsDismissed(true);
      return;
    }

    // 延迟显示，避免影响页面初始加载
    const timer = setTimeout(() => {
      setIsVisible(true);
      debugDev('Development notice shown');

      // 在控制台输出详细信息（用户功能需求，保留console输出）
      console.group(t.common?.developmentEnvironment || '🚀 FlexiResume 开发环境');
      console.log(t.common?.developmentTips || '开发环境提示');
      console.groupEnd();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  /**
   * 关闭提示
   */
  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('dev-notice-dismissed', 'true');
    debugDev('Notice dismissed by user');
  };

  /**
   * 重置提示状态（用于调试）
   */
  const handleReset = () => {
    localStorage.removeItem('dev-notice-dismissed');
    setIsDismissed(false);
    setIsVisible(true);
    debugDev('Notice reset');
    alert(t.common?.resetAlert || '已重置');
  };

  /**
   * 打开构建指南 
   */
  const handleBuildGuide = () => {
    // 用户功能需求，保留console输出
    console.group(t.common?.buildGuide || '构建指南');
    console.log(t.common?.developmentTips || '开发环境提示');
    console.groupEnd();

    // 用户友好的提示窗口
    alert(t.common?.buildGuideAlert || '📖 构建指南已输出到控制台\n💡 请打开浏览器控制台查看详细信息');
  };

  // 不在开发环境或已被关闭时不显示
  if (!isDevelopment() || isDismissed) {
    return null;
  }

  return (
    <NoticeContainer isVisible={isVisible} data-testid="development-notice">
      <NoticeContent>
        <NoticeText data-testid="notice-text">
          <NoticeTitle>
            <WarningIcon>🚀</WarningIcon>
            {t.common?.developmentMode || '开发环境模式 (npm run dev)'}
          </NoticeTitle>
          <NoticeDescription>
            当前运行在开发模式下，部分折叠/展开功能可能不完整渲染。
            {t.common?.developmentDescription || '如需完整功能测试，建议使用 npm run build 构建后预览。'}
          </NoticeDescription>
        </NoticeText>
        <NoticeActions>
          <ActionButton onClick={handleBuildGuide}>
            {t.common?.buildGuideButton || '📖 构建指南'}
          </ActionButton>
          {isDebugEnabled() && (
            <ActionButton onClick={handleReset}>
              {t.common?.resetButton || '🔄 重置'}
            </ActionButton>
          )}
          <CloseButton onClick={handleDismiss} title={t.common?.close || '关闭提示'}>
            ×
          </CloseButton>
        </NoticeActions>
      </NoticeContent>
    </NoticeContainer>
  );
};

export default DevelopmentNotice;
