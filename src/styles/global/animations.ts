/**
 * 全局动画样式
 * 
 * 定义项目中使用的动画和关键帧
 * 
 * @author 陈剑
 * @date 2025-01-28
 */

import { css, keyframes } from 'styled-components';

// 关键帧动画定义
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const slideInUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
`;

export const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const loading = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

export const scaleIn = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

export const scaleOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
`;

// 动画样式集合
export const animationStyles = css`
  /* 淡入动画 */
  .fade-in {
    animation: ${fadeIn} 0.3s ease-in-out;
  }

  /* 淡出动画 */
  .fade-out {
    animation: ${fadeOut} 0.3s ease-in-out;
  }

  /* 滑入动画 */
  .slide-in-up {
    animation: ${slideInUp} 0.3s ease-out;
  }

  .slide-in-down {
    animation: ${slideInDown} 0.3s ease-out;
  }

  .slide-in-left {
    animation: ${slideInLeft} 0.3s ease-out;
  }

  .slide-in-right {
    animation: ${slideInRight} 0.3s ease-out;
  }

  /* 旋转动画 */
  .spin {
    animation: ${spin} 1s linear infinite;
  }

  /* 脉冲动画 */
  .pulse {
    animation: ${pulse} 1.5s ease-in-out infinite;
  }

  /* 弹跳动画 */
  .bounce {
    animation: ${bounce} 1s ease-in-out;
  }

  /* 缩放动画 */
  .scale-in {
    animation: ${scaleIn} 0.3s ease-out;
  }

  .scale-out {
    animation: ${scaleOut} 0.3s ease-in;
  }

  /* 骨架屏动画 */
  .skeleton {
    background: linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border-medium) 50%, var(--color-border-light) 75%);
    background-size: 200% 100%;
    animation: ${loading} 1.5s infinite;
    transition: background 0.3s ease;
  }

  /* 深色模式下的骨架屏样式 */
  [data-theme="dark"] .skeleton {
    background: linear-gradient(90deg, var(--color-border-medium) 25%, var(--color-border-dark) 50%, var(--color-border-medium) 75%);
  }

  /* 加载指示器 */
  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    color: var(--color-text-primary);
    border-radius: 4px;
    transition: color 0.3s ease;
  }

  /* 启动画面加载器 */
  .splash-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: var(--color-background);
    transition: background-color 0.3s ease;
  }

  .splash-loader .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-border-light);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 20px;
    transition: border-color 0.3s ease;
  }

  .splash-loader p {
    color: var(--color-text-secondary);
    font-size: 16px;
    margin: 0;
    animation: ${pulse} 1.5s ease-in-out infinite;
    transition: color 0.3s ease;
  }
`;
