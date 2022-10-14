import type { textChip } from 'env'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const storeSetup = () => {
  const fileName = ref('')
  const cdnUrl = ref('')

  // 返回处理文件名的自定义函数
  type FileNameType = (filename: string, md5: string) => string
  const getFileName = computed<FileNameType>(() => {
    try {
      const userFn: FileNameType = new Function(`return ${fileName.value}`)()
      if (typeof userFn('', '') == 'string') {
        return userFn
      }
      throw new Error()
    } catch (error) {
      return (filename, md5) => `${md5}.${filename.split('.').at(-1)}`
    }
  })

  // 返回获取 CDN 模板的自定义函数
  type CdnUrlItemsType = (username: string, repository: string, directory: string, filename: string) => textChip[]
  const getCdnUrlItems = computed<CdnUrlItemsType>(() => {
    try {
      const userFn: CdnUrlItemsType = new Function(`return ${cdnUrl.value}`)()
      if (userFn('', '', '', '').every(item => ['label', 'text'].every(key => Object.prototype.hasOwnProperty.call(item, key)))) {
        return userFn
      }
      throw new Error()
    } catch (error) {
      return (username, repository, directory, filename) => [
        {
          label: 'jsDelivr',
          text: `https://cdn.jsdelivr.net/gh/${username}/${repository}/${directory}/${filename}`.replaceAll(/(?<!:)\/{2,}/g, '/')
        }
      ]
    }
  })

  return {
    fileName,
    cdnUrl,
    getFileName,
    getCdnUrlItems
  }
}

export const useCodeStore = defineStore('code', storeSetup, {
  persist: true
})
