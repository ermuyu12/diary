import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // 配置API代理，将对'/api'的请求代理到目标服务器
    proxy: {
      '/api': {
        target: 'http://localhost:8160', // 目标服务器的域名
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
      },
    },
  },
})
