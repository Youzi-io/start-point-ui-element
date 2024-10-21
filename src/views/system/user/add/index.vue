<template>
  <el-dialog v-model="show" title="添加用户" width="500">
    <el-form ref="formRef" :model="formData" :rules="rules" label-position="left" label-width="auto">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
        <span class="hint">用户名为空则默认为账号</span>
      </el-form-item>

      <el-form-item label="账号" prop="account">
        <el-input v-model="formData.account" placeholder="请输入账号" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码" />
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio v-for="item in sexOptions" :key="item.id" :value="item.dictValue">{{
            item.dictTag
          }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="头像" prop="avatar">
        <SUploadImg v-model:file-data="formData.avatar" />
      </el-form-item>

      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="formData.age" :min="1" :max="200" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="角色组" prop="roleIdList">
        <el-select v-model="formData.roleIdList" multiple placeholder="请选择角色组">
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.roleName" :value="item.id" />
        </el-select>
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
    </el-form>
    <template #footer>
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="onSubmit(formRef)"> 保存 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { AddUserParams } from '@/types/system/user'
import { addUserApi } from '@/api/system/user'
import { getRoleListApi } from '@/api/system/role'
import SUploadImg from '@/components/SUploadImg/index.vue'
import type { RoleInfo } from '@/types/system/role'
import { md5 } from 'js-md5'
import type { DictDataInfo } from '@/types/system/dictData'
import { useDictStore } from '@/stores'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const show = ref(false)

const formRef = ref()
const formData = ref<AddUserParams>({
  username: '',
  account: '',
  password: '',
  sex: '0',
  avatar: '',
  age: undefined,
  email: undefined,
  phone: undefined,
  status: '0',
  orderIndex: 1,
  roleIdList: []
})
const rules = reactive<FormRules<AddUserParams>>({
  account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  orderIndex: [{ type: 'number', required: true, message: '排序不能为空', trigger: 'blur' }],
  roleIdList: [{ type: 'array', required: true, message: '角色组不能为空', trigger: 'blur' }]
})

const roleOptions = ref<RoleInfo[]>([])
const statusOptions = ref<DictDataInfo[]>([])
const sexOptions = ref<DictDataInfo[]>([])
const dictStore = useDictStore()

const getDictData = async () => {
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
  sexOptions.value = await dictStore.getDictData('sys_user_sex')
  formData.value.sex = sexOptions.value ? sexOptions.value[0].dictValue : ''
  formData.value.status = statusOptions.value ? statusOptions.value[0].dictValue : ''
}

const getData = async () => {
  const roleParams = {
    all: true
  }
  const roleResult = await getRoleListApi(roleParams)
  if (roleResult.code === 200) {
    roleOptions.value = roleResult.data.list
  }
}

const emit = defineEmits(['success'])
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let params = {
        ...formData.value,
        password: md5(formData.value.password).toLocaleUpperCase()
      }
      const result = await addUserApi(params)
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
    username: '',
    account: '',
    password: '',
    sex: '0',
    avatar: '',
    age: undefined,
    email: undefined,
    phone: undefined,
    status: '0',
    orderIndex: 1,
    roleIdList: []
  }
}

const showModal = async () => {
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
.hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
