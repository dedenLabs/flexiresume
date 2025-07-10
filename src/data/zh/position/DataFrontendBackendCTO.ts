import DataEducationHistory from "../module/DataEducationHistory";
import DataEmploymentHistory from "../module/DataEmploymentHistory";
import DataGameExperience from "../module/DataGameExperience";
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

    game_experience: {
        "type": "timeline",// 游戏开发经验
        name: "网站与游戏开发经验",
        ...DataGameExperience,
//         content: ` 
// > ## 🌐网页开发经验：20年＋（2004年起），2年全职网站开发。 
// > > 开发的游戏数量多达近半百，游戏种类覆盖全游戏类型90%。
// > > 其中15年＋的项目经验全是基于Web的，包括网页设计、Flash页游、HTML5多端游戏、游戏后端登录授权数据保存类、其它全栈类等。
// > > 2018年后，开始使用Unity/Cocos Creator引擎开发游戏，除了游戏开发外网页开发是我的第二技能。
// > ### 网页设计：
// > - 工程化工具类N个
// > - 钢铁行业网站设计 N个
// > - Flash动画制作N个
// > - 开源简历类1个
// > - 游戏后端登录授权数据保存类1个
// > - 其它全栈类3个
// >
// > ### Unity引擎开发：
// > - 卡牌策略对战类 2款 
// > - 模拟经营类 1款 
// > - 大地图多人SLG类（'万国觉醒'同类产品） 1款 
// > - 2D动作类（核心预研）1款 
// > - 大地图世界经商游戏（核心预研） 1款 
// > ### H5引擎开发：
// > - 多类型融合的儿童向科幻游戏（赛尔号） 1款
// > - 物理引擎对战类 1款 
// > - 3D赛车类 1款 
// > - 单机益智类（泡泡龙、找茬、猜图、成语大富豪、剁手等）N款
// > ### Flash页游开发：
// > - 社区模拟社交游戏（抱抱城和抱抱城前身版本, 在线社交、在线唱歌、在线聊天等） 2款  
// > - 社区模拟经营为核心的儿童向社交游戏（摩尔庄园Ⅰ、摩尔庄园Ⅱ） 2款 
// > > - 超级拉姆、黑森林探险等大量剧情游戏内容
// > - 多人竞技类（俄罗斯方块、泡泡龙、卡片对战、滑雪、漂流、赛车等）N款
// > - RPG为基础，融合SLG城建、MMO社交和轻度策略的复合型页游（Chaos Rage）​​ 1款 
// > - 小屋DIY类 2款
// > - 单机益智类（连连看、...）N款


//        `,
    },
    skills:
    {
        "type": "skills",// 技能模块
        name: "技术栈",
        ...DataSkills,  // 对象结构，展开对象
    },
    open_source_projects: {
        "type": "project_experience",// 开源项目
        name: "开源项目",
        ...DataOpenSourceProject  // 对象结构，展开对象
    },
    personal_projects: {
        "type": "project_experience",// 个人作品
        name: "个人作品",
        ...DataPersonalProjects,  // 对象结构，展开对象
    },
    personal_influence: {// 个人影响力与行业认可
        "type": "base",
        name: "个人影响力与行业认可",
        content: DataPersonalInfluence
    },
    project_experience: {
        "type": "project_experience",// 项目经历模块
        "name": "项目经历",
        ...DataProjectExperience  // 对象结构，展开对象
    },
    employment_history: {
        "type": "employment_history",// 工作经历模块
        "name": "工作经历",
        ...DataEmploymentHistory  // 对象结构，展开对象
    },
    education_history: {
        "type": "education_history",// 教育经历模块
        "name": "教育经历",
        ...DataEducationHistory  // 对象结构，展开对象
    },
}