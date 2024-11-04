import React from 'react';
import styled from 'styled-components';
// import ReactMarkdown from 'react-markdown';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import { calculateWorkDuration } from '../../utils/Tools';
import { EmploymentHistoryItemProps } from '../../types/IFlexiResume';


const Card = styled.section` 
    padding: 0px 5px;   
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  `;

const CardHeader = styled.header` 
    cursor: pointer;
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
  white-space: nowrap;
//   font-weight: bold;
`;


const CardBody = styled.div`
    margin: 0 0.5rem;
    font-size: 0.75rem; 
    width: 100%;
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
const EmploymentHistoryItem: React.FC<EmploymentHistoryItemProps> = ({
    index, company_name, start_time, end_time, position, description,
    collapsed,
    onToggleCollapse,
}) => {
    // 将 content 转换为 HTML, 获取到可以实时更新数据并渲染的html结构数据
    const markdownContent = checkConvertMarkdownToHtml(description);
    return (
        <Card>
            <CardHeader onClick={onToggleCollapse}>
                <CardHeaderInfo>
                    <strong>{String.fromCharCode(8544 + index)}. {company_name}</strong>
                    <PositionSeparator>|</PositionSeparator>
                    {position}
                </CardHeaderInfo>
                <CardHeaderWorkTime>
                    {start_time} - {end_time} ({calculateWorkDuration(start_time, end_time)})
                </CardHeaderWorkTime>
            </CardHeader>
            {!collapsed && (
                <CardBody>
                    {/* <ReactMarkdown>
                        {description}
                    </ReactMarkdown> */}
                    <div className='markdown-content' dangerouslySetInnerHTML={{ __html: markdownContent }} />
                </CardBody>
            )}
        </Card>
    );
};


export default EmploymentHistoryItem;
