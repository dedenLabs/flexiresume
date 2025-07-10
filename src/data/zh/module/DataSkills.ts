import skillsStackMindmap from "../charts/SkillsStackMindmap.mmd";

// 技能模块
export default {
    content_head: `## 🧠 核心技能栈体系

\`\`\`mermaid
${skillsStackMindmap}
\`\`\`
 

### 💡 技能体系特色

> - **🤖 AI/Agent技术栈**: 涵盖大语言模型集成、Agent框架、向量数据库、AI工程化等前沿技术
> - **💻 编程语言精通**: 深度掌握Node.js、TypeScript、JavaScript等现代开发语言
> - **🎮 前端游戏开发**: Unity、Cocos Creator、Three.js等游戏引擎开发经验
> - **⚡ 性能优化专家**: WebAssembly、WebGL、专利传输框架等高性能技术实践
> - **☁️ 后端微服务**: 分布式架构、容器化部署、高并发系统设计能力
> - **🚀 DevOps实践**: 自动化部署、云平台运维、CICD流程优化
> - **👥 团队管理**: 10年+技术管理经验，从初创到上市的完整项目经历

---

## 🎁 技能应用与实践成果

### 🔥 核心技术优势

#### 🤖 AI技术前瞻性
> - **Agent系统设计**: 具备完整的AI Agent架构设计和实现能力
> - **LLM集成经验**: 深度集成OpenAI、Anthropic、Google等主流大模型
> - **RAG检索增强**: 向量数据库、知识图谱、检索优化的实战经验
> - **AI工程化**: 模型部署、监控、实验跟踪的完整工程化实践

#### ⚡ 性能优化专长
> - **专利技术**: 开发基于Socket协议的传输框架，性能优于protobuf
> - **核心指标优化**: LCP、FID、TTFB、FCP、TBT、TTI全方位性能提升
> - **高并发架构**: 支撑双十一等大促活动的分布式系统设计
> - **CDN策略**: 资源调度、缓存策略、防劫持等优化手段

#### 🎮 游戏开发深度
> - **多引擎精通**: Unity、Cocos Creator、LayaAir、Egret全栈游戏开发
> - **3D/VR/AR**: Three.js、WebGL、WebXR等前沿3D技术应用
> - **跨平台发布**: H5游戏打包、移动端适配、性能优化经验

#### 🏗️ 架构设计能力
> - **微服务架构**: Docker、Kubernetes、消息队列的完整实践
> - **Serverless**: 云函数、事件驱动架构的深度应用
> - **数据库设计**: MySQL、MongoDB、Redis的高性能数据方案

### 📈 项目管理与团队建设

> - **技术领导力**: 10年+技术管理经验，7-15人前端团队管理
> - **人才培养**: 50+人技术培训覆盖，完整的培训和招聘体系
> - **标准制定**: 职级评定标准、技术规范、代码审查流程建立
> - **敏捷实践**: 从初创到上市的完整项目管理经验

### 🌟 行业应用场景

适用于**电商、活动、互动游戏、直播、即时通讯（IM）、AI应用**等多种场景，具备**多语言版本**和**海外项目**经验，能够灵活应对复杂的全栈开发需求。

---
`,
    list: [
        {
            name: 'AI/Agent 技术栈',
            children: [
                {
                    name: '大语言模型与API集成',
                    content: `- **OpenAI系列**: GPT-4, GPT-3.5-turbo, DALL-E, Whisper, TTS
- **Anthropic**: Claude-3 (Opus/Sonnet/Haiku), Claude-2
- **Google**: Gemini Pro/Ultra, PaLM, Bard API
- **开源模型**: Llama2/3, Mistral, Qwen, ChatGLM, Baichuan
- **模型部署**: Ollama,  LiteLLM`//vLLM, TensorRT-LLM, FastChat
                },
                //             {
                //                 name: 'Agent框架与工具',
                //                 content: `- **核心框架**: LangChain, LlamaIndex, AutoGPT, CrewAI
                // // - **Agent平台**: Microsoft Semantic Kernel, Haystack, Rasa
                // - **工作流引擎**: n8n
                // // - **多模态**: LangChain Vision, GPT-4V, Claude Vision`
                //             },
                //             {
                //                 name: '向量数据库与检索',
                //                 content: `- **向量数据库**: Pinecone, Chroma, Weaviate, Qdrant, Milvus
                // - **嵌入模型**: OpenAI Embeddings, Sentence-BERT, BGE, M3E
                // - **检索技术**: RAG, Dense Retrieval, Hybrid Search, Re-ranking
                // - **知识图谱**: Neo4j, ArangoDB, Amazon Neptune`
                //             },
                //             {
                //                 name: 'AI工程化工具',
                //                 content: `- **模型管理**: MLflow, Weights & Biases, ClearML, DVC
                // - **实验跟踪**: TensorBoard, Neptune, Comet ML
                // - **模型服务**: FastAPI, TorchServe, TensorFlow Serving, Triton
                // - **监控告警**: Prometheus + Grafana, DataDog, New Relic`
                //             }
            ],
            content: `*具备AI Agent系统设计与实现能力，LLM集成、RAG检索增强、Function Calling、多模态AI应用开发。*`
        },
        {
            name: '编程语言',
            content: `- **精通**: Node, TypeScript, JavaScript, C#, WebAssemblyScript, ActionScript 3
- **熟练/熟悉**: C/C++, Java, Python, Golang, Php, Shell`,
        },
        {
            name: '前端开发',
            children: [
                {
                    name: '游戏开发',
                    content: `  
- **精通/熟练**: Unity, Cocos Creator, LayaAir, Egret, H5游戏包内更新, H5游戏打包, Three.js, Adobe Animate, Adobe Photoshop（美术UI生成Unity/Egret引擎UI源码）, 游戏脚手架`,
                },
                {
                    name: '框架/库',
                    content: `- **精通**: Unity, Cocos Creator, LayaAir, Egret, Three.js, Pixi.js, React, Vue, Redux/MobX, ECharts, TradingVueJs, Vite, WebPack, Pm2,
- **熟练/熟悉**: Angular, Web3.js, TradingView`,
                },
                {
                    name: 'Web3D/VR/AR 开发',
                    content: `- **精通/熟悉**: Three.js, Babylon.js, WebGL/WebGPU/WebXR, Unity WebGL`,
                },
                {
                    name: 'Hybrid 应用开发',
                    content: `- **精通/熟悉**: Cordova, React Native, Taro, Flutter, Onsen UI, Ionic, Quasar, Framework7, Weex, Electron, Harman AIR`,
                },
                {
                    name: '性能与体验',
                    content: `- **精通/熟悉**: WebAssembly, WebGL/WebGPU, OffscreenCanvas, Web Worker, Service Worker, PWA
- *具备从2G到5G时代的前端开发经验，精通TCP/UDP/Socket协议 (开发过一套**基于socket协议的传输框架**, 性能上优越与protobuf, 为公司申请过**专利技术**)，精通核心站点性能指标优化（LCP、FID、TTFB、FCP、TBT、TTI），通过资源调度、脚本优化、CDN缓存策略、CDN防劫持、端TCP请求版本缓存等技术手段，全面提升加载速度与用户交互体验。*`,
                },
            ],
            content: `*具备与 UI/UX 团队高效对接的经验，能够在技术上确保项目的性能和用户体验，适用于电商、活动、互动游戏、直播、即时通讯（IM）等场景。拥有多语言版本和账号授权等海外项目经验，能够灵活应对复杂的前端需求。*
>`,
        },
        {
            name: '后端开发',
            children: [
                {
                    name: '框架/技术',
                    content: `- **精通**:Koa, Next.js, Express, SSR/SSG, Socket, RabbitMQ, Nginx, API(BFF, GraphQL, RESTful)
- **熟练/熟悉**: Spring MVC, ELK Stack (Elasticsearch, Logstash, Kibana), WebRTC, OpenSearch`
                },
                {
                    name: '微服务架构',
                    content: `- **精通/熟悉**: Docker, Kubernetes, RabbitMQ/Kafka, Spring Boot, Spring Cloud`,
                },
                {
                    name: 'Serverless架构/事件驱动架构',
                    content: `- **精通/熟悉**: 阿里云FC/腾讯SCF/AWS Lambda/Azure Functions, API Gateway,EventBridge/Node EventEmitter`,
                },
                {
                    name: '负载均衡/缓存策略/消息队列',
                    content: `- **精通/熟悉**: Nginx/HAProxy/PM2, Redis, RabbitMQ/Kafka`,
                },
                {
                    name: '数据库',
                    content: `- **精通/熟练**: Redis, MongoDB, MySQL（SQL和NoSQL）`,
                },
            ],
            content: `*熟练掌握分布式高并发架构设计，具备在电商大促期间（如双十一）保持系统稳定的能力。通过 CDN 预分发、微服务架构、Redis缓存、限流、缓存预扣、异步处理、分表分库、读写分离等手段，有效管理后台系统。善于提前准备扩容与监控方案，保障零停机发布。*
>`,
        },
        {
            name: 'DevOps',
            children: [
                {
                    name: '自动化部署与管理',
                    content: `- **精通/熟练**: Git/SVN、Jenkins、Docker、XCode、Kubernetes（K8s）等工具，具备部署一键自动编译项目、一键自打包 Android/iOS 应用、一键发布版本的能力。`
                },
                {
                    name: '云平台实操经验',
                    content: `- **熟练/熟悉**: AWS、Azure、腾讯云和阿里云使用经验，熟悉各类云产品操作及微服务架构部署，了解 PaaS、aPaaS、边缘计算等概念。`
                },
                {
                    name: 'CICD与容器化',
                    content: `- **精通/熟练**: CICD 流程、K8s、容器化和 CDN 策略优化，能够高效构建和管理微服务架构。`
                },
                {
                    name: '工作流优化',
                    content: `- **熟练/熟悉**: 具备业务痛点消除、代码托管等部署、自动化开发及敏捷系统的实践经验。`
                },
            ],
            content: ``
        },
        {
            name: '团队管理',
            content: `- **精通/熟练**: 敏捷开发、迭代开发、精益、KPI、OKR、团队组建、成员培训、代码审查、课程分享、员工招聘。

*10年以上技术管理经验，具备从初创到上市的核心领导角色经验。曾作为核心员工兼技术领导者，负责技术选型、开发、架构设计以及职级评定标准和技术规范的制定。管理前端团队规模为 7-15 人，负责团队成员培训、代码审查、课程分享（覆盖总前端开发 50+ 人）、员工招聘等。*`,
        },
    ]
}