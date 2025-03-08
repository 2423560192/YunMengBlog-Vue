import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

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

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
