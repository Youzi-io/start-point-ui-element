<template>
  <div class="layout-aside">
    <!-- 头部 -->
    <div class="layout-aside__head">
      <div class="logo" v-show="!collapsed">
        start point
      </div>
      <div v-show="collapsed">
        <MSIcon name="Radio_Button_Checked" size="30"></MSIcon>
      </div>
    </div>
    <!-- 菜单 -->
    <div class="layout-aside__menu">
      <ScrollBar>
        <el-menu class="el-menu-vertical" :default-active="currentRoutes" :collapse="collapsed" @select="menuClick">
          <template v-for="item in menuList" :key="item.id">
            <SubMenu v-if="item.children && item.showStatus === '0'" :route-info="item" />
            <el-menu-item v-if="!item.children && item.showStatus === '0'" :index="item.fullPath">
              <el-icon>
                <MSIcon :name="item.icon!" size="20"></MSIcon>
              </el-icon>
              <template #title>{{ item.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </ScrollBar>
    </div>

    <div class="collapse" @click="handleCollapse"
      :style="{ left: collapsed ? `${collapsedWidth! + 10}px` : `${width! + 10}px` }">
      <MSIcon v-show="!collapsed" name="Chevron_Left" size="20"></MSIcon>
      <MSIcon v-show="collapsed" name="Chevron_Right" size="20"></MSIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MSIcon from '@/components/MSIcon/index.vue'
import ScrollBar from '@/components/ScrollBar/index.vue'
import { usePermissionStore } from '@/stores'
import SubMenu from './SubMenu.vue'
import type { ProvideMenu } from '@/types/layouts'

const route = useRoute()
const currentRoutes = computed(() => route.path)

const { width, collapsedWidth, collapsed, handleCollapse } = inject<ProvideMenu>("provideMenu", {})
// 处理菜单数据
const permissionStore = usePermissionStore()
const menuList = permissionStore.menuRouters
const router = useRouter()
const menuClick = (path: string) => {
  const regExp = /^https:\/\//
  const isHttps = regExp.test(path)
  if (isHttps) {
    window.open(path, '_blank')
  } else {
    router.push({
      path
    })
  }
}

</script>
<style lang="scss" scoped>
$head-height: 54px;

.layout-aside {
  height: 100%;
  background-color: #fff;

  &__head {
    height: $head-height;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-color-primary);
    background-color: #fcfcfc;

    .logo {
      font-size: 30px;
      text-wrap: nowrap;
      margin-right: 10px;
    }
  }

  &__menu {
    height: calc(100% - $head-height);
    user-select: none;

    .el-menu-vertical:not(.el-menu--collapse) {
      width: calc(v-bind(width) * 1px);
    }
  }

  .collapse {
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 250px;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    background-color: #fff;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
    @include divInitialization($br: 50%);
  }
}
</style>
