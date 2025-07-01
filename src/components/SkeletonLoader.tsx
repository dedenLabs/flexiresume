import React from 'react';
import styled from 'styled-components';

const SkeletonWrapper = styled.div`
  /* 响应式宽度设计 - 匹配实际简历布局 */
  width: 100%;
  max-width: 800px;
  min-width: 320px; /* 最小宽度确保移动端可用 */
  padding: 20px;
  margin: 0 auto; /* 居中显示 */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

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

const SkeletonAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
`;

const SkeletonInfo = styled.div`
  flex: 1;
`;

const SkeletonTitle = styled.div`
  height: 32px;
  width: 200px;
  margin-bottom: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
`;

const SkeletonText = styled.div<{ width?: string; height?: string }>`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin: 8px 0;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
`;

const SkeletonSection = styled.div`
  margin: 30px 0;
`;

const SkeletonSectionTitle = styled.div`
  height: 24px;
  width: 150px;
  margin-bottom: 20px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
`;

const SkeletonCard = styled.div`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
`;

/**
 * 骨架屏加载组件
 *
 * 提供更真实的简历加载体验，尺寸和布局与实际简历保持一致
 * 支持响应式设计，在不同设备上都有良好的显示效果
 */
const SkeletonLoader: React.FC = () => {
  return (
    <SkeletonWrapper>
      {/* 头部骨架 - 个人信息区域 */}
      <SkeletonHeader>
        <SkeletonAvatar />
        <SkeletonInfo>
          <SkeletonTitle />
          <SkeletonText width="70%" />
          <SkeletonText width="50%" />
          <SkeletonText width="60%" />
          <SkeletonText width="45%" />
        </SkeletonInfo>
      </SkeletonHeader>

      {/* 个人优势骨架 */}
      <SkeletonSection>
        <SkeletonSectionTitle />
        <SkeletonCard>
          <SkeletonText width="95%" />
          <SkeletonText width="88%" />
          <SkeletonText width="92%" />
          <SkeletonText width="85%" />
          <SkeletonText width="90%" />
        </SkeletonCard>
      </SkeletonSection>

      {/* 技能栈骨架 */}
      <SkeletonSection>
        <SkeletonSectionTitle />
        <SkeletonCard>
          <SkeletonText width="75%" />
          <SkeletonText width="65%" />
          <SkeletonText width="80%" />
          <SkeletonText width="70%" />
        </SkeletonCard>
      </SkeletonSection>

      {/* 工作经历骨架 */}
      <SkeletonSection>
        <SkeletonSectionTitle />
        <SkeletonCard>
          <SkeletonText width="55%" />
          <SkeletonText width="93%" />
          <SkeletonText width="87%" />
          <SkeletonText width="91%" />
        </SkeletonCard>
        <SkeletonCard>
          <SkeletonText width="48%" />
          <SkeletonText width="89%" />
          <SkeletonText width="84%" />
          <SkeletonText width="88%" />
        </SkeletonCard>
      </SkeletonSection>

      {/* 项目经历骨架 */}
      <SkeletonSection>
        <SkeletonSectionTitle />
        <SkeletonCard>
          <SkeletonText width="60%" />
          <SkeletonText width="95%" />
          <SkeletonText width="90%" />
        </SkeletonCard>
      </SkeletonSection>
    </SkeletonWrapper>
  );
};

export default SkeletonLoader;
