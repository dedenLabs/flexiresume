import styled from 'styled-components';
import { useTheme } from '../../theme';

export const CategoryTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
  cursor: pointer;
  margin: 0;
  padding: 0;
  color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};
  font-size: 0.8rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.isDark ? 'var(--color-primary)' : '#007acc'};
  }
`;

export const CategoryBody = styled.span`
  margin: 0;
`;

// 内容容器 - 带有左侧线条的内容区域
export const ContentWithLine = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
  position: relative;
  margin-left: 0.5rem; /* 与主线条对齐 */
  padding-left: 1rem; /* 为线条留出空间 */
  margin-top: 0; /* 移除顶部间距，让线条连接 */
  margin-bottom: 0; /* 移除底部间距，让线条连接 */
  min-height: 1rem; /* 确保即使内容很少也有足够高度显示线条 */

  /* 左侧垂直线条 - 延伸到上下边界外，确保连续性 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -0.5rem; /* 向上延伸更多，确保与上方连接 */
    bottom: -0.5rem; /* 向下延伸更多，确保与下方连接 */
    width: 1px;
    background: ${props => props.isDark ? 'var(--color-border-medium)' : '#ccc'};
    transition: background 0.3s ease;
    z-index: 0; /* 确保线条在内容之下，但仍然可见 */
  }

  /* 第一个ContentWithLine的特殊处理 */
  &:first-of-type::before {
    top: -0.25rem; /* 第一个稍微向上延伸 */
  }

  /* 最后一个ContentWithLine的特殊处理 */
  &:last-of-type::before {
    bottom: -0.25rem; /* 最后一个稍微向下延伸 */
  }

  /* 内容样式 */
  .markdown-content {
    margin: 0.5rem 0; /* 保持内容的上下间距 */
    padding: 0.25rem 0; /* 添加内边距，确保内容不会太靠近边界 */
    padding-left: 0.5rem; /* 确保内容不会太靠近线条 */
    min-height: 0.5rem; /* 确保有最小高度 */

    /* 优化markdown内容的显示 */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0.5rem;
      margin-bottom: 0.25rem;
      color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};

      /* 确保标题不会太靠近线条 */
      &:first-child {
        margin-top: 0.25rem;
      }
    }

    p {
      margin: 0.25rem 0;
      line-height: 1.5;
      color: ${props => props.isDark ? 'var(--color-text-secondary)' : '#666'};
    }

    ul, ol {
      margin: 0.25rem 0;
      padding-left: 1rem;

      li {
        margin: 0.125rem 0;
        color: ${props => props.isDark ? 'var(--color-text-secondary)' : '#666'};

        /* 列表项的特殊样式 */
        &::marker {
          color: ${props => props.isDark ? 'var(--color-text-disabled)' : '#999'};
        }
      }
    }

    /* 强调文本样式 */
    strong, b {
      color: ${props => props.isDark ? 'var(--color-text-primary)' : '#333'};
      font-weight: 600;
    }

    /* 代码样式 */
    code {
      background: ${props => props.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
    }
  }
`;

// Timeline 节点
export const Node = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%; /* 或者 max-width: 100%; */
  overflow-x: auto;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0;
    width: 1px;
    height: 100%;
    background: ${props => props.isDark ? 'var(--color-border-medium)' : '#ccc'};
    transition: background 0.3s ease;
  }
`;


// 节点内容
export const Content = styled.div`
  padding-left: 1.5rem;
  width: 100%; 
  overflow-x: auto; 
`;