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
  padding: 0 5px; /* 进一步减少左右padding */
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%; /* 确保不超出容器宽度 */
  max-width: calc(100vw - 10px); /* 留出边距，防止溢出 */
  box-sizing: border-box;
  top: 2px;
  justify-content: flex-start; /* 改为左对齐，避免溢出 */
  overflow-x: auto; /* 允许横向滚动 */
  overflow-y: hidden;
  gap: 2px; /* 减少标签间距 */

  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* 移动端滚动提示 */
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(to right, transparent, ${props => props.isDark ? 'var(--color-surface)' : '#f8f9fa'});
    pointer-events: none;
    opacity: 0.8;
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

    /* 桌面端不需要滚动提示 */
    &::after {
      display: none;
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
  /* 移动端样式优化 */
  padding: 6px 8px; /* 进一步减少padding */
  text-decoration: none;
  color: ${props => props.isDark ? 'var(--color-text-primary)' : 'black'};
  border: 2px solid transparent; /* 默认无边框 */
  border-radius: 6px 6px 0 0; /* 减小圆角 */
  border-top: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-right: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-bottom: 0px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  border-left: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : borderColor};
  transition: background-color 0.3s, border 0.3s, color 0.3s, transform 0.2s;
  box-shadow: 0 0 10px ${props => props.isDark ? 'var(--color-shadow-medium)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.isDark ? 'var(--color-card)' : '#fff'};
  white-space: nowrap; /* 防止文字换行 */
  font-size: 12px; /* 移动端使用更小字体 */
  font-weight: 500; /* 增加字体粗细以提高可读性 */
  flex-shrink: 0; /* 防止被压缩 */
  min-width: fit-content; /* 最小宽度适应内容 */
  max-width: 120px; /* 限制最大宽度 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 文字溢出显示省略号 */

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
