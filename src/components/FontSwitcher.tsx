/**
 * 字体切换器组件
 * 
 * 提供字体选择和切换功能
 * 
 * @author FlexiResume Team
 * @date 2025-07-25
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useFontContext } from '../hooks/useFont';
import { FontType, FontConfig } from '../config/FontConfig';
import { useTheme } from '../theme';

// 样式组件
const FontSwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const FontButton = styled.button<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'var(--color-surface)' : 'var(--color-card)'};
  border: 1px solid var(--color-border-medium);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: space-between;

  &:hover {
    background: var(--color-surface);
    border-color: var(--color-primary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px var(--color-shadow-medium);
  }

  &:active {
    transform: translateY(0);
  }

  .icon {
    font-size: 16px;
    transition: transform 0.3s ease;
  }

  &.open .icon {
    transform: rotate(180deg);
  }
`;

const FontDropdown = styled.div<{ $isOpen: boolean; $isDark: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: ${props => props.$isDark ? 'var(--color-surface)' : 'var(--color-card)'};
  border: 1px solid var(--color-border-medium);
  border-radius: 8px;
  box-shadow: 0 -4px 12px var(--color-shadow-dark);
  z-index: 1000;
  margin-bottom: 4px;
  max-height: 300px;
  overflow-y: auto;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.3s ease;
`;

const FontCategory = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
  }
`;

const CategoryTitle = styled.div`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FontOption = styled.button<{ $isSelected: boolean; $fontFamily: string }>`
  width: 100%;
  background: none;
  border: none;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  color: var(--color-text-primary);
  font-family: ${props => props.$fontFamily};
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:hover {
    background: var(--color-surface);
  }

  ${props => props.$isSelected && `
    background: var(--color-primary);
    color: var(--color-text-inverse);
    
    &:hover {
      background: var(--color-primary);
    }
  `}

  .font-name {
    font-weight: 500;
  }

  .font-description {
    font-size: 12px;
    opacity: 0.8;
    font-family: inherit;
  }
`;

const LoadingIndicator = styled.div`
  padding: 12px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 12px;
`;

// 字体类型显示名称映射
const fontTypeNames: Record<FontType, string> = {
  [FontType.ANCIENT_CHINESE]: '古典中文',
  [FontType.MODERN_CHINESE]: '现代中文',
  [FontType.ENGLISH]: '英文字体',
  [FontType.MIXED]: '混合字体'
};

// 字体切换器组件
export const FontSwitcher: React.FC = () => {
  const { isDark } = useTheme();
  const {
    currentFont,
    setFontByName,
    availableFonts,
    isLoading,
    loadedFonts
  } = useFontContext();

  const [isOpen, setIsOpen] = useState(false);

  // 处理字体选择
  const handleFontSelect = (fontName: string) => {
    setFontByName(fontName);
    setIsOpen(false);
  };

  // 处理点击外部关闭
  const handleClickOutside = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  // 关闭下拉菜单
  const closeDropdown = () => {
    setIsOpen(false);
  };

  // 监听点击外部事件
  React.useEffect(() => {
    const handleDocumentClick = () => {
      closeDropdown();
    };

    if (isOpen) {
      document.addEventListener('click', handleDocumentClick);
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }
  }, [isOpen]);

  return (
    <FontSwitcherContainer onClick={handleClickOutside}>
      <FontButton
        $isDark={isDark}
        className={isOpen ? 'open' : ''}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        disabled={isLoading}
      >
        <span>{currentFont.primary.displayName}</span>
        <span className="icon">▼</span>
      </FontButton>

      <FontDropdown $isOpen={isOpen} $isDark={isDark}>
        {isLoading && (
          <LoadingIndicator>
            正在加载字体...
          </LoadingIndicator>
        )}

        {!isLoading && Object.entries(availableFonts).map(([fontType, fonts]) => (
          <FontCategory key={fontType}>
            <CategoryTitle>
              {fontTypeNames[fontType as FontType]}
            </CategoryTitle>
            {fonts.map((font: FontConfig) => (
              <FontOption
                key={font.name}
                $isSelected={currentFont.primary.name === font.name}
                $fontFamily={`"${font.fontFamily}", ${font.fallbacks.join(', ')}`}
                onClick={() => handleFontSelect(font.name)}
              >
                <div className="font-name">
                  {font.displayName}
                  {loadedFonts.has(font.fontFamily) && ' ✓'}
                </div>
                <div className="font-description">
                  {font.description}
                </div>
              </FontOption>
            ))}
          </FontCategory>
        ))}
      </FontDropdown>
    </FontSwitcherContainer>
  );
};

export default FontSwitcher;
