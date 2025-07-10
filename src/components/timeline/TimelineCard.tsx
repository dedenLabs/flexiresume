import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TimelineContainer from './TimelineContainer';
import flexiResumeStore from '../../store/Store';
import { logCollapse, useCollapser, watchTitleCollapser } from '../../utils/Tools';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import { ContentWithLine, Node } from './TimelineStyles';
import { useTheme } from '../../theme';
import SkillRenderer from '../skill/SkillRenderer';
import TimelineNode from './TimelineNode';

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
const TimelineCard: React.FC<TimelineCardProps> = ({ id, name, data }) => {
    const { isDark } = useTheme();
    const { list, content, content_head } = data;
    // 定义折叠状态，组别折叠状态默认全部展开 
    const { collapsedItems } = useCollapser(name, 1);
    const headHtml = checkConvertMarkdownToHtml(content_head || "");
    const html = checkConvertMarkdownToHtml(content || ""); 
    return (
        <TimelineWrapper isDark={isDark}>
            {
                !collapsedItems[0] && (
                    <ContentWithLine isDark={isDark}>
                        <SkillRenderer>
                            <div className='markdown-content' dangerouslySetInnerHTML={{ __html: headHtml }} />
                        </SkillRenderer>
                    </ContentWithLine>
                )
            }

            <TimelineContainer id={name} list={list} content={""} content_head={""} />

            {
                !collapsedItems[0] && (
                    <ContentWithLine isDark={isDark}>
                        <SkillRenderer>
                            <div className='markdown-content' dangerouslySetInnerHTML={{ __html: html }} />
                        </SkillRenderer>
                    </ContentWithLine>
                )
            }

        </TimelineWrapper>
        //  <TimelineContainer id={name} list={list} content={content} content_head={content_head} />
        // <TimelineNode id={name} key={name} category={{ name, children: list, content, content_head }} />
    );
};



export default TimelineCard;
