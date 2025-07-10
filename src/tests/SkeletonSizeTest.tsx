/**
 * 骨架屏尺寸测试组件
 * 
 * 用于验证骨架屏与实际内容的尺寸是否完全匹配
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SkeletonResume } from '../components/SkeletonComponents';
import FlexiResume from '../pages/FlexiResume';

const TestContainer = styled.div`
  padding: 20px;
  background: var(--color-background);
  min-height: 100vh;
`;

const TestSection = styled.div`
  margin: 30px 0;
  padding: 20px;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  background: var(--color-card);
`;

const TestTitle = styled.h2`
  color: var(--color-text-primary);
  margin-bottom: 15px;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 4px;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const SizeInfo = styled.div`
  background: var(--color-code-bg, #f8f9fa);
  color: var(--color-code-text, #333);
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
  font-family: monospace;
  border: 1px solid var(--color-border-light);
`;

const ComparisonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TestColumn = styled.div`
  border: 1px solid var(--color-border-medium);
  border-radius: 8px;
  padding: 10px;
  background: var(--color-background);
`;

/**
 * 骨架屏尺寸测试组件
 */
const SkeletonSizeTest: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<{
    skeleton?: DOMRect;
    content?: DOMRect;
  }>({});

  // 测量元素尺寸
  const measureElements = () => {
    const skeletonElement = document.querySelector('[data-testid="skeleton-container"]');
    const contentElement = document.querySelector('[data-testid="content-container"]');
    
    const newSizeInfo: any = {};
    
    if (skeletonElement) {
      newSizeInfo.skeleton = skeletonElement.getBoundingClientRect();
    }
    
    if (contentElement) {
      newSizeInfo.content = contentElement.getBoundingClientRect();
    }
    
    setSizeInfo(newSizeInfo);
  };

  // 切换显示模式
  const toggleMode = () => {
    setShowSkeleton(!showSkeleton);
    setTimeout(measureElements, 100); // 等待DOM更新
  };

  // 显示对比模式
  const showComparisonMode = () => {
    setShowComparison(true);
    setTimeout(measureElements, 100);
  };

  // 组件挂载后测量尺寸
  useEffect(() => {
    setTimeout(measureElements, 500);
  }, [showSkeleton, showComparison]);

  return (
    <TestContainer>
      <TestTitle>🧪 骨架屏尺寸匹配测试</TestTitle>
      
      {/* 控制面板 */}
      <TestSection>
        <h3>测试控制</h3>
        <Button onClick={toggleMode}>
          {showSkeleton ? '显示实际内容' : '显示骨架屏'}
        </Button>
        <Button onClick={showComparisonMode}>
          显示对比模式
        </Button>
        <Button onClick={measureElements}>
          重新测量尺寸
        </Button>
      </TestSection>

      {/* 尺寸信息显示 */}
      {(sizeInfo.skeleton || sizeInfo.content) && (
        <TestSection>
          <h3>尺寸测量结果</h3>
          {sizeInfo.skeleton && (
            <SizeInfo>
              <strong>骨架屏尺寸:</strong><br/>
              宽度: {sizeInfo.skeleton.width.toFixed(2)}px<br/>
              高度: {sizeInfo.skeleton.height.toFixed(2)}px<br/>
              左边距: {sizeInfo.skeleton.left.toFixed(2)}px<br/>
              右边距: {sizeInfo.skeleton.right.toFixed(2)}px
            </SizeInfo>
          )}
          
          {sizeInfo.content && (
            <SizeInfo>
              <strong>实际内容尺寸:</strong><br/>
              宽度: {sizeInfo.content.width.toFixed(2)}px<br/>
              高度: {sizeInfo.content.height.toFixed(2)}px<br/>
              左边距: {sizeInfo.content.left.toFixed(2)}px<br/>
              右边距: {sizeInfo.content.right.toFixed(2)}px
            </SizeInfo>
          )}
          
          {sizeInfo.skeleton && sizeInfo.content && (
            <SizeInfo style={{ background: 'var(--color-success-bg, #d4edda)' }}>
              <strong>尺寸差异分析:</strong><br/>
              宽度差异: {Math.abs(sizeInfo.skeleton.width - sizeInfo.content.width).toFixed(2)}px<br/>
              左边距差异: {Math.abs(sizeInfo.skeleton.left - sizeInfo.content.left).toFixed(2)}px<br/>
              匹配度: {
                Math.abs(sizeInfo.skeleton.width - sizeInfo.content.width) < 5 &&
                Math.abs(sizeInfo.skeleton.left - sizeInfo.content.left) < 5
                  ? '✅ 完美匹配' 
                  : '⚠️ 存在差异'
              }
            </SizeInfo>
          )}
        </TestSection>
      )}

      {/* 对比模式 */}
      {showComparison ? (
        <TestSection>
          <h3>并排对比</h3>
          <ComparisonContainer>
            <TestColumn>
              <h4>骨架屏</h4>
              <div data-testid="skeleton-container">
                <SkeletonResume />
              </div>
            </TestColumn>
            <TestColumn>
              <h4>实际内容</h4>
              <div data-testid="content-container">
                <FlexiResume path="/agent-engineer" />
              </div>
            </TestColumn>
          </ComparisonContainer>
        </TestSection>
      ) : (
        /* 单一显示模式 */
        <TestSection>
          <h3>{showSkeleton ? '骨架屏显示' : '实际内容显示'}</h3>
          {showSkeleton ? (
            <div data-testid="skeleton-container">
              <SkeletonResume />
            </div>
          ) : (
            <div data-testid="content-container">
              <FlexiResume path="/agent-engineer" />
            </div>
          )}
        </TestSection>
      )}

      {/* 测试说明 */}
      <TestSection>
        <h3>测试说明</h3>
        <p>
          本测试用于验证骨架屏与实际内容的尺寸匹配度：
        </p>
        <ul>
          <li>✅ <strong>完美匹配</strong>: 宽度和位置差异小于5px</li>
          <li>⚠️ <strong>存在差异</strong>: 需要进一步调整骨架屏样式</li>
          <li>📱 <strong>响应式测试</strong>: 调整浏览器窗口大小测试不同屏幕尺寸</li>
          <li>🌓 <strong>主题测试</strong>: 切换深色/浅色模式测试主题兼容性</li>
        </ul>
        <p>
          <strong>预期结果</strong>: 骨架屏应该与实际内容在所有屏幕尺寸下都保持相同的宽度和位置，
          避免在内容加载完成后出现布局跳动。
        </p>
      </TestSection>
    </TestContainer>
  );
};

export default SkeletonSizeTest;
