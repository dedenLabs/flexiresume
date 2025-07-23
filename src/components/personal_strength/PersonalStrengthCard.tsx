import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import EmploymentHistoryItem from '../employment_history/EmploymentHistoryItem';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import flexiResumeStore from '../../store/Store';
import { useCollapser } from '../../utils/Tools';
import { useTheme } from '../../theme';
import SkillRenderer from '../skill/SkillRenderer.tsx';
import { SecureContentRenderer } from '../Security/SecureContentRenderer';

interface EmploymentHistoryCardProps {
	id: string;
}

const CardWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
	display: block;
	word-wrap: break-word;
	overflow-wrap: break-word;
	background-color: ${props => props.isDark ? 'var(--color-surface)' : '#e6fcff'};
	color: ${props => props.isDark ? 'var(--color-text-primary)' : '#004545'};
	padding: 10px;
	border-radius: 5px;
	border: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : '#82c7ad'};
	transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
`;

const PersonalStrengthCard: React.FC<PersonalStrengthCardProps> = ({ id, name, data: { content } }) => {
	const data = flexiResumeStore.data;
	const { isDark } = useTheme();
	// 定义折叠状态，组别折叠状态默认全部展开
	const { collapsedItems } = useCollapser(name, 1);
	// 将 content 转换为 HTML, 获取到可以实时更新数据并渲染的html结构数据
	const markdownContent = checkConvertMarkdownToHtml(content || "");
	// console.error('PersonalStrengthCard:'+markdownContent.length)
	if (!collapsedItems[0]) {
		return (
			<CardWrapper isDark={isDark}>
				{/* <SkillRenderer>
					<div className='markdown-content' dangerouslySetInnerHTML={{ __html: markdownContent }} />
				</SkillRenderer> */}
				<SkillRenderer>
					<SecureContentRenderer
						content={markdownContent}
						contentType="html"
						className="markdown-content"
						trustedZone={false}
					/>
				</SkillRenderer>
			</CardWrapper>
		);
	}
	return <></>
};

export default PersonalStrengthCard;
