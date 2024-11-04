import React from 'react';
import styled from 'styled-components';
import EducationHistoryItem from './EducationHistoryItem';
import flexiResumeStore from '../../store/Store';
import { useCollapser } from '../../utils/Tools';

interface EducationHistoryCardProps {
    id: string;
}

const CardWrapper = styled.div` 
  display: block;
  width: 100%; /* 让 CardHeader 占据父容器的整个宽度 */
`;

/**
 * 就业历史卡片组件
 *
 * @returns 返回渲染后的就业历史卡片组件
 */
const EducationHistoryCard: React.FC<EducationHistoryCardProps> = ({ id }) => {
    const list = flexiResumeStore.data[id]?.list;
    // 定义折叠状态，组别折叠状态默认全部展开 
    const { collapsedItems } = useCollapser(id, list.length);
    return (
        <>
            {list.map((history, index) => (
                <EducationHistoryItem key={index} index={index} {...history}
                    collapsed={collapsedItems[index] || false} />
            ))}
        </>
    );
};

export default EducationHistoryCard;
