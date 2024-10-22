<template>
  <div class="container">
    <el-form ref="formRef" :model="queryParams" label-position="left" class="search-form">
      <el-space wrap>
        <el-form-item path="roleName" label="角色名称">
          <el-input v-model="queryParams.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>

        <el-form-item path="roleKey" label="权限字符">
          <el-input v-model="queryParams.roleKey" placeholder="请输入权限字符"></el-input>
        </el-form-item>

        <el-form-item prop="status" label="状态">
          <el-select v-model="queryParams.status" clearable placeholder="请选择状态" style="width: 140px">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.dictTag" :value="item.dictValue" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getData">搜索</el-button>
          <el-button style="margin: 0 8px" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-space>
    </el-form>

    <STableHeader :isNoSelection="!checkData.length" @refresh-click="refresh" @add-click="addRow"
      @edit-click="batchEditRow" @delete-click="batchDeleteRow"></STableHeader>

    <STable loading :columns="columns" :table-data="data" @selection-change="handleSelect">
      <template #status="{ row }">
        <RenderStatus :row />
      </template>
      <template #operation="{ row }">
        <el-tooltip placement="top" trigger="hover" content="编辑">
          <el-button type="primary" size="small" @click="editRow(row)">
            <template #icon>
              <MSIcon name="Edit" size="18"></MSIcon>
            </template>
          </el-button>
        </el-tooltip>

        <el-popconfirm title="确定删除选中记录？" placement="left" @confirm="deleteRow(row)">
          <template #reference>
            <div style="display: inline-block;">
              <el-tooltip placement="top" trigger="hover" content="删除">
                <el-button type="danger" size="small" style="margin:0 8px">
                  <template #icon>
                    <MSIcon name="Delete" size="18"></MSIcon>
                  </template>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-popconfirm>
      </template>
    </STable>

    <SPagination v-model:page="queryParams.pageNum" v-model:pageSize="queryParams.pageSize" :pageSizes="pageSizes"
      :total="total" @change-page="getData"></SPagination>
    <RoleAdd ref="roleAddRef" @success="getData"></RoleAdd>
    <RoleEdit ref="roleEditRef" @success="getData"></RoleEdit>
    <RoleBatchEdit ref="roleBatchEditRef" @success="getData"></RoleBatchEdit>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, h } from 'vue'
import { batchDeleteRoleApi, deleteRoleApi, getRoleListApi } from '@/api/system/role'
import type { GetRoleParams, RoleInfo } from '@/types/system/role'
import STableHeader from '@/components/STableHeader/index.vue'
import STable from '@/components/STable/index.vue';
import RoleAdd from './add/index.vue'
import RoleEdit from './edit/index.vue'
import RoleBatchEdit from './batchEdit/index.vue'
import MSIcon from '@/components/MSIcon/index.vue'
import SPagination from '@/components/SPagination/index.vue'
import { mainRouteName } from '@/permission'
import type { DictDataInfo } from '@/types/system/dictData'
import { useDictStore } from '@/stores'
import { ElMessage, ElTag, type FormInstance } from 'element-plus'
import type { Columns } from '@/types/components/sTable'

const formRef = ref<FormInstance>()
const show = ref<boolean>(false)
// 表格
const columns: Columns[] = [
  {
    type: 'selection',
    width: '50',
    align: 'center'
  },
  {
    label: '角色名称',
    prop: 'roleName',
    minWidth: '180',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '权限字符',
    prop: 'roleKey',
    minWidth: '200',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '状态',
    prop: 'status',
    slot: 'status',
    width: '80',
    align: 'center',
  },
  {
    label: '排序',
    prop: 'orderIndex',
    width: '100',
    align: 'center'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    width: '180',
    align: 'center'
  },
  {
    label: '操作',
    prop: 'operation',
    slot: 'operation',
    align: 'center',
    width: '160'
  }
]

// 分页
const pageSizes = [10, 20, 30, 50]
const total = ref<number>(0)
const queryParams = reactive<GetRoleParams>({
  pageNum: 1,
  pageSize: 10,
  orderBy: '',
  roleName: '',
  roleKey: '',
  status: null
})

const statusOptions = ref<DictDataInfo[]>([])
const dictStore = useDictStore()
const getDictData = async () => {
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
}

const data = ref<RoleInfo[]>([])
const getData = async () => {
  show.value = true
  const result = await getRoleListApi(queryParams)
  if (result.code === 200) {
    data.value = result.data.list
    total.value = result.data.total
  }
  show.value = false
}
const resetForm = () => {
  queryParams.roleName = ''
  queryParams.roleKey = ''
  queryParams.status = null
  getData()
}

/**
 * 渲染数据过滤
 */
const RenderStatus = ({ row }: { row: IRowData }) => {
  const item = statusOptions.value.find((item) => item.dictValue === row.status)
  if (item) {
    return h(
      ElTag,
      {
        type: item ? item.listClass : 'info'
      },
      {
        default: () => (item ? item.dictTag : '未知')
      }
    )
  }
}

/**
 * 表格操作
 */
const checkData = ref<string[]>([])
const handleSelect = (dataList: IRowData[]) => {
  checkData.value = dataList.map(item => item.id)
}

const roleEditRef = ref()
const editRow = (item: IRowData) => {
  roleEditRef.value.showModal(item.id)
}

const deleteRow = async (item: IRowData) => {
  const result = await deleteRoleApi(item.id)
  if (result.code === 200) {
    ElMessage({
      message: result.message,
      type: 'success',
      plain: true,
    })
    checkData.value = []
    getData()
  }
}

/**
 * 表头操作栏
 */
const refresh = () => {
  getData()
}

const roleAddRef = ref()
const addRow = () => {
  roleAddRef.value.showModal()
}

const roleBatchEditRef = ref()
const batchEditRow = () => {
  roleBatchEditRef.value.showModal(checkData.value)
}

const batchDeleteRow = async () => {
  const result = await batchDeleteRoleApi(checkData.value)
  if (result.code === 200) {
    ElMessage({
      message: result.message,
      type: 'success',
      plain: true,
    })
    checkData.value = []
    getData()
  }
}


onMounted(() => {
  getData()
  getDictData()
})

defineOptions({
  name: `${mainRouteName}-role`
})
</script>
<script lang="ts">
interface IRowData extends RoleInfo { }
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
}

.search-form {
  padding: 20px 10px;
}

.pagination {
  padding: 16px 10px 16px 0;
  justify-content: flex-end;
}
</style>
