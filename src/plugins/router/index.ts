import { useUserStore } from '@/plugins/stores/user'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(to => {
  if (to.meta.requiresAuth && !useUserStore().islogin) {
    return '/setting'
  }
  return true
})

export default router
