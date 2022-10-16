<template>
  <v-container>
    <v-card variant="flat" class="mb-6" title="登录" prepend-icon="mdi-github">
      <v-card-text>
        <UserSection />
      </v-card-text>
    </v-card>
    <v-card variant="flat" title="函数" prepend-icon="mdi-nodejs">
      <v-card-subtitle>
        <v-alert type="info" density="compact" class="mb-3">
          需严格按照提供的 TypeScript 类型写 JS 代码，代码有问题将会使用默认方法。
        </v-alert>
      </v-card-subtitle>
      <v-card-subtitle
        >上传图片重命名，可以包含 <code class="text-red font-weight-bold">/</code> 用于指定路径
        <v-alert border border-color="error" density="compact" class="text-red-accent-4 bg-red-lighten-5 font-weight-bold mt-3">
          <i class="pe-2">type:</i>
          (filename: string, md5: string) => string
        </v-alert>
      </v-card-subtitle>
      <v-card-text>
        <CodeSection v-model="fileName" />
      </v-card-text>
      <v-card-subtitle
        >导出的 CDN 链接
        <v-alert border border-color="error" density="compact" class="text-red-accent-4 bg-red-lighten-5 font-weight-bold mt-3">
          <i class="pe-2">type:</i>
          (username: string, repository: string, directory: string, filename: string) => Array&lt;{ label: string, text: string }>
        </v-alert>
      </v-card-subtitle>
      <v-card-text>
        <CodeSection v-model="cdnUrl" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useCodeStore } from '@/plugins/stores/code'
import { storeToRefs } from 'pinia'
import CodeSection from './CodeSection.vue'
import UserSection from './UserSection.vue'

const { fileName, cdnUrl } = storeToRefs(useCodeStore())
</script>

<style scoped lang="scss">
:deep() {
  .v-alert__content {
    white-space: normal;
  }
}
</style>
