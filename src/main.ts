import { useSnackBarStore } from '@/plugins/stores/snackbar'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import directive from './directive'
import router from './plugins/router'
import pinia from './plugins/stores'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/vuetify/webfontloader'

// 更新提示
registerSW({
  onNeedRefresh: () => {
    useSnackBarStore().showMessage('新内容可用，刷新后更新！', {
      location: 'end bottom',
      vertical: true,
      transition: 'slide-x-reverse-transition',
      timeout: 10000
    })
  }
})

// 导入 ./styles 目录下所有 scss 文件
import.meta.glob('./styles/**/*.scss', { eager: true })

loadFonts()

const app = createApp(App)

app.use(pinia).use(router).use(vuetify).use(directive)

router.isReady().then(() => app.mount('#app'))
