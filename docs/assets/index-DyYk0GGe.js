const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Data-CjW8UmWR.js","./mermaid-core-C92S_ibe.js","./react-vendor-DQmNySUk.js","./d3-charts-C9eKmPJg.js","./Data-BSUBg5dp.js","./utils-CEXnc-BX.js","./cytoscape-BKktfreJ.js","./FlexiResume-CQJYq4EW.js","./framer-motion-CXdLbqfN.js","./vendor-DtYx8k6V.js","./react-icons-mdDy3BM0.js","./react-markdown-bO4N7J-8.js"])))=>i.map(i=>d[i]);
import{j as e,m as t}from"./framer-motion-CXdLbqfN.js";import{b as i,r as a,R as r}from"./react-vendor-DQmNySUk.js";import{aJ as n,_ as o}from"./mermaid-core-C92S_ibe.js";import{m as s,r as l,l as c,a as d,f as m,d as p,u as h,b as u,N as g,B as f,R as b,c as x,e as y}from"./vendor-DtYx8k6V.js";import{G as w}from"./react-icons-mdDy3BM0.js";import"./d3-charts-C9eKmPJg.js";var v;!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const i of e)if("childList"===i.type)for(const e of i.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)}).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var k=i;v=k.createRoot,k.hydrateRoot;const C=new class{data={};tabs=[];skillMap=[];skills=[];collapsedMap=new Map;constructor(){s(this);const e=this.collapsedMap.set;this.collapsedMap.set=function(t,i){se("Store",i,t),e.call(this,t,i)}}};function S(e){return n("app:"+e)}const D=S("dataloader"),F="zh";let j=F;const E=new Map,L=[],P=()=>j,$=e=>{j!==e&&(j=e,L.forEach(t=>t(e)))},z=async e=>{if(E.has(e))return E.get(e);try{let t;if("zh"===e)t=await o(()=>import("./Data-CjW8UmWR.js").then(e=>e.D),__vite__mapDeps([0,1,2,3]),import.meta.url);else{if("en"!==e)throw new Error(`Unsupported language: ${e}`);t=await o(()=>import("./Data-BSUBg5dp.js"),__vite__mapDeps([4,1,2,3]),import.meta.url)}const i=t.default;return E.set(e,i),i}catch(t){if(D(`Failed to load data for language: ${e}`,t),e!==F)return D(`Falling back to default language: ${F}`),z(F);throw t}},I=async()=>z(j),T=()=>{const e=navigator.language.toLowerCase();return e.startsWith("zh")?"zh":e.startsWith("en")?"en":F};(()=>{try{const e=localStorage.getItem("flexiresume-language");j=!e||"zh"!==e&&"en"!==e?T():e}catch(e){D("Failed to read language preference from localStorage",e),j=T()}})();const M=(e,t)=>e?e.split(",").map(e=>e.trim()).filter(Boolean):t,N=(e,t)=>e?"true"===e.toLowerCase():t,A=(e,t)=>{if(!e)return t;const i=parseInt(e,10);return isNaN(i)?t:i},_={cdn:{enabled:N("true",!0),baseUrls:M("https://deden.synology.me:8080/,https://flexiresume-static.web.app/,https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/,https://dedenlabs.github.io/flexiresume-static/",["https://flexiresume-static.web.app/","https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/","https://dedenlabs.github.io/flexiresume-static/"]),healthCheck:{timeout:A("5000",5e3),testPath:"favicon.ico",enabled:!0},sortingStrategy:{mode:"speed",enabled:!0,speedWeight:.7,availabilityWeight:.3},localOptimization:{enabled:!0,forceLocal:!1,localBasePath:""}},api:{baseUrl:"",timeout:A("10000",1e4),version:"v1"},theme:{defaultTheme:"auto",enableTransitions:N("true",!0),transitionDuration:A("300",300)},performance:{enableLazyLoading:N("true",!0),lazyLoadingThreshold:A("100",100),enablePreloading:N("true",!0),preloadResources:M("/images/avatar.webp,/images/flexi-resume.jpg",["/images/avatar.webp","/images/background.webp"]),preloadLibraries:{mermaid:!0,svgPanZoom:!0,katex:!1,cytoscape:!1}},app:{name:"FlexiResume",version:"1.0.1",buildTime:(new Date).toISOString(),isDevelopment:!1},debug:{enabled:N("false",!1),showPerformanceMonitor:!1,verboseLogging:!1},tabs:{labelFormat:"{name}",labelSeparator:" / "}},R=()=>_,O=()=>_.cdn,B=()=>_.debug.enabled,U=S("CDNHealthChecker");class G{static instance;healthResults=new Map;isChecking=!1;checkPromise=null;constructor(){}static getInstance(){return G.instance||(G.instance=new G),G.instance}async checkSingleCDN(e,t,i){const a=Date.now(),r=a;try{const l=e.endsWith("/")?`${e}${t}`:`${e}/${t}`;B()&&U(`[CDN Health Check] Testing: ${l}`);try{const t=await this.checkCDNWithImage(e,l,i,a,r);if(t.available)return t}catch(n){B()&&U(`[CDN Health Check] Image method failed for ${e}, trying fetch...`)}try{const t=await this.checkCDNWithFetch(e,l,i,a,r,"HEAD");if(t.available)return t}catch(o){B()&&U(`[CDN Health Check] HEAD method failed for ${e}, trying GET...`)}try{return await this.checkCDNWithFetch(e,l,i,a,r,"GET")}catch(s){throw s}}catch(l){const t=Date.now()-a,i=l instanceof Error?l.message:"Unknown error";return B()&&U.extend("warn")(`[CDN Health Check] ${e}: FAILED - ${i} (${t}ms)`),{url:e,available:!1,responseTime:t,error:i,timestamp:r}}}async checkCDNWithImage(e,t,i,a,r){return new Promise((n,o)=>{const s=new Image;let l=!1;const c=setTimeout(()=>{l||(l=!0,o(new Error("Image load timeout")))},i);s.onload=()=>{if(!l){l=!0,clearTimeout(c);const t=Date.now()-a;B()&&U(`[CDN Health Check] ${e}: OK via image (${t}ms)`),n({url:e,available:!0,responseTime:t,timestamp:r})}},s.onerror=()=>{l||(l=!0,clearTimeout(c),o(new Error(`Image load failed: ${t}`)))};const d=`?_t=${Date.now()}&_r=${Math.random()}`;s.src=t+d})}async checkCDNWithFetch(e,t,i,a,r,n="HEAD"){const o=new AbortController,s=setTimeout(()=>o.abort(),i);try{const i=await fetch(t,{method:n,signal:o.signal,cache:"no-cache",mode:"cors"});clearTimeout(s);const l=Date.now()-a,c={url:e,available:i.ok,responseTime:l,timestamp:r};return i.ok||(c.error=`HTTP ${i.status}: ${i.statusText}`),B()&&U(`[CDN Health Check] ${e}: ${i.ok?"OK":"FAILED"} via ${n} (${l}ms)`),c}catch(l){throw clearTimeout(s),l}}async checkAllCDNs(e={}){if(this.isChecking&&this.checkPromise)return this.checkPromise;this.isChecking=!0;const t=O(),{timeout:i=t.healthCheck.timeout,testPath:a=t.healthCheck.testPath,concurrent:r=!0,maxConcurrency:n=3}=e;B()&&U(`[CDN Health Check] Starting health check for ${t.baseUrls.length} CDNs`),this.checkPromise=this.performHealthCheck(t.baseUrls,a,i,r,n);try{const e=await this.checkPromise;return e.forEach(e=>{this.healthResults.set(e.url,e)}),this.reorderCDNUrls(e),B()&&U("[CDN Health Check] Health check completed:",e),e}finally{this.isChecking=!1,this.checkPromise=null}}async performHealthCheck(e,t,i,a,r){if(a){const a=[];for(let n=0;n<e.length;n+=r){const o=e.slice(n,n+r).map(e=>this.checkSingleCDN(e,t,i)),s=await Promise.all(o);a.push(...s)}return a}{const a=[];for(const r of e){const e=await this.checkSingleCDN(r,t,i);a.push(e)}return a}}reorderCDNUrls(e){const t=O().sortingStrategy;if(!t.enabled)return void(B()&&U("[CDN Health Check] Sorting strategy disabled, keeping original order"));let i;if("availability"===t.mode){const t=e.filter(e=>e.available).sort((e,t)=>e.responseTime-t.responseTime),a=e.filter(e=>!e.available);i=[...t.map(e=>e.url),...a.map(e=>e.url)],B()&&(U("[CDN Health Check] Using availability-first strategy"),U("[CDN Health Check] Available CDNs:",t.length),U("[CDN Health Check] Unavailable CDNs:",a.length))}else{if("speed"!==t.mode)return void U.extend("warn")("[CDN Health Check] Unknown sorting strategy:",t.mode);{const a=e.filter(e=>e.available).sort((e,i)=>{const a=1/e.responseTime*t.speedWeight+(e.available?1:0)*t.availabilityWeight;return 1/i.responseTime*t.speedWeight+(i.available?1:0)*t.availabilityWeight-a}),r=e.filter(e=>!e.available);i=[...a.map(e=>e.url),...r.map(e=>e.url)],B()&&(U("[CDN Health Check] Using speed-first strategy"),U("[CDN Health Check] Speed weight:",t.speedWeight),U("[CDN Health Check] Availability weight:",t.availabilityWeight),U("[CDN Health Check] Sorted by performance:",a.map(e=>`${e.url} (${e.responseTime}ms)`)))}}var a;a={baseUrls:i},Object.assign(_.cdn,a),B()&&U("[CDN Health Check] CDN URLs reordered:",i)}getHealthResults(){return Array.from(this.healthResults.values())}getAvailableCDNs(){return Array.from(this.healthResults.values()).filter(e=>e.available).sort((e,t)=>e.responseTime-t.responseTime).map(e=>e.url)}isCDNAvailable(e){const t=this.healthResults.get(e);return!!t&&t.available}clearCache(){this.healthResults.clear()}getBestCDN(){const e=this.getAvailableCDNs();return e.length>0?e[0]:null}getAllResults(){return Array.from(this.healthResults.values())}}const H=G.getInstance(),K=S("cdn");let V=null;function W(){if(null!==V)return V;const e=O();if(!e.localOptimization.enabled)return V=!1,!1;if(e.localOptimization.forceLocal)return V=!0,!0;if(e.localOptimization.customDetection)try{const t=e.localOptimization.customDetection();return V=t,t}catch(l){K("Custom detection function failed: %O",l)}if("undefined"==typeof window)return V=!1,!1;const{hostname:t,port:i}=window.location,a="localhost"===t||"127.0.0.1"===t||"0.0.0.0"===t||t.endsWith(".local"),r=parseInt(i,10),n=i&&(r>=3e3&&r<4e3||r>=4e3&&r<5e3||r>=5e3&&r<6e3||r>=8e3&&r<9e3||r>=9e3&&r<1e4);let o=!1;const s=a&&(n||o);return V=s,K("Local development detection: %s %O",s,{hostname:t,port:i,isLocalHost:a,isDevelopmentPort:n,isDevEnvironment:o,configEnabled:e.localOptimization.enabled,forceLocal:e.localOptimization.forceLocal}),s}class Z{static instance;urlCache=new Map;isInitialized=!1;initPromise=null;constructor(){}static getInstance(){return Z.instance||(Z.instance=new Z),Z.instance}async initialize(){if(!this.isInitialized){if(this.initPromise)return this.initPromise;this.initPromise=this.performInitialization(),await this.initPromise}}async performInitialization(){const e=O();if(!e.enabled)return K("CDN is disabled, skipping health check"),void(this.isInitialized=!0);if(W())return K("Local development environment detected, skipping CDN health check and using local resources"),void(this.isInitialized=!0);if(!e.healthCheck.enabled)return B()&&K("[CDN Manager] CDN health check is disabled"),void(this.isInitialized=!0);try{if(B()&&K("[CDN Manager] Starting CDN health check..."),await H.checkAllCDNs(),B()){const e=H.getAvailableCDNs();K(`[CDN Manager] CDN health check completed. Available CDNs: ${e.length}`)}}catch(t){K.extend("error")("[CDN Manager] CDN health check failed:",t)}finally{this.isInitialized=!0,this.initPromise=null}}getResourceUrl(e,t={}){const{enableFallback:i=!0,localBasePath:a="",cacheUrls:r=!0}=t;if(r&&this.urlCache.has(e))return this.urlCache.get(e);const n=O();if(W()){const t=this.buildLocalUrl(e,a);return r&&this.urlCache.set(e,t),B()&&K(`[CDN Manager] Local development: using local resource: ${t}`),t}if(!n.enabled){const t=this.buildLocalUrl(e,a);return r&&this.urlCache.set(e,t),t}const o=H.getBestCDN();if(o){const t=this.buildCDNUrl(o,e);return r&&this.urlCache.set(e,t),t}if(H.getAllResults().length===n.baseUrls.length){if(i){const t=this.buildLocalUrl(e,a);return B()&&K.extend("warn")(`[CDN Manager] All CDNs failed health check, falling back to local: ${t}`),r&&this.urlCache.set(e,t),t}}else if(n.baseUrls.length>0){const t=n.baseUrls[0],i=this.buildCDNUrl(t,e);return B()&&K.extend("warn")(`[CDN Manager] Health check in progress, using first CDN: ${t}`),i}if(i){const t=this.buildLocalUrl(e,a);return B()&&K.extend("warn")(`[CDN Manager] No CDN available, falling back to local: ${t}`),r&&this.urlCache.set(e,t),t}throw new Error(`[CDN Manager] No CDN available and fallback is disabled for resource: ${e}`)}buildCDNUrl(e,t){return`${e.endsWith("/")?e.slice(0,-1):e}/${t.startsWith("/")?t.slice(1):t}`}projectBasePathCache=null;getProjectBasePath(){if(null!==this.projectBasePathCache)return this.projectBasePathCache;try{const e=window.location.href,t=new URL(e),i=t.origin,a=t.pathname.split("/").slice(0,-1);return this.projectBasePathCache=i+a.join("/")+"/",this.projectBasePathCache}catch(e){K.extend("error")("获取项目根路径失败:",e);const t=window.location.origin+"/";return this.projectBasePathCache=t,t}}buildLocalUrl(e,t){return(this.getProjectBasePath()||t)+e}resetPathCache(){this.projectBasePathCache=null}async preloadResources(e,t={}){const i=e.map(async e=>{try{const i=this.getResourceUrl(e,t),a=document.createElement("link");a.rel="preload",a.href=i;const r=e.split(".").pop()?.toLowerCase();switch(r){case"jpg":case"jpeg":case"png":case"webp":case"svg":a.as="image";break;case"css":a.as="style";break;case"js":a.as="script";break;case"woff":case"woff2":a.as="font",a.crossOrigin="anonymous";break;default:a.as="fetch",a.crossOrigin="anonymous"}document.head.appendChild(a),B()&&K(`[CDN Manager] Preloaded resource: ${i}`)}catch(i){K.extend("error")(`[CDN Manager] Failed to preload resource: ${e}`,i)}});await Promise.allSettled(i)}getCDNHealthStatus(){return H.getHealthResults()}async refreshCDNHealth(){return H.clearCache(),this.clearUrlCache(),await H.checkAllCDNs()}clearUrlCache(){this.urlCache.clear()}isReady(){return this.isInitialized}getCacheStats(){return{size:this.urlCache.size,keys:Array.from(this.urlCache.keys())}}}const Y=Z.getInstance(),X=S("MemoryManager");class q{cache=new Map;config;cleanupTimer;memoryUsage=0;constructor(e={}){this.config={maxSize:50,maxAge:18e5,maxMemory:52428800,cleanupInterval:3e5,...e},this.startCleanup()}set(e,t){const i=this.estimateSize(t),a={data:t,timestamp:Date.now(),accessCount:0,lastAccessed:Date.now(),size:i};this.ensureSpace(i),this.cache.set(e,a),this.memoryUsage+=i,X(`📦 [Cache] 设置缓存: ${e}, 大小: ${(i/1024).toFixed(2)}KB, 总内存: ${(this.memoryUsage/1024/1024).toFixed(2)}MB`)}get(e){const t=this.cache.get(e);if(t){if(!this.isExpired(t))return t.accessCount++,t.lastAccessed=Date.now(),X(`📦 [Cache] 命中缓存: ${e}, 访问次数: ${t.accessCount}`),t.data;this.delete(e)}}delete(e){const t=this.cache.get(e);return t&&(this.memoryUsage-=t.size||0,X(`🗑️ [Cache] 删除缓存: ${e}`)),this.cache.delete(e)}has(e){const t=this.cache.get(e);return!(!t||this.isExpired(t)&&(this.delete(e),1))}clear(){this.cache.clear(),this.memoryUsage=0,X("🧹 [Cache] 清空所有缓存")}getStats(){const e=Array.from(this.cache.values());return{size:this.cache.size,memoryUsage:this.memoryUsage,memoryUsageMB:this.memoryUsage/1024/1024,averageAccessCount:e.reduce((e,t)=>e+t.accessCount,0)/e.length||0,oldestItem:Math.min(...e.map(e=>e.timestamp)),newestItem:Math.max(...e.map(e=>e.timestamp))}}estimateSize(e){try{return 2*JSON.stringify(e).length}catch{return 1024}}isExpired(e){return Date.now()-e.timestamp>this.config.maxAge}ensureSpace(e){for(;this.cache.size>=this.config.maxSize;)this.evictLeastUsed();for(;this.memoryUsage+e>this.config.maxMemory;)this.evictLeastUsed()}evictLeastUsed(){if(0===this.cache.size)return;let e="",t=1/0;for(const[i,a]of this.cache.entries()){const r=Date.now()-a.lastAccessed,n=a.accessCount/(r+1);n<t&&(t=n,e=i)}e&&(this.delete(e),X(`🚮 [Cache] 驱逐最少使用项: ${e}`))}cleanup(){this.cache.size,this.memoryUsage;for(const[e,t]of this.cache.entries())this.isExpired(t)&&this.delete(e);this.cache.size,this.memoryUsage}startCleanup(){this.cleanupTimer=setInterval(()=>{this.cleanup()},this.config.cleanupInterval)}destroy(){this.cleanupTimer&&clearInterval(this.cleanupTimer),this.clear()}}const J=new q({maxSize:1e3,maxAge:18e5,maxMemory:104857600,cleanupInterval:3e5}),Q=new q({maxSize:1e3,maxAge:6e5,maxMemory:52428800,cleanupInterval:12e4});class ee{static instance;monitorInterval;static getInstance(){return ee.instance||(ee.instance=new ee),ee.instance}startMonitoring(e=3e4){this.monitorInterval=setInterval(()=>{this.logMemoryUsage()},e)}stopMonitoring(){this.monitorInterval&&clearInterval(this.monitorInterval)}logMemoryUsage(){try{const e=performance.memory;if(e){const t=e.usedJSHeapSize/1024/1024,i=e.totalJSHeapSize/1024/1024,a=e.jsHeapSizeLimit/1024/1024;X(`🧠 [Memory] 使用: ${t.toFixed(2)}MB / ${i.toFixed(2)}MB (限制: ${a.toFixed(2)}MB)`);const r=J.getStats(),n=Q.getStats();X(`📦 [Cache] 全局缓存: ${r.size}项, ${r.memoryUsageMB.toFixed(2)}MB`),X(`📄 [Cache] 页面缓存: ${n.size}项, ${n.memoryUsageMB.toFixed(2)}MB`),t>.8*a&&(X.extend("warn")(`⚠️ [Memory] 内存使用率过高: ${(t/a*100).toFixed(1)}%`),this.triggerCleanup())}}catch(e){X.extend("error")("内存监控失败:",e)}}triggerCleanup(){J.clear(),Q.clear();try{window.gc&&window.gc()}catch(e){X("ℹ️ [Memory] 垃圾回收不可用")}}}const te=ee.getInstance(),ie=S("cache"),ae=S("cdn");S("tools");let re=null,ne=!1,oe=null;(async()=>{ne||re||(ne=!0,oe=(async()=>{try{re=await I(),ie("Data cache initialized successfully")}catch(e){ie("Failed to initialize data cache: %O",e)}finally{ne=!1}})())})();const se=S("折叠");function le(e,...t){return t.forEach(t=>{Object.keys(t).forEach(i=>{const a=e[i],r=t[i];Array.isArray(a)&&Array.isArray(r)?e[i]=Array.from(new Set([...a,...r])):e[i]="object"==typeof a&&"object"==typeof r?le({...a},r):r})}),e}async function ce(e){const t=`preload-finished-${e}`;if(J.has(t))return void de(J.get(t));C.collapsedMap.clear();const i=await I(),[a,r]=await Promise.all([i.loadPositionData(e),i.loadSkillsData()]),n=le({},a,i.expected_positions[e]),o=le({},i,n,{skill_level:r});de(o),J.set(t,o)}function de(e){C.data=e;const t=(e?.skill_level?.list||[]).sort((e,t)=>e.length-t.length);C.skills=t;const i={};t.forEach(([e,t])=>{i[e.toLocaleLowerCase()]=[e,t]}),C.skillMap=i}function me(e){const[t,i]=a.useState(Math.min(e,document.body.getBoundingClientRect().width));return a.useEffect(()=>{const t=()=>{i(Math.min(e,document.body.getBoundingClientRect().width))};return window.addEventListener("resize",t),()=>{window.removeEventListener("resize",t)}},[]),t}function pe(e,t){return e.replace(/\$\{([\w.]+)\}/g,(e,i)=>{const a=i.split(".");let r=t;for(const t of a)if(r=r?r[t]:void 0,void 0===r)return e;return r})}function he(e,t){const i=new Date,a=i.getFullYear(),r=i.getMonth()+1;function n(e){if(!/\d/.test(e))return[a,r];const t=[".","/","-"];let i,n;for(const a of t)if(e.includes(a)){const t=e.split(a).map(e=>{const t=e.match(/\d+/);return t?Number(t[0]):0});[i,n]=t;break}if(!i||!n){const t=e.match(/\d+/g);if(t&&t.length>=2)[i,n]=t.map(Number);else{if(!t||1!==t.length)return[a,r];i=Number(t[0]),n=1}}return i=i||a,n=n||1,[i,n]}const[o,s]=n(e),[l,c]=n(t);let d=l-o,m=c-s;m<0&&(d-=1,m+=12);let p="";return d>0&&(p+=`${d}年`),m>0&&(p+=`${m}个月`),p||"0个月"}function ue(e,t){const[i,r]=a.useState({}),n=e=>{const i={};for(let a=0;a<t;a++)i[a]=e;setTimeout(()=>r(i),0)};return function(e,t){a.useEffect(()=>{C.collapsedMap.has(e)||C.collapsedMap.set(e,!1);const i=l(()=>C.collapsedMap.get(e),e=>{t(e)});return()=>{i()}},[e])}(e,n),{collapsedItems:i,toggleCollapse:(e,t)=>{r({...i,[e]:t??!i[e]})},setCollapsedAllItems:n}}function ge(e,t=0){const i=(re||(ne||ie("Data cache not initialized, using fallback"),{header_info:{cdn_static_assets_dirs:["images"]}})).header_info.cdn_static_assets_dirs||["images"];if(!e)return e;const a=i.map(e=>`^\\/?${e}\\/`).join("|");if(!new RegExp(a).test(e))return e;try{return Y.getResourceUrl(e,{enableFallback:!0,localBasePath:"",cacheUrls:!0})}catch(r){return ae("Failed to get CDN URL, using original: %O",r),e}}window.stopOtherVideos=function(e){document.querySelectorAll(".remark-video").forEach(t=>{t!==e.target&&t.pause()})};const fe=S("ThemeManager");var be=(e=>(e.LIGHT="light",e.DARK="dark",e))(be||{});const xe={light:{type:"light",name:"浅色主题",description:"适合白天使用的明亮主题",cssClass:""},dark:{type:"dark",name:"深色主题",description:"适合夜晚使用的深色主题",cssClass:"dark"}};class ye{static instance;currentTheme="light";observers=[];constructor(){this.initializeTheme()}static getInstance(){return ye.instance||(ye.instance=new ye),ye.instance}initializeTheme(){const e=localStorage.getItem("theme");if(e&&Object.values(be).includes(e))this.currentTheme=e;else{const e=window.matchMedia("(prefers-color-scheme: dark)").matches;this.currentTheme=e?"dark":"light"}this.applyTheme(this.currentTheme),this.setupSystemThemeListener()}setupSystemThemeListener(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{if(!localStorage.getItem("theme")){const t=e.matches?"dark":"light";this.setTheme(t)}})}applyTheme(e){const t=document.documentElement;Object.values(xe).forEach(e=>{e.cssClass&&t.classList.remove(e.cssClass)}),"dark"===e?(t.setAttribute("data-theme","dark"),t.classList.add("dark")):t.removeAttribute("data-theme");const i=xe[e];i.cssClass&&t.classList.add(i.cssClass)}setTheme(e){this.currentTheme!==e&&(this.currentTheme=e,this.applyTheme(e),localStorage.setItem("theme",e),this.notifyObservers(e))}toggleTheme(){const e="light"===this.currentTheme?"dark":"light";this.setTheme(e)}getCurrentTheme(){return this.currentTheme}getCurrentThemeConfig(){return xe[this.currentTheme]}isDarkTheme(){return"dark"===this.currentTheme}addObserver(e){this.observers.push(e)}removeObserver(e){const t=this.observers.indexOf(e);t>-1&&this.observers.splice(t,1)}notifyObservers(e){this.observers.forEach(t=>{try{t(e)}catch(i){fe.extend("error")("主题观察者回调执行失败:",i)}})}getAvailableThemes(){return Object.values(xe)}resetToSystemTheme(){localStorage.removeItem("theme");const e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";this.setTheme(e)}}ye.getInstance();const we=d`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ve=d`
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
`;d`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;const ke="920px",Ce=m`
  /* 主题CSS变量已抽离到独立文件 */
  /* 浅色主题: src/styles/themes/LightTheme.css */
  /* 深色主题: src/styles/themes/DarkTheme.css */

  /* 字体变量 - 优化版，使用汉仪尚巍手书W作为默认字体 */
  :root {
    --font-family-primary: "HYShangWeiShouShuW", "Ma Shan Zheng", "STKaiti", "KaiTi", "SimKai", "FangSong", serif;
    --font-family-secondary: "Ma Shan Zheng", "Liu Jian Mao Cao", "STKaiti", "KaiTi", "SimKai", "FangSong", serif;
    --font-family-english: "Times New Roman", "Georgia", serif;
    --font-family-chinese: "HYShangWeiShouShuW", "Ma Shan Zheng", "STKaiti", "KaiTi", serif;
    --font-family-calligraphy: "Ma Shan Zheng", "Liu Jian Mao Cao", "STKaiti", "KaiTi", serif;
    --font-family-decorative: "ZCOOL XiaoWei", "ZCOOL KuaiLe", "Noto Sans SC", sans-serif;

    /* 字体加载状态变量 */
    --font-display: swap;
    --font-loading-opacity: 0.8;
    --font-loaded-opacity: 1;
  }

  /* CSS变量已在独立的主题文件中定义，无需动态生成 */
  /* 浅色主题变量: src/styles/themes/LightTheme.css */
  /* 深色主题变量: src/styles/themes/DarkTheme.css */

  /* 优化字体加载 - 只加载默认字体，其他字体按需加载 */
  @import url('https://fonts.loli.net/css2?family=Ma+Shan+Zheng:wght@400&display=swap'); 
  
  /* 备用字体CDN - 如果主CDN失败时使用 */
  /*@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng:wght@400&display=swap');*/

  /* 基础样式重置 */
  ${c`
  /* CSS重置 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    font-family: Arial, sans-serif, "Microsoft YaHei", "微软雅黑";
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-text-primary);
    background-color: var(--color-background);
    transition: color 0.3s ease, background-color 0.3s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 标题样式重置 */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
    // line-height: 1.25;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }

  /* 段落样式重置 */
  p {
    margin: 0;
    line-height: 1.6;
    color: var(--color-text-primary);
    transition: color 0.3s ease;
  }

  /* 链接样式重置 */
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--color-accent);
      text-decoration: underline;
    }
  }

  /* 按钮样式重置 */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    transition: all 0.3s ease;
  }

  /* 输入框样式重置 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
    background: transparent;
    transition: all 0.3s ease;
  }

  /* 列表样式重置 */
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* 图片样式重置 */
  img {
    max-width: 100%;
    height: auto;
    // display: block;
  }

  /* 表格样式重置 */
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }

  /* 代码样式重置 */
  code, pre {
    font-family: Consolas, Monaco, "Courier New", monospace;
    font-size: 0.9em;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-surface);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-border-medium);
    border-radius: 4px;
    transition: background 0.3s ease;
    
    &:hover {
      background: var(--color-border-dark);
    }
  }

  /* Firefox滚动条 */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--color-border-medium) var(--color-surface);
  }
`}

  /* 动画样式 */
  ${c`
  /* 淡入动画 */
  .fade-in {
    animation: ${d`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`} 0.3s ease-in-out;
  }

  /* 淡出动画 */
  .fade-out {
    animation: ${d`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`} 0.3s ease-in-out;
  }

  /* 滑入动画 */
  .slide-in-up {
    animation: ${d`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`} 0.3s ease-out;
  }

  .slide-in-down {
    animation: ${d`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`} 0.3s ease-out;
  }

  .slide-in-left {
    animation: ${d`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`} 0.3s ease-out;
  }

  .slide-in-right {
    animation: ${d`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`} 0.3s ease-out;
  }

  /* 旋转动画 */
  .spin {
    animation: ${we} 1s linear infinite;
  }

  /* 脉冲动画 */
  .pulse {
    animation: ${ve} 1.5s ease-in-out infinite;
  }

  /* 弹跳动画 */
  .bounce {
    animation: ${d`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`} 1s ease-in-out;
  }

  /* 缩放动画 */
  .scale-in {
    animation: ${d`
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`} 0.3s ease-out;
  }

  .scale-out {
    animation: ${d`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
`} 0.3s ease-in;
  }

  /* 骨架屏动画 */
  .skeleton {
    background: linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border-medium) 50%, var(--color-border-light) 75%);
    background-size: 200% 100%;
    animation: ${d`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`} 1.5s infinite;
    transition: background 0.3s ease;
  }

  /* 深色模式下的骨架屏样式 */
  [data-theme="dark"] .skeleton {
    background: linear-gradient(90deg, var(--color-border-medium) 25%, var(--color-border-dark) 50%, var(--color-border-medium) 75%);
  }

  /* 加载指示器 */
  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 16px;
    color: var(--color-text-primary);
    border-radius: 4px;
    transition: color 0.3s ease;
  }

  /* 启动画面加载器 */
  .splash-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: var(--color-background);
    transition: background-color 0.3s ease;
  }

  .splash-loader .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-border-light);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: ${we} 1s linear infinite;
    margin-bottom: 20px;
    transition: border-color 0.3s ease;
  }

  .splash-loader p {
    color: var(--color-text-secondary);
    font-size: 16px;
    margin: 0;
    animation: ${ve} 1.5s ease-in-out infinite;
    transition: color 0.3s ease;
  }
`}

  /* 工具类样式 */
  ${c`
  /* 显示/隐藏工具类 */
  .hidden {
    display: none !important;
  }

  .invisible {
    visibility: hidden !important;
  }

  .visible {
    visibility: visible !important;
  }

  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  /* 定位工具类 */
  .relative {
    position: relative !important;
  }

  .absolute {
    position: absolute !important;
  }

  .fixed {
    position: fixed !important;
  }

  .sticky {
    position: sticky !important;
  }

  /* Flexbox工具类 */
  .flex {
    display: flex !important;
  }

  .inline-flex {
    display: inline-flex !important;
  }

  .flex-col {
    flex-direction: column !important;
  }

  .flex-row {
    flex-direction: row !important;
  }

  .flex-wrap {
    flex-wrap: wrap !important;
  }

  .flex-nowrap {
    flex-wrap: nowrap !important;
  }

  .items-center {
    align-items: center !important;
  }

  .items-start {
    align-items: flex-start !important;
  }

  .items-end {
    align-items: flex-end !important;
  }

  .items-stretch {
    align-items: stretch !important;
  }

  .justify-center {
    justify-content: center !important;
  }

  .justify-start {
    justify-content: flex-start !important;
  }

  .justify-end {
    justify-content: flex-end !important;
  }

  .justify-between {
    justify-content: space-between !important;
  }

  .justify-around {
    justify-content: space-around !important;
  }

  .justify-evenly {
    justify-content: space-evenly !important;
  }

  .flex-1 {
    flex: 1 1 0% !important;
  }

  .flex-auto {
    flex: 1 1 auto !important;
  }

  .flex-none {
    flex: none !important;
  }

  /* Grid工具类 */
  .grid {
    display: grid !important;
  }

  .inline-grid {
    display: inline-grid !important;
  }

  /* 文本对齐工具类 */
  .text-left {
    text-align: left !important;
  }

  .text-center {
    text-align: center !important;
  }

  .text-right {
    text-align: right !important;
  }

  .text-justify {
    text-align: justify !important;
  }

  /* 文本截断工具类 */
  .truncate {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .text-ellipsis {
    text-overflow: ellipsis !important;
  }

  .text-clip {
    text-overflow: clip !important;
  }

  /* 溢出处理工具类 */
  .overflow-auto {
    overflow: auto !important;
  }

  .overflow-hidden {
    overflow: hidden !important;
  }

  .overflow-visible {
    overflow: visible !important;
  }

  .overflow-scroll {
    overflow: scroll !important;
  }

  .overflow-x-auto {
    overflow-x: auto !important;
  }

  .overflow-y-auto {
    overflow-y: auto !important;
  }

  .overflow-x-hidden {
    overflow-x: hidden !important;
  }

  .overflow-y-hidden {
    overflow-y: hidden !important;
  }

  /* 宽度工具类 */
  .w-full {
    width: 100% !important;
  }

  .w-auto {
    width: auto !important;
  }

  .w-fit {
    width: fit-content !important;
  }

  .w-screen {
    width: 100vw !important;
  }

  /* 高度工具类 */
  .h-full {
    height: 100% !important;
  }

  .h-auto {
    height: auto !important;
  }

  .h-fit {
    height: fit-content !important;
  }

  .h-screen {
    height: 100vh !important;
  }

  /* 边距工具类 */
  .m-0 {
    margin: 0 !important;
  }

  .m-auto {
    margin: auto !important;
  }

  .mx-auto {
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .my-auto {
    margin-top: auto !important;
    margin-bottom: auto !important;
  }

  /* 内边距工具类 */
  .p-0 {
    padding: 0 !important;
  }

  /* 圆角工具类 */
  .rounded-none {
    border-radius: 0 !important;
  }

  .rounded-sm {
    border-radius: 4px !important;
  }

  .rounded {
    border-radius: 8px !important;
  }

  .rounded-lg {
    border-radius: 12px !important;
  }

  .rounded-xl {
    border-radius: 16px !important;
  }

  .rounded-full {
    border-radius: 50% !important;
  }

  /* 阴影工具类 */
  .shadow-none {
    box-shadow: none !important;
  }

  .shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  }

  .shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  }

  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  }

  .shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
  }

  /* 光标工具类 */
  .cursor-auto {
    cursor: auto !important;
  }

  .cursor-default {
    cursor: default !important;
  }

  .cursor-pointer {
    cursor: pointer !important;
  }

  .cursor-wait {
    cursor: wait !important;
  }

  .cursor-text {
    cursor: text !important;
  }

  .cursor-move {
    cursor: move !important;
  }

  .cursor-help {
    cursor: help !important;
  }

  .cursor-not-allowed {
    cursor: not-allowed !important;
  }

  /* 用户选择工具类 */
  .select-none {
    user-select: none !important;
  }

  .select-text {
    user-select: text !important;
  }

  .select-all {
    user-select: all !important;
  }

  .select-auto {
    user-select: auto !important;
  }

  /* 指针事件工具类 */
  .pointer-events-none {
    pointer-events: none !important;
  }

  .pointer-events-auto {
    pointer-events: auto !important;
  }

  /* 响应式隐藏工具类 */
  @media (max-width: 768px) {
    .hidden-mobile {
      display: none !important;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .hidden-tablet {
      display: none !important;
    }
  }

  @media (min-width: 1024px) {
    .hidden-desktop {
      display: none !important;
    }
  }

  @media (max-width: 1024px) {
    .hidden-mobile-tablet {
      display: none !important;
    }
  }
`}

  /* 字体类定义 */
  .font-ancient-chinese {
    font-family: var(--font-family-chinese);
  }

  .font-modern-chinese {
    font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "SimHei", sans-serif;
  }

  /* 新增古典字体类 */
  .font-calligraphy {
    font-family: var(--font-family-calligraphy);
  }

  .font-decorative {
    font-family: var(--font-family-decorative);
  }

  .font-poetry {
    font-family: "Ma Shan Zheng", "Noto Serif SC", "STKaiti", "KaiTi", serif;
    letter-spacing: 0.1em;
    line-height: 1.8;
  }

  .font-cursive {
    font-family: "Liu Jian Mao Cao", "Ma Shan Zheng", "STKaiti", cursive;
    letter-spacing: 0.02em;
  }

  /* 独立字体类 - 与FontConfig.ts中的配置对应 */
  .font-kangxi {
    font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', serif;
    font-weight: 500;
    letter-spacing: 0.05em;
    line-height: 1.8;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-songti {
    font-family: 'Noto Serif SC', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', serif;
    font-weight: 400;
    letter-spacing: 0.02em;
    line-height: 1.7;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-kaiti {
    font-family: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', serif;
    font-weight: 400;
    letter-spacing: 0.08em;
    line-height: 1.9;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-fangsong {
    font-family: 'ZCOOL XiaoWei', 'STFangsong', 'FangSong', 'SimSun', serif;
    font-weight: 400;
    letter-spacing: 0.06em;
    line-height: 1.8;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-lishu {
    font-family: 'Liu Jian Mao Cao', 'STLiti', 'LiSu', 'SimLi', serif;
    font-weight: 400;
    letter-spacing: 0.1em;
    line-height: 2.0;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-decorative {
    font-family: 'ZCOOL KuaiLe', 'ZCOOL XiaoWei', 'Noto Sans SC', sans-serif;
    font-weight: 400;
    letter-spacing: 0.04em;
    line-height: 1.7;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-hanyi-shangwei {
    font-family: 'HYShangWeiShouShuW', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', serif;
    font-weight: 400;
    letter-spacing: 0.06em;
    line-height: 1.8;
    font-feature-settings: 'liga' 1, 'kern' 1;
    text-rendering: optimizeLegibility;
  }

  .font-english {
    font-family: var(--font-family-english);
  }

  .font-mixed {
    font-family: var(--font-family-primary);
  }

  /* 字体大小和行高优化 */
  .font-size-small {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .font-size-normal {
    font-size: 1rem;
    line-height: 1.6;
  }

  .font-size-large {
    font-size: 1.125rem;
    line-height: 1.7;
  }

  .font-size-xlarge {
    font-size: 1.25rem;
    line-height: 1.8;
  }

  /* 中文字体优化 */
  .chinese-text {
    font-family: var(--font-family-chinese);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 英文字体优化 */
  .english-text {
    font-family: var(--font-family-english);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
    font-family: var(--font-family-primary);
    color: var(--color-text-primary);
    background-color: var(--color-surface);
    letter-spacing: 0.02em;
    word-break: break-word; /* 改为break-word，避免强制断行 */
    transition: color 0.3s ease, background-color 0.3s ease, filter 0.3s ease, font-family 0.3s ease;

    /* 修复移动端横向溢出问题 */
    overflow-x: hidden; /* 隐藏横向滚动条 */
    width: 100%;
    max-width: 100vw; /* 确保不超出视口宽度 */
    box-sizing: border-box;
    min-height: 100vh;

    /* 背景图 */
    background-image: url('${ge("images/flexi-resume.jpg")}');

    /* 背景图平铺 */
    background-repeat: repeat;
    background-size: 180px;

    /* 浅色主题下的背景滤镜 - 使其更亮 */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${ge("images/flexi-resume.jpg")}');
      background-repeat: repeat;
      background-size: 180px;
      /* 浅色主题滤镜 - 卡通风格蓝色调 */

      filter: var(--filter-background-light);
      pointer-events: none;
      z-index: -1;
      transition: filter 0.3s ease;
    }

    /* 隐藏原始背景图，使用伪元素的滤镜版本 */
    background-image: none;
  }

  /* 深色模式下的背景图优化 - 仅对背景图使用滤镜反转 */
  [data-theme="dark"] body {
    /* 使用滤镜反转背景图，让其适配深色主题 */
    background-image: url('${ge("images/flexi-resume.jpg")}');

    /* 仅对背景图应用滤镜，不影响其他内容 */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${ge("images/flexi-resume.jpg")}');
      background-repeat: repeat;
      background-size: 180px;
      /* 深色主题滤镜 - 卡通风格深蓝色调 */
      filter: var(--filter-background-dark);
      pointer-events: none;
      z-index: -1;
      transition: filter 0.3s ease;
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

    @media (max-width: ${ke}) {
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
      background: url(${ge("images/url.svg")}) no-repeat center;
      background-size: contain; /* 保证图标自适应 */
      /* 链接图标颜色调整 - 适配卡通风格主题 */
      filter: var(--filter-link-icon-light);
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
      filter: var(--filter-link-icon-dark);
    }

    &:link {
      color: var(--color-link-primary, #74b9ff) !important;
    }

    &:visited {
      color: var(--color-link-visited, #b2bec3) !important;
    }

    &:hover {
      color: var(--color-link-hover, #fd79a8) !important;
    }

    &:active {
      color: var(--color-link-active, #74b9ff) !important;
    }
  }

  /* 深色模式下的普通链接颜色优化 */
  [data-theme="dark"] a.no-link-icon {
    &:link {
      color: var(--color-link-primary, #74b9ff) !important;
    }

    &:visited {
      color: var(--color-link-visited, #b2bec3) !important;
    }

    &:hover {
      color: var(--color-link-hover, #fd79a8) !important;
    }

    &:active {
      color: var(--color-link-active, #74b9ff) !important;
    }
  }
  @media (max-width: ${ke}) {
    body {
      padding: 1rem 0;
    }
    h1 {
      font-size: 1.8rem;
    } 
  }

  .development-notice {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transform: translateY( '-100%'});
    transition: transform 0.3s ease-in-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }
`,Se=S("PerformanceMonitor"),De=new class{metrics={};observers=[];constructor(){this.init()}init(){this.observeNavigation(),this.observeWebVitals(),this.observeResources(),this.setupReporting()}observeNavigation(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("navigation"===t.entryType){const e=t;this.metrics.TTFB=e.responseStart-e.requestStart,this.metrics.pageLoadTime=e.loadEventEnd-e.navigationStart,Se("Navigation metrics:",{TTFB:this.metrics.TTFB,pageLoadTime:this.metrics.pageLoadTime})}});e.observe({entryTypes:["navigation"]}),this.observers.push(e)}}observeWebVitals(){this.observeLCP(),this.observeFID(),this.observeCLS(),this.observeFCP()}observeLCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{const t=e.getEntries(),i=t[t.length-1];this.metrics.LCP=i.startTime,Se("LCP:",this.metrics.LCP)});e.observe({entryTypes:["largest-contentful-paint"]}),this.observers.push(e)}}observeFID(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("first-input"===t.entryType){const e=t;this.metrics.FID=e.processingStart-e.startTime,Se("FID:",this.metrics.FID)}});e.observe({entryTypes:["first-input"]}),this.observers.push(e)}}observeCLS(){if("PerformanceObserver"in window){let e=0;const t=new PerformanceObserver(t=>{for(const i of t.getEntries())"layout-shift"!==i.entryType||i.hadRecentInput||(e+=i.value);this.metrics.CLS=e,Se("CLS:",this.metrics.CLS)});t.observe({entryTypes:["layout-shift"]}),this.observers.push(t)}}observeFCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())"first-contentful-paint"===t.name&&(this.metrics.FCP=t.startTime,Se("FCP:",this.metrics.FCP))});e.observe({entryTypes:["paint"]}),this.observers.push(e)}}observeResources(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("resource"===t.entryType){const e=t,i=e.responseEnd-e.startTime;i>1e3&&Se("Slow resource:",{name:e.name,loadTime:i,size:e.transferSize})}});e.observe({entryTypes:["resource"]}),this.observers.push(e)}}setupReporting(){document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&this.reportMetrics()}),window.addEventListener("beforeunload",()=>{this.reportMetrics()})}reportMetrics(){Se("Performance Metrics:",this.metrics),navigator.sendBeacon&&JSON.stringify({url:window.location.href,timestamp:Date.now(),metrics:this.metrics,userAgent:navigator.userAgent})}recordCustomMetric(e,t){this.metrics[e]=t,Se(`Custom metric ${e}:`,t)}recordComponentMetric(e,t,i){switch(this.metrics.componentMetrics||(this.metrics.componentMetrics={}),this.metrics.componentMetrics[e]||(this.metrics.componentMetrics[e]={renderTime:0,mountTime:0,updateTime:0}),t){case"render":this.metrics.componentMetrics[e].renderTime=i;break;case"mount":this.metrics.componentMetrics[e].mountTime=i;break;case"update":this.metrics.componentMetrics[e].updateTime=i}Se(`Component ${e} ${t} time:`,i)}recordDataLoadTime(e,t){this.metrics.dataLoadTime=t,Se(`Data load time for ${e}:`,t)}recordSkeletonDisplayTime(e){this.metrics.skeletonDisplayTime=e,Se("Skeleton display time:",e)}recordRouteChangeTime(e,t,i){this.metrics.routeChangeTime=i,Se(`Route change from ${e} to ${t}:`,i)}recordThemeChangeTime(e,t,i){this.metrics.themeChangeTime=i,Se(`Theme change from ${e} to ${t}:`,i)}recordLanguageChangeTime(e,t,i){this.metrics.languageChangeTime=i,Se(`Language change from ${e} to ${t}:`,i)}recordMemoryUsage(){if("memory"in performance){const e=performance.memory;this.metrics.memoryUsage=e.usedJSHeapSize,Se("Memory usage:",{used:e.usedJSHeapSize,total:e.totalJSHeapSize,limit:e.jsHeapSizeLimit})}}getMetrics(){return{...this.metrics}}getPerformanceScore(){const e=this.getMetrics();let t=100;const i={};return e.LCP&&(e.LCP>4e3?(t-=30,i.LCP="Poor"):e.LCP>2500?(t-=15,i.LCP="Needs Improvement"):i.LCP="Good"),e.FID&&(e.FID>300?(t-=25,i.FID="Poor"):e.FID>100?(t-=10,i.FID="Needs Improvement"):i.FID="Good"),e.CLS&&(e.CLS>.25?(t-=20,i.CLS="Poor"):e.CLS>.1?(t-=10,i.CLS="Needs Improvement"):i.CLS="Good"),e.dataLoadTime&&(e.dataLoadTime>2e3?(t-=15,i.dataLoad="Slow"):e.dataLoadTime>1e3?(t-=5,i.dataLoad="Moderate"):i.dataLoad="Fast"),{score:Math.max(0,t),details:i}}cleanup(){this.observers.forEach(e=>e.disconnect()),this.observers=[]}},Fe=(e,t,i)=>{De.recordComponentMetric(e,t,i)},je=(e,t)=>{De.recordDataLoadTime(e,t)},Ee=e=>{De.recordSkeletonDisplayTime(e)},Le=(e,t,i)=>{De.recordRouteChangeTime(e,t,i)},Pe=()=>{const e=getComputedStyle(document.documentElement);return{primary:e.getPropertyValue("--color-primary").trim(),secondary:e.getPropertyValue("--color-secondary").trim(),accent:e.getPropertyValue("--color-accent").trim(),background:e.getPropertyValue("--color-background").trim(),surface:e.getPropertyValue("--color-surface").trim(),card:e.getPropertyValue("--color-card").trim(),text:{primary:e.getPropertyValue("--color-text-primary").trim(),secondary:e.getPropertyValue("--color-text-secondary").trim(),disabled:e.getPropertyValue("--color-text-disabled").trim(),inverse:e.getPropertyValue("--color-text-inverse").trim()},border:{light:e.getPropertyValue("--color-border-light").trim(),medium:e.getPropertyValue("--color-border-medium").trim(),dark:e.getPropertyValue("--color-border-dark").trim()},status:{success:e.getPropertyValue("--color-status-success").trim(),warning:e.getPropertyValue("--color-status-warning").trim(),error:e.getPropertyValue("--color-status-error").trim(),info:e.getPropertyValue("--color-status-info").trim()},shadow:{light:e.getPropertyValue("--color-shadow-light").trim(),medium:e.getPropertyValue("--color-shadow-medium").trim(),dark:e.getPropertyValue("--color-shadow-dark").trim()},filters:{backgroundLight:e.getPropertyValue("--filter-background-light").trim(),backgroundDark:e.getPropertyValue("--filter-background-dark").trim(),linkIconLight:e.getPropertyValue("--filter-link-icon-light").trim(),linkIconDark:e.getPropertyValue("--filter-link-icon-dark").trim()}}},$e=a.createContext(void 0),ze=({children:t})=>{const[i,r]=a.useState(()=>{const e=localStorage.getItem("theme");return!e||"light"!==e&&"dark"!==e?window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e}),[,n]=a.useState({});a.useEffect(()=>{localStorage.setItem("theme",i),document.documentElement.setAttribute("data-theme",i),setTimeout(()=>{n({});const e=document.querySelector('meta[name="theme-color"]');if(e){const t=getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim();e.setAttribute("content",t)}},0)},[i]),a.useEffect(()=>{const e=window.matchMedia("(prefers-color-scheme: dark)"),t=e=>{localStorage.getItem("theme")||r(e.matches?"dark":"light")};return e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]);const o={mode:i,setMode:r,toggleMode:()=>{const e=performance.now(),t=i;r(i=>{const a="light"===i?"dark":"light";return setTimeout(()=>{const i=performance.now()-e;((e,t,i)=>{De.recordThemeChangeTime(e,t,i)})(t,a,i)},0),a})},colors:Pe(),isDark:"dark"===i};return e.jsx($e.Provider,{value:o,children:t})},Ie=()=>{const e=a.useContext($e);if(!e)throw new Error("useTheme must be used within a ThemeProvider");return e};let Te=[],Me=[...Array(4).fill().map((e,t)=>`bgm-${String(t+1).padStart(2,"0")}`)];var Ne=(e=>(e.BGM="bgm",e.SFX="sfx",e))(Ne||{});const Ae=Te.map(e=>({id:e,name:e.split("-")[0],type:"sfx",file:`./audio/jackchen/sfx/${e}.wav`,volume:.8,loop:!1,preload:!0,autoplay:!1,description:"角色语音",quote:e})),_e=Me.map(e=>({id:e,name:e.split("-")[0],type:"bgm",file:`./audio/jackchen/bgm/${e}.mp3`,volume:.8,loop:!1,preload:!1,autoplay:!0,description:"背景音乐",quote:e})),Re=[{tabPath:"/agent",tabName:"AI工程师",bgmList:Me,sfxList:Te,characterId:"agent"},{tabPath:"/fullstack",tabName:"全栈开发工程师",bgmList:Me,sfxList:Te,characterId:"fullstack"},{tabPath:"/game",tabName:"游戏主程专家",bgmList:Me,sfxList:Te,characterId:"game"},{tabPath:"/cto",tabName:"技术管理",bgmList:Me,sfxList:Te,characterId:"cto"},{tabPath:"/contracttask",tabName:"外包任务",bgmList:Me,sfxList:Te,characterId:"contracttask"}],Oe={enabled:!0,bgmVolume:.3,sfxVolume:.7,requireUserInteraction:!0,fadeInDuration:1e3,fadeOutDuration:800,crossfadeDuration:1500};function Be(){return[...Ae,..._e]}function Ue(e){return Be().find(t=>t.id===e)}function Ge(e){return Re.find(t=>t.tabPath===e)}const He=S("EnhancedAudioPlayer"),Ke=new class{audioCache=new Map;playbackStates=new Map;currentBGM=null;bgmPlaylist=[];bgmCurrentIndex=0;settings={...Oe};constructor(){this.initializePlayer()}async initializePlayer(){this.setupUserInteractionListener(),await this.preloadAudio()}setupUserInteractionListener(){this.playCurrentTabAudioRandomly();const e=()=>{this.settings.requireUserInteraction&&(window.userInteracted=!0,He("🎵 用户首次交互，音频播放已启用"),this.playBGM(this.getCurrentBGM()),document.removeEventListener("click",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e))};document.addEventListener("click",e),document.addEventListener("keydown",e),document.addEventListener("touchstart",e)}async preloadAudio(){const e=Be().filter(e=>e.preload);for(const t of e)t.preload&&this.loadAudio(t)}async loadAudio(e){try{const t=new Audio(e.file);t.volume=e.volume,t.loop=e.loop,t.preload="auto",this.setupAudioEventListeners(t,e),this.audioCache.set(e.id,t),this.playbackStates.set(e.id,{isPlaying:!1,currentTime:0,duration:0,volume:e.volume,loop:e.loop})}catch(t){He.extend("warn")(`⚠️ ${e.name} 预加载失败:`,t)}}setupAudioEventListeners(e,t){e.addEventListener("loadedmetadata",()=>{const i=this.playbackStates.get(t.id);i&&(i.duration=e.duration)}),e.addEventListener("timeupdate",()=>{const i=this.playbackStates.get(t.id);i&&(i.currentTime=e.currentTime)}),e.addEventListener("ended",()=>{this.handleAudioEnded(t)}),e.addEventListener("error",e=>{He.extend("warn")(`⚠️ ${t.name} 播放错误:`,e)})}handleAudioEnded(e){const t=this.playbackStates.get(e.id);t&&(t.isPlaying=!1),e.type===Ne.BGM&&(this.bgmPlaylist.length>1?this.playNextBGM():1===this.bgmPlaylist.length&&setTimeout(()=>{this.playBGM(this.bgmPlaylist[0])},500))}playNextBGM(){if(0===this.bgmPlaylist.length)return;this.bgmCurrentIndex=(this.bgmCurrentIndex+1)%this.bgmPlaylist.length;const e=this.bgmPlaylist[this.bgmCurrentIndex];setTimeout(()=>{this.playBGM(e)},500)}async playBGM(e){if(!this.canPlay())return;const t=Ue(e);if(!t||t.type!==Ne.BGM)return void He.extend("warn")(`⚠️ BGM ${e} 配置不存在或类型错误`);if(this.currentBGM===e){const i=this.audioCache.get(e),a=this.playbackStates.get(e);if(i&&a&&a.isPlaying&&!i.paused)return void He(`🎵 BGM ${t.name} 已在播放，跳过重复播放`)}this.currentBGM&&this.currentBGM!==e&&await this.fadeOut(this.currentBGM);const i=this.audioCache.get(e);i||(He.extend("warn")(`⚠️ BGM ${e} 音频未加载`),this.loadAudio(t));try{this.currentBGM=e,i.volume=0,i.currentTime=0,await i.play(),await this.fadeIn(e);const a=this.playbackStates.get(e);a&&(a.isPlaying=!0),He(`🎵 播放BGM: ${t.name}`)}catch(a){He.extend("warn")(`⚠️ 播放BGM ${e} 失败:`,a)}}async playSFX(e){if(!this.canPlay())return;const t=Ue(e);if(!t||t.type!==Ne.SFX)return;const i=this.audioCache.get(e);i||this.loadAudio(t);try{i.currentTime=0,i.volume=t.volume*this.settings.sfxVolume,await i.play();const a=this.playbackStates.get(e);a&&(a.isPlaying=!0),He(`🎵 播放SFX: ${t.name} - "${t.quote||""}"`)}catch(a){}}async switchToTab(e){const t=Ge(e);if(t){if(this.bgmPlaylist=t.bgmList,this.bgmCurrentIndex=0,this.bgmPlaylist.length>0){const e=this.bgmPlaylist[0];if(this.currentBGM===e){const t=this.audioCache.get(e),i=this.playbackStates.get(e);t&&i&&i.isPlaying&&!t.paused||await this.playBGM(e)}else await this.playBGM(e)}t.sfxList.length>0&&this.canPlay()&&setTimeout(()=>{this.playSFX(t.sfxList[0])},1e3)}else He(`⚠️ 页签 ${e} 没有音频配置`)}async switchToTabRandomly(e){const t=Ge(e);if(t){if(this.bgmPlaylist=t.bgmList,this.bgmPlaylist.length>0){const e=this.getRandomElement(this.bgmPlaylist);e&&(this.bgmCurrentIndex=this.bgmPlaylist.indexOf(e),await this.playBGM(e),He(`🎲 随机选择BGM: ${e}`))}this.playRandomSFXForTab(t)}}playRandomSFXForTab(e){if(e.sfxList.length>0&&this.canPlay()){const t=this.getRandomElement(e.sfxList);t&&setTimeout(()=>{this.playSFX(t)},1e3)}else e.sfxList.length,this.canPlay()}canPlay(){return!!this.settings.enabled||(He("🔇 音频播放已禁用"),!1)}async fadeIn(e){const t=this.audioCache.get(e),i=Ue(e);if(!t||!i)return;const a=i.volume*(i.type===Ne.BGM?this.settings.bgmVolume:this.settings.sfxVolume),r=this.settings.fadeInDuration/20,n=a/20;for(let o=0;o<=20;o++)t.volume=n*o,await new Promise(e=>setTimeout(e,r))}async fadeOut(e){const t=this.audioCache.get(e);if(!t)return;const i=t.volume,a=this.settings.fadeOutDuration/20,r=i/20;for(let o=20;o>=0;o--)t.volume=r*o,await new Promise(e=>setTimeout(e,a));t.pause();const n=this.playbackStates.get(e);n&&(n.isPlaying=!1)}stopAll(){this.stopAllBGM(),this.stopAllSFX()}stopAllSFX(){this.stopAudio(Ne.SFX)}stopAllBGM(){this.stopAudio(Ne.BGM)}stopAudio(e){this.audioCache.forEach((t,i)=>{const a=Ue(i);if(a&&a.type===e){t.pause(),t.currentTime=0;const e=this.playbackStates.get(i);e&&(e.isPlaying=!1)}}),e===Ne.BGM?(this.currentBGM=null,He("🔇 停止所有背景音乐播放")):He("🔇 停止所有音效播放")}setGlobalVolume(e,t){this.settings.bgmVolume=Math.max(0,Math.min(1,e)),this.settings.sfxVolume=Math.max(0,Math.min(1,t)),this.audioCache.forEach((e,t)=>{const i=Ue(t);if(i){const t=i.type===Ne.BGM?this.settings.bgmVolume:this.settings.sfxVolume;e.volume=i.volume*t}})}setEnabled(e){this.settings.enabled,this.settings.enabled=e,e?e&&this.playCurrentTabAudioRandomly():this.stopAll(),He("🎵 音频播放"+(e?"启用":"禁用"))}async playCurrentTabAudioRandomly(){const e=window.location.pathname;e&&"/"!==e&&await this.switchToTabRandomly(e)}getRandomElement(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}getPlaybackState(e){return this.playbackStates.get(e)}getCurrentBGM(){return this.currentBGM}},Ve=S("Tabs"),We="#aaa",Ze="920px",Ye=p.nav.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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

  @media (min-width: ${Ze}) {
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
`,Xe=p(g).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  /* 基础样式 */
  text-decoration: none;
  color: ${e=>e.isDark?"var(--color-text-primary)":"black"};
  border: 2px solid transparent;
  border-radius: 6px 6px 0 0;
  border-top: 1px solid ${e=>e.isDark?"var(--color-border-medium)":We};
  border-right: 1px solid ${e=>e.isDark?"var(--color-border-medium)":We};
  border-bottom: 0px solid ${e=>e.isDark?"var(--color-border-medium)":We};
  border-left: 1px solid ${e=>e.isDark?"var(--color-border-medium)":We};
  transition: background-color 0.3s, border 0.3s, color 0.3s, transform 0.2s;
  box-shadow: 0 0 10px ${e=>e.isDark?"var(--color-shadow-medium)":"rgba(0, 0, 0, 0.1)"};
  background-color: ${e=>(e.isDark,"var(--color-background)")};
  white-space: nowrap;
  flex-shrink: 0;
  box-sizing: border-box;

  /* 移动端样式 */
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 500;
  min-width: fit-content;
  max-width: 140px; /* 增加最大宽度以容纳头像 */
  overflow: hidden;
  text-overflow: ellipsis;

  /* 超小屏幕适配 */
  @media (max-width: 480px) {
    padding: 4px 6px;
    font-size: 11px;
    max-width: 120px; /* 增加超小屏幕的最大宽度 */
  }

  &:hover, &.active {
    background-color: ${e=>e.isDark?"var(--color-surface)":"var(--color-primary)"};
    border-color: ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态时显示边框颜色 */
    border-top: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示顶部边框 */
    color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    transform: translateY(-1px); /* 轻微上移效果 */
  }

  @media (min-width: ${Ze}) {
    padding: 10px 10px;
    margin: 2px 0;
    border: none;
    text-align: center;
    font-size: 16px; /* 桌面端恢复正常字体大小 */

    /* 竖向排列文本 */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    border-radius: 0px 8px 8px 0px;
    border-top: 1px solid ${e=>e.isDark?"var(--color-border-medium)":We};
    border-right: 1px solid ${e=>e.isDark?"var(--color-border-medium)":We};
    border-bottom: 1px solid ${e=>e.isDark?"var(--color-border-medium)":We};
    border-left: 0px solid ${e=>e.isDark?"var(--color-border-medium)":We};

    &:hover, &.active {
      background-color: ${e=>(e.isDark,"var(--color-surface)")};
      border-right: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示右侧边框 */
      color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    }
  }
`,qe=p.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border-light);
  flex-shrink: 0; /* 防止头像被压缩 */

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 768px) {
    width: 24px;
    height: 24px;
  }
`,Je=p.span`
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 0.85em; /* 小屏幕时稍微减小字体 */
  }
`,Qe=p.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row; /* 始终使用水平布局，头像在左侧 */
  gap: 6px; /* 头像和文字之间的间距 */

  /* 确保在所有屏幕尺寸下都是水平布局 */
  @media (max-width: 767px) {
    gap: 4px; /* 小屏幕时减小间距 */
  }

  @media (max-width: 480px) {
    gap: 3px; /* 超小屏幕时进一步减小间距 */
  }
`,et=()=>{const t=C.data,i=C.tabs,{isDark:r}=Ie(),n=h(),o=u(),s=a.useCallback(async e=>{const t=`preload-${e}`;if(!Q.has(t))try{e.replace("/",""),Q.set(t,!0)}catch(i){}},[]),l=a.useCallback(e=>{const t=setTimeout(()=>{s(e)},200);return()=>clearTimeout(t)},[s]),c=a.useCallback(async(e,t)=>{t.preventDefault(),o(e),setTimeout(async()=>{try{Ke.settings.requireUserInteraction=!1,Ke.stopAll(),await Ke.switchToTabRandomly(e)}catch(t){}},0)},[o]);return a.useEffect(()=>{if(!i.length)return void(document.title=t?.header_info?.position||"My Resume");const e=function(e){const t=C.data,i=C.tabs,a=e.pathname,r=i.find(([,e])=>e===a);return r?r[0]:t?.header_info?.position||""}(n),a=Object.assign({},t?.header_info),r=function(e,t){if(!t)return t?.position||"My Resume";const i=e.replace(/{(position|name|age|location)}/g,(e,i)=>t[i]||""),a=i.replace(/[-\s]+/g," ").trim();return a&&"-"!==a&&"--"!==a&&"---"!==a?i:t?.position||t?.name||"My Resume"}(t?.header_info?.resume_name_format||"{position}-{name}-{age}-{location}",a),o=r&&r.trim()?r:e||t?.header_info?.position||"My Resume";document.title=o},[n,t,i.length]),i.length?e.jsx(Ye,{"data-testid":"navigation-tabs",isDark:r,children:i.map(([i,a,n,o],s)=>{const d=(e=>{const i=e.replace("/",""),a=t?.expected_positions?.[i];return a?.header_info})(a),m=d?.name||i,p=d?.avatar||o;return e.jsx(Xe,{className:"no-link-icon",to:a,isDark:r,onMouseEnter:()=>l(a),onClick:e=>{c(a,e)},children:e.jsxs(Qe,{children:[p&&e.jsx(qe,{src:p,alt:m,onError:e=>{Ve.extend("error")("Avatar load error:",p,e),e.currentTarget.style.display="none"},onLoad:()=>{Ve("Avatar loaded successfully:",p)}}),e.jsx(Je,{children:i})]})},a)})}):null};function tt(e){return w({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},child:[]}]})(e)}const it=p.div`
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
`,at=p.img`
    max-width: 90%;
    max-height: 90%;
    transition: transform 0.3s ease;
    cursor: pointer;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`,rt=p.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  padding: 10px;
  cursor: pointer;
  z-index: 1100;  
`,nt=({imageUrl:t,onClose:i})=>e.jsxs(it,{onClick:i,children:[e.jsx(at,{src:t,onClick:e=>e.stopPropagation()}),e.jsx(rt,{onClick:i,children:e.jsx(tt,{size:30,color:"white"})})]}),ot=a.createContext(void 0),st=({children:i})=>{const[n,o]=a.useState(!1),[s,l]=a.useState(""),c=e=>{l(e),o(!0)};return r.useEffect(()=>{window.$handleImageClick=c;const e=e=>{const t=e.target;let i=null;if("IMG"===t.tagName?i=t:t.closest("img")&&(i=t.closest("img")),i&&i.classList.contains("clickable-image")){const t=i.getAttribute("data-image-url");t&&(c(t),e.preventDefault(),e.stopPropagation())}};return document.addEventListener("click",e,!0),()=>{delete window.$handleImageClick,document.removeEventListener("click",e,!0)}},[]),e.jsxs(ot.Provider,{value:{handleImageClick:c},children:[i,n&&e.jsx(e.Fragment,{children:e.jsx(t.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:999999,pointerEvents:"auto"},children:e.jsx(nt,{imageUrl:s,onClose:()=>{o(!1)}})})})]})},lt={zh:{common:{loading:"加载中...",error:"加载失败",retry:"重试",contact:"联系我",download:"下载简历",print:"打印简历",share:"分享",switchLanguage:"切换语言",switchTheme:"切换主题",lightMode:"浅色模式",darkMode:"深色模式",controlPanel:"控制面板",theme:"主题",language:"语言",downloadPDF:"下载PDF",originalPDF:"原版PDF",colorPDF:"彩色PDF",grayscalePDF:"黑白PDF",generating:"生成中...",pdfGenerationFailed:"PDF生成失败",unknownError:"未知错误",buildGuide:"构建指南",close:"关闭提示",reset:"重置",networkError:"网络连接问题",resourceLoadError:"资源加载失败",runtimeError:"运行时错误",pageLoadError:"页面加载出错了",retrying:"重试中...",maxRetriesReached:"已达最大重试次数",reload:"重新加载",developmentMode:"开发环境模式 (npm run dev)",developmentDescription:"如需完整功能测试，建议使用 npm run build 构建后预览。",buildGuideButton:"📖 构建指南",resetButton:"🔄 重置",buildGuideAlert:"📖 构建指南已输出到控制台\n💡 请打开浏览器控制台查看详细信息",resetAlert:"已重置",developmentTips:"📍 当前模式: 开发环境 (npm run dev)\n🔧 特性说明:\n  • 热重载 (HMR) 已启用\n⚠️  注意事项:\n  • Mermaid图表可能需要手动刷新\n💡 建议:\n  • 如需完整功能测试，请使用: npm run build\n  • 生产环境预览: npm run preview",developmentEnvironment:"🚀 FlexiResume 开发环境",font:"字体",music:"音乐",renderFailed:"渲染失败",mindmapLoading:"脑图加载中...",mindmapRenderFailed:"脑图渲染失败",imageLoading:"📷 加载中...",imageLoadFailed:"🖼️ 图片加载失败",imageErrorHandlerInitialized:"图片错误处理器已初始化",imageErrorHandlerDestroyed:"图片错误处理器已销毁",imageLoadSuccess:"图片加载成功",imageRetryLocal:"尝试本地回退",localFallbackFailed:"本地回退失败",imageFinalLoadFailed:"图片最终加载失败",mindmapViewer:"脑图查看器",clickToEnlarge:"点击放大查看",renderingChart:"正在渲染图表...",wheelZoom:"滚轮缩放",dragPan:"拖拽平移",escClose:"ESC关闭",mindmapExpanded:"脑图已展开 • 任意位置点击关闭"},resume:{personalInfo:"个人信息",personalStrengths:"个人优势",skills:"技能清单",employmentHistory:"工作经历",projectExperience:"项目经历",educationHistory:"教育背景",personalInfluence:"个人影响力",careerPlanning:"职业规划",openSourceProjects:"开源项目"},profile:{position:"求职意向",expectedSalary:"期望薪资",status:"工作状态",phone:"联系电话",email:"邮箱地址",location:"所在地区",experience:"工作经验",education:"学历"},time:{present:"至今",years:"年",months:"个月"}},en:{common:{loading:"Loading...",error:"Load Failed",retry:"Retry",contact:"Contact Me",download:"Download Resume",print:"Print Resume",share:"Share",switchLanguage:"Switch Language",switchTheme:"Switch Theme",lightMode:"Light Mode",darkMode:"Dark Mode",controlPanel:"Control Panel",theme:"Theme",language:"Language",downloadPDF:"Download PDF",originalPDF:"Original PDF",colorPDF:"Color PDF",grayscalePDF:"Grayscale PDF",generating:"Generating...",pdfGenerationFailed:"PDF generation failed",unknownError:"Unknown error",buildGuide:"Build Guide",close:"Close",reset:"Reset",networkError:"Network Connection Issue",resourceLoadError:"Resource Load Failed",runtimeError:"Runtime Error",pageLoadError:"Page Load Error",retrying:"Retrying...",maxRetriesReached:"Max retries reached",reload:"Reload",developmentMode:"Development Mode (npm run dev)",developmentDescription:"For complete functionality testing, please use npm run build to build and preview.",buildGuideButton:"📖 Build Guide",resetButton:"🔄 Reset",buildGuideAlert:"📖 Build guide has been output to console\n💡 Please open browser console for detailed information",resetAlert:"Reset completed",developmentTips:"📍 Current mode: Development (npm run dev)\n🔧 Features:\n  • Hot Module Replacement (HMR) enabled\n⚠️  Notes:\n  • Mermaid charts may need manual refresh\n💡 Recommendations:\n  • For complete functionality testing, use: npm run build\n  • Production preview: npm run preview",developmentEnvironment:"🚀 FlexiResume Development Environment",font:"Font",music:"Music",renderFailed:"Render Failed",mindmapLoading:"Loading Mindmap...",mindmapRenderFailed:"Mindmap Render Failed",imageLoading:"📷 Loading...",imageLoadFailed:"🖼️ Image Load Failed",imageErrorHandlerInitialized:"Image error handler initialized",imageErrorHandlerDestroyed:"Image error handler destroyed",imageLoadSuccess:"Image loaded successfully",imageRetryLocal:"Trying local fallback",localFallbackFailed:"Local fallback failed",imageFinalLoadFailed:"Image final load failed",mindmapViewer:"Mindmap Viewer",clickToEnlarge:"Click to enlarge",renderingChart:"Rendering chart...",wheelZoom:"Wheel Zoom",dragPan:"Drag Pan",escClose:"ESC Close",mindmapExpanded:"Mindmap Expanded • Click anywhere to close"},resume:{personalInfo:"Personal Information",personalStrengths:"Personal Strengths",skills:"Skills",employmentHistory:"Work Experience",projectExperience:"Project Experience",educationHistory:"Education",personalInfluence:"Personal Influence",careerPlanning:"Career Planning",openSourceProjects:"Open Source Projects"},profile:{position:"Position",expectedSalary:"Expected Salary",status:"Status",phone:"Phone",email:"Email",location:"Location",experience:"Experience",education:"Education"},time:{present:"Present",years:" years",months:" months"}}},ct=a.createContext(void 0),dt=({children:t})=>{const[i,r]=a.useState(()=>{const e=localStorage.getItem("language");return!e||"zh"!==e&&"en"!==e?navigator.language.toLowerCase().startsWith("zh")?"zh":"en":e});a.useEffect(()=>{localStorage.setItem("language",i)},[i]);const n=(e=>t=>{const i=performance.now();e(e=>(setTimeout(()=>{const a=performance.now()-i;((e,t,i)=>{De.recordLanguageChangeTime(e,t,i)})(e,t,a)},0),t))})(r),o={language:i,setLanguage:n,t:lt[i]};return e.jsx(ct.Provider,{value:o,children:t})},mt=()=>{const e=a.useContext(ct);if(!e)throw new Error("useI18n must be used within an I18nProvider");return e},pt=()=>{if("undefined"!=typeof window){const e=localStorage.getItem("language");if(e&&("zh"===e||"en"===e))return e}return"zh"},ht=e=>lt[e];S("NetworkManager");const ut=new Set;let gt={isOnline:navigator.onLine,connectionType:"unknown",effectiveType:"unknown",downlink:0,rtt:0,saveData:!1};function ft(){return{...gt}}const bt=S("error-boundary"),xt=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e&&"level"!==e})`
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
`,yt=p.div.withConfig({shouldForwardProp:e=>"level"!==e})`
  font-size: ${e=>{switch(e.level){case"page":return"48px";case"section":return"36px";default:return"24px"}}};
  margin-bottom: 16px;
  opacity: 0.8;
`,wt=p.h3.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  color: ${e=>e.isDark?"var(--color-text-primary)":"#333"};
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
`,vt=p.p.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  color: ${e=>e.isDark?"var(--color-text-secondary)":"#666"};
  margin: 0 0 24px 0;
  line-height: 1.5;
  max-width: 500px;
`,kt=p.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`,Ct=p.button.withConfig({shouldForwardProp:e=>"isDark"!==e&&"variant"!==e})`
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
`,St=p.details.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Dt=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  margin-top: 16px;
  padding: 8px 12px;
  background: ${e=>e.isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.05)"};
  border-radius: 4px;
  font-size: 12px;
  color: ${e=>e.isDark?"var(--color-text-secondary)":"#666"};
`;class Ft extends a.Component{networkStatusUnsubscribe;constructor(e){super(e),this.state={hasError:!1,retryCount:0,isRetrying:!1}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){const i=function(e){const t=e.message.toLowerCase();return t.includes("network")||t.includes("fetch")||t.includes("timeout")||"TypeError"===e.name&&t.includes("failed to fetch")?"network":t.includes("chunk")||t.includes("loading")||t.includes("import")?"chunk":"runtime"}(e),a=ft(),r={type:i,message:e.message,stack:e.stack,componentStack:t.componentStack,timestamp:Date.now(),userAgent:navigator.userAgent,url:window.location.href,networkStatus:a,retryCount:this.state.retryCount};var n;this.setState({error:e,errorInfo:t,errorDetails:r}),this.props.onError?.(r),B()&&(bt("EnhancedErrorBoundary caught an error:",e,t),bt("Error details:",r)),this.networkStatusUnsubscribe=(n=e=>{e.isOnline&&this.state.hasError&&bt("Network recovered, user can retry")},ut.add(n),n(gt),()=>{ut.delete(n)})}componentWillUnmount(){this.networkStatusUnsubscribe?.()}handleRetry=async()=>{const e=this.props.maxRetries||3;this.state.retryCount>=e||(this.setState({isRetrying:!0}),await new Promise(e=>setTimeout(e,1e3)),this.setState({hasError:!1,error:void 0,errorInfo:void 0,errorDetails:void 0,retryCount:this.state.retryCount+1,isRetrying:!1}))};handleReload=()=>{window.location.reload()};render(){if(this.state.hasError){if(this.props.fallback)return this.props.fallback;const{level:t="component",showErrorDetails:i=!1}=this.props,{errorDetails:a,retryCount:r,isRetrying:n}=this.state,o=this.props.maxRetries||3,s=ft(),l=a?.type||"unknown",c=function(e,t){if(!t)return"网络连接已断开，请检查您的网络连接后重试。";switch(e){case"network":return"网络请求失败，请检查网络连接或稍后重试。";case"chunk":return"页面资源加载失败，可能是网络问题，请尝试刷新页面。";case"runtime":return"页面运行时出现错误，请尝试刷新页面或联系技术支持。";default:return"页面遇到了一些问题，请尝试刷新页面或稍后再试。"}}(l,s.isOnline);return e.jsxs(xt,{level:t,isDark:this.props.isDark,children:[e.jsx(yt,{level:t,children:"network"===l?"🌐":"chunk"===l?"📦":"runtime"===l?"⚠️":"❌"}),e.jsx(wt,{isDark:this.props.isDark,children:"network"===l?this.props.t?.common?.networkError||"网络连接问题":"chunk"===l?this.props.t?.common?.resourceLoadError||"资源加载失败":"runtime"===l?this.props.t?.common?.runtimeError||"运行时错误":this.props.t?.common?.pageLoadError||"页面加载出错了"}),e.jsxs(vt,{isDark:this.props.isDark,children:[c,r>0&&e.jsxs(e.Fragment,{children:[e.jsx("br",{}),"已重试 ",r," 次"]})]}),e.jsxs(kt,{children:[e.jsx(Ct,{variant:"primary",isDark:this.props.isDark,onClick:this.handleRetry,disabled:n||r>=o,children:n?this.props.t?.common?.retrying||"重试中...":r>=o?this.props.t?.common?.maxRetriesReached||"已达最大重试次数":this.props.t?.common?.reload||"重新加载"}),e.jsx(Ct,{variant:"secondary",isDark:this.props.isDark,onClick:this.handleReload,children:"刷新页面"})]}),!s.isOnline&&e.jsx(Dt,{isDark:this.props.isDark,children:"🔴 网络连接已断开"}),i&&a&&e.jsxs(St,{isDark:this.props.isDark,children:[e.jsx("summary",{children:"错误详情 (开发模式)"}),e.jsxs("pre",{children:["错误类型: ",a.type,"\n","错误消息: ",a.message,"\n","时间戳: ",new Date(a.timestamp).toLocaleString(),"\n","网络状态: ",JSON.stringify(a.networkStatus,null,2),a.stack&&`\n\n堆栈跟踪:\n${a.stack}`,a.componentStack&&`\n\n组件堆栈:\n${a.componentStack}`]})]})]})}return this.props.children}}const jt=t=>{const{isDark:i}=Ie(),{t:a}=mt();return e.jsx(Ft,{...t,isDark:i,t:a,showErrorDetails:t.showErrorDetails??!1})},Et=()=>(()=>{if("undefined"==typeof window)return!1;const e=document.documentElement.getAttribute("data-theme"),t=document.body.getAttribute("data-theme"),i=document.documentElement.className,a=document.body.className,r=localStorage.getItem("theme");return!("dark"!==e&&"dark"!==t&&("light"===e||"light"===t||!i.includes("dark")&&!a.includes("dark")&&(i.includes("light")||a.includes("light")||"dark"!==r&&("light"===r||!window.matchMedia||!window.matchMedia("(prefers-color-scheme: dark)").matches))))})(),Lt=()=>{const[e,t]=a.useState(()=>Et());a.useEffect(()=>{if("undefined"==typeof window)return;t(Et());const e=e=>{"theme"===e.key&&t(Et())},i=new MutationObserver(()=>{t(Et())});i.observe(document.body,{attributes:!0,attributeFilter:["data-theme","class"]}),i.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.addEventListener("storage",e);const a=window.matchMedia("(prefers-color-scheme: dark)"),r=()=>{t(Et())};return a.addEventListener("change",r),()=>{i.disconnect(),window.removeEventListener("storage",e),a.removeEventListener("change",r)}},[]);try{const e=Ie();return{isDark:e.isDark,mode:e.mode,colors:e.colors,toggleMode:e.toggleMode,setMode:e.setMode}}catch(i){return{isDark:e,mode:e?"dark":"light",colors:null,toggleMode:()=>{const t=e?"light":"dark";localStorage.setItem("theme",t),document.documentElement.setAttribute("data-theme",t)},setMode:e=>{localStorage.setItem("theme",e),document.documentElement.setAttribute("data-theme",e)}}}},Pt=d`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`,$t=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  background: ${e=>e.isDark?"linear-gradient(90deg, var(--color-border-medium) 25%, var(--color-border-dark) 50%, var(--color-border-medium) 75%)":"linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border-medium) 50%, var(--color-border-light) 75%)"};
  background-size: 200px 100%;
  animation: ${Pt} 1.5s infinite linear;
  border-radius: 4px;
  transition: background 0.3s ease;
`,zt=p($t).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>e.height||"16px"};
  width: ${e=>e.width||"100%"};
  margin: ${e=>e.margin||"8px 0"};
`,It=p($t).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>{switch(e.size){case"small":return"20px";case"large":return"32px";default:return"24px"}}};
  width: ${e=>{switch(e.size){case"small":return"120px";case"large":return"200px";default:return"150px"}}};
  margin: 16px 0;
`,Tt=p($t).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: ${e=>e.size||80}px;
  height: ${e=>e.size||80}px;
  border-radius: 50%;
  flex-shrink: 0;
`;p($t).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: 36px;
  width: ${e=>e.width||"100px"};
  border-radius: 6px;
`;const Mt=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  padding: ${e=>e.padding||"20px"};
  border: 1px solid ${e=>e.isDark?"var(--color-border-medium)":"#e0e0e0"};
  border-radius: 8px;
  margin: 16px 0;
  background: ${e=>e.isDark?"var(--color-card)":"#fff"};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;p($t)`
  width: ${e=>e.width||"100%"};
  height: ${e=>e.height||"200px"};
  aspect-ratio: ${e=>e.aspectRatio||"auto"};
  border-radius: 8px;
`;const Nt=p.div.withConfig({shouldForwardProp:e=>"minWidth"!==e})`
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
`,At=()=>{const{isDark:t}=Lt(),i=me(800)-40;return e.jsxs(Nt,{minWidth:i,children:[e.jsxs("div",{style:{display:"flex",gap:"20px",marginBottom:"40px"},children:[e.jsx(Tt,{size:100,isDark:t}),e.jsxs("div",{style:{flex:1},children:[e.jsx(It,{size:"large",isDark:t}),e.jsx(zt,{width:"60%",height:"18px",isDark:t}),e.jsx(zt,{width:"50%",height:"16px",isDark:t}),e.jsx(zt,{width:"40%",height:"16px",isDark:t})]})]}),e.jsxs(Mt,{isDark:t,children:[e.jsx(It,{size:"medium",isDark:t}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"12px"},children:[e.jsx(zt,{width:"80%",isDark:t}),e.jsx(zt,{width:"70%",isDark:t}),e.jsx(zt,{width:"90%",isDark:t}),e.jsx(zt,{width:"75%",isDark:t}),e.jsx(zt,{width:"85%",isDark:t}),e.jsx(zt,{width:"65%",isDark:t})]})]}),e.jsxs(Mt,{isDark:t,children:[e.jsx(It,{size:"medium",isDark:t}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(zt,{width:"40%",height:"20px",isDark:t}),e.jsx(zt,{width:"100%",isDark:t}),e.jsx(zt,{width:"95%",isDark:t}),e.jsx(zt,{width:"88%",isDark:t})]}),e.jsxs("div",{children:[e.jsx(zt,{width:"35%",height:"20px",isDark:t}),e.jsx(zt,{width:"100%",isDark:t}),e.jsx(zt,{width:"92%",isDark:t}),e.jsx(zt,{width:"85%",isDark:t})]})]}),e.jsxs(Mt,{isDark:t,children:[e.jsx(It,{size:"medium",isDark:t}),e.jsx(zt,{width:"50%",height:"18px",isDark:t}),e.jsx(zt,{width:"100%",isDark:t}),e.jsx(zt,{width:"90%",isDark:t}),e.jsx(zt,{width:"95%",isDark:t})]})]})},_t=S("FontConfig"),Rt=new q({maxSize:20,maxAge:36e5,maxMemory:10485760,cleanupInterval:6e5});var Ot=(e=>(e.ANCIENT_CHINESE="ancient_chinese",e.MODERN_CHINESE="modern_chinese",e.ENGLISH="english",e.MIXED="mixed",e))(Ot||{});const Bt=[{name:"kangxi",displayName:"康熙字典体",fontFamily:"Noto Serif SC",fallbacks:["STKaiti","KaiTi","SimKai","FangSong","serif"],description:"康熙字典风格的古典字体，适合正式文档",webFontUrl:"./fonts/kangxi.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"songti",displayName:"宋体古风",fontFamily:"Noto Serif SC",fallbacks:["STSong","SimSun","Song","serif"],description:"宋体风格，具有古典韵味",webFontUrl:"./fonts/songti.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"kaiti",displayName:"楷体",fontFamily:"Ma Shan Zheng",fallbacks:["STKaiti","KaiTi","SimKai","FangSong","serif"],description:"楷体，端正秀丽，适合正式场合",webFontUrl:"./fonts/kaiti.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Ma+Shan+Zheng:wght@400&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng:wght@400&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"fangsong",displayName:"仿宋",fontFamily:"ZCOOL XiaoWei",fallbacks:["STFangsong","FangSong","SimSun","serif"],description:"仿宋体，古朴典雅",webFontUrl:"./fonts/fangsong.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=ZCOOL+XiaoWei&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"lishu",displayName:"隶书",fontFamily:"Liu Jian Mao Cao",fallbacks:["STLiti","LiSu","SimLi","serif"],description:"隶书风格，古朴大气",webFontUrl:"./fonts/lishu.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Liu+Jian+Mao+Cao&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"hanyi_shangwei",displayName:"汉仪尚巍手书W",fontFamily:"HYShangWeiShouShuW",fallbacks:["Ma Shan Zheng","STKaiti","KaiTi","SimKai","FangSong","serif"],description:"汉仪尚巍手书体，现代手写风格，具有个性化特色",webFontUrl:"./fonts/hanyi-shangwei.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Ma+Shan+Zheng:wght@400&display=swap",jsdelivr:"https://cdn.jsdelivr.net/npm/@fontsource/ma-shan-zheng@4.5.0/index.css",unpkg:"https://unpkg.com/@fontsource/ma-shan-zheng@4.5.0/index.css",googleFonts:"https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng:wght@400&display=swap"},loadConfig:{priority:"high",preload:!0,display:"swap"}}],Ut=[{name:"noto_sans_sc",displayName:"Noto Sans SC",fontFamily:"Noto Sans SC",fallbacks:["PingFang SC","Microsoft YaHei","SimHei","sans-serif"],description:"现代简洁的中文字体",webFontUrl:"./fonts/modern-sans.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"decorative",displayName:"装饰字体",fontFamily:"ZCOOL KuaiLe",fallbacks:["ZCOOL XiaoWei","Noto Sans SC","PingFang SC","sans-serif"],description:"活泼的装饰性字体，适合标题",webFontUrl:"./fonts/decorative.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=ZCOOL+KuaiLe&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"pingfang",displayName:"苹方",fontFamily:"PingFang SC",fallbacks:["Microsoft YaHei","SimHei","sans-serif"],description:"苹果设计的现代中文字体",localFontFiles:["PingFang SC"]},{name:"microsoft_yahei",displayName:"微软雅黑",fontFamily:"Microsoft YaHei",fallbacks:["SimHei","sans-serif"],description:"微软设计的现代中文字体",localFontFiles:["Microsoft YaHei"]}],Gt={ancient_chinese:Bt,modern_chinese:Ut,english:[{name:"times_new_roman",displayName:"Times New Roman",fontFamily:"Times New Roman",fallbacks:["Times","serif"],description:"经典的英文衬线字体",localFontFiles:["Times New Roman","Times"]},{name:"georgia",displayName:"Georgia",fontFamily:"Georgia",fallbacks:["Times New Roman","serif"],description:"优雅的英文衬线字体",localFontFiles:["Georgia"]},{name:"arial",displayName:"Arial",fontFamily:"Arial",fallbacks:["Helvetica","sans-serif"],description:"经典的英文无衬线字体",localFontFiles:["Arial","Helvetica"]}],mixed:[{name:"ancient_mixed",displayName:"古典混合",fontFamily:"Noto Serif SC",fallbacks:["Ma Shan Zheng","STKaiti","KaiTi","Times New Roman","serif"],description:"中文古典字体配英文衬线字体",webFontUrl:"./fonts/kangxi.css"},{name:"modern_mixed",displayName:"现代混合",fontFamily:"Noto Sans SC",fallbacks:["PingFang SC","Microsoft YaHei","Arial","sans-serif"],description:"中文现代字体配英文无衬线字体",webFontUrl:"./fonts/modern-sans.css"}]},Ht={...function(){let e={};for(const t in Gt)for(const i of Gt[t]){if("kangxi"===i.name)return i;e=i}return e}(),loadConfig:{priority:"high",preload:!0,display:"swap"}},Kt={primary:Ht,secondary:[Bt[1],Bt[2],Ut[0]],fallback:["STFangsong","FangSong","STKaiti","KaiTi","SimKai","STSong","SimSun","Song","PingFang SC","Microsoft YaHei","SimHei","Times New Roman","Georgia","Arial","serif","sans-serif"]},Vt=e=>[`"${e.primary.fontFamily}"`,...e.secondary.map(e=>`"${e.fontFamily}"`),...e.fallback.map(e=>e.includes(" ")?`"${e}"`:e)].join(", "),Wt=async e=>{if(!document.fonts)return!1;try{return await document.fonts.load(`16px "${e}"`),document.fonts.check(`16px "${e}"`)}catch(t){return _t.extend("warn")(`Font ${e} check failed:`,t),!1}},Zt=new class{loadedFonts=new Set;loadingPromises=new Map;failedCDNs=new Set;async loadFont(e){const t=this.generateCacheKey(e);if(Rt.get(t))return _t.extend("info")(`Font loaded from cache: ${e.name}`),void this.loadedFonts.add(e.name);if(this.loadedFonts.has(e.name))return;if(this.loadingPromises.has(e.name))return this.loadingPromises.get(e.name);const i=this.loadFontFromCDN(e);this.loadingPromises.set(e.name,i);try{await i,this.loadedFonts.add(e.name),_t.extend("info")(`Font loaded successfully: ${e.name}`)}catch(a){throw _t.extend("error")(`Failed to load font: ${e.name}`,a),a}finally{this.loadingPromises.delete(e.name)}}async loadFontFromCDN(e){const t=this.getCDNUrls(e);_t.extend("info")(`🚀 Loading font "${e.name}" from ${t.length} sources`);for(let r=0;r<t.length;r++){const i=t[r];if(this.failedCDNs.has(i))_t.extend("debug")(`⏭️ Skipping known failed CDN: ${i}`);else try{return _t.extend("info")(`🔄 Trying source ${r+1}/${t.length}: ${i}`),await this.loadFromURL(i),void _t.extend("info")(`✅ Font "${e.name}" loaded successfully from: ${i}`)}catch(a){_t.extend("warn")(`❌ Failed to load from ${i}:`,a),this.failedCDNs.add(i),r<t.length-1&&_t.extend("info")("🔄 Trying next CDN source...")}}const i=`Failed to load font "${e.name}" from all ${t.length} CDN sources`;throw _t.extend("error")(i),new Error(i)}getCDNUrls(e){const t=[];return e.cdnConfig&&(e.cdnConfig.loli&&(t.push(e.cdnConfig.loli),_t.extend("debug")(`Added loli CDN: ${e.cdnConfig.loli}`)),e.cdnConfig.jsdelivr&&(t.push(e.cdnConfig.jsdelivr),_t.extend("debug")(`Added jsdelivr CDN: ${e.cdnConfig.jsdelivr}`)),e.cdnConfig.unpkg&&(t.push(e.cdnConfig.unpkg),_t.extend("debug")(`Added unpkg CDN: ${e.cdnConfig.unpkg}`)),e.cdnConfig.googleFonts&&(t.push(e.cdnConfig.googleFonts),_t.extend("debug")(`Added Google Fonts CDN: ${e.cdnConfig.googleFonts}`)),e.cdnConfig.custom&&(t.push(...e.cdnConfig.custom),_t.extend("debug")(`Added custom CDNs: ${e.cdnConfig.custom.join(", ")}`))),e.webFontUrl&&(t.push(e.webFontUrl),_t.extend("debug")(`Added local fallback: ${e.webFontUrl}`)),_t.extend("info")(`Font ${e.name} CDN URLs order: ${t.join(" -> ")}`),t}async loadFromURL(e){return _t.extend("info")(`🔄 Attempting to load font from: ${e}`),new Promise((t,i)=>{const a=document.createElement("link");a.rel="stylesheet",a.href=e,a.crossOrigin="anonymous",a.onload=()=>{_t.extend("info")(`✅ Font successfully loaded from: ${e}`),this.cacheFontFromURL(e),t()},a.onerror=t=>{_t.extend("warn")(`❌ Failed to load font from: ${e}`,t),i(new Error(`Failed to load font from: ${e}`))},setTimeout(()=>{_t.extend("warn")(`⏰ Font load timeout (10s): ${e}`),i(new Error(`Font load timeout: ${e}`))},1e4),_t.extend("debug")(`📎 Adding font link to document head: ${e}`),document.head.appendChild(a)})}generateCacheKey(e){return`font_${e.name}_${e.fontFamily}`}async cacheFontFromURL(e){try{if(document.fonts&&document.fonts.values){await document.fonts.ready;const t=Array.from(document.fonts.values()).find(t=>"loaded"===t.status&&t.src&&t.src.includes(e.split("/").pop()?.split("?")[0]||""));if(t){const i=`url_${e}`;Rt.set(i,t),_t.extend("debug")(`Font cached: ${i}`)}}}catch(t){_t.extend("warn")(`Failed to cache font from URL: ${e}`,t)}}async preloadCriticalFonts(){const e=[Ht].filter(e=>e.loadConfig?.preload).map(e=>this.loadFont(e));await Promise.allSettled(e)}isLoaded(e){return this.loadedFonts.has(e)}getLoadedFonts(){return Array.from(this.loadedFonts)}getCacheStats(){return Rt.getStats()}clearCache(){Rt.clear(),_t.extend("info")("Font cache cleared")}async warmupCache(e){const t=e.filter(e=>e.loadConfig?.preload).map(e=>this.loadFont(e));await Promise.allSettled(t),_t.extend("info")(`Font cache warmed up with ${t.length} fonts`)}},Yt=async e=>{const t=e.map(e=>Zt.loadFont(e));await Promise.allSettled(t)},Xt=S("UseFont"),qt="flexiresume_font_config",Jt=a.createContext(void 0),Qt=({children:t})=>{const i=(()=>{const[e,t]=a.useState(()=>{try{const e=localStorage.getItem(qt);if(e)return JSON.parse(e)}catch(e){Xt.extend("warn")("Failed to load font config from localStorage:",e)}return Kt}),[i,r]=a.useState(!1),[n,o]=a.useState(new Set),s=Vt(e),l=a.useCallback(async e=>{r(!0);try{const i=[e.primary,...e.secondary];await Yt(i);const a=await Promise.all(i.map(async e=>{const t=await Wt(e.fontFamily);return{fontFamily:e.fontFamily,isAvailable:t}})),r=new Set(n);a.forEach(({fontFamily:e,isAvailable:t})=>{t&&r.add(e)}),o(r),t(e),localStorage.setItem(qt,JSON.stringify(e)),m(Vt(e))}catch(i){Xt.extend("error")("Failed to set font:",i)}finally{r(!1)}},[n]),c=a.useCallback(t=>{for(const i of Object.values(Ot)){const a=Gt[i],r=a.find(e=>e.name===t);if(r){const i={primary:r,secondary:a.filter(e=>e.name!==t).slice(0,2),fallback:e.fallback};return void l(i)}}Xt.extend("warn")(`Font ${t} not found`)},[e.fallback,l]),d=a.useCallback((t,i)=>{const a=Gt[t],r=a.find(e=>e.name===i);if(r){const t={primary:r,secondary:a.filter(e=>e.name!==i).slice(0,2),fallback:e.fallback};l(t)}else Xt.extend("warn")(`Font ${i} not found in type ${t}`)},[e.fallback,l]),m=a.useCallback(e=>{document.documentElement.style.setProperty("--font-family-primary",e),document.body.style.fontFamily=e},[]);return a.useEffect(()=>{(async()=>{r(!0);try{const t=[e.primary,...e.secondary];await Yt(t),m(s);const i=await Promise.all(t.map(async e=>{const t=await Wt(e.fontFamily);return{fontFamily:e.fontFamily,isAvailable:t}})),a=new Set;i.forEach(({fontFamily:e,isAvailable:t})=>{t&&a.add(e)}),o(a)}catch(t){Xt.extend("error")("Failed to initialize font:",t)}finally{r(!1)}})()},[]),a.useEffect(()=>{m(s)},[s,m]),{currentFont:e,setFont:l,setFontByName:c,setFontByType:d,availableFonts:Gt,fontCSS:s,isLoading:i,loadedFonts:n}})();return e.jsx(Jt.Provider,{value:i,children:t})},ei=p.div`
  position: relative;
  display: inline-block;
`,ti=p.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: var(--color-card);
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px var(--color-shadow-medium);
  }

  &:active {
    transform: translateY(1px);
  }
`,ii=p.span`
  font-size: 16px;
  line-height: 1;
`,ai=p.span`
  font-weight: 500;
`,ri=p.div.withConfig({shouldForwardProp:e=>"isOpen"!==e&&"isDark"!==e})`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  box-shadow: 0 -4px 12px var(--color-shadow-medium);
  backdrop-filter: blur(10px);
  z-index: 1000;
  min-width: 120px;
  opacity: ${e=>e.isOpen?1:0};
  visibility: ${e=>e.isOpen?"visible":"hidden"};
  transform: ${e=>e.isOpen?"translateY(0)":"translateY(10px)"};
  transition: all 0.3s ease;
`,ni=p.button.withConfig({shouldForwardProp:e=>"isActive"!==e&&"isDark"!==e})`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: ${e=>e.isActive?"var(--color-card)":"transparent"};
  color: ${e=>e.isActive?"var(--color-primary)":"var(--color-text-primary)"};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 0 0 6px 6px;
  }

  &:last-child {
    border-radius: 6px 6px 0 0;
  }

  &:hover {
    background: var(--color-card);
    color: var(--color-primary);
  }

  &:active {
    background: var(--color-surface);
  }
`,oi=p.span.withConfig({shouldForwardProp:e=>"visible"!==e&&"isDark"!==e})`
  opacity: ${e=>e.visible?1:0};
  color: var(--color-status-success);
  font-weight: bold;
  margin-left: auto;
`,si=[{code:"zh",name:"Chinese",icon:"🇨🇳",nativeName:"中文"},{code:"en",name:"English",icon:"🇺🇸",nativeName:"English"}],li=({className:t})=>{const{language:i,setLanguage:a,t:n}=mt(),{isDark:o}=Ie(),[s,l]=r.useState(!1),c=si.find(e=>e.code===i);r.useEffect(()=>{const e=P();e!==i&&a(e)},[i,a]);const d=r.useCallback(e=>{e.target.closest("[data-language-switcher]")||l(!1)},[]);return r.useEffect(()=>{if(s)return document.addEventListener("click",d),()=>document.removeEventListener("click",d)},[s,d]),e.jsxs(ei,{className:t,"data-testid":"language-switcher","data-language-switcher":!0,children:[e.jsxs(ti,{isDark:o,onClick:()=>l(!s),title:n.common.switchLanguage,"aria-label":n.common.switchLanguage,children:[e.jsx(ii,{children:c?.icon}),e.jsx(ai,{children:c?.nativeName}),e.jsx("span",{style:{transform:s?"rotate(0deg)":"rotate(180deg)",transition:"transform 0.3s ease",fontSize:"12px"},children:"▲"})]}),e.jsx(ri,{isOpen:s,isDark:o,children:si.map(t=>e.jsxs(ni,{isActive:i===t.code,isDark:o,onClick:()=>(async e=>{try{const t=e;$(t),(e=>{try{localStorage.setItem("flexiresume-language",e)}catch(t){D("Failed to save language preference to localStorage",t)}})(t),J.clear(),a(e),l(!1)}catch(t){}})(t.code),children:[e.jsx("span",{children:t.icon}),e.jsx("span",{children:t.nativeName}),e.jsx(oi,{visible:i===t.code,isDark:o,children:"✓"})]},t.code))})]})},ci=p.div`
  position: relative;
  display: inline-block;
`,di=p.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: ${e=>e.isDark?"var(--color-accent)":"var(--color-primary)"};
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
`,mi=p.div.withConfig({shouldForwardProp:e=>"isVisible"!==e})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${e=>e.isVisible?"scale(1) rotate(0deg)":"scale(0) rotate(180deg)"};
  opacity: ${e=>e.isVisible?1:0};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`,pi=p.div`
  position: relative;
  
  &::before {
    content: '☀️';
    font-size: 20px;
    display: block;
  }
`,hi=p.div`
  position: relative;
  
  &::before {
    content: '🌙';
    font-size: 18px;
    display: block;
  }
`,ui=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e&&"isVisible"!==e})`
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
`,gi=p.div.withConfig({shouldForwardProp:e=>"isActive"!==e})`
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
`,fi=({className:t,showTooltip:i=!0})=>{const{mode:a,toggleMode:n,isDark:o}=Ie(),{t:s}=mt(),[l,c]=r.useState(!1),[d,m]=r.useState(!1),p=o?s.common.lightMode:s.common.darkMode;return e.jsxs(ci,{className:t,"data-theme-switcher":!0,onMouseEnter:()=>c(!0),onMouseLeave:()=>c(!1),children:[e.jsxs(di,{isDark:o,onClick:()=>{m(!0),setTimeout(()=>m(!1),600),n()},title:p,"aria-label":p,children:[e.jsx(gi,{isActive:d}),e.jsx(mi,{isVisible:!o,children:e.jsx(pi,{})}),e.jsx(mi,{isVisible:o,children:e.jsx(hi,{})})]}),i&&e.jsx(ui,{isDark:o,isVisible:l,children:p})]})},bi=p.div`
  position: relative;
  display: inline-block;
`,xi=p.button`
  background: ${e=>e.$isDark?"var(--color-surface)":"var(--color-card)"};
  border: 1px solid var(--color-border-medium);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: space-between;

  &:hover {
    background: var(--color-surface);
    border-color: var(--color-primary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px var(--color-shadow-medium);
  }

  &:active {
    transform: translateY(0);
  }

  .icon {
    font-size: 16px;
    transition: transform 0.3s ease;
  }

  &.open .icon {
    transform: rotate(180deg);
  }
`,yi=p.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: ${e=>e.$isDark?"var(--color-surface)":"var(--color-card)"};
  border: 1px solid var(--color-border-medium);
  border-radius: 8px;
  box-shadow: 0 -4px 12px var(--color-shadow-dark);
  z-index: 1000;
  margin-bottom: 4px;
  max-height: 300px;
  overflow-y: auto;
  opacity: ${e=>e.$isOpen?1:0};
  visibility: ${e=>e.$isOpen?"visible":"hidden"};
  transform: ${e=>e.$isOpen?"translateY(0)":"translateY(10px)"};
  transition: all 0.3s ease;
`,wi=p.div`
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
  }
`,vi=p.div`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,ki=p.button`
  width: 100%;
  background: none;
  border: none;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  color: var(--color-text-primary);
  font-family: ${e=>e.$fontFamily};
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:hover {
    background: var(--color-surface);
  }

  ${e=>e.$isSelected&&"\n    background: var(--color-primary);\n    color: var(--color-text-inverse);\n    \n    &:hover {\n      background: var(--color-primary);\n    }\n  "}

  .font-name {
    font-weight: 500;
  }

  .font-description {
    font-size: 12px;
    opacity: 0.8;
    font-family: inherit;
  }
`,Ci=p.div`
  padding: 12px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 12px;
`,Si={[Ot.ANCIENT_CHINESE]:"古典中文",[Ot.MODERN_CHINESE]:"现代中文",[Ot.ENGLISH]:"英文字体",[Ot.MIXED]:"混合字体"},Di=()=>{const{isDark:t}=Ie(),{currentFont:i,setFontByName:n,availableFonts:o,isLoading:s,loadedFonts:l}=a.useContext(Jt)||(Xt.extend("warn")("useFontContext must be used within a FontProvider, using default font context"),{currentFont:Kt,setFont:()=>{},setFontByName:()=>{},setFontByType:()=>{},availableFonts:Gt,fontCSS:Vt(Kt),isLoading:!1,loadedFonts:new Set}),[c,d]=a.useState(!1);return r.useEffect(()=>{const e=()=>{d(!1)};if(c)return document.addEventListener("click",e),()=>{document.removeEventListener("click",e)}},[c]),e.jsxs(bi,{onClick:e=>{e.stopPropagation()},children:[e.jsxs(xi,{$isDark:t,className:c?"open":"",onClick:e=>{e.stopPropagation(),d(!c)},disabled:s,children:[e.jsx("span",{children:i.primary.displayName}),e.jsx("span",{className:"icon",children:"▼"})]}),e.jsxs(yi,{$isOpen:c,$isDark:t,children:[s&&e.jsx(Ci,{children:"正在加载字体..."}),!s&&Object.entries(o).map(([t,a])=>e.jsxs(wi,{children:[e.jsx(vi,{children:Si[t]}),a.map(t=>e.jsxs(ki,{$isSelected:i.primary.name===t.name,$fontFamily:`"${t.fontFamily}", ${t.fallbacks.join(", ")}`,onClick:()=>{return e=t.name,n(e),void d(!1);var e},children:[e.jsxs("div",{className:"font-name",children:[t.displayName,l.has(t.fontFamily)&&" ✓"]}),e.jsx("div",{className:"font-description",children:t.description})]},t.name))]},t))]})]})},Fi=S("PDFDownloader"),ji=S("pdf");var Ei=!1;class Li{static instance;isActivated=!1;static getInstance(){return Li.instance||(Li.instance=new Li),Li.instance}activatePrintStyle(e="standard"){ji(`激活打印样式，模式: ${e}`),"standard"===e?(document.body.classList.add("print-mode-active"),this.isActivated=!0,ji("已激活标准打印样式")):(document.body.classList.remove("print-mode-active"),this.isActivated=!1,ji("原版模式：未激活全局打印样式"))}deactivatePrintStyle(){ji("取消激活打印样式"),document.body.classList.remove("print-mode-active"),this.isActivated=!1}isStyleActivated(){return this.isActivated}}const Pi=Li.getInstance(),$i=p.div`
  position: relative;
  display: inline-block;
`,zi=p.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${e=>e.isDark?"var(--color-surface)":"var(--color-card)"};
  border: 1px solid ${e=>e.isDark?"var(--color-border-medium)":"var(--color-border-light)"};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: ${e=>(e.isDark,"var(--color-text-primary)")};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: var(--color-card);
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px var(--color-shadow-medium);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`,Ii=p.span`
  font-size: 16px;
  line-height: 1;
`,Ti=p.span`
  font-weight: 500;
`,Mi=p.div.withConfig({shouldForwardProp:e=>"isOpen"!==e&&"isDark"!==e})`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  box-shadow: 0 -4px 12px var(--color-shadow-medium);
  backdrop-filter: blur(10px);
  z-index: 1000;
  min-width: 160px;
  opacity: ${e=>e.isOpen?1:0};
  visibility: ${e=>e.isOpen?"visible":"hidden"};
  transform: ${e=>e.isOpen?"translateY(0)":"translateY(10px)"};
  transition: all 0.3s ease;
`,Ni=p.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 0 0 6px 6px;
  }

  &:last-child {
    border-radius: 6px 6px 0 0;
  }

  &:only-child {
    border-radius: 6px;
  }

  &:hover {
    background: var(--color-card);
    color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,Ai=p.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,_i=({className:t})=>{const{isDark:i}=Ie();Ei=i;const{t:n}=mt(),[o,s]=a.useState(!1),[l,c]=a.useState(!1);function d(e=!0){const t="dark-filter-override",i=document.getElementById(t);if(i&&i.remove(),e){const e=document.createElement("style");e.id=t,e.type="text/css",e.textContent='\n            [data-theme="dark"] body::before {\n                filter: none !important;\n                -webkit-filter: none !important;\n            }\n        ',document.head.appendChild(e),Fi("已禁用深色模式背景滤镜")}else Fi("已恢复深色模式背景滤镜")}r.useEffect(()=>{const e=e=>{e.target.closest("[data-pdf-downloader]")||s(!1)};if(o)return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[o]),a.useEffect(()=>{const e=e=>{if(e.ctrlKey&&"p"===e.key){ji("检测到Ctrl+P快捷键，激活标准打印样式"),Pi.activatePrintStyle("standard");const e=()=>{ji("打印对话框关闭，清理打印样式"),Pi.deactivatePrintStyle(),window.removeEventListener("afterprint",e)};window.addEventListener("afterprint",e),setTimeout(()=>{Pi.isStyleActivated()&&(ji("备用清理：5秒后自动清理打印样式"),Pi.deactivatePrintStyle())},5e3)}};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[]);const m=async e=>{if(!l){c(!0),s(!1);try{ji(`开始生成${"color"===e?"彩色":"grayscale"===e?"黑白":"原版"}PDF`),"original"===e?(Pi.activatePrintStyle("original"),ji("原版模式：保持在线显示样式")):(Pi.activatePrintStyle("standard"),d(!0),ji(`${e}模式：激活标准打印样式`));const t=document.body.cloneNode(!0);['[data-testid="control-panel"]',"[data-pdf-downloader]",".control-panel",".floating-panel"].forEach(e=>{t.querySelectorAll(e).forEach(e=>e.remove())}),ji("准备在当前页面打印，不创建新窗口");const i="temp-pdf-print-style";let a=document.getElementById(i);a&&a.remove();const r=document.createElement("style");r.id=i,r.type="text/css";const n="original"===e?`\n          @media print {\n            /* 基础打印设置 */\n            @page {\n              size: A4;\n              margin: 1cm;\n              background: ${Ei?"#000":"#fff"};\n              background-color: ${Ei?"#000":"#fff"};\n              /* 隐藏页眉页脚 */\n              @top-left { content: none; }\n              @top-center { content: none; }\n              @top-right { content: none; }\n              @bottom-left { content: none; }\n              @bottom-center { content: none; }\n              @bottom-right { content: none; }\n            }\n \n\n            /* 强制打印背景色 */\n            html, body {\n                -webkit-print-color-adjust: exact !important;\n                color-adjust: exact !important;\n                print-color-adjust: exact !important;\n            }\n\n            /* 强制保持所有原有颜色和样式 - 最高优先级 */\n            * {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 确保HTML根元素保持主题 */\n            html {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 确保body保持背景色 */\n            body {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 深色模式特殊处理 */\n            [data-theme="dark"] {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            [data-theme="dark"] body {\n              background-color: var(--color-background) !important;\n              color: var(--color-text-primary) !important;\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 确保深色模式的背景伪元素正确显示 */\n            [data-theme="dark"] body::before {\n              content: "" !important;\n              position: fixed !important;\n              top: 0 !important;\n              left: 0 !important;\n              width: 100% !important;\n              height: 100% !important;\n              background-color: var(--color-background) !important;\n              z-index: -1 !important;\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 保持所有元素的原有样式 */\n            [data-theme="dark"] * {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 确保resume-content保持深色背景 - 最高优先级 */\n            [data-theme="dark"] [data-testid="resume-content"] {\n              background: var(--color-card) !important;\n              background-color: #2d3748 !important;\n              color: var(--color-text-primary) !important;\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 只隐藏不需要的元素，不改变任何颜色和样式 */\n            .no-print,\n            .print-hide,\n            .control-panel,\n            .floating-controls,\n            nav,\n            .navigation,\n            .tabs,\n            .tab-container,\n            button:not(.skill-item):not([class*="skill"]),\n            [data-testid="control-panel"],\n            [data-testid="development-notice"],\n            [data-pdf-downloader],\n            .pdf-downloader,\n            .control-button,\n            .floating-button,\n            [class*="control"]:not(.skill-item),\n            [class*="floating"]:not(.skill-item),\n            [class*="button"]:not(.skill-item),\n            .fixed,\n            .absolute {\n              display: none !important;\n            }\n\n            /* 确保技能标签正常显示 */\n            .skill-item,\n            [class*="skill"],\n            [class*="Skill"],\n            span[title*="了解"],\n            span[title*="熟练"],\n            span[title*="精通"],\n            span[title*="Basic"],\n            span[title*="Proficient"],\n            span[title*="Expert"],\n            span[title*="Familiar"],\n            span[title*="Experienced"],\n            span[title*="Advanced"] {\n              display: inline-flex !important;\n              visibility: visible !important;\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n          }\n        `:`\n          @media print {\n            /* 确保激活全局打印样式 */\n            body.print-mode-active {\n              /* 页面设置 */\n              @page {\n                size: A4;\n                margin: 1cm;  \n                /* 隐藏页眉页脚 */\n                @top-left { content: none; }\n                @top-center { content: none; }\n                @top-right { content: none; }\n                @bottom-left { content: none; }\n                @bottom-center { content: none; }\n                @bottom-right { content: none; }\n              }\n\n              /* 强制重置深色模式下的所有滤镜效果 */\n              [data-theme="dark"] body::before { \n                filter: none !important;\n                -webkit-filter: none !important;\n              }\n\n              /* 重置根元素和主要容器的背景 */\n              html, body, #root {\n                background: white !important;\n                background-color: white !important;\n                color: black !important;\n                filter: none !important;\n                -webkit-filter: none !important;    \n              }\n\n              /* 确保简历内容区域有白色背景 */\n              [data-testid="resume-content"],\n              .resume-content,\n              .main-content {\n                background: white !important;\n                background-color: white !important;\n                color: black !important;\n                filter: none !important;\n                -webkit-filter: none !important;    \n              }\n\n\n              /* 重置根元素和body */\n              html, body {\n                width: 100% !important;\n                height: auto !important;\n                margin: 0 !important;\n                padding: 20px !important;\n                background: white !important;\n                background-image: none !important;\n                overflow: visible !important;\n                font-size: 12pt !important;\n                line-height: 1.4 !important;\n                color: black !important;  \n                filter: none !important;\n                -webkit-filter: none !important;                  \n              }\n\n              /* 隐藏深色模式背景伪元素 */\n              [data-theme="dark"] body::before {\n                display: none !important;\n                filter: none !important;\n                -webkit-filter: none !important;    \n              }\n\n              /* 根元素打印优化 */\n              #root {\n                display: block !important;\n                width: 100% !important;\n                max-width: none !important;\n                margin: 0 !important;\n                padding: 0 !important;\n                background: white !important;\n                overflow: visible !important;\n              }\n\n              /* 隐藏不需要打印的元素 - 扩展选择器 */\n              .no-print,\n              .print-hide,\n              button:not(.skill-item):not([class*="skill"]),\n              .control-panel,\n              .floating-controls,\n              .floating-button,\n              .control-button,\n              nav,\n              .navigation,\n              .tabs,\n              .tab-container,\n              [data-testid="control-panel"],\n              [data-testid="development-notice"],\n              [data-pdf-downloader],\n              .pdf-downloader,\n              [class*="control"]:not(.skill-item):not(.category-item),\n              [class*="floating"]:not(.skill-item):not(.category-item),\n              [class*="button"]:not(.skill-item):not(.category-item),\n              [class*="Panel"],\n              [class*="Switcher"],\n              [class*="Downloader"],\n              .fixed,\n              .absolute {\n                display: none !important;\n                visibility: hidden !important;\n              }\n\n              /* 确保文本内容为黑色，但保持透明背景 */\n              p, h1, h2, h3, h4, h5, h6, li, td, th, span:not(.skill-item span), div:not(.skill-item) {\n                color: black !important;\n                /* 不强制设置背景色，保持透明 */\n              }\n\n              /* 保留技能标签的样式和颜色 */\n              .skill-item,\n              [class*="skill"],\n              [class*="Skill"],\n              span[title*="了解"],\n              span[title*="熟练"],\n              span[title*="精通"],\n              span[title*="Basic"],\n              span[title*="Proficient"],\n              span[title*="Expert"],\n              span[title*="Familiar"],\n              span[title*="Experienced"],\n              span[title*="Advanced"] {\n                background: initial !important;\n                color: initial !important;\n                -webkit-print-color-adjust: exact !important;\n                color-adjust: exact !important;\n                print-color-adjust: exact !important;\n              }\n\n              /* 技能标签内的文字保持渐变色 */\n              .skill-item span,\n              [class*="skill"] span,\n              [class*="Skill"] span {\n                background-clip: text !important;\n                -webkit-background-clip: text !important;\n                color: transparent !important;\n                background-image: inherit !important;\n                -webkit-print-color-adjust: exact !important;\n                color-adjust: exact !important;\n                print-color-adjust: exact !important;\n              }\n\n              /* 链接样式 */\n              a {\n                color: black !important;\n                text-decoration: underline !important;\n              }\n\n              /* 分页控制 */\n              .page-break-before {\n                page-break-before: always;\n              }\n\n              .page-break-after {\n                page-break-after: always;\n              }\n\n              .page-break-inside-avoid {\n                page-break-inside: avoid;\n              }\n\n              /* 黑白模式特殊处理 */\n              ${"grayscale"===e?"\n                * {\n                  filter: grayscale(100%) !important;\n                  -webkit-filter: grayscale(100%) !important;\n                }\n              ":""}\n              /* 强制重置深色模式下的所有滤镜效果 */\n                [data-theme="dark"] * {\n                  filter: none !important;\n                  -webkit-filter: none !important;\n                }\n            }\n\n            /* 调试信息 */\n            .pdf-debug-info {\n              position: fixed;\n              top: 10px;\n              right: 10px;\n              background: rgba(255,255,255,0.9) !important;\n              color: blue !important;\n              padding: 5px !important;\n              border: 2px solid blue !important;\n              z-index: 9999 !important;\n              font-size: 14px !important;\n              font-weight: bold !important;\n            }\n          }\n        `;r.textContent=n,document.head.appendChild(r),await new Promise(e=>setTimeout(e,300));const o="color"===e?"彩色版":"grayscale"===e?"黑白版":"原版";ji(`开始打印${o}`),window.print(),d(!1),setTimeout(()=>{const e=document.getElementById(i);e&&e.remove(),ji("已清理临时打印样式")},1e3),ji(`${o}PDF生成完成`)}catch(t){ji("PDF生成失败:",t),alert(`${n.common?.pdfGenerationFailed||"PDF generation failed"}: ${t instanceof Error?t.message:n.common?.unknownError||"Unknown error"}`)}finally{Pi.deactivatePrintStyle(),c(!1),d(!1),ji("PDF生成流程结束，已清理打印样式")}}};return e.jsxs($i,{className:t,"data-testid":"pdf-downloader","data-pdf-downloader":!0,children:[e.jsxs(zi,{isDark:i,onClick:()=>s(!o),disabled:l,title:n.common?.downloadPDF||"Download PDF","aria-label":n.common?.downloadPDF||"Download PDF",children:[e.jsx(Ii,{children:l?e.jsx(Ai,{}):"📄"}),e.jsx(Ti,{children:l?n.common?.generating||"Generating...":"PDF"}),!l&&e.jsx("span",{style:{transform:o?"rotate(0deg)":"rotate(180deg)",transition:"transform 0.3s ease",fontSize:"12px"},children:"▲"})]}),e.jsxs(Mi,{isOpen:o&&!l,isDark:i,children:[e.jsxs(Ni,{isDark:i,onClick:()=>m("original"),disabled:l,children:[e.jsx("span",{children:"📱"}),e.jsx("span",{children:n.common?.originalPDF||"Original PDF"})]}),e.jsxs(Ni,{isDark:i,onClick:()=>m("color"),disabled:l,children:[e.jsx("span",{children:"🎨"}),e.jsx("span",{children:n.common?.colorPDF||"Color PDF"})]}),e.jsxs(Ni,{isDark:i,onClick:()=>m("grayscale"),disabled:l,children:[e.jsx("span",{children:"⚫"}),e.jsx("span",{children:n.common?.grayscalePDF||"Grayscale PDF"})]})]})]})},Ri=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
`,Oi=p.button.withConfig({shouldForwardProp:e=>"isDark"!==e&&"active"!==e})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${e=>e.active?"var(--color-primary)":"transparent"};
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  cursor: pointer;
  color: ${e=>e.active?"var(--color-text-inverse)":"var(--color-text-primary)"};
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: ${e=>e.active?"var(--color-primary)":"var(--color-surface)"};
    border-color: var(--color-border-medium);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`,Bi=p.input.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: 60px;
  height: 4px;
  background: var(--color-border-light);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: ${e=>(e.isDark,"var(--color-primary)")};
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
`,Ui=p.span.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  font-size: 12px;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
  white-space: nowrap;
`,Gi=({className:t})=>{const{isDark:i}=Ie(),{t:r}=mt(),[n,o]=a.useState(!0),[s,l]=a.useState(.7);return a.useEffect(()=>{Ke.setEnabled(n),Ke.setGlobalVolume(s,s)},[n,s]),e.jsxs(Ri,{isDark:i,className:t,children:[n&&e.jsxs(e.Fragment,{children:[e.jsx(Ui,{isDark:i,children:"音量"}),e.jsx(Bi,{isDark:i,type:"range",min:"0",max:"1",step:"0.1",value:s,onChange:e=>{const t=parseFloat(e.target.value);l(t)},title:`音量: ${Math.round(100*s)}%`})]}),e.jsx(Oi,{isDark:i,active:n,onClick:()=>{o(!n)},title:n?"关闭音效":"开启音效",children:n?"🔊":"🔇"})]})},Hi=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px; 
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px var(--color-shadow-medium);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px var(--color-shadow-dark);
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
    min-width: 240px; /* 小屏幕下的最小宽度 */
  }
`,Ki=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: 1px;
  height: 24px;
  background: var(--color-border-light);
  transition: background 0.3s ease;
`;p.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-surface);
    border-color: var(--color-border-medium);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;const Vi=p.div.withConfig({shouldForwardProp:e=>"isCollapsed"!==e&&"isDark"!==e})`
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
`,Wi=p.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 16px var(--color-shadow-medium);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px ${e=>e.isDark?"rgba(0, 0, 0, 0.6)":"rgba(0, 0, 0, 0.15)"};
  }

  &:active {
    transform: scale(0.95);
  }
`,Zi=p.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px var(--color-shadow-medium);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 240px; /* 小屏幕下的最小宽度 */
`,Yi=p.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,Xi=p.span.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  font-size: 14px;
  font-weight: 500;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
`,qi=({className:t,collapsible:i=!1,defaultCollapsed:a=!1})=>{const{isDark:n}=Ie(),{t:o}=mt(),s=((e=768)=>{const[t,i]=r.useState(()=>"undefined"==typeof window||window.innerWidth>e);return r.useEffect(()=>{let t;const a=()=>{clearTimeout(t),t=setTimeout(()=>{i(window.innerWidth>e)},100)};return window.addEventListener("resize",a),a(),()=>{window.removeEventListener("resize",a),clearTimeout(t)}},[e]),t})(768),l=r.useMemo(()=>!1!==a?a:!s,[s,a]),[c,d]=r.useState(l),[m,p]=r.useState(!1);r.useEffect(()=>{m||d(l)},[l,m]);return i?e.jsxs(Vi,{isCollapsed:c,isDark:n,className:t,"data-testid":"control-panel",children:[e.jsx(Wi,{isDark:n,onClick:()=>{p(!0),d(!c)},title:o.common.controlPanel,"aria-label":o.common.controlPanel,children:c?"⚙️":"✕"}),!c&&e.jsxs(Zi,{isDark:n,children:[e.jsxs(Yi,{children:[e.jsx(Xi,{isDark:n,children:o.common.theme}),e.jsx(fi,{showTooltip:!1})]}),e.jsx(Ki,{isDark:n}),e.jsxs(Yi,{children:[e.jsx(Xi,{isDark:n,children:o.common.language}),e.jsx(li,{})]}),e.jsx(Ki,{isDark:n}),e.jsxs(Yi,{children:[e.jsx(Xi,{isDark:n,children:o.common.font}),e.jsx(Di,{})]}),e.jsx(Ki,{isDark:n}),e.jsxs(Yi,{children:[e.jsx(Xi,{isDark:n,children:o.common.music}),e.jsx(Gi,{})]}),e.jsx(Ki,{isDark:n}),e.jsxs(Yi,{children:[e.jsx(Xi,{isDark:n,children:o.common.downloadPDF}),e.jsx(_i,{})]})]})]}):e.jsxs(Hi,{isDark:n,className:t,"data-testid":"control-panel",children:[e.jsx(fi,{}),e.jsx(Ki,{isDark:n}),e.jsx(li,{}),e.jsx(Ki,{isDark:n}),e.jsx(Di,{}),e.jsx(Ki,{isDark:n}),e.jsx(Gi,{}),e.jsx(Ki,{isDark:n}),e.jsx(_i,{})]})},Ji=()=>null,Qi=S("LibraryPreloader"),ea=S("preloader"),ta=new class{libraries=new Map;preloadPromises=new Map;constructor(){this.initializeLibraryStates()}initializeLibraryStates(){["mermaid","svgPanZoom","katex","cytoscape"].forEach(e=>{this.libraries.set(e,{loading:!1,loaded:!1,error:null,module:null})})}async startPreloading(){const e=R(),{preloadLibraries:t}=e.performance;B()&&ea("[LibraryPreloader] 开始预加载库:",t);const i=[];t.mermaid&&i.push(this.preloadMermaid()),t.svgPanZoom&&i.push(this.preloadSvgPanZoom()),t.katex&&i.push(this.preloadKatex()),t.cytoscape&&i.push(this.preloadCytoscape()),Promise.allSettled(i).then(e=>{if(B()){const t=e.filter(e=>"fulfilled"===e.status).length,i=e.filter(e=>"rejected"===e.status).length;ea(`[LibraryPreloader] 预加载完成: ${t}个成功, ${i}个失败`)}})}async preloadMermaid(){return this.preloadLibrary("mermaid",()=>o(()=>import("./mermaid-core-C92S_ibe.js").then(e=>e.b8),__vite__mapDeps([1,2,3]),import.meta.url))}async preloadSvgPanZoom(){return this.preloadLibrary("svgPanZoom",()=>o(()=>import("./utils-CEXnc-BX.js").then(e=>e.s),__vite__mapDeps([5,2]),import.meta.url))}async preloadKatex(){return this.preloadLibrary("katex",()=>o(()=>import("./katex-CgY2OwR7.js"),[],import.meta.url))}async preloadCytoscape(){return this.preloadLibrary("cytoscape",()=>o(()=>import("./cytoscape-BKktfreJ.js").then(e=>e.b),__vite__mapDeps([6,2]),import.meta.url))}async preloadLibrary(e,t){const i=this.libraries.get(e);if(!i||i.loaded||i.loading)return;if(this.preloadPromises.has(e))return this.preloadPromises.get(e);i.loading=!0,i.error=null;const a=performance.now(),r=t().then(t=>{const r=performance.now()-a;return i.loaded=!0,i.loading=!1,i.module=t,B()&&ea(`[LibraryPreloader] ${e} 预加载成功 (${r.toFixed(2)}ms)`),t}).catch(t=>{throw i.loading=!1,i.error=t.message,B()&&Qi.extend("warn")(`[LibraryPreloader] ${e} 预加载失败:`,t),t}).finally(()=>{this.preloadPromises.delete(e)});return this.preloadPromises.set(e,r),r}async getLibrary(e){const t=this.libraries.get(e);if(!t)throw new Error(`Unknown library: ${e}`);if(t.loaded&&t.module)return t.module;if(t.loading&&this.preloadPromises.has(e))return this.preloadPromises.get(e);switch(e){case"mermaid":return this.preloadMermaid();case"svgPanZoom":return this.preloadSvgPanZoom();case"katex":return this.preloadKatex();case"cytoscape":return this.preloadCytoscape();default:throw new Error(`Unknown library: ${e}`)}}getLibraryState(e){return this.libraries.get(e)||null}getAllLibraryStates(){return new Map(this.libraries)}cleanup(){this.libraries.clear(),this.preloadPromises.clear()}},ia=S("analytics-config"),aa={baidu:{enabled:!1,siteId:"",domain:"",autoTrack:!0,debug:!1},google:{enabled:!1,measurementId:"",debug:!1,customDimensions:{},customMetrics:{},useFirebase:!0,dynamicLoading:!0},elk:{enabled:!1,endpoint:"http://localhost:5000",batchSize:10,flushInterval:5e3,debug:!1},enablePerformanceMonitoring:!0,enableErrorTracking:!0,enableUserBehaviorTracking:!0};class ra{static instance;config;constructor(){this.config=this.loadConfig()}static getInstance(){return ra.instance||(ra.instance=new ra),ra.instance}loadConfig(){const e={...aa};e.baidu={enabled:!0,siteId:"",domain:"deden.web.app",autoTrack:!0,debug:!1},e.google={enabled:!1,measurementId:"G-7LG0G58765",debug:!1,customDimensions:{},customMetrics:{},useFirebase:!1,dynamicLoading:!0},e.elk={enabled:!1,endpoint:"http://localhost:5001",batchSize:parseInt("10"),flushInterval:parseInt("5000"),debug:!1};try{const t=localStorage.getItem("analytics_config");if(t){const i=JSON.parse(t);Object.assign(e,i)}}catch(t){ia("Failed to load user analytics config: %O",t)}return e}getConfig(){return{...this.config}}getBaiduConfig(){return{...this.config.baidu}}getGoogleConfig(){return{...this.config.google}}getELKConfig(){return{...this.config.elk}}updateConfig(e){this.config={...this.config,...e};try{localStorage.setItem("analytics_config",JSON.stringify(this.config))}catch(t){ia("Failed to save analytics config: %O",t)}}setBaiduEnabled(e){this.config.baidu.enabled=e,this.updateConfig({baidu:this.config.baidu})}setGoogleEnabled(e){this.config.google.enabled=e,this.updateConfig({google:this.config.google})}setELKEnabled(e){this.config.elk.enabled=e,this.updateConfig({elk:this.config.elk})}isAnyAnalyticsEnabled(){return this.config.baidu.enabled||this.config.google.enabled||this.config.elk.enabled}getConfigSummary(){return{baiduEnabled:this.config.baidu.enabled,googleEnabled:this.config.google.enabled,elkEnabled:this.config.elk.enabled,performanceMonitoring:this.config.enablePerformanceMonitoring,errorTracking:this.config.enableErrorTracking,userBehaviorTracking:this.config.enableUserBehaviorTracking}}}const na=ra.getInstance(),oa=S("BaiduAnalytics");class sa{static instance;isInitialized=!1;siteId="fd188b066e21a8e15d579e5f0b7633a9";constructor(){}static getInstance(){return sa.instance||(sa.instance=new sa),sa.instance}async initialize(){const e=na.getBaiduConfig();if(e.enabled)if(this.isInitialized)oa("[BaiduAnalytics] Already initialized");else try{window._hmt=window._hmt||[];const t=document.createElement("script");t.src=`https://hm.baidu.com/hm.js?${this.siteId}`,t.async=!0;const i=document.getElementsByTagName("script")[0];i&&i.parentNode?i.parentNode.insertBefore(t,i):document.head.appendChild(t),this.isInitialized=!0,e.debug&&oa("[BaiduAnalytics] Initialized successfully with site ID:",this.siteId),e.autoTrack&&this.trackPageView()}catch(t){oa.extend("error")("[BaiduAnalytics] Initialization failed:",t)}else oa("[BaiduAnalytics] Disabled by configuration")}trackPageView(e,t){if(!this.isReady())return;const i=e||location.pathname+location.search;window._hmt.push(["_trackPageview",i]),na.getBaiduConfig().debug&&oa("[BaiduAnalytics] Page view tracked:",{pagePath:i,title:t})}trackEvent(e){if(!this.isReady())return;const{category:t,action:i,label:a,value:r}=e;if(!t||!i)return void oa.extend("warn")("[BaiduAnalytics] Category and action are required for event tracking");const n=["_trackEvent",t,i];a&&n.push(a),void 0!==r&&n.push(r),window._hmt.push(n),na.getBaiduConfig().debug&&oa("[BaiduAnalytics] Event tracked:",e)}trackSkillClick(e,t){this.trackEvent({category:"skill",action:"click",label:e,value:1})}trackProjectView(e,t){this.trackEvent({category:"project",action:"view",label:e,value:1})}trackContactClick(e){this.trackEvent({category:"contact",action:"click",label:e,value:1})}trackLanguageSwitch(e,t){this.trackEvent({category:"language",action:"switch",label:`${e}_to_${t}`,value:1})}trackThemeSwitch(e,t){this.trackEvent({category:"theme",action:"switch",label:`${e}_to_${t}`,value:1})}trackDownload(e,t){this.trackEvent({category:"download",action:"click",label:t||e,value:1})}trackError(e,t){this.trackEvent({category:"error",action:e,label:t,value:1})}setCustomVar(e,t,i,a=3){this.isReady()&&(e<1||e>5?oa.extend("warn")("[BaiduAnalytics] Custom variable index must be between 1 and 5"):(window._hmt.push(["_setCustomVar",e,t,i,a]),na.getBaiduConfig().debug&&oa("[BaiduAnalytics] Custom variable set:",{index:e,name:t,value:i,scope:a})))}isReady(){const e=na.getBaiduConfig();return this.isInitialized&&e.enabled?!!window._hmt||(oa.extend("warn")("[BaiduAnalytics] _hmt object not available"),!1):(e.debug&&oa("[BaiduAnalytics] Not ready:",{initialized:this.isInitialized,enabled:e.enabled}),!1)}getStatus(){const e=na.getBaiduConfig();return{initialized:this.isInitialized,enabled:e.enabled,siteId:this.siteId.substring(0,8)+"..."}}}const la=sa.getInstance();"undefined"!=typeof window&&setTimeout(()=>{la.initialize()},1e3);const ca=S("FirebaseAnalyticsLoader");class da{static instance;firebaseSDK=null;analytics=null;app=null;isLoading=!1;isLoaded=!1;loadPromise=null;constructor(){}static getInstance(){return da.instance||(da.instance=new da),da.instance}async loadFirebaseSDK(){try{if("undefined"==typeof window)return ca.extend("warn")("[FirebaseLoader] Not in browser environment"),null;if(this.firebaseSDK)return this.firebaseSDK;ca("[FirebaseLoader] Loading Firebase SDK from CDN...");const e=document.createElement("script");e.type="module",e.innerHTML="\n        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';\n        import { \n          getAnalytics, \n          isSupported, \n          logEvent, \n          setUserProperties, \n          setUserId,\n          setCurrentScreen \n        } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';\n        \n        window.__firebaseSDK = {\n          initializeApp,\n          getAnalytics,\n          isSupported,\n          logEvent,\n          setUserProperties,\n          setUserId,\n          setCurrentScreen\n        };\n        \n        window.dispatchEvent(new CustomEvent('firebaseSDKLoaded'));\n      ";const t=new Promise(t=>{const i=()=>{window.removeEventListener("firebaseSDKLoaded",i);const e=window.__firebaseSDK;e?(this.firebaseSDK=e,ca("[FirebaseLoader] Firebase SDK loaded successfully"),t(e)):(ca.extend("error")("[FirebaseLoader] Firebase SDK not found on window"),t(null))};window.addEventListener("firebaseSDKLoaded",i),e.addEventListener("error",()=>{ca.extend("error")("[FirebaseLoader] Failed to load Firebase SDK"),t(null)}),setTimeout(()=>{window.removeEventListener("firebaseSDKLoaded",i),ca.extend("error")("[FirebaseLoader] Firebase SDK load timeout"),t(null)},1e4)});return document.head.appendChild(e),await t}catch(e){return ca.extend("error")("[FirebaseLoader] Error loading Firebase SDK:",e),null}}getFirebaseConfig(){const e=na.getGoogleConfig();if(!e.enabled)return ca("[FirebaseLoader] Firebase Analytics disabled in config"),null;const t={apiKey:"",authDomain:"",projectId:"",storageBucket:"",messagingSenderId:"",appId:"",measurementId:e.measurementId||"G-7LG0G58765"};return t.apiKey&&t.projectId&&t.measurementId?t:(ca.extend("warn")("[FirebaseLoader] Firebase configuration incomplete:",{hasApiKey:!!t.apiKey,hasProjectId:!!t.projectId,hasMeasurementId:!!t.measurementId}),null)}async initialize(){if(this.isLoading&&this.loadPromise)return await this.loadPromise;if(this.isLoaded&&this.analytics)return!0;this.isLoading=!0,this.loadPromise=this._doInitialize();const e=await this.loadPromise;return this.isLoading=!1,this.isLoaded=e,e}async _doInitialize(){try{ca("[FirebaseLoader] Initializing Firebase Analytics...");const e=this.getFirebaseConfig();if(!e)return!1;const t=await this.loadFirebaseSDK();return!!t&&(await t.isSupported()?(this.app=t.initializeApp(e),ca("[FirebaseLoader] Firebase App initialized"),this.analytics=t.getAnalytics(this.app),ca("[FirebaseLoader] Firebase Analytics initialized"),!0):(ca.extend("warn")("[FirebaseLoader] Firebase Analytics not supported in this browser"),!1))}catch(e){return ca.extend("error")("[FirebaseLoader] Firebase initialization failed:",e),!1}}async logEvent(e,t){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.logEvent(this.analytics,e,t),na.getGoogleConfig().debug&&ca("[FirebaseLoader] Event logged:",{eventName:e,eventParams:t}))}catch(i){ca.extend("error")("[FirebaseLoader] Failed to log event:",i)}else ca.extend("warn")("[FirebaseLoader] Firebase not initialized, skipping event:",e)}async setUserProperties(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setUserProperties(this.analytics,e),na.getGoogleConfig().debug&&ca("[FirebaseLoader] User properties set:",e))}catch(t){ca.extend("error")("[FirebaseLoader] Failed to set user properties:",t)}else ca.extend("warn")("[FirebaseLoader] Firebase not initialized, skipping user properties")}async setUserId(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setUserId(this.analytics,e),na.getGoogleConfig().debug&&ca("[FirebaseLoader] User ID set:",e))}catch(t){ca.extend("error")("[FirebaseLoader] Failed to set user ID:",t)}else ca.extend("warn")("[FirebaseLoader] Firebase not initialized, skipping user ID")}async setCurrentScreen(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setCurrentScreen(this.analytics,e),na.getGoogleConfig().debug&&ca("[FirebaseLoader] Current screen set:",e))}catch(t){ca.extend("error")("[FirebaseLoader] Failed to set current screen:",t)}else ca.extend("warn")("[FirebaseLoader] Firebase not initialized, skipping screen tracking")}getStatus(){const e=this.getFirebaseConfig();return{isLoaded:this.isLoaded,isLoading:this.isLoading,hasAnalytics:!!this.analytics,hasApp:!!this.app,configValid:!!e}}reset(){this.firebaseSDK=null,this.analytics=null,this.app=null,this.isLoading=!1,this.isLoaded=!1,this.loadPromise=null,"undefined"!=typeof window&&delete window.__firebaseSDK}}const ma=da.getInstance(),pa=S("GoogleAnalytics");class ha{static instance;isInitialized=!1;analytics=null;measurementId="";constructor(){}static getInstance(){return ha.instance||(ha.instance=new ha),ha.instance}async initialize(){const e=na.getGoogleConfig();if(e.enabled)if(e.measurementId)if(this.isInitialized)pa("[GoogleAnalytics] Already initialized");else{this.measurementId=e.measurementId;try{if(await this.initializeWithFirebase())return this.isInitialized=!0,void(e.debug&&pa("[GoogleAnalytics] Initialized with Firebase Analytics"));if(await this.initializeWithGtag())return this.isInitialized=!0,void(e.debug&&pa("[GoogleAnalytics] Initialized with gtag.js"));throw new Error("Failed to initialize with any method")}catch(t){pa.extend("error")("[GoogleAnalytics] Initialization failed:",t)}}else pa.extend("warn")("[GoogleAnalytics] Measurement ID not provided");else pa("[GoogleAnalytics] Disabled by configuration")}async initializeWithFirebase(){try{return pa("[GoogleAnalytics] Initializing with Firebase Analytics Loader..."),await ma.initialize()?(this.analytics={},pa("[GoogleAnalytics] Firebase Analytics initialized via dynamic loader"),!0):(pa.extend("warn")("[GoogleAnalytics] Firebase Analytics initialization failed"),!1)}catch(e){return pa.extend("warn")("[GoogleAnalytics] Firebase initialization failed:",e),!1}}async initializeWithGtag(){try{window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)},window.gtag("js",new Date),window.gtag("config",this.measurementId,{debug_mode:na.getGoogleConfig().debug});const e=document.createElement("script");return e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`,new Promise(t=>{e.onload=()=>t(!0),e.onerror=()=>t(!1),document.head.appendChild(e)})}catch(e){return pa.extend("warn")("[GoogleAnalytics] gtag.js initialization failed:",e),!1}}trackPageView(e){if(!this.isReady())return;const t=na.getGoogleConfig(),i={page_title:e?.page_title||document.title,page_location:e?.page_location||window.location.href,page_path:e?.page_path||window.location.pathname,...e};try{this.analytics?import("firebase/analytics").then(({logEvent:e})=>{e(this.analytics,"page_view",i)}).catch(e=>{pa.extend("warn")("[GoogleAnalytics] Firebase analytics import failed:",e)}):window.gtag&&window.gtag("event","page_view",i),t.debug&&pa("[GoogleAnalytics] Page view tracked:",i)}catch(a){pa.extend("error")("[GoogleAnalytics] Page view tracking failed:",a)}}trackEvent(e){if(!this.isReady())return;const t=na.getGoogleConfig(),{action:i,category:a,label:r,value:n,custom_parameters:o}=e;if(!i)return void pa.extend("warn")("[GoogleAnalytics] Event action is required");const s={event_category:a||"engagement",event_label:r,value:n,...o};Object.keys(s).forEach(e=>{void 0===s[e]&&delete s[e]});try{this.analytics?ma.logEvent(i,s).catch(e=>{pa.extend("warn")("[GoogleAnalytics] Firebase analytics event failed:",e)}):window.gtag&&window.gtag("event",i,s),t.debug&&pa("[GoogleAnalytics] Event tracked:",{action:i,...s})}catch(l){pa.extend("error")("[GoogleAnalytics] Event tracking failed:",l)}}trackSkillClick(e,t){this.trackEvent({action:"skill_click",category:"user_interaction",label:e,custom_parameters:{skill_category:t,interaction_type:"click"}})}trackProjectView(e,t){this.trackEvent({action:"project_view",category:"content",label:e,custom_parameters:{project_type:t,content_type:"project"}})}trackContactClick(e,t){this.trackEvent({action:"contact_click",category:"user_interaction",label:e,custom_parameters:{contact_method:e,contact_value:t}})}trackLanguageSwitch(e,t){this.trackEvent({action:"language_change",category:"user_preference",label:`${e}_to_${t}`,custom_parameters:{previous_language:e,new_language:t}})}trackThemeSwitch(e,t){this.trackEvent({action:"theme_change",category:"user_preference",label:`${e}_to_${t}`,custom_parameters:{previous_theme:e,new_theme:t}})}trackDownload(e,t){this.trackEvent({action:"file_download",category:"engagement",label:t||e,custom_parameters:{file_type:e,file_name:t}})}trackError(e,t,i=!1){this.trackEvent({action:"exception",category:"error",label:e,custom_parameters:{description:t,fatal:i}})}setUserProperty(e,t){if(!this.isReady())return;const i=na.getGoogleConfig();try{this.analytics?ma.setUserProperties({[e]:t}).catch(e=>{pa.extend("warn")("[GoogleAnalytics] Firebase analytics user property failed:",e)}):window.gtag&&window.gtag("config",this.measurementId,{user_properties:{[e]:t}}),i.debug&&pa("[GoogleAnalytics] User property set:",{propertyName:e,propertyValue:t})}catch(a){pa.extend("error")("[GoogleAnalytics] Set user property failed:",a)}}isReady(){const e=na.getGoogleConfig();return this.isInitialized&&e.enabled?!(!this.analytics&&!window.gtag&&(pa.extend("warn")("[GoogleAnalytics] No analytics instance available"),1)):(e.debug&&pa("[GoogleAnalytics] Not ready:",{initialized:this.isInitialized,enabled:e.enabled}),!1)}getStatus(){const e=na.getGoogleConfig();let t="none";this.analytics?t="firebase":window.gtag&&(t="gtag");const i={initialized:this.isInitialized,enabled:e.enabled,measurementId:this.measurementId.substring(0,8)+"...",method:t};return"firebase"===t&&(i.firebaseLoader=ma.getStatus()),i}}const ua=ha.getInstance(),ga=S("elk");class fa{static instance;eventQueue=[];flushTimer=null;sessionId;constructor(){this.sessionId=this.generateSessionId(),this.setupAutoFlush(),this.setupPageUnloadHandler()}static getInstance(){return fa.instance||(fa.instance=new fa),fa.instance}generateSessionId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}setupAutoFlush(){const e=na.getELKConfig();e.enabled&&(this.flushTimer=setInterval(()=>{this.flushEvents()},e.flushInterval||5e3))}setupPageUnloadHandler(){window.addEventListener("beforeunload",()=>{this.flushEvents(!0)})}createBaseEvent(e,t){return{timestamp:(new Date).toISOString(),event_type:e,page:window.location.pathname,source:"flexiresume",user_agent:navigator.userAgent,referrer:document.referrer,data:{session_id:this.sessionId,...t}}}addEvent(e){const t=na.getELKConfig();t.enabled?(this.eventQueue.push(e),this.eventQueue.length>=(t.batchSize||10)&&this.flushEvents(),t.debug&&ga("Event added to queue: %O",e)):t.debug&&ga("Disabled, event not added: %O",e)}async flushEvents(e=!1){const t=na.getELKConfig();if(!t.enabled||0===this.eventQueue.length)return;const i=[...this.eventQueue];this.eventQueue=[];try{const a={events:i,source:"flexiresume",timestamp:(new Date).toISOString()};if(e&&navigator.sendBeacon)navigator.sendBeacon(t.endpoint,JSON.stringify(a));else{const e=await fetch(t.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});e.ok?t.debug&&ga("Events sent successfully: %d",i.length):(ga("Failed to send events: %s",e.statusText),i.length<(t.batchSize||10)&&this.eventQueue.unshift(...i))}}catch(a){ga("Error sending events: %O",a),i.length<(t.batchSize||10)&&this.eventQueue.unshift(...i)}}trackPageView(e,t){const i=this.createBaseEvent("page_view",{title:e||document.title,url:t||window.location.href,timestamp:Date.now()});this.addEvent(i)}trackUserInteraction(e,t,i,a){const r=this.createBaseEvent("user_interaction",{action:e,element:t,element_text:i,value:a,timestamp:Date.now()});this.addEvent(r)}trackPerformance(e,t,i,a){const r=this.createBaseEvent("performance",{metric_name:e,metric_value:t,metric_unit:i,additional_data:a,timestamp:Date.now()});this.addEvent(r)}trackError(e,t,i,a,r="medium"){const n=this.createBaseEvent("error",{error_type:e,error_message:t,error_stack:i,component:a,severity:r,timestamp:Date.now()});this.addEvent(n)}trackSkillClick(e,t){this.trackUserInteraction("skill_click","skill_tag",e,t)}trackProjectView(e,t){this.trackUserInteraction("project_view","project_card",e,t)}trackContactClick(e,t){this.trackUserInteraction("contact_click","contact_info",e,t)}trackLanguageSwitch(e,t){this.trackUserInteraction("language_switch","language_toggle",`${e}_to_${t}`)}trackThemeSwitch(e,t){this.trackUserInteraction("theme_switch","theme_toggle",`${e}_to_${t}`)}trackDownload(e,t){this.trackUserInteraction("download","download_button",e,t)}getStatus(){const e=na.getELKConfig();return{enabled:e.enabled,sessionId:this.sessionId,queueSize:this.eventQueue.length,endpoint:e.endpoint}}setEnabled(e){na.setELKEnabled(e),e?this.setupAutoFlush():(this.flushTimer&&(clearInterval(this.flushTimer),this.flushTimer=null),this.eventQueue=[])}}const ba=fa.getInstance();function xa(e){const{labelFormat:t}=function(){const e=R();return{labelFormat:e.tabs.labelFormat,labelSeparator:e.tabs.labelSeparator}}();return function(e,t){if(!t)return t?.position||"";let i=e;return Object.keys(t).forEach(e=>{const a=t[e];if(null!=a){const t=`{${e}}`;i=i.replace(new RegExp(t.replace(/[{}]/g,"\\$&"),"g"),String(a))}}),i=i.replace(/\{[^}]*\}/g,""),i=i.replace(/\s*\/\s*$/,"").replace(/^\s*\/\s*/,"").trim(),i||t.position||""}(t,e)}"undefined"!=typeof window&&(window.addEventListener("load",()=>{const e=performance.getEntriesByType("navigation")[0];e&&(ba.trackPerformance("page_load_time",e.loadEventEnd-e.loadEventStart,"ms"),ba.trackPerformance("dom_content_loaded",e.domContentLoadedEventEnd-e.domContentLoadedEventStart,"ms"),ba.trackPerformance("first_contentful_paint",performance.getEntriesByType("paint")[1]?.startTime||0,"ms"))}),window.addEventListener("error",e=>{ba.trackError("javascript_error",e.message,e.error?.stack,void 0,"high")}),window.addEventListener("unhandledrejection",e=>{ba.trackError("unhandled_promise_rejection",e.reason?.message||"Unhandled promise rejection",e.reason?.stack,void 0,"high")}));const ya=S("FontPerformanceMonitor"),wa=({visible:t=!1,position:i="bottom-right"})=>{const[r,n]=a.useState({loadedFonts:[],cacheStats:{size:0,memoryUsage:0,memoryUsageMB:0,averageAccessCount:0},performanceMetrics:{fontLoadTime:0,cacheHitRate:0,totalRequests:0}}),[o,s]=a.useState(!1);return a.useEffect(()=>{if(!t)return;const e=()=>{try{const e=Zt.getLoadedFonts(),t=Zt.getCacheStats(),i=performance.getEntriesByType("navigation")[0]?.loadEventEnd||0;n({loadedFonts:e,cacheStats:t,performanceMetrics:{fontLoadTime:i,cacheHitRate:t.size>0?t.averageAccessCount/t.size*100:0,totalRequests:t.size}}),ya(`Font stats updated: ${e.length} fonts loaded, ${t.memoryUsageMB.toFixed(2)}MB cached`)}catch(e){ya.extend("error")("Failed to update font stats:",e)}};e();const i=setInterval(e,5e3);return()=>clearInterval(i)},[t]),t?e.jsxs("div",{style:{position:"fixed",...{"top-left":{top:"20px",left:"20px"},"top-right":{top:"20px",right:"20px"},"bottom-left":{bottom:"20px",left:"20px"},"bottom-right":{bottom:"20px",right:"20px"}}[i],backgroundColor:"rgba(0, 0, 0, 0.8)",color:"white",padding:"10px",borderRadius:"8px",fontSize:"12px",fontFamily:"monospace",zIndex:9999,minWidth:"200px",maxWidth:"400px",backdropFilter:"blur(5px)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",marginBottom:o?"10px":"0"},onClick:()=>s(!o),children:[e.jsx("span",{children:"🎨 字体性能监控"}),e.jsx("span",{children:o?"▼":"▶"})]}),o&&e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{children:"📊 基本统计"}),e.jsxs("div",{children:["已加载字体: ",r.loadedFonts.length]}),e.jsxs("div",{children:["缓存项目: ",r.cacheStats.size]}),e.jsxs("div",{children:["缓存内存: ",r.cacheStats.memoryUsageMB.toFixed(2),"MB"]})]}),e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{children:"⚡ 性能指标"}),e.jsxs("div",{children:["加载时间: ",r.performanceMetrics.fontLoadTime.toFixed(0),"ms"]}),e.jsxs("div",{children:["缓存命中率: ",r.performanceMetrics.cacheHitRate.toFixed(1),"%"]}),e.jsxs("div",{children:["平均访问: ",r.cacheStats.averageAccessCount.toFixed(1)]})]}),e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{children:"🎯 已加载字体"}),e.jsx("div",{style:{maxHeight:"100px",overflowY:"auto"},children:r.loadedFonts.length>0?r.loadedFonts.map((t,i)=>e.jsxs("div",{style:{fontSize:"10px",opacity:.8},children:["• ",t]},i)):e.jsx("div",{style:{fontSize:"10px",opacity:.6},children:"暂无已加载字体"})})]}),e.jsxs("div",{style:{display:"flex",gap:"5px"},children:[e.jsx("button",{onClick:()=>{Zt.clearCache(),ya("Font cache cleared manually")},style:{backgroundColor:"#ff4444",color:"white",border:"none",padding:"4px 8px",borderRadius:"4px",fontSize:"10px",cursor:"pointer"},children:"清理缓存"}),e.jsx("button",{onClick:()=>{te.logMemoryUsage(),ya("Memory cleanup triggered")},style:{backgroundColor:"#4444ff",color:"white",border:"none",padding:"4px 8px",borderRadius:"4px",fontSize:"10px",cursor:"pointer"},children:"内存检查"})]})]})]}):null},va=S("ImageErrorHandler"),ka=new class{retryMap=new Map;isInitialized=!1;maxRetries=3;initialize(){if(this.isInitialized)return;this.setupGlobalErrorHandler(),this.setupMutationObserver(),this.isInitialized=!0;const e=ht(pt());va(e.common.imageErrorHandlerInitialized)}setupGlobalErrorHandler(){document.addEventListener("error",this.handleImageError.bind(this),!0),this.processExistingImages()}setupMutationObserver(){new MutationObserver(e=>{e.forEach(e=>{e.addedNodes.forEach(e=>{if(e.nodeType===Node.ELEMENT_NODE){const t=e;"IMG"===t.tagName&&this.setupImageErrorHandling(t),t.querySelectorAll("img").forEach(e=>{this.setupImageErrorHandling(e)})}})})}).observe(document.body,{childList:!0,subtree:!0})}processExistingImages(){document.querySelectorAll("img").forEach(e=>{this.setupImageErrorHandling(e)})}setupImageErrorHandling(e){this.retryMap.has(e)||e.closest(".smart-image-loading, .smart-image-error")||e.src.startsWith("data:")||e.src.startsWith("blob:")||this.retryMap.set(e,{element:e,originalSrc:e.src,retryCount:0,cdnIndex:0,maxRetries:this.maxRetries})}handleImageError(e){const t=e.target;if("IMG"!==t.tagName)return;const i=this.retryMap.get(t);if(!i)return;const a=ht(pt());va.extend("warn")(`${a.common.imageLoadFailed}: ${t.src}`),this.tryNextCDN(i)}tryNextCDN(e){const{element:t,originalSrc:i,retryCount:a,cdnIndex:r}=e,n=O();if(n.enabled&&0!==n.baseUrls.length)if(r<n.baseUrls.length-1){const a=r+1,o=this.buildCDNUrl(n.baseUrls[a],i);e.cdnIndex=a,t.src=o,va(`尝试CDN ${a+1}/${n.baseUrls.length}: ${o}`)}else if(a<e.maxRetries){const r=a+1;e.retryCount=r,e.cdnIndex=0,setTimeout(()=>{const a=this.buildCDNUrl(n.baseUrls[0],i);t.src=a,va(`重试 ${r}/${e.maxRetries}: ${a}`)},1e3*r)}else this.tryLocalFallback(e);else this.handleFinalFailure(e)}tryLocalFallback(e){const{element:t,originalSrc:i}=e;try{const e=Y.getResourceUrl(i,{enableFallback:!0,cacheUrls:!1});if(e!==t.src)return t.src=e,void va(`尝试本地回退: ${e}`)}catch(a){va.extend("error")("本地回退失败:",a)}this.handleFinalFailure(e)}handleFinalFailure(e){const{element:t,originalSrc:i}=e,a=ht(pt());va.extend("error")(a.common.imageFinalLoadFailed+`: ${i}`);const r=document.createElement("div");r.className="image-error-placeholder",r.style.cssText="\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      min-height: 100px;\n      min-width: 150px;\n      background-color: #f5f5f5;\n      color: #999;\n      font-size: 14px;\n      border: 1px dashed #ddd;\n      border-radius: 4px;\n    ",r.textContent=a.common.imageLoadFailed,t.style.width&&(r.style.width=t.style.width),t.style.height&&(r.style.height=t.style.height),t.className&&(r.className+=` ${t.className}`),t.parentNode?.replaceChild(r,t),this.retryMap.delete(t)}buildCDNUrl(e,t){let i=t;try{i=new URL(t).pathname}catch{}const a=e.endsWith("/")?e.slice(0,-1):e;return i=i.startsWith("/")?i.slice(1):i,`${a}/${i}`}destroy(){if(!this.isInitialized)return;document.removeEventListener("error",this.handleImageError.bind(this),!0),this.retryMap.clear(),this.isInitialized=!1;const e=ht(pt());va(e.common.imageErrorHandlerDestroyed)}setMaxRetries(e){this.maxRetries=Math.max(0,e)}getRetryStats(){const e=this.retryMap.size;let t=0,i=0;return this.retryMap.forEach(e=>{e.retryCount>=e.maxRetries?t++:i++}),{total:e,failed:t,retrying:i}}};"undefined"!=typeof window&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{ka.initialize()}):ka.initialize());const Ca=S("main"),Sa=a.lazy(()=>o(()=>import("./FlexiResume-CQJYq4EW.js"),__vite__mapDeps([7,8,2,9,1,3,10,5,11]),import.meta.url)),Da=()=>{const[t,i]=a.useState(null),[r,n]=a.useState([]),[o,s]=a.useState([]),[l,c]=a.useState("/"),[d,m]=a.useState(!0),[p,h]=a.useState("checking"),u=async()=>{try{h("checking");const e=R(),t=[];e.cdn.enabled&&e.cdn.healthCheck.enabled&&(Ca("Initializing CDN health check..."),t.push(Y.initialize())),Ca("Starting library preloading..."),t.push(ta.startPreloading()),await Promise.allSettled(t),e.performance.enablePreloading&&e.performance.preloadResources.length>0&&Y.preloadResources(e.performance.preloadResources).catch(e=>{Ca("Resource preloading failed: %O",e)}),ka.initialize(),Ca("Image error handler initialized"),h("ready")}catch(e){Ca("CDN initialization failed: %O",e),h("error")}},g=async()=>{try{m(!0);const e=await I();i(e),await(async()=>{try{re=await I()}catch(e){ie("Failed to update data cache: %O",e)}})();const t=(e=>Object.keys(e.expected_positions).filter(t=>!e.expected_positions[t].hidden).map(t=>{const i=e.expected_positions[t],a=i.header_info;return[xa({name:a?.name,position:a?.position}),"/"+t,!!i.is_home_page,a?.avatar]}))(e),a=(e=>Object.keys(e.expected_positions).map(t=>({key:t,title:e.expected_positions[t].header_info?.position||t,path:"/"+t,isHomePage:!!e.expected_positions[t].is_home_page,hidden:!!e.expected_positions[t].hidden})))(e);n(t),s(a),c((e=>e.find(([,,e])=>e)?.[1]||e[0][1]||"/")(t)),C.tabs=t}catch(e){Ca("Failed to load language data: %O",e)}finally{m(!1)}},w=async()=>{try{Ca("Initializing analytics..."),await la.initialize(),await ua.initialize();const e=la.getStatus(),t=ua.getStatus(),i=ba.getStatus();Ca("Analytics status: %O",{baidu:e,google:t,elk:i,config:na.getConfigSummary()}),ba.trackPageView("App Initialized",window.location.href)}catch(e){Ca("Analytics initialization failed: %O",e)}};return a.useEffect(()=>{var e;return(async()=>{await Promise.all([u(),g(),w()])})(),e=()=>{g()},L.push(e),()=>{const t=L.indexOf(e);t>-1&&L.splice(t,1)}},[]),function(){const e=()=>{document.querySelectorAll(".lazy-video").forEach(e=>{const t=e.getBoundingClientRect();t.top<window.innerHeight+200&&t.bottom>0&&(e=>{const t=JSON.parse(e.dataset.sources),i=O().baseUrls.slice(0,3);let a="";i.forEach((e,i)=>{const r=t.original.startsWith("/")?`${e.endsWith("/")?e.slice(0,-1):e}${t.original}`:`${e.endsWith("/")?e:e+"/"}${t.original}`;a+=`<source src="${r}" type="video/mp4">\n        `});let r=t.original;try{r=Y.getResourceUrl(t.original,{enableFallback:!0,localBasePath:"",cacheUrls:!1})}catch(o){ae("Failed to build local fallback URL: %O",o)}a+=`<source src="${t.original}" type="video/mp4">`,e.innerHTML=a,e.classList.remove("lazy-video"),e.removeAttribute("data-sources");const n=e.parentNode.querySelector(".loading-indicator");n?.remove()})(e)})};let t;window.addEventListener("scroll",()=>{t&&clearTimeout(t),t=setTimeout(e,100)}),window.addEventListener("resize",e),window.addEventListener("mouseup",()=>setTimeout(e,0)),e()}(),d||!t?e.jsx(ze,{children:e.jsx(dt,{children:e.jsxs(jt,{level:"page",maxRetries:3,children:[e.jsx(Ce,{}),e.jsx(qi,{collapsible:!0}),e.jsxs("div",{style:{position:"fixed",top:"20px",right:"20px",background:"rgba(0,0,0,0.8)",color:"white",padding:"8px 12px",borderRadius:"4px",fontSize:"12px",zIndex:9999},children:["checking"===p&&"🔄 检测CDN...","ready"===p&&"✅ CDN就绪","error"===p&&"⚠️ CDN检测失败"]}),e.jsx(At,{})]})})}):e.jsx(ze,{children:e.jsx(Qt,{children:e.jsx(dt,{children:e.jsx(jt,{level:"page",maxRetries:3,children:e.jsxs(st,{children:[e.jsx(Ce,{}),e.jsx(qi,{collapsible:!0}),e.jsxs(f,{basename:t.header_info.route_base_name,children:[e.jsx(et,{})," ",e.jsxs(b,{children:[o.map((t,i)=>e.jsx(x,{path:t.path,element:e.jsx(jt,{level:"section",maxRetries:2,children:e.jsx(a.Suspense,{fallback:e.jsx(At,{}),children:e.jsx(Sa,{path:t.path})})})},i)),o.map((t,i)=>{const a=t.path+".html";return e.jsx(x,{path:a,element:e.jsx(y,{to:t.path,replace:!0})},`html-${i}`)}),e.jsx(x,{path:"/",element:e.jsx(y,{to:l})})]})]}),e.jsx(Ji,{}),e.jsx(wa,{position:"bottom-left"})]})})})})})};v(document.getElementById("root")).render(e.jsx(a.StrictMode,{children:e.jsx(Da,{})}));export{dt as I,At as S,Lt as a,J as b,pe as c,mt as d,ta as e,C as f,S as g,v as h,ue as i,he as j,Fe as k,se as l,Le as m,Ke as n,ce as o,je as p,Ee as q,ge as r,Ie as u,me as w};
