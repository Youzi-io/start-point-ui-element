<template>
  <el-table v-loading="props.loading" :data="props.tableData" style="width: 100%"
    :header-cell-style="props.headerCellStyle" :row-key="props.rowKey" :border="props.border"
    :default-expand-all="defaultExpandAll" @selection-change="handleSelectionChange" @select-all="handleSelectAll">
    <el-table-column v-for="item in props.columns" :key="item.prop" :type="item.type" :prop="item.prop"
      :label="item.label" :width="item.width" :min-width="item.minWidth" :align="item.align"
      :show-overflow-tooltip="item.showOverflowTooltip">
      <template #default="scope">
        <slot v-if="item.slot" :name="item.slot" :row="scope.row"> </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup generic="T">
import type { Columns } from '@/types/components/sTable';

const props = withDefaults(defineProps<Props<T>>(), {
  rowKey: 'id',
  border: true,
  defaultExpandAll: false
})

const emit = defineEmits(['selectionChange', 'selectAll'])
const handleSelectionChange = (val: T[]) => {
  emit('selectionChange', val)
}

const handleSelectAll = (val: T[]) => {
  emit('selectAll', val)
}

</script>
<script lang="ts">
interface Props<T> {
  columns: Columns[];
  tableData: T[];
  headerCellStyle?: Record<string, string>;
  loading?: boolean;
  rowKey?: string;
  border?: boolean
  defaultExpandAll?: boolean
}
</script>

<style scoped></style>