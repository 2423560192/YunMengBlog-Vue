import axios from 'axios'
import { Message } from 'element-ui'
import { getApiUrl } from './env'

// 添加基础 URL 配置
const baseURL = `${getApiUrl()}/api`

// 创建 axios 实例
const request = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

// 默认图片配置 - 使用本地图片路径
export const defaultImages = {
  avatar: require('@/assets/images/default-avatar.png'),
  cover: require('@/assets/images/default-cover.jpg')
}

// 图片加载错误处理函数
const handleImageError = (event, type) => {
  // 使用本地默认图片
  event.target.src = defaultImages[type]

  // 防止无限循环
  event.target.onerror = null

  // 添加一个标记，表示这是默认图片
  event.target.dataset.isDefault = 'true'
}

// 获取图片 URL 的工具函数
export const getImageUrl = (url, type = 'avatar') => {
  if (!url) {
    // 如果没有图片，返回本地默认图片
    return defaultImages[type]
  }

  // 如果是完整的 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 确保 URL 路径正确，不使用 API 前缀
  return `${baseURL}${url.startsWith('/') ? url : `/${url}`}`
}

// 添加全局图片错误处理
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('error', (e) => {
    if (e.target.tagName.toLowerCase() === 'img') {
      const imgElement = e.target

      // 如果已经是默认图片，则不再处理
      if (imgElement.dataset.isDefault === 'true') {
        return
      }

      const type = imgElement.dataset.type || 'avatar'
      handleImageError(e, type)
    }
  }, true)
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      // 确保 token 格式正确
      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    console.log('请求错误:', error.config.url, error.response?.status, error.response?.data)

    // 处理 401 错误
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 重定向到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // 只对非401错误显示提示
    if (error.response?.status !== 401) {
      Message({
        message: error.response?.data?.detail || error.response?.data?.message || '操作失败',
        type: 'error',
        duration: 2000
      })
    }
    return Promise.reject(error)
  }
)

export default request
