import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'
import vitepwa from './vite.config.pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify(), vitepwa],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
