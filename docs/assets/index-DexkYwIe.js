const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Data-BDZ6rSXX.js","./mermaid-core-CxzdCigi.js","./react-vendor-DQmNySUk.js","./d3-charts-C9eKmPJg.js","./Data-WmUYyFfw.js","./utils-CEXnc-BX.js","./cytoscape-3nCDfVzk.js","./FlexiResume-CeE5fY3n.js","./framer-motion-CXdLbqfN.js","./vendor-B9-6CCQX.js","./react-icons-mdDy3BM0.js","./react-markdown-BR0DeiX9.js"])))=>i.map(i=>d[i]);
import{j as e,m as r}from"./framer-motion-CXdLbqfN.js";import{b as t,r as o,R as a}from"./react-vendor-DQmNySUk.js";import{_ as i,aD as s}from"./mermaid-core-CxzdCigi.js";import{m as n,r as c,f as l,d,u as p,N as h,a as m,B as u,R as g,b as f,c as b}from"./vendor-B9-6CCQX.js";import{G as x}from"./react-icons-mdDy3BM0.js";import"./d3-charts-C9eKmPJg.js";var w;!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if("childList"===t.type)for(const e of t.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();var k=t;w=k.createRoot,k.hydrateRoot;const v=new class{data={};tabs=[];skillMap=[];skills=[];collapsedMap=new Map;constructor(){n(this);const e=this.collapsedMap.set;this.collapsedMap.set=function(r,t){V("Store",t,r),e.call(this,r,t)}}},y="zh";let D=y;const C=new Map,j=[],P=()=>D,$=e=>{D!==e&&(D=e,j.forEach(r=>r(e)))},S=async e=>{if(C.has(e))return C.get(e);try{let r;if("zh"===e)r=await i(()=>import("./Data-BDZ6rSXX.js"),__vite__mapDeps([0,1,2,3]),import.meta.url);else{if("en"!==e)throw new Error(`Unsupported language: ${e}`);r=await i(()=>import("./Data-WmUYyFfw.js"),__vite__mapDeps([4,1,2,3]),import.meta.url)}const t=r.default;return C.set(e,t),t}catch(r){if(e!==y)return S(y);throw r}},L=async()=>S(D),T=()=>{const e=navigator.language.toLowerCase();return e.startsWith("zh")?"zh":e.startsWith("en")?"en":y};(()=>{try{const e=localStorage.getItem("flexiresume-language");D=!e||"zh"!==e&&"en"!==e?T():e}catch(e){D=T()}})();var z={};const E={cdn:{enabled:!0,baseUrls:["https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/","https://flexiresume-static.web.app/","https://dedenlabs.github.io/flexiresume-static/"],healthCheck:{timeout:5e3,testPath:"favicon.ico",enabled:!0},sortingStrategy:{mode:"speed",enabled:!0,speedWeight:.7,availabilityWeight:.3}},api:{baseUrl:"undefined"!=typeof process&&z?.REACT_APP_API_BASE_URL||"",timeout:1e4,version:"v1"},theme:{defaultTheme:"auto",enableTransitions:!0,transitionDuration:300},performance:{enableLazyLoading:!0,lazyLoadingThreshold:100,enablePreloading:!0,preloadResources:["/images/avatar.webp","/images/background.webp"],preloadLibraries:{mermaid:!0,svgPanZoom:!0,katex:!1,cytoscape:!1}},app:{name:"FlexiResume",version:"undefined"!=typeof process&&z?.REACT_APP_VERSION||"1.0.0",buildTime:"undefined"!=typeof process&&z?.REACT_APP_BUILD_TIME||(new Date).toISOString(),isDevelopment:!1},debug:{enabled:!1,showPerformanceMonitor:!1,verboseLogging:!1}},_=()=>E.cdn,M=()=>E.debug.enabled;class I{static instance;healthResults=new Map;isChecking=!1;checkPromise=null;constructor(){}static getInstance(){return I.instance||(I.instance=new I),I.instance}async checkSingleCDN(e,r,t){const o=Date.now(),a=o;try{const s=e.endsWith("/")?`${e}${r}`:`${e}/${r}`;M();const n=new AbortController,c=setTimeout(()=>n.abort(),t);try{const r=await fetch(s,{method:"HEAD",signal:n.signal,cache:"no-cache",mode:"cors"});clearTimeout(c);const t=Date.now()-o,i={url:e,available:r.ok,responseTime:t,timestamp:a};return r.ok||(i.error=`HTTP ${r.status}: ${r.statusText}`),M(),i}catch(i){throw clearTimeout(c),i}}catch(s){return{url:e,available:!1,responseTime:Date.now()-o,error:s instanceof Error?s.message:"Unknown error",timestamp:a}}}async checkAllCDNs(e={}){if(this.isChecking&&this.checkPromise)return this.checkPromise;this.isChecking=!0;const r=_(),{timeout:t=r.healthCheck.timeout,testPath:o=r.healthCheck.testPath,concurrent:a=!0,maxConcurrency:i=3}=e;this.checkPromise=this.performHealthCheck(r.baseUrls,o,t,a,i);try{const e=await this.checkPromise;return e.forEach(e=>{this.healthResults.set(e.url,e)}),this.reorderCDNUrls(e),M(),e}finally{this.isChecking=!1,this.checkPromise=null}}async performHealthCheck(e,r,t,o,a){if(o){const o=[];for(let i=0;i<e.length;i+=a){const s=e.slice(i,i+a).map(e=>this.checkSingleCDN(e,r,t)),n=await Promise.all(s);o.push(...n)}return o}{const o=[];for(const a of e){const e=await this.checkSingleCDN(a,r,t);o.push(e)}return o}}reorderCDNUrls(e){const r=_().sortingStrategy;if(!r.enabled)return;let t;if("availability"===r.mode){const r=e.filter(e=>e.available).sort((e,r)=>e.responseTime-r.responseTime),o=e.filter(e=>!e.available);t=[...r.map(e=>e.url),...o.map(e=>e.url)]}else{if("speed"!==r.mode)return;{const o=e.filter(e=>e.available).sort((e,t)=>{const o=1/e.responseTime*r.speedWeight+(e.available?1:0)*r.availabilityWeight;return 1/t.responseTime*r.speedWeight+(t.available?1:0)*r.availabilityWeight-o}),a=e.filter(e=>!e.available);t=[...o.map(e=>e.url),...a.map(e=>e.url)]}}var o;o={baseUrls:t},Object.assign(E.cdn,o)}getHealthResults(){return Array.from(this.healthResults.values())}getAvailableCDNs(){return Array.from(this.healthResults.values()).filter(e=>e.available).sort((e,r)=>e.responseTime-r.responseTime).map(e=>e.url)}isCDNAvailable(e){const r=this.healthResults.get(e);return!!r&&r.available}clearCache(){this.healthResults.clear()}getBestCDN(){const e=this.getAvailableCDNs();return e.length>0?e[0]:null}getAllResults(){return Array.from(this.healthResults.values())}}const R=I.getInstance();class A{static instance;urlCache=new Map;isInitialized=!1;initPromise=null;constructor(){}static getInstance(){return A.instance||(A.instance=new A),A.instance}async initialize(){if(!this.isInitialized){if(this.initPromise)return this.initPromise;this.initPromise=this.performInitialization(),await this.initPromise}}async performInitialization(){const e=_();if(e.enabled)if(e.healthCheck.enabled)try{M(),await R.checkAllCDNs(),M()}catch(r){}finally{this.isInitialized=!0,this.initPromise=null}else this.isInitialized=!0;else this.isInitialized=!0}getResourceUrl(e,r={}){const{enableFallback:t=!0,localBasePath:o="",cacheUrls:a=!0}=r;if(a&&this.urlCache.has(e))return this.urlCache.get(e);const i=_();if(!i.enabled){const r=this.buildLocalUrl(e,o);return a&&this.urlCache.set(e,r),r}const s=R.getBestCDN();if(s){const r=this.buildCDNUrl(s,e);return a&&this.urlCache.set(e,r),r}if(R.getAllResults().length===i.baseUrls.length){if(t){const r=this.buildLocalUrl(e,o);return a&&this.urlCache.set(e,r),r}}else if(i.baseUrls.length>0){const r=i.baseUrls[0];return this.buildCDNUrl(r,e)}if(t){const r=this.buildLocalUrl(e,o);return a&&this.urlCache.set(e,r),r}throw new Error(`[CDN Manager] No CDN available and fallback is disabled for resource: ${e}`)}buildCDNUrl(e,r){return`${e.endsWith("/")?e.slice(0,-1):e}/${r.startsWith("/")?r.slice(1):r}`}buildLocalUrl(e,r){if(r)return`${r.endsWith("/")?r.slice(0,-1):r}/${e.startsWith("/")?e.slice(1):e}`;let t="";if("undefined"!=typeof window)try{const e=window.location.pathname.split("/").filter(e=>e);if(e.length>0&&(!window.location.port||"5173"!==window.location.port&&"5174"!==window.location.port&&"3000"!==window.location.port)&&e.length>=1){const r=e.slice(0,-1);r.length>0&&(t="/"+r.join("/")+"/")}}catch(a){}const o=t+(e.startsWith("/")?e.slice(1):e);if("undefined"!=typeof window){const{protocol:e,hostname:r,port:t}=window.location;return`${e}//${r}${t&&"80"!==t&&"443"!==t?`:${t}`:""}${o}`}return o}async preloadResources(e,r={}){const t=e.map(async e=>{try{const t=this.getResourceUrl(e,r),o=document.createElement("link");o.rel="preload",o.href=t;const a=e.split(".").pop()?.toLowerCase();switch(a){case"jpg":case"jpeg":case"png":case"webp":case"svg":o.as="image";break;case"css":o.as="style";break;case"js":o.as="script";break;case"woff":case"woff2":o.as="font",o.crossOrigin="anonymous";break;default:o.as="fetch",o.crossOrigin="anonymous"}document.head.appendChild(o),M()}catch(t){}});await Promise.allSettled(t)}getCDNHealthStatus(){return R.getHealthResults()}async refreshCDNHealth(){return R.clearCache(),this.clearUrlCache(),await R.checkAllCDNs()}clearUrlCache(){this.urlCache.clear()}isReady(){return this.isInitialized}getCacheStats(){return{size:this.urlCache.size,keys:Array.from(this.urlCache.keys())}}}const F=A.getInstance();let N=null,O=!1,U=null;function W(e){return s("app:"+e)}(async()=>{O||N||(O=!0,U=(async()=>{try{N=await L()}catch(e){}finally{O=!1}})())})();const V=s("app:折叠");function B(e,...r){return r.forEach(r=>{Object.keys(r).forEach(t=>{const o=e[t],a=r[t];Array.isArray(o)&&Array.isArray(a)?e[t]=Array.from(new Set([...o,...a])):e[t]="object"==typeof o&&"object"==typeof a?B({...o},a):a})}),e}async function H(e){v.collapsedMap.clear();const r=await L(),[t,o]=await Promise.all([r.loadPositionData(e),r.loadSkillsData()]),a=B({},t,r.expected_positions[e]),i=B({},r,a,{skill_level:o});v.data=i;const s=(i?.skill_level?.list||[]).sort((e,r)=>e.length-r.length);v.skills=s;const n={};s.forEach(([e,r])=>{n[e.toLocaleLowerCase()]=[e,r]}),v.skillMap=n}function Y(e){const[r,t]=o.useState(Math.min(e,document.body.getBoundingClientRect().width));return o.useEffect(()=>{const r=()=>{t(Math.min(e,document.body.getBoundingClientRect().width))};return window.addEventListener("resize",r),()=>{window.removeEventListener("resize",r)}},[]),r}function q(e,r){return e.replace(/\$\{([\w.]+)\}/g,(e,t)=>{const o=t.split(".");let a=r;for(const r of o)if(a=a?a[r]:void 0,void 0===a)return e;return a})}function Z(e,r){const t=new Date,o=t.getFullYear(),a=t.getMonth()+1;function i(e){if(!/^\d+/.test(e))return[o,a];const r=[".","/","-"];let t,i;for(const o of r)if(e.includes(o)){[t,i]=e.split(o).map(Number);break}return t&&i||([t,i]=e.match(/\d+/g).map(Number)),[t,i]}const[s,n]=i(e),[c,l]=i(r);let d=c-s,p=l-n;p<0&&(d-=1,p+=12);let h="";return d>0&&(h+=`${d}年`),p>0&&(h+=`${p}个月`),h||"0个月"}function J(e,r){const[t,a]=o.useState({}),i=e=>{const t={};for(let o=0;o<r;o++)t[o]=e;setTimeout(()=>a(t),0)};return function(e,r){o.useEffect(()=>{v.collapsedMap.has(e)||v.collapsedMap.set(e,!1);const t=c(()=>v.collapsedMap.get(e),e=>{r(e)});return()=>{t()}},[e])}(e,i),{collapsedItems:t,toggleCollapse:(e,r)=>{a({...t,[e]:r??!t[e]})},setCollapsedAllItems:i}}function G(e,r=0){const t=(N||{header_info:{cdn_static_assets_dirs:["images"]}}).header_info.cdn_static_assets_dirs||["images"];if(!e)return e;const o=t.map(e=>`^\\/?${e}\\/`).join("|");if(!new RegExp(o).test(e))return e;try{return F.getResourceUrl(e,{enableFallback:!0,localBasePath:"",cacheUrls:!0})}catch(a){return e}}window.stopOtherVideos=function(e){document.querySelectorAll(".remark-video").forEach(r=>{r!==e.target&&r.pause()})};const X="920px",K=l`
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

    /* 状态背景色 - 浅色模式 */
    --color-status-worse: #fff0f0;    /* 较差的状态背景色 */
    --color-status-better: #f0fff0;   /* 更好的状态背景色 */

    --color-shadow-light: rgba(0, 0, 0, 0.05);
    --color-shadow-medium: rgba(0, 0, 0, 0.1);
    --color-shadow-dark: rgba(0, 0, 0, 0.2);
  }

  /* CSS变量定义 - 深色主题 - 护眼优化版本 */
  [data-theme="dark"] {
    --color-primary: #74b9ff;
    --color-secondary: #f1f3f4;
    --color-accent: #fd79a8;

    --color-background: #0f1419;
    --color-surface: #1a202c;
    --color-card: #2d3748;

    --color-text-primary: #f1f3f4; /* 提高文本对比度 */
    --color-text-secondary: #b2bec3; /* 提高次要文本对比度 */
    --color-text-disabled: #81ecec; /* 提高禁用文本对比度 */
    --color-text-inverse: #1a202c;

    --color-border-light: #2d3748;
    --color-border-medium: #4a5568;
    --color-border-dark: #718096;

    --color-status-success: #48bb78;
    --color-status-warning: #ed8936;
    --color-status-error: #f56565;
    --color-status-info: #4299e1;

    /* 状态背景色 - 深色模式 */
    --color-status-worse: #4a1a1a;    /* 较差的状态背景色 - 深红色调 */
    --color-status-better: #1a4a1a;   /* 更好的状态背景色 - 深绿色调 */

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
    transition: color 0.3s ease, background-color 0.3s ease, filter 0.3s ease;

    /* 修复移动端横向溢出问题 */
    overflow-x: hidden; /* 隐藏横向滚动条 */
    width: 100%;
    box-sizing: border-box;
    min-height: 100vh;

    /* 背景图 */
    background-image: url('${G("images/flexi-resume.jpg")}');

    /* 背景图平铺 */
    background-repeat: repeat;
    background-size: 180px;
  }

  /* 深色模式下的背景图优化 - 仅对背景图使用滤镜反转 */
  [data-theme="dark"] body {
    /* 使用滤镜反转背景图，让其适配深色主题 */
    background-image: url('${G("images/flexi-resume.jpg")}');

    /* 仅对背景图应用滤镜，不影响其他内容 */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${G("images/flexi-resume.jpg")}');
      background-repeat: repeat;
      background-size: 180px;
      /* 反转背景图颜色，让其适配深色主题 */
      filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2);
      pointer-events: none;
      z-index: -1;
    }

    /* 隐藏原始背景图，使用伪元素的反转版本 */
    background-image: none;
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

  /* 状态背景色全局类 */
  .status-worse {
    background-color: var(--color-status-worse) !important;
    transition: background-color 0.3s ease;
  }

  .status-better {
    background-color: var(--color-status-better) !important;
    transition: background-color 0.3s ease;
  }

  /* 兼容原有的硬编码颜色 */
  [style*="background-color:#fff0f0"],
  [style*="background-color: #fff0f0"] {
    background-color: var(--color-status-worse) !important;
  }

  [style*="background-color:#f0fff0"],
  [style*="background-color: #f0fff0"] {
    background-color: var(--color-status-better) !important;
  }

  #root {
    display: flex;
    justify-content: center; /* 水平居中 */
    @media (max-width: ${X}) {
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
    transition: color 0.3s ease;

    &::before {
      content: '';
      display: inline-block;
      transform: translateY(0.2em);
      width: 1rem; /* 图标宽度 */
      height: 1rem; /* 图标高度 */
      margin-right: 0.4rem; /* 图标和文本的间距 */
      background: url(${G("images/url.svg")}) no-repeat center;
      background-size: contain; /* 保证图标自适应 */
      /* 深色模式下的图标颜色调整 */
      filter: brightness(0) saturate(100%) invert(53%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(85%);
      transition: filter 0.3s ease;
    }

    /* 链接访问状态颜色 */
    &:link {
      color: var(--color-primary);
    }

    &:visited {
      color: var(--color-text-secondary);
    }

    &:hover {
      color: var(--color-accent);
    }

    &:active {
      color: var(--color-primary);
    }
  }

  /* 深色模式下的链接图标和颜色优化 */
  [data-theme="dark"] a:not(.no-link-icon) {
    &::before {
      filter: brightness(0) saturate(100%) invert(65%) sepia(11%) saturate(297%) hue-rotate(181deg) brightness(93%) contrast(87%);
    }

    &:link {
      color: #74b9ff !important; /* 深色模式下更亮的蓝色 - 提高对比度 */
    }

    &:visited {
      color: #b2bec3 !important; /* 深色模式下更明显的灰色 - 提高对比度 */
    }

    &:hover {
      color: #fd79a8 !important; /* 深色模式下更亮的粉红色 - 提高对比度 */
    }

    &:active {
      color: #74b9ff !important;
    }
  }

  /* 深色模式下的普通链接颜色优化 */
  [data-theme="dark"] a.no-link-icon {
    &:link {
      color: #74b9ff !important; /* 深色模式下更亮的蓝色 */
    }

    &:visited {
      color: #b2bec3 !important; /* 深色模式下更明显的灰色 */
    }

    &:hover {
      color: #fd79a8 !important; /* 深色模式下更亮的粉红色 */
    }

    &:active {
      color: #74b9ff !important;
    }
  }
  @media (max-width: ${X}) {
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

  /* 打印样式优化 */
  @media print {
    /* 页面设置 */
    @page {
      size: A4;
      margin: 1cm;
    }

    /* 重置根元素和body */
    html, body {
      width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      background-image: none !important;
      overflow: visible !important;
      font-size: 12pt !important;
      line-height: 1.4 !important;
      color: black !important;
    }

    /* 隐藏深色模式背景伪元素 */
    [data-theme="dark"] body::before {
      display: none !important;
    }

    /* 根元素打印优化 */
    #root {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      overflow: visible !important;
    }

    /* 隐藏不需要打印的元素 */
    .no-print,
    .print-hide,
    button,
    .control-panel,
    .floating-controls,
    nav,
    .navigation,
    .tabs,
    .tab-container {
      display: none !important;
    }

    /* 打印背景设置 */
    .print-background {
      position: relative;
      background: white !important;
    }

    .print-background::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      z-index: -1;
    }

    /* 确保所有文本颜色为黑色 */
    * {
      color: black !important;
      background: transparent !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    /* 链接样式 */
    a {
      color: black !important;
      text-decoration: underline !important;
    }

    /* 分页控制 */
    .page-break-before {
      page-break-before: always;
    }

    .page-break-after {
      page-break-after: always;
    }

    .page-break-inside-avoid {
      page-break-inside: avoid;
    }
  }
`,Q=W("PerformanceMonitor"),ee=new class{metrics={};observers=[];constructor(){this.init()}init(){this.observeNavigation(),this.observeWebVitals(),this.observeResources(),this.setupReporting()}observeNavigation(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("navigation"===r.entryType){const e=r;this.metrics.TTFB=e.responseStart-e.requestStart,this.metrics.pageLoadTime=e.loadEventEnd-e.navigationStart,Q("Navigation metrics:",{TTFB:this.metrics.TTFB,pageLoadTime:this.metrics.pageLoadTime})}});e.observe({entryTypes:["navigation"]}),this.observers.push(e)}}observeWebVitals(){this.observeLCP(),this.observeFID(),this.observeCLS(),this.observeFCP()}observeLCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{const r=e.getEntries(),t=r[r.length-1];this.metrics.LCP=t.startTime,Q("LCP:",this.metrics.LCP)});e.observe({entryTypes:["largest-contentful-paint"]}),this.observers.push(e)}}observeFID(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("first-input"===r.entryType){const e=r;this.metrics.FID=e.processingStart-e.startTime,Q("FID:",this.metrics.FID)}});e.observe({entryTypes:["first-input"]}),this.observers.push(e)}}observeCLS(){if("PerformanceObserver"in window){let e=0;const r=new PerformanceObserver(r=>{for(const t of r.getEntries())"layout-shift"!==t.entryType||t.hadRecentInput||(e+=t.value);this.metrics.CLS=e,Q("CLS:",this.metrics.CLS)});r.observe({entryTypes:["layout-shift"]}),this.observers.push(r)}}observeFCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())"first-contentful-paint"===r.name&&(this.metrics.FCP=r.startTime,Q("FCP:",this.metrics.FCP))});e.observe({entryTypes:["paint"]}),this.observers.push(e)}}observeResources(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("resource"===r.entryType){const e=r,t=e.responseEnd-e.startTime;t>1e3&&Q("Slow resource:",{name:e.name,loadTime:t,size:e.transferSize})}});e.observe({entryTypes:["resource"]}),this.observers.push(e)}}setupReporting(){document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&this.reportMetrics()}),window.addEventListener("beforeunload",()=>{this.reportMetrics()})}reportMetrics(){Q("Performance Metrics:",this.metrics),navigator.sendBeacon&&JSON.stringify({url:window.location.href,timestamp:Date.now(),metrics:this.metrics,userAgent:navigator.userAgent})}recordCustomMetric(e,r){this.metrics[e]=r,Q(`Custom metric ${e}:`,r)}recordComponentMetric(e,r,t){switch(this.metrics.componentMetrics||(this.metrics.componentMetrics={}),this.metrics.componentMetrics[e]||(this.metrics.componentMetrics[e]={renderTime:0,mountTime:0,updateTime:0}),r){case"render":this.metrics.componentMetrics[e].renderTime=t;break;case"mount":this.metrics.componentMetrics[e].mountTime=t;break;case"update":this.metrics.componentMetrics[e].updateTime=t}Q(`Component ${e} ${r} time:`,t)}recordDataLoadTime(e,r){this.metrics.dataLoadTime=r,Q(`Data load time for ${e}:`,r)}recordSkeletonDisplayTime(e){this.metrics.skeletonDisplayTime=e,Q("Skeleton display time:",e)}recordRouteChangeTime(e,r,t){this.metrics.routeChangeTime=t,Q(`Route change from ${e} to ${r}:`,t)}recordThemeChangeTime(e,r,t){this.metrics.themeChangeTime=t,Q(`Theme change from ${e} to ${r}:`,t)}recordLanguageChangeTime(e,r,t){this.metrics.languageChangeTime=t,Q(`Language change from ${e} to ${r}:`,t)}recordMemoryUsage(){if("memory"in performance){const e=performance.memory;this.metrics.memoryUsage=e.usedJSHeapSize,Q("Memory usage:",{used:e.usedJSHeapSize,total:e.totalJSHeapSize,limit:e.jsHeapSizeLimit})}}getMetrics(){return{...this.metrics}}getPerformanceScore(){const e=this.getMetrics();let r=100;const t={};return e.LCP&&(e.LCP>4e3?(r-=30,t.LCP="Poor"):e.LCP>2500?(r-=15,t.LCP="Needs Improvement"):t.LCP="Good"),e.FID&&(e.FID>300?(r-=25,t.FID="Poor"):e.FID>100?(r-=10,t.FID="Needs Improvement"):t.FID="Good"),e.CLS&&(e.CLS>.25?(r-=20,t.CLS="Poor"):e.CLS>.1?(r-=10,t.CLS="Needs Improvement"):t.CLS="Good"),e.dataLoadTime&&(e.dataLoadTime>2e3?(r-=15,t.dataLoad="Slow"):e.dataLoadTime>1e3?(r-=5,t.dataLoad="Moderate"):t.dataLoad="Fast"),{score:Math.max(0,r),details:t}}cleanup(){this.observers.forEach(e=>e.disconnect()),this.observers=[]}},re=(e,r,t)=>{ee.recordComponentMetric(e,r,t)},te=(e,r)=>{ee.recordDataLoadTime(e,r)},oe=e=>{ee.recordSkeletonDisplayTime(e)},ae=(e,r,t)=>{ee.recordRouteChangeTime(e,r,t)},ie={light:{primary:"#3498db",secondary:"#2c3e50",accent:"#e74c3c",background:"#ffffff",surface:"#f8f9fa",card:"#ffffff",text:{primary:"#2c3e50",secondary:"#7f8c8d",disabled:"#bdc3c7",inverse:"#ffffff"},border:{light:"#ecf0f1",medium:"#bdc3c7",dark:"#95a5a6"},status:{success:"#27ae60",warning:"#f39c12",error:"#e74c3c",info:"#3498db"},shadow:{light:"rgba(0, 0, 0, 0.05)",medium:"rgba(0, 0, 0, 0.1)",dark:"rgba(0, 0, 0, 0.2)"}},dark:{primary:"#4a9eff",secondary:"#e2e8f0",accent:"#ff6b6b",background:"#0f1419",surface:"#1a202c",card:"#2d3748",text:{primary:"#e2e8f0",secondary:"#a0aec0",disabled:"#718096",inverse:"#1a202c"},border:{light:"#2d3748",medium:"#4a5568",dark:"#718096"},status:{success:"#48bb78",warning:"#ed8936",error:"#f56565",info:"#4299e1"},shadow:{light:"rgba(0, 0, 0, 0.1)",medium:"rgba(0, 0, 0, 0.25)",dark:"rgba(0, 0, 0, 0.4)"}}},se=o.createContext(void 0),ne=({children:r})=>{const[t,a]=o.useState(()=>{const e=localStorage.getItem("theme");return!e||"light"!==e&&"dark"!==e?window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e});o.useEffect(()=>{localStorage.setItem("theme",t),document.documentElement.setAttribute("data-theme",t);const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",ie[t].background)},[t]),o.useEffect(()=>{const e=window.matchMedia("(prefers-color-scheme: dark)"),r=e=>{localStorage.getItem("theme")||a(e.matches?"dark":"light")};return e.addEventListener("change",r),()=>e.removeEventListener("change",r)},[]);const i={mode:t,setMode:a,toggleMode:()=>{const e=performance.now(),r=t;a(t=>{const o="light"===t?"dark":"light";return setTimeout(()=>{const t=performance.now()-e;((e,r,t)=>{ee.recordThemeChangeTime(e,r,t)})(r,o,t)},0),o})},colors:ie[t],isDark:"dark"===t};return e.jsx(se.Provider,{value:i,children:r})},ce=()=>{const e=o.useContext(se);if(!e)throw new Error("useTheme must be used within a ThemeProvider");return e},le="#aaa",de="920px",pe=d.nav.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  /* 移动端样式 - 修复横向溢出问题 */
  padding: 0 5px; /* 进一步减少左右padding */
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%; /* 确保不超出容器宽度 */
  max-width: calc(100vw - 10px); /* 留出边距，防止溢出 */
  box-sizing: border-box;
  top: 2px;
  justify-content: flex-start; /* 改为左对齐，避免溢出 */
  overflow-x: auto; /* 允许横向滚动 */
  overflow-y: hidden;
  gap: 2px; /* 减少标签间距 */

  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* 移动端滚动提示 */
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(to right, transparent, ${e=>e.isDark?"var(--color-surface)":"#f8f9fa"});
    pointer-events: none;
    opacity: 0.8;
  }

  @media (min-width: ${de}) {
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
    gap: 2px; /* 桌面端也减少间距 */

    /* 桌面端不需要滚动提示 */
    &::after {
      display: none;
    }
  }

  /* 在打印时隐藏 */
  @media print {
    display: none;
  }
`,he=d(h).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  /* 移动端样式优化 */
  padding: 6px 8px; /* 进一步减少padding */
  text-decoration: none;
  color: ${e=>e.isDark?"var(--color-text-primary)":"black"};
  border: 2px solid transparent; /* 默认无边框 */
  border-radius: 6px 6px 0 0; /* 减小圆角 */
  border-top: 1px solid ${e=>e.isDark?"var(--color-border-medium)":le};
  border-right: 1px solid ${e=>e.isDark?"var(--color-border-medium)":le};
  border-bottom: 0px solid ${e=>e.isDark?"var(--color-border-medium)":le};
  border-left: 1px solid ${e=>e.isDark?"var(--color-border-medium)":le};
  transition: background-color 0.3s, border 0.3s, color 0.3s, transform 0.2s;
  box-shadow: 0 0 10px ${e=>e.isDark?"var(--color-shadow-medium)":"rgba(0, 0, 0, 0.1)"};
  background-color: ${e=>e.isDark?"var(--color-card)":"#fff"};
  white-space: nowrap; /* 防止文字换行 */
  font-size: 12px; /* 移动端使用更小字体 */
  font-weight: 500; /* 增加字体粗细以提高可读性 */
  flex-shrink: 0; /* 防止被压缩 */
  min-width: fit-content; /* 最小宽度适应内容 */
  max-width: 120px; /* 限制最大宽度 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 文字溢出显示省略号 */

  &:hover, &.active {
    background-color: ${e=>e.isDark?"var(--color-surface)":"#f0f0f0"};
    border-color: ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态时显示边框颜色 */
    border-top: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示顶部边框 */
    color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    transform: translateY(-1px); /* 轻微上移效果 */
  }

  @media (min-width: ${de}) {
    padding: 10px 10px;
    margin: 2px 0;
    border: none;
    text-align: center;
    font-size: 16px; /* 桌面端恢复正常字体大小 */

    /* 竖向排列文本 */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    border-radius: 0px 8px 8px 0px;
    border-top: 1px solid ${e=>e.isDark?"var(--color-border-medium)":le};
    border-right: 1px solid ${e=>e.isDark?"var(--color-border-medium)":le};
    border-bottom: 1px solid ${e=>e.isDark?"var(--color-border-medium)":le};
    border-left: 0px solid ${e=>e.isDark?"var(--color-border-medium)":le};

    &:hover, &.active {
      background-color: ${e=>e.isDark?"var(--color-surface)":"#f0f0f0"};
      border-right: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示右侧边框 */
      color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    }
  }
`,me=()=>{const r=v.data,t=v.tabs,{isDark:a}=ce(),i=p();return o.useEffect(()=>{if(!t.length)return void(document.title=r?.header_info?.position||"My Resume");const e=function(e){const r=v.data,t=v.tabs,o=e.pathname,a=t.find(([,e])=>e===o);return a?a[0]:r?.header_info?.position||""}(i),o=Object.assign({},r?.header_info,{position:e}),a=function(e,r){if(!r)return r?.position||"My Resume";const t=e.replace(/{(position|name|age|location)}/g,(e,t)=>r[t]||""),o=t.replace(/[-\s]+/g," ").trim();return o&&"-"!==o&&"--"!==o&&"---"!==o?t:r?.position||r?.name||"My Resume"}(r?.header_info?.resume_name_format||"{position}-{name}-{age}-{location}",o),s=a&&a.trim()?a:e||r?.header_info?.position||"My Resume";document.title=s},[i,r,t.length]),t.length?e.jsx(pe,{"data-testid":"navigation-tabs",isDark:a,children:t.map(([r,t],o)=>e.jsx(he,{className:"no-link-icon",to:t,isDark:a,children:r},t))}):null};function ue(e){return x({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},child:[]}]})(e)}const ge=d.div`
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
`,fe=d.img`
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.3s ease;
    cursor: pointer; 
`,be=d.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  padding: 10px;
  cursor: pointer;
  z-index: 1100;  
`,xe=({imageUrl:r,onClose:t})=>e.jsxs(ge,{onClick:t,children:[e.jsx(fe,{src:r,onClick:e=>e.stopPropagation()}),e.jsx(be,{onClick:t,children:e.jsx(ue,{size:30,color:"white"})})]}),we=o.createContext(void 0),ke=({children:t})=>{const[a,i]=o.useState(!1),[s,n]=o.useState(""),c=e=>{n(e),i(!0)};return window.$handleImageClick=c,e.jsxs(we.Provider,{value:{handleImageClick:c},children:[t,a&&e.jsx(r.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:e.jsx(xe,{imageUrl:s,onClose:()=>{i(!1)}})})]})},ve=d.div`
  max-width: 800px;
  padding: 40px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 20px auto;
`,ye=d.div`
  font-size: 64px;
  color: #ff6b6b;
  margin-bottom: 20px;
`,De=d.h2`
  color: #333;
  margin-bottom: 16px;
  font-size: 24px;
`,Ce=d.p`
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
`,je=d.button`
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
`;d.details`
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
`;class Pe extends o.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,r){this.setState({error:e,errorInfo:r})}handleRetry=()=>{this.setState({hasError:!1,error:void 0,errorInfo:void 0})};render(){return this.state.hasError?this.props.fallback?this.props.fallback:e.jsxs(ve,{children:[e.jsx(ye,{children:"⚠️"}),e.jsx(De,{children:"页面加载出错了"}),e.jsxs(Ce,{children:["抱歉，页面遇到了一些问题。请尝试刷新页面或稍后再试。",e.jsx("br",{}),"如果问题持续存在，请联系技术支持。"]}),e.jsx(je,{onClick:this.handleRetry,children:"重新加载"}),!1]}):this.props.children}}const $e=m`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`,Se=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  background: ${e=>e.isDark?"linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%)":"linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)"};
  background-size: 200px 100%;
  animation: ${$e} 1.5s infinite linear;
  border-radius: 4px;
  transition: background 0.3s ease;
`,Le=d(Se).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>e.height||"16px"};
  width: ${e=>e.width||"100%"};
  margin: ${e=>e.margin||"8px 0"};
`,Te=d(Se).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>{switch(e.size){case"small":return"20px";case"large":return"32px";default:return"24px"}}};
  width: ${e=>{switch(e.size){case"small":return"120px";case"large":return"200px";default:return"150px"}}};
  margin: 16px 0;
`,ze=d(Se).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: ${e=>e.size||80}px;
  height: ${e=>e.size||80}px;
  border-radius: 50%;
  flex-shrink: 0;
`;d(Se).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: 36px;
  width: ${e=>e.width||"100px"};
  border-radius: 6px;
`;const Ee=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  padding: ${e=>e.padding||"20px"};
  border: 1px solid ${e=>e.isDark?"var(--color-border-medium)":"#e0e0e0"};
  border-radius: 8px;
  margin: 16px 0;
  background: ${e=>e.isDark?"var(--color-card)":"#fff"};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;d(Se)`
  width: ${e=>e.width||"100%"};
  height: ${e=>e.height||"200px"};
  aspect-ratio: ${e=>e.aspectRatio||"auto"};
  border-radius: 8px;
`;const _e=d.div.withConfig({shouldForwardProp:e=>"minWidth"!==e})`
  /* 完全匹配ResumeWrapper的样式 */
  max-width: 800px;
  min-width: ${e=>e.minWidth}px;
  width: 100%; /* 确保占满可用宽度 */
  border-top: 1px solid var(--color-border-medium);
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  padding: 20px;
  background: var(--color-card);
  color: var(--color-text-primary);
  box-shadow: 0 0 15px var(--color-shadow-medium);
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  /* 确保骨架屏始终居中显示 */
  margin: 0 auto;

  /* 移动端适配 - 与ResumeWrapper保持一致 */
  @media (max-width: 768px) {
    padding: 15px;
    margin: 0 10px;
    width: calc(100% - 20px);
    min-width: auto; /* 移动端不限制最小宽度 */
  }

  /* 在打印时隐藏 */
  @media print {
    border: 0px;
    box-shadow: 0 0 0px rgba(0, 0, 0, 0);
    background: white !important;
    color: black !important;
  }
`,Me=()=>{const{isDark:r}=ce(),t=Y(800)-40;return e.jsxs(_e,{minWidth:t,children:[e.jsxs("div",{style:{display:"flex",gap:"20px",marginBottom:"40px"},children:[e.jsx(ze,{size:100,isDark:r}),e.jsxs("div",{style:{flex:1},children:[e.jsx(Te,{size:"large",isDark:r}),e.jsx(Le,{width:"60%",height:"18px",isDark:r}),e.jsx(Le,{width:"50%",height:"16px",isDark:r}),e.jsx(Le,{width:"40%",height:"16px",isDark:r})]})]}),e.jsxs(Ee,{isDark:r,children:[e.jsx(Te,{size:"medium",isDark:r}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"12px"},children:[e.jsx(Le,{width:"80%",isDark:r}),e.jsx(Le,{width:"70%",isDark:r}),e.jsx(Le,{width:"90%",isDark:r}),e.jsx(Le,{width:"75%",isDark:r}),e.jsx(Le,{width:"85%",isDark:r}),e.jsx(Le,{width:"65%",isDark:r})]})]}),e.jsxs(Ee,{isDark:r,children:[e.jsx(Te,{size:"medium",isDark:r}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(Le,{width:"40%",height:"20px",isDark:r}),e.jsx(Le,{width:"100%",isDark:r}),e.jsx(Le,{width:"95%",isDark:r}),e.jsx(Le,{width:"88%",isDark:r})]}),e.jsxs("div",{children:[e.jsx(Le,{width:"35%",height:"20px",isDark:r}),e.jsx(Le,{width:"100%",isDark:r}),e.jsx(Le,{width:"92%",isDark:r}),e.jsx(Le,{width:"85%",isDark:r})]})]}),e.jsxs(Ee,{isDark:r,children:[e.jsx(Te,{size:"medium",isDark:r}),e.jsx(Le,{width:"50%",height:"18px",isDark:r}),e.jsx(Le,{width:"100%",isDark:r}),e.jsx(Le,{width:"90%",isDark:r}),e.jsx(Le,{width:"95%",isDark:r})]})]})},Ie={zh:{common:{loading:"加载中...",error:"加载失败",retry:"重试",contact:"联系我",download:"下载简历",print:"打印简历",share:"分享",switchLanguage:"切换语言",switchTheme:"切换主题",lightMode:"浅色模式",darkMode:"深色模式",controlPanel:"控制面板",theme:"主题",language:"语言"},resume:{personalInfo:"个人信息",personalStrengths:"个人优势",skills:"技能清单",employmentHistory:"工作经历",projectExperience:"项目经历",educationHistory:"教育背景",personalInfluence:"个人影响力",careerPlanning:"职业规划",openSourceProjects:"开源项目"},profile:{position:"求职意向",expectedSalary:"期望薪资",status:"工作状态",phone:"联系电话",email:"邮箱地址",location:"所在地区",experience:"工作经验",education:"学历"},time:{present:"至今",years:"年",months:"个月"}},en:{common:{loading:"Loading...",error:"Load Failed",retry:"Retry",contact:"Contact Me",download:"Download Resume",print:"Print Resume",share:"Share",switchLanguage:"Switch Language",switchTheme:"Switch Theme",lightMode:"Light Mode",darkMode:"Dark Mode",controlPanel:"Control Panel",theme:"Theme",language:"Language"},resume:{personalInfo:"Personal Information",personalStrengths:"Personal Strengths",skills:"Skills",employmentHistory:"Work Experience",projectExperience:"Project Experience",educationHistory:"Education",personalInfluence:"Personal Influence",careerPlanning:"Career Planning",openSourceProjects:"Open Source Projects"},profile:{position:"Position",expectedSalary:"Expected Salary",status:"Status",phone:"Phone",email:"Email",location:"Location",experience:"Experience",education:"Education"},time:{present:"Present",years:" years",months:" months"}}},Re=o.createContext(void 0),Ae=({children:r})=>{const[t,a]=o.useState(()=>{const e=localStorage.getItem("language");return!e||"zh"!==e&&"en"!==e?navigator.language.toLowerCase().startsWith("zh")?"zh":"en":e});o.useEffect(()=>{localStorage.setItem("language",t)},[t]);const i=(e=>r=>{const t=performance.now();e(e=>(setTimeout(()=>{const o=performance.now()-t;((e,r,t)=>{ee.recordLanguageChangeTime(e,r,t)})(e,r,o)},0),r))})(a),s={language:t,setLanguage:i,t:Ie[t]};return e.jsx(Re.Provider,{value:s,children:r})},Fe=()=>{const e=o.useContext(Re);if(!e)throw new Error("useI18n must be used within an I18nProvider");return e},Ne=d.div`
  position: relative;
  display: inline-block;
`,Oe=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Ue=d.span`
  font-size: 16px;
  line-height: 1;
`,We=d.span`
  font-weight: 500;
`,Ve=d.div.withConfig({shouldForwardProp:e=>"isOpen"!==e&&"isDark"!==e})`
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
`,Be=d.button.withConfig({shouldForwardProp:e=>"isActive"!==e&&"isDark"!==e})`
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
`,He=d.span.withConfig({shouldForwardProp:e=>"visible"!==e&&"isDark"!==e})`
  opacity: ${e=>e.visible?1:0};
  color: ${e=>e.isDark?"#48bb78":"#27ae60"};
  font-weight: bold;
  margin-left: auto;
`,Ye=[{code:"zh",name:"Chinese",icon:"🇨🇳",nativeName:"中文"},{code:"en",name:"English",icon:"🇺🇸",nativeName:"English"}],qe=({className:r})=>{const{language:t,setLanguage:o,t:i}=Fe(),{isDark:s}=ce(),[n,c]=a.useState(!1),l=Ye.find(e=>e.code===t);a.useEffect(()=>{const e=P();e!==t&&o(e)},[t,o]);const d=a.useCallback(e=>{e.target.closest("[data-language-switcher]")||c(!1)},[]);return a.useEffect(()=>{if(n)return document.addEventListener("click",d),()=>document.removeEventListener("click",d)},[n,d]),e.jsxs(Ne,{className:r,"data-testid":"language-switcher","data-language-switcher":!0,children:[e.jsxs(Oe,{isDark:s,onClick:()=>c(!n),title:i.common.switchLanguage,"aria-label":i.common.switchLanguage,children:[e.jsx(Ue,{children:l?.icon}),e.jsx(We,{children:l?.nativeName}),e.jsx("span",{style:{transform:n?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.3s ease",fontSize:"12px"},children:"▼"})]}),e.jsx(Ve,{isOpen:n,isDark:s,children:Ye.map(r=>e.jsxs(Be,{isActive:t===r.code,isDark:s,onClick:()=>(e=>{o(e);const r=e;$(r),(e=>{try{localStorage.setItem("flexiresume-language",e)}catch(r){}})(r),c(!1)})(r.code),children:[e.jsx("span",{children:r.icon}),e.jsx("span",{children:r.nativeName}),e.jsx(He,{visible:t===r.code,isDark:s,children:"✓"})]},r.code))})]})},Ze=d.div`
  position: relative;
  display: inline-block;
`,Je=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Ge=d.div.withConfig({shouldForwardProp:e=>"isVisible"!==e})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${e=>e.isVisible?"scale(1) rotate(0deg)":"scale(0) rotate(180deg)"};
  opacity: ${e=>e.isVisible?1:0};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`,Xe=d.div`
  position: relative;
  
  &::before {
    content: '☀️';
    font-size: 20px;
    display: block;
  }
`,Ke=d.div`
  position: relative;
  
  &::before {
    content: '🌙';
    font-size: 18px;
    display: block;
  }
`,Qe=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e&&"isVisible"!==e})`
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
`,er=d.div.withConfig({shouldForwardProp:e=>"isActive"!==e})`
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
`,rr=({className:r,showTooltip:t=!0})=>{const{mode:o,toggleMode:i,isDark:s}=ce(),{t:n}=Fe(),[c,l]=a.useState(!1),[d,p]=a.useState(!1),h=s?n.common.lightMode:n.common.darkMode;return e.jsxs(Ze,{className:r,onMouseEnter:()=>l(!0),onMouseLeave:()=>l(!1),children:[e.jsxs(Je,{isDark:s,onClick:()=>{p(!0),setTimeout(()=>p(!1),600),i()},title:h,"aria-label":h,children:[e.jsx(er,{isActive:d}),e.jsx(Ge,{isVisible:!s,children:e.jsx(Xe,{})}),e.jsx(Ge,{isVisible:s,children:e.jsx(Ke,{})})]}),t&&e.jsx(Qe,{isDark:s,isVisible:c,children:h})]})},tr=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  position: fixed;
  bottom: 20px;
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

  /* 在打印时隐藏控制面板 */
  @media print {
    display: none !important;
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    padding: 8px;
    gap: 8px;
  }
`,or=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: 1px;
  height: 24px;
  background: ${e=>e.isDark?"rgba(74, 85, 104, 0.6)":"rgba(0, 0, 0, 0.1)"};
  transition: background 0.3s ease;
`;d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`;const ar=d.div.withConfig({shouldForwardProp:e=>"isCollapsed"!==e&&"isDark"!==e})`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transition: all 0.3s ease;

  /* 为ExpandedPanel提供相对定位上下文 */
  & > div:first-child {
    position: relative;
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
  }
`,ir=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,sr=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
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
`,nr=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,cr=d.span.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  font-size: 14px;
  font-weight: 500;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
`,lr=({className:r,collapsible:t=!1,defaultCollapsed:o=!1})=>{const{isDark:i}=ce(),{t:s}=Fe(),[n,c]=a.useState(o);return t?e.jsxs(ar,{isCollapsed:n,isDark:i,className:r,children:[e.jsx(ir,{isDark:i,onClick:()=>c(!n),title:s.common.controlPanel,"aria-label":s.common.controlPanel,children:n?"⚙️":"✕"}),!n&&e.jsxs(sr,{isDark:i,children:[e.jsxs(nr,{children:[e.jsx(cr,{isDark:i,children:s.common.theme}),e.jsx(rr,{showTooltip:!1})]}),e.jsx(or,{isDark:i}),e.jsxs(nr,{children:[e.jsx(cr,{isDark:i,children:s.common.language}),e.jsx(qe,{})]})]})]}):e.jsxs(tr,{isDark:i,className:r,children:[e.jsx(rr,{}),e.jsx(or,{isDark:i}),e.jsx(qe,{})]})},dr=new class{libraries=new Map;preloadPromises=new Map;constructor(){this.initializeLibraryStates()}initializeLibraryStates(){["mermaid","svgPanZoom","katex","cytoscape"].forEach(e=>{this.libraries.set(e,{loading:!1,loaded:!1,error:null,module:null})})}async startPreloading(){const e=[];e.push(this.preloadMermaid()),e.push(this.preloadSvgPanZoom()),Promise.allSettled(e).then(e=>{})}async preloadMermaid(){return this.preloadLibrary("mermaid",()=>i(()=>import("./mermaid-core-CxzdCigi.js").then(e=>e.b7),__vite__mapDeps([1,2,3]),import.meta.url))}async preloadSvgPanZoom(){return this.preloadLibrary("svgPanZoom",()=>i(()=>import("./utils-CEXnc-BX.js").then(e=>e.s),__vite__mapDeps([5,2]),import.meta.url))}async preloadKatex(){return this.preloadLibrary("katex",()=>i(()=>import("./katex-DuUXD-vJ.js"),[],import.meta.url))}async preloadCytoscape(){return this.preloadLibrary("cytoscape",()=>i(()=>import("./cytoscape-3nCDfVzk.js").then(e=>e.b),__vite__mapDeps([6,2]),import.meta.url))}async preloadLibrary(e,r){const t=this.libraries.get(e);if(!t||t.loaded||t.loading)return;if(this.preloadPromises.has(e))return this.preloadPromises.get(e);t.loading=!0,t.error=null,performance.now();const o=r().then(e=>(performance.now(),t.loaded=!0,t.loading=!1,t.module=e,e)).catch(e=>{throw t.loading=!1,t.error=e.message,e}).finally(()=>{this.preloadPromises.delete(e)});return this.preloadPromises.set(e,o),o}async getLibrary(e){const r=this.libraries.get(e);if(!r)throw new Error(`Unknown library: ${e}`);if(r.loaded&&r.module)return r.module;if(r.loading&&this.preloadPromises.has(e))return this.preloadPromises.get(e);switch(e){case"mermaid":return this.preloadMermaid();case"svgPanZoom":return this.preloadSvgPanZoom();case"katex":return this.preloadKatex();case"cytoscape":return this.preloadCytoscape();default:throw new Error(`Unknown library: ${e}`)}}getLibraryState(e){return this.libraries.get(e)||null}getAllLibraryStates(){return new Map(this.libraries)}cleanup(){this.libraries.clear(),this.preloadPromises.clear()}},pr=o.lazy(()=>i(()=>import("./FlexiResume-CeE5fY3n.js"),__vite__mapDeps([7,8,2,9,1,3,10,5,11]),import.meta.url)),hr=()=>{const[r,t]=o.useState(null),[a,i]=o.useState([]),[s,n]=o.useState("/"),[c,l]=o.useState(!0),[d,p]=o.useState("checking"),h=async()=>{try{p("checking");const e=E,r=[];e.cdn.enabled&&e.cdn.healthCheck.enabled&&r.push(F.initialize()),r.push(dr.startPreloading()),await Promise.allSettled(r),e.performance.enablePreloading&&e.performance.preloadResources.length>0&&F.preloadResources(e.performance.preloadResources).catch(e=>{}),p("ready")}catch(e){p("error")}},m=async()=>{try{l(!0);const e=await L();t(e),await(async()=>{try{N=await L()}catch(e){}})();const r=(e=>Object.keys(e.expected_positions).filter(r=>!e.expected_positions[r].hidden).map(r=>[e.expected_positions[r].header_info?.position,"/"+r,!!e.expected_positions[r].is_home_page,!!e.expected_positions[r].is_home_page]))(e);i(r),n((e=>e.find(([,,e])=>e)?.[1]||"/")(r)),v.tabs=r}catch(e){}finally{l(!1)}};return o.useEffect(()=>{var e;return(async()=>{await Promise.all([h(),m()])})(),e=()=>{m()},j.push(e),()=>{const r=j.indexOf(e);r>-1&&j.splice(r,1)}},[]),function(){const e=()=>{document.querySelectorAll(".lazy-video").forEach(e=>{const r=e.getBoundingClientRect();r.top<window.innerHeight+200&&r.bottom>0&&(e=>{const r=JSON.parse(e.dataset.sources),t=_().baseUrls.slice(0,3);let o="";t.forEach((e,t)=>{const a=r.original.startsWith("/")?`${e.endsWith("/")?e.slice(0,-1):e}${r.original}`:`${e.endsWith("/")?e:e+"/"}${r.original}`;o+=`<source src="${a}" type="video/mp4">\n        `});let a=r.original;if("undefined"!=typeof window)try{const e=window.location.pathname.split("/").filter(e=>e);if((!window.location.port||"5173"!==window.location.port&&"5174"!==window.location.port&&"3000"!==window.location.port)&&e.length>=1){const t=e.slice(0,-1);t.length>0&&(a="/"+t.join("/")+"/"+(r.original.startsWith("/")?r.original.slice(1):r.original))}}catch(s){}o+=`<source src="${a}" type="video/mp4">`,e.innerHTML=o,e.classList.remove("lazy-video"),e.removeAttribute("data-sources");const i=e.parentNode.querySelector(".loading-indicator");i?.remove()})(e)})};let r;window.addEventListener("scroll",()=>{r&&clearTimeout(r),r=setTimeout(e,100)}),window.addEventListener("resize",e),window.addEventListener("mouseup",()=>setTimeout(e,0)),e()}(),c||!r?e.jsx(ne,{children:e.jsx(Ae,{children:e.jsxs(Pe,{children:[e.jsx(K,{}),e.jsx(lr,{collapsible:!0}),e.jsxs("div",{style:{position:"fixed",top:"20px",right:"20px",background:"rgba(0,0,0,0.8)",color:"white",padding:"8px 12px",borderRadius:"4px",fontSize:"12px",zIndex:9999},children:["checking"===d&&"🔄 检测CDN...","ready"===d&&"✅ CDN就绪","error"===d&&"⚠️ CDN检测失败"]}),e.jsx(Me,{})]})})}):e.jsx(ne,{children:e.jsx(Ae,{children:e.jsx(Pe,{children:e.jsxs(ke,{children:[e.jsx(K,{}),e.jsx(lr,{collapsible:!0}),e.jsxs(u,{basename:r.header_info.route_base_name,children:[e.jsx(me,{})," ",e.jsxs(g,{children:[a.map(([r,t],a)=>e.jsx(f,{path:t,element:e.jsx(Pe,{children:e.jsx(o.Suspense,{fallback:e.jsx(Me,{}),children:e.jsx(pr,{path:t})})})},a)),a.map(([r,t],o)=>{const a=t+".html";return e.jsx(f,{path:a,element:e.jsx(b,{to:t,replace:!0})},`html-${o}`)}),e.jsx(f,{path:"/",element:e.jsx(b,{to:s})})]})]})]})})})})};w(document.getElementById("root")).render(e.jsx(o.StrictMode,{children:e.jsx(hr,{})}));export{Me as S,q as a,dr as b,w as c,J as d,Z as e,v as f,W as g,re as h,ae as i,H as j,te as k,V as l,oe as m,G as r,ce as u,Y as w};
