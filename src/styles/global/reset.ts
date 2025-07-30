/**
 * CSS重置样式
 * 
 * 提供统一的浏览器样式重置
 * 
 * @author 陈剑
 * @date 2025-01-28
 */

import { css } from 'styled-components';

export const resetStyles = css`
  /* CSS重置 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    font-family: Arial, sans-serif, "Microsoft YaHei", "微软雅黑";
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-text-primary);
    background-color: var(--color-background);
    transition: color 0.3s ease, background-color 0.3s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 标题样式重置 */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
    // line-height: 1.25;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }

  /* 段落样式重置 */
  p {
    margin: 0;
    line-height: 1.6;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }

  /* 链接样式重置 */
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--color-accent);
      text-decoration: underline;
    }
  }

  /* 按钮样式重置 */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    transition: all 0.3s ease;
  }

  /* 输入框样式重置 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
    background: transparent;
    transition: all 0.3s ease;
  }

  /* 列表样式重置 */
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* 图片样式重置 */
  img {
    max-width: 100%;
    height: auto;
    // display: block;
  }

  /* 表格样式重置 */
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }

  /* 代码样式重置 */
  code, pre {
    font-family: Consolas, Monaco, "Courier New", monospace;
    font-size: 0.9em;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-surface);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-border-medium);
    border-radius: 4px;
    transition: background 0.3s ease;
    
    &:hover {
      background: var(--color-border-dark);
    }
  }

  /* Firefox滚动条 */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--color-border-medium) var(--color-surface);
  }
`;
