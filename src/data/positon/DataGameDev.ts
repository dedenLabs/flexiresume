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
    game_experience: {
        "type": "base",// 游戏开发经验
        name: "游戏开发经验",
        content: ` 
> ## 🕹️游戏开发经验：19年＋（2004年-2023年），中间有2年非全职游戏开发。
> > 开发的游戏数量多达近半百，游戏种类覆盖全游戏类型90%。
>
> ### Unity引擎开发：
> - 卡牌策略对战类 2款 
> - 模拟经营类 1款 
> - 大地图多人SLG类（'万国觉醒'同类产品） 1款 
> - 2D动作类（核心预研）1款 
> - 大地图世界经商游戏（核心预研） 1款 
> ### H5引擎开发：
> - 多类型融合的儿童向科幻游戏（赛尔号） 1款
> - 物理引擎对战类 1款 
> - 3D赛车类 1款 
> - 单机益智类（泡泡龙、找茬、猜图、成语大富豪、剁手等）N款
> ### Flash页游开发：
> - 社区模拟社交游戏（抱抱城和抱抱城前身版本, 在线社交、在线唱歌、在线聊天等） 2款  
> - 社区模拟经营为核心的儿童向社交游戏（摩尔庄园Ⅰ、摩尔庄园Ⅱ） 2款 
> > - 超级拉姆、黑森林探险等大量剧情游戏内容
> - 多人竞技类（俄罗斯方块、泡泡龙、卡片对战、滑雪、漂流、赛车等）N款
> - RPG为基础，融合SLG城建、MMO社交和轻度策略的复合型页游（Chaos Rage）​​ 1款 
> - 小屋DIY类 2款
> - 单机益智类（连连看、...）N款


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