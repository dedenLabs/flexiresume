/**
 * 语言切换组件
 * 
 * 提供中英文切换功能
 * 
 * @author dedenlabs
 * @date 2024-12-27
 */

import React from 'react';
import styled from 'styled-components';
import { useI18n, Language } from '../i18n';
import { useTheme } from '../theme';
import {
  getCurrentLanguage,
  setCurrentLanguage,
  saveLanguagePreference,
  LANGUAGE_NAMES,
  SupportedLanguage
} from '../data/DataLoader';
import { globalCache } from '../utils/MemoryManager';

const SwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const SwitcherButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: var(--color-card);
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px var(--color-shadow-medium);
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

const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== 'isDark',
}) <{ isOpen: boolean; isDark: boolean }>`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  box-shadow: 0 -4px 12px var(--color-shadow-medium);
  backdrop-filter: blur(10px);
  z-index: 1000;
  min-width: 120px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.3s ease;
`;

const DropdownItem = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isDark',
}) <{ isActive: boolean; isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: ${props => props.isActive
    ? 'var(--color-card)'
    : 'transparent'};
  color: ${props => props.isActive
    ? 'var(--color-primary)'
    : 'var(--color-text-primary)'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 0 0 6px 6px;
  }

  &:last-child {
    border-radius: 6px 6px 0 0;
  }

  &:hover {
    background: var(--color-card);
    color: var(--color-primary);
  }

  &:active {
    background: var(--color-surface);
  }
`;

const CheckIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'visible' && prop !== 'isDark',
}) <{ visible: boolean; isDark: boolean }>`
  opacity: ${props => props.visible ? 1 : 0};
  color: var(--color-status-success);
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
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  // 初始化时同步DataLoader的语言状态
  React.useEffect(() => {
    const dataLanguage = getCurrentLanguage();
    if (dataLanguage !== language) {
      setLanguage(dataLanguage);
    }
  }, [language, setLanguage]);

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      // 先更新数据语言（这会触发数据重新加载）
      const dataLanguage = newLanguage as SupportedLanguage;
      setCurrentLanguage(dataLanguage);
      saveLanguagePreference(dataLanguage);

      globalCache.clear(); // 清除缓存
      // 然后更新UI语言
      setLanguage(newLanguage);

      setIsOpen(false);

      console.log(`语言切换完成: ${newLanguage}`);
    } catch (error) {
      console.error('语言切换失败:', error);
    }
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
    <SwitcherContainer className={className} data-testid="language-switcher" data-language-switcher>
      <SwitcherButton
        isDark={isDark}
        onClick={() => setIsOpen(!isOpen)}
        title={t.common.switchLanguage}
        aria-label={t.common.switchLanguage}
      >
        <LanguageIcon>{currentLanguage?.icon}</LanguageIcon>
        <LanguageText>{currentLanguage?.nativeName}</LanguageText>
        <span style={{
          transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: 'transform 0.3s ease',
          fontSize: '12px'
        }}>
          ▲
        </span>
      </SwitcherButton>

      <DropdownMenu isOpen={isOpen} isDark={isDark}>
        {languages.map((lang) => (
          <DropdownItem
            key={lang.code}
            isActive={language === lang.code}
            isDark={isDark}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span>{lang.icon}</span>
            <span>{lang.nativeName}</span>
            <CheckIcon visible={language === lang.code} isDark={isDark}>✓</CheckIcon>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </SwitcherContainer>
  );
};

export default LanguageSwitcher;
