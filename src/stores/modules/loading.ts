import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loadingStore', {
  state: (): State => ({
    fullscreenLoading: false,
    loading: false,
    text: '加载中...'
  }),
  actions: {
    isFullscreenLoading(val: boolean) {
      this.fullscreenLoading = val
    },
    isLoading(val: boolean) {
      this.loading = val
    }
  }
})

interface State {
  fullscreenLoading: boolean
  loading: boolean
  text: string
}
