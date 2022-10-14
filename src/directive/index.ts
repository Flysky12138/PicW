import type { App, FunctionDirective, Plugin } from 'vue'

const install = (app: App<Element>) => {
  const modules: Record<string, () => Promise<FunctionDirective>> = import.meta.glob('./*.ts', { import: 'default' })

  /**
   * @use v-<filename>
   * @description 批量注册自定义指令
   */
  for (const name in modules) {
    modules[name]().then(directive => {
      app.directive(name.match(/\.\/(\w+)\.ts/)![1], directive)
    })
  }
}

export default {
  install
} as Plugin
