<template>
  <div class="home-layout">
    <!-- 滚动公告栏 -->
    <div class="announcement-bar">
      <div class="announcement-content">
        <span>欢迎来到云梦物语のBlog!</span>
        <span>最新文章: Vue.js 3.0 深度解析</span>
        <span>加入我们的技术交流群</span>
        <span>欢迎来到云梦物语のBlog!</span>
      </div>
    </div>

    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <span class="brand-text">云梦物语のBlog</span>
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
            <li class="nav-item">
              <router-link
                to="/write"
                class="nav-link btn-write"
              >
                <i class="fas fa-pen"></i> 写文章
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <button class="btn-lang dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                {{ currentLang === 'zh' ? '中文' : 'English' }}
              </button>
              <ul class="dropdown-menu">
                <li v-for="lang in languages"
                    :key="lang.code">
                  <a class="dropdown-item"
                     href="#"
                     @click.prevent="switchLanguage(lang.code)"
                     :class="{ active: currentLang === lang.code }">
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
      <h1 class="display-4">欢迎来到云梦物语のBlog</h1>
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
                  <a :href="bloggerInfo.social.csdn" target="_blank" class="social-link">
                    <i class="fas fa-blog"></i>
                  </a>
                  <a :href="`mailto:${bloggerInfo.social.email}`" class="social-link">
                    <i class="fas fa-envelope"></i>
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
      <a :href="bloggerInfo.social.github" target="_blank" class="social-button">
        <i class="fab fa-github"></i>
      </a>
      <a :href="bloggerInfo.social.csdn" target="_blank" class="social-button">
        <i class="fas fa-blog"></i>
      </a>
      <a :href="`mailto:${bloggerInfo.social.email}`" class="social-button">
        <i class="fas fa-envelope"></i>
      </a>
    </div>

    <!-- 最新评论部分 -->
    <div class="section-container">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="content-card">
              <h3 class="section-title">
                <i class="fas fa-comments"></i> 最新评论
              </h3>
              <div class="comment-list">
                <div v-for="comment in filteredComments"
                     :key="comment.id"
                     class="comment-item"
                     @click="goToPost(comment.post_id)">
                  <div class="comment-header">
                    <img :src="getImageUrl(comment.user.avatar, 'avatar')"
                         :alt="comment.user.username"
                         class="comment-avatar">
                    <div class="comment-info">
                      <span class="comment-author">{{ comment.user.nickname || comment.user.username }}</span>
                      <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
                    </div>
                  </div>
                  <div class="comment-content">{{ comment.content }}</div>
                </div>
              </div>
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

    <footer class="footer">
      <div class="container text-center">
        <p class="mb-0">© 2025 云梦物语のBlog. All rights reserved.</p>
      </div>
    </footer>

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
import { likeApi, collectApi, postApi } from '../api'
import request from '@/utils/request'

export default {
  name: 'Home',
  data () {
    return {
      currentTime: '',
      currentDate: '',
      timeInterval: null,
      bloggerInfo: {
        name: '辰星',
        avatar: require('@/assets/images/default-avatar.png'),
        bio: '热爱技术，热爱生活。专注于Python全栈开发和技术分享，致力于让编程更简单有趣。',
        social: {
          github: 'https://github.com/2423560192',
          csdn: 'https://blog.csdn.net/xiao_a_lian?spm=1000.2115.3001.5343',
          email: '2480419172@qq.com'
        }
      },
      categories: [],
      searchQuery: '',
      showSuggestions: false,
      searchSuggestions: [],
      isDarkMode: false,
      recommendedPosts: [],
      recentComments: [],
      subscribeEmail: '',
      showUpdateHint: false,
      newArticlesCount: 0,
      showNotification: false,
      notificationTimer: null,
      currentLang: this.$i18n.locale,
      languages: [
        { code: 'zh', name: '中文' },
        { code: 'en', name: 'English' }
      ],
      loading: false,
      baseUrl: process.env.VUE_APP_API_URL || 'http://localhost:8000',
      currentPostId: null
    }
  },
  computed: {
    isLoggedIn () {
      return !!localStorage.getItem('token')
    },
    filteredComments () {
      return this.recentComments.filter(comment => !comment.parent_id)
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
    async handleCategoryClick (category) {
      try {
        // 获取该分类下的文章列表
        const response = await postApi.getPostsByCategory(category.name)

        if (response.data && Array.isArray(response.data)) {
          // 将文章列表和分类信息传递给文章列表页面
          this.$router.push({
            path: '/posts',
            query: {
              category: category.name
            },
            state: {
              posts: response.data
            }
          })
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('获取分类文章失败:', error)
        this.$message.error('获取分类文章失败，请稍后重试')
      }
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
      if (platform === 'github') {
        window.open(this.bloggerInfo.social.github, '_blank')
      } else if (platform === 'csdn') {
        window.open(this.bloggerInfo.social.csdn, '_blank')
      } else if (platform === 'email') {
        window.location.href = `mailto:${this.bloggerInfo.social.email}`
      }
    },
    toggleTheme () {
      this.isDarkMode = !this.isDarkMode
      document.body.classList.toggle('dark-mode')
    },
    async handleLike (post) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      try {
        await likeApi.like(post.id)
        this.$bvToast.toast('点赞成功!', {
          title: '提示',
          variant: 'success',
          solid: true
        })
        post.likes++
      } catch (error) {
        console.error('点赞失败:', error)
      }
    },
    async handleCollect (post) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      try {
        await collectApi.collect(post.id)
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
    async fetchRecommendedPosts () {
      this.loading = true
      try {
        const posts = await request.get('/posts/?page=1&limit=4')
        this.recommendedPosts = posts
      } catch (error) {
        console.error('获取推荐文章失败:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchRecentComments () {
      try {
        // 先获取最新的几篇文章
        const posts = await (await request.get('posts/?page=1&limit=3')).data
        console.log('文章', posts)
        if (posts && posts.length > 0) {
          // 获取每篇文章的评论并合并
          const commentsPromises = posts.map(post =>
            request.get('comments/', {
              params: {
                post_id: post.id,
                post_published: true
              }
            })
          )
          const commentsResults = await Promise.all(commentsPromises)
          console.log('评论', commentsResults)

          // 合并所有评论并按时间排序
          this.recentComments = commentsResults
            .map(result => result.data || []) // 获取 data 字段
            .flat()
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5) // 只显示最新的5条评论
        }
      } catch (error) {
        console.error('获取最新评论失败:', error)
      }
    },
    goToPost (postId) {
      this.$router.push(`/posts/${postId}`)
    },
    formatDate (date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getImageUrl (url, type) {
      if (!url) {
        // 如果没有提供 URL，返回默认图片的 API 地址
        return `${this.baseUrl}/static/${type === 'avatar' ? 'default-avatar.png' : 'default-cover.jpg'}`
      }
      // 如果 URL 已经是完整的 URL（以 http 或 https 开头），直接返回
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      // 否则，拼接基础 URL
      return `${this.baseUrl}${url}`
    },
    async fetchCategories () {
      try {
        const response = await this.$axios.get('/api/categories/')
        if (response.data && Array.isArray(response.data.data)) {
          // 将后端数据映射到我们需要的格式
          const categories = response.data.data.map(category => ({
            name: category.name,
            icon: this.getCategoryIcon(category.name), // 根据分类名称获取图标
            color: this.getCategoryColor(category.name), // 根据分类名称获取颜色
            count: 0 // 初始化为 0，后面会更新
          }))

          // 获取每个分类的文章数量
          for (const category of categories) {
            try {
              const countResponse = await this.$axios.get('/api/categories/count-posts/', {
                params: { category_name: category.name }
              })
              if (countResponse.data && countResponse.data.data) {
                category.count = countResponse.data.data.post_count
              }
            } catch (error) {
              console.error(`获取分类 ${category.name} 的文章数量失败:`, error)
            }
          }

          this.categories = categories
        }
      } catch (error) {
        console.error('获取分类失败:', error)
        // 使用默认分类作为后备
        this.categories = [
          {
            name: '技术',
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
        ]
      }
    },
    getCategoryIcon (name) {
      const iconMap = {
        技术: 'fas fa-code',
        生活: 'fas fa-coffee',
        随笔: 'fas fa-pen-fancy'
        // 可以添加更多映射
      }
      return iconMap[name] || 'fas fa-folder' // 默认图标
    },
    getCategoryColor (name) {
      const colorMap = {
        技术: '#3498db',
        生活: '#4ecdc4',
        随笔: '#45b7d1'
        // 可以添加更多映射
      }
      // 如果没有映射，生成一个随机颜色
      if (!colorMap[name]) {
        const colors = ['#3498db', '#4ecdc4', '#45b7d1', '#e74c3c', '#9b59b6', '#f1c40f', '#1abc9c']
        const randomIndex = Math.floor(Math.random() * colors.length)
        return colors[randomIndex]
      }
      return colorMap[name]
    },
    toggleLang () {
      const newLang = this.currentLang === 'zh' ? 'en' : 'zh'
      this.$i18n.locale = newLang
      localStorage.setItem('locale', newLang)
    }
  },
  created () {
    this.startNotificationTimer()
    this.updateTime()
    this.timeInterval = setInterval(this.updateTime, 1000)
    this.fetchCategories()
    this.fetchRecommendedPosts()
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
.home-layout {
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
  top: 250px;
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

.home-layout {
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

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.author-name {
  font-size: 0.8rem;
  color: #666;
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

/* 最新文章部分 */
.section-container {
  padding: 2rem 0;
  background: var(--bg-gradient);
}

.section-container:nth-child(even) {
  background: var(--bg-gradient);
}

.content-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.section-title {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #3273dc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.article-item:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #e9ecef;
  transform: translateX(3px);
}

.article-cover {
  flex: 0 0 200px;
  height: 140px;
  border-radius: 6px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-excerpt {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: #2c3e50;
}

.post-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.post-category {
  background: rgba(50, 115, 220, 0.1);
  color: #3273dc;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.post-date {
  font-size: 0.8rem;
  color: #666;
}

/* 最新评论样式 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-item {
  padding: 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.comment-item:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #e9ecef;
  transform: translateX(3px);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.comment-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.comment-author {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.85rem;
}

.comment-date {
  font-size: 0.75rem;
  color: #666;
}

.comment-content {
  color: #2c3e50;
  font-size: 0.85rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-left: 2rem;
}

/* 暗色模式支持 */
.dark-mode .section-container {
  background: var(--bg-gradient-dark);
}

.dark-mode .section-container:nth-child(even) {
  background: var(--bg-gradient-dark);
}

.dark-mode .content-card {
  background: #2d2d2d;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.dark-mode .section-title {
  color: #e1e1e1;
  border-bottom-color: #404040;
}

.dark-mode .comment-item {
  background: rgba(51, 51, 51, 0.8);
}

.dark-mode .comment-item:hover {
  background: rgba(56, 56, 56, 0.95);
  border-color: #404040;
}

.dark-mode .comment-author {
  color: #e1e1e1;
}

.dark-mode .comment-content {
  color: #e1e1e1;
}

@media (max-width: 768px) {
  .section-container {
    padding: 1rem 0;
  }

  .container {
    padding: 0 0.5rem;
  }

  .content-card {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .article-item {
    flex-direction: column;
    gap: 1rem;
  }

  .article-cover {
    flex: 0 0 auto;
    height: 180px;
  }

  .article-title {
    font-size: 1.1rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
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

.btn-lang {
  padding: 0.5rem 1rem;
  border: 1px solid #3273dc;
  border-radius: 4px;
  background: transparent;
  color: #3273dc;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
}

.btn-lang:hover {
  background: #3273dc;
  color: white;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .btn-lang {
    border-color: #4299e1;
    color: #4299e1;
  }

  .btn-lang:hover {
    background: #4299e1;
    color: #1a202c;
  }
}

.btn-write {
  background: #3498db;
  color: white !important;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  margin: 0 1rem;
  transition: all 0.3s ease;
}

.btn-write:hover {
  background: #2980b9;
  transform: translateY(-2px);
}
</style>
