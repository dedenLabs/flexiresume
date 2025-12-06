/**
 * Mermaid统一图表组件
 * 整合懒加载和点击放大功能
 * 参考视频懒加载机制，实现可视范围内渲染
 * 解决折叠后再打开无法渲染的问题
 * 支持点击放大和svg-pan-zoom缩放功能 
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSafeTheme } from '../skill/SkillRenderer';
import { libraryPreloader } from '../../utils/LibraryPreloader';
import { getLogger } from '../../utils/Logger';
import { generateUniqueId } from '../../utils/hash';
import { useI18n } from '../../i18n';

const logMermaid = getLogger(`Mermaid`);

interface MermaidLazyChartProps {
    /** Mermaid图表定义 */
    chart: string;
    /** 图表唯一标识 */
    id: string;
    /** 占位符高度 */
    placeholderHeight?: string;
    /** 是否启用点击放大功能 */
    enableZoom?: boolean;
}

/**
 * Mermaid统一图表组件
 * 实现类似视频懒加载的机制：
 * 1. 初始显示占位符
 * 2. 进入可视区域时加载真实图表
 * 3. 支持重新渲染，解决折叠问题
 * 4. 支持点击放大和svg-pan-zoom缩放功能
 */
const MermaidLazyChart: React.FC<MermaidLazyChartProps> = ({
    chart,
    id,
    placeholderHeight = 'auto',
    enableZoom = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const mutationObserverRef = useRef<MutationObserver | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const svgPanZoomInstance = useRef<any>(null);
    const enlargedSvgPanZoomInstance = useRef<any>(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [renderKey, setRenderKey] = useState(0);

    const { isDark } = useSafeTheme();
    const { t } = useI18n();

    // 处理单击放大功能
    const handleClick = useCallback((event: React.MouseEvent) => {
        if (!enableZoom) return;

        logMermaid('🖱️ Mermaid图表被点击');
        event.preventDefault();
        event.stopPropagation();
        setIsZoomed(true);
        document.body.style.overflow = 'hidden';
    }, [enableZoom]);

    // 处理关闭放大视图
    const handleCloseZoom = useCallback(() => {
        if (enlargedSvgPanZoomInstance.current) {
            try {
                enlargedSvgPanZoomInstance.current.destroy();
                enlargedSvgPanZoomInstance.current = null;
            } catch (error) {
                logMermaid('放大视图svg-pan-zoom清理失败:', error);
            }
        }
        setIsZoomed(false);
        document.body.style.overflow = 'auto';
    }, []);


    // 缩放控制函数
    const handleZoomIn = useCallback(() => {
        if (enlargedSvgPanZoomInstance.current) {
            enlargedSvgPanZoomInstance.current.zoomIn();
        }
    }, []);

    const handleZoomOut = useCallback(() => {
        if (enlargedSvgPanZoomInstance.current) {
            enlargedSvgPanZoomInstance.current.zoomOut();
        }
    }, []);

    const handleZoomReset = useCallback(() => {
        if (enlargedSvgPanZoomInstance.current) {
            enlargedSvgPanZoomInstance.current.fit();
            enlargedSvgPanZoomInstance.current.center();
            // 调试日志已移除: console.log('🎯 [DEBUG] 缩放重置完成');
        }
    }, []);

    const handleFitToScreen = useCallback(() => {
        if (enlargedSvgPanZoomInstance.current) {
            enlargedSvgPanZoomInstance.current.fit();
            // 调试日志已移除: console.log('🎯 [DEBUG] 适应屏幕完成');
        }
    }, []);

    const handleCenter = useCallback(() => {
        if (enlargedSvgPanZoomInstance.current) {
            enlargedSvgPanZoomInstance.current.center();
            // 调试日志已移除: console.log('🎯 [DEBUG] 居中显示完成');
        }
    }, []);

    // 修改SVG字符串用于放大视图，确保正确的尺寸和显示
    const modifySvgForEnlargedView = useCallback((svgString: string): string => {
        return svgString;
        if (!svgString) return svgString;

        let modifiedSvg = svgString.replace(
            /<svg([^>]*?)>/i,
            (match, attributes) => {
                // 保留原始的viewBox属性
                const viewBoxMatch = attributes.match(/viewBox\s*=\s*["']([^"']*)["']/i);
                const originalViewBox = viewBoxMatch ? viewBoxMatch[0] : '';

                // 移除现有的height和width属性
                let newAttributes = attributes.replace(/\s*height\s*=\s*["'][^"']*["']/gi, '');
                newAttributes = newAttributes.replace(/\s*width\s*=\s*["'][^"']*["']/gi, '');

                // 为放大视图设置固定尺寸，确保svg-pan-zoom正常工作
                newAttributes += ' width="100%" height="100%" preserveAspectRatio="xMidYMid meet"';

                // 确保viewBox存在
                if (!originalViewBox && !newAttributes.includes('viewBox')) {
                    newAttributes += ' viewBox="0 0 800 600"';
                }

                // 添加样式确保图表在放大视图中正确显示，避免堆叠
                newAttributes += ' style="width: 100%; height: 100%; display: block; background: transparent !important; position: relative; z-index: 1;"';

                return `<svg${newAttributes}>`;
            }
        );

        // 应用主题相关的修改
        return applyThemeToSvg(modifiedSvg);
    }, [isDark]);

    // 应用主题到SVG的通用函数
    const applyThemeToSvg = useCallback((svgString: string): string => {
        if (!svgString) return svgString;

        let modifiedSvg = svgString;

        // 移除SVG内部可能的transform属性
        modifiedSvg = modifiedSvg.replace(/transform\s*=\s*["'][^"']*["']/gi, '');

        // 移除所有白色背景填充，包括各种格式
        modifiedSvg = modifiedSvg.replace(/fill\s*=\s*["']#[fF]{6}["']/gi, 'fill="transparent"');
        modifiedSvg = modifiedSvg.replace(/fill\s*=\s*["']#[fF]{3}["']/gi, 'fill="transparent"');
        modifiedSvg = modifiedSvg.replace(/fill\s*=\s*["']white["']/gi, 'fill="transparent"');
        modifiedSvg = modifiedSvg.replace(/fill\s*=\s*["']#ffffff["']/gi, 'fill="transparent"');
        modifiedSvg = modifiedSvg.replace(/fill\s*=\s*["']#FFFFFF["']/gi, 'fill="transparent"');

        // 移除rect元素的白色背景
        modifiedSvg = modifiedSvg.replace(/<rect([^>]*?)fill\s*=\s*["']#[fF]{6}["']([^>]*?)>/gi, '<rect$1fill="transparent"$2>');
        modifiedSvg = modifiedSvg.replace(/<rect([^>]*?)fill\s*=\s*["']white["']([^>]*?)>/gi, '<rect$1fill="transparent"$2>');

        // 确保文本颜色跟随主题 - 获取实际的CSS变量值
        const getComputedCSSVariable = (varName: string) => {
            if (typeof window !== 'undefined') {
                return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            }
            return '';
        };

        const textColor = getComputedCSSVariable('--color-text-primary') || (isDark ? '#F5DEB3' : '#2F4F4F');
        modifiedSvg = modifiedSvg.replace(/<text([^>]*?)>/gi, (match, attrs) => {
            if (!attrs.includes('fill=')) {
                return `<text${attrs} fill="${textColor}">`;
            }
            return match;
        });

        return modifiedSvg;
    }, [isDark]);

    // 修改SVG字符串，设置透明背景和自适应尺寸，支持主题跟随
    const modifySvgForDisplay = useCallback((svgString: string): string => {
        if (!svgString) return svgString;

        let modifiedSvg = svgString.replace(
            /<svg([^>]*?)>/i,
            (match, attributes) => {
                // 保留原始的viewBox属性，这对于正确显示很重要
                const viewBoxMatch = attributes.match(/viewBox\s*=\s*["']([^"']*)["']/i);
                const originalViewBox = viewBoxMatch ? viewBoxMatch[0] : '';

                // 移除现有的height和width属性
                let newAttributes = attributes.replace(/\s*height\s*=\s*["'][^"']*["']/gi, '');
                newAttributes = newAttributes.replace(/\s*width\s*=\s*["'][^"']*["']/gi, '');

                // 添加响应式属性，保持宽高比
                newAttributes += ' width="100%" height="auto" preserveAspectRatio="xMidYMid meet"';

                // 确保viewBox存在
                if (!originalViewBox && !newAttributes.includes('viewBox')) {
                    newAttributes += ' viewBox="0 0 800 600"';
                }

                // 添加样式确保图表自适应，背景透明，避免堆叠
                newAttributes += ' style="width: 100%; height: auto; display: block; margin: 0; padding: 0; background: transparent !important; max-width: 100%; position: relative; z-index: 1;"';

                return `<svg${newAttributes}>`;
            }
        );

        // 应用主题相关的修改
        return applyThemeToSvg(modifiedSvg);
    }, [isDark]);

    /**
     * 渲染Mermaid图表
     */
    const renderMermaid = useCallback(async () => {
        if (!chart || !chart.trim() || isLoading) return;


        setIsLoading(true);

        try {
            // 动态导入mermaid
            const mermaid = (await import('mermaid')).default;

            // 获取CSS变量的实际值
            const getComputedCSSVariable = (varName: string) => {
                if (typeof window !== 'undefined') {
                    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
                }
                return '';
            };

            // 配置主题
            const theme = isDark ? 'dark' : 'default';
            mermaid.initialize({
                startOnLoad: false,
                theme,
                securityLevel: 'strict', // 使用严格安全级别
                fontFamily: 'var(--font-family-primary)',
                fontSize: 14,
                // 主题变量配置 - 获取实际的CSS变量值
                themeVariables: {
                    primaryColor: getComputedCSSVariable('--color-primary') || (isDark ? '#FFD700' : '#D4AF37'),
                    primaryTextColor: getComputedCSSVariable('--color-text-primary') || (isDark ? '#F5DEB3' : '#2F4F4F'),
                    primaryBorderColor: getComputedCSSVariable('--color-border-medium') || (isDark ? '#696969' : '#DAA520'),
                    lineColor: getComputedCSSVariable('--color-border-dark') || (isDark ? '#8B7D6B' : '#B8860B'),
                    secondaryColor: getComputedCSSVariable('--color-surface') || (isDark ? '#2F2F2F' : '#F5F5DC'),
                    tertiaryColor: getComputedCSSVariable('--color-card') || (isDark ? '#3A3A3A' : '#FFFAF0'),
                    background: 'transparent', // 透明背景
                    mainBkg: 'transparent',
                    secondBkg: getComputedCSSVariable('--color-surface') || (isDark ? '#2F2F2F' : '#F5F5DC'),
                    tertiaryBkg: getComputedCSSVariable('--color-card') || (isDark ? '#3A3A3A' : '#FFFAF0')
                },
                mindmap: {
                    padding: 10,
                    maxNodeSizeX: 200,
                    maxNodeSizeY: 100,
                    useMaxWidth: true
                },
                // 饼图配置 - 确保铺满容器
                pie: {
                    useMaxWidth: true,
                    textPosition: 0.75,
                    titleTopMargin: 25,
                    titleBottomMargin: 25,
                    diagramMarginX: 50,
                    diagramMarginY: 50
                },
                // 雷达图配置 - 确保完整显示
                radar: {
                    useMaxWidth: true,
                    diagramMarginX: 50,
                    diagramMarginY: 50,
                    axisNameFontSize: 12,
                    axisNameFontFamily: 'var(--font-family-primary)',
                    gridLabelFontSize: 10,
                    gridLabelFontFamily: 'var(--font-family-primary)'
                }
            });

            // 生成唯一ID，使用更强的唯一性保证
            // 使用递增计数器避免同一毫秒内的ID冲突
            if (!(window as any).__mermaidIdCounter) {
                (window as any).__mermaidIdCounter = 0;
            }
            const counter = ++(window as any).__mermaidIdCounter;
            const uniqueId = `mermaid-lazy-${counter}`;
            // 渲染图表
            const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);

            setSvg(renderedSvg);
            setIsLoaded(true);
            // logMermaid('🎯 MermaidLazyChart渲染成功:', JSON.stringify({ id, uniqueId, chart: chart.slice(0, 50), chartUID: generateUniqueId(chart), renderedSvgUID: generateUniqueId(renderedSvg) }));
            logMermaid('🎯 MermaidLazyChart渲染成功:', { id, uniqueId });

            // 在下一个tick中初始化svg-pan-zoom和点击事件
            setTimeout(() => {
                if (enableZoom) {
                    addClickEventToSvg();
                }
            }, 100);

        } catch (err) {
            logMermaid('❌ MermaidLazyChart渲染失败:', err);
            setError(`${t.common.renderFailed}: ${err instanceof Error ? err.message : t.common.unknownError}`);
        } finally {
            setIsLoading(false);
        }
    }, [chart, id, isDark, modifySvgForDisplay, enableZoom]);

    // 初始化svg-pan-zoom
    const initializeSvgPanZoom = useCallback(async () => {
        if (!containerRef.current || !enableZoom) return;
        await new Promise((resolve) => requestAnimationFrame(resolve)); // 等待下一帧
        const svgElement = containerRef.current.querySelector('svg');
        if (svgElement && !svgPanZoomInstance.current) {
            try {
                const svgPanZoomModule = await libraryPreloader.getLibrary('svgPanZoom');
                const svgPanZoom = svgPanZoomModule.default || svgPanZoomModule;

                svgPanZoomInstance.current = svgPanZoom(svgElement, {
                    zoomEnabled: true,
                    panEnabled: true,
                    controlIconsEnabled: false,
                    fit: true,
                    center: true,
                    minZoom: 0.1,
                    maxZoom: 10,
                    zoomScaleSensitivity: 0.2,
                    dblClickZoomEnabled: false,
                    mouseWheelZoomEnabled: true,
                    preventMouseEventsDefault: true,
                    onZoom: function () {
                        // 阻止事件冒泡，避免背景页面滚动
                        event?.preventDefault();
                        event?.stopPropagation();
                        return true;
                    },
                    onPan: function () {
                        // 阻止事件冒泡，避免背景页面滚动
                        event?.preventDefault();
                        event?.stopPropagation();
                        return true;
                    }
                });
                logMermaid('✅ svg-pan-zoom 初始化成功');
            } catch (error) {
                logMermaid('svg-pan-zoom 初始化失败:', error);
            }
        }
    }, [enableZoom]);

    // 为SVG添加点击事件
    const addClickEventToSvg = useCallback(() => {
        if (!containerRef.current || !enableZoom) return;

        const svgElement = containerRef.current.querySelector('svg');
        if (svgElement) {
            logMermaid('🔧 为SVG元素添加点击事件监听器');
            const clickHandler = (event: Event) => {
                logMermaid('🖱️ SVG元素直接点击事件触发');
                event.preventDefault();
                event.stopPropagation();
                handleClick(event as any);
            };

            svgElement.addEventListener('click', clickHandler);
            svgElement.style.cursor = 'zoom-in';
            (svgElement as any)._clickHandler = clickHandler;
        }
    }, [enableZoom, handleClick]);

    // 初始化放大视图的svg-pan-zoom
    const initializeEnlargedSvgPanZoom = useCallback(async () => {
        if (!overlayRef.current) return;

        // 等待DOM更新
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const svgElement = overlayRef.current.querySelector('svg');
        if (svgElement && !enlargedSvgPanZoomInstance.current) {
            try {
                // 获取容器尺寸
                const container = overlayRef.current.querySelector('[data-enlarged-container]');
                const containerRect = container?.getBoundingClientRect();

                // 设置SVG尺寸，确保正确显示
                svgElement.style.width = '100%';
                svgElement.style.height = '100%';
                svgElement.style.maxWidth = '100%';
                svgElement.style.maxHeight = '100%';
                svgElement.style.display = 'block';

                // 移除可能的固定尺寸
                svgElement.removeAttribute('width');
                svgElement.removeAttribute('height');

                // 设置viewBox以确保正确缩放
                if (!svgElement.getAttribute('viewBox')) {
                    const bbox = svgElement.getBBox();
                    svgElement.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
                }

                const svgPanZoomModule = await libraryPreloader.getLibrary('svgPanZoom');
                const svgPanZoom = svgPanZoomModule.default || svgPanZoomModule;

                enlargedSvgPanZoomInstance.current = svgPanZoom(svgElement, {
                    zoomEnabled: true,
                    panEnabled: true,
                    controlIconsEnabled: true,
                    fit: true,
                    center: true,
                    minZoom: 0.1,
                    maxZoom: 10,
                    zoomScaleSensitivity: 0.2,
                    dblClickZoomEnabled: false,
                    mouseWheelZoomEnabled: true,
                    preventMouseEventsDefault: true,
                    beforeZoom: function () {
                        return true;
                    },
                    onZoom: function () {
                        logMermaid('🔍 放大视图缩放中');
                        // 阻止事件冒泡，避免背景页面滚动
                        event?.preventDefault();
                        event?.stopPropagation();
                        return true;
                    },
                    onPan: function () {
                        // 阻止事件冒泡，避免背景页面滚动
                        event?.preventDefault();
                        event?.stopPropagation();
                        return true;
                    }
                });

                // 延迟适配，确保容器尺寸已稳定
                setTimeout(() => {
                    if (enlargedSvgPanZoomInstance.current) {
                        enlargedSvgPanZoomInstance.current.fit();
                        enlargedSvgPanZoomInstance.current.center();
                        logMermaid('🎯 放大视图已重新适配和居中');
                    }
                }, 300);

                logMermaid('✅ 放大视图svg-pan-zoom初始化成功');
            } catch (error) {
                logMermaid('❌ 放大视图svg-pan-zoom初始化失败:', error);
            }
        }
    }, []);

    /**
     * 处理可见性变化
     */
    const handleVisibilityChange = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setIsVisible(true);

                // 如果还没有加载过，或者需要重新渲染
                if (!isLoaded || !svg) {
                    logMermaid('🔄 MermaidLazyChart进入可视区域，开始渲染:', { id, isLoaded, hasSvg: !!svg });
                    // 通过状态更新触发重新渲染
                    setRenderKey(prev => prev + 1);
                }

                // 继续观察，以便处理折叠/展开的情况
                // 不停止观察，这样可以处理重复的可见性变化
            } else {
                // 离开可视区域时，可以选择性地清理资源
                logMermaid('👁️ MermaidLazyChart离开可视区域:', { id });
            }
        });
    }, [id, isLoaded, svg]);

    /**
     * 初始化IntersectionObserver
     */
    useEffect(() => {
        if (!containerRef.current) return;

        // 创建观察器
        observerRef.current = new IntersectionObserver(handleVisibilityChange, {
            root: null,
            rootMargin: '100px', // 提前100px开始加载
            threshold: 0.1
        });

        // 开始观察
        observerRef.current.observe(containerRef.current);

        logMermaid('👁️ MermaidLazyChart初始化观察器:', { id });

        // 清理函数
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                logMermaid('🧹 MermaidLazyChart清理观察器:', { id });
            }
        };
    }, [handleVisibilityChange, id]);

    /**
     * 添加 MutationObserver 来检测容器的显示/隐藏状态变化
     * 这对于处理折叠/展开等动态显示变化很有用
     */
    useEffect(() => {
        if (!containerRef.current) return;

        // 创建 MutationObserver 来监听父元素的变化
        mutationObserverRef.current = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target as HTMLElement;
                    const isNowVisible = target.offsetParent !== null;

                    if (isNowVisible && !isVisible && (!isLoaded || !svg)) {
                        logMermaid('🔄 MutationObserver检测到容器重新可见，触发渲染:', { id });
                        setIsVisible(true);
                        // 通过状态更新触发重新渲染，而不是直接调用
                        setRenderKey(prev => prev + 1);
                    }
                }
            });
        });

        // 观察容器及其父元素的属性变化
        let currentElement = containerRef.current.parentElement;
        while (currentElement) {
            mutationObserverRef.current.observe(currentElement, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
            currentElement = currentElement.parentElement;

            // 限制观察层级，避免性能问题
            if (currentElement && currentElement.tagName === 'BODY') break;
        }

        logMermaid('👁️ MermaidLazyChart初始化MutationObserver:', { id });

        return () => {
            if (mutationObserverRef.current) {
                mutationObserverRef.current.disconnect();
                logMermaid('🧹 MermaidLazyChart清理MutationObserver:', { id });
            }
        };
    }, [id, isVisible, isLoaded, svg]);

    // 监听renderKey变化，触发重新渲染
    useEffect(() => {
        if (renderKey > 0 && isVisible && (!isLoaded || !svg)) {
            logMermaid('🔄 renderKey变化，触发重新渲染:', { id, renderKey });
            renderMermaid();
        }
    }, [renderKey, isVisible, isLoaded, svg]);

    // 键盘事件处理 - 增强版
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isZoomed) return;

            // 调试日志已移除: console.log('🎯 [DEBUG] Mermaid放大视图键盘事件:', event.key, {
            //     ctrlKey: event.ctrlKey,
            //     metaKey: event.metaKey
            // });

            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    handleCloseZoom();
                    break;
                case '+':
                case '=':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        handleZoomIn();
                    }
                    break;
                case '-':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        handleZoomOut();
                    }
                    break;
                case '0':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        handleZoomReset();
                    }
                    break;
                case 'f':
                case 'F':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        handleFitToScreen();
                    }
                    break;
                case 'c':
                case 'C':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        handleCenter();
                    }
                    break;
            }
        };

        if (isZoomed) {
            document.addEventListener('keydown', handleKeyDown);
            // 调试日志已移除: console.log('🎯 [DEBUG] Mermaid放大视图键盘监听器已添加');
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (isZoomed) {
                // 调试日志已移除: console.log('🎯 [DEBUG] Mermaid放大视图键盘监听器已移除');
            }
        };
    }, [isZoomed, handleCloseZoom, handleZoomIn, handleZoomOut, handleZoomReset, handleFitToScreen, handleCenter]);

    // 放大视图初始化
    useEffect(() => {
        if (isZoomed && svg) {
            const timer = setTimeout(() => {
                initializeEnlargedSvgPanZoom();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isZoomed, svg, initializeEnlargedSvgPanZoom]);

    /**
     * 监听主题变化，重新渲染
     */
    useEffect(() => {
        // 只有在已经渲染过的情况下才重新渲染
        if (isVisible && isLoaded && svg && !isLoading) {
            logMermaid('🎨 主题变化，重新渲染Mermaid图表:', { id, isDark });
            // 增加渲染键值，触发重新渲染
            setRenderKey(prev => prev + 1);
            // 重置状态
            setIsLoaded(false);
            setSvg('');
            setError('');
        }
    }, [isDark]);

    /**
     * 强制重新渲染
     */
    const forceRerender = useCallback(() => {
        logMermaid('🔄 强制重新渲染MermaidLazyChart:', id);
        setIsLoaded(false);
        setSvg('');
        setError('');
        setIsVisible(false);

        // 重新开始观察
        if (containerRef.current && observerRef.current) {
            observerRef.current.observe(containerRef.current);
        }

        renderMermaid();
    }, [id, renderMermaid]);

    // 暴露重新渲染方法到全局，供外部调用
    useEffect(() => {
        const globalKey = `mermaidLazyChart_${id}`;
        (window as any)[globalKey] = { forceRerender };

        return () => {
            delete (window as any)[globalKey];
        };
    }, [id, forceRerender]);

    /**
     * 定时检查机制 - 作为最后的保障
     * 定期检查容器是否可见但图表未渲染的情况
     */
    useEffect(() => {
        const checkInterval = setInterval(() => {
            if (containerRef.current && containerRef.current.offsetParent !== null) {
                // 容器可见但图表未加载
                if (!isLoaded || !svg) {
                    logMermaid('⏰ 定时检查发现需要渲染:', { id, isLoaded, hasSvg: !!svg });
                    // 通过状态更新触发重新渲染
                    setRenderKey(prev => prev + 1);
                }
            }
        }, 5000); // 每5秒检查一次

        return () => {
            clearInterval(checkInterval);
        };
    }, [id, isLoaded, svg]);

    /**
     * 渲染占位符
     */
    const renderPlaceholder = () => (
        <div
            style={{
                height: placeholderHeight === 'auto' ? '200px' : placeholderHeight,
                minHeight: '200px',
                backgroundColor: 'var(--color-surface)',
                border: `1px solid var(--color-border-light)`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: '14px',
                margin: '20px 0',
                position: 'relative'
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>📊</div>
                <div>{t.common.mindmapLoading}</div>
                {isLoading && (
                    <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        opacity: 0.7
                    }}>
                        {t.common.renderingChart}
                    </div>
                )}
            </div>
        </div>
    );

    /**
     * 渲染错误状态
     */
    const renderError = () => (
        <div
            style={{
                height: placeholderHeight,
                backgroundColor: 'var(--color-status-error)',
                border: `1px solid var(--color-border-medium)`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-inverse)',
                fontSize: '14px',
                margin: '20px 0',
                padding: '20px',
                textAlign: 'center'
            }}
        >
            <div>
                <div style={{ marginBottom: '8px' }}>❌</div>
                <div>{t.common.mindmapRenderFailed}</div>
                <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
                    {error}
                </div>
                <button
                    onClick={forceRerender}
                    style={{
                        marginTop: '12px',
                        padding: '6px 12px',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border-medium)',
                        borderRadius: '4px',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    {t.common.retry}
                </button>
            </div>
        </div>
    );

    /**
     * 渲染成功的图表
     */
    const renderChart = () => (
        <div
            style={{
                textAlign: 'center',
                margin: '20px 0',
                padding: '16px',
                backgroundColor: 'var(--color-card)',
                border: `1px solid var(--color-border-light)`,
                borderRadius: '8px',
                overflow: 'visible',
                boxShadow: 'var(--color-shadow-medium)',
                cursor: enableZoom ? 'zoom-in' : 'default',
                position: 'relative',
                width: '100%',
                // 移除固定高度限制，让内容自适应
                minHeight: 'auto',
                height: 'auto',
                // 改为块级布局，让SVG自然展示
                display: 'block'
            }}
            title={enableZoom ? t.common.clickToEnlarge : ""}
            onClick={enableZoom ? handleClick : undefined}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );

    /**
     * 渲染放大的脑图视图
     */
    const renderEnlargedMindMap = () => {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        return (
            <div
                ref={overlayRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(28, 28, 28, 0.98) 0%, rgba(58, 58, 58, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 248, 220, 0.98) 0%, rgba(255, 250, 240, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-family-primary)',
                    transition: 'all 0.3s var(--easing-ease-out)'
                }}
                onClick={handleCloseZoom}
            >
                {/* 主容器 */}
                <div
                    data-enlarged-container
                    style={{
                        width: '92vw',
                        height: '92vh',
                        maxWidth: '92vw',
                        maxHeight: '92vh',
                        background: isDarkMode ? 'var(--color-card)' : 'var(--color-surface)',
                        borderRadius: 'var(--border-radius-xl)',
                        border: `1px solid ${isDarkMode ? 'var(--color-border-medium)' : 'var(--color-border-light)'}`,
                        boxShadow: isDarkMode
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'all 0.3s var(--easing-ease-out)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 顶部工具栏 */}
                    <div style={{
                        height: '60px',
                        background: isDarkMode ? 'var(--color-surface)' : 'var(--color-card)',
                        borderBottom: `1px solid ${isDarkMode ? 'var(--color-border-medium)' : 'var(--color-border-light)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 var(--spacing-lg)',
                        position: 'relative',
                        zIndex: 10001
                    }}>
                        {/* 左侧标题和操作 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                fontSize: 'var(--font-size-lg)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-text-primary)'
                            }}>
                                <span style={{ fontSize: '20px' }}>🧠</span>
                                <span>{t.common.mindmapViewer}</span>
                            </div>

                            <div style={{
                                height: '24px',
                                width: '1px',
                                background: isDarkMode ? 'var(--color-border-medium)' : 'var(--color-border-light)'
                            }} />

                        </div>

                        {/* 右侧控制按钮 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)'
                        }}>

                            {/* 视图控制按钮组 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                                background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                                padding: '4px',
                                borderRadius: 'var(--border-radius-md)'
                            }}>
                                <button
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: 'var(--border-radius-sm)',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'var(--color-text-primary)',
                                        transition: 'all 0.2s var(--easing-ease-out)'
                                    }}
                                    onClick={handleFitToScreen}
                                    title="适应屏幕 (F)"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(212, 175, 55, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span style={{ fontSize: '14px' }}>⛶</span>
                                </button>

                                <button
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: 'var(--border-radius-sm)',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'var(--color-text-primary)',
                                        transition: 'all 0.2s var(--easing-ease-out)'
                                    }}
                                    onClick={handleCenter}
                                    title="居中显示 (C)"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(212, 175, 55, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span style={{ fontSize: '14px' }}>⊙</span>
                                </button>
                            </div>
                            {/* 关闭按钮 */}
                            <button
                                style={{
                                    background: isDarkMode ? 'var(--color-status-error)' : 'var(--color-status-error)',
                                    border: 'none',
                                    borderRadius: 'var(--border-radius-md)',
                                    width: '36px',
                                    height: '36px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    color: 'white',
                                    transition: 'all 0.2s var(--easing-ease-out)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                                }}
                                onClick={handleCloseZoom}
                                title="关闭 (ESC)"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* 主内容区域 */}
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        background: isDarkMode
                            ? 'linear-gradient(135deg, rgba(47, 47, 47, 0.5) 0%, rgba(58, 58, 58, 0.3) 100%)'
                            : 'linear-gradient(135deg, rgba(245, 245, 220, 0.5) 0%, rgba(255, 250, 240, 0.3) 100%)'
                    }}>
                        {/* 图表内容 */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 'var(--spacing-lg)'
                        }}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}
                                dangerouslySetInnerHTML={{ __html: modifySvgForEnlargedView(svg) }}
                            />
                        </div>

                    </div>

                    {/* 底部信息栏 */}
                    <div style={{
                        height: '48px',
                        background: isDarkMode ? 'var(--color-surface)' : 'var(--color-card)',
                        borderTop: `1px solid ${isDarkMode ? 'var(--color-border-medium)' : 'var(--color-border-light)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 var(--spacing-lg)',
                        position: 'relative',
                        zIndex: 10001
                    }}>
                        {/* 左侧操作提示 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                                padding: '4px 8px',
                                background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 'var(--border-radius-md)'
                            }}>
                                <span>🖱️</span>
                                <span>{t.common.wheelZoom}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                                padding: '4px 8px',
                                background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 'var(--border-radius-md)'
                            }}>
                                <span>✋</span>
                                <span>{t.common.dragPan}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                                padding: '4px 8px',
                                background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 'var(--border-radius-md)'
                            }}>
                                <span>⌨️</span>
                                <span>{t.common.escClose}</span>
                            </div>
                        </div>

                        {/* 右侧状态信息 */}
                        <div style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                            fontStyle: 'italic'
                        }}>
                            {t.common.mindmapExpanded}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div ref={containerRef} data-mermaid-lazy-chart={id}>
                {error ? renderError() :
                    isLoaded && svg ? renderChart() :
                        renderPlaceholder()}
            </div>

            {/* 放大的脑图视图 */}
            {isZoomed && enableZoom && renderEnlargedMindMap()}
        </>
    );
};

export default MermaidLazyChart;
