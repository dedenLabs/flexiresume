import React, { Children } from 'react';
import styled from 'styled-components';
import TimelineNode from './TimelineNode';

interface TimelineProps {
  id: string;
  name: string;
  content: string;
  children?: TimelineProps[];
  collapsedNodes?: string[];
};

// Timeline 容器
const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px; 
`;

/**
 * Timeline 组件，用于展示时间线效果。
 *
 * @param categories 组件接收的参数，类型为 TimelineProps[]，表示时间线的分类信息数组。
 * @returns 返回渲染的时间线组件 JSX 元素。
 */
const TimelineContainer: React.FC<{ categories: TimelineProps[] }> = ({ id, name, categories }) => {
  return (
    <TimelineWrapper>
      {categories.map((category, index) => (
        <TimelineNode id={id} key={index} category={category} />
      ))}
    </TimelineWrapper>
  );
};
export default TimelineContainer; 