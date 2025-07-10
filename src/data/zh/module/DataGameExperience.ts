/**
 * 游戏开发经验模块
 * 
 * 包含网站与游戏开发的完整经验时间线
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import fullstackTechStackMindmap from "../charts/FullstackTechStackMindmap.mmd";
import techDistributionSankey from "../charts/TechDistributionSankey.mmd";
import personalAbilityRadar from "../charts/PersonalAbilityRadar.mmd";
import gameTypeExperiencePie from "../charts/GameTypeExperiencePie.mmd";
import techFlowSankey from "../charts/TechFlowSankey.mmd";
import comprehensiveAbilityRadar from "../charts/ComprehensiveAbilityRadar.mmd";
import aiToolsKanban from "../charts/AIToolsKanban.mmd";

export default {
    content_head: `

### 🚀 技术演进路径
\`\`\`mermaid
${techFlowSankey}
\`\`\`
> 从传统Flash页游开发起步，历经HTML5游戏引擎、Unity 3D引擎，到现在的AI技术学习与实践，形成了完整的全栈开发技术体系。



### 💡 核心竞争优势
\`\`\`mermaid
${comprehensiveAbilityRadar}
\`\`\` 

> - **20年+网页开发经验**：深厚的Web技术基础
> - **多引擎游戏开发**：Flash、HTML5、Unity全覆盖
> - **AI技术前瞻性**：积极拥抱AI时代，向Agent工程师方向发展
> - **全栈技术能力**：前端、后端、DevOps、AI应用的综合实力



### 🎯 未来发展方向
> 专注于AI Agent技术的深度学习和实践，结合丰富的全栈开发经验，构建智能化的开发工具链和业务解决方案。


### 📈 数据洞察分析
> - **技能流向**: 从具体技术技能汇聚到技术领域，再流向职能方向，最终汇聚到AI Agent工程师角色
> - **技术分布**: 前端技术和游戏开发为核心优势，AI技术为新兴增长点
> - **综合能力**: 在网站开发、游戏开发、学习能力方面表现突出，AI技术正在快速提升
> - **能力倾向**: 在前端开发、游戏开发和学习能力方面表现突出
> - **游戏经验**: 社交模拟类和多人竞技类游戏开发经验最为丰富
> - **发展趋势**: 从传统游戏开发向AI技术融合的全栈开发转型，目标成为AI Agent工程师

---
`,
    list: [
        {
            name: "AI开发学习与实践",
            content_head: `## 🧠 自ChatGPT问世以来，我始终积极拥抱AI技术，从ChatGPT到文心一言、DeepSeek、元宝再到智谱GLM，目前虽以应用为主，但已将深入研究纳入近半年学习计划`,
            children: [
                {
                    name: "AI辅助开发实践",
                    content_head: `## 🤖 AI辅助开发实践
> 在日常开发中深度集成AI工具，显著提升开发效率和代码质量`,
                    children: [
                        {
                            name: "日常开发AI工具",
                            content_head: `- **代码生成与优化**: GPT-4, Claude, Augment, GitHub Copilot, Cursor
- **代码审查与重构**: AI代码分析工具，智能重构建议
- **文档生成**: 自动生成API文档、注释、README等
- **调试辅助**: AI错误诊断，性能瓶颈分析`,
                            content: `- **代码生成与优化**: GPT-4, Claude, Augment, GitHub Copilot, Cursor
- **代码审查与重构**: AI代码分析工具，智能重构建议
- **文档生成**: 自动生成API文档、注释、README等
- **调试辅助**: AI错误诊断，性能瓶颈分析`
                        },
                        {
                            name: "AI集成开发经验",
                            content: `- **API集成**: OpenAI API, Claude API, DeepSeek, GLM-4等大模型接口调用
- **简单AI应用**: 智能客服机器人、内容生成工具
- **工作流优化**: 通过AI工具提升开发效率40%+
- **学习能力**: 快速掌握新AI工具和技术趋势`
                        }
                    ],
                    content: `
\`\`\`mermaid
${aiToolsKanban}
\`\`\` 
`
                },
                {
                    name: "Agent工程师方向研学",
                    content_head: `## 🚀 Agent工程师方向深度学习
> 正在向AI Agent领域深度发展，专注于智能体系统的设计与实现 
`,
                    children: [
                        {
                            name: "多Agent协作系统",
                            content: `- **研究内容**: Multi-Agent协作框架设计与实现
- **核心技术**: 角色分工、任务编排、决策链路优化
- **应用场景**: 企业自动化、复杂业务流程处理
- **学习进度**: 理论学习阶段，准备实践项目`
                        },
                        {
                            name: "RAG检索增强技术",
                            content: `- **研究内容**: 向量数据库、嵌入模型、检索技术
- **核心技术**: 知识图谱构建、语义检索、上下文增强
- **应用场景**: 企业知识问答系统、智能文档助手
- **学习进度**: 深入学习中，已完成基础实验`
                        },
                        {
                            name: "Function Calling机制",
                            content: `- **研究内容**: 工具调用机制、API集成、任务执行
- **核心技术**: 函数定义、参数解析、结果处理
- **应用场景**: 智能助手、自动化工具、复杂任务执行
- **学习进度**: 实践阶段，构建工具链`
                        },
                        {
                            name: "Prompt Engineering",
                            content: `- **研究内容**: 高级提示词工程技术
- **核心技术**: Chain-of-Thought、ReAct模式、Few-shot Learning
- **应用场景**: 模型效果优化、复杂推理任务
- **学习进度**: 持续优化中，积累最佳实践`
                        },
                        {
                            name: "AI工程化实践",
                            content: `- **研究内容**: AI系统的工程化部署与管理
- **核心技术**: 模型版本管理、A/B测试、性能监控
- **应用场景**: 生产环境AI系统、企业级部署
- **学习进度**: 理论与实践并行，构建完整流程`
                        },
                        {
                            name: "多模态AI技术",
                            content: `- **研究内容**: 文本、图像、语音等多模态AI技术融合
- **核心技术**: 跨模态理解、多模态生成、模态对齐
- **应用场景**: 智能内容创作、多媒体处理
- **学习进度**: 探索阶段，关注前沿发展`
                        }
                    ]
                },
                {
                    name: "学习规划与目标",
                    content_head: `## 🎯 系统化学习路径规划
> 制定清晰的学习目标和发展路径，逐步成长为AI Agent领域专家`,
                    children: [
                        {
                            name: "短期目标（6个月内）",
                            content: `- **技术掌握**: 深入掌握LangChain/LlamaIndex框架
- **项目实践**: 构建企业级RAG系统原型
- **技能提升**: 完善Prompt Engineering技能
- **成果输出**: 完成2-3个AI Agent实践项目`
                        },
                        {
                            name: "中期目标（1-2年）",
                            content: `- **系统设计**: 设计并实现多Agent协作平台
- **业务应用**: 支持复杂业务场景自动化
- **技术深化**: 掌握AI工程化完整流程
- **影响力**: 在技术社区分享经验和见解`
                        },
                        {
                            name: "长期目标（3-5年）",
                            content: `- **专家地位**: 成为AI Agent领域的技术专家
- **行业推动**: 推动AI技术在传统行业的深度应用
- **创新贡献**: 参与前沿技术研究和标准制定
- **价值创造**: 通过AI技术为企业和社会创造更大价值`
                        }
                    ]
                }
            ]
        },
        {
            name: "网站开发经验",
            content_head: `## 🌐 全栈开发经验：20年＋（2004年起 - 企业网站、FLash页游、HTML5游戏、CI、CD自动化工具），2年全职网站开发
> 开发的游戏数量多达近半百，游戏种类覆盖全游戏类型90%。
> 其中15年＋的项目经验全是基于Web的，包括网页设计、Flash页游、HTML5多端游戏、游戏后端登录授权数据保存类、其它全栈类等。
> 2018年后，开始使用Unity/Cocos Creator引擎开发游戏，除了游戏开发外网页开发是我的第二技能。`,
            children: [
                {
                    name: "网页设计",
                    content: `- 工程化工具类 N个
- 钢铁行业网站设计 N个
- Flash动画制作 N个
- 开源简历类 1个
- 游戏后端登录授权数据保存类 1个
- 其它全栈类 3个`
                }
            ]
        },
        {
            name: "Unity引擎开发",
            content_head: `## 🎮 Unity引擎游戏开发经验
> 基于Unity引擎的多类型游戏开发，涵盖策略、经营、动作等多个游戏类型`,
            children: [
                {
                    name: "卡牌策略对战类",
                    content: `- 开发数量：2款
- 核心技术：Unity UI系统、卡牌逻辑、回合制战斗
- 项目特色：复杂的卡牌组合机制、AI对战系统`
                },
                {
                    name: "模拟经营类",
                    content: `- 开发数量：1款
- 核心技术：资源管理系统、建筑系统、经济平衡
- 项目特色：深度的经营策略玩法`
                },
                {
                    name: "大地图多人SLG类",
                    content: `- 开发数量：1款（'万国觉醒'同类产品）
- 核心技术：大地图渲染、多人同步、策略玩法
- 项目特色：大规模多人在线策略游戏`
                },
                {
                    name: "2D动作类",
                    content: `- 开发数量：1款（核心预研）
- 核心技术：2D物理引擎、动作系统、关卡设计
- 项目特色：流畅的动作体验和精确的操作手感`
                },
                {
                    name: "大地图世界经商游戏",
                    content: `- 开发数量：1款（核心预研）
- 核心技术：世界地图系统、贸易系统、经济模拟
- 项目特色：真实的商业模拟和地理贸易`
                }
            ]
        },
        {
            name: "H5引擎开发",
            content_head: `## 🌐 HTML5游戏引擎开发经验
> 基于各种H5游戏引擎的跨平台游戏开发，支持多端发布`,
            children: [
                {
                    name: "多类型融合儿童向科幻游戏",
                    content: `- 代表作品：赛尔号系列
- 开发数量：1款
- 核心技术：多游戏类型融合、儿童UI设计、科幻题材
- 项目特色：寓教于乐的儿童向游戏设计`
                },
                {
                    name: "物理引擎对战类",
                    content: `- 开发数量：1款
- 核心技术：2D物理引擎、实时对战、碰撞检测
- 项目特色：基于物理的真实对战体验`
                },
                {
                    name: "3D赛车类",
                    content: `- 开发数量：1款
- 核心技术：3D渲染、车辆物理、赛道设计
- 项目特色：流畅的3D赛车体验`
                },
                {
                    name: "单机益智类",
                    content: `- 游戏类型：泡泡龙、找茬、猜图、成语大富豪、剁手等
- 开发数量：N款
- 核心技术：休闲游戏机制、关卡设计、用户体验优化
- 项目特色：简单易上手的休闲娱乐体验`
                }
            ]
        },
        {
            name: "Flash页游开发",
            content_head: `## 🎯 Flash页游开发经验
> Flash时代的网页游戏开发，涵盖社交、竞技、RPG等多种类型`,
            children: [
                {
                    name: "社区模拟社交游戏",
                    content: `- 代表作品：抱抱城和抱抱城前身版本
- 开发数量：2款
- 核心功能：在线社交、在线唱歌、在线聊天
- 项目特色：虚拟社区的完整社交体验`
                },
                {
                    name: "儿童向社交游戏",
                    content: `- 代表作品：摩尔庄园Ⅰ、摩尔庄园Ⅱ
- 开发数量：2款
- 核心内容：超级拉姆、黑森林探险等大量剧情游戏内容
- 项目特色：社区模拟经营为核心的儿童向社交游戏`
                },
                {
                    name: "多人竞技类",
                    content: `- 游戏类型：俄罗斯方块、泡泡龙、卡片对战、滑雪、漂流、赛车等
- 开发数量：N款
- 核心技术：实时多人对战、竞技排行、匹配系统
- 项目特色：丰富的多人竞技玩法`
                },
                {
                    name: "复合型页游",
                    content: `- 代表作品：Chaos Rage
- 开发数量：1款
- 游戏类型：RPG为基础，融合SLG城建、MMO社交和轻度策略
- 项目特色：多种游戏类型的深度融合`
                },
                {
                    name: "小屋DIY类",
                    content: `- 开发数量：2款
- 核心技术：装饰系统、个性化定制、社交分享
- 项目特色：创意装饰和个性化表达`
                },
                {
                    name: "单机益智类",
                    content: `- 游戏类型：连连看等经典益智游戏
- 开发数量：N款
- 核心技术：算法优化、关卡生成、难度平衡
- 项目特色：经典益智游戏的现代化实现`
                }
            ]
        }
    ]
}