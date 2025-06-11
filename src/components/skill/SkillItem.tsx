import React from 'react';
import styled, { css } from 'styled-components';

interface SkillItemProps {
    skill: string;
    level: number;
    animate?: boolean;
}
 

// 技能等级配置 - 柔和但分明的颜色方案
const getSkillLevelConfig = (level: number, skill: string) => {
    switch (level) {
        case 1: // 了解 - 柔和的蓝色
            return {
                bg: 'rgba(147, 197, 253, 0.1)',
                gradient: ['#60a5fa', '#60a5fa'],
                hover: 'rgba(147, 197, 253, 0.15)',
                title: `了解${skill}，正在进行技术预研或学习阶段`,
                levelName: '了解'
            };
        case 2: // 熟练 - 适中的青色
            return {
                bg: 'rgba(94, 234, 212, 0.1)',
                gradient: ['#00493e', '#2dd4bf'],
                hover: 'rgba(94, 234, 212, 0.15)',
                title: `熟练使用${skill}，有实际项目开发经验`,
                levelName: '熟练'
            };
        case 3: // 精通 - 柔和的紫色（比熟练稍醒目）
            return {
                bg: 'rgba(196, 181, 253, 0.1)',
                gradient: ['#7a035a', '#fdc400b8'],
                hover: 'rgba(196, 181, 253, 0.15)',
                title: `精通${skill}，有丰富的实战经验，能解决复杂问题`,
                levelName: '精通'
            };
        default:
            return {
                bg: 'rgba(209, 213, 219, 0.1)',
                gradient: ['#d1d5db', '#9ca3af'],
                hover: 'rgba(209, 213, 219, 0.15)',
                title: `${skill}，技能等级未定义`,
                levelName: '未定义'
            };
    }
};

export const Skill = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'level' && prop !== 'animate',
}) <{ level: number; animate?: boolean }>`
    display: inline-flex;
    align-items: center;
    position: relative;
    padding: 0.1em 0.1em;
    border-radius: 0.2em;
    font-size: 0.875em;
    font-weight: 600;
    margin: 0.1em;
    transition: all 0.2s ease;
    background-color: ${({ level }) => getSkillLevelConfig(level, '').bg};
    cursor: help;
    line-height: 1;
    
    /* 文字样式 */
    & > span {
        display: inline-block;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        background-image: ${({ level }) => 
            `linear-gradient(90deg, ${getSkillLevelConfig(level, '').gradient.join(', ')})`};
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
        background-color: ${({ level }) => getSkillLevelConfig(level, '').hover};
        
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
    const config = getSkillLevelConfig(level, skill);
    
    return (
        <CardWrapper {...(animate || {})}>
            <Skill 
                level={level} 
                animate={animate}
                title={config.title}
                aria-label={`${config.levelName}${skill}`}
            >
                <span>{skill}</span>
            </Skill> 
        </CardWrapper>
    );
};

export default SkillItem;