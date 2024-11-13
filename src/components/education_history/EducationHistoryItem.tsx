import React from 'react';
import styled from 'styled-components';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import { calculateWorkDuration } from '../../utils/Tools';
import { IModuleInfo } from '../../types/IFlexiResume';
// 简历教育信息
export interface IDataEducationInfo extends IModuleInfo {
    school_name: string;// 学校名称
    school_image: string;// 学校图片
    start_time: string;//  开始时间
    end_time: string;// 结束时间
    education_level: string;// 学历
    major: string;// 专业
}

const Card = styled.section` 
    padding: 0px 5px;   
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    justify-content: space-around;
  `;

const CardHeader = styled.header` 
    margin: 0px 5px;
    font-size: 0.8rem;
    display: flex; /* 设置为 flex 布局 */
    justify-content: space-between; /* 在两端对齐 */
    align-items: center;
    width: 100%; /* 让 CardHeader 占据父容器的整个宽度 */
`;
const CardHeaderInfo = styled.div`
  display: flex;
  align-items: center;
`;

const PositionSeparator = styled.span`
  margin: 0 0.5rem;
  font-weight: normal;
  color: #aaa; /* 分隔符颜色 */
`;

const CardHeaderWorkTime = styled.span`
    font-size: 0.75rem;
    color: #888; 
    margin-left: auto; /* 将时间段推到最右侧 */
    white-space: nowrap; /* 防止时间段换行 */
`;

const SchoolImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 20%;
  object-fit: cover;
  float: right;
  margin: 0.2rem 1rem;
`;

/**
 * 就业历史记录项组件
 *
 * @param company_name 公司名称
 * @param start_time 开始时间
 * @param end_time 结束时间
 * @param position 职位
 * @param description 描述信息，支持Markdown格式
 * @returns 返回渲染后的就业历史记录项组件
 */
const EmploymentHistoryItem: React.FC<IDataEducationInfo> = ({ school_name, school_image, start_time, end_time, education_level, major }) => {
    return (
        <Card>
            {(
                <CardHeader>
                    <SchoolImage src={school_image} />
                    <CardHeaderInfo>
                        <strong>{school_name}</strong>
                        <PositionSeparator>|</PositionSeparator>
                        {education_level}
                        <PositionSeparator>|</PositionSeparator>
                        {major}
                    </CardHeaderInfo>
                    <CardHeaderWorkTime>
                        {start_time} - {end_time}
                    </CardHeaderWorkTime>
                </CardHeader>
            )}
        </Card>
    );
};


export default EmploymentHistoryItem;
