import React from 'react';
import { ContentWithLine } from './TimelineStyles';

/**
 * ContentWithLine组件的React包装器
 * 支持显示开关功能，当showLine为false时组件作为空节点不做任何处理
 */
interface ContentWithLineWrapperProps {
  isDark?: boolean;
  showLine?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const ContentWithLineWrapper: React.FC<ContentWithLineWrapperProps> = ({ 
  isDark, 
  showLine = true, 
  children, 
  className 
}) => {
  // 当showLine为false时，直接返回空节点
  if (showLine === false) {
    return null;
  }

  // 正常渲染ContentWithLine组件
  return (
    <ContentWithLine isDark={isDark} showLine={showLine} className={className}>
      {children}
    </ContentWithLine>
  );
};

export default ContentWithLineWrapper;
