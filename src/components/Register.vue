<template>
  <div class="register-container">
    <div class="register-box">
      <h2 class="text-center mb-4">注册</h2>
      <form @submit.prevent="handleRegister">
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
          <label for="email" class="form-label">邮箱</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="formData.email"
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
          {{ loading ? '注册中...' : '注册' }}
        </button>
        <div class="text-center mt-3">
          <router-link to="/login">已有账号？立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { userApi } from '../api'

export default {
  name: 'Register',
  data () {
    return {
      formData: {
        username: '',
        email: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    async handleRegister () {
      try {
        this.loading = true
        await userApi.register(this.formData)
        this.$bvToast.toast('注册成功，请登录', {
          title: '提示',
          variant: 'success',
          solid: true
        })
        this.$router.push('/login')
      } catch (error) {
        console.error('注册失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%);
}

.register-box {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
</style>
