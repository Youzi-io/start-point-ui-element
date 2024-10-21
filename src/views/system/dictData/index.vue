<template>
  <div class="container">
    <el-form ref="formRef" :model="queryParams" label-position="left" class="search-form">
      <el-space wrap>
        <el-form-item prop="dictType" label="字典类型">
          <el-select v-model="queryParams.dictType" placeholder="请选择字典类型" style="width: 140px">
            <el-option v-for="item in typeOptionSelect" :key="item.id" :label="item.dictName" :value="item.dictType" />
          </el-select>
        </el-form-item>

        <el-form-item prop="dictTag" label="字典标签">
          <el-input v-model="queryParams.dictTag" placeholder="请输入字典标签"></el-input>
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

    <STable :columns="columns" :table-data="data" @selection-change="handleSelect">
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
    <DictDataAdd ref="dictDataAddRef" @success="getData"></DictDataAdd>
    <DictDataEdit ref="dictDataEditRef" @success="getData"></DictDataEdit>
    <DictDataBatchEdit ref="dictDataBatchEditRef" @success="getData"></DictDataBatchEdit>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, h } from 'vue'
import STableHeader from '@/components/STableHeader/index.vue'
import STable from '@/components/STable/index.vue';
import DictDataAdd from './add/index.vue'
import DictDataEdit from './edit/index.vue'
import DictDataBatchEdit from './batchEdit/index.vue'
import MSIcon from '@/components/MSIcon/index.vue'
import SPagination from '@/components/SPagination/index.vue'
import { mainRouteName } from '@/permission'
import type { DictDataInfo, GetDictDataParams } from '@/types/system/dictData'
import {
  batchDeleteDictDataApi,
  deleteDictDataApi,
  getDictDataListApi
} from '@/api/system/dictData'
import { useRoute } from 'vue-router'
import { getTypeOptionSelectApi } from '@/api/system/dict'
import type { DictInfo } from '@/types/system/dict'
import { useDictStore } from '@/stores'
import { ElMessage, ElTag, type FormInstance } from 'element-plus'
import type { Columns } from '@/types/components/sTable';

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
    label: '字典编码',
    prop: 'dictCode',
    width: '100',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '字典标签',
    prop: 'dictTag',
    minWidth: '160',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '字典键值',
    prop: 'dictValue',
    width: '100',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '字典排序',
    prop: 'dictOrder',
    width: '100',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '状态',
    prop: 'status',
    slot: 'status',
    width: '80',
    align: 'center'
  },
  {
    label: '备注',
    prop: 'remark',
    minWidth: '160',
    align: 'center',
    showOverflowTooltip: true
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
const queryParams = reactive<GetDictDataParams>({
  pageNum: 1,
  pageSize: 10,
  orderBy: '',
  dictType: '',
  dictTag: '',
  status: null
})

const statusOptions = ref<DictDataInfo[]>([])
const dictStore = useDictStore()
const getDictData = async () => {
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
}

const data = ref<IRowData[]>([])
const typeOptionSelect = ref<DictInfo[]>([])
const getData = async () => {
  show.value = true
  const typeOptionSelectResult = await getTypeOptionSelectApi()
  if (typeOptionSelectResult.code === 200) {
    typeOptionSelect.value = typeOptionSelectResult.data
  }
  const result = await getDictDataListApi(queryParams)
  if (result.code === 200) {
    data.value = result.data.list
    total.value = result.data.total
  }
  show.value = false
}

const route = useRoute()
const resetForm = () => {
  queryParams.dictType = route.params.dictType.toString()
  queryParams.dictTag = ''
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

const dictDataEditRef = ref()
const editRow = (item: IRowData) => {
  dictDataEditRef.value.showModal(item.id)
}

const deleteRow = async (item: IRowData) => {
  const result = await deleteDictDataApi(item.id)
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

const dictDataAddRef = ref()
const addRow = () => {
  dictDataAddRef.value.showModal(queryParams.dictType)
}

const dictDataBatchEditRef = ref()
const batchEditRow = () => {
  dictDataBatchEditRef.value.showModal(checkData.value)
}

const batchDeleteRow = async () => {
  const result = await batchDeleteDictDataApi(checkData.value)
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
  queryParams.dictType = route.params.dictType.toString()
  getData()
  getDictData()
})

defineOptions({
  name: `${mainRouteName}-dictData`
})
</script>
<script lang="ts">
interface IRowData extends DictDataInfo { }
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
