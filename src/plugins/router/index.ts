import { useSnackBarStore } from '@/plugins/stores/snackbar'
import { useUserStore } from '@/plugins/stores/user'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(to => {
  const { islogin, name, repository, directory } = useUserStore()
  if (to.path == '/images') {
    const keys = Object.keys(to.query)
    if (['name', 'repository', 'directory'].every(val => keys.includes(val))) {
      return true
    } else if (islogin) {
      return Object.assign(to, { query: { name, repository, directory } })
    }
  }
  if (to.meta.requiresAuth && !islogin) {
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
