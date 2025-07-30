/**
 * 样式工具函数
 * 
 * 提供常用的样式生成函数和工具方法
 * 
 * @author 陈剑
 * @date 2025-01-28
 */

import { css } from 'styled-components';
import { BREAKPOINTS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants';

// 响应式样式生成器
export const createResponsiveStyle = (
  property: string,
  values: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    wide?: string;
  }
) => css`
  ${property}: ${values.mobile};
  
  @media (min-width: ${BREAKPOINTS.mobile}) {
    ${property}: ${values.tablet || values.mobile};
  }
  
  @media (min-width: ${BREAKPOINTS.tablet}) {
    ${property}: ${values.desktop || values.tablet || values.mobile};
  }
  
  @media (min-width: ${BREAKPOINTS.wide}) {
    ${property}: ${values.wide || values.desktop || values.tablet || values.mobile};
  }
`;

// 间距工具函数
export const spacing = (size: keyof typeof SPACING) => SPACING[size];

// 字体大小工具函数
export const fontSize = (size: keyof typeof TYPOGRAPHY.fontSize) => TYPOGRAPHY.fontSize[size];

// 字体粗细工具函数
export const fontWeight = (weight: keyof typeof TYPOGRAPHY.fontWeight) => TYPOGRAPHY.fontWeight[weight];

// 圆角工具函数
export const borderRadius = (size: keyof typeof BORDER_RADIUS) => BORDER_RADIUS[size];

// 阴影工具函数
export const shadow = (size: keyof typeof SHADOWS) => SHADOWS[size];

// 主题颜色获取函数
export const getThemeColor = (colorVar: string) => `var(--color-${colorVar})`;

// 渐变背景生成器
export const createGradient = (
  direction: string,
  colors: string[]
) => `linear-gradient(${direction}, ${colors.join(', ')})`;

// 骨架屏渐变生成器
export const createSkeletonGradient = (isDark?: boolean) => {
  const lightColors = [
    'var(--color-border-light) 25%',
    'var(--color-border-medium) 50%',
    'var(--color-border-light) 75%'
  ];
  
  const darkColors = [
    'var(--color-border-medium) 25%',
    'var(--color-border-dark) 50%',
    'var(--color-border-medium) 75%'
  ];
  
  return createGradient('90deg', isDark ? darkColors : lightColors);
};

// 过渡动画生成器
export const createTransition = (
  properties: string[],
  duration: string = '300ms',
  easing: string = 'ease'
) => properties.map(prop => `${prop} ${duration} ${easing}`).join(', ');

// 媒体查询工具函数
export const mediaQuery = {
  mobile: (styles: any) => css`
    @media (max-width: ${BREAKPOINTS.mobile}) {
      ${styles}
    }
  `,
  
  tablet: (styles: any) => css`
    @media (min-width: ${BREAKPOINTS.mobile}) and (max-width: ${BREAKPOINTS.tablet}) {
      ${styles}
    }
  `,
  
  desktop: (styles: any) => css`
    @media (min-width: ${BREAKPOINTS.tablet}) {
      ${styles}
    }
  `,
  
  wide: (styles: any) => css`
    @media (min-width: ${BREAKPOINTS.wide}) {
      ${styles}
    }
  `
};

// 文本截断样式
export const textTruncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 多行文本截断样式
export const textTruncateLines = (lines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Flex居中样式
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 绝对居中样式
export const absoluteCenter = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// 隐藏滚动条样式
export const hideScrollbar = css`
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

// 清除浮动样式
export const clearfix = css`
  &::after {
    content: '';
    display: table;
    clear: both;
  }
`;

// 按钮基础样式
export const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${borderRadius('md')};
  font-family: ${TYPOGRAPHY.fontFamily.primary};
  font-weight: ${fontWeight('medium')};
  cursor: pointer;
  transition: ${createTransition(['background-color', 'border-color', 'color', 'box-shadow'])};
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// 卡片基础样式
export const cardBase = css`
  background: ${getThemeColor('card')};
  border-radius: ${borderRadius('lg')};
  box-shadow: ${shadow('md')};
  transition: ${createTransition(['background-color', 'box-shadow'])};
`;

// 输入框基础样式
export const inputBase = css`
  width: 100%;
  padding: ${spacing('sm')} ${spacing('md')};
  border: 1px solid ${getThemeColor('border-medium')};
  border-radius: ${borderRadius('md')};
  background: ${getThemeColor('surface')};
  color: ${getThemeColor('text-primary')};
  font-family: ${TYPOGRAPHY.fontFamily.primary};
  font-size: ${fontSize('base')};
  transition: ${createTransition(['border-color', 'background-color', 'box-shadow'])};
  
  &:focus {
    outline: none;
    border-color: ${getThemeColor('primary')};
    box-shadow: 0 0 0 3px ${getThemeColor('primary')}20;
  }
  
  &::placeholder {
    color: ${getThemeColor('text-disabled')};
  }
`;

// 链接基础样式
export const linkBase = css`
  color: ${getThemeColor('primary')};
  text-decoration: none;
  transition: ${createTransition(['color'])};
  
  &:hover {
    color: ${getThemeColor('accent')};
    text-decoration: underline;
  }
`;

// 导出所有工具函数
export {
  BREAKPOINTS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS
} from '../constants';
