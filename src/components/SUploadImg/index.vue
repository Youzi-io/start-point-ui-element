<template>
  <div class="upload-img">
    <el-upload :class="{ 'upload-img-hide': fileList.length >= props.limit }" v-model:file-list="fileList"
      :action="uploadConfig.action" :method="uploadConfig.method" :accept="uploadConfig.accept"
      :headers="uploadConfig.headers" :limit="uploadConfig.limit" list-type="picture-card" :on-success="handleSuccess"
      :on-error="handleError" :on-preview="handlePreview" :on-remove="handleRemove" :on-change="handeChange">
      <el-icon>
        <MSIcon name="Add" size="50"></MSIcon>
      </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible" title="预览" width="600">
      <img :src="previewImageUrl" style="width: 100%;height: 100%;" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { deleteImgApi } from '@/api/file'
import { ElMessage, type UploadFile, type UploadFiles, type UploadUserFile } from 'element-plus'
import MSIcon from '@/components/MSIcon/index.vue'

const dialogVisible = ref(false)
const userStore = useUserStore()

const fileList = ref<UploadUserFile[]>([])
const previewImageUrl = ref('')

const fileData = defineModel<string | string[]>('fileData')
const props = withDefaults(defineProps<Props>(), {
  limit: 1
})

const uploadConfig = reactive({
  url: import.meta.env.VITE_FILE_PATH_BASE_URL,
  action: import.meta.env.VITE_FILE_PATH_BASE_URL + '/upload/img',
  method: 'post',
  accept: 'image/*',
  headers: {
    token: userStore.token
  },
  limit: props.limit
})

watch(
  () => fileData.value,
  (val) => {
    if (!fileData.value) return
    if (Array.isArray(fileData.value)) {
      fileList.value = []
      fileData.value.forEach((item) => {
        fileList.value.push({
          name: item,
          status: 'success',
          url: uploadConfig.url + '/images/' + item
        })
      })
    } else if (fileData.value) {
      if (fileList.value.length) {
        fileList.value[0].name = fileData.value
        fileList.value[0].url = uploadConfig.url + '/images/' + fileData.value
      } else {
        fileList.value.push({
          name: fileData.value,
          status: 'success',
          url: uploadConfig.url + '/images/' + fileData.value
        })
      }
    }
  }
)

// 图片上传成功
const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response.code === 200) {
    ElMessage({
      message: '上传成功',
      type: 'success',
      plain: true,
    })
    uploadFile.name = response.data
    uploadFile.url = uploadConfig.url + '/images/' + response.data
  } else {
    handleError(response, uploadFile, uploadFiles)
  }
}

// 图片上传失败
const handleError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  ElMessage({
    message: '上传失败',
    type: 'error',
    plain: true,
  })
  uploadFile.status = 'fail'
  fileList.value = fileList.value.filter(item => item.name !== uploadFile.name)
}

// 预览图片
const handlePreview = (uploadFile: UploadFile) => {
  previewImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 删除图片
const handleRemove = async (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  await deleteImgApi(uploadFile.name)
}

// 更新图片列表
const handeChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  let isArray = Array.isArray(fileData.value)
  if (!fileList.value.length) {
    if (isArray) {
      fileData.value = []
    } else {
      fileData.value = ''
    }
    return
  }

  if (isArray) {
    fileData.value = fileList.value.map(item => item.name)
  } else {
    fileData.value = fileList.value[0].name
  }
}
</script>
<script lang="ts">
interface Props {
  limit?: number
}
</script>

<style lang="scss" scoped>
.upload-img {
  &-hide {
    :deep(.el-upload--picture-card) {
      display: none;
    }
  }

  :deep(.el-upload-list__item) {
    .el-icon--close-tip {
      display: none !important;
    }
  }

}
</style>