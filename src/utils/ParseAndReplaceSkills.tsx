import React, { Fragment } from 'react';
import ReactDOMServer from 'react-dom/server';
import SkillItem from '../components/skill/SkillItem'; // 根据 SkillItem 的实际路径导入
import ReactMarkdown from 'react-markdown';
import { remark } from 'remark';
import html from 'remark-html'; 

/**
 * 服务器端渲染的Mermaid占位符组件
 * 在客户端会被真正的MermaidChart组件替换
 */
const MermaidPlaceholder: React.FC<{ chart: string; id: string }> = ({ chart, id }) => {
    return (
        <div
            className="mermaid-placeholder"
            data-mermaid-chart={chart}
            data-mermaid-id={id}
            style={{
                padding: '20px',
                backgroundColor: '#f6f8fa',
                border: '1px solid #d1d9e0',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#666',
                margin: '16px 0',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div>
                <div style={{ marginBottom: '8px', fontSize: '18px' }}>📊</div>
                正在加载 Mermaid 图表...
            </div>
        </div>
    );
};

// 轻量级代码高亮组件 - 不依赖react-syntax-highlighter
const LightCodeBlock: React.FC<{ language: string; children: string }> = ({ language, children }) => {
    // 简单的语法高亮样式映射
    const getLanguageStyle = (lang: string) => {
        const baseStyle = {
            backgroundColor: '#f6f8fa',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #d1d9e0',
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.45',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            position: 'relative' as const,
            margin: '16px 0'
        };

        // 根据语言类型添加不同的边框颜色
        const languageColors: Record<string, string> = {
            'javascript': '#f7df1e',
            'typescript': '#3178c6',
            'python': '#3776ab',
            'java': '#ed8b00',
            'csharp': '#239120',
            'cpp': '#00599c',
            'css': '#1572b6',
            'html': '#e34f26',
            'json': '#000000',
            'bash': '#4eaa25',
            'shell': '#4eaa25'
        };

        const color = languageColors[lang.toLowerCase()] || '#6e7681';
        return {
            ...baseStyle,
            borderLeft: `4px solid ${color}`
        };
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* 语言标签 */}
            <div style={{
                position: 'absolute',
                top: '8px',
                right: '12px',
                fontSize: '12px',
                color: '#6e7681',
                backgroundColor: '#ffffff',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #d1d9e0',
                zIndex: 1
            }}>
                {language}
            </div>
            <pre style={getLanguageStyle(language)}>
                <code style={{
                    backgroundColor: 'transparent',
                    padding: '0',
                    fontSize: 'inherit',
                    color: '#24292e'
                }}>
                    {children}
                </code>
            </pre>
        </div>
    );
};

// 完全禁用react-syntax-highlighter，使用轻量级方案
// 这样可以减少1.5MB+的包大小
const useOnlyLightHighlighter = true;

// 保留接口以防将来需要
const loadAdvancedSyntaxHighlighter = async (language: string) => {
    if (useOnlyLightHighlighter) {
        return null; // 强制使用轻量级高亮
    }

    // 这部分代码被禁用，以减少包大小
    return null;
};
import { visit } from 'unist-util-visit';
import flexiResumeStore from '../store/Store';
import { getLogger, replaceCDNBaseURL, replaceVariables } from './Tools';
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
                // 不使用 ReactDOMServer.renderToStaticMarkup，而是返回一个特殊的标记
                // 这个标记将在客户端被 SkillRenderer 组件处理
                return `<span data-skill-name="${skillMatch[0]}" data-skill-level="${skillMatch[1]}" class="skill-placeholder">${part}</span>`;
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
                let filePath = replaceCDNBaseURL(arr.join("."));
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

                // <source src="${filePath}_hevc.mp4" type="video/mp4; codecs=hevc">
                // <source src="${filePath}_vp9.webm" type="video/webm; codecs=vp9, opus">                    
                // <source src="${filePath}_h264.mp4" type="video/mp4; codecs=avc1.42E01E, mp4a.40.2">
                // <source src="${node.url}" type="video/${fileType}">       
                 */
                parent.children[index] = {
                    type: 'html',
                    // 暂停所有其他视频
                    value: `<div class="video-wrapper">
                        <video class="remark-video lazy-video" controls width="100%" 
                        
                        data-sources='${JSON.stringify({
                        // hevc: `${filePath}_hevc.mp4`,
                        // vp9: `${filePath}_vp9.webm`,
                        // h264: `${filePath}_h264.mp4`,
                        original: `${node.url}`,
                    })}'
                        onplay='stopOtherVideos(event)'> 
                        
                        你的浏览器不支持该视频格式
                        </video> 
                        <div class="loading-indicator">加载中...</div>
                    </div>
                    `,
                };
            }
        });


        visit(tree, 'html', (node) => {
            const videoRegex = /<video\b[^>]*\bsrc\s*=\s*["']([^"']*)["'][^>]*\/?>/gi;
            if ((!videoRegex.test(node.value))) return;
            const parser = new DOMParser();
            const doc = parser.parseFromString(node.value, 'text/html');

            doc.querySelectorAll('video').forEach(video => {
                // 1. 添加事件监听
                if (!video.hasAttribute('onplay')) {
                    video.setAttribute('onplay', 'stopOtherVideos(event)');
                }

                // 2. 处理样式
                if (!video.hasAttribute('style')) {
                    video.style.cssText = 'cursor: pointer;';
                } else if (!video.style.cssText.includes('cursor: pointer')) {
                    video.style.cssText += '; cursor: pointer;';
                }

                // 3. 处理类名
                if (!video.classList.contains('remark-video')) {
                    video.classList.add('remark-video');
                }
                if (!video.classList.contains('lazy-video')) {
                    video.classList.add('lazy-video');
                }

                // 4. 处理data-sources属性
                const videoUrl = video.getAttribute('src');
                video.dataset.sources = JSON.stringify({ original: videoUrl });

                // 5. 移除src属性
                video.removeAttribute('src');

                // 6. 修复自闭标签
                if (video.outerHTML.endsWith('/>')) {
                    video.outerHTML = video.outerHTML.replace('/>', '></video>');
                }
            });

            node.value = doc.documentElement.innerHTML;
        });
    };
}


function remarkImagesLazyLoad() {
    return (tree) => {
        visit(tree, 'image', (node) => {
            const originalUrl = replaceCDNBaseURL(node.url);
            node.url = originalUrl;
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};

            // 添加懒加载属性
            node.data.hProperties.loading = 'lazy';
            node.data.hProperties.src = originalUrl;
            // console.log(originalUrl)
            // 为每个图片添加一个点击事件
            node.data.hProperties.onClick = `$handleImageClick('${originalUrl}')`; // 使用openModal函数打开图片
            node.data.hProperties.style = 'cursor: pointer;'; // 鼠标悬停时显示指针 


            // // 修改图片外层结构，包裹在 div 中
            //     // const imageUrl = node.url; // 获取图片URL
            //     const altText = node.alt || ''; // 获取图片的alt文本

            //     // 修改node的HTML输出，将图片包裹在 div 中
            //     node.type = 'html'; // 将类型修改为html
            //     node.value = ` 
            //         <img src="${originalUrl}" alt="${altText}" onclick="window.$handleImageClick('${originalUrl}')" loading="lazy" style="${node?.data?.hProperties?.style || 'cursor: pointer;'}" />
            //   `;
            //   console.log(node.value);
        });


        visit(tree, 'html', (node) => {
            const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
            if (imgRegex.test(node.value) == false) return;

            const parser = new DOMParser();
            const doc = parser.parseFromString(node.value, 'text/html');
            doc.querySelectorAll('img').forEach(img => {
                const originalSrc = img.getAttribute('src');
                img.setAttribute('src', replaceCDNBaseURL(originalSrc));
                img.setAttribute('onclick', `window.$handleImageClick('${originalSrc}')`);
                img.style.cursor = 'pointer';
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
            node.value = doc.body.innerHTML;
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

                // 检测当前主题模式
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

                // 将节点类型改为 html，使用自定义组件
                node.type = 'html';
                const tsx = <QRCodeSVG
                    value={url}
                    size={size}
                    style={{
                        maxWidth: "100%",
                        background: isDark ? '#e2e8f0' : '#ffffff',
                        borderRadius: '8px',
                        padding: '8px'
                    }}
                    fgColor={isDark ? "#1a202c" : "#000000"}
                    bgColor={isDark ? "#e2e8f0" : "#ffffff"}
                />;
                const rendered = ReactDOMServer.renderToStaticMarkup(tsx).toString();
                logMarkdown(`二维码`, `url:${url} size:${size} isDark:${isDark} type:${node.type}
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

            // 检查是否包含代码块
            const hasCodeBlocks = /<pre>\s*<code/.test(processedContent);
            if (hasCodeBlocks) {
                // 处理代码块，优先使用轻量级高亮
                const codeBlockPromises: Promise<string>[] = [];
                const codeBlockMatches: Array<{ match: string; lang: string; code: string; index: number }> = [];

                // 收集所有代码块
                processedContent.replace(
                    /<pre>\s*<code\s*(?:class="language-(\w+)")?>([\s\S]*?)<\/code>\s*<\/pre>/g,
                    (match, lang, code, offset) => {
                        const language = lang || 'text';
                        codeBlockMatches.push({ match, lang: language, code, index: offset });
                        return match;
                    }
                );

                // 并行处理所有代码块
                for (let i = 0; i < codeBlockMatches.length; i++) {
                    const { match, lang, code } = codeBlockMatches[i];
                    codeBlockPromises.push(
                        (async () => {
                            // 特殊处理 Mermaid 图表
                            if (lang === 'mermaid') {
                                const chartId = `chart-${Date.now()}-${i}`;
                                const tsx = <MermaidPlaceholder chart={code} id={chartId} />;
                                return ReactDOMServer.renderToStaticMarkup(tsx);
                            }

                            // 尝试加载高级语法高亮
                            const advancedHighlighter = await loadAdvancedSyntaxHighlighter(lang);

                            if (advancedHighlighter) {
                                const { SyntaxHighlighter, vs } = advancedHighlighter;
                                const tsx = (
                                    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                                        <SyntaxHighlighter language={lang} style={vs}>
                                            {code}
                                        </SyntaxHighlighter>
                                    </div>
                                );
                                return ReactDOMServer.renderToStaticMarkup(tsx);
                            } else {
                                // 使用轻量级高亮
                                const tsx = <LightCodeBlock language={lang}>{code}</LightCodeBlock>;
                                return ReactDOMServer.renderToStaticMarkup(tsx);
                            }
                        })()
                    );
                }

                try {
                    const renderedCodeBlocks = await Promise.all(codeBlockPromises);

                    // 替换所有代码块
                    let blockIndex = 0;
                    processedContent = processedContent.replace(
                        /<pre>\s*<code\s*(?:class="language-(\w+)")?>([\s\S]*?)<\/code>\s*<\/pre>/g,
                        () => renderedCodeBlocks[blockIndex++]
                    );
                } catch (error) {
                    console.warn('代码高亮处理失败，使用基础样式:', error);
                    // 降级到基础样式
                    processedContent = processedContent.replace(
                        /<pre>\s*<code\s*(?:class="language-(\w+)")?>([\s\S]*?)<\/code>\s*<\/pre>/g,
                        (match, lang, code, offset) => {
                            // 特殊处理 Mermaid 图表
                            if (lang === 'mermaid') {
                                const chartId = `chart-fallback-${Date.now()}-${offset}`;
                                const tsx = <MermaidPlaceholder chart={code} id={chartId} />;
                                return ReactDOMServer.renderToStaticMarkup(tsx);
                            }

                            const tsx = <LightCodeBlock language={lang || 'text'}>{code}</LightCodeBlock>;
                            return ReactDOMServer.renderToStaticMarkup(tsx);
                        }
                    );
                }
            } else {
                // parseAndReplaceSkills 将 Markdown 文本中的技能名称替换为相应的 React 组件,Html 化.
                processedContent = parseAndReplaceSkills(processedContent, true) as string;
            }

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

/**
 * Mermaid懒加载占位符组件
 * 用于.mmd文件的懒加载渲染
 */
const MermaidLazyPlaceholder: React.FC<{ chart: string; id: string }> = ({ chart, id }) => {
    return (
        <div
            className="mermaid-lazy-placeholder"
            data-mermaid-chart={chart}
            data-mermaid-id={id}
            style={{
                padding: '20px',
                backgroundColor: '#f6f8fa',
                border: '1px solid #e1e4e8',
                borderRadius: '8px',
                textAlign: 'center',
                margin: '20px 0',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280'
            }}
        >
            <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                <div>脑图懒加载中...</div>
            </div>
        </div>
    );
};

/**
 * 自定义 remark 插件来处理 .mmd 文件导入
 * 将 .mmd 文件内容转换为懒加载的 Mermaid 图表
 */
function remarkMermaidLazyLoad() {
    return (tree) => {
        // 遍历 AST 节点，查找代码块
        visit(tree, 'code', (node, index, parent) => {
            // 检查是否是 mermaid 代码块
            if (node.lang === 'mermaid' || node.value.startsWith('mindmap')) {
                const chartContent = node.value;
                const chartId = `lazy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                // 替换成懒加载占位符
                parent.children[index] = {
                    type: 'html',
                    value: `<div class="mermaid-lazy-placeholder"
                        data-mermaid-chart="${encodeURIComponent(chartContent)}"
                        data-mermaid-id="${chartId}"
                        style="padding: 20px; background-color: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 8px; text-align: center; margin: 20px 0; min-height: 200px; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                        <div>
                            <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                            <div>脑图懒加载中...</div>
                        </div>
                    </div>`
                };
            }
        });
    };
}

/**
 * 处理包含 .mmd 文件导入的 Markdown 内容
 * 支持懒加载渲染
 */
export const parseMarkdownWithMmdLazyLoad = (content: string): string => {
    if (!content) return '';

    try {
        // 使用 remark 处理 Markdown
        const result = remark()
            .use(remarkMermaidLazyLoad) // 处理 mermaid 代码块
            .use(remarkVideoLazyLoad) // 处理视频
            .use(remarkImagesLazyLoad) // 处理图片
            .use(html, { sanitize: false }) // 转换为 HTML
            .processSync(content);

        let processedContent = String(result);

        // 替换变量
        processedContent = replaceVariables(processedContent, flexiResumeStore.data);

        return processedContent;
    } catch (error) {
        console.error('❌ parseMarkdownWithMmdLazyLoad 处理失败:', error);
        return content;
    }
};

