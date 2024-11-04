import DataFrontend from "./DataFrontend";
import { IFlexiResume, IHeaderInfo } from "../types/IFlexiResume";
import { assignDeep } from "../utils/Tools";

export default {
    header_info: {
        "type": "header_info", // 简历头部模块
        name: "陈剑",
        email: "deden.labs@gmail.com",
        gender: "男",
        avatar: "/images/avatar.jpg",//public/images/avatar.jpg
        location: "上海",
        is_male: "1",// 1男 0女 显示图标
        phone: "138******99",
        wechat: "ta******ck",
        status: "💚挂靠-随时到岗",//💚离职-随时到岗 💛在职-月内到岗 💗在职-暂不换工作
        age: "38岁",
        education: "本科",
        work_experience_num: "18年以上工作经验",
        position: "前端开发",
        expected_salary: "期望薪资 90k-150k",
        //用来保存简历时的简历名称格式,同时也是浏览器title的格式
        resume_name_format: "{position}-{name}-{age}-{location}",
    } as IHeaderInfo,
    skill_level:
    {
        "type": "skill_level",// 技能熟练度,高亮 
        name: "技能熟练度",
        list: [
            ["网页三剑客", 3],
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
            ["PHP", 1],
            ["Shell", 2],
            ["React", 3],
            ["SWC", 3],
            ["Mobx", 3],
            ["Redux/MobX", 3],
            ["framer-motion", 3],
            ["remark-html", 3],
            ["Three.js", 3],
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
            ["WebXR", 2],
            ["Unity WebGL", 2],
            ["WebAssembly", 3],
            ["OffscreenCanvas", 3],
            ["Web Worker", 3],
            ["Service Worker", 2],
            ["PWA", 2],
            ["Cordova", 3], 
            ["Taro", 2],
            ["Flutter", 1],
            ["Onsen UI", 2],
            ["Ionic", 3],
            ["Quasar", 1],
            ["Framework7", 1],
            ["Weex", 2],
            ["Electron", 3],
            ["Koa", 3],
            ["Next.js", 3],
            ["Express", 3],
            ["SSR/SSG", 3],
            ["Socket", 3],
            ["RabbitMQ", 3],
            ["Nginx", 3],
            ["API(BFF, GraphQL, RESTful)", 3],
            ["Spring MVC", 1],
            ["Spring Async", 1],
            ["ELK Stack (Elasticsearch, Logstash, Kibana)", 3],
            ["WebRTC", 2],
            ["OpenSearch", 1],
            ["Docker", 3],
            ["Kubernetes", 2],
            ["Kafka", 2],
            ["Spring Boot", 2],
            ["Spring Cloud", 2],
            ["阿里云FC", 2],
            ["腾讯SCF", 2],
            ["Android", 2],
            ["iOS", 1],
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
            ["微服务架构", 3],
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
            ["绩效考核", 2]
        ]
    },
    expected_positions: {
        "frontend": assignDeep(
            /*因共享了DataFrontend数据,防止数据互相影响,这里使用克隆,如果多份数据都单独写的话不需要这个步骤*/
            JSON.parse(JSON.stringify(DataFrontend))
            , {
                "is_home_page": true,// 作为首页
                header_info: {// 这里的会覆盖上面默认的数据,根据不同期望的职位设定不同的期望薪资等参数 
                    position: "前端开发/组长",
                    expected_salary: "期望薪资 80k-100k",
                },
                skills:
                {
                    collapsedNodes: [//折叠不展示的内容
                        "技术栈.后端开发",
                        "技术栈.客户端开发",
                        "技术栈.DevOps",
                        "技术栈.团队管理",
                    ]
                },
            }),
        "backend": assignDeep( 
            JSON.parse(JSON.stringify(DataFrontend))
            , {
                header_info: {
                    position: "后端开发",
                    expected_salary: "期望薪资 70k-90k",
                },
                skills:
                {
                    collapsedNodes: [//折叠不展示的内容
                        "技术栈.前端开发",
                        "技术栈.客户端开发",
                        "技术栈.DevOps",
                        "技术栈.团队管理",
                    ]
                },
            }),
        "game": assignDeep( 
            JSON.parse(JSON.stringify(DataFrontend))
            , {
                header_info: {
                    position: "游戏开发/组长",
                    expected_salary: "期望薪资 100k-120k",
                },
                skills:
                {
                    collapsedNodes: [//折叠不展示的内容
                        "技术栈.前端开发",
                        "技术栈.客户端开发",
                        "技术栈.DevOps",
                        "技术栈.团队管理",
                    ]
                },
            }),
        "cto": assignDeep( 
            JSON.parse(JSON.stringify(DataFrontend))
            , {
                header_info: {
                    position: "技术总监/CTO",
                    expected_salary: "期望薪资 100k-150k",
                },
            }),
    }
}// as IFlexiResume; // 这里不关联编辑是更友好,能直接跳转到配置位置