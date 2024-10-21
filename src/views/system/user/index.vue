<template>
  <div class="container">
    <el-form ref="formRef" :model="queryParams" label-position="left" class="search-form">
      <el-space wrap>
        <el-form-item prop="username" label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名"></el-input>
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

    <STable :columns="columns" :tableData="data" @selection-change="handleSelect">
      <template #sex="{ row }">
        <RenderSex :row />
      </template>
      <template #status="{ row }">
        <RenderStatus :row />
      </template>
      <template #avatar="{ row }: { row: IRowData }">
        <el-avatar shape="square" :size="34" :src="avatarPrefixUrl + row.avatar" />
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
    <UserAdd ref="userAddRef" @success="getData"></UserAdd>
    <UserEdit ref="userEditRef" @success="getData"></UserEdit>
    <UserBatchEdit ref="userBatchEditRef" @success="getData"></UserBatchEdit>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'
import { batchDeleteUserApi, deleteUserApi, getUserListApi } from '@/api/system/user'
import STableHeader from '@/components/STableHeader/index.vue'
import STable from '@/components/STable/index.vue';
import UserAdd from './add/index.vue'
import UserEdit from './edit/index.vue'
import UserBatchEdit from './batchEdit/index.vue'
import type { GetUserParams, UserInfo } from '@/types/system/user'
import MSIcon from '@/components/MSIcon/index.vue'
import SPagination from '@/components/SPagination/index.vue'
import { mainRouteName } from '@/permission'
import { useDictStore } from '@/stores'
import type { DictDataInfo } from '@/types/system/dictData'
import { ElMessage, ElTag, type FormInstance } from 'element-plus'
import type { Columns } from '@/types/components/sTable';

const formRef = ref<FormInstance>()
const avatarPrefixUrl = import.meta.env.VITE_FILE_PATH_BASE_URL + '/images/'
// 表格
const columns: Columns[] = [
  {
    type: 'selection',
    width: '50',
    align: 'center'
  },
  {
    label: '用户名',
    prop: 'username',
    minWidth: '160',
    align: 'center',
    showOverflowTooltip: true,
  },
  {
    label: '账号',
    prop: 'account',
    minWidth: '160',
    align: 'center',
    showOverflowTooltip: true,
  },
  {
    label: '性别',
    prop: 'sex',
    slot: 'sex',
    width: '80',
    align: 'center',
  },
  {
    label: '头像',
    prop: 'avatar',
    slot: 'avatar',
    width: '80',
    align: 'center',
  },
  {
    label: '邮箱',
    prop: 'email',
    minWidth: '160',
    align: 'center',
    showOverflowTooltip: true,
  },
  {
    label: '手机号',
    prop: 'phone',
    minWidth: '160',
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
    width: '160'
  }
]

// 分页
const pageSizes = [10, 20, 30, 50]
const total = ref<number>(0)
const queryParams = reactive<GetUserParams>({
  pageNum: 1,
  pageSize: 10,
  orderBy: '',
  username: '',
  status: null
})

const statusOptions = ref<DictDataInfo[]>([])
const sexOptions = ref<DictDataInfo[]>([])

const dictStore = useDictStore()
const getDictData = async () => {
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
  sexOptions.value = await dictStore.getDictData('sys_user_sex')
}

const data = ref<IRowData[]>([])
const getData = async () => {
  const result = await getUserListApi(queryParams)
  if (result.code === 200) {
    data.value = result.data.list
    total.value = result.data.total
  }
}

const resetForm = () => {
  queryParams.username = ''
  queryParams.status = null
  getData()
}

/**
 * 渲染数据过滤
 */
const RenderSex = ({ row }: { row: IRowData }) => {
  const item = sexOptions.value.find((item) => item.dictValue === row.sex)
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

const userEditRef = ref()
const editRow = (item: IRowData) => {
  userEditRef.value.showModal(item.id)
}

const deleteRow = async (item: IRowData) => {
  const result = await deleteUserApi(item.id)
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

const userAddRef = ref()
const addRow = () => {
  userAddRef.value.showModal()
}

const userBatchEditRef = ref()
const batchEditRow = () => {
  userBatchEditRef.value.showModal(checkData.value)
}

const batchDeleteRow = async () => {
  const result = await batchDeleteUserApi(checkData.value)
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
  getDictData()
  getData()
})

defineOptions({
  name: `${mainRouteName}-user`
})
</script>
<script lang="ts">
interface IRowData extends UserInfo { }
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
