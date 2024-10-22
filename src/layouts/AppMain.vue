<template>
  <el-container class="layout">
    <el-aside :width="collapsed ? `${collapsedWidth}px` : `${width}px`" class="aside">
      <LayoutAside />
    </el-aside>
    <el-container>
      <el-header class="header">
        <LayoutHeader />
      </el-header>
      <el-scrollbar height="100%">
        <el-main class="content">
          <LayoutContent />
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import LayoutAside from './components/LayoutAside.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutContent from './components/LayoutContent.vue'
import { provide, ref } from 'vue'
import type { ProvideMenu, ProvideTag } from '@/types/layouts'
import { ElMessage } from 'element-plus'

const collapsed = ref<boolean>(false)
const collapsedWidth = 64
const width = 240
const refresh = () => {
  ElMessage({
    message: '刷新成功!',
    type: 'success',
    plain: true,
  })
}
const handleCollapse = () => {
  collapsed.value = !collapsed.value
}
provide<ProvideMenu>('provideMenu', {
  collapsedWidth,
  width,
  collapsed,
  handleCollapse
})
provide<ProvideTag>('provideTag', {
  refresh
})
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  background-color: #f5f5f5;

  .aside,
  .header,
  .content {
    background-color: #f5f5f5;
  }

  .aside {
    margin: 10px;
    box-sizing: content-box;
    transition: width 0.3s ease;
    @include divInitialization();
  }

  .header {
    padding: 10px 10px 0 0;
  }

  .content {
    height: calc(100% - 56px);
    overflow: hidden;
    padding: 10px 10px 10px 0;

    :deep(.n-layout-scroll-container) {
      margin-inline-end: -5px;
      overflow-y: scroll;
      @include scrollbar();
    }
  }
}
</style>