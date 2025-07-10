import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

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

        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleMediaChange = () => {
            setIsDark(getThemeFromDOM());
        };

        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('storage', handleStorageChange);
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    return {
        isDark,
        mode: isDark ? 'dark' : 'light',
        colors: {},
        toggleMode: () => { }
    };
};

interface SkillItemProps {
    skill: string;
    level: number;
    animate?: boolean;
}


// 技能等级配置 - 支持深色模式的柔和颜色方案
const getSkillLevelConfig = (level: number, skill: string, isDark: boolean = false) => {
    // console.error(`getSkillLevelConfig skillName=${skill}: isDark=${isDark} level=${level}`);
    switch (level) {
        case 1: // 了解 - 柔和的蓝色
            return {
                bg: isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(147, 197, 253, 0.1)',
                gradient: isDark ? ['#60a5fa', '#93c5fd'] : ['#60a5fa', '#60a5fa'],
                hover: isDark ? 'rgba(96, 165, 250, 0.25)' : 'rgba(147, 197, 253, 0.15)',
                title: `了解${skill}，正在进行技术预研或学习阶段`,
                levelName: '了解'
            };
        case 2: // 熟练 - 适中的青色
            return {
                bg: isDark ? 'rgba(45, 212, 191, 0.15)' : 'rgba(94, 234, 212, 0.1)',
                gradient: isDark ? ['#2dd4bf', '#5eead4'] : ['#00493e', '#2dd4bf'],
                hover: isDark ? 'rgba(45, 212, 191, 0.25)' : 'rgba(94, 234, 212, 0.15)',
                title: `熟练使用${skill}，有实际项目开发经验`,
                levelName: '熟练'
            };
        case 3: // 精通 - 柔和的紫色（比熟练稍醒目） 
            return {
                bg: isDark ? 'rgba(196, 181, 253, 0.2)' : 'rgba(196, 181, 253, 0.1)',
                gradient: isDark ? ['#c4b5fd', '#fbbf24'] : ['#7a035a', '#fdc400b8'],
                hover: isDark ? 'rgba(196, 181, 253, 0.3)' : 'rgba(196, 181, 253, 0.15)',
                title: `精通${skill}，有丰富的实战经验，能解决复杂问题`,
                levelName: '精通'
            };
        default:
            return {
                bg: isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(209, 213, 219, 0.1)',
                gradient: isDark ? ['#9ca3af', '#6b7280'] : ['#d1d5db', '#9ca3af'],
                hover: isDark ? 'rgba(156, 163, 175, 0.25)' : 'rgba(209, 213, 219, 0.15)',
                title: `${skill}，技能等级未定义`,
                levelName: '未定义'
            };
    }
};

export const Skill = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'level' && prop !== 'animate' && prop !== 'isDark',
}) <{ level: number; animate?: boolean; isDark?: boolean }>`
    display: inline-flex;
    align-items: center;
    position: relative;
    padding: 0.1em 0.1em;
    border-radius: 0.2em;
    font-size: 0.875em;
    font-weight: 600;
    margin: 0.1em;
    transition: all 0.3s ease;
    background-color: ${({ level, isDark = false }) => getSkillLevelConfig(level, '', isDark).bg};
    cursor: help;
    line-height: 1;

    /* 文字样式 */
    & > span {
        display: inline-block;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        background-image: ${({ level, isDark = false }) =>
        `linear-gradient(90deg, ${getSkillLevelConfig(level, '', isDark).gradient.join(', ')})`};
        transition: background-image 0.3s ease;
        ${({ level }) => level === 3 && css`
            animation: masteryGradient 2s ease infinite;
            background-size: 200% 200%;
        `}
    }

    @keyframes masteryGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    &:hover {
        background-color: ${({ level, isDark = false }) => getSkillLevelConfig(level, '', isDark).hover};
        transform: translateY(-1px);

        &::after {
            opacity: 0.95;
        }
    }
`;

const CardWrapper = styled.span`
    margin: 0.1em;
    display: inline-block;
    position: relative;
`;

const SkillItem: React.FC<SkillItemProps> = ({ skill, level, animate }) => {
    // 使用安全的主题hook，支持SSR和客户端渲染
    const { isDark } = useSafeTheme();
    const config = getSkillLevelConfig(level, skill, isDark);

    // 调试信息 - 可以在开发时启用
    // console.error(`🔍 SkillItem ${skill}: isDark=${isDark}, useSafeTheme result:`, useSafeTheme(), `config:`, config);

    return (
        <CardWrapper {...(animate || {})}>
            <Skill
                level={level}
                animate={animate}
                isDark={isDark}
                title={config.title}
                aria-label={`${config.levelName}${skill}`}
            >
                <span>{skill}</span>
            </Skill>
        </CardWrapper>
    );
};

export default SkillItem;