import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EmploymentHistoryItem from './EmploymentHistoryItem';
import flexiResumeStore from '../../store/Store';
import { useCollapser } from '../../utils/Tools';
import { reaction } from 'mobx';

interface EmploymentHistoryCardProps {
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
const EmploymentHistoryCard: React.FC<EmploymentHistoryCardProps> = ({ id, name, data: { list } }) => {
    // const list = flexiResumeStore.data[id]?.list;
    // 定义折叠状态，组别折叠状态默认全部展开 
    const { collapsedItems, toggleCollapse, setCollapsedAllItems } = useCollapser(name, list.length);
    useEffect(() => {
        setCollapsedAllItems(flexiResumeStore.collapsedMap.get(name));
    }, [id, flexiResumeStore.collapsedMap.get(name)]);
    return (
        <>
            {list.map((history, index) => {
                return <EmploymentHistoryItem key={index} index={index} {...history}
                    collapsed={collapsedItems[index] || false}
                    onToggleCollapse={() => toggleCollapse(index)}
                />
            })}
        </>
    );
};

export default EmploymentHistoryCard;
