import DataEducationHistory from "../module/DataEducationHistory";
import DataEmploymentHistory from "../module/DataEmploymentHistory";
import DataOpenSourceProject from "../module/DataOpenSourceProjects";
import DataPersonalInfluence from "../module/DataPersonalInfluence";
import DataPersonalProjects from "../module/DataPersonalProjects";
import DataProjectExperience from "../module/DataProjectExperience";
import DataSkills from "../module/DataSkills";
import DataContractTaskProjects from "../module/DataContractTaskProjects";
import DataGameProjects from "../module/DataGameProjects";
import DataAIToolsExperience from "../module/DataAIToolsExperience";
import DataGameExperience from "../module/DataGameExperience";

/**
 * Full Stack Developer Position Data
 * Comprehensive technical implementation position integrating front-end, back-end, DevOps, and AI application capabilities
 */
export default {
    personal_strengths: {
        "type": "personal_strengths",// Personal Strengths Module
        name: "Personal Strengths",
        content: `### 🚀 Full Stack Developer｜🌐 Front-end and Back-end Integration Expert｜☁️ DevOps Practitioner

### 💻 Deep Practice in Front-end Technology:
- #### <span style="font-size: 1.8em;">🌐 Deeply Cultivated TypeScript/JavaScript Technical Ecosystem</span>, Proficient in <span style="font-size: 1.5em;">⚛️React/Vue</span> Framework Systems, Led the Design of <span style="font-size: 1.5em;">Enterprise-Level Bootstrapping Toolchains</span>, Skilled in Accelerating 🚀 Through Wasm, SSR/SSG Rendering Optimization to Achieve Millisecond-Level Performance Breakthroughs ⚡.
- #### 📱 Multi-Platform Development Experience: Development of 🎮 Mini-games and Mini-programs on Platforms like WeChat/TikTok/Alipay, H5 Packaging 📦 iOS/Android and Successfully Submitted for Launch ✅.

### ⚙️ Back-end Architecture Design Capabilities:
- #### <span style="font-size: 1.8em;">Node.js Full Stack Services</span>: Constructing 🏗️ Enterprise-Level BFF Middle Layers Based on Koa/Express/Next.js, Proficient in 🔗 GraphQL/RESTful API Design.
- #### 🗃️ <span style="font-size: 1.5em;">Multi-Database Collaboration</span>: Utilizing MySQL Transactions to Ensure 💰 Data Consistency, Completed 📜 MongoDB Sharding Cluster Setup and 🗃️ Document-Type Data Storage Solutions.

### ☁️ DevOps and Cloud-Native Practices:
- #### 🚢 <span style="font-size: 1.8em;">Containerization and Microservices</span>: Completed 📦 Docker/Kubernetes Containerization Refactoring, Achieved 🛠️ Microservice Decomposition and 🚦 CI/CD Automated Deployment Processes.
- #### ⚡ <span style="font-size: 1.5em;">High-Concurrency Architecture</span>: Implemented Business Decoupling Through 🔗 RabbitMQ Message Queues, Deployed 📡 Nginx Load Balancing to Support Millions of Daily Requests, Designed 📈 Redis Caching Solutions to Reduce Response Time by 50%+.

### 🤖 AI Tools and Efficiency Improvement:
- #### <span style="font-size: 1.5em;">🧠 AI-Assisted Development</span>: Skilled in Using GPT-4, Claude, and Other Large Models for Code Generation, Debugging Optimization, and Documentation Writing, Enhancing Development Efficiency by 40%+ Through AI Tools.
- #### <span style="font-size: 1.5em;">🔧 Intelligent Toolchain</span>: Integrated AI Code Review, Automated Test Generation, and Intelligent Monitoring Alerts, Building a Modern Development Workflow.

### 🌟 Web Graphics Technology Advantages:
- #### Cross-Engine Development: Deeply Customized <span style="font-size: 1.5em;">Canvas/WebGL</span> Based on <span style="font-size: 1.5em;">🕹️CocosCreator/Three.js/Unity</span> Engines, Constructing Million DAU-Level 🎯 Projects.
- #### 📊 Engineering System: Continuously Delivering Front-end Engineering 🔧, Hybrid Mixed Development 📱, and Web Security Protection 🛡️ Solutions, Accumulating Rich Practical Experience in Micro-frontends 🔄 and Cross-End Rendering 🌐.`
    },

    fullstack_experience: {
        "type": "timeline",// Game Development Experience - Rendered Using timeline Module
        name: "Full Stack Development Experience",
        ...DataGameExperience,  // 对象结构，展开对象
        content: ``,
    },

    skills: {
        "type": "skills",// Skills Module
        name: "Technology Stack",
        ...DataSkills,  // 对象结构，展开对象
        content: ``,
    },

    // Hide Personal Influence Module, Focus on Technical Implementation
    personal_influence: { hidden: true },

    game_projects: {
        "type": "timeline",// Game Works
        "name": "Virtual Community/Game Works",
        ...DataGameProjects,  // 对象结构，展开对象
    },

    project_experience: {
        "type": "project_experience",// Project Experience Module
        "name": "Project Experience",
        ...DataProjectExperience  // 对象结构，展开对象
    },

    employment_history: {
        "type": "employment_history",// Work Experience Module
        "name": "Work Experience",
        ...DataEmploymentHistory  // 对象结构，展开对象
    },

    open_source_projects: {
        "type": "project_experience",// Open Source Projects
        "name": "Open Source Projects",
        ...DataOpenSourceProject  // 对象结构，展开对象
    },

    education_history: {
        "type": "education_history",// Education Experience Module
        "name": "Education Experience",
        ...DataEducationHistory  // 对象结构，展开对象
    },
}
