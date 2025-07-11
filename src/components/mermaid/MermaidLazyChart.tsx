/**
 * Mermaid统一图表组件
 * 整合懒加载和点击放大功能
 * 参考视频懒加载机制，实现可视范围内渲染
 * 解决折叠后再打开无法渲染的问题
 * 支持点击放大和svg-pan-zoom缩放功能
 *
 * @author AI Assistant
 * @date 2025-01-09
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSafeTheme } from '../skill/SkillRenderer';
import { getLogger } from '../../utils/Tools';
import { libraryPreloader } from '../../utils/LibraryPreloader';

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
    placeholderHeight = '300px',
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
                console.warn('放大视图svg-pan-zoom清理失败:', error);
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
        }
    }, []);

    // 修改SVG字符串，设置透明背景和100%宽度
    const modifySvgForDisplay = useCallback((svgString: string): string => {
        if (!svgString) return svgString;

        let modifiedSvg = svgString.replace(
            /<svg([^>]*?)>/i,
            (match, attributes) => {
                // 移除现有的height和width属性
                let newAttributes = attributes.replace(/\s*height\s*=\s*["'][^"']*["']/gi, '');
                newAttributes = newAttributes.replace(/\s*width\s*=\s*["'][^"']*["']/gi, '');

                // 添加响应式属性，确保图表完全铺满容器
                newAttributes += ' width="100%" height="100%" preserveAspectRatio="none"';

                // 添加样式确保图表铺满，背景透明
                newAttributes += ' style="width: 100% !important; height: 100% !important; display: block; margin: 0; padding: 0; background: transparent !important; min-width: 100%; min-height: 100%;"';

                return `<svg${newAttributes}>`;
            }
        );

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

        return modifiedSvg;
    }, []);

    /**
     * 渲染Mermaid图表
     */
    const renderMermaid = useCallback(async () => {
        if (!chart || !chart.trim() || isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            // 动态导入mermaid
            const mermaid = (await import('mermaid')).default;
            
            // 配置主题
            const theme = isDark ? 'dark' : 'default';
            mermaid.initialize({
                startOnLoad: false,
                theme,
                securityLevel: 'loose',
                fontFamily: 'Arial, sans-serif, "Microsoft YaHei", "微软雅黑"',
                fontSize: 14,
                mindmap: {
                    padding: 20,
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
                    axisNameFontFamily: 'Arial, sans-serif, "Microsoft YaHei", "微软雅黑"',
                    gridLabelFontSize: 10,
                    gridLabelFontFamily: 'Arial, sans-serif, "Microsoft YaHei", "微软雅黑"'
                }
            });

            // 生成唯一ID
            const uniqueId = `mermaid-lazy-${id}-${Date.now()}`;
            
            // 渲染图表
            const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);

            // 修改SVG以确保正确显示
            const modifiedSvg = modifySvgForDisplay(renderedSvg);
            setSvg(modifiedSvg);
            setIsLoaded(true);

            logMermaid('🎯 MermaidLazyChart渲染成功:', { id, uniqueId, svgLength: renderedSvg.length });

            // 在下一个tick中初始化svg-pan-zoom和点击事件
            setTimeout(() => {
                initializeSvgPanZoom();
                if (enableZoom) {
                    addClickEventToSvg();
                }
            }, 100);
            
        } catch (err) {
            console.error('❌ MermaidLazyChart渲染失败:', err);
            setError(`渲染失败: ${err instanceof Error ? err.message : '未知错误'}`);
        } finally {
            setIsLoading(false);
        }
    }, [chart, id, isDark, isLoading, modifySvgForDisplay, enableZoom]);

    // 初始化svg-pan-zoom
    const initializeSvgPanZoom = useCallback(async () => {
        if (!containerRef.current || !enableZoom) return;

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
                    preventMouseEventsDefault: true
                });
                logMermaid('✅ svg-pan-zoom 初始化成功');
            } catch (error) {
                console.warn('svg-pan-zoom 初始化失败:', error);
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

        const svgElement = overlayRef.current.querySelector('svg');
        if (svgElement && !enlargedSvgPanZoomInstance.current) {
            try {
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
                    preventMouseEventsDefault: true
                });
                logMermaid('✅ 放大视图svg-pan-zoom初始化成功');
            } catch (error) {
                console.warn('放大视图svg-pan-zoom初始化失败:', error);
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
                    console.log('🔄 MermaidLazyChart进入可视区域，开始渲染:', { id, isLoaded, hasSvg: !!svg });
                    renderMermaid();
                }

                // 继续观察，以便处理折叠/展开的情况
                // 不停止观察，这样可以处理重复的可见性变化
            } else {
                // 离开可视区域时，可以选择性地清理资源
                console.log('👁️ MermaidLazyChart离开可视区域:', { id });
            }
        });
    }, [id, isLoaded, svg, renderMermaid]);

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

        console.log('👁️ MermaidLazyChart初始化观察器:', { id });

        // 清理函数
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                console.log('🧹 MermaidLazyChart清理观察器:', { id });
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
                        console.log('🔄 MutationObserver检测到容器重新可见，触发渲染:', { id });
                        setIsVisible(true);
                        renderMermaid();
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

        console.log('👁️ MermaidLazyChart初始化MutationObserver:', { id });

        return () => {
            if (mutationObserverRef.current) {
                mutationObserverRef.current.disconnect();
                console.log('🧹 MermaidLazyChart清理MutationObserver:', { id });
            }
        };
    }, [id, isVisible, isLoaded, svg, renderMermaid]);

    // 键盘事件处理
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isZoomed) {
                handleCloseZoom();
            }
        };

        if (isZoomed) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isZoomed, handleCloseZoom]);

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
        if (isVisible && isLoaded) {
            console.log('🎨 主题变化，重新渲染Mermaid图表:', { id, isDark });
            renderMermaid();
        }
    }, [isDark, isVisible, isLoaded, renderMermaid]);

    /**
     * 强制重新渲染
     */
    const forceRerender = useCallback(() => {
        console.log('🔄 强制重新渲染MermaidLazyChart:', id);
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
                    console.log('⏰ 定时检查发现需要渲染:', { id, isLoaded, hasSvg: !!svg });
                    renderMermaid();
                }
            }
        }, 5000); // 每5秒检查一次

        return () => {
            clearInterval(checkInterval);
        };
    }, [id, isLoaded, svg, renderMermaid]);

    /**
     * 渲染占位符
     */
    const renderPlaceholder = () => (
        <div
            style={{
                height: placeholderHeight,
                backgroundColor: isDark ? '#1f2937' : '#f8f9fa',
                border: `1px solid ${isDark ? '#374151' : '#e1e4e8'}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#9ca3af' : '#6b7280',
                fontSize: '14px',
                margin: '20px 0',
                position: 'relative'
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>📊</div>
                <div>脑图加载中...</div>
                {isLoading && (
                    <div style={{ 
                        marginTop: '8px', 
                        fontSize: '12px',
                        opacity: 0.7 
                    }}>
                        正在渲染图表...
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
                backgroundColor: isDark ? '#1f2937' : '#fff5f5',
                border: `1px solid ${isDark ? '#374151' : '#fed7d7'}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#f87171' : '#e53e3e',
                fontSize: '14px',
                margin: '20px 0',
                padding: '20px',
                textAlign: 'center'
            }}
        >
            <div>
                <div style={{ marginBottom: '8px' }}>❌</div>
                <div>脑图渲染失败</div>
                <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
                    {error}
                </div>
                <button
                    onClick={forceRerender}
                    style={{
                        marginTop: '12px',
                        padding: '6px 12px',
                        backgroundColor: isDark ? '#374151' : '#e2e8f0',
                        border: 'none',
                        borderRadius: '4px',
                        color: isDark ? '#f3f4f6' : '#2d3748',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    重试
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
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e1e4e8'}`,
                borderRadius: '8px',
                overflow: 'visible',
                boxShadow: isDark
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: enableZoom ? 'zoom-in' : 'default',
                position: 'relative',
                minHeight: '300px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            title={enableZoom ? "点击放大查看" : ""}
            onClick={enableZoom ? handleClick : undefined}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );

    return (
        <>
            <div ref={containerRef} data-mermaid-lazy-chart={id}>
                {error ? renderError() :
                 isLoaded && svg ? renderChart() :
                 renderPlaceholder()}
            </div>

            {/* 放大视图遮罩层 */}
            {isZoomed && enableZoom && (
                <div
                    ref={overlayRef}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'move'
                    }}
                    onClick={handleCloseZoom}
                >
                    {/* 放大的图表容器 */}
                    <div
                        style={{
                            width: '95vw',
                            height: '95vh',
                            maxWidth: '95vw',
                            maxHeight: '95vh',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderRadius: '12px',
                            padding: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 关闭按钮 */}
                        <button
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: isDark ? '#374151' : '#f3f4f6',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                color: isDark ? '#d1d5db' : '#374151',
                                zIndex: 10000
                            }}
                            onClick={handleCloseZoom}
                            title="关闭 (ESC)"
                        >
                            ×
                        </button>

                        {/* 缩放控制按钮 */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '50px',
                            display: 'flex',
                            gap: '5px',
                            zIndex: 10000
                        }}>
                            <button
                                style={{
                                    background: isDark ? '#374151' : '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '32px',
                                    height: '32px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    color: isDark ? '#d1d5db' : '#374151'
                                }}
                                onClick={handleZoomIn}
                                title="放大"
                            >
                                +
                            </button>
                            <button
                                style={{
                                    background: isDark ? '#374151' : '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '32px',
                                    height: '32px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    color: isDark ? '#d1d5db' : '#374151'
                                }}
                                onClick={handleZoomOut}
                                title="缩小"
                            >
                                −
                            </button>
                            <button
                                style={{
                                    background: isDark ? '#374151' : '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '32px',
                                    height: '32px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    color: isDark ? '#d1d5db' : '#374151'
                                }}
                                onClick={handleZoomReset}
                                title="重置缩放"
                            >
                                ⌂
                            </button>
                        </div>

                        {/* 图表内容区域 */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <div
                                style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    height: '100%'
                                }}
                                dangerouslySetInnerHTML={{ __html: modifySvgForDisplay(svg) }}
                            />
                        </div>

                        {/* 操作提示 */}
                        <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                        }}>
                            鼠标滚轮缩放 • 拖拽平移 • ESC键或点击背景关闭
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MermaidLazyChart;
