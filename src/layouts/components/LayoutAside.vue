<template>
  <div class="layout-aside">
    <!-- 头部 -->
    <div class="layout-aside__head">
      <div class="logo" v-show="!props.collapsed">
        start point
      </div>
      <div class="collapse">
        <MSIcon v-show="!props.collapsed" name="Arrow_Menu_Close" size="30"></MSIcon>
        <MSIcon v-show="props.collapsed" name="Arrow_Menu_Open" size="30"></MSIcon>
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
            <SubMenu v-if="item.children" :route-info="item" />
            <el-menu-item v-if="!item.children" :index="item.fullPath">
              <el-icon>
                <MSIcon :name="item.icon!" size="20"></MSIcon>
              </el-icon>
              <template #title>{{ item.routesName }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </ScrollBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MSIcon from '@/components/MSIcon/index.vue'
import ScrollBar from '@/components/ScrollBar/index.vue'
import { usePermissionStore } from '@/stores'
import { MenuTypeEnum } from '@/constants/routesEnum'
import SubMenu from './SubMenu.vue';

const route = useRoute()
const currentRoutes = ref<string>(route.path)

const props = withDefaults(defineProps<Props>(), {
  collapsed: true
})
// 处理菜单数据
const permissionStore = usePermissionStore()

const menuList = permissionStore.menuRouters

const router = useRouter()
// const menuClick = (key: string, item: MenuOption) => {
//   if (item.link) {
//     window.open(item.fullPath as string, '_blank')
//   } else {
//     router.push({
//       path: key
//     })
//   }
// }

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
    color: var(--el-color-primary);
    background-color: #fcfcfc;

    .logo {
      font-size: 30px;
    }

    .collapse {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  &__menu {
    height: calc(100% - $head-height);
  }
}
</style>
