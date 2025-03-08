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
        <!-- 更新提示 -->
        <div class="update-hint" v-if="showUpdateHint">
          <i class="fas fa-sync-alt"></i>
          <span>{{ newArticlesCount }} 篇新文章</span>
          <button class="btn-refresh" @click="refreshContent">
            <i class="fas fa-redo"></i> 刷新
          </button>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- 用户状态 -->
            <li class="nav-item" v-if="isLoggedIn">
              <div class="user-status">
                <img :src="bloggerInfo.avatar" :alt="bloggerInfo.name" class="user-avatar">
                <span class="user-name">{{ bloggerInfo.name }}</span>
                <button class="btn-logout" @click="handleLogout">
                  <i class="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/' }" to="/">首页</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path.startsWith('/posts') }" to="/posts">文章</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/messages' }" to="/messages">留言板</router-link>
            </li>
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="nav-link" :class="{ active: $route.path === '/login' }" to="/login">登录</router-link>
            </li>
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="nav-link" :class="{ active: $route.path === '/register' }" to="/register">注册</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle"
                 href="#"
                 id="langDropdown"
                 role="button"
                 data-bs-toggle="dropdown"
                 aria-expanded="false"
              >
                {{ currentLang === 'zh' ? '中文' : 'English' }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="langDropdown">
                <li v-for="lang in languages" :key="lang.code">
                  <a class="dropdown-item"
                     href="#"
                     @click.prevent="switchLanguage(lang.code)"
                     :class="{ active: currentLang === lang.code }"
                  >
                    {{ lang.name }}
                  </a>
                </li>
              </ul>
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
                  <img :src="bloggerInfo.avatar" :alt="bloggerInfo.name" class="avatar">
                </div>
                <h2 class="blogger-name">{{ bloggerInfo.name }}</h2>
                <p class="blogger-bio">{{ bloggerInfo.bio }}</p>
                <div class="social-links">
                  <a :href="bloggerInfo.social.github" target="_blank" class="social-link">
                    <i class="fab fa-github"></i>
                  </a>
                  <a :href="bloggerInfo.social.twitter" target="_blank" class="social-link">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a :href="bloggerInfo.social.weibo" target="_blank" class="social-link">
                    <i class="fab fa-weibo"></i>
                  </a>
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

    <!-- 推荐文章区域 -->
    <div v-if="$route.path === '/'" class="recommended-section">
      <div class="container">
        <h3 class="section-title mb-4">推荐阅读</h3>
        <div class="row g-4">
          <div v-for="article in recommendedArticles"
               :key="article.id"
               class="col-md-6 col-lg-3">
            <div class="article-card">
              <img :src="article.thumbnail"
                   :alt="article.title"
                   class="article-thumbnail"
                   loading="lazy">
              <div class="article-content">
                <h4 class="article-title">{{ article.title }}</h4>
                <p class="article-date">{{ article.date }}</p>
                <div class="article-actions">
                  <button class="btn-action" @click="handleLike(article)">
                    <i class="fas fa-heart"></i> {{ article.likes }}
                  </button>
                  <button class="btn-action" @click="handleCollect(article)">
                    <i class="fas fa-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <button class="btn-load-more" @click="loadMoreArticles">
            加载更多 <i class="fas fa-chevron-down"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 最近评论区域 -->
    <div v-if="$route.path === '/'" class="recent-comments">
      <div class="container">
        <h3 class="section-title mb-4">最新评论</h3>
        <div class="row g-4">
          <div v-for="comment in recentComments"
               :key="comment.id"
               class="col-md-4">
            <div class="comment-card">
              <div class="comment-header">
                <img :src="comment.avatar" :alt="comment.username" class="comment-avatar">
                <div class="comment-info">
                  <h5>{{ comment.username }}</h5>
                  <small>{{ comment.date }}</small>
                </div>
              </div>
              <p class="comment-text">{{ comment.comment }}</p>
              <button class="btn-view" @click="viewComment(comment)">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订阅表单 -->
    <div class="subscription-form">
      <div class="container">
        <div class="form-wrapper">
          <h4>订阅我的博客</h4>
          <p>获取最新文章和动态</p>
          <div class="input-group">
            <input type="email"
                   v-model="subscribeEmail"
                   placeholder="请输入您的邮箱"
                   class="form-control">
            <button class="btn-subscribe" @click="handleSubscribe">
              订阅 <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 动态通知模态框 -->
    <div class="notification-modal" v-if="showNotification">
      <div class="notification-content">
        <i class="fas fa-bell"></i>
        <p>新文章已发布！</p>
        <button class="btn-close" @click="closeNotification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- 加载动画 -->
    <div class="loading-overlay" v-if="loading">
      <div class="spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { likeApi, collectApi } from '../api'
import request from '@/utils/request'

export default {
  name: 'Home',
  data () {
    return {
      currentTime: '',
      currentDate: '',
      timeInterval: null,
      bloggerInfo: {
        name: '云梦',
        avatar: require('@/assets/images/default-avatar.png'),
        bio: '热爱技术，热爱生活。专注于前端开发和技术分享，致力于让编程更简单有趣。',
        social: {
          github: 'https://github.com/yunmeng',
          twitter: 'https://twitter.com/yunmeng',
          weibo: 'https://weibo.com/yunmeng'
        }
      },
      categories: [
        {
          name: '前端开发',
          icon: 'fas fa-code',
          color: '#3498db',
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
      searchSuggestions: [],
      isDarkMode: false,
      recommendedArticles: [],
      recentComments: [],
      subscribeEmail: '',
      showUpdateHint: false,
      newArticlesCount: 0,
      showNotification: false,
      notificationTimer: null,
      currentLang: 'zh',
      languages: [
        { code: 'zh', name: '中文' },
        { code: 'en', name: 'English' }
      ],
      loading: false
    }
  },
  computed: {
    isLoggedIn () {
      return !!localStorage.getItem('token')
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
    },
    async handleLike (article) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      try {
        await likeApi.like(article.id)
        this.$bvToast.toast('点赞成功!', {
          title: '提示',
          variant: 'success',
          solid: true
        })
        article.likes++
      } catch (error) {
        console.error('点赞失败:', error)
      }
    },
    async handleCollect (article) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      try {
        await collectApi.collect(article.id)
        this.$bvToast.toast('收藏成功!', {
          title: '提示',
          variant: 'success',
          solid: true
        })
      } catch (error) {
        console.error('收藏失败:', error)
      }
    },
    loadMoreArticles () {
      this.$bvToast.toast('加载更多文章...', {
        title: '提示',
        variant: 'info',
        solid: true
      })
    },
    viewComment (comment) {
      this.$router.push('/posts/1')
    },
    async handleSubscribe () {
      if (!this.subscribeEmail) {
        this.$bvToast.toast('请输入邮箱地址', {
          title: '提示',
          variant: 'warning',
          solid: true
        })
        return
      }

      try {
        // 这里假设后端有订阅接口
        await request.post('/api/subscribe', { email: this.subscribeEmail })
        this.$bvToast.toast('订阅成功！', {
          title: '提示',
          variant: 'success',
          solid: true
        })
        this.subscribeEmail = ''
      } catch (error) {
        console.error('订阅失败:', error)
        this.$bvToast.toast('订阅失败，请稍后重试', {
          title: '错误',
          variant: 'danger',
          solid: true
        })
      }
    },
    handleLogout () {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    refreshContent () {
      this.showUpdateHint = false
      this.newArticlesCount = 0
      // 触发内容刷新
      this.$emit('refresh')
    },
    closeNotification () {
      this.showNotification = false
    },
    startNotificationTimer () {
      this.notificationTimer = setInterval(() => {
        this.showNotification = true
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
      }, 30000)
    },
    switchLanguage (lang) {
      this.currentLang = lang
      // 这里可以使用 vue-i18n 进行语言切换
      this.$i18n.locale = lang
    },
    async fetchRecommendedArticles () {
      this.loading = true
      try {
        const articles = await request.get('/posts/?page=1&limit=4')
        this.recommendedArticles = articles
      } catch (error) {
        console.error('获取推荐文章失败:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchRecentComments () {
      this.loading = true
      try {
        const comments = await request.get('/comments/?post_id=1') // 示例文章ID
        this.recentComments = comments
      } catch (error) {
        console.error('获取最新评论失败:', error)
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    this.startNotificationTimer()
    this.updateTime()
    this.timeInterval = setInterval(this.updateTime, 1000)
    this.fetchRecommendedArticles()
    this.fetchRecentComments()
  },
  beforeDestroy () {
    if (this.notificationTimer) {
      clearInterval(this.notificationTimer)
    }
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
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

/* 推荐文章样式 */
.recommended-section {
  padding: 4rem 0;
  position: relative;
  z-index: 2;
}

.article-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.article-thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
}

.article-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.article-date {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.article-actions {
  display: flex;
  gap: 1rem;
}

.btn-action {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action:hover {
  color: #3273dc;
  transform: scale(1.1);
}

/* 最近评论样式 */
.recent-comments {
  padding: 4rem 0;
  position: relative;
  z-index: 2;
}

.comment-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-info h5 {
  margin: 0;
  font-size: 1rem;
}

.comment-text {
  color: #666;
  margin-bottom: 1rem;
}

.btn-view {
  background: #3273dc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view:hover {
  background: #2366d1;
  transform: translateY(-2px);
}

/* 订阅表单样式 */
.subscription-form {
  padding: 4rem 0;
  position: relative;
  z-index: 2;
  background: rgba(255,255,255,0.1);
}

.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  color: white;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-subscribe {
  background: #3273dc;
  color: white;
  border: none;
  padding: 0.5rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-subscribe:hover {
  background: #2366d1;
  transform: translateY(-2px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }

  .btn-subscribe {
    width: 100%;
  }
}

/* 用户状态样式 */
.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user-name {
  color: white;
  font-size: 0.9rem;
}

.btn-logout {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.btn-logout:hover {
  opacity: 1;
}

/* 更新提示样式 */
.update-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
}

.btn-refresh {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.btn-refresh:hover {
  opacity: 1;
}

/* 通知模态框样式 */
.notification-modal {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.btn-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.btn-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 加载动画样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  font-size: 3rem;
  color: #3273dc;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
