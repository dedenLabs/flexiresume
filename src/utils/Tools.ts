import { Location } from 'react-router-dom';
import flexiResumeStore from '../store/Store';
import originData from '../data/Data';
import React, { useState, useEffect } from 'react';
import { reaction, set } from 'mobx';
import debug from 'debug';

/** 获取日志 */
export function getLogger(moduleName: string) {
    return debug('app:' + moduleName);
}
/** 获取折叠面板的日志 */
export const logCollapse = debug('app:折叠');
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
    return template.replace(/{(position|name|age|location)}/g, (_: string, p1: string) => {
        return values[p1] || ''; // 返回对应的值，或空字符串
    });
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
    // 更新当前位置
    flexiResumeStore.collapsedMap.clear();// 清空折叠信息

    // 异步加载职位数据和完整技能数据
    const [positionData, skillsData] = await Promise.all([
        originData.loadPositionData(postion),
        originData.loadSkillsData()
    ]);

    const selectedPositonData = assignDeep({}, positionData, originData.expected_positions[postion]);
    const newData = assignDeep({}, originData, selectedPositonData, { skill_level: skillsData });

    // 更新当前简历数据
    flexiResumeStore.data = newData as IFlexiResume;

    // 技能数值
    const skills = ((newData?.skill_level?.list || []) as Skill[]).sort((a, b) => {
        return a.length - b.length;
    });
    flexiResumeStore.skills = skills;

    // 技能字典对象
    const skillMap: { [key: string]: number } = {};
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
        if (!/^\d+/.test(dateStr)) return [currentYear, currentMonth];

        // 支持多种分隔符
        const separators = ['.', '/', '-'];
        let year, month;
        for (const sep of separators) {
            if (dateStr.includes(sep)) {
                [year, month] = dateStr.split(sep).map(Number);
                break;
            }
        }

        // 如果分隔符解析失败，直接尝试转换为数字
        if (!year || !month) [year, month] = dateStr.match(/\d+/g).map(Number);

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
        //     videoEl.innerHTML = `
        //     <source src="${sources.hevc}" type="video/mp4; codecs=hevc">
        //     <source src="${sources.vp9}" type="video/webm; codecs=vp9, opus">
        //     <source src="${sources.h264}" type="video/mp4; codecs=avc1.42E01E, mp4a.40.2">
        //     <source src="${sources.original}" type="video/${sources.original.split('.').pop()}">
        //   `;
        videoEl.innerHTML = ` 
        <source src="${replaceCDNBaseURL(sources.original)}" type="video/mp4">
        <source src="${replaceCDNBaseURL(sources.original, 1)}" type="video/mp4">
      `;
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
 * @param sourceIndex CDN 源地址索引
 * @returns 替换后的URL或原始URL
 */
export function replaceCDNBaseURL(url: string, sourceIndex = 0) {
    // 静态资源目录白名单
    const staticResourceDirs = originData.header_info.cdn_static_assets_dirs;

    const shouldUseCDN = originData.header_info.use_static_assets_from_cdn;
    const staticAssetsCdnBaseUrls = originData.header_info.static_assets_cdn_base_urls;
    const cdnBaseURL = shouldUseCDN ? staticAssetsCdnBaseUrls[sourceIndex] : "";

    if (!cdnBaseURL || !url) return url;

    // 检查URL是否以任一静态资源目录开头（支持绝对路径和相对路径）
    const dirPattern = staticResourceDirs.map(dir => `^\\/?${dir}\\/`).join('|');
    const isStaticResource = new RegExp(dirPattern).test(url);

    return isStaticResource
        ? (cdnBaseURL + url).replace(/^\/+/, '/') // 合并并规范化路径
        : url;
}