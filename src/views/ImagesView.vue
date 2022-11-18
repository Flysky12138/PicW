<template>
  <v-container>
    <v-fade-transition hide-on-leave>
      <v-row v-if="files.length > 0">
        <transition-group name="slide-x-transition">
          <v-col cols="12" sm="6" md="4" v-for="(item, index) in files" :key="item.sha">
            <CloudImage
              :item="item"
              :name="search.name"
              :repository="search.repository"
              :directory="search.directory"
              @delete="delFile(item, index)"
            />
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
import { onActivated, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const search = reactive({
  name: '',
  repository: '',
  directory: ''
})
const files = ref<RepoPathContent[]>([])

// 删除文件
const delFile = async (item: RepoPathContent, index: number) => {
  try {
    await deleteFile(search.name, search.repository, item.path, item.name, item.sha)
    files.value.splice(index, 1)
  } catch (error) {
    console.error(error)
  }
}

// 获取文件
onActivated(async () => {
  const { query } = useRoute()
  search.name = query.name as string
  search.repository = query.repository as string
  search.directory = query.directory as string
  try {
    const data = await repoContent(search.name, search.repository, search.directory, true)
    files.value = data.filter(value => value.type == 'file')
  } catch (error) {
    console.error(error)
  }
})
</script>
