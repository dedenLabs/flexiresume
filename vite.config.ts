import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

// 自定义 Rollup 插件, 生成静态服务器路由缺失入口文件, 用于无权限更改Nginx等服务配置的单页应用, 正常情况不需要
const customEntry = () => ({
  name: 'customEntry',
  writeBundle() {
    const routeNames = ["game", "frontend", "backend", "cto", "contracttask"];

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
  build: {
    assetsDir: 'assets',  // 静态资源子目录
    outDir: 'docs',  // 👈 修改输出目录为 docs 
    emptyOutDir: true,     // 构建前清空目标目录
    rollupOptions: {
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
  }
}))
