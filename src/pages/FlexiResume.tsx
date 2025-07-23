import React, { Suspense, lazy, useEffect, useState } from 'react';
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
import {
  recordDataLoadTime,
  recordSkeletonDisplayTime,
  recordRouteChangeTime,
  recordComponentMetric
} from '../utils/PerformanceMonitor';
import EducationHistoryCard from '../components/education_history/EducationHistoryCard';
import TimelineContainer from '../components/timeline/TimelineContainer';
import { SkeletonResume } from '../components/SkeletonComponents';
import debug from 'debug';

// Debug logger
const debugResume = debug('app:resume');
import SEOHead from '../components/SEOHead';

interface FlexiResumeProps {
  path: string;
}

const ResumeWrapper = styled.div`
  max-width: 800px; // PDF 导出尺寸接近 A4 页面宽度的 800px
  border-top: 1px solid var(--color-border-medium); /* 使用主题边框颜色 */
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  padding: 20px;
  background: var(--color-card); /* 使用主题卡片背景色 */
  color: var(--color-text-primary); /* 使用主题文本颜色 */
  box-shadow: 0 0 15px var(--color-shadow-medium); /* 使用主题阴影 */
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  /* 确保容器居中显示 */
  margin: 0 auto;
  width: 100%;

  /* 移动端适配 - 防止横向溢出 */
  @media (max-width: 768px) {
    padding: 15px;
    margin: 0 10px;
    width: calc(100% - 20px);
    min-width: auto; /* 移动端不限制最小宽度 */
    max-width: calc(100vw - 20px); /* 确保不超出视口宽度 */
  }

  /* 超小屏幕适配 */
  @media (max-width: 480px) {
    padding: 10px;
    margin: 0 5px;
    width: calc(100% - 10px);
    max-width: calc(100vw - 10px);
  }

  /* 打印样式优化 */
  @media print {
    /* 重置所有装饰性样式 */
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: white !important;
    color: black !important;

    /* 打印时的尺寸和布局 */
    max-width: 100% !important;
    min-width: auto !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 15px !important;

    /* 确保内容可见 */
    overflow: visible !important;
    position: static !important;

    /* 字体优化 */
    font-size: 11pt !important;
    line-height: 1.3 !important;

    /* 分页控制 */
    page-break-inside: avoid;
    orphans: 3;
    widows: 3;
  }
`;

/**
 * Resume组件，用于展示个人简历信息
 *
 * 集成了性能监控功能，监控数据加载、骨架屏显示和路由切换性能
 *
 * @param path 当前路由路径
 * @returns 返回个人简历的React组件
 */
const FlexiResume: React.FC<FlexiResumeProps> = ({ path }) => {
  const postionName = path.slice(1);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(flexiResumeStore.data);

  // 使用useRef来存储previousPath，避免触发重新渲染
  const previousPathRef = React.useRef<string>('');

  // 性能监控时间戳
  const componentStartTime = React.useRef(performance.now());

  // 异步加载数据
  useEffect(() => {
    const loadData = async () => {
      const dataLoadStartTime = performance.now();
      const skeletonStart = performance.now();

      setIsLoading(true);

      try {
        // 记录路由切换性能
        if (previousPathRef.current && previousPathRef.current !== path) {
          const routeChangeTime = performance.now() - dataLoadStartTime;
          recordRouteChangeTime(previousPathRef.current, path, routeChangeTime);
        }

        await updateCurrentResumeStore(postionName);
        setData(flexiResumeStore.data);

        // 记录数据加载时间
        const dataLoadTime = performance.now() - dataLoadStartTime;
        recordDataLoadTime(`position-${postionName}`, dataLoadTime);

      } catch (error) {
        debugResume('Failed to load position data:', error);
      } finally {
        setIsLoading(false);

        // 记录骨架屏显示时间
        const skeletonDisplayTime = performance.now() - skeletonStart;
        recordSkeletonDisplayTime(skeletonDisplayTime);
      }
    };

    // 更新路径引用（不会触发重新渲染）
    previousPathRef.current = path;

    loadData();
  }, [postionName, path]); // 只依赖真正需要的值

  // 组件挂载时记录性能
  useEffect(() => {
    const mountTime = performance.now() - componentStartTime.current;
    recordComponentMetric('FlexiResume', 'mount', mountTime);
  }, []); // 只在挂载时执行一次

  // 记录渲染性能（只在数据加载完成后记录一次）
  useEffect(() => {
    if (!isLoading) {
      const renderTime = performance.now() - componentStartTime.current;
      recordComponentMetric('FlexiResume', 'render', renderTime);
    }
  }, [isLoading]);

  // 计算最小宽度
  const minWidth = watchMinWidth(800);

  // 显示加载状态 - 使用优化后的骨架屏
  if (isLoading) {
    return <SkeletonResume />;
  }

  const header_info = data.header_info;

  return (
    <ResumeWrapper data-testid="resume-content" style={{ minWidth: `${minWidth - 40}px`,  maxWidth: `800px` }}>
      <SEOHead position={postionName} />
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
    </ResumeWrapper>
  );
};

export default FlexiResume;
