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
        content: `### 🎮 虚拟社区技术领袖｜🛠️ 资源转换方案专家
- #### <span style="font-size: 1.8em;">💻 高性能前端架构设计</span>：作为淘米创始团队核心成员，主导《<a href="https://mole.61.com" trget="_blank">摩尔庄园</a>》《<a href="https://s.61.com" targt="_blank">赛尔号H5</a>》等标杆项目技术架构，设计高性能游戏架构，🏗️支持中重度游戏开发与横向扩展，实现同屏千人流畅交互，沉淀出社区类产品工业化开发范式。
### 💎 资源转换技术攻坚：
- #### ⚡ <span style="font-size: 1.5em;">Flash遗产焕新专家</span>：研发🔄动画资源智能转换引擎，实现🎨Flash素材95%+无损迁移至HTML5平台，成功复刻🔍《摩尔庄园》经典玩法，节省70%+美术资源重构成本。
- #### 🌐 <span style="font-size: 1.5em;">跨平台移植方案</span>：建立📦游戏资产自动化转换流水线，支持🖼️Spine动画/🕹️Cocos组件/📡WebGL渲染等技术的无缝衔接，缩短多平台适配周期60%+。

### 🏆 技术顾问服务优势：
- #### 🧩 <span style="font-size: 1.8em;">全周期解决方案</span>：提供从💻遗留系统评估到🔧架构改造的完整技术路线图，独创🔄「资源-逻辑-表现」三层迁移模型，解决🛡️代码腐化与🌌技术债务难题。
- #### 📈 <span style="font-size: 1.5em;">成本优化专家</span>：通过🚀自动化测试框架+📊智能回归验证，降低传统迁移方案50%+人力投入，实现💰ROI可量化的技术改造。

`
    },
    contract_task: {// 外包服务
        "type": "base",
        name: "技术顾问服务 / 资源转换服务 / 外包服务",
        content: `
> ### 独有的<span style="font-size:1.5em;color:#c00">资源转换</span>与<span style="font-size:1.5em;color:#a00">迁移技术</span>，让<span style="font-size:1.2em;"> HTML5 </span>游戏<span style="font-size:1.5em;color:#0a0"> 开发效率</span>几何倍提升。
> 
> ---
> 
> ## 承接（
> - **原 Flash 经典项目 转 HTML5 项目**（*支持超大型项目，需要提供完整源码和资源。*）

> - **Flash动画转HTML5动画、网页交互动画、广告互动等各类网页交互项目**
> （*仅提供编程和动画Html5化服务，需要提供美术动画资源与详细需求说明。*）

> - **技术顾问服务 + 外部资源转换服务** 

> <p align="center"><img src="images/me.webp" width="40%" /></p>

> ## ）服务

`
    },
    personal_influence: {// 个人影响力与行业认可
        "type": "base",
        name: "个人影响力 与 行业认可",
        content: DataPersonalInfluence
    },
    html5_game_bottleneck: {// HTML5游戏行业瓶颈 与 解决方案
        "type": "timeline",
        name: "HTML5游戏行业瓶颈 与 解决方案",
        categories: [
            {
                name: 'HTML5游戏行业瓶颈',
                content: `
> 由于以上限制，需表现力丰富的情况下行业大多采用最简陋的**逐帧动画**方案，这不仅会导致**高内存消耗**，还会影响**画质**，形成较大的技术门槛。
>
`,
                children: [
                    {
                        name: 'HTML5行业动画资源没有专业深度优化的解决方案',
                        content: `
- 动画表现力方向非常薄弱，需要做以下几个方面的平衡工作： **画质**、**动画流畅度**、**网络加载**、**体验优化**、**性能**等。
`
                    },
                    {
                        name: '关于画质和流畅度',
                        content: `
- **画质和流畅度方面**的优化空间可能有限。常规采用了大量序列图，这导致了资源量非常大，直接影响了加载体验并增加了性能和内存开销。
- 如果为了**提升性能**而减少序列帧数，那么**画面流畅度**将会大幅下降，造成画面体验变差。
`
                    },
                    {
                        name: '关于动画资源',
                        content: `
- 目前H5行业的**动画资源制作**仍处于非常原始的阶段，主要采用**逐帧动画**或**骨骼动画**。
`
                    },
                ]
            },
            {
                name: '解决方案',
                content: `
> 这里以腾讯《洛克王国Flash页游版》的宠物素材 来举例
>
`,
                children: [
                    {
                        name: '逐帧动画',
                        content: ``,
                        children: [
                            {
                                name: '以腾讯《洛克王国Flash页游版》的宠物素材来举例👇',
                                content: `
> ![alt text](images/game/h5/pet-6.webp)
> ![alt text](images/game/h5/pet-5.webp)
> 上图为洛克王国页游版的宠物精灵（非骨骼动画）编号为\`1076\`，帧数量\`398\`帧，最小尺寸\`428*314\`:
> **单张图**压缩后约\`90kb\`，可得出以下结论:
>  
> 
> **宠物包含以下动作组:**
> - IDLE: \`50\`帧
> - STB: \`25\`帧
> - BTS: \`25\`帧
> - APPEAR: \`19\`帧
> - ATTACK: \`60\`帧
> - UNDER_ATTACK: \`4\`帧
> - BEAT_DOWN: \`65\`帧
> - MISS: \`63\`帧
> - MAGIC_START: \`28\`帧
> - MAGIC_FOCUS: \`21\`帧
> - MAGIC_END: \`11\`帧
> - DEAD: \`27\`帧
>
> 方案对比👇
`
                            },
                            {
                                name: '未优化👿 - 体积76M-内存408M-不支持特效',
                                content: `
> **保证画质和画面流畅度:**
> 
> - **总帧数：** 398帧 = \`50+25+25+19+60+4+65+63+28+21+11+27\`
> 
> - **体积：** <span style="font-size:2rem;color:#c00">76.416MB</span> = \`96kb × 398 × 2(两只不同的精灵对战)\`
> 
> - **内存：** <span style="font-size:2rem;color:#c00">408MB</span> = \`428(长) × 314(高) × 4(像素字节) × 398(总数) /1024(字节) /1024(字节) × 2(两只不同的精灵对战)\`
> 
> - **特效：** 不支持通道和滤镜。
> 
> - **体验：** 内存大、加载慢、位图多解码导致卡顿。
`
                            },
                            {
                                name: '常规优化',
                                content: ``,
                                children: [
                                    {
                                        name: '砍帧方案😟 - 体积19M-内存102M-不支持特效',
                                        content: ` 
>  
> - **总帧数：** 约100帧 =398帧/4
> 
> - **体积：** <span style="font-size:2rem;color:#c00">约19MB</span> = 76.416MB/4
> 
> - **内存：** <span style="font-size:2rem;color:#c00">约102MB</span> = 408MB/4
> 
> - **特效：** 不支持通道和滤镜。
> 
> - **体验：** 依然是内存大、加载慢、位图多解码导致卡顿且**降低流畅度**，画面会有跳帧的感觉。
`
                                    },
                                    {
                                        name: '缩小尺寸方案😟 - 体积?M-内存?M-不支持特效-降低清晰度',
                                        content: ` 
> *还有缩小尺寸降低内存消耗和资源体积大小，画面会变模糊。*
`
                                    },
                                ]
                            },
                            {
                                name: '资源转换服务 - ⚡高清、流畅、无砍帧',
                                content: ``,
                                children: [
                                    {
                                        name: '纯矢量图方案🙂',
                                        content: ` 
> > ## 体积(<span style="font-size:2rem;color:#0c0">490KB</span> = 245KB × 2)-内存小于 <span style="font-size:1.5rem;color:#Ac0">490KB*10</span>-支持特效
> > 无画质和画面流畅度问题，仅需考虑性能优化方案
> > 
> > **总帧数：** 398帧
> > 
> > **体积：** 矢量图版**490KB** (490KB = 245KB × 2)
> > 
> > **内存：** 为动画配置解码后数据体积:
> > 
> > \`\`\` js
> > 490KB > 实际体积 < 490KB × 10
> > \`\`\`
> > **特效：** 支持通道和滤镜。
> > 
> > **体验：** 内存极小、加载极快、无卡顿，需考虑低端机渲染性能。
> > 
    `
                                    },
                                    {
                                        name: '纯位图方案🙂',
                                        content: `
> > ## 体积(<span style="font-size:2rem;color:#0c0">596KB</span> = 298KB × 2)-小于13MB-支持特效
> > 无画质流畅度问题，需考虑画质和内存优化方案
> > 
> > **总帧数：** $398帧$
> > 
> > **体积：** 位图版**596KB** (596KB = 298KB(配置文件 + 位图体积) × 2)
> > 
> > **内存：** 
> > \`\`\` js
> > 13MB(可与矢量图结合降低内存) = 
> > (
> >   (1024(长) × 1024(高) × 4(像素字节)
> >                 + 
> >   (628(长) × 1024(高) × 4(像素字节)
> > )   ×    2(两只不同的精灵对战)
> > \`\`\`
> > **特效：** 支持通道和滤镜。
> > 
> > **体验：** 内存偏大、加载快、无卡顿，需考虑内存。
> > 
> > **输出：** 图1:<img loading="lazy" src="images/game/h5/pet-bitmap1.webp" style="width:100px"/>图2:<img loading="lazy" src="images/game/h5/pet-bitmap2.webp" style="height:100px"/>
> >
    `
                                    },
                                    {
                                        name: '矢量图和位图结合😃',
                                        content: `
> **最佳方案：** 根据实际情况来设置局部位图或局部矢量图，并得到最佳资源文件。
> 能、体积、内存、体验各方面数值在纯矢量版和纯位图版之间。
    `
                                    },
                                ]
                            },
                            {
                                name: '资源优化方案对比📖 - 百倍提升',
                                content: `
> > *加载体积降低了 <span style="font-size:2rem;color:#0c0">**155倍**</span> 
内存降低了 <span style="font-size:2rem;color:#0c0">**81倍-800倍**</span> 
,纯位图版降低 <span style="font-size:1.5rem">**31倍**</span> 
图片解码消耗降低了 <span style="font-size:1.5rem">**n倍到30倍+**</span>。 
不仅仅只是**性能和体验**的提升，开发工程师与美术之间的**协作工作流**也大幅度提升，
<span style="font-size:1.5rem;color:#0cc">无法估量</span>。*
 
        `,
                                children: [
                                    {
                                        name: '常规方案',
                                        content: ` 
> <table  style="background-color:#fff0f0">
>     <thead>
>         <tr>
>             <th><strong>优化方案</strong></th>
>             <th><strong>总帧数</strong></th>
>             <th><strong>体积</strong></th>
>             <th><strong>内存</strong></th>
>             <th><strong>特效</strong></th>
>             <th><strong>体验</strong></th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td><strong>未优化 - 保证画质</strong></td>
>             <td>398帧</td>
>             <td><strong><span style="font-size:1.2em;color:#a00">76MB</span></strong></td>
>             <td><strong><span style="font-size:1.2em;color:#f00">408MB</span></strong> = 428(长) × 314(高) × 4(字节) × 398(帧数) / 1024 / 1024 × 2 (两只精灵)</td>
>             <td>不支持通道和滤镜</td>
>             <td>内存大、加载慢、位图解码卡顿</td>
>         </tr>
>         <tr>
>             <td><strong>砍帧方案 - 降低流畅度</strong></td>
>             <td>100帧(<strong>砍帧</strong>)</td>
>             <td><strong><span style="font-size:1.2em;color:#a00">19MB</span></strong></td>
>             <td><strong><span style="font-size:1.2em;color:#f00">102MB</span></strong> = 408MB / 4</td>
>             <td>不支持通道和滤镜</td>
>             <td>内存大、加载慢、位图解码卡顿</td>
>         </tr>
>     </tbody>
> </table>
`
                                    },
                                    {
                                        name: '超级优化方案',
                                        content: ` 
>  ---
>  <strong>资源转换服务-解决方案-<span style="font-size:1.5em;color:#a0a">高清流畅无砍帧</span>👇</strong>
>  ---
>  
>  <table  style="background-color:#f0fff0">
>      <thead>
>          <tr>
>              <th><strong>优化方案</strong></th>
>              <th><strong>总帧数</strong></th>
>              <th><strong>体积</strong></th>
>              <th><strong>内存</strong></th>
>              <th><strong>特效</strong></th>
>              <th><strong>体验</strong></th>
>          </tr>
>      </thead>
>      <tbody> 
>          <tr>
>              <td><strong>矢量图方案</strong></td>
>              <td>398帧</td>
>              <td><span style="font-size:1.2em;color:#0a0"><strong>490KB</strong></span></td>
>              <td>大于<strong><span style="font-size:1.2em;color:#aa0">490KB</span></strong>小于<span style="font-size:1.2em;color:#aa0"><strong>490KB × 10</strong></span></td>
>              <td>支持通道和滤镜</td>
>              <td>内存极小、加载极快、性能一般，需考虑低端机渲染性能</td>
>          </tr>
>          <tr>
>              <td><strong>位图方案</strong></td>
>              <td>398帧</td>
>              <td><strong><span style="font-size:1.2em;color:#0a0">596KB</span></strong></td>
>              <td><span style="font-size:1.2em;color:#aa0"><strong>13MB</strong></span>(可与矢量图结合降低内存) = (1024 × 1024 × 4 + 628 × 1024 × 4) × 2 (两只精灵)</td>
>              <td>支持通道和滤镜</td>
>              <td>内存偏大、加载快、无卡顿性能极高，需考虑内存优化</td>
>          </tr>
>          <tr>
>              <td><strong><span style="font-size:1.2em;color:#000">最佳方案</span><br/>(矢量/位图结合)</strong></td>
>              <td>398帧</td>
>              <td>两则之间</td>
>              <td>两则之间</td>
>              <td>支持通道和滤镜</td>
>              <td>内存中等、加载快、无卡顿，性能高</td>
>          </tr>
>      </tbody>
>  </table>
                `
                                    }
                                ]
                            },
                        ]
                    },
                ]
            },
        ],
    },
    tech_consulting: {// 技术顾问服务
        "type": "timeline",
        name: "技术顾问服务 + 外部资源转换服务",
        content: ``,
        list: [
            {
                name: '服务亮点',
                content: `
>   通过资源转换服务，官方团队可以专注于**核心逻辑开发**，简化开发过程。
                `,
                children: [
                    {
                        name: '降低开发复杂度',
                        content: `
>   通过资源转换服务，官方团队可以专注于**核心逻辑开发**，简化开发过程。
                        `,
                    },
                    {
                        name: '成本效率提升',
                        content: `
>   资源转换服务减少了开发冗余，显著提升了项目的**性能**。
                        `,
                    },
                    {
                        name: '团队效率提升',
                        content: `
>   采用类似**Flash资源管理模式**的开发方式，结合高效的团队协作，相比传统HTML5游戏开发方式，**效率提升5倍-50倍+**，同时**资源品质得到质的提升**。
                        `,
                    },
                    {
                        name: '品牌与性能兼顾',
                        content: `
>   结合现有风格与现代化优化，保证了游戏的**品牌一致性**和**性能表现**。
                        `,
                    },
                    {
                        name: '资源转换服务特性',
                        content: `
> 完美还原 Flash 制作的 **原始效果**，支持**通道**和**滤镜**，元件**矢量图**和**位图**方案策略**灵活**切换。
>  ![alt text](images/game/h5/pet-2.webp)
>  上图中使用了**模糊**、**发光**、**调整颜色**滤镜和**通道**。
> 
>  <img loading="lazy" src="images/game/h5/pet-3.webp" style="width:200px"/>左图使用了**高级色彩效果**。
> 
>  **HTML5真实效果视频:**
> 
>  <video loading="lazy" controls src="images/game/h5/pet.mp4"></video>
>  
> **输出:**   纯矢量数据**245k**，可矢量图和位图结合来**平衡性能和画质**。
>  
>  注：宠物部分矢量数据丢失是因为素材是SWF文件反编译的资源，不是原始源文件，图形完整性有缺陷。
>  
                        `,
                    },
                ]
            },
            {
                name: '适用场景',
                content: `
- 希望快速完成技术转型。  
- 希望降低外包开发成本，同时保持对项目的完全控制权。  
- 有完整的开发团队，但缺乏现代化架构经验和资源转换能力。  
                `,
            },
            {
                name: '服务内容',
                content: ``,
                children: [
                    {
                        name: '长期独立技术顾问服务',
                        content: `
> 通过长期技术顾问服务，官方团队能够专注于核心业务开发，同时借助外部专业支持高效完成技术升级，降低技术风险和开发成本。`,
                        children: [
                            {
                                name: '技术难点快速解决',
                                content: `
- 提供专业指导，帮助团队高效解决项目中遇到的技术难题，如性能优化、架构设计、Bug 修复等，避免团队陷入试错和效率低下的状态。
- 针对具体需求制定优化方案（如内存优化、FPS 提升、资源加载优化等）。
                                `,
                            },
                            {
                                name: '成本效率提升',
                                content: `
>   资源转换服务减少开发冗余，提高项目性能。
                                `,
                            },
                            {
                                name: '架构设计与改进',
                                content: `
- 根据项目需求设计现代化技术架构（如模块化架构、动态加载方案），帮助团队搭建高效、可扩展的项目框架。
- 定期优化项目架构，降低技术债务，确保长期可维护性和高性能。
                                `,
                            },
                            {
                                name: '团队技能提升',
                                content: `
- 通过定制化培训（如 Canvas 和 WebGL 性能调优、网络加载优化等），帮助团队快速掌握新技术。
- 提供技术文档和实践案例支持，减少学习曲线带来的效率损失。 
                                `,
                            },
                            {
                                name: '项目效率提升',
                                content: `
- 提供工具链支持和脚手架设计，减少开发中的重复性工作（如自动化部署、资源转换工具）。
- 协助设计测试环境，提升团队开发和调试效率。
                                `,
                            },
                            {
                                name: '成本控制',
                                content: `
- 减少外部资源投入，通过高效的架构和技术支持降低开发成本。
- 避免项目因技术问题反复修改和延期上线。
                                `,
                            },
                            {
                                name: '前瞻性指导',
                                content: `
- 提供行业趋势和技术演进方向的建议（如采用渐进式 Web 应用技术、跨平台兼容性优化）。
- 确保项目架构在技术更新中具有长期竞争力。
                                `,
                            },
                            {
                                name: '支持多项目并行开发',
                                content: `
- 为同时进行多个项目的团队提供统一的技术架构，减少跨项目的技术冲突和资源浪费。
- 提供增量式开发支持，帮助团队在版本迭代中平滑过渡。
                                `,
                            },
                        ]
                    },
                    {
                        name: '资源转换服务',
                        content: `
> **资源转换服务是 H5 化的重要核心模块之一**，它直接影响游戏性能、内存占用以及加载速度。官方团队应充分利用外包技术服务，将资源优化与开发并行进行，以确保 H5 化的平稳过渡与性能提升。`,
                        children: [
                            {
                                name: '资源转换服务的重要性',
                                content: `
1. **资源元件优化**：将 Flash 动画的多个分散元件合并为单一元件，减少渲染节点，从而提升渲染效率。  
2. **矢量图与位图的平衡**：
   - 矢量适合缩放需求较大的资源（如地图元素）。  
   - 位图更适合固定尺寸的高复杂度资源（如背景图）。  
3. **资源压缩与分组**：对动画帧、图片序列等资源进行组别压缩，减少加载时间；合理分组资源以便动态加载，降低内存占用峰值。  
4. **动画尺寸缩放**：避免超高分辨率资源占用过多内存。  
                                `,
                            },
                            {
                                name: '性能与内存优化的直接影响',
                                content: `
> 资源转换影响帧率（FPS）、加载时间和内存使用：  
>  - **不优化的资源**：可能导致帧率下降、动画卡顿，增加用户流失率。  
>  - **优化后的资源**：通过高效加载和低内存占用提升用户体验。  
                                `,
                            },
                            {
                                name: '生成规范化资源类名',
                                content: `
> 提升开发效率，官方团队可快速调用资源：  
>   \`\`\`typescript
>   var mv = new res.daTing.Cls_mc_guoChangDongHua();  // 自动提示
>   mv.play(); // 播放动画
>   this.stage.addChild(mv); // 显示动画
>   \`\`\`  
>   
>   \`\`\`typescript
>   /* Flash 动画资源资源类名管理示例: 
>   * 文件名："大厅.swf"
>   * 动画元件名：过场动画
>   * 
>   * 如果文件名和资源链接名都是英文将会直接输出英文类名
>   * 资源生成的文件为 d.ts 文件，仅用于提升编写代码效率，不会编译为 JavaScript 实体文件。
>   */
>   \`\`\`
>   此机制便于官方开发团队高效调试和维护资源。  
                                `,
                            },
                            {
                                name: '结构与样式还原',
                                content: `
> 保持 ActionScrip3 代码风格 和 Flash 的资源结构，保证兼容性 和 原有工作栈，Flash 技术栈可快速适应 H5 开发环境。  
                                `,
                            },
                        ]
                    },
                ]
            },
        ]
    },
    resource_conversion_demo: {// 资源转换DEMO
        "type": "timeline",
        name: "资源转换DEMO",
        categories: [
            {
                name: '示例1 - 特效动画',
                content: `
 > <img loading="lazy" src="images/game/h5/yuan.gif" style="width:150px"/>这是一个旋转的动画，
 **输出:** <img loading="lazy" src="images/game/h5/image-9.webp" style="width:100px"/> 
 >
 > 上图的动画实际资源只有箭头和一个圆圈的资源量，而未使用特殊技术处理的序列图，将输出几十张不一样的序列图，这种方式严重消耗内存也增加了CPU解码负担（主要体现画面卡顿不流畅）。
 >
 > 
                `,
            },
            {
                name: '示例2 - 骨骼动画',
                content: `
 > <img loading="lazy" src="images/game/h5/seer.gif" style="width:100px"/>这是一个角色骨架动画，**输出:** <img loading="lazy" src="images/game/h5/image-10.webp" style="width:200px"/>
 > 
 > 资源为重复利用，这里角色使用率非常高，为了性能每种颜色单独输出一个小图，如果存储为了体积压缩时，可以只骨架灰色图，通过代码改变颜色，甚至直接使用矢量数据，无位图资源。
 >
 > 装扮也相同原理
 > <img loading="lazy" src="images/game/h5/cloth.gif" style="width:100px"/>**输出:** 头:![alt text](images/game/h5/image_1-2.webp) 手:![alt text](images/game/h5/image_1-3.webp) 脚:![alt text](images/game/h5/image_1-4.webp) 翅膀:![alt text](images/game/h5/image_1-5.webp)
 
 > 
                `,
            },
            {
                name: '示例3 - 交互动画',
                content: `
> <video loading="lazy" controls src="images/game/h5/cartoon.mp4"></video>  
> 该视频是在**H5效果**动画基础上录制的，动画中的所有元件和过程都可以通过程序进行交互操作。  
>  
> 录制后，使用H264编码的MP4文件体积为**3.29MB**，而实际游戏中该动画资源的体积仅为**625KB**，压缩比约为**526%**，并且在压缩过程中仍有进一步优化空间。该优化大幅提升了性能和流畅度。  
>  
> 在游戏中，动画仅由2张静态图和一个动画信息文件组成，资源消耗大大降低。  
>  
> 然而，视频并不能完全替代动画资源，因为视频无法控制内部的子动画和事件交互，同时也无法支持透明背景。
> 
> 整个动画输出只有**2**张位图资源:
>
> **输出:** 图1<img loading="lazy" src="images/game/h5/cartoon_1.webp" style="width:100px"/> 图2<img loading="lazy" src="images/game/h5/cartoon_2.webp" style="width:100px"/>
`,
            },
            {
                name: '示例4 - UI界面',
                content: `
> ![alt text](images/game/h5/image-13.webp)
>  **输出:** ![alt text](images/game/h5/image_1.webp)
>  **代码:**
>\`\`\`
>  export class Toolbar extends res.ui.toolbar.Cls_spr_toolbar/*转换的UI资源*/ implements IToolbar/*UI模块暴露的接口*/ {
>    // 添加到舞台
>    private onAddedToStage(): void {
>        // 好友按钮
>        BC.addEvent(this, this.btn_HaoYou, TouchEvent.TOUCH_TAP, () => {
>          ModuleManager.open({ id: xls.ModuleConst.FRIEND_PANEL }); //打开好友面板
>          playClickSound(); //播放音效
>        });
>    }
>    private playClickSound () {
>        SoundManager.ins().play(xls.sound.getItem(xls.SoundConst.CLICK));
>    }
> 
>    ...
> 
>     // 销毁
>     public destroy(): void { 
>         BC.removeEvent(this); 
>     }
>   }
>\`\`\`
`,
            },
            {
                name: '示例5 - 超宽场景，解决图像超出设备兼容尺寸',
                content: `
> ![alt text](images/game/h5/image-14.webp)
>  **输出:**  
>  图1<img loading="lazy" src="images/game/h5/image_1-1.webp" style="width:100px"/>
图2<img loading="lazy" src="images/game/h5/image_2.webp" style="width:100px"/>
图3<img loading="lazy" src="images/game/h5/image_3.webp" style="width:100px"/>
图4<img loading="lazy" src="images/game/h5/image_4.webp" style="height:100px"/> 
> 
`,
            },
            {
                name: '例子6 - Flash项目资源转H5-《洛克王国》页游 - 场景',
                content: `
> ![alt text](images/game/h5/image.webp) 
> **HTML5真实效果:**
> <video loading="lazy" controls src="images/game/h5/roco_scene.mp4"></video>
> **输出:**   
>
> <img loading="lazy" src="images/game/h5/image-1.webp" style="width:50%"/> 
> 
> 这张图是场景的所有位图资源
`,
            },
        ],
        content: ``
    },
    contract_task_projects: {
        "type": "timeline",// 开源项目
        name: "经典案例",
        ...DataContractTaskProjects  // 对象结构，展开对象
    },
    personal_projects: {
        "type": "timeline",// 个人作品
        name: "虚拟社区/游戏 作品",
        ...DataGameProjects,  // 对象结构，展开对象
    },
    // skills:
    // {
    //     "type": "skills",// 技能模块
    //     name: "技术栈",
    //     categories: DataSkills,
    // },
    open_source_projects: {
        "type": "project_experience",// 开源项目
        name: "开源项目",
        ...DataOpenSourceProjects  // 对象结构，展开对象
    },
    // project_experience: {
    //     "type": "project_experience",// 项目经历模块
    //     "name": "项目经历",
    //     "list": DataProjectExperience
    // },
}