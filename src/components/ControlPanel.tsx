/**
 * 控制面板组件
 *
 * 集成语言切换和主题切换功能
 * 支持响应式折叠：大于768px时默认展开，小于768px时默认折叠
 *
 * @author 陈剑
 * @date 2024-12-27
 */

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme';
import { useI18n } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import FontSwitcher from './FontSwitcher';
import PDFDownloader from './PDFDownloader';
import AudioController from './AudioController';

/**
 * 检测屏幕尺寸的Hook
 * @param breakpoint 断点尺寸，默认768px
 * @returns 是否大于断点尺寸
 */
const useMediaQuery = (breakpoint: number = 768): boolean => {
  const [isLargeScreen, setIsLargeScreen] = React.useState<boolean>(() => {
    // 初始化时检查窗口尺寸
    if (typeof window !== 'undefined') {
      return window.innerWidth > breakpoint;
    }
    return true; // SSR时默认为大屏幕
  });

  React.useEffect(() => {
    // 防抖处理，避免频繁触发
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsLargeScreen(window.innerWidth > breakpoint);
      }, 100);
    };

    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 初始检查
    handleResize();

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return isLargeScreen;
};

const PanelContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px; 
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px var(--color-shadow-medium);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px var(--color-shadow-dark);
  }

  /* 在打印时隐藏控制面板 */
  @media print {
    display: none !important;
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    padding: 8px;
    gap: 8px;
    min-width: 240px; /* 小屏幕下的最小宽度 */
  }
`;

const Divider = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  width: 1px;
  height: 24px;
  background: var(--color-border-light);
  transition: background 0.3s ease;
`;

const PanelButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-surface);
    border-color: var(--color-border-medium);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CollapsiblePanel = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCollapsed' && prop !== 'isDark',
}) <{ isCollapsed: boolean; isDark: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transition: all 0.3s ease;

  /* 为ExpandedPanel提供相对定位上下文 */
  & > div:first-child {
    position: relative;
  }

  /* 在打印时隐藏控制面板 */
  @media print {
    display: none !important;
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
  }
`;

const ToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 16px var(--color-shadow-medium);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px ${props => props.isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: scale(0.95);
  }

  /* 在打印时隐藏控制面板 */
  @media print {
    display: none !important;
  }
`;

const ExpandedPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px var(--color-shadow-medium);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 240px; /* 小屏幕下的最小宽度 */

  /* 在打印时隐藏控制面板 */
  @media print {
    display: none !important;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ControlLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.isDark ? '#e2e8f0' : '#2c3e50'};
`;

interface ControlPanelProps {
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  className,
  collapsible = false,
  defaultCollapsed = false
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();

  // 检测屏幕尺寸，决定默认折叠状态
  const isLargeScreen = useMediaQuery(768);

  // 响应式默认折叠状态：大屏幕默认展开，小屏幕默认折叠
  const responsiveDefaultCollapsed = React.useMemo(() => {
    if (defaultCollapsed !== false) {
      return defaultCollapsed; // 如果明确指定了defaultCollapsed，使用指定值
    }
    return !isLargeScreen; // 大屏幕展开(false)，小屏幕折叠(true)
  }, [isLargeScreen, defaultCollapsed]);

  // 从localStorage读取保存的折叠状态
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    try {
      const saved = localStorage.getItem('controlPanelCollapsed');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {
      // localStorage读取失败时使用默认值
    }
    return responsiveDefaultCollapsed;
  });

  // 当屏幕尺寸变化时，更新折叠状态（仅在用户未手动操作时）
  const [userHasInteracted, setUserHasInteracted] = React.useState(() => {
    try {
      // 如果localStorage中有保存的状态，说明用户已经交互过
      return localStorage.getItem('controlPanelCollapsed') !== null;
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (!userHasInteracted) {
      setIsCollapsed(responsiveDefaultCollapsed);
    }
  }, [responsiveDefaultCollapsed, userHasInteracted]);

  // 保存折叠状态到localStorage
  React.useEffect(() => {
    if (userHasInteracted) {
      try {
        localStorage.setItem('controlPanelCollapsed', JSON.stringify(isCollapsed));
      } catch (error) {
        console.warn('Failed to save control panel collapsed state to localStorage:', error);
      }
    }
  }, [isCollapsed, userHasInteracted]);

  // 处理用户点击折叠/展开
  const handleToggle = () => {
    setUserHasInteracted(true);
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
  };

  if (collapsible) {
    return (
      <CollapsiblePanel
        isCollapsed={isCollapsed}
        isDark={isDark}
        className={className}
        data-testid="control-panel"
      >
        <ToggleButton
          isDark={isDark}
          onClick={handleToggle}
          title={t.common.controlPanel}
          aria-label={t.common.controlPanel}
        >
          {isCollapsed ? '⚙️' : '✕'}
        </ToggleButton>

        {!isCollapsed && (
          <ExpandedPanel isDark={isDark}>
            <ControlGroup>
              <ControlLabel isDark={isDark}>{t.common.theme}</ControlLabel>
              <ThemeSwitcher showTooltip={false} />
            </ControlGroup>

            <Divider isDark={isDark} />

            <ControlGroup>
              <ControlLabel isDark={isDark}>{t.common.language}</ControlLabel>
              <LanguageSwitcher />
            </ControlGroup>

            <Divider isDark={isDark} />

            <ControlGroup>
              <ControlLabel isDark={isDark}>{t.common.font}</ControlLabel>
              <FontSwitcher />
            </ControlGroup>

            <Divider isDark={isDark} />
            <ControlGroup>
              <ControlLabel isDark={isDark}>{t.common.music}</ControlLabel>
              <AudioController />
            </ControlGroup>

            <Divider isDark={isDark} />

            <ControlGroup>
              <ControlLabel isDark={isDark}>{t.common.downloadPDF}</ControlLabel>
              <PDFDownloader />
            </ControlGroup>
          </ExpandedPanel>
        )}
      </CollapsiblePanel>
    );
  }

  return (
    <PanelContainer isDark={isDark} className={className} data-testid="control-panel">
      <ThemeSwitcher />
      <Divider isDark={isDark} />
      <LanguageSwitcher />
      <Divider isDark={isDark} />
      <FontSwitcher />
      <Divider isDark={isDark} />
      <AudioController />
      <Divider isDark={isDark} />
      <PDFDownloader />
    </PanelContainer>
  );
};

export default ControlPanel;
