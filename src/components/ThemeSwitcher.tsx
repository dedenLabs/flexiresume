/**
 * 主题切换组件
 * 
 * 提供明暗主题切换功能
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme';
import { useI18n } from '../i18n';

const SwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const SwitcherButton = styled.button<{ isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: ${props => props.isDark ? '#f1c40f' : '#ff6b35'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
    border-color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)'};
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${props => props.isDark ? 'rgba(241, 196, 15, 0.3)' : 'rgba(255, 107, 53, 0.3)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const IconContainer = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${props => props.isVisible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(180deg)'};
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SunIcon = styled.div`
  position: relative;
  
  &::before {
    content: '☀️';
    font-size: 20px;
    display: block;
  }
`;

const MoonIcon = styled.div`
  position: relative;
  
  &::before {
    content: '🌙';
    font-size: 18px;
    display: block;
  }
`;

const Tooltip = styled.div<{ isDark: boolean; isVisible: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 6px 12px;
  background: ${props => props.isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
  color: ${props => props.isDark ? '#2c3e50' : '#ffffff'};
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transform: translateX(-50%) ${props => props.isVisible ? 'translateY(0)' : 'translateY(4px)'};
  transition: all 0.3s ease;
  z-index: 1000;
  backdrop-filter: blur(10px);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
  }
`;

const RippleEffect = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
  pointer-events: none;
  
  ${props => props.isActive && `
    width: 100px;
    height: 100px;
  `}
`;

interface ThemeSwitcherProps {
  className?: string;
  showTooltip?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  className, 
  showTooltip = true 
}) => {
  const { mode, toggleMode, isDark } = useTheme();
  const { t } = useI18n();
  const [isHovered, setIsHovered] = React.useState(false);
  const [rippleActive, setRippleActive] = React.useState(false);

  const handleClick = () => {
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 600);
    toggleMode();
  };

  const tooltipText = isDark ? t.common.lightMode : t.common.darkMode;

  return (
    <SwitcherContainer 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SwitcherButton
        isDark={isDark}
        onClick={handleClick}
        title={tooltipText}
        aria-label={tooltipText}
      >
        <RippleEffect isActive={rippleActive} />
        
        <IconContainer isVisible={!isDark}>
          <SunIcon />
        </IconContainer>
        
        <IconContainer isVisible={isDark}>
          <MoonIcon />
        </IconContainer>
      </SwitcherButton>

      {showTooltip && (
        <Tooltip isDark={isDark} isVisible={isHovered}>
          {tooltipText}
        </Tooltip>
      )}
    </SwitcherContainer>
  );
};

export default ThemeSwitcher;
