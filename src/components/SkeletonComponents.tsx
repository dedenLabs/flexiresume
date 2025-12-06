/**
 * 骨架屏组件集合
 *
 * 提供各种场景下的骨架屏组件，提升用户体验
 *
 * 主要特性：
 * - 🎨 完全匹配实际内容的尺寸和布局
 * - 🌓 完整支持深色模式，自动适配主题
 * - 📱 响应式设计，适配各种设备尺寸
 * - ⚡ 流畅的动画效果，提升视觉体验
 * - 🔧 高度可定制，支持各种尺寸和样式
 *
 * 组件说明：
 * - SkeletonBase: 基础骨架屏样式，包含动画效果
 * - SkeletonText: 文本骨架屏，支持自定义宽度和高度
 * - SkeletonTitle: 标题骨架屏，支持小、中、大三种尺寸
 * - SkeletonAvatar: 头像骨架屏，支持自定义尺寸
 * - SkeletonButton: 按钮骨架屏
 * - SkeletonCard: 卡片骨架屏
 * - SkeletonResume: 专门为简历页面设计的完整骨架屏
 *
 * @author dedenlabs
 * @date 2024-12-27
 * @updated 2024-12-27 - 重构骨架屏以精确匹配实际内容布局
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useSafeTheme } from '../utils/ThemeUtils';
import { watchMinWidth } from '../utils/Tools';

/**
 * 骨架屏闪烁动画
 *
 * 创建从左到右的闪烁效果，模拟内容加载过程
 * 动画持续1.5秒，无限循环，线性过渡
 */
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

/**
 * 基础骨架屏样式组件
 *
 * 所有骨架屏组件的基础样式，包含：
 * - 渐变背景动画效果
 * - 深色模式自适应
 * - 平滑的主题切换过渡
 *
 * @param isDark 是否为深色模式
 */
const SkeletonBase = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
  background: ${props => props.isDark
    ? 'linear-gradient(90deg, var(--color-border-medium) 25%, var(--color-border-dark) 50%, var(--color-border-medium) 75%)'
    : 'linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border-medium) 50%, var(--color-border-light) 75%)'
  };
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
  transition: background 0.3s ease;
`;



// 文本骨架屏
export const SkeletonText = styled(SkeletonBase).withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{
  width?: string;
  height?: string;
  margin?: string;
  isDark?: boolean;
}>`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '8px 0'};
`;

// 标题骨架屏
export const SkeletonTitle = styled(SkeletonBase).withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ size?: 'small' | 'medium' | 'large'; isDark?: boolean }>`
  height: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  width: ${props => {
    switch (props.size) {
      case 'small': return '120px';
      case 'large': return '200px';
      default: return '150px';
    }
  }};
  margin: 16px 0;
`;

// 头像骨架屏
export const SkeletonAvatar = styled(SkeletonBase).withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ size?: number; isDark?: boolean }>`
  width: ${props => props.size || 80}px;
  height: ${props => props.size || 80}px;
  border-radius: 50%;
  flex-shrink: 0;
`;

// 按钮骨架屏
export const SkeletonButton = styled(SkeletonBase).withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ width?: string; isDark?: boolean }>`
  height: 36px;
  width: ${props => props.width || '100px'};
  border-radius: 6px;
`;

// 卡片骨架屏
export const SkeletonCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ padding?: string; isDark?: boolean }>`
  padding: ${props => props.padding || '20px'};
  border: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : '#e0e0e0'};
  border-radius: 8px;
  margin: 16px 0;
  background: ${props => props.isDark ? 'var(--color-card)' : '#fff'};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

// 列表项骨架屏
export const SkeletonListItem: React.FC<{ showAvatar?: boolean; isDark?: boolean }> = ({
  showAvatar = false,
  isDark = false
}) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
    {showAvatar && <SkeletonAvatar size={40} isDark={isDark} style={{ marginRight: '12px' }} />}
    <div style={{ flex: 1 }}>
      <SkeletonText width="80%" height="18px" margin="0 0 8px 0" isDark={isDark} />
      <SkeletonText width="60%" height="14px" margin="0" isDark={isDark} />
    </div>
  </div>
);

// 表格骨架屏
export const SkeletonTable: React.FC<{ rows?: number; columns?: number; isDark?: boolean }> = ({
  rows = 3,
  columns = 4,
  isDark = false
}) => (
  <div style={{ width: '100%' }}>
    {/* 表头 */}
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonText key={i} width="100%" height="20px" isDark={isDark} />
      ))}
    </div>
    {/* 表格行 */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonText key={colIndex} width="100%" height="16px" isDark={isDark} />
        ))}
      </div>
    ))}
  </div>
);

// 图片骨架屏
export const SkeletonImage = styled(SkeletonBase)<{ 
  width?: string; 
  height?: string; 
  aspectRatio?: string;
}>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '200px'};
  aspect-ratio: ${props => props.aspectRatio || 'auto'};
  border-radius: 8px;
`;

// 导航栏骨架屏
export const SkeletonNavbar: React.FC = () => {
  const { isDark } = useSafeTheme();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: `1px solid ${isDark ? 'var(--color-border-medium)' : '#e0e0e0'}`
    }}>
      <SkeletonText width="120px" height="24px" isDark={isDark} />
      <div style={{ display: 'flex', gap: '16px' }}>
        <SkeletonButton width="80px" isDark={isDark} />
        <SkeletonButton width="80px" isDark={isDark} />
        <SkeletonButton width="80px" isDark={isDark} />
      </div>
    </div>
  );
};

// 页面骨架屏
export const SkeletonPage: React.FC = () => {
  const { isDark } = useSafeTheme();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <SkeletonNavbar />

      {/* 页面标题 */}
      <div style={{ margin: '40px 0' }}>
        <SkeletonTitle size="large" isDark={isDark} />
        <SkeletonText width="70%" height="18px" isDark={isDark} />
      </div>

      {/* 内容区域 */}
      <div style={{ display: 'grid', gap: '24px' }}>
        <SkeletonCard isDark={isDark}>
          <SkeletonTitle size="medium" isDark={isDark} />
          <SkeletonText width="100%" isDark={isDark} />
          <SkeletonText width="90%" isDark={isDark} />
          <SkeletonText width="85%" isDark={isDark} />
        </SkeletonCard>

        <SkeletonCard isDark={isDark}>
          <SkeletonTitle size="medium" isDark={isDark} />
          <SkeletonListItem showAvatar isDark={isDark} />
          <SkeletonListItem showAvatar isDark={isDark} />
          <SkeletonListItem showAvatar isDark={isDark} />
        </SkeletonCard>

        <SkeletonCard isDark={isDark}>
          <SkeletonTitle size="medium" isDark={isDark} />
          <SkeletonTable rows={4} columns={3} isDark={isDark} />
        </SkeletonCard>
      </div>
    </div>
  );
};

// 骨架屏容器 - 完全匹配ResumeWrapper的样式和尺寸
const SkeletonResumeWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'minWidth',
})<{ minWidth: number }>`
  /* 完全匹配ResumeWrapper的样式 */
  max-width: 800px;
  min-width: ${props => props.minWidth}px;
  width: 100%; /* 确保占满可用宽度 */
  border-top: 1px solid var(--color-border-medium);
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  padding: 20px;
  background: var(--color-card);
  color: var(--color-text-primary);
  box-shadow: 0 0 15px var(--color-shadow-medium);
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  /* 确保骨架屏始终居中显示 */
  margin: 0 auto;

  /* 移动端适配 - 与ResumeWrapper保持一致 */
  @media (max-width: 768px) {
    padding: 15px;
    margin: 0 10px;
    width: calc(100% - 20px);
    min-width: auto; /* 移动端不限制最小宽度 */
  }

  /* 在打印时隐藏 */
  @media print {
    border: 0px;
    box-shadow: 0 0 0px rgba(0, 0, 0, 0);
    background: white !important;
    color: black !important;
  }
`;

// 简历骨架屏（专门为简历页面设计）- 使用与实际组件相同的尺寸
export const SkeletonResume: React.FC = () => {
  const { isDark } = useSafeTheme();

  // 使用与FlexiResume相同的尺寸计算逻辑
  const minWidth = watchMinWidth(800);
  const calculatedMinWidth = minWidth - 40; // 与FlexiResume保持一致

  return (
    <SkeletonResumeWrapper minWidth={calculatedMinWidth}>
      {/* 个人信息区域 */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <SkeletonAvatar size={100} isDark={isDark} />
        <div style={{ flex: 1 }}>
          <SkeletonTitle size="large" isDark={isDark} />
          <SkeletonText width="60%" height="18px" isDark={isDark} />
          <SkeletonText width="50%" height="16px" isDark={isDark} />
          <SkeletonText width="40%" height="16px" isDark={isDark} />
        </div>
      </div>

      {/* 技能区域 */}
      <SkeletonCard isDark={isDark}>
        <SkeletonTitle size="medium" isDark={isDark} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <SkeletonText width="80%" isDark={isDark} />
          <SkeletonText width="70%" isDark={isDark} />
          <SkeletonText width="90%" isDark={isDark} />
          <SkeletonText width="75%" isDark={isDark} />
          <SkeletonText width="85%" isDark={isDark} />
          <SkeletonText width="65%" isDark={isDark} />
        </div>
      </SkeletonCard>

      {/* 工作经历区域 */}
      <SkeletonCard isDark={isDark}>
        <SkeletonTitle size="medium" isDark={isDark} />
        <div style={{ marginBottom: '24px' }}>
          <SkeletonText width="40%" height="20px" isDark={isDark} />
          <SkeletonText width="100%" isDark={isDark} />
          <SkeletonText width="95%" isDark={isDark} />
          <SkeletonText width="88%" isDark={isDark} />
        </div>
        <div>
          <SkeletonText width="35%" height="20px" isDark={isDark} />
          <SkeletonText width="100%" isDark={isDark} />
          <SkeletonText width="92%" isDark={isDark} />
          <SkeletonText width="85%" isDark={isDark} />
        </div>
      </SkeletonCard>

      {/* 项目经历区域 */}
      <SkeletonCard isDark={isDark}>
        <SkeletonTitle size="medium" isDark={isDark} />
        <SkeletonText width="50%" height="18px" isDark={isDark} />
        <SkeletonText width="100%" isDark={isDark} />
        <SkeletonText width="90%" isDark={isDark} />
        <SkeletonText width="95%" isDark={isDark} />
      </SkeletonCard>
    </SkeletonResumeWrapper>
  );
};
