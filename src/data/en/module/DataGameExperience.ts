/**
 * Game Development Experience Module
 * 
 * Contains the complete experience timeline of website and game development
 * 
 * @author Chen Jian
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

### 🚀 Technical Evolution Path
\`\`\`mermaid
${techFlowSankey}
\`\`\`
> Starting from traditional Flash web game development, through HTML5 game engines, Unity 3D engines, to the current AI technology learning and practice, a complete full-stack development technology system has been formed.



### 💡 Core Competitive Advantages
\`\`\`mermaid
${comprehensiveAbilityRadar}
\`\`\` 

> - **20+ years of web development experience**: Deep foundation in Web technology
> - **Multi-engine game development**: Full coverage of Flash, HTML5, Unity
> - **Forward-looking AI technology**: Actively embracing the AI era, developing towards Agent engineer
> - **Full-stack technical capabilities**: Comprehensive strength in front-end, back-end, DevOps, and AI applications



### 🎯 Future Development Direction
> Focus on in-depth learning and practice of AI Agent technology, combined with rich full-stack development experience, to build intelligent development toolchains and business solutions. 


### 📈 Data Insight Analysis
> - **Skill Flow**: From specific technical skills to technical fields, then to functional directions, and finally converging to the AI Agent engineer role
> - **Technology Distribution**: Front-end technology and game development as core advantages, AI technology as a new growth point
> - **Comprehensive Ability**: Outstanding performance in website development, game development, and learning ability, with AI technology rapidly improving
> - **Ability Tendency**: Outstanding performance in front-end development, game development, and learning ability
> - **Game Experience**: Rich experience in social simulation and multiplayer competitive game development
> - **Development Trend**: Transformation from traditional game development to full-stack development integrating AI technology, aiming to become an AI Agent engineer

---
`,
    list: [
        {
            name: "AI Development Learning and Practice",
            content_head: `## 🧠 Since the emergence of ChatGPT, I have always actively embraced AI technology, from ChatGPT to Wenxin Yiyu, DeepSeek, Yuanbao, and Zhipu GLM, currently focusing on applications, but in-depth research has been included in the learning plan for the next half year`,
            children: [
                {
                    name: "AI-Assisted Development Practice",
                    content_head: `## 🤖 AI-Assisted Development Practice
> Deep integration of AI tools in daily development, significantly improving development efficiency and code quality`,
                    children: [
                        {
                            name: "Daily Development AI Tools",
                            content_head: `- **Code Generation and Optimization**: GPT-4, Claude, Augment, GitHub Copilot, Cursor
- **Code Review and Refactoring**: AI code analysis tools, intelligent refactoring suggestions
- **Documentation Generation**: Automatically generate API documentation, comments, README, etc.
- **Debugging Assistance**: AI error diagnosis, performance bottleneck analysis`,
                            content: `- **Code Generation and Optimization**: GPT-4, Claude, Augment, GitHub Copilot, Cursor
- **Code Review and Refactoring**: AI code analysis tools, intelligent refactoring suggestions
- **Documentation Generation**: Automatically generate API documentation, comments, README, etc.
- **Debugging Assistance**: AI error diagnosis, performance bottleneck analysis`
                        },
                        {
                            name: "AI Integrated Development Experience",
                            content: `- **API Integration**: OpenAI API, Claude API, DeepSeek, GLM-4 and other large model interface calls
- **Simple AI Applications**: Intelligent customer service robots, content generation tools
- **Workflow Optimization**: Improve development efficiency by 40%+ through AI tools
- **Learning Ability**: Quickly master new AI tools and technology trends`
                        }
                    ],
                    content: `\`\`\`mermaid
${aiToolsKanban}
\`\`\` 
`
                },
                {
                    name: "Agent Engineer Direction Research",
                    content_head: `## 🚀 In-depth Learning in Agent Engineer Direction
> Developing deeply in the AI Agent field, focusing on the design and implementation of intelligent agent systems`,
                    children: [
                        {
                            name: "Multi-Agent Collaboration System",
                            content: `- **Research Content**: Design and implementation of Multi-Agent collaboration framework
- **Core Technology**: Role division, task orchestration, decision chain optimization
- **Application Scenarios**: Enterprise automation, complex business process handling
- **Learning Progress**: Theoretical learning stage, preparing for practical projects`
                        },
                        {
                            name: "RAG Retrieval Enhancement Technology",
                            content: `- **Research Content**: Vector database, embedding model, retrieval technology
- **Core Technology**: Knowledge graph construction, semantic retrieval, context enhancement
- **Application Scenarios**: Enterprise knowledge Q&A system, intelligent document assistant
- **Learning Progress**: In-depth learning, basic experiments completed`
                        },
                        {
                            name: "Function Calling Mechanism",
                            content: `- **Research Content**: Tool calling mechanism, API integration, task execution
- **Core Technology**: Function definition, parameter parsing, result processing
- **Application Scenarios**: Intelligent assistant, automation tools, complex task execution
- **Learning Progress**: Practice stage, building toolchain`
                        },
                        {
                            name: "Prompt Engineering",
                            content: `- **Research Content**: Advanced prompt engineering technology
- **Core Technology**: Chain-of-Thought, ReAct mode, Few-shot Learning
- **Application Scenarios**: Model effect optimization, complex reasoning tasks
- **Learning Progress**: Continuously optimizing, accumulating best practices`
                        },
                        {
                            name: "AI Engineering Practice",
                            content: `- **Research Content**: Engineering deployment and management of AI systems
- **Core Technology**: Model version management, A/B testing, performance monitoring
- **Application Scenarios**: Production environment AI systems, enterprise-level deployment
- **Learning Progress**: Theory and practice in parallel, building a complete process`
                        },
                        {
                            name: "Multimodal AI Technology",
                            content: `- **Research Content**: Integration of text, image, voice and other multimodal AI technologies
- **Core Technology**: Cross-modal understanding, multimodal generation, modal alignment
- **Application Scenarios**: Intelligent content creation, multimedia processing
- **Learning Progress**: Exploratory stage, focusing on cutting-edge development`
                        }
                    ]
                },
                {
                    name: "Learning Plan and Goals",
                    content_head: `## 🎯 Systematic Learning Path Planning
> Develop clear learning goals and development paths, gradually growing into an expert in the AI Agent field`,
                    children: [
                        {
                            name: "Short-term Goals (within 6 months)",
                            content: `- **Technical Proficiency**: In-depth mastery of LangChain/LlamaIndex framework
- **Project Practice**: Build an enterprise-level RAG system prototype
- **Skill Improvement**: Improve Prompt Engineering skills
- **Outcome Output**: Complete 2-3 AI Agent practice projects`
                        },
                        {
                            name: "Mid-term Goals (1-2 years)",
                            content: `- **System Design**: Design and implement a multi-Agent collaboration platform
- **Business Application**: Support automation of complex business scenarios
- **Technical Deepening**: Master the complete process of AI engineering
- **Influence**: Share experiences and insights in the technical community`
                        },
                        {
                            name: "Long-term Goals (3-5 years)",
                            content: `- **Expert Status**: Become a technical expert in the AI Agent field
- **Industry Promotion**: Promote the deep application of AI technology in traditional industries
- **Innovative Contribution**: Participate in cutting-edge technology research and standard setting
- **Value Creation**: Create greater value for enterprises and society through AI technology`
                        }
                    ]
                }
            ]
        },
        {
            name: "Website Development Experience",
            content_head: `## 🌐 Full-stack Development Experience: 20+ years (since 2004 - enterprise websites, Flash web games, HTML5 games, CI, CD automation tools), 2 years full-time website development
> Developed nearly half a hundred games, covering 90% of all game types.
> Among them, 15+ years of project experience are all based on the Web, including web design, Flash web games, HTML5 multi-terminal games, game backend login authorization data storage, and other full-stack categories.
> Since 2018, I have started to develop games using Unity/Cocos Creator engines, in addition to game development, web development is my second skill.`,
            children: [
                {
                    name: "Web Design",
                    content: `- Engineering tools class N
- Steel industry website design N
- Flash animation production N
- Open source resume class 1
- Game backend login authorization data storage class 1
- Other full-stack class 3`
                }
            ]
        },
        {
            name: "Unity Engine Development",
            content_head: `## 🎮 Unity Engine Game Development Experience
> Multi-type game development based on Unity engine, covering strategy, business, action and other game types`,
            children: [
                {
                    name: "Card Strategy Battle Class",
                    content: `- Number of developments: 2
- Core technology: Unity UI system, card logic, turn-based combat
- Project features: Complex card combination mechanism, AI battle system`
                },
                {
                    name: "Simulation Business Class",
                    content: `- Number of developments: 1
- Core technology: Resource management system, building system, economic balance
- Project features: In-depth business strategy gameplay`
                },
                {
                    name: "Large Map Multiplayer SLG Class",
                    content: `- Number of developments: 1 ('Awakening of the World' similar product)
- Core technology: Large map rendering, multiplayer synchronization, strategy gameplay
- Project features: Large-scale multiplayer online strategy game`
                },
                {
                    name: "2D Action Class",
                    content: `- Number of developments: 1 (core pre-research)
- Core technology: 2D physics engine, action system, level design
- Project features: Smooth action experience and precise operation feel`
                },
                {
                    name: "Large Map World Business Game",
                    content: `- Number of developments: 1 (core pre-research)
- Core technology: World map system, trade system, economic simulation
- Project features: Realistic business simulation and geographical trade`
                }
            ]
        },
        {
            name: "H5 Engine Development",
            content_head: `## 🌐 HTML5 Game Engine Development Experience
> Cross-platform game development based on various H5 game engines, supporting multi-terminal release`,
            children: [
                {
                    name: "Multi-type Fusion Children's Sci-Fi Game",
                    content: `- Representative works: Saier series
- Number of developments: 1
- Core technology: Multi-game type fusion, children's UI design, science fiction theme
- Project features: Educational and entertaining children's game design`
                },
                {
                    name: "Physics Engine Battle Class",
                    content: `- Number of developments: 1
- Core technology: 2D physics engine, real-time battle, collision detection
- Project features: Realistic battle experience based on physics`
                },
                {
                    name: "3D Racing Class",
                    content: `- Number of developments: 1
- Core technology: 3D rendering, vehicle physics, track design
- Project features: Smooth 3D racing experience`
                },
                {
                    name: "Single Player Puzzle Class",
                    content: `- Game types: Bubble Shooter, Spot the Difference, Guess the Picture, Idiom Rich, Shopping, etc.
- Number of developments: N
- Core technology: Leisure game mechanism, level design, user experience optimization
- Project features: Simple and easy-to-use entertainment experience`
                }
            ]
        },
        {
            name: "Flash Web Game Development",
            content_head: `## 🎯 Flash Web Game Development Experience
> Web game development in the Flash era, covering social, competitive, RPG and other types`,
            children: [
                {
                    name: "Community Simulation Social Game",
                    content: `- Representative works: Baobao City and its predecessor version
- Number of developments: 2
- Core functions: Online social, online singing, online chat
- Project features: Complete social experience of virtual community`
                },
                {
                    name: "Children's Social Game",
                    content: `- Representative works:摩尔庄园Ⅰ, 摩尔庄园Ⅱ
- Number of developments: 2
- Core content: Super Ram, Black Forest Adventure and other large-scale plot game content
- Project features: Children's social game centered on community simulation and management`
                },
                {
                    name: "Multiplayer Competitive Class",
                    content: `- Game types: Tetris, Bubble Shooter, Card Battle, Skiing, Rafting, Racing, etc.
- Number of developments: N
- Core technology: Real-time multiplayer battle, competitive ranking, matching system
- Project features: Rich multiplayer competitive gameplay`
                },
                {
                    name: "Composite Web Game",
                    content: `- Representative works: Chaos Rage
- Number of developments: 1
- Game type: RPG-based, integrating SLG city building, MMO social and light strategy
- Project features: Deep integration of multiple game types`
                },
                {
                    name: "DIY House Class",
                    content: `- Number of developments: 2
- Core technology: Decoration system, personalized customization, social sharing
- Project features: Creative decoration and personalized expression`
                },
                {
                    name: "Single Player Puzzle Class",
                    content: `- Game types: Mahjong, etc.
- Number of developments: N
- Core technology: Algorithm optimization, level generation, difficulty balance
- Project features: Modern realization of classic puzzle games`
                }
            ]
        }
    ]
}