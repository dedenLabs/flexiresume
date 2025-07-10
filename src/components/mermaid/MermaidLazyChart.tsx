/**
 * Mermaid懒加载图表组件
 * 参考视频懒加载机制，实现可视范围内渲染
 * 解决折叠后再打开无法渲染的问题
 * 
 * @author AI Assistant
 * @date 2025-01-09
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSafeTheme } from '../skill/SkillRenderer';

interface MermaidLazyChartProps {
    /** Mermaid图表定义 */
    chart: string;
    /** 图表唯一标识 */
    id: string;
    /** 占位符高度 */
    placeholderHeight?: string;
}

/**
 * Mermaid懒加载图表组件
 * 实现类似视频懒加载的机制：
 * 1. 初始显示占位符
 * 2. 进入可视区域时加载真实图表
 * 3. 支持重新渲染，解决折叠问题
 */
const MermaidLazyChart: React.FC<MermaidLazyChartProps> = ({
    chart,
    id,
    placeholderHeight = '300px'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const mutationObserverRef = useRef<MutationObserver | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const { isDark } = useSafeTheme();

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
            
            setSvg(renderedSvg);
            setIsLoaded(true);
            
            console.log('🎯 MermaidLazyChart渲染成功:', { id, uniqueId });
            
        } catch (err) {
            console.error('❌ MermaidLazyChart渲染失败:', err);
            setError(`渲染失败: ${err instanceof Error ? err.message : '未知错误'}`);
        } finally {
            setIsLoading(false);
        }
    }, [chart, id, isDark, isLoading]);

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
                cursor: 'pointer',
                position: 'relative',
                minHeight: '300px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            title="点击放大查看"
            dangerouslySetInnerHTML={{
                __html: svg.replace(
                    /<svg([^>]*?)>/i,
                    (match, attributes) => {
                        // 确保SVG有正确的样式
                        let newAttributes = attributes;
                        if (!newAttributes.includes('style=')) {
                            newAttributes += ' style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;"';
                        }
                        if (!newAttributes.includes('preserveAspectRatio=')) {
                            newAttributes += ' preserveAspectRatio="xMidYMid meet"';
                        }
                        return `<svg${newAttributes}>`;
                    }
                )
            }}
        />
    );

    return (
        <div ref={containerRef} data-mermaid-lazy-chart={id}>
            {error ? renderError() : 
             isLoaded && svg ? renderChart() : 
             renderPlaceholder()}
        </div>
    );
};

export default MermaidLazyChart;
