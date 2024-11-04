import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Timeline from '../timeline/Timeline';
import flexiResumeStore from '../../store/Store';
import { useCollapser, watchTitleCollapser } from '../../utils/Tools';

interface SkillCardProps { id: string }

const CardWrapper = styled(motion.span)`
  margin: 0px 2px;
  display: inline-block;
`;

/**
 * SkillCard 组件，用于展示技能卡片。
 *
 * @returns React元素，渲染技能卡片。
 */
const SkillCard: React.FC<SkillCardProps> = ({ id }) => {
    // watchTitleCollapser(id, (value) => {
    //     flexiResumeStore.collapsedMap.set(id, value);
    //     console.log('collapsedMap', id, value);
    // });
    // 读取个性化配置中折叠列表 
    const data = flexiResumeStore.data;
    const collapsedNodes = data.skills.collapsedNodes ?? []; 
    if (collapsedNodes) {
        collapsedNodes.forEach(nodeId => {
            flexiResumeStore.collapsedMap.set(nodeId, true); 
        })
    }
    return (
        <CardWrapper>
            <Timeline id={id} categories={data.skills.types} />
        </CardWrapper>
    );
};


export default SkillCard;
