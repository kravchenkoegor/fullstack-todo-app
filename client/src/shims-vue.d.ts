/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from '@vue/composition-api'
  const component: DefineComponent<{}, {}, any>
  export default component
}
