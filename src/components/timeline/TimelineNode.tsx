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
const log = getLogger('TimelineNode');

interface TimelineNodeProps {
  id: string;
  name: string;
  content: string;
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
  const [collapsedSelf, setCollapsedSelf] = useState(collapsedParent
    || !!flexiResumeStore.collapsedMap.get(selfId)
    || false);

  // 监听折叠状态变化
  useEffect(() => {
    setCollapsedSelf(collapsedParent || !!flexiResumeStore.collapsedMap.get(selfId));
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

  const html = checkConvertMarkdownToHtml(category.content || "");
  return (
    <Node>
      <Content>
        <CategoryTitle onClick={() => toggleCollapse()}>
          <CollapseIcon collapsed={collapsedSelf} />
          {category.name}
          {/* {collapsedMsg} */}
        </CategoryTitle>
        <CategoryBody>
          {
            category?.children && <TimelineContainer id={selfId} categories={category?.children} />
          }
          {
            !collapsedSelf && <div className='markdown-content' dangerouslySetInnerHTML={{ __html: html }} />
          }
        </CategoryBody>
      </Content>
    </Node>
  );
};



const CategoryTitle = styled.h3`
  cursor: pointer;
  margin: 0;
  padding: 0;
  color: #333;
  font-size: 0.8rem;
`;
const CategoryBody = styled.span`
  margin: 0;   
`;

// Timeline 节点
const Node = styled.div`
  display: flex;
  flex-direction: row;
  position: relative; 

  &::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0;
    width: 1px;
    height: 100%;
    background: #ccc;
  }
`;


// 节点内容
const Content = styled.div`
  padding-left: 1.5rem;
  width: 100%;
`;

export default TimelineNode; 