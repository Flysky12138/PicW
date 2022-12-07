import { createApp } from 'vue'
import { VueShowdown } from 'vue-showdown'
import App from './App.vue'
import directive from './directive'
import router from './plugins/router'
import pinia from './plugins/stores'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/vuetify/webfontloader'
import.meta.glob('./styles/**/*.scss', { eager: true })

loadFonts()

const app = createApp(App)
app.use(pinia).use(router).use(vuetify).use(directive)
app.component('VueShowdown', VueShowdown)

router.isReady().then(() => app.mount('#app'))
