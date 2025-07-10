/**
 * 开源项目数据模块
 * 统一为对象结构，包含 content_head 和 list
 */

export default {
    content_head: ``,
    list: [
    {
        "company_name": "FlexiResume 多职位自定义简历生成器",
        "start_time": "2024/10",
        "end_time": "2024/11",
        "position": "独立完成",
        "description": `
<p align="center">
    <img class="no-effect-icon" src="images/flexiresume.webp" alt="FlexiResume" style="width:60%">
</p>
<p align="center" style="font-size:3rem">
FlexiResume
</p>

**项目起源：**

> 在找工作时，我发现即使对于一些**1-3年经验的职位**，我的简历仍被多次标记为“不合适”或“经验有差异”。
我开始思考其中的原因，探讨了年龄、学历、薪资要求等多种可能性。
虽然我的经验和能力完全能够满足岗位需求，薪资也符合岗位要求范围时，但简历却似乎未能准确传达我的核心竞争力。

> 这种情况让我意识到，**简历需要根据职位的具体需求进行个性化调整**，让招聘方能快速找到他们需要的信息。
出于这一需求，我设计了这个开源项目，目标是为自己和他人提供一种**高度自定义、可扩展的简历生成工具**。


**项目概述**  
> 开发了一款高度自定义的简历生成器，支持多职位申请，用户可以灵活配置简历内容和格式，满足不同职业的需求。

**核心功能**  
- **高度自定义**：用户可以根据个人需求自由定制简历的各个部分，确保简历能够突出个人特色与优势，为简历添加更多深度信息。
- **Markdown支持**：支持使用Markdown语言编写简历内容，简化文本格式化过程，提升用户体验。
- **技能高亮**：根据用户设定的熟练度高亮显示技能，帮助招聘方快速识别重点能力。
- **模块化配置**：简历数据模块化配置，支持根据不同职位设置不同参数和模块数量（如期望薪资、工作经历板块数量等）。
- **响应式设计**：确保简历在不同设备上均能良好展示，适应多种屏幕尺寸。
- **作品外链与时间线**：提供作品外链功能，并允许嵌套时间线描述技能或成长路径，展示用户的职业发展历程。

技术栈采用 **Vite+React+SWC+TypeScript+Mobx+framer-motion+remark-html**，项目无第三方 UI 框架嵌入，以便最大程度上支持用户的个性化调整需求。通过这一项目，我希望不仅能优化自己的求职体验，也能帮助更多人找到更合适的机会。

**项目成果**：提供了一个灵活、高效的简历生成工具，帮助用户在求职中脱颖而出，获得积极反馈。

#### [FlexiResume 开源项目 ![github](/images/github.svg) *https://github.com/dedenLabs/FlexiResume.git*](https://github.com/dedenLabs/FlexiResume.git)
> 
`
    },
    {
        "company_name": "XCast 配置生成协同工具",
        "start_time": "2024/09",
        "end_time": "至今",
        "position": "独立完成",
        "description": `--- 
<p align="center">
    <img class="no-effect-icon" src="images/xcast.webp" alt="XCast" style="width:60%">
</p>
    <p align="center" style="font-size:3rem">
XCast
</p>

**项目概述**  
> XCast 是一个专为游戏开发、软件配置管理等领域设计的 Excel 转换工具，支持将 Excel 文件高效地转换为 JSON 或 CSV 格式。
此工具特别适用于依赖复杂数据配置和多人协作的项目（如数值策划或配置信息管理），
可生成多种编程语言和框架的解析类文件，为用户提供代码提示及 Markdown 格式注释，极大提升开发效率与数据管理标准化。

**项目成就**  
> XCast 项目曾参加由 Egret 白鹭引擎主办的 **Wing IDE 开发者插件大赛**，并获得一等奖的殊荣。
此版本为基于 Adobe Air 的桌面应用，采用 AS3 语言开发，功能完备但不利于现代化扩展。
随着开源需求增加，近期已启动源码转换工作，目标是使其支持更广泛的开发环境和用户需求，开源发布也指日可待。

> #### [XCast  开源项目 ![github](/images/github.svg)  *https://github.com/dedenLabs/XCast.git*](https://github.com/dedenLabs/XCast.git)

**核心功能**  

- **多国语言支持**：便于全球化项目应用，支持多语言配置。
- **严格类型与复杂字段**：提供字段严格类型检查，支持复杂字段关系（如“引用”、“接口”、“嵌套”）的灵活配置，确保数据一致性和完整性。
- **多平台解析类生成**：可生成多种目标环境的解析类（如 TypeScript、Unity、Unreal Engine、Node.js、Go、Python、C++ 等），为开发者提供即用的高效代码。
- **代码提示和注释支持**：生成的解析类文件支持代码提示，并自动从 Excel 中获取注释（Markdown 格式），便于开发人员快速掌握配置内容。

**适用场景**  
XCast 特别适用于对配置文件和数值设定要求较高的游戏开发项目和企业软件配置管理需求：

- **游戏开发**：适合数值策划、逻辑配置及多人实时协作的开发项目，解决版本管理和数据一致性难题。
- **企业软件配置**：适合管理、标准化软件项目的配置数据，实现高效同步、转换和使用。

**技术栈**  
XCast 将使用现代化技术栈进行重构，以增强扩展性和适应性，使其可在多种开发环境和系统上高效运行。

`
    },
    ]
};