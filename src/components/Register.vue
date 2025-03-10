<template>
  <Home>
    <div class="auth-container">
      <div class="auth-box">
        <h2 class="auth-title">注册</h2>
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
            <label for="email">邮箱</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              placeholder="请输入邮箱"
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
          <div class="form-group">
            <label for="confirm_password">确认密码</label>
            <input
              type="password"
              id="confirm_password"
              v-model="form.confirmPassword"
              required
              placeholder="请再次输入密码"
            >
          </div>
          <div class="form-error" v-if="error">{{ error }}</div>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
        <div class="auth-footer">
          已有账号？
          <router-link to="/login">立即登录</router-link>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'
import { userApi } from '../api'

export default {
  name: 'Register',
  components: {
    Home
  },
  data () {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    validateForm () {
      if (this.form.password !== this.form.confirmPassword) {
        this.error = '两次输入的密码不一致'
        return false
      }
      if (this.form.password.length < 6) {
        this.error = '密码长度不能少于6位'
        return false
      }
      return true
    },
    async handleSubmit () {
      if (this.loading) return
      this.error = ''

      if (!this.validateForm()) return

      this.loading = true
      try {
        const { confirmPassword, ...registerData } = this.form
        await userApi.register(registerData)

        // 注册成功后自动登录
        const loginResponse = await userApi.login({
          username: this.form.username,
          password: this.form.password
        })

        // 保存用户信息和 token
        localStorage.setItem('token', loginResponse.token)
        localStorage.setItem('user', JSON.stringify({
          id: loginResponse.id,
          username: loginResponse.username
        }))

        // 跳转到首页
        this.$router.push('/')
      } catch (error) {
        this.error = error.response?.data?.error || '注册失败，请稍后重试'
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
