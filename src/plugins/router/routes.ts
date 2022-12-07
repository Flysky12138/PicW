import type { RouteRecordRaw } from 'vue-router'

export default <readonly RouteRecordRaw[]>[
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  {
    path: '/',
    component: () => import('@/views/HomeView/index.vue'),
    meta: {
      keepAlive: true,
      requiresAuth: true
    }
  },
  {
    path: '/images',
    component: () => import('@/views/ImagesView.vue'),
    meta: {
      keepAlive: true,
      requiresAuth: true
    }
  },
  {
    path: '/setting',
    component: () => import('@/views/SettingView/index.vue'),
    meta: {
      keepAlive: true
    }
  }
]
