<template>
  <v-layout @contextmenu.prevent v-scroll="onScroll">
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
    <snack-bar />
  </v-layout>
</template>

<script setup lang="ts">
import SnackBar from '@/components/SnackBar.vue'
import { useThemeStore } from '@/plugins/stores/theme'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { type } = storeToRefs(useThemeStore())
const $router = useRouter()

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
