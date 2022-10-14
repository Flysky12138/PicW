import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const storeSetup = () => {
  const name = ref('')
  const avatar = ref('')
  const token = ref('')
  const repository = ref('')
  const directory = ref('/')

  // 名字改变就清空所有输入内容
  watch(name, (newValue, oldValue) => {
    if (newValue != oldValue && oldValue != '') {
      avatar.value = ''
      token.value = ''
      repository.value = ''
      directory.value = ''
    }
  })

  // 登录状态
  const islogin = computed(() => [name.value, token.value, repository.value].every(val => val != ''))

  return {
    name,
    avatar,
    token,
    repository,
    directory,
    islogin
  }
}

export const useUserStore = defineStore('user', storeSetup, {
  persist: true
})
