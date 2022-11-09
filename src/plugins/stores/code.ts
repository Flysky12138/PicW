import formatUrl from '@/libs/formatUrl'
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
        return new Proxy(userFn, {
          // 代理自定义函数
          apply: (target, thisArg, argArray) => {
            return new Proxy(Reflect.apply(target, thisArg, argArray), {
              // 代理函数返回的值的获取操作
              get: (target, p, receiver) => {
                // 返回数组长度
                if (p == 'length') {
                  return Reflect.get(target, p, receiver)
                } else {
                  return new Proxy(Reflect.get(target, p, receiver), {
                    // 代理数组每一项内容（对象）的获取操作
                    get: (target, p, receiver) => {
                      return p == 'text' ? formatUrl(Reflect.get(target, p, receiver)) : Reflect.get(target, p, receiver)
                    }
                  })
                }
              }
            })
          }
        })
      }
      throw new Error()
    } catch (error) {
      return (username, repository, directory, filename) => [
        {
          label: 'jsDelivr',
          text: formatUrl(`https://cdn.jsdelivr.net/gh/${username}/${repository}/${directory}/${filename}`)
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
