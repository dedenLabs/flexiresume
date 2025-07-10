
import DataEducationHistory from "../module/DataEducationHistory";
import DataEmploymentHistory from "../module/DataEmploymentHistory";
import DataGameExperience from "../module/DataGameExperience";
import DataGameProjects from "../module/DataGameProjects";
import DataOpenSourceProject from "../module/DataOpenSourceProjects";
import DataPersonalInfluence from "../module/DataPersonalInfluence";
import DataPersonalProjects from "../module/DataPersonalProjects";
import DataProjectExperience from "../module/DataProjectExperience";
import DataSkills from "../module/DataSkills";

export default {
    personal_strengths: {
        "type": "personal_strengths",// Personal Strengths Module
        name: "Personal Strengths",
        content: ``
    },
    game_experience: {
        "type": "timeline",// Game Development Experience
        name: "Game Development Experience",
        ...DataGameExperience, 
//         content: ` 
// > ## 🕹️Game Development Experience: 19+ years (2004-2023), with 2 years of part-time game development.
// > > Developed nearly half a hundred games, covering 90% of all game types.
// >
// > ### Unity Engine Development:
// > - 2 Card Strategy Battle Games
// > - 1 Simulation Management Game
// > - 1 Large Map Multiplayer SLG Game ('Wang Guo Jué Xǐng' similar product)
// > - 1 2D Action Game (Core R&D)
// > - 1 Large Map World Trade Game (Core R&D)
// > ### H5 Engine Development:
// > - 1 Multi-type Fusion Science Fiction Game for Children (Sai Er Hao)
// > - 1 Physics Engine Battle Game
// > - 1 3D Racing Game
// > - N Single-player Puzzle Games (Bubble Dragon, Find Differences, Guess Pictures, Cheng Yu Da Fu Cai, etc.)
// > ### Flash Browser Game Development:
// > - 2 Community Simulation Social Games (Bào Bào Chéng and its predecessor versions, online social, online singing, online chatting, etc.)
// > - 2 Community Simulation Management-based Social Games for Children (Mó Lè Yuán I, Mó Lè Yuán II)
// > > - Super Lam, Black Forest Adventure, and a large amount of narrative game content
// > - N Multiplayer Competitive Games (Tetris, Bubble Dragon, Card Battle, Skiing, Rafting, Racing, etc.)
// > - 1 Composite Browser Game based on RPG, integrating SLG city construction, MMO social, and light strategy (Chaos Rage)
// > - 2 House DIY Games
// > - N Single-player Puzzle Games (Lian Lian Kan, ...)
// >       `,
    },
    skills:
    {
        "type": "skills",// Skills Module
        name: "Tech Stack",
        ...DataSkills,
    },
    personal_influence: {// Personal Influence and Industry Recognition
        "type": "base",
        name: "Personal Influence and Industry Recognition",
        content: DataPersonalInfluence
    },
    personal_projects: {
        "type": "timeline",// Personal Projects
        name: "Virtual Community/Game Works",
        ...DataGameProjects,
    },
    open_source_projects: {
        "type": "project_experience",// Open Source Projects
        name: "Open Source Projects",
        ...DataOpenSourceProject  // 对象结构，展开对象
    },
    project_experience: {
        "type": "project_experience",// Project Experience Module
        "name": "Project Experience",
        ...DataProjectExperience
    },
    employment_history: {
        "type": "employment_history",// Work Experience Module
        "name": "Work Experience",
        ...DataEmploymentHistory  // 展开对象，包含 list 和 content_head
    },
    education_history: {
        "type": "education_history",// Education Experience Module
        "name": "Education Experience",
        ...DataEducationHistory  // 对象结构，展开对象
    },
}
