<template>
  <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="pageSize"
    :page-sizes="props.pageSizes" background layout="total, sizes, prev, pager, next, jumper" :total="props.total"
    @change="changePage">
  </el-pagination>
</template>

<script setup lang="ts">
const pageNum = defineModel<number>('pageNum')
const pageSize = defineModel<number>('pageSize')

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 30, 50]
})

const emit = defineEmits(['changePage'])

const changePage = (pageNum: number, pageSize: number) => {
  emit('changePage', pageNum, pageSize)
}
</script>
<script lang="ts">
interface Props {
  pageSizes?: number[]
  total: number
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: 16px 10px 16px 0;
  justify-content: flex-end;
}
</style>
