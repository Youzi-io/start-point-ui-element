<template>
  <div class="layout-aside">
    <!-- 头部 -->
    <div class="layout-aside__head">
      <div class="logo" v-show="!props.collapsed">start point</div>
      <div v-show="props.collapsed">
        <MSIcon name="Radio_Button_Checked" size="30"></MSIcon>
      </div>
    </div>
    <!-- 菜单 -->
    <div class="layout-aside__menu">
      <ScrollBar>
        <!-- <el-menu v-model:value="currentRoutes" :collapsed="props.collapsed" :collapsed-width="64"
          :collapsed-icon-size="22" :options="items" key-field="fullPath" label-field="title" children-field="children"
          @update:value="menuClick" /> -->

        <el-menu :default-active="currentRoutes" :collapse="props.collapsed">
          <template v-for="item in menuList" :key="item.id">

            <el-sub-menu :index="item.fullPath">
              <template #title>
                <MSIcon :name="item.icon!" size="20"></MSIcon>
                <span>{{ item.routesName }}</span>
              </template>

              <el-menu-item index="1-1">item one</el-menu-item>

              <el-sub-menu index="1-4">
                <template #title><span>item four</span></template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>

            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <template #title>Navigator Two</template>
            </el-menu-item>

          </template>

        </el-menu>
      </ScrollBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, reactive, ref, watch, type VNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RoutesInfoRes } from '@/types/system/routes'
import MSIcon from '@/components/MSIcon/index.vue'
import ScrollBar from '@/components/ScrollBar/index.vue'
import { usePermissionStore } from '@/stores'
import { MenuTypeEnum } from '@/constants/routesEnum'

const route = useRoute()
const currentRoutes = ref<string>(route.path)

const props = withDefaults(defineProps<Props>(), {
  collapsed: true
})
// 处理菜单数据
const permissionStore = usePermissionStore()

const menuList = permissionStore.menuRouters

const router = useRouter()
const menuClick = (key: string, item: MenuOption) => {
  if (item.link) {
    window.open(item.fullPath as string, '_blank')
  } else {
    router.push({
      path: key
    })
  }
}

watch(
  route,
  () => {
    currentRoutes.value = route.path
  },
  {
    immediate: true
  }
)
</script>
<script lang="ts">
interface Props {
  collapsed: boolean
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
    color: #18a058;
    background-color: #fcfcfc;

    .logo {
      flex: 1;
      text-align: center;
      font-size: 30px;
      white-space: nowrap;
    }
  }

  &__menu {
    height: calc(100% - $head-height);
  }
}
</style>
