<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { ElLoading } from 'element-plus';
import { useLocale } from './locales/useLocale';
import { useLoadingStore } from './stores';

const { getLocale, locale } = useLocale()
const loadingStore = useLoadingStore()
loadingStore.isFullscreenLoading(true)
onMounted(() => {
  setTimeout(() => {
    loadingStore.isFullscreenLoading(false)
  }, 1000)
})

const fullscreenLoading = ref()
watchEffect(() => {
  if (loadingStore.fullscreenLoading) {
    fullscreenLoading.value = ElLoading.service({ fullscreen: true, background: '#fff' })
  } else if (fullscreenLoading.value && !loadingStore.fullscreenLoading) {
    fullscreenLoading.value.close()
  }
})
</script>

<template>
  <el-config-provider :locale="getLocale">
    <RouterView :key="locale" />
  </el-config-provider>
</template>

<style scoped></style>
