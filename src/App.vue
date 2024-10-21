<script setup lang="ts">
import { useLocale } from './locales/useLocale';

const { getLocale, locale } = useLocale()
</script>

<template>
  <el-config-provider :locale="getLocale">
    <RouterView :key="locale" />
  </el-config-provider>
</template>

<style scoped></style>
