<template>
  <v-app @contextmenu.prevent v-scroll="onScroll">
    <v-app-bar :elevation="atTop ? 0 : 5" class="header">
      <v-btn :icon="type == 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny'" @click="type = type == 'dark' ? 'light' : 'dark'"></v-btn>
      <v-app-bar-title class="font-weight-bold">
        <span @click="$router.push('/')" class="home"> PicW </span>
      </v-app-bar-title>
      <v-btn class="ml-sm-3" icon="mdi-image-search-outline" to="/images"></v-btn>
      <v-btn class="ml-sm-3" icon="mdi-cog-outline" to="/setting"></v-btn>
    </v-app-bar>
    <v-main>
      <router-view #default="{ Component, route }">
        <transition name="router-transition">
          <keep-alive>
            <component v-if="route.meta.keepAlive" :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
        <transition name="router-transition">
          <component v-if="!route.meta.keepAlive" :is="Component" />
        </transition>
      </router-view>
    </v-main>
    <SnackBar />
  </v-app>
</template>

<script setup lang="ts">
import SnackBar from '@/components/SnackBar.vue'
import { useSnackBarStore } from '@/plugins/stores/snackbar'
import { useThemeStore } from '@/plugins/stores/theme'
import { storeToRefs } from 'pinia'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()

const { type } = storeToRefs(useThemeStore())
const { showMessage } = useSnackBarStore()
const { show } = storeToRefs(useSnackBarStore())

// 更新提示
const { needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegistered: r => r && setInterval(async () => await r.update(), 60 * 60 * 1000)
})
watch(needRefresh, () => {
  showMessage(
    '新内容可用，点击刷新！',
    {
      location: 'bottom right',
      transition: 'slide-x-reverse-transition',
      timeout: 10 * 1000,
      vertical: true
    },
    {
      text: '刷新',
      event: () => {
        updateServiceWorker().finally(() => {
          show.value = false
        })
      }
    }
  )
})

const atTop = ref(true)
const onScroll = (event: Event) => {
  const document = event.target as Document
  atTop.value = (document.documentElement.scrollTop || document.body.scrollTop) < 100
}
</script>

<style scoped lang="scss">
.header {
  transition: box-shadow 200ms ease;
}
.home {
  cursor: pointer;
  user-select: none;
}
</style>
