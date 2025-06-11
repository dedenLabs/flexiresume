// 作品
export default [    
    {
        name: '2004年独立做的第一个游戏（一个没有使用`Function、Array、for、while`只有`if..else`的游戏）',
        children: [
            {
                name: '泡泡堂单机双人版',
                content: ` 
> [视频](images/game/ppt/1.mp4)  

> 没有使用\`Function、Array、for、while\`能写出这个游戏，现在回想起来感觉也是有点难以置信:
> - FLASH IDE 按钮上可以绑定键盘事件，解决了根据键盘操作角色移动的问题。
> - if和else能判断出边界范围，解决了墙的问题。
> - FLASH 中有动画帧的概念，通过不同逻辑放不同帧解决了没有函数Function的问题。
> - 但是:
> > - 怎么解决每个角色只能最多只能放置6个泡泡的问题？
> > - 怎么解决炸弹爆炸时连锁反应的问题？
> > - .....
> 这个自制游戏对我有着特别的意义，因为它改变了我的职业轨迹。
> - 整个游戏的完成历时两个月，那时我并不懂编程，只是学校里学过网页“三剑客”。
> - 于是，我用PS一帧帧抠图，提取素材，再在Flash中尝试制作动画。
> - 还记得老师曾演示过一次如何用按钮设置移动坐标，我就利用这个功能来让角色移动。
> - 一次偶然按下F1键打开了帮助文档，开启了我编程的入门之路。
> - 尽管当时很多内容看不懂，我还是学会了基础的if语句，并利用Flash的内置碰撞检测和跳帧功能来编写代码。
> - 就这样，在两个月里写了3万多行代码，完成了游戏的基础功能。

`
            },
            {
                name: '单机双人版录制后制作成可回放的播放器',
                content: ` 
> [视频](images/game/ppt/2.mp4)  

`
            },
        ],
        content: ``,
    },
    {
        name: '社区养成类',
        children: [
            {
                name: '抱抱城（2006年，在公司开发的第二款社交社区项目，第一款已经找不到资料了）',
                content: `
> ![图片](images/game/1/house.webp) 
> ![图片](images/game/1/login.webp) 
`
            },
            {
                name: '摩尔庄园（2007年，儿童社区---中国迪士尼）',
                content: `
> [视频](images/game/2/3.mp4)  
> [摩尔庄园的巅峰时期，我们在玩什么？](https://www.bilibili.com/video/BV1vo4y1Q759/?spm_id_from=333.788.recommend_more_video.0)
> ![图片](images/game/2/a.webp)  
> ![图片](images/game/2/b.webp)  
`
            },
            {
                name: '摩尔庄园2（2012年）',
                content: `
> [视频](images/game/2/4.mp4)
> ![图片](images/game/3/1.webp)  
> ![图片](images/game/3/4.webp)  
`
            },
            {
                name: '赛尔号H5（2015年、支持多端发布、技术含量最高）',
                content: ` 
> 这款游戏是我**使用技术含量最高**的项目，涉及了**多端发布、后端服务器、CI/CD、多端打包、资源管理、热编译、EUI 配置界面生成、反射技术、硬链接技术、性能、CDN策略、资源防劫持、Android和iOs资源增量热更**等。

> 值得一提的是，该游戏上线到现在近10年，Html5发展到如今很多**新技术已经成熟**，该游戏从**画质到流畅度**还有非常大的提升空间。

> ![图片](images/game/4/1.webp)  
> *基于 Egret 引擎开发。
开发这款游戏前我**已经拥有4款社区架构经验**（抱抱城前身、抱抱城、摩尔庄园1、摩尔庄园2），在此再度升级架构细节，为了支持超大型社区项目，我独立设计并实现了一整套类似 Webpack 的工具链，针对性地优化了项目的构建和资源管理。*
> ![图片](images/game/4/2.webp)  
> *在开发中，我采用了反射技术动态生成 EUI 配置界面，从而减少了配置文件的体积并提升了性能。
此外，整个项目支持热编译，极大提高了开发效率。*
> ![图片](images/game/4/3.webp)   
> *在项目架构设计方面，我将每个模块的资源、UI 源文件、发布资源和文档进行了严格的分离存储，并通过硬链接技术将相关资源关联到对应模块，进一步提升了工作流程效率。
该项目涉及到**多端打包**、**后端服务器**、**CI/CD**，综合考虑了前端、后端和运维的协同工作，以确保系统的高效运行和易于维护。*

<p align="center"> !QRCode:https://s.61.com size=200 </p> 
 <p align="center"> 
   <a href="https://s.61.com/" target="_blank">扫码体验 https://s.61.com/</a>
 </p>
`
            },
        ],
        content: ``,
    },
    {
        name: '联机物理对战类（2018年、战车-重量级微信游戏）',
        children: [
            {
                name: '导弹打冲击',
                content: `  
> <video src="images/game/tank/1.mp4" controls="controls" style="width:30%"/> <video src="images/game/tank/2.mp4" controls="controls" style="width:30%"/>  <video src="images/game/tank/3.mp4" controls="controls" style="width:30%"/> 

> *一整套游戏利用了复杂的资源打包技术, 能够将大型游戏源码体积控制在微信允许的范围内.*
`
            },
        ],
        content: ``,
    },
    {
        name: '2012年、MMORPG、混沌之怒（Chaos Rage）/国内的海贼王online版',
        content: `
> [视频](images/game/chaos_rage/1.mp4)
> *是一个非常庞大的类神曲的mmorpg游戏, 前端包括我在内3-4个人历时一年多完成.*
> [视频](images/game/chaos_rage/2.mp4)
> *国内的海贼王online版, 就是通过Chaos Rage源码换UI国内上线的.*
> [外部其他视频](https://www.bilibili.com/video/BV12W411t71J/?spm_id_from=333.788.recommend_more_video.-1)
        `,
    },
    {
        name: '赛车竞速（多人3D漂移类赛车(似跑跑卡丁车)、多人直到竞速赛车、多人滑雪、多人漂流）、',
        children: [
            {
                name: '多人3D漂移类赛车(似跑跑卡丁车，未上线)',
                content: ` 
> [视频](images/game/sc/2.mp4)  
> 这是一个最初用来调试**漂移**感觉的Demo，场景用来**参照，无碰撞区域**。  
`
            },
            {
                name: '多人滑雪',
                content: ` 
> [视频](images/game/hx/hx.mp4)  
> ![图片](images/game/hx/1.webp)  
> ![图片](images/game/hx/0.webp)  
`
            },
            {
                name: '多人漂流',
                content: ` 
> [视频](images/game/pl/1.mp4)
> ![图片](images/game/pl/2.webp)
> ![图片](images/game/pl/3.webp)
`
            },
            {
                name: '多人直到竞速赛车',
                content: ` 
> [视频](images/game/sc/1.mp4)
> ![图片](images/game/sc/4.webp)
`
            },
        ],
        content: ``,
    },
    {
        name: '卡牌（卡牌对战、斗地主）',
        children: [
            {
                name: '卡片对战1',
                content: ` 
> [视频](images/game/kp/1.mp4)  
> ![image](images/game/kp/1.webp)  
`
            },
            {
                name: '卡片对战2（Unity）',
                content: ` 
>  <p align="center"><video src="images/game/kp/2.mp4" controls="controls" style="width:45%"/>  <img src="images/game/kp/2.png" style="width:45%"/> </p>
>  <p align="center"> <img src="images/game/kp/6.png" style="width:45%"/> <img src="images/game/kp/5.png" style="width:45%"/> </p>
>  <p align="center"> <img src="images/game/kp/3.png" style="width:45%"/> <img src="images/game/kp/4.png" style="width:45%"/> </p>
>  <p align="center"><img src="images/game/kp/7.png" style="width:100%"/> </p>
> 没有备份,只能手机里一些美素资源图拼凑 .
`
            },
        ],
        content: ``,
    },
    {
        name: '益智策略/实时对抗（俄罗斯方块、泡泡龙）',
        children: [
            {
                name: '俄罗斯方块',
                content: ` 
> [视频](images/game/elsfk/1.mp4)  
> ![图片](images/game/elsfk/1.webp)  
`
            },
            {
                name: '泡泡龙',
                content: ` 
>  [视频](images/game/ppl/3.mp4)  
`
            },
        ],
        content: ``,
    },
    {
        name: '模拟经营（餐厅经营、家园种菜）',
        children: [
            {
                name: '餐厅经营',
                content: ` 
>  <p align="center"> <img src="images/game/kxcf/2.webp" style="width:45%"/>  <video src="images/game/kxcf/1.mp4" controls="controls" style="width:45%"/> </p>
`
            },
            {
                name: '家园种菜',
                content: ` 
> ![图片](images/game/3/3.webp)  
> 摩尔庄园2内部一个种植+建造系统非常庞大.
`
            },
        ],
        content: ``,
    },
    {
        name: '单机益智类（泡泡龙、连连看、找茬、猜图、成语大富豪、剁手）',
        children: [
            {
                name: '泡泡龙',
                content: ` 
>  <p align="center"> <video src="images/game/ppl/2.mp4" controls="controls" style="width:60%"></video> </p>
`
            },
            {
                name: '猜图',
                content: ` 
>  <p align="center"><img src="images/game/pic/1.webp" style="width:60%"/> </p>
> 
> 服务器关闭了无法进入游戏...
`
            },
            {
                name: '剁手',
                content: ` 
> <p align="center"><video src="images/game/qmds/1.mp4" controls="controls" style="width:60%"></video>  </p>
`
            },
        ],
        content: ``,
    },
    {
        name: 'SLG大型万国觉醒同类产品（Unity）',
        content: `> 没有上线且没有单独备份游戏资料, 遗憾的无法展示.`,
    },
    {
        name: '功夫-横屏闯关格斗类（Unity）',
        content: `> 没有上线且没有单独备份游戏资料, 遗憾的无法展示.`,
    },
    {
        name: '还有大概三分之一的游戏各种原因无法展示.',
        content: ``,
    },
];