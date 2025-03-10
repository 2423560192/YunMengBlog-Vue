import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import { messages } from './i18n'
import { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/message-box.css'

// 配置 axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:8000'
Vue.prototype.$axios = axios

// 添加请求拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

// 处理路由重复导航的问题
const originalPush = router.push
router.push = function push (location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err
    }
  })
}

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'zh',
  messages
})

Vue.config.productionTip = false

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
