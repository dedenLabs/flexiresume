import { createGlobalStyle } from 'styled-components';
import { replaceCDNBaseURL } from '../utils/Tools';
import { useTheme } from '../theme';
// 导入主题管理器，自动加载主题样式
import './themes/ThemeManager';
// 导入模块化样式
import { resetStyles } from './global/reset';
import { animationStyles } from './global/animations';
import { utilityStyles } from './global/utilities';
const maxWidth = `${920}px`;

// 动态GlobalStyle组件，使用主题系统
const GlobalStyle = createGlobalStyle<{ theme?: any }>`
  /* 主题CSS变量已抽离到独立文件 */
  /* 浅色主题: src/styles/themes/LightTheme.css */
  /* 深色主题: src/styles/themes/DarkTheme.css */

  /* 字体变量 - 优化版，使用汉仪尚巍手书W作为默认字体 */
  :root {
    --font-family-primary: "HYShangWeiShouShuW", "Ma Shan Zheng", "STKaiti", "KaiTi", "SimKai", "FangSong", serif;
    --font-family-secondary: "Ma Shan Zheng", "Liu Jian Mao Cao", "STKaiti", "KaiTi", "SimKai", "FangSong", serif;
    --font-family-english: "Times New Roman", "Georgia", serif;
    --font-family-chinese: "HYShangWeiShouShuW", "Ma Shan Zheng", "STKaiti", "KaiTi", serif;
    --font-family-calligraphy: "Ma Shan Zheng", "Liu Jian Mao Cao", "STKaiti", "KaiTi", serif;
    --font-family-decorative: "ZCOOL XiaoWei", "ZCOOL KuaiLe", "Noto Sans SC", sans-serif;

    /* 字体加载状态变量 */
    --font-display: swap;
    --font-loading-opacity: 0.8;
    --font-loaded-opacity: 1;
  }

  /* CSS变量已在独立的主题文件中定义，无需动态生成 */
  /* 浅色主题变量: src/styles/themes/LightTheme.css */
  /* 深色主题变量: src/styles/themes/DarkTheme.css */

  /* 优化字体加载 - 只加载默认字体，其他字体按需加载 */
  @import url('https://fonts.loli.net/css2?family=Ma+Shan+Zheng:wght@400&display=swap'); 
  
  /* 备用字体CDN - 如果主CDN失败时使用 */
  /*@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng:wght@400&display=swap');*/

  /* 基础样式重置 */
  ${resetStyles}

  /* 动画样式 */
  ${animationStyles}

  /* 工具类样式 */
  ${utilityStyles}

  /* 字体类定义 */
  .font-ancient-chinese {
    font-family: var(--font-family-chinese);
  }

  .font-modern-chinese {
    font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "SimHei", sans-serif;
  }

  /* 新增古典字体类 */
  .font-calligraphy {
    font-family: var(--font-family-calligraphy);
  }

  .font-decorative {
    font-family: var(--font-family-decorative);
  }

  .font-poetry {
    font-family: "Ma Shan Zheng", "Noto Serif SC", "STKaiti", "KaiTi", serif;
    letter-spacing: 0.1em;
    line-height: 1.8;
  }

  .font-cursive {
    font-family: "Liu Jian Mao Cao", "Ma Shan Zheng", "STKaiti", cursive;
    letter-spacing: 0.02em;
  }

  /* 独立字体类 - 与FontConfig.ts中的配置对应 */
  .font-kangxi {
    font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', serif;
    font-weight: 500;
    letter-spacing: 0.05em;
    line-height: 1.8;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-songti {
    font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', serif;
    font-weight: 400;
    letter-spacing: 0.02em;
    line-height: 1.7;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-kaiti {
    font-family: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', serif;
    font-weight: 400;
    letter-spacing: 0.08em;
    line-height: 1.9;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-fangsong {
    font-family: 'ZCOOL XiaoWei', 'STFangsong', 'FangSong', 'SimSun', serif;
    font-weight: 400;
    letter-spacing: 0.06em;
    line-height: 1.8;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-lishu {
    font-family: 'Liu Jian Mao Cao', 'STLiti', 'LiSu', 'SimLi', serif;
    font-weight: 400;
    letter-spacing: 0.1em;
    line-height: 2.0;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-decorative {
    font-family: 'ZCOOL KuaiLe', 'ZCOOL XiaoWei', 'Noto Sans SC', sans-serif;
    font-weight: 400;
    letter-spacing: 0.04em;
    line-height: 1.7;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-hanyi-shangwei {
    font-family: 'HYShangWeiShouShuW', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', serif;
    font-weight: 400;
    letter-spacing: 0.06em;
    line-height: 1.8;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-english {
    font-family: var(--font-family-english);
  }

  .font-mixed {
    font-family: var(--font-family-primary);
  }

  /* 字体大小和行高优化 */
  .font-size-small {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .font-size-normal {
    font-size: 1rem;
    line-height: 1.6;
  }

  .font-size-large {
    font-size: 1.125rem;
    line-height: 1.7;
  }

  .font-size-xlarge {
    font-size: 1.25rem;
    line-height: 1.8;
  }

  /* 中文字体优化 */
  .chinese-text {
    font-family: var(--font-family-chinese);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 英文字体优化 */
  .english-text {
    font-family: var(--font-family-english);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
    font-family: var(--font-family-primary);
    color: var(--color-text-primary);
    background-color: var(--color-surface);
    letter-spacing: 0.02em;
    word-break: break-word; /* 改为break-word，避免强制断行 */
    transition: color 0.3s ease, background-color 0.3s ease, filter 0.3s ease, font-family 0.3s ease;

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

    /* 浅色主题下的背景滤镜 - 使其更亮 */
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
      /* 浅色主题滤镜 - 卡通风格蓝色调 */

      filter: sepia(0.2) hue-rotate(200deg) saturate(1.2) brightness(1.1);
      pointer-events: none;
      z-index: -1;
      transition: filter 0.3s ease;
    }

    /* 隐藏原始背景图，使用伪元素的滤镜版本 */
    background-image: none;
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
      /* 深色主题滤镜 - 卡通风格深蓝色调 */
      filter: invert(1) hue-rotate(220deg) saturate(0.8) brightness(0.7) contrast(1.1);
      pointer-events: none;
      z-index: -1;
      transition: filter 0.3s ease;
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
      /* 链接图标颜色调整 - 适配卡通风格主题 */
      filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(200deg) brightness(103%) contrast(101%);
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
      color: var(--color-link-primary, #74b9ff) !important;
    }

    &:visited {
      color: var(--color-link-visited, #b2bec3) !important;
    }

    &:hover {
      color: var(--color-link-hover, #fd79a8) !important;
    }

    &:active {
      color: var(--color-link-active, #74b9ff) !important;
    }
  }

  /* 深色模式下的普通链接颜色优化 */
  [data-theme="dark"] a.no-link-icon {
    &:link {
      color: var(--color-link-primary, #74b9ff) !important;
    }

    &:visited {
      color: var(--color-link-visited, #b2bec3) !important;
    }

    &:hover {
      color: var(--color-link-hover, #fd79a8) !important;
    }

    &:active {
      color: var(--color-link-active, #74b9ff) !important;
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

  .development-notice {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transform: translateY( '-100%'});
    transition: transform 0.3s ease-in-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }
`;

export default GlobalStyle;
