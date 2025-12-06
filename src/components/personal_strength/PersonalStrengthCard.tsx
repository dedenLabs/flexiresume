import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import EmploymentHistoryItem from '../employment_history/EmploymentHistoryItem';
import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import flexiResumeStore from '../../store/Store';
import { useCollapser } from '../../utils/Tools';
import { useTheme } from '../../theme';
import SkillRenderer from '../skill/SkillRenderer';
import { SecureContentRenderer } from '../Security/SecureContentRenderer';
import { getLogger } from '../../utils/Logger';

const logPersonalStrengthCard = getLogger('PersonalStrengthCard');

interface EmploymentHistoryCardProps {
	id: string;
}

const CardWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark?: boolean }>`
	display: block;
	word-wrap: break-word;
	overflow-wrap: break-word;
	background-color: ${props => props.isDark ? 'var(--color-card)' : 'var(--color-card)'};
	color: ${props => props.isDark ? 'var(--color-text-primary)' : 'var(--color-text-primary)'};
	padding: 10px;
	border-radius: 5px;
	border: 1px solid ${props => props.isDark ? 'var(--color-border-medium)' : 'var(--color-border-light)'};
	transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
	box-shadow: var(--color-shadow-light);

	/* 个人优势特殊样式 */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: ${props => props.isDark
			? 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(240, 230, 140, 0.05) 100%)'
			: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(240, 230, 140, 0.08) 100%)'
		};
		border-radius: 5px;
		pointer-events: none;
		z-index: -1;
	}

	position: relative;
`;

const PersonalStrengthCard: React.FC<PersonalStrengthCardProps> = ({ id, name, data: { content } }) => {
	const data = flexiResumeStore.data;
	const { isDark } = useTheme();
	// 定义折叠状态，组别折叠状态默认全部展开
	const { collapsedItems } = useCollapser(name, 1);
	// 将 content 转换为 HTML, 获取到可以实时更新数据并渲染的html结构数据
	const markdownContent = checkConvertMarkdownToHtml(content || "");
	// logPersonalStrengthCard.extend('error')('PersonalStrengthCard:'+markdownContent.length)
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
					/>
				</SkillRenderer>
			</CardWrapper>
		);
	}
	return <></>
};

export default PersonalStrengthCard;
