import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

// 如果要完全支持静态 CDN 地址环境，需要配置静态页签名称，这样用户访问时就能找到入口文件。
// To fully support a static CDN address environment, you need to configure the static tab name so that users can find the entry file when they visit.
const staticRoutePageNames = ["game", "frontend", "backend", "cto", "agent", "contracttask", "fullstack"];

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

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
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

    // 简化的代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom'],

          // 大型第三方库
          'framer-motion': ['framer-motion'],
          'react-markdown': ['react-markdown'],
          'react-icons': ['react-icons'],

          // 其他工具库
          'vendor': ['styled-components', 'react-router-dom', 'mobx', 'debug']
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
    chunkSizeWarningLimit: 500, // 500kb警告阈值，更严格的控制

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
}))
