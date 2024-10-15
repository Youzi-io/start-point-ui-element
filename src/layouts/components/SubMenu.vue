<template>
  <el-sub-menu :index="props.routeInfo?.fullPath">
    <template #title>
      <el-icon>
        <MSIcon :name="props.routeInfo?.icon!" size="20"></MSIcon>
      </el-icon>
      <span>{{ props.routeInfo?.routesName }}</span>
    </template>

    <template v-for="item in props.routeInfo?.children" :key="item.id">
      <el-menu-item v-if="!item.children" :index="item.fullPath">
        <el-icon>
          <MSIcon :name="item.icon!" size="20"></MSIcon>
        </el-icon>
        <template #title>
          {{ item.routesName }}
        </template>
      </el-menu-item>
      <SubMenu v-if="item.children" :routeInfo="item"></SubMenu>
    </template>
  </el-sub-menu>
</template>

<script lang="ts" setup>
import type { RoutesInfoRes } from '@/types/system/routes';
import MSIcon from '@/components/MSIcon/index.vue'


const props = withDefaults(defineProps<Props>(), {
  routeInfo: null
})
</script>
<script lang="ts">
interface Props {
  routeInfo: RoutesInfoRes | null
}
</script>

<style scoped></style>