<template>
  <v-container>
    <v-fade-transition hide-on-leave>
      <v-row v-if="fileLoaded || files.length > 0">
        <template v-if="files.length > 0">
          <transition-group name="slide-x-transition">
            <v-col cols="12" :key="readmeText" v-show="readmeText">
              <v-hover #default="{ isHovering, props }">
                <v-card v-bind="props" :elevation="isHovering ? 8 : 2" rounded="lg" class="px-5 markdown-content">
                  <v-btn v-if="islogin" icon flat size="30" position="absolute" style="right: 0; top: 0" :href="editHref" target="_blank">
                    <v-icon size="20">mdi-circle-edit-outline</v-icon>
                  </v-btn>
                  <!-- <v-card-title> README.md </v-card-title> -->
                  <v-card-text>
                    <VueShowdown :markdown="readmeText" flavor="github" :options="{ emoji: true }" />
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
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
        </template>
        <template v-else>
          <v-col cols="12">
            <v-card height="200" variant="tonal" class="d-flex justify-center align-center">
              <v-card-title> 没有内容！ </v-card-title>
            </v-card>
          </v-col>
        </template>
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
import { repoPathContent, type RepoPathContent } from '@/plugins/axios/repo'
import { useCodeStore } from '@/plugins/stores/code'
import { useUserStore } from '@/plugins/stores/user'
import { storeToRefs } from 'pinia'
import { computed, onActivated, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const { islogin } = storeToRefs(useUserStore())

const search = reactive({
  name: '',
  repository: '',
  directory: ''
})
const fileLoaded = ref(false)
const files = ref<RepoPathContent[]>([])
const readmeText = ref('')
const { getCdnUrlItems } = storeToRefs(useCodeStore())
onActivated(async () => {
  const { query } = useRoute()
  search.name = query.name as string
  search.repository = query.repository as string
  search.directory = query.directory as string
  try {
    fileLoaded.value = false
    // 获取文件
    const data = await repoPathContent(search.name, search.repository, search.directory)
    const Suffix = [
      'tif',
      'jfif',
      'pjp',
      'apng',
      'ico',
      'tiff',
      'gif',
      'svg',
      'xbm',
      'jxl',
      'jpeg',
      'svgz',
      'jpg',
      'webp',
      'png',
      'bmp',
      'pjpeg',
      'avif'
    ]
    files.value = data.filter(val => val.type == 'dir' || Suffix.some(suffix => val.name.toLowerCase().endsWith(suffix)))
    // 获取 markdown 文件内容
    const readmeItem = data.find(val => val.name.toLowerCase().endsWith('.md') && val.path == `${search.directory}/${val.name}`)
    if (readmeItem) {
      const readmeUrl = getCdnUrlItems.value(search.name, search.repository, search.directory, readmeItem.name)[0].text
      readmeText.value = await fetch(readmeUrl).then(val => (val.ok ? val.text() : ''))
    }
  } catch (error) {
    console.error(error)
  } finally {
    fileLoaded.value = true
  }
})

// 编辑地址
const editHref = computed(() => `https://github.com/${search.name}/${search.repository}/edit/master/${search.directory}/README.md`)

// 删除文件
const delFile = async (item: RepoPathContent, index: number) => {
  try {
    await deleteFile(search.name, search.repository, item.path, item.name, item.sha)
    files.value.splice(index, 1)
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped lang="scss">
:deep(.markdown-content) {
  * {
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    line-height: 1.5em;
  }
  .v-card-text > div *:not(:first-child) {
    margin-top: 0.25em;
  }
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgb(110 118 129 / 30%);
    border-radius: 6px;
    user-select: all;
  }
}
</style>
