import type { CdnUrlItemsType } from 'env'

const formatUrl = (target: CdnUrlItemsType) => {
  return new Proxy(target, {
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
              // 代理数组每一项内容（对象）的键值获取操作
              get: (target, p, receiver) => {
                return p == 'text' ? Reflect.get(target, p, receiver).replaceAll(/(?<!:)\/{2,}/g, '/') : Reflect.get(target, p, receiver)
              }
            })
          }
        }
      })
    }
  })
}

export default formatUrl
