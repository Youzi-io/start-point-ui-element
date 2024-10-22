<template>
  <el-dialog v-model="show" title="编辑字典数据" width="500">
    <el-scrollbar height="58vh">
      <el-form ref="formRef" :model="formData" :rules="rules" label-position="left" label-width="auto">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="formData.dictType" disabled placeholder="请输入字典类型" />
        </el-form-item>

        <el-form-item label="字典标签" prop="dictTag">
          <el-input v-model="formData.dictTag" placeholder="请输入字典标签" />
        </el-form-item>

        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="formData.dictValue" placeholder="请输入字典键值" />
        </el-form-item>

        <el-form-item label="字典排序" prop="dictOrder">
          <el-input-number v-model="formData.dictOrder" :min="0" :max="100" />
        </el-form-item>

        <el-form-item label="回显样式" prop="listClass">
          <el-select v-model="formData.listClass" placeholder="请选择回显样式" style="width: 140px">
            <el-option v-for="item in listClassOptions" :key="item.id" :label="item.dictTag" :value="item.dictValue" />
          </el-select>
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
    </el-scrollbar>
    <template #footer>
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="onSubmit(formRef)"> {{ submitText }} </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { DictDataInfo, EditDictDataParams } from '@/types/system/dictData'
import { editDictDataApi, findByIdApi } from '@/api/system/dictData'
import { useDictStore } from '@/stores'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const show = ref(false)
const isMultiple = ref(false)
const currentIndex = ref(0)
const idsList = ref<string[]>([])
const submitText = ref('保存')

watch(
  () => currentIndex.value,
  () => {
    isMultiple.value = idsList.value.length - 1 === currentIndex.value
    submitText.value = isMultiple.value ? '保存' : '保存并编辑下一页'
  }
)

const formRef = ref()
const formData = ref<EditDictDataParams>({
  id: '',
  dictType: '',
  dictTag: '',
  dictValue: '',
  dictOrder: 1,
  listClass: 'primary',
  status: '0',
  remark: ''
})
const rules = reactive<FormRules<EditDictDataParams>>({
  dictTag: [{ required: true, message: '字典标签不能为空', trigger: 'blur' }],
  dictValue: [{ required: true, message: '字典键值不能为空', trigger: 'blur' }]
})

const listClassOptions = ref<DictDataInfo[]>([])
const statusOptions = ref<DictDataInfo[]>([])
const dictStore = useDictStore()

const getDictData = async () => {
  listClassOptions.value = await dictStore.getDictData('sys_style_type')
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
}

const getData = async () => {
  const dictInfo = await findByIdApi(idsList.value[currentIndex.value])
  if (dictInfo.code === 200) {
    formData.value = dictInfo.data
  }
}

const emit = defineEmits(['success'])
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const result = await editDictDataApi(formData.value)
      if (result.code === 200) {
        ElMessage({
          message: result.message,
          type: 'success',
          plain: true,
        })
        emit('success')
        if (isMultiple.value) {
          show.value = false
        } else {
          currentIndex.value++
          getData()
        }
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
    id: '',
    dictType: '',
    dictTag: '',
    dictValue: '',
    dictOrder: 1,
    listClass: 'primary',
    status: '0',
    remark: ''
  }
}
const showModal = (ids: string[]) => {
  show.value = true
  formInit()
  currentIndex.value = 0
  idsList.value = ids
  isMultiple.value = idsList.value.length - 1 === currentIndex.value
  submitText.value = isMultiple.value ? '保存' : '保存并编辑下一页'
  getData()
  getDictData()
}

defineExpose({
  showModal
})
</script>

<style lang="scss" scoped></style>
