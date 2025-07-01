/**
 * 骨架屏组件集合
 * 
 * 提供各种场景下的骨架屏组件，提升用户体验
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

// 骨架屏动画
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// 基础骨架屏样式
const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
`;

// 文本骨架屏
export const SkeletonText = styled(SkeletonBase)<{ 
  width?: string; 
  height?: string; 
  margin?: string;
}>`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '8px 0'};
`;

// 标题骨架屏
export const SkeletonTitle = styled(SkeletonBase)<{ size?: 'small' | 'medium' | 'large' }>`
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
export const SkeletonAvatar = styled(SkeletonBase)<{ size?: number }>`
  width: ${props => props.size || 80}px;
  height: ${props => props.size || 80}px;
  border-radius: 50%;
  flex-shrink: 0;
`;

// 按钮骨架屏
export const SkeletonButton = styled(SkeletonBase)<{ width?: string }>`
  height: 36px;
  width: ${props => props.width || '100px'};
  border-radius: 6px;
`;

// 卡片骨架屏
export const SkeletonCard = styled.div<{ padding?: string }>`
  padding: ${props => props.padding || '20px'};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 16px 0;
  background: #fff;
`;

// 列表项骨架屏
export const SkeletonListItem: React.FC<{ showAvatar?: boolean }> = ({ showAvatar = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
    {showAvatar && <SkeletonAvatar size={40} style={{ marginRight: '12px' }} />}
    <div style={{ flex: 1 }}>
      <SkeletonText width="80%" height="18px" margin="0 0 8px 0" />
      <SkeletonText width="60%" height="14px" margin="0" />
    </div>
  </div>
);

// 表格骨架屏
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 3, 
  columns = 4 
}) => (
  <div style={{ width: '100%' }}>
    {/* 表头 */}
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonText key={i} width="100%" height="20px" />
      ))}
    </div>
    {/* 表格行 */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonText key={colIndex} width="100%" height="16px" />
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
export const SkeletonNavbar: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '16px 0',
    borderBottom: '1px solid #e0e0e0'
  }}>
    <SkeletonText width="120px" height="24px" />
    <div style={{ display: 'flex', gap: '16px' }}>
      <SkeletonButton width="80px" />
      <SkeletonButton width="80px" />
      <SkeletonButton width="80px" />
    </div>
  </div>
);

// 页面骨架屏
export const SkeletonPage: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
    <SkeletonNavbar />
    
    {/* 页面标题 */}
    <div style={{ margin: '40px 0' }}>
      <SkeletonTitle size="large" />
      <SkeletonText width="70%" height="18px" />
    </div>

    {/* 内容区域 */}
    <div style={{ display: 'grid', gap: '24px' }}>
      <SkeletonCard>
        <SkeletonTitle size="medium" />
        <SkeletonText width="100%" />
        <SkeletonText width="90%" />
        <SkeletonText width="85%" />
      </SkeletonCard>

      <SkeletonCard>
        <SkeletonTitle size="medium" />
        <SkeletonListItem showAvatar />
        <SkeletonListItem showAvatar />
        <SkeletonListItem showAvatar />
      </SkeletonCard>

      <SkeletonCard>
        <SkeletonTitle size="medium" />
        <SkeletonTable rows={4} columns={3} />
      </SkeletonCard>
    </div>
  </div>
);

// 简历骨架屏（专门为简历页面设计）
export const SkeletonResume: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', background: '#fff' }}>
    {/* 个人信息区域 */}
    <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
      <SkeletonAvatar size={100} />
      <div style={{ flex: 1 }}>
        <SkeletonTitle size="large" />
        <SkeletonText width="60%" height="18px" />
        <SkeletonText width="50%" height="16px" />
        <SkeletonText width="40%" height="16px" />
      </div>
    </div>

    {/* 技能区域 */}
    <SkeletonCard>
      <SkeletonTitle size="medium" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <SkeletonText width="80%" />
        <SkeletonText width="70%" />
        <SkeletonText width="90%" />
        <SkeletonText width="75%" />
        <SkeletonText width="85%" />
        <SkeletonText width="65%" />
      </div>
    </SkeletonCard>

    {/* 工作经历区域 */}
    <SkeletonCard>
      <SkeletonTitle size="medium" />
      <div style={{ marginBottom: '24px' }}>
        <SkeletonText width="40%" height="20px" />
        <SkeletonText width="100%" />
        <SkeletonText width="95%" />
        <SkeletonText width="88%" />
      </div>
      <div>
        <SkeletonText width="35%" height="20px" />
        <SkeletonText width="100%" />
        <SkeletonText width="92%" />
        <SkeletonText width="85%" />
      </div>
    </SkeletonCard>

    {/* 项目经历区域 */}
    <SkeletonCard>
      <SkeletonTitle size="medium" />
      <SkeletonText width="50%" height="18px" />
      <SkeletonText width="100%" />
      <SkeletonText width="90%" />
      <SkeletonText width="95%" />
    </SkeletonCard>
  </div>
);
