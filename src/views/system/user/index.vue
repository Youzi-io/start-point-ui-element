<template>
  <div class="container">
    <el-form ref="formRef" :model="queryParams" label-position="left" class="search-form">
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
    </el-form>

    <TableHeader :isNoSelection="!checkData.length" @refresh-click="refresh" @add-click="addRow"
      @edit-click="batchEditRow" @delete-click="batchDeleteRow"></TableHeader>

    <!-- <n-spin :show="show" :delay="delay">
      <n-data-table :columns="columns" :data="data" :row-key="rowKey" :pagination="false" :scroll-x="scrollX" bordered
        :single-line="false" :checked-row-keys="checkData" @update:checked-row-keys="handleCheck">
      </n-data-table>
    </n-spin> -->
    <!-- <Pagination v-model:page="queryParams.pageNum" v-model:pageSize="queryParams.pageSize" :pageSizes="pageSizes"
      :total="total" @update-page="getData" @update-page-size="getData"></Pagination> -->
    <!-- <UserAdd ref="userAddRef" @success="getData"></UserAdd> -->
    <!-- <UserEdit ref="userEditRef" @success="getData"></UserEdit> -->
    <!-- <UserBatchEdit ref="userBatchEditRef" @success="getData"></UserBatchEdit> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { batchDeleteUserApi, deleteUserApi, getUserListApi } from '@/api/system/user'
import TableHeader from '@/components/TableHeader/index.vue'
import UserAdd from './add/index.vue'
import UserEdit from './edit/index.vue'
import UserBatchEdit from './batchEdit/index.vue'
import type { GetUserParams, UserInfo } from '@/types/system/user'
import MSIcon from '@/components/MSIcon/index.vue'
// import Pagination from '@/components/Pagination/index.vue'
import { mainRouteName } from '@/permission'
import { useDictStore } from '@/stores'
import type { DictDataInfo } from '@/types/system/dictData'
import { ElMessage, type FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const show = ref<boolean>(false)
const delay = 500
const avatarPrefixUrl = import.meta.env.VITE_FILE_PATH_BASE_URL + '/images/'
const rowKey = (row: IRowData) => row.id
// 表格
const columns = [
  {
    type: 'selection',
    width: 50
  },
  {
    title: '用户名',
    key: 'username',
    width: 160,
    align: 'center',
    ellipsis: true
  },
  {
    title: '账号',
    key: 'account',
    width: 160,
    align: 'center',
    ellipsis: true
  },
  {
    title: '性别',
    key: 'sex',
    width: 160,
    align: 'center',
    render: (row: IRowData) => {
      const item = sexOptions.value.find((item) => item.dictValue == row.sex)

    }
  },
  {
    title: '头像',
    key: 'avatar',
    width: 100,
    align: 'center',
    render: (row: IRowData) => {
    }
  },
  {
    title: '邮箱',
    key: 'email',
    width: 160,
    align: 'center',
    ellipsis: true
  },
  {
    title: '手机号',
    key: 'phone',
    width: 160,
    align: 'center',
    ellipsis: true
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    align: 'center',
    render: (row: IRowData) => {
      const item = statusOptions.value.find((item) => item.dictValue == row.status)

    }
  },
  {
    title: '排序',
    key: 'orderIndex',
    width: 100,
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
    align: 'center'
  },
  {
    title: '操作',
    key: 'operation',
    align: 'center',
    fixed: 'right',
    width: 160,
    render(row: IRowData) {

    }
  }
]
// 计算宽度
const scrollX = columns.reduce((pre, cur) => {
  if (cur.width) {
    return pre + (cur.width as number)
  }
  return pre
}, 0)

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

onMounted(async () => {
  getData()
  getDictData()
})
const data = ref<UserInfo[]>([])
const checkData = ref<string[]>([])
const handleCheck = (rowKeys: string[]) => {
  console.log(rowKeys)

  checkData.value = rowKeys
}
const getData = async () => {
  show.value = true
  const result = await getUserListApi(queryParams)
  if (result.code === 200) {
    data.value = result.data.list
    total.value = result.data.total
  }
  show.value = false
}
const resetForm = () => {
  queryParams.username = ''
  queryParams.status = null
  getData()
}

const refresh = () => {
  getData()
}

const userAddRef = ref()
const addRow = () => {
  userAddRef.value.showModal()
}

const userEditRef = ref()
const editRow = (item: IRowData) => {
  userEditRef.value.showModal(item.id)
}

const userBatchEditRef = ref()
const batchEditRow = () => {
  userBatchEditRef.value.showModal(checkData.value)
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
    // 判断当前页数据是否已经为空，如果为空则跳转到上一页
    if (queryParams.pageNum && queryParams.pageSize) {
      let totalPage = Math.ceil((total.value - 1) / queryParams.pageSize)
      let currentPage = queryParams.pageNum > totalPage ? totalPage : queryParams.pageNum
      queryParams.pageNum = currentPage < 1 ? 1 : currentPage
    }
    getData()
  }
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
    // 判断当前页数据是否已经为空，如果为空则跳转到上一页
    if (queryParams.pageNum && queryParams.pageSize) {
      let totalPage = Math.ceil((total.value - 1) / queryParams.pageSize)
      let currentPage = queryParams.pageNum > totalPage ? totalPage : queryParams.pageNum
      queryParams.pageNum = currentPage < 1 ? 1 : currentPage
    }
    getData()
  }
}

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
