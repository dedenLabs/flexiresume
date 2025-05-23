import DataEducationHistory from "../module/DataEducationHistory";
import DataEmploymentHistory from "../module/DataEmploymentHistory";
import DataGameProjects from "../module/DataGameProjects";
import DataOpenSourceProject from "../module/DataOpenSourceProjects";
import DataPersonalInfluence from "../module/DataPersonalInfluence";
import DataPersonalProjects from "../module/DataPersonalProjects";
import DataProjectExperience from "../module/DataProjectExperience";
import DataSkills from "../module/DataSkills";

export default {
    personal_strengths: {
        "type": "personal_strengths",// 个人优势模块
        name: "个人优势",
        content: `#### 精通全栈开发及高并发系统优化，尤其在 Node、React、Canvas 游戏与动画开发方面具备深厚经验，拥有 React 和 Hybrid 开发优化、前端工程化、工具建设、监控及性能优化的独到见解与实践。
`
    },    
    target: {
        "type": "base",// 职业规划
        name: "职业规划",
        content: ` 
寻求（
- **[虚拟社区/游戏/组长](https://resume.deden.cn/game)**
- **[外包服务](https://resume.deden.cn/contracttask)** 
- **[居家办公-前后端开发](https://resume.deden.cn/frontend)**  
- **[云基础设施开发 / 高并发场景（电商/游戏/应用）后端开发](https://resume.deden.cn/backend)** 
- **[技术总监 / 游戏技术总监 / CTO](https://resume.deden.cn/cto)**  

）职位，致力于构建高效、可维护的系统架构，提升团队开发效率。
       `,
    },    
    skills:
    {
        "type": "skills",// 技能模块
        name: "技术栈",
        categories: DataSkills,
    },
    personal_influence: {// 个人影响力与行业认可
        "type": "base",
        name: "个人影响力与行业认可",
        content: DataPersonalInfluence
    },
    personal_projects: {
        "type": "timeline",// 个人作品
        name: "虚拟社区/游戏 作品",
        categories: DataGameProjects,
    }, 
    open_source_projects: {
        "type": "project_experience",// 开源项目
        name: "开源项目",
        list: DataOpenSourceProject
    },    
    project_experience: {
        "type": "project_experience",// 项目经历模块
        "name": "项目经历",
        "list": DataProjectExperience
    },
    employment_history: {
        "type": "employment_history",// 工作经历模块
        "name": "工作经历",
        "list": DataEmploymentHistory
    },
    education_history: {
        "type": "education_history",// 教育经历模块
        "name": "教育经历",
        "list": DataEducationHistory
    },
}