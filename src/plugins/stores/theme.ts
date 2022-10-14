import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import { useTheme } from 'vuetify'

const storeSetup = () => {
  const type = ref<'dark' | 'light'>('light')

  // 监听值并修改主题
  const theme = useTheme()
  watchEffect(() => {
    theme.global.name.value = type.value
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', type.value == 'dark' ? '#212121' : '#ffffff')
  })

  return {
    type
  }
}

export const useThemeStore = defineStore('theme', storeSetup, {
  persist: true
})
