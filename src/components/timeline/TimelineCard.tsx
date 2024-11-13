import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TimelineContainer from './TimelineContainer';
import flexiResumeStore from '../../store/Store';
import { logCollapse, useCollapser, watchTitleCollapser } from '../../utils/Tools';

interface TimelineCardProps { id: string }

const TimelineWrapper = styled(motion.span)`
  margin: 0px 2px;
  display: inline-block;
`;

/**
 * Timeline 组件，用于展示技能卡片。
 *
 * @returns React元素，渲染技能卡片。
 */
const TimelineCard: React.FC<TimelineCardProps> = ({ id, name, data: { categories } }) => {
    const { collapsedItems } = useCollapser(name, 1);
    return (
        <TimelineWrapper>
            <TimelineContainer id={name} categories={categories} />
        </TimelineWrapper>
    );
};


export default TimelineCard;
