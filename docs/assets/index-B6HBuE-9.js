const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Data-CNVRmVMr.js","./mermaid-core-CxzdCigi.js","./react-vendor-DQmNySUk.js","./d3-charts-C9eKmPJg.js","./Data-BxG0xU24.js","./utils-CEXnc-BX.js","./cytoscape-3nCDfVzk.js","./FlexiResume-C8UDSOWL.js","./framer-motion-CXdLbqfN.js","./vendor-B9-6CCQX.js","./react-icons-mdDy3BM0.js","./react-markdown-BR0DeiX9.js"])))=>i.map(i=>d[i]);
import{j as e,m as t}from"./framer-motion-CXdLbqfN.js";import{b as r,r as i,R as a}from"./react-vendor-DQmNySUk.js";import{aD as o,_ as n}from"./mermaid-core-CxzdCigi.js";import{m as s,r as c,f as l,d,u as p,N as h,a as u,B as m,R as g,b as f,c as b}from"./vendor-B9-6CCQX.js";import{G as x}from"./react-icons-mdDy3BM0.js";import"./d3-charts-C9eKmPJg.js";var w;!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if("childList"===r.type)for(const e of r.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)}).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var k=r;w=k.createRoot,k.hydrateRoot;const v=new class{data={};tabs=[];skillMap=[];skills=[];collapsedMap=new Map;constructor(){s(this);const e=this.collapsedMap.set;this.collapsedMap.set=function(t,r){Z("Store",r,t),e.call(this,t,r)}}},y=o("app:dataloader"),D="zh";let C=D;const S=new Map,j=[],P=()=>C,E=e=>{C!==e&&(C=e,j.forEach(t=>t(e)))},$=async e=>{if(S.has(e))return S.get(e);try{let t;if("zh"===e)t=await n(()=>import("./Data-CNVRmVMr.js"),__vite__mapDeps([0,1,2,3]),import.meta.url);else{if("en"!==e)throw new Error(`Unsupported language: ${e}`);t=await n(()=>import("./Data-BxG0xU24.js"),__vite__mapDeps([4,1,2,3]),import.meta.url)}const r=t.default;return S.set(e,r),r}catch(t){if(y(`Failed to load data for language: ${e}`,t),e!==D)return y(`Falling back to default language: ${D}`),$(D);throw t}},_=async()=>$(C),L=()=>{const e=navigator.language.toLowerCase();return e.startsWith("zh")?"zh":e.startsWith("en")?"en":D};(()=>{try{const e=localStorage.getItem("flexiresume-language");C=!e||"zh"!==e&&"en"!==e?L():e}catch(e){y("Failed to read language preference from localStorage",e),C=L()}})();const z=(e,t)=>e?e.split(",").map(e=>e.trim()).filter(Boolean):t,I=(e,t)=>e?"true"===e.toLowerCase():t,T=(e,t)=>{if(!e)return t;const r=parseInt(e,10);return isNaN(r)?t:r},F={cdn:{enabled:I("true",!0),baseUrls:z("https://flexiresume-static.web.app/,https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/,https://dedenlabs.github.io/flexiresume-static/",["https://flexiresume-static.web.app/","https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/","https://dedenlabs.github.io/flexiresume-static/"]),healthCheck:{timeout:T("5000",5e3),testPath:"favicon.ico",enabled:!0},sortingStrategy:{mode:"speed",enabled:!0,speedWeight:.7,availabilityWeight:.3},localOptimization:{enabled:!0,forceLocal:!1,localBasePath:""}},api:{baseUrl:"",timeout:T("10000",1e4),version:"v1"},theme:{defaultTheme:"auto",enableTransitions:I("true",!0),transitionDuration:T("300",300)},performance:{enableLazyLoading:I("true",!0),lazyLoadingThreshold:T("100",100),enablePreloading:I("true",!0),preloadResources:z("/images/avatar.webp,/images/flexi-resume.jpg",["/images/avatar.webp","/images/background.webp"]),preloadLibraries:{mermaid:!0,svgPanZoom:!0,katex:!1,cytoscape:!1}},app:{name:"FlexiResume",version:"1.0.0",buildTime:(new Date).toISOString(),isDevelopment:!1},debug:{enabled:I("false",!1),showPerformanceMonitor:!1,verboseLogging:!1}},M=()=>F,R=()=>F.cdn,O=()=>F.debug.enabled;class N{static instance;healthResults=new Map;isChecking=!1;checkPromise=null;constructor(){}static getInstance(){return N.instance||(N.instance=new N),N.instance}async checkSingleCDN(e,t,r){const i=Date.now(),a=i;try{const c=e.endsWith("/")?`${e}${t}`:`${e}/${t}`;O();try{const t=await this.checkCDNWithImage(e,c,r,i,a);if(t.available)return t}catch(o){O()}try{const t=await this.checkCDNWithFetch(e,c,r,i,a,"HEAD");if(t.available)return t}catch(n){O()}try{return await this.checkCDNWithFetch(e,c,r,i,a,"GET")}catch(s){throw s}}catch(c){const t=Date.now()-i,r=c instanceof Error?c.message:"Unknown error";return O(),{url:e,available:!1,responseTime:t,error:r,timestamp:a}}}async checkCDNWithImage(e,t,r,i,a){return new Promise((o,n)=>{const s=new Image;let c=!1;const l=setTimeout(()=>{c||(c=!0,n(new Error("Image load timeout")))},r);s.onload=()=>{if(!c){c=!0,clearTimeout(l);const t=Date.now()-i;O(),o({url:e,available:!0,responseTime:t,timestamp:a})}},s.onerror=()=>{c||(c=!0,clearTimeout(l),n(new Error(`Image load failed: ${t}`)))};const d=`?_t=${Date.now()}&_r=${Math.random()}`;s.src=t+d})}async checkCDNWithFetch(e,t,r,i,a,o="HEAD"){const n=new AbortController,s=setTimeout(()=>n.abort(),r);try{const r=await fetch(t,{method:o,signal:n.signal,cache:"no-cache",mode:"cors"});clearTimeout(s);const c=Date.now()-i,l={url:e,available:r.ok,responseTime:c,timestamp:a};return r.ok||(l.error=`HTTP ${r.status}: ${r.statusText}`),O(),l}catch(c){throw clearTimeout(s),c}}async checkAllCDNs(e={}){if(this.isChecking&&this.checkPromise)return this.checkPromise;this.isChecking=!0;const t=R(),{timeout:r=t.healthCheck.timeout,testPath:i=t.healthCheck.testPath,concurrent:a=!0,maxConcurrency:o=3}=e;O(),this.checkPromise=this.performHealthCheck(t.baseUrls,i,r,a,o);try{const e=await this.checkPromise;return e.forEach(e=>{this.healthResults.set(e.url,e)}),this.reorderCDNUrls(e),O(),e}finally{this.isChecking=!1,this.checkPromise=null}}async performHealthCheck(e,t,r,i,a){if(i){const i=[];for(let o=0;o<e.length;o+=a){const n=e.slice(o,o+a).map(e=>this.checkSingleCDN(e,t,r)),s=await Promise.all(n);i.push(...s)}return i}{const i=[];for(const a of e){const e=await this.checkSingleCDN(a,t,r);i.push(e)}return i}}reorderCDNUrls(e){const t=R().sortingStrategy;if(!t.enabled)return void O();let r;if("availability"===t.mode){const t=e.filter(e=>e.available).sort((e,t)=>e.responseTime-t.responseTime),i=e.filter(e=>!e.available);r=[...t.map(e=>e.url),...i.map(e=>e.url)],O()}else{if("speed"!==t.mode)return;{const i=e.filter(e=>e.available).sort((e,r)=>{const i=1/e.responseTime*t.speedWeight+(e.available?1:0)*t.availabilityWeight;return 1/r.responseTime*t.speedWeight+(r.available?1:0)*t.availabilityWeight-i}),a=e.filter(e=>!e.available);r=[...i.map(e=>e.url),...a.map(e=>e.url)],O()}}var i;i={baseUrls:r},Object.assign(F.cdn,i),O()}getHealthResults(){return Array.from(this.healthResults.values())}getAvailableCDNs(){return Array.from(this.healthResults.values()).filter(e=>e.available).sort((e,t)=>e.responseTime-t.responseTime).map(e=>e.url)}isCDNAvailable(e){const t=this.healthResults.get(e);return!!t&&t.available}clearCache(){this.healthResults.clear()}getBestCDN(){const e=this.getAvailableCDNs();return e.length>0?e[0]:null}getAllResults(){return Array.from(this.healthResults.values())}}const A=N.getInstance(),U=o("app:cdn");let B=null;function W(){if(null!==B)return B;const e=R();if(!e.localOptimization.enabled)return B=!1,!1;if(e.localOptimization.forceLocal)return B=!0,!0;if(e.localOptimization.customDetection)try{const t=e.localOptimization.customDetection();return B=t,t}catch(c){U("Custom detection function failed: %O",c)}if("undefined"==typeof window)return B=!1,!1;const{hostname:t,port:r}=window.location,i="localhost"===t||"127.0.0.1"===t||"0.0.0.0"===t||t.endsWith(".local"),a=parseInt(r,10),o=r&&(a>=3e3&&a<4e3||a>=4e3&&a<5e3||a>=5e3&&a<6e3||a>=8e3&&a<9e3||a>=9e3&&a<1e4);let n=!1;const s=i&&(o||n);return B=s,U("Local development detection: %s %O",s,{hostname:t,port:r,isLocalHost:i,isDevelopmentPort:o,isDevEnvironment:n,configEnabled:e.localOptimization.enabled,forceLocal:e.localOptimization.forceLocal}),s}class K{static instance;urlCache=new Map;isInitialized=!1;initPromise=null;constructor(){}static getInstance(){return K.instance||(K.instance=new K),K.instance}async initialize(){if(!this.isInitialized){if(this.initPromise)return this.initPromise;this.initPromise=this.performInitialization(),await this.initPromise}}async performInitialization(){const e=R();if(!e.enabled)return U("CDN is disabled, skipping health check"),void(this.isInitialized=!0);if(W())return U("Local development environment detected, skipping CDN health check and using local resources"),void(this.isInitialized=!0);if(!e.healthCheck.enabled)return O(),void(this.isInitialized=!0);try{O(),await A.checkAllCDNs(),O()&&A.getAvailableCDNs()}catch(t){}finally{this.isInitialized=!0,this.initPromise=null}}getResourceUrl(e,t={}){const{enableFallback:r=!0,localBasePath:i="",cacheUrls:a=!0}=t;if(a&&this.urlCache.has(e))return this.urlCache.get(e);const o=R();if(W()){const t=this.buildLocalUrl(e,i);return a&&this.urlCache.set(e,t),O(),t}if(!o.enabled){const t=this.buildLocalUrl(e,i);return a&&this.urlCache.set(e,t),t}const n=A.getBestCDN();if(n){const t=this.buildCDNUrl(n,e);return a&&this.urlCache.set(e,t),t}if(A.getAllResults().length===o.baseUrls.length){if(r){const t=this.buildLocalUrl(e,i);return O(),a&&this.urlCache.set(e,t),t}}else if(o.baseUrls.length>0){const t=o.baseUrls[0],r=this.buildCDNUrl(t,e);return O(),r}if(r){const t=this.buildLocalUrl(e,i);return O(),a&&this.urlCache.set(e,t),t}throw new Error(`[CDN Manager] No CDN available and fallback is disabled for resource: ${e}`)}buildCDNUrl(e,t){return`${e.endsWith("/")?e.slice(0,-1):e}/${t.startsWith("/")?t.slice(1):t}`}projectBasePathCache=null;getProjectBasePath(){if(null!==this.projectBasePathCache)return this.projectBasePathCache;let e="";if("undefined"!=typeof window)try{const t=window.location.pathname.split("/").filter(e=>e);if(W()){if(t.length>0){const r=t[t.length-1],i=["fullstack","games","tools","operations","automation","management"].includes(r)||r.endsWith(".html");i&&t.length>1?e="/"+t.slice(0,-1).join("/"):!i&&t.length>=1&&(e="/"+t.join("/"))}}else if(t.length>0){const r=t[t.length-1],i=["fullstack","games","tools","operations","automation","management"].includes(r)||r.endsWith(".html");i&&t.length>1?e="/"+t.slice(0,-1).join("/"):!i&&t.length>=1&&(e="/"+t.join("/"))}e&&"/"!==e&&e.endsWith("/")&&(e=e.slice(0,-1))}catch(t){O()}return this.projectBasePathCache=e,O(),e}buildLocalUrl(e,t){const r=R();let i=t;if(!i&&r.localOptimization.localBasePath&&(i=r.localOptimization.localBasePath),i)return`${i.endsWith("/")?i.slice(0,-1):i}/${e.startsWith("/")?e.slice(1):e}`;const a=this.getProjectBasePath(),o=e.startsWith("/")?e.slice(1):e;let n;if(a){const e=a.startsWith("/")?a:"/"+a;n=(e.endsWith("/")?e:e+"/")+o}else n="/"+o;if("undefined"!=typeof window){const{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r&&"80"!==r&&"443"!==r?`:${r}`:""}${n.startsWith("/")?n:"/"+n}`}return n}resetPathCache(){this.projectBasePathCache=null}async preloadResources(e,t={}){const r=e.map(async e=>{try{const r=this.getResourceUrl(e,t),i=document.createElement("link");i.rel="preload",i.href=r;const a=e.split(".").pop()?.toLowerCase();switch(a){case"jpg":case"jpeg":case"png":case"webp":case"svg":i.as="image";break;case"css":i.as="style";break;case"js":i.as="script";break;case"woff":case"woff2":i.as="font",i.crossOrigin="anonymous";break;default:i.as="fetch",i.crossOrigin="anonymous"}document.head.appendChild(i),O()}catch(r){}});await Promise.allSettled(r)}getCDNHealthStatus(){return A.getHealthResults()}async refreshCDNHealth(){return A.clearCache(),this.clearUrlCache(),await A.checkAllCDNs()}clearUrlCache(){this.urlCache.clear()}isReady(){return this.isInitialized}getCacheStats(){return{size:this.urlCache.size,keys:Array.from(this.urlCache.keys())}}}const V=K.getInstance(),G=o("app:cache"),H=o("app:cdn");o("app:tools");let Y=null,q=!1,J=null;function Q(e){return o("app:"+e)}(async()=>{q||Y||(q=!0,J=(async()=>{try{Y=await _(),G("Data cache initialized successfully")}catch(e){G("Failed to initialize data cache: %O",e)}finally{q=!1}})())})();const Z=o("app:折叠");function X(e,...t){return t.forEach(t=>{Object.keys(t).forEach(r=>{const i=e[r],a=t[r];Array.isArray(i)&&Array.isArray(a)?e[r]=Array.from(new Set([...i,...a])):e[r]="object"==typeof i&&"object"==typeof a?X({...i},a):a})}),e}async function ee(e){v.collapsedMap.clear();const t=await _(),[r,i]=await Promise.all([t.loadPositionData(e),t.loadSkillsData()]),a=X({},r,t.expected_positions[e]),o=X({},t,a,{skill_level:i});v.data=o;const n=(o?.skill_level?.list||[]).sort((e,t)=>e.length-t.length);v.skills=n;const s={};n.forEach(([e,t])=>{s[e.toLocaleLowerCase()]=[e,t]}),v.skillMap=s}function te(e){const[t,r]=i.useState(Math.min(e,document.body.getBoundingClientRect().width));return i.useEffect(()=>{const t=()=>{r(Math.min(e,document.body.getBoundingClientRect().width))};return window.addEventListener("resize",t),()=>{window.removeEventListener("resize",t)}},[]),t}function re(e,t){return e.replace(/\$\{([\w.]+)\}/g,(e,r)=>{const i=r.split(".");let a=t;for(const t of i)if(a=a?a[t]:void 0,void 0===a)return e;return a})}function ie(e,t){const r=new Date,i=r.getFullYear(),a=r.getMonth()+1;function o(e){if(!/^\d+/.test(e))return[i,a];const t=[".","/","-"];let r,o;for(const i of t)if(e.includes(i)){[r,o]=e.split(i).map(Number);break}return r&&o||([r,o]=e.match(/\d+/g).map(Number)),[r,o]}const[n,s]=o(e),[c,l]=o(t);let d=c-n,p=l-s;p<0&&(d-=1,p+=12);let h="";return d>0&&(h+=`${d}年`),p>0&&(h+=`${p}个月`),h||"0个月"}function ae(e,t){const[r,a]=i.useState({}),o=e=>{const r={};for(let i=0;i<t;i++)r[i]=e;setTimeout(()=>a(r),0)};return function(e,t){i.useEffect(()=>{v.collapsedMap.has(e)||v.collapsedMap.set(e,!1);const r=c(()=>v.collapsedMap.get(e),e=>{t(e)});return()=>{r()}},[e])}(e,o),{collapsedItems:r,toggleCollapse:(e,t)=>{a({...r,[e]:t??!r[e]})},setCollapsedAllItems:o}}function oe(e,t=0){const r=(Y||(q||G("Data cache not initialized, using fallback"),{header_info:{cdn_static_assets_dirs:["images"]}})).header_info.cdn_static_assets_dirs||["images"];if(!e)return e;const i=r.map(e=>`^\\/?${e}\\/`).join("|");if(!new RegExp(i).test(e))return e;try{return V.getResourceUrl(e,{enableFallback:!0,localBasePath:"",cacheUrls:!0})}catch(a){return H("Failed to get CDN URL, using original: %O",a),e}}window.stopOtherVideos=function(e){document.querySelectorAll(".remark-video").forEach(t=>{t!==e.target&&t.pause()})};const ne="920px",se=l`
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
    letter-spacing: 0.02em;
    word-break: break-word; /* 改为break-word，避免强制断行 */
    transition: color 0.3s ease, background-color 0.3s ease, filter 0.3s ease;

    /* 修复移动端横向溢出问题 */
    overflow-x: hidden; /* 隐藏横向滚动条 */
    width: 100%;
    max-width: 100vw; /* 确保不超出视口宽度 */
    box-sizing: border-box;
    min-height: 100vh;

    /* 背景图 */
    background-image: url('${oe("images/flexi-resume.jpg")}');

    /* 背景图平铺 */
    background-repeat: repeat;
    background-size: 180px;
  }

  /* 深色模式下的背景图优化 - 仅对背景图使用滤镜反转 */
  [data-theme="dark"] body {
    /* 使用滤镜反转背景图，让其适配深色主题 */
    background-image: url('${oe("images/flexi-resume.jpg")}');

    /* 仅对背景图应用滤镜，不影响其他内容 */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${oe("images/flexi-resume.jpg")}');
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
    width: 100%;
    max-width: 100vw; /* 确保不超出视口宽度 */
    box-sizing: border-box;
    overflow-x: hidden; /* 防止横向溢出 */

    @media (max-width: ${ne}) {
      flex-direction: column;
      align-items: center;
      padding: 0; /* 移除可能的padding */
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
      background: url(${oe("images/url.svg")}) no-repeat center;
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
  @media (max-width: ${ne}) {
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
`,ce=Q("PerformanceMonitor"),le=new class{metrics={};observers=[];constructor(){this.init()}init(){this.observeNavigation(),this.observeWebVitals(),this.observeResources(),this.setupReporting()}observeNavigation(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("navigation"===t.entryType){const e=t;this.metrics.TTFB=e.responseStart-e.requestStart,this.metrics.pageLoadTime=e.loadEventEnd-e.navigationStart,ce("Navigation metrics:",{TTFB:this.metrics.TTFB,pageLoadTime:this.metrics.pageLoadTime})}});e.observe({entryTypes:["navigation"]}),this.observers.push(e)}}observeWebVitals(){this.observeLCP(),this.observeFID(),this.observeCLS(),this.observeFCP()}observeLCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{const t=e.getEntries(),r=t[t.length-1];this.metrics.LCP=r.startTime,ce("LCP:",this.metrics.LCP)});e.observe({entryTypes:["largest-contentful-paint"]}),this.observers.push(e)}}observeFID(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("first-input"===t.entryType){const e=t;this.metrics.FID=e.processingStart-e.startTime,ce("FID:",this.metrics.FID)}});e.observe({entryTypes:["first-input"]}),this.observers.push(e)}}observeCLS(){if("PerformanceObserver"in window){let e=0;const t=new PerformanceObserver(t=>{for(const r of t.getEntries())"layout-shift"!==r.entryType||r.hadRecentInput||(e+=r.value);this.metrics.CLS=e,ce("CLS:",this.metrics.CLS)});t.observe({entryTypes:["layout-shift"]}),this.observers.push(t)}}observeFCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())"first-contentful-paint"===t.name&&(this.metrics.FCP=t.startTime,ce("FCP:",this.metrics.FCP))});e.observe({entryTypes:["paint"]}),this.observers.push(e)}}observeResources(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("resource"===t.entryType){const e=t,r=e.responseEnd-e.startTime;r>1e3&&ce("Slow resource:",{name:e.name,loadTime:r,size:e.transferSize})}});e.observe({entryTypes:["resource"]}),this.observers.push(e)}}setupReporting(){document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&this.reportMetrics()}),window.addEventListener("beforeunload",()=>{this.reportMetrics()})}reportMetrics(){ce("Performance Metrics:",this.metrics),navigator.sendBeacon&&JSON.stringify({url:window.location.href,timestamp:Date.now(),metrics:this.metrics,userAgent:navigator.userAgent})}recordCustomMetric(e,t){this.metrics[e]=t,ce(`Custom metric ${e}:`,t)}recordComponentMetric(e,t,r){switch(this.metrics.componentMetrics||(this.metrics.componentMetrics={}),this.metrics.componentMetrics[e]||(this.metrics.componentMetrics[e]={renderTime:0,mountTime:0,updateTime:0}),t){case"render":this.metrics.componentMetrics[e].renderTime=r;break;case"mount":this.metrics.componentMetrics[e].mountTime=r;break;case"update":this.metrics.componentMetrics[e].updateTime=r}ce(`Component ${e} ${t} time:`,r)}recordDataLoadTime(e,t){this.metrics.dataLoadTime=t,ce(`Data load time for ${e}:`,t)}recordSkeletonDisplayTime(e){this.metrics.skeletonDisplayTime=e,ce("Skeleton display time:",e)}recordRouteChangeTime(e,t,r){this.metrics.routeChangeTime=r,ce(`Route change from ${e} to ${t}:`,r)}recordThemeChangeTime(e,t,r){this.metrics.themeChangeTime=r,ce(`Theme change from ${e} to ${t}:`,r)}recordLanguageChangeTime(e,t,r){this.metrics.languageChangeTime=r,ce(`Language change from ${e} to ${t}:`,r)}recordMemoryUsage(){if("memory"in performance){const e=performance.memory;this.metrics.memoryUsage=e.usedJSHeapSize,ce("Memory usage:",{used:e.usedJSHeapSize,total:e.totalJSHeapSize,limit:e.jsHeapSizeLimit})}}getMetrics(){return{...this.metrics}}getPerformanceScore(){const e=this.getMetrics();let t=100;const r={};return e.LCP&&(e.LCP>4e3?(t-=30,r.LCP="Poor"):e.LCP>2500?(t-=15,r.LCP="Needs Improvement"):r.LCP="Good"),e.FID&&(e.FID>300?(t-=25,r.FID="Poor"):e.FID>100?(t-=10,r.FID="Needs Improvement"):r.FID="Good"),e.CLS&&(e.CLS>.25?(t-=20,r.CLS="Poor"):e.CLS>.1?(t-=10,r.CLS="Needs Improvement"):r.CLS="Good"),e.dataLoadTime&&(e.dataLoadTime>2e3?(t-=15,r.dataLoad="Slow"):e.dataLoadTime>1e3?(t-=5,r.dataLoad="Moderate"):r.dataLoad="Fast"),{score:Math.max(0,t),details:r}}cleanup(){this.observers.forEach(e=>e.disconnect()),this.observers=[]}},de=(e,t,r)=>{le.recordComponentMetric(e,t,r)},pe=(e,t)=>{le.recordDataLoadTime(e,t)},he=e=>{le.recordSkeletonDisplayTime(e)},ue=(e,t,r)=>{le.recordRouteChangeTime(e,t,r)},me={light:{primary:"#3498db",secondary:"#2c3e50",accent:"#e74c3c",background:"#ffffff",surface:"#f8f9fa",card:"#ffffff",text:{primary:"#2c3e50",secondary:"#7f8c8d",disabled:"#bdc3c7",inverse:"#ffffff"},border:{light:"#ecf0f1",medium:"#bdc3c7",dark:"#95a5a6"},status:{success:"#27ae60",warning:"#f39c12",error:"#e74c3c",info:"#3498db"},shadow:{light:"rgba(0, 0, 0, 0.05)",medium:"rgba(0, 0, 0, 0.1)",dark:"rgba(0, 0, 0, 0.2)"}},dark:{primary:"#4a9eff",secondary:"#e2e8f0",accent:"#ff6b6b",background:"#0f1419",surface:"#1a202c",card:"#2d3748",text:{primary:"#e2e8f0",secondary:"#a0aec0",disabled:"#718096",inverse:"#1a202c"},border:{light:"#2d3748",medium:"#4a5568",dark:"#718096"},status:{success:"#48bb78",warning:"#ed8936",error:"#f56565",info:"#4299e1"},shadow:{light:"rgba(0, 0, 0, 0.1)",medium:"rgba(0, 0, 0, 0.25)",dark:"rgba(0, 0, 0, 0.4)"}}},ge=i.createContext(void 0),fe=({children:t})=>{const[r,a]=i.useState(()=>{const e=localStorage.getItem("theme");return!e||"light"!==e&&"dark"!==e?window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e});i.useEffect(()=>{localStorage.setItem("theme",r),document.documentElement.setAttribute("data-theme",r);const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",me[r].background)},[r]),i.useEffect(()=>{const e=window.matchMedia("(prefers-color-scheme: dark)"),t=e=>{localStorage.getItem("theme")||a(e.matches?"dark":"light")};return e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]);const o={mode:r,setMode:a,toggleMode:()=>{const e=performance.now(),t=r;a(r=>{const i="light"===r?"dark":"light";return setTimeout(()=>{const r=performance.now()-e;((e,t,r)=>{le.recordThemeChangeTime(e,t,r)})(t,i,r)},0),i})},colors:me[r],isDark:"dark"===r};return e.jsx(ge.Provider,{value:o,children:t})},be=()=>{const e=i.useContext(ge);if(!e)throw new Error("useTheme must be used within a ThemeProvider");return e},xe="#aaa",we="920px",ke=d.nav.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  /* 移动端样式 - 修复横向溢出问题 */
  padding: 0 10px; /* 适当的左右padding */
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%; /* 确保不超出容器宽度 */
  max-width: 100%; /* 不超出父容器 */
  box-sizing: border-box;
  top: 2px;
  justify-content: flex-start; /* 改为左对齐，避免溢出 */
  overflow-x: auto; /* 允许横向滚动 */
  overflow-y: hidden;
  gap: 2px; /* 减少标签间距 */

  /* 移动端特殊处理 */
  @media (max-width: 768px) {
    padding: 0 5px;
    margin: 20px 5px 0 5px;
    width: calc(100% - 10px);
    max-width: calc(100vw - 10px);
  }

  /* 超小屏幕适配 */
  @media (max-width: 480px) {
    padding: 0 2px;
    margin: 20px 2px 0 2px;
    width: calc(100% - 4px);
    max-width: calc(100vw - 4px);
    gap: 1px;
  }

  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* 完全移除滚动提示渐变遮罩 - 用户反馈不需要此功能 */
  &::after {
    display: none !important;
    content: none !important;
  }

  @media (min-width: ${we}) {
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

    /* 桌面端不需要滚动提示 - 强制隐藏 */
    &::after {
      display: none !important;
      content: none !important;
    }
  }

  /* 在打印时隐藏 */
  @media print {
    display: none;
  }
`,ve=d(h).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  /* 基础样式 */
  text-decoration: none;
  color: ${e=>e.isDark?"var(--color-text-primary)":"black"};
  border: 2px solid transparent;
  border-radius: 6px 6px 0 0;
  border-top: 1px solid ${e=>e.isDark?"var(--color-border-medium)":xe};
  border-right: 1px solid ${e=>e.isDark?"var(--color-border-medium)":xe};
  border-bottom: 0px solid ${e=>e.isDark?"var(--color-border-medium)":xe};
  border-left: 1px solid ${e=>e.isDark?"var(--color-border-medium)":xe};
  transition: background-color 0.3s, border 0.3s, color 0.3s, transform 0.2s;
  box-shadow: 0 0 10px ${e=>e.isDark?"var(--color-shadow-medium)":"rgba(0, 0, 0, 0.1)"};
  background-color: ${e=>e.isDark?"var(--color-card)":"#fff"};
  white-space: nowrap;
  flex-shrink: 0;
  box-sizing: border-box;

  /* 移动端样式 */
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 500;
  min-width: fit-content;
  max-width: 100px; /* 减小最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis;

  /* 超小屏幕适配 */
  @media (max-width: 480px) {
    padding: 4px 6px;
    font-size: 11px;
    max-width: 80px;
  }

  &:hover, &.active {
    background-color: ${e=>e.isDark?"var(--color-surface)":"#f0f0f0"};
    border-color: ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态时显示边框颜色 */
    border-top: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示顶部边框 */
    color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    transform: translateY(-1px); /* 轻微上移效果 */
  }

  @media (min-width: ${we}) {
    padding: 10px 10px;
    margin: 2px 0;
    border: none;
    text-align: center;
    font-size: 16px; /* 桌面端恢复正常字体大小 */

    /* 竖向排列文本 */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    border-radius: 0px 8px 8px 0px;
    border-top: 1px solid ${e=>e.isDark?"var(--color-border-medium)":xe};
    border-right: 1px solid ${e=>e.isDark?"var(--color-border-medium)":xe};
    border-bottom: 1px solid ${e=>e.isDark?"var(--color-border-medium)":xe};
    border-left: 0px solid ${e=>e.isDark?"var(--color-border-medium)":xe};

    &:hover, &.active {
      background-color: ${e=>e.isDark?"var(--color-surface)":"#f0f0f0"};
      border-right: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示右侧边框 */
      color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    }
  }
`,ye=()=>{const t=v.data,r=v.tabs,{isDark:a}=be(),o=p();return i.useEffect(()=>{if(!r.length)return void(document.title=t?.header_info?.position||"My Resume");const e=function(e){const t=v.data,r=v.tabs,i=e.pathname,a=r.find(([,e])=>e===i);return a?a[0]:t?.header_info?.position||""}(o),i=Object.assign({},t?.header_info,{position:e}),a=function(e,t){if(!t)return t?.position||"My Resume";const r=e.replace(/{(position|name|age|location)}/g,(e,r)=>t[r]||""),i=r.replace(/[-\s]+/g," ").trim();return i&&"-"!==i&&"--"!==i&&"---"!==i?r:t?.position||t?.name||"My Resume"}(t?.header_info?.resume_name_format||"{position}-{name}-{age}-{location}",i),n=a&&a.trim()?a:e||t?.header_info?.position||"My Resume";document.title=n},[o,t,r.length]),r.length?e.jsx(ke,{"data-testid":"navigation-tabs",isDark:a,children:r.map(([t,r],i)=>e.jsx(ve,{className:"no-link-icon",to:r,isDark:a,children:t},r))}):null};function De(e){return x({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},child:[]}]})(e)}const Ce=d.div`
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
`,Se=d.img`
    max-width: 100%;
    max-height: 100%;
    transition: transform 0.3s ease;
    cursor: pointer; 
`,je=d.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  padding: 10px;
  cursor: pointer;
  z-index: 1100;  
`,Pe=({imageUrl:t,onClose:r})=>e.jsxs(Ce,{onClick:r,children:[e.jsx(Se,{src:t,onClick:e=>e.stopPropagation()}),e.jsx(je,{onClick:r,children:e.jsx(De,{size:30,color:"white"})})]}),Ee=i.createContext(void 0),$e=({children:r})=>{const[a,o]=i.useState(!1),[n,s]=i.useState(""),c=e=>{s(e),o(!0)};return window.$handleImageClick=c,e.jsxs(Ee.Provider,{value:{handleImageClick:c},children:[r,a&&e.jsx(t.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},children:e.jsx(Pe,{imageUrl:n,onClose:()=>{o(!1)}})})]})},_e=new Set;let Le={isOnline:navigator.onLine,connectionType:"unknown",effectiveType:"unknown",downlink:0,rtt:0,saveData:!1};function ze(){return{...Le}}const Ie=o("app:error-boundary"),Te=d.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${e=>{switch(e.level){case"page":return"60px 20px";case"section":return"40px 20px";default:return"20px"}}};
  min-height: ${e=>"page"===e.level?"400px":"200px"};
  background: ${e=>e.isDark?"var(--color-card)":"#fff"};
  border: 1px solid ${e=>e.isDark?"var(--color-border-medium)":"#e0e0e0"};
  border-radius: 8px;
  margin: 16px 0;
  text-align: center;
  transition: all 0.3s ease;
`,Fe=d.div`
  font-size: ${e=>{switch(e.level){case"page":return"48px";case"section":return"36px";default:return"24px"}}};
  margin-bottom: 16px;
  opacity: 0.8;
`,Me=d.h3`
  color: ${e=>e.isDark?"var(--color-text-primary)":"#333"};
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
`,Re=d.p`
  color: ${e=>e.isDark?"var(--color-text-secondary)":"#666"};
  margin: 0 0 24px 0;
  line-height: 1.5;
  max-width: 500px;
`,Oe=d.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`,Ne=d.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  
  ${e=>"primary"===e.variant?`\n    background: ${e.isDark?"var(--color-primary)":"#007bff"};\n    color: white;\n    \n    &:hover {\n      background: ${e.isDark?"var(--color-primary-hover)":"#0056b3"};\n      transform: translateY(-1px);\n    }\n  `:`\n    background: transparent;\n    color: ${e.isDark?"var(--color-text-secondary)":"#666"};\n    border: 1px solid ${e.isDark?"var(--color-border-medium)":"#ddd"};\n    \n    &:hover {\n      background: ${e.isDark?"var(--color-hover)":"#f8f9fa"};\n    }\n  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`,Ae=d.details`
  margin-top: 24px;
  max-width: 600px;
  text-align: left;
  
  summary {
    cursor: pointer;
    color: ${e=>e.isDark?"var(--color-text-secondary)":"#666"};
    font-size: 14px;
    margin-bottom: 8px;
    
    &:hover {
      color: ${e=>e.isDark?"var(--color-text-primary)":"#333"};
    }
  }
  
  pre {
    background: ${e=>e.isDark?"#1a1a1a":"#f8f9fa"};
    border: 1px solid ${e=>e.isDark?"var(--color-border-medium)":"#e0e0e0"};
    border-radius: 4px;
    padding: 12px;
    font-size: 12px;
    line-height: 1.4;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    color: ${e=>e.isDark?"var(--color-text-primary)":"#333"};
  }
`,Ue=d.div`
  margin-top: 16px;
  padding: 8px 12px;
  background: ${e=>e.isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.05)"};
  border-radius: 4px;
  font-size: 12px;
  color: ${e=>e.isDark?"var(--color-text-secondary)":"#666"};
`;class Be extends i.Component{networkStatusUnsubscribe;constructor(e){super(e),this.state={hasError:!1,retryCount:0,isRetrying:!1}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){const r=function(e){const t=e.message.toLowerCase();return t.includes("network")||t.includes("fetch")||t.includes("timeout")||"TypeError"===e.name&&t.includes("failed to fetch")?"network":t.includes("chunk")||t.includes("loading")||t.includes("import")?"chunk":"runtime"}(e),i=ze(),a={type:r,message:e.message,stack:e.stack,componentStack:t.componentStack,timestamp:Date.now(),userAgent:navigator.userAgent,url:window.location.href,networkStatus:i,retryCount:this.state.retryCount};var o;this.setState({error:e,errorInfo:t,errorDetails:a}),this.props.onError?.(a),O()&&(Ie("EnhancedErrorBoundary caught an error:",e,t),Ie("Error details:",a)),this.networkStatusUnsubscribe=(o=e=>{e.isOnline&&this.state.hasError&&Ie("Network recovered, user can retry")},_e.add(o),o(Le),()=>{_e.delete(o)})}componentWillUnmount(){this.networkStatusUnsubscribe?.()}handleRetry=async()=>{const e=this.props.maxRetries||3;this.state.retryCount>=e||(this.setState({isRetrying:!0}),await new Promise(e=>setTimeout(e,1e3)),this.setState({hasError:!1,error:void 0,errorInfo:void 0,errorDetails:void 0,retryCount:this.state.retryCount+1,isRetrying:!1}))};handleReload=()=>{window.location.reload()};render(){if(this.state.hasError){if(this.props.fallback)return this.props.fallback;const{level:t="component",showErrorDetails:r=!1}=this.props,{errorDetails:i,retryCount:a,isRetrying:o}=this.state,n=this.props.maxRetries||3,s=ze(),c=i?.type||"unknown",l=function(e,t){if(!t)return"网络连接已断开，请检查您的网络连接后重试。";switch(e){case"network":return"网络请求失败，请检查网络连接或稍后重试。";case"chunk":return"页面资源加载失败，可能是网络问题，请尝试刷新页面。";case"runtime":return"页面运行时出现错误，请尝试刷新页面或联系技术支持。";default:return"页面遇到了一些问题，请尝试刷新页面或稍后再试。"}}(c,s.isOnline);return e.jsxs(Te,{level:t,isDark:this.props.isDark,children:[e.jsx(Fe,{level:t,children:"network"===c?"🌐":"chunk"===c?"📦":"runtime"===c?"⚠️":"❌"}),e.jsx(Me,{isDark:this.props.isDark,children:"network"===c?"网络连接问题":"chunk"===c?"资源加载失败":"runtime"===c?"运行时错误":"页面加载出错了"}),e.jsxs(Re,{isDark:this.props.isDark,children:[l,a>0&&e.jsxs(e.Fragment,{children:[e.jsx("br",{}),"已重试 ",a," 次"]})]}),e.jsxs(Oe,{children:[e.jsx(Ne,{variant:"primary",isDark:this.props.isDark,onClick:this.handleRetry,disabled:o||a>=n,children:o?"重试中...":a>=n?"已达最大重试次数":"重新加载"}),e.jsx(Ne,{variant:"secondary",isDark:this.props.isDark,onClick:this.handleReload,children:"刷新页面"})]}),!s.isOnline&&e.jsx(Ue,{isDark:this.props.isDark,children:"🔴 网络连接已断开"}),r&&i&&e.jsxs(Ae,{isDark:this.props.isDark,children:[e.jsx("summary",{children:"错误详情 (开发模式)"}),e.jsxs("pre",{children:["错误类型: ",i.type,"\n","错误消息: ",i.message,"\n","时间戳: ",new Date(i.timestamp).toLocaleString(),"\n","网络状态: ",JSON.stringify(i.networkStatus,null,2),i.stack&&`\n\n堆栈跟踪:\n${i.stack}`,i.componentStack&&`\n\n组件堆栈:\n${i.componentStack}`]})]})]})}return this.props.children}}const We=t=>{const{isDark:r}=be();return e.jsx(Be,{...t,isDark:r,showErrorDetails:t.showErrorDetails??!1})},Ke=u`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`,Ve=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  background: ${e=>e.isDark?"linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%)":"linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)"};
  background-size: 200px 100%;
  animation: ${Ke} 1.5s infinite linear;
  border-radius: 4px;
  transition: background 0.3s ease;
`,Ge=d(Ve).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>e.height||"16px"};
  width: ${e=>e.width||"100%"};
  margin: ${e=>e.margin||"8px 0"};
`,He=d(Ve).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>{switch(e.size){case"small":return"20px";case"large":return"32px";default:return"24px"}}};
  width: ${e=>{switch(e.size){case"small":return"120px";case"large":return"200px";default:return"150px"}}};
  margin: 16px 0;
`,Ye=d(Ve).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: ${e=>e.size||80}px;
  height: ${e=>e.size||80}px;
  border-radius: 50%;
  flex-shrink: 0;
`;d(Ve).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: 36px;
  width: ${e=>e.width||"100px"};
  border-radius: 6px;
`;const qe=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  padding: ${e=>e.padding||"20px"};
  border: 1px solid ${e=>e.isDark?"var(--color-border-medium)":"#e0e0e0"};
  border-radius: 8px;
  margin: 16px 0;
  background: ${e=>e.isDark?"var(--color-card)":"#fff"};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;d(Ve)`
  width: ${e=>e.width||"100%"};
  height: ${e=>e.height||"200px"};
  aspect-ratio: ${e=>e.aspectRatio||"auto"};
  border-radius: 8px;
`;const Je=d.div.withConfig({shouldForwardProp:e=>"minWidth"!==e})`
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
`,Qe=()=>{const{isDark:t}=be(),r=te(800)-40;return e.jsxs(Je,{minWidth:r,children:[e.jsxs("div",{style:{display:"flex",gap:"20px",marginBottom:"40px"},children:[e.jsx(Ye,{size:100,isDark:t}),e.jsxs("div",{style:{flex:1},children:[e.jsx(He,{size:"large",isDark:t}),e.jsx(Ge,{width:"60%",height:"18px",isDark:t}),e.jsx(Ge,{width:"50%",height:"16px",isDark:t}),e.jsx(Ge,{width:"40%",height:"16px",isDark:t})]})]}),e.jsxs(qe,{isDark:t,children:[e.jsx(He,{size:"medium",isDark:t}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"12px"},children:[e.jsx(Ge,{width:"80%",isDark:t}),e.jsx(Ge,{width:"70%",isDark:t}),e.jsx(Ge,{width:"90%",isDark:t}),e.jsx(Ge,{width:"75%",isDark:t}),e.jsx(Ge,{width:"85%",isDark:t}),e.jsx(Ge,{width:"65%",isDark:t})]})]}),e.jsxs(qe,{isDark:t,children:[e.jsx(He,{size:"medium",isDark:t}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(Ge,{width:"40%",height:"20px",isDark:t}),e.jsx(Ge,{width:"100%",isDark:t}),e.jsx(Ge,{width:"95%",isDark:t}),e.jsx(Ge,{width:"88%",isDark:t})]}),e.jsxs("div",{children:[e.jsx(Ge,{width:"35%",height:"20px",isDark:t}),e.jsx(Ge,{width:"100%",isDark:t}),e.jsx(Ge,{width:"92%",isDark:t}),e.jsx(Ge,{width:"85%",isDark:t})]})]}),e.jsxs(qe,{isDark:t,children:[e.jsx(He,{size:"medium",isDark:t}),e.jsx(Ge,{width:"50%",height:"18px",isDark:t}),e.jsx(Ge,{width:"100%",isDark:t}),e.jsx(Ge,{width:"90%",isDark:t}),e.jsx(Ge,{width:"95%",isDark:t})]})]})},Ze={zh:{common:{loading:"加载中...",error:"加载失败",retry:"重试",contact:"联系我",download:"下载简历",print:"打印简历",share:"分享",switchLanguage:"切换语言",switchTheme:"切换主题",lightMode:"浅色模式",darkMode:"深色模式",controlPanel:"控制面板",theme:"主题",language:"语言",export:"导出",exportPDF:"导出PDF",exporting:"导出中...",exportFailed:"PDF导出失败，请重试"},resume:{personalInfo:"个人信息",personalStrengths:"个人优势",skills:"技能清单",employmentHistory:"工作经历",projectExperience:"项目经历",educationHistory:"教育背景",personalInfluence:"个人影响力",careerPlanning:"职业规划",openSourceProjects:"开源项目"},profile:{position:"求职意向",expectedSalary:"期望薪资",status:"工作状态",phone:"联系电话",email:"邮箱地址",location:"所在地区",experience:"工作经验",education:"学历"},time:{present:"至今",years:"年",months:"个月"}},en:{common:{loading:"Loading...",error:"Load Failed",retry:"Retry",contact:"Contact Me",download:"Download Resume",print:"Print Resume",share:"Share",switchLanguage:"Switch Language",switchTheme:"Switch Theme",lightMode:"Light Mode",darkMode:"Dark Mode",controlPanel:"Control Panel",theme:"Theme",language:"Language",export:"Export",exportPDF:"Export PDF",exporting:"Exporting...",exportFailed:"PDF export failed, please try again"},resume:{personalInfo:"Personal Information",personalStrengths:"Personal Strengths",skills:"Skills",employmentHistory:"Work Experience",projectExperience:"Project Experience",educationHistory:"Education",personalInfluence:"Personal Influence",careerPlanning:"Career Planning",openSourceProjects:"Open Source Projects"},profile:{position:"Position",expectedSalary:"Expected Salary",status:"Status",phone:"Phone",email:"Email",location:"Location",experience:"Experience",education:"Education"},time:{present:"Present",years:" years",months:" months"}}},Xe=i.createContext(void 0),et=({children:t})=>{const[r,a]=i.useState(()=>{const e=localStorage.getItem("language");return!e||"zh"!==e&&"en"!==e?navigator.language.toLowerCase().startsWith("zh")?"zh":"en":e});i.useEffect(()=>{localStorage.setItem("language",r)},[r]);const o=(e=>t=>{const r=performance.now();e(e=>(setTimeout(()=>{const i=performance.now()-r;((e,t,r)=>{le.recordLanguageChangeTime(e,t,r)})(e,t,i)},0),t))})(a),n={language:r,setLanguage:o,t:Ze[r]};return e.jsx(Xe.Provider,{value:n,children:t})},tt=()=>{const e=i.useContext(Xe);if(!e)throw new Error("useI18n must be used within an I18nProvider");return e},rt=d.div`
  position: relative;
  display: inline-block;
`,it=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,at=d.span`
  font-size: 16px;
  line-height: 1;
`,ot=d.span`
  font-weight: 500;
`,nt=d.div.withConfig({shouldForwardProp:e=>"isOpen"!==e&&"isDark"!==e})`
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
`,st=d.button.withConfig({shouldForwardProp:e=>"isActive"!==e&&"isDark"!==e})`
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
`,ct=d.span.withConfig({shouldForwardProp:e=>"visible"!==e&&"isDark"!==e})`
  opacity: ${e=>e.visible?1:0};
  color: ${e=>e.isDark?"#48bb78":"#27ae60"};
  font-weight: bold;
  margin-left: auto;
`,lt=[{code:"zh",name:"Chinese",icon:"🇨🇳",nativeName:"中文"},{code:"en",name:"English",icon:"🇺🇸",nativeName:"English"}],dt=({className:t})=>{const{language:r,setLanguage:i,t:o}=tt(),{isDark:n}=be(),[s,c]=a.useState(!1),l=lt.find(e=>e.code===r);a.useEffect(()=>{const e=P();e!==r&&i(e)},[r,i]);const d=a.useCallback(e=>{e.target.closest("[data-language-switcher]")||c(!1)},[]);return a.useEffect(()=>{if(s)return document.addEventListener("click",d),()=>document.removeEventListener("click",d)},[s,d]),e.jsxs(rt,{className:t,"data-testid":"language-switcher","data-language-switcher":!0,children:[e.jsxs(it,{isDark:n,onClick:()=>c(!s),title:o.common.switchLanguage,"aria-label":o.common.switchLanguage,children:[e.jsx(at,{children:l?.icon}),e.jsx(ot,{children:l?.nativeName}),e.jsx("span",{style:{transform:s?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.3s ease",fontSize:"12px"},children:"▼"})]}),e.jsx(nt,{isOpen:s,isDark:n,children:lt.map(t=>e.jsxs(st,{isActive:r===t.code,isDark:n,onClick:()=>(e=>{i(e);const t=e;E(t),(e=>{try{localStorage.setItem("flexiresume-language",e)}catch(t){y("Failed to save language preference to localStorage",t)}})(t),c(!1)})(t.code),children:[e.jsx("span",{children:t.icon}),e.jsx("span",{children:t.nativeName}),e.jsx(ct,{visible:r===t.code,isDark:n,children:"✓"})]},t.code))})]})},pt=d.div`
  position: relative;
  display: inline-block;
`,ht=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,ut=d.div.withConfig({shouldForwardProp:e=>"isVisible"!==e})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${e=>e.isVisible?"scale(1) rotate(0deg)":"scale(0) rotate(180deg)"};
  opacity: ${e=>e.isVisible?1:0};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`,mt=d.div`
  position: relative;
  
  &::before {
    content: '☀️';
    font-size: 20px;
    display: block;
  }
`,gt=d.div`
  position: relative;
  
  &::before {
    content: '🌙';
    font-size: 18px;
    display: block;
  }
`,ft=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e&&"isVisible"!==e})`
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
`,bt=d.div.withConfig({shouldForwardProp:e=>"isActive"!==e})`
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
`,xt=({className:t,showTooltip:r=!0})=>{const{mode:i,toggleMode:o,isDark:n}=be(),{t:s}=tt(),[c,l]=a.useState(!1),[d,p]=a.useState(!1),h=n?s.common.lightMode:s.common.darkMode;return e.jsxs(pt,{className:t,"data-theme-switcher":!0,onMouseEnter:()=>l(!0),onMouseLeave:()=>l(!1),children:[e.jsxs(ht,{isDark:n,onClick:()=>{p(!0),setTimeout(()=>p(!1),600),o()},title:h,"aria-label":h,children:[e.jsx(bt,{isActive:d}),e.jsx(ut,{isVisible:!n,children:e.jsx(mt,{})}),e.jsx(ut,{isVisible:n,children:e.jsx(gt,{})})]}),r&&e.jsx(ft,{isDark:n,isVisible:c,children:h})]})},wt=o("app:pdf-exporter");class kt{printStyles=null;async exportToPDF(e={}){const{elementSelector:t='[data-testid="resume-content"]',filename:r="resume",removeElements:i=[".no-print",".print-hidden"],addPrintStyles:a=""}=e;try{wt("开始PDF导出",{elementSelector:t,filename:r}),this.addPrintStyles(t,i,a),this.showLoadingIndicator(),await this.waitForResources(),window.print(),this.cleanup(),wt("PDF导出完成")}catch(o){throw wt("PDF导出失败:",o),this.cleanup(),o}}addPrintStyles(e,t,r){const i=`\n      @media print {\n        /* 隐藏不需要的元素 */\n        ${t.join(", ")}, \n        .control-panel,\n        .tabs-container,\n        .development-notice,\n        .pdf-export-btn { \n          display: none !important; \n        }\n        \n        /* 只显示指定区域 */\n        body * { visibility: hidden; }\n        ${e}, ${e} * { visibility: visible; }\n        ${e} { \n          position: absolute !important; \n          left: 0 !important; \n          top: 0 !important; \n          width: 100% !important;\n          margin: 0 !important;\n          padding: 20px !important;\n          box-shadow: none !important;\n          border: none !important;\n        }\n        \n        /* 优化打印样式 */\n        * { \n          -webkit-print-color-adjust: exact !important;\n          color-adjust: exact !important;\n          print-color-adjust: exact !important;\n        }\n        \n        /* 分页控制 */\n        .page-break { page-break-before: always !important; }\n        .no-page-break { page-break-inside: avoid !important; }\n        \n        /* 字体和颜色优化 */\n        body {\n          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;\n          font-size: 12pt !important;\n          line-height: 1.4 !important;\n          color: #000 !important;\n          background: white !important;\n        }\n        \n        /* 标题样式 */\n        h1, h2, h3, h4, h5, h6 {\n          color: #333 !important;\n          page-break-after: avoid !important;\n        }\n        \n        /* 链接样式 */\n        a {\n          color: #0066cc !important;\n          text-decoration: underline !important;\n        }\n        \n        /* 图片优化 */\n        img {\n          max-width: 100% !important;\n          height: auto !important;\n          page-break-inside: avoid !important;\n        }\n        \n        /* 表格优化 */\n        table {\n          border-collapse: collapse !important;\n          width: 100% !important;\n        }\n        \n        table, th, td {\n          border: 1px solid #ddd !important;\n        }\n        \n        th, td {\n          padding: 8px !important;\n          text-align: left !important;\n        }\n        \n        /* 自定义样式 */\n        ${r}\n      }\n    `;this.printStyles=document.createElement("style"),this.printStyles.textContent=i,document.head.appendChild(this.printStyles),wt("打印样式已添加")}async waitForResources(){wt("等待资源加载...");const e=document.querySelectorAll("img"),t=Array.from(e).map(e=>e.complete?Promise.resolve():new Promise(t=>{e.onload=t,e.onerror=t,setTimeout(t,3e3)}));await Promise.all(t),document.fonts&&await document.fonts.ready,await this.waitForMermaidCharts(),await new Promise(e=>setTimeout(e,500)),wt("资源加载完成")}async waitForMermaidCharts(){const e=document.querySelectorAll(".mermaid, [data-mermaid]");0!==e.length&&(wt(`等待${e.length}个Mermaid图表渲染...`),await new Promise(e=>setTimeout(e,1e3)))}showLoadingIndicator(){const e=document.createElement("div");e.id="pdf-loading-indicator",e.innerHTML='\n      <div style="display: flex; align-items: center; gap: 10px;">\n        <div style="width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>\n        <span>正在准备PDF导出...</span>\n      </div>\n      <style>\n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n      </style>\n    ',e.style.cssText="\n      position: fixed; \n      top: 50%; \n      left: 50%; \n      transform: translate(-50%, -50%);\n      background: rgba(0,0,0,0.8); \n      color: white;\n      padding: 20px 30px; \n      border-radius: 8px;\n      z-index: 10000;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n      font-size: 14px;\n    ",document.body.appendChild(e),wt("加载提示已显示")}cleanup(){this.printStyles&&(document.head.removeChild(this.printStyles),this.printStyles=null);const e=document.getElementById("pdf-loading-indicator");e&&document.body.removeChild(e),wt("资源清理完成")}}const vt=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${e=>e.isDark?"#4a5568":"#3182ce"};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.isDark?"#2d3748":"#2c5282"};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: ${e=>e.isDark?"#2d3748":"#a0aec0"};
    cursor: not-allowed;
    transform: none;
  }
  
  .icon {
    font-size: 16px;
  }
`,yt=({targetSelector:t='[data-testid="resume-content"]',filename:r="resume",className:a="",children:o})=>{const[n,s]=i.useState(!1),{isDark:c}=be(),{t:l}=tt();return e.jsxs(vt,{onClick:async()=>{s(!0);try{const e=new kt;await e.exportToPDF({elementSelector:t,filename:r,removeElements:[".no-print",".pdf-export-btn",".control-panel",".tabs-container"],addPrintStyles:"\n          /* 简历特定样式优化 */\n          .resume-wrapper { \n            max-width: none !important; \n            box-shadow: none !important;\n            margin: 0 !important;\n          }\n          \n          /* 时间线组件优化 */\n          .timeline-item {\n            page-break-inside: avoid !important;\n          }\n          \n          /* 技能组件优化 */\n          .skill-item {\n            page-break-inside: avoid !important;\n          }\n          \n          /* 项目经验优化 */\n          .project-item {\n            page-break-inside: avoid !important;\n          }\n        "})}catch(e){alert(l.common.exportFailed||"PDF导出失败，请重试")}finally{s(!1)}},disabled:n,isDark:c,className:`pdf-export-btn ${a}`,title:l.common.exportPDF||"导出PDF",children:[e.jsx("span",{className:"icon",children:"📄"}),o||(n?l.common.exporting||"导出中...":l.common.exportPDF||"导出PDF")]})},Dt=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Ct=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`;const St=d.div.withConfig({shouldForwardProp:e=>"isCollapsed"!==e&&"isDark"!==e})`
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
`,jt=d.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Pt=d.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Et=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,$t=d.span.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  font-size: 14px;
  font-weight: 500;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
`,_t=({className:t,collapsible:r=!1,defaultCollapsed:i=!1})=>{const{isDark:o}=be(),{t:n}=tt(),s=((e=768)=>{const[t,r]=a.useState(()=>"undefined"==typeof window||window.innerWidth>e);return a.useEffect(()=>{let t;const i=()=>{clearTimeout(t),t=setTimeout(()=>{r(window.innerWidth>e)},100)};return window.addEventListener("resize",i),i(),()=>{window.removeEventListener("resize",i),clearTimeout(t)}},[e]),t})(768),c=a.useMemo(()=>!1!==i?i:!s,[s,i]),[l,d]=a.useState(c),[p,h]=a.useState(!1);a.useEffect(()=>{p||d(c)},[c,p]);return r?e.jsxs(St,{isCollapsed:l,isDark:o,className:t,"data-testid":"control-panel",children:[e.jsx(jt,{isDark:o,onClick:()=>{h(!0),d(!l)},title:n.common.controlPanel,"aria-label":n.common.controlPanel,children:l?"⚙️":"✕"}),!l&&e.jsxs(Pt,{isDark:o,children:[e.jsxs(Et,{children:[e.jsx($t,{isDark:o,children:n.common.theme}),e.jsx(xt,{showTooltip:!1})]}),e.jsx(Ct,{isDark:o}),e.jsxs(Et,{children:[e.jsx($t,{isDark:o,children:n.common.language}),e.jsx(dt,{})]}),e.jsx(Ct,{isDark:o}),e.jsxs(Et,{children:[e.jsx($t,{isDark:o,children:n.common.export||"导出"}),e.jsx(yt,{})]})]})]}):e.jsxs(Dt,{isDark:o,className:t,"data-testid":"control-panel",children:[e.jsx(xt,{}),e.jsx(Ct,{isDark:o}),e.jsx(dt,{}),e.jsx(Ct,{isDark:o}),e.jsx(yt,{})]})},Lt=()=>null,zt=new class{libraries=new Map;preloadPromises=new Map;constructor(){this.initializeLibraryStates()}initializeLibraryStates(){["mermaid","svgPanZoom","katex","cytoscape"].forEach(e=>{this.libraries.set(e,{loading:!1,loaded:!1,error:null,module:null})})}async startPreloading(){const e=M(),{preloadLibraries:t}=e.performance;O();const r=[];r.push(this.preloadMermaid()),r.push(this.preloadSvgPanZoom()),Promise.allSettled(r).then(e=>{O()&&(e.filter(e=>"fulfilled"===e.status).length,e.filter(e=>"rejected"===e.status).length)})}async preloadMermaid(){return this.preloadLibrary("mermaid",()=>n(()=>import("./mermaid-core-CxzdCigi.js").then(e=>e.b7),__vite__mapDeps([1,2,3]),import.meta.url))}async preloadSvgPanZoom(){return this.preloadLibrary("svgPanZoom",()=>n(()=>import("./utils-CEXnc-BX.js").then(e=>e.s),__vite__mapDeps([5,2]),import.meta.url))}async preloadKatex(){return this.preloadLibrary("katex",()=>n(()=>import("./katex-DuUXD-vJ.js"),[],import.meta.url))}async preloadCytoscape(){return this.preloadLibrary("cytoscape",()=>n(()=>import("./cytoscape-3nCDfVzk.js").then(e=>e.b),__vite__mapDeps([6,2]),import.meta.url))}async preloadLibrary(e,t){const r=this.libraries.get(e);if(!r||r.loaded||r.loading)return;if(this.preloadPromises.has(e))return this.preloadPromises.get(e);r.loading=!0,r.error=null,performance.now();const i=t().then(e=>(performance.now(),r.loaded=!0,r.loading=!1,r.module=e,O(),e)).catch(e=>{throw r.loading=!1,r.error=e.message,O(),e}).finally(()=>{this.preloadPromises.delete(e)});return this.preloadPromises.set(e,i),i}async getLibrary(e){const t=this.libraries.get(e);if(!t)throw new Error(`Unknown library: ${e}`);if(t.loaded&&t.module)return t.module;if(t.loading&&this.preloadPromises.has(e))return this.preloadPromises.get(e);switch(e){case"mermaid":return this.preloadMermaid();case"svgPanZoom":return this.preloadSvgPanZoom();case"katex":return this.preloadKatex();case"cytoscape":return this.preloadCytoscape();default:throw new Error(`Unknown library: ${e}`)}}getLibraryState(e){return this.libraries.get(e)||null}getAllLibraryStates(){return new Map(this.libraries)}cleanup(){this.libraries.clear(),this.preloadPromises.clear()}},It=o("app:analytics-config"),Tt={baidu:{enabled:!1,siteId:"",domain:"",autoTrack:!0,debug:!1},google:{enabled:!1,measurementId:"",debug:!1,customDimensions:{},customMetrics:{},useFirebase:!0,dynamicLoading:!0},elk:{enabled:!1,endpoint:"http://localhost:5000",batchSize:10,flushInterval:5e3,debug:!1},enablePerformanceMonitoring:!0,enableErrorTracking:!0,enableUserBehaviorTracking:!0};class Ft{static instance;config;constructor(){this.config=this.loadConfig()}static getInstance(){return Ft.instance||(Ft.instance=new Ft),Ft.instance}loadConfig(){const e={...Tt};e.baidu={enabled:!0,siteId:"",domain:"deden.web.app",autoTrack:!0,debug:!1},e.google={enabled:!1,measurementId:"G-7LG0G58765",debug:!1,customDimensions:{},customMetrics:{},useFirebase:!1,dynamicLoading:!0},e.elk={enabled:!1,endpoint:"http://localhost:5001",batchSize:parseInt("10"),flushInterval:parseInt("5000"),debug:!1};try{const t=localStorage.getItem("analytics_config");if(t){const r=JSON.parse(t);Object.assign(e,r)}}catch(t){It("Failed to load user analytics config: %O",t)}return e}getConfig(){return{...this.config}}getBaiduConfig(){return{...this.config.baidu}}getGoogleConfig(){return{...this.config.google}}getELKConfig(){return{...this.config.elk}}updateConfig(e){this.config={...this.config,...e};try{localStorage.setItem("analytics_config",JSON.stringify(this.config))}catch(t){It("Failed to save analytics config: %O",t)}}setBaiduEnabled(e){this.config.baidu.enabled=e,this.updateConfig({baidu:this.config.baidu})}setGoogleEnabled(e){this.config.google.enabled=e,this.updateConfig({google:this.config.google})}setELKEnabled(e){this.config.elk.enabled=e,this.updateConfig({elk:this.config.elk})}isAnyAnalyticsEnabled(){return this.config.baidu.enabled||this.config.google.enabled||this.config.elk.enabled}getConfigSummary(){return{baiduEnabled:this.config.baidu.enabled,googleEnabled:this.config.google.enabled,elkEnabled:this.config.elk.enabled,performanceMonitoring:this.config.enablePerformanceMonitoring,errorTracking:this.config.enableErrorTracking,userBehaviorTracking:this.config.enableUserBehaviorTracking}}}const Mt=Ft.getInstance();class Rt{static instance;isInitialized=!1;siteId="fd188b066e21a8e15d579e5f0b7633a9";constructor(){}static getInstance(){return Rt.instance||(Rt.instance=new Rt),Rt.instance}async initialize(){const e=Mt.getBaiduConfig();if(e.enabled&&!this.isInitialized)try{window._hmt=window._hmt||[];const t=document.createElement("script");t.src=`https://hm.baidu.com/hm.js?${this.siteId}`,t.async=!0;const r=document.getElementsByTagName("script")[0];r&&r.parentNode?r.parentNode.insertBefore(t,r):document.head.appendChild(t),this.isInitialized=!0,e.debug,e.autoTrack&&this.trackPageView()}catch(t){}}trackPageView(e,t){if(!this.isReady())return;const r=e||location.pathname+location.search;window._hmt.push(["_trackPageview",r]),Mt.getBaiduConfig().debug}trackEvent(e){if(!this.isReady())return;const{category:t,action:r,label:i,value:a}=e;if(!t||!r)return;const o=["_trackEvent",t,r];i&&o.push(i),void 0!==a&&o.push(a),window._hmt.push(o),Mt.getBaiduConfig().debug}trackSkillClick(e,t){this.trackEvent({category:"skill",action:"click",label:e,value:1})}trackProjectView(e,t){this.trackEvent({category:"project",action:"view",label:e,value:1})}trackContactClick(e){this.trackEvent({category:"contact",action:"click",label:e,value:1})}trackLanguageSwitch(e,t){this.trackEvent({category:"language",action:"switch",label:`${e}_to_${t}`,value:1})}trackThemeSwitch(e,t){this.trackEvent({category:"theme",action:"switch",label:`${e}_to_${t}`,value:1})}trackDownload(e,t){this.trackEvent({category:"download",action:"click",label:t||e,value:1})}trackError(e,t){this.trackEvent({category:"error",action:e,label:t,value:1})}setCustomVar(e,t,r,i=3){this.isReady()&&(e<1||e>5||(window._hmt.push(["_setCustomVar",e,t,r,i]),Mt.getBaiduConfig().debug))}isReady(){const e=Mt.getBaiduConfig();return this.isInitialized&&e.enabled?!!window._hmt:(e.debug,!1)}getStatus(){const e=Mt.getBaiduConfig();return{initialized:this.isInitialized,enabled:e.enabled,siteId:this.siteId.substring(0,8)+"..."}}}const Ot=Rt.getInstance();"undefined"!=typeof window&&setTimeout(()=>{Ot.initialize()},1e3);class Nt{static instance;firebaseSDK=null;analytics=null;app=null;isLoading=!1;isLoaded=!1;loadPromise=null;constructor(){}static getInstance(){return Nt.instance||(Nt.instance=new Nt),Nt.instance}async loadFirebaseSDK(){try{if("undefined"==typeof window)return null;if(this.firebaseSDK)return this.firebaseSDK;const e=document.createElement("script");e.type="module",e.innerHTML="\n        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';\n        import { \n          getAnalytics, \n          isSupported, \n          logEvent, \n          setUserProperties, \n          setUserId,\n          setCurrentScreen \n        } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';\n        \n        window.__firebaseSDK = {\n          initializeApp,\n          getAnalytics,\n          isSupported,\n          logEvent,\n          setUserProperties,\n          setUserId,\n          setCurrentScreen\n        };\n        \n        window.dispatchEvent(new CustomEvent('firebaseSDKLoaded'));\n      ";const t=new Promise(t=>{const r=()=>{window.removeEventListener("firebaseSDKLoaded",r);const e=window.__firebaseSDK;e?(this.firebaseSDK=e,t(e)):t(null)};window.addEventListener("firebaseSDKLoaded",r),e.addEventListener("error",()=>{t(null)}),setTimeout(()=>{window.removeEventListener("firebaseSDKLoaded",r),t(null)},1e4)});return document.head.appendChild(e),await t}catch(e){return null}}getFirebaseConfig(){const e=Mt.getGoogleConfig();if(!e.enabled)return null;const t={apiKey:"",authDomain:"",projectId:"",storageBucket:"",messagingSenderId:"",appId:"",measurementId:e.measurementId||"G-7LG0G58765"};return t.apiKey&&t.projectId&&t.measurementId?t:null}async initialize(){if(this.isLoading&&this.loadPromise)return await this.loadPromise;if(this.isLoaded&&this.analytics)return!0;this.isLoading=!0,this.loadPromise=this._doInitialize();const e=await this.loadPromise;return this.isLoading=!1,this.isLoaded=e,e}async _doInitialize(){try{const e=this.getFirebaseConfig();if(!e)return!1;const t=await this.loadFirebaseSDK();return!!t&&(!!(await t.isSupported())&&(this.app=t.initializeApp(e),this.analytics=t.getAnalytics(this.app),!0))}catch(e){return!1}}async logEvent(e,t){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.logEvent(this.analytics,e,t),Mt.getGoogleConfig().debug)}catch(r){}}async setUserProperties(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setUserProperties(this.analytics,e),Mt.getGoogleConfig().debug)}catch(t){}}async setUserId(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setUserId(this.analytics,e),Mt.getGoogleConfig().debug)}catch(t){}}async setCurrentScreen(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setCurrentScreen(this.analytics,e),Mt.getGoogleConfig().debug)}catch(t){}}getStatus(){const e=this.getFirebaseConfig();return{isLoaded:this.isLoaded,isLoading:this.isLoading,hasAnalytics:!!this.analytics,hasApp:!!this.app,configValid:!!e}}reset(){this.firebaseSDK=null,this.analytics=null,this.app=null,this.isLoading=!1,this.isLoaded=!1,this.loadPromise=null,"undefined"!=typeof window&&delete window.__firebaseSDK}}const At=Nt.getInstance();class Ut{static instance;isInitialized=!1;analytics=null;measurementId="";constructor(){}static getInstance(){return Ut.instance||(Ut.instance=new Ut),Ut.instance}async initialize(){const e=Mt.getGoogleConfig();if(e.enabled&&e.measurementId&&!this.isInitialized){this.measurementId=e.measurementId;try{if(await this.initializeWithFirebase())return this.isInitialized=!0,void e.debug;if(await this.initializeWithGtag())return this.isInitialized=!0,void e.debug;throw new Error("Failed to initialize with any method")}catch(t){}}}async initializeWithFirebase(){try{return!!(await At.initialize())&&(this.analytics={},!0)}catch(e){return!1}}async initializeWithGtag(){try{window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)},window.gtag("js",new Date),window.gtag("config",this.measurementId,{debug_mode:Mt.getGoogleConfig().debug});const e=document.createElement("script");return e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`,new Promise(t=>{e.onload=()=>t(!0),e.onerror=()=>t(!1),document.head.appendChild(e)})}catch(e){return!1}}trackPageView(e){if(!this.isReady())return;const t=Mt.getGoogleConfig(),r={page_title:e?.page_title||document.title,page_location:e?.page_location||window.location.href,page_path:e?.page_path||window.location.pathname,...e};try{this.analytics?import("firebase/analytics").then(({logEvent:e})=>{e(this.analytics,"page_view",r)}).catch(e=>{}):window.gtag&&window.gtag("event","page_view",r),t.debug}catch(i){}}trackEvent(e){if(!this.isReady())return;const t=Mt.getGoogleConfig(),{action:r,category:i,label:a,value:o,custom_parameters:n}=e;if(!r)return;const s={event_category:i||"engagement",event_label:a,value:o,...n};Object.keys(s).forEach(e=>{void 0===s[e]&&delete s[e]});try{this.analytics?At.logEvent(r,s).catch(e=>{}):window.gtag&&window.gtag("event",r,s),t.debug}catch(c){}}trackSkillClick(e,t){this.trackEvent({action:"skill_click",category:"user_interaction",label:e,custom_parameters:{skill_category:t,interaction_type:"click"}})}trackProjectView(e,t){this.trackEvent({action:"project_view",category:"content",label:e,custom_parameters:{project_type:t,content_type:"project"}})}trackContactClick(e,t){this.trackEvent({action:"contact_click",category:"user_interaction",label:e,custom_parameters:{contact_method:e,contact_value:t}})}trackLanguageSwitch(e,t){this.trackEvent({action:"language_change",category:"user_preference",label:`${e}_to_${t}`,custom_parameters:{previous_language:e,new_language:t}})}trackThemeSwitch(e,t){this.trackEvent({action:"theme_change",category:"user_preference",label:`${e}_to_${t}`,custom_parameters:{previous_theme:e,new_theme:t}})}trackDownload(e,t){this.trackEvent({action:"file_download",category:"engagement",label:t||e,custom_parameters:{file_type:e,file_name:t}})}trackError(e,t,r=!1){this.trackEvent({action:"exception",category:"error",label:e,custom_parameters:{description:t,fatal:r}})}setUserProperty(e,t){if(!this.isReady())return;const r=Mt.getGoogleConfig();try{this.analytics?At.setUserProperties({[e]:t}).catch(e=>{}):window.gtag&&window.gtag("config",this.measurementId,{user_properties:{[e]:t}}),r.debug}catch(i){}}isReady(){const e=Mt.getGoogleConfig();return this.isInitialized&&e.enabled?!(!this.analytics&&!window.gtag):(e.debug,!1)}getStatus(){const e=Mt.getGoogleConfig();let t="none";this.analytics?t="firebase":window.gtag&&(t="gtag");const r={initialized:this.isInitialized,enabled:e.enabled,measurementId:this.measurementId.substring(0,8)+"...",method:t};return"firebase"===t&&(r.firebaseLoader=At.getStatus()),r}}const Bt=Ut.getInstance(),Wt=o("app:elk");class Kt{static instance;eventQueue=[];flushTimer=null;sessionId;constructor(){this.sessionId=this.generateSessionId(),this.setupAutoFlush(),this.setupPageUnloadHandler()}static getInstance(){return Kt.instance||(Kt.instance=new Kt),Kt.instance}generateSessionId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}setupAutoFlush(){const e=Mt.getELKConfig();e.enabled&&(this.flushTimer=setInterval(()=>{this.flushEvents()},e.flushInterval||5e3))}setupPageUnloadHandler(){window.addEventListener("beforeunload",()=>{this.flushEvents(!0)})}createBaseEvent(e,t){return{timestamp:(new Date).toISOString(),event_type:e,page:window.location.pathname,source:"flexiresume",user_agent:navigator.userAgent,referrer:document.referrer,data:{session_id:this.sessionId,...t}}}addEvent(e){const t=Mt.getELKConfig();t.enabled?(this.eventQueue.push(e),this.eventQueue.length>=(t.batchSize||10)&&this.flushEvents(),t.debug&&Wt("Event added to queue: %O",e)):t.debug&&Wt("Disabled, event not added: %O",e)}async flushEvents(e=!1){const t=Mt.getELKConfig();if(!t.enabled||0===this.eventQueue.length)return;const r=[...this.eventQueue];this.eventQueue=[];try{const i={events:r,source:"flexiresume",timestamp:(new Date).toISOString()};if(e&&navigator.sendBeacon)navigator.sendBeacon(t.endpoint,JSON.stringify(i));else{const e=await fetch(t.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});e.ok?t.debug&&Wt("Events sent successfully: %d",r.length):(Wt("Failed to send events: %s",e.statusText),r.length<(t.batchSize||10)&&this.eventQueue.unshift(...r))}}catch(i){Wt("Error sending events: %O",i),r.length<(t.batchSize||10)&&this.eventQueue.unshift(...r)}}trackPageView(e,t){const r=this.createBaseEvent("page_view",{title:e||document.title,url:t||window.location.href,timestamp:Date.now()});this.addEvent(r)}trackUserInteraction(e,t,r,i){const a=this.createBaseEvent("user_interaction",{action:e,element:t,element_text:r,value:i,timestamp:Date.now()});this.addEvent(a)}trackPerformance(e,t,r,i){const a=this.createBaseEvent("performance",{metric_name:e,metric_value:t,metric_unit:r,additional_data:i,timestamp:Date.now()});this.addEvent(a)}trackError(e,t,r,i,a="medium"){const o=this.createBaseEvent("error",{error_type:e,error_message:t,error_stack:r,component:i,severity:a,timestamp:Date.now()});this.addEvent(o)}trackSkillClick(e,t){this.trackUserInteraction("skill_click","skill_tag",e,t)}trackProjectView(e,t){this.trackUserInteraction("project_view","project_card",e,t)}trackContactClick(e,t){this.trackUserInteraction("contact_click","contact_info",e,t)}trackLanguageSwitch(e,t){this.trackUserInteraction("language_switch","language_toggle",`${e}_to_${t}`)}trackThemeSwitch(e,t){this.trackUserInteraction("theme_switch","theme_toggle",`${e}_to_${t}`)}trackDownload(e,t){this.trackUserInteraction("download","download_button",e,t)}getStatus(){const e=Mt.getELKConfig();return{enabled:e.enabled,sessionId:this.sessionId,queueSize:this.eventQueue.length,endpoint:e.endpoint}}setEnabled(e){Mt.setELKEnabled(e),e?this.setupAutoFlush():(this.flushTimer&&(clearInterval(this.flushTimer),this.flushTimer=null),this.eventQueue=[])}}const Vt=Kt.getInstance();"undefined"!=typeof window&&(window.addEventListener("load",()=>{const e=performance.getEntriesByType("navigation")[0];e&&(Vt.trackPerformance("page_load_time",e.loadEventEnd-e.loadEventStart,"ms"),Vt.trackPerformance("dom_content_loaded",e.domContentLoadedEventEnd-e.domContentLoadedEventStart,"ms"),Vt.trackPerformance("first_contentful_paint",performance.getEntriesByType("paint")[1]?.startTime||0,"ms"))}),window.addEventListener("error",e=>{Vt.trackError("javascript_error",e.message,e.error?.stack,void 0,"high")}),window.addEventListener("unhandledrejection",e=>{Vt.trackError("unhandled_promise_rejection",e.reason?.message||"Unhandled promise rejection",e.reason?.stack,void 0,"high")}));const Gt=o("app:main"),Ht=i.lazy(()=>n(()=>import("./FlexiResume-C8UDSOWL.js"),__vite__mapDeps([7,8,2,9,1,3,10,5,11]),import.meta.url)),Yt=()=>{const[t,r]=i.useState(null),[a,o]=i.useState([]),[n,s]=i.useState([]),[c,l]=i.useState("/"),[d,p]=i.useState(!0),[h,u]=i.useState("checking"),x=async()=>{try{u("checking");const e=M(),t=[];e.cdn.enabled&&e.cdn.healthCheck.enabled&&(Gt("Initializing CDN health check..."),t.push(V.initialize())),Gt("Starting library preloading..."),t.push(zt.startPreloading()),await Promise.allSettled(t),e.performance.enablePreloading&&e.performance.preloadResources.length>0&&V.preloadResources(e.performance.preloadResources).catch(e=>{Gt("Resource preloading failed: %O",e)}),u("ready")}catch(e){Gt("CDN initialization failed: %O",e),u("error")}},w=async()=>{try{p(!0);const e=await _();r(e),await(async()=>{try{Y=await _()}catch(e){G("Failed to update data cache: %O",e)}})();const t=(e=>Object.keys(e.expected_positions).filter(t=>!e.expected_positions[t].hidden).map(t=>[e.expected_positions[t].header_info?.position,"/"+t,!!e.expected_positions[t].is_home_page,!!e.expected_positions[t].is_home_page]))(e),i=(e=>Object.keys(e.expected_positions).map(t=>({key:t,title:e.expected_positions[t].header_info?.position||t,path:"/"+t,isHomePage:!!e.expected_positions[t].is_home_page,hidden:!!e.expected_positions[t].hidden})))(e);o(t),s(i),l((e=>e.find(([,,e])=>e)?.[1]||"/")(t)),v.tabs=t}catch(e){Gt("Failed to load language data: %O",e)}finally{p(!1)}},k=async()=>{try{Gt("Initializing analytics..."),await Ot.initialize(),await Bt.initialize();const e=Ot.getStatus(),t=Bt.getStatus(),r=Vt.getStatus();Gt("Analytics status: %O",{baidu:e,google:t,elk:r,config:Mt.getConfigSummary()}),Vt.trackPageView("App Initialized",window.location.href)}catch(e){Gt("Analytics initialization failed: %O",e)}};return i.useEffect(()=>{var e;return(async()=>{await Promise.all([x(),w(),k()])})(),e=()=>{w()},j.push(e),()=>{const t=j.indexOf(e);t>-1&&j.splice(t,1)}},[]),function(){const e=()=>{document.querySelectorAll(".lazy-video").forEach(e=>{const t=e.getBoundingClientRect();t.top<window.innerHeight+200&&t.bottom>0&&(e=>{const t=JSON.parse(e.dataset.sources),r=R().baseUrls.slice(0,3);let i="";r.forEach((e,r)=>{const a=t.original.startsWith("/")?`${e.endsWith("/")?e.slice(0,-1):e}${t.original}`:`${e.endsWith("/")?e:e+"/"}${t.original}`;i+=`<source src="${a}" type="video/mp4">\n        `});let a=t.original;try{a=V.getResourceUrl(t.original,{enableFallback:!0,localBasePath:"",cacheUrls:!1})}catch(n){H("Failed to build local fallback URL: %O",n)}i+=`<source src="${t.original}" type="video/mp4">`,e.innerHTML=i,e.classList.remove("lazy-video"),e.removeAttribute("data-sources");const o=e.parentNode.querySelector(".loading-indicator");o?.remove()})(e)})};let t;window.addEventListener("scroll",()=>{t&&clearTimeout(t),t=setTimeout(e,100)}),window.addEventListener("resize",e),window.addEventListener("mouseup",()=>setTimeout(e,0)),e()}(),d||!t?e.jsx(fe,{children:e.jsx(et,{children:e.jsxs(We,{level:"page",maxRetries:3,children:[e.jsx(se,{}),e.jsx(_t,{collapsible:!0}),e.jsxs("div",{style:{position:"fixed",top:"20px",right:"20px",background:"rgba(0,0,0,0.8)",color:"white",padding:"8px 12px",borderRadius:"4px",fontSize:"12px",zIndex:9999},children:["checking"===h&&"🔄 检测CDN...","ready"===h&&"✅ CDN就绪","error"===h&&"⚠️ CDN检测失败"]}),e.jsx(Qe,{})]})})}):e.jsx(fe,{children:e.jsx(et,{children:e.jsx(We,{level:"page",maxRetries:3,children:e.jsxs($e,{children:[e.jsx(se,{}),e.jsx(Lt,{}),e.jsx(_t,{collapsible:!0}),e.jsxs(m,{basename:t.header_info.route_base_name,children:[e.jsx(ye,{})," ",e.jsxs(g,{children:[n.map((t,r)=>e.jsx(f,{path:t.path,element:e.jsx(We,{level:"section",maxRetries:2,children:e.jsx(i.Suspense,{fallback:e.jsx(Qe,{}),children:e.jsx(Ht,{path:t.path})})})},r)),n.map((t,r)=>{const i=t.path+".html";return e.jsx(f,{path:i,element:e.jsx(b,{to:t.path,replace:!0})},`html-${r}`)}),e.jsx(f,{path:"/",element:e.jsx(b,{to:c})})]})]})]})})})})};w(document.getElementById("root")).render(e.jsx(i.StrictMode,{children:e.jsx(Yt,{})}));export{Qe as S,re as a,zt as b,w as c,ae as d,ie as e,v as f,Q as g,de as h,ue as i,ee as j,pe as k,Z as l,he as m,oe as r,be as u,te as w};
