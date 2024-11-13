import DataContractTaskProjects from "../module/DataContractTaskProjects";
import DataEducationHistory from "../module/DataEducationHistory";
import DataEmploymentHistory from "../module/DataEmploymentHistory";
import DataGameProjects from "../module/DataGameProjects";
import DataOpenSourceProjects from "../module/DataOpenSourceProjects";
import DataPersonalInfluence from "../module/DataPersonalInfluence";
import DataPersonalProjects from "../module/DataPersonalProjects";
import DataProjectExperience from "../module/DataProjectExperience";
import DataSkills from "../module/DataSkills";

export default {
    personal_strengths: {
        "type": "personal_strengths",// 个人优势模块
        name: "个人优势",
        content: `### <span style="margin-left: 2em;"></span>精通精通全栈开发及高并发系统优化，尤其在 Node、React、Canvas 游戏与动画开发方面具备深厚经验，拥有 React 和 Hybrid 开发优化、前端工程化、工具建设、监控及性能优化的独到见解与实践。
>
### <span style="margin-left: 2em;"></span>行业独有技术，将Flash开发的项目低成本完美移植到Html5项目，包括复杂的动画效果转换能力，更适合需要快速高效开发动态效果的Html5项目。
>
### <span style="margin-left: 2em;"></span>精通大型虚拟社区架构，拥有丰富项目经验，自研出成熟的社区架构体系和工具流，实现模块化高效开发。支持超大型社区的代码增量编译、资源压缩和打包发布，实现自动化上线流程。适用于 Web 超大型社区、元宇宙及 AR/VR 虚拟社区，提供高效稳定的解决方案。 


*<p align="right">---------好的架构技术真的可以一当十</p>*
`
    },
    personal_influence: {// 个人影响力与行业认可
        "type": "base",
        name: "个人影响力与行业认可",
        content: DataPersonalInfluence
    },
    contract_task: {// 外包服务
        "type": "base",
        name: "外包服务",
        content: `
> ## 承接（
> - **原 Flash 项目转 HTML5 项目**（*支持超大型项目，需要提供完整源码和资源。*）

> - **网页交互动画、广告互动等各类网页交互项目**
> （*仅提供编程和动画Html5化服务，需要提供美术动画资源与详细需求说明。*）


> - **虚拟社区架构服务**
> （*虚拟社区、元宇宙、AR/VR 虚拟社区等大型项目，提供高效稳定的解决方案*）
> <p align="center"><img src="images/me.webp" width="50%" /></p>

> ## ）服务

`
    },
    contract_task_projects: {
        "type": "timeline",// 开源项目
        name: "经典案例",
        categories: DataContractTaskProjects
    },
    personal_projects: {
        "type": "timeline",// 个人作品
        name: "虚拟社区/游戏 作品",
        categories: DataGameProjects,
    },
    skills:
    {
        "type": "skills",// 技能模块
        name: "技术栈",
        categories: DataSkills,
    },
    open_source_projects: {
        "type": "project_experience",// 开源项目
        name: "开源项目",
        list: DataOpenSourceProjects
    },
    project_experience: {
        "type": "project_experience",// 项目经历模块
        "name": "项目经历",
        "list": DataProjectExperience
    },
}