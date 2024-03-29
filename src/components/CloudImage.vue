<template>
  <v-hover #default="{ isHovering, props }">
    <v-card v-bind="props" :elevation="isHovering ? 8 : 2" rounded="lg">
      <v-img v-if="item.type == 'file'" :src="fileCdnUrls[0].text" height="200" cover>
        <v-expand-transition>
          <v-sheet v-show="isHovering" height="100%">
            <v-card variant="tonal" rounded="0" height="100%">
              <v-card-title>
                <v-row>
                  <v-col cols="5">
                    <v-btn :disabled="!islogin" block variant="tonal" prepend-icon="mdi-trash-can-outline" color="secondary">
                      delete
                      <v-dialog v-model="dialog.delete" activator="parent" persistent>
                        <v-card min-width="250" width="25vw" class="mx-auto">
                          <v-card-text> 确认删除？</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="warning" variant="text" @click="dialog.delete = false"> 取消 </v-btn>
                            <v-btn
                              color="success"
                              variant="text"
                              @click="
                                () => {
                                  dialog.delete = false
                                  $emit('delete')
                                }
                              "
                            >
                              确认
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn block variant="tonal" color="success">
                      <v-icon icon="mdi-download"></v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="5">
                    <v-btn block variant="tonal" prepend-icon="mdi-image-search-outline" color="secondary">
                      preview
                      <v-dialog v-model="dialog.preview" activator="parent" fullscreen transition="scale-transition">
                        <v-card color="rgb(0 0 0 / 75%)" style="backdrop-filter: blur(10px)">
                          <v-card-text class="overflow-hidden d-flex justify-center align-center pa-sm-12" @click="dialog.preview = false">
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
      <v-sheet v-else height="200" class="d-flex flex-column justify-center align-center" @click="toChildPath(item.path)">
        <v-card-title class="text-subtitle-1 text-medium-emphasis" style="position: absolute; top: 0"> {{ item.name }} </v-card-title>
        <v-icon icon="mdi-folder-multiple-image" size="80" class="mx-auto text-disabled"></v-icon>
      </v-sheet>
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import TextChip from '@/components/TextChip.vue'
import type { RepoPathContent } from '@/plugins/axios/repo'
import { useCodeStore } from '@/plugins/stores/code'
import { useUserStore } from '@/plugins/stores/user'
import { storeToRefs } from 'pinia'
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { VImg } from 'vuetify/components/VImg'

const props = defineProps<{
  item: RepoPathContent
  name: string
  repository: string
  directory: string
}>()
defineEmits<{
  (event: 'delete'): void
}>()

const dialog = reactive({
  delete: false,
  preview: false
})
const { islogin } = storeToRefs(useUserStore())

// 获取 CDN
const { getCdnUrlItems } = storeToRefs(useCodeStore())
const fileCdnUrls = computed(() => getCdnUrlItems.value(props.name, props.repository, props.directory, props.item.name))

// 进入子目录
const { push } = useRouter()
const { query } = useRoute()
const toChildPath = (directory: string) => {
  push({
    query: Object.assign({}, query, { directory })
  })
}
</script>
