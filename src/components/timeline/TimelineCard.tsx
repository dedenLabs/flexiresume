import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TimelineContainer from './TimelineContainer';
import flexiResumeStore from '../../store/Store';
import { logCollapse, useCollapser, watchTitleCollapser } from '../../utils/Tools';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import { Node } from './TimelineStyles';

interface TimelineCardProps { id: string }

const TimelineWrapper = styled(motion.div)`
  margin: 0px 2px;
  display: inline-block;
  max-width: 100%;
`;


/**
 * Timeline 组件，用于展示技能卡片。
 *
 * @returns React元素，渲染技能卡片。
 */
const TimelineCard: React.FC<TimelineCardProps> = ({ id, name, data: { categories, content } }) => {
    // 定义折叠状态，组别折叠状态默认全部展开 
    const { collapsedItems } = useCollapser(name, 1);
    const html = checkConvertMarkdownToHtml(content || "");
    return (
        <TimelineWrapper>
            <Node>
                {
                    !collapsedItems[0] && <div className='markdown-content' dangerouslySetInnerHTML={{ __html: html }} />
                }
            </Node>
            <TimelineContainer id={name} categories={categories} content={content}/>
        </TimelineWrapper>
    );
};



export default TimelineCard;
