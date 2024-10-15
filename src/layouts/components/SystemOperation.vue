<template>
  <div class="system-operation">
    <el-dropdown trigger="click">
      <div class="system-operation__item lang">
        <MSIcon name="Translate" size="18"></MSIcon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in langList" :key="item.value" @click="switchLanguage(item)">{{ item.content
            }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div class="system-operation__item lang" @click="handleFullscreen">
      <MSIcon name="Fullscreen" size="18" v-show="!fullScreen"></MSIcon>
      <MSIcon name="Fullscreen_Exit" size="18" v-show="fullScreen"></MSIcon>
    </div>

    <el-popover trigger="click" placement="bottom-end">
      <template #reference>
        <div class="system-operation__item user">
          <el-avatar :src="avatar"></el-avatar>
          <span class="username">{{ username }}</span>
        </div>
      </template>
      <div class="user-popover">
        <el-avatar :size="50" :src="avatar"></el-avatar>
        <div class="username">{{ username }}</div>
        <div class="time">{{ time }}</div>
        <el-button type="danger" plain @click="logout"> 退出登录 </el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { langList, useLocale } from '@/locales/useLocale'
import { useLoadingStore, useUserStore } from '@/stores'
import type { LangList } from '@/types/lang'
import MSIcon from '@/components/MSIcon/index.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

const loadingStore = useLoadingStore()
const userStore = useUserStore()
const username = userStore.userInfo.username // 用户名
const avatar = import.meta.env.VITE_FILE_PATH_BASE_URL + '/images/' + userStore.userInfo.avatar // 头像
const fullScreen = ref<boolean>(false)
const time = ref<string>('')
const timeInterval = ref<number>(0)

const { cutoverLang } = useLocale()
const switchLanguage = (option: LangList) => {
  loadingStore.isFullscreenLoading(true)
  setTimeout(() => {
    cutoverLang(option.value)
  }, 500)
  setTimeout(() => {
    loadingStore.isFullscreenLoading(false)
  }, 1000)
}

const handleFullscreen = () => {
  if (!document.fullscreenElement) {
    // 进入全屏
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => (fullScreen.value = true))
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => (fullScreen.value = false))
    }
  }
}

// 处理时间
const handleTime = () => {
  const date = dayjs(new Date().getTime())
  time.value = date.format('YYYY-MM-DD HH:mm:ss')
}

// 退出登录
const logout = async () => {
  await userStore.logout()
  ElMessage({
    message: '已登出',
    type: 'success',
    plain: true,
  })
}

onMounted(() => {
  handleTime()
  timeInterval.value = setInterval(() => {
    handleTime()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval.value)
})
</script>

<style lang="scss" scoped>
.system-operation {
  @include flexInit($ais: center);
  @include divInitialization();
  position: relative;
  z-index: 1;
  background-color: #fff;
  user-select: none;

  &__item {
    padding: 0 20px;
    height: 45px;
    cursor: pointer;
    @include flexInit($ais: center);

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .user {
    box-sizing: border-box;
    padding: 0 15px;

    .el-avatar {
      margin: 0 5px;
      width: 25px;
      height: 25px;
    }

    .username {
      max-width: 50px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

.user-popover {
  text-align: center;
  padding: 0 20px;

  .time {
    margin-bottom: 15px;
  }

  .username {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
  }
}
</style>
