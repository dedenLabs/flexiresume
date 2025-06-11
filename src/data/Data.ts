import DataFrontendBackendCTO from "./positon/DataFrontendBackendCTO";
import { IFlexiResume, IHeaderInfo } from "../types/IFlexiResume";
import { assignDeep } from "../utils/Tools";
import DataGameDev from "./positon/DataGameDev";
import DataContractTask from "./positon/DataContractTask";

export default {
    header_info: {
        "type": "header_info", // 简历头部模块
        name: "陈剑",
        email: "jk@deden.cn",
        gender: "男",
        avatar: "/images/avatar.webp",//https://photocartoon.net/ 这是一个将照片转换为卡通形象的网站
        location: "上海",
        is_male: "1",// 1男 0女 显示图标
        phone: "13*******99",
        wechat: "taomeejack",
        status: "💚随时到岗",//💚离职-随时到岗 💛在职-月内到岗 💗在职-暂不换工作
        age: "38岁",
        education: "本科",
        work_experience_num: "18年以上工作经验",
        position: "前端开发",
        expected_salary: "期望薪资 面议",
        //用来保存简历时的简历名称格式,同时也是浏览器title的格式
        resume_name_format: "{position}-{name}-{age}-{location}",

        // 是否显示个人主页的URL地址
        home_page: "https://dedenlabs.github.io/flexiresume",

        // 是否使用CDN加载静态资源
        use_static_assets_from_cdn: true,

        // 静态资源CDN地址
        static_assets_cdn_base_urls: [
            // "",
            "https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/",
            "https://dedenlabs.github.io/flexiresume-static/",
            "https://demo.deden.cn:8080/",
        ],

        // 静态资源目录白名单
        cdn_static_assets_dirs: ["images"],

        // 静态资源目录的基础名称
        route_base_name: new URL(location.href).pathname.split("/").slice(0, -1).join("/") + "/",// 动态获取
        // route_base_name: "flexiresume/",

        // 生成二维码的URL地址
        qrcode: true,// 不指定特定URL会默认根据当前URL地址动态生成二维码,或直接填写URL地址生成固定的二维码
        // qrcode: "https://resume.deden.cn/game",// 生成固定的URL地址二维码
        qrcode_msg: "",//二维码提示信息
    } as IHeaderInfo,
    skill_level:
    {
        "type": "skill_level",// 技能熟练度,高亮 
        name: "技能熟练度",
        list: [
            ["游戏开发经验：19年＋", 3], 
            ["19年＋", 3], 
            ["GitLab CI", 1], 
            ["Node.js", 3], 
            ["Node", 3],
            ["微信游戏", 3],
            ["H5游戏打包", 3],
            ["游戏脚手架", 3],
            ["H5游戏包内更新", 3],
            ["Protobuf", 3], 
            ["Unreal Engine", 1], 
            ["Golang", 1], 
            ["Go", 1], 
            ["C++", 2], 
            ["Canvas", 3],
            ["H5游戏", 3], 
            ["HTML5", 3], 
            ["核心开发", 3], 
            ["DevOps", 3], 
            ["n8n", 3], 
            ["AS3", 3], 
            ["WebGL", 2], 
            ["CI/CD", 3], 
            ["CDN智能预热", 3], 
            ["Serverless", 2], 
            ["小游戏", 3], 
            ["小程序", 3], 
            ["LayaAir", 3], 
            ["Laya", 3], 
            ["Egret", 3], 
            ["PixiJS", 3], 
            ["Pixi.js", 3], 
            ["Three.js", 3], 
            ["Unity引擎", 3], 
            ["Unity WebGL", 3], 
            ["Unity3D", 3], 
            ["Unity", 3], 
            ["Cocos Creator", 2], 
            ["CocosCreator", 2], 
            ["Wasm", 3],
            ["ECS/DOTS", 3],
            ["ECS", 3],
            ["DOTS", 3],
            ["CICD集成", 3],
            ["H5引擎", 3],
            ["Flash页游", 3],
            ["Flash", 3],
            ["微前端", 3],
            ["沙箱和样式隔离", 3],
            ["网页三剑客", 3],
            ["MVVM框架", 3],
            ["项目推进", 3],
            ["AI领域", 2],
            ["页游时代", 3],
            ["技术攻坚", 3],
            ["团队协作", 3],
            ["项目架构", 3],
            ["H5互动/游戏开发", 3],
            ["Unity游戏开发", 3],
            ["JavaScript", 3],
            ["TypeScript", 3],
            ["React Native", 2],
            ["React", 3],
            ["Vue", 3],
            ["Node.js", 3],
            ["Golang", 1],
            ["CSS", 3],
            ["性能优化", 3],
            ["架构设计", 3],
            ["技术选型", 3],
            ["技术攻关", 3],
            ["系统架构", 3],
            ["性能调优", 3],
            ["跨端应用方案", 2],
            ["解决疑难杂症", 3],
            ["敏捷开发", 3],
            ["迭代开发", 3],
            ["精益", 2],
            ["KPI", 2],
            ["OKR", 3],
            ["团队组建", 3],
            ["0到1上市", 3],
            ["0到1解散", 3],
            ["落地经验", 3],
            ["初创公司", 3],
            ["技术领导", 3],
            ["职级评定标准", 2],
            ["技术规范", 2],
            ["Node.js", 3],
            ["TypeScript", 3],
            ["JavaScript", 3],
            ["WebAssemblyScript", 3],
            ["ActionScript 3", 3],
            ["C#", 3],
            ["C/C++", 2],
            ["Java", 2],
            ["Python", 2],
            ["Golang", 1],
            ["PHP", 2],
            ["Shell", 2],
            ["React", 3],
            ["SWC", 3],
            ["Mobx", 3],
            ["Redux/MobX", 3],
            ["framer-motion", 3],
            ["remark-html", 3],
            ["Three.js", 2],
            ["LayaAir", 3],
            ["Egret", 3],
            ["ECharts", 3],
            ["TradingVueJs", 3],
            ["Vite", 3],
            ["WebPack", 2],
            ["Pm2", 3],
            ["H5互动/游戏开发", 3],
            ["Angular", 2],
            ["Web3.js", 2],
            ["TradingView", 3],
            ["Babylon.js", 2],
            ["WebGL/WebGPU", 2],
            ["WebGPU", 2],
            ["WebXR", 2],
            ["Unity WebGL", 2],
            ["WebAssembly", 3],
            ["OffscreenCanvas", 3],
            ["Web Worker", 3],
            ["Service Worker", 2],
            ["PWA", 2],
            ["Cordova", 3],
            ["Hybrid", 2],
            ["Taro", 2],
            ["Flutter", 1],
            ["Onsen UI", 2],
            ["Ionic", 3],
            ["Quasar", 1],
            ["Framework7", 1],
            ["Weex", 2],
            ["Electron", 3],
            ["Koa", 3],
            ["Git/SVN", 3],
            ["Node EventEmitter", 3],
            ["Next.js", 3],
            ["Pixi.js", 3],
            ["Express", 3],
            ["SSR/SSG", 3],
            ["Socket", 3],
            ["TCP/UDP/Socket", 3],
            ["CDN缓存策略", 3],
            ["CDN防劫持", 3],
            ["端TCP请求版本缓存", 3],
            ["RabbitMQ", 3],
            ["Nginx", 3],
            ["API(BFF, GraphQL, RESTful)", 3],
            ["Spring MVC", 1],
            ["Spring Async", 1],
            ["LCP、FID、TTFB、FCP、TBT、TTI", 3],
            ["ELK Stack (Elasticsearch, Logstash, Kibana)", 2],
            ["WebRTC", 2],
            ["OpenSearch", 1],
            ["Docker", 3],
            ["Kubernetes", 2],
            ["HAProxy", 2],
            ["Kafka", 2],
            ["Spring Boot", 2],
            ["Spring Cloud", 2],
            ["阿里云FC", 2],
            ["腾讯SCF", 2],
            ["Android", 2],
            ["iOS", 2],
            ["AWS Lambda", 2],
            ["Azure Functions", 2],
            ["API Gateway", 2],
            ["EventBridge", 2],
            ["Node EventEmitter", 3],
            ["Nginx/HAProxy/PM2", 3],
            ["Spring Cloud LoadBalancer", 2],
            ["Redis", 3],
            ["MongoDB", 3],
            ["MySQL（SQL和NoSQL）", 2],
            ["Unity", 3],
            ["Harman AIR", 3],
            ["Adobe Animate", 3],
            ["Adobe Photoshop", 2],
            ["Jenkins", 3],
            ["XCode", 2],
            ["微服务架构", 2],
            ["AWS", 2],
            ["Azure", 2],
            ["腾讯云", 2],
            ["阿里云", 2],
            ["CICD 流程", 3],
            ["K8s", 2],
            ["容器化", 2],
            ["CDN 策略优化", 3],
            ["PaaS", 2],
            ["aPaaS", 2],
            ["敏捷系统", 3],
            ["代码托管", 3],
            ["代码审查", 2],
            ["课程分享", 2],
            ["员工招聘", 2],
            ["技术线职级标准制定", 2],
            ["技术编码规范制定", 2],
            ["绩效考核", 2],
            ["AR/VR", 2],
            ["大型虚拟社区架构", 3],
            ["元宇宙", 3],
            ["Web 超大型社区", 3],
            ["ActionScript 2", 3],
            ["HTML", 3],
        ]
    },
    expected_positions: {
        /* `JSON.parse(JSON.stringify(DataGameDev)` 因共享了DataFrontend数据,防止数据互相影响,这里使用克隆,如果多份数据都单独写的话不需要这个步骤*/
        "game": assignDeep(JSON.parse(JSON.stringify(DataGameDev)), {
            "is_home_page": true,// 作为首页
            header_info: {
                position: "游戏主程专家",
                expected_salary: "期望薪资 面议",
            },
            target: { hidden: true, },// 隐藏 职业规划 
            personal_strengths: {
                "type": "personal_strengths",// 个人优势模块
                name: "个人优势",
                content: `### 🎮 游戏主程专家｜🛠️ 19年＋游戏架构与实战主程经验（Unity/Cocos Creator/H5游戏/Flash页游）
- #### 🚀 <span style="font-size: 1.8em;">全栈技术攻坚</span>：精通TS/JS/Node.js技术生态，主导构建⚙️企业级脚手架、📦模块化架构及🤖CI/CD自动化体系（含AI体系n8n），擅长通过🚀Wasm加速、动态调节算法、脏数据追踪、寻路优化、​​ECS/DOTS、SoA 方案等性能优化技巧突破瓶颈。

### 🌐 全平台开发专家：
- #### 📱 <span style="font-size: 1.5em;">多端部署能力</span>：成功发布🎮微信/抖音小游戏、📲Hybrid混合应用及📦Web打包原生应用，掌握🛡️微前端沙箱与🌐跨端渲染核心技术。

### 🏆 高复杂度系统架构：
- #### 💻 <span style="font-size: 1.8em;">引擎深度定制</span>：基于🕹️Unity/Cocos Creator/LayaAir/Egret/Pixi.js/Three.js打造百万DAU项目，自研🖥️Node.js游戏服务集群及📡CDN智能预热系统，突破高并发技术瓶颈。

### 🏰 虚拟社区架构先锋：
- #### 🌌 <span style="font-size: 1.5em;">元宇宙技术体系</span>：自研🏰Web超大型社区框架，实现👓AR/VR虚拟社区的🔧增量编译、🤖自动化发布及📊资源优化方案，支撑亿级用户场景。

### 🔭 技术领导力认证：
- #### 🛠️ <span style="font-size: 1.5em;">T4级技术专家</span>（淘米网络认证）：15年+主导🏗️系统架构设计、🔍技术选型攻关及⚡性能调优经验，沉淀📜AS3/H5/Hybrid开发规范与📈工程化监控体系。`
            },
            skills:
            {
                collapsedNodes: [//折叠不展示的内容
                    "技术栈.前端开发",
                    ["技术栈.前端开发.游戏开发", false],
                    ["技术栈.前端开发.性能与体验", false],
                    "技术栈.客户端开发",
                    "技术栈.后端开发",
                    ["技术栈.后端开发.框架/技术", false],
                    ["技术栈.后端开发.负载均衡/缓存策略/消息队列", false],
                    "技术栈.DevOps",
                    ["技术栈.DevOps.自动化部署与管理", false],
                    ["技术栈.DevOps.CICD与容器化", false],
                    // "技术栈.团队管理",
                ]
            },
            open_source_projects:
            {
                collapsedNodes: [
                    "开源项目.XCast 配置生成协同工具",
                ]
            },
        }),
        "frontend": assignDeep(JSON.parse(JSON.stringify(DataFrontendBackendCTO)), {
            personal_strengths: {
                "type": "personal_strengths",// 个人优势模块
                name: "个人优势",
                content: `### 🔧全栈技术专家｜🕹️19年＋游戏架构与实战主程经验（Unity/Cocos Creator/H5游戏/Flash页游） 
- #### 🌐全栈开发：20年+网页开发经验（含2年全职Web全栈），覆盖🖥️前端（React/Vue）、⚙️后端（Node.js/Python）、🗃️数据库（MySQL/MongoDB）、🔄DevOps全链路  
- #### <span style="font-size: 1.8em;">🚀技术跨界融合：</span>将Web工程化思维注入游戏开发，擅长🎮游戏服务端稳定性优化（TCP/UDP协议栈调优）、🌉混合开发生态（WebGL游戏与前端框架集成），🏆代表性成果：
> - 🚀 主导开发日均100万DAU的H5游戏架构，首屏加载优化至1.2秒内  
> - 📊 设计分布式游戏日志分析系统，故障定位效率提升70%  
> - ⚡ 实现项目自动化热更方案，版本迭代耗时降低90%  
> - 🤖 开发内部工具链，团队开发效率提升50% 

- #### <span style="font-size: 1.8em;">🌐深耕TypeScript/JavaScript技术生态</span>，精通<span style="font-size: 1.5em;">⚛️React/Vue</span>🖋️框架体系与<span style="font-size: 1.5em;">Node.js</span>全栈开发，主导设计过<span style="font-size: 1.5em;">企业级脚手架工具链与CI/CD⚙️自动化部署方案</span>，擅长通过Wasm加速🚀、SSR/SSG渲染优化实现毫秒级性能突破⚡。
- #### 📱 多平台开发经验：微信/抖音/支付宝等平台的🎮小游戏和小程序开发经验，H5打包📦 iOS/Android并成功提审上线完整经验✅。
### 🌟在高复杂度Web图形领域具备独特优势：
- #### 跨引擎开发经验：基于<span style="font-size: 1.5em;">Canvas/WebGL</span>深度定制<span style="font-size: 1.5em;">🕹️CocosCreator/Laya/Egret/PixiJS/Three.js/Unity</span>等游戏引擎，构建百万DAU级🎯游戏项目；
- #### 主导研发<span style="font-size: 1.5em;">Node.js</span>游戏服务集群🖥️与CDN智能预热系统📡，突破高并发技术瓶颈🚀。
- #### 📊 体系化解决方案沉淀：持续输出前端工程化🔧、Hybrid混合开发优化📱及Web安全防护🛡️方案，在模块化架构设计📦、微前端实施🔄、跨端渲染引擎开发🌐等领域沉淀丰富实战经验💼。
`
            },
            target: { hidden: true, },// 隐藏 职业规划 
            personal_influence: { hidden: true, },// 隐藏 个人影响力与行业认可
            header_info: {// 这里的会覆盖上面默认的数据,根据不同期望的职位设定不同的期望薪资等参数 
                position: "前端开发工程师",
                expected_salary: "期望薪资 面议",
            },
            skills:
            {
                collapsedNodes: [//折叠不展示的内容
                    // "技术栈.前端开发", //显示前端开发所以不注释
                    // "技术栈.后端开发",
                    "技术栈.游戏开发",
                    "技术栈.客户端开发",
                    // "技术栈.DevOps",
                    // "技术栈.团队管理",
                ]
            },
        }),
        "backend": assignDeep(JSON.parse(JSON.stringify(DataFrontendBackendCTO)), {
            personal_strengths: {
                "type": "personal_strengths",// 个人优势模块
                name: "个人优势",
                content: `### 🚀 Node.js后端专家｜🛠️ 高可用架构设计师
- #### <span style="font-size: 1.8em;">⚙️ 全栈服务开发</span>：基于Koa/Express/Next.js构建🏗️企业级BFF中间层，精通🔗GraphQL/RESTful API设计，擅长通过⚡SSR/SSG实现服务端性能飞跃。

### ☁️ 云原生技术实践：
- #### 🚢 <span style="font-size: 1.5em;">容器化开发经验</span>：完成本地环境📦Docker/Kubernetes容器化改造方案，实现🛠️微服务拆分验证与🚦CI/CD自动化测试流程搭建，通过云服务ECS实现🔄资源弹性伸缩与🔒基础运维监控。
- #### ⚡ <span style="font-size: 1.5em;">Serverless应用探索</span>：基于阿里云函数计算实现🔄定时任务无服务器化改造，完成📊日志采集系统与🔍异常请求追踪告警方案设计。

### 🏗️ 高并发解决方案：
- #### ⚡ <span style="font-size: 1.8em;">千万级流量架构</span>：通过🔗RabbitMQ消息队列实现业务解耦，部署📡Nginx负载均衡策略支撑日均百万级请求，设计📈Redis二级缓存方案降低接口响应耗时50%+。

### 🗃️ 数据存储实战：
- #### 🔍 <span style="font-size: 1.5em;">多数据库协同开发</span>：运用MySQL事务机制保障💰电商订单数据一致性，完成📜MongoDB分片集群基础搭建与🗃️文档型数据存取方案设计。
- #### 🚀 <span style="font-size: 1.5em;">性能优化实践</span>：通过索引优化提升MySQL复杂查询效率30%+，运用📦MongoDB聚合管道完成🔢百万级用户行为数据分析，构建🔄Redis流式热点数据缓存策略。

### 🔥 Linux生产环境实战：
- #### 🐧 <span style="font-size: 1.5em;">全链路部署实践</span>：掌握📦Pm2集群部署方案，实施🔐Jenkins自动化发布流程，通过📡ELK日志分析实现🔧接口性能监控与异常告警。`
            },
            target: { hidden: true, },// 隐藏 职业规划 
            personal_influence: { hidden: true, },// 隐藏 个人影响力与行业认可 
            header_info: {
                position: "NodeJs开发",
                expected_salary: "期望薪资 面议",
            },
            skills:
            {
                collapsedNodes: [//折叠不展示的内容
                    // "技术栈.前端开发",
                    // "技术栈.后端开发",
                    "技术栈.客户端开发",
                    "技术栈.DevOps",
                    // "技术栈.团队管理",
                ]
            },
        }),
        "cto": assignDeep(JSON.parse(JSON.stringify(DataFrontendBackendCTO)), {
            personal_strengths: {
                "type": "personal_strengths",// 个人优势模块                
                name: "个人优势",
                content: `### 🎖️ T4级技术领袖｜🚀 15年+全栈攻坚专家
- #### <span style="font-size: 1.8em;">🏆 技术领导力认证</span>：淘米网络T4-2职级（2010年），主导🔧游戏架构设计与🕹️系统开发，游戏最高同时在线突破80万。

### 🕹️ 游戏工业化先驱：
- #### ⏳ <span style="font-size: 1.5em;">页游时代开拓者</span>：从诺基亚时代开始构建🎮大型虚拟社区，独立设计了基于位图高压缩率动画播放引擎，实现玩家千人同屏。
- #### 🚦 <span style="font-size: 1.5em;">复杂场景应对专家</span>：历经📈千万DAU项目完整生命周期，沉淀🛠️模块化开发体系与⚙️跨端渲染解决方案。

### 👥 技术驱动型管理实践：
- #### ⚡ <span style="font-size: 1.5em;">敏捷开发实践者</span>：通过Jira/Trello实施🔄双周迭代开发，建立📊看板任务跟踪机制，缩短需求响应周期30%+，主导🔍代码评审规范制定，通过同行评审机制降低线上事故率50%+。
- #### 🛠️ <span style="font-size: 1.5em;">技术决策主导者</span>：在初创公司周期中构建📜技术选型评估模型，主导架构选型会议并输出🔗技术可行性报告，通过自动化测试框架实现80%+核心接口覆盖率。

### 🌐 协作流程标准化：
- #### 📦 <span style="font-size: 1.5em;">SOP协作体系构建</span>：制定跨部门协作标准操作程序（SOP），明确🔄需求对接/🛠️技术联调/🔍问题追溯三阶段职责矩阵，通过📈流程可视化看板缩短沟通耗时40%+。
`
            },
            target: { hidden: true, },// 隐藏 职业规划 
            header_info: {
                position: "技术管理",
                expected_salary: "期望薪资 面议",
            },
            //skills cto职业要全部展示,所以不用折叠,这里不用填写相应的折叠数据
        }),
        "contracttask": assignDeep(JSON.parse(JSON.stringify(DataContractTask)), {
            header_info: {
                position: "技术顾问/游戏资源优化/外包",
                expected_salary: "价格面议",
                status: "💚空闲-可接外包",

                // 是否显示个人主页的URL地址
                home_page: "",
                // 生成二维码的URL地址
                // qrcode: true,
            },
            personal_projects: {
                collapsedNodes: ["虚拟社区/游戏 作品",
                    ["虚拟社区/游戏 作品.社区养成类.摩尔庄园（2007年，儿童社区---中国迪士尼）", false],
                ]
            },
            skills: {
                collapsedNodes: ["技术栈",]
            },
            project_experience: {
                collapsedNodes: ["项目经历",]
            },
            html5_game_bottleneck: {
                collapsedNodes: [
                    "HTML5游戏行业瓶颈 与 解决方案",
                    ["HTML5游戏行业瓶颈 与 解决方案.HTML5游戏行业瓶颈.关于动画资源", false],
                    ["HTML5游戏行业瓶颈 与 解决方案.解决方案.逐帧动画.以腾讯《洛克王国Flash页游版》的宠物素材来举例👇", false],
                    ["HTML5游戏行业瓶颈 与 解决方案.解决方案.逐帧动画.未优化👿 - 体积76M-内存408M-不支持特效", false],
                    ["HTML5游戏行业瓶颈 与 解决方案.解决方案.逐帧动画.资源转换服务 - ⚡高清、流畅、无砍帧.矢量图和位图结合😃", false],
                    ["HTML5游戏行业瓶颈 与 解决方案.解决方案.逐帧动画.资源优化方案对比📖 - 百倍提升", false],
                ]
            },
            tech_consulting: {
                collapsedNodes: [
                    "技术顾问服务 + 外部资源转换服务",
                    ["技术顾问服务 + 外部资源转换服务.服务亮点.资源转换服务特性", false/*不折叠*/],
                    ["技术顾问服务 + 外部资源转换服务.服务内容.资源转换服务", false/*不折叠*/],
                ]
            },
            resource_conversion_demo: {
                collapsedNodes: [
                    "资源转换DEMO",
                    ["资源转换DEMO.示例3 - 交互动画", false/*不折叠*/],
                ]
            },
        }),
    }
}// as IFlexiResume; // 这里不关联编辑是更友好,能直接跳转到配置位置