<template>
  <v-container @click.stop>
    <v-row no-gutters class="rounded overflow-hidden">
      <v-col cols="12" sm="4">
        <v-hover #default="{ isHovering, props }">
          <v-img v-bind="props" :src="blob2Url" height="180" cover :class="isDark ? 'bg-grey-darken-1' : 'bg-grey-lighten-2'">
            <v-overlay :model-value="isHovering" contained class="align-center justify-center">
              <v-btn color="cyan" variant="flat" icon="mdi-close" @click="delEvent"></v-btn>
            </v-overlay>
          </v-img>
        </v-hover>
      </v-col>
      <v-col cols="12" sm="8">
        <v-card class="h-100" variant="tonal" rounded="0">
          <v-card-title>
            <v-chip size="small" label color="primary" class="mr-2 chip-filename" :text="filename" contenteditable @keyup="keyUp"></v-chip>
            <v-chip size="small" label color="primary" class="mr-2" :text="filesize(props.filesize)"></v-chip>
          </v-card-title>
          <v-card-subtitle>
            <v-divider></v-divider>
          </v-card-subtitle>
          <v-card-text>
            <TextChip v-for="item in items(useName)" :key="item.text" :label="item.label" :text="item.text" :disabled="!uploaded" />
          </v-card-text>
          <v-card-actions v-show="!uploaded">
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="deep-orange" class="me-2" @click="uploadImage" :loading="uploading">
              upload
              <template #loader>
                <v-progress-circular :model-value="progress" color="teal"> {{ progress }} </v-progress-circular>
              </template>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import TextChip from '@/components/TextChip.vue'
import blob2Base64 from '@/libs/blob2Base64'
import filesize from '@/libs/filesize'
import { uploadFile } from '@/plugins/axios/file'
import { repoPathContent } from '@/plugins/axios/repo'
import { useCodeStore } from '@/plugins/stores/code'
import { useSnackBarStore } from '@/plugins/stores/snackbar'
import { useThemeStore } from '@/plugins/stores/theme'
import { useUserStore } from '@/plugins/stores/user'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { type } = storeToRefs(useThemeStore())
const isDark = computed(() => type.value == 'dark')

const props = defineProps<{
  filename: string
  filesize: number
  fileblob: File
}>()
const emit = defineEmits<{
  (event: 'delate'): void
}>()

// 文件名
const useName = ref(props.filename)
const keyUp = (e: KeyboardEvent) => {
  useName.value = (e.target as HTMLSpanElement).textContent || props.filename
}

// 图片链接
const blob2Url = URL.createObjectURL(props.fileblob)
const delEvent = () => {
  URL.revokeObjectURL(blob2Url)
  emit('delate')
}

// 获取 CDN 链接模板
const { getCdnUrlItems } = storeToRefs(useCodeStore())
const { name, repository, directory } = storeToRefs(useUserStore())
const items = (filename: string) => {
  return getCdnUrlItems.value(name.value, repository.value, directory.value, filename)
}

// 上传图片
const uploaded = ref(false)
const uploading = ref(false)
const progress = ref(0)
const uploadImage = async () => {
  uploading.value = true
  try {
    // 检查存储库中是否含有相同文件
    await repoPathContent(name.value, repository.value, `${directory.value}/${useName.value}`)
    uploaded.value = true
    useSnackBarStore().showMessage('已经存在相同文件！', { timeout: 2000 })
  } catch (error) {
    try {
      await uploadFile(name.value, repository.value, directory.value, useName.value, await blob2Base64(props.fileblob), progress)
      uploaded.value = true
    } catch (error) {
      progress.value = 0
      console.error(error)
    }
  }
  uploading.value = false
}
</script>

<style scoped lang="scss">
:deep() {
  .v-card-title {
    white-space: normal;
  }
}
.chip-filename {
  caret-color: red;
  outline: none;
  &:focus {
    border: 1px solid #5e35b1;
    &::before {
      color: red;
    }
  }
  &::before {
    content: '✎';
    margin-right: 0.5em;
  }
}
</style>
