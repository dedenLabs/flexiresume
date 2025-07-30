import React from 'react';
import styled from 'styled-components';
import EducationHistoryItem from './EducationHistoryItem';
import flexiResumeStore from '../../store/Store';
import { useCollapser } from '../../utils/Tools'; 
import { useSafeTheme } from '../skill/SkillRenderer';
import { ContentWithLineWrapper } from '../timeline/ContentWithLineWrapper';

interface EducationHistoryCardProps {
    id: string;
    name: string;
    showLine?: boolean; // 是否显示线条
    data: {
        list: any[];
    };
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
const EducationHistoryCard: React.FC<EducationHistoryCardProps> = ({ id, name, showLine = true, data: { list } }) => {
    const { isDark } = useSafeTheme();
    // 安全检查：确保 list 存在且是数组
    const safeList = Array.isArray(list) ? list : [];

    // 定义折叠状态，组别折叠状态默认全部展开
    const { collapsedItems } = useCollapser(name, safeList.length);
    return (
        <>
            <ContentWithLineWrapper isDark={isDark} showLine={showLine}>
                {!flexiResumeStore.collapsedMap.get(name) && safeList.map((history, index) => {
                    return <EducationHistoryItem key={index} index={index} {...history} />;
                })}
            </ContentWithLineWrapper>
        </>
    );
};

export default EducationHistoryCard;
