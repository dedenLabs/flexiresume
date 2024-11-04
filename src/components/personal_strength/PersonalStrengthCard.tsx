import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import EmploymentHistoryItem from '../employment_history/EmploymentHistoryItem';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import flexiResumeStore from '../../store/Store';
import { useCollapser } from '../../utils/Tools';

interface EmploymentHistoryCardProps {
	id: string;
}

const CardWrapper = styled.div`
	display: block; 
	word-wrap: break-word;
	overflow-wrap: break-word;
	background-color: #e6fcff;
	padding: 10px;
	border-radius: 5px;
	// border: 1px solid #82c7ad;
	// color: #004545;
`;

const PersonalStrengthCard: React.FC<PersonalStrengthCardProps> = ({ id }) => {
	const data = flexiResumeStore.data;
	// 定义折叠状态，组别折叠状态默认全部展开 
	const { collapsedItems } = useCollapser(id, 1);
	// 将 content 转换为 HTML, 获取到可以实时更新数据并渲染的html结构数据
	const markdownContent = checkConvertMarkdownToHtml(data?.personal_strengths?.content || "");
	if (!collapsedItems[0]) {
		return (
			<CardWrapper>
				{/* {markdownContent} */}
				<div className='markdown-content' dangerouslySetInnerHTML={{ __html: markdownContent }} />
			</CardWrapper>
		);
	}
	return <></>
};

export default PersonalStrengthCard;
