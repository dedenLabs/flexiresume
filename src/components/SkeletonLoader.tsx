import React from 'react';
import styled from 'styled-components';
import { useSafeTheme } from '../utils/ThemeUtils';
import {
  SkeletonAvatar,
  SkeletonTitle,
  SkeletonText,
  SkeletonCard
} from './SkeletonComponents';

// 使用SkeletonComponents中的统一动画，无需重复定义

const SkeletonWrapper = styled.div<{ isDark?: boolean }>`
  /* 响应式宽度设计 - 匹配实际简历布局 */
  width: 100%;
  max-width: 800px;
  min-width: 320px; /* 最小宽度确保移动端可用 */
  padding: 20px;
  margin: 0 auto; /* 居中显示 */
  background: ${props => props.isDark ? 'var(--color-card)' : 'var(--color-surface)'};
  border-radius: 8px;
  box-shadow: 0 0 15px var(--color-shadow-medium);
  box-sizing: border-box;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  /* 移动端适配 */
  @media (max-width: 768px) {
    padding: 15px;
    margin: 0 10px; /* 移动端留出边距 */
    width: calc(100% - 20px);
  }
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
`;

// 使用SkeletonComponents中的SkeletonAvatar，自定义尺寸
const LocalSkeletonAvatar = styled(SkeletonAvatar)`
  width: 80px;
  height: 80px;
`;

const SkeletonInfo = styled.div`
  flex: 1;
`;

// 使用SkeletonComponents中的SkeletonTitle，自定义尺寸
const LocalSkeletonTitle = styled(SkeletonTitle)`
  height: 32px;
  width: 200px;
  margin-bottom: 12px;
`;

// 使用SkeletonComponents中的SkeletonText
const LocalSkeletonText = styled(SkeletonText)`
  margin: 8px 0;
`;

const SkeletonSection = styled.div`
  margin: 30px 0;
`;

const SkeletonSectionTitle = styled.div<{ isDark?: boolean }>`
  height: 24px;
  width: 150px;
  margin-bottom: 20px;
  border-radius: 6px;
  background: ${props => props.isDark
    ? 'linear-gradient(90deg, var(--color-border-medium) 25%, var(--color-border-dark) 50%, var(--color-border-medium) 75%)'
    : 'linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border-medium) 50%, var(--color-border-light) 75%)'
  };
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  transition: background 0.3s ease;
`;

const SkeletonCard = styled.div<{ isDark?: boolean }>`
  padding: 20px;
  border: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : 'var(--color-border-light)'};
  border-radius: 8px;
  margin-bottom: 16px;
  background: ${props => props.isDark ? 'var(--color-card)' : 'var(--color-surface)'};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

/**
 * 骨架屏加载组件
 *
 * 提供更真实的简历加载体验，尺寸和布局与实际简历保持一致
 * 支持响应式设计，在不同设备上都有良好的显示效果
 * 完全支持主题切换，自动适配明暗模式
 */
const SkeletonLoader: React.FC = () => {
  const { isDark } = useSafeTheme();

  return (
    <SkeletonWrapper isDark={isDark}>
      {/* 头部骨架 - 个人信息区域 */}
      <SkeletonHeader>
        <LocalSkeletonAvatar isDark={isDark} />
        <SkeletonInfo>
          <LocalSkeletonTitle isDark={isDark} />
          <LocalSkeletonText width="70%" isDark={isDark} />
          <LocalSkeletonText width="50%" isDark={isDark} />
          <LocalSkeletonText width="60%" isDark={isDark} />
          <LocalSkeletonText width="45%" isDark={isDark} />
        </SkeletonInfo>
      </SkeletonHeader>

      {/* 个人优势骨架 */}
      <SkeletonSection>
        <SkeletonSectionTitle isDark={isDark} />
        <SkeletonCard isDark={isDark}>
          <LocalSkeletonText width="95%" isDark={isDark} />
          <LocalSkeletonText width="88%" isDark={isDark} />
          <LocalSkeletonText width="92%" isDark={isDark} />
          <LocalSkeletonText width="85%" isDark={isDark} />
          <LocalSkeletonText width="90%" isDark={isDark} />
        </SkeletonCard>
      </SkeletonSection>

      {/* 技能栈骨架 */}
      <SkeletonSection>
        <SkeletonSectionTitle isDark={isDark} />
        <SkeletonCard isDark={isDark}>
          <LocalSkeletonText width="75%" isDark={isDark} />
          <LocalSkeletonText width="65%" isDark={isDark} />
          <LocalSkeletonText width="80%" isDark={isDark} />
          <LocalSkeletonText width="70%" isDark={isDark} />
        </SkeletonCard>
      </SkeletonSection>

      {/* 工作经历骨架 */}
      <SkeletonSection>
        <SkeletonSectionTitle isDark={isDark} />
        <SkeletonCard isDark={isDark}>
          <LocalSkeletonText width="55%" isDark={isDark} />
          <LocalSkeletonText width="93%" isDark={isDark} />
          <LocalSkeletonText width="87%" isDark={isDark} />
          <LocalSkeletonText width="91%" isDark={isDark} />
        </SkeletonCard>
        <SkeletonCard isDark={isDark}>
          <LocalSkeletonText width="48%" isDark={isDark} />
          <LocalSkeletonText width="89%" isDark={isDark} />
          <LocalSkeletonText width="84%" isDark={isDark} />
          <LocalSkeletonText width="88%" isDark={isDark} />
        </SkeletonCard>
      </SkeletonSection>

      {/* 项目经历骨架 */}
      <SkeletonSection>
        <SkeletonSectionTitle isDark={isDark} />
        <SkeletonCard isDark={isDark}>
          <LocalSkeletonText width="60%" isDark={isDark} />
          <LocalSkeletonText width="95%" isDark={isDark} />
          <LocalSkeletonText width="90%" isDark={isDark} />
        </SkeletonCard>
      </SkeletonSection>
    </SkeletonWrapper>
  );
};

export default SkeletonLoader;
