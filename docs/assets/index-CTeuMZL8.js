const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Data-Bvcv7J65.js","./mermaid-core-hyY6ZuoR.js","./react-vendor-DQmNySUk.js","./d3-charts-C9eKmPJg.js","./Data-Dxssfw9w.js","./utils-CEXnc-BX.js","./cytoscape-BKktfreJ.js","./FlexiResume-BepBF0H4.js","./framer-motion-CXdLbqfN.js","./vendor-dpLbKSu4.js","./react-icons-mdDy3BM0.js","./react-markdown-bO4N7J-8.js"])))=>i.map(i=>d[i]);
import{j as e,m as t}from"./framer-motion-CXdLbqfN.js";import{b as a,r as i,R as r}from"./react-vendor-DQmNySUk.js";import{aJ as n,_ as o}from"./mermaid-core-hyY6ZuoR.js";import{m as s,r as l,l as c,a as d,f as p,d as m,u as h,b as u,N as g,B as f,R as b,c as x,e as y}from"./vendor-dpLbKSu4.js";import{G as w}from"./react-icons-mdDy3BM0.js";import"./d3-charts-C9eKmPJg.js";var v;!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const a of e)if("childList"===a.type)for(const e of a.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)}).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var k=a;v=k.createRoot,k.hydrateRoot;const C=new class{data={};tabs=[];skillMap=[];skills=[];collapsedMap=new Map;constructor(){s(this);const e=this.collapsedMap.set;this.collapsedMap.set=function(t,a){ne("Store",a,t),e.call(this,t,a)}}};function S(e){return n("app:"+e)}const D=S("dataloader"),F="zh";let j=F;const P=new Map,L=[],$=()=>j,E=e=>{j!==e&&(j=e,L.forEach(t=>t(e)))},T=async e=>{if(P.has(e))return P.get(e);try{let t;if("zh"===e)t=await o(()=>import("./Data-Bvcv7J65.js"),__vite__mapDeps([0,1,2,3]),import.meta.url);else{if("en"!==e)throw new Error(`Unsupported language: ${e}`);t=await o(()=>import("./Data-Dxssfw9w.js"),__vite__mapDeps([4,1,2,3]),import.meta.url)}const a=t.default;return P.set(e,a),a}catch(t){if(D(`Failed to load data for language: ${e}`,t),e!==F)return D(`Falling back to default language: ${F}`),T(F);throw t}},z=async()=>T(j),I=()=>{const e=navigator.language.toLowerCase();return e.startsWith("zh")?"zh":e.startsWith("en")?"en":F};(()=>{try{const e=localStorage.getItem("flexiresume-language");j=!e||"zh"!==e&&"en"!==e?I():e}catch(e){D("Failed to read language preference from localStorage",e),j=I()}})();const A=(e,t)=>e?e.split(",").map(e=>e.trim()).filter(Boolean):t,N=(e,t)=>e?"true"===e.toLowerCase():t,M=(e,t)=>{if(!e)return t;const a=parseInt(e,10);return isNaN(a)?t:a},_={cdn:{enabled:N("true",!0),baseUrls:A("https://deden.synology.me:8080/,https://flexiresume-static.web.app/,https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/,https://dedenlabs.github.io/flexiresume-static/",["https://flexiresume-static.web.app/","https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/","https://dedenlabs.github.io/flexiresume-static/"]),healthCheck:{timeout:M("5000",5e3),testPath:"favicon.ico",enabled:!0},sortingStrategy:{mode:"speed",enabled:!0,speedWeight:.7,availabilityWeight:.3},localOptimization:{enabled:!0,forceLocal:!1,localBasePath:""}},api:{baseUrl:"",timeout:M("10000",1e4),version:"v1"},theme:{defaultTheme:"auto",enableTransitions:N("true",!0),transitionDuration:M("300",300)},performance:{enableLazyLoading:N("true",!0),lazyLoadingThreshold:M("100",100),enablePreloading:N("true",!0),preloadResources:A("/images/avatar.webp,/images/flexi-resume.jpg",["/images/avatar.webp","/images/background.webp"]),preloadLibraries:{mermaid:!0,svgPanZoom:!0,katex:!1,cytoscape:!1}},app:{name:"FlexiResume",version:"1.0.1",buildTime:(new Date).toISOString(),isDevelopment:!1},debug:{enabled:N("false",!1),showPerformanceMonitor:!1,verboseLogging:!1},tabs:{labelFormat:"{name}",labelSeparator:" / "}},O=()=>_,B=()=>_.cdn,R=()=>_.debug.enabled,U=S("CDNHealthChecker");class G{static instance;healthResults=new Map;isChecking=!1;checkPromise=null;constructor(){}static getInstance(){return G.instance||(G.instance=new G),G.instance}async checkSingleCDN(e,t,a){const i=Date.now(),r=i;try{const l=e.endsWith("/")?`${e}${t}`:`${e}/${t}`;R()&&U(`[CDN Health Check] Testing: ${l}`);try{const t=await this.checkCDNWithImage(e,l,a,i,r);if(t.available)return t}catch(n){R()&&U(`[CDN Health Check] Image method failed for ${e}, trying fetch...`)}try{const t=await this.checkCDNWithFetch(e,l,a,i,r,"HEAD");if(t.available)return t}catch(o){R()&&U(`[CDN Health Check] HEAD method failed for ${e}, trying GET...`)}try{return await this.checkCDNWithFetch(e,l,a,i,r,"GET")}catch(s){throw s}}catch(l){const t=Date.now()-i,a=l instanceof Error?l.message:"Unknown error";return R()&&U.extend("warn")(`[CDN Health Check] ${e}: FAILED - ${a} (${t}ms)`),{url:e,available:!1,responseTime:t,error:a,timestamp:r}}}async checkCDNWithImage(e,t,a,i,r){return new Promise((n,o)=>{const s=new Image;let l=!1;const c=setTimeout(()=>{l||(l=!0,o(new Error("Image load timeout")))},a);s.onload=()=>{if(!l){l=!0,clearTimeout(c);const t=Date.now()-i;R()&&U(`[CDN Health Check] ${e}: OK via image (${t}ms)`),n({url:e,available:!0,responseTime:t,timestamp:r})}},s.onerror=()=>{l||(l=!0,clearTimeout(c),o(new Error(`Image load failed: ${t}`)))};const d=`?_t=${Date.now()}&_r=${Math.random()}`;s.src=t+d})}async checkCDNWithFetch(e,t,a,i,r,n="HEAD"){const o=new AbortController,s=setTimeout(()=>o.abort(),a);try{const a=await fetch(t,{method:n,signal:o.signal,cache:"no-cache",mode:"cors"});clearTimeout(s);const l=Date.now()-i,c={url:e,available:a.ok,responseTime:l,timestamp:r};return a.ok||(c.error=`HTTP ${a.status}: ${a.statusText}`),R()&&U(`[CDN Health Check] ${e}: ${a.ok?"OK":"FAILED"} via ${n} (${l}ms)`),c}catch(l){throw clearTimeout(s),l}}async checkAllCDNs(e={}){if(this.isChecking&&this.checkPromise)return this.checkPromise;this.isChecking=!0;const t=B(),{timeout:a=t.healthCheck.timeout,testPath:i=t.healthCheck.testPath,concurrent:r=!0,maxConcurrency:n=3}=e;R()&&U(`[CDN Health Check] Starting health check for ${t.baseUrls.length} CDNs`),this.checkPromise=this.performHealthCheck(t.baseUrls,i,a,r,n);try{const e=await this.checkPromise;return e.forEach(e=>{this.healthResults.set(e.url,e)}),this.reorderCDNUrls(e),R()&&U("[CDN Health Check] Health check completed:",e),e}finally{this.isChecking=!1,this.checkPromise=null}}async performHealthCheck(e,t,a,i,r){if(i){const i=[];for(let n=0;n<e.length;n+=r){const o=e.slice(n,n+r).map(e=>this.checkSingleCDN(e,t,a)),s=await Promise.all(o);i.push(...s)}return i}{const i=[];for(const r of e){const e=await this.checkSingleCDN(r,t,a);i.push(e)}return i}}reorderCDNUrls(e){const t=B().sortingStrategy;if(!t.enabled)return void(R()&&U("[CDN Health Check] Sorting strategy disabled, keeping original order"));let a;if("availability"===t.mode){const t=e.filter(e=>e.available).sort((e,t)=>e.responseTime-t.responseTime),i=e.filter(e=>!e.available);a=[...t.map(e=>e.url),...i.map(e=>e.url)],R()&&(U("[CDN Health Check] Using availability-first strategy"),U("[CDN Health Check] Available CDNs:",t.length),U("[CDN Health Check] Unavailable CDNs:",i.length))}else{if("speed"!==t.mode)return void U.extend("warn")("[CDN Health Check] Unknown sorting strategy:",t.mode);{const i=e.filter(e=>e.available).sort((e,a)=>{const i=1/e.responseTime*t.speedWeight+(e.available?1:0)*t.availabilityWeight;return 1/a.responseTime*t.speedWeight+(a.available?1:0)*t.availabilityWeight-i}),r=e.filter(e=>!e.available);a=[...i.map(e=>e.url),...r.map(e=>e.url)],R()&&(U("[CDN Health Check] Using speed-first strategy"),U("[CDN Health Check] Speed weight:",t.speedWeight),U("[CDN Health Check] Availability weight:",t.availabilityWeight),U("[CDN Health Check] Sorted by performance:",i.map(e=>`${e.url} (${e.responseTime}ms)`)))}}var i;i={baseUrls:a},Object.assign(_.cdn,i),R()&&U("[CDN Health Check] CDN URLs reordered:",a)}getHealthResults(){return Array.from(this.healthResults.values())}getAvailableCDNs(){return Array.from(this.healthResults.values()).filter(e=>e.available).sort((e,t)=>e.responseTime-t.responseTime).map(e=>e.url)}isCDNAvailable(e){const t=this.healthResults.get(e);return!!t&&t.available}clearCache(){this.healthResults.clear()}getBestCDN(){const e=this.getAvailableCDNs();return e.length>0?e[0]:null}getAllResults(){return Array.from(this.healthResults.values())}}const K=G.getInstance(),H=S("cdn");let W=null;function V(){if(null!==W)return W;const e=B();if(!e.localOptimization.enabled)return W=!1,!1;if(e.localOptimization.forceLocal)return W=!0,!0;if(e.localOptimization.customDetection)try{const t=e.localOptimization.customDetection();return W=t,t}catch(l){H("Custom detection function failed: %O",l)}if("undefined"==typeof window)return W=!1,!1;const{hostname:t,port:a}=window.location,i="localhost"===t||"127.0.0.1"===t||"0.0.0.0"===t||t.endsWith(".local"),r=parseInt(a,10),n=a&&(r>=3e3&&r<4e3||r>=4e3&&r<5e3||r>=5e3&&r<6e3||r>=8e3&&r<9e3||r>=9e3&&r<1e4);let o=!1;const s=i&&(n||o);return W=s,H("Local development detection: %s %O",s,{hostname:t,port:a,isLocalHost:i,isDevelopmentPort:n,isDevEnvironment:o,configEnabled:e.localOptimization.enabled,forceLocal:e.localOptimization.forceLocal}),s}class Z{static instance;urlCache=new Map;isInitialized=!1;initPromise=null;constructor(){}static getInstance(){return Z.instance||(Z.instance=new Z),Z.instance}async initialize(){if(!this.isInitialized){if(this.initPromise)return this.initPromise;this.initPromise=this.performInitialization(),await this.initPromise}}async performInitialization(){const e=B();if(!e.enabled)return H("CDN is disabled, skipping health check"),void(this.isInitialized=!0);if(V())return H("Local development environment detected, skipping CDN health check and using local resources"),void(this.isInitialized=!0);if(!e.healthCheck.enabled)return R()&&H("[CDN Manager] CDN health check is disabled"),void(this.isInitialized=!0);try{if(R()&&H("[CDN Manager] Starting CDN health check..."),await K.checkAllCDNs(),R()){const e=K.getAvailableCDNs();H(`[CDN Manager] CDN health check completed. Available CDNs: ${e.length}`)}}catch(t){H.extend("error")("[CDN Manager] CDN health check failed:",t)}finally{this.isInitialized=!0,this.initPromise=null}}getResourceUrl(e,t={}){const{enableFallback:a=!0,localBasePath:i="",cacheUrls:r=!0}=t;if(r&&this.urlCache.has(e))return this.urlCache.get(e);const n=B();if(V()){const t=this.buildLocalUrl(e,i);return r&&this.urlCache.set(e,t),R()&&H(`[CDN Manager] Local development: using local resource: ${t}`),t}if(!n.enabled){const t=this.buildLocalUrl(e,i);return r&&this.urlCache.set(e,t),t}const o=K.getBestCDN();if(o){const t=this.buildCDNUrl(o,e);return r&&this.urlCache.set(e,t),t}if(K.getAllResults().length===n.baseUrls.length){if(a){const t=this.buildLocalUrl(e,i);return R()&&H.extend("warn")(`[CDN Manager] All CDNs failed health check, falling back to local: ${t}`),r&&this.urlCache.set(e,t),t}}else if(n.baseUrls.length>0){const t=n.baseUrls[0],a=this.buildCDNUrl(t,e);return R()&&H.extend("warn")(`[CDN Manager] Health check in progress, using first CDN: ${t}`),a}if(a){const t=this.buildLocalUrl(e,i);return R()&&H.extend("warn")(`[CDN Manager] No CDN available, falling back to local: ${t}`),r&&this.urlCache.set(e,t),t}throw new Error(`[CDN Manager] No CDN available and fallback is disabled for resource: ${e}`)}buildCDNUrl(e,t){return`${e.endsWith("/")?e.slice(0,-1):e}/${t.startsWith("/")?t.slice(1):t}`}projectBasePathCache=null;getProjectBasePath(){if(null!==this.projectBasePathCache)return this.projectBasePathCache;try{const e=window.location.href,t=new URL(e),a=t.origin,i=t.pathname.split("/").slice(0,-1);return this.projectBasePathCache=a+i.join("/")+"/",this.projectBasePathCache}catch(e){H.extend("error")("获取项目根路径失败:",e);const t=window.location.origin+"/";return this.projectBasePathCache=t,t}}buildLocalUrl(e,t){return(this.getProjectBasePath()||t)+e}resetPathCache(){this.projectBasePathCache=null}async preloadResources(e,t={}){const a=e.map(async e=>{try{const a=this.getResourceUrl(e,t),i=document.createElement("link");i.rel="preload",i.href=a;const r=e.split(".").pop()?.toLowerCase();switch(r){case"jpg":case"jpeg":case"png":case"webp":case"svg":i.as="image";break;case"css":i.as="style";break;case"js":i.as="script";break;case"woff":case"woff2":i.as="font",i.crossOrigin="anonymous";break;default:i.as="fetch",i.crossOrigin="anonymous"}document.head.appendChild(i),R()&&H(`[CDN Manager] Preloaded resource: ${a}`)}catch(a){H.extend("error")(`[CDN Manager] Failed to preload resource: ${e}`,a)}});await Promise.allSettled(a)}getCDNHealthStatus(){return K.getHealthResults()}async refreshCDNHealth(){return K.clearCache(),this.clearUrlCache(),await K.checkAllCDNs()}clearUrlCache(){this.urlCache.clear()}isReady(){return this.isInitialized}getCacheStats(){return{size:this.urlCache.size,keys:Array.from(this.urlCache.keys())}}}const Y=Z.getInstance(),X=S("MemoryManager");class J{cache=new Map;config;cleanupTimer;memoryUsage=0;constructor(e={}){this.config={maxSize:50,maxAge:18e5,maxMemory:52428800,cleanupInterval:3e5,...e},this.startCleanup()}set(e,t){const a=this.estimateSize(t),i={data:t,timestamp:Date.now(),accessCount:0,lastAccessed:Date.now(),size:a};this.ensureSpace(a),this.cache.set(e,i),this.memoryUsage+=a,X(`📦 [Cache] 设置缓存: ${e}, 大小: ${(a/1024).toFixed(2)}KB, 总内存: ${(this.memoryUsage/1024/1024).toFixed(2)}MB`)}get(e){const t=this.cache.get(e);if(t){if(!this.isExpired(t))return t.accessCount++,t.lastAccessed=Date.now(),X(`📦 [Cache] 命中缓存: ${e}, 访问次数: ${t.accessCount}`),t.data;this.delete(e)}}delete(e){const t=this.cache.get(e);return t&&(this.memoryUsage-=t.size||0,X(`🗑️ [Cache] 删除缓存: ${e}`)),this.cache.delete(e)}has(e){const t=this.cache.get(e);return!(!t||this.isExpired(t)&&(this.delete(e),1))}clear(){this.cache.clear(),this.memoryUsage=0,X("🧹 [Cache] 清空所有缓存")}getStats(){const e=Array.from(this.cache.values());return{size:this.cache.size,memoryUsage:this.memoryUsage,memoryUsageMB:this.memoryUsage/1024/1024,averageAccessCount:e.reduce((e,t)=>e+t.accessCount,0)/e.length||0,oldestItem:Math.min(...e.map(e=>e.timestamp)),newestItem:Math.max(...e.map(e=>e.timestamp))}}estimateSize(e){try{return 2*JSON.stringify(e).length}catch{return 1024}}isExpired(e){return Date.now()-e.timestamp>this.config.maxAge}ensureSpace(e){for(;this.cache.size>=this.config.maxSize;)this.evictLeastUsed();for(;this.memoryUsage+e>this.config.maxMemory;)this.evictLeastUsed()}evictLeastUsed(){if(0===this.cache.size)return;let e="",t=1/0;for(const[a,i]of this.cache.entries()){const r=Date.now()-i.lastAccessed,n=i.accessCount/(r+1);n<t&&(t=n,e=a)}e&&(this.delete(e),X(`🚮 [Cache] 驱逐最少使用项: ${e}`))}cleanup(){this.cache.size,this.memoryUsage;for(const[e,t]of this.cache.entries())this.isExpired(t)&&this.delete(e);this.cache.size,this.memoryUsage}startCleanup(){this.cleanupTimer=setInterval(()=>{this.cleanup()},this.config.cleanupInterval)}destroy(){this.cleanupTimer&&clearInterval(this.cleanupTimer),this.clear()}}const q=new J({maxSize:1e3,maxAge:18e5,maxMemory:104857600,cleanupInterval:3e5}),Q=new J({maxSize:1e3,maxAge:6e5,maxMemory:52428800,cleanupInterval:12e4}),ee=S("cache"),te=S("cdn");S("tools");let ae=null,ie=!1,re=null;(async()=>{ie||ae||(ie=!0,re=(async()=>{try{ae=await z(),ee("Data cache initialized successfully")}catch(e){ee("Failed to initialize data cache: %O",e)}finally{ie=!1}})())})();const ne=S("折叠");function oe(e,...t){return t.forEach(t=>{Object.keys(t).forEach(a=>{const i=e[a],r=t[a];Array.isArray(i)&&Array.isArray(r)?e[a]=Array.from(new Set([...i,...r])):e[a]="object"==typeof i&&"object"==typeof r?oe({...i},r):r})}),e}async function se(e){const t=`preload-finished-${e}`;if(q.has(t))return void le(q.get(t));C.collapsedMap.clear();const a=await z(),[i,r]=await Promise.all([a.loadPositionData(e),a.loadSkillsData()]),n=oe({},i,a.expected_positions[e]),o=oe({},a,n,{skill_level:r});le(o),q.set(t,o)}function le(e){C.data=e;const t=(e?.skill_level?.list||[]).sort((e,t)=>e.length-t.length);C.skills=t;const a={};t.forEach(([e,t])=>{a[e.toLocaleLowerCase()]=[e,t]}),C.skillMap=a}function ce(e){const[t,a]=i.useState(Math.min(e,document.body.getBoundingClientRect().width));return i.useEffect(()=>{const t=()=>{a(Math.min(e,document.body.getBoundingClientRect().width))};return window.addEventListener("resize",t),()=>{window.removeEventListener("resize",t)}},[]),t}function de(e,t){return e.replace(/\$\{([\w.]+)\}/g,(e,a)=>{const i=a.split(".");let r=t;for(const t of i)if(r=r?r[t]:void 0,void 0===r)return e;return r})}function pe(e,t){const a=new Date,i=a.getFullYear(),r=a.getMonth()+1;function n(e){if(!/\d/.test(e))return[i,r];const t=[".","/","-"];let a,n;for(const i of t)if(e.includes(i)){const t=e.split(i).map(e=>{const t=e.match(/\d+/);return t?Number(t[0]):0});[a,n]=t;break}if(!a||!n){const t=e.match(/\d+/g);if(t&&t.length>=2)[a,n]=t.map(Number);else{if(!t||1!==t.length)return[i,r];a=Number(t[0]),n=1}}return a=a||i,n=n||1,[a,n]}const[o,s]=n(e),[l,c]=n(t);let d=l-o,p=c-s;p<0&&(d-=1,p+=12);let m="";return d>0&&(m+=`${d}年`),p>0&&(m+=`${p}个月`),m||"0个月"}function me(e,t){const[a,r]=i.useState({}),n=e=>{const a={};for(let i=0;i<t;i++)a[i]=e;setTimeout(()=>r(a),0)};return function(e,t){i.useEffect(()=>{C.collapsedMap.has(e)||C.collapsedMap.set(e,!1);const a=l(()=>C.collapsedMap.get(e),e=>{t(e)});return()=>{a()}},[e])}(e,n),{collapsedItems:a,toggleCollapse:(e,t)=>{r({...a,[e]:t??!a[e]})},setCollapsedAllItems:n}}function he(e,t=0){const a=(ae||(ie||ee("Data cache not initialized, using fallback"),{header_info:{cdn_static_assets_dirs:["images"]}})).header_info.cdn_static_assets_dirs||["images"];if(!e)return e;const i=a.map(e=>`^\\/?${e}\\/`).join("|");if(!new RegExp(i).test(e))return e;try{return Y.getResourceUrl(e,{enableFallback:!0,localBasePath:"",cacheUrls:!0})}catch(r){return te("Failed to get CDN URL, using original: %O",r),e}}window.stopOtherVideos=function(e){document.querySelectorAll(".remark-video").forEach(t=>{t!==e.target&&t.pause()})};const ue=S("PerformanceMonitor"),ge=new class{metrics={};observers=[];constructor(){this.init()}init(){this.observeNavigation(),this.observeWebVitals(),this.observeResources(),this.setupReporting()}observeNavigation(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("navigation"===t.entryType){const e=t;this.metrics.TTFB=e.responseStart-e.requestStart,this.metrics.pageLoadTime=e.loadEventEnd-e.navigationStart,ue("Navigation metrics:",{TTFB:this.metrics.TTFB,pageLoadTime:this.metrics.pageLoadTime})}});e.observe({entryTypes:["navigation"]}),this.observers.push(e)}}observeWebVitals(){this.observeLCP(),this.observeFID(),this.observeCLS(),this.observeFCP()}observeLCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{const t=e.getEntries(),a=t[t.length-1];this.metrics.LCP=a.startTime,ue("LCP:",this.metrics.LCP)});e.observe({entryTypes:["largest-contentful-paint"]}),this.observers.push(e)}}observeFID(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("first-input"===t.entryType){const e=t;this.metrics.FID=e.processingStart-e.startTime,ue("FID:",this.metrics.FID)}});e.observe({entryTypes:["first-input"]}),this.observers.push(e)}}observeCLS(){if("PerformanceObserver"in window){let e=0;const t=new PerformanceObserver(t=>{for(const a of t.getEntries())"layout-shift"!==a.entryType||a.hadRecentInput||(e+=a.value);this.metrics.CLS=e,ue("CLS:",this.metrics.CLS)});t.observe({entryTypes:["layout-shift"]}),this.observers.push(t)}}observeFCP(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())"first-contentful-paint"===t.name&&(this.metrics.FCP=t.startTime,ue("FCP:",this.metrics.FCP))});e.observe({entryTypes:["paint"]}),this.observers.push(e)}}observeResources(){if("PerformanceObserver"in window){const e=new PerformanceObserver(e=>{for(const t of e.getEntries())if("resource"===t.entryType){const e=t,a=e.responseEnd-e.startTime;a>1e3&&ue("Slow resource:",{name:e.name,loadTime:a,size:e.transferSize})}});e.observe({entryTypes:["resource"]}),this.observers.push(e)}}setupReporting(){document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&this.reportMetrics()}),window.addEventListener("beforeunload",()=>{this.reportMetrics()})}reportMetrics(){ue("Performance Metrics:",this.metrics),navigator.sendBeacon&&JSON.stringify({url:window.location.href,timestamp:Date.now(),metrics:this.metrics,userAgent:navigator.userAgent})}recordCustomMetric(e,t){this.metrics[e]=t,ue(`Custom metric ${e}:`,t)}recordComponentMetric(e,t,a){switch(this.metrics.componentMetrics||(this.metrics.componentMetrics={}),this.metrics.componentMetrics[e]||(this.metrics.componentMetrics[e]={renderTime:0,mountTime:0,updateTime:0}),t){case"render":this.metrics.componentMetrics[e].renderTime=a;break;case"mount":this.metrics.componentMetrics[e].mountTime=a;break;case"update":this.metrics.componentMetrics[e].updateTime=a}ue(`Component ${e} ${t} time:`,a)}recordDataLoadTime(e,t){this.metrics.dataLoadTime=t,ue(`Data load time for ${e}:`,t)}recordSkeletonDisplayTime(e){this.metrics.skeletonDisplayTime=e,ue("Skeleton display time:",e)}recordRouteChangeTime(e,t,a){this.metrics.routeChangeTime=a,ue(`Route change from ${e} to ${t}:`,a)}recordThemeChangeTime(e,t,a){this.metrics.themeChangeTime=a,ue(`Theme change from ${e} to ${t}:`,a)}recordLanguageChangeTime(e,t,a){this.metrics.languageChangeTime=a,ue(`Language change from ${e} to ${t}:`,a)}recordMemoryUsage(){if("memory"in performance){const e=performance.memory;this.metrics.memoryUsage=e.usedJSHeapSize,ue("Memory usage:",{used:e.usedJSHeapSize,total:e.totalJSHeapSize,limit:e.jsHeapSizeLimit})}}getMetrics(){return{...this.metrics}}getPerformanceScore(){const e=this.getMetrics();let t=100;const a={};return e.LCP&&(e.LCP>4e3?(t-=30,a.LCP="Poor"):e.LCP>2500?(t-=15,a.LCP="Needs Improvement"):a.LCP="Good"),e.FID&&(e.FID>300?(t-=25,a.FID="Poor"):e.FID>100?(t-=10,a.FID="Needs Improvement"):a.FID="Good"),e.CLS&&(e.CLS>.25?(t-=20,a.CLS="Poor"):e.CLS>.1?(t-=10,a.CLS="Needs Improvement"):a.CLS="Good"),e.dataLoadTime&&(e.dataLoadTime>2e3?(t-=15,a.dataLoad="Slow"):e.dataLoadTime>1e3?(t-=5,a.dataLoad="Moderate"):a.dataLoad="Fast"),{score:Math.max(0,t),details:a}}cleanup(){this.observers.forEach(e=>e.disconnect()),this.observers=[]}},fe=(e,t,a)=>{ge.recordComponentMetric(e,t,a)},be=(e,t)=>{ge.recordDataLoadTime(e,t)},xe=e=>{ge.recordSkeletonDisplayTime(e)},ye=(e,t,a)=>{ge.recordRouteChangeTime(e,t,a)},we={light:{primary:"#D4AF37",secondary:"#8B4513",accent:"#DC143C",background:"#FFF8DC",surface:"#F5F5DC",card:"#FFFAF0",text:{primary:"#2F4F4F",secondary:"#696969",disabled:"#A9A9A9",inverse:"#FFFAF0"},border:{light:"#F0E68C",medium:"#DAA520",dark:"#B8860B"},status:{success:"#228B22",warning:"#FF8C00",error:"#B22222",info:"#4682B4"},shadow:{light:"rgba(212, 175, 55, 0.1)",medium:"rgba(139, 69, 19, 0.15)",dark:"rgba(47, 79, 79, 0.2)"}},dark:{primary:"#FFD700",secondary:"#F0E68C",accent:"#FF6347",background:"#1C1C1C",surface:"#2F2F2F",card:"#3A3A3A",text:{primary:"#F5DEB3",secondary:"#D2B48C",disabled:"#808080",inverse:"#1C1C1C"},border:{light:"#4A4A4A",medium:"#696969",dark:"#8B7D6B"},status:{success:"#32CD32",warning:"#FFA500",error:"#FF4500",info:"#87CEEB"},shadow:{light:"rgba(255, 215, 0, 0.1)",medium:"rgba(255, 215, 0, 0.2)",dark:"rgba(0, 0, 0, 0.4)"}}},ve=i.createContext(void 0),ke=({children:t})=>{const[a,r]=i.useState(()=>{const e=localStorage.getItem("theme");return!e||"light"!==e&&"dark"!==e?window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e});i.useEffect(()=>{localStorage.setItem("theme",a),document.documentElement.setAttribute("data-theme",a);const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",we[a].background)},[a]),i.useEffect(()=>{const e=window.matchMedia("(prefers-color-scheme: dark)"),t=e=>{localStorage.getItem("theme")||r(e.matches?"dark":"light")};return e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]);const n={mode:a,setMode:r,toggleMode:()=>{const e=performance.now(),t=a;r(a=>{const i="light"===a?"dark":"light";return setTimeout(()=>{const a=performance.now()-e;((e,t,a)=>{ge.recordThemeChangeTime(e,t,a)})(t,i,a)},0),i})},colors:we[a],isDark:"dark"===a};return e.jsx(ve.Provider,{value:n,children:t})},Ce=()=>{const e=i.useContext(ve);if(!e)throw new Error("useTheme must be used within a ThemeProvider");return e},Se=e=>`\n    --color-primary: ${e.primary};\n    --color-secondary: ${e.secondary};\n    --color-accent: ${e.accent};\n    \n    --color-background: ${e.background};\n    --color-surface: ${e.surface};\n    --color-card: ${e.card};\n    \n    --color-text-primary: ${e.text.primary};\n    --color-text-secondary: ${e.text.secondary};\n    --color-text-disabled: ${e.text.disabled};\n    --color-text-inverse: ${e.text.inverse};\n    \n    --color-border-light: ${e.border.light};\n    --color-border-medium: ${e.border.medium};\n    --color-border-dark: ${e.border.dark};\n    \n    --color-success: ${e.status.success};\n    --color-warning: ${e.status.warning};\n    --color-error: ${e.status.error};\n    --color-info: ${e.status.info};\n    \n    --shadow-light: ${e.shadow.light};\n    --shadow-medium: ${e.shadow.medium};\n    --shadow-dark: ${e.shadow.dark};\n  `,De=S("ThemeManager");var Fe=(e=>(e.LIGHT="light",e.DARK="dark",e))(Fe||{});const je={light:{type:"light",name:"浅色主题",description:"适合白天使用的明亮主题",cssClass:""},dark:{type:"dark",name:"深色主题",description:"适合夜晚使用的深色主题",cssClass:"dark"}};class Pe{static instance;currentTheme="light";observers=[];constructor(){this.initializeTheme()}static getInstance(){return Pe.instance||(Pe.instance=new Pe),Pe.instance}initializeTheme(){const e=localStorage.getItem("theme");if(e&&Object.values(Fe).includes(e))this.currentTheme=e;else{const e=window.matchMedia("(prefers-color-scheme: dark)").matches;this.currentTheme=e?"dark":"light"}this.applyTheme(this.currentTheme),this.setupSystemThemeListener()}setupSystemThemeListener(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{if(!localStorage.getItem("theme")){const t=e.matches?"dark":"light";this.setTheme(t)}})}applyTheme(e){const t=document.documentElement;Object.values(je).forEach(e=>{e.cssClass&&t.classList.remove(e.cssClass)}),"dark"===e?(t.setAttribute("data-theme","dark"),t.classList.add("dark")):t.removeAttribute("data-theme");const a=je[e];a.cssClass&&t.classList.add(a.cssClass)}setTheme(e){this.currentTheme!==e&&(this.currentTheme=e,this.applyTheme(e),localStorage.setItem("theme",e),this.notifyObservers(e))}toggleTheme(){const e="light"===this.currentTheme?"dark":"light";this.setTheme(e)}getCurrentTheme(){return this.currentTheme}getCurrentThemeConfig(){return je[this.currentTheme]}isDarkTheme(){return"dark"===this.currentTheme}addObserver(e){this.observers.push(e)}removeObserver(e){const t=this.observers.indexOf(e);t>-1&&this.observers.splice(t,1)}notifyObservers(e){this.observers.forEach(t=>{try{t(e)}catch(a){De.extend("error")("主题观察者回调执行失败:",a)}})}getAvailableThemes(){return Object.values(je)}resetToSystemTheme(){localStorage.removeItem("theme");const e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";this.setTheme(e)}}Pe.getInstance();const Le=d`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,$e=d`
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
`;const Ee="920px",Te=p`
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

  /* 动态CSS变量生成 - 兼容主题系统 */
  ${e=>e.theme?`\n    :root {\n      ${Se(e.theme.colors.light)}\n    }\n    [data-theme="dark"] {\n      ${Se(e.theme.colors.dark)}\n    }\n  `:""}

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
    animation: ${Le} 1s linear infinite;
  }

  /* 脉冲动画 */
  .pulse {
    animation: ${$e} 1.5s ease-in-out infinite;
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
    animation: ${Le} 1s linear infinite;
    margin-bottom: 20px;
    transition: border-color 0.3s ease;
  }

  .splash-loader p {
    color: var(--color-text-secondary);
    font-size: 16px;
    margin: 0;
    animation: ${$e} 1.5s ease-in-out infinite;
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
    background-image: url('${he("images/flexi-resume.jpg")}');

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
      background-image: url('${he("images/flexi-resume.jpg")}');
      background-repeat: repeat;
      background-size: 180px;
      /* 浅色主题滤镜 - 增加亮度和对比度 filter: brightness(var(--bg-filter-brightness, 1.2)) contrast(var(--bg-filter-contrast, 1.1)); */
     
      filter: sepia(0.4) hue-rotate(20deg);
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
    background-image: url('${he("images/flexi-resume.jpg")}');

    /* 仅对背景图应用滤镜，不影响其他内容 */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${he("images/flexi-resume.jpg")}');
      background-repeat: repeat;
      background-size: 180px;
      /* 反转背景图颜色，让其适配深色主题 - 使用CSS变量控制滤镜强度 */
      filter: invert(1) brightness(var(--bg-filter-brightness, 1));
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

    @media (max-width: ${Ee}) {
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
      background: url(${he("images/url.svg")}) no-repeat center;
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
  @media (max-width: ${Ee}) {
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
`;let ze=[...Array(4).fill().map((e,t)=>`tangseng-${String(t+1).padStart(2,"0")}`),...Array(10).fill().map((e,t)=>`wukong-${String(t+1).padStart(2,"0")}`),...Array(9).fill().map((e,t)=>`bajie-${String(t+1).padStart(2,"0")}`),...Array(1).fill().map((e,t)=>`wujing-${String(t+1).padStart(2,"0")}`)],Ie=[...Array(7).fill().map((e,t)=>`${String(t+1).padStart(2,"0")}`)];var Ae=(e=>(e.BGM="bgm",e.SFX="sfx",e))(Ae||{});const Ne=ze.map(e=>({id:e,name:e.split("-")[0],type:"sfx",file:`./audio/xiyouji/${e}.mp3`,volume:.8,loop:!1,preload:!0,autoplay:!1,description:"角色语音",quote:e})),Me=Ie.map(e=>({id:e,name:e.split("-")[0],type:"bgm",file:`./audio/xiyouji/bgm/${e}.mp3`,volume:.8,loop:!1,preload:!1,autoplay:!0,description:"背景音乐",quote:e})),_e=[{tabPath:"/xuanzang",tabName:"唐僧·陈玄奘",bgmList:Ie,sfxList:ze.filter(e=>e.startsWith("tangseng")),characterId:"xuanzang"},{tabPath:"/wukong",tabName:"齐天大圣·孙悟空",bgmList:Ie,sfxList:ze.filter(e=>e.startsWith("wukong")),characterId:"wukong"},{tabPath:"/bajie",tabName:"天蓬元帅·猪八戒",bgmList:Ie,sfxList:ze.filter(e=>e.startsWith("bajie")),characterId:"bajie"},{tabPath:"/wujing",tabName:"卷帘大将·沙悟净",bgmList:Ie,sfxList:ze.filter(e=>e.startsWith("wujing")),characterId:"wujing"}],Oe={enabled:!0,bgmVolume:.3,sfxVolume:.7,requireUserInteraction:!0,fadeInDuration:1e3,fadeOutDuration:800,crossfadeDuration:1500};function Be(){return[...Ne,...Me]}function Re(e){return Be().find(t=>t.id===e)}function Ue(e){return _e.find(t=>t.tabPath===e)}const Ge=S("EnhancedAudioPlayer"),Ke=new class{audioCache=new Map;playbackStates=new Map;currentBGM=null;bgmPlaylist=[];bgmCurrentIndex=0;settings={...Oe};constructor(){this.initializePlayer()}async initializePlayer(){this.setupUserInteractionListener(),await this.preloadAudio()}setupUserInteractionListener(){this.playCurrentTabAudioRandomly();const e=()=>{this.settings.requireUserInteraction&&(window.userInteracted=!0,Ge("🎵 用户首次交互，音频播放已启用"),this.playBGM(this.getCurrentBGM()),document.removeEventListener("click",e),document.removeEventListener("keydown",e),document.removeEventListener("touchstart",e))};document.addEventListener("click",e),document.addEventListener("keydown",e),document.addEventListener("touchstart",e)}async preloadAudio(){const e=Be().filter(e=>e.preload);for(const t of e)t.preload&&this.loadAudio(t)}async loadAudio(e){try{const t=new Audio(e.file);t.volume=e.volume,t.loop=e.loop,t.preload="auto",this.setupAudioEventListeners(t,e),this.audioCache.set(e.id,t),this.playbackStates.set(e.id,{isPlaying:!1,currentTime:0,duration:0,volume:e.volume,loop:e.loop})}catch(t){Ge.extend("warn")(`⚠️ ${e.name} 预加载失败:`,t)}}setupAudioEventListeners(e,t){e.addEventListener("loadedmetadata",()=>{const a=this.playbackStates.get(t.id);a&&(a.duration=e.duration)}),e.addEventListener("timeupdate",()=>{const a=this.playbackStates.get(t.id);a&&(a.currentTime=e.currentTime)}),e.addEventListener("ended",()=>{this.handleAudioEnded(t)}),e.addEventListener("error",e=>{Ge.extend("warn")(`⚠️ ${t.name} 播放错误:`,e)})}handleAudioEnded(e){const t=this.playbackStates.get(e.id);t&&(t.isPlaying=!1),e.type===Ae.BGM&&(this.bgmPlaylist.length>1?this.playNextBGM():1===this.bgmPlaylist.length&&setTimeout(()=>{this.playBGM(this.bgmPlaylist[0])},500))}playNextBGM(){if(0===this.bgmPlaylist.length)return;this.bgmCurrentIndex=(this.bgmCurrentIndex+1)%this.bgmPlaylist.length;const e=this.bgmPlaylist[this.bgmCurrentIndex];setTimeout(()=>{this.playBGM(e)},500)}async playBGM(e){if(!this.canPlay())return;const t=Re(e);if(!t||t.type!==Ae.BGM)return void Ge.extend("warn")(`⚠️ BGM ${e} 配置不存在或类型错误`);if(this.currentBGM===e){const a=this.audioCache.get(e),i=this.playbackStates.get(e);if(a&&i&&i.isPlaying&&!a.paused)return void Ge(`🎵 BGM ${t.name} 已在播放，跳过重复播放`)}this.currentBGM&&this.currentBGM!==e&&await this.fadeOut(this.currentBGM);const a=this.audioCache.get(e);a||(Ge.extend("warn")(`⚠️ BGM ${e} 音频未加载`),this.loadAudio(t));try{this.currentBGM=e,a.volume=0,a.currentTime=0,await a.play(),await this.fadeIn(e);const i=this.playbackStates.get(e);i&&(i.isPlaying=!0),Ge(`🎵 播放BGM: ${t.name}`)}catch(i){Ge.extend("warn")(`⚠️ 播放BGM ${e} 失败:`,i)}}async playSFX(e){if(!this.canPlay())return;const t=Re(e);if(!t||t.type!==Ae.SFX)return;const a=this.audioCache.get(e);a||this.loadAudio(t);try{a.currentTime=0,a.volume=t.volume*this.settings.sfxVolume,await a.play();const i=this.playbackStates.get(e);i&&(i.isPlaying=!0),Ge(`🎵 播放SFX: ${t.name} - "${t.quote||""}"`)}catch(i){}}async switchToTab(e){const t=Ue(e);if(t){if(this.bgmPlaylist=t.bgmList,this.bgmCurrentIndex=0,this.bgmPlaylist.length>0){const e=this.bgmPlaylist[0];if(this.currentBGM===e){const t=this.audioCache.get(e),a=this.playbackStates.get(e);t&&a&&a.isPlaying&&!t.paused||await this.playBGM(e)}else await this.playBGM(e)}t.sfxList.length>0&&this.canPlay()&&setTimeout(()=>{this.playSFX(t.sfxList[0])},1e3)}else Ge(`⚠️ 页签 ${e} 没有音频配置`)}async switchToTabRandomly(e){const t=Ue(e);if(t){if(this.bgmPlaylist=t.bgmList,this.bgmPlaylist.length>0){const e=this.getRandomElement(this.bgmPlaylist);e&&(this.bgmCurrentIndex=this.bgmPlaylist.indexOf(e),await this.playBGM(e),Ge(`🎲 随机选择BGM: ${e}`))}this.playRandomSFXForTab(t)}}playRandomSFXForTab(e){if(e.sfxList.length>0&&this.canPlay()){const t=this.getRandomElement(e.sfxList);t&&setTimeout(()=>{this.playSFX(t)},1e3)}else e.sfxList.length,this.canPlay()}canPlay(){return!!this.settings.enabled||(Ge("🔇 音频播放已禁用"),!1)}async fadeIn(e){const t=this.audioCache.get(e),a=Re(e);if(!t||!a)return;const i=a.volume*(a.type===Ae.BGM?this.settings.bgmVolume:this.settings.sfxVolume),r=this.settings.fadeInDuration/20,n=i/20;for(let o=0;o<=20;o++)t.volume=n*o,await new Promise(e=>setTimeout(e,r))}async fadeOut(e){const t=this.audioCache.get(e);if(!t)return;const a=t.volume,i=this.settings.fadeOutDuration/20,r=a/20;for(let o=20;o>=0;o--)t.volume=r*o,await new Promise(e=>setTimeout(e,i));t.pause();const n=this.playbackStates.get(e);n&&(n.isPlaying=!1)}stopAll(){this.stopAllBGM(),this.stopAllSFX()}stopAllSFX(){this.stopAudio(Ae.SFX)}stopAllBGM(){this.stopAudio(Ae.BGM)}stopAudio(e){this.audioCache.forEach((t,a)=>{const i=Re(a);if(i&&i.type===e){t.pause(),t.currentTime=0;const e=this.playbackStates.get(a);e&&(e.isPlaying=!1)}}),e===Ae.BGM?(this.currentBGM=null,Ge("🔇 停止所有背景音乐播放")):Ge("🔇 停止所有音效播放")}setGlobalVolume(e,t){this.settings.bgmVolume=Math.max(0,Math.min(1,e)),this.settings.sfxVolume=Math.max(0,Math.min(1,t)),this.audioCache.forEach((e,t)=>{const a=Re(t);if(a){const t=a.type===Ae.BGM?this.settings.bgmVolume:this.settings.sfxVolume;e.volume=a.volume*t}})}setEnabled(e){this.settings.enabled,this.settings.enabled=e,e?e&&this.playCurrentTabAudioRandomly():this.stopAll(),Ge("🎵 音频播放"+(e?"启用":"禁用"))}async playCurrentTabAudioRandomly(){const e=window.location.pathname;e&&"/"!==e&&await this.switchToTabRandomly(e)}getRandomElement(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}getPlaybackState(e){return this.playbackStates.get(e)}getCurrentBGM(){return this.currentBGM}},He=S("Tabs"),We="#aaa",Ve="920px",Ze=m.nav.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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

  @media (min-width: ${Ve}) {
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
`,Ye=m(g).withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
  background-color: ${e=>e.isDark?"var(--color-card)":"#fff"};
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
    background-color: ${e=>e.isDark?"var(--color-surface)":"#f0f0f0"};
    border-color: ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态时显示边框颜色 */
    border-top: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示顶部边框 */
    color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    transform: translateY(-1px); /* 轻微上移效果 */
  }

  @media (min-width: ${Ve}) {
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
      background-color: ${e=>e.isDark?"var(--color-surface)":"#f0f0f0"};
      border-right: 2px solid ${e=>e.isDark?"var(--color-primary)":"#333"}; /* 激活状态显示右侧边框 */
      color: ${e=>e.isDark?"var(--color-primary)":"inherit"};
    }
  }
`,Xe=m.img`
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
`,Je=m.span`
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 0.85em; /* 小屏幕时稍微减小字体 */
  }
`,qe=m.div`
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
`,Qe=()=>{const t=C.data,a=C.tabs,{isDark:r}=Ce(),n=h(),o=u(),s=i.useCallback(async e=>{const t=`preload-${e}`;if(!Q.has(t))try{e.replace("/",""),Q.set(t,!0)}catch(a){}},[]),l=i.useCallback(e=>{const t=setTimeout(()=>{s(e)},200);return()=>clearTimeout(t)},[s]),c=i.useCallback(async(e,t)=>{t.preventDefault(),o(e),setTimeout(async()=>{try{Ke.settings.requireUserInteraction=!1,Ke.stopAllSFX(),await Ke.switchToTabRandomly(e)}catch(t){}},0)},[o]);return i.useEffect(()=>{if(!a.length)return void(document.title=t?.header_info?.position||"My Resume");const e=function(e){const t=C.data,a=C.tabs,i=e.pathname,r=a.find(([,e])=>e===i);return r?r[0]:t?.header_info?.position||""}(n),i=Object.assign({},t?.header_info),r=function(e,t){if(!t)return t?.position||"My Resume";const a=e.replace(/{(position|name|age|location)}/g,(e,a)=>t[a]||""),i=a.replace(/[-\s]+/g," ").trim();return i&&"-"!==i&&"--"!==i&&"---"!==i?a:t?.position||t?.name||"My Resume"}(t?.header_info?.resume_name_format||"{position}-{name}-{age}-{location}",i),o=r&&r.trim()?r:e||t?.header_info?.position||"My Resume";document.title=o},[n,t,a.length]),a.length?e.jsx(Ze,{"data-testid":"navigation-tabs",isDark:r,children:a.map(([a,i,n,o],s)=>{const d=(e=>{const a=e.replace("/",""),i=t?.expected_positions?.[a];return i?.header_info})(i),p=d?.name||a,m=d?.avatar||o;return e.jsx(Ye,{className:"no-link-icon",to:i,isDark:r,onMouseEnter:()=>l(i),onClick:e=>{c(i,e)},children:e.jsxs(qe,{children:[m&&e.jsx(Xe,{src:m,alt:p,onError:e=>{He.extend("error")("Avatar load error:",m,e),e.currentTarget.style.display="none"},onLoad:()=>{He("Avatar loaded successfully:",m)}}),e.jsx(Je,{children:a})]})},i)})}):null};function et(e){return w({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},child:[]}]})(e)}const tt=m.div`
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
`,at=m.img`
    max-width: 90%;
    max-height: 90%;
    transition: transform 0.3s ease;
    cursor: pointer;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`,it=m.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  padding: 10px;
  cursor: pointer;
  z-index: 1100;  
`,rt=({imageUrl:t,onClose:a})=>e.jsxs(tt,{onClick:a,children:[e.jsx(at,{src:t,onClick:e=>e.stopPropagation()}),e.jsx(it,{onClick:a,children:e.jsx(et,{size:30,color:"white"})})]}),nt=i.createContext(void 0),ot=({children:a})=>{const[n,o]=i.useState(!1),[s,l]=i.useState(""),c=e=>{l(e),o(!0)};return r.useEffect(()=>{window.$handleImageClick=c;const e=e=>{const t=e.target;let a=null;if("IMG"===t.tagName?a=t:t.closest("img")&&(a=t.closest("img")),a&&a.classList.contains("clickable-image")){const t=a.getAttribute("data-image-url");t&&(c(t),e.preventDefault(),e.stopPropagation())}};return document.addEventListener("click",e,!0),()=>{delete window.$handleImageClick,document.removeEventListener("click",e,!0)}},[]),e.jsxs(nt.Provider,{value:{handleImageClick:c},children:[a,n&&e.jsx(e.Fragment,{children:e.jsx(t.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:999999,pointerEvents:"auto"},children:e.jsx(rt,{imageUrl:s,onClose:()=>{o(!1)}})})})]})},st={zh:{common:{loading:"加载中...",error:"加载失败",retry:"重试",contact:"联系我",download:"下载简历",print:"打印简历",share:"分享",switchLanguage:"切换语言",switchTheme:"切换主题",lightMode:"浅色模式",darkMode:"深色模式",controlPanel:"控制面板",theme:"主题",language:"语言",downloadPDF:"下载PDF",originalPDF:"原版PDF",colorPDF:"彩色PDF",grayscalePDF:"黑白PDF",generating:"生成中...",pdfGenerationFailed:"PDF生成失败",unknownError:"未知错误",buildGuide:"构建指南",close:"关闭提示",reset:"重置",networkError:"网络连接问题",resourceLoadError:"资源加载失败",runtimeError:"运行时错误",pageLoadError:"页面加载出错了",retrying:"重试中...",maxRetriesReached:"已达最大重试次数",reload:"重新加载",developmentMode:"开发环境模式 (npm run dev)",developmentDescription:"如需完整功能测试，建议使用 npm run build 构建后预览。",buildGuideButton:"📖 构建指南",resetButton:"🔄 重置",buildGuideAlert:"📖 构建指南已输出到控制台\n💡 请打开浏览器控制台查看详细信息",resetAlert:"已重置",developmentTips:"📍 当前模式: 开发环境 (npm run dev)\n🔧 特性说明:\n  • 热重载 (HMR) 已启用\n⚠️  注意事项:\n  • Mermaid图表可能需要手动刷新\n💡 建议:\n  • 如需完整功能测试，请使用: npm run build\n  • 生产环境预览: npm run preview",developmentEnvironment:"🚀 FlexiResume 开发环境"},resume:{personalInfo:"个人信息",personalStrengths:"个人优势",skills:"技能清单",employmentHistory:"工作经历",projectExperience:"项目经历",educationHistory:"教育背景",personalInfluence:"个人影响力",careerPlanning:"职业规划",openSourceProjects:"开源项目"},profile:{position:"求职意向",expectedSalary:"期望薪资",status:"工作状态",phone:"联系电话",email:"邮箱地址",location:"所在地区",experience:"工作经验",education:"学历"},time:{present:"至今",years:"年",months:"个月"}},en:{common:{loading:"Loading...",error:"Load Failed",retry:"Retry",contact:"Contact Me",download:"Download Resume",print:"Print Resume",share:"Share",switchLanguage:"Switch Language",switchTheme:"Switch Theme",lightMode:"Light Mode",darkMode:"Dark Mode",controlPanel:"Control Panel",theme:"Theme",language:"Language",downloadPDF:"Download PDF",originalPDF:"Original PDF",colorPDF:"Color PDF",grayscalePDF:"Grayscale PDF",generating:"Generating...",pdfGenerationFailed:"PDF generation failed",unknownError:"Unknown error",buildGuide:"Build Guide",close:"Close",reset:"Reset",networkError:"Network Connection Issue",resourceLoadError:"Resource Load Failed",runtimeError:"Runtime Error",pageLoadError:"Page Load Error",retrying:"Retrying...",maxRetriesReached:"Max retries reached",reload:"Reload",developmentMode:"Development Mode (npm run dev)",developmentDescription:"For complete functionality testing, please use npm run build to build and preview.",buildGuideButton:"📖 Build Guide",resetButton:"🔄 Reset",buildGuideAlert:"📖 Build guide has been output to console\n💡 Please open browser console for detailed information",resetAlert:"Reset completed",developmentTips:"📍 Current mode: Development (npm run dev)\n🔧 Features:\n  • Hot Module Replacement (HMR) enabled\n⚠️  Notes:\n  • Mermaid charts may need manual refresh\n💡 Recommendations:\n  • For complete functionality testing, use: npm run build\n  • Production preview: npm run preview",developmentEnvironment:"🚀 FlexiResume Development Environment"},resume:{personalInfo:"Personal Information",personalStrengths:"Personal Strengths",skills:"Skills",employmentHistory:"Work Experience",projectExperience:"Project Experience",educationHistory:"Education",personalInfluence:"Personal Influence",careerPlanning:"Career Planning",openSourceProjects:"Open Source Projects"},profile:{position:"Position",expectedSalary:"Expected Salary",status:"Status",phone:"Phone",email:"Email",location:"Location",experience:"Experience",education:"Education"},time:{present:"Present",years:" years",months:" months"}}},lt=i.createContext(void 0),ct=({children:t})=>{const[a,r]=i.useState(()=>{const e=localStorage.getItem("language");return!e||"zh"!==e&&"en"!==e?navigator.language.toLowerCase().startsWith("zh")?"zh":"en":e});i.useEffect(()=>{localStorage.setItem("language",a)},[a]);const n=(e=>t=>{const a=performance.now();e(e=>(setTimeout(()=>{const i=performance.now()-a;((e,t,a)=>{ge.recordLanguageChangeTime(e,t,a)})(e,t,i)},0),t))})(r),o={language:a,setLanguage:n,t:st[a]};return e.jsx(lt.Provider,{value:o,children:t})},dt=()=>{const e=i.useContext(lt);if(!e)throw new Error("useI18n must be used within an I18nProvider");return e};S("NetworkManager");const pt=new Set;let mt={isOnline:navigator.onLine,connectionType:"unknown",effectiveType:"unknown",downlink:0,rtt:0,saveData:!1};function ht(){return{...mt}}const ut=S("error-boundary"),gt=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e&&"level"!==e})`
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
`,ft=m.div.withConfig({shouldForwardProp:e=>"level"!==e})`
  font-size: ${e=>{switch(e.level){case"page":return"48px";case"section":return"36px";default:return"24px"}}};
  margin-bottom: 16px;
  opacity: 0.8;
`,bt=m.h3.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  color: ${e=>e.isDark?"var(--color-text-primary)":"#333"};
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
`,xt=m.p.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  color: ${e=>e.isDark?"var(--color-text-secondary)":"#666"};
  margin: 0 0 24px 0;
  line-height: 1.5;
  max-width: 500px;
`,yt=m.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`,wt=m.button.withConfig({shouldForwardProp:e=>"isDark"!==e&&"variant"!==e})`
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
`,vt=m.details.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,kt=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  margin-top: 16px;
  padding: 8px 12px;
  background: ${e=>e.isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.05)"};
  border-radius: 4px;
  font-size: 12px;
  color: ${e=>e.isDark?"var(--color-text-secondary)":"#666"};
`;class Ct extends i.Component{networkStatusUnsubscribe;constructor(e){super(e),this.state={hasError:!1,retryCount:0,isRetrying:!1}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){const a=function(e){const t=e.message.toLowerCase();return t.includes("network")||t.includes("fetch")||t.includes("timeout")||"TypeError"===e.name&&t.includes("failed to fetch")?"network":t.includes("chunk")||t.includes("loading")||t.includes("import")?"chunk":"runtime"}(e),i=ht(),r={type:a,message:e.message,stack:e.stack,componentStack:t.componentStack,timestamp:Date.now(),userAgent:navigator.userAgent,url:window.location.href,networkStatus:i,retryCount:this.state.retryCount};var n;this.setState({error:e,errorInfo:t,errorDetails:r}),this.props.onError?.(r),R()&&(ut("EnhancedErrorBoundary caught an error:",e,t),ut("Error details:",r)),this.networkStatusUnsubscribe=(n=e=>{e.isOnline&&this.state.hasError&&ut("Network recovered, user can retry")},pt.add(n),n(mt),()=>{pt.delete(n)})}componentWillUnmount(){this.networkStatusUnsubscribe?.()}handleRetry=async()=>{const e=this.props.maxRetries||3;this.state.retryCount>=e||(this.setState({isRetrying:!0}),await new Promise(e=>setTimeout(e,1e3)),this.setState({hasError:!1,error:void 0,errorInfo:void 0,errorDetails:void 0,retryCount:this.state.retryCount+1,isRetrying:!1}))};handleReload=()=>{window.location.reload()};render(){if(this.state.hasError){if(this.props.fallback)return this.props.fallback;const{level:t="component",showErrorDetails:a=!1}=this.props,{errorDetails:i,retryCount:r,isRetrying:n}=this.state,o=this.props.maxRetries||3,s=ht(),l=i?.type||"unknown",c=function(e,t){if(!t)return"网络连接已断开，请检查您的网络连接后重试。";switch(e){case"network":return"网络请求失败，请检查网络连接或稍后重试。";case"chunk":return"页面资源加载失败，可能是网络问题，请尝试刷新页面。";case"runtime":return"页面运行时出现错误，请尝试刷新页面或联系技术支持。";default:return"页面遇到了一些问题，请尝试刷新页面或稍后再试。"}}(l,s.isOnline);return e.jsxs(gt,{level:t,isDark:this.props.isDark,children:[e.jsx(ft,{level:t,children:"network"===l?"🌐":"chunk"===l?"📦":"runtime"===l?"⚠️":"❌"}),e.jsx(bt,{isDark:this.props.isDark,children:"network"===l?this.props.t?.common?.networkError||"网络连接问题":"chunk"===l?this.props.t?.common?.resourceLoadError||"资源加载失败":"runtime"===l?this.props.t?.common?.runtimeError||"运行时错误":this.props.t?.common?.pageLoadError||"页面加载出错了"}),e.jsxs(xt,{isDark:this.props.isDark,children:[c,r>0&&e.jsxs(e.Fragment,{children:[e.jsx("br",{}),"已重试 ",r," 次"]})]}),e.jsxs(yt,{children:[e.jsx(wt,{variant:"primary",isDark:this.props.isDark,onClick:this.handleRetry,disabled:n||r>=o,children:n?this.props.t?.common?.retrying||"重试中...":r>=o?this.props.t?.common?.maxRetriesReached||"已达最大重试次数":this.props.t?.common?.reload||"重新加载"}),e.jsx(wt,{variant:"secondary",isDark:this.props.isDark,onClick:this.handleReload,children:"刷新页面"})]}),!s.isOnline&&e.jsx(kt,{isDark:this.props.isDark,children:"🔴 网络连接已断开"}),a&&i&&e.jsxs(vt,{isDark:this.props.isDark,children:[e.jsx("summary",{children:"错误详情 (开发模式)"}),e.jsxs("pre",{children:["错误类型: ",i.type,"\n","错误消息: ",i.message,"\n","时间戳: ",new Date(i.timestamp).toLocaleString(),"\n","网络状态: ",JSON.stringify(i.networkStatus,null,2),i.stack&&`\n\n堆栈跟踪:\n${i.stack}`,i.componentStack&&`\n\n组件堆栈:\n${i.componentStack}`]})]})]})}return this.props.children}}const St=t=>{const{isDark:a}=Ce(),{t:i}=dt();return e.jsx(Ct,{...t,isDark:a,t:i,showErrorDetails:t.showErrorDetails??!1})},Dt=()=>(()=>{if("undefined"==typeof window)return!1;const e=document.documentElement.getAttribute("data-theme"),t=document.body.getAttribute("data-theme"),a=document.documentElement.className,i=document.body.className,r=localStorage.getItem("theme");return!("dark"!==e&&"dark"!==t&&("light"===e||"light"===t||!a.includes("dark")&&!i.includes("dark")&&(a.includes("light")||i.includes("light")||"dark"!==r&&("light"===r||!window.matchMedia||!window.matchMedia("(prefers-color-scheme: dark)").matches))))})(),Ft=()=>{const[e,t]=i.useState(()=>Dt());i.useEffect(()=>{if("undefined"==typeof window)return;t(Dt());const e=e=>{"theme"===e.key&&t(Dt())},a=new MutationObserver(()=>{t(Dt())});a.observe(document.body,{attributes:!0,attributeFilter:["data-theme","class"]}),a.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme","class"]}),window.addEventListener("storage",e);const i=window.matchMedia("(prefers-color-scheme: dark)"),r=()=>{t(Dt())};return i.addEventListener("change",r),()=>{a.disconnect(),window.removeEventListener("storage",e),i.removeEventListener("change",r)}},[]);try{const e=Ce();return{isDark:e.isDark,mode:e.mode,colors:e.colors,toggleMode:e.toggleMode,setMode:e.setMode}}catch(a){return{isDark:e,mode:e?"dark":"light",colors:null,toggleMode:()=>{const t=e?"light":"dark";localStorage.setItem("theme",t),document.documentElement.setAttribute("data-theme",t)},setMode:e=>{localStorage.setItem("theme",e),document.documentElement.setAttribute("data-theme",e)}}}},jt=d`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`,Pt=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  background: ${e=>e.isDark?"linear-gradient(90deg, var(--color-border-medium) 25%, var(--color-border-dark) 50%, var(--color-border-medium) 75%)":"linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border-medium) 50%, var(--color-border-light) 75%)"};
  background-size: 200px 100%;
  animation: ${jt} 1.5s infinite linear;
  border-radius: 4px;
  transition: background 0.3s ease;
`,Lt=m(Pt).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>e.height||"16px"};
  width: ${e=>e.width||"100%"};
  margin: ${e=>e.margin||"8px 0"};
`,$t=m(Pt).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: ${e=>{switch(e.size){case"small":return"20px";case"large":return"32px";default:return"24px"}}};
  width: ${e=>{switch(e.size){case"small":return"120px";case"large":return"200px";default:return"150px"}}};
  margin: 16px 0;
`,Et=m(Pt).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: ${e=>e.size||80}px;
  height: ${e=>e.size||80}px;
  border-radius: 50%;
  flex-shrink: 0;
`;m(Pt).withConfig({shouldForwardProp:e=>"isDark"!==e})`
  height: 36px;
  width: ${e=>e.width||"100px"};
  border-radius: 6px;
`;const Tt=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  padding: ${e=>e.padding||"20px"};
  border: 1px solid ${e=>e.isDark?"var(--color-border-medium)":"#e0e0e0"};
  border-radius: 8px;
  margin: 16px 0;
  background: ${e=>e.isDark?"var(--color-card)":"#fff"};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;m(Pt)`
  width: ${e=>e.width||"100%"};
  height: ${e=>e.height||"200px"};
  aspect-ratio: ${e=>e.aspectRatio||"auto"};
  border-radius: 8px;
`;const zt=m.div.withConfig({shouldForwardProp:e=>"minWidth"!==e})`
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
`,It=()=>{const{isDark:t}=Ft(),a=ce(800)-40;return e.jsxs(zt,{minWidth:a,children:[e.jsxs("div",{style:{display:"flex",gap:"20px",marginBottom:"40px"},children:[e.jsx(Et,{size:100,isDark:t}),e.jsxs("div",{style:{flex:1},children:[e.jsx($t,{size:"large",isDark:t}),e.jsx(Lt,{width:"60%",height:"18px",isDark:t}),e.jsx(Lt,{width:"50%",height:"16px",isDark:t}),e.jsx(Lt,{width:"40%",height:"16px",isDark:t})]})]}),e.jsxs(Tt,{isDark:t,children:[e.jsx($t,{size:"medium",isDark:t}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"12px"},children:[e.jsx(Lt,{width:"80%",isDark:t}),e.jsx(Lt,{width:"70%",isDark:t}),e.jsx(Lt,{width:"90%",isDark:t}),e.jsx(Lt,{width:"75%",isDark:t}),e.jsx(Lt,{width:"85%",isDark:t}),e.jsx(Lt,{width:"65%",isDark:t})]})]}),e.jsxs(Tt,{isDark:t,children:[e.jsx($t,{size:"medium",isDark:t}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(Lt,{width:"40%",height:"20px",isDark:t}),e.jsx(Lt,{width:"100%",isDark:t}),e.jsx(Lt,{width:"95%",isDark:t}),e.jsx(Lt,{width:"88%",isDark:t})]}),e.jsxs("div",{children:[e.jsx(Lt,{width:"35%",height:"20px",isDark:t}),e.jsx(Lt,{width:"100%",isDark:t}),e.jsx(Lt,{width:"92%",isDark:t}),e.jsx(Lt,{width:"85%",isDark:t})]})]}),e.jsxs(Tt,{isDark:t,children:[e.jsx($t,{size:"medium",isDark:t}),e.jsx(Lt,{width:"50%",height:"18px",isDark:t}),e.jsx(Lt,{width:"100%",isDark:t}),e.jsx(Lt,{width:"90%",isDark:t}),e.jsx(Lt,{width:"95%",isDark:t})]})]})},At=S("FontConfig"),Nt=new J({maxSize:20,maxAge:36e5,maxMemory:10485760,cleanupInterval:6e5});var Mt=(e=>(e.ANCIENT_CHINESE="ancient_chinese",e.MODERN_CHINESE="modern_chinese",e.ENGLISH="english",e.MIXED="mixed",e))(Mt||{});const _t=[{name:"kangxi",displayName:"康熙字典体",fontFamily:"Noto Serif SC",fallbacks:["STKaiti","KaiTi","SimKai","FangSong","serif"],description:"康熙字典风格的古典字体，适合正式文档",webFontUrl:"./fonts/kangxi.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"songti",displayName:"宋体古风",fontFamily:"Noto Serif SC",fallbacks:["STSong","SimSun","Song","serif"],description:"宋体风格，具有古典韵味",webFontUrl:"./fonts/songti.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"kaiti",displayName:"楷体",fontFamily:"Ma Shan Zheng",fallbacks:["STKaiti","KaiTi","SimKai","FangSong","serif"],description:"楷体，端正秀丽，适合正式场合",webFontUrl:"./fonts/kaiti.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Ma+Shan+Zheng:wght@400&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng:wght@400&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"fangsong",displayName:"仿宋",fontFamily:"ZCOOL XiaoWei",fallbacks:["STFangsong","FangSong","SimSun","serif"],description:"仿宋体，古朴典雅",webFontUrl:"./fonts/fangsong.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=ZCOOL+XiaoWei&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"lishu",displayName:"隶书",fontFamily:"Liu Jian Mao Cao",fallbacks:["STLiti","LiSu","SimLi","serif"],description:"隶书风格，古朴大气",webFontUrl:"./fonts/lishu.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Liu+Jian+Mao+Cao&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"hanyi_shangwei",displayName:"汉仪尚巍手书W",fontFamily:"HYShangWeiShouShuW",fallbacks:["Ma Shan Zheng","STKaiti","KaiTi","SimKai","FangSong","serif"],description:"汉仪尚巍手书体，现代手写风格，具有个性化特色",webFontUrl:"./fonts/hanyi-shangwei.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Ma+Shan+Zheng:wght@400&display=swap",jsdelivr:"https://cdn.jsdelivr.net/npm/@fontsource/ma-shan-zheng@4.5.0/index.css",unpkg:"https://unpkg.com/@fontsource/ma-shan-zheng@4.5.0/index.css",googleFonts:"https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng:wght@400&display=swap"},loadConfig:{priority:"high",preload:!0,display:"swap"}}],Ot=[{name:"noto_sans_sc",displayName:"Noto Sans SC",fontFamily:"Noto Sans SC",fallbacks:["PingFang SC","Microsoft YaHei","SimHei","sans-serif"],description:"现代简洁的中文字体",webFontUrl:"./fonts/modern-sans.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"decorative",displayName:"装饰字体",fontFamily:"ZCOOL KuaiLe",fallbacks:["ZCOOL XiaoWei","Noto Sans SC","PingFang SC","sans-serif"],description:"活泼的装饰性字体，适合标题",webFontUrl:"./fonts/decorative.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=ZCOOL+KuaiLe&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap"},loadConfig:{priority:"medium",preload:!1,display:"swap"}},{name:"pingfang",displayName:"苹方",fontFamily:"PingFang SC",fallbacks:["Microsoft YaHei","SimHei","sans-serif"],description:"苹果设计的现代中文字体",localFontFiles:["PingFang SC"]},{name:"microsoft_yahei",displayName:"微软雅黑",fontFamily:"Microsoft YaHei",fallbacks:["SimHei","sans-serif"],description:"微软设计的现代中文字体",localFontFiles:["Microsoft YaHei"]}],Bt={ancient_chinese:_t,modern_chinese:Ot,english:[{name:"times_new_roman",displayName:"Times New Roman",fontFamily:"Times New Roman",fallbacks:["Times","serif"],description:"经典的英文衬线字体",localFontFiles:["Times New Roman","Times"]},{name:"georgia",displayName:"Georgia",fontFamily:"Georgia",fallbacks:["Times New Roman","serif"],description:"优雅的英文衬线字体",localFontFiles:["Georgia"]},{name:"arial",displayName:"Arial",fontFamily:"Arial",fallbacks:["Helvetica","sans-serif"],description:"经典的英文无衬线字体",localFontFiles:["Arial","Helvetica"]}],mixed:[{name:"ancient_mixed",displayName:"古典混合",fontFamily:"Noto Serif SC",fallbacks:["Ma Shan Zheng","STKaiti","KaiTi","Times New Roman","serif"],description:"中文古典字体配英文衬线字体",webFontUrl:"./fonts/kangxi.css"},{name:"modern_mixed",displayName:"现代混合",fontFamily:"Noto Sans SC",fallbacks:["PingFang SC","Microsoft YaHei","Arial","sans-serif"],description:"中文现代字体配英文无衬线字体",webFontUrl:"./fonts/modern-sans.css"}]},Rt={name:"fangsong",displayName:"仿宋",fontFamily:"ZCOOL XiaoWei",fallbacks:["STFangsong","FangSong","SimSun","serif"],description:"仿宋体，古朴典雅",webFontUrl:"./fonts/fangsong.css",cdnConfig:{loli:"https://fonts.loli.net/css2?family=ZCOOL+XiaoWei&display=swap",googleFonts:"https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap"},loadConfig:{priority:"high",preload:!1,display:"swap"}},Ut={primary:Rt,secondary:[_t[1],_t[2],Ot[0]],fallback:["STKaiti","KaiTi","SimKai","FangSong","STSong","SimSun","Song","PingFang SC","Microsoft YaHei","SimHei","Times New Roman","Georgia","Arial","serif","sans-serif"]},Gt=e=>[`"${e.primary.fontFamily}"`,...e.secondary.map(e=>`"${e.fontFamily}"`),...e.fallback.map(e=>e.includes(" ")?`"${e}"`:e)].join(", "),Kt=async e=>{if(!document.fonts)return!1;try{return await document.fonts.load(`16px "${e}"`),document.fonts.check(`16px "${e}"`)}catch(t){return At.extend("warn")(`Font ${e} check failed:`,t),!1}},Ht=new class{loadedFonts=new Set;loadingPromises=new Map;failedCDNs=new Set;async loadFont(e){const t=this.generateCacheKey(e);if(Nt.get(t))return At.extend("info")(`Font loaded from cache: ${e.name}`),void this.loadedFonts.add(e.name);if(this.loadedFonts.has(e.name))return;if(this.loadingPromises.has(e.name))return this.loadingPromises.get(e.name);const a=this.loadFontFromCDN(e);this.loadingPromises.set(e.name,a);try{await a,this.loadedFonts.add(e.name),At.extend("info")(`Font loaded successfully: ${e.name}`)}catch(i){throw At.extend("error")(`Failed to load font: ${e.name}`,i),i}finally{this.loadingPromises.delete(e.name)}}async loadFontFromCDN(e){const t=this.getCDNUrls(e);At.extend("info")(`🚀 Loading font "${e.name}" from ${t.length} sources`);for(let r=0;r<t.length;r++){const a=t[r];if(this.failedCDNs.has(a))At.extend("debug")(`⏭️ Skipping known failed CDN: ${a}`);else try{return At.extend("info")(`🔄 Trying source ${r+1}/${t.length}: ${a}`),await this.loadFromURL(a),void At.extend("info")(`✅ Font "${e.name}" loaded successfully from: ${a}`)}catch(i){At.extend("warn")(`❌ Failed to load from ${a}:`,i),this.failedCDNs.add(a),r<t.length-1&&At.extend("info")("🔄 Trying next CDN source...")}}const a=`Failed to load font "${e.name}" from all ${t.length} CDN sources`;throw At.extend("error")(a),new Error(a)}getCDNUrls(e){const t=[];return e.cdnConfig&&(e.cdnConfig.loli&&(t.push(e.cdnConfig.loli),At.extend("debug")(`Added loli CDN: ${e.cdnConfig.loli}`)),e.cdnConfig.jsdelivr&&(t.push(e.cdnConfig.jsdelivr),At.extend("debug")(`Added jsdelivr CDN: ${e.cdnConfig.jsdelivr}`)),e.cdnConfig.unpkg&&(t.push(e.cdnConfig.unpkg),At.extend("debug")(`Added unpkg CDN: ${e.cdnConfig.unpkg}`)),e.cdnConfig.googleFonts&&(t.push(e.cdnConfig.googleFonts),At.extend("debug")(`Added Google Fonts CDN: ${e.cdnConfig.googleFonts}`)),e.cdnConfig.custom&&(t.push(...e.cdnConfig.custom),At.extend("debug")(`Added custom CDNs: ${e.cdnConfig.custom.join(", ")}`))),e.webFontUrl&&(t.push(e.webFontUrl),At.extend("debug")(`Added local fallback: ${e.webFontUrl}`)),At.extend("info")(`Font ${e.name} CDN URLs order: ${t.join(" -> ")}`),t}async loadFromURL(e){return At.extend("info")(`🔄 Attempting to load font from: ${e}`),new Promise((t,a)=>{const i=document.createElement("link");i.rel="stylesheet",i.href=e,i.crossOrigin="anonymous",i.onload=()=>{At.extend("info")(`✅ Font successfully loaded from: ${e}`),this.cacheFontFromURL(e),t()},i.onerror=t=>{At.extend("warn")(`❌ Failed to load font from: ${e}`,t),a(new Error(`Failed to load font from: ${e}`))},setTimeout(()=>{At.extend("warn")(`⏰ Font load timeout (10s): ${e}`),a(new Error(`Font load timeout: ${e}`))},1e4),At.extend("debug")(`📎 Adding font link to document head: ${e}`),document.head.appendChild(i)})}generateCacheKey(e){return`font_${e.name}_${e.fontFamily}`}async cacheFontFromURL(e){try{if(document.fonts&&document.fonts.values){await document.fonts.ready;const t=Array.from(document.fonts.values()).find(t=>"loaded"===t.status&&t.src&&t.src.includes(e.split("/").pop()?.split("?")[0]||""));if(t){const a=`url_${e}`;Nt.set(a,t),At.extend("debug")(`Font cached: ${a}`)}}}catch(t){At.extend("warn")(`Failed to cache font from URL: ${e}`,t)}}async preloadCriticalFonts(){const e=[Rt].filter(e=>e.loadConfig?.preload).map(e=>this.loadFont(e));await Promise.allSettled(e)}isLoaded(e){return this.loadedFonts.has(e)}getLoadedFonts(){return Array.from(this.loadedFonts)}getCacheStats(){return Nt.getStats()}clearCache(){Nt.clear(),At.extend("info")("Font cache cleared")}async warmupCache(e){const t=e.filter(e=>e.loadConfig?.preload).map(e=>this.loadFont(e));await Promise.allSettled(t),At.extend("info")(`Font cache warmed up with ${t.length} fonts`)}},Wt=async e=>{const t=e.map(e=>Ht.loadFont(e));await Promise.allSettled(t)},Vt=S("UseFont"),Zt="flexiresume_font_config",Yt=i.createContext(void 0),Xt=({children:t})=>{const a=(()=>{const[e,t]=i.useState(()=>{try{const e=localStorage.getItem(Zt);if(e)return JSON.parse(e)}catch(e){Vt.extend("warn")("Failed to load font config from localStorage:",e)}return Ut}),[a,r]=i.useState(!1),[n,o]=i.useState(new Set),s=Gt(e),l=i.useCallback(async e=>{r(!0);try{const a=[e.primary,...e.secondary];await Wt(a);const i=await Promise.all(a.map(async e=>{const t=await Kt(e.fontFamily);return{fontFamily:e.fontFamily,isAvailable:t}})),r=new Set(n);i.forEach(({fontFamily:e,isAvailable:t})=>{t&&r.add(e)}),o(r),t(e),localStorage.setItem(Zt,JSON.stringify(e)),p(Gt(e))}catch(a){Vt.extend("error")("Failed to set font:",a)}finally{r(!1)}},[n]),c=i.useCallback(t=>{for(const a of Object.values(Mt)){const i=Bt[a],r=i.find(e=>e.name===t);if(r){const a={primary:r,secondary:i.filter(e=>e.name!==t).slice(0,2),fallback:e.fallback};return void l(a)}}Vt.extend("warn")(`Font ${t} not found`)},[e.fallback,l]),d=i.useCallback((t,a)=>{const i=Bt[t],r=i.find(e=>e.name===a);if(r){const t={primary:r,secondary:i.filter(e=>e.name!==a).slice(0,2),fallback:e.fallback};l(t)}else Vt.extend("warn")(`Font ${a} not found in type ${t}`)},[e.fallback,l]),p=i.useCallback(e=>{document.documentElement.style.setProperty("--font-family-primary",e),document.body.style.fontFamily=e},[]);return i.useEffect(()=>{(async()=>{r(!0);try{const t=[e.primary,...e.secondary];await Wt(t),p(s);const a=await Promise.all(t.map(async e=>{const t=await Kt(e.fontFamily);return{fontFamily:e.fontFamily,isAvailable:t}})),i=new Set;a.forEach(({fontFamily:e,isAvailable:t})=>{t&&i.add(e)}),o(i)}catch(t){Vt.extend("error")("Failed to initialize font:",t)}finally{r(!1)}})()},[]),i.useEffect(()=>{p(s)},[s,p]),{currentFont:e,setFont:l,setFontByName:c,setFontByType:d,availableFonts:Bt,fontCSS:s,isLoading:a,loadedFonts:n}})();return e.jsx(Yt.Provider,{value:a,children:t})},Jt=m.div`
  position: relative;
  display: inline-block;
`,qt=m.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Qt=m.span`
  font-size: 16px;
  line-height: 1;
`,ea=m.span`
  font-weight: 500;
`,ta=m.div.withConfig({shouldForwardProp:e=>"isOpen"!==e&&"isDark"!==e})`
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
`,aa=m.button.withConfig({shouldForwardProp:e=>"isActive"!==e&&"isDark"!==e})`
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
`,ia=m.span.withConfig({shouldForwardProp:e=>"visible"!==e&&"isDark"!==e})`
  opacity: ${e=>e.visible?1:0};
  color: var(--color-status-success);
  font-weight: bold;
  margin-left: auto;
`,ra=[{code:"zh",name:"Chinese",icon:"🇨🇳",nativeName:"中文"},{code:"en",name:"English",icon:"🇺🇸",nativeName:"English"}],na=({className:t})=>{const{language:a,setLanguage:i,t:n}=dt(),{isDark:o}=Ce(),[s,l]=r.useState(!1),c=ra.find(e=>e.code===a);r.useEffect(()=>{const e=$();e!==a&&i(e)},[a,i]);const d=r.useCallback(e=>{e.target.closest("[data-language-switcher]")||l(!1)},[]);return r.useEffect(()=>{if(s)return document.addEventListener("click",d),()=>document.removeEventListener("click",d)},[s,d]),e.jsxs(Jt,{className:t,"data-testid":"language-switcher","data-language-switcher":!0,children:[e.jsxs(qt,{isDark:o,onClick:()=>l(!s),title:n.common.switchLanguage,"aria-label":n.common.switchLanguage,children:[e.jsx(Qt,{children:c?.icon}),e.jsx(ea,{children:c?.nativeName}),e.jsx("span",{style:{transform:s?"rotate(0deg)":"rotate(180deg)",transition:"transform 0.3s ease",fontSize:"12px"},children:"▲"})]}),e.jsx(ta,{isOpen:s,isDark:o,children:ra.map(t=>e.jsxs(aa,{isActive:a===t.code,isDark:o,onClick:()=>(e=>{i(e);const t=e;E(t),(e=>{try{localStorage.setItem("flexiresume-language",e)}catch(t){D("Failed to save language preference to localStorage",t)}})(t),l(!1)})(t.code),children:[e.jsx("span",{children:t.icon}),e.jsx("span",{children:t.nativeName}),e.jsx(ia,{visible:a===t.code,isDark:o,children:"✓"})]},t.code))})]})},oa=m.div`
  position: relative;
  display: inline-block;
`,sa=m.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,la=m.div.withConfig({shouldForwardProp:e=>"isVisible"!==e})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${e=>e.isVisible?"scale(1) rotate(0deg)":"scale(0) rotate(180deg)"};
  opacity: ${e=>e.isVisible?1:0};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`,ca=m.div`
  position: relative;
  
  &::before {
    content: '☀️';
    font-size: 20px;
    display: block;
  }
`,da=m.div`
  position: relative;
  
  &::before {
    content: '🌙';
    font-size: 18px;
    display: block;
  }
`,pa=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e&&"isVisible"!==e})`
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
`,ma=m.div.withConfig({shouldForwardProp:e=>"isActive"!==e})`
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
`,ha=({className:t,showTooltip:a=!0})=>{const{mode:i,toggleMode:n,isDark:o}=Ce(),{t:s}=dt(),[l,c]=r.useState(!1),[d,p]=r.useState(!1),m=o?s.common.lightMode:s.common.darkMode;return e.jsxs(oa,{className:t,"data-theme-switcher":!0,onMouseEnter:()=>c(!0),onMouseLeave:()=>c(!1),children:[e.jsxs(sa,{isDark:o,onClick:()=>{p(!0),setTimeout(()=>p(!1),600),n()},title:m,"aria-label":m,children:[e.jsx(ma,{isActive:d}),e.jsx(la,{isVisible:!o,children:e.jsx(ca,{})}),e.jsx(la,{isVisible:o,children:e.jsx(da,{})})]}),a&&e.jsx(pa,{isDark:o,isVisible:l,children:m})]})},ua=m.div`
  position: relative;
  display: inline-block;
`,ga=m.button`
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
`,fa=m.div`
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
`,ba=m.div`
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
  }
`,xa=m.div`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,ya=m.button`
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
`,wa=m.div`
  padding: 12px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 12px;
`,va={[Mt.ANCIENT_CHINESE]:"古典中文",[Mt.MODERN_CHINESE]:"现代中文",[Mt.ENGLISH]:"英文字体",[Mt.MIXED]:"混合字体"},ka=()=>{const{isDark:t}=Ce(),{currentFont:a,setFontByName:n,availableFonts:o,isLoading:s,loadedFonts:l}=i.useContext(Yt)||(Vt.extend("warn")("useFontContext must be used within a FontProvider, using default font context"),{currentFont:Ut,setFont:()=>{},setFontByName:()=>{},setFontByType:()=>{},availableFonts:Bt,fontCSS:Gt(Ut),isLoading:!1,loadedFonts:new Set}),[c,d]=i.useState(!1);return r.useEffect(()=>{const e=()=>{d(!1)};if(c)return document.addEventListener("click",e),()=>{document.removeEventListener("click",e)}},[c]),e.jsxs(ua,{onClick:e=>{e.stopPropagation()},children:[e.jsxs(ga,{$isDark:t,className:c?"open":"",onClick:e=>{e.stopPropagation(),d(!c)},disabled:s,children:[e.jsx("span",{children:a.primary.displayName}),e.jsx("span",{className:"icon",children:"▼"})]}),e.jsxs(fa,{$isOpen:c,$isDark:t,children:[s&&e.jsx(wa,{children:"正在加载字体..."}),!s&&Object.entries(o).map(([t,i])=>e.jsxs(ba,{children:[e.jsx(xa,{children:va[t]}),i.map(t=>e.jsxs(ya,{$isSelected:a.primary.name===t.name,$fontFamily:`"${t.fontFamily}", ${t.fallbacks.join(", ")}`,onClick:()=>{return e=t.name,n(e),void d(!1);var e},children:[e.jsxs("div",{className:"font-name",children:[t.displayName,l.has(t.fontFamily)&&" ✓"]}),e.jsx("div",{className:"font-description",children:t.description})]},t.name))]},t))]})]})},Ca=S("PDFDownloader"),Sa=S("pdf");var Da=!1;class Fa{static instance;isActivated=!1;static getInstance(){return Fa.instance||(Fa.instance=new Fa),Fa.instance}activatePrintStyle(e="standard"){Sa(`激活打印样式，模式: ${e}`),"standard"===e?(document.body.classList.add("print-mode-active"),this.isActivated=!0,Sa("已激活标准打印样式")):(document.body.classList.remove("print-mode-active"),this.isActivated=!1,Sa("原版模式：未激活全局打印样式"))}deactivatePrintStyle(){Sa("取消激活打印样式"),document.body.classList.remove("print-mode-active"),this.isActivated=!1}isStyleActivated(){return this.isActivated}}const ja=Fa.getInstance(),Pa=m.div`
  position: relative;
  display: inline-block;
`,La=m.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,$a=m.span`
  font-size: 16px;
  line-height: 1;
`,Ea=m.span`
  font-weight: 500;
`,Ta=m.div.withConfig({shouldForwardProp:e=>"isOpen"!==e&&"isDark"!==e})`
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
`,za=m.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Ia=m.div`
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
`,Aa=({className:t})=>{const{isDark:a}=Ce();Da=a;const{t:n}=dt(),[o,s]=i.useState(!1),[l,c]=i.useState(!1);function d(e=!0){const t="dark-filter-override",a=document.getElementById(t);if(a&&a.remove(),e){const e=document.createElement("style");e.id=t,e.type="text/css",e.textContent='\n            [data-theme="dark"] body::before {\n                filter: none !important;\n                -webkit-filter: none !important;\n            }\n        ',document.head.appendChild(e),Ca("已禁用深色模式背景滤镜")}else Ca("已恢复深色模式背景滤镜")}r.useEffect(()=>{const e=e=>{e.target.closest("[data-pdf-downloader]")||s(!1)};if(o)return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[o]),i.useEffect(()=>{const e=e=>{if(e.ctrlKey&&"p"===e.key){Sa("检测到Ctrl+P快捷键，激活标准打印样式"),ja.activatePrintStyle("standard");const e=()=>{Sa("打印对话框关闭，清理打印样式"),ja.deactivatePrintStyle(),window.removeEventListener("afterprint",e)};window.addEventListener("afterprint",e),setTimeout(()=>{ja.isStyleActivated()&&(Sa("备用清理：5秒后自动清理打印样式"),ja.deactivatePrintStyle())},5e3)}};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[]);const p=async e=>{if(!l){c(!0),s(!1);try{Sa(`开始生成${"color"===e?"彩色":"grayscale"===e?"黑白":"原版"}PDF`),"original"===e?(ja.activatePrintStyle("original"),Sa("原版模式：保持在线显示样式")):(ja.activatePrintStyle("standard"),d(!0),Sa(`${e}模式：激活标准打印样式`));const t=document.body.cloneNode(!0);['[data-testid="control-panel"]',"[data-pdf-downloader]",".control-panel",".floating-panel"].forEach(e=>{t.querySelectorAll(e).forEach(e=>e.remove())}),Sa("准备在当前页面打印，不创建新窗口");const a="temp-pdf-print-style";let i=document.getElementById(a);i&&i.remove();const r=document.createElement("style");r.id=a,r.type="text/css";const n="original"===e?`\n          @media print {\n            /* 基础打印设置 */\n            @page {\n              size: A4;\n              margin: 1cm;\n              background: ${Da?"#000":"#fff"};\n              background-color: ${Da?"#000":"#fff"};\n              /* 隐藏页眉页脚 */\n              @top-left { content: none; }\n              @top-center { content: none; }\n              @top-right { content: none; }\n              @bottom-left { content: none; }\n              @bottom-center { content: none; }\n              @bottom-right { content: none; }\n            }\n \n\n            /* 强制打印背景色 */\n            html, body {\n                -webkit-print-color-adjust: exact !important;\n                color-adjust: exact !important;\n                print-color-adjust: exact !important;\n            }\n\n            /* 强制保持所有原有颜色和样式 - 最高优先级 */\n            * {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 确保HTML根元素保持主题 */\n            html {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 确保body保持背景色 */\n            body {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 深色模式特殊处理 */\n            [data-theme="dark"] {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            [data-theme="dark"] body {\n              background-color: var(--color-background) !important;\n              color: var(--color-text-primary) !important;\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 确保深色模式的背景伪元素正确显示 */\n            [data-theme="dark"] body::before {\n              content: "" !important;\n              position: fixed !important;\n              top: 0 !important;\n              left: 0 !important;\n              width: 100% !important;\n              height: 100% !important;\n              background-color: var(--color-background) !important;\n              z-index: -1 !important;\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 保持所有元素的原有样式 */\n            [data-theme="dark"] * {\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 确保resume-content保持深色背景 - 最高优先级 */\n            [data-theme="dark"] [data-testid="resume-content"] {\n              background: var(--color-card) !important;\n              background-color: #2d3748 !important;\n              color: var(--color-text-primary) !important;\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n\n            /* 只隐藏不需要的元素，不改变任何颜色和样式 */\n            .no-print,\n            .print-hide,\n            .control-panel,\n            .floating-controls,\n            nav,\n            .navigation,\n            .tabs,\n            .tab-container,\n            button:not(.skill-item):not([class*="skill"]),\n            [data-testid="control-panel"],\n            [data-testid="development-notice"],\n            [data-pdf-downloader],\n            .pdf-downloader,\n            .control-button,\n            .floating-button,\n            [class*="control"]:not(.skill-item),\n            [class*="floating"]:not(.skill-item),\n            [class*="button"]:not(.skill-item),\n            .fixed,\n            .absolute {\n              display: none !important;\n            }\n\n            /* 确保技能标签正常显示 */\n            .skill-item,\n            [class*="skill"],\n            [class*="Skill"],\n            span[title*="了解"],\n            span[title*="熟练"],\n            span[title*="精通"],\n            span[title*="Basic"],\n            span[title*="Proficient"],\n            span[title*="Expert"],\n            span[title*="Familiar"],\n            span[title*="Experienced"],\n            span[title*="Advanced"] {\n              display: inline-flex !important;\n              visibility: visible !important;\n              -webkit-print-color-adjust: exact !important;\n              color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n          }\n        `:`\n          @media print {\n            /* 确保激活全局打印样式 */\n            body.print-mode-active {\n              /* 页面设置 */\n              @page {\n                size: A4;\n                margin: 1cm;  \n                /* 隐藏页眉页脚 */\n                @top-left { content: none; }\n                @top-center { content: none; }\n                @top-right { content: none; }\n                @bottom-left { content: none; }\n                @bottom-center { content: none; }\n                @bottom-right { content: none; }\n              }\n\n              /* 强制重置深色模式下的所有滤镜效果 */\n              [data-theme="dark"] body::before { \n                filter: none !important;\n                -webkit-filter: none !important;\n              }\n\n              /* 重置根元素和主要容器的背景 */\n              html, body, #root {\n                background: white !important;\n                background-color: white !important;\n                color: black !important;\n                filter: none !important;\n                -webkit-filter: none !important;    \n              }\n\n              /* 确保简历内容区域有白色背景 */\n              [data-testid="resume-content"],\n              .resume-content,\n              .main-content {\n                background: white !important;\n                background-color: white !important;\n                color: black !important;\n                filter: none !important;\n                -webkit-filter: none !important;    \n              }\n\n\n              /* 重置根元素和body */\n              html, body {\n                width: 100% !important;\n                height: auto !important;\n                margin: 0 !important;\n                padding: 20px !important;\n                background: white !important;\n                background-image: none !important;\n                overflow: visible !important;\n                font-size: 12pt !important;\n                line-height: 1.4 !important;\n                color: black !important;  \n                filter: none !important;\n                -webkit-filter: none !important;                  \n              }\n\n              /* 隐藏深色模式背景伪元素 */\n              [data-theme="dark"] body::before {\n                display: none !important;\n                filter: none !important;\n                -webkit-filter: none !important;    \n              }\n\n              /* 根元素打印优化 */\n              #root {\n                display: block !important;\n                width: 100% !important;\n                max-width: none !important;\n                margin: 0 !important;\n                padding: 0 !important;\n                background: white !important;\n                overflow: visible !important;\n              }\n\n              /* 隐藏不需要打印的元素 - 扩展选择器 */\n              .no-print,\n              .print-hide,\n              button:not(.skill-item):not([class*="skill"]),\n              .control-panel,\n              .floating-controls,\n              .floating-button,\n              .control-button,\n              nav,\n              .navigation,\n              .tabs,\n              .tab-container,\n              [data-testid="control-panel"],\n              [data-testid="development-notice"],\n              [data-pdf-downloader],\n              .pdf-downloader,\n              [class*="control"]:not(.skill-item):not(.category-item),\n              [class*="floating"]:not(.skill-item):not(.category-item),\n              [class*="button"]:not(.skill-item):not(.category-item),\n              [class*="Panel"],\n              [class*="Switcher"],\n              [class*="Downloader"],\n              .fixed,\n              .absolute {\n                display: none !important;\n                visibility: hidden !important;\n              }\n\n              /* 确保文本内容为黑色，但保持透明背景 */\n              p, h1, h2, h3, h4, h5, h6, li, td, th, span:not(.skill-item span), div:not(.skill-item) {\n                color: black !important;\n                /* 不强制设置背景色，保持透明 */\n              }\n\n              /* 保留技能标签的样式和颜色 */\n              .skill-item,\n              [class*="skill"],\n              [class*="Skill"],\n              span[title*="了解"],\n              span[title*="熟练"],\n              span[title*="精通"],\n              span[title*="Basic"],\n              span[title*="Proficient"],\n              span[title*="Expert"],\n              span[title*="Familiar"],\n              span[title*="Experienced"],\n              span[title*="Advanced"] {\n                background: initial !important;\n                color: initial !important;\n                -webkit-print-color-adjust: exact !important;\n                color-adjust: exact !important;\n                print-color-adjust: exact !important;\n              }\n\n              /* 技能标签内的文字保持渐变色 */\n              .skill-item span,\n              [class*="skill"] span,\n              [class*="Skill"] span {\n                background-clip: text !important;\n                -webkit-background-clip: text !important;\n                color: transparent !important;\n                background-image: inherit !important;\n                -webkit-print-color-adjust: exact !important;\n                color-adjust: exact !important;\n                print-color-adjust: exact !important;\n              }\n\n              /* 链接样式 */\n              a {\n                color: black !important;\n                text-decoration: underline !important;\n              }\n\n              /* 分页控制 */\n              .page-break-before {\n                page-break-before: always;\n              }\n\n              .page-break-after {\n                page-break-after: always;\n              }\n\n              .page-break-inside-avoid {\n                page-break-inside: avoid;\n              }\n\n              /* 黑白模式特殊处理 */\n              ${"grayscale"===e?"\n                * {\n                  filter: grayscale(100%) !important;\n                  -webkit-filter: grayscale(100%) !important;\n                }\n              ":""}\n              /* 强制重置深色模式下的所有滤镜效果 */\n                [data-theme="dark"] * {\n                  filter: none !important;\n                  -webkit-filter: none !important;\n                }\n            }\n\n            /* 调试信息 */\n            .pdf-debug-info {\n              position: fixed;\n              top: 10px;\n              right: 10px;\n              background: rgba(255,255,255,0.9) !important;\n              color: blue !important;\n              padding: 5px !important;\n              border: 2px solid blue !important;\n              z-index: 9999 !important;\n              font-size: 14px !important;\n              font-weight: bold !important;\n            }\n          }\n        `;r.textContent=n,document.head.appendChild(r),await new Promise(e=>setTimeout(e,300));const o="color"===e?"彩色版":"grayscale"===e?"黑白版":"原版";Sa(`开始打印${o}`),window.print(),d(!1),setTimeout(()=>{const e=document.getElementById(a);e&&e.remove(),Sa("已清理临时打印样式")},1e3),Sa(`${o}PDF生成完成`)}catch(t){Sa("PDF生成失败:",t),alert(`${n.common?.pdfGenerationFailed||"PDF generation failed"}: ${t instanceof Error?t.message:n.common?.unknownError||"Unknown error"}`)}finally{ja.deactivatePrintStyle(),c(!1),d(!1),Sa("PDF生成流程结束，已清理打印样式")}}};return e.jsxs(Pa,{className:t,"data-testid":"pdf-downloader","data-pdf-downloader":!0,children:[e.jsxs(La,{isDark:a,onClick:()=>s(!o),disabled:l,title:n.common?.downloadPDF||"Download PDF","aria-label":n.common?.downloadPDF||"Download PDF",children:[e.jsx($a,{children:l?e.jsx(Ia,{}):"📄"}),e.jsx(Ea,{children:l?n.common?.generating||"Generating...":"PDF"}),!l&&e.jsx("span",{style:{transform:o?"rotate(0deg)":"rotate(180deg)",transition:"transform 0.3s ease",fontSize:"12px"},children:"▲"})]}),e.jsxs(Ta,{isOpen:o&&!l,isDark:a,children:[e.jsxs(za,{isDark:a,onClick:()=>p("original"),disabled:l,children:[e.jsx("span",{children:"📱"}),e.jsx("span",{children:n.common?.originalPDF||"Original PDF"})]}),e.jsxs(za,{isDark:a,onClick:()=>p("color"),disabled:l,children:[e.jsx("span",{children:"🎨"}),e.jsx("span",{children:n.common?.colorPDF||"Color PDF"})]}),e.jsxs(za,{isDark:a,onClick:()=>p("grayscale"),disabled:l,children:[e.jsx("span",{children:"⚫"}),e.jsx("span",{children:n.common?.grayscalePDF||"Grayscale PDF"})]})]})]})},Na=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
`,Ma=m.button.withConfig({shouldForwardProp:e=>"isDark"!==e&&"active"!==e})`
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
`,_a=m.input.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Oa=m.span.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  font-size: 12px;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
  white-space: nowrap;
`,Ba=({className:t})=>{const{isDark:a}=Ce(),{t:r}=dt(),[n,o]=i.useState(!0),[s,l]=i.useState(.7);return i.useEffect(()=>{Ke.setEnabled(n),Ke.setGlobalVolume(s,s)},[n,s]),e.jsxs(Na,{isDark:a,className:t,children:[n&&e.jsxs(e.Fragment,{children:[e.jsx(Oa,{isDark:a,children:"音量"}),e.jsx(_a,{isDark:a,type:"range",min:"0",max:"1",step:"0.1",value:s,onChange:e=>{const t=parseFloat(e.target.value);l(t)},title:`音量: ${Math.round(100*s)}%`})]}),e.jsx(Ma,{isDark:a,active:n,onClick:()=>{o(!n)},title:n?"关闭音效":"开启音效",children:n?"🔊":"🔇"})]})},Ra=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
  }
`,Ua=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  width: 1px;
  height: 24px;
  background: var(--color-border-light);
  transition: background 0.3s ease;
`;m.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`;const Ga=m.div.withConfig({shouldForwardProp:e=>"isCollapsed"!==e&&"isDark"!==e})`
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
`,Ka=m.button.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
`,Ha=m.div.withConfig({shouldForwardProp:e=>"isDark"!==e})`
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
  min-width: 200px;
`,Wa=m.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,Va=m.span.withConfig({shouldForwardProp:e=>"isDark"!==e})`
  font-size: 14px;
  font-weight: 500;
  color: ${e=>e.isDark?"#e2e8f0":"#2c3e50"};
`,Za=({className:t,collapsible:a=!1,defaultCollapsed:i=!1})=>{const{isDark:n}=Ce(),{t:o}=dt(),s=((e=768)=>{const[t,a]=r.useState(()=>"undefined"==typeof window||window.innerWidth>e);return r.useEffect(()=>{let t;const i=()=>{clearTimeout(t),t=setTimeout(()=>{a(window.innerWidth>e)},100)};return window.addEventListener("resize",i),i(),()=>{window.removeEventListener("resize",i),clearTimeout(t)}},[e]),t})(768),l=r.useMemo(()=>!1!==i?i:!s,[s,i]),[c,d]=r.useState(l),[p,m]=r.useState(!1);r.useEffect(()=>{p||d(l)},[l,p]);return a?e.jsxs(Ga,{isCollapsed:c,isDark:n,className:t,"data-testid":"control-panel",children:[e.jsx(Ka,{isDark:n,onClick:()=>{m(!0),d(!c)},title:o.common.controlPanel,"aria-label":o.common.controlPanel,children:c?"⚙️":"✕"}),!c&&e.jsxs(Ha,{isDark:n,children:[e.jsxs(Wa,{children:[e.jsx(Va,{isDark:n,children:o.common.theme}),e.jsx(ha,{showTooltip:!1})]}),e.jsx(Ua,{isDark:n}),e.jsxs(Wa,{children:[e.jsx(Va,{isDark:n,children:o.common.language}),e.jsx(na,{})]}),e.jsx(Ua,{isDark:n}),e.jsxs(Wa,{children:[e.jsx(Va,{isDark:n,children:"字体"}),e.jsx(ka,{})]}),e.jsx(Ua,{isDark:n}),e.jsxs(Wa,{children:[e.jsx(Va,{isDark:n,children:"音乐"}),e.jsx(Ba,{})]}),e.jsx(Ua,{isDark:n}),e.jsxs(Wa,{children:[e.jsx(Va,{isDark:n,children:o.common.downloadPDF}),e.jsx(Aa,{})]})]})]}):e.jsxs(Ra,{isDark:n,className:t,"data-testid":"control-panel",children:[e.jsx(ha,{}),e.jsx(Ua,{isDark:n}),e.jsx(na,{}),e.jsx(Ua,{isDark:n}),e.jsx(ka,{}),e.jsx(Ua,{isDark:n}),e.jsx(Ba,{}),e.jsx(Ua,{isDark:n}),e.jsx(Aa,{})]})},Ya=()=>null,Xa=S("LibraryPreloader"),Ja=S("preloader"),qa=new class{libraries=new Map;preloadPromises=new Map;constructor(){this.initializeLibraryStates()}initializeLibraryStates(){["mermaid","svgPanZoom","katex","cytoscape"].forEach(e=>{this.libraries.set(e,{loading:!1,loaded:!1,error:null,module:null})})}async startPreloading(){const e=O(),{preloadLibraries:t}=e.performance;R()&&Ja("[LibraryPreloader] 开始预加载库:",t);const a=[];t.mermaid&&a.push(this.preloadMermaid()),t.svgPanZoom&&a.push(this.preloadSvgPanZoom()),t.katex&&a.push(this.preloadKatex()),t.cytoscape&&a.push(this.preloadCytoscape()),Promise.allSettled(a).then(e=>{if(R()){const t=e.filter(e=>"fulfilled"===e.status).length,a=e.filter(e=>"rejected"===e.status).length;Ja(`[LibraryPreloader] 预加载完成: ${t}个成功, ${a}个失败`)}})}async preloadMermaid(){return this.preloadLibrary("mermaid",()=>o(()=>import("./mermaid-core-hyY6ZuoR.js").then(e=>e.b8),__vite__mapDeps([1,2,3]),import.meta.url))}async preloadSvgPanZoom(){return this.preloadLibrary("svgPanZoom",()=>o(()=>import("./utils-CEXnc-BX.js").then(e=>e.s),__vite__mapDeps([5,2]),import.meta.url))}async preloadKatex(){return this.preloadLibrary("katex",()=>o(()=>import("./katex-CgY2OwR7.js"),[],import.meta.url))}async preloadCytoscape(){return this.preloadLibrary("cytoscape",()=>o(()=>import("./cytoscape-BKktfreJ.js").then(e=>e.b),__vite__mapDeps([6,2]),import.meta.url))}async preloadLibrary(e,t){const a=this.libraries.get(e);if(!a||a.loaded||a.loading)return;if(this.preloadPromises.has(e))return this.preloadPromises.get(e);a.loading=!0,a.error=null;const i=performance.now(),r=t().then(t=>{const r=performance.now()-i;return a.loaded=!0,a.loading=!1,a.module=t,R()&&Ja(`[LibraryPreloader] ${e} 预加载成功 (${r.toFixed(2)}ms)`),t}).catch(t=>{throw a.loading=!1,a.error=t.message,R()&&Xa.extend("warn")(`[LibraryPreloader] ${e} 预加载失败:`,t),t}).finally(()=>{this.preloadPromises.delete(e)});return this.preloadPromises.set(e,r),r}async getLibrary(e){const t=this.libraries.get(e);if(!t)throw new Error(`Unknown library: ${e}`);if(t.loaded&&t.module)return t.module;if(t.loading&&this.preloadPromises.has(e))return this.preloadPromises.get(e);switch(e){case"mermaid":return this.preloadMermaid();case"svgPanZoom":return this.preloadSvgPanZoom();case"katex":return this.preloadKatex();case"cytoscape":return this.preloadCytoscape();default:throw new Error(`Unknown library: ${e}`)}}getLibraryState(e){return this.libraries.get(e)||null}getAllLibraryStates(){return new Map(this.libraries)}cleanup(){this.libraries.clear(),this.preloadPromises.clear()}},Qa=S("analytics-config"),ei={baidu:{enabled:!1,siteId:"",domain:"",autoTrack:!0,debug:!1},google:{enabled:!1,measurementId:"",debug:!1,customDimensions:{},customMetrics:{},useFirebase:!0,dynamicLoading:!0},elk:{enabled:!1,endpoint:"http://localhost:5000",batchSize:10,flushInterval:5e3,debug:!1},enablePerformanceMonitoring:!0,enableErrorTracking:!0,enableUserBehaviorTracking:!0};class ti{static instance;config;constructor(){this.config=this.loadConfig()}static getInstance(){return ti.instance||(ti.instance=new ti),ti.instance}loadConfig(){const e={...ei};e.baidu={enabled:!0,siteId:"",domain:"deden.web.app",autoTrack:!0,debug:!1},e.google={enabled:!1,measurementId:"G-7LG0G58765",debug:!1,customDimensions:{},customMetrics:{},useFirebase:!1,dynamicLoading:!0},e.elk={enabled:!1,endpoint:"http://localhost:5001",batchSize:parseInt("10"),flushInterval:parseInt("5000"),debug:!1};try{const t=localStorage.getItem("analytics_config");if(t){const a=JSON.parse(t);Object.assign(e,a)}}catch(t){Qa("Failed to load user analytics config: %O",t)}return e}getConfig(){return{...this.config}}getBaiduConfig(){return{...this.config.baidu}}getGoogleConfig(){return{...this.config.google}}getELKConfig(){return{...this.config.elk}}updateConfig(e){this.config={...this.config,...e};try{localStorage.setItem("analytics_config",JSON.stringify(this.config))}catch(t){Qa("Failed to save analytics config: %O",t)}}setBaiduEnabled(e){this.config.baidu.enabled=e,this.updateConfig({baidu:this.config.baidu})}setGoogleEnabled(e){this.config.google.enabled=e,this.updateConfig({google:this.config.google})}setELKEnabled(e){this.config.elk.enabled=e,this.updateConfig({elk:this.config.elk})}isAnyAnalyticsEnabled(){return this.config.baidu.enabled||this.config.google.enabled||this.config.elk.enabled}getConfigSummary(){return{baiduEnabled:this.config.baidu.enabled,googleEnabled:this.config.google.enabled,elkEnabled:this.config.elk.enabled,performanceMonitoring:this.config.enablePerformanceMonitoring,errorTracking:this.config.enableErrorTracking,userBehaviorTracking:this.config.enableUserBehaviorTracking}}}const ai=ti.getInstance(),ii=S("BaiduAnalytics");class ri{static instance;isInitialized=!1;siteId="fd188b066e21a8e15d579e5f0b7633a9";constructor(){}static getInstance(){return ri.instance||(ri.instance=new ri),ri.instance}async initialize(){const e=ai.getBaiduConfig();if(e.enabled)if(this.isInitialized)ii("[BaiduAnalytics] Already initialized");else try{window._hmt=window._hmt||[];const t=document.createElement("script");t.src=`https://hm.baidu.com/hm.js?${this.siteId}`,t.async=!0;const a=document.getElementsByTagName("script")[0];a&&a.parentNode?a.parentNode.insertBefore(t,a):document.head.appendChild(t),this.isInitialized=!0,e.debug&&ii("[BaiduAnalytics] Initialized successfully with site ID:",this.siteId),e.autoTrack&&this.trackPageView()}catch(t){ii.extend("error")("[BaiduAnalytics] Initialization failed:",t)}else ii("[BaiduAnalytics] Disabled by configuration")}trackPageView(e,t){if(!this.isReady())return;const a=e||location.pathname+location.search;window._hmt.push(["_trackPageview",a]),ai.getBaiduConfig().debug&&ii("[BaiduAnalytics] Page view tracked:",{pagePath:a,title:t})}trackEvent(e){if(!this.isReady())return;const{category:t,action:a,label:i,value:r}=e;if(!t||!a)return void ii.extend("warn")("[BaiduAnalytics] Category and action are required for event tracking");const n=["_trackEvent",t,a];i&&n.push(i),void 0!==r&&n.push(r),window._hmt.push(n),ai.getBaiduConfig().debug&&ii("[BaiduAnalytics] Event tracked:",e)}trackSkillClick(e,t){this.trackEvent({category:"skill",action:"click",label:e,value:1})}trackProjectView(e,t){this.trackEvent({category:"project",action:"view",label:e,value:1})}trackContactClick(e){this.trackEvent({category:"contact",action:"click",label:e,value:1})}trackLanguageSwitch(e,t){this.trackEvent({category:"language",action:"switch",label:`${e}_to_${t}`,value:1})}trackThemeSwitch(e,t){this.trackEvent({category:"theme",action:"switch",label:`${e}_to_${t}`,value:1})}trackDownload(e,t){this.trackEvent({category:"download",action:"click",label:t||e,value:1})}trackError(e,t){this.trackEvent({category:"error",action:e,label:t,value:1})}setCustomVar(e,t,a,i=3){this.isReady()&&(e<1||e>5?ii.extend("warn")("[BaiduAnalytics] Custom variable index must be between 1 and 5"):(window._hmt.push(["_setCustomVar",e,t,a,i]),ai.getBaiduConfig().debug&&ii("[BaiduAnalytics] Custom variable set:",{index:e,name:t,value:a,scope:i})))}isReady(){const e=ai.getBaiduConfig();return this.isInitialized&&e.enabled?!!window._hmt||(ii.extend("warn")("[BaiduAnalytics] _hmt object not available"),!1):(e.debug&&ii("[BaiduAnalytics] Not ready:",{initialized:this.isInitialized,enabled:e.enabled}),!1)}getStatus(){const e=ai.getBaiduConfig();return{initialized:this.isInitialized,enabled:e.enabled,siteId:this.siteId.substring(0,8)+"..."}}}const ni=ri.getInstance();"undefined"!=typeof window&&setTimeout(()=>{ni.initialize()},1e3);const oi=S("FirebaseAnalyticsLoader");class si{static instance;firebaseSDK=null;analytics=null;app=null;isLoading=!1;isLoaded=!1;loadPromise=null;constructor(){}static getInstance(){return si.instance||(si.instance=new si),si.instance}async loadFirebaseSDK(){try{if("undefined"==typeof window)return oi.extend("warn")("[FirebaseLoader] Not in browser environment"),null;if(this.firebaseSDK)return this.firebaseSDK;oi("[FirebaseLoader] Loading Firebase SDK from CDN...");const e=document.createElement("script");e.type="module",e.innerHTML="\n        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';\n        import { \n          getAnalytics, \n          isSupported, \n          logEvent, \n          setUserProperties, \n          setUserId,\n          setCurrentScreen \n        } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';\n        \n        window.__firebaseSDK = {\n          initializeApp,\n          getAnalytics,\n          isSupported,\n          logEvent,\n          setUserProperties,\n          setUserId,\n          setCurrentScreen\n        };\n        \n        window.dispatchEvent(new CustomEvent('firebaseSDKLoaded'));\n      ";const t=new Promise(t=>{const a=()=>{window.removeEventListener("firebaseSDKLoaded",a);const e=window.__firebaseSDK;e?(this.firebaseSDK=e,oi("[FirebaseLoader] Firebase SDK loaded successfully"),t(e)):(oi.extend("error")("[FirebaseLoader] Firebase SDK not found on window"),t(null))};window.addEventListener("firebaseSDKLoaded",a),e.addEventListener("error",()=>{oi.extend("error")("[FirebaseLoader] Failed to load Firebase SDK"),t(null)}),setTimeout(()=>{window.removeEventListener("firebaseSDKLoaded",a),oi.extend("error")("[FirebaseLoader] Firebase SDK load timeout"),t(null)},1e4)});return document.head.appendChild(e),await t}catch(e){return oi.extend("error")("[FirebaseLoader] Error loading Firebase SDK:",e),null}}getFirebaseConfig(){const e=ai.getGoogleConfig();if(!e.enabled)return oi("[FirebaseLoader] Firebase Analytics disabled in config"),null;const t={apiKey:"",authDomain:"",projectId:"",storageBucket:"",messagingSenderId:"",appId:"",measurementId:e.measurementId||"G-7LG0G58765"};return t.apiKey&&t.projectId&&t.measurementId?t:(oi.extend("warn")("[FirebaseLoader] Firebase configuration incomplete:",{hasApiKey:!!t.apiKey,hasProjectId:!!t.projectId,hasMeasurementId:!!t.measurementId}),null)}async initialize(){if(this.isLoading&&this.loadPromise)return await this.loadPromise;if(this.isLoaded&&this.analytics)return!0;this.isLoading=!0,this.loadPromise=this._doInitialize();const e=await this.loadPromise;return this.isLoading=!1,this.isLoaded=e,e}async _doInitialize(){try{oi("[FirebaseLoader] Initializing Firebase Analytics...");const e=this.getFirebaseConfig();if(!e)return!1;const t=await this.loadFirebaseSDK();return!!t&&(await t.isSupported()?(this.app=t.initializeApp(e),oi("[FirebaseLoader] Firebase App initialized"),this.analytics=t.getAnalytics(this.app),oi("[FirebaseLoader] Firebase Analytics initialized"),!0):(oi.extend("warn")("[FirebaseLoader] Firebase Analytics not supported in this browser"),!1))}catch(e){return oi.extend("error")("[FirebaseLoader] Firebase initialization failed:",e),!1}}async logEvent(e,t){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.logEvent(this.analytics,e,t),ai.getGoogleConfig().debug&&oi("[FirebaseLoader] Event logged:",{eventName:e,eventParams:t}))}catch(a){oi.extend("error")("[FirebaseLoader] Failed to log event:",a)}else oi.extend("warn")("[FirebaseLoader] Firebase not initialized, skipping event:",e)}async setUserProperties(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setUserProperties(this.analytics,e),ai.getGoogleConfig().debug&&oi("[FirebaseLoader] User properties set:",e))}catch(t){oi.extend("error")("[FirebaseLoader] Failed to set user properties:",t)}else oi.extend("warn")("[FirebaseLoader] Firebase not initialized, skipping user properties")}async setUserId(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setUserId(this.analytics,e),ai.getGoogleConfig().debug&&oi("[FirebaseLoader] User ID set:",e))}catch(t){oi.extend("error")("[FirebaseLoader] Failed to set user ID:",t)}else oi.extend("warn")("[FirebaseLoader] Firebase not initialized, skipping user ID")}async setCurrentScreen(e){if(await this.initialize())try{this.firebaseSDK&&this.analytics&&(this.firebaseSDK.setCurrentScreen(this.analytics,e),ai.getGoogleConfig().debug&&oi("[FirebaseLoader] Current screen set:",e))}catch(t){oi.extend("error")("[FirebaseLoader] Failed to set current screen:",t)}else oi.extend("warn")("[FirebaseLoader] Firebase not initialized, skipping screen tracking")}getStatus(){const e=this.getFirebaseConfig();return{isLoaded:this.isLoaded,isLoading:this.isLoading,hasAnalytics:!!this.analytics,hasApp:!!this.app,configValid:!!e}}reset(){this.firebaseSDK=null,this.analytics=null,this.app=null,this.isLoading=!1,this.isLoaded=!1,this.loadPromise=null,"undefined"!=typeof window&&delete window.__firebaseSDK}}const li=si.getInstance(),ci=S("GoogleAnalytics");class di{static instance;isInitialized=!1;analytics=null;measurementId="";constructor(){}static getInstance(){return di.instance||(di.instance=new di),di.instance}async initialize(){const e=ai.getGoogleConfig();if(e.enabled)if(e.measurementId)if(this.isInitialized)ci("[GoogleAnalytics] Already initialized");else{this.measurementId=e.measurementId;try{if(await this.initializeWithFirebase())return this.isInitialized=!0,void(e.debug&&ci("[GoogleAnalytics] Initialized with Firebase Analytics"));if(await this.initializeWithGtag())return this.isInitialized=!0,void(e.debug&&ci("[GoogleAnalytics] Initialized with gtag.js"));throw new Error("Failed to initialize with any method")}catch(t){ci.extend("error")("[GoogleAnalytics] Initialization failed:",t)}}else ci.extend("warn")("[GoogleAnalytics] Measurement ID not provided");else ci("[GoogleAnalytics] Disabled by configuration")}async initializeWithFirebase(){try{return ci("[GoogleAnalytics] Initializing with Firebase Analytics Loader..."),await li.initialize()?(this.analytics={},ci("[GoogleAnalytics] Firebase Analytics initialized via dynamic loader"),!0):(ci.extend("warn")("[GoogleAnalytics] Firebase Analytics initialization failed"),!1)}catch(e){return ci.extend("warn")("[GoogleAnalytics] Firebase initialization failed:",e),!1}}async initializeWithGtag(){try{window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)},window.gtag("js",new Date),window.gtag("config",this.measurementId,{debug_mode:ai.getGoogleConfig().debug});const e=document.createElement("script");return e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`,new Promise(t=>{e.onload=()=>t(!0),e.onerror=()=>t(!1),document.head.appendChild(e)})}catch(e){return ci.extend("warn")("[GoogleAnalytics] gtag.js initialization failed:",e),!1}}trackPageView(e){if(!this.isReady())return;const t=ai.getGoogleConfig(),a={page_title:e?.page_title||document.title,page_location:e?.page_location||window.location.href,page_path:e?.page_path||window.location.pathname,...e};try{this.analytics?import("firebase/analytics").then(({logEvent:e})=>{e(this.analytics,"page_view",a)}).catch(e=>{ci.extend("warn")("[GoogleAnalytics] Firebase analytics import failed:",e)}):window.gtag&&window.gtag("event","page_view",a),t.debug&&ci("[GoogleAnalytics] Page view tracked:",a)}catch(i){ci.extend("error")("[GoogleAnalytics] Page view tracking failed:",i)}}trackEvent(e){if(!this.isReady())return;const t=ai.getGoogleConfig(),{action:a,category:i,label:r,value:n,custom_parameters:o}=e;if(!a)return void ci.extend("warn")("[GoogleAnalytics] Event action is required");const s={event_category:i||"engagement",event_label:r,value:n,...o};Object.keys(s).forEach(e=>{void 0===s[e]&&delete s[e]});try{this.analytics?li.logEvent(a,s).catch(e=>{ci.extend("warn")("[GoogleAnalytics] Firebase analytics event failed:",e)}):window.gtag&&window.gtag("event",a,s),t.debug&&ci("[GoogleAnalytics] Event tracked:",{action:a,...s})}catch(l){ci.extend("error")("[GoogleAnalytics] Event tracking failed:",l)}}trackSkillClick(e,t){this.trackEvent({action:"skill_click",category:"user_interaction",label:e,custom_parameters:{skill_category:t,interaction_type:"click"}})}trackProjectView(e,t){this.trackEvent({action:"project_view",category:"content",label:e,custom_parameters:{project_type:t,content_type:"project"}})}trackContactClick(e,t){this.trackEvent({action:"contact_click",category:"user_interaction",label:e,custom_parameters:{contact_method:e,contact_value:t}})}trackLanguageSwitch(e,t){this.trackEvent({action:"language_change",category:"user_preference",label:`${e}_to_${t}`,custom_parameters:{previous_language:e,new_language:t}})}trackThemeSwitch(e,t){this.trackEvent({action:"theme_change",category:"user_preference",label:`${e}_to_${t}`,custom_parameters:{previous_theme:e,new_theme:t}})}trackDownload(e,t){this.trackEvent({action:"file_download",category:"engagement",label:t||e,custom_parameters:{file_type:e,file_name:t}})}trackError(e,t,a=!1){this.trackEvent({action:"exception",category:"error",label:e,custom_parameters:{description:t,fatal:a}})}setUserProperty(e,t){if(!this.isReady())return;const a=ai.getGoogleConfig();try{this.analytics?li.setUserProperties({[e]:t}).catch(e=>{ci.extend("warn")("[GoogleAnalytics] Firebase analytics user property failed:",e)}):window.gtag&&window.gtag("config",this.measurementId,{user_properties:{[e]:t}}),a.debug&&ci("[GoogleAnalytics] User property set:",{propertyName:e,propertyValue:t})}catch(i){ci.extend("error")("[GoogleAnalytics] Set user property failed:",i)}}isReady(){const e=ai.getGoogleConfig();return this.isInitialized&&e.enabled?!(!this.analytics&&!window.gtag&&(ci.extend("warn")("[GoogleAnalytics] No analytics instance available"),1)):(e.debug&&ci("[GoogleAnalytics] Not ready:",{initialized:this.isInitialized,enabled:e.enabled}),!1)}getStatus(){const e=ai.getGoogleConfig();let t="none";this.analytics?t="firebase":window.gtag&&(t="gtag");const a={initialized:this.isInitialized,enabled:e.enabled,measurementId:this.measurementId.substring(0,8)+"...",method:t};return"firebase"===t&&(a.firebaseLoader=li.getStatus()),a}}const pi=di.getInstance(),mi=S("elk");class hi{static instance;eventQueue=[];flushTimer=null;sessionId;constructor(){this.sessionId=this.generateSessionId(),this.setupAutoFlush(),this.setupPageUnloadHandler()}static getInstance(){return hi.instance||(hi.instance=new hi),hi.instance}generateSessionId(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}setupAutoFlush(){const e=ai.getELKConfig();e.enabled&&(this.flushTimer=setInterval(()=>{this.flushEvents()},e.flushInterval||5e3))}setupPageUnloadHandler(){window.addEventListener("beforeunload",()=>{this.flushEvents(!0)})}createBaseEvent(e,t){return{timestamp:(new Date).toISOString(),event_type:e,page:window.location.pathname,source:"flexiresume",user_agent:navigator.userAgent,referrer:document.referrer,data:{session_id:this.sessionId,...t}}}addEvent(e){const t=ai.getELKConfig();t.enabled?(this.eventQueue.push(e),this.eventQueue.length>=(t.batchSize||10)&&this.flushEvents(),t.debug&&mi("Event added to queue: %O",e)):t.debug&&mi("Disabled, event not added: %O",e)}async flushEvents(e=!1){const t=ai.getELKConfig();if(!t.enabled||0===this.eventQueue.length)return;const a=[...this.eventQueue];this.eventQueue=[];try{const i={events:a,source:"flexiresume",timestamp:(new Date).toISOString()};if(e&&navigator.sendBeacon)navigator.sendBeacon(t.endpoint,JSON.stringify(i));else{const e=await fetch(t.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});e.ok?t.debug&&mi("Events sent successfully: %d",a.length):(mi("Failed to send events: %s",e.statusText),a.length<(t.batchSize||10)&&this.eventQueue.unshift(...a))}}catch(i){mi("Error sending events: %O",i),a.length<(t.batchSize||10)&&this.eventQueue.unshift(...a)}}trackPageView(e,t){const a=this.createBaseEvent("page_view",{title:e||document.title,url:t||window.location.href,timestamp:Date.now()});this.addEvent(a)}trackUserInteraction(e,t,a,i){const r=this.createBaseEvent("user_interaction",{action:e,element:t,element_text:a,value:i,timestamp:Date.now()});this.addEvent(r)}trackPerformance(e,t,a,i){const r=this.createBaseEvent("performance",{metric_name:e,metric_value:t,metric_unit:a,additional_data:i,timestamp:Date.now()});this.addEvent(r)}trackError(e,t,a,i,r="medium"){const n=this.createBaseEvent("error",{error_type:e,error_message:t,error_stack:a,component:i,severity:r,timestamp:Date.now()});this.addEvent(n)}trackSkillClick(e,t){this.trackUserInteraction("skill_click","skill_tag",e,t)}trackProjectView(e,t){this.trackUserInteraction("project_view","project_card",e,t)}trackContactClick(e,t){this.trackUserInteraction("contact_click","contact_info",e,t)}trackLanguageSwitch(e,t){this.trackUserInteraction("language_switch","language_toggle",`${e}_to_${t}`)}trackThemeSwitch(e,t){this.trackUserInteraction("theme_switch","theme_toggle",`${e}_to_${t}`)}trackDownload(e,t){this.trackUserInteraction("download","download_button",e,t)}getStatus(){const e=ai.getELKConfig();return{enabled:e.enabled,sessionId:this.sessionId,queueSize:this.eventQueue.length,endpoint:e.endpoint}}setEnabled(e){ai.setELKEnabled(e),e?this.setupAutoFlush():(this.flushTimer&&(clearInterval(this.flushTimer),this.flushTimer=null),this.eventQueue=[])}}const ui=hi.getInstance();function gi(e){const{labelFormat:t}=function(){const e=O();return{labelFormat:e.tabs.labelFormat,labelSeparator:e.tabs.labelSeparator}}();return function(e,t){if(!t)return t?.position||"";let a=e;return Object.keys(t).forEach(e=>{const i=t[e];if(null!=i){const t=`{${e}}`;a=a.replace(new RegExp(t.replace(/[{}]/g,"\\$&"),"g"),String(i))}}),a=a.replace(/\{[^}]*\}/g,""),a=a.replace(/\s*\/\s*$/,"").replace(/^\s*\/\s*/,"").trim(),a||t.position||""}(t,e)}"undefined"!=typeof window&&(window.addEventListener("load",()=>{const e=performance.getEntriesByType("navigation")[0];e&&(ui.trackPerformance("page_load_time",e.loadEventEnd-e.loadEventStart,"ms"),ui.trackPerformance("dom_content_loaded",e.domContentLoadedEventEnd-e.domContentLoadedEventStart,"ms"),ui.trackPerformance("first_contentful_paint",performance.getEntriesByType("paint")[1]?.startTime||0,"ms"))}),window.addEventListener("error",e=>{ui.trackError("javascript_error",e.message,e.error?.stack,void 0,"high")}),window.addEventListener("unhandledrejection",e=>{ui.trackError("unhandled_promise_rejection",e.reason?.message||"Unhandled promise rejection",e.reason?.stack,void 0,"high")}));const fi=S("main"),bi=i.lazy(()=>o(()=>import("./FlexiResume-BepBF0H4.js"),__vite__mapDeps([7,8,2,9,1,3,10,5,11]),import.meta.url)),xi=()=>{const[t,a]=i.useState(null),[r,n]=i.useState([]),[o,s]=i.useState([]),[l,c]=i.useState("/"),[d,p]=i.useState(!0),[m,h]=i.useState("checking"),u=async()=>{try{h("checking");const e=O(),t=[];e.cdn.enabled&&e.cdn.healthCheck.enabled&&(fi("Initializing CDN health check..."),t.push(Y.initialize())),fi("Starting library preloading..."),t.push(qa.startPreloading()),await Promise.allSettled(t),e.performance.enablePreloading&&e.performance.preloadResources.length>0&&Y.preloadResources(e.performance.preloadResources).catch(e=>{fi("Resource preloading failed: %O",e)}),h("ready")}catch(e){fi("CDN initialization failed: %O",e),h("error")}},g=async()=>{try{p(!0);const e=await z();a(e),await(async()=>{try{ae=await z()}catch(e){ee("Failed to update data cache: %O",e)}})();const t=(e=>Object.keys(e.expected_positions).filter(t=>!e.expected_positions[t].hidden).map(t=>{const a=e.expected_positions[t],i=a.header_info;return[gi({name:i?.name,position:i?.position}),"/"+t,!!a.is_home_page,i?.avatar]}))(e),i=(e=>Object.keys(e.expected_positions).map(t=>({key:t,title:e.expected_positions[t].header_info?.position||t,path:"/"+t,isHomePage:!!e.expected_positions[t].is_home_page,hidden:!!e.expected_positions[t].hidden})))(e);n(t),s(i),c((e=>e.find(([,,e])=>e)?.[1]||"/")(t)),C.tabs=t}catch(e){fi("Failed to load language data: %O",e)}finally{p(!1)}},w=async()=>{try{fi("Initializing analytics..."),await ni.initialize(),await pi.initialize();const e=ni.getStatus(),t=pi.getStatus(),a=ui.getStatus();fi("Analytics status: %O",{baidu:e,google:t,elk:a,config:ai.getConfigSummary()}),ui.trackPageView("App Initialized",window.location.href)}catch(e){fi("Analytics initialization failed: %O",e)}};return i.useEffect(()=>{var e;return(async()=>{await Promise.all([u(),g(),w()])})(),e=()=>{g()},L.push(e),()=>{const t=L.indexOf(e);t>-1&&L.splice(t,1)}},[]),function(){const e=()=>{document.querySelectorAll(".lazy-video").forEach(e=>{const t=e.getBoundingClientRect();t.top<window.innerHeight+200&&t.bottom>0&&(e=>{const t=JSON.parse(e.dataset.sources),a=B().baseUrls.slice(0,3);let i="";a.forEach((e,a)=>{const r=t.original.startsWith("/")?`${e.endsWith("/")?e.slice(0,-1):e}${t.original}`:`${e.endsWith("/")?e:e+"/"}${t.original}`;i+=`<source src="${r}" type="video/mp4">\n        `});let r=t.original;try{r=Y.getResourceUrl(t.original,{enableFallback:!0,localBasePath:"",cacheUrls:!1})}catch(o){te("Failed to build local fallback URL: %O",o)}i+=`<source src="${t.original}" type="video/mp4">`,e.innerHTML=i,e.classList.remove("lazy-video"),e.removeAttribute("data-sources");const n=e.parentNode.querySelector(".loading-indicator");n?.remove()})(e)})};let t;window.addEventListener("scroll",()=>{t&&clearTimeout(t),t=setTimeout(e,100)}),window.addEventListener("resize",e),window.addEventListener("mouseup",()=>setTimeout(e,0)),e()}(),d||!t?e.jsx(ke,{children:e.jsx(ct,{children:e.jsxs(St,{level:"page",maxRetries:3,children:[e.jsx(Te,{}),e.jsx(Za,{collapsible:!0}),e.jsxs("div",{style:{position:"fixed",top:"20px",right:"20px",background:"rgba(0,0,0,0.8)",color:"white",padding:"8px 12px",borderRadius:"4px",fontSize:"12px",zIndex:9999},children:["checking"===m&&"🔄 检测CDN...","ready"===m&&"✅ CDN就绪","error"===m&&"⚠️ CDN检测失败"]}),e.jsx(It,{})]})})}):e.jsx(ke,{children:e.jsx(Xt,{children:e.jsx(ct,{children:e.jsx(St,{level:"page",maxRetries:3,children:e.jsxs(ot,{children:[e.jsx(Te,{}),e.jsx(Za,{collapsible:!0}),e.jsxs(f,{basename:t.header_info.route_base_name,children:[e.jsx(Qe,{})," ",e.jsxs(b,{children:[o.map((t,a)=>e.jsx(x,{path:t.path,element:e.jsx(St,{level:"section",maxRetries:2,children:e.jsx(i.Suspense,{fallback:e.jsx(It,{}),children:e.jsx(bi,{path:t.path})})})},a)),o.map((t,a)=>{const i=t.path+".html";return e.jsx(x,{path:i,element:e.jsx(y,{to:t.path,replace:!0})},`html-${a}`)}),e.jsx(x,{path:"/",element:e.jsx(y,{to:l})})]})]}),e.jsx(Ya,{})]})})})})})};v(document.getElementById("root")).render(e.jsx(i.StrictMode,{children:e.jsx(xi,{})}));export{It as S,Ft as a,q as b,de as c,qa as d,v as e,C as f,S as g,me as h,pe as i,fe as j,ye as k,ne as l,Ke as m,se as n,be as o,xe as p,he as r,Ce as u,ce as w};
