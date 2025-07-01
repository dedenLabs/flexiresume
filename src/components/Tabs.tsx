import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { formatResumeFilename, getCurrentPositionName } from '../utils/Tools';
import flexiResumeStore from '../store/Store';
import { useTheme } from '../theme';

const borderColor = `#aaa`;
const minWidth = `${920}px`;

const TabsWrapper = styled.nav<{ isDark?: boolean }>`
  /* 移动端样式 - 修复横向溢出问题 */
  padding: 0 10px; /* 减少左右padding */
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%; /* 确保不超出容器宽度 */
  max-width: 100vw; /* 不超出视口宽度 */
  box-sizing: border-box;
  top: 2px;
  justify-content: flex-start; /* 改为左对齐，避免溢出 */
  overflow-x: auto; /* 允许横向滚动，但尽量避免 */
  overflow-y: hidden;

  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (min-width: ${minWidth}) {
    position: absolute;
    width: 45px;
    display: flex;
    flex-direction: column;
    top: 115px;
    left: 50%;
    transform: translateX(405px);
    border-radius: 8px 8px 0 0;
    align-items: flex-end;
    overflow: visible; /* 桌面端恢复正常 */
  }

  /* 在打印时隐藏 */
  @media print {
    display: none;
  }
`;

const TabLink = styled(NavLink)<{ isDark?: boolean }>`
  /* 移动端样式优化 */
  padding: 8px 12px; /* 减少padding避免溢出 */
  text-decoration: none;
  color: ${props => props.isDark ? 'var(--color-text-primary)' : 'black'};
  border: 2px solid transparent; /* 默认无边框 */
  border-radius: 8px 8px 0 0;
  border-top: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-right: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-bottom: 0px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-left: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  transition: background-color 0.3s, border 0.3s, color 0.3s;
  box-shadow: 0 0 15px ${props => props.isDark ? 'var(--color-shadow-medium)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.isDark ? 'var(--color-card)' : '#fff'};
  white-space: nowrap; /* 防止文字换行 */
  font-size: 14px; /* 移动端使用较小字体 */
  flex-shrink: 0; /* 防止被压缩 */

  &:hover, &.active {
    background-color: ${props => props.isDark ? 'var(--color-surface)' : '#f0f0f0'};
    border-color: ${props => props.isDark ? 'var(--color-primary)' : '#333'}; /* 激活状态时显示边框颜色 */
    border-top: 2px solid ${props => props.isDark ? 'var(--color-primary)' : '#333'}; /* 激活状态显示右侧边框 */
    color: ${props => props.isDark ? 'var(--color-primary)' : 'inherit'};
  }

  @media (min-width: ${minWidth}) {
    padding: 10px 10px;
    margin: 2px 0;
    border: none;
    text-align: center;
    font-size: 16px; /* 桌面端恢复正常字体大小 */

    /* 竖向排列文本 */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    border-radius: 0px 8px 8px 0px;
    border-top: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
    border-right: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
    border-bottom: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
    border-left: 0px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};

    &:hover, &.active {
      background-color: ${props => props.isDark ? 'var(--color-surface)' : '#f0f0f0'};
      border-right: 2px solid ${props => props.isDark ? 'var(--color-primary)' : '#333'}; /* 激活状态显示右侧边框 */
      color: ${props => props.isDark ? 'var(--color-primary)' : 'inherit'};
    }
  }
`;

/**
 * 显示简历页签
 *
 * @return {*} 
 */
const Tabs: React.FC = () => {
  const data = flexiResumeStore.data;
  const tabs = flexiResumeStore.tabs;
  const { isDark } = useTheme();

  if (!tabs.length) {
    document.title = data?.header_info?.position || 'My Resume';
    return null;
  }
  const location = useLocation();
  useEffect(() => {
    const currentPosition = getCurrentPositionName(location);
    const title = formatResumeFilename(data?.header_info?.resume_name_format || `{position}-{name}-{age}-{location}`,
      Object.assign({}, data.header_info, { position: currentPosition }));

    // 更新页面标题
    document.title = title;
  }, [location]);

  return (
    <TabsWrapper isDark={isDark}>
      {
        tabs.map(([position, url], index) => (
          <TabLink key={url} className="no-link-icon" to={url} isDark={isDark}>{position}</TabLink>
        ))
      }
    </TabsWrapper>
  );
};

export default Tabs;
