import type { RemoveReadonly } from 'env'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { VSnackbar } from 'vuetify/components/VSnackbar'

type SnackBarOptions = Pick<
  VSnackbar['$props'],
  'color' | 'location' | 'position' | 'rounded' | 'timeout' | 'transition' | 'variant' | 'vertical' | 'contentClass'
>

const storeSetup = () => {
  const show = ref(false)
  const content = ref('')
  const options: RemoveReadonly<SnackBarOptions> = reactive({})

  // 函数式显示提示信息
  const showMessage = ($content: string, $options?: SnackBarOptions) => {
    const delay = show.value ? 200 : 0
    show.value = false
    content.value = $content

    options.color = $options?.color
    options.location = $options?.location ?? 'top center'
    options.position = $options?.position
    options.rounded = $options?.rounded
    options.timeout = $options?.timeout ?? 5000
    options.transition = $options?.transition ?? 'v-snackbar-transition'
    options.variant = $options?.variant ?? 'elevated'
    options.vertical = $options?.vertical ?? false
    options.contentClass = $options?.contentClass ?? ''

    setTimeout(() => {
      show.value = true
    }, delay)
  }

  return {
    show,
    content,
    options,
    showMessage
  }
}

export const useSnackBarStore = defineStore('snackbar', storeSetup)
