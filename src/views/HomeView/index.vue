<template>
  <v-container>
    <v-file-input
      v-model="files"
      accept="image/*"
      single-line
      hide-details
      variant="solo"
      prepend-icon=""
      :clearable="false"
      multiple
      class="auto-height"
    >
      <template #selection="{ fileNames }">
        <transition-group name="slide-y-transition">
          <image-section
            v-for="(fileName, index) in fileNames"
            :key="fileName"
            :filename="getFileName(fileName, md5(fileName, String(files[index].size)))"
            :filesize="files[index].size"
            :fileblob="files[index]"
            :show-action="uploaded"
            @delate="removeItem(index)"
          >
            <template #default="{ filename }">
              <text-chip v-for="item in items(filename)" :key="item.text" :label="item.label" :text="item.text" :disabled="!uploaded" />
            </template>
            <template #action="{ filename, fileblob }">
              <v-btn variant="tonal" color="deep-orange" class="me-2" @click="uploadImage(filename, fileblob)" :loading="uploading">
                upload
              </v-btn>
            </template>
          </image-section>
        </transition-group>
      </template>
    </v-file-input>
  </v-container>
</template>

<script setup lang="ts">
import TextChip from '@/components/TextChip.vue'
import blob2Base64 from '@/libs/blob2Base64'
import { uploadFile } from '@/plugins/axios/file'
import { repoPathContent } from '@/plugins/axios/repo'
import { useCodeStore } from '@/plugins/stores/code'
import { useSnackBarStore } from '@/plugins/stores/snackbar'
import { useUserStore } from '@/plugins/stores/user'
import md5 from 'blueimp-md5'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import ImageSection from './ImageSection.vue'

const files = ref<File[]>([])
const removeItem = (index: number) => files.value.splice(index, 1)

const { getFileName, getCdnUrlItems } = storeToRefs(useCodeStore())
// 获取 CDN 链接模板
const { name, repository, directory } = storeToRefs(useUserStore())
const items = (filename: string) => {
  return getCdnUrlItems.value(name.value, repository.value, directory.value, filename)
}

// 上传图片
const uploaded = ref(false)
const uploading = ref(false)
const uploadImage = async (filename: string, fileblob: File) => {
  uploading.value = true
  try {
    // 检查存储库中是否含有相同文件
    await repoPathContent(name.value, repository.value, `${directory.value}/${filename}`)
    uploaded.value = true
    useSnackBarStore().showMessage('已经存在相同文件！', { timeout: 2000 })
  } catch (error) {
    try {
      await uploadFile(name.value, repository.value, directory.value, filename, await blob2Base64(fileblob))
      uploaded.value = true
    } catch (error) {
      console.error(error)
    }
  }
  uploading.value = false
}

// 样式
const mdiCloudUploadOutline = computed(() => {
  return files.value.length == 0 ? `url(${new URL('/cloud-upload-outline.svg', import.meta.url).href})` : ''
})
const autoHeight = computed(() => {
  return files.value.length == 0 ? 'clamp(300px, 50vh, 500px)' : 'auto'
})
</script>

<style scoped lang="scss">
.auto-height {
  min-height: v-bind(autoHeight);
}
:deep(.v-input) {
  .v-field {
    overflow: hidden;
  }
  .v-field__field {
    background-image: v-bind(mdiCloudUploadOutline);
    background-repeat: no-repeat;
    background-position: center;
  }
  .v-field__input {
    padding: 0;
  }
}
</style>
