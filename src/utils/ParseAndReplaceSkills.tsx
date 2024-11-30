import React, { Fragment } from 'react';
import ReactDOMServer from 'react-dom/server';
import SkillItem from '../components/skill/SkillItem'; // 根据 SkillItem 的实际路径导入
import ReactMarkdown from 'react-markdown';
import { remark } from 'remark';
import html from 'remark-html';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 选择一个高亮主题
import { visit } from 'unist-util-visit';
import flexiResumeStore from '../store/Store';
import { getLogger, replaceVariables } from './Tools';
import { QRCodeSVG } from 'qrcode.react';
const logMarkdown = getLogger(`Markdown`);

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


// 支持的热门视频格式
const videoFormats = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
// 自定义 remark 插件来转换视频链接
function remarkVideoLazyLoad() {
    return (tree) => {
        // 遍历 AST 节点，查找视频链接
        visit(tree, 'link', (node, index, parent) => {
            // console.log(`检查链接是否包含视频 URL:`,node.url,node.children[0].value);
            // 检查链接是否包含视频 URL
            if (videoFormats.some(format => node.url.endsWith(format))) {
                // 替换成 HTML 视频标签
                let arr = node.url.split('.');
                let fileType = arr.pop();
                let filePath = arr.join(".");
                /**
                 * @title 批量转换视频格式
                 * 使用 convert.bat input.mp4 命令会帮忙生成其他压缩格式的视频, 可以根据客户端支持程度选择流量最小的格式
                 * 需要提前安装 ffmpeg 工具 https://ffmpeg.org/download.html
                 * -------------------------------convert.bat---------------------------------
                    @echo off
                    setlocal

                    if "%~1"=="" (
                        echo 请提供输入文件名称，例如：1.mp4
                        exit /b
                    )

                    set input=%~1
                    set filename=%~n1
                    set ext=%~x1

                    rem 转换为 H.264 格式
                    ffmpeg -i "%input%" -c:v libx264 -c:a aac "%filename%_h264%ext%"

                    rem 转换为 VP9 格式
                    ffmpeg -i "%input%" -c:v libvpx-vp9 -c:a libopus "%filename%_vp9.webm"

                    rem 转换为 HEVC 格式
                    ffmpeg -i "%input%" -c:v libx265 -c:a aac "%filename%_hevc%ext%"

                    echo 转换完成！      
                 * -------------------------------------------------------------------          
                 */
                parent.children[index] = {
                    type: 'html',
                    // 暂停所有其他视频
                    value: `<video class="remark-video" loading="lazy" controls width="100%" onplay="                    
                        document.querySelectorAll('.remark-video').forEach(video => {
                        if (video !== this) video.pause();
                        });
                        this.play();
                    "> 
                    <source src="${filePath}_hevc.mp4" type="video/mp4; codecs=hevc">
                    <source src="${filePath}_vp9.webm" type="video/webm; codecs=vp9, opus">                    
                    <source src="${filePath}_h264.mp4" type="video/mp4; codecs=avc1.42E01E, mp4a.40.2">
                    <source src="${node.url}" type="video/${fileType}">
                    你的浏览器不支持该视频格式
                    </video>`,
                };
            }
        });
    };
}


function remarkImagesLazyLoad() {
    return (tree) => {
        visit(tree, 'image', (node) => {
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};

            // 添加懒加载属性
            node.data.hProperties.loading = 'lazy';

            // 为每个图片添加一个点击事件
            node.data.hProperties.onClick = `$handleImageClick('${node.url}')`; // 使用openModal函数打开图片
            node.data.hProperties.style = 'cursor: pointer;'; // 鼠标悬停时显示指针


            // // 修改图片外层结构，包裹在 div 中
            // const imageUrl = node.url; // 获取图片URL
            // const altText = node.alt || ''; // 获取图片的alt文本

            // // 修改node的HTML输出，将图片包裹在 div 中
            // node.type = 'html'; // 将类型修改为html
            // node.value = `<div class="image-container" onclick="window.$handleImageClick('${imageUrl}')">
            //     <img src="${imageUrl}" alt="${altText}" loading="lazy" style="cursor: pointer;" />
            // </div>`;
        });

        visit(tree, 'html', (node) => {
            const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
            let match;
            while ((match = imgRegex.exec(node.value)) !== null) {
                const imgUrl = match[1];
                var newImageHtml = match[0].replace(/^<img\s/, `<img onclick="window.$handleImageClick('${imgUrl}')" loading="lazy" `)
                if (newImageHtml.search(`style="`) == -1) {
                    newImageHtml = newImageHtml.replace(/^<img\s/, `<img style="cursor: pointer;" `)
                } else {
                    newImageHtml = newImageHtml.replace(`style="`, `style="cursor: pointer;`);
                }
                node.value = node.value.replace(match[0], newImageHtml);
            }
        });
    };
}

function remarkQRCodeLazyLoad() {
    return (tree) => {
        const replace = (node) => {
            // 匹配 `QRCode: url size=200` 格式的内容
            const qrCodeRegex = /(?:[\s]|^)!QRCode:\s*(\S+)(?:\s+size=(\d+))?/g;
            const match = qrCodeRegex.exec(node.value);
            // const match = node.value.match(qrCodeRegex);
            if (match) {
                const url = match[1] || window.location.href;
                const size = parseInt(match[2], 10) || 150; // 默认尺寸为 150

                // 将节点类型改为 html，使用自定义组件
                node.type = 'html';
                const tsx = <QRCodeSVG value={url}
                    size={size}
                    style={{ maxWidth: "100%" }}
                />;
                const rendered = ReactDOMServer.renderToStaticMarkup(tsx).toString();
                logMarkdown(`二维码`, `url:${url} size:${size} type:${node.type} 
value: ${node.value} 
rendered: ${rendered.slice(0, 100)} ...
match[0]: ${match[0]}
match[1]: ${match[1]}
match[2]: ${match[2]}
`);
                node.value = node.value.replace(qrCodeRegex, rendered);
            }
        }
        // visit(tree, 'link', replace);
        visit(tree, 'html', replace);
        visit(tree, 'text', replace);
    };
}


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
            const result = await remark()
                .use(remarkQRCodeLazyLoad) // 使用自定义视频插件
                .use(remarkVideoLazyLoad) // 使用自定义视频插件
                .use(remarkImagesLazyLoad) // 懒加载
                .use(html, { sanitize: false }) // 确保转换为 HTML 
                .process(content);

            let processedContent = result.toString().trim();
            // 添加代码高亮
            processedContent = processedContent.replace(
                /<pre>\s*<code\s*(?:class="language-(\w+)")?>([\s\S]*?)<\/code>\s*<\/pre>/g,
                (match, lang, code) => {
                    const language = lang || 'ts'; // 默认使用 js 语言
                    const tsx = (
                        <div style={{ maxWidth: '100%', overflowX: 'auto' ,  whiteSpace: `pre-wrap`}}>
                            <SyntaxHighlighter language={language} style={vs}>
                                {code}
                            </SyntaxHighlighter>
                        </div>
                    );
                    const codeHtml = ReactDOMServer.renderToStaticMarkup(tsx).toString();
                    return codeHtml;
                }
            );


            // parseAndReplaceSkills 将 Markdown 文本中的技能名称替换为相应的 React 组件,Html 化.
            processedContent = parseAndReplaceSkills(processedContent, true) as string;
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
