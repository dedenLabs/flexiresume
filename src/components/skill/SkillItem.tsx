import React from 'react';
import styled from 'styled-components'; 


interface SkillItemProps {
    skill: string;
    level: number;
    animate?: any;
}
const getSkillLevelColor = (level: number) => {
    switch (level) {
        case 1:
            return ['#fffbd1','#517400','#42976e']; // 浅灰色表示不熟练
        case 2:
            return  ['#f0ffd1','#016965','#ddd'];  // 浅蓝色表示熟练
        case 3:
            return ['#dcfce7','#003e17','#42976e']; // 浅绿色表示精通
        default:
            return ['#ffffff','#ffffff','#ddd']; // 默认白色
    }
}; 

export const Skill = styled.span.withConfig({
    shouldForwardProp: (prop) => prop !== 'level',
}) <{ level: number }>`
    background-color: ${({ level }) => getSkillLevelColor(level)[0]};
    color: ${({ level }) => getSkillLevelColor(level)[1]};
    padding: 2px 5px; 
    border-radius: 2px;
    font-size: 0.9em; 
`;
//border: 0.1px solid ${({ level }) => getSkillLevelColor(level)[2]}; 

 
const CardWrapper = styled.span`
  margin: 4px 0px;
  display: inline-block;
`;

/**
 * 技能项组件
 *
 * @param skill 技能名称
 * @param level 技能等级
 * @param animate 动画效果
 * @returns React元素
 */
const SkillItem: React.FC<SkillItemProps> = ({ skill, level, animate }) => {
    return (
        <CardWrapper {...animate} >
            <Skill level={level} >
                {skill}
            </Skill>
        </CardWrapper >
    );
};


export default SkillItem;
