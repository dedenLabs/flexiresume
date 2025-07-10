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
        "type": "personal_strengths",// Personal Strengths Module
        name: "Personal Strengths",
        content: `### 🎮 Virtual Community Technology Leader｜🛠️ Resource Conversion Solution Expert
- #### <span style="font-size: 1.8em;">💻 High-Performance Frontend Architecture Design</span>：As a core member of the TaoMi founding team, led the technical architecture for benchmark projects such as 《<a href="https://mole.61.com" target="_blank">Mole Manor</a>》《<a href="https://s.61.com" target="_blank">Sailor H5</a>》, designed high-performance game architecture, 🏗️ supported medium-heavy game development and horizontal scaling, achieved smooth multi-user interaction on the same screen, and refined an industrialized development paradigm for community products.
### 💎 Resource Conversion Technology:
- #### ⚡ <span style="font-size: 1.5em;">Flash Legacy Revitalization Expert</span>：Developed 🔄 intelligent animation resource conversion engine,实现了 🎨 Flash assets 95%+ lossless migration to HTML5 platform, successfully replicated 🔍 classic gameplay of 《Mole Manor》, saving 70%+ in美术 resource reconstruction costs.
- #### 🌐 <span style="font-size: 1.5em;">Cross-Platform Porting Solution</span>：Established 📦 automated game asset conversion pipeline, supporting seamless integration of 🖼️ Spine animations/🕹️ Cocos components/📡 WebGL rendering technologies, reducing multi-platform adaptation cycles by 60%+.

### 🏆 Technical Consultant Service Advantages:
- #### 🧩 <span style="font-size: 1.8em;">Full-Cycle Solution</span>：Provided complete technical roadmap from 💻 legacy system assessment to 🔧 architecture transformation, created 🔄 the innovative 「Resource-Logic-Presentation」 three-layer migration model, solving 🛡️ code rot and 🌌 technical debt challenges.
- #### 📈 <span style="font-size: 1.5em;">Cost Optimization Expert</span>：Reduced human effort by 50%+ through 🚀 automated testing framework + 📊 intelligent regression validation, achieving 💰 quantifiable ROI in technical transformations.

`
    },
    contract_task: {// Outsourcing Services
        "type": "base",
        name: "Technical Consultant Services / Resource Conversion Services / Outsourcing Services",
        content: `
> ### Unique <span style="font-size:1.5em;color:#c00">Resource Conversion</span> and <span style="font-size:1.5em;color:#a00">Migration Technology</span>, Exponentially Improving <span style="font-size:1.2em;">HTML5</span> Game <span style="font-size:1.5em;color:#0a0">Development Efficiency</span>.
> 
> ---
> 
> ## Undertaking（
> - **Original Flash Classic Project to HTML5 Project**（*Supports ultra-large projects, complete source code and resources required.*）
> - **Flash animation to HTML5 animation, web interactive animation, various interactive web projects**
> (*Only provides programming and animation HTML5 conversion services, requires providing artistic animation resources and detailed requirement descriptions.*)

> - **Technical consulting services + External resource conversion services** 

> <p align="center"><img src="images/me.webp" width="40%" /></p>

> ## ）Service

`
    },
    personal_influence: {// Personal influence and industry recognition
        "type": "base",
        name: "Personal influence And Industry recognition",
        content: DataPersonalInfluence
    },
    html5_game_bottleneck: {// HTML5 game industry bottleneck And Solutions
        "type": "timeline",
        name: "HTML5 game industry bottleneck And Solutions",
        categories: [
            {
                name: 'HTML5 game industry bottleneck',
                content: `
> Due to the above limitations, the industry mostly adopts the most primitive **frame-by-frame animation** solution when rich expressiveness is required. This not only leads to **high memory consumption**, but also affects **image quality**, forming a significant technical barrier.
>
`,
                children: [
                    {
                        name: 'No professional depth optimization solution for HTML5 industry animation resources',
                        content: `
- The expressiveness of animation is very weak, and the following balancing work needs to be done: **image quality**, **animation smoothness**, **network loading**, **experience optimization**, **performance** and so on.
`
                    },
                    {
                        name: 'About image quality and smoothness',
                        content: `
- The optimization space for **image quality and smoothness** may be limited. Conventional use of a large number of sequence images leads to very large resource volume, directly affecting the loading experience and increasing performance and memory overhead.
- If you reduce the number of sequence frames to **improve performance**, then the **smoothness of the screen** will be significantly reduced, resulting in a poor screen experience.
`
                    },
                    {
                        name: 'About animation resources',
                        content: `
- Currently, the **animation resource production** in the H5 industry is still in a very primitive stage, mainly using **frame-by-frame animation** or **bone animation**.
`
                    },
                ]
            },
            {
                name: 'Solutions',
                content: `
> Taking the pet materials of Tencent's "Roc Kingdom Flash version" as an example
>
`,
                children: [
                    {
                        name: 'Frame-by-frame animation',
                        content: ``,
                        children: [
                            {
                                name: 'Taking the pet materials of Tencent\'s "Roc Kingdom Flash version" as an example👇',
                                content: `
> ![alt text](images/game/h5/pet-6.webp)
> ![alt text](images/game/h5/pet-5.webp)
> The above figure shows the pet spirit of the Roc Kingdom browser version (not bone animation) with the number \`1076\`, the number of frames \`398\`, the minimum size \`428*314\`:
> **Single image** after compression is about \`90kb\`, and the following conclusions can be drawn:
>  
> 
> **The pet includes the following action sets:**
> - IDLE: \`50\` frames
> - STB: \`25\` frames
> - BTS: \`25\` frames
> - APPEAR: \`19\` frames
> - ATTACK: \`60\` frames
> - UNDER_ATTACK: \`4\` frames
> - BEAT_DOWN: \`65\` frames
> - MISS: \`63\` frames
> - MAGIC_START: \`28\` frames
> - MAGIC_FOCUS: \`21\` frames
> - MAGIC_END: \`11\` frames
> - DEAD: \`27\` frames
>
> Comparison of Solutions👇
`
                            },
                            {
                                name: 'Unoptimized👿 - Size 76M-Memory 408M-Does not support effects',
                                content: `
> **Ensuring image quality and smoothness:**
> 
> - **Total frames:** 398 frames = \`50+25+25+19+60+4+65+63+28+21+11+27\`
> 
> - **Size:** <span style="font-size:2rem;color:#c00">76.416MB</span> = \`96kb × 398 × 2(dueling between two different sprites)\`
>
> - **Memory:** <span style="font-size:2rem;color:#c00">408MB</span> = \`428(length) × 314(height) × 4(pixel bytes) × 398(total) /1024(bytes) /1024(bytes) × 2(dueling between two different sprites)\`
> 
> - **Effects:** Does not support channels and filters.
> 
> - **Experience:** Large memory, slow loading, multiple bitmap decoding causing stuttering.
`
                            },
                            {
                                name: 'Normal Optimization',
                                content: ``,
                                children: [
                                    {
                                        name: 'Frame Cutting Solution😟 - Size 19M-Memory 102M-Does not support effects',
                                        content: ` 
>  
> - **Total frames:** Approximately 100 frames = 398 frames / 4
> 
> - **Size:** <span style="font-size:2rem;color:#c00">Approximately 19MB</span> = 76.416MB / 4
> 
> - **Memory:** <span style="font-size:2rem;color:#c00">Approximately 102MB</span> = 408MB / 4
> 
> - **Effects:** Does not support channels and filters.
> 
> - **Experience:** Still large memory, slow loading, multiple bitmap decoding causing stuttering and **reduced smoothness**, with a feeling of frame skipping in the画面.
`
                                    },
                                    {
                                        name: 'Size Reduction Solution😟 - Size ?M-Memory ?M-Does not support effects-Lowers clarity',
                                        content: ` 
> *There is also size reduction to lower memory consumption and resource volume, which will make the画面 blurry.*
`
                                    },
                                ]
                            },
                            {
                                name: 'Resource Conversion Service - ⚡High-definition, smooth, no frame cutting',
                                content: ``,
                                children: [
                                    {
name: 'Pure Vector Graphic Solution🙂',
                                        content: ` 
> > ## Volume(<span style="font-size:2rem;color:#0c0">490KB</span> = 245KB × 2)-Memory less than <span style="font-size:1.5rem;color:#Ac0">490KB*10</span>-Supports effects
> > No quality and smoothness issues, only need to consider performance optimization solutions
> > 
> > **Total Frames:** 398 frames
> > 
> > **Volume:** Vector version **490KB** (490KB = 245KB × 2)
> > 
> > **Memory:** For animation configuration decoding data volume:
> > 
> > \`\`\` js
> > 490KB > Actual Volume < 490KB × 10
> > \`\`\`
> > **Effects:** Supports channels and filters.
> > 
> > **Experience:** Extremely small memory, extremely fast loading, no stuttering, need to consider rendering performance on low-end devices.
> > 
    `
                                    },
                                    {
                                        name: 'Pure Raster Graphic Solution🙂',
                                        content: `
> > ## Volume(<span style="font-size:2rem;color:#0c0">596KB</span> = 298KB × 2)-Less than 13MB-Supports effects
> > No quality and smoothness issues, need to consider quality and memory optimization solutions
> > 
> > **Total Frames:** $398 frames$
> > 
> > **Volume:** Raster version **596KB** (596KB = 298KB(configuration file + raster volume) × 2)
> > 
> > **Memory:** 
> > \`\`\` js
> > 13MB(can be combined with vector graphics to reduce memory) = 
> > (
> >   (1024(length) × 1024(height) × 4(pixel bytes)
> >                 + 
> >   (628(length) × 1024(height) × 4(pixel bytes)
> > )   ×    2(different sprites for battle)
> > \`\`\`
> > **Effects:** Supports channels and filters.
> > 
> > **Experience:** Memory is relatively large, fast loading, no stuttering, need to consider memory.
> > 
> > **Output:** Image 1:<img loading="lazy" src="images/game/h5/pet-bitmap1.webp" style="width:100px"/>Image 2:<img loading="lazy" src="images/game/h5/pet-bitmap2.webp" style="height:100px"/>
> >
    `
                                    },
                                    {
                                        name: 'Combination of Vector and Raster😃',
                                        content: `
> **Best Solution:** Set up local raster graphics or local vector graphics based on actual conditions, and get the best resource file.
> Energy, volume, memory, experience, and other numerical values are between pure vector and pure raster versions.
    `
                                    },
                                ]
                            },
                            {
                                name: 'Resource Optimization Solution Comparison📖 - 100x Improvement',
                                content: `
> > *Volume reduced by <span style="font-size:2rem;color:#0c0">**155 times**</span> 
Memory reduced by <span style="font-size:2rem;color:#0c0">**81 times-800 times**</span>
, Pure bitmap version reduces <span style="font-size:1.5rem">**31 times**</span> 
Image decoding consumption is reduced <span style="font-size:1.5rem">**n times to 30 times+**</span>. 
It's not just an improvement in **performance and experience**, but also a significant enhancement in the **collaboration workflow** between developers and artists, <span style="font-size:1.5rem;color:#0cc">inestimable</span>.*

        `,
                                children: [
                                    {
                                        name: 'Normal solution',
                                        content: ` 
> <table  style="background-color:#fff0f0">
>     <thead>
>         <tr>
>             <th><strong>Optimization solution</strong></th>
>             <th><strong>Total frames</strong></th>
>             <th><strong>Size</strong></th>
>             <th><strong>Memory</strong></th>
>             <th><strong>Effects</strong></th>
>             <th><strong>Experience</strong></th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td><strong>Unoptimized - Guaranteed quality</strong></td>
>             <td>398 frames</td>
>             <td><strong><span style="font-size:1.2em;color:#a00">76MB</span></strong></td>
>             <td><strong><span style="font-size:1.2em;color:#f00">408MB</span></strong> = 428(Length) × 314(Height) × 4(Byte) × 398(Frames) / 1024 / 1024 × 2 (Two sprites)</td>
>             <td>Does not support channels and filters</td>
>             <td>Large memory, slow loading, bitmap decoding stutter</td>
>         </tr>
>         <tr>
>             <td><strong>Frame cutting solution - Reduces smoothness</strong></td>
>             <td>100 frames(<strong>Frame cutting</strong>)</td>
>             <td><strong><span style="font-size:1.2em;color:#a00">19MB</span></strong></td>
>             <td><strong><span style="font-size:1.2em;color:#f00">102MB</span></strong> = 408MB / 4</td>
>             <td>Does not support channels and filters</td>
>             <td>Large memory, slow loading, bitmap decoding stutter</td>
>         </tr>
>     </tbody>
> </table>
`
                                    },
                                    {
                                        name: 'Super optimization solution',
                                        content: ` 
>  ---
>  <strong>Resource conversion service - Solution - <span style="font-size:1.5em;color:#a0a">HD smooth without frame cutting</span>👇</strong>
>  ---
>  
>  <table  style="background-color:#f0fff0">
>      <thead>
>          <tr>
>              <th><strong>Optimization Solution</strong></th>
>              <th><strong>Total Frames</strong></th>
>              <th><strong>Volume</strong></th>
>              <th><strong>Memory</strong></th>
>              <th><strong>Effects</strong></th>
>              <th><strong>Experience</strong></th>
>          </tr>
>      </thead>
>      <tbody> 
>          <tr>
>              <td><strong>Vector Graphic Solution</strong></td>
>              <td>398 frames</td>
>              <td><span style="font-size:1.2em;color:#0a0"><strong>490KB</strong></span></td>
>              <td>Greater than<strong><span style="font-size:1.2em;color:#aa0">490KB</span></strong>Less than<span style="font-size:1.2em;color:#aa0"><strong>490KB × 10</strong></span></td>
>              <td>Supports channels and filters</td>
>              <td>Extremely small memory, extremely fast loading, average performance, need to consider rendering performance on low-end devices</td>
>          </tr>
>          <tr>
>              <td><strong>Bitmap Solution</strong></td>
>              <td>398 frames</td>
>              <td><strong><span style="font-size:1.2em;color:#0a0">596KB</span></strong></td>
>              <td><span style="font-size:1.2em;color:#aa0"><strong>13MB</strong></span>(Can be combined with vector graphics to reduce memory) = (1024 × 1024 × 4 + 628 × 1024 × 4) × 2 (two sprites)</td>
>              <td>Supports channels and filters</td>
>              <td>Larger memory, fast loading, extremely high performance without stuttering, need to consider memory optimization</td>
>          </tr>
>          <tr>
>              <td><strong><span style="font-size:1.2em;color:#000">Best Solution</span><br/>(Combination of Vector/Bitmap)</strong></td>
>              <td>398 frames</td>
>              <td>Between the two</td>
>              <td>Between the two</td>
>              <td>Supports channels and filters</td>
>              <td>Medium memory, fast loading, no stuttering, high performance</td>
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
    tech_consulting: {// Technical Consulting Service
        "type": "timeline",
        name: "Technical Consulting Service + External Resource Conversion Service",
        content: ``,
        list: [
            {
                name: 'Service Highlights',
                content: `
>   Through the resource conversion service, the official team can focus on **core logic development**, simplifying the development process.
                `,
                children: [
                    {
                        name: 'Reducing development complexity',
                        content: `
>   Through the resource conversion service, the official team can focus on **core logic development**, simplifying the development process.
                        `,
                    },
                    {
                        name: 'Cost efficiency improvement',
                        content: `
>   The resource conversion service reduces development redundancy, significantly improving the project's **performance**.
                        `,
                    },
                    {
                        name: 'Team efficiency improvement',
                        content: `
>   Adopting a development approach similar to the **Flash resource management model**, combined with efficient team collaboration, compared to traditional HTML5 game development methods, **efficiency improves 5 to 50 times+**, while **resource quality is significantly enhanced**.
                        `,
                    },
                    {
                        name: 'Balancing brand and performance',
                        content: `
>   Combining existing styles with modern optimizations ensures the game's **brand consistency** and **performance**.
                        `,
                    },
                    {
                        name: 'Resource conversion service features',
                        content: `
> Perfectly reproduces the **original effects** created with Flash, supports **channels** and **filters**, and offers **flexible switching** between **vector graphics** and **bitmap** component strategies.
>  ![alt text](images/game/h5/pet-2.webp)
>  The image above uses **blur**, **glow**, **color adjustment** filters and **channels**.
> 
>  <img loading="lazy" src="images/game/h5/pet-3.webp" style="width:200px"/> The left image uses **advanced color effects**.
> 
>  **HTML5 real effect video:**
> 
>  <video loading="lazy" controls src="images/game/h5/pet.mp4"></video>
>  
> **Output:**   Pure vector data **245k**, combining vector graphics and bitmaps to **balance performance and image quality**.
>  
>  Note: The pet part vector data loss is because the material is a resource from SWF file decompilation, not the original source file, and the graphical integrity is defective.
>  
                        `,
                    },
                ]
            },
            {
                name: 'Applicable scenarios',
                content: `
- Wants to quickly complete technical transformation.  
- Wants to reduce outsourcing development costs while maintaining full control over the project.  
- Has a complete development team but lacks experience in modern architecture and resource conversion capabilities.  
                `,
            },
            {
                name: 'Service content',
                content: ``,
                children: [
                    {
                        name: 'Long-term independent technical consulting service',
                        content: `
>   Through long-term technical consulting services, the official team can focus on core business development, while leveraging external professional support to efficiently complete technical upgrades, reducing technical risks and development costs.`,
children: [
                            {
                                name: 'Rapid Resolution of Technical Challenges',
                                content: `
- Provide professional guidance to help the team efficiently solve technical difficulties encountered in projects, such as performance optimization, architecture design, bug fixes, etc., avoiding the team falling into a state of trial and error and low efficiency.
- Develop optimization plans tailored to specific needs (e.g., memory optimization, FPS improvement, resource loading optimization, etc.).
                                `,
                            },
                            {
                                name: 'Cost Efficiency Improvement',
                                content: `
>   Resource conversion services reduce development redundancy and improve project performance.
                                `,
                            },
                            {
                                name: 'Architecture Design and Improvement',
                                content: `
- Design modern technical architectures based on project requirements (e.g., modular architecture, dynamic loading solutions), helping the team build efficient and scalable project frameworks.
- Regularly optimize project architecture to reduce technical debt and ensure long-term maintainability and high performance.
                                `,
                            },
                            {
                                name: 'Team Skill Enhancement',
                                content: `
- Through customized training (e.g., Canvas and WebGL performance tuning, network loading optimization, etc.), help the team quickly master new technologies.
- Provide technical documentation and practical case support to reduce the efficiency loss brought by the learning curve. 
                                `,
                            },
                            {
                                name: 'Project Efficiency Improvement',
                                content: `
- Provide toolchain support and scaffolding design to reduce repetitive work in development (e.g., automated deployment, resource conversion tools).
- Assist in designing test environments to improve the team's development and debugging efficiency.
                                `,
                            },
                            {
                                name: 'Cost Control',
                                content: `
- Reduce external resource investment by using efficient architecture and technical support to lower development costs.
- Avoid project delays due to repeated technical modifications and launch delays.
                                `,
                            },
                            {
                                name: 'Forward-Looking Guidance',
                                content: `
- Provide suggestions on industry trends and technical evolution directions (e.g., adopting progressive web application technologies, cross-platform compatibility optimization).
- Ensure the project architecture maintains long-term competitiveness amid technological updates.
                                `,
                            },
                            {
                                name: 'Support for Multi-Project Parallel Development',
                                content: `
- Provide a unified technical architecture for teams working on multiple projects simultaneously, reducing cross-project technical conflicts and resource waste.
- Provides incremental development support, helping teams smoothly transition during version iterations.
                                `,
                            },
                        ]
                    },
                    {
                        name: 'Resource Conversion Service',
                        content: `
> **Resource Conversion Service is one of the core modules for H5 conversion**, it directly affects game performance, memory usage, and loading speed. The official team should fully utilize outsourced technical services to perform resource optimization in parallel with development, ensuring a smooth transition and performance improvement for H5 conversion.`,
                        children: [
                            {
                                name: 'Importance of Resource Conversion Service',
                                content: `
1. **Resource Component Optimization**: Merge multiple scattered components of Flash animations into a single component, reducing rendering nodes, thereby improving rendering efficiency.  
2. **Balance between Vector and Raster Graphics**:
   - Vectors are suitable for resources with high scaling requirements (e.g., map elements).  
   - Rasters are more suitable for high-complexity resources with fixed sizes (e.g., background images).  
3. **Resource Compression and Grouping**: Compress resources like animation frames and image sequences into groups to reduce loading time; reasonably group resources for dynamic loading to lower peak memory usage.  
4. **Animation Size Scaling**: Avoid using excessively high-resolution resources that consume too much memory.  
                                `,
                            },
                            {
                                name: 'Direct Impact of Performance and Memory Optimization',
                                content: `
> Resource conversion affects frame rate (FPS), loading time, and memory usage:  
>  - **Unoptimized Resources**: May cause frame rate drops, animation stuttering, and increased user churn.  
>  - **Optimized Resources**: Improve user experience through efficient loading and low memory usage.  
                                `,
                            },
                            {
                                name: 'Generating Standardized Resource Class Names',
                                content: `
> Enhances development efficiency, allowing the official team to quickly access resources:  
>   \`\`\`typescript
>   var mv = new res.daTing.Cls_mc_guoChangDongHua();  // Auto-completion
>   mv.play(); // Play animation
>   this.stage.addChild(mv); // Display animation
>   \`\`\`  
>   
>   \`\`\`typescript
>   /* Example of Flash animation resource class name management: 
>   * File name: "Lobby.swf"
>   * Animation component name: Transition Animation
>   * 
>   * If the file name and resource link name are in English, the English class name will be output directly
>   * The generated resource file is a d.ts file, used only to improve coding efficiency and will not be compiled into JavaScript entity files.
>   */
>   \`\`\`
>   This mechanism facilitates efficient debugging and maintenance of resources for the official development team.  
                                `,
                            },
                            {
                                name: 'Structure and Style Restoration',
                                content: `
> Maintain ActionScript3 code style and Flash resource structure to ensure compatibility and the existing work stack, allowing Flash technology stack to quickly adapt to H5 development environments.  
                                `,
                            },
                        ]
},
                ]
            },
        ]
    },
    resource_conversion_demo: {// Resource conversion DEMO
        "type": "timeline",
        name: "Resource conversion DEMO",
        categories: [
            {
                name: 'Example 1 - Special effect animation',
                content: `
 > <img loading="lazy" src="images/game/h5/yuan.gif" style="width:150px"/>This is a rotating animation,
 **Output:** <img loading="lazy" src="images/game/h5/image-9.webp" style="width:100px"/> 
 >
 > The animation in the figure above actually only has the resource amount of an arrow and a circle, while the sequence map without special technology processing will output dozens of different sequence maps, this way seriously consumes memory and increases CPU decoding burden (mainly reflected in the screen freezing and unsmoothness).
 >
 > 
                `,
            },
            {
                name: 'Example 2 - Skeletal animation',
                content: `
 > <img loading="lazy" src="images/game/h5/seer.gif" style="width:100px"/>This is a character skeleton animation, **Output:** <img loading="lazy" src="images/game/h5/image-10.webp" style="width:200px"/>
 > 
 > The resource is reused, here the character usage is very high, for performance each color is output as a small image separately, if stored for volume compression, only the gray skeleton image can be kept, change the color through code, or even directly use vector data, no bitmap resource.
 >
 > The costume is the same principle
 > <img loading="lazy" src="images/game/h5/cloth.gif" style="width:100px"/>**Output:** Head:![alt text](images/game/h5/image_1-2.webp) Hand:![alt text](images/game/h5/image_1-3.webp) Foot:![alt text](images/game/h5/image_1-4.webp) Wings:![alt text](images/game/h5/image_1-5.webp)
 
 > 
                `,
            },
            {
                name: 'Example 3 - Interactive animation',
                content: `
> <video loading="lazy" controls src="images/game/h5/cartoon.mp4"></video>  
> This video was recorded based on the **H5 effect** animation, all elements and processes in the animation can be interactively operated through the program.  
>  
> After recording, the MP4 file encoded with H264 is **3.29MB**, while the actual game animation resource size is only **625KB**, the compression ratio is about **526%**, and there is still further optimization space during the compression process. This optimization has significantly improved performance and smoothness.  
>  
> In the game, the animation consists of only **2** static images and an animation information file, greatly reducing resource consumption.  
>  
> However, video cannot completely replace animation resources because video cannot control internal sub-animations and event interactions, nor can it support a transparent background.
> 
> The entire animation output only has **2** bitmap resources:
>
> **Output:** Image 1<img loading="lazy" src="images/game/h5/cartoon_1.webp" style="width:100px"/> Image 2<img loading="lazy" src="images/game/h5/cartoon_2.webp" style="width:100px"/>
`,
            },
            {
                name: 'Example 4 - UI interface',
                content: `
> ![alt text](images/game/h5/image-13.webp)
> **Output:** ![alt text](images/game/h5/image_1.webp)
> **Code:**
> \`\`\`
> export class Toolbar extends res.ui.toolbar.Cls_spr_toolbar/*Converted UI resource*/ implements IToolbar/*Interface exposed by UI module*/ {
>    // Added to stage
>    private onAddedToStage(): void {
>        // Friend button
>        BC.addEvent(this, this.btn_HaoYou, TouchEvent.TOUCH_TAP, () => {
>          ModuleManager.open({ id: xls.ModuleConst.FRIEND_PANEL }); // Open friend panel
>          playClickSound(); // Play sound effect
>        });
>    }
>    private playClickSound () {
>        SoundManager.ins().play(xls.sound.getItem(xls.SoundConst.CLICK));
>    }
> 
>    ...
> 
>     // Destroy
>     public destroy(): void { 
>         BC.removeEvent(this); 
>     }
>   }
>\`\`\`
`,
            },
            {
                name: 'Example 5 - Oversized scene, solving image exceeding device compatible size',
                content: `
> ![alt text](images/game/h5/image-14.webp)
>  **Output:**  
>  Figure 1<img loading="lazy" src="images/game/h5/image_1-1.webp" style="width:100px"/>
Figure 2<img loading="lazy" src="images/game/h5/image_2.webp" style="width:100px"/>
Figure 3<img loading="lazy" src="images/game/h5/image_3.webp" style="width:100px"/>
Figure 4<img loading="lazy" src="images/game/h5/image_4.webp" style="height:100px"/> 
> 
`,
            },
            {
                name: 'Example 6 - Flash project resource conversion to H5 - "Roc Kingdom" MMORPG - Scene',
                content: `
> ![alt text](images/game/h5/image.webp) 
> **HTML5 real effect:**
> <video loading="lazy" controls src="images/game/h5/roco_scene.mp4"></video>
> **Output:**   
>
> <img loading="lazy" src="images/game/h5/image-1.webp" style="width:50%"/> 
> 
> This image is all bitmap resources of the scene
`,
            },
        ],
        content: ``
    },
    contract_task_projects: {
        "type": "timeline",// Open source project
        name: "Classic cases",
        ...DataContractTaskProjects  // 对象结构，展开对象
    },
    personal_projects: {
        "type": "timeline",// Personal works
        name: "Virtual community/Game Works",
        ...DataGameProjects,  // 对象结构，展开对象
    },
    // skills:
    // {
    //     "type": "skills",// Skills module
    //     name: "Technology stack",
    //     categories: DataSkills,
    // },
open_source_projects: {
        "type": "project_experience",// open source projects
        name: "open source projects",
        ...DataOpenSourceProjects  // 对象结构，展开对象
    },
    // project_experience: {
    //     "type": "project_experience",// project experience module
    //     "name": "project experience",
    //     "list": DataProjectExperience
    // },
}
