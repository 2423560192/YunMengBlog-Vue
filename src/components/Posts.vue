<template>
  <Home>
    <div class="posts-container">
      <h2 class="page-title">文章列表</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else>
        <div class="post-list">
          <router-link
            v-for="post in posts"
            :key="post.id"
            :to="`/posts/${post.id}`"
            class="post-item"
          >
            <div class="post-card">
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ truncateContent(post.content) }}</p>
              <div class="post-meta">
                <div class="post-info">
                  <span class="post-date">{{ formatDate(post.created_at) }}</span>
                  <span class="post-author">{{ post.author }}</span>
                </div>
                <div class="post-actions">
                  <button
                    :id="'like-btn-' + post.id"
                    class="action-btn"
                    @click.prevent="likePost(post.id)"
                  >
                    <i class="fas fa-heart"></i>
                    <span>{{ post.likes }}</span>
                  </button>
                  <button
                    class="action-btn"
                    @click.prevent="sharePost(post)"
                  >
                    <i class="fas fa-share"></i>
                  </button>
                  <span class="post-read-more">阅读全文 →</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <div class="pagination-wrapper">
          <button
            class="btn btn-outline-primary"
            :disabled="!previousPage"
            @click="fetchPosts(previousPage)"
          >
            上一页
          </button>
          <button
            class="btn btn-outline-primary"
            :disabled="!nextPage"
            @click="fetchPosts(nextPage)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'

export default {
  name: 'PostsList',
  components: {
    Home
  },
  data () {
    return {
      posts: [
        {
          id: 1,
          title: '探索 Vue.js 3.0 新特性',
          content: 'Vue.js 3.0 带来了许多令人兴奋的新特性。Composition API 让代码组织更加灵活，Teleport 组件让弹窗管理更加方便，Fragment 支持让模板结构更加简洁。性能方面的优化包括更小的打包体积、更快的渲染速度，以及更好的 TypeScript 支持...',
          created_at: '2024-03-07',
          author: '张三',
          likes: 42,
          comments: 8
        },
        {
          id: 2,
          title: '前端工程化实践指南',
          content: '现代前端开发已经不再是简单的 HTML、CSS 和 JavaScript 的组合。工程化实践包括模块化开发、组件化设计、自动化构建、持续集成等多个方面。本文将详细介绍如何搭建一个完整的前端工程化体系...',
          created_at: '2024-03-06',
          author: '李四',
          likes: 38,
          comments: 12
        },
        {
          id: 3,
          title: 'CSS Grid 布局完全指南',
          content: 'CSS Grid 布局是一种强大的二维布局系统，它可以帮助我们创建复杂的网页布局。本文将从基础概念开始，详细介绍 Grid 容器、Grid 项目、网格线、网格区域等核心概念，并通过实际案例展示 Grid 布局的应用...',
          created_at: '2024-03-05',
          author: '王五',
          likes: 56,
          comments: 15
        }
      ],
      loading: false,
      error: null,
      nextPage: null,
      previousPage: null
    }
  },
  methods: {
    truncateContent (content) {
      return content.length > 150 ? content.slice(0, 150) + '...' : content
    },
    formatDate (date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async fetchPosts (url = '/api/posts/') {
      this.loading = true
      this.error = null

      try {
        const response = await this.$axios.get(url)
        if (response.data.status === 'success') {
          this.posts = response.data.data.results
          this.nextPage = response.data.data.next
          this.previousPage = response.data.data.previous
        } else {
          this.error = response.data.message
        }
      } catch (error) {
        console.warn('API 请求失败，使用静态数据')
        // 保持静态数据，不设置 error
        this.nextPage = null
        this.previousPage = null
      } finally {
        this.loading = false
      }
    },
    likePost (postId) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.likes++
        // 添加点赞动画效果
        const likeBtn = document.querySelector(`#like-btn-${postId}`)
        likeBtn.classList.add('liked')
        setTimeout(() => {
          likeBtn.classList.remove('liked')
        }, 1000)
      }
    },
    sharePost (post) {
      // 模拟分享功能
      const shareData = {
        title: post.title,
        text: post.content.slice(0, 100) + '...',
        url: window.location.origin + '/posts/' + post.id
      }

      if (navigator.share) {
        navigator.share(shareData)
          .catch(err => {
            console.warn('分享失败:', err)
          })
      } else {
        // 如果不支持原生分享，则复制链接
        navigator.clipboard.writeText(shareData.url)
          .then(() => {
            this.showToast('链接已复制到剪贴板')
          })
      }
    },
    showToast (message) {
      const toast = document.createElement('div')
      toast.className = 'custom-toast'
      toast.textContent = message
      document.body.appendChild(toast)

      // 触发动画
      setTimeout(() => {
        toast.classList.add('show')
      }, 10)

      // 3秒后移除
      setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 3000)
    }
  },
  mounted () {
    this.fetchPosts()
  }
}
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 300;
}

.post-list {
  max-width: 800px;
  margin: 0 auto;
}

.post-item {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in 0.5s ease forwards;
}

.post-item:nth-child(1) { animation-delay: 0.1s; }
.post-item:nth-child(2) { animation-delay: 0.2s; }
.post-item:nth-child(3) { animation-delay: 0.3s; }

.post-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(50,115,220,0.1) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.post-card:hover::before {
  opacity: 1;
}

.post-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.post-excerpt {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 0.9rem;
  position: relative;
}

.post-read-more {
  color: #3273dc;
  font-weight: 500;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.btn-outline-primary {
  border-color: #3273dc;
  color: #3273dc;
}

.btn-outline-primary:hover:not(:disabled) {
  background-color: #3273dc;
  border-color: #3273dc;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.action-btn:hover {
  color: #3273dc;
  transform: scale(1.1);
}

.action-btn.liked {
  animation: like-animation 0.5s ease;
}

@keyframes like-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.custom-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.3s ease;
}

.custom-toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

@keyframes fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
