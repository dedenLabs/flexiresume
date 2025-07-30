/**
 * 工具类样式
 * 
 * 提供常用的工具类样式
 * 
 * @author 陈剑
 * @date 2025-01-28
 */

import { css } from 'styled-components';

export const utilityStyles = css`
  /* 显示/隐藏工具类 */
  .hidden {
    display: none !important;
  }

  .invisible {
    visibility: hidden !important;
  }

  .visible {
    visibility: visible !important;
  }

  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  /* 定位工具类 */
  .relative {
    position: relative !important;
  }

  .absolute {
    position: absolute !important;
  }

  .fixed {
    position: fixed !important;
  }

  .sticky {
    position: sticky !important;
  }

  /* Flexbox工具类 */
  .flex {
    display: flex !important;
  }

  .inline-flex {
    display: inline-flex !important;
  }

  .flex-col {
    flex-direction: column !important;
  }

  .flex-row {
    flex-direction: row !important;
  }

  .flex-wrap {
    flex-wrap: wrap !important;
  }

  .flex-nowrap {
    flex-wrap: nowrap !important;
  }

  .items-center {
    align-items: center !important;
  }

  .items-start {
    align-items: flex-start !important;
  }

  .items-end {
    align-items: flex-end !important;
  }

  .items-stretch {
    align-items: stretch !important;
  }

  .justify-center {
    justify-content: center !important;
  }

  .justify-start {
    justify-content: flex-start !important;
  }

  .justify-end {
    justify-content: flex-end !important;
  }

  .justify-between {
    justify-content: space-between !important;
  }

  .justify-around {
    justify-content: space-around !important;
  }

  .justify-evenly {
    justify-content: space-evenly !important;
  }

  .flex-1 {
    flex: 1 1 0% !important;
  }

  .flex-auto {
    flex: 1 1 auto !important;
  }

  .flex-none {
    flex: none !important;
  }

  /* Grid工具类 */
  .grid {
    display: grid !important;
  }

  .inline-grid {
    display: inline-grid !important;
  }

  /* 文本对齐工具类 */
  .text-left {
    text-align: left !important;
  }

  .text-center {
    text-align: center !important;
  }

  .text-right {
    text-align: right !important;
  }

  .text-justify {
    text-align: justify !important;
  }

  /* 文本截断工具类 */
  .truncate {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .text-ellipsis {
    text-overflow: ellipsis !important;
  }

  .text-clip {
    text-overflow: clip !important;
  }

  /* 溢出处理工具类 */
  .overflow-auto {
    overflow: auto !important;
  }

  .overflow-hidden {
    overflow: hidden !important;
  }

  .overflow-visible {
    overflow: visible !important;
  }

  .overflow-scroll {
    overflow: scroll !important;
  }

  .overflow-x-auto {
    overflow-x: auto !important;
  }

  .overflow-y-auto {
    overflow-y: auto !important;
  }

  .overflow-x-hidden {
    overflow-x: hidden !important;
  }

  .overflow-y-hidden {
    overflow-y: hidden !important;
  }

  /* 宽度工具类 */
  .w-full {
    width: 100% !important;
  }

  .w-auto {
    width: auto !important;
  }

  .w-fit {
    width: fit-content !important;
  }

  .w-screen {
    width: 100vw !important;
  }

  /* 高度工具类 */
  .h-full {
    height: 100% !important;
  }

  .h-auto {
    height: auto !important;
  }

  .h-fit {
    height: fit-content !important;
  }

  .h-screen {
    height: 100vh !important;
  }

  /* 边距工具类 */
  .m-0 {
    margin: 0 !important;
  }

  .m-auto {
    margin: auto !important;
  }

  .mx-auto {
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .my-auto {
    margin-top: auto !important;
    margin-bottom: auto !important;
  }

  /* 内边距工具类 */
  .p-0 {
    padding: 0 !important;
  }

  /* 圆角工具类 */
  .rounded-none {
    border-radius: 0 !important;
  }

  .rounded-sm {
    border-radius: 4px !important;
  }

  .rounded {
    border-radius: 8px !important;
  }

  .rounded-lg {
    border-radius: 12px !important;
  }

  .rounded-xl {
    border-radius: 16px !important;
  }

  .rounded-full {
    border-radius: 50% !important;
  }

  /* 阴影工具类 */
  .shadow-none {
    box-shadow: none !important;
  }

  .shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  }

  .shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  }

  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  }

  .shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
  }

  /* 光标工具类 */
  .cursor-auto {
    cursor: auto !important;
  }

  .cursor-default {
    cursor: default !important;
  }

  .cursor-pointer {
    cursor: pointer !important;
  }

  .cursor-wait {
    cursor: wait !important;
  }

  .cursor-text {
    cursor: text !important;
  }

  .cursor-move {
    cursor: move !important;
  }

  .cursor-help {
    cursor: help !important;
  }

  .cursor-not-allowed {
    cursor: not-allowed !important;
  }

  /* 用户选择工具类 */
  .select-none {
    user-select: none !important;
  }

  .select-text {
    user-select: text !important;
  }

  .select-all {
    user-select: all !important;
  }

  .select-auto {
    user-select: auto !important;
  }

  /* 指针事件工具类 */
  .pointer-events-none {
    pointer-events: none !important;
  }

  .pointer-events-auto {
    pointer-events: auto !important;
  }

  /* 响应式隐藏工具类 */
  @media (max-width: 768px) {
    .hidden-mobile {
      display: none !important;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .hidden-tablet {
      display: none !important;
    }
  }

  @media (min-width: 1024px) {
    .hidden-desktop {
      display: none !important;
    }
  }

  @media (max-width: 1024px) {
    .hidden-mobile-tablet {
      display: none !important;
    }
  }
`;
