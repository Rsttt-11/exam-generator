import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/exam-generator/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-icons/*.png'],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: '考研数学智能组卷系统',
        short_name: '智能组卷',
        description: '考研数学智能组卷 - 李林880题库',
        lang: 'zh-CN',
        theme_color: '#409eff',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        scope: '/exam-generator/',
        start_url: '/exam-generator/',
        id: '/exam-generator/',
        icons: [
          { src: 'pwa-icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,svg,png,ico}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
