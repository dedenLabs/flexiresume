import { Location } from 'react-router-dom';
import flexiResumeStore from '../store/Store';
import React, { useState, useEffect } from 'react';
import { reaction, set } from 'mobx';
import { getCurrentLanguageData } from '../data/DataLoader';
import { IFlexiResume } from '../types/IFlexiResume';
import { cdnManager } from './CDNManager';
import { getCDNConfig, isDebugEnabled, isDevelopment } from '../config/ProjectConfig';
import { getLogger } from './Logger';
import { globalCache } from '../utils/MemoryManager';

// Debug loggers
const debugCache = getLogger('cache');
const debugCDN = getLogger('cdn');
const debugTools = getLogger('tools');

// 全局数据缓存，用于同步函数访问
let cachedOriginData: IFlexiResume | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

// 初始化数据缓存
const initializeDataCache = async () => {
    if (isInitializing || cachedOriginData) {
        return initPromise;
    }

    isInitializing = true;
    initPromise = (async () => {
        try {
            cachedOriginData = await getCurrentLanguageData();
            debugCache('Data cache initialized successfully');
        } catch (error) {
            debugCache('Failed to initialize data cache: %O', error);
        } finally {
            isInitializing = false;
        }
    })();

    return initPromise;
};

// 立即初始化缓存
initializeDataCache();

// 获取缓存的数据，如果没有则返回默认值
const getCachedData = (): IFlexiResume => {
    if (!cachedOriginData) {
        // 如果数据还在初始化中，不显示警告
        if (!isInitializing) {
            debugCache('Data cache not initialized, using fallback');
        }
        // 返回一个基本的默认配置
        return {
            header_info: {
                cdn_static_assets_dirs: ['images']
            }
        } as IFlexiResume;
    }
    return cachedOriginData;
};

// 更新数据缓存（当语言切换时调用）
export const updateDataCache = async (): Promise<void> => {
    try {
        cachedOriginData = await getCurrentLanguageData();
    } catch (error) {
        debugCache('Failed to update data cache: %O', error);
    }
};


/** 获取折叠面板的日志 */
export const logCollapse = getLogger('折叠');
/** 播放视频时停止其他真正播放的视频 */
window.stopOtherVideos = function (e) {
    document.querySelectorAll(".remark-video").forEach(video => { if (video !== e.target) video.pause(); });
}
/**
 * 格式化简历title名称,同时也是保存网页时的名称
 * @param template
 * @param values
 * @returns
 */
export function formatResumeFilename(template: string, values: any) {
    if (!template || !values) {
        return values?.position || 'My Resume';
    }

    const result = template.replace(/{(position|name|age|location)}/g, (_: string, p1: string) => {
        return values[p1] || ''; // 返回对应的值，或空字符串
    });

    // 如果格式化后的结果为空或只包含分隔符，返回默认标题
    const cleanResult = result.replace(/[-\s]+/g, ' ').trim();
    if (!cleanResult || cleanResult === '-' || cleanResult === '--' || cleanResult === '---') {
        return values?.position || values?.name || 'My Resume';
    }

    return result;
}

export function assignDeep(target, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                // 合并数组
                target[key] = Array.from(new Set([...targetValue, ...sourceValue]));
            } else if (typeof targetValue === 'object' && typeof sourceValue === 'object') {
                // 递归合并对象
                target[key] = assignDeep({ ...targetValue }, sourceValue);
            } else {
                // 直接赋值
                target[key] = sourceValue;
            }
        });
    });
    return target;
}


/**
 *  获取当前页面岗位名称
 * @param location 路由中的url信息
 * @returns 
 */
export function getCurrentPositionName(location: Location<any>): string {
    const data = flexiResumeStore.data;
    const tabs = flexiResumeStore.tabs;
    const currentPath = location.pathname; // 当前路由的路径

    // 查找当前路径对应的职位名称
    const currentTab = tabs.find(([, path]) => path === currentPath);

    // 返回第一个参数（职位名称），如果找不到，则返回 null
    return currentTab ? currentTab[0] : data?.header_info?.position || ``;
}

/**
 * 通过路径信息获取页面岗位名称
 *
 * @export
 * @param {string} path 路径信息
 * @return {*}  {string}
 */
export function getCurrentPositionNameByPath(path: string): string {
    const data = flexiResumeStore.data;
    const tabs = flexiResumeStore.tabs;
    const currentPath = location.pathname; // 当前路由的路径

    // 查找当前路径对应的职位名称 
    const currentTab = tabs.find(([, tabPath]) => tabPath === path);
    // 返回第一个参数（职位名称），如果找不到，则返回 null
    return currentTab ? currentTab[0] : data?.header_info?.position || ``;
}

/**
 * 更新当前简历数据（异步版本）
 *
 * @export
 * @param {string} postion 岗位名称
 * @return {Promise<void>}
 */
export async function updateCurrentResumeStore(postion: string): Promise<void> {
    const cacheKey = `preload-finished-${postion}`;

    if (globalCache.has(cacheKey)) {
        // 调试日志已移除: console.log(`📦 [DEBUG] 数据已预加载: ${url}`); 
        // 更新当前简历数据
        flushFlexiResumeStore(globalCache.get(cacheKey));
        return;
    }
    // 更新当前位置
    flexiResumeStore.collapsedMap.clear();// 清空折叠信息

    // 动态获取当前语言的数据
    const originData = await getCurrentLanguageData();

    // 异步加载职位数据和完整技能数据
    const [positionData, skillsData] = await Promise.all([
        originData.loadPositionData(postion),
        originData.loadSkillsData()
    ]);

    const selectedPositonData = assignDeep({}, positionData, originData.expected_positions[postion]);
    const newData = assignDeep({}, originData, selectedPositonData, { skill_level: skillsData });

    // 更新当前简历数据
    flushFlexiResumeStore(newData);

    // 预加载位置数据到缓存 
    globalCache.set(cacheKey, newData);
}

function flushFlexiResumeStore(newData: any) {
    flexiResumeStore.data = newData as IFlexiResume;

    // 技能数值
    const skills = ((newData?.skill_level?.list || []) as Skill[]).sort((a, b) => {
        return a.length - b.length;
    });
    flexiResumeStore.skills = skills;

    // 技能字典对象
    const skillMap: { [key: string]: number; } = {};
    skills.forEach(([skill, level]) => {
        skillMap[skill.toLocaleLowerCase()] = [skill, level];
    });
    flexiResumeStore.skillMap = skillMap;
}

/**
 * 监视浏览器窗口变化,然后更新数据
 *
 * @export
 * @param {number} maxWidth 允许的最大尺寸
 * @return {*}  {number}
 */
export function watchMinWidth(maxWidth: number): number {
    // 使用状态存储动态最小宽度
    const [minWidth, setMinWidth] = useState(Math.min(maxWidth, document.body.getBoundingClientRect().width));

    useEffect(() => {
        // 更新最小宽度
        const handleResize = () => {
            setMinWidth(Math.min(maxWidth, document.body.getBoundingClientRect().width));
        };

        // 监听窗口大小变化
        window.addEventListener('resize', handleResize);

        // 清理事件监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return minWidth;
}
/**
 * 动态替换文本中的变量
 *
 * @export
 * @param {string} template 要替换的文本
 * @param {*} data 用来替换的字典对象
 * @return {*}  {string}
 */
export function replaceVariables(template: string, data: any): string {
    return template.replace(/\$\{([\w.]+)\}/g, (match, path) => {
        const keys = path.split('.');
        let value = data;
        for (const key of keys) {
            value = value ? value[key] : undefined;
            if (value === undefined) return match; // 未找到对应值时，保持原样
        }
        return value;
    });
}


/**
 * 计算工作时长
 * @param start 开始时间
 * @param end 结束时间
 * @returns 
 */
export function calculateWorkDuration(start: string, end: string) {
    // 获取当前年月
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月份从 0 开始

    // 定义一个解析函数，支持多种日期格式，并处理 "至今" 的情况
    function parseDate(dateStr) {
        // 检查是否为 "至今" 或其他不可解析为数字的字符
        if (!/\d/.test(dateStr)) return [currentYear, currentMonth];

        // 支持多种分隔符
        const separators = ['.', '/', '-'];
        let year, month;
        for (const sep of separators) {
            if (dateStr.includes(sep)) {
                const parts = dateStr.split(sep).map(part => {
                    // 提取数字部分，过滤掉非数字字符
                    const numbers = part.match(/\d+/);
                    return numbers ? Number(numbers[0]) : 0;
                });
                [year, month] = parts;
                break;
            }
        }

        // 如果分隔符解析失败，直接提取所有数字
        if (!year || !month) {
            const numbers = dateStr.match(/\d+/g);
            if (numbers && numbers.length >= 2) {
                [year, month] = numbers.map(Number);
            } else if (numbers && numbers.length === 1) {
                // 如果只有一个数字，假设是年份，月份设为1
                year = Number(numbers[0]);
                month = 1;
            } else {
                // 如果没有数字，返回当前年月
                return [currentYear, currentMonth];
            }
        }

        // 确保年份和月份都是有效的数字
        year = year || currentYear;
        month = month || 1;

        return [year, month];
    }

    // 解析开始和结束日期
    const [startYear, startMonth] = parseDate(start);
    const [endYear, endMonth] = parseDate(end);

    // 计算总的年数和月数
    let years = endYear - startYear;
    let months = endMonth - startMonth;

    // 调整月数，确保它们是正数
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // 构建输出字符串
    let result = '';
    if (years > 0) result += `${years}年`;
    if (months > 0) result += `${months}个月`;

    return result || '0个月';
}

/**
 * 创建一个节点折叠器函数
 *
 * @returns 返回一个包含折叠状态和切换折叠状态方法的对象
 */
export function watchTitleCollapser(id, cb) {
    useEffect(() => {
        if (!flexiResumeStore.collapsedMap.has(id)) {
            flexiResumeStore.collapsedMap.set(id, false); // 默认值为 false
        }
        // 监听折叠状态变化 
        const disposeReaction = reaction(
            () => flexiResumeStore.collapsedMap.get(id),
            (v) => {
                cb(v);
            }
        );

        return () => {
            disposeReaction();
        };
    }, [id]);
}
/**
 * 创建一个折叠器函数
 *
 * @returns 返回一个包含折叠状态和切换折叠状态方法的对象
 */
export function useCollapser(id: string, count: number) {
    // 定义折叠状态，使用对象存储每个项的折叠状态
    const [collapsedItems, setCollapsedItems] = useState<{ [key: number]: boolean }>({});

    // 切换指定索引项的折叠状态 
    const toggleCollapse = (index: number, v?: boolean) => {
        setCollapsedItems({ ...collapsedItems, [index]: v ?? !collapsedItems[index] });
    };
    const setCollapsedAllItems = (value?: boolean) => {
        const newCollapsedState = {};
        // console.log(`更新列表(${length}):`, id, value);
        for (let index = 0; index < count; index++) {
            newCollapsedState[index] = value;
        }
        // setCollapsedItems(newCollapsedState);
        setTimeout(() => setCollapsedItems(newCollapsedState), 0);//防止夸组件错误,修改为下一个周期渲染
    };
    // 监听折叠状态变化，更新节点折叠状态
    watchTitleCollapser(id, setCollapsedAllItems);
    return { collapsedItems, toggleCollapse, setCollapsedAllItems };
}


/**
 *  video标签懒加载
 *  - 在页面载入时，增加一个 IntersectionObserver
 *  - 监听 video 标签的可见性
 *  - 如果 video 可见，加载视频
 *  - 如果 video 不可见，移除观察
 *  - 兼容旧浏览器的滚动检测
 *  @returns {void}
 */
export function useLazyVideo() {
    const loadVideo = (videoEl) => {
        const sources = JSON.parse(videoEl.dataset.sources);

        // 获取CDN配置中的前3个baseUrls
        const cdnConfig = getCDNConfig();
        const baseUrls = cdnConfig.baseUrls.slice(0, 3); // 取前3个CDN

        // 为每个CDN生成source标签
        let sourceTags = '';
        baseUrls.forEach((baseUrl, index) => {
            // 构建完整的视频URL
            const videoUrl = sources.original.startsWith('/')
                ? `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${sources.original}`
                : `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${sources.original}`;

            sourceTags += `<source src="${videoUrl}" type="video/mp4">\n        `;
        });

        // 添加本地回退URL作为最后的fallback
        // 使用CDN管理器构建本地回退URL，避免重复逻辑
        let localFallbackUrl = sources.original;
        try {
            // 使用CDN管理器的本地URL构建逻辑
            localFallbackUrl = cdnManager.getResourceUrl(sources.original, {
                enableFallback: true,
                localBasePath: '',
                cacheUrls: false // 不缓存fallback URL
            });
        } catch (error) {
            // 如果CDN管理器失败，保持原始URL
            debugCDN('Failed to build local fallback URL: %O', error);
        }
        if (isDevelopment()) {
            sourceTags = `<source src="${sources.original}" type="video/mp4">` + sourceTags;
        } else {
            sourceTags += `<source src="${sources.original}" type="video/mp4">`;
        }
        // sourceTags += `<source src="${localFallbackUrl}" type="video/mp4">`;

        videoEl.innerHTML = sourceTags;
        videoEl.classList.remove('lazy-video');
        videoEl.removeAttribute('data-sources');
        const loadingIndicator = videoEl.parentNode.querySelector('.loading-indicator');
        loadingIndicator?.remove();
    };

    const scrollHandler = () => {
        document.querySelectorAll('.lazy-video').forEach(video => {
            const rect = video.getBoundingClientRect();
            if (rect.top < window.innerHeight + 200 && rect.bottom > 0) {
                loadVideo(video);
            }
        });
    };
    let tiemr;
    window.addEventListener('scroll', () => {
        if (tiemr) clearTimeout(tiemr);
        tiemr = setTimeout(scrollHandler, 100);
    });
    window.addEventListener('resize', scrollHandler);
    window.addEventListener('mouseup', () => setTimeout(scrollHandler, 0));
    scrollHandler();
}

/**
 * 将URL地址替换为CDN上的地址
 * @param url 需要替换的URL
 * @param sourceIndex CDN 源地址索引（已废弃，保留兼容性）
 * @returns 替换后的URL或原始URL
 */
export function replaceCDNBaseURL(url: string, sourceIndex = 0) {
    // 获取缓存的数据
    const originData = getCachedData();

    // 静态资源目录白名单
    const staticResourceDirs = originData.header_info.cdn_static_assets_dirs || ['images'];

    if (!url) return url;

    // 检查URL是否以任一静态资源目录开头（支持绝对路径和相对路径）
    const dirPattern = staticResourceDirs.map(dir => `^\\/?${dir}\\/`).join('|');
    const isStaticResource = new RegExp(dirPattern).test(url);

    if (!isStaticResource) {
        return url;
    }

    try {
        // 使用新的CDN管理器获取资源URL
        return cdnManager.getResourceUrl(url, {
            enableFallback: true,
            localBasePath: '',
            cacheUrls: true,
        });
    } catch (error) {
        debugCDN('Failed to get CDN URL, using original: %O', error);
        return url;
    }
}