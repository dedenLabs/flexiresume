/**
 * FlexiResume 设计系统
 * 
 * 统一的设计系统定义，包括颜色、字体、间距、组件等
 * 
 * @author 陈剑
 * @date 2025-01-28
 */

import { css } from 'styled-components';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants';

// 设计令牌 - 颜色系统
export const designTokens = {
  // 主色调 - 西游记主题
  colors: {
    primary: {
      50: '#FFF8DC',   // 极浅金色
      100: '#F5F5DC',  // 浅金色
      200: '#F0E68C',  // 卡其色
      300: '#DAA520',  // 金棒色
      400: '#D4AF37',  // 标准金色
      500: '#B8860B',  // 深金色
      600: '#8B7D6B',  // 古铜色
      700: '#8B4513',  // 棕色
      800: '#654321',  // 深棕色
      900: '#2F1B14'   // 极深棕色
    },
    
    // 中性色 - 古典色调
    neutral: {
      50: '#FFFAF0',   // 花白色
      100: '#F5F5DC',  // 米白色
      200: '#F0E68C',  // 浅卡其色
      300: '#D2B48C',  // 棕褐色
      400: '#A9A9A9',  // 暗灰色
      500: '#808080',  // 灰色
      600: '#696969',  // 暗灰色
      700: '#4A4A4A',  // 深灰色
      800: '#2F4F4F',  // 深灰绿色
      900: '#1C1C1C'   // 深炭色
    },
    
    // 状态色
    semantic: {
      success: {
        light: '#32CD32',  // 酸橙绿
        main: '#228B22',   // 森林绿
        dark: '#006400'    // 深绿色
      },
      warning: {
        light: '#FFA500',  // 橙色
        main: '#FF8C00',   // 深橙色
        dark: '#FF6347'    // 番茄红
      },
      error: {
        light: '#FF4500',  // 橙红色
        main: '#B22222',   // 火砖红
        dark: '#8B0000'    // 深红色
      },
      info: {
        light: '#87CEEB',  // 天蓝色
        main: '#4682B4',   // 钢蓝色
        dark: '#2F4F4F'    // 深灰绿色
      }
    }
  },
  
  // 字体系统
  typography: {
    fontFamily: {
      primary: '"Noto Serif SC", "STKaiti", "KaiTi", "Times New Roman", serif',
      secondary: '"STKaiti", "KaiTi", "SimKai", "FangSong", serif',
      modern: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", "SimHei", sans-serif',
      mono: 'Consolas, Monaco, "Courier New", monospace'
    },
    fontSize: TYPOGRAPHY.fontSize,
    fontWeight: TYPOGRAPHY.fontWeight,
    lineHeight: TYPOGRAPHY.lineHeight
  },
  
  // 间距系统
  spacing: SPACING,
  
  // 圆角系统
  borderRadius: BORDER_RADIUS,
  
  // 阴影系统
  shadows: SHADOWS,
  
  // 断点系统
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
    wide: '1440px'
  },
  
  // 动画系统
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms'
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  }
} as const;

// 组件设计规范
export const componentSpecs = {
  // 按钮规范
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px'
    },
    padding: {
      sm: `${SPACING.xs} ${SPACING.md}`,
      md: `${SPACING.sm} ${SPACING.lg}`,
      lg: `${SPACING.md} ${SPACING.xl}`
    },
    borderRadius: BORDER_RADIUS.md,
    fontSize: {
      sm: TYPOGRAPHY.fontSize.sm,
      md: TYPOGRAPHY.fontSize.base,
      lg: TYPOGRAPHY.fontSize.lg
    }
  },
  
  // 输入框规范
  input: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px'
    },
    padding: `${SPACING.sm} ${SPACING.md}`,
    borderRadius: BORDER_RADIUS.md,
    fontSize: TYPOGRAPHY.fontSize.base
  },
  
  // 卡片规范
  card: {
    padding: {
      sm: SPACING.md,
      md: SPACING.lg,
      lg: SPACING.xl
    },
    borderRadius: BORDER_RADIUS.lg,
    shadow: SHADOWS.md
  },
  
  // 模态框规范
  modal: {
    borderRadius: BORDER_RADIUS.xl,
    shadow: SHADOWS['2xl'],
    backdrop: 'rgba(0, 0, 0, 0.5)',
    maxWidth: '90vw',
    maxHeight: '90vh'
  },
  
  // 导航规范
  navigation: {
    height: '64px',
    padding: `0 ${SPACING.lg}`,
    shadow: SHADOWS.sm
  }
} as const;

// 设计系统工具函数
export const designSystem = {
  // 获取颜色
  getColor: (path: string) => {
    const keys = path.split('.');
    let value: any = designTokens.colors;
    for (const key of keys) {
      value = value[key];
      if (!value) return undefined;
    }
    return value;
  },
  
  // 获取间距
  getSpacing: (size: keyof typeof SPACING) => SPACING[size],
  
  // 获取字体大小
  getFontSize: (size: keyof typeof TYPOGRAPHY.fontSize) => TYPOGRAPHY.fontSize[size],
  
  // 获取阴影
  getShadow: (size: keyof typeof SHADOWS) => SHADOWS[size],
  
  // 创建响应式值
  responsive: (values: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    wide?: string;
  }) => css`
    ${values.mobile && `
      @media (max-width: ${designTokens.breakpoints.mobile}) {
        ${values.mobile}
      }
    `}
    
    ${values.tablet && `
      @media (min-width: ${designTokens.breakpoints.mobile}) and (max-width: ${designTokens.breakpoints.tablet}) {
        ${values.tablet}
      }
    `}
    
    ${values.desktop && `
      @media (min-width: ${designTokens.breakpoints.tablet}) {
        ${values.desktop}
      }
    `}
    
    ${values.wide && `
      @media (min-width: ${designTokens.breakpoints.wide}) {
        ${values.wide}
      }
    `}
  `,
  
  // 创建过渡动画
  transition: (
    properties: string[],
    duration: keyof typeof designTokens.animation.duration = 'normal',
    easing: keyof typeof designTokens.animation.easing = 'easeInOut'
  ) => {
    const durationValue = designTokens.animation.duration[duration];
    const easingValue = designTokens.animation.easing[easing];
    return properties.map(prop => `${prop} ${durationValue} ${easingValue}`).join(', ');
  }
} as const;

// 导出类型
export type DesignTokens = typeof designTokens;
export type ComponentSpecs = typeof componentSpecs;
export type ColorPath = string;
export type SpacingSize = keyof typeof SPACING;
export type FontSize = keyof typeof TYPOGRAPHY.fontSize;
export type ShadowSize = keyof typeof SHADOWS;
