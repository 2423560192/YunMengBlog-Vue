<template>
  <div class="article-toc">
    <div class="toc-header">
      <i class="fas fa-list"></i>
      <span>目录</span>
    </div>
    <div class="toc-list">
      <div
        v-for="(item, index) in tocItems"
        :key="index"
        class="toc-item"
        :class="{
          'active': activeId === item.id,
          [`level-${item.level}`]: true
        }"
        @click="scrollToHeading(item.id)"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleToc',

  props: {
    // 文章内容的容器选择器
    contentSelector: {
      type: String,
      default: '.v-md-editor__preview'
    }
  },

  data () {
    return {
      tocItems: [],
      activeId: null,
      observer: null,
      initAttempts: 0,
      maxAttempts: 30
    }
  },

  mounted () {
    // 给予更长的初始延迟，确保 Markdown 内容完全渲染
    setTimeout(() => {
      this.tryInitToc()
    }, 1000)
  },

  beforeDestroy () {
    if (this.observer) {
      this.observer.disconnect()
    }
  },

  methods: {
    tryInitToc () {
      if (this.initAttempts >= this.maxAttempts) {
        console.warn('目录初始化失败，请检查文章内容是否包含标题')
        return
      }

      const content = document.querySelector(this.contentSelector)
      // 直接查找预览区域中的标题
      const headings = content?.querySelectorAll('h1, h2, h3, h4, h5, h6')
      if (!content || !headings || headings.length === 0) {
        this.initAttempts++
        console.log(`尝试初始化目录 (${this.initAttempts}/${this.maxAttempts})`)
        setTimeout(() => this.tryInitToc(), 200)
        return
      }

      this.initToc()
      this.initIntersectionObserver()
    },

    // 初始化目录
    initToc () {
      const content = document.querySelector(this.contentSelector)
      if (!content) return

      // 获取所有标题元素
      const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6')
      console.log('找到标题数量:', headings.length)

      this.tocItems = Array.from(headings).map(heading => {
        const id = heading.id || this.generateId(heading.textContent)
        // 如果标题没有 id，添加一个
        if (!heading.id) {
          heading.id = id
        }
        return {
          id: id,
          text: heading.textContent,
          level: parseInt(heading.tagName[1])
        }
      })

      console.log('生成目录项:', this.tocItems)
    },

    // 生成标题的 ID
    generateId (text) {
      return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 支持中文字符
        .replace(/-+/g, '-') // 删除重复的连字符
        .replace(/^-|-$/g, '') // 删除首尾的连字符
    },

    // 初始化交叉观察器
    initIntersectionObserver () {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.activeId = entry.target.id
            }
          })
        },
        {
          rootMargin: '-10% 0px -70% 0px'
        }
      )

      // 观察所有标题元素
      this.tocItems.forEach(item => {
        const element = document.getElementById(item.id)
        if (element) {
          this.observer.observe(element)
        }
      })
    },

    // 滚动到指定标题
    scrollToHeading (id) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
.article-toc {
  position: sticky;
  top: 80px;
  height: fit-content;
  background: #f1f1f1;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 250px;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ddd;
  color: #333;
}

.toc-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.toc-item {
  padding: 0.3rem 0;
  cursor: pointer;
  color: #333;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  line-height: 1.4;
}

.toc-item:hover {
  color: #3498db;
}

.toc-item.active {
  color: #3498db;
  font-weight: 500;
}

.level-1 { padding-left: 0; }
.level-2 { padding-left: 1rem; }
.level-3 { padding-left: 2rem; }

/* 滚动条样式 */
.toc-list::-webkit-scrollbar {
  width: 4px;
}

.toc-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .article-toc {
    background: #2d3748;
  }

  .toc-header {
    color: #e2e8f0;
    border-bottom-color: #4a5568;
  }

  .toc-item {
    color: #a0aec0;
  }

  .toc-item:hover,
  .toc-item.active {
    color: #4299e1;
  }
}
</style>
