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
        "type": "personal_strengths",// Personal strengths module
        name: "Personal Strengths",
        content: ``
    },

    game_experience: {
        "type": "timeline",// Game development experience
        name: "Website and Game Development Experience",
        ...DataGameExperience,
//         content: ` 
// > ## 🌐Web Development Experience: 20+ years (since 2004), 2 years of full-time website development. 
// > > Developed nearly half a hundred games, covering 90% of all game types.
// > > Over 15 years of project experience are based on the web, including web design, Flash games, HTML5 multi-platform games, game backend login authorization data storage, other full-stack types, etc.
// > > After 2018, started developing games using Unity/Cocos Creator engines. Besides game development, web development is my second skill.
// > ### Web Design:
// > - N engineering tool types
// > - N steel industry website designs
// > - N Flash animations
// > - 1 open-source resume type
// > - 1 game backend login authorization data storage type
// > - 3 other full-stack types
// >
// > ### Unity Engine Development:
// > - 2 card strategy battle types
// > - 1 simulation management type
// > - 1 large map multiplayer SLG type ('Wang Guo Ju Xing' similar product)
// > - 1 2D action type (core R&D)
// > - 1 large map world commerce game (core R&D)
// > ### H5 Engine Development:
// > - 1 multi-type integrated children's sci-fi game (Sai Er Hao)
// > - 1 physics engine battle type
// > - 1 3D racing type
// > - N single-player puzzle types (Bubble Dragon, Find Differences, Guess Pictures, Cheng Yu Da Fu Cai, etc.)
// > ### Flash Game Development:
// > - 2 community simulation social games (Bao Bao Cheng and its predecessor versions, online social, online singing, online chatting, etc.)
// > - 2 community simulation management-based children's social games (Mo Er Yuan I, Mo Er Yuan II)
// > > - Super Lam, Black Forest Exploration, and a large amount of plot game content
// > - N multiplayer competitive types (Tetris, Bubble Dragon, card battle, skiing, rafting, racing, etc.)
// > - 1 compound game based on RPG, integrating SLG city construction, MMO social and light strategy (Chaos Rage)
// > - 2 house DIY types
// > - N single-player puzzle types (Lian Lian Kan, ...)
// >       `,
    },
    skills:
    {
        "type": "skills",// Skills module
        name: "Tech Stack",
        ...DataSkills,  // 对象结构，展开对象
    },
    open_source_projects: {
        "type": "project_experience",// Open source projects
        name: "Open Source Projects",
        ...DataOpenSourceProject  // 对象结构，展开对象
    },
    personal_projects: {
        "type": "project_experience",// Personal works
        name: "Personal Works",
        ...DataPersonalProjects,  // 对象结构，展开对象
    },
    personal_influence: {// Personal influence and industry recognition
        "type": "base",
        name: "Personal Influence and Industry Recognition",
        content: DataPersonalInfluence
    },
    project_experience: {
        "type": "project_experience",// Project experience module
        "name": "Project Experience",
        ...DataProjectExperience  // 对象结构，展开对象
    },
    employment_history: {
        "type": "employment_history",// Work experience module
        "name": "Work Experience",
        ...DataEmploymentHistory  // 对象结构，展开对象
    },
    education_history: {
        "type": "education_history",// Education experience module
        "name": "Education Experience",
        ...DataEducationHistory  // 对象结构，展开对象
    },
}
