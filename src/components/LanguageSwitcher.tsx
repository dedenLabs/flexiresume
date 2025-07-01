/**
 * 语言切换组件
 * 
 * 提供中英文切换功能
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import React from 'react';
import styled from 'styled-components';
import { useI18n, Language } from '../i18n';

const SwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 1);
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const LanguageIcon = styled.span`
  font-size: 16px;
  line-height: 1;
`;

const LanguageText = styled.span`
  font-weight: 500;
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1000;
  min-width: 120px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
`;

const DropdownItem = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: ${props => props.isActive ? '#f8f9fa' : 'transparent'};
  color: ${props => props.isActive ? '#3498db' : '#333'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }

  &:hover {
    background: #f8f9fa;
    color: #3498db;
  }

  &:active {
    background: #e9ecef;
  }
`;

const CheckIcon = styled.span<{ visible: boolean }>`
  opacity: ${props => props.visible ? 1 : 0};
  color: #27ae60;
  font-weight: bold;
  margin-left: auto;
`;

// 语言配置
const languages: Array<{ code: Language; name: string; icon: string; nativeName: string }> = [
  { code: 'zh', name: 'Chinese', icon: '🇨🇳', nativeName: '中文' },
  { code: 'en', name: 'English', icon: '🇺🇸', nativeName: 'English' }
];

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('[data-language-switcher]')) {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  return (
    <SwitcherContainer className={className} data-language-switcher>
      <SwitcherButton
        onClick={() => setIsOpen(!isOpen)}
        title={t.common.switchLanguage}
        aria-label={t.common.switchLanguage}
      >
        <LanguageIcon>{currentLanguage?.icon}</LanguageIcon>
        <LanguageText>{currentLanguage?.nativeName}</LanguageText>
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
          transition: 'transform 0.3s ease',
          fontSize: '12px'
        }}>
          ▼
        </span>
      </SwitcherButton>

      <DropdownMenu isOpen={isOpen}>
        {languages.map((lang) => (
          <DropdownItem
            key={lang.code}
            isActive={language === lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span>{lang.icon}</span>
            <span>{lang.nativeName}</span>
            <CheckIcon visible={language === lang.code}>✓</CheckIcon>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </SwitcherContainer>
  );
};

export default LanguageSwitcher;
