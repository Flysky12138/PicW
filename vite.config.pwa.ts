import { VitePWA } from 'vite-plugin-pwa'

export default VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}']
  },
  devOptions: {
    enabled: true
  },
  manifest: {
    name: 'PicW',
    short_name: 'PicW',
    description: 'A site for uploading images to github',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
})
