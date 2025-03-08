<template>
  <Home>
    <div class="posts-container">
      <h2 class="section-title">文章列表</h2>

      <!-- 文章列表 -->
      <div class="row g-4">
        <div v-for="post in posts"
             :key="post.id"
             class="col-md-6 col-lg-4">
          <div class="post-card" @click="$router.push(`/posts/${post.id}`)">
            <img
              :src="post.cover || require('@/assets/images/default-cover.jpg')"
              :alt="post.title"
              class="post-cover"
              loading="lazy"
            >
            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-meta">
                <span class="post-author">
                  <img :src="post.author.avatar" :alt="post.author.username" class="author-avatar">
                  {{ post.author.username }}
                </span>
                <span class="post-date">{{ formatDate(post.created_at) }}</span>
              </div>
              <div class="post-tags">
                <span v-for="tag in post.tags"
                      :key="tag"
                      class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <button
          class="btn btn-outline-primary"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页</span>
        <button
          class="btn btn-outline-primary"
          :disabled="!hasNextPage"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'
import { postApi } from '../api'

export default {
  name: 'Posts',
  components: {
    Home
  },
  data () {
    return {
      posts: [],
      currentPage: 1,
      hasNextPage: false,
      loading: false
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
    async fetchPosts (page = 1) {
      try {
        this.loading = true
        const data = await postApi.getList({ page })
        this.posts = data.results
        this.hasNextPage = !!data.next
      } catch (error) {
        console.error('获取文章列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    handlePageChange (page) {
      this.currentPage = page
      this.fetchPosts(page)
      window.scrollTo(0, 0)
    }
  },
  created () {
    this.fetchPosts()
  }
}
</script>

<style scoped>
.posts-container {
  padding: 2rem 0;
}

.section-title {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 300;
}

.post-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.post-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #666;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

.page-info {
  color: white;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .post-card {
    margin-bottom: 1rem;
  }
}
</style>
