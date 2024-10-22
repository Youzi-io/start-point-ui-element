<template>
  <div class="dashboard">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-space fill direction="vertical">
          <el-card header="起点后台管理框架">
            <div>
              一款后台管理系统,可以用于所有的Web应用程序,，如网站管理后台，网站会员中心，CMS，CRM，OA等等
            </div>
            <div class="version">
              <span class="version-title">当前版本：</span>
              <span class="version-number">v1.1.0</span>
            </div>
            <template #footer>
              <el-button type="primary" @click="accessGit">
                <template #icon>
                  <MSIcon name="Cloud" size="20"></MSIcon>
                </template>
                访问Github
              </el-button>
            </template>
          </el-card>
          <el-card header="联系信息">
            QQ：1581523609
            <br />
            邮箱：yuzuchan80@163.com
          </el-card>
        </el-space>
      </el-col>
      <el-col :span="12">
        <el-card header="技术选型">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-card shadow="never" header="前端技术">
                Vue
                <br />
                TypeScript
                <br />
                Vite
                <br />
                Pinia
                <br />
                Naive UI
                <br />
                Axios
                <br />
                Sass
                <br />
                Day.js
                <br />
                ...
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never" header="后端技术">
                Spring Boot
                <br />
                MyBatis-Plus
                <br />
                Druid
                <br />
                fastjson2
                <br />
                lombok
                <br />
                ...
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import MSIcon from '@/components/MSIcon/index.vue'

const accessGit = () => {
  window.open('https://github.com/Yuzu-io/start-point-ui', '_blank')
}

defineOptions({
  name: 'dashboard'
})
</script>

<style lang="scss" scoped>
.version {
  margin-top: 10px;

  &-title {
    font-weight: bold;
  }
}
</style>
