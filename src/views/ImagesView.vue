<template>
  <v-container>
    <v-fade-transition hide-on-leave>
      <v-row v-if="files.length > 0">
        <transition-group name="slide-x-transition">
          <v-col cols="12" sm="6" md="4" v-for="(item, index) in files" :key="item.sha">
            <CloudImage :item="item" @delete="delFile(item, index)" />
          </v-col>
        </transition-group>
      </v-row>
      <v-row v-else>
        <v-col cols="12" sm="6" md="4" v-for="i in 6" :key="i">
          <v-card variant="tonal" height="200"></v-card>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import CloudImage from '@/components/CloudImage.vue'
import { deleteFile } from '@/plugins/axios/file'
import { repoContent, type RepoPathContent } from '@/plugins/axios/repo'
import { useUserStore } from '@/plugins/stores/user'
import { storeToRefs } from 'pinia'
import { onActivated, onMounted, ref } from 'vue'

const { name, repository, directory } = storeToRefs(useUserStore())

// 获取文件
const files = ref<RepoPathContent[]>([])
const getFilesContent = async () => {
  try {
    const data = await repoContent(name.value, repository.value, directory.value, true)
    files.value = data.filter(value => value.type == 'file')
  } catch (error) {
    console.error(error)
  }
}

// 删除文件
const delFile = async (item: RepoPathContent, index: number) => {
  try {
    await deleteFile(name.value, repository.value, item.path, item.name, item.sha)
    files.value.splice(index, 1)
  } catch (error) {
    console.error(error)
  }
}

onMounted(getFilesContent)
onActivated(getFilesContent)
</script>
