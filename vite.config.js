// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,jsx}'],
      },
      manifest: {
        // MUDANÇA AQUI
        name: 'Viva Conectado', // <-- MUDADO
        short_name: 'Viva Conectado', // (Mantido 'Viva' por ser curto, mas você pode por 'Conectado')
        description: 'Jogos de inclusão digital para idosos: Memória, Pintura e Caça-Palavras.',
        
        background_color: '#FFFFFF', 
        theme_color: '#0066CC', 
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})