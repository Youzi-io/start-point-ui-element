<template>
  <el-dialog v-model="show" title="添加字典" width="500">
    <el-form ref="formRef" :model="formData" :rules="rules" label-position="left" label-width="auto">
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
      </el-form-item>

      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="formData.dictType" placeholder="请输入字典类型" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="item in statusOptions" :key="item.id" :value="item.dictValue">{{
            item.dictTag
          }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
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
import type { AddDictParams } from '@/types/system/dict'
import { addDictApi } from '@/api/system/dict'
import { useDictStore } from '@/stores'
import type { DictDataInfo } from '@/types/system/dictData'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const show = ref(false)

const formRef = ref()
const formData = ref<AddDictParams>({
  dictName: '',
  dictType: '',
  status: '',
  remark: ''
})
const rules = reactive<FormRules<AddDictParams>>({
  dictName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  dictType: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }]
})

const statusOptions = ref<DictDataInfo[]>([])
const dictStore = useDictStore()

const getDictData = async () => {
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
  formData.value.status = statusOptions.value ? statusOptions.value[0].dictValue : ''
}

const emit = defineEmits(['success'])
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const result = await addDictApi(formData.value)
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
    dictName: '',
    dictType: '',
    status: '',
    remark: ''
  }
}

const showModal = () => {
  show.value = true
  formInit()
  getDictData()
}

defineExpose({
  showModal
})
</script>

<style lang="scss" scoped></style>
