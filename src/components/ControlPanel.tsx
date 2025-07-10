/**
 * 控制面板组件
 * 
 * 集成语言切换和主题切换功能
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

const PanelContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.isDark ? 'rgba(26, 32, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border: 1px solid ${props => props.isDark ? 'rgba(45, 55, 72, 0.8)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px ${props => props.isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px ${props => props.isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.15)'};
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    padding: 8px;
    gap: 8px;
  }
`;

const Divider = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  width: 1px;
  height: 24px;
  background: ${props => props.isDark ? 'rgba(74, 85, 104, 0.6)' : 'rgba(0, 0, 0, 0.1)'};
  transition: background 0.3s ease;
`;

const PanelButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid ${props => props.isDark ? 'rgba(74, 85, 104, 0.6)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.isDark ? '#e2e8f0' : '#2c3e50'};
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isDark ? 'rgba(45, 55, 72, 0.8)' : 'rgba(0, 0, 0, 0.05)'};
    border-color: ${props => props.isDark ? 'rgba(113, 128, 150, 0.8)' : 'rgba(0, 0, 0, 0.2)'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CollapsiblePanel = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCollapsed' && prop !== 'isDark',
})<{ isCollapsed: boolean; isDark: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transition: all 0.3s ease;

  /* 为ExpandedPanel提供相对定位上下文 */
  & > div:first-child {
    position: relative;
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
  }
`;

const ToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${props => props.isDark ? 'rgba(26, 32, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border: 1px solid ${props => props.isDark ? 'rgba(45, 55, 72, 0.8)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 50%;
  cursor: pointer;
  color: ${props => props.isDark ? '#e2e8f0' : '#2c3e50'};
  font-size: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 16px ${props => props.isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px ${props => props.isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ExpandedPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  padding: 16px;
  background: ${props => props.isDark ? 'rgba(26, 32, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border: 1px solid ${props => props.isDark ? 'rgba(45, 55, 72, 0.8)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px ${props => props.isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ControlLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
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
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  if (collapsible) {
    return (
      <CollapsiblePanel isCollapsed={isCollapsed} isDark={isDark} className={className}>
        <ToggleButton
          isDark={isDark}
          onClick={() => setIsCollapsed(!isCollapsed)}
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
          </ExpandedPanel>
        )}
      </CollapsiblePanel>
    );
  }

  return (
    <PanelContainer isDark={isDark} className={className}>
      <ThemeSwitcher />
      <Divider isDark={isDark} />
      <LanguageSwitcher />
    </PanelContainer>
  );
};

export default ControlPanel;
