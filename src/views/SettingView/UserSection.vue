<template>
  <v-row align="center">
    <v-col cols="12" sm="5">
      <v-text-field
        v-model="name"
        label="GitHub username"
        variant="solo"
        density="comfortable"
        clearable
        single-line
        hide-details
        append-inner-icon="mdi-check"
        @click:append-inner="checkUserName"
        @keyup.enter.exact="checkUserName"
        :loading="nameInputLoading"
      >
        <template #prepend-inner>
          <v-img v-if="avatar" :src="avatar" width="35" class="mt-n1"></v-img>
          <v-icon v-else icon="mdi-github"></v-icon>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="12" sm="7">
      <v-text-field
        v-model="token"
        label="Personal access tokens"
        variant="solo"
        density="comfortable"
        clearable
        single-line
        hide-details
        prepend-inner-icon="mdi-link-variant"
        @click:prepend-inner="openGithubTokenPage"
        @keyup.enter.exact="checkUserToken"
        @blur="checkUserToken"
        :loading="tokenInputLoading"
        :disabled="!name"
        :type="showToken ? 'text' : 'password'"
      >
        <template #append-inner>
          <v-icon icon="mdi-check" @click="checkUserToken" class="mr-1"></v-icon>
          <v-icon :icon="showToken ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" @click="showToken = !showToken"></v-icon>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="12" sm="6">
      <v-select
        label="Select your repository"
        v-model="repository"
        :items="repositoriesName"
        variant="solo"
        density="comfortable"
        single-line
        hide-details
        hide-no-data
        append-icon="mdi-refresh"
        @click:append="reposData"
        :loading="reposInputLoading"
        :disabled="!token"
      ></v-select>
    </v-col>
    <v-col cols="12" sm="6">
      <v-combobox
        label="Select or fill in a path"
        v-model="directory"
        :items="directories"
        variant="solo"
        density="comfortable"
        single-line
        hide-details
        hide-no-data
        append-icon="mdi-refresh"
        @click:append="dirsData"
        :loading="dirsInputLoading"
        :disabled="!repository"
      ></v-combobox>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { repoContent } from '@/plugins/axios/repo'
import type { UserRepos } from '@/plugins/axios/user'
import { userInfo, userRepos, userToken } from '@/plugins/axios/user'
import { useUserStore } from '@/plugins/stores/user'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { name, avatar, token, repository, directory } = storeToRefs(useUserStore())

// 用户名输入
const nameInputLoading = ref(false)
const checkUserName = async () => {
  if (name.value == '') {
    return
  }
  nameInputLoading.value = true
  try {
    const { avatar_url } = await userInfo(name.value)
    avatar.value = avatar_url
  } catch (error) {
    console.error(error)
    name.value = ''
    avatar.value = ''
  }
  nameInputLoading.value = false
}

// Token 输入
const showToken = ref(false)
const tokenInputLoading = ref(false)
const checkUserToken = async () => {
  if (token.value == '') {
    return
  }
  tokenInputLoading.value = true
  try {
    await userToken(token.value)
    await reposData()
  } catch (error) {
    console.error(error)
    token.value = ''
  }
  tokenInputLoading.value = false
}
// Github Token 创建页面
const openGithubTokenPage = () => {
  window.open('https://github.com/settings/tokens', '_blank')
}

// 仓库名输入
const reposInputLoading = ref(false)
const repositories = ref<UserRepos[]>([])
const repositoriesName = computed(() => repositories.value.map(val => val.name))
const reposData = async () => {
  reposInputLoading.value = true
  try {
    repositories.value = await userRepos(name.value)
    if (repositories.value.length == 0) {
      window.open('https://github.com/new', '_blank')
      throw new Error('No repository, please go and create one!')
    } else if (repository.value == '') {
      repository.value = repositories.value[0].name
    }
  } catch (error) {
    console.error(error)
  }
  reposInputLoading.value = false
}

// 路径输入
const dirsInputLoading = ref(false)
const directories = ref<string[]>([])
const dirsData = async () => {
  dirsInputLoading.value = true
  try {
    const data = await repoContent(name.value, repository.value, '/', true)
    directories.value = data.reduce((pre, cur) => (cur.type == 'dir' ? pre.concat(cur.path) : pre), ['/'])
  } catch (error) {
    console.error(error)
  }
  dirsInputLoading.value = false
}
</script>
