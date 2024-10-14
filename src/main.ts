import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'

/**
 * 样式
 */
import './styles/global.scss' // 全局样式
import './styles/reset.css' // 初始化
import 'nprogress/nprogress.css' // 进度条

/**
 * 核心
 */
import './permission'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
