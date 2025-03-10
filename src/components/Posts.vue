<template>
  <Home>
    <div class="posts-container">
      <h2 class="section-title">文章列表</h2>

      <!-- 文章列表 -->
      <div class="posts-list">
        <div v-for="post in posts"
             :key="post.id"
             class="post-card"
             @click="$router.push(`/posts/${post.id}`)">
          <div class="post-cover">
            <img :src="getImageUrl(post.cover, 'cover')"
                 :alt="post.title"
                 data-type="cover"
                 @error="handleImageError($event, 'cover')"
                 loading="lazy">
          </div>
          <div class="post-content">
            <div class="post-header">
              <div class="category-badge">{{ post.category.name }}</div>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.content }}</p>
            </div>
            <div class="post-footer">
              <div class="post-meta">
                <span class="post-author">
                  <img :src="getImageUrl(post.author.avatar, 'avatar')"
                       :alt="post.author.username"
                       data-type="avatar"
                       @error="handleImageError($event, 'avatar')"
                       class="author-avatar">
                  {{ post.author.nickname || post.author.username }}
                </span>
                <span class="post-date">{{ formatDate(post.created_at) }}</span>
              </div>
              <div class="post-tags">
                <span v-for="tag in post.tags"
                      :key="tag.id"
                      class="tag">
                  {{ tag.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="posts.length > 0">
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
import { getImageUrl } from '../utils/request'

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
    getImageUrl,
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
        const resp = await postApi.getList({ page })
        this.posts = resp.data
        console.log('文章内容：', this.posts)

        this.hasNextPage = !!resp.next
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
    },
    handleImageError (event, type) {
      const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:8000'
      event.target.src = `${baseURL}/static/assets/images/default-${type}.png`
    }
  },
  created () {
    this.fetchPosts()
  }
}
</script>

<style scoped>
.posts-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.section-title {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 300;
}

.post-card {
  display: flex;
  background: white;
  border-radius: 15px;
  margin-bottom: 2rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  height: 220px;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.post-cover {
  flex: 0 0 200px;
  height: 100%;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
}

.post-header {
  margin-bottom: 1rem;
}

.category-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: #3498db;
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.post-excerpt {
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  margin-top: auto;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
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
    flex-direction: column;
    height: auto;
  }

  .post-cover {
    flex: 0 0 150px;
    height: 150px;
  }

  .post-content {
    padding: 1rem;
  }

  .post-title {
    font-size: 1.2rem;
  }
}
</style>
