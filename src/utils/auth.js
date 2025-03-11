// 用户认证相关工具函数
export const auth = {
  // 获取 token
  getToken () {
    return localStorage.getItem('token')
  },

  // 设置 token
  setToken (token) {
    localStorage.setItem('token', token.startsWith('Bearer ') ? token : `Bearer ${token}`)
  },

  // 移除 token
  removeToken () {
    localStorage.removeItem('token')
  },

  // 获取用户信息
  getUser () {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch (e) {
      return {}
    }
  },

  // 设置用户信息
  setUser (user) {
    localStorage.setItem('user', JSON.stringify(user))
  },

  // 移除用户信息
  removeUser () {
    localStorage.removeItem('user')
  },

  // 检查是否已登录
  isLoggedIn () {
    return !!this.getToken()
  },

  // 获取用户 ID
  getUserId () {
    return this.getUser().id
  },

  // 登出
  logout () {
    this.removeToken()
    this.removeUser()
  }
}
