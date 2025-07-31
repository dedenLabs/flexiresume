/**
 * PDF下载组件
 * 
 * 提供简历的PDF下载功能，支持黑白和彩色两种模式
 * 
 * @author AI Assistant
 * @date 2024-12-21
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme';
import { useI18n } from '../i18n';
import { getLogger } from '../utils/Logger';

const logPDFDownloader = getLogger('PDFDownloader');
const debugPDF = getLogger('pdf');

var isDarkTheme = false;
/**
 * 打印样式控制工具
 */
class PrintStyleController {
  private static instance: PrintStyleController;
  private isActivated = false;

  static getInstance(): PrintStyleController {
    if (!PrintStyleController.instance) {
      PrintStyleController.instance = new PrintStyleController();
    }
    return PrintStyleController.instance;
  }

  /**
   * 激活打印样式
   * @param mode 打印模式：'standard' | 'original'
   */
  activatePrintStyle(mode: 'standard' | 'original' = 'standard'): void {
    debugPDF(`激活打印样式，模式: ${mode}`);

    if (mode === 'standard') {
      // 标准模式：激活全局打印样式
      document.body.classList.add('print-mode-active');
      this.isActivated = true;
      debugPDF('已激活标准打印样式');
    } else {
      // 原版模式：不激活全局打印样式
      document.body.classList.remove('print-mode-active');
      this.isActivated = false;
      debugPDF('原版模式：未激活全局打印样式');
    }
  }

  /**
   * 取消激活打印样式
   */
  deactivatePrintStyle(): void {
    debugPDF('取消激活打印样式');
    document.body.classList.remove('print-mode-active');
    this.isActivated = false;
  }

  /**
   * 检查打印样式是否已激活
   */
  isStyleActivated(): boolean {
    return this.isActivated;
  }
}

// 全局打印样式控制器实例
const printStyleController = PrintStyleController.getInstance();

const DownloaderContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DownloaderButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.isDark ? 'var(--color-surface)' : 'var(--color-card)'};
  border: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : 'var(--color-border-light)'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.isDark ? 'var(--color-text-primary)' : 'var(--color-text-primary)'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: var(--color-card);
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px var(--color-shadow-medium);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PDFIcon = styled.span`
  font-size: 16px;
  line-height: 1;
`;

const PDFText = styled.span`
  font-weight: 500;
`;

const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== 'isDark',
}) <{ isOpen: boolean; isDark: boolean }>`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  box-shadow: 0 -4px 12px var(--color-shadow-medium);
  backdrop-filter: blur(10px);
  z-index: 1000;
  min-width: 160px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.3s ease;
`;

const DropdownItem = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
}) <{ isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 0 0 6px 6px;
  }

  &:last-child {
    border-radius: 6px 6px 0 0;
  }

  &:only-child {
    border-radius: 6px;
  }

  &:hover {
    background: var(--color-card);
    color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface PDFDownloaderProps {
  className?: string;
}

const PDFDownloader: React.FC<PDFDownloaderProps> = ({ className }) => {
  const { isDark } = useTheme();
  isDarkTheme = isDark;
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-pdf-downloader]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // 监听键盘快捷键 Ctrl+P，激活标准打印样式
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'p') {
        debugPDF('检测到Ctrl+P快捷键，激活标准打印样式');
        printStyleController.activatePrintStyle('standard');

        // 监听打印对话框关闭，然后清理样式
        const handleAfterPrint = () => {
          debugPDF('打印对话框关闭，清理打印样式');
          printStyleController.deactivatePrintStyle();
          window.removeEventListener('afterprint', handleAfterPrint);
        };

        window.addEventListener('afterprint', handleAfterPrint);

        // 备用清理机制：5秒后自动清理
        setTimeout(() => {
          if (printStyleController.isStyleActivated()) {
            debugPDF('备用清理：5秒后自动清理打印样式');
            printStyleController.deactivatePrintStyle();
          }
        }, 5000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  /**
   * 动态设置深色模式背景滤镜
   * @param {boolean} disable - 是否禁用滤镜
   */
  function setDarkModeFilter(disable = true) {
    const styleId = 'dark-filter-override';

    // 移除现有样式
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    if (disable) {
      // 创建新样式来禁用滤镜
      const style = document.createElement('style');
      style.id = styleId;
      style.type = 'text/css';
      style.textContent = `
            [data-theme="dark"] body::before {
                filter: none !important;
                -webkit-filter: none !important;
            }
        `;
      document.head.appendChild(style);
      logPDFDownloader('已禁用深色模式背景滤镜');
    } else {
      logPDFDownloader('已恢复深色模式背景滤镜');
    }
  }


  const generatePDF = async (colorMode: 'color' | 'grayscale' | 'original') => {
    if (isGenerating) return; 
    // logPDFDownloader('isDarkTheme:'+isDarkTheme)
    setIsGenerating(true);
    setIsOpen(false);

    try {
      debugPDF(`开始生成${colorMode === 'color' ? '彩色' : colorMode === 'grayscale' ? '黑白' : '原版'}PDF`);

      // 根据模式控制打印样式
      if (colorMode === 'original') {
        // 原版模式：不激活全局打印样式
        printStyleController.activatePrintStyle('original');
        debugPDF('原版模式：保持在线显示样式');
      } else {
        // 彩色和黑白模式：激活全局打印样式
        printStyleController.activatePrintStyle('standard');
        setDarkModeFilter(true);  // 禁用滤镜
        debugPDF(`${colorMode}模式：激活标准打印样式`);
      }

      // 获取当前页面内容
      const printContent = document.body.cloneNode(true) as HTMLElement;

      // 移除控制面板等不需要的元素
      const elementsToRemove = [
        '[data-testid="control-panel"]',
        '[data-pdf-downloader]',
        '.control-panel',
        '.floating-panel',
        '[data-testid="font-performance-monitor"]',
        '.font-performance-monitor'
      ];

      elementsToRemove.forEach(selector => {
        const elements = printContent.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // 直接在当前页面打印，不创建新窗口
      debugPDF('准备在当前页面打印，不创建新窗口');

      // 创建临时打印样式
      const printStyleId = 'temp-pdf-print-style';
      let existingStyle = document.getElementById(printStyleId);
      if (existingStyle) {
        existingStyle.remove();
      }

      const printStyle = document.createElement('style');
      printStyle.id = printStyleId;
      printStyle.type = 'text/css';

      // 根据模式生成PDF专用样式
      const pdfStyles = colorMode === 'original' ?
        // 原版模式：完全保持在线显示效果，包括深色模式
        `
          @media print {
            /* 基础打印设置 */
            @page {
              size: A4;
              margin: 1cm;
              background: ${isDarkTheme ? "#000" : "#fff"};
              background-color: ${isDarkTheme ? "#000" : "#fff"};
              /* 隐藏页眉页脚 */
              @top-left { content: none; }
              @top-center { content: none; }
              @top-right { content: none; }
              @bottom-left { content: none; }
              @bottom-center { content: none; }
              @bottom-right { content: none; }
            }
 

            /* 强制打印背景色 */
            html, body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            /* 强制保持所有原有颜色和样式 - 最高优先级 */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 确保HTML根元素保持主题 */
            html {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 确保body保持背景色 */
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 主题样式统一处理 */
            [data-theme="dark"] {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            [data-theme="light"] {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 深色模式body样式 */
            [data-theme="dark"] body {
              background-color: var(--color-background) !important;
              color: var(--color-text-primary) !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 浅色模式body样式 */
            [data-theme="light"] body {
              background-color: var(--color-background) !important;
              color: var(--color-text-primary) !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 确保深色模式的背景伪元素正确显示 */
            [data-theme="dark"] body::before {
              content: "" !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background-color: var(--color-background) !important;
              background-image: var(--background-image) !important;
              background-repeat: repeat !important;
              background-size: 180px !important;
              filter: var(--filter-background-dark) !important;
              z-index: -1 !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 保持所有元素的原有样式 */
            [data-theme="dark"] * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 确保resume-content保持主题样式 - 使用CSS变量 */
            [data-theme="dark"] [data-testid="resume-content"] {
              background: var(--color-card) !important;
              background-color: var(--color-card) !important;
              color: var(--color-text-primary) !important;
              border: var(--border-card) !important;
              box-shadow: var(--shadow-card) !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 确保浅色模式也使用主题样式 */
            [data-theme="light"] [data-testid="resume-content"] {
              background: var(--color-card) !important;
              background-color: var(--color-card) !important;
              color: var(--color-text-primary) !important;
              border: var(--border-card) !important;
              box-shadow: var(--shadow-card) !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 确保所有主题相关元素使用CSS变量 */
            * {
              color: var(--color-text-primary) !important;
              background-color: var(--color-background) !important;
              border-color: var(--color-border-light) !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* 卡片元素使用卡片主题 */
            .card, .resume-card, [class*="card"], [class*="Card"] {
              background: var(--color-card) !important;
              background-color: var(--color-card) !important;
              color: var(--color-text-primary) !important;
              border: var(--border-card) !important;
              box-shadow: var(--shadow-card) !important;
            }

            /* 表面元素使用表面主题 */
            .surface, [class*="surface"], [class*="Surface"] {
              background: var(--color-surface) !important;
              background-color: var(--color-surface) !important;
              color: var(--color-text-primary) !important;
            }

            /* 链接元素使用主题颜色 */
            a, [class*="link"], [class*="Link"] {
              color: var(--color-primary) !important;
            }

            /* 标题元素使用主题颜色 */
            h1, h2, h3, h4, h5, h6 {
              color: var(--color-text-primary) !important;
            }

            /* 只隐藏不需要的元素，不改变任何颜色和样式 */
            .no-print,
            .print-hide,
            .control-panel,
            .floating-controls,
            nav,
            .navigation,
            .tabs,
            .tab-container,
            button:not(.skill-item):not([class*="skill"]),
            [data-testid="control-panel"],
            [data-testid="development-notice"],
            [data-pdf-downloader],
            .pdf-downloader,
            .control-button,
            .floating-button,
            [class*="control"]:not(.skill-item),
            [class*="floating"]:not(.skill-item),
            [class*="button"]:not(.skill-item),
            .fixed,
            .absolute {
              display: none !important;
            }

            /* 确保技能标签正常显示 */
            .skill-item,
            [class*="skill"],
            [class*="Skill"],
            span[title*="了解"],
            span[title*="熟练"],
            span[title*="精通"],
            span[title*="Basic"],
            span[title*="Proficient"],
            span[title*="Expert"],
            span[title*="Familiar"],
            span[title*="Experienced"],
            span[title*="Advanced"] {
              display: inline-flex !important;
              visibility: visible !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        ` :
        // 标准模式（彩色/黑白）：激活全局打印样式并添加特定设置
        `
          @media print {
            /* 确保激活全局打印样式 */
            body.print-mode-active {
              /* 页面设置 */
              @page {
                size: A4;
                margin: 1cm;  
                /* 隐藏页眉页脚 */
                @top-left { content: none; }
                @top-center { content: none; }
                @top-right { content: none; }
                @bottom-left { content: none; }
                @bottom-center { content: none; }
                @bottom-right { content: none; }
              }

              /* 强制重置深色模式下的所有滤镜效果 */
              [data-theme="dark"] body::before { 
                filter: none !important;
                -webkit-filter: none !important;
              }

              /* 重置根元素和主要容器的背景 */
              html, body, #root {
                background: white !important;
                background-color: white !important;
                color: black !important;
                filter: none !important;
                -webkit-filter: none !important;    
              }

              /* 确保简历内容区域有白色背景 */
              [data-testid="resume-content"],
              .resume-content,
              .main-content {
                background: white !important;
                background-color: white !important;
                color: black !important;
                filter: none !important;
                -webkit-filter: none !important;    
              }


              /* 重置根元素和body */
              html, body {
                width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 20px !important;
                background: white !important;
                background-image: none !important;
                overflow: visible !important;
                font-size: 12pt !important;
                line-height: 1.4 !important;
                color: black !important;  
                filter: none !important;
                -webkit-filter: none !important;                  
              }

              /* 隐藏深色模式背景伪元素 */
              [data-theme="dark"] body::before {
                display: none !important;
                filter: none !important;
                -webkit-filter: none !important;    
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

              /* 隐藏不需要打印的元素 - 扩展选择器 */
              .no-print,
              .print-hide,
              button:not(.skill-item):not([class*="skill"]),
              .control-panel,
              .floating-controls,
              .floating-button,
              .control-button,
              nav,
              .navigation,
              .tabs,
              .tab-container,
              [data-testid="control-panel"],
              [data-testid="development-notice"],
              [data-pdf-downloader],
              .pdf-downloader,
              [class*="control"]:not(.skill-item):not(.category-item),
              [class*="floating"]:not(.skill-item):not(.category-item),
              [class*="button"]:not(.skill-item):not(.category-item),
              [class*="Panel"],
              [class*="Switcher"],
              [class*="Downloader"],
              .fixed,
              .absolute {
                display: none !important;
                visibility: hidden !important;
              }

              /* 确保文本内容为黑色，但保持透明背景 */
              p, h1, h2, h3, h4, h5, h6, li, td, th, span:not(.skill-item span), div:not(.skill-item) {
                color: black !important;
                /* 不强制设置背景色，保持透明 */
              }

              /* 保留技能标签的样式和颜色 */
              .skill-item,
              [class*="skill"],
              [class*="Skill"],
              span[title*="了解"],
              span[title*="熟练"],
              span[title*="精通"],
              span[title*="Basic"],
              span[title*="Proficient"],
              span[title*="Expert"],
              span[title*="Familiar"],
              span[title*="Experienced"],
              span[title*="Advanced"] {
                background: initial !important;
                color: initial !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* 技能标签内的文字保持渐变色 */
              .skill-item span,
              [class*="skill"] span,
              [class*="Skill"] span {
                background-clip: text !important;
                -webkit-background-clip: text !important;
                color: transparent !important;
                background-image: inherit !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
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

              /* 黑白模式特殊处理 */
              ${colorMode === 'grayscale' ? `
                * {
                  filter: grayscale(100%) !important;
                  -webkit-filter: grayscale(100%) !important;
                }
              ` : ``}
              /* 强制重置深色模式下的所有滤镜效果 */
                [data-theme="dark"] * {
                  filter: none !important;
                  -webkit-filter: none !important;
                }
            }

            /* 调试信息 */
            .pdf-debug-info {
              position: fixed;
              top: 10px;
              right: 10px;
              background: rgba(255,255,255,0.9) !important;
              color: blue !important;
              padding: 5px !important;
              border: 2px solid blue !important;
              z-index: 9999 !important;
              font-size: 14px !important;
              font-weight: bold !important;
            }
          }
        `;

      printStyle.textContent = pdfStyles;
      document.head.appendChild(printStyle);
      // return;
      // 等待样式应用
      await new Promise(resolve => setTimeout(resolve, 300));

      // // 浏览器兼容性检测和处理
      // const userAgent = navigator.userAgent;
      // const isChrome = userAgent.includes('Chrome');
      // const isFirefox = userAgent.includes('Firefox');
      // const isEdge = userAgent.includes('Edge') || userAgent.includes('Edg/');
      // const isSafari = userAgent.includes('Safari') && !isChrome && !isEdge;
      // const isProduction = window.location.hostname !== 'localhost' &&
      //                     window.location.hostname !== '127.0.0.1' &&
      //                     !window.location.hostname.includes('dev');

      // debugPDF(`浏览器检测: Chrome=${isChrome}, Firefox=${isFirefox}, Edge=${isEdge}, Safari=${isSafari}, Production=${isProduction}`);

      // // 原版PDF的兼容性处理
      // if (colorMode === 'original') {
      //   debugPDF('原版PDF模式：应用兼容性处理');

      //   // 通用兼容性处理：确保控制面板隐藏
      //   if (isProduction || isChrome || isEdge) {
      //     debugPDF('生产环境或Chrome/Edge浏览器：强制隐藏控制面板');
        
      //   // 方法1：直接隐藏控制面板元素
      //   const controlPanelSelectors = [
      //     '[data-testid="control-panel"]',
      //     '.control-panel',
      //     '.floating-panel',
      //     '[data-pdf-downloader]',
      //     '.pdf-downloader',
      //     '[data-testid="font-performance-monitor"]',
      //     '.font-performance-monitor',
      //     '.fixed',
      //     '.absolute'
      //   ];
        
      //   controlPanelSelectors.forEach(selector => {
      //     const elements = document.querySelectorAll(selector);
      //     elements.forEach(el => {
      //       const element = el as HTMLElement;
      //       element.style.cssText += `
      //         display: none !important;
      //         visibility: hidden !important;
      //         opacity: 0 !important;
      //         position: absolute !important;
      //         left: -9999px !important;
      //         top: -9999px !important;
      //         width: 0 !important;
      //         height: 0 !important;
      //         overflow: hidden !important;
      //         z-index: -9999 !important;
      //       `;
      //     });
      //   });

      //   // 浏览器特定的兼容性处理
      //   if (isChrome) {
      //     debugPDF('Chrome浏览器：应用Chrome特定兼容性处理');
      //     // Chrome特定的样式修复
      //     const chromeFixStyle = document.createElement('style');
      //     chromeFixStyle.id = 'chrome-original-pdf-fix';
      //     chromeFixStyle.textContent = `
      //       @media print {
      //         /* Chrome原版PDF特定修复 */
      //         body {
      //           -webkit-print-color-adjust: exact !important;
      //           print-color-adjust: exact !important;
      //         }

      //         /* 确保主题变量在Chrome中正确应用 */
      //         :root {
      //           color-scheme: ${isDark ? 'dark' : 'light'} !important;
      //         }

      //         /* Chrome中的背景图片处理 */
      //         [data-theme="dark"] body::before {
      //           -webkit-print-color-adjust: exact !important;
      //           print-color-adjust: exact !important;
      //         }
      //       }
      //     `;
      //     document.head.appendChild(chromeFixStyle);
      //   }

      //   if (isFirefox) {
      //     debugPDF('Firefox浏览器：应用Firefox特定兼容性处理');
      //     // Firefox特定的样式修复
      //     const firefoxFixStyle = document.createElement('style');
      //     firefoxFixStyle.id = 'firefox-original-pdf-fix';
      //     firefoxFixStyle.textContent = `
      //       @media print {
      //         /* Firefox原版PDF特定修复 */
      //         body {
      //           color-adjust: exact !important;
      //         }

      //         /* Firefox中的CSS变量处理 */
      //         * {
      //           color-adjust: exact !important;
      //         }
      //       }
      //     `;
      //     document.head.appendChild(firefoxFixStyle);
      //   }

      //   if (isEdge) {
      //     debugPDF('Edge浏览器：应用Edge特定兼容性处理');
      //     // Edge特定的样式修复
      //     const edgeFixStyle = document.createElement('style');
      //     edgeFixStyle.id = 'edge-original-pdf-fix';
      //     edgeFixStyle.textContent = `
      //       @media print {
      //         /* Edge原版PDF特定修复 */
      //         body {
      //           -webkit-print-color-adjust: exact !important;
      //           print-color-adjust: exact !important;
      //           color-adjust: exact !important;
      //         }
      //       }
      //     `;
      //     document.head.appendChild(edgeFixStyle);
      //   }

      //   if (isSafari) {
      //     debugPDF('Safari浏览器：应用Safari特定兼容性处理');
      //     // Safari特定的样式修复
      //     const safariFixStyle = document.createElement('style');
      //     safariFixStyle.id = 'safari-original-pdf-fix';
      //     safariFixStyle.textContent = `
      //       @media print {
      //         /* Safari原版PDF特定修复 */
      //         body {
      //           -webkit-print-color-adjust: exact !important;
      //         }

      //         /* Safari中的背景处理 */
      //         [data-theme="dark"] body::before {
      //           -webkit-print-color-adjust: exact !important;
      //         }
      //       }
      //     `;
      //     document.head.appendChild(safariFixStyle);
      //   }

      //   // 等待兼容性样式应用
      //   await new Promise(resolve => setTimeout(resolve, 200));
      //   debugPDF('兼容性处理完成');
      // } else {
      //   debugPDF('本地环境或其他浏览器：跳过特殊兼容性处理');
      // }

      // // 通用兼容性处理：添加打印样式
      // const universalPrintStyle = document.createElement('style');
      // universalPrintStyle.id = 'universal-print-fix-style';
      // universalPrintStyle.type = 'text/css';
      // universalPrintStyle.textContent = `
      //     @media print {
      //       /* 强制隐藏所有控制面板相关元素 */
      //       [data-testid="control-panel"],
      //       .control-panel,
      //       .floating-panel,
      //       [data-pdf-downloader],
      //       .pdf-downloader,
      //       .fixed,
      //       .absolute,
      //       button:not(.skill-item):not([class*="skill"]),
      //       .control-button,
      //       .floating-button,
      //       [class*="control"]:not(.skill-item):not(.category-item),
      //       [class*="floating"]:not(.skill-item):not(.category-item),
      //       [class*="button"]:not(.skill-item):not(.category-item),
      //       [class*="Panel"],
      //       [class*="Switcher"],
      //       [class*="Downloader"] {
      //         display: none !important;
      //         visibility: hidden !important;
      //         opacity: 0 !important;
      //         position: absolute !important;
      //         left: -9999px !important;
      //         top: -9999px !important;
      //         width: 0 !important;
      //         height: 0 !important;
      //         overflow: hidden !important;
      //         z-index: -9999 !important;
      //         pointer-events: none !important;
      //       }
            
      //       /* 确保body和html正常显示 */
      //       body, html {
      //         display: block !important;
      //         visibility: visible !important;
      //         opacity: 1 !important;
      //         position: relative !important;
      //         left: auto !important;
      //         top: auto !important;
      //         width: auto !important;
      //         height: auto !important;
      //         overflow: visible !important;
      //         z-index: auto !important;
      //       }

      //       /* 跨浏览器兼容性：颜色打印支持 */
      //       * {
      //         -webkit-print-color-adjust: exact !important;
      //         print-color-adjust: exact !important;
      //         color-adjust: exact !important;
      //       }

      //       /* 确保主题样式在所有浏览器中正确应用 */
      //       body {
      //         background: var(--color-background) !important;
      //         color: var(--color-text-primary) !important;
      //       }

      //       /* 确保卡片样式在所有浏览器中正确应用 */
      //       [data-testid="resume-content"] {
      //         background: var(--color-card) !important;
      //         color: var(--color-text-primary) !important;
      //         border: var(--border-card) !important;
      //       }

      //       /* 字体性能监控面板隐藏 */
      //       [data-testid="font-performance-monitor"],
      //       .font-performance-monitor {
      //         display: none !important;
      //         visibility: hidden !important;
      //         opacity: 0 !important;
      //       }
            
      //       /* 确保简历内容正常显示 */
      //       [data-testid="resume-content"],
      //       .resume-content,
      //       .main-content {
      //         display: block !important;
      //         visibility: visible !important;
      //         opacity: 1 !important;
      //         position: relative !important;
      //         left: auto !important;
      //         top: auto !important;
      //         width: auto !important;
      //         height: auto !important;
      //         overflow: visible !important;
      //         z-index: auto !important;
      //       }
      //     }
      //   `;
      //   document.head.appendChild(universalPrintStyle);
        
      //   // 等待兼容性样式应用
      //   await new Promise(resolve => setTimeout(resolve, 300));
        
      //   // 方法3：强制重绘，确保样式生效
      //   document.body.style.display = 'none';
      //   document.body.offsetHeight; // 触发重排
      //   document.body.style.display = '';
      // }

      const modeText = colorMode === 'color' ? '彩色版' : colorMode === 'grayscale' ? '黑白版' : '原版';
      debugPDF(`开始打印${modeText}`);

      // 直接在当前页面打印
      window.print();

      setDarkModeFilter(false); // 恢复滤镜

      // 打印完成后清理临时样式
      setTimeout(() => {
        const styleToRemove = document.getElementById(printStyleId);
        if (styleToRemove) {
          styleToRemove.remove();
        }
        debugPDF('已清理临时打印样式');
      }, 1000);

      debugPDF(`${modeText}PDF生成完成`);

    } catch (error) {
      debugPDF('PDF生成失败:', error);
      alert(`${t.common?.pdfGenerationFailed || 'PDF generation failed'}: ${error instanceof Error ? error.message : (t.common?.unknownError || 'Unknown error')}`);
    } finally {
      // 确保清理打印样式
      printStyleController.deactivatePrintStyle();
      setIsGenerating(false);
      setDarkModeFilter(false); // 恢复滤镜
      debugPDF('PDF生成流程结束，已清理打印样式');
    }
  };

  return (
    <DownloaderContainer
      className={className}
      data-testid="pdf-downloader"
      data-pdf-downloader
    >
      <DownloaderButton
        isDark={isDark}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGenerating}
        title={t.common?.downloadPDF || 'Download PDF'}
        aria-label={t.common?.downloadPDF || 'Download PDF'}
      >
        <PDFIcon>
          {isGenerating ? <LoadingSpinner /> : '📄'}
        </PDFIcon>
        <PDFText>
          {isGenerating ? (t.common?.generating || 'Generating...') : 'PDF'}
        </PDFText>
        {!isGenerating && (
          <span style={{
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease',
            fontSize: '12px'
          }}>
            ▲
          </span>
        )}
      </DownloaderButton>

      <DropdownMenu isOpen={isOpen && !isGenerating} isDark={isDark}>
        <DropdownItem
          isDark={isDark}
          onClick={() => generatePDF('original')}
          disabled={isGenerating}
        >
          <span>📱</span>
          <span>{t.common?.originalPDF || 'Original PDF'}</span>
        </DropdownItem>

        <DropdownItem
          isDark={isDark}
          onClick={() => generatePDF('color')}
          disabled={isGenerating}
        >
          <span>🎨</span>
          <span>{t.common?.colorPDF || 'Color PDF'}</span>
        </DropdownItem>

        <DropdownItem
          isDark={isDark}
          onClick={() => generatePDF('grayscale')}
          disabled={isGenerating}
        >
          <span>⚫</span>
          <span>{t.common?.grayscalePDF || 'Grayscale PDF'}</span>
        </DropdownItem>
      </DropdownMenu>
    </DownloaderContainer>
  );
};

export default PDFDownloader;
