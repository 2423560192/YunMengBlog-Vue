<template>
  <Home>
    <div class="home-container">
      <!-- <div class="welcome-section text-center mb-5">
        <h1 class="display-4">欢迎来到云梦博客</h1>
        <p class="lead">分享技术，记录生活</p>
      </div> -->

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

export default {
  name: 'HomeContent',
  components: {
    Home
  },
  data () {
    return {
      featuredPosts: [
        {
          id: 1,
          title: '探索 Vue.js 3.0 新特性',
          content: 'Vue.js 3.0 带来了许多令人兴奋的新特性。Composition API 让代码组织更加灵活，Teleport 组件让弹窗管理更加方便...',
          created_at: '2024-03-07',
          author: '张三'
        },
        {
          id: 2,
          title: '前端工程化实践指南',
          content: '现代前端开发已经不再是简单的 HTML、CSS 和 JavaScript 的组合。工程化实践包括模块化开发...',
          created_at: '2024-03-06',
          author: '李四'
        },
        {
          id: 3,
          title: 'CSS Grid 布局完全指南',
          content: 'CSS Grid 布局是一种强大的二维布局系统，它可以帮助我们创建复杂的网页布局...',
          created_at: '2024-03-05',
          author: '王五'
        }
      ]
    }
  },
  methods: {
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
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  padding: 3rem 0;
}

.section-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 300;
  text-align: center;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.post-title {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.post-excerpt {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
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

/* 添加进入动画 */
.post-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in 0.5s ease forwards;
}

.post-card:nth-child(1) { animation-delay: 0.1s; }
.post-card:nth-child(2) { animation-delay: 0.2s; }
.post-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
