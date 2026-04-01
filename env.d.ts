/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@iconify/vue' {
  import { Component } from 'vue'
  export const Icon: Component
  export default Icon
}

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    [key: string]: DefineLocaleMessage | string
  }
}

// Global declarations
declare const __VUE_I18N_FULL_INSTALL__: boolean
declare const __VUE_I18N_LEGACY_API__: boolean
declare const __INTLIFY_PROD_DEVTOOLS__: boolean
