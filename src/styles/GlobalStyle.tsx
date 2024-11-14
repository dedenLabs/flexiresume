import { createGlobalStyle } from 'styled-components'; 
const maxWidth = `${920}px`;
const GlobalStyle = createGlobalStyle` 
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;    
    color: #333;
    letter-spacing: 0.02em; /* 调整为你需要的值 */   
    word-break: break-all;
  }

  /* 针对代码块的样式 */
  pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word; 
      background-color: #f8f8f8; 
      padding: 10px;
      border-radius: 5px; 
      border: 1px solid #ddd;
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 阴影 */
    background-color: #fff; 
    /* 视频的悬浮缩放效果 */ 
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
 
  /* 悬浮效果 */
  .markdown-content video:not(.no-effect-icon):hover,
  .markdown-content img:not(.no-effect-icon):hover{
    transform: scale(1.03); /* 略微放大 */
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* 增强阴影 */
  } 
  
  #root {
    display: flex;  
    justify-content: center; /* 水平居中 */
    @media (max-width: ${maxWidth}) {
      flex-direction: column;  
      align-items: center 
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
    &::before {
      content: '';
      display: inline-block;
      transform: translateY(0.2em);
      width: 1rem; /* 图标宽度 */
      height: 1rem; /* 图标高度 */
      margin-right: 0.4rem; /* 图标和文本的间距 */
      background: url(images/url.svg) no-repeat center;
      background-size: contain; /* 保证图标自适应 */
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

  @media print {
    body {
      background-color: white; 
    }
   
    .print-background {
      position: relative;
    }
  
    .print-background::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: lightgrey;
      z-index: -1;
    }
  } 
`;

export default GlobalStyle;
