/**
 * Agent Engineer Position Data Configuration
 *
 * This file defines the complete resume data for Agent Engineer position, including:
 * - Personal strengths and skill highlights
 * - AI/Agent related technology stack
 * - Project experience and achievements
 * - Educational background, etc.
 *
 * @author Chen Jian
 * @date 2024-12-27
 */

import { IFlexiResume } from "../../types/IFlexiResume";
// Import shared module data
import DataSkills from "../module/DataSkills";
import DataOpenSourceProject from "../module/DataOpenSourceProjects";
import DataPersonalInfluence from "../module/DataPersonalInfluence";
import DataEducationHistory from "../module/DataEducationHistory";

const DataAgentEngineer: Partial<IFlexiResume> = {
    /**
     * Personal Strengths Module - Highlighting the core competitiveness of Agent Engineer
     */
    personal_strengths: {
        "type": "personal_strengths",
        name: "Personal Strengths",
        content: `### 🤖 AI Agent Engineer｜🚀 Intelligent Agent System Architecture Expert
- #### <span style="font-size: 1.8em;">🧠 AI Agent Core Technologies</span>：Proficient in LLM integration, RAG retrieval enhancement, Function Calling, multi-modal AI application development, with complete intelligent agent system design and implementation capabilities, skilled in building efficient intelligent assistants through 🔗Prompt Engineering, 🎯Chain-of-Thought, 🔄ReAct patterns, etc.

### 🌐 Full-Stack AI Application Development:
- #### 💻 <span style="font-size: 1.5em;">End-to-End AI Products</span>：Based on OpenAI/Claude/Gemini large model APIs, construct 🤖 intelligent customer service, 📊 data analysis assistants, 🎨 creative generation tools, and other types of Agent applications, mastering 🔧Langchain/LlamaIndex frameworks and 🗃️ vector database (Pinecone/Chroma) integration.

### 🏗️ Enterprise-Level AI Infrastructure:
- #### ⚡ <span style="font-size: 1.8em;">AI Engineering Practices</span>：Design 🏭 AI model service architecture, implement 📈 model version management, 🔍 A/B testing framework, 📊 performance monitoring and alerts, supported by 🐳 Docker containerization deployment and ☁️ cloud-native technologies to handle millions of AI requests.

### 🔬 AI Technology Innovation Applications:
- #### 🎯 <span style="font-size: 1.5em;">Multi-Agent Collaboration Systems</span>：Build 🤝 Multi-Agent collaboration framework, implement 👥 role division, 🔄 task orchestration, 📋 decision chain optimization, with successful case studies in 🏢 enterprise automation, 📚 knowledge management, 🎮 game AI, etc.

### 💡 Forward-Looking Technology Exploration and Practice:
- #### 🚀 <span style="font-size: 1.5em;">Emerging AI Technology Research</span>：Deeply study 🧪 Fine-tuning, 🎭 RLHF human feedback reinforcement learning, 🔧 Tool Use tool calling, and other cutting-edge technologies, with complete transformation capabilities from research to products, continuously following 🌟 AGI development trends.

### 🎖️ Cross-Domain Technology Integration:
- #### 🔗 <span style="font-size: 1.5em;">AI + Traditional Technologies</span>：Deeply integrate 19+ years of game development and full-stack experience with AI technology, innovatively combining 🎮 game engines, 🌐 web technologies, 📱 mobile development with AI capabilities to create 🎯 differentiated intelligent product solutions.`
    },

    /**
     * AI Skills Stack Module - Dedicated AI/Agent technology stack display
     */
    ai_skills: {
        "type": "base",
        name: "AI/Agent Technology Stack",
        content: `## AI/Agent Core Technologies

### 🤖 Large Language Models and API Integration
- **OpenAI Series**: GPT-4, GPT-3.5-turbo, DALL-E, Whisper, TTS
- **Anthropic**: Claude-3 (Opus/Sonnet/Haiku), Claude-2
- **Google**: Gemini Pro/Ultra, PaLM, Bard API
- **Open Source Models**: Llama2/3, Mistral, Qwen, ChatGLM, Baichuan
- **Model Deployment**: Ollama, vLLM, TensorRT-LLM, FastChat

### 🧠 Agent Frameworks and Tools
- **Core Frameworks**: LangChain, LlamaIndex, AutoGPT, CrewAI
- **Agent Platforms**: Microsoft Semantic Kernel, Haystack, Rasa
- **Workflow Engines**: n8n, Zapier, Microsoft Power Automate
- **Multimodal**: LangChain Vision, GPT-4V, Claude Vision

### 🗃️ Vector Databases and Retrieval
- **Vector Databases**: Pinecone, Chroma, Weaviate, Qdrant, Milvus
- **Embedding Models**: OpenAI Embeddings, Sentence-BERT, BGE, M3E
- **Retrieval Techniques**: RAG, Dense Retrieval, Hybrid Search, Re-ranking
- **Knowledge Graphs**: Neo4j, ArangoDB, Amazon Neptune

### 🔧 AI Engineering Tools
- **Model Management**: MLflow, Weights & Biases, ClearML, DVC
- **Experiment Tracking**: TensorBoard, Neptune, Comet ML
- **Model Serving**: FastAPI, TorchServe, TensorFlow Serving, Triton
- **Monitoring & Alerting**: Prometheus + Grafana, DataDog, New Relic`

    },

    /**
     * Traditional Tech Stack Module
     */
    traditional_skills: {
        "type": "base",
        name: "Traditional Tech Stack",
        content: `## Full-Stack Development Technologies

### 🌐 Frontend Development
- **Core Technologies**: TypeScript, JavaScript ES6+, HTML5, CSS3
- **Frameworks & Libraries**: React 18+, Vue 3, Next.js, Nuxt.js
- **State Management**: Redux Toolkit, Zustand, Pinia, MobX
- **UI Components**: Ant Design, Material-UI, Chakra UI, Tailwind CSS
- **Build Tools**: Vite, Webpack, Rollup, Turbopack

### ⚙️ Backend Development
- **Node.js Ecosystem**: Express, Koa, Fastify, NestJS
- **Python Ecosystem**: FastAPI, Django, Flask, Tornado
- **Databases**: PostgreSQL, MongoDB, Redis, Elasticsearch
- **Message Queues**: RabbitMQ, Apache Kafka, Redis Pub/Sub
- **API Design**: RESTful, GraphQL, gRPC, WebSocket

### ☁️ Cloud-Native and DevOps
- **Containerization**: Docker, Kubernetes, Helm, Istio
- **Cloud Platforms**: AWS, Azure, Google Cloud, Alibaba Cloud, Tencent Cloud
- **CI/CD**: GitHub Actions, GitLab CI, Jenkins, Azure DevOps
- **Monitoring**: Prometheus, Grafana, ELK Stack, Jaeger
- **Infrastructure**: Terraform, Ansible, Pulumi

### 🎮 Game Development Technologies
- **Game Engines**: Unity 3D, Cocos Creator, LayaAir, Egret
- **Graphics Technologies**: WebGL, Three.js, PixiJS, Babylon.js
- **Performance Optimization**: WebAssembly, OffscreenCanvas, Web Workers
- **Cross-platform**: React Native, Flutter, Electron, Tauri`
    },

    /**
     * Employment History Module - AI/Agent Related Experience
     */
    employment_history: {
        "type": "employment_history",
        name: "Work Experience",
        list: [
            {
                company_name: "AI Unicorn Company",
                start_time: "2023.01",
                end_time: "Present",
                position: "AI Agent Architect",
                description: `### 🤖 AI Agent Platform Architecture Design
- **Core Responsibilities**: Responsible for the overall architecture design and technology selection of enterprise-level AI Agent platforms
- **Tech Stack**: LangChain + FastAPI + Redis + PostgreSQL + Docker
- **Achievements**: Built an AI assistant platform supporting tens of millions of users, processing up to 5 million requests daily+

### 🚀 Multi-Agent Collaboration System Development
- **Project Background**: Designed and implemented a multi-agent collaboration framework to support complex business scenarios
- **Technical Highlights**: Implemented agent-to-agent communication protocols, task distribution mechanisms, and result aggregation algorithms
- **Business Value**: Increased customer service efficiency by 300%, reducing labor costs by 60%

### 📊 AI Model Engineering Practice
- **Model Management**: Established a complete model version control, A/B testing, and performance monitoring system
- **Deployment Optimization**: Optimized response time to within 100ms through model quantization and inference acceleration
- **Quality Assurance**: Established AI security protection mechanisms to ensure the safety and accuracy of output content`
            },
            {
                company_name: "Prominent Internet Company",
                start_time: "2021.06",
                end_time: "2022.12",
                position: "AI Algorithm Engineer",
                description: `### 🧠 Large Model Application Development
- **Core Work**: Developed AI applications such as intelligent customer service and content generation based on GPT series models
- **Technical Breakthroughs**: Optimized model performance through Prompt Engineering and Fine-tuning
- **Project Outcomes**: Increased intelligent customer service accuracy to 95%, achieving a user satisfaction rate of 98%

### 🔍 RAG Retrieval-Augmented Generation System
- **System Design**: Built a knowledge retrieval-enhanced generation system based on vector databases
- **Tech Stack**: Elasticsearch + BERT + Transformer + Redis
- **Business Impact**: Improved knowledge-based question-answering accuracy by 40%, optimizing response speed to sub-second

### 📈 AI Product Data Analysis
- **Data-Driven**: Established an AI product effectiveness evaluation system to continuously optimize model performance
- **User Insights**: Guided product feature iteration direction through user behavior analysis
- **Commercial Value**: Helped the company's AI product line achieve a 200% annual revenue growth`
            }
        ]
    },

    /**
     * Project Experience Module - AI/Agent Related Projects
     */
    project_experience: {
        "type": "project_experience",
        name: "Project Experience",
        list: [
            {
                company: "AI Innovation Lab",
                position: "AI Agent Architect",
                duration: "2023.06 - Present",
                location: "Shanghai",
                description: `### 🤖 Enterprise-Level Intelligent Assistant Platform
**Project Background**: Constructing a unified AI assistant platform for medium and large enterprises to support intelligent transformation of multiple business scenarios

**Core Responsibilities**:
- 🏗️ **System Architecture Design**: Designed a microservice-based Agent platform architecture, supporting plug-and-play extensions and multi-tenant isolation
- 🧠 **AI Capability Integration**: Integrated multiple large models such as OpenAI, Claude, and Wenxin Yiyi, achieving intelligent routing and load balancing
- 📊 **RAG System Construction**: Build enterprise knowledge retrieval system based on vector database, accuracy improved to 85%+
- 🔧 **Toolchain Development**: Develop Function Calling toolchain, supporting database queries, API calls, file processing, etc

**Tech Stack**: Python + FastAPI + LangChain + Pinecone + Redis + Docker + K8s

**Project Achievements**:
- 📈 Supports over 100,000+ AI conversation requests daily, response time <2 seconds
- 💰 Saves 60%+ of enterprise customer service costs, improves work efficiency by 40%+
- 🏆 Achieves customer satisfaction rating of 4.8/5.0, renewal rate of 95%+`

            },
            {
                company: "Intelligent Technology Co., Ltd.",
                position: "AI Product Technical Lead",
                duration: "2022.08 - 2023.05",
                location: "Shanghai",
                description: `### 🎯 Multimodal AI Content Generation Platform
**Project Background**: Build an AI content generation SaaS platform for creative industries, supporting text, image, video, and other multimodal content creation

**Core Responsibilities**:
- 🎨 **Product Architecture**: Design a frontend-backend separated SaaS architecture, supporting multi-tenancy and elastic scaling
- 🤖 **AI Model Integration**: Integrate models like GPT-4, DALL-E, Stable Diffusion, etc., to build content generation pipelines
- 📱 **User Experience**: Build an intuitive creation interface based on React, supporting real-time preview and batch processing
- 💳 **Commercialization**: Design a Token-based billing system, achieving precise cost control and revenue analysis

**Tech Stack**: React + TypeScript + Node.js + MongoDB + AWS + Stripe

**Project Achievements**:
- 🚀 Platform gains 5000+ paying users within 3 months of launch, monthly revenue exceeds 500K
- ⚡ Content generation speed improves by 300%, significantly enhancing user creation efficiency
- 🌟 Wins multiple design awards, becoming an industry benchmark product`

            },
            {
                company: "Personal Project",
                position: "Full-Stack Developer",
                duration: "2021.12 - 2022.07",
                location: "Remote",
                description: `### 🔬 AI Code Assistant Open Source Project
**Project Background**: Develop an intelligent code generation and optimization tool based on large models, improving developer programming efficiency

**Core Responsibilities**:
- 🧠 **Model Training**: Fine-tune code generation models based on CodeT5, supporting multiple programming languages
- 🔧 **Tool Development**: Develop VS Code plugin, providing smart code completion, refactoring suggestions, Bug detection
- 📚 **Knowledge Base**: Build a programming knowledge graph, supporting context-aware code recommendations
- 🌐 **Community Operation**: Maintain GitHub open source project, gaining community contributions and feedback

**Tech Stack**: Python + Transformers + VS Code API + TypeScript + GitHub Actions

**Project Achievements**:
- ⭐ GitHub achieves 2000+ Stars, 500+ Forks, with 50+ active contributors
- 📈 Plugin downloads exceed 100K times, user satisfaction rate of 90%+
- 🏆 Featured in multiple tech media, gaining recognition from developer community`
            }
        ]
    },

    /**
     * Introduce shared module data
     */
    // Open source projects
    open_source_projects: DataOpenSourceProject,

    // Personal influence
    personal_influence: DataPersonalInfluence,

    /**
     * Target Planning Module - For AI Agent Engineer Position
     */
    target: {
        "type": "base",
        name: "Career Planning",
        content: `### 🎯 Short-term Goals (1-2 years)
- **Technical Deepening**: Deeply research cutting-edge technologies like multimodal large models, Agent collaboration frameworks, RLHF, etc
- **Product Implementation**: Lead the construction of an enterprise-level AI Agent platform, supporting millions of users
- **Team Building**: Build and lead an AI engineering team, establishing comprehensive AI development processes and standards
### 🚀 Mid-term Goals (3-5 years)  
- **Technical Leadership**: Become a technical expert in the AI Agent field, achieving a certain influence in the industry  
- **Product Innovation**: Promote the deep application and innovative breakthroughs of AI technology in traditional industries  
- **Knowledge Sharing**: Contribute to the community through technical blogs, open-source projects, and technical presentations  

### 🌟 Long-term Vision (5+ years)  
- **Technical Foresight**: Participate in the research and industrial application of AGI-related technologies  
- **Industry Advancement**: Promote the popularization and standardization of AI technology, fostering healthy industry development  
- **Value Creation**: Create greater value for society through AI technology, improving human quality of life `
    },
    education_history: {
        "type": "education_history",// Education history module  
        "name": "Education History",
        ...DataEducationHistory  // 对象结构，展开对象
    }
};

export default DataAgentEngineer;
