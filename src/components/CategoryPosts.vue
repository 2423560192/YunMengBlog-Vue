<template>
  <Home>
    <div class="category-posts">
      <h2 class="page-title">
        <i :class="categoryInfo.icon"></i>
        {{ categoryName }}分类
        <span class="post-count" v-if="postCount !== null">
          ({{ postCount }} 篇文章)
        </span>
      </h2>

      <div v-if="loading" class="text-center my-5">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
        <p class="mt-2">加载中...</p>
      </div>

      <div v-else-if="posts.length === 0" class="empty-state">
        <i class="fas fa-inbox fa-3x"></i>
        <p>该分类下暂无文章</p>
      </div>

      <div v-else class="post-list">
        <div v-for="post in posts"
             :key="post.id"
             class="post-card"
             @click="$router.push(`/posts/${post.id}`)">
          <div class="post-header">
            <img :src="getImageUrl(post.cover, 'cover')" alt="文章封面" class="post-cover">
            <h3 class="post-title">{{ post.title }}</h3>
          </div>
          <p class="post-excerpt">{{ post.content }}</p>
          <div class="post-meta">
            <span class="post-author" v-if="post.author">
              <i class="fas fa-user"></i> {{ post.author.nickname || post.author.username }}
            </span>
            <span class="post-date">{{ formatDate(post.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'

export default {
  name: 'CategoryPosts',
  components: {
    Home
  },
  data () {
    return {
      posts: [],
      loading: false,
      postCount: null,
      baseUrl: process.env.VUE_APP_API_URL || 'http://localhost:8000'
    }
  },
  computed: {
    categoryName () {
      return this.$route.params.category
    },
    categoryInfo () {
      return {
        icon: this.getCategoryIcon(this.categoryName)
      }
    }
  },
  created () {
    this.fetchCategoryPosts()
    this.fetchPostCount()
  },
  methods: {
    async fetchCategoryPosts () {
      this.loading = true
      try {
        // 使用 API 获取分类文章
        const response = await this.$axios.get('/api/posts/filter/', {
          params: { category_name: this.categoryName }
        })

        if (response.data && response.data.data) {
          this.posts = response.data.data
        } else {
          this.posts = []
        }
      } catch (error) {
        console.error('获取分类文章失败:', error)
        this.posts = []
      } finally {
        this.loading = false
      }
    },

    async fetchPostCount () {
      try {
        const response = await this.$axios.get('/api/categories/count-posts/', {
          params: { category_name: this.categoryName }
        })

        if (response.data && response.data.data) {
          this.postCount = response.data.data.post_count
        }
      } catch (error) {
        console.error('获取文章数量失败:', error)
      }
    },

    formatDate (date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getCategoryIcon (name) {
      const iconMap = {
        技术: 'fas fa-code',
        生活: 'fas fa-coffee',
        随笔: 'fas fa-pen-fancy'
      }
      return iconMap[name] || 'fas fa-folder'
    },
    getImageUrl (url, type) {
      if (!url) {
        return `${this.baseUrl}/api/static/${type === 'avatar' ? 'default-avatar.png' : 'default-cover.jpg'}`
      }
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      return `${this.baseUrl}${url}`
    }
  }
}
</script>

<style scoped>
.category-posts {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 300;
}

.page-title i {
  margin-right: 0.5rem;
}

.post-count {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-left: 0.5rem;
}

.post-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.post-cover {
  width: 100px;
  height: 70px;
  border-radius: 6px;
  object-fit: cover;
}

.post-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0;
  flex: 1;
}

.post-excerpt {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.9rem;
}

.post-meta i {
  margin-right: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  color: #666;
}

.empty-state i {
  margin-bottom: 1rem;
  color: #ccc;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.post-card:nth-child(1) { animation-delay: 0.1s; }
.post-card:nth-child(2) { animation-delay: 0.2s; }
.post-card:nth-child(3) { animation-delay: 0.3s; }
</style>
