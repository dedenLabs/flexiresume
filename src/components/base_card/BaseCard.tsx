import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { checkConvertMarkdownToHtml } from '../../utils/ParseAndReplaceSkills';
import { useCollapser } from '../../utils/Tools';
import SkillRenderer from '../skill/SkillRenderer';
import { useSafeTheme } from '../../utils/ThemeUtils';
import { SecureContentRenderer } from '../Security/SecureContentRenderer';
import { ContentWithLineWrapper } from '../timeline/ContentWithLineWrapper';

interface BaseCardProps {
	id: string;
	name: string,
	hidden?: boolean,
	showLine?: boolean, // 是否显示线条
	data: {
		content?: string
	},
}

const BaseCardWrapper = styled(motion.div)`
	width: 100%;
`;

/**
 * 基础卡片组件
 *
 * @param name 卡片名称
 * @param hidden 是否隐藏卡片
 * @param content 卡片内容，支持Markdown语法
 * @returns 返回React组件
 */
const BaseCard: React.FC<BaseCardProps> = ({ id, name, hidden, showLine = true, data: { content } }) => {
	 const { isDark } = useSafeTheme();
	const { collapsedItems } = useCollapser(name, 1);
	// 将 content 转换为 HTML, 获取到可以实时更新数据并渲染的html结构数据
	const markdownContent = checkConvertMarkdownToHtml(content);
	if (!collapsedItems[0]) {
		return (
			<BaseCardWrapper>
			<ContentWithLineWrapper isDark={isDark} showLine={showLine}>
				<SkillRenderer>
					<SecureContentRenderer
						content={markdownContent}
						contentType="html"
						className="markdown-content"
					/>
				</SkillRenderer></ContentWithLineWrapper>
			</BaseCardWrapper>
		);
	}
	return <></>
};

export default BaseCard;
