<template>
  <Home>
    <div class="post-detail">
      <div v-if="loading" class="loading-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else class="article-container" ref="articleContainer">
        <!-- 博主信息卡片 -->
        <div class="author-card">
          <div class="author-avatar">
            <img src="https://via.placeholder.com/150" alt="博主头像">
          </div>
          <h3 class="author-name">云梦</h3>
          <p class="author-bio">热爱技术，热爱生活。前端开发工程师，专注于Vue.js和React技术栈。</p>
          <div class="author-stats">
            <div class="stat-item">
              <i class="fas fa-pencil-alt"></i>
              <span>文章 23</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-heart"></i>
              <span>获赞 1.2k</span>
            </div>
          </div>
        </div>

        <article class="article">
          <header class="article-header">
            <h1 class="article-title" ref="title"></h1>
            <div class="article-meta">
              <span class="article-date">
                <i class="fas fa-calendar-alt"></i>
                {{ formatDate(post.created_at) }}
              </span>
              <span class="article-author">
                <i class="fas fa-user"></i>
                {{ post.author }}
              </span>
              <span class="article-likes">
                <i class="fas fa-heart"></i>
                {{ post.likes }}
              </span>
            </div>
          </header>

          <div class="article-content" ref="content" :class="{ 'fade-in': !loading }">
            {{ post.content }}
          </div>
        </article>

        <button class="toc-btn" @click="toggleToc">
          <i class="fas fa-list"></i>
        </button>

        <div class="toc-panel" :class="{ show: showToc }">
          <h4>目录</h4>
          <ul>
            <li v-for="(item, index) in tableOfContents"
                :key="index"
                :style="{ paddingLeft: (item.level - 1) * 20 + 'px' }">
              {{ item.title }}
            </li>
          </ul>
        </div>

        <button class="back-to-top" @click="scrollToTop">
          <i class="fas fa-arrow-up"></i>
        </button>

        <div class="comments-section">
          <h3 class="comments-title">评论</h3>
          <p class="text-muted">评论功能即将推出...</p>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'

export default {
  name: 'PostDetail',
  components: {
    Home
  },
  data () {
    return {
      post: {
        id: 1,
        title: '探索 Vue.js 3.0 新特性',
        content: `Vue.js 3.0 带来了许多令人兴奋的新特性。

Composition API 让代码组织更加灵活，通过 setup 函数，我们可以更好地复用逻辑代码，使组件的代码更加清晰和易于维护。

Teleport 组件解决了弹窗类组件的挂载问题，让我们可以将组件渲染到任意 DOM 节点，而不受组件层级的限制。

Fragment 支持让模板结构更加简洁，不再需要额外的包裹元素。同时，Vue 3.0 在性能方面也有显著提升，包括：

- 更小的打包体积
- 更快的渲染速度
- 更好的 TypeScript 支持
- 改进的响应式系统

这些改进让 Vue.js 在大型应用开发中的表现更加出色。`,
        created_at: '2024-03-07',
        author: '张三',
        likes: 42,
        comments: []
      },
      loading: false,
      error: null,
      showToc: false
    }
  },
  computed: {
    // 生成目录
    tableOfContents () {
      const lines = this.post.content.split('\n')
      const toc = []
      lines.forEach(line => {
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)[0].length
          const title = line.replace(/^#+\s+/, '')
          toc.push({ level, title })
        }
      })
      return toc
    }
  },
  methods: {
    formatDate (date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async fetchPost () {
      this.loading = true
      this.error = null

      try {
        const response = await this.$axios.get(`/api/posts/${this.$route.params.id}/`)
        if (response.data.status === 'success') {
          this.post = response.data.data
        } else {
          this.error = response.data.message
        }
      } catch (error) {
        console.warn('API 请求失败，使用静态数据')
        // 保持静态数据，不设置 error
      } finally {
        this.loading = false
      }
    },
    toggleToc () {
      this.showToc = !this.showToc
    },
    scrollToTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    async typewriterEffect () {
      const title = this.$refs.title
      const originalText = this.post.title
      title.textContent = ''

      for (const char of originalText) {
        await new Promise(resolve => setTimeout(resolve, 50))
        title.textContent += char
      }
    }
  },
  async mounted () {
    await this.fetchPost()
    if (!this.error && !this.loading) {
      this.typewriterEffect()
    }

    // 添加滚动监听
    window.addEventListener('scroll', () => {
      const backToTop = document.querySelector('.back-to-top')
      if (backToTop) {
        if (window.scrollY > 300) {
          backToTop.classList.add('show')
        } else {
          backToTop.classList.remove('show')
        }
      }
    })
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  padding: 3rem;
  opacity: 0;
  animation: fadeIn 1s ease forwards;
}

.author-card {
  background: linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.author-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

.author-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255,255,255,0.8);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.author-bio {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.author-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  color: #3273dc;
}

.article-header {
  text-align: center;
  margin-bottom: 3rem;
}

.article-title {
  font-size: 2.5rem;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.3;
  display: inline-block;
  border-right: 3px solid #3273dc;
  padding-right: 8px;
  animation: blink 0.7s step-end infinite;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #666;
  font-size: 0.95rem;
}

.article-meta i {
  margin-right: 0.5rem;
}

.article-meta span {
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-meta span:hover {
  color: #3273dc;
  transform: translateY(-2px);
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
  white-space: pre-wrap;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.article-content.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.comments-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.comments-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.toc-btn {
  position: fixed;
  right: 2rem;
  top: 6rem;
  background: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.toc-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.toc-panel {
  position: fixed;
  right: 2rem;
  top: 8rem;
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  max-width: 300px;
  max-height: 70vh;
  overflow-y: auto;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.toc-panel.show {
  transform: translateX(0);
  opacity: 1;
}

.back-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.back-to-top.show {
  opacity: 1;
  transform: translateY(0);
}

.back-to-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

@keyframes blink {
  from, to { border-color: transparent }
  50% { border-color: #3273dc }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
