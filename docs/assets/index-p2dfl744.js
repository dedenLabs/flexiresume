const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Data-CU1F0kAa.js","./framer-motion-CXdLbqfN.js","./react-vendor-DQmNySUk.js","./vendor-Rg6bv-5R.js","./react-icons-mdDy3BM0.js","./Data-KNzJUXQ1.js","./FlexiResume-DY438Mxe.js","./react-markdown-BnssULAo.js"])))=>i.map(i=>d[i]);
import{j as e,m as r}from"./framer-motion-CXdLbqfN.js";import{b as o,r as t,R as i}from"./react-vendor-DQmNySUk.js";import{m as a,c as s,r as n,f as c,d,u as l,N as p,a as h,B as m,R as u,b as g,e as f}from"./vendor-Rg6bv-5R.js";import{G as b}from"./react-icons-mdDy3BM0.js";var x;!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();var k=o;x=k.createRoot,k.hydrateRoot;const w={},v=function(e,r,o){let t=Promise.resolve();if(r&&r.length>0){const e=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),a=i?.nonce||i?.getAttribute("nonce");t=Promise.allSettled(r.map(r=>{if(r=function(e,r){return new URL(e,r).href}(r,o),r in w)return;w[r]=!0;const t=r.endsWith(".css"),i=t?'[rel="stylesheet"]':"";if(o)for(let o=e.length-1;o>=0;o--){const i=e[o];if(i.href===r&&(!t||"stylesheet"===i.rel))return}else if(document.querySelector(`link[href="${r}"]${i}`))return;const s=document.createElement("link");return s.rel=t?"stylesheet":"modulepreload",t||(s.as="script"),s.crossOrigin="",s.href=r,a&&s.setAttribute("nonce",a),document.head.appendChild(s),t?new Promise((e,o)=>{s.addEventListener("load",e),s.addEventListener("error",()=>o(new Error(`Unable to preload CSS for ${r}`)))}):void 0}))}function i(e){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=e,window.dispatchEvent(r),!r.defaultPrevented)throw e}return t.then(r=>{for(const e of r||[])"rejected"===e.status&&i(e.reason);return e().catch(i)})},y=new class{data={};tabs=[];skillMap=[];skills=[];collapsedMap=new Map;constructor(){a(this);const e=this.collapsedMap.set;this.collapsedMap.set=function(r,o){I("Store",o,r),e.call(this,r,o)}}},D="zh";let j=D;const $=new Map,C=[],P=()=>j,S=e=>{j!==e&&(j=e,C.forEach(r=>r(e)))},L=async e=>{if($.has(e))return $.get(e);try{let r;if("zh"===e)r=await v(()=>import("./Data-CU1F0kAa.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url);else{if("en"!==e)throw new Error(`Unsupported language: ${e}`);r=await v(()=>import("./Data-KNzJUXQ1.js"),__vite__mapDeps([5,1,2,3,4]),import.meta.url)}const o=r.default;return $.set(e,o),o}catch(r){if(e!==D)return L(D);throw r}},E=async()=>L(j),z=()=>{const e=navigator.language.toLowerCase();return e.startsWith("zh")?"zh":e.startsWith("en")?"en":D};(()=>{try{const e=localStorage.getItem("flexiresume-language");j=!e||"zh"!==e&&"en"!==e?z():e}catch(e){j=z()}})();let T=null,_=!1,M=null;function F(e){return s("app:"+e)}(async()=>{_||T||(_=!0,M=(async()=>{try{T=await E()}catch(e){}finally{_=!1}})())})();const I=s("app:折叠");function R(e,...r){return r.forEach(r=>{Object.keys(r).forEach(o=>{const t=e[o],i=r[o];Array.isArray(t)&&Array.isArray(i)?e[o]=Array.from(new Set([...t,...i])):e[o]="object"==typeof t&&"object"==typeof i?R({...t},i):i})}),e}async function O(e){y.collapsedMap.clear();const r=await E(),[o,t]=await Promise.all([r.loadPositionData(e),r.loadSkillsData()]),i=R({},o,r.expected_positions[e]),a=R({},r,i,{skill_level:t});y.data=a;const s=(a?.skill_level?.list||[]).sort((e,r)=>e.length-r.length);y.skills=s;const n={};s.forEach(([e,r])=>{n[e.toLocaleLowerCase()]=[e,r]}),y.skillMap=n}function N(e){const[r,o]=t.useState(Math.min(e,document.body.getBoundingClientRect().width));return t.useEffect(()=>{const r=()=>{o(Math.min(e,document.body.getBoundingClientRect().width))};return window.addEventListener("resize",r),()=>{window.removeEventListener("resize",r)}},[]),r}function A(e,r){return e.replace(/\$\{([\w.]+)\}/g,(e,o)=>{const t=o.split(".");let i=r;for(const r of t)if(i=i?i[r]:void 0,void 0===i)return e;return i})}function V(e,r){const o=new Date,t=o.getFullYear(),i=o.getMonth()+1;function a(e){if(!/^\d+/.test(e))return[t,i];const r=[".","/","-"];let o,a;for(const t of r)if(e.includes(t)){[o,a]=e.split(t).map(Number);break}return o&&a||([o,a]=e.match(/\d+/g).map(Number)),[o,a]}const[s,n]=a(e),[c,d]=a(r);let l=c-s,p=d-n;p<0&&(l-=1,p+=12);let h="";return l>0&&(h+=`${l}年`),p>0&&(h+=`${p}个月`),h||"0个月"}function B(e,r){const[o,i]=t.useState({}),a=e=>{const o={};for(let t=0;t<r;t++)o[t]=e;setTimeout(()=>i(o),0)};return function(e,r){t.useEffect(()=>{y.collapsedMap.has(e)||y.collapsedMap.set(e,!1);const o=n(()=>y.collapsedMap.get(e),e=>{r(e)});return()=>{o()}},[e])}(e,a),{collapsedItems:o,toggleCollapse:(e,r)=>{i({...o,[e]:r??!o[e]})},setCollapsedAllItems:a}}function W(e,r=0){const o=T||{header_info:{use_static_assets_from_cdn:!1,cdn_static_assets_dirs:["images"],static_assets_cdn_base_urls:[]}},t=o.header_info.cdn_static_assets_dirs,i=o.header_info.use_static_assets_from_cdn,a=o.header_info.static_assets_cdn_base_urls,s=i?a[r]:"";if(!s||!e)return e;const n=t.map(e=>`^\\/?${e}\\/`).join("|");return new RegExp(n).test(e)?(s+e).replace(/^\/+/,"/"):e}window.stopOtherVideos=function(e){document.querySelectorAll(".remark-video").forEach(r=>{r!==e.target&&r.pause()})};const H="920px",Y=c`
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
    background-image: url('${W("images/flexi-resume.jpg")}');

    /* 背景图平铺 */
    background-repeat: repeat;
    background-size: 180px;
  }

  /* 深色模式下的背景图优化 - 仅对背景图使用滤镜反转 */
  [data-theme="dark"] body {
    /* 使用滤镜反转背景图，让其适配深色主题 */
    background-image: url('${W("images/flexi-resume.jpg")}');

    /* 仅对背景图应用滤镜，不影响其他内容 */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${W("images/flexi-resume.jpg")}');
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
    @media (max-width: ${H}) {
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
      background: url(${W("images/url.svg")}) no-repeat center;
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
  @media (max-width: ${H}) {
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
`,q=F("PerformanceMonitor"),U=new class{metrics={};observers=[];constructor(){this.init()}init(){this.observeNavigation(),this.observeWebVitals(),this.observeResources(),this.setupReporting()}observeNavigation(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("navigation"===r.entryType){const e=r;this.metrics.TTFB=e.responseStart-e.requestStart,this.metrics.pageLoadTime=e.loadEventEnd-e.navigationStart,q("Navigation metrics:",{TTFB:this.metrics.TTFB,pageLoadTime:this.metrics.pageLoadTime})}});e.observe({entryTypes:["navigation"]}),this.observers.push(e)}}observeWebVitals(){this.observeLCP(),this.observeFID(),this.observeCLS(),this.observeFCP()}observeLCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{const r=e.getEntries(),o=r[r.length-1];this.metrics.LCP=o.startTime,q("LCP:",this.metrics.LCP)});e.observe({entryTypes:["largest-contentful-paint"]}),this.observers.push(e)}}observeFID(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("first-input"===r.entryType){const e=r;this.metrics.FID=e.processingStart-e.startTime,q("FID:",this.metrics.FID)}});e.observe({entryTypes:["first-input"]}),this.observers.push(e)}}observeCLS(){if("PerformanceObserver"in window){let e=0;const r=new PerformanceObserver(r=>{for(const o of r.getEntries())"layout-shift"!==o.entryType||o.hadRecentInput||(e+=o.value);this.metrics.CLS=e,q("CLS:",this.metrics.CLS)});r.observe({entryTypes:["layout-shift"]}),this.observers.push(r)}}observeFCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())"first-contentful-paint"===r.name&&(this.metrics.FCP=r.startTime,q("FCP:",this.metrics.FCP))});e.observe({entryTypes:["paint"]}),this.observers.push(e)}}observeResources(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const r of e.getEntries())if("resource"===r.entryType){const e=r,o=e.responseEnd-e.startTime;o>1e3&&q("Slow resource:",{name:e.name,loadTime:o,size:e.transferSize})}});e.observe({entryTypes:["resource"]}),this.observers.push(e)}}setupReporting(){document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&this.reportMetrics()}),window.addEventListener("beforeunload",()=>{this.reportMetrics()})}reportMetrics(){q("Performance Metrics:",this.metrics),navigator.sendBeacon&&JSON.stringify({url:window.location.href,timestamp:Date.now(),metrics:this.metrics,userAgent:navigator.userAgent})}recordCustomMetric(e,r){this.metrics[e]=r,q(`Custom metric ${e}:`,r)}recordComponentMetric(e,r,o){switch(this.metrics.componentMetrics||(this.metrics.componentMetrics={}),this.metrics.componentMetrics[e]||(this.metrics.componentMetrics[e]={renderTime:0,mountTime:0,updateTime:0}),r){case"render":this.metrics.componentMetrics[e].renderTime=o;break;case"mount":this.metrics.componentMetrics[e].mountTime=o;break;case"update":this.metrics.componentMetrics[e].updateTime=o}q(`Component ${e} ${r} time:`,o)}recordDataLoadTime(e,r){this.metrics.dataLoadTime=r,q(`Data load time for ${e}:`,r)}recordSkeletonDisplayTime(e){this.metrics.skeletonDisplayTime=e,q("Skeleton display time:",e)}recordRouteChangeTime(e,r,o){this.metrics.routeChangeTime=o,q(`Route change from ${e} to ${r}:`,o)}recordThemeChangeTime(e,r,o){this.metrics.themeChangeTime=o,q(`Theme change from ${e} to ${r}:`,o)}recordLanguageChangeTime(e,r,o){this.metrics.languageChangeTime=o,q(`Language change from ${e} to ${r}:`,o)}recordMemoryUsage(){if("memory"in performance){const e=performance.memory;this.metrics.memoryUsage=e.usedJSHeapSize,q("Memory usage:",{used:e.usedJSHeapSize,total:e.totalJSHeapSize,limit:e.jsHeapSizeLimit})}}getMetrics(){return{...this.metrics}}getPerformanceScore(){const e=this.getMetrics();let r=100;const o={};return e.LCP&&(e.LCP>4e3?(r-=30,o.LCP="Poor"):e.LCP>2500?(r-=15,o.LCP="Needs Improvement"):o.LCP="Good"),e.FID&&(e.FID>300?(r-=25,o.FID="Poor"):e.FID>100?(r-=10,o.FID="Needs Improvement"):o.FID="Good"),e.CLS&&(e.CLS>.25?(r-=20,o.CLS="Poor"):e.CLS>.1?(r-=10,o.CLS="Needs Improvement"):o.CLS="Good"),e.dataLoadTime&&(e.dataLoadTime>2e3?(r-=15,o.dataLoad="Slow"):e.dataLoadTime>1e3?(r-=5,o.dataLoad="Moderate"):o.dataLoad="Fast"),{score:Math.max(0,r),details:o}}cleanup(){this.observers.forEach(e=>e.disconnect()),this.observers=[]}},J=(e,r,o)=>{U.recordComponentMetric(e,r,o)},G=(e,r)=>{U.recordDataLoadTime(e,r)},X=e=>{U.recordSkeletonDisplayTime(e)},K=(e,r,o)=>{U.recordRouteChangeTime(e,r,o)},Q={light:{primary:"#3498db",secondary:"#2c3e50",accent:"#e74c3c",background:"#ffffff",surface:"#f8f9fa",card:"#ffffff",text:{primary:"#2c3e50",secondary:"#7f8c8d",disabled:"#bdc3c7",inverse:"#ffffff"},border:{light:"#ecf0f1",medium:"#bdc3c7",dark:"#95a5a6"},status:{success:"#27ae60",warning:"#f39c12",error:"#e74c3c",info:"#3498db"},shadow:{light:"rgba(0, 0, 0, 0.05)",medium:"rgba(0, 0, 0, 0.1)",dark:"rgba(0, 0, 0, 0.2)"}},dark:{primary:"#4a9eff",secondary:"#e2e8f0",accent:"#ff6b6b",background:"#0f1419",surface:"#1a202c",card:"#2d3748",text:{primary:"#e2e8f0",secondary:"#a0aec0",disabled:"#718096",inverse:"#1a202c"},border:{light:"#2d3748",medium:"#4a5568",dark:"#718096"},status:{success:"#48bb78",warning:"#ed8936",error:"#f56565",info:"#4299e1"},shadow:{light:"rgba(0, 0, 0, 0.1)",medium:"rgba(0, 0, 0, 0.25)",dark:"rgba(0, 0, 0, 0.4)"}}},Z=t.createContext(void 0),ee=({children:r})=>{const[o,i]=t.useState(()=>{const e=localStorage.getItem("theme");return!e||"light"!==e&&"dark"!==e?window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e});t.useEffect(()=>{localStorage.setItem("theme",o),document.documentElement.setAttribute("data-theme",o);const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",Q[o].background)},[o]),t.useEffect(()=>{const e=window.matchMedia("(prefers-color-scheme: dark)"),r=e=>{localStorage.getItem("theme")||i(e.matches?"dark":"light")};return e.addEventListener("change",r),()=>e.removeEventListener("change",r)},[]);const a={mode:o,setMode:i,toggleMode:()=>{const e=performance.now(),r=o;i(o=>{const t="light"===o?"dark":"light";return setTimeout(()=>{const o=performance.now()-e;((e,r,o)=>{U.recordThemeChangeTime(e,r,o)})(r,t,o)},0),t})},colors:Q[o],isDark:"dark"===o};return e.jsx(Z.Provider,{value:a,children:r})},re=()=>{const e=t.useContext(Z);if(!e)throw new Error("useTheme must be used within a ThemeProvider");return e},oe="#aaa",te="920px",ie=d.nav.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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

  @media (min-width: ${te}) {
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
`,ae=d(p).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  /* 移动端样式优化 */
  padding: 6px 8px; /* 进一步减少padding */
  text-decoration: none;
  color: ${e=>e.isDark?"var(--color-text-primary)":"black"};
  border: 2px solid transparent; /* 默认无边框 */
  border-radius: 6px 6px 0 0; /* 减小圆角 */
  border-top: 1px solid ${e=>e.isDark?"var(--color-border-medium)":oe};
  border-right: 1px solid ${e=>e.isDark?"var(--color-border-medium)":oe};
  border-bottom: 0px solid ${e=>e.isDark?"var(--color-border-medium)":oe};
  border-left: 1px solid ${e=>e.isDark?"var(--color-border-medium)":oe};
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

  @media (min-width: ${te}) {
    padding: 10px 10px;
    margin: 2px 0;
    border: none;
    text-align: center;
    font-size: 16px; /* 桌面端恢复正常字体大小 */

    /* 竖向排列文本 */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    border-radius: 0px 8px 8px 0px;
    border-top: 1px solid ${e=>e.isDark?"var(--color-border-medium)":oe};
    border-right: 1px solid ${e=>e.isDark?"var(--color-border-medium)":oe};
    border-bottom: 1px solid ${e=>e.isDark?"var(--color-border-medium)":oe};
    border-left: 0px solid ${e=>e.isDark?"var(--color-border-medium)":oe};

    &:hover, &.active {
      background-color: ${e=>e.isDark?"var(--color-surface)":"#f0f0f0"};
      border-right: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示右侧边框 */
      color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    }
  }
`,se=()=>{const r=y.data,o=y.tabs,{isDark:i}=re(),a=l();return t.useEffect(()=>{if(!o.length)return void(document.title=r?.header_info?.position||"My Resume");const e=function(e){const r=y.data,o=y.tabs,t=e.pathname,i=o.find(([,e])=>e===t);return i?i[0]:r?.header_info?.position||""}(a),t=Object.assign({},r?.header_info,{position:e}),i=function(e,r){if(!r)return r?.position||"My Resume";const o=e.replace(/{(position|name|age|location)}/g,(e,o)=>r[o]||""),t=o.replace(/[-\s]+/g," ").trim();return t&&"-"!==t&&"--"!==t&&"---"!==t?o:r?.position||r?.name||"My Resume"}(r?.header_info?.resume_name_format||"{position}-{name}-{age}-{location}",t),s=i&&i.trim()?i:e||r?.header_info?.position||"My Resume";document.title=s},[a,r,o.length]),o.length?e.jsx(ie,{isDark:i,children:o.map(([r,o],t)=>e.jsx(ae,{className:"no-link-icon",to:o,isDark:i,children:r},o))}):null};function ne(e){return b({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},child:[]}]})(e)}const ce=d.div`
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
`,de=d.img`
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.3s ease;
    cursor: pointer; 
`,le=d.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  padding: 10px;
  cursor: pointer;
  z-index: 1100;  
`,pe=({imageUrl:r,onClose:o})=>e.jsxs(ce,{onClick:o,children:[e.jsx(de,{src:r,onClick:e=>e.stopPropagation()}),e.jsx(le,{onClick:o,children:e.jsx(ne,{size:30,color:"white"})})]}),he=t.createContext(void 0),me=({children:o})=>{const[i,a]=t.useState(!1),[s,n]=t.useState(""),c=e=>{n(e),a(!0)};return window.$handleImageClick=c,e.jsxs(he.Provider,{value:{handleImageClick:c},children:[o,i&&e.jsx(r.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:e.jsx(pe,{imageUrl:s,onClose:()=>{a(!1)}})})]})},ue=d.div`
  max-width: 800px;
  padding: 40px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 20px auto;
`,ge=d.div`
  font-size: 64px;
  color: #ff6b6b;
  margin-bottom: 20px;
`,fe=d.h2`
  color: #333;
  margin-bottom: 16px;
  font-size: 24px;
`,be=d.p`
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
`,xe=d.button`
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
`;class ke extends t.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,r){this.setState({error:e,errorInfo:r})}handleRetry=()=>{this.setState({hasError:!1,error:void 0,errorInfo:void 0})};render(){return this.state.hasError?this.props.fallback?this.props.fallback:e.jsxs(ue,{children:[e.jsx(ge,{children:"⚠️"}),e.jsx(fe,{children:"页面加载出错了"}),e.jsxs(be,{children:["抱歉，页面遇到了一些问题。请尝试刷新页面或稍后再试。",e.jsx("br",{}),"如果问题持续存在，请联系技术支持。"]}),e.jsx(xe,{onClick:this.handleRetry,children:"重新加载"}),!1]}):this.props.children}}const we=h`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`,ve=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  background: ${e=>e.isDark?"linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%)":"linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)"};
  background-size: 200px 100%;
  animation: ${we} 1.5s infinite linear;
  border-radius: 4px;
  transition: background 0.3s ease;
`,ye=d(ve).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>e.height||"16px"};
  width: ${e=>e.width||"100%"};
  margin: ${e=>e.margin||"8px 0"};
`,De=d(ve).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>{switch(e.size){case"small":return"20px";case"large":return"32px";default:return"24px"}}};
  width: ${e=>{switch(e.size){case"small":return"120px";case"large":return"200px";default:return"150px"}}};
  margin: 16px 0;
`,je=d(ve).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: ${e=>e.size||80}px;
  height: ${e=>e.size||80}px;
  border-radius: 50%;
  flex-shrink: 0;
`;d(ve).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: 36px;
  width: ${e=>e.width||"100px"};
  border-radius: 6px;
`;const $e=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  padding: ${e=>e.padding||"20px"};
  border: 1px solid ${e=>e.isDark?"var(--color-border-medium)":"#e0e0e0"};
  border-radius: 8px;
  margin: 16px 0;
  background: ${e=>e.isDark?"var(--color-card)":"#fff"};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;d(ve)`
  width: ${e=>e.width||"100%"};
  height: ${e=>e.height||"200px"};
  aspect-ratio: ${e=>e.aspectRatio||"auto"};
  border-radius: 8px;
`;const Ce=d.div.withConfig({shouldForwardProp:e=>"minWidth"!==e})`
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
`,Pe=()=>{const{isDark:r}=re(),o=N(800)-40;return e.jsxs(Ce,{minWidth:o,children:[e.jsxs("div",{style:{display:"flex",gap:"20px",marginBottom:"40px"},children:[e.jsx(je,{size:100,isDark:r}),e.jsxs("div",{style:{flex:1},children:[e.jsx(De,{size:"large",isDark:r}),e.jsx(ye,{width:"60%",height:"18px",isDark:r}),e.jsx(ye,{width:"50%",height:"16px",isDark:r}),e.jsx(ye,{width:"40%",height:"16px",isDark:r})]})]}),e.jsxs($e,{isDark:r,children:[e.jsx(De,{size:"medium",isDark:r}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"12px"},children:[e.jsx(ye,{width:"80%",isDark:r}),e.jsx(ye,{width:"70%",isDark:r}),e.jsx(ye,{width:"90%",isDark:r}),e.jsx(ye,{width:"75%",isDark:r}),e.jsx(ye,{width:"85%",isDark:r}),e.jsx(ye,{width:"65%",isDark:r})]})]}),e.jsxs($e,{isDark:r,children:[e.jsx(De,{size:"medium",isDark:r}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(ye,{width:"40%",height:"20px",isDark:r}),e.jsx(ye,{width:"100%",isDark:r}),e.jsx(ye,{width:"95%",isDark:r}),e.jsx(ye,{width:"88%",isDark:r})]}),e.jsxs("div",{children:[e.jsx(ye,{width:"35%",height:"20px",isDark:r}),e.jsx(ye,{width:"100%",isDark:r}),e.jsx(ye,{width:"92%",isDark:r}),e.jsx(ye,{width:"85%",isDark:r})]})]}),e.jsxs($e,{isDark:r,children:[e.jsx(De,{size:"medium",isDark:r}),e.jsx(ye,{width:"50%",height:"18px",isDark:r}),e.jsx(ye,{width:"100%",isDark:r}),e.jsx(ye,{width:"90%",isDark:r}),e.jsx(ye,{width:"95%",isDark:r})]})]})},Se={zh:{common:{loading:"加载中...",error:"加载失败",retry:"重试",contact:"联系我",download:"下载简历",print:"打印简历",share:"分享",switchLanguage:"切换语言",switchTheme:"切换主题",lightMode:"浅色模式",darkMode:"深色模式",controlPanel:"控制面板",theme:"主题",language:"语言"},resume:{personalInfo:"个人信息",personalStrengths:"个人优势",skills:"技能清单",employmentHistory:"工作经历",projectExperience:"项目经历",educationHistory:"教育背景",personalInfluence:"个人影响力",careerPlanning:"职业规划",openSourceProjects:"开源项目"},profile:{position:"求职意向",expectedSalary:"期望薪资",status:"工作状态",phone:"联系电话",email:"邮箱地址",location:"所在地区",experience:"工作经验",education:"学历"},time:{present:"至今",years:"年",months:"个月"}},en:{common:{loading:"Loading...",error:"Load Failed",retry:"Retry",contact:"Contact Me",download:"Download Resume",print:"Print Resume",share:"Share",switchLanguage:"Switch Language",switchTheme:"Switch Theme",lightMode:"Light Mode",darkMode:"Dark Mode",controlPanel:"Control Panel",theme:"Theme",language:"Language"},resume:{personalInfo:"Personal Information",personalStrengths:"Personal Strengths",skills:"Skills",employmentHistory:"Work Experience",projectExperience:"Project Experience",educationHistory:"Education",personalInfluence:"Personal Influence",careerPlanning:"Career Planning",openSourceProjects:"Open Source Projects"},profile:{position:"Position",expectedSalary:"Expected Salary",status:"Status",phone:"Phone",email:"Email",location:"Location",experience:"Experience",education:"Education"},time:{present:"Present",years:" years",months:" months"}}},Le=t.createContext(void 0),Ee=({children:r})=>{const[o,i]=t.useState(()=>{const e=localStorage.getItem("language");return!e||"zh"!==e&&"en"!==e?navigator.language.toLowerCase().startsWith("zh")?"zh":"en":e});t.useEffect(()=>{localStorage.setItem("language",o)},[o]);const a=(e=>r=>{const o=performance.now();e(e=>(setTimeout(()=>{const t=performance.now()-o;((e,r,o)=>{U.recordLanguageChangeTime(e,r,o)})(e,r,t)},0),r))})(i),s={language:o,setLanguage:a,t:Se[o]};return e.jsx(Le.Provider,{value:s,children:r})},ze=()=>{const e=t.useContext(Le);if(!e)throw new Error("useI18n must be used within an I18nProvider");return e},Te=d.div`
  position: relative;
  display: inline-block;
`,_e=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Me=d.span`
  font-size: 16px;
  line-height: 1;
`,Fe=d.span`
  font-weight: 500;
`,Ie=d.div.withConfig({shouldForwardProp:e=>"isOpen"!==e&&"isDark"!==e})`
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
`,Re=d.button.withConfig({shouldForwardProp:e=>"isActive"!==e&&"isDark"!==e})`
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
`,Oe=d.span.withConfig({shouldForwardProp:e=>"visible"!==e&&"isDark"!==e})`
  opacity: ${e=>e.visible?1:0};
  color: ${e=>e.isDark?"#48bb78":"#27ae60"};
  font-weight: bold;
  margin-left: auto;
`,Ne=[{code:"zh",name:"Chinese",icon:"🇨🇳",nativeName:"中文"},{code:"en",name:"English",icon:"🇺🇸",nativeName:"English"}],Ae=({className:r})=>{const{language:o,setLanguage:t,t:a}=ze(),{isDark:s}=re(),[n,c]=i.useState(!1),d=Ne.find(e=>e.code===o);i.useEffect(()=>{const e=P();e!==o&&t(e)},[o,t]);const l=i.useCallback(e=>{e.target.closest("[data-language-switcher]")||c(!1)},[]);return i.useEffect(()=>{if(n)return document.addEventListener("click",l),()=>document.removeEventListener("click",l)},[n,l]),e.jsxs(Te,{className:r,"data-language-switcher":!0,children:[e.jsxs(_e,{isDark:s,onClick:()=>c(!n),title:a.common.switchLanguage,"aria-label":a.common.switchLanguage,children:[e.jsx(Me,{children:d?.icon}),e.jsx(Fe,{children:d?.nativeName}),e.jsx("span",{style:{transform:n?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.3s ease",fontSize:"12px"},children:"▼"})]}),e.jsx(Ie,{isOpen:n,isDark:s,children:Ne.map(r=>e.jsxs(Re,{isActive:o===r.code,isDark:s,onClick:()=>(e=>{t(e);const r=e;S(r),(e=>{try{localStorage.setItem("flexiresume-language",e)}catch(r){}})(r),c(!1)})(r.code),children:[e.jsx("span",{children:r.icon}),e.jsx("span",{children:r.nativeName}),e.jsx(Oe,{visible:o===r.code,isDark:s,children:"✓"})]},r.code))})]})},Ve=d.div`
  position: relative;
  display: inline-block;
`,Be=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,We=d.div.withConfig({shouldForwardProp:e=>"isVisible"!==e})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${e=>e.isVisible?"scale(1) rotate(0deg)":"scale(0) rotate(180deg)"};
  opacity: ${e=>e.isVisible?1:0};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`,He=d.div`
  position: relative;
  
  &::before {
    content: '☀️';
    font-size: 20px;
    display: block;
  }
`,Ye=d.div`
  position: relative;
  
  &::before {
    content: '🌙';
    font-size: 18px;
    display: block;
  }
`,qe=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e&&"isVisible"!==e})`
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
`,Ue=d.div.withConfig({shouldForwardProp:e=>"isActive"!==e})`
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
`,Je=({className:r,showTooltip:o=!0})=>{const{mode:t,toggleMode:a,isDark:s}=re(),{t:n}=ze(),[c,d]=i.useState(!1),[l,p]=i.useState(!1),h=s?n.common.lightMode:n.common.darkMode;return e.jsxs(Ve,{className:r,onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),children:[e.jsxs(Be,{isDark:s,onClick:()=>{p(!0),setTimeout(()=>p(!1),600),a()},title:h,"aria-label":h,children:[e.jsx(Ue,{isActive:l}),e.jsx(We,{isVisible:!s,children:e.jsx(He,{})}),e.jsx(We,{isVisible:s,children:e.jsx(Ye,{})})]}),o&&e.jsx(qe,{isDark:s,isVisible:c,children:h})]})},Ge=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    padding: 8px;
    gap: 8px;
  }
`,Xe=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`;const Ke=d.div.withConfig({shouldForwardProp:e=>"isCollapsed"!==e&&"isDark"!==e})`
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
`,Qe=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Ze=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,er=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,rr=d.span.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  font-size: 14px;
  font-weight: 500;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
`,or=({className:r,collapsible:o=!1,defaultCollapsed:t=!1})=>{const{isDark:a}=re(),{t:s}=ze(),[n,c]=i.useState(t);return o?e.jsxs(Ke,{isCollapsed:n,isDark:a,className:r,children:[e.jsx(Qe,{isDark:a,onClick:()=>c(!n),title:s.common.controlPanel,"aria-label":s.common.controlPanel,children:n?"⚙️":"✕"}),!n&&e.jsxs(Ze,{isDark:a,children:[e.jsxs(er,{children:[e.jsx(rr,{isDark:a,children:s.common.theme}),e.jsx(Je,{showTooltip:!1})]}),e.jsx(Xe,{isDark:a}),e.jsxs(er,{children:[e.jsx(rr,{isDark:a,children:s.common.language}),e.jsx(Ae,{})]})]})]}):e.jsxs(Ge,{isDark:a,className:r,children:[e.jsx(Je,{}),e.jsx(Xe,{isDark:a}),e.jsx(Ae,{})]})},tr=t.lazy(()=>v(()=>import("./FlexiResume-DY438Mxe.js").then(e=>e.bB),__vite__mapDeps([6,1,2,3,4,7]),import.meta.url)),ir=()=>{const[r,o]=t.useState(null),[i,a]=t.useState([]),[s,n]=t.useState("/"),[c,d]=t.useState(!0),l=async()=>{try{d(!0);const e=await E();o(e),await(async()=>{try{T=await E()}catch(e){}})();const r=(e=>Object.keys(e.expected_positions).filter(r=>!e.expected_positions[r].hidden).map(r=>[e.expected_positions[r].header_info?.position,"/"+r,!!e.expected_positions[r].is_home_page,!!e.expected_positions[r].is_home_page]))(e);a(r),n((e=>e.find(([,,e])=>e)?.[1]||"/")(r)),y.tabs=r}catch(e){}finally{d(!1)}};return t.useEffect(()=>{var e;return l(),e=()=>{l()},C.push(e),()=>{const r=C.indexOf(e);r>-1&&C.splice(r,1)}},[]),function(){const e=()=>{document.querySelectorAll(".lazy-video").forEach(e=>{const r=e.getBoundingClientRect();r.top<window.innerHeight+200&&r.bottom>0&&(e=>{const r=JSON.parse(e.dataset.sources);e.innerHTML=` \n        <source src="${W(r.original)}" type="video/mp4">\n        <source src="${W(r.original,1)}" type="video/mp4">\n      `,e.classList.remove("lazy-video"),e.removeAttribute("data-sources");const o=e.parentNode.querySelector(".loading-indicator");o?.remove()})(e)})};let r;window.addEventListener("scroll",()=>{r&&clearTimeout(r),r=setTimeout(e,100)}),window.addEventListener("resize",e),window.addEventListener("mouseup",()=>setTimeout(e,0)),e()}(),c||!r?e.jsx(ee,{children:e.jsx(Ee,{children:e.jsxs(ke,{children:[e.jsx(Y,{}),e.jsx(or,{collapsible:!0}),e.jsx(Pe,{})]})})}):e.jsx(ee,{children:e.jsx(Ee,{children:e.jsx(ke,{children:e.jsxs(me,{children:[e.jsx(Y,{}),e.jsx(or,{collapsible:!0}),e.jsxs(m,{basename:r.header_info.route_base_name,children:[e.jsx(se,{})," ",e.jsxs(u,{children:[i.map(([r,o],i)=>e.jsx(g,{path:o,element:e.jsx(ke,{children:e.jsx(t.Suspense,{fallback:e.jsx(Pe,{}),children:e.jsx(tr,{path:o})})})},i)),i.map(([r,o],t)=>{const i=o+".html";return e.jsx(g,{path:i,element:e.jsx(f,{to:o,replace:!0})},`html-${t}`)}),e.jsx(g,{path:"/",element:e.jsx(f,{to:s})})]})]})]})})})})};x(document.getElementById("root")).render(e.jsx(t.StrictMode,{children:e.jsx(ir,{})}));export{Pe as S,v as _,A as a,B as b,x as c,V as d,J as e,y as f,F as g,K as h,O as i,G as j,X as k,I as l,W as r,re as u,N as w};
