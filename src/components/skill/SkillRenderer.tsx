import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import SkillItem from './SkillItem';
import MermaidLazyChart from '../mermaid/MermaidLazyChart';
import { getLogger } from '../../utils/Tools';

const logger = getLogger('SkillRenderer');

/**
 * 生成唯一ID的辅助函数
 * @param prefix ID前缀
 * @param content 内容标识
 * @returns 唯一ID
 */
const generateUniqueId = (prefix: string, content: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${content}-${timestamp}-${random}`;
};

/**
 * React根节点管理器
 * 负责创建、存储和清理React根节点
 */
class RootManager {
    private roots = new Map<string, Root>();

    /**
     * 创建新的React根节点
     * @param container DOM容器
     * @param id 根节点ID
     * @returns React根节点
     */
    createRoot(container: HTMLElement, id: string): Root {
        this.cleanup(id);
        const root = createRoot(container);
        this.roots.set(id, root);
        return root;
    }

    /**
     * 安全地清理根节点
     * @param id 根节点ID
     */
    cleanup(id: string): void {
        const root = this.roots.get(id);
        if (root) {
            this.roots.delete(id);
            queueMicrotask(() => {
                try {
                    root.unmount();
                } catch (error) {
                    logger('根节点清理警告:', error);
                }
            });
        }
    }

    /**
     * 清理所有根节点
     */
    cleanupAll(): void {
        const allIds = Array.from(this.roots.keys());
        allIds.forEach(id => this.cleanup(id));
    }
}

/**
 * 简化的主题检测hook
 * 检测当前页面的主题状态（深色/浅色）
 * @returns 是否为深色主题
 */
const useTheme = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const detectTheme = (): boolean => {
            // 检查HTML class
            if (document.documentElement.classList.contains('dark')) return true;
            if (document.documentElement.classList.contains('light')) return false;

            // 检查data-theme属性
            const theme = document.documentElement.getAttribute('data-theme') ||
                document.body.getAttribute('data-theme');
            if (theme === 'dark') return true;
            if (theme === 'light') return false;

            // 检查localStorage
            try {
                const storedTheme = localStorage.getItem('theme');
                if (storedTheme === 'dark') return true;
                if (storedTheme === 'light') return false;
            } catch (e) {
                // localStorage可能不可用
            }

            // 默认跟随系统偏好
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        };

        setIsDark(detectTheme());

        // 监听主题变化
        const observer = new MutationObserver(() => setIsDark(detectTheme()));
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
                setIsDark(detectTheme());
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return isDark;
};

/**
 * 向后兼容的主题hook
 * @deprecated 推荐直接使用 useTheme
 * @returns 包含isDark属性的对象
 */
export const useSafeTheme = () => {
    const isDark = useTheme();
    return { isDark };
};

/**
 * SkillRenderer 组件
 * 
 * 功能：
 * - 将HTML占位符替换为React组件
 * - 支持技能标签和Mermaid图表渲染
 * - 自动管理组件生命周期
 * 
 * 支持的占位符：
 * - .skill-placeholder[data-skill-name][data-skill-level] -> SkillItem
 * - .mermaid-placeholder[data-mermaid-chart][data-mermaid-id] -> MermaidLazyChart
 * - .mermaid-lazy-placeholder[data-mermaid-chart][data-mermaid-id] -> MermaidLazyChart (懒加载)
 */
interface SkillRendererProps {
    /** 包含占位符的子内容 */
    children: React.ReactNode;
}

const SkillRenderer: React.FC<SkillRendererProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rootManagerRef = useRef(new RootManager());
    const isDark = useTheme();
    const observerRef = useRef<MutationObserver | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * 处理技能占位符
     * 查找 .skill-placeholder 元素并替换为 SkillItem 组件
     */
    const processSkillPlaceholders = useCallback(() => {
        if (!containerRef.current) return;

        const placeholders = containerRef.current.querySelectorAll(
            '.skill-placeholder[data-skill-name][data-skill-level]'
        );

        let processedCount = 0;

        placeholders.forEach((placeholder) => {
            const skillName = placeholder.getAttribute('data-skill-name');
            const skillLevel = placeholder.getAttribute('data-skill-level');

            if (!skillName || !skillLevel) return;

            try {
                const container = document.createElement('span');
                const id = generateUniqueId('skill', `${skillName}-${skillLevel}`);

                container.id = id;
                container.style.display = 'inline';

                placeholder.parentNode?.replaceChild(container, placeholder);

                const root = rootManagerRef.current.createRoot(container, id);
                const level = parseInt(skillLevel, 10) || 1;

                root.render(
                    <SkillItem
                        skill={skillName}
                        level={level}
                    />
                );

                processedCount++;
                logger(`技能组件已创建: ${skillName} (级别${level})`);
            } catch (error) {
                logger('处理技能占位符失败:', error);
            }
        });

        // 如果处理了占位符，触发自定义事件通知
        if (processedCount > 0) {
            const event = new CustomEvent('skillRenderComplete', {
                detail: { processedCount, timestamp: Date.now() }
            });
            containerRef.current?.dispatchEvent(event);
            logger(`技能渲染完成事件已触发: ${processedCount} 个组件`);
        }

        return processedCount;
    }, []);

    /**
     * 处理Mermaid占位符
     * 查找 .mermaid-placeholder 和 .mermaid-lazy-placeholder 元素并替换为 MermaidLazyChart 组件
     */
    const processMermaidPlaceholders = useCallback(() => {
        if (!containerRef.current) return 0;

        let processedCount = 0;

        // 处理普通Mermaid占位符
        const placeholders = containerRef.current.querySelectorAll(
            '.mermaid-placeholder[data-mermaid-chart][data-mermaid-id]'
        );

        placeholders.forEach((placeholder) => {
            const chart = placeholder.getAttribute('data-mermaid-chart');
            const chartId = placeholder.getAttribute('data-mermaid-id');

            if (!chart || !chartId) return;

            try {
                const container = document.createElement('div');
                const id = generateUniqueId('mermaid', chartId);

                container.id = id;
                container.style.display = 'block';

                placeholder.parentNode?.replaceChild(container, placeholder);

                const root = rootManagerRef.current.createRoot(container, id);
                root.render(
                    <MermaidLazyChart
                        chart={chart}
                        id={chartId}
                        enableZoom={true}
                    />
                );

                processedCount++;
                logger(`Mermaid图表已创建: ${chartId}`);
            } catch (error) {
                logger('处理Mermaid占位符失败:', error);
            }
        });

        // 处理懒加载Mermaid占位符
        const lazyPlaceholders = containerRef.current.querySelectorAll(
            '.mermaid-lazy-placeholder[data-mermaid-chart][data-mermaid-id]'
        );

        lazyPlaceholders.forEach((placeholder) => {
            const encodedChart = placeholder.getAttribute('data-mermaid-chart');
            const chartId = placeholder.getAttribute('data-mermaid-id');

            if (!encodedChart || !chartId) return;

            try {
                const chart = decodeURIComponent(encodedChart);
                const container = document.createElement('div');
                const id = generateUniqueId('mermaid-lazy', chartId);

                container.id = id;
                container.style.display = 'block';

                placeholder.parentNode?.replaceChild(container, placeholder);

                const root = rootManagerRef.current.createRoot(container, id);
                root.render(
                    <MermaidLazyChart
                        chart={chart}
                        id={chartId}
                        placeholderHeight="300px"
                    />
                );

                processedCount++;
                logger(`懒加载Mermaid图表已创建: ${chartId}`);
            } catch (error) {
                logger('处理懒加载Mermaid占位符失败:', error);
            }
        });

        // 如果处理了占位符，触发自定义事件通知
        if (processedCount > 0) {
            const event = new CustomEvent('mermaidRenderComplete', {
                detail: { processedCount, timestamp: Date.now() }
            });
            containerRef.current?.dispatchEvent(event);
            logger(`Mermaid渲染完成事件已触发: ${processedCount} 个组件`);
        }

        return processedCount;
    }, []);

    /**
     * 异步内容监听机制
     * 监听DOM变化，处理SecureContentRenderer异步渲染的内容
     */
    const setupAsyncContentListener = useCallback(() => {
        if (!containerRef.current) return;

        // 清理之前的观察器
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // 创建MutationObserver监听DOM变化
        observerRef.current = new MutationObserver((mutations) => {
            let hasNewContent = false;

            mutations.forEach((mutation) => {
                // 检查是否有新增的节点包含占位符
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as Element;

                            // 检查新增节点是否包含技能或Mermaid占位符
                            const hasSkillPlaceholders = element.querySelectorAll?.('.skill-placeholder').length > 0 ||
                                                        element.classList?.contains('skill-placeholder');
                            const hasMermaidPlaceholders = element.querySelectorAll?.('.mermaid-placeholder, .mermaid-lazy-placeholder').length > 0 ||
                                                         element.classList?.contains('mermaid-placeholder') ||
                                                         element.classList?.contains('mermaid-lazy-placeholder');

                            if (hasSkillPlaceholders || hasMermaidPlaceholders) {
                                hasNewContent = true;
                                logger('检测到异步内容包含占位符，准备处理');
                            }
                        }
                    });
                }
            });

            // 如果检测到新内容，延迟处理以确保DOM稳定
            if (hasNewContent) {
                if (retryTimeoutRef.current) {
                    clearTimeout(retryTimeoutRef.current);
                }

                retryTimeoutRef.current = setTimeout(() => {
                    const skillCount = processSkillPlaceholders();
                    const mermaidCount = processMermaidPlaceholders();

                    if (skillCount > 0 || mermaidCount > 0) {
                        logger(`异步内容处理完成: ${skillCount} 个技能组件, ${mermaidCount} 个图表组件`);
                    }
                }, 100);
            }
        });

        // 开始观察DOM变化
        observerRef.current.observe(containerRef.current, {
            childList: true,
            subtree: true,
            attributes: false
        });

        logger('异步内容监听器已启动');
    }, [processSkillPlaceholders, processMermaidPlaceholders]);

    /**
     * 重试机制
     * 定期检查是否有未处理的占位符
     */
    const setupRetryMechanism = useCallback(() => {
        const retryInterval = setInterval(() => {
            if (!containerRef.current) return;

            const skillPlaceholders = containerRef.current.querySelectorAll('.skill-placeholder');
            const mermaidPlaceholders = containerRef.current.querySelectorAll('.mermaid-placeholder, .mermaid-lazy-placeholder');

            if (skillPlaceholders.length > 0 || mermaidPlaceholders.length > 0) {
                logger(`重试处理占位符: ${skillPlaceholders.length} 个技能, ${mermaidPlaceholders.length} 个图表`);

                const skillCount = processSkillPlaceholders();
                const mermaidCount = processMermaidPlaceholders();

                if (skillCount === 0 && mermaidCount === 0) {
                    // 如果没有处理任何占位符，可能是异步内容还未加载完成
                    logger('占位符存在但未能处理，可能需要等待异步内容加载');
                }
            }
        }, 2000); // 每2秒检查一次

        // 10秒后停止重试
        setTimeout(() => {
            clearInterval(retryInterval);
            logger('占位符重试机制已停止');
        }, 10000);

        return () => clearInterval(retryInterval);
    }, [processSkillPlaceholders, processMermaidPlaceholders]);

    // 当内容或主题变化时处理占位符
    useEffect(() => {
        // 立即处理一次
        processSkillPlaceholders();
        processMermaidPlaceholders();

        // 设置异步内容监听
        setupAsyncContentListener();

        // 设置重试机制
        const cleanupRetry = setupRetryMechanism();

        return cleanupRetry;
    }, [children, isDark, processSkillPlaceholders, processMermaidPlaceholders, setupAsyncContentListener, setupRetryMechanism]);

    // 组件卸载时清理所有根节点和监听器
    useEffect(() => {
        return () => {
            // 清理根节点
            rootManagerRef.current.cleanupAll();

            // 清理观察器
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            // 清理定时器
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }

            logger('SkillRenderer 清理完成');
        };
    }, []);

    return (
        <div ref={containerRef} style={{ display: 'contents' }}>
            {children}
        </div>
    );
};

export default SkillRenderer;
