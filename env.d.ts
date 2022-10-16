/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    keepAlive?: boolean
    requiresAuth?: boolean
  }
}

declare interface textChip {
  label: string
  text: string
}

declare type RemoveReadonly<T> = { -readonly [P in keyof T]: T[P] }
