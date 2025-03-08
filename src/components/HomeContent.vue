<template>
  <Home>
    <div class="home-container">
      <div class="featured-posts">
        <h2 class="section-title">最新文章</h2>
        <div class="post-grid">
          <div v-for="post in featuredPosts"
               :key="post.id"
               class="post-card"
               @click="$router.push(`/posts/${post.id}`)">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ truncateContent(post.content) }}</p>
            <div class="post-meta">
              <span class="post-author">
                <i class="fas fa-user"></i> {{ post.author }}
              </span>
              <span class="post-date">{{ formatDate(post.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'
import request from '@/utils/request'

export default {
  name: 'HomeContent',
  components: {
    Home
  },
  data () {
    return {
      featuredPosts: [] // 初始化为一个空数组
    }
  },
  methods: {
    async fetchFeaturedPosts () {
      try {
        const response = await request.get('/posts/?featured=true') // 示例 API
        console.log('相应数据：', response) // 打印响应数据
        this.featuredPosts = response // 确保数据格式正确
      } catch (error) {
        console.error('获取推荐文章失败:', error)
      }
    },
    truncateContent (content) {
      return content.length > 100 ? content.slice(0, 100) + '...' : content
    },
    formatDate (date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  created () {
    this.fetchFeaturedPosts() // 在创建时获取推荐文章
  }
}
</script>

<style scoped>
/* 样式保持不变 */
</style>
