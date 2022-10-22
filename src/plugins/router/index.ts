import { useSnackBarStore } from '@/plugins/stores/snackbar'
import { useUserStore } from '@/plugins/stores/user'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(to => {
  if (to.meta.requiresAuth && !useUserStore().islogin) {
    useSnackBarStore().showMessage('需要登录才能访问其他页面！', {
      location: 'end bottom',
      vertical: true,
      transition: 'slide-x-reverse-transition',
      timeout: 10000
    })
    return '/setting'
  }
  return true
})

export default router
