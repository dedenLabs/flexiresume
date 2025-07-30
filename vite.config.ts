import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import * as fs from 'node:fs';
import * as path from 'node:path';
// import { globSync } from 'glob'; // 暂时未使用

// 如果要完全支持静态 CDN 地址环境，需要配置静态页签名称，这样用户访问时就能找到入口文件。
// To fully support a static CDN address environment, you need to configure the static tab name so that users can find the entry file when they visit.
// 从环境变量读取静态路由页面名称，如果未设置则使用默认值
// Read static route page names from environment variables, use default values if not set
const staticRoutePageNames = [];

/**
 * 自定义 Rollup 插件 - 生成静态服务器路由入口文件
 *
 * 用于无权限更改Nginx等服务配置的单页应用部署
 * 为每个路由生成对应的HTML文件，避免404问题
 *
 * @returns Rollup插件对象
 */
const customEntry = () => ({
  name: 'customEntry',
  writeBundle() {
    // 所有需要生成入口文件的路由名称

    try {
      // 读取已生成的 index.html
      const indexContent = fs.readFileSync('docs/index.html', 'utf-8');
      staticRoutePageNames.forEach(name => {
        const outputPath = path.join('docs', `${name}.html`);

        // 直接写入文件系统
        fs.writeFileSync(outputPath, indexContent);
      });

      fs.copyFileSync('public/favicon.ico', 'docs/favicon.ico');
      fs.copyFileSync('public/robots.txt', 'docs/robots.txt');
    } catch (err) {
      this.error(`[customEntry] Error generating route entries: ${err.message}`);
    }
  }
})


// 自定义 Rollup 插件, 过滤掉不希望提交到 github 上的文件
// const customPublicFilter = () => ({
//   name: 'filter-public',
//   generateBundle() {
//     const allowedExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.woff2', '.mp4']);
//     const publicFiles = globSync('public/**/*.*'); // 使用 globSync

//     publicFiles.forEach(file => {
//       const ext = path.extname(file);
//       if (allowedExt.has(ext)) {
//         const relativePath = path.relative('public', file); // 保留子目录结构 
//         const name = path.basename(file);
//         if (name.search(/_h264\.|_hevc\.|_vp9\./) != -1) return; // 防止 github 仓库体积过大，排除特定文件，正常情况注释掉即可
//         this.emitFile({
//           type: 'asset',
//           fileName: path.join('.', relativePath),  // 匹配 assetsDir 配置
//           source: fs.readFileSync(file)
//         })
//       }
//     })
//   }
// })


// 自定义 Rollup 插件, 生成serviceWorker文件，用于静态资源替换到CDN上加速，如果静态资源本身就在docs目录下的话无需做这一步，这里主要是解决github pages的静态资源不在相同目录下的问题
// const generateServiceWorkerJS = (host: string) => ({
//   name: 'generateServiceWorkerJS',
//   writeBundle() {
//     try {
//       // 读取已生成的 index.html
//       const swContent = ` 
// self.addEventListener('fetch', event => {
//   const url = new URL(event.request.url);
//   // console.error('fetch', url.href);
//   if (url.pathname.search(\/^\\/?images\\\/\/) == 0) {
//       const newPath = url.pathname.replace(\/^\\\/\/, '');
//       const newUrl = new URL("${host}" + newPath, location.origin);      
//       event.respondWith(fetch(newUrl));
//   }
// });
//       `;
//       // docs 目录写入sw.js文件
//       fs.writeFileSync(path.join('docs', `sw.js`), swContent);
//       // public 目录写入sw.js文件
//       fs.writeFileSync(path.join('public', `sw.js`), swContent);
//     } catch (err) {
//       this.error(`[customEntry] Error generating route entries: ${err.message}`);
//     }
//   }
// })

/**
 * 自定义插件 - 支持 .mmd 文件导入
 * 将 .mmd 文件作为文本字符串导入
 */
const mmdPlugin = () => ({
  name: 'mmd-loader',
  load(id: string) {
    if (id.endsWith('.mmd')) {
      const content = fs.readFileSync(id, 'utf-8');
      return `export default ${JSON.stringify(content)};`;
    }
  }
});

/**
 * 智能检测系统语言环境
 * @param env 环境变量对象
 * @returns 'zh' | 'en'
 */
const detectSystemLanguage = (env?: Record<string, string>): 'zh' | 'en' => {
  // 优先检查用户手动设置的语言环境变量
  const userLang = env?.VITE_BUILD_LANG || process.env.VITE_BUILD_LANG;
  if (userLang === 'en' || userLang === 'zh') {
    return userLang;
  }

  // 检查环境变量中的语言设置
  const envLang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || process.env.LC_MESSAGES || '';
  const systemLang = envLang.toLowerCase();

  // 检查系统语言是否为中文
  if (systemLang.includes('zh') || systemLang.includes('chinese') || systemLang.includes('cn')) {
    return 'zh';
  }

  // 检查Node.js进程的语言设置
  if (typeof Intl !== 'undefined') {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      if (locale.startsWith('zh')) {
        return 'zh';
      }
    } catch {
      // 忽略错误，继续检查其他方法
    }
  }

  // 检查系统时区（中国时区通常使用中文）
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Shanghai') || timezone.includes('Beijing') || timezone.includes('Asia/Shanghai')) {
      return 'zh';
    }
  } catch {
    // 忽略错误
  }

  // 默认使用中文（因为这是中文项目）
  return 'zh';
};

/**
 * 多语言提示信息
 */
const messages = {
  zh: {
    buildStart: '🚀 开始构建 FlexiResume 项目...',
    configCheck: '📋 构建配置检查:',
    routePagesNotConfigured: '⚠️  未配置 VITE_STATIC_ROUTE_PAGES 环境变量',
    routePagesAdvice: '💡 建议: 根据您的简历岗位需求配置职位页面名称',
    routePagesExample: '   示例: VITE_STATIC_ROUTE_PAGES="frontend,backend,fullstack,gamedev,ai-engineer"',
    routePagesDefault: '   当前使用默认值: frontend,backend,fullstack',
    routePagesConfigured: '✅ 静态路由页面:',
    configured: '已配置',
    notConfigured: '未配置 (可选)',
    buildNotes: '📝 构建注意事项:',
    outputDir: '• 构建输出目录: docs/ (适配 GitHub Pages)',
    optimization: '• 静态资源将被优化和压缩',
    consoleLogs: '• 生产环境将移除 console 日志',
    htmlGeneration: '• 将为每个职位页面生成独立的 HTML 文件',
    moreInfo: '🔗 更多配置说明请参考: .env.example 文件',
    willGenerate: '🎯 将生成以下职位页面:',
    envConfigs: {

      'VITE_BAIDU_ANALYTICS_ID': '百度统计ID',
      'VITE_GA_MEASUREMENT_ID': 'Google Analytics ID'
    }
  },
  en: {
    buildStart: '🚀 Starting FlexiResume project build...',
    configCheck: '📋 Build configuration check:',
    routePagesNotConfigured: '⚠️  VITE_STATIC_ROUTE_PAGES environment variable not configured',
    routePagesAdvice: '💡 Suggestion: Configure position page names based on your resume job requirements',
    routePagesExample: '   Example: VITE_STATIC_ROUTE_PAGES="frontend,backend,fullstack,gamedev,ai-engineer"',
    routePagesDefault: '   Currently using default values: frontend,backend,fullstack',
    routePagesConfigured: '✅ Static route pages:',
    configured: 'Configured',
    notConfigured: 'Not configured (optional)',
    buildNotes: '📝 Build notes:',
    outputDir: '• Build output directory: docs/ (GitHub Pages compatible)',
    optimization: '• Static assets will be optimized and compressed',
    consoleLogs: '• Console logs will be removed in production',
    htmlGeneration: '• Independent HTML files will be generated for each position page',
    moreInfo: '🔗 For more configuration details, please refer to: .env.example file',
    willGenerate: '🎯 Will generate the following position pages:',
    envConfigs: {

      'VITE_BAIDU_ANALYTICS_ID': 'Baidu Analytics ID',
      'VITE_GA_MEASUREMENT_ID': 'Google Analytics ID'
    }
  }
};

/**
 * 显示构建时的用户提示信息
 * @param command 构建命令类型
 * @param env 环境变量
 */
const showBuildTips = (command: string, env: Record<string, string>) => {
  if (command === 'build') {
    const lang = detectSystemLanguage(env);
    const msg = messages[lang];

    console.log(`\n${msg.buildStart}\n`);

    // 检查关键环境变量配置
    console.log(msg.configCheck);

    // 检查静态路由页面配置
    if (!env.VITE_STATIC_ROUTE_PAGES) {
      console.log(msg.routePagesNotConfigured);
      console.log(msg.routePagesAdvice);
      console.log(msg.routePagesExample);
      console.log(`${msg.routePagesDefault}\n`);
    } else {
      console.log(`${msg.routePagesConfigured} ${env.VITE_STATIC_ROUTE_PAGES}\n`);
    }

    // 检查其他重要配置
    const importantEnvs = [
      { key: 'VITE_BAIDU_ANALYTICS_ID', desc: msg.envConfigs['VITE_BAIDU_ANALYTICS_ID'] },
      { key: 'VITE_GA_MEASUREMENT_ID', desc: msg.envConfigs['VITE_GA_MEASUREMENT_ID'] }
    ];

    importantEnvs.forEach(({ key, desc }) => {
      if (env[key]) {
        console.log(`✅ ${desc}: ${msg.configured}`);
      } else {
        console.log(`ℹ️  ${desc}: ${msg.notConfigured}`);
      }
    });

    console.log(`\n${msg.buildNotes}`);
    console.log(msg.outputDir);
    console.log(msg.optimization);
    console.log(msg.consoleLogs);
    console.log(msg.htmlGeneration);
    console.log(`\n${msg.moreInfo}\n`);
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // 显示构建提示
  showBuildTips(command, env);

  const names = env.VITE_STATIC_ROUTE_PAGES
    ? env.VITE_STATIC_ROUTE_PAGES.split(',').map(name => name.trim())
    : ["frontend", "backend", "fullstack"];
  staticRoutePageNames.push(...names);

  if (command === 'build') {
    const lang = detectSystemLanguage(env);
    const msg = messages[lang];
    console.log(`${msg.willGenerate} ${names.join(', ')}`);
  }
  return {
    base: command === 'serve' ? '/' : './',
    plugins: [react(), mmdPlugin()],
    publicDir: command === 'serve' ? 'public' : false, // 🔥 必须关闭默认 public 复制

    // 开发服务器优化
    server: {
      hmr: {
        overlay: false // 减少错误覆盖层的干扰
      }
    },

    // 构建优化
    build: {
      assetsDir: 'assets',  // 静态资源子目录
      outDir: 'docs',  // 👈 修改输出目录为 docs
      emptyOutDir: true,     // 构建前清空目标目录

      // 优化的代码分割策略 - 针对大型库进行细分
      rollupOptions: {
        output: {
          manualChunks: {
            // React 核心库
            'react-vendor': ['react', 'react-dom'],

            // 大型第三方库分离
            'framer-motion': ['framer-motion'],
            'react-markdown': ['react-markdown'],
            'react-icons': ['react-icons'],

            // Mermaid相关库分离（最大的包）
            'mermaid-core': ['mermaid'],
            'katex': ['katex'], // 数学公式渲染库
            'cytoscape': ['cytoscape', 'cytoscape-cose-bilkent', 'cytoscape-fcose'], // 图形布局库
            'd3-charts': ['d3', 'd3-sankey'], // D3图表库

            // 其他工具库
            'vendor': ['styled-components', 'react-router-dom', 'mobx', 'debug'],
            'utils': ['svg-pan-zoom', 'qrcode.react', 'unist-util-visit']
          }
        },
        plugins: [
          visualizer({
            open: false, // 打开分析报告
            filename: 'docs/stats.html', // 输出文件
            template: 'sunburst', // 可以选择 sunburst 或 treemap 模板
          }),
          // customPublicFilter(),
          customEntry(),// 生成动态路由

          // 使用 serviceWorker 方案替换资源如果是视频的情况下,无法实现流式加载,所以取消了改方案,改为业务层替换
          // generateServiceWorkerJS('https://cdn.jsdelivr.net/gh/user/repo/'),
        ],
      },

      // 压缩优化 - 更激进的压缩策略
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: command === 'build', // 生产环境移除console
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除特定函数调用
          passes: 2, // 多次压缩以获得更好效果
        },
        mangle: {
          safari10: true, // 兼容Safari 10
        },
        format: {
          comments: false, // 移除注释
        },
      },

      // 资源内联阈值 - 减少HTTP请求
      assetsInlineLimit: 2048, // 2kb以下的资源内联为base64（减少小文件）

      // 禁用源码映射以减少文件大小
      sourcemap: false,

      // 启用CSS代码分割
      cssCodeSplit: true,

      // 设置chunk大小警告阈值 - 提高阈值以减少警告
      chunkSizeWarningLimit: 1000, // 1MB警告阈值，允许大型库存在但控制在合理范围内

      // 实验性功能：启用更好的tree shaking
      target: 'esnext',

      // 更激进的优化选项
      reportCompressedSize: false, // 禁用压缩大小报告以加快构建


    },

    // 依赖预构建优化 - 更全面的预构建配置
    optimizeDeps: {
      include: [
        // React 核心
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',

        // 路由
        'react-router-dom',

        // 样式和动画
        'styled-components',
        'framer-motion',

        // Markdown 处理
        'react-markdown',
        'remark',
        'remark-html',
        'unified',

        // 状态管理
        'mobx',

        // 工具库
        'debug',
        'qrcode.react'
      ],
      exclude: [
        '@vite/client',
        '@vite/env',
        // 排除大型可选依赖
        'react-syntax-highlighter',
        'highlight.js',
        // 排除虚拟化组件（按需加载）
        'react-virtualized-auto-sizer',
        'react-window',
        // 排除react-icons的大包，使用按需加载
        'react-icons/lib',
        'react-icons/all'
      ],
      // 强制预构建某些依赖
      force: false, // 改为false，避免不必要的重新构建

      // 设置预构建的入口
      entries: ['src/main.tsx', 'src/App.tsx']
    },

    // 新增：定义别名以减少路径解析时间
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@utils': '/src/utils',
        '@data': '/src/data',
        '@styles': '/src/styles'
      }
    }
  }
})
