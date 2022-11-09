<template>
  <v-hover #default="{ isHovering, props }">
    <v-card v-bind="props" :elevation="isHovering ? 8 : 2" rounded="lg">
      <v-img :src="fileCdnUrls[0].text" height="200" cover>
        <v-expand-transition>
          <v-sheet v-show="isHovering" height="100%">
            <v-card variant="tonal" rounded="0" height="100%">
              <v-card-title>
                <v-row>
                  <v-col cols="5">
                    <v-btn block variant="tonal" prepend-icon="mdi-trash-can-outline" color="secondary" @click="$emit('delete')">
                      delete
                    </v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn block variant="tonal" color="success" @click="download(fileCdnUrls[0].text, $props.item.name)">
                      <v-icon icon="mdi-download"></v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="5">
                    <v-btn block variant="tonal" prepend-icon="mdi-image-search-outline" color="secondary">
                      preview
                      <v-dialog v-model="dialog" activator="parent" fullscreen transition="scale-transition">
                        <v-card color="rgb(0 0 0 / 75%)" style="backdrop-filter: blur(10px)">
                          <v-card-text class="overflow-hidden d-flex justify-center align-center pa-12" @click="dialog = false">
                            <v-img :src="fileCdnUrls[0].text"></v-img>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-subtitle>
                <v-divider></v-divider>
              </v-card-subtitle>
              <v-card-text class="h-100 overflow-y-auto" style="overscroll-behavior-y: contain">
                <TextChip v-for="chip in fileCdnUrls" :key="chip.label" :label="chip.label" :text="chip.text" />
              </v-card-text>
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
import download from '@/libs/download'
import type { RepoPathContent } from '@/plugins/axios/repo'
import { useCodeStore } from '@/plugins/stores/code'
import { useUserStore } from '@/plugins/stores/user'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const dialog = ref(false)

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
