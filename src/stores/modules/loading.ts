import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loadingStore', {
  state: (): State => ({
    fullscreenLoading: false,
    loading: false,
    text: '加载中...'
  }),
  actions: {
    isLocalLoading(val: boolean) {
      this.loading = val
    }
  }
})

interface State {
  fullscreenLoading: boolean
  loading: boolean
  text: string
}
