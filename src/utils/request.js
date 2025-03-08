import axios from 'axios'
import router from '../router'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000 // 将超时设置为 5000 毫秒
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    console.log(token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status === 'success') {
      return res.data
    } else {
      // 统一错误提示
      alert(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转登录
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          alert('没有权限')
          break
        case 404:
          alert('请求的资源不存在')
          break
        default:
          alert(error.response.data.message || '请求失败')
      }
    } else if (error.code === 'ERR_NETWORK') {
      alert('网络连接失败，请检查后端服务是否启动')
    }
    return Promise.reject(error)
  }
)

export default request
