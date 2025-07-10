import React, { Children } from 'react';
import styled from 'styled-components';
import TimelineNode from './TimelineNode';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import { useCollapser } from '../../utils/Tools';
import { useTheme } from '../../theme';
import SkillRenderer from '../skill/SkillRenderer';

interface TimelineProps {
  id: string;
  name: string;
  content: string;
  content_head?: string; // 头部内容，显示在当前级别顶部
  children?: TimelineProps[];
  collapsedNodes?: string[];
};

// Timeline 容器
const TimelineWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  overflow-x: auto; /* 允许横向滚动 */
`;

/**
 * Timeline 组件，用于展示时间线效果。
 *
 * @param list 组件接收的参数，类型为 TimelineProps[]，表示时间线的分类信息数组。
 * @param content_head 头部内容，显示在时间线顶部
 * @param content 底部内容，显示在时间线底部
 * @returns 返回渲染的时间线组件 JSX 元素。
 */
const TimelineContainer: React.FC<{
  id: string,
  name: string,
  list: TimelineProps[],
  content?: string,
  content_head?: string
}> = ({ id, name, list, content, content_head }) => {
  const { isDark } = useTheme();

  // 安全检查：确保 list 存在且是数组
  const safeList = Array.isArray(list) ? list : [];

  // 处理头部内容
  const headHtml = content_head ? checkConvertMarkdownToHtml(content_head) : '';
  // 处理底部内容
  const footerHtml = content ? checkConvertMarkdownToHtml(content) : '';

  return (
    <SkillRenderer>
      <TimelineWrapper isDark={isDark}>
        {/* 头部内容 */}
        {content_head && (
          <div
            className="timeline-header markdown-content"
            dangerouslySetInnerHTML={{ __html: headHtml }}
          />
        )}

        {/* 时间线节点 */}
        {safeList.map((category, index) => (
          <TimelineNode id={id} key={index} category={category} />
        ))}

        {/* 底部内容 */}
        {content && (
          <div
            className="timeline-footer markdown-content"
            dangerouslySetInnerHTML={{ __html: footerHtml }}
          />
        )}
      </TimelineWrapper>
    </SkillRenderer>
  );
};
export default TimelineContainer; 