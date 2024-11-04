import DataEducationHistory from "./DataEducationHistory";
import DataEmploymentHistory from "./DataEmploymentHistory";
import DataOpenSourceProject from "./DataOpenSourceProject";
import DataPersonalInfluence from "./DataPersonalInfluence";
import DataPersonalProjects from "./DataPersonalProjects";
import DataProjectExperience from "./DataProjectExperience";
import DataSkills from "./DataSkills";

export default {
    personal_strengths: {
        "type": "personal_strengths",// 个人优势模块
        name: "个人优势",
        content: `### 拥有15年以上的技术领导经验，2010年在淘米网络评选为职级技术阶梯T4-2，具备对标**阿里P9**的能力，精通全栈开发及游戏开发，专注于AI及高并发系统优化。
- 擅于解决疑难杂症、技术选型、技术攻关、系统架构、性能调优以及跨端应用方案。解决前端、后端和运维问题。
- 诺基亚时代开始，第一批开启页游时代的开发者，拥有丰富的大小型游戏项目开发经验，独立设计开发核心底层模块的能力，能够有效应对未来复杂应用场景，具备独特的竞争优势。
- 对AI领域有浓厚的兴趣，目前在电商应用（*如推荐系统、搜索引擎、视觉搜索和用户行为预测*）方面有研究，了解训练与部署，并持续学习相关技术。
- 拥有10年以上管理经验，具备敏捷开发和迭代开发的实践经验，熟悉精益方法论及KPI与OKR的应用。多次完整经历初创公司周期，参与过从0到1上市和从0到1解散，这些经历显著提升了我的个人能力，并扩展了技术覆盖面，积累了团队组建经验。
`
    },
    personal_influence: {// 个人影响力与行业认可
        "type": "base",
        name: "个人影响力与行业认可",
        content: DataPersonalInfluence
    },
    target: {
        "type": "base",// 职业规划
        name: "职业规划",
        content: ` 
寻求（
- **[居家办公-前后端开发](https://resume.deden.cn/frontend)**  
- **[云基础设施开发 / 高并发场景（电商/游戏/应用）后端开发](https://resume.deden.cn/backend)** 
- **[技术总监 / 游戏技术总监 / CTO](https://resume.deden.cn/cto)**  

）职位，致力于构建高效、可维护的系统架构，提升团队开发效率。
       `,
    },
    personal_projects: {
        "type": "project_experience",// 个人作品
        name: "个人作品",
        list: DataPersonalProjects,
    },
    open_source_project: {
        "type": "project_experience",// 开源项目
        name: "开源项目",
        list: DataOpenSourceProject
    },
    skills:
    {
        "type": "skills",// 技能模块
        name: "技术栈",
        types: DataSkills,
    },
    employment_history: {
        "type": "employment_history",// 工作经历模块
        "name": "工作经历",
        "list": DataEmploymentHistory
    },
    project_experience: {
        "type": "project_experience",// 项目经历模块
        "name": "项目经历",
        "list": DataProjectExperience
    },
    education_history: {
        "type": "education_history",// 教育经历模块
        "name": "教育经历",
        "list": DataEducationHistory
    },
}