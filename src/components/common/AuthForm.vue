<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="auth-title">{{ title }}</h2>
      <form @submit.prevent="$emit('submit')" class="auth-form">
        <slot></slot>
        <div class="form-error" v-if="error">{{ error }}</div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? loadingText : submitText }}
        </button>
      </form>
      <div class="auth-footer">
        {{ footerText }}
        <router-link :to="footerLink">{{ footerLinkText }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthForm',
  props: {
    title: String,
    error: String,
    loading: Boolean,
    submitText: String,
    loadingText: String,
    footerText: String,
    footerLink: String,
    footerLinkText: String
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

  .auth-footer {
    color: #a0aec0;
  }

  .auth-footer a {
    color: #4299e1;
  }
}
</style>
