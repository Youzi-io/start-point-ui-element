<template>
  <div class="table-header">
    <el-tooltip placement="top" trigger="hover" content="刷新">
      <el-button type="primary" @click="refreshClick">
        <template #icon>
          <MSIcon name="Cached" size="20"></MSIcon>
        </template>
      </el-button>
    </el-tooltip>

    <el-tooltip placement="top" trigger="hover" content="添加">
      <el-button type="primary" style="margin: 0 0 0 8px" @click="addClick">
        <template #icon>
          <MSIcon name="Add" size="20"></MSIcon>
        </template>
        <span> 添加 </span>
      </el-button>
    </el-tooltip>

    <el-tooltip placement="top" trigger="hover" content="编辑选中行">
      <el-button type="primary" :disabled="props.isNoSelection" style="margin: 0 0 0 8px" @click="editClick">
        <template #icon>
          <MSIcon name="Edit" size="20"></MSIcon>
        </template>
        <span> 编辑 </span>
      </el-button>
    </el-tooltip>

    <el-popconfirm title="确定删除选中记录？" @confirm="deleteClick">
      <template #reference>
        <div style="display: inline-block;">
          <el-tooltip placement="top" trigger="hover" content="删除选中行">
            <el-button type="danger" :disabled="props.isNoSelection" style="margin: 0 0 0 8px">
              <template #icon>
                <MSIcon name="Delete" size="20"></MSIcon>
              </template>
              <span> 删除 </span>
            </el-button>
          </el-tooltip>
        </div>
      </template>
    </el-popconfirm>

  </div>
</template>

<script lang="ts" setup>
import MSIcon from '@/components/MSIcon/index.vue'

const props = withDefaults(defineProps<Props>(), {
  isNoSelection: true
})
const emit = defineEmits(['refreshClick', 'addClick', 'editClick', 'deleteClick'])

const refreshClick = () => {
  emit('refreshClick')
}
const addClick = () => {
  emit('addClick')
}

const editClick = () => {
  emit('editClick')
}
const deleteClick = () => {
  emit('deleteClick')
}
</script>
<script lang="ts">
interface Props {
  isNoSelection: boolean
}
</script>

<style lang="scss" scoped>
.table-header {
  margin: 10px;
}
</style>
