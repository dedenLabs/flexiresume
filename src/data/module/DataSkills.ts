// 技能模块
export default [
    {
        name: '编程语言',
        content: `- **精通**: Node, TypeScript, JavaScript, WebAssemblyScript, ActionScript 3, C#
- **熟练/熟悉**: C/C++, Java, Python, Golang, Php, Shell`,
    },
    {
        name: '前端开发',
        children: [
            {
                name: '性能与体验',
                content: `- **精通/熟悉**: WebAssembly, WebGL/WebGPU, OffscreenCanvas, Web Worker, Service Worker, PWA
- *具备从2G到5G时代的前端开发经验，精通核心站点性能指标优化（LCP、FID、TTFB、FCP、TBT、TTI），通过资源调度、脚本优化、CDN加速等技术手段，全面提升加载速度与用户交互体验。*`,
            },
            {
                name: '框架/库',
                content: `- **精通**: React, Vue, Redux/MobX, Three.js, LayaAir, Egret, ECharts, TradingVueJs, Vite, WebPack, Pm2, H5互动/游戏开发
- **熟练/熟悉**: Angular, Web3.js, TradingView`,
            },
            {
                name: 'Web3D/VR/AR 开发',
                content: `- **精通/熟悉**: Three.js, Babylon.js, WebGL/WebGPU/WebXR, Unity WebGL`,
            },
            {
                name: 'Hybrid 应用开发',
                content: `- **精通/熟悉**: Cordova, React Native, Taro, Flutter, Onsen UI, Ionic, Quasar, Framework7, Weex, Electron, Harman AIR`,
            },
        ],
        content: `*具备与 UI/UX 团队高效对接的经验，能够在技术上确保项目的性能和用户体验，适用于电商、活动、互动游戏、直播、即时通讯（IM）等场景。拥有多语言版本和账号授权等海外项目经验，能够灵活应对复杂的前端需求。*
>`,
    },
    {
        name: '后端开发',
        children: [
            {
                name: '框架/技术',
                content: `- **精通**:Koa, Next.js, Express, SSR/SSG, Socket, RabbitMQ, Nginx, API(BFF, GraphQL, RESTful)
- **熟练/熟悉**: Spring MVC, ELK Stack (Elasticsearch, Logstash, Kibana), WebRTC, OpenSearch`
            },
            {
                name: '微服务架构',
                content: `- **精通/熟悉**: Docker, Kubernetes, RabbitMQ/Kafka, Spring Boot, Spring Cloud`,
            },
            {
                name: 'Serverless架构/事件驱动架构',
                content: `- **精通/熟悉**: 阿里云FC/腾讯SCF/AWS Lambda/Azure Functions, API Gateway,EventBridge/Node EventEmitter`,
            },
            {
                name: '负载均衡/缓存策略/消息队列',
                content: `- **精通/熟悉**: Nginx/HAProxy/PM2, Redis, RabbitMQ/Kafka`,
            },
            {
                name: '数据库',
                content: `- **精通/熟练**: Redis, MongoDB, MySQL（SQL和NoSQL）`,
            },
        ],
        content: `*熟练掌握分布式高并发架构设计，具备在电商大促期间（如双十一）保持系统稳定的能力。通过 CDN 预分发、微服务架构、Redis缓存、限流、缓存预扣、异步处理、分表分库、读写分离等手段，有效管理后台系统。善于提前准备扩容与监控方案，保障零停机发布。*
>`,
    },
    {
        name: '游戏开发',
        content: `  
- **精通/熟练**: Unity, Three.js, LayaAir, Egret, Adobe Animate, Adobe Photoshop（美术UI生成引擎UI源码）`,
    },
    {
        name: 'DevOps',
        children: [
            {
                name: '自动化部署与管理',
                content: `- **精通/熟练**: Git、Jenkins、Docker、XCode、Kubernetes（K8s）等工具，具备部署一键自动编译项目、一键自打包 Android/iOS 应用、一键发布版本的能力。`
            },
            {
                name: '云平台实操经验',
                content: `- **熟练/熟悉**: AWS、Azure、腾讯云和阿里云使用经验，熟悉各类云产品操作及微服务架构部署。`
            },
            {
                name: 'CICD与容器化',
                content: `- **精通/熟练**: CICD 流程、K8s、容器化和 CDN 策略优化，能够高效构建和管理微服务架构。`
            },
            {
                name: '工作流优化',
                content: `- **熟练/熟悉**: 具备业务痛点消除、代码托管、PaaS 与 aPaaS 部署、自动化开发及敏捷系统的实践经验。`
            },
        ],
        content: ``
    },
    {
        name: '团队管理',
        content: `- **精通/熟练**: 敏捷开发、迭代开发、精益、KPI、OKR、团队组建、成员培训、代码审查、课程分享、员工招聘。

*10年以上技术管理经验，具备从初创到上市的核心领导角色经验。曾作为核心员工兼技术领导者，负责技术选型、开发、架构设计以及职级评定标准和技术规范的制定。管理前端团队规模为 7-15 人，负责团队成员培训、代码审查、课程分享（覆盖总前端开发 50+ 人）、员工招聘等。*`,
    },
];