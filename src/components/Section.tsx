import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import flexiResumeStore from '../store/Store';
import { logCollapse } from '../utils/Tools';
interface SectionProps {
  title: string;
  animate?: any;
}
const SectionWrapper = styled.section` 
  background: #fff; 
  padding-top: 1rem; 
  box-sizing: border-box;
`;

const TitleWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center; /* 让文本和横线在垂直方向对齐 */
`;

const Title = styled.h2`  
  font-size: 1rem;
  margin: 0; /* 清除标题的默认 margin */
  white-space: nowrap; /* 防止标题换行 */
`;

const Line = styled.div`
  flex-grow: 1; /* 横线占据剩余空间 */
  height: 1px;
  background-color: #ccc; /* 横线的颜色 */
  margin-left: 0.5rem; /* 横线与标题的间距 */
`;

const InfoWrapper = styled.div`  
  font-size: 0.8rem;
  margin: 0.5rem 0;
`;
const Section: React.FC<SectionProps> = ({ id, name, title, children, animate, data: { collapsedNodes } }) => {
  // 点击标题展开/收起
  const onToggleCollapse = () => {
    flexiResumeStore.collapsedMap.set(name, !flexiResumeStore.collapsedMap.get(name));
    logCollapse(`Section`, flexiResumeStore.collapsedMap.get(name), name);
  }
  // 读取个性化配置中折叠列表 
  const data = flexiResumeStore.data;
  if (collapsedNodes) {
    collapsedNodes.forEach(nodeId => {
      flexiResumeStore.collapsedMap.set(nodeId, true);
    })
  }
  return (
    <SectionWrapper>
      <motion.div key={location.pathname} {...animate}>
        <TitleWrapper onClick={onToggleCollapse}>
          <Title>{title}</Title>
          <Line />
        </TitleWrapper>
        <InfoWrapper>
          {children}
        </InfoWrapper>
      </motion.div>
    </SectionWrapper>
  )
};

export default Section;

