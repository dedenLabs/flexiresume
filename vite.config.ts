import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

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
    const routeNames = ["game", "frontend", "backend", "cto", "agent", "contracttask"];

    try {
      // 读取已生成的 index.html
      const indexContent = fs.readFileSync('docs/index.html', 'utf-8');
      routeNames.forEach(name => {
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

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : './',
  plugins: [react()],
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

    // 代码分割优化 - 更细粒度的分包策略
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-dom/client'],

          // 路由库
          'router-vendor': ['react-router-dom', '@remix-run/router'],

          // UI 和动画库
          'ui-vendor': ['styled-components', 'framer-motion'],

          // Markdown 相关库（最大的包，需要分离）
          'markdown-vendor': [
            'react-markdown',
            'remark',
            'remark-html',
            'unified',
            'micromark',
            'mdast-util-to-hast',
            'hast-util-sanitize'
          ],

          // 语法高亮库（按需加载，不预打包）
          // 注释掉以实现真正的按需加载

          // 工具库
          'utils-vendor': ['mobx', 'debug'],

          // 图标库
          'icons-vendor': ['react-icons']
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

    // 设置chunk大小警告阈值
    chunkSizeWarningLimit: 600, // 600kb警告阈值
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
      'debug'
    ],
    exclude: [
      '@vite/client',
      '@vite/env',
      // 排除大型可选依赖
      'react-syntax-highlighter',
      'highlight.js'
    ],
    // 强制预构建某些依赖
    force: true
  }
}))
