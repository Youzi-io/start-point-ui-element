<template>
  <div class="container">
    <el-form ref="formRef" :model="queryParams" label-position="left" class="search-form">
      <el-space wrap>
        <el-form-item prop="title" label="页面标题">
          <el-input v-model="queryParams.title" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item prop="fullPath" label="路由地址">
          <el-input v-model="queryParams.fullPath" placeholder="请输入标题"></el-input>
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
      <template #icon="{ row }: { row: IRowData }">
        <MSIcon :name="row.icon!" size="20"></MSIcon>
      </template>
      <template #type="{ row }">
        <RenderType :row />
      </template>
      <template #keepAlive="{ row }">
        <RenderKeepAlive :row />
      </template>
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
    <MenuAdd ref="menuAddRef" @success="getData"></MenuAdd>
    <MenuEdit ref="menuEditRef" @success="getData"></MenuEdit>
    <MenuBatchEdit ref="menuBatchEditRef" @success="getData"></MenuBatchEdit>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, h } from 'vue'
import type { GetRoutesParams, RoutesInfo } from '@/types/system/routes'
import { getRoutesListApi, deleteRoutesApi, batchDeleteRoutesApi } from '@/api/system/routes'
import STableHeader from '@/components/STableHeader/index.vue'
import STable from '@/components/STable/index.vue';
import MenuAdd from './add/index.vue'
import MenuEdit from './edit/index.vue'
import MenuBatchEdit from './batchEdit/index.vue'
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
    label: '页面标题',
    prop: 'title',
    width: '180',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '图标',
    prop: 'icon',
    slot: 'icon',
    width: '80',
    align: 'center',
  },
  {
    label: '路由地址',
    prop: 'fullPath',
    minWidth: '200',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '类型',
    prop: 'type',
    slot: 'type',
    minWidth: '100',
    align: 'center',
  },
  {
    label: '缓存',
    prop: 'keepAlive',
    slot: 'keepAlive',
    width: '80',
    align: 'center',
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
    width: '160',
  }
]

// 分页
const pageSizes = [10, 20, 30, 50]
const total = ref<number>(0)
const queryParams = reactive<GetRoutesParams>({
  pageNum: 1,
  pageSize: 10,
  orderBy: '',
  title: '',
  fullPath: '',
  status: null
})

const statusOptions = ref<DictDataInfo[]>([])
const routesTypeOptions = ref<DictDataInfo[]>([])
const keepAliveOptions = ref<DictDataInfo[]>([])

const dictStore = useDictStore()
const getDictData = async () => {
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
  routesTypeOptions.value = await dictStore.getDictData('sys_routes_type')
  keepAliveOptions.value = await dictStore.getDictData('sys_routes_keep_alive')
}

const data = ref<RoutesInfo[]>([])
const getData = async () => {
  show.value = true
  const result = await getRoutesListApi(queryParams)
  if (result.code === 200) {
    data.value = result.data.list
    total.value = result.data.total
  }
  show.value = false
}
const resetForm = () => {
  queryParams.title = ''
  queryParams.fullPath = ''
  queryParams.status = null
  getData()
}

/**
 * 渲染数据过滤
 */
const RenderType = ({ row }: { row: IRowData }) => {
  const item = routesTypeOptions.value.find((item) => item.dictValue === row.type)
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
const RenderKeepAlive = ({ row }: { row: IRowData }) => {
  const item = keepAliveOptions.value.find((item) => item.dictValue === row.keepAlive)
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

const menuEditRef = ref()
const editRow = (item: IRowData) => {
  menuEditRef.value.showModal(item.id)
}

const deleteRow = async (item: IRowData) => {
  const result = await deleteRoutesApi(item.id)
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

const menuAddRef = ref()
const addRow = () => {
  menuAddRef.value.showModal()
}

const menuBatchEditRef = ref()
const batchEditRow = () => {
  menuBatchEditRef.value.showModal(checkData.value)
}

const batchDeleteRow = async () => {
  const result = await batchDeleteRoutesApi(checkData.value)
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
  name: `${mainRouteName}-menu`
})
</script>
<script lang="ts">
interface IRowData extends RoutesInfo { }
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
