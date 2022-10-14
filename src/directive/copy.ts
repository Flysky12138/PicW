import throttle from '@/libs/throttle'
import { useSnackBarStore } from '@/plugins/stores/snackbar'
import type { FunctionDirective } from 'vue'

const { showMessage } = useSnackBarStore()

interface BindingValue {
  copyText: string
  prependText: string
}

const copy: FunctionDirective<HTMLElement, string | BindingValue> = (el, binding) => {
  const _throttle = throttle(() => {
    let [copyText, prependText] = ['', '']
    if (typeof binding.value == 'object') {
      copyText = binding.value.copyText
      prependText = binding.value.prependText
    } else {
      copyText = binding.value || el?.textContent || ''
    }
    if (copyText) {
      navigator.clipboard.writeText(copyText)
      showMessage(`${prependText} Copied!`, { timeout: 2000 })
    }
  }, 500)
  el.addEventListener('pointerup', _throttle)
}

export default copy
