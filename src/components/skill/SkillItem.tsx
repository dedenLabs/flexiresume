import React from 'react';
import styled, { css } from 'styled-components';
import { useSafeTheme } from '../../utils/ThemeUtils';
import { getLogger } from '../../utils/Logger';
import { useI18n } from '../../i18n';

const logSkillItem = getLogger('SkillItem');



interface SkillItemProps {
    skill: string;
    level: number;
    animate?: boolean;
}


// 技能等级配置 - 支持深色模式的柔和颜色方案
const getSkillLevelConfig = (level: number, skill: string, isDark: boolean = false, t: any) => {
    // logSkillItem.extend('error')(`getSkillLevelConfig skillName=${skill}: isDark=${isDark} level=${level}`);
    switch (level) {
        case 1: // 了解 - 柔和的蓝色
            return {
                bg: isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(147, 197, 253, 0.1)',
                gradient: isDark ? ['#60a5fa', '#93c5fd'] : ['#60a5fa', '#60a5fa'],
                hover: isDark ? 'rgba(96, 165, 250, 0.25)' : 'rgba(147, 197, 253, 0.15)',
                title: t.skillLevel.familiarDescription.replace('{skill}', skill),
                levelName: t.skillLevel.familiar
            };
        case 2: // 熟练 - 适中的青色
            return {
                bg: isDark ? 'rgba(45, 212, 191, 0.15)' : 'rgba(94, 234, 212, 0.1)',
                gradient: isDark ? ['#2dd4bf', '#5eead4'] : ['#00493e', '#2dd4bf'],
                hover: isDark ? 'rgba(45, 212, 191, 0.25)' : 'rgba(94, 234, 212, 0.15)',
                title: t.skillLevel.proficientDescription.replace('{skill}', skill),
                levelName: t.skillLevel.proficient
            };
        case 3: // 精通 - 柔和的紫色（比熟练稍醒目）
            return {
                bg: isDark ? 'rgba(196, 181, 253, 0.2)' : 'rgba(196, 181, 253, 0.1)',
                gradient: isDark ? ['#c4b5fd', '#fbbf24'] : ['#7a035a', '#fdc400b8'],
                hover: isDark ? 'rgba(196, 181, 253, 0.3)' : 'rgba(196, 181, 253, 0.15)',
                title: t.skillLevel.expertDescription.replace('{skill}', skill),
                levelName: t.skillLevel.expert
            };
        default:
            return {
                bg: isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(209, 213, 219, 0.1)',
                gradient: isDark ? ['#9ca3af', '#6b7280'] : ['#d1d5db', '#9ca3af'],
                hover: isDark ? 'rgba(156, 163, 175, 0.25)' : 'rgba(209, 213, 219, 0.15)',
                title: t.skillLevel.undefinedDescription.replace('{skill}', skill),
                levelName: t.skillLevel.undefined
            };
    }
};

export const Skill = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'level' && prop !== 'animate' && prop !== 'isDark' && prop !== 't',
}) <{ level: number; animate?: boolean; isDark?: boolean; t?: any }>`
    display: inline-flex;
    align-items: center;
    position: relative;
    padding: 0.1em 0.1em;
    border-radius: 0.2em;
    font-size: 0.875em;
    font-weight: 600;
    margin: 0.1em;
    transition: all 0.3s ease;
    background-color: ${({ level, isDark = false, t }) => {
        // 为styled-components提供默认的t对象
        const defaultT = {
            skillLevel: {
                familiar: '了解',
                proficient: '熟练',
                expert: '精通',
                undefined: '未定义',
                familiarDescription: '了解{skill}，正在进行技术预研或学习阶段',
                proficientDescription: '熟练使用{skill}，有实际项目开发经验',
                expertDescription: '精通{skill}，有丰富的实战经验，能解决复杂问题',
                undefinedDescription: '{skill}，技能等级未定义'
            }
        };
        return getSkillLevelConfig(level, '', isDark, t || defaultT).bg;
    }};
    cursor: help;
    line-height: 1;

    /* 文字样式 */
    & > span {
        display: inline-block;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        background-image: ${({ level, isDark = false, t }) => {
            const defaultT = {
                skillLevel: {
                    familiar: '了解',
                    proficient: '熟练',
                    expert: '精通',
                    undefined: '未定义',
                    familiarDescription: '了解{skill}，正在进行技术预研或学习阶段',
                    proficientDescription: '熟练使用{skill}，有实际项目开发经验',
                    expertDescription: '精通{skill}，有丰富的实战经验，能解决复杂问题',
                    undefinedDescription: '{skill}，技能等级未定义'
                }
            };
            return `linear-gradient(90deg, ${getSkillLevelConfig(level, '', isDark, t || defaultT).gradient.join(', ')})`;
        }};
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
        background-color: ${({ level, isDark = false, t }) => {
            const defaultT = {
                skillLevel: {
                    familiar: '了解',
                    proficient: '熟练',
                    expert: '精通',
                    undefined: '未定义',
                    familiarDescription: '了解{skill}，正在进行技术预研或学习阶段',
                    proficientDescription: '熟练使用{skill}，有实际项目开发经验',
                    expertDescription: '精通{skill}，有丰富的实战经验，能解决复杂问题',
                    undefinedDescription: '{skill}，技能等级未定义'
                }
            };
            return getSkillLevelConfig(level, '', isDark, t || defaultT).hover;
        }};
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
    // 使用i18n hook获取翻译
    const { t } = useI18n();
    const config = getSkillLevelConfig(level, skill, isDark, t);

    // 调试信息 - 可以在开发时启用
    // logSkillItem.extend('error')(`🔍 SkillItem ${skill}: isDark=${isDark}, useSafeTheme result:`, useSafeTheme(), `config:`, config);

    return (
        <CardWrapper {...(animate || {})}>
            <Skill
                level={level}
                animate={animate}
                isDark={isDark}
                t={t}
                title={config.title}
                aria-label={`${config.levelName}${skill}`}
            >
                <span>{skill}</span>
            </Skill>
        </CardWrapper>
    );
};

export default SkillItem;