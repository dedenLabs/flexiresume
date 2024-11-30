import React, { Suspense, lazy, useEffect } from 'react';
import Header from '../components/Header';
import Section from '../components/Section';
import TimelineCard from '../components/timeline/TimelineCard';
import EmploymentHistoryCard from '../components/employment_history/EmploymentHistoryCard';
import PersonalStrengthCard from '../components/personal_strength/PersonalStrengthCard';
import styled from 'styled-components';
import BaseCard from '../components/base_card/BaseCard';
import { getCurrentPositionNameByPath, updateCurrentResumeStore, watchMinWidth } from '../utils/Tools';
import { IFlexiResume, IModuleInfo, ISkillLevel } from '../types/IFlexiResume';
import flexiResumeStore from '../store/Store';
import EducationHistoryCard from '../components/education_history/EducationHistoryCard';
import TimelineContainer from '../components/timeline/TimelineContainer';

interface FlexiResumeProps {
  path: string;
}

const ResumeWrapper = styled.div`
  max-width: 800px; // PDF 导出尺寸接近 A4 页面宽度的 800px   
  border-top: 1px solid #aaa; /* 默认无边框 */
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  padding: 20px;
  background: #fff; 
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  /* 在打印时隐藏 */
  @media print { 
    border: 0px; 
    box-shadow: 0 0 0px rgba(0, 0, 0, 0);
  }
`;

/**
 * Resume组件，用于展示个人简历信息
 *
 * @returns 返回个人简历的React组件
 */
const FlexiResume: React.FC<FlexiResumeProps> = ({ path }) => {
  const postionName = path.slice(1);
  updateCurrentResumeStore(postionName);

  const data = flexiResumeStore.data;
  const header_info = data.header_info;

  // 计算最小宽度
  const minWidth = watchMinWidth(800);

  return (
    <ResumeWrapper style={{ minWidth: `${minWidth - 40}px`,  maxWidth: `100%` }}>
      <Header {...header_info} />
      {
        Object.keys(data).map((key, i) => {
          const m = data[key] as IModuleInfo;
          if (m.hidden) return null;// 隐藏不显示内容项

          const args = {
            id: key,
            name: m.name,
            // 初始化界面动画 
            animate: {
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.05 },
            },
            data: m,
          }
          // console.log(args)
          switch (m.type) {
            case 'header_info':
            case 'skill_level':
            case undefined:
              return null;
            case 'skills':
              return (
                <Section key={i} title={m.name} {...args}>
                  <TimelineCard id={key} {...args} />
                </Section>
              );
            case 'employment_history':
            case 'project_experience':
              return (
                <Section key={i} title={`${m.name}${m?.list?.length > 1 ? "（" + m?.list?.length + "）" : ""}`} {...args}>
                  <EmploymentHistoryCard id={key} {...args} />
                </Section>
              );
            case 'education_history':
              return (
                <Section key={i} title={`${m.name}${m?.list?.length > 1 ? "（" + m?.list?.length + "）" : ""}`} {...args}>
                  <EducationHistoryCard id={key} {...args} />
                </Section>
              );
            case 'personal_strengths':
              return (
                <Section key={i} title={m.name} {...args}>
                  <PersonalStrengthCard id={key} {...args} />
                </Section>
              );
            case 'timeline':
              return (
                <Section key={i} title={m.name} {...args}>
                  <TimelineCard id={key} {...args} />
                </Section>
              );
            default:
              return (
                <Section key={i} title={m.name} {...args}>
                  <BaseCard id={key} {...args} />
                </Section>
              );
          }
        })
      }
    </ResumeWrapper >
  );
};

export default FlexiResume;
