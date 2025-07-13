import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { formatResumeFilename, getCurrentPositionName } from '../utils/Tools';
import flexiResumeStore from '../store/Store';
import { useTheme } from '../theme';

const borderColor = `#aaa`;
const minWidth = `${920}px`;

const TabsWrapper = styled.nav.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
  /* 移动端样式 - 修复横向溢出问题 */
  padding: 0 10px; /* 适当的左右padding */
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%; /* 确保不超出容器宽度 */
  max-width: 100%; /* 不超出父容器 */
  box-sizing: border-box;
  top: 2px;
  justify-content: flex-start; /* 改为左对齐，避免溢出 */
  overflow-x: auto; /* 允许横向滚动 */
  overflow-y: hidden;
  gap: 2px; /* 减少标签间距 */

  /* 移动端特殊处理 */
  @media (max-width: 768px) {
    padding: 0 5px;
    margin: 20px 5px 0 5px;
    width: calc(100% - 10px);
    max-width: calc(100vw - 10px);
  }

  /* 超小屏幕适配 */
  @media (max-width: 480px) {
    padding: 0 2px;
    margin: 20px 2px 0 2px;
    width: calc(100% - 4px);
    max-width: calc(100vw - 4px);
    gap: 1px;
  }

  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* 完全移除滚动提示渐变遮罩 - 用户反馈不需要此功能 */
  &::after {
    display: none !important;
    content: none !important;
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
    gap: 2px; /* 桌面端也减少间距 */

    /* 桌面端不需要滚动提示 - 强制隐藏 */
    &::after {
      display: none !important;
      content: none !important;
    }
  }

  /* 在打印时隐藏 */
  @media print {
    display: none;
  }
`;

const TabLink = styled(NavLink).withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
  /* 基础样式 */
  text-decoration: none;
  color: ${props => props.isDark ? 'var(--color-text-primary)' : 'black'};
  border: 2px solid transparent;
  border-radius: 6px 6px 0 0;
  border-top: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-right: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-bottom: 0px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-left: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  transition: background-color 0.3s, border 0.3s, color 0.3s, transform 0.2s;
  box-shadow: 0 0 10px ${props => props.isDark ? 'var(--color-shadow-medium)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.isDark ? 'var(--color-card)' : '#fff'};
  white-space: nowrap;
  flex-shrink: 0;
  box-sizing: border-box;

  /* 移动端样式 */
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 500;
  min-width: fit-content;
  max-width: 100px; /* 减小最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis;

  /* 超小屏幕适配 */
  @media (max-width: 480px) {
    padding: 4px 6px;
    font-size: 11px;
    max-width: 80px;
  }

  &:hover, &.active {
    background-color: ${props => props.isDark ? 'var(--color-surface)' : '#f0f0f0'};
    border-color: ${props => props.isDark ? 'var(--color-primary)' : '#333'}; /* 激活状态时显示边框颜色 */
    border-top: 2px solid ${props => props.isDark ? 'var(--color-primary)' : '#333'}; /* 激活状态显示顶部边框 */
    color: ${props => props.isDark ? 'var(--color-primary)' : 'inherit'};
    transform: translateY(-1px); /* 轻微上移效果 */
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
  const location = useLocation(); // 移到组件顶部，确保 Hooks 顺序一致

  useEffect(() => {
    if (!tabs.length) {
      document.title = data?.header_info?.position || 'My Resume';
      return;
    }

    const currentPosition = getCurrentPositionName(location);
    const headerInfo = Object.assign({}, data?.header_info, { position: currentPosition });
    const title = formatResumeFilename(data?.header_info?.resume_name_format || `{position}-{name}-{age}-{location}`, headerInfo);

    // 更新页面标题，确保不为空
    const finalTitle = title && title.trim() ? title : (currentPosition || data?.header_info?.position || 'My Resume');
    document.title = finalTitle;
  }, [location, data, tabs.length]);

  if (!tabs.length) {
    return null;
  }

  return (
    <TabsWrapper data-testid="navigation-tabs" isDark={isDark}>
      {
        tabs.map(([position, url], index) => (
          <TabLink key={url} className="no-link-icon" to={url} isDark={isDark}>{position}</TabLink>
        ))
      }
    </TabsWrapper>
  );
};

export default Tabs;
