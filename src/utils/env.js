/**
 * 环境变量管理工具
 */

// 获取当前环境
export const getEnv = () => {
  return process.env.NODE_ENV
}

// 判断是否为开发环境
export const isDev = () => {
  return process.env.NODE_ENV === 'development'
}

// 判断是否为生产环境
export const isProd = () => {
  return process.env.NODE_ENV === 'production'
}

// 获取 API URL
export const getApiUrl = () => {
  return process.env.VUE_APP_API_URL || 'http://localhost:8000'
}

// 获取应用模式
export const getAppMode = () => {
  return process.env.VUE_APP_MODE
}

// 获取应用版本
export const getAppVersion = () => {
  return process.env.VUE_APP_VERSION
}

// 获取应用标题
export const getAppTitle = () => {
  return process.env.VUE_APP_TITLE
}

export default {
  getEnv,
  isDev,
  isProd,
  getApiUrl,
  getAppMode,
  getAppVersion,
  getAppTitle
}
