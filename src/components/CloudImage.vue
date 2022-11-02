<template>
  <v-hover #default="{ isHovering, props }">
    <v-card v-bind="props" :elevation="isHovering ? 8 : 2" rounded="lg">
      <v-img :src="fileCdnUrls[0].text" height="200" cover>
        <v-expand-transition>
          <v-sheet v-show="isHovering" height="100%">
            <v-card variant="tonal" rounded="0" height="100%">
              <v-card-title>
                <v-chip size="small" label color="primary" class="mr-2" :text="item.name"></v-chip>
              </v-card-title>
              <v-card-subtitle>
                <v-divider></v-divider>
              </v-card-subtitle>
              <v-card-text class="h-100 overflow-y-auto" style="overscroll-behavior-y: contain">
                <TextChip v-for="chip in fileCdnUrls" :key="chip.label" :label="chip.label" :text="formatUrl(chip.text)" />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  variant="tonal"
                  position="absolute"
                  location="end top"
                  prepend-icon="mdi-trash-can-outline"
                  color="error"
                  rounded="0"
                  @click="$emit('delete')"
                >
                  del
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-sheet>
        </v-expand-transition>
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
          </div>
        </template>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import TextChip from '@/components/TextChip.vue'
import formatUrl from '@/libs/formatUrl'
import type { RepoPathContent } from '@/plugins/axios/repo'
import { useCodeStore } from '@/plugins/stores/code'
import { useUserStore } from '@/plugins/stores/user'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const props = defineProps<{
  item: RepoPathContent
}>()
defineEmits<{
  (event: 'delete'): void
}>()

// 获取 CDN
const { name, repository } = storeToRefs(useUserStore())
const { getCdnUrlItems } = storeToRefs(useCodeStore())
const fileCdnUrls = computed(() => {
  const directory = props.item.path.match(/(.*)\/.*$/)
  return getCdnUrlItems.value(name.value, repository.value, directory?.[1] ?? '/', props.item.name)
})
</script>
