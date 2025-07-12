import { createGlobalStyle } from 'styled-components';
import { replaceCDNBaseURL } from '../utils/Tools';
const maxWidth = `${920}px`;
const GlobalStyle = createGlobalStyle`
  /* CSS变量定义 - 浅色主题 */
  :root {
    --color-primary: #3498db;
    --color-secondary: #2c3e50;
    --color-accent: #e74c3c;

    --color-background: #ffffff;
    --color-surface: #f8f9fa;
    --color-card: #ffffff;

    --color-text-primary: #2c3e50;
    --color-text-secondary: #7f8c8d;
    --color-text-disabled: #bdc3c7;
    --color-text-inverse: #ffffff;

    --color-border-light: #ecf0f1;
    --color-border-medium: #bdc3c7;
    --color-border-dark: #95a5a6;

    --color-status-success: #27ae60;
    --color-status-warning: #f39c12;
    --color-status-error: #e74c3c;
    --color-status-info: #3498db;

    /* 状态背景色 - 浅色模式 */
    --color-status-worse: #fff0f0;    /* 较差的状态背景色 */
    --color-status-better: #f0fff0;   /* 更好的状态背景色 */

    --color-shadow-light: rgba(0, 0, 0, 0.05);
    --color-shadow-medium: rgba(0, 0, 0, 0.1);
    --color-shadow-dark: rgba(0, 0, 0, 0.2);
  }

  /* CSS变量定义 - 深色主题 - 护眼优化版本 */
  [data-theme="dark"] {
    --color-primary: #74b9ff;
    --color-secondary: #f1f3f4;
    --color-accent: #fd79a8;

    --color-background: #0f1419;
    --color-surface: #1a202c;
    --color-card: #2d3748;

    --color-text-primary: #f1f3f4; /* 提高文本对比度 */
    --color-text-secondary: #b2bec3; /* 提高次要文本对比度 */
    --color-text-disabled: #81ecec; /* 提高禁用文本对比度 */
    --color-text-inverse: #1a202c;

    --color-border-light: #2d3748;
    --color-border-medium: #4a5568;
    --color-border-dark: #718096;

    --color-status-success: #48bb78;
    --color-status-warning: #ed8936;
    --color-status-error: #f56565;
    --color-status-info: #4299e1;

    /* 状态背景色 - 深色模式 */
    --color-status-worse: #4a1a1a;    /* 较差的状态背景色 - 深红色调 */
    --color-status-better: #1a4a1a;   /* 更好的状态背景色 - 深绿色调 */

    --color-shadow-light: rgba(0, 0, 0, 0.1);
    --color-shadow-medium: rgba(0, 0, 0, 0.25);
    --color-shadow-dark: rgba(0, 0, 0, 0.4);
  }

  /* 全局重置和移动端优化 */
  * {
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden; /* 防止根元素横向溢出 */
    width: 100%;
  }

  #root {
    width: 100%;
    overflow-x: hidden; /* 防止React根元素横向溢出 */
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    color: var(--color-text-primary);
    background-color: var(--color-surface);
    letter-spacing: 0.02em;
    word-break: break-word; /* 改为break-word，避免强制断行 */
    transition: color 0.3s ease, background-color 0.3s ease, filter 0.3s ease;

    /* 修复移动端横向溢出问题 */
    overflow-x: hidden; /* 隐藏横向滚动条 */
    width: 100%;
    max-width: 100vw; /* 确保不超出视口宽度 */
    box-sizing: border-box;
    min-height: 100vh;

    /* 背景图 */
    background-image: url('${replaceCDNBaseURL('images/flexi-resume.jpg')}');

    /* 背景图平铺 */
    background-repeat: repeat;
    background-size: 180px;
  }

  /* 深色模式下的背景图优化 - 仅对背景图使用滤镜反转 */
  [data-theme="dark"] body {
    /* 使用滤镜反转背景图，让其适配深色主题 */
    background-image: url('${replaceCDNBaseURL('images/flexi-resume.jpg')}');

    /* 仅对背景图应用滤镜，不影响其他内容 */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${replaceCDNBaseURL('images/flexi-resume.jpg')}');
      background-repeat: repeat;
      background-size: 180px;
      /* 反转背景图颜色，让其适配深色主题 */
      filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2);
      pointer-events: none;
      z-index: -1;
    }

    /* 隐藏原始背景图，使用伪元素的反转版本 */
    background-image: none;
  }
  
  

  /* 针对代码块的样式 */
  pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      background-color: var(--color-surface);
      color: var(--color-text-primary);
      padding: 10px;
      border-radius: 5px;
      border: 1px solid var(--color-border-medium);
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
  
  .markdown-content img {
    max-width: 100%; /* 图片宽度自适应父容器 */
    height: auto;    /* 自动调整高度保持比例 */ 
  }

  .markdown-content video:not(.no-effect-icon),
  .markdown-content img:not(.no-effect-icon) {
    max-width: 100%;
    height: auto;
    margin: 5px 0;
    border-radius: 12px; /* 圆角 */
    box-shadow: 0 4px 12px var(--color-shadow-medium); /* 阴影 */
    background-color: var(--color-card);
    /* 视频的悬浮缩放效果 */
    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  }
 
  /* 悬浮效果 */
  .markdown-content video:not(.no-effect-icon):hover,
  .markdown-content img:not(.no-effect-icon):hover{
    transform: scale(1.03); /* 略微放大 */
    box-shadow: 0 6px 15px var(--color-shadow-dark); /* 增强阴影 */
  }

  .video-wrapper {
    position: relative;
    background: var(--color-surface);
    min-height: 100px;
    transition: background-color 0.3s ease;
  }

  .lazy-video {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .lazy-video.loaded {
    opacity: 1;
  }

  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    // background: rgba(0,0,0,0.7);
    color: var(--color-text-primary);
    border-radius: 4px;
    transition: color 0.3s ease;
  }

  /* 二维码深色模式优化 */
  [data-theme="dark"] {
    /* 确保二维码在深色模式下有良好的对比度 */
    svg[data-qr-code] {
      background: var(--color-card) !important;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 2px 8px var(--color-shadow-medium);
    }

    /* 优化Markdown中的二维码显示 */
    .markdown-content svg {
      background: var(--color-card);
      border-radius: 8px;
      padding: 8px;
      transition: background-color 0.3s ease;
    }
  }

  /* 状态背景色全局类 */
  .status-worse {
    background-color: var(--color-status-worse) !important;
    transition: background-color 0.3s ease;
  }

  .status-better {
    background-color: var(--color-status-better) !important;
    transition: background-color 0.3s ease;
  }

  /* 兼容原有的硬编码颜色 */
  [style*="background-color:#fff0f0"],
  [style*="background-color: #fff0f0"] {
    background-color: var(--color-status-worse) !important;
  }

  [style*="background-color:#f0fff0"],
  [style*="background-color: #f0fff0"] {
    background-color: var(--color-status-better) !important;
  }

  #root {
    display: flex;
    justify-content: center; /* 水平居中 */
    width: 100%;
    max-width: 100vw; /* 确保不超出视口宽度 */
    box-sizing: border-box;
    overflow-x: hidden; /* 防止横向溢出 */

    @media (max-width: ${maxWidth}) {
      flex-direction: column;
      align-items: center;
      padding: 0; /* 移除可能的padding */
    }
  }
  h1, h2, h3, h4 {
    margin: 0;
    padding: 0;
  }
  
  a:not(.no-link-icon) {
    text-decoration: none;
    color: inherit;
    position: relative;
    transition: color 0.3s ease;

    &::before {
      content: '';
      display: inline-block;
      transform: translateY(0.2em);
      width: 1rem; /* 图标宽度 */
      height: 1rem; /* 图标高度 */
      margin-right: 0.4rem; /* 图标和文本的间距 */
      background: url(${replaceCDNBaseURL("images/url.svg")}) no-repeat center;
      background-size: contain; /* 保证图标自适应 */
      /* 深色模式下的图标颜色调整 */
      filter: brightness(0) saturate(100%) invert(53%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(85%);
      transition: filter 0.3s ease;
    }

    /* 链接访问状态颜色 */
    &:link {
      color: var(--color-primary);
    }

    &:visited {
      color: var(--color-text-secondary);
    }

    &:hover {
      color: var(--color-accent);
    }

    &:active {
      color: var(--color-primary);
    }
  }

  /* 深色模式下的链接图标和颜色优化 */
  [data-theme="dark"] a:not(.no-link-icon) {
    &::before {
      filter: brightness(0) saturate(100%) invert(65%) sepia(11%) saturate(297%) hue-rotate(181deg) brightness(93%) contrast(87%);
    }

    &:link {
      color: #74b9ff !important; /* 深色模式下更亮的蓝色 - 提高对比度 */
    }

    &:visited {
      color: #b2bec3 !important; /* 深色模式下更明显的灰色 - 提高对比度 */
    }

    &:hover {
      color: #fd79a8 !important; /* 深色模式下更亮的粉红色 - 提高对比度 */
    }

    &:active {
      color: #74b9ff !important;
    }
  }

  /* 深色模式下的普通链接颜色优化 */
  [data-theme="dark"] a.no-link-icon {
    &:link {
      color: #74b9ff !important; /* 深色模式下更亮的蓝色 */
    }

    &:visited {
      color: #b2bec3 !important; /* 深色模式下更明显的灰色 */
    }

    &:hover {
      color: #fd79a8 !important; /* 深色模式下更亮的粉红色 */
    }

    &:active {
      color: #74b9ff !important;
    }
  }
  @media (max-width: ${maxWidth}) {
    body {
      padding: 1rem 0;
    }
    h1 {
      font-size: 1.8rem;
    } 
  }

  /* 加载状态样式 - 修复位置问题 */
  // .splash-loader {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   width: 100vw;
  //   height: 100vh;
  //   background: rgba(255, 255, 255, 0.95);
  //   backdrop-filter: blur(5px);
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
  //   z-index: 9999;
  //   transition: opacity 0.3s ease;
  //   /* 确保在所有设备上都能正确居中 */
  //   box-sizing: border-box;
  //   margin: 0;
  //   padding: 0;
  // }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
  }

  .splash-loader p {
    color: #666;
    font-size: 16px;
    margin: 0;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  /* 骨架屏样式 */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skeleton-text {
    height: 16px;
    margin: 8px 0;
    border-radius: 4px;
  }

  .skeleton-title {
    height: 24px;
    margin: 16px 0;
    border-radius: 6px;
  }

  /* 打印样式优化 */
  @media print {
    /* 页面设置 */
    @page {
      size: A4;
      margin: 1cm;
    }

    /* 重置根元素和body */
    html, body {
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      background-image: none !important;
      overflow: visible !important;
      font-size: 12pt !important;
      line-height: 1.4 !important;
      color: black !important;
    }

    /* 隐藏深色模式背景伪元素 */
    [data-theme="dark"] body::before {
      display: none !important;
    }

    /* 根元素打印优化 */
    #root {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      overflow: visible !important;
    }

    /* 隐藏不需要打印的元素 */
    .no-print,
    .print-hide,
    button,
    .control-panel,
    .floating-controls,
    nav,
    .navigation,
    .tabs,
    .tab-container {
      display: none !important;
    }

    /* 打印背景设置 */
    .print-background {
      position: relative;
      background: white !important;
    }

    .print-background::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      z-index: -1;
    }

    /* 确保所有文本颜色为黑色 */
    * {
      color: black !important;
      background: transparent !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    /* 链接样式 */
    a {
      color: black !important;
      text-decoration: underline !important;
    }

    /* 分页控制 */
    .page-break-before {
      page-break-before: always;
    }

    .page-break-after {
      page-break-after: always;
    }

    .page-break-inside-avoid {
      page-break-inside: avoid;
    }
  }
`;

export default GlobalStyle;
