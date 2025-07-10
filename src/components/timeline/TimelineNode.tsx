import React, { Children, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import SkillItem from '../skill/SkillItem';
import ReactMarkdown from 'react-markdown';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import TimelineContainer from './TimelineContainer';
import flexiResumeStore from '../../store/Store';
import CollapseIcon from './CollapseIcon';
import { getLogger, logCollapse } from '../../utils/Tools';
import { Node, CategoryTitle, CategoryBody, Content, ContentWithLine } from './TimelineStyles';
import { useTheme } from '../../theme';
import SkillRenderer from '../skill/SkillRenderer';

const log = getLogger('TimelineNode');

interface TimelineNodeProps {
  id: string;
  name: string;
  content: string;
  content_head?: string; // 头部内容，显示在当前级别顶部
  children?: TimelineNodeProps[];
};


/**
 * Timeline 组件，用于展示时间线效果。
 *
 * @param categories 组件接收的参数，类型为 TimelineNodeProps[]，表示时间线的分类信息数组。
 * @returns 返回渲染的时间线组件 JSX 元素。
 */
const TimelineNode: React.FC<{ category: TimelineNodeProps }> = ({ id: parentId, category }) => {
  const selfId = `${parentId}.${category.name}`;
  const { isDark } = useTheme();
  // 获取折叠状态，如果 Map 中没有该 id，则默认设置为 false
  let collapsedParent = false;
  const collapsedList = parentId.split('.');
  while (!collapsedParent && collapsedList.length > 0) {
    const id = collapsedList.join(".");
    if (flexiResumeStore.collapsedMap.get(id) != undefined) {// 节点设置过过折叠状态
      collapsedParent = !!flexiResumeStore.collapsedMap.get(id);
      break;
    }
    if (flexiResumeStore.collapsedMap.get(id)) {// 父节点折叠了
      collapsedParent = true;
      break;
    }
    collapsedList.pop();
  }
  const [collapsedSelf, setCollapsedSelf] = useState(
    flexiResumeStore.collapsedMap.get(selfId) == undefined ? collapsedParent : flexiResumeStore.collapsedMap.get(selfId)
      || false);

  // 监听折叠状态变化
  useEffect(() => {
    setCollapsedSelf(flexiResumeStore.collapsedMap.get(selfId) == undefined ? collapsedParent : flexiResumeStore.collapsedMap.get(selfId));
    logCollapse(`TimelineNode`, `parent:`, collapsedParent, `self:`, !!flexiResumeStore.collapsedMap.get(selfId), selfId);
  }, [collapsedParent, selfId]);

  // const collapsedMsg = ` ID:"${selfId}" 折叠:${collapsedSelf} 
  //                       父级折叠:${collapsedParent}
  //                       当前折叠(存储):${!!flexiResumeStore.collapsedMap.get(selfId)}
  //                     `;

  const toggleCollapse = () => {
    const newState = !collapsedSelf; // 切换自身的折叠状态
    flexiResumeStore.collapsedMap.set(selfId, newState);
    setCollapsedSelf(newState); // 强制更新组件 
  };

  const headHtml = checkConvertMarkdownToHtml(category.content_head || "");
  const html = checkConvertMarkdownToHtml(category.content || "");

  // 调试信息 - 可以在开发时启用
  // console.log(`TimelineNode ${category.name}:`, {
  //   content_head: category.content_head,
  //   content: category.content,
  //   headHtml: headHtml,
  //   html: html,
  //   collapsedSelf: collapsedSelf
  // });
  return (
    <Node isDark={isDark}>
      <Content>
        <CategoryTitle onClick={() => toggleCollapse()} isDark={isDark}>
          <CollapseIcon collapsed={collapsedSelf} />
          {category.name || ""}
        </CategoryTitle>
        <CategoryBody>
          {/* 头部内容区域 - 显示在当前级别顶部 */}
          {
            !collapsedSelf && category.content_head && (
              <ContentWithLine isDark={isDark}>
                <SkillRenderer>
                  <div className='markdown-content' dangerouslySetInnerHTML={{ __html: headHtml }} />
                </SkillRenderer>
              </ContentWithLine>
            )
          }

          {/* 子节点容器 - 已有线条样式 */}
          {
            category?.children && <TimelineContainer id={selfId} list={category?.children} />
          }

          {/* 底部内容区域 - 显示在当前级别底部 */}
          {
            !collapsedSelf && category.content && (
              <ContentWithLine isDark={isDark}>
                <SkillRenderer>
                  <div className='markdown-content' dangerouslySetInnerHTML={{ __html: html }} />
                </SkillRenderer>
              </ContentWithLine>
            )
          }
        </CategoryBody>
      </Content>
    </Node>
  );
};

export default TimelineNode; 