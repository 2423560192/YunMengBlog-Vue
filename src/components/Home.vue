<template>
  <div class="app-container">
    <!-- 滚动公告栏 -->
    <div class="announcement-bar">
      <div class="announcement-content">
        <span>欢迎来到云梦博客!</span>
        <span>最新文章: Vue.js 3.0 深度解析</span>
        <span>加入我们的技术交流群</span>
        <span>欢迎来到云梦博客!</span>
      </div>
    </div>

    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <span class="brand-text">云梦博客</span>
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/' }" to="/">首页</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path.startsWith('/posts') }" to="/posts">文章</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/login' }" to="/login">登录</router-link>
            </li>
          </ul>
        </div>
        <!-- 搜索栏 -->
        <div class="search-container">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              @focus="showSuggestions = true"
              @blur="hideSuggestions"
              placeholder="搜索文章..."
            >
            <div class="search-suggestions" v-if="showSuggestions">
              <div
                v-for="suggestion in searchSuggestions"
                :key="suggestion"
                class="suggestion-item"
                @mousedown="handleSearch(suggestion)"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 欢迎区域 -->
    <div v-if="$route.path === '/'" class="welcome-section text-center mb-5">
      <h1 class="display-4">欢迎来到云梦博客</h1>
      <p class="lead">分享技术，记录生活</p>
    </div>

    <!-- 博主信息卡片和分类块容器 -->
    <div v-if="$route.path === '/'" class="info-category-container">
      <div class="container">
        <div class="row">
          <!-- 博主信息卡片 -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-body text-center">
                <div class="avatar-wrapper">
                  <img src="https://via.placeholder.com/150" alt="博主头像" class="avatar">
                </div>
                <h2 class="blogger-name">云梦</h2>
                <p class="blogger-bio">热爱技术，热爱生活。专注于前端开发和技术分享，致力于让编程更简单有趣。</p>
                <div class="social-links">
                  <a href="#" class="social-link"><i class="fab fa-github"></i></a>
                  <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                  <a href="#" class="social-link"><i class="fab fa-weibo"></i></a>
                </div>
              </div>
            </div>
          </div>

          <!-- 分类块 -->
          <div class="col-md-8">
            <div class="text-center mb-4">
              <h3 class="section-title d-inline-block">博客分类</h3>
            </div>
            <div class="row g-4 justify-content-center">
              <div v-for="category in categories"
                   :key="category.name"
                   class="col-md-4 col-sm-6">
                <div class="category-card"
                     :style="{ backgroundColor: category.color }"
                     @click="handleCategoryClick(category)">
                  <i :class="category.icon"></i>
                  <h4>{{ category.name }}</h4>
                  <p>{{ category.count }} 篇文章</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 天气小部件 -->
    <div class="weather-widget">
      <div class="weather-content">
        <i class="fas fa-sun"></i>
        <div class="weather-info">
          <div class="temperature">25°C</div>
          <div class="location">北京市</div>
        </div>
      </div>
    </div>

    <!-- 数字时钟 -->
    <div  class="digital-clock">
      <div class="time">{{ currentTime }}</div>
      <div class="date">{{ currentDate }}</div>
    </div>

    <!-- 主题切换按钮 -->
    <button class="theme-toggle" @click="toggleTheme">
      <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
    </button>

    <main class="main-content">
      <div class="container py-4">
        <slot></slot>
      </div>
    </main>

    <!-- 社交媒体按钮 -->
    <div class="social-buttons">
      <a href="#" class="social-button" @click.prevent="handleSocial('github')">
        <i class="fab fa-github"></i>
      </a>
      <a href="#" class="social-button" @click.prevent="handleSocial('twitter')">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="#" class="social-button" @click.prevent="handleSocial('weibo')">
        <i class="fab fa-weibo"></i>
      </a>
    </div>

    <footer class="footer">
      <div class="container text-center">
        <p class="mb-0">© 2025 云梦博客. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      currentTime: '',
      currentDate: '',
      categories: [
        {
          name: '技术',
          icon: 'fas fa-code',
          color: '#ff6b6b',
          count: 15
        },
        {
          name: '生活',
          icon: 'fas fa-coffee',
          color: '#4ecdc4',
          count: 8
        },
        {
          name: '随笔',
          icon: 'fas fa-pen-fancy',
          color: '#45b7d1',
          count: 12
        }
      ],
      searchQuery: '',
      showSuggestions: false,
      searchSuggestions: [
        'Vue.js 教程',
        'React 最佳实践',
        '前端工程化',
        'TypeScript 入门'
      ],
      isDarkMode: false
    }
  },
  methods: {
    updateTime () {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      this.currentDate = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    },
    handleCategoryClick (category) {
      this.$router.push(`/category/${category.name}`)
    },
    handleSearch (query) {
      alert(`搜索: ${query}`)
      this.showSuggestions = false
    },
    hideSuggestions () {
      setTimeout(() => {
        this.showSuggestions = false
      }, 200)
    },
    handleSocial (platform) {
      alert(`关注我的 ${platform}!`)
    },
    toggleTheme () {
      this.isDarkMode = !this.isDarkMode
      document.body.classList.toggle('dark-mode')
    }
  },
  mounted () {
    // 加载 Bootstrap
    if (typeof bootstrap === 'undefined') {
      const bootstrapScript = document.createElement('script')
      bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
      document.head.appendChild(bootstrapScript)
    }

    // 启动时钟
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  }
}
</script>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
}

.navbar {
  position: relative;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  padding: 1rem 0;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(45deg, #3273dc, #74ebd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-link {
  color: #4a4a4a;
  font-weight: 500;
  padding: 0.5rem 1rem;
  margin: 0 0.2rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #3273dc;
  background-color: rgba(50, 115, 220, 0.1);
  transform: translateY(-2px);
}

.nav-link.active {
  color: #3273dc;
  background-color: rgba(50, 115, 220, 0.1);
}

.main-content {
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
}

.digital-clock {
  position: fixed;
  top: 100px;
  right: 30px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.digital-clock:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.digital-clock .time {
  font-size: 2rem;
  font-weight: 700;
  color: #3273dc;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.digital-clock .date {
  font-size: 0.9rem;
  color: #666;
}

.footer {
  position: relative;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem 0;
  color: #7a7a7a;
  box-shadow: 0 -2px 15px rgba(0,0,0,0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.main-content {
  animation: fadeIn 0.8s ease-out;
}

.welcome-section {
  position: relative;
  z-index: 2;
  padding: 3rem 0 1rem;
  color: white;
}

.welcome-section .display-4 {
  font-weight: 300;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.welcome-section .lead {
  font-size: 1.2rem;
  opacity: 0.9;
}

.info-category-container {
  position: relative;
  z-index: 2;
  padding: 2rem 0;
}

.col-md-4 .card {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  border: none;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.col-md-4 .card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.avatar-wrapper {
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255,255,255,0.8);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blogger-name {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.blogger-bio {
  color: rgba(255,255,255,0.9);
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.social-link {
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  opacity: 0.8;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  font-weight: 300;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #ff9a9e, #fad0c4);
  border-radius: 3px;
}

.category-card {
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
  height: 100%;
  margin: 0 auto;
  max-width: 300px;
}

.category-card:hover {
  transform: translateY(-5px) rotate(2deg);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.category-card i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.category-card h4 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.category-card p {
  opacity: 0.9;
  margin: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动公告栏 */
.announcement-bar {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
  height: 40px;
}

.announcement-content {
  display: flex;
  animation: scroll 20s linear infinite;
  white-space: nowrap;
}

.announcement-content span {
  padding: 0.5rem 2rem;
  color: white;
}

@keyframes scroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* 搜索栏 */
.search-container {
  position: relative;
  margin: 1rem auto;
  max-width: 600px;
}

.search-box {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.search-box:hover {
  box-shadow: 0 0 15px rgba(50, 115, 220, 0.3);
}

.search-box input {
  border: none;
  background: none;
  padding: 0.5rem;
  width: 100%;
  outline: none;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  z-index: 1000;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(50, 115, 220, 0.1);
}

/* 天气小部件 */
.weather-widget {
  position: fixed;
  right: 30px;
  top: 200px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.weather-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-content i {
  font-size: 2rem;
  color: #ffd700;
}

/* 主题切换按钮 */
.theme-toggle {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 2;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: rotate(180deg);
}

/* 社交媒体按钮 */
.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.social-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.3s ease;
}

.social-button:hover {
  transform: translateY(-5px);
  color: #3273dc;
  box-shadow: 0 5px 15px rgba(50, 115, 220, 0.3);
}

/* 深色模式 */
:root {
  --bg-gradient: linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%);
  --text-color: #2c3e50;
}

.dark-mode {
  --bg-gradient: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  --text-color: #ffffff;
}

.app-container {
  background: var(--bg-gradient);
}
</style>
