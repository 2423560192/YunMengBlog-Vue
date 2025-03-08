<template>
  <Home>
    <div class="login-container">
      <div class="login-box">
        <h2 class="login-title">欢迎登录</h2>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="username"
              required
              placeholder="请输入用户名"
            >
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              required
              placeholder="请输入密码"
            >
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'

export default {
  name: 'LoginForm',
  components: {
    Home
  },
  data () {
    return {
      username: '',
      password: '',
      error: null,
      loading: false
    }
  },
  methods: {
    async handleSubmit () {
      this.loading = true
      this.error = null

      try {
        const response = await this.$axios.post('/api/login/', {
          username: this.username,
          password: this.password
        })

        if (response.data.status === 'success') {
          localStorage.setItem('access_token', response.data.data.token)
          localStorage.setItem('refresh_token', response.data.data.refresh_token)
          this.$router.push('/posts')
        } else {
          this.error = response.data.message
        }
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败，请稍后重试'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 300px);
}

.login-box {
  background: #fff;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: 300;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a4a4a;
  font-weight: 500;
}

.form-control {
  border: 2px solid #eee;
  border-radius: 4px;
  padding: 0.8rem;
  width: 100%;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #3273dc;
  box-shadow: none;
}

.btn-primary {
  background-color: #3273dc;
  border: none;
  padding: 0.8rem;
  font-weight: 500;
  margin-top: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2366d1;
}

.btn-primary:disabled {
  background-color: #3273dc;
  opacity: 0.7;
}
</style>
