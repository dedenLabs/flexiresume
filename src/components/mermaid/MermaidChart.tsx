import React, { useEffect, useRef, useState } from 'react';
import { getLogger } from '../../utils/Tools';
import { libraryPreloader } from '../../utils/LibraryPreloader';
const logMermaid = getLogger(`Mermaid`);
interface MermaidChartProps {
    chart: string;
    id: string;
}

/**
 * 安全地使用主题hook
 * 支持服务器端渲染和客户端渲染
 * 当组件在独立的React根中渲染时，直接从DOM获取主题状态
 */
const useSafeTheme = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // 在服务器端渲染时，返回默认值
        if (typeof window === 'undefined') {
            return;
        }

        // 直接从DOM获取主题状态，不依赖React Context
        const getThemeFromDOM = () => {
            // 方法1: 检查body的data-theme属性
            const bodyTheme = document.body.getAttribute('data-theme');
            if (bodyTheme) {
                return bodyTheme === 'dark';
            }

            // 方法2: 检查html的data-theme属性
            const htmlTheme = document.documentElement.getAttribute('data-theme');
            if (htmlTheme) {
                return htmlTheme === 'dark';
            }

            // 方法3: 检查html的class
            const htmlClasses = document.documentElement.className;
            if (htmlClasses.includes('dark')) {
                return true;
            }
            if (htmlClasses.includes('light')) {
                return false;
            }

            // 方法4: 检查localStorage
            try {
                const storedTheme = localStorage.getItem('theme');
                if (storedTheme) {
                    return storedTheme === 'dark';
                }
            } catch (e) {
                // localStorage可能不可用
            }

            // 方法5: 检查系统偏好
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return true;
            }

            // 默认返回false（浅色主题）
            return false;
        };

        // 初始设置
        setIsDark(getThemeFromDOM());

        // 监听主题变化
        const observer = new MutationObserver(() => {
            setIsDark(getThemeFromDOM());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });

        // 监听localStorage变化
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme') {
                setIsDark(getThemeFromDOM());
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // 清理函数
        return () => {
            observer.disconnect();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return { isDark };
};

/**
 * Mermaid图表组件
 * 支持主题切换和错误处理
 */
const MermaidChart: React.FC<MermaidChartProps> = ({ chart, id }) => {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [renderKey, setRenderKey] = useState<number>(0); // 强制重新渲染的key
    const { isDark } = useSafeTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const svgPanZoomInstance = useRef<any>(null);
    const enlargedSvgPanZoomInstance = useRef<any>(null);

    // 动态加载的库引用
    const mermaidRef = useRef<any>(null);
    const svgPanZoomRef = useRef<any>(null);

    // 处理单击放大功能
    const handleClick = (event: React.MouseEvent) => {
        logMermaid('🖱️ Mermaid图表被点击');
        event.preventDefault();
        event.stopPropagation();
        setIsZoomed(true);
        // 阻止页面滚动
        document.body.style.overflow = 'hidden';
    };

    // 处理关闭放大视图
    const handleCloseZoom = () => {
        // 清理放大视图的svg-pan-zoom实例
        if (enlargedSvgPanZoomInstance.current) {
            try {
                enlargedSvgPanZoomInstance.current.destroy();
                enlargedSvgPanZoomInstance.current = null;
            } catch (error) {
                console.warn('放大视图svg-pan-zoom清理失败:', error);
            }
        }

        setIsZoomed(false);
        // 恢复页面滚动
        document.body.style.overflow = 'auto';
    };

    // 初始化放大视图的svg-pan-zoom
    const initializeEnlargedSvgPanZoom = async () => {
        if (!overlayRef.current) return;

        const svgElement = overlayRef.current.querySelector('svg');
        if (svgElement && !enlargedSvgPanZoomInstance.current) {
            try {
                // 动态加载svg-pan-zoom库
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
                    customEventsHandler: {
                        haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
                        init: function (options) {
                            // 自定义事件处理初始化
                        },
                        destroy: function () {
                            // 自定义事件处理清理
                        }
                    }
                });
                logMermaid('✅ 放大视图svg-pan-zoom初始化成功');
            } catch (error) {
                console.warn('放大视图svg-pan-zoom初始化失败:', error);
            }
        }
    };

    // 缩放控制函数
    const handleZoomIn = () => {
        if (enlargedSvgPanZoomInstance.current) {
            enlargedSvgPanZoomInstance.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (enlargedSvgPanZoomInstance.current) {
            enlargedSvgPanZoomInstance.current.zoomOut();
        }
    };

    const handleZoomReset = () => {
        if (enlargedSvgPanZoomInstance.current) {
            enlargedSvgPanZoomInstance.current.fit();
            enlargedSvgPanZoomInstance.current.center();
        }
    };

    // 处理ESC键关闭
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
    }, [isZoomed]);

    // 当放大视图打开时，初始化svg-pan-zoom
    useEffect(() => {
        if (isZoomed && svg) {
            // 延迟初始化，确保DOM已渲染
            const timer = setTimeout(() => {
                initializeEnlargedSvgPanZoom();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isZoomed, svg]);

    // 初始化svg-pan-zoom功能
    const initializeSvgPanZoom = async () => {
        if (!containerRef.current) return;

        const svgElement = containerRef.current.querySelector('svg');
        if (svgElement && !svgPanZoomInstance.current) {
            try {
                // 动态加载svg-pan-zoom库
                const svgPanZoomModule = await libraryPreloader.getLibrary('svgPanZoom');
                const svgPanZoom = svgPanZoomModule.default || svgPanZoomModule;

                svgPanZoomInstance.current = svgPanZoom(svgElement, {
                    zoomEnabled: true,
                    panEnabled: true,
                    controlIconsEnabled: false, // 禁用默认控制图标，使用我们自定义的
                    fit: true,
                    center: true,
                    minZoom: 0.1,
                    maxZoom: 10,
                    zoomScaleSensitivity: 0.2,
                    dblClickZoomEnabled: false, // 禁用默认双击，使用我们自定义的单击
                    mouseWheelZoomEnabled: true,
                    preventMouseEventsDefault: true
                });
                logMermaid('✅ svg-pan-zoom 初始化成功');
            } catch (error) {
                console.warn('svg-pan-zoom 初始化失败:', error);
            }
        }
    };

    // 修改SVG字符串，设置合适的尺寸和样式以适应容器
    const modifySvgForFullHeight = (svgString: string): string => {
        if (!svgString) return svgString;

        // 使用正则表达式匹配SVG标签并修改属性
        return svgString.replace(
            /<svg([^>]*?)>/i,
            (match, attributes) => {
                // 移除现有的height和width属性
                let newAttributes = attributes.replace(/\s*height\s*=\s*["'][^"']*["']/gi, '');
                newAttributes = newAttributes.replace(/\s*width\s*=\s*["'][^"']*["']/gi, ''); 

                // 添加响应式属性
                newAttributes += ' width="100%" height="100%" preserveAspectRatio="xMidYMid meet"';

                // 添加样式确保图表居中和铺满
                newAttributes += ' style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;"';

                return `<svg${newAttributes}>`;
            }
        );
    };

    // 清理svg-pan-zoom实例
    const cleanupSvgPanZoom = () => {
        if (svgPanZoomInstance.current) {
            try {
                svgPanZoomInstance.current.destroy();
                svgPanZoomInstance.current = null;
            } catch (error) {
                console.warn('svg-pan-zoom 清理失败:', error);
            }
        }
    };

    // 检查SVG是否需要重新渲染
    const needsRerender = (container: HTMLElement): boolean => {
        const svgElement = container.querySelector('svg');
        if (!svgElement) {
            logMermaid('🔍 需要重新渲染：未找到SVG元素', { containerId: container.id });
            return true;
        }

        // 检查SVG是否有实际内容
        const svgContent = svgElement.innerHTML;
        const hasGraphics = svgContent.includes('<g') || svgContent.includes('<path') ||
            svgContent.includes('<rect') || svgContent.includes('<circle') ||
            svgContent.includes('<polygon') || svgContent.includes('<text') ||
            svgContent.includes('<defs') || svgContent.includes('<marker');

        if (!hasGraphics) {
            logMermaid('🔍 需要重新渲染：SVG无图形内容', {
                containerId: container.id,
                contentLength: svgContent.length,
                preview: svgContent.substring(0, 100)
            });
            return true;
        }

        if (svgContent.length < 100) {
            logMermaid('🔍 需要重新渲染：SVG内容过短', {
                containerId: container.id,
                contentLength: svgContent.length,
                content: svgContent
            });
            return true;
        }

        // 检查SVG是否可见
        const svgRect = svgElement.getBoundingClientRect();
        if (svgRect.width === 0 || svgRect.height === 0) {
            logMermaid('🔍 需要重新渲染：SVG尺寸为0', {
                containerId: container.id,
                width: svgRect.width,
                height: svgRect.height
            });
            return true;
        }

        return false;
    };

    // 强制重新渲染函数
    const forceRerender = () => {
        logMermaid('🔄 强制重新渲染Mermaid图表', { id, chart: chart.substring(0, 50) + '...' });
        setRenderKey(prev => prev + 1);
        setSvg(''); // 清空SVG内容
        setIsLoading(true);
        setError('');

        // 立即触发重新渲染
        setTimeout(() => {
            renderMermaidChart();
        }, 100);
    };

    // 监听容器DOM的可见性变化，处理折叠/展开时的重新渲染
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // 使用IntersectionObserver监听容器的可见性变化
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.target === container) {
                        // 容器变为可见时，检查是否需要重新渲染
                        if (needsRerender(container) && chart && chart.trim()) {
                            logMermaid('🔄 容器重新可见，检测到需要重新渲染Mermaid图表');
                            // 使用强制重新渲染
                            setTimeout(() => {
                                forceRerender();
                            }, 100);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        // 使用MutationObserver监听容器内容变化
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 如果容器可见且需要重新渲染
                    if (container.offsetParent !== null && needsRerender(container) && chart && chart.trim()) {
                        logMermaid('🔄 检测到容器内容变化，需要重新渲染Mermaid图表');
                        setTimeout(() => {
                            forceRerender();
                        }, 100);
                    }
                }
            });
        });

        // 添加定时检查机制，确保图表正确渲染
        const intervalCheck = setInterval(() => {
            if (container.offsetParent !== null && needsRerender(container) && chart && chart.trim()) {
                logMermaid('🔄 定时检查发现需要重新渲染Mermaid图表');
                forceRerender();
            }
        }, 3000); // 每3秒检查一次

        intersectionObserver.observe(container);
        mutationObserver.observe(container, {
            childList: true,
            subtree: true
        });

        return () => {
            intersectionObserver.disconnect();
            mutationObserver.disconnect();
            clearInterval(intervalCheck);
        };
    }, [chart, id, renderKey]);

    // 提取渲染函数，供多处调用
    const renderMermaidChart = async () => {
        try {
            setIsLoading(true);
            setError('');

            // 动态加载Mermaid库
            const mermaidModule = await libraryPreloader.getLibrary('mermaid');
            const mermaid = mermaidModule.default || mermaidModule;

            // 清理旧的SVG内容和事件监听器
            if (containerRef.current) {
                const oldSvg = containerRef.current.querySelector('svg');
                if (oldSvg && (oldSvg as any)._clickHandler) {
                    oldSvg.removeEventListener('click', (oldSvg as any)._clickHandler);
                    delete (oldSvg as any)._clickHandler;
                }

                // 清理svg-pan-zoom实例
                cleanupSvgPanZoom();
            }

            // 根据主题配置Mermaid
            const theme = isDark ? 'dark' : 'default';

            // 初始化 Mermaid
            mermaid.initialize({
                startOnLoad: false,
                theme: theme,
                securityLevel: 'loose',
                fontFamily: 'Arial, sans-serif, "Microsoft YaHei", "微软雅黑"',
                fontSize: 14,
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true
                },
                mindmap: {
                    useMaxWidth: true,
                    padding: 10,
                    maxNodeSizeRatio: 0.9
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
                },
                themeVariables: isDark ? {
                    primaryColor: '#4a90e2',
                    primaryTextColor: '#ffffff',
                    primaryBorderColor: '#6b7280',
                    lineColor: '#6b7280',
                    secondaryColor: '#374151',
                    tertiaryColor: '#1f2937',
                    background: '#111827',
                    mainBkg: '#1f2937',
                    secondBkg: '#374151',
                    tertiaryBkg: '#4b5563'
                } : {
                    primaryColor: '#4a90e2',
                    primaryTextColor: '#1a202c',
                    primaryBorderColor: '#e2e8f0',
                    lineColor: '#a0aec0',
                    secondaryColor: '#f7fafc',
                    tertiaryColor: '#edf2f7',
                    background: '#ffffff',
                    mainBkg: '#ffffff',
                    secondBkg: '#f7fafc',
                    tertiaryBkg: '#edf2f7'
                }
            });

            // 生成唯一ID
            const uniqueId = `mermaid-${id}-${Date.now()}`;

            // 渲染图表
            const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);

            // 修改SVG以确保正确显示
            const modifiedSvg = modifySvgForFullHeight(renderedSvg);
            setSvg(modifiedSvg);
            setIsLoading(false);

            logMermaid(`✅ Mermaid图表渲染完成: ${uniqueId}, 内容长度: ${renderedSvg.length}`);

            // 在下一个tick中初始化svg-pan-zoom和点击事件
            setTimeout(() => {
                initializeSvgPanZoom();

                // 为SVG元素添加点击事件监听器
                if (containerRef.current) {
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

                        // 设置SVG样式确保完整显示
                        svgElement.style.cursor = 'zoom-in';
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                        svgElement.style.maxHeight = '300px';
                        // svgElement.style.maxHeight = '30vh';
                        svgElement.style.display = 'block';
                        // svgElement.style.background = `transparent`;

                        // 存储清理函数
                        (svgElement as any)._clickHandler = clickHandler;
                    }
                }
            }, 100);
        } catch (err) {
            console.error('Mermaid rendering error:', err);
            setError(`Mermaid 渲染错误: ${err instanceof Error ? err.message : String(err)}`);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chart && chart.trim()) {
            renderMermaidChart();
        }

        // 清理函数
        return () => {
            cleanupSvgPanZoom();

            // 清理SVG点击事件监听器
            if (containerRef.current) {
                const svgElement = containerRef.current.querySelector('svg');
                if (svgElement && (svgElement as any)._clickHandler) {
                    svgElement.removeEventListener('click', (svgElement as any)._clickHandler);
                    delete (svgElement as any)._clickHandler;
                }
            }
        };
    }, [chart, id, isDark, renderKey]);

    // 错误状态
    if (error) {
        return (
            <div style={{
                padding: '16px',
                backgroundColor: isDark ? '#fee2e2' : '#fee',
                border: `1px solid ${isDark ? '#fca5a5' : '#fcc'}`,
                borderRadius: '8px',
                color: isDark ? '#dc2626' : '#c33',
                fontFamily: 'monospace',
                fontSize: '14px',
                margin: '16px 0'
            }}>
                <strong>⚠️ Mermaid 渲染失败</strong>
                <br />
                {error}
            </div>
        );
    }

    // 加载状态
    if (isLoading) {
        return (
            <div style={{
                padding: '20px',
                // backgroundColor: isDark ? '#374151' : '#f6f8fa',
                backgroundColor: 'transparent',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d9e0'}`,
                borderRadius: '8px',
                textAlign: 'center',
                color: isDark ? '#d1d5db' : '#666',
                margin: '16px 0',
                maxHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div>
                    <div style={{
                        marginBottom: '8px',
                        fontSize: '18px'
                    }}>
                        🔄
                    </div>
                    正在渲染 Mermaid 图表...
                </div>
            </div>
        );
    }

    // 渲染成功    
    return (
        <>
            {/* 正常显示的脑图 */}
            <div
                key={`mermaid-container-${id}-${renderKey}`}
                ref={containerRef}
                data-mermaid-chart={id}
                style={{
                    textAlign: 'center',
                    margin: '20px 0',
                    padding: '16px',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDark ? '#374151' : '#e1e4e8'}`,
                    borderRadius: '8px',
                    overflow: 'visible', // 改为visible确保图表完整显示
                    boxShadow: isDark
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    cursor: 'zoom-in',
                    position: 'relative',
                    minHeight: '200px', // 设置最小高度确保图表有足够空间
                    // maxHeight: '300px', // 设置最小高度确保图表有足够空间
                    width: '100%', // 确保宽度充满容器
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={handleClick}
                dangerouslySetInnerHTML={{ __html: svg }}
                title="点击放大查看"
            />

            {/* 放大视图遮罩层 */}
            {isZoomed && (
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
                    {/* 放大的脑图容器 */}
                    <div
                        style={{
                            width: '95vw',
                            height: '95vh',
                            maxWidth: '95vw',
                            maxHeight: '95vh',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderRadius: '12px',
                            padding: '20px',
                            overflow: 'hidden', // 改为hidden，让svg-pan-zoom处理滚动
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

                        {/* 缩放控制按钮组 */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '50px',
                                display: 'flex',
                                gap: '5px',
                                zIndex: 10000
                            }}
                        >
                            {/* 放大按钮 */}
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

                            {/* 缩小按钮 */}
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

                            {/* 重置按钮 */}
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

                        {/* 放大的脑图内容 */}
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <div
                                style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    height: '100%'
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: modifySvgForFullHeight(svg)
                                }}
                            />
                        </div>

                        {/* 操作提示 */}
                        <div
                            style={{
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
                            }}
                        >
                            鼠标滚轮缩放 • 拖拽平移 • ESC键或点击背景关闭
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MermaidChart;
