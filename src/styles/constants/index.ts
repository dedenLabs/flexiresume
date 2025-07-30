/**
 * 样式常量定义
 * 
 * 统一管理项目中的样式常量，包括断点、间距、字体、动画等
 * 
 * @author 陈剑
 * @date 2025-01-28
 */

// 响应式断点
export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px',
  wide: '1440px'
} as const;

// 间距系统 - 基于8px网格
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px'
} as const;

// 字体系统
export const TYPOGRAPHY = {
  fontFamily: {
    primary: 'Arial, sans-serif, "Microsoft YaHei", "微软雅黑"',
    mono: 'Consolas, Monaco, "Courier New", monospace'
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px'
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  }
} as const;

// 圆角系统
export const BORDER_RADIUS = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '50%'
} as const;

// 阴影系统
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
} as const;

// 动画时长
export const ANIMATION_DURATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '1000ms'
} as const;

// 动画缓动函数
export const ANIMATION_EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
} as const;

// Z-index层级
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070
} as const;

// 骨架屏常量
export const SKELETON = {
  shimmerDuration: '1.5s',
  borderRadius: BORDER_RADIUS.sm,
  heights: {
    text: '16px',
    title: '24px',
    subtitle: '20px',
    avatar: '80px'
  },
  widths: {
    short: '60%',
    medium: '80%',
    long: '95%',
    full: '100%'
  }
} as const;

// 媒体查询工具函数
export const mediaQuery = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile})`,
  tablet: `@media (min-width: ${BREAKPOINTS.mobile}) and (max-width: ${BREAKPOINTS.tablet})`,
  desktop: `@media (min-width: ${BREAKPOINTS.tablet})`,
  wide: `@media (min-width: ${BREAKPOINTS.wide})`
} as const;

// 常用的CSS混合样式
export const MIXINS = {
  // 文本截断
  textTruncate: `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  
  // 多行文本截断
  textTruncateLines: (lines: number) => `
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,
  
  // 居中对齐
  centerFlex: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  
  // 绝对居中
  absoluteCenter: `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
  
  // 清除浮动
  clearfix: `
    &::after {
      content: '';
      display: table;
      clear: both;
    }
  `,
  
  // 隐藏滚动条
  hideScrollbar: `
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `
} as const;

// 导出所有常量的类型
export type Breakpoint = keyof typeof BREAKPOINTS;
export type Spacing = keyof typeof SPACING;
export type FontSize = keyof typeof TYPOGRAPHY.fontSize;
export type FontWeight = keyof typeof TYPOGRAPHY.fontWeight;
export type BorderRadius = keyof typeof BORDER_RADIUS;
export type Shadow = keyof typeof SHADOWS;
export type AnimationDuration = keyof typeof ANIMATION_DURATION;
export type AnimationEasing = keyof typeof ANIMATION_EASING;
export type ZIndex = keyof typeof Z_INDEX;
