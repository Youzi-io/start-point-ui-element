<template>
  <el-dialog v-model="show" title="添加角色" width="500">
    <el-scrollbar height="58vh">
      <el-form class="form" ref="formRef" :model="formData" :rules="rules" label-position="left" label-width="auto">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="formData.roleKey" placeholder="请输入权限字符" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio v-for="item in statusOptions" :key="item.id" :value="item.dictValue">{{
              item.dictTag
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="orderIndex">
          <el-input-number v-model="formData.orderIndex" :min="0" :max="100" />
        </el-form-item>

        <el-form-item label="权限" prop="routesIdList">
          <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all check-strictly
            :default-checked-keys="formData.routesIdList" :props="defaultProps" @check="updateCheckedKeys" />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="onSubmit(formRef)"> 保存 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getRoutesListApi } from '@/api/system/routes'
import { addRoleApi } from '@/api/system/role'
import type { AddRoleParams } from '@/types/system/role'
import type { RoutesInfo } from '@/types/system/routes'
import type { DictDataInfo } from '@/types/system/dictData'
import { useDictStore } from '@/stores'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const show = ref(false)

const formRef = ref()
const formData = ref<AddRoleParams>({
  roleName: '',
  roleKey: '',
  status: '0',
  orderIndex: 1,
  routesIdList: []
})
const rules = reactive<FormRules<AddRoleParams>>({
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
  orderIndex: [{ type: 'number', required: true, message: '菜单排序不能为空', trigger: 'blur' }]
})

const treeData = ref<RoutesInfo[]>([])
const defaultProps = { children: 'children', label: 'title' }

const statusOptions = ref<DictDataInfo[]>([])
const dictStore = useDictStore()

const getDictData = async () => {
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
  formData.value.status = statusOptions.value ? statusOptions.value[0].dictValue : ''
}

const getData = async () => {
  const queryRoutesParams = {
    all: true
  }
  const result = await getRoutesListApi(queryRoutesParams)
  if (result.code === 200) {
    treeData.value = result.data.list
  }
}

const updateCheckedKeys = (data: RoutesInfo, { checkedKeys }: { checkedKeys: string[] }) => {
  formData.value.routesIdList = checkedKeys
}

const emit = defineEmits(['success'])
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const result = await addRoleApi(formData.value)
      if (result.code === 200) {
        ElMessage({
          message: result.message,
          type: 'success',
          plain: true,
        })
        emit('success')
        show.value = false
      } else {
        ElMessage({
          message: result.message,
          type: 'success',
          plain: true,
        })
      }
    } else {
      ElMessage({
        message: Object.values(fields!)[0][0].message,
        type: 'warning',
        plain: true,
      })
    }
  })
}


const formInit = () => {
  formData.value = {
    roleName: '',
    roleKey: '',
    status: '0',
    orderIndex: 1,
    routesIdList: []
  }
}
const showModal = () => {
  show.value = true
  formInit()
  getData()
  getDictData()
}

defineExpose({
  showModal
})
</script>

<style lang="scss" scoped>
.form {
  width: 400px;
  margin: 0 auto;
}

.hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
