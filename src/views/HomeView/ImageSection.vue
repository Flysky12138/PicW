<template>
  <v-container @click.stop>
    <v-row no-gutters class="rounded overflow-hidden">
      <v-col cols="12" sm="4">
        <v-hover v-slot="{ isHovering, props }">
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
            <v-chip size="small" label color="primary" class="mr-2" :text="filename"></v-chip>
            <v-chip size="small" label color="primary" class="mr-2" :text="fileSizeFormat"></v-chip>
          </v-card-title>
          <v-card-subtitle>
            <v-divider></v-divider>
          </v-card-subtitle>
          <v-card-text>
            <slot v-bind="props"></slot>
          </v-card-text>
          <v-card-actions v-show="!props.showAction">
            <v-spacer></v-spacer>
            <slot name="action" v-bind="props"></slot>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/plugins/stores/theme'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { type } = storeToRefs(useThemeStore())
const isDark = computed(() => type.value == 'dark')

const props = defineProps<{
  filename: string
  filesize: number
  fileblob: File
  showAction: boolean
}>()
const emit = defineEmits<{
  (event: 'delate'): void
}>()

// 图片大小
const M = 1024 * 1024
const fileSizeFormat = computed(() => {
  return props.filesize < M ? `${(props.filesize / 1024).toFixed(2)} K` : `${(props.filesize / M).toFixed(2)} M`
})

// 图片链接
const blob2Url = URL.createObjectURL(props.fileblob)
const delEvent = () => {
  URL.revokeObjectURL(blob2Url)
  emit('delate')
}
</script>

<style scoped lang="scss">
:deep() {
  .v-card-title {
    white-space: normal;
  }
}
</style>
