import React from 'react';
import styled from 'styled-components';

interface SvgIconProps {
  src: string;
  alt?: string;
  size?: string;
  color?: string;
  isDark?: boolean;
  className?: string;
}

const IconWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark' && prop !== 'color' && prop !== 'size',
})<{ size?: string; color?: string; isDark?: boolean }>`
  display: inline-block;
  width: ${props => props.size || '1rem'};
  height: ${props => props.size || '1rem'};
  margin: 0 0.4rem;
  
  img {
    width: 100%;
    height: 100%;
    /* 使用filter来改变SVG颜色 */
    filter: ${props => {
      if (props.color) {
        // 如果指定了具体颜色，使用自定义filter
        return 'brightness(0) saturate(100%) invert(1)';
      }
      
      // 根据主题自动选择颜色
      return props.isDark 
        ? 'brightness(0) saturate(100%) invert(64%) sepia(8%) saturate(1000%) hue-rotate(180deg) brightness(95%) contrast(85%)' // 浅灰色
        : 'brightness(0) saturate(100%) invert(53%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(85%)';   // 深灰色
    }};
    transition: filter 0.3s ease;
  }
`;

/**
 * SVG图标组件 - 支持主题色彩变化
 * 
 * @param src - SVG文件路径
 * @param alt - 替代文本
 * @param size - 图标大小，默认1rem
 * @param color - 自定义颜色
 * @param isDark - 是否为深色模式
 * @param className - 额外的CSS类名
 */
const SvgIcon: React.FC<SvgIconProps> = ({ 
  src, 
  alt = '', 
  size = '1rem', 
  color, 
  isDark = false, 
  className 
}) => {
  return (
    <IconWrapper size={size} color={color} isDark={isDark} className={className}>
      <img src={src} alt={alt} />
    </IconWrapper>
  );
};

export default SvgIcon;

/**
 * 常用的filter值参考：
 * 
 * 黑色 (#000000): brightness(0) saturate(100%)
 * 白色 (#ffffff): brightness(0) saturate(100%) invert(1)
 * 灰色 (#888888): brightness(0) saturate(100%) invert(53%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(85%)
 * 蓝色 (#3498db): brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(187deg) brightness(119%) contrast(86%)
 * 绿色 (#27ae60): brightness(0) saturate(100%) invert(64%) sepia(88%) saturate(1553%) hue-rotate(117deg) brightness(94%) contrast(86%)
 * 红色 (#e74c3c): brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)
 * 
 * 在线工具生成filter值：https://codepen.io/sosuke/pen/Pjoqqp
 */
