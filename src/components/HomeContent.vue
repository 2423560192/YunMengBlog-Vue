<template>
  <Home>
    <div class="featured-posts">
      <h2 class="section-title">
        <i class="fas fa-newspaper"></i>
        <span>最新文章</span>
      </h2>

      <div v-if="loading" class="text-center my-5">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
        <p class="mt-2">加载中...</p>
      </div>

      <div v-else-if="posts.length === 0" class="empty-state">
        <i class="fas fa-inbox fa-3x"></i>
        <p>暂无文章</p>
      </div>

      <div v-else class="posts-list">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-item"
          @click="$router.push(`/posts/${post.id}`)"
        >
          <div class="post-cover">
            <img :src="getImageUrl(post.cover, 'cover')" :alt="post.title" />
            <div class="post-category-badge">
              <i class="fas fa-folder"></i> {{ post.category.name }}
            </div>
          </div>
          <div class="post-info">
            <div class="post-header">
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-meta-top">
                <span class="post-date">
                  <i class="far fa-clock"></i> {{ formatDate(post.created_at) }}
                </span>
              </div>
            </div>
            <p class="post-excerpt">{{ post.content }}</p>
            <div class="post-footer">
              <div class="author-info">
                <img
                  :src="getImageUrl(post.author.avatar, 'avatar')"
                  :alt="post.author.username"
                  class="author-avatar"
                />
                <span class="author-name">{{
                  post.author.nickname || post.author.username
                }}</span>
              </div>
              <div class="post-stats">
                <span class="stat-item">
                  <i class="far fa-eye"></i> {{ post.views || 0 }}
                </span>
                <span class="stat-item">
                  <i class="far fa-comment"></i> {{ post.comments_count || 0 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4" v-if="posts.length > 0 && hasMore">
        <button
          class="btn-load-more"
          @click="loadMorePosts"
          :disabled="loading"
        >
          {{ loading ? "加载中..." : "加载更多" }}
          <i class="fas fa-chevron-down" v-if="!loading"></i>
        </button>
      </div>
    </div>

    <!-- 推荐阅读部分 -->
    <div class="recommended-posts" v-if="recommendedPosts.length > 0">
      <h2 class="section-title">
        <i class="fas fa-thumbs-up"></i>
        <span>推荐阅读</span>
      </h2>
      <div class="posts-grid">
        <div v-for="post in recommendedPosts"
             :key="post.id"
             class="post-card"
             @click="goToPost(post.id)">
          <div class="post-cover">
            <img :src="getImageUrl(post.cover, 'cover')" :alt="post.title">
          </div>
          <div class="post-info">
            <h4 class="post-title">{{ post.title }}</h4>
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.created_at) }}</span>
              <span class="post-category" v-if="post.category">{{ post.category.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'
import { postApi } from '../api'
import { getImageUrl } from '../utils/request'

export default {
  name: 'HomeContent',
  components: {
    Home
  },
  data () {
    return {
      posts: [],
      loading: false,
      page: 1,
      hasMore: true,
      baseUrl: process.env.VUE_APP_API_URL || 'http://localhost:8000',
      recommendedPosts: []
    }
  },
  created () {
    this.fetchPosts()
    this.fetchRecommendedPosts()
  },
  methods: {
    getImageUrl,
    async fetchPosts () {
      this.loading = true
      try {
        const response = await this.$axios.get('/api/posts/', {
          params: { page: this.page, limit: 5 }
        })

        if (response.data && response.data.data) {
          if (this.page === 1) {
            this.posts = response.data.data
          } else {
            this.posts = [...this.posts, ...response.data.data]
          }

          this.hasMore = response.data.data.length === 5
        }
      } catch (error) {
        console.error('获取文章列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    loadMorePosts () {
      if (this.hasMore && !this.loading) {
        this.page++
        this.fetchPosts()
      }
    },

    formatDate (date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    async fetchRecommendedPosts () {
      try {
        const response = await postApi.getList({
          limit: 4,
          sort: 'views' // 按浏览量排序
        })
        this.recommendedPosts = response.data || []
      } catch (error) {
        console.error('获取推荐文章失败:', error)
      }
    },

    async goToPost (postId) {
      try {
        await this.$router.push(`/posts/${postId}`)
      } catch (err) {
        if (err.name !== 'NavigationDuplicated') {
          throw err
        }
      }
    }
  }
}
</script>

<style scoped>
.featured-posts {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #f0f2f5;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
}

.section-title i {
  color: #3273dc;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, #3498db, #45b7d1);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.post-item {
  display: flex;
  gap: 1.2rem;
  padding: 1.2rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.post-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-color: rgba(50, 115, 220, 0.2);
}

.post-cover {
  flex: 0 0 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-item:hover .post-cover img {
  transform: scale(1.05);
}

.post-category-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(50, 115, 220, 0.9);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.post-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-header {
  margin-bottom: 0.8rem;
}

.post-title {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta-top {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
}

.post-date {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.post-excerpt {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.post-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
  border-top: 1px solid #f0f0f0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.author-name {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
  font-size: 0.85rem;
}

.stat-item i {
  color: #3273dc;
}

.btn-load-more {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-load-more:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-load-more:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state i {
  margin-bottom: 1rem;
  color: #ccc;
}

/* 暗色模式支持 */
.dark-mode .featured-posts {
  background: rgba(40, 44, 52, 0.8);
}

.dark-mode .post-item {
  background: rgba(51, 51, 51, 0.95);
  border-color: rgba(255, 255, 255, 0.05);
}

.dark-mode .post-item:hover {
  border-color: rgba(50, 115, 220, 0.3);
}

.dark-mode .post-title {
  color: #e1e1e1;
}

.dark-mode .post-excerpt {
  color: #aaa;
}

.dark-mode .author-name {
  color: #e1e1e1;
}

.dark-mode .post-footer {
  border-top-color: #444;
}

.dark-mode .stat-item {
  color: #aaa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .featured-posts {
    padding: 1rem;
  }

  .post-item {
    flex-direction: column;
    gap: 1rem;
  }

  .post-cover {
    flex: 0 0 auto;
    height: 180px;
    width: 100%;
  }

  .post-title {
    font-size: 1.3rem;
  }
}

/* 添加推荐阅读样式 */
.recommended-posts {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.post-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.post-cover {
  height: 160px;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-cover img {
  transform: scale(1.05);
}

.post-info {
  padding: 1rem;
}

.post-info .post-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  color: #2c3e50;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-info .post-meta {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  justify-content: space-between;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .recommended-posts {
    background: rgba(40, 44, 52, 0.8);
  }

  .post-card {
    background: rgba(51, 51, 51, 0.95);
  }

  .post-info .post-title {
    color: #e2e8f0;
  }

  .post-info .post-meta {
    color: #a0aec0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recommended-posts {
    padding: 1rem;
  }

  .posts-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .post-cover {
    height: 120px;
  }

  .post-info .post-title {
    font-size: 1rem;
  }
}
</style>
