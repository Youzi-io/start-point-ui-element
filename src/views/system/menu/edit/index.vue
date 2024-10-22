<template>
  <el-dialog v-model="show" title="编辑菜单" width="500">
    <el-scrollbar height="58vh">
      <el-form ref="formRef" :model="formData" :rules="rules" label-position="left" label-width="auto">
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select v-model="formData.parentId" :data="treeData" node-key="id" :props="defaultProps"
            check-strictly :render-after-expand="false" />
          <span class="hint">没有上级菜单则为空</span>
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio v-for="item in routesTypeOptions" :key="item.id" :value="item.dictValue">{{
              item.dictTag
              }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="页面标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入页面标题" />
        </el-form-item>

        <el-form-item label="路由名称" prop="routesName">
          <el-input v-model="formData.routesName" placeholder="请输入路由名称" />
        </el-form-item>

        <el-form-item ref="icon" label="图标" prop="icon" v-show="formData.type !== MenuTypeEnum.Button">
          <el-input v-model:value="formData.icon" placeholder="请输入图标，仅支持material图标" style="width: 90%">
            <template #append>
              <el-button type="primary" style="width: 10%" @click="searchIcon">
                <template #icon>
                  <MSIcon name="Search" size="20"></MSIcon>
                </template>
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="路由地址" prop="fullPath">
          <el-input v-model="formData.fullPath" placeholder="需要填写完整路径，如：/system/sysRoutes/list" />
          <span class="hint">将注册为web端路由地址，同时作为server端API验权使用</span>
        </el-form-item>

        <el-form-item label="组件路径" prop="componentPath" v-show="formData.type === MenuTypeEnum.Menu">
          <el-input v-model="formData.componentPath" placeholder="请输入组件路径" />
          <span class="hint">web端组件路径，例如:/views/dashboard/index.vue</span>
        </el-form-item>

        <el-form-item label="显示状态" prop="showStatus" v-show="formData.type !== MenuTypeEnum.Button">
          <el-radio-group v-model="formData.showStatus">
            <el-radio value="0">显示</el-radio>
            <el-radio value="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否为外链" prop="isExternalLink" v-show="formData.type !== MenuTypeEnum.Button">
          <el-radio-group v-model="formData.isExternalLink">
            <el-radio value="0">是</el-radio>
            <el-radio value="1">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否缓存" prop="keepAlive" v-show="formData.type === MenuTypeEnum.Menu">
          <el-radio-group v-model="formData.keepAlive">
            <el-radio v-for="item in keepAliveOptions" :key="item.id" :value="item.dictValue">{{
              item.dictTag
              }}</el-radio>
          </el-radio-group>
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
    </el-scrollbar>
    <template #footer>
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="onSubmit(formRef)"> 保存 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { EditRoutesParams, RoutesInfoRes } from '@/types/system/routes'
import { reactive, ref } from 'vue'
import { getParentRoutesListApi, findByIdApi, editRoutesApi } from '@/api/system/routes'
import { recursiveTree } from '@/utils/recursiveTree'
import MSIcon from '@/components/MSIcon/index.vue'
import { MenuTypeEnum } from '@/constants/routesEnum'
import type { DictDataInfo } from '@/types/system/dictData'
import { useDictStore } from '@/stores'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const show = ref(false)

const formRef = ref()
const formData = ref<EditRoutesParams>({
  id: '',
  title: '',
  routesName: '',
  icon: '',
  fullPath: '',
  componentPath: '',
  parentId: '',
  showStatus: '0',
  isExternalLink: '1',
  keepAlive: '0',
  status: '0',
  type: '0',
  orderIndex: 1
})
const validateParentIdSame = (rule: any, value: string, callback: any) => {
  if (!value) return true
  if (value !== formData.value.id) {
    callback()
  }
  callback(new Error('上级菜单不能是菜单本身'))
}
const rules = reactive<FormRules<EditRoutesParams>>({
  title: [{ required: true, message: '页面标题不能为空', trigger: 'blur' }],
  fullPath: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  parentId: [
    { validator: validateParentIdSame, trigger: 'change' }
  ],
  orderIndex: [{ type: 'number', required: true, message: '菜单排序不能为空', trigger: 'blur' }]
})

const defaultProps = { children: 'children', label: 'title' }
const treeData = ref<RoutesInfoRes[]>([])

const statusOptions = ref<DictDataInfo[]>([])
const routesTypeOptions = ref<DictDataInfo[]>([])
const keepAliveOptions = ref<DictDataInfo[]>([])
const dictStore = useDictStore()

const getDictData = async () => {
  statusOptions.value = await dictStore.getDictData('sys_normal_disable')
  routesTypeOptions.value = await dictStore.getDictData('sys_routes_type')
  keepAliveOptions.value = await dictStore.getDictData('sys_routes_keep_alive')
}

const getData = async () => {
  const result = await getParentRoutesListApi()
  if (result.code === 200) {
    treeData.value = recursiveTree<RoutesInfoRes>(result.data, '')
  }
  const routesInfo = await findByIdApi(formData.value.id)
  if (routesInfo.code === 200) {
    formData.value = routesInfo.data
  }
}

const iconUrl =
  'https://fonts.google.com/icons?icon.set=Material+Symbols&selected=Material+Symbols+Outlined:search:FILL@0;wght@400;GRAD@0;opsz@20&icon.query=Search'
const searchIcon = () => {
  window.open(iconUrl, '_blank')
}

const emit = defineEmits(['success'])
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const result = await editRoutesApi(formData.value)
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
    id: '',
    title: '',
    routesName: '',
    icon: '',
    fullPath: '',
    componentPath: '',
    parentId: '',
    showStatus: '0',
    isExternalLink: '1',
    keepAlive: '0',
    status: '0',
    type: '0',
    orderIndex: 1
  }
}
const showModal = (id: string) => {
  show.value = true
  formInit()
  formData.value.id = id
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
