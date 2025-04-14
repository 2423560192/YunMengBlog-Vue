<template>
  <Home>
    <div class="tags-container">
      <div class="tags-header">
        <h1 class="tags-title">文章标签</h1>
        <div class="tags-subtitle">发现更多精彩内容</div>
      </div>

      <div class="tags-content">
        <!-- 标签云 -->
        <div class="tag-cloud">
          <router-link
            v-for="tag in tags"
            :key="tag.id"
            :to="{ path: '/posts', query: { tag: tag.name }}"
            class="tag-item"
            :style="{
              fontSize: tagSize(tag.count) + 'rem',
              backgroundColor: tagColor(tag.count)
            }"
          >
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-count">({{ tag.count }})</span>
          </router-link>
        </div>

        <!-- 热门标签 -->
        <div class="popular-tags">
          <h2>热门标签</h2>
          <div class="popular-tags-list">
            <div
              v-for="tag in popularTags"
              :key="tag.id"
              class="popular-tag-item"
              @click="goToTag(tag.name)"
            >
              <i class="fas fa-tag"></i>
              <span class="tag-name">{{ tag.name }}</span>
              <span class="tag-count">{{ tag.count }} 篇文章</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from '@/components/Home.vue'

export default {
  name: 'Tags',
  components: {
    Home
  },
  data () {
    return {
      tags: [
        { id: 1, name: 'Vue.js', count: 15 },
        { id: 2, name: 'JavaScript', count: 25 },
        { id: 3, name: 'Python', count: 10 },
        { id: 4, name: 'Node.js', count: 8 },
        { id: 5, name: 'Docker', count: 5 },
        { id: 6, name: 'Linux', count: 12 },
        { id: 7, name: 'Git', count: 7 },
        { id: 8, name: 'React', count: 9 },
        { id: 9, name: 'CSS', count: 18 },
        { id: 10, name: 'HTML', count: 20 }
      ]
    }
  },
  computed: {
    popularTags () {
      return [...this.tags]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }
  },
  methods: {
    tagSize (count) {
      // 根据文章数量计算标签大小（1-2rem）
      const min = Math.min(...this.tags.map(t => t.count))
      const max = Math.max(...this.tags.map(t => t.count))
      const size = 1 + (count - min) / (max - min)
      return size.toFixed(1)
    },
    tagColor (count) {
      // 根据文章数量生成渐变颜色
      const colors = [
        '#74ebd5',
        '#ACB6E5',
        '#86A8E7',
        '#91EAE4',
        '#7F7FD5'
      ]
      const index = Math.floor((count / Math.max(...this.tags.map(t => t.count))) * (colors.length - 1))
      return colors[index]
    },
    goToTag (tagName) {
      this.$router.push({
        path: '/posts',
        query: { tag: tagName }
      })
    }
  }
}
</script>

<style scoped>
.tags-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.tags-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.tags-title {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.tags-subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
}

.tags-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tag-count {
  font-size: 0.8em;
  opacity: 0.8;
}

.popular-tags {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
}

.popular-tags h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.popular-tags-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.popular-tag-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popular-tag-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.popular-tag-item i {
  color: #3273dc;
}

.popular-tag-item .tag-name {
  color: #2c3e50;
  font-weight: 500;
}

.popular-tag-item .tag-count {
  margin-left: auto;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .tags-container {
    padding: 1rem;
  }

  .tags-title {
    font-size: 2rem;
  }

  .tags-content {
    padding: 1.5rem;
  }

  .popular-tags-list {
    grid-template-columns: 1fr;
  }

  .tag-cloud {
    gap: 0.8rem;
  }

  .tag-item {
    padding: 0.4rem 0.8rem;
  }
}
</style>
