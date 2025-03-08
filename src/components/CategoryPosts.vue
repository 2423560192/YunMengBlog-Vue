<template>
  <Home>
    <div class="category-posts">
      <h2 class="page-title">
        <i :class="categoryInfo.icon"></i>
        {{ categoryName }}分类
      </h2>

      <div class="post-list">
        <div v-for="post in posts"
             :key="post.id"
             class="post-card"
             @click="$router.push(`/posts/${post.id}`)">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.content }}</p>
          <div class="post-meta">
            <span class="post-author">
              <i class="fas fa-user"></i> {{ post.author }}
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
      categoryPosts: {
        技术: [
          {
            id: 1,
            title: 'Vue.js 3.0 新特性详解',
            content: 'Vue.js 3.0 带来了许多激动人心的新特性...',
            author: '张三',
            created_at: '2024-03-10'
          },
          {
            id: 2,
            title: 'React Hooks 最佳实践',
            content: '深入探讨 React Hooks 的使用技巧...',
            author: '李四',
            created_at: '2024-03-09'
          }
        ],
        生活: [
          {
            id: 3,
            title: '程序员的日常健康指南',
            content: '如何在繁忙的工作中保持健康...',
            author: '王五',
            created_at: '2024-03-08'
          }
        ],
        随笔: [
          {
            id: 4,
            title: '我的编程之路',
            content: '分享我的编程学习经历和心得...',
            author: '赵六',
            created_at: '2024-03-07'
          }
        ]
      },
      categoryIcons: {
        技术: 'fas fa-code',
        生活: 'fas fa-coffee',
        随笔: 'fas fa-pen-fancy'
      }
    }
  },
  computed: {
    categoryName () {
      return this.$route.params.category
    },
    categoryInfo () {
      return {
        icon: this.categoryIcons[this.categoryName] || 'fas fa-folder'
      }
    },
    posts () {
      return this.categoryPosts[this.categoryName] || []
    }
  },
  methods: {
    formatDate (date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
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

.post-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.post-card:nth-child(1) { animation-delay: 0.1s; }
.post-card:nth-child(2) { animation-delay: 0.2s; }
.post-card:nth-child(3) { animation-delay: 0.3s; }
</style>
