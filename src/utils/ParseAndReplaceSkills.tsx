import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SkillItem from '../components/skill/SkillItem'; // 根据 SkillItem 的实际路径导入
import ReactMarkdown from 'react-markdown';
import { remark } from 'remark';
import html from 'remark-html';
import flexiResumeStore from '../store/Store';
import { replaceVariables } from './Tools';

interface Skill {
    name: string;
    level: number;
}

/**
 * 解析并替换文本中的技能名称，将技能名称替换为相应的 React 组件。
 *
 * @param text 要解析的文本字符串。
 * @param animate 动画配置对象，默认为空对象。
 * @param useHtml 是否返回 HTML 字符串，默认为 false。
 * @returns 如果 useHtml 为 true，则返回替换后的 HTML 字符串；否则返回一个包含 React 组件的数组。
 */
export const parseAndReplaceSkills = (text: string, useHtml = false): string | React.FC<any> | React.FC<any>[] => {
    if (!text) return '';
    // 技能数值
    const skills = flexiResumeStore.skills;

    // 技能字典对象
    const skillMap = flexiResumeStore.skillMap;

    const skillNames: string[] = skills.map(([skill]) =>
        skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 将特殊字符全部转义
    );
    // console.log(`(${skillNames.join('|')})`)
    const skillRegex = new RegExp(`(${skillNames.join('|')})`, 'gui');
    if (useHtml) {
        const result = text.replace(skillRegex, (part: string, index: number) => {
            const skillMatch = skillMap[part.toLocaleLowerCase()];
            if (skillMatch) {
                const tsx = <SkillItem key={`${skillMatch[0]}-${index}`} skill={skillMatch[0]} level={skillMatch[1]} />;
                // 仅在客户端渲染技能组件
                if (typeof window !== "undefined") {
                    return ReactDOMServer.renderToStaticMarkup(tsx).toString();
                } 
            }
            return part;
        })
        return result;
    } else {
        const parts = text.split(skillRegex);
        return parts.map((part, index) => {
            const skillMatch = skillMap[part] != undefined;
            if (skillMatch) {
                return <SkillItem key={`${part}-${index}`} skill={part} level={skillMap[part]} /> as any;
            }
            return part;
        });
    }

};

/**
* 将 Markdown 文本转换为 HTML 文本，并可选地添加动画效果
*
* @param content 需要转换的 Markdown 文本
* @param animate 动画效果配置对象，默认为空对象，具体配置可根据实际需求定义
* @returns 转换后的 HTML 文本
* @example
*  将 content 转换为 HTML, 获取到可以实时更新数据并渲染的html结构数据
*  const markdownContent = checkConvertMarkdownToHtml(description); 
*  <div dangerouslySetInnerHTML={{ __html: markdownContent }} />
*/
export const checkConvertMarkdownToHtml = (content: string) => {
    const [htmlContent, setHtmlContent] = React.useState<string>('');

    React.useEffect(() => {
        const convertMarkdownToHtml = async () => {
            const result = await remark().use(html).process(content);
            // parseAndReplaceSkills 将 Markdown 文本中的技能名称替换为相应的 React 组件,Html 化.
            let processedContent = parseAndReplaceSkills(result.toString().trim(), true) as string;
            // Markdown 标签包裹，去除多余的 p 标签
            processedContent = processedContent.replace(/^<p>(.*?)<\/p>$/g, '$1');
            processedContent = replaceVariables(processedContent, flexiResumeStore.data);
            // 刷新数据
            setHtmlContent(processedContent);
        };

        convertMarkdownToHtml();
    }, [content]);

    return htmlContent;
};
