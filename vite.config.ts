import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          open: true, // 打开分析报告
          filename: 'dist/stats.html', // 输出文件
          template: 'sunburst', // 可以选择 sunburst 或 treemap 模板
        }),
      ],
    },
  }
})
