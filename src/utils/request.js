import axios from 'axios'
import { Message } from 'element-ui'
import { getApiUrl } from './env'

// 添加基础 URL 配置
const baseURL = getApiUrl()
const apiPrefix = '/api'

// 创建 axios 实例
const request = axios.create({
  baseURL: `${baseURL}${apiPrefix}`,
  timeout: 5000
})

// 默认图片配置
export const defaultImages = {
  avatar: '/static/assets/images/default-avatar.png',
  cover: '/static/assets/images/default-cover.jpg'
}

// 图片加载错误处理函数
const handleImageError = (event, type) => {
  event.target.src = `${baseURL}${defaultImages[type]}`
}

// 获取图片 URL 的工具函数
export const getImageUrl = (url, type = 'avatar') => {
  if (!url) {
    return `${baseURL}${defaultImages[type]}`
  }

  // 如果是完整的 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 确保 URL 路径正确
  return `${baseURL}${url.startsWith('/') ? url : `/${url}`}`
}

// 添加全局图片错误处理
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('error', (e) => {
    if (e.target.tagName.toLowerCase() === 'img') {
      const imgElement = e.target
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
