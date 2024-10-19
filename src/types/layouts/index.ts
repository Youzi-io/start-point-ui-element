import type { Ref } from 'vue'

export interface ProvideTag {
  refresh?: () => void
}

export interface ProvideMenu {
  collapsedWidth?: number
  width?: number
  collapsed?: Ref<boolean>
  handleCollapse?: () => void
}
