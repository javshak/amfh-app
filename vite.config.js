import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'icons/*.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        globIgnores: ['**/reset-ambient.mp3'],
        runtimeCaching: [
          {
            // Cache audio at runtime, not precache (too large)
            urlPattern: /\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      manifest: {
        name: 'A Minute for Mental Health',
        short_name: 'AMFH',
        description: 'A state-shifting tool for mental health and emotional regulation.',
        theme_color: '#c8960c',
        background_color: '#f5f0e8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/#/',
        scope: '/',
        icons: [
          { src: '/icons/icon-72x72.png',   sizes: '72x72',   type: 'image/png' },
          { src: '/icons/icon-96x96.png',   sizes: '96x96',   type: 'image/png' },
          { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    })
  ]
})
