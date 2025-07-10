import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import SkillItem from './SkillItem';
import MermaidChart from '../mermaid/MermaidChart';
import MermaidLazyChart from '../mermaid/MermaidLazyChart';
import { getLogger } from '../../utils/Tools';
const logMermaid = getLogger(`Mermaid`);

/**
 * 安全地使用主题hook
 * 支持服务器端渲染和客户端渲染
 * 当组件在独立的React根中渲染时，直接从DOM获取主题状态
 */
export const useSafeTheme = () => {
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
 * SkillRenderer 组件
 * 用于在客户端将占位符替换为真正的 React 组件
 * - 技能占位符 -> SkillItem 组件
 * - Mermaid占位符 -> MermaidChart 组件
 * 这样可以确保组件在正确的 React 上下文中渲染，包括 ThemeProvider
 */
interface SkillRendererProps {
    children: React.ReactNode;
}

const SkillRenderer: React.FC<SkillRendererProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isDark } = useSafeTheme(); // 监听主题变化
    const rootsRef = useRef<Map<string, any>>(new Map()); // 存储所有创建的根

    useEffect(() => {
        if (!containerRef.current) return;

        // 清理所有失效的根节点 - 异步处理避免竞态条件
        const cleanupInvalidRoots = () => {
            const keysToDelete: string[] = [];
            const rootsToUnmount: any[] = [];

            rootsRef.current.forEach((root, id) => {
                const container = document.getElementById(id);
                if (!container || !document.body.contains(container)) {
                    rootsToUnmount.push(root);
                    keysToDelete.push(id);
                }
            });

            // 立即从Map中删除引用，避免重复处理
            keysToDelete.forEach(key => rootsRef.current.delete(key));

            // 异步卸载根节点，避免在渲染周期中同步卸载
            if (rootsToUnmount.length > 0) {
                setTimeout(() => {
                    rootsToUnmount.forEach(root => {
                        try {
                            root?.unmount();
                        } catch (e) {
                            // 忽略清理错误，可能已经被清理
                            console.warn('Root unmount warning (safe to ignore):', e);
                        }
                    });
                }, 0);
            }
        };

        // 先清理失效的根节点
        cleanupInvalidRoots();

        // 查找所有技能占位符
        const skillPlaceholders = containerRef.current.querySelectorAll('.skill-placeholder[data-skill-name][data-skill-level]');

        skillPlaceholders.forEach((placeholder, index) => {
            const skillName = placeholder.getAttribute('data-skill-name');
            const skillLevel = placeholder.getAttribute('data-skill-level');

            if (skillName && skillLevel) {
                // 使用时间戳确保ID唯一性
                const timestamp = Date.now();
                const id = `skill-${skillName}-${skillLevel}-${index}-${timestamp}`;

                // 创建一个新的容器来渲染 SkillItem
                const skillContainer = document.createElement('span');
                skillContainer.style.display = 'inline';
                skillContainer.id = id;

                // 替换占位符
                placeholder.parentNode?.replaceChild(skillContainer, placeholder);

                // 创建根并存储
                const root = createRoot(skillContainer);
                rootsRef.current.set(id, root);

                // 渲染 SkillItem
                const levelNumber = parseInt(skillLevel, 10) || 1;
                root.render(
                    <SkillItem
                        skill={skillName}
                        level={levelNumber}
                    />
                );
            }
        });

        // 查找所有Mermaid占位符
        const mermaidPlaceholders = containerRef.current.querySelectorAll('.mermaid-placeholder[data-mermaid-chart][data-mermaid-id]');

        mermaidPlaceholders.forEach((placeholder, index) => {
            const chart = placeholder.getAttribute('data-mermaid-chart');
            const chartId = placeholder.getAttribute('data-mermaid-id');

            if (chart && chartId) {
                // 使用时间戳确保ID唯一性
                const timestamp = Date.now();
                const id = `mermaid-${chartId}-${index}-${timestamp}`;

                // 创建一个新的容器来渲染 MermaidChart
                const mermaidContainer = document.createElement('div');
                mermaidContainer.style.display = 'block';
                mermaidContainer.id = id;

                // 替换占位符
                placeholder.parentNode?.replaceChild(mermaidContainer, placeholder);

                // 创建根并存储
                const root = createRoot(mermaidContainer);
                rootsRef.current.set(id, root);

                // 渲染 MermaidChart
                root.render(
                    <MermaidChart
                        chart={chart}
                        id={chartId}
                    />
                );

                // 添加容器可见性监听，确保图表在展开时重新渲染
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && entry.target === mermaidContainer) {
                            // 容器变为可见时，检查是否需要重新渲染
                            setTimeout(() => {
                                const svgElement = mermaidContainer.querySelector('svg');
                                const needsRerender = !svgElement ||
                                                    svgElement.innerHTML.length < 100 ||
                                                    !svgElement.innerHTML.includes('<g') ||
                                                    svgElement.getBoundingClientRect().width === 0;

                                if (needsRerender) {
                                    logMermaid('🔄 SkillRenderer检测到需要重新渲染Mermaid图表', {
                                        chartId,
                                        hasSvg: !!svgElement,
                                        contentLength: svgElement?.innerHTML.length || 0,
                                        hasGraphics: svgElement?.innerHTML.includes('<g') || false,
                                        width: svgElement?.getBoundingClientRect().width || 0,
                                        containerVisible: mermaidContainer.offsetParent !== null
                                    });

                                    // 异步重新渲染，避免在渲染周期中同步操作
                                    queueMicrotask(() => {
                                        try {
                                            // 清理旧的根节点
                                            const oldRoot = rootsRef.current.get(id);
                                            if (oldRoot) {
                                                oldRoot.unmount();
                                                rootsRef.current.delete(id);
                                            }

                                            // 清空容器内容
                                            mermaidContainer.innerHTML = '';

                                            // 创建新的根节点
                                            const newRoot = createRoot(mermaidContainer);
                                            rootsRef.current.set(id, newRoot);

                                            // 强制重新渲染
                                            const newId = `${chartId}-rerender-${Date.now()}`;
                                            logMermaid('🔄 开始重新渲染，新ID:', newId);

                                            newRoot.render(
                                                <MermaidChart
                                                    chart={chart}
                                                    id={newId}
                                                />
                                            );
                                        } catch (error) {
                                            console.warn('Mermaid重新渲染失败:', error);
                                        }
                                    });
                                }
                            }, 200);
                        }
                    });
                }, {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.1
                });

                observer.observe(mermaidContainer);

                // 存储observer以便清理
                (mermaidContainer as any)._observer = observer;

                // 添加定时检查机制，确保图表正确渲染
                const intervalCheck = setInterval(() => {
                    if (mermaidContainer.offsetParent !== null) { // 容器可见
                        const svgElement = mermaidContainer.querySelector('svg');
                        const needsRerender = !svgElement ||
                                            svgElement.innerHTML.length < 100 ||
                                            !svgElement.innerHTML.includes('<g') ||
                                            svgElement.getBoundingClientRect().width === 0;

                        if (needsRerender) {
                            logMermaid('🔄 SkillRenderer定时检查发现需要重新渲染', {
                                chartId,
                                hasSvg: !!svgElement,
                                contentLength: svgElement?.innerHTML.length || 0,
                                containerVisible: mermaidContainer.offsetParent !== null
                            });

                            // 异步重新渲染，避免在渲染周期中同步操作
                            queueMicrotask(() => {
                                try {
                                    // 清理旧的根节点
                                    const oldRoot = rootsRef.current.get(id);
                                    if (oldRoot) {
                                        oldRoot.unmount();
                                        rootsRef.current.delete(id);
                                    }

                                    // 清空容器内容
                                    mermaidContainer.innerHTML = '';

                                    // 创建新的根节点
                                    const newRoot = createRoot(mermaidContainer);
                                    rootsRef.current.set(id, newRoot);

                                    const newId = `${chartId}-timer-${Date.now()}`;
                                    logMermaid('🔄 定时检查开始重新渲染，新ID:', newId);

                                    newRoot.render(
                                        <MermaidChart
                                            chart={chart}
                                            id={newId}
                                        />
                                    );
                                } catch (error) {
                                    console.warn('Mermaid定时重新渲染失败:', error);
                                }
                            });
                        }
                    }
                }, 3000); // 每3秒检查一次

                // 存储定时器以便清理
                (mermaidContainer as any)._intervalCheck = intervalCheck;
            }
        });

        // 查找所有Mermaid懒加载占位符
        const mermaidLazyPlaceholders = containerRef.current.querySelectorAll('.mermaid-lazy-placeholder[data-mermaid-chart][data-mermaid-id]');

        mermaidLazyPlaceholders.forEach((placeholder, index) => {
            const encodedChart = placeholder.getAttribute('data-mermaid-chart');
            const chartId = placeholder.getAttribute('data-mermaid-id');

            if (encodedChart && chartId) {
                try {
                    // 解码图表内容
                    const chart = decodeURIComponent(encodedChart);

                    // 使用时间戳确保ID唯一性
                    const timestamp = Date.now();
                    const id = `mermaid-lazy-${chartId}-${index}-${timestamp}`;

                    // 创建一个新的容器来渲染 MermaidLazyChart
                    const mermaidLazyContainer = document.createElement('div');
                    mermaidLazyContainer.style.display = 'block';
                    mermaidLazyContainer.id = id;

                    // 替换占位符
                    placeholder.parentNode?.replaceChild(mermaidLazyContainer, placeholder);

                    // 创建根并存储
                    const root = createRoot(mermaidLazyContainer);
                    rootsRef.current.set(id, root);

                    // 渲染 MermaidLazyChart
                    root.render(
                        <MermaidLazyChart
                            chart={chart}
                            id={chartId}
                            placeholderHeight="300px"
                        />
                    );

                    logMermaid('🚀 SkillRenderer创建懒加载Mermaid图表:', {
                        id,
                        chartId,
                        chartLength: chart.length
                    });

                } catch (error) {
                    console.error('❌ SkillRenderer处理懒加载Mermaid占位符失败:', error);
                }
            }
        });
    }, [children, isDark]); // 当 children 或主题变化时重新渲染

    // 清理函数
    useEffect(() => {
        return () => {
            // 清理所有observer和定时器
            if (containerRef.current) {
                const containers = containerRef.current.querySelectorAll('[id*="mermaid-chart"]');
                containers.forEach(container => {
                    const observer = (container as any)._observer;
                    if (observer) {
                        observer.disconnect();
                        delete (container as any)._observer;
                    }

                    const intervalCheck = (container as any)._intervalCheck;
                    if (intervalCheck) {
                        clearInterval(intervalCheck);
                        delete (container as any)._intervalCheck;
                    }
                });
            }

            // 异步清理所有根节点，避免在渲染周期中同步卸载
            const rootsToCleanup = Array.from(rootsRef.current.values());
            rootsRef.current.clear();

            if (rootsToCleanup.length > 0) {
                setTimeout(() => {
                    rootsToCleanup.forEach(root => {
                        try {
                            root?.unmount();
                        } catch (e) {
                            // 忽略清理错误，组件可能已经被清理
                            console.warn('Root cleanup warning (safe to ignore):', e);
                        }
                    });
                }, 0);
            }
        };
    }, []);

    return (
        <div ref={containerRef} style={{ display: 'contents' }}>
            {children}
        </div>
    );
};

export default SkillRenderer;
