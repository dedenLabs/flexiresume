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
import debug from 'debug';

// Debug logger
const debugPDF = debug('app:pdf');

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
  background: ${props => props.isDark ? 'rgba(45, 55, 72, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${props => props.isDark ? 'rgba(74, 85, 104, 0.6)' : '#e0e0e0'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.isDark ? '#e2e8f0' : '#333'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.isDark ? 'rgba(45, 55, 72, 1)' : 'rgba(255, 255, 255, 1)'};
    border-color: ${props => props.isDark ? '#4a9eff' : '#3498db'};
    box-shadow: 0 2px 8px ${props => props.isDark ? 'rgba(74, 158, 255, 0.3)' : 'rgba(52, 152, 219, 0.2)'};
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
  background: ${props => props.isDark ? 'rgba(26, 32, 44, 0.95)' : 'white'};
  border: 1px solid ${props => props.isDark ? 'rgba(45, 55, 72, 0.8)' : '#e0e0e0'};
  border-radius: 6px;
  box-shadow: 0 -4px 12px ${props => props.isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
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
  color: ${props => props.isDark ? '#e2e8f0' : '#333'};
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
    background: ${props => props.isDark ? 'rgba(45, 55, 72, 0.8)' : '#f8f9fa'};
    color: ${props => props.isDark ? '#4a9eff' : '#3498db'};
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
      console.log('已禁用深色模式背景滤镜');
    } else {
      console.log('已恢复深色模式背景滤镜');
    }
  }


  const generatePDF = async (colorMode: 'color' | 'grayscale' | 'original') => {
    if (isGenerating) return; 
    // console.log('isDarkTheme:'+isDarkTheme)
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
        '.floating-panel'
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

            /* 深色模式特殊处理 */
            [data-theme="dark"] {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            [data-theme="dark"] body {
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

            /* 确保resume-content保持深色背景 - 最高优先级 */
            [data-theme="dark"] [data-testid="resume-content"] {
              background: var(--color-card) !important;
              background-color: #2d3748 !important;
              color: var(--color-text-primary) !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
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
