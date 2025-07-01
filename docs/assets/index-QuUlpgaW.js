const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DataGameDev-YyL4KD5G.js","./DataSkills-BzBljIRy.js","./DataGameProjects-LPunVSLI.js","./DataPersonalInfluence-CQEfseIU.js","./DataFrontendBackendCTO-KH6VY4ZZ.js","./DataContractTask-D-LqL4AW.js","./DataAgentEngineer-DbxiEqd1.js","./FlexiResume-DAzHqlbi.js","./ui-vendor-DJDNxDE2.js","./react-vendor-BlsmY56K.js","./icons-vendor-DtfHCCGi.js","./markdown-vendor-DJ5cAB8a.js","./router-vendor-nA3Ejqlu.js","./utils-vendor-BhbSUPxu.js"])))=>i.map(i=>d[i]);
var e,r=Object.defineProperty,t=(e,t,o)=>((e,t,o)=>t in e?r(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o)(e,"symbol"!=typeof t?t+"":t,o);import{f as o,d as a,j as s,m as n,a as i}from"./ui-vendor-DJDNxDE2.js";import{r as d,a as c,c as l}from"./react-vendor-BlsmY56K.js";import{u as p,N as h,B as g,R as u,a as m,b as f}from"./router-vendor-nA3Ejqlu.js";import{m as b,d as x,r as v}from"./utils-vendor-BhbSUPxu.js";import{G as k}from"./icons-vendor-DtfHCCGi.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if("childList"===t.type)for(const e of t.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();const y={},w=function(e,r,t){let o=Promise.resolve();if(r&&r.length>0){const e=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),s=(null==a?void 0:a.nonce)||(null==a?void 0:a.getAttribute("nonce"));o=Promise.allSettled(r.map(r=>{if(r=function(e,r){return new URL(e,r).href}(r,t),r in y)return;y[r]=!0;const o=r.endsWith(".css"),a=o?'[rel="stylesheet"]':"";if(t)for(let t=e.length-1;t>=0;t--){const a=e[t];if(a.href===r&&(!o||"stylesheet"===a.rel))return}else if(document.querySelector(`link[href="${r}"]${a}`))return;const n=document.createElement("link");return n.rel=o?"stylesheet":"modulepreload",o||(n.as="script"),n.crossOrigin="",n.href=r,s&&n.setAttribute("nonce",s),document.head.appendChild(n),o?new Promise((e,t)=>{n.addEventListener("load",e),n.addEventListener("error",()=>t(new Error(`Unable to preload CSS for ${r}`)))}):void 0}))}function a(e){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=e,window.dispatchEvent(r),!r.defaultPrevented)throw e}return o.then(r=>{for(const e of r||[])"rejected"===e.status&&a(e.reason);return e().catch(a)})},j=new class{constructor(){t(this,"data",{}),t(this,"tabs",[]),t(this,"skillMap",[]),t(this,"skills",[]),t(this,"collapsedMap",new Map),b(this);const e=this.collapsedMap.set;this.collapsedMap.set=function(r,t){C("Store",t,r),e.call(this,r,t)}}},S={header_info:{type:"header_info",name:"陈剑",email:"jk@deden.cn",gender:"男",avatar:"/images/avatar.webp",location:"上海",is_male:"1",phone:"13*******99",wechat:"taomeejack",status:"💚随时到岗",age:"38岁",education:"本科",work_experience_num:"18年以上工作经验",position:"前端开发",expected_salary:"期望薪资 面议",resume_name_format:"{position}-{name}-{age}-{location}",home_page:"https://dedenlabs.github.io/flexiresume",use_static_assets_from_cdn:!0,static_assets_cdn_base_urls:["https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/","https://dedenlabs.github.io/flexiresume-static/","https://demo.deden.cn:8080/"],cdn_static_assets_dirs:["images"],route_base_name:new URL(location.href).pathname.split("/").slice(0,-1).join("/")+"/",qrcode:!0,qrcode_msg:""},skill_level:{type:"skill_level",name:"技能熟练度",list:[["AI Agent开发",3],["LangChain",3],["OpenAI API",3],["RAG检索增强",3],["游戏开发经验：19年＋",3],["19年＋",3],["网页设计",3],["GitLab CI",1],["Node.js",3],["Node",3],["全栈",3],["网页开发经验：20年＋",3],["微信游戏",3],["H5游戏打包",3],["游戏脚手架",3],["H5游戏包内更新",3],["Protobuf",3],["Unreal Engine",1],["Golang",1],["Go",1],["C++",2],["Canvas",3],["H5游戏",3],["HTML5",3],["核心开发",3],["DevOps",3],["n8n",3],["AS3",3],["WebGL",2],["CI/CD",3],["CDN智能预热",3],["Serverless",2],["小游戏",3],["小程序",3],["LayaAir",3],["Laya",3],["Egret",3],["PixiJS",3],["Pixi.js",3],["Three.js",3],["Unity引擎",3],["Unity WebGL",3],["Unity3D",3],["Unity",3],["Cocos Creator",2],["CocosCreator",2],["Wasm",3],["ECS/DOTS",3],["ECS",3],["DOTS",3],["CICD集成",3],["H5引擎",3],["Flash页游",3],["Flash",3],["微前端",3],["沙箱和样式隔离",3],["网页三剑客",3],["MVVM框架",3],["项目推进",3],["AI领域",2],["页游时代",3],["技术攻坚",3],["团队协作",3],["项目架构",3],["H5互动/游戏开发",3],["Unity游戏开发",3],["JavaScript",3],["TypeScript",3],["React Native",2],["React",3],["Vue",3],["Node.js",3],["Golang",1],["CSS",3],["性能优化",3],["架构设计",3],["技术选型",3],["技术攻关",3],["系统架构",3],["性能调优",3],["跨端应用方案",2],["解决疑难杂症",3],["敏捷开发",3],["迭代开发",3],["精益",2],["KPI",2],["OKR",3],["团队组建",3],["0到1上市",3],["0到1解散",3],["落地经验",3],["初创公司",3],["技术领导",3],["职级评定标准",2],["技术规范",2],["Node.js",3],["TypeScript",3],["JavaScript",3],["WebAssemblyScript",3],["ActionScript 3",3],["C#",3],["C/C++",2],["Java",2],["Python",2],["Golang",1],["PHP",2],["Shell",2],["React",3],["SWC",3],["Mobx",3],["Redux/MobX",3],["framer-motion",3],["remark-html",3],["Three.js",2],["LayaAir",3],["Egret",3],["ECharts",3],["TradingVueJs",3],["Vite",3],["WebPack",2],["Pm2",3],["H5互动/游戏开发",3],["Angular",2],["Web3.js",2],["TradingView",3],["Babylon.js",2],["WebGL/WebGPU",2],["WebGPU",2],["WebXR",2],["Unity WebGL",2],["WebAssembly",3],["OffscreenCanvas",3],["Web Worker",3],["Service Worker",2],["PWA",2],["Cordova",3],["Hybrid",2],["Taro",2],["Flutter",1],["Onsen UI",2],["Ionic",3],["Quasar",1],["Framework7",1],["Weex",2],["Electron",3],["Koa",3],["Git/SVN",3],["Node EventEmitter",3],["Next.js",3],["Pixi.js",3],["Express",3],["SSR/SSG",3],["Socket",3],["TCP/UDP/Socket",3],["CDN缓存策略",3],["CDN防劫持",3],["端TCP请求版本缓存",3],["RabbitMQ",3],["Nginx",3],["API(BFF, GraphQL, RESTful)",3],["Spring MVC",1],["Spring Async",1],["LCP、FID、TTFB、FCP、TBT、TTI",3],["ELK Stack (Elasticsearch, Logstash, Kibana)",2],["WebRTC",2],["OpenSearch",1],["Docker",3],["Kubernetes",2],["HAProxy",2],["Kafka",2],["Spring Boot",2],["Spring Cloud",2],["阿里云FC",2],["腾讯SCF",2],["Android",2],["iOS",2],["AWS Lambda",2],["Azure Functions",2],["API Gateway",2],["EventBridge",2],["Node EventEmitter",3],["Nginx/HAProxy/PM2",3],["Spring Cloud LoadBalancer",2],["Redis",3],["MongoDB",3],["MySQL（SQL和NoSQL）",2],["Unity",3],["Harman AIR",3],["Adobe Animate",3],["Adobe Photoshop",2],["Jenkins",3],["XCode",2],["微服务架构",2],["AWS",2],["Azure",2],["腾讯云",2],["阿里云",2],["CICD 流程",3],["K8s",2],["容器化",2],["CDN 策略优化",3],["PaaS",2],["aPaaS",2],["敏捷系统",3],["代码托管",3],["代码审查",2],["课程分享",2],["员工招聘",2],["技术线职级标准制定",2],["技术编码规范制定",2],["绩效考核",2],["AR/VR",2],["大型虚拟社区架构",3],["元宇宙",3],["Web 超大型社区",3],["ActionScript 2",3],["HTML",3]]},expected_positions:{game:{is_home_page:!0,header_info:{position:"游戏主程专家",expected_salary:"期望薪资 面议"},personal_strengths:{content:'### 🎮 游戏主程专家｜🛠️ 19年＋游戏架构与实战主程经验（Unity/Cocos Creator/H5游戏/Flash页游）\n- #### 🚀 <span style="font-size: 1.8em;">全栈技术攻坚</span>：精通TS/JS/Node.js技术生态，主导构建⚙️企业级脚手架、📦模块化架构及🤖CI/CD自动化体系（含AI体系n8n），擅长通过🚀Wasm加速、动态调节算法、脏数据追踪、寻路优化、​​ECS/DOTS、SoA 方案等性能优化技巧突破瓶颈。\n\n### 🌐 全平台开发专家：\n- #### 📱 <span style="font-size: 1.5em;">多端部署能力</span>：成功发布🎮微信/抖音小游戏、📲Hybrid混合应用及📦Web打包原生应用，掌握🛡️微前端沙箱与🌐跨端渲染核心技术。\n\n### 🏆 高复杂度系统架构：\n- #### 💻 <span style="font-size: 1.8em;">引擎深度定制</span>：基于🕹️Unity/Cocos Creator/LayaAir/Egret/Pixi.js/Three.js打造百万DAU项目，自研🖥️Node.js游戏服务集群及📡CDN智能预热系统，突破高并发技术瓶颈。\n\n### 🏰 虚拟社区架构先锋：\n- #### 🌌 <span style="font-size: 1.5em;">元宇宙技术体系</span>：自研🏰Web超大型社区框架，实现👓AR/VR虚拟社区的🔧增量编译、🤖自动化发布及📊资源优化方案，支撑亿级用户场景。\n\n### 🔭 技术领导力认证：\n- #### 🛠️ <span style="font-size: 1.5em;">T4级技术专家</span>（淘米网络认证）：15年+主导🏗️系统架构设计、🔍技术选型攻关及⚡性能调优经验，沉淀📜AS3/H5/Hybrid开发规范与📈工程化监控体系。",\n            '},skills:{collapsedNodes:["技术栈.前端开发",["技术栈.前端开发.游戏开发",!1],["技术栈.前端开发.性能与体验",!1],"技术栈.客户端开发","技术栈.后端开发",["技术栈.后端开发.框架/技术",!1],["技术栈.后端开发.负载均衡/缓存策略/消息队列",!1],"技术栈.DevOps",["技术栈.DevOps.自动化部署与管理",!1],["技术栈.DevOps.CICD与容器化",!1]]},open_source_projects:{collapsedNodes:["开源项目.XCast 配置生成协同工具"]}},frontend:{personal_strengths:{type:"personal_strengths",name:"个人优势",content:'### 🔧全栈技术专家｜🕹️19年＋游戏架构与实战主程经验（Unity/Cocos Creator/H5游戏/Flash页游） \n- #### 🌐全栈开发：20年+网页开发经验（含2年全职Web全栈），覆盖🖥️前端（React/Vue）、⚙️后端（Node.js/Python）、🗃️数据库（MySQL/MongoDB）、🔄DevOps全链路  \n- #### <span style="font-size: 1.8em;">🚀技术跨界融合：</span>将Web工程化思维注入游戏开发，擅长🎮游戏服务端稳定性优化（TCP/UDP协议栈调优）、🌉混合开发生态（WebGL游戏与前端框架集成），🏆代表性成果：\n> - 🚀 主导开发日均100万DAU的H5游戏架构，首屏加载优化至1.2秒内  \n> - 📊 设计分布式游戏日志分析系统，故障定位效率提升70%  \n> - ⚡ 实现项目自动化热更方案，版本迭代耗时降低90%  \n> - 🤖 开发内部工具链，团队开发效率提升50% \n\n- #### <span style="font-size: 1.8em;">🌐深耕TypeScript/JavaScript技术生态</span>，精通<span style="font-size: 1.5em;">⚛️React/Vue</span>🖋️框架体系与<span style="font-size: 1.5em;">Node.js</span>全栈开发，主导设计过<span style="font-size: 1.5em;">企业级脚手架工具链与CI/CD⚙️自动化部署方案</span>，擅长通过Wasm加速🚀、SSR/SSG渲染优化实现毫秒级性能突破⚡。\n- #### 📱 多平台开发经验：微信/抖音/支付宝等平台的🎮小游戏和小程序开发经验，H5打包📦 iOS/Android并成功提审上线完整经验✅。\n### 🌟在高复杂度Web图形领域具备独特优势：\n- #### 跨引擎开发经验：基于<span style="font-size: 1.5em;">Canvas/WebGL</span>深度定制<span style="font-size: 1.5em;">🕹️CocosCreator/Laya/Egret/PixiJS/Three.js/Unity</span>等游戏引擎，构建百万DAU级🎯游戏项目；\n- #### 主导研发<span style="font-size: 1.5em;">Node.js</span>游戏服务集群🖥️与CDN智能预热系统📡，突破高并发技术瓶颈🚀。\n- #### 📊 体系化解决方案沉淀：持续输出前端工程化🔧、Hybrid混合开发优化📱及Web安全防护🛡️方案，在模块化架构设计📦、微前端实施🔄、跨端渲染引擎开发🌐等领域沉淀丰富实战经验💼。\n'},target:{hidden:!0},personal_influence:{hidden:!0},header_info:{position:"前端开发工程师",expected_salary:"期望薪资 面议"},skills:{collapsedNodes:["技术栈.游戏开发","技术栈.客户端开发"]}},backend:{personal_strengths:{type:"personal_strengths",name:"个人优势",content:'### 🚀 Node.js后端专家｜🛠️ 高可用架构设计师\n- #### <span style="font-size: 1.8em;">⚙️ 全栈服务开发</span>：基于Koa/Express/Next.js构建🏗️企业级BFF中间层，精通🔗GraphQL/RESTful API设计，擅长通过⚡SSR/SSG实现服务端性能飞跃。\n\n### ☁️ 云原生技术实践：\n- #### 🚢 <span style="font-size: 1.5em;">容器化开发经验</span>：完成本地环境📦Docker/Kubernetes容器化改造方案，实现🛠️微服务拆分验证与🚦CI/CD自动化测试流程搭建，通过云服务ECS实现🔄资源弹性伸缩与🔒基础运维监控。\n- #### ⚡ <span style="font-size: 1.5em;">Serverless应用探索</span>：基于阿里云函数计算实现🔄定时任务无服务器化改造，完成📊日志采集系统与🔍异常请求追踪告警方案设计。\n\n### 🏗️ 高并发解决方案：\n- #### ⚡ <span style="font-size: 1.8em;">千万级流量架构</span>：通过🔗RabbitMQ消息队列实现业务解耦，部署📡Nginx负载均衡策略支撑日均百万级请求，设计📈Redis二级缓存方案降低接口响应耗时50%+。\n\n### 🗃️ 数据存储实战：\n- #### 🔍 <span style="font-size: 1.5em;">多数据库协同开发</span>：运用MySQL事务机制保障💰电商订单数据一致性，完成📜MongoDB分片集群基础搭建与🗃️文档型数据存取方案设计。\n- #### 🚀 <span style="font-size: 1.5em;">性能优化实践</span>：通过索引优化提升MySQL复杂查询效率30%+，运用📦MongoDB聚合管道完成🔢百万级用户行为数据分析，构建🔄Redis流式热点数据缓存策略。\n\n### 🔥 Linux生产环境实战：\n- #### 🐧 <span style="font-size: 1.5em;">全链路部署实践</span>：掌握📦Pm2集群部署方案，实施🔐Jenkins自动化发布流程，通过📡ELK日志分析实现🔧接口性能监控与异常告警。'},target:{hidden:!0},personal_influence:{hidden:!0},header_info:{position:"NodeJs开发",expected_salary:"期望薪资 面议"},skills:{collapsedNodes:["技术栈.客户端开发","技术栈.DevOps"]}},cto:{personal_strengths:{type:"personal_strengths",name:"个人优势",content:'### 🎖️ T4级技术领袖｜🚀 15年+全栈攻坚专家\n- #### <span style="font-size: 1.8em;">🏆 技术领导力认证</span>：淘米网络T4-2职级（2010年），主导🔧游戏架构设计与🕹️系统开发，游戏最高同时在线突破80万。\n\n### 🕹️ 游戏工业化先驱：\n- #### ⏳ <span style="font-size: 1.5em;">页游时代开拓者</span>：从诺基亚时代开始构建🎮大型虚拟社区，独立设计了基于位图高压缩率动画播放引擎，实现玩家千人同屏。\n- #### 🚦 <span style="font-size: 1.5em;">复杂场景应对专家</span>：历经📈千万DAU项目完整生命周期，沉淀🛠️模块化开发体系与⚙️跨端渲染解决方案。\n\n### 👥 技术驱动型管理实践：\n- #### ⚡ <span style="font-size: 1.5em;">敏捷开发实践者</span>：通过Jira/Trello实施🔄双周迭代开发，建立📊看板任务跟踪机制，缩短需求响应周期30%+，主导🔍代码评审规范制定，通过同行评审机制降低线上事故率50%+。\n- #### 🛠️ <span style="font-size: 1.5em;">技术决策主导者</span>：在初创公司周期中构建📜技术选型评估模型，主导架构选型会议并输出🔗技术可行性报告，通过自动化测试框架实现80%+核心接口覆盖率。\n\n### 🌐 协作流程标准化：\n- #### 📦 <span style="font-size: 1.5em;">SOP协作体系构建</span>：制定跨部门协作标准操作程序（SOP），明确🔄需求对接/🛠️技术联调/🔍问题追溯三阶段职责矩阵，通过📈流程可视化看板缩短沟通耗时40%+。\n'},target:{hidden:!0},header_info:{position:"技术管理",expected_salary:"期望薪资 面议"}},agent:{header_info:{position:"AI Agent工程师",expected_salary:"期望薪资 面议",status:"💚随时到岗"}},contracttask:{header_info:{position:"技术顾问/游戏资源优化/外包",expected_salary:"价格面议",status:"💚空闲-可接外包",home_page:""},personal_projects:{collapsedNodes:["虚拟社区/游戏 作品",["虚拟社区/游戏 作品.社区养成类.摩尔庄园（2007年，儿童社区---中国迪士尼）",!1]]},skills:{collapsedNodes:["技术栈"]},project_experience:{collapsedNodes:["项目经历"]},html5_game_bottleneck:{collapsedNodes:["HTML5游戏行业瓶颈 与 解决方案",["HTML5游戏行业瓶颈 与 解决方案.HTML5游戏行业瓶颈.关于动画资源",!1],["HTML5游戏行业瓶颈 与 解决方案.解决方案.逐帧动画.以腾讯《洛克王国Flash页游版》的宠物素材来举例👇",!1],["HTML5游戏行业瓶颈 与 解决方案.解决方案.逐帧动画.未优化👿 - 体积76M-内存408M-不支持特效",!1],["HTML5游戏行业瓶颈 与 解决方案.解决方案.逐帧动画.资源转换服务 - ⚡高清、流畅、无砍帧.矢量图和位图结合😃",!1],["HTML5游戏行业瓶颈 与 解决方案.解决方案.逐帧动画.资源优化方案对比📖 - 百倍提升",!1]]},tech_consulting:{collapsedNodes:["技术顾问服务 + 外部资源转换服务",["技术顾问服务 + 外部资源转换服务.服务亮点.资源转换服务特性",!1],["技术顾问服务 + 外部资源转换服务.服务内容.资源转换服务",!1]]},resource_conversion_demo:{collapsedNodes:["资源转换DEMO",["资源转换DEMO.示例3 - 交互动画",!1]]}}},loadPositionData:async e=>{switch(e){case"game":return(await w(async()=>{const{default:e}=await import("./DataGameDev-YyL4KD5G.js");return{default:e}},__vite__mapDeps([0,1,2,3]),import.meta.url)).default;case"frontend":case"backend":case"cto":return(await w(async()=>{const{default:e}=await import("./DataFrontendBackendCTO-KH6VY4ZZ.js");return{default:e}},__vite__mapDeps([4,1,3]),import.meta.url)).default;case"contracttask":return(await w(async()=>{const{default:e}=await import("./DataContractTask-D-LqL4AW.js");return{default:e}},__vite__mapDeps([5,2,3]),import.meta.url)).default;case"agent":return(await w(async()=>{const{default:e}=await import("./DataAgentEngineer-DbxiEqd1.js");return{default:e}},__vite__mapDeps([6,3]),import.meta.url)).default;default:return{}}},loadSkillsData:async()=>{const{getSkillsData:e}=await w(async()=>{const{getSkillsData:e}=await import("./SkillsData-BmwhxE0s.js");return{getSkillsData:e}},[],import.meta.url);return e()}};function D(e){return x("app:"+e)}const C=x("app:折叠");function _(e,...r){return r.forEach(r=>{Object.keys(r).forEach(t=>{const o=e[t],a=r[t];Array.isArray(o)&&Array.isArray(a)?e[t]=Array.from(new Set([...o,...a])):e[t]="object"==typeof o&&"object"==typeof a?_({...o},a):a})}),e}async function E(e){var r;j.collapsedMap.clear();const[t,o]=await Promise.all([S.loadPositionData(e),S.loadSkillsData()]),a=_({},t,S.expected_positions[e]),s=_({},S,a,{skill_level:o});j.data=s;const n=((null==(r=null==s?void 0:s.skill_level)?void 0:r.list)||[]).sort((e,r)=>e.length-r.length);j.skills=n;const i={};n.forEach(([e,r])=>{i[e.toLocaleLowerCase()]=[e,r]}),j.skillMap=i}function P(e){const[r,t]=d.useState(Math.min(e,document.body.getBoundingClientRect().width));return d.useEffect(()=>{const r=()=>{t(Math.min(e,document.body.getBoundingClientRect().width))};return window.addEventListener("resize",r),()=>{window.removeEventListener("resize",r)}},[]),r}function L(e,r){return e.replace(/\$\{([\w.]+)\}/g,(e,t)=>{const o=t.split(".");let a=r;for(const r of o)if(a=a?a[r]:void 0,void 0===a)return e;return a})}function z(e,r){const t=new Date,o=t.getFullYear(),a=t.getMonth()+1;function s(e){if(!/^\d+/.test(e))return[o,a];const r=[".","/","-"];let t,s;for(const o of r)if(e.includes(o)){[t,s]=e.split(o).map(Number);break}return t&&s||([t,s]=e.match(/\d+/g).map(Number)),[t,s]}const[n,i]=s(e),[d,c]=s(r);let l=d-n,p=c-i;p<0&&(l-=1,p+=12);let h="";return l>0&&(h+=`${l}年`),p>0&&(h+=`${p}个月`),h||"0个月"}function $(e,r){const[t,o]=d.useState({}),a=e=>{const t={};for(let o=0;o<r;o++)t[o]=e;setTimeout(()=>o(t),0)};return function(e,r){d.useEffect(()=>{j.collapsedMap.has(e)||j.collapsedMap.set(e,!1);const t=v(()=>j.collapsedMap.get(e),e=>{r(e)});return()=>{t()}},[e])}(e,a),{collapsedItems:t,toggleCollapse:(e,r)=>{o({...t,[e]:r??!t[e]})},setCollapsedAllItems:a}}function T(e,r=0){const t=S.header_info.cdn_static_assets_dirs,o=S.header_info.use_static_assets_from_cdn,a=S.header_info.static_assets_cdn_base_urls,s=o?a[r]:"";if(!s||!e)return e;const n=t.map(e=>`^\\/?${e}\\/`).join("|");return new RegExp(n).test(e)?(s+e).replace(/^\/+/,"/"):e}window.stopOtherVideos=function(e){document.querySelectorAll(".remark-video").forEach(r=>{r!==e.target&&r.pause()})};const A="920px",M=o`
  /* CSS变量定义 - 浅色主题 */
  :root {
    --color-primary: #3498db;
    --color-secondary: #2c3e50;
    --color-accent: #e74c3c;

    --color-background: #ffffff;
    --color-surface: #f8f9fa;
    --color-card: #ffffff;

    --color-text-primary: #2c3e50;
    --color-text-secondary: #7f8c8d;
    --color-text-disabled: #bdc3c7;
    --color-text-inverse: #ffffff;

    --color-border-light: #ecf0f1;
    --color-border-medium: #bdc3c7;
    --color-border-dark: #95a5a6;

    --color-status-success: #27ae60;
    --color-status-warning: #f39c12;
    --color-status-error: #e74c3c;
    --color-status-info: #3498db;

    --color-shadow-light: rgba(0, 0, 0, 0.05);
    --color-shadow-medium: rgba(0, 0, 0, 0.1);
    --color-shadow-dark: rgba(0, 0, 0, 0.2);
  }

  /* CSS变量定义 - 深色主题 - 护眼优化版本 */
  [data-theme="dark"] {
    --color-primary: #4a9eff;
    --color-secondary: #e2e8f0;
    --color-accent: #ff6b6b;

    --color-background: #0f1419;
    --color-surface: #1a202c;
    --color-card: #2d3748;

    --color-text-primary: #e2e8f0;
    --color-text-secondary: #a0aec0;
    --color-text-disabled: #718096;
    --color-text-inverse: #1a202c;

    --color-border-light: #2d3748;
    --color-border-medium: #4a5568;
    --color-border-dark: #718096;

    --color-status-success: #48bb78;
    --color-status-warning: #ed8936;
    --color-status-error: #f56565;
    --color-status-info: #4299e1;

    --color-shadow-light: rgba(0, 0, 0, 0.1);
    --color-shadow-medium: rgba(0, 0, 0, 0.25);
    --color-shadow-dark: rgba(0, 0, 0, 0.4);
  }

  /* 全局重置和移动端优化 */
  * {
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden; /* 防止根元素横向溢出 */
    width: 100%;
  }

  #root {
    width: 100%;
    overflow-x: hidden; /* 防止React根元素横向溢出 */
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    color: var(--color-text-primary);
    background-color: var(--color-surface);
    letter-spacing: 0.02em; /* 调整为你需要的值 */
    word-break: break-all;
    transition: color 0.3s ease, background-color 0.3s ease;

    /* 修复移动端横向溢出问题 */
    overflow-x: hidden; /* 隐藏横向滚动条 */
    width: 100%;
    box-sizing: border-box;
    min-height: 100vh;

    /* 背景图 */
    background-image: url('${T("images/flexi-resume.jpg")}');

    /* 背景图平铺 */
    background-repeat: repeat;
    background-size: 180px;
  }
  
  

  /* 针对代码块的样式 */
  pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      background-color: var(--color-surface);
      color: var(--color-text-primary);
      padding: 10px;
      border-radius: 5px;
      border: 1px solid var(--color-border-medium);
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
  
  .markdown-content img {
    max-width: 100%; /* 图片宽度自适应父容器 */
    height: auto;    /* 自动调整高度保持比例 */ 
  }

  .markdown-content video:not(.no-effect-icon),
  .markdown-content img:not(.no-effect-icon) {
    max-width: 100%;
    height: auto;
    margin: 5px 0;
    border-radius: 12px; /* 圆角 */
    box-shadow: 0 4px 12px var(--color-shadow-medium); /* 阴影 */
    background-color: var(--color-card);
    /* 视频的悬浮缩放效果 */
    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  }
 
  /* 悬浮效果 */
  .markdown-content video:not(.no-effect-icon):hover,
  .markdown-content img:not(.no-effect-icon):hover{
    transform: scale(1.03); /* 略微放大 */
    box-shadow: 0 6px 15px var(--color-shadow-dark); /* 增强阴影 */
  }

  .video-wrapper {
    position: relative;
    background: var(--color-surface);
    min-height: 100px;
    transition: background-color 0.3s ease;
  }

  .lazy-video {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .lazy-video.loaded {
    opacity: 1;
  }

  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    // background: rgba(0,0,0,0.7);
    color: var(--color-text-primary);
    border-radius: 4px;
    transition: color 0.3s ease;
  }

  /* 二维码深色模式优化 */
  [data-theme="dark"] {
    /* 确保二维码在深色模式下有良好的对比度 */
    svg[data-qr-code] {
      background: var(--color-card) !important;
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 2px 8px var(--color-shadow-medium);
    }

    /* 优化Markdown中的二维码显示 */
    .markdown-content svg {
      background: var(--color-card);
      border-radius: 8px;
      padding: 8px;
      transition: background-color 0.3s ease;
    }
  }
  
  #root {
    display: flex;  
    justify-content: center; /* 水平居中 */
    @media (max-width: ${A}) {
      flex-direction: column;  
      align-items: center 
    }  
  }
  h1, h2, h3, h4 {
    margin: 0;
    padding: 0;
  }
  
  a:not(.no-link-icon) {
    text-decoration: none;
    color: inherit;
    position: relative;
    &::before {
      content: '';
      display: inline-block;
      transform: translateY(0.2em);
      width: 1rem; /* 图标宽度 */
      height: 1rem; /* 图标高度 */
      margin-right: 0.4rem; /* 图标和文本的间距 */
      background: url(${T("images/url.svg")}) no-repeat center;
      background-size: contain; /* 保证图标自适应 */
    }
  }
  @media (max-width: ${A}) {
    body {
      padding: 1rem 0;
    }
    h1 {
      font-size: 1.8rem;
    } 
  }

  /* 加载状态样式 - 修复位置问题 */
  // .splash-loader {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   width: 100vw;
  //   height: 100vh;
  //   background: rgba(255, 255, 255, 0.95);
  //   backdrop-filter: blur(5px);
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
  //   z-index: 9999;
  //   transition: opacity 0.3s ease;
  //   /* 确保在所有设备上都能正确居中 */
  //   box-sizing: border-box;
  //   margin: 0;
  //   padding: 0;
  // }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
  }

  .splash-loader p {
    color: #666;
    font-size: 16px;
    margin: 0;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  /* 骨架屏样式 */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skeleton-text {
    height: 16px;
    margin: 8px 0;
    border-radius: 4px;
  }

  .skeleton-title {
    height: 24px;
    margin: 16px 0;
    border-radius: 6px;
  }

  @media print {
    body {
      background-color: white; 
    }
   
    .print-background {
      position: relative;
    }
  
    .print-background::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: lightgrey;
      z-index: -1;
    }
  } 
`,N="#aaa",I="920px",O=a.nav`
  /* 移动端样式 - 修复横向溢出问题 */
  padding: 0 10px; /* 减少左右padding */
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%; /* 确保不超出容器宽度 */
  max-width: 100vw; /* 不超出视口宽度 */
  box-sizing: border-box;
  top: 2px;
  justify-content: flex-start; /* 改为左对齐，避免溢出 */
  overflow-x: auto; /* 允许横向滚动，但尽量避免 */
  overflow-y: hidden;

  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (min-width: ${I}) {
    position: absolute;
    width: 45px;
    display: flex;
    flex-direction: column;
    top: 115px;
    left: 50%;
    transform: translateX(405px);
    border-radius: 8px 8px 0 0;
    align-items: flex-end;
    overflow: visible; /* 桌面端恢复正常 */
  }

  /* 在打印时隐藏 */
  @media print {
    display: none;
  }
`,R=a(h)`
  /* 移动端样式优化 */
  padding: 8px 12px; /* 减少padding避免溢出 */
  text-decoration: none;
  color: black;
  border: 2px solid transparent; /* 默认无边框 */
  border-radius: 8px 8px 0 0;
  border-top: 1px solid ${N};
  border-right: 1px solid ${N};
  border-bottom: 0px solid ${N};
  border-left: 1px solid ${N};
  transition: background-color 0.3s, border 0.3s;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  white-space: nowrap; /* 防止文字换行 */
  font-size: 14px; /* 移动端使用较小字体 */
  flex-shrink: 0; /* 防止被压缩 */

  &:hover, &.active {
    background-color: #f0f0f0;
    border-color: #333; /* 激活状态时显示边框颜色 */
    border-top: 2px solid #333; /* 激活状态显示右侧边框 */
  }

  @media (min-width: ${I}) {
    padding: 10px 10px;
    margin: 2px 0;
    border: none;
    text-align: center;
    font-size: 16px; /* 桌面端恢复正常字体大小 */

    /* 竖向排列文本 */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    border-radius: 0px 8px 8px 0px;
    border-top: 1px solid ${N};
    border-right: 1px solid ${N};
    border-bottom: 1px solid ${N};
    border-left: 0px solid ${N};

    &:hover, &.active {
      background-color: #f0f0f0;
      border-right: 2px solid #333; /* 激活状态显示右侧边框 */
    }
  }
`,W=()=>{var e;const r=j.data,t=j.tabs;if(!t.length)return document.title=(null==(e=null==r?void 0:r.header_info)?void 0:e.position)||"My Resume",null;const o=p();return d.useEffect(()=>{var e;const t=function(e){var r;const t=j.data,o=j.tabs,a=e.pathname,s=o.find(([,e])=>e===a);return s?s[0]:(null==(r=null==t?void 0:t.header_info)?void 0:r.position)||""}(o),a=(s=(null==(e=null==r?void 0:r.header_info)?void 0:e.resume_name_format)||"{position}-{name}-{age}-{location}",n=Object.assign({},r.header_info,{position:t}),s.replace(/{(position|name|age|location)}/g,(e,r)=>n[r]||""));var s,n;document.title=a},[o]),s.jsx(O,{children:t.map(([e,r],t)=>s.jsx(R,{className:"no-link-icon",to:r,children:e},r))})};function F(e){return k({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},child:[]}]})(e)}const H=a.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`,V=a.img`
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.3s ease;
    cursor: pointer; 
`,B=a.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  padding: 10px;
  cursor: pointer;
  z-index: 1100;  
`,U=({imageUrl:e,onClose:r})=>s.jsxs(H,{onClick:r,children:[s.jsx(V,{src:e,onClick:e=>e.stopPropagation()}),s.jsx(B,{onClick:r,children:s.jsx(F,{size:30,color:"white"})})]}),G=d.createContext(void 0),J=({children:e})=>{const[r,t]=d.useState(!1),[o,a]=d.useState(""),i=e=>{a(e),t(!0)};return window.$handleImageClick=i,s.jsxs(G.Provider,{value:{handleImageClick:i},children:[e,r&&s.jsx(n.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:s.jsx(U,{imageUrl:o,onClose:()=>{t(!1)}})})]})},K=a.div`
  max-width: 800px;
  padding: 40px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 20px auto;
`,q=a.div`
  font-size: 64px;
  color: #ff6b6b;
  margin-bottom: 20px;
`,Q=a.h2`
  color: #333;
  margin-bottom: 16px;
  font-size: 24px;
`,Y=a.p`
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
`,X=a.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2980b9;
  }

  &:active {
    transform: translateY(1px);
  }
`;a.details`
  margin-top: 20px;
  text-align: left;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e9ecef;

  summary {
    cursor: pointer;
    font-weight: bold;
    color: #495057;
    margin-bottom: 8px;
  }

  pre {
    background: #fff;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    color: #e74c3c;
    border: 1px solid #dee2e6;
  }
`;class Z extends d.Component{constructor(e){super(e),t(this,"handleRetry",()=>{this.setState({hasError:!1,error:void 0,errorInfo:void 0})}),this.state={hasError:!1}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,r){this.setState({error:e,errorInfo:r})}render(){return this.state.hasError?this.props.fallback?this.props.fallback:s.jsxs(K,{children:[s.jsx(q,{children:"⚠️"}),s.jsx(Q,{children:"页面加载出错了"}),s.jsxs(Y,{children:["抱歉，页面遇到了一些问题。请尝试刷新页面或稍后再试。",s.jsx("br",{}),"如果问题持续存在，请联系技术支持。"]}),s.jsx(X,{onClick:this.handleRetry,children:"重新加载"}),!1]}):this.props.children}}const ee=i`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`,re=a.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${ee} 1.5s infinite linear;
  border-radius: 4px;
`,te=a(re)`
  height: ${e=>e.height||"16px"};
  width: ${e=>e.width||"100%"};
  margin: ${e=>e.margin||"8px 0"};
`,oe=a(re)`
  height: ${e=>{switch(e.size){case"small":return"20px";case"large":return"32px";default:return"24px"}}};
  width: ${e=>{switch(e.size){case"small":return"120px";case"large":return"200px";default:return"150px"}}};
  margin: 16px 0;
`,ae=a(re)`
  width: ${e=>e.size||80}px;
  height: ${e=>e.size||80}px;
  border-radius: 50%;
  flex-shrink: 0;
`;a(re)`
  height: 36px;
  width: ${e=>e.width||"100px"};
  border-radius: 6px;
`;const se=a.div`
  padding: ${e=>e.padding||"20px"};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 16px 0;
  background: #fff;
`;a(re)`
  width: ${e=>e.width||"100%"};
  height: ${e=>e.height||"200px"};
  aspect-ratio: ${e=>e.aspectRatio||"auto"};
  border-radius: 8px;
`;const ne=()=>s.jsxs("div",{style:{padding:"20px",maxWidth:"800px",margin:"0 auto",background:"var(--color-card)",borderRadius:"8px",boxShadow:"0 0 15px var(--color-shadow-medium)",transition:"background-color 0.3s ease, box-shadow 0.3s ease"},children:[s.jsxs("div",{style:{display:"flex",gap:"20px",marginBottom:"40px"},children:[s.jsx(ae,{size:100}),s.jsxs("div",{style:{flex:1},children:[s.jsx(oe,{size:"large"}),s.jsx(te,{width:"60%",height:"18px"}),s.jsx(te,{width:"50%",height:"16px"}),s.jsx(te,{width:"40%",height:"16px"})]})]}),s.jsxs(se,{children:[s.jsx(oe,{size:"medium"}),s.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"12px"},children:[s.jsx(te,{width:"80%"}),s.jsx(te,{width:"70%"}),s.jsx(te,{width:"90%"}),s.jsx(te,{width:"75%"}),s.jsx(te,{width:"85%"}),s.jsx(te,{width:"65%"})]})]}),s.jsxs(se,{children:[s.jsx(oe,{size:"medium"}),s.jsxs("div",{style:{marginBottom:"24px"},children:[s.jsx(te,{width:"40%",height:"20px"}),s.jsx(te,{width:"100%"}),s.jsx(te,{width:"95%"}),s.jsx(te,{width:"88%"})]}),s.jsxs("div",{children:[s.jsx(te,{width:"35%",height:"20px"}),s.jsx(te,{width:"100%"}),s.jsx(te,{width:"92%"}),s.jsx(te,{width:"85%"})]})]}),s.jsxs(se,{children:[s.jsx(oe,{size:"medium"}),s.jsx(te,{width:"50%",height:"18px"}),s.jsx(te,{width:"100%"}),s.jsx(te,{width:"90%"}),s.jsx(te,{width:"95%"})]})]}),ie={zh:{nav:{frontend:"NodeJs开发",backend:"后端工程师",cto:"技术管理",contract:"技术顾问/游戏资源优化/外包",agent:"AI Agent工程师",gamedev:"游戏开发"},common:{loading:"加载中...",error:"加载失败",retry:"重试",contact:"联系我",download:"下载简历",print:"打印简历",share:"分享",switchLanguage:"切换语言",switchTheme:"切换主题",lightMode:"浅色模式",darkMode:"深色模式",controlPanel:"控制面板",theme:"主题",language:"语言"},resume:{personalInfo:"个人信息",personalStrengths:"个人优势",skills:"技能清单",employmentHistory:"工作经历",projectExperience:"项目经历",educationHistory:"教育背景",personalInfluence:"个人影响力",careerPlanning:"职业规划",openSourceProjects:"开源项目"},profile:{position:"求职意向",expectedSalary:"期望薪资",status:"工作状态",phone:"联系电话",email:"邮箱地址",location:"所在地区",experience:"工作经验",education:"学历"},time:{present:"至今",years:"年",months:"个月"}},en:{nav:{frontend:"NodeJs Developer",backend:"Backend Engineer",cto:"Technical Management",contract:"Technical Consultant/Game Optimization/Outsourcing",agent:"AI Agent Engineer",gamedev:"Game Developer"},common:{loading:"Loading...",error:"Load Failed",retry:"Retry",contact:"Contact Me",download:"Download Resume",print:"Print Resume",share:"Share",switchLanguage:"Switch Language",switchTheme:"Switch Theme",lightMode:"Light Mode",darkMode:"Dark Mode",controlPanel:"Control Panel",theme:"Theme",language:"Language"},resume:{personalInfo:"Personal Information",personalStrengths:"Personal Strengths",skills:"Skills",employmentHistory:"Work Experience",projectExperience:"Project Experience",educationHistory:"Education",personalInfluence:"Personal Influence",careerPlanning:"Career Planning",openSourceProjects:"Open Source Projects"},profile:{position:"Position",expectedSalary:"Expected Salary",status:"Status",phone:"Phone",email:"Email",location:"Location",experience:"Experience",education:"Education"},time:{present:"Present",years:" years",months:" months"}}},de=d.createContext(void 0),ce=({children:e})=>{const[r,t]=d.useState(()=>{const e=localStorage.getItem("language");return!e||"zh"!==e&&"en"!==e?navigator.language.toLowerCase().startsWith("zh")?"zh":"en":e});d.useEffect(()=>{localStorage.setItem("language",r)},[r]);const o={language:r,setLanguage:t,t:ie[r]};return s.jsx(de.Provider,{value:o,children:e})},le=()=>{const e=d.useContext(de);if(!e)throw new Error("useI18n must be used within an I18nProvider");return e},pe={light:{primary:"#3498db",secondary:"#2c3e50",accent:"#e74c3c",background:"#ffffff",surface:"#f8f9fa",card:"#ffffff",text:{primary:"#2c3e50",secondary:"#7f8c8d",disabled:"#bdc3c7",inverse:"#ffffff"},border:{light:"#ecf0f1",medium:"#bdc3c7",dark:"#95a5a6"},status:{success:"#27ae60",warning:"#f39c12",error:"#e74c3c",info:"#3498db"},shadow:{light:"rgba(0, 0, 0, 0.05)",medium:"rgba(0, 0, 0, 0.1)",dark:"rgba(0, 0, 0, 0.2)"}},dark:{primary:"#4a9eff",secondary:"#e2e8f0",accent:"#ff6b6b",background:"#0f1419",surface:"#1a202c",card:"#2d3748",text:{primary:"#e2e8f0",secondary:"#a0aec0",disabled:"#718096",inverse:"#1a202c"},border:{light:"#2d3748",medium:"#4a5568",dark:"#718096"},status:{success:"#48bb78",warning:"#ed8936",error:"#f56565",info:"#4299e1"},shadow:{light:"rgba(0, 0, 0, 0.1)",medium:"rgba(0, 0, 0, 0.25)",dark:"rgba(0, 0, 0, 0.4)"}}},he=d.createContext(void 0),ge=({children:e})=>{const[r,t]=d.useState(()=>{const e=localStorage.getItem("theme");return!e||"light"!==e&&"dark"!==e?window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e});d.useEffect(()=>{localStorage.setItem("theme",r),document.documentElement.setAttribute("data-theme",r);const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",pe[r].background)},[r]),d.useEffect(()=>{const e=window.matchMedia("(prefers-color-scheme: dark)"),r=e=>{localStorage.getItem("theme")||t(e.matches?"dark":"light")};return e.addEventListener("change",r),()=>e.removeEventListener("change",r)},[]);const o={mode:r,setMode:t,toggleMode:()=>{t(e=>"light"===e?"dark":"light")},colors:pe[r],isDark:"dark"===r};return s.jsx(he.Provider,{value:o,children:e})},ue=()=>{const e=d.useContext(he);if(!e)throw new Error("useTheme must be used within a ThemeProvider");return e},me=a.div`
  position: relative;
  display: inline-block;
`,fe=a.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${e=>e.isDark?"rgba(45, 55, 72, 0.9)":"rgba(255, 255, 255, 0.9)"};
  border: 1px solid ${e=>e.isDark?"rgba(74, 85, 104, 0.6)":"#e0e0e0"};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: ${e=>e.isDark?"#e2e8f0":"#333"};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${e=>e.isDark?"rgba(45, 55, 72, 1)":"rgba(255, 255, 255, 1)"};
    border-color: ${e=>e.isDark?"#4a9eff":"#3498db"};
    box-shadow: 0 2px 8px ${e=>e.isDark?"rgba(74, 158, 255, 0.3)":"rgba(52, 152, 219, 0.2)"};
  }

  &:active {
    transform: translateY(1px);
  }
`,be=a.span`
  font-size: 16px;
  line-height: 1;
`,xe=a.span`
  font-weight: 500;
`,ve=a.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: ${e=>e.isDark?"rgba(26, 32, 44, 0.95)":"white"};
  border: 1px solid ${e=>e.isDark?"rgba(45, 55, 72, 0.8)":"#e0e0e0"};
  border-radius: 6px;
  box-shadow: 0 4px 12px ${e=>e.isDark?"rgba(0, 0, 0, 0.4)":"rgba(0, 0, 0, 0.1)"};
  backdrop-filter: blur(10px);
  z-index: 1000;
  min-width: 120px;
  opacity: ${e=>e.isOpen?1:0};
  visibility: ${e=>e.isOpen?"visible":"hidden"};
  transform: ${e=>e.isOpen?"translateY(0)":"translateY(-10px)"};
  transition: all 0.3s ease;
`,ke=a.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: ${e=>e.isActive?e.isDark?"rgba(45, 55, 72, 0.8)":"#f8f9fa":"transparent"};
  color: ${e=>e.isActive?e.isDark?"#4a9eff":"#3498db":e.isDark?"#e2e8f0":"#333"};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }

  &:hover {
    background: ${e=>e.isDark?"rgba(45, 55, 72, 0.8)":"#f8f9fa"};
    color: ${e=>e.isDark?"#4a9eff":"#3498db"};
  }

  &:active {
    background: ${e=>e.isDark?"rgba(45, 55, 72, 1)":"#e9ecef"};
  }
`,ye=a.span`
  opacity: ${e=>e.visible?1:0};
  color: ${e=>e.isDark?"#48bb78":"#27ae60"};
  font-weight: bold;
  margin-left: auto;
`,we=[{code:"zh",name:"Chinese",icon:"🇨🇳",nativeName:"中文"},{code:"en",name:"English",icon:"🇺🇸",nativeName:"English"}],je=({className:e})=>{const{language:r,setLanguage:t,t:o}=le(),{isDark:a}=ue(),[n,i]=c.useState(!1),d=we.find(e=>e.code===r),l=c.useCallback(e=>{e.target.closest("[data-language-switcher]")||i(!1)},[]);return c.useEffect(()=>{if(n)return document.addEventListener("click",l),()=>document.removeEventListener("click",l)},[n,l]),s.jsxs(me,{className:e,"data-language-switcher":!0,children:[s.jsxs(fe,{isDark:a,onClick:()=>i(!n),title:o.common.switchLanguage,"aria-label":o.common.switchLanguage,children:[s.jsx(be,{children:null==d?void 0:d.icon}),s.jsx(xe,{children:null==d?void 0:d.nativeName}),s.jsx("span",{style:{transform:n?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.3s ease",fontSize:"12px"},children:"▼"})]}),s.jsx(ve,{isOpen:n,isDark:a,children:we.map(e=>s.jsxs(ke,{isActive:r===e.code,isDark:a,onClick:()=>{return r=e.code,t(r),void i(!1);var r},children:[s.jsx("span",{children:e.icon}),s.jsx("span",{children:e.nativeName}),s.jsx(ye,{visible:r===e.code,isDark:a,children:"✓"})]},e.code))})]})},Se=a.div`
  position: relative;
  display: inline-block;
`,De=a.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${e=>e.isDark?"rgba(45, 55, 72, 0.6)":"rgba(0, 0, 0, 0.05)"};
  border: 1px solid ${e=>e.isDark?"rgba(74, 85, 104, 0.6)":"rgba(0, 0, 0, 0.1)"};
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: ${e=>e.isDark?"#ed8936":"#ff6b35"};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${e=>e.isDark?"rgba(45, 55, 72, 0.8)":"rgba(0, 0, 0, 0.08)"};
    border-color: ${e=>e.isDark?"rgba(113, 128, 150, 0.8)":"rgba(0, 0, 0, 0.15)"};
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${e=>e.isDark?"rgba(237, 137, 54, 0.3)":"rgba(255, 107, 53, 0.3)"};
  }

  &:active {
    transform: scale(0.95);
  }
`,Ce=a.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${e=>e.isVisible?"scale(1) rotate(0deg)":"scale(0) rotate(180deg)"};
  opacity: ${e=>e.isVisible?1:0};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`,_e=a.div`
  position: relative;
  
  &::before {
    content: '☀️';
    font-size: 20px;
    display: block;
  }
`,Ee=a.div`
  position: relative;
  
  &::before {
    content: '🌙';
    font-size: 18px;
    display: block;
  }
`,Pe=a.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 6px 12px;
  background: ${e=>e.isDark?"rgba(226, 232, 240, 0.95)":"rgba(0, 0, 0, 0.8)"};
  color: ${e=>e.isDark?"#1a202c":"#ffffff"};
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${e=>e.isVisible?1:0};
  visibility: ${e=>e.isVisible?"visible":"hidden"};
  transform: translateX(-50%) ${e=>e.isVisible?"translateY(0)":"translateY(4px)"};
  transition: all 0.3s ease;
  z-index: 1000;
  backdrop-filter: blur(10px);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${e=>e.isDark?"rgba(226, 232, 240, 0.95)":"rgba(0, 0, 0, 0.8)"};
  }
`,Le=a.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(160, 174, 192, 0.6) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
  pointer-events: none;
  
  ${e=>e.isActive&&"\n    width: 100px;\n    height: 100px;\n  "}
`,ze=({className:e,showTooltip:r=!0})=>{const{mode:t,toggleMode:o,isDark:a}=ue(),{t:n}=le(),[i,d]=c.useState(!1),[l,p]=c.useState(!1),h=a?n.common.lightMode:n.common.darkMode;return s.jsxs(Se,{className:e,onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),children:[s.jsxs(De,{isDark:a,onClick:()=>{p(!0),setTimeout(()=>p(!1),600),o()},title:h,"aria-label":h,children:[s.jsx(Le,{isActive:l}),s.jsx(Ce,{isVisible:!a,children:s.jsx(_e,{})}),s.jsx(Ce,{isVisible:a,children:s.jsx(Ee,{})})]}),r&&s.jsx(Pe,{isDark:a,isVisible:i,children:h})]})},$e=a.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${e=>e.isDark?"rgba(26, 32, 44, 0.95)":"rgba(255, 255, 255, 0.95)"};
  border: 1px solid ${e=>e.isDark?"rgba(45, 55, 72, 0.8)":"rgba(0, 0, 0, 0.1)"};
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px ${e=>e.isDark?"rgba(0, 0, 0, 0.4)":"rgba(0, 0, 0, 0.1)"};
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px ${e=>e.isDark?"rgba(0, 0, 0, 0.6)":"rgba(0, 0, 0, 0.15)"};
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    padding: 8px;
    gap: 8px;
  }
`,Te=a.div`
  width: 1px;
  height: 24px;
  background: ${e=>e.isDark?"rgba(74, 85, 104, 0.6)":"rgba(0, 0, 0, 0.1)"};
  transition: background 0.3s ease;
`;a.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid ${e=>e.isDark?"rgba(74, 85, 104, 0.6)":"rgba(0, 0, 0, 0.1)"};
  border-radius: 8px;
  cursor: pointer;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: ${e=>e.isDark?"rgba(45, 55, 72, 0.8)":"rgba(0, 0, 0, 0.05)"};
    border-color: ${e=>e.isDark?"rgba(113, 128, 150, 0.8)":"rgba(0, 0, 0, 0.2)"};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;const Ae=a.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
  }
`,Me=a.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${e=>e.isDark?"rgba(26, 32, 44, 0.95)":"rgba(255, 255, 255, 0.95)"};
  border: 1px solid ${e=>e.isDark?"rgba(45, 55, 72, 0.8)":"rgba(0, 0, 0, 0.1)"};
  border-radius: 50%;
  cursor: pointer;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
  font-size: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 16px ${e=>e.isDark?"rgba(0, 0, 0, 0.4)":"rgba(0, 0, 0, 0.1)"};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px ${e=>e.isDark?"rgba(0, 0, 0, 0.6)":"rgba(0, 0, 0, 0.15)"};
  }

  &:active {
    transform: scale(0.95);
  }
`,Ne=a.div`
  margin-top: 12px;
  padding: 16px;
  background: ${e=>e.isDark?"rgba(26, 32, 44, 0.95)":"rgba(255, 255, 255, 0.95)"};
  border: 1px solid ${e=>e.isDark?"rgba(45, 55, 72, 0.8)":"rgba(0, 0, 0, 0.1)"};
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px ${e=>e.isDark?"rgba(0, 0, 0, 0.4)":"rgba(0, 0, 0, 0.1)"};
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
`,Ie=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,Oe=a.span`
  font-size: 14px;
  font-weight: 500;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
`,Re=({className:e,collapsible:r=!1,defaultCollapsed:t=!1})=>{const{isDark:o}=ue(),{t:a}=le(),[n,i]=c.useState(t);return r?s.jsxs(Ae,{isCollapsed:n,isDark:o,className:e,children:[s.jsx(Me,{isDark:o,onClick:()=>i(!n),title:a.common.controlPanel,"aria-label":a.common.controlPanel,children:n?"⚙️":"✕"}),!n&&s.jsxs(Ne,{isDark:o,children:[s.jsxs(Ie,{children:[s.jsx(Oe,{isDark:o,children:a.common.theme}),s.jsx(ze,{showTooltip:!1})]}),s.jsx(Te,{isDark:o}),s.jsxs(Ie,{children:[s.jsx(Oe,{isDark:o,children:a.common.language}),s.jsx(je,{})]})]})]}):s.jsxs($e,{isDark:o,className:e,children:[s.jsx(ze,{}),s.jsx(Te,{isDark:o}),s.jsx(je,{})]})},We=D("PerformanceMonitor");new class{constructor(){t(this,"metrics",{}),t(this,"observers",[]),this.init()}init(){this.observeNavigation(),this.observeWebVitals(),this.observeResources(),this.setupReporting()}observeNavigation(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("navigation"===r.entryType){const e=r;this.metrics.TTFB=e.responseStart-e.requestStart,this.metrics.pageLoadTime=e.loadEventEnd-e.navigationStart,We("Navigation metrics:",{TTFB:this.metrics.TTFB,pageLoadTime:this.metrics.pageLoadTime})}});e.observe({entryTypes:["navigation"]}),this.observers.push(e)}}observeWebVitals(){this.observeLCP(),this.observeFID(),this.observeCLS(),this.observeFCP()}observeLCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{const r=e.getEntries(),t=r[r.length-1];this.metrics.LCP=t.startTime,We("LCP:",this.metrics.LCP)});e.observe({entryTypes:["largest-contentful-paint"]}),this.observers.push(e)}}observeFID(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("first-input"===r.entryType){const e=r;this.metrics.FID=e.processingStart-e.startTime,We("FID:",this.metrics.FID)}});e.observe({entryTypes:["first-input"]}),this.observers.push(e)}}observeCLS(){if("PerformanceObserver"in window){let e=0;const r=new PerformanceObserver(r=>{for(const t of r.getEntries())"layout-shift"!==t.entryType||t.hadRecentInput||(e+=t.value);this.metrics.CLS=e,We("CLS:",this.metrics.CLS)});r.observe({entryTypes:["layout-shift"]}),this.observers.push(r)}}observeFCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())"first-contentful-paint"===r.name&&(this.metrics.FCP=r.startTime,We("FCP:",this.metrics.FCP))});e.observe({entryTypes:["paint"]}),this.observers.push(e)}}observeResources(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("resource"===r.entryType){const e=r,t=e.responseEnd-e.startTime;t>1e3&&We("Slow resource:",{name:e.name,loadTime:t,size:e.transferSize})}});e.observe({entryTypes:["resource"]}),this.observers.push(e)}}setupReporting(){document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&this.reportMetrics()}),window.addEventListener("beforeunload",()=>{this.reportMetrics()})}reportMetrics(){We("Performance Metrics:",this.metrics),navigator.sendBeacon&&JSON.stringify({url:window.location.href,timestamp:Date.now(),metrics:this.metrics,userAgent:navigator.userAgent})}recordCustomMetric(e,r){this.metrics[e]=r,We(`Custom metric ${e}:`,r)}getMetrics(){return{...this.metrics}}cleanup(){this.observers.forEach(e=>e.disconnect()),this.observers=[]}};const Fe=d.lazy(()=>w(()=>import("./FlexiResume-DAzHqlbi.js"),__vite__mapDeps([7,8,9,10,11,12,13]),import.meta.url));j.tabs=Object.keys(S.expected_positions).map(e=>{var r;return[null==(r=S.expected_positions[e].header_info)?void 0:r.position,"/"+e,!!S.expected_positions[e].is_home_page]});const He=j.tabs,Ve=(null==(e=He.find(([,,e])=>e))?void 0:e[1])||"/",Be=()=>(function(){const e=()=>{document.querySelectorAll(".lazy-video").forEach(e=>{const r=e.getBoundingClientRect();r.top<window.innerHeight+200&&r.bottom>0&&(e=>{const r=JSON.parse(e.dataset.sources);e.innerHTML=` \n        <source src="${T(r.original)}" type="video/mp4">\n        <source src="${T(r.original,1)}" type="video/mp4">\n      `,e.classList.remove("lazy-video"),e.removeAttribute("data-sources");const t=e.parentNode.querySelector(".loading-indicator");null==t||t.remove()})(e)})};let r;window.addEventListener("scroll",()=>{r&&clearTimeout(r),r=setTimeout(e,100)}),window.addEventListener("resize",e),window.addEventListener("mouseup",()=>setTimeout(e,0)),e()}(),s.jsx(ge,{children:s.jsx(ce,{children:s.jsx(Z,{children:s.jsxs(J,{children:[s.jsx(M,{}),s.jsx(Re,{collapsible:!0}),s.jsxs(g,{basename:S.header_info.route_base_name,children:[s.jsx(W,{})," ",s.jsxs(u,{children:[He.map(([e,r],t)=>s.jsx(m,{path:r,element:s.jsx(Z,{children:s.jsx(d.Suspense,{fallback:s.jsx(ne,{}),children:s.jsx(Fe,{path:r})})})},t)),s.jsx(m,{path:"/",element:s.jsx(f,{to:Ve})})]})]})]})})})}));l(document.getElementById("root")).render(s.jsx(d.StrictMode,{children:s.jsx(Be,{})}));export{L as a,$ as b,z as c,E as d,j as f,D as g,C as l,T as r,ue as u,P as w};
