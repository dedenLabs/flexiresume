import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import EmploymentHistoryItem from './EmploymentHistoryItem';
import flexiResumeStore from '../../store/Store';
import { useCollapser } from '../../utils/Tools';
import { reaction } from 'mobx';
import SkillRenderer from '../skill/SkillRenderer.tsx';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import { ContentWithLine } from '../timeline/TimelineStyles';
import { SecureContentRenderer } from '../Security/SecureContentRenderer';

/**
 * 安全地使用主题hook
 * 支持服务器端渲染和客户端渲染
 * 当组件在独立的React根中渲染时，直接从DOM获取主题状态
 */
const useSafeTheme = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // 在服务器端渲染时，返回默认值
        if (typeof window === 'undefined') {
            return;
        }

        // 直接从DOM获取主题状态，不依赖React Context
        const getThemeFromDOM = () => {
            // 方法1: 检查body的data-theme属性
            const bodyTheme = document.body.getAttribute('data-theme');
            if (bodyTheme) {
                return bodyTheme === 'dark';
            }

            // 方法2: 检查html的data-theme属性
            const htmlTheme = document.documentElement.getAttribute('data-theme');
            if (htmlTheme) {
                return htmlTheme === 'dark';
            }

            // 方法3: 检查localStorage
            try {
                const storedTheme = localStorage.getItem('theme');
                if (storedTheme) {
                    return storedTheme === 'dark';
                }
            } catch (e) {
                // localStorage可能不可用
            }

            // 方法4: 检查系统偏好
            if (window.matchMedia) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            return false;
        };

        // 初始化主题状态
        setIsDark(getThemeFromDOM());

        // 监听主题变化
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme') {
                setIsDark(e.newValue === 'dark');
            }
        };

        // 监听DOM变化
        const observer = new MutationObserver(() => {
            const newIsDark = getThemeFromDOM();
            setIsDark(newIsDark);
        });

        // 观察body和html的属性变化
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });

        window.addEventListener('storage', handleStorageChange);

        // 清理函数
        return () => {
            observer.disconnect();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return { isDark };
};

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
            {safeList.map((history, index) => {
                return <EmploymentHistoryItem key={index} index={index} {...history}
                    collapsed={collapsedItems[index] || false}
                    onToggleCollapse={() => toggleCollapse(index)}
                />
            })}
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
//             console.log("containerHeight",containerHeight)
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
