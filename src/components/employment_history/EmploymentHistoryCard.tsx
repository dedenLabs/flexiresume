import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import EmploymentHistoryItem from './EmploymentHistoryItem';
import flexiResumeStore from '../../store/Store';
import { useCollapser } from '../../utils/Tools';
import { reaction } from 'mobx';
import SkillRenderer from '../skill/SkillRenderer';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import { ContentWithLine } from '../timeline/TimelineStyles';
import { SecureContentRenderer } from '../Security/SecureContentRenderer';
import { useSafeTheme } from '../../utils/ThemeUtils';
import { getLogger } from '../../utils/Logger';

const logEmploymentHistoryCard = getLogger('EmploymentHistoryCard');



interface EmploymentHistoryCardProps {
    id: string;
    name: string;
    data: {
        list: any[];
        content_head?: string;
        content?: string;
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
const EmploymentHistoryCard: React.FC<EmploymentHistoryCardProps> = ({ id, name, data: { list, content_head, content } }) => {
    const { isDark } = useSafeTheme();

    // 安全检查：确保 list 存在且是数组
    const safeList = Array.isArray(list) ? list : [];

    // 定义折叠状态，组别折叠状态默认全部展开
    const { collapsedItems, toggleCollapse, setCollapsedAllItems } = useCollapser(name, safeList.length);
    useEffect(() => {
        setCollapsedAllItems(flexiResumeStore.collapsedMap.get(name));
    }, [id, flexiResumeStore.collapsedMap.get(name)]);

    const headHtml = checkConvertMarkdownToHtml(content_head || "");
    const html = checkConvertMarkdownToHtml(content || "");
    return (
        <>
            {
                !collapsedItems[0] && content_head && (
                    <ContentWithLine isDark={isDark}>
                        <SkillRenderer>
                            <SecureContentRenderer
                                content={headHtml}
                                contentType="html"
                                className="markdown-content"
                                trustedZone={false}
                            />
                        </SkillRenderer>
                    </ContentWithLine>
                )
            }
            <ContentWithLine isDark={isDark}>
                {safeList.map((history, index) => {
                    return <EmploymentHistoryItem key={index} index={index} {...history}
                        collapsed={collapsedItems[index] || false}
                        onToggleCollapse={() => toggleCollapse(index)}
                    />
                })}
            </ContentWithLine>
        </>
    );
};

// const itemHeights = [];
// const EmploymentHistoryCard: React.FC<EmploymentHistoryCardProps> = ({ id, name, data: { list } }) => {
//     const [containerHeight, setContainerHeight] = useState<List>(0);
//     const listRef = useRef<List>(null);
//     const { collapsedItems, toggleCollapse, setCollapsedAllItems } = useCollapser(name, list.length);
//     useEffect(() => {
//         setCollapsedAllItems(flexiResumeStore.collapsedMap.get(name));
//     }, [id, flexiResumeStore.collapsedMap.get(name)]);

//     // 动态高度计算（含折叠状态判断）
//     const getItemSize = (index: number) =>
//         itemHeights[index] || 80;

//     // 高度缓存更新（增加容错机制）
//     const setRowHeight = (index: number, height: number) => {
//         const validHeight = Math.max(height, 50); // 设置最小高度
//         if (itemHeights[index] !== validHeight) {
//             itemHeights[index] = validHeight;
//             setContainerHeight(itemHeights.reduce((a, b) => a + b, 0));
//             logEmploymentHistoryCard("containerHeight",containerHeight)
//             requestAnimationFrame(() => {
//                 listRef.current?.resetAfterIndex(index);
//             });
//         }
//     };

//     // 虚拟列表行（修复渲染逻辑）
//     const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
//         const rowRef = useRef<HTMLDivElement>(null);

//         useLayoutEffect(() => { // 改用 useLayoutEffect 同步测量
//             if (rowRef.current) {
//                 const height = rowRef.current.offsetHeight;
//                 setRowHeight(index, height);
//             }
//         }, [collapsedItems[index], list[index]]); // 增加数据依赖

//         return (
//             <div style={{ ...style, overflow: 'hidden' }}> {/* 防止内容溢出 */}
//                 <div ref={rowRef}>
//                     <EmploymentHistoryItem
//                         {...list[index]}
//                         index={index}
//                         key={index}
//                         collapsed={collapsedItems[index] || false}
//                         onToggleCollapse={() => toggleCollapse(index)}
//                     />
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <VariableSizeList // ✅ 正确使用组件名
//             height={containerHeight}
//             width={"100%"}
//             itemCount={list.length}
//             itemSize={getItemSize}
//             ref={listRef}
//         >
//             {(props) => <Row {...props} />}
//         </VariableSizeList>
//     );
// };

export default EmploymentHistoryCard;
