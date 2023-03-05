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
      :key="forceUpdate"
      ref="inputRef"
      @dragenter="dragEnterHandle"
      @dragleave="dragLeaveHandle"
    >
      <template #selection="{ fileNames }">
        <transition-group name="slide-y-transition">
          <ImageSection
            v-for="(fileName, index) in fileNames"
            :key="fileName"
            :filename="getFileName(fileName, md5(fileName, String(files[index].size)))"
            :filesize="files[index].size"
            :fileblob="files[index]"
            @delate="removeItem(index)"
          ></ImageSection>
        </transition-group>
      </template>
    </v-file-input>
  </v-container>
</template>

<script setup lang="ts">
import { useCodeStore } from '@/plugins/stores/code'
import md5 from 'blueimp-md5'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import ImageSection from './ImageSection.vue'

const forceUpdate = ref(Date.now())
const files = ref<File[]>([])
const removeItem = (index: number) => {
  files.value.splice(index, 1)
  if (files.value.length == 0) {
    forceUpdate.value = Date.now()
  }
}

const { getFileName } = storeToRefs(useCodeStore())

// 样式
const mdiCloudUploadOutline = computed(() => {
  return files.value.length == 0 ? `url(${new URL('/cloud-upload-outline.svg', import.meta.url).href})` : ''
})
const autoHeight = computed(() => {
  return files.value.length == 0 ? 'clamp(300px, 50vh, 500px)' : 'auto'
})

// 拖入文件提示
interface TemplateRefType {
  $el: HTMLElement
}
const inputRef = ref<TemplateRefType | null>(null)
const dragEnterHandle = () => {
  inputRef.value?.$el.classList.add('drag-enter')
}
const dragLeaveHandle = () => {
  inputRef.value?.$el.classList.remove('drag-enter')
}
</script>

<style scoped lang="scss">
.auto-height {
  min-height: v-bind(autoHeight);
}
:deep(.v-input) {
  .v-input__control {
    border: 4px dashed transparent;
  }
  &.drag-enter .v-input__control {
    border: 4px dashed #ff9600;
    border-radius: 8px;
    overflow: hidden;
  }
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
