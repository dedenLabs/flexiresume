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
 * 全栈开发工程师岗位数据
 * 整合前端、后端、DevOps和AI应用能力的综合技术实现岗位
 */
export default {
    personal_strengths: {
        "type": "personal_strengths",// 个人优势模块
        name: "个人优势",
        content: `### 🚀 全栈开发工程师｜🌐 前后端一体化专家｜☁️ DevOps实践者

### 💻 前端技术深度实践：
- #### <span style="font-size: 1.8em;">🌐 深耕TypeScript/JavaScript技术生态</span>，精通<span style="font-size: 1.5em;">⚛️React/Vue</span>框架体系，主导设计过<span style="font-size: 1.5em;">企业级脚手架工具链</span>，擅长通过Wasm加速🚀、SSR/SSG渲染优化实现毫秒级性能突破⚡。
- #### 📱 多平台开发经验：微信/抖音/支付宝等平台的🎮小游戏和小程序开发，H5打包📦 iOS/Android并成功提审上线✅。

### ⚙️ 后端架构设计能力：
- #### <span style="font-size: 1.8em;">Node.js全栈服务</span>：基于Koa/Express/Next.js构建🏗️企业级BFF中间层，精通🔗GraphQL/RESTful API设计。
- #### 🗃️ <span style="font-size: 1.5em;">多数据库协同</span>：运用MySQL事务保障💰数据一致性，完成📜MongoDB分片集群搭建与🗃️文档型数据存取方案。

### ☁️ DevOps与云原生实践：
- #### 🚢 <span style="font-size: 1.8em;">容器化与微服务</span>：完成📦Docker/Kubernetes容器化改造，实现🛠️微服务拆分与🚦CI/CD自动化部署流程。
- #### ⚡ <span style="font-size: 1.5em;">高并发架构</span>：通过🔗RabbitMQ消息队列实现业务解耦，部署📡Nginx负载均衡支撑日均百万级请求，设计📈Redis缓存方案降低响应耗时50%+。

### 🤖 AI工具与效率提升：
- #### <span style="font-size: 1.5em;">🧠 AI辅助开发</span>：熟练使用GPT-4、Claude等大模型进行代码生成、调试优化、文档编写，通过AI工具提升开发效率40%+。
- #### <span style="font-size: 1.5em;">🔧 智能化工具链</span>：集成AI代码审查、自动化测试生成、智能监控告警等工具，构建现代化开发工作流。

### 🌟 Web图形技术优势：
- #### 跨引擎开发：基于<span style="font-size: 1.5em;">Canvas/WebGL</span>深度定制<span style="font-size: 1.5em;">🕹️CocosCreator/Three.js/Unity</span>等引擎，构建百万DAU级🎯项目。
- #### 📊 工程化体系：持续输出前端工程化🔧、Hybrid混合开发📱及Web安全防护🛡️方案，在微前端🔄、跨端渲染🌐等领域沉淀丰富实战经验💼。`
    },

    fullstack_experience: {
        "type": "timeline",// 游戏开发经验 - 使用timeline模块渲染
        name: "全栈开发经验",
        ...DataGameExperience,  // 对象结构，展开对象
        content: ``,
    },


    skills: {
        "type": "skills",// 技能模块
        name: "技术栈",
        ...DataSkills,  // 对象结构，展开对象
        content: ``,
    },

    // 隐藏个人影响力模块，专注技术实现
    personal_influence: { hidden: true },

    game_projects: {
        "type": "timeline",// 游戏作品
        "name": "虚拟社区/游戏 作品",
        ...DataGameProjects,  // 对象结构，展开对象
    },

    project_experience: {
        "type": "project_experience",// 项目经历模块
        "name": "项目经历",
        ...DataProjectExperience,  // 对象结构，展开对象
    },

    employment_history: {
        "type": "employment_history",// 工作经历模块
        "name": "工作经历",
        ...DataEmploymentHistory,  // 对象结构，展开对象
    },

    open_source_projects: {
        "type": "project_experience",// 开源项目
        "name": "开源项目",
        ...DataOpenSourceProject  // 对象结构，展开对象
    },

    education_history: {
        "type": "education_history",// 教育经历模块
        "name": "教育经历",
        ...DataEducationHistory  // 对象结构，展开对象
    },
}
