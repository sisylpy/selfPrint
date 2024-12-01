import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // 确保 src 目录
      'admin-lte': path.resolve(__dirname, 'node_modules/admin-lte'), // admin-lte 路径
    },
  },
  base: './',  // 设置相对路径，适用于部署到子路径
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks: {
          vendor: ['vue', 'axios', 'bootstrap'], // 拆分第三方库
        },
      },
    },
    chunkSizeWarningLimit: 2000,  // 设置 chunk 大小警告限制
    assetsDir: 'assets',  // 设置资源目录
  },
  publicDir: 'public',  // 静态资源目录
  server: {
    proxy: {
      '/api': {
        target: 'https://grainservice.club',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/weiruan/msyh_base64.txt'),
      },
    },
  },
});
