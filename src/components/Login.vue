<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="text-center mb-4">登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">用户名</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="formData.username"
            required
          >
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">密码</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="formData.password"
            required
          >
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <div class="text-center mt-3">
          <router-link to="/register">还没有账号？立即注册</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { userApi } from '../api'

export default {
  name: 'Login',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    async handleLogin () {
      try {
        this.loading = true
        const res = await userApi.login(this.formData)
        localStorage.setItem('token', res.token)
        this.$router.push('/posts')
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%);
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
</style>
