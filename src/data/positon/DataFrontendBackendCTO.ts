import DataEducationHistory from "../module/DataEducationHistory";
import DataEmploymentHistory from "../module/DataEmploymentHistory";
import DataOpenSourceProject from "../module/DataOpenSourceProjects";
import DataPersonalInfluence from "../module/DataPersonalInfluence";
import DataPersonalProjects from "../module/DataPersonalProjects";
import DataProjectExperience from "../module/DataProjectExperience";
import DataSkills from "../module/DataSkills";

export default {
    personal_strengths: {
        "type": "personal_strengths",// 个人优势模块
        name: "个人优势",
        content: ``
    },    
    personal_projects: {
        "type": "project_experience",// 个人作品
        name: "个人作品",
        list: DataPersonalProjects,
    },
    open_source_projects: {
        "type": "project_experience",// 开源项目
        name: "开源项目",
        list: DataOpenSourceProject
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