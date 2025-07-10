// Works
import gameProjectsMindmap from "../charts/GameProjectsMindmap.mmd";
import gameTypeExperiencePie from "../charts/GameTypeExperiencePie.mmd";

export default {
    // Virtual community/game works mind map
    content_head: `  

\`\`\`mermaid
${gameProjectsMindmap}
\`\`\`

 
\`\`\`mermaid
${gameTypeExperiencePie}
\`\`\`

    `    ,
    list: [
        {
            name: 'The first game I made independently in 2004 (a game that only uses `if..else` without `Function, Array, for, while`)',
            children: [
                {
                    name: 'BaoBaoTang Single Player Two Player Version',
                    content: ` 
> [Video](images/game/ppt/1.mp4)  

> It is incredible to think that I could write this game without using \`Function, Array, for, while\`. Looking back now:
> - FLASH IDE can bind keyboard events to buttons, solving the problem of character movement based on keyboard operations.
> - if and else can determine the boundary range, solving the problem of walls.
> - FLASH has the concept of animation frames, solving the problem of no function Function by placing different frames through different logic.
> - However:
> > - How to solve the problem that each character can only place a maximum of 6 bubbles?
> > - How to solve the problem of chain reactions when bombs explode?
> > - ......
> This self-made game has special significance for me because it changed my career trajectory.
> - The entire game was completed in two months, at that time I didn't know programming, I just learned web "Three Musketeers" in school.
> - So, I used PS to extract images frame by frame, extracted materials, and then tried to make animations in Flash.
> - I still remember that the teacher demonstrated once how to set movement coordinates with a button, and I used this feature to make the character move.
> - By chance, pressing the F1 key opened the help document, which opened my path to programming.
> - Although I didn't understand much at the time, I learned the basic if statement and used Flash's built-in collision detection and frame skipping function to write code.
> - In this way, I wrote more than 30,000 lines of code in two months, completing the basic functions of the game.

`
                },
                {
                    name: 'Single player two-player version recorded and made into a replayable player',
                    content: ` 
> [Video](images/game/ppt/2.mp4)  

`
                },
            ],
            content: ``,
        },
        {
            name: 'Community cultivation type',
            children: [
                {
                    name: 'BaoBao City (2006, the second social community project developed by the company, the first one can no longer be found)',
                    content: `
> ![Image](images/game/1/house.webp) 
> ![Image](images/game/1/login.webp) 
`
                },
                {
                    name: 'Mole Manor (2007, children\'s community---Chinese Disney)',
                    content: `
> [Video](images/game/2/3.mp4)  
> [What were we playing during the peak period of Mole Manor?](https://www.bilibili.com/video/BV1vo4y1Q759/?spm_id_from=333.788.recommend_more_video.0)
> ![Image](images/game/2/a.webp)  
> ![Image](images/game/2/b.webp)  
`
                },
                {
                    name: 'Mole Manor 2 (2012)',
                    content: `
> [Video](images/game/2/4.mp4)
> ![Image](images/game/3/1.webp)  
> ![Image](images/game/3/4.webp)  
`
                },
                {
                    name: 'SaiErHao H5 (2015, supports multi-end release, highest technical content)',
                    content: ` 
> This game is my **project with the highest technical content**, involving **multi-end release, backend server, CI/CD, multi-end packaging, resource management, hot compilation, EUI configuration interface generation, reflection technology, hard link technology, performance, CDN strategy, resource anti-theft, Android and iOS incremental hot update** and so on.

> It is worth mentioning that the game has been online for nearly 10 years, and many **new technologies have matured** with the development of Html5. There is still a lot of room for improvement in **image quality and smoothness**.

> ![Image](images/game/4/1.webp)  
> *Developed based on the Egret engine.
Before developing this game, I **already had experience with four community architectures** (BaoBao City predecessor, BaoBao City, Mole Manor 1, Mole Manor 2), and upgraded the architecture details again here to support super-large community projects. I independently designed and implemented a set of tools similar to Webpack, optimizing the project's construction and resource management.*
> ![Image](images/game/4/2.webp)  
> *During development, I used reflection technology to dynamically generate EUI configuration interfaces, thereby reducing the volume of configuration files and improving performance. In addition, the entire project supports hot compilation, greatly improving development efficiency.*  
> ![Image](images/game/4/3.webp)   
> *In terms of project architecture design, I strictly separated the resources, UI source files, release resources, and documents of each module, and linked the relevant resources to the corresponding modules through hard link technology, further improving workflow efficiency. The project involves **multi-end packaging**, **backend server**, **CI/CD**, comprehensively considering the collaborative work of frontend, backend, and operations to ensure the efficient operation and easy maintenance of the system.*

<p align="center"> !QRCode:https://s.61.com size=200 </p> 
 <p align="center"> 
   <a href="https://s.61.com/" target="_blank">Scan to experience https://s.61.com/</a>
 </p>
`
                },
            ],
            content: ``,
        },
        {
            name: 'Online physics combat type (2018, Tank - heavyweight WeChat game)',
            children: [
                {
                    name: 'Missile hits the impact',
                    content: `  
> <video src="images/game/tank/1.mp4" controls="controls" style="width:30%"/> <video src="images/game/tank/2.mp4" controls="controls" style="width:30%"/>  <video src="images/game/tank/3.mp4" controls="controls" style="width:30%"/> 

> *The entire game uses complex resource packaging technology, which can control the volume of large game source code within the scope allowed by WeChat.*`
                },
            ],
            content: ``,
        },
        {
            name: '2012, MMORPG, Chaos Rage (Chaos Rage)/Domestic One Piece Online Edition',
            content: `
> [Video](images/game/chaos_rage/1.mp4)
> *It is a very large-scale mmorpg game similar to God of War, completed by 3-4 people including me in more than a year.*
> [Video](images/game/chaos_rage/2.mp4)
> *The domestic One Piece Online Edition, which was launched in China through the Chaos Rage source code with UI replaced.*  
> [External other videos](https://www.bilibili.com/video/BV12W411t71J/?spm_id_from=333.788.recommend_more_video.-1)
        `,
        },
        {
            name: 'Racing speed (multiplayer 3D drifting racing (similar to Car Racing), multiplayer until racing racing, multiplayer skiing, multiplayer rafting),',
            children: [
                {
                    name: 'Multiplayer 3D drifting racing (similar to Car Racing, not launched)',
                    content: ` 
> [Video](images/game/sc/2.mp4)  
> This is a Demo originally used to debug the **drifting** feeling, the scene is used for **reference, no collision area**.  
`
                },
                {
                    name: 'Multiplayer skiing',
                    content: ` 
> [Video](images/game/hx/hx.mp4)  
> ![Image](images/game/hx/1.webp)  
> ![Image](images/game/hx/0.webp)  
`
                },
                {
                    name: 'Multiplayer rafting',
                    content: ` 
> [Video](images/game/pl/1.mp4)
> ![Image](images/game/pl/2.webp)
> ![Image](images/game/pl/3.webp)
`
                },
                {
                    name: 'Multiplayer until racing racing',
                    content: ` 
> [Video](images/game/sc/1.mp4)
> ![Image](images/game/sc/4.webp)
`
                },
            ],
            content: ``,
        },
        {
            name: 'Card (card battle, landlords)',
            children: [
                {
                    name: 'Card battle 1',
                    content: ` 
> [Video](images/game/kp/1.mp4)  
> ![Image](images/game/kp/1.webp)  
`
                },
                {
                    name: 'Card battle 2 (Unity)',
                    content: ` 
>  <p align="center"><video src="images/game/kp/2.mp4" controls="controls" style="width:45%"/>  <img src="images/game/kp/2.png" style="width:45%"/> </p>
>  <p align="center"> <img src="images/game/kp/6.png" style="width:45%"/> <img src="images/game/kp/5.png" style="width:45%"/> </p>
>  <p align="center"> <img src="images/game/kp/3.png" style="width:45%"/> <img src="images/game/kp/4.png" style="width:45%"/> </p>
>  <p align="center"><img src="images/game/kp/7.png" style="width:100%"/> </p>
> No backup, can only use some beauty resources in the mobile phone to collage.
`
                },
            ],
            content: ``,
        },
        {
            name: 'Educational strategy/real-time confrontation (Tetris, Bubble Dragon)',
            children: [
                {
                    name: 'Tetris',
                    content: ` 
> [Video](images/game/elsfk/1.mp4)  
> ![Image](images/game/elsfk/1.webp)  
`
                },
                {
                    name: 'Bubble Dragon',
                    content: ` 
>  [Video](images/game/ppl/3.mp4)  
`
                },
            ],
            content: ``,
        },
        {
            name: 'Simulation operation (restaurant operation, home planting)',
            children: [
                {
                    name: 'Restaurant operation',
                    content: ` 
>  <p align="center"> <img src="images/game/kxcf/2.webp" style="width:45%"/>  <video src="images/game/kxcf/1.mp4" controls="controls" style="width:45%"/> </p>
`
                },
                {
                    name: 'Home planting',
                    content: ` 
> ![Image](images/game/3/3.webp)  
> Mole Manor 2 has a very large planting + construction system inside.
`
                },
            ],
            content: ``,
        },
        {
            name: 'Single player puzzle (Bubble Dragon, Mahjong, Spot the Difference, Guess the Picture, Idiom Rich, Shopping)',
            children: [
                {
                    name: 'Bubble Dragon',
                    content: ` 
>  <p align="center"> <video src="images/game/ppl/2.mp4" controls="controls" style="width:60%"></video> </p>
`
                },
                {
                    name: 'Guess the Picture',
                    content: ` 
>  <p align="center"><img src="images/game/pic/1.webp" style="width:60%"/> </p>
> 
> The server is closed and cannot enter the game...
`
                },
                {
                    name: 'Shopping',
                    content: ` 
> <p align="center"><video src="images/game/qmds/1.mp4" controls="controls" style="width:60%"></video>  </p>
`
                },
            ],
            content: ``,
        },
        {
            name: 'SLG large-scale Awakening of the World similar products (Unity)',
            content: `> Not launched and no separate backup of game data, unfortunately cannot be displayed.`
        },
        {
            name: 'Kung Fu - horizontal screen闯关格斗类 (Unity)',
            content: `> Not launched and no separate backup of game data, unfortunately cannot be displayed.`
        },
        {
            name: 'There are about one-third of the games that cannot be displayed for various reasons.',
            content: ``,
        },
    ]
}