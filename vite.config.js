import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const packageJson = require('./package.json')

const deploymentBase = process.env.VITE_BASE_PATH || '/'
const base = deploymentBase.endsWith('/') ? deploymentBase : `${deploymentBase}/`

const crossOriginIsolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp'
}

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.png', 'pwa-icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,wasm}'],
        maximumFileSizeToCacheInBytes: 30 * 1024 * 1024
      },
      manifest: {
        name: 'Video to GIF PWA',
        short_name: 'GIF Maker',
        description: '브라우저에서 동작하는 설치형 GIF 변환기',
        lang: 'ko',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        scope: base,
        start_url: base,
        icons: [
          {
            src: `${base}icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: `${base}icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    headers: crossOriginIsolationHeaders
  },
  preview: {
    headers: crossOriginIsolationHeaders
  }
})
