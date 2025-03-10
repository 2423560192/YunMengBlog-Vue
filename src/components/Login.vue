<template>
  <Home>
    <div class="auth-container">
      <div class="auth-box">
        <h2 class="auth-title">登录</h2>
        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              type="text"
              id="username"
              v-model="form.username"
              required
              placeholder="请输入用户名"
            >
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              required
              placeholder="请输入密码"
            >
          </div>
          <div class="form-error" v-if="error">{{ error }}</div>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        <div class="auth-footer">
          还没有账号？
          <router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'
import { userApi } from '../api'

export default {
  name: 'Login',
  components: {
    Home
  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleSubmit () {
      if (this.loading) return
      this.error = ''
      this.loading = true

      try {
        const response = await userApi.login(this.form)
        const { token, user } = response.data
        // 保存用户信息和 token
        localStorage.setItem('token', `Bearer ${token}`)
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar
        }))

        // 跳转到首页
        this.$router.push('/')
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
.auth-container {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52,152,219,0.1);
}

.form-error {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-submit {
  width: 100%;
  padding: 0.8rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #7f8c8d;
}

.auth-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .auth-container {
    background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
  }

  .auth-box {
    background: #2d3748;
  }

  .auth-title {
    color: #e2e8f0;
  }

  .form-group label {
    color: #e2e8f0;
  }

  .form-group input {
    background: #1a202c;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .form-group input:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66,153,225,0.1);
  }

  .auth-footer {
    color: #a0aec0;
  }

  .auth-footer a {
    color: #4299e1;
  }
}
</style>
