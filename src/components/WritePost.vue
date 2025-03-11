<template>
  <Home>
    <div class="write-container">
      <div class="write-header">
        <input
          type="text"
          v-model="post.title"
          class="title-input"
          placeholder="请输入文章标题..."
        >
        <div class="post-meta">
          <div class="meta-item">
            <i class="fas fa-folder"></i>
            <div class="category-input-group">
              <select v-model="post.category" class="category-select">
                <option value="">选择分类</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <div class="category-add">
                <input
                  type="text"
                  v-model="newCategory"
                  @keyup.enter="addNewCategory"
                  placeholder="输入新分类后回车"
                  class="category-input"
                >
                <button
                  class="btn-add-category"
                  @click="addNewCategory"
                  :disabled="!newCategory.trim()"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="meta-item tags-input">
            <i class="fas fa-tags"></i>
            <div class="tags-container">
              <div class="tags-input-group">
                <input
                  type="text"
                  v-model="tagInput"
                  @keyup.enter="addNewTag"
                  placeholder="输入新标签后回车"
                >
                <select
                  v-model="selectedTag"
                  @change="addSelectedTag"
                  class="tags-select"
                >
                  <option value="">选择已有标签</option>
                  <option
                    v-for="tag in availableTags.filter(t =>
                      !post.tags.some(pt => pt.name === t.name)
                    )"
                    :key="tag.id"
                    :value="tag"
                  >
                    {{ tag.name }}
                  </option>
                </select>
              </div>
              <div class="tags-list">
                <span v-for="tag in post.tags"
                      :key="tag.name"
                      class="tag">
                  {{ tag.name }}
                  <i class="fas fa-times" @click.stop="removeTag(tag)"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="editor-container">
        <v-md-editor
          v-model="post.content"
          height="calc(100vh - 150px)"
          :disabled-menus="[]"
          @save="handleSave"
          :toolbar="toolbar"
          :preview-theme="previewTheme"
          :code-theme="codeTheme"
          :resize-observer="resizeOptions"
          @paste.native="handlePaste"
          @drop.native.prevent="handleDrop"
          :delayed-render="true"
        ></v-md-editor>
      </div>

      <div class="write-footer">
        <button class="btn-draft" @click="saveDraft">
          <i class="far fa-save"></i> 保存草稿
        </button>
        <button
          class="btn-publish"
          @click="publishPost"
          :disabled="!canPublish"
        >
          <i class="fas fa-paper-plane"></i> 发布文章
        </button>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'
import { postApi, categoryApi, tagApi } from '../api'

import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import Prism from 'prismjs'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align'

VMdEditor.use(vuepressTheme, {
  Prism,
  codeHighlightExtensionMap: {
    vue: 'html',
    typescript: 'js'
  }
})
  .use(createEmojiPlugin())
  .use(createTodoListPlugin())
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createAlignPlugin())

export default {
  name: 'WritePost',
  components: {
    Home,
    VMdEditor
  },
  data () {
    return {
      post: {
        title: '',
        content: '',
        category: '',
        tags: []
      },
      tagInput: '',
      availableTags: [],
      selectedTag: '',
      categories: [],
      loading: false,
      previewTheme: 'vuepress',
      codeTheme: 'tomorrow',
      toolbar: {
        left: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          '|',
          'bold', 'italic', 'strikethrough', 'quote', 'unorderedList', 'orderedList',
          '|',
          'link', 'image', 'table', 'line',
          '|',
          'code', 'codeBlock',
          '|',
          'emoji', 'todo'
        ],
        right: [
          'preview',
          'fullscreen'
        ]
      },
      resizeOptions: {
        throttle: 200,
        delay: 50
      },
      postId: null,
      isSaving: false,
      newCategory: ''
    }
  },
  computed: {
    canPublish () {
      return this.post.title &&
             this.post.content &&
             this.post.category
    }
  },
  methods: {
    async fetchCategories () {
      try {
        const response = await categoryApi.getList()
        this.categories = response.data || []
      } catch (error) {
        console.error('获取分类失败:', error)
        this.$message.error('获取分类失败')
      }
    },
    async fetchTags () {
      try {
        const response = await tagApi.getList()
        this.availableTags = response.data || []
      } catch (error) {
        console.error('获取标签失败:', error)
      }
    },
    addSelectedTag () {
      if (!this.selectedTag) return
      if (!this.post.tags.some(t => t.name === this.selectedTag.name)) {
        this.post.tags.push(this.selectedTag)
      }
      this.selectedTag = ''
    },
    addNewTag () {
      if (!this.tagInput.trim()) return

      if (this.post.tags.some(tag => tag.name === this.tagInput.trim())) {
        this.$message.warning('该标签已存在')
        this.tagInput = ''
        return
      }

      const existingTag = this.availableTags.find(
        tag => tag.name.toLowerCase() === this.tagInput.trim().toLowerCase()
      )

      if (existingTag) {
        this.post.tags.push(existingTag)
      } else {
        this.post.tags.push({
          name: this.tagInput.trim()
        })
      }

      this.tagInput = ''
    },
    removeTag (tag) {
      this.post.tags = this.post.tags.filter(t => t.name !== tag.name)
    },
    formatPostData () {
      return {
        title: this.post.title,
        content: this.post.content,
        category: {
          name: this.categories.find(c => c.id === this.post.category)?.name || '',
          id: this.post.category
        },
        tags: this.post.tags.map(tag => ({
          name: tag.name,
          id: tag.id
        })),
        is_published: false
      }
    },
    async saveDraft () {
      if (this.loading) return
      try {
        this.loading = true
        if (!this.post.title) {
          this.$message({
            message: '请输入文章标题',
            type: 'warning',
            duration: 2000
          })
          return
        }

        const postData = this.formatPostData()
        postData.is_published = false

        let response
        if (this.postId) {
          response = await postApi.update(this.postId, postData)
          this.$message({
            message: '草稿更新成功',
            type: 'success',
            duration: 2000
          })
        } else {
          response = await postApi.create(postData)
          this.postId = response.data.id
          this.$message({
            message: '草稿保存成功',
            type: 'success',
            duration: 2000
          })
        }

        if (response.data) {
          this.post = {
            ...this.post,
            id: response.data.id,
            created_at: response.data.created_at,
            updated_at: response.data.updated_at
          }
        }
      } catch (error) {
        console.error('保存草稿失败:', error)
        this.$message({
          message: error.response?.data?.message || '保存失败',
          type: 'error',
          duration: 2000
        })
      } finally {
        this.loading = false
      }
    },
    async publishPost () {
      if (this.loading) return
      if (!this.canPublish) {
        this.$message({
          message: '请填写完整文章信息',
          type: 'warning',
          duration: 2000
        })
        return
      }

      try {
        this.loading = true
        const postData = this.formatPostData()
        postData.is_published = true

        let response
        if (this.postId) {
          response = await postApi.update(this.postId, postData)
        } else {
          response = await postApi.create(postData)
          this.postId = response.data.id
        }

        this.$message({
          message: '文章发布成功',
          type: 'success',
          duration: 2000
        })
        this.$router.push('/posts')
      } catch (error) {
        console.error('发布文章失败:', error)
        this.$message({
          message: error.response?.data?.message || '发布失败',
          type: 'error',
          duration: 2000
        })
      } finally {
        this.loading = false
      }
    },
    handlePaste (e) {
      e.preventDefault()

      const text = e.clipboardData.getData('text/plain')

      const cleanedText = this.cleanMarkdownText(text)

      document.execCommand('insertText', false, cleanedText)
    },
    handleDrop (e) {
      e.preventDefault()

      const text = e.dataTransfer.getData('text/plain')

      const cleanedText = this.cleanMarkdownText(text)

      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(cleanedText))
    },
    cleanMarkdownText (text) {
      return text
        .replace(/#{3,}\s+#{1,2}/g, (match) => {
          const lastHashes = match.match(/#*$/)[0]
          return lastHashes
        })
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+$/gm, '')
        .trim()
    },
    addNewCategory () {
      if (!this.newCategory.trim()) return

      const categoryName = this.newCategory.trim()
      if (this.categories.some(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
        this.$message.warning('该分类已存在')
        this.newCategory = ''
        return
      }

      const existingCategory = this.categories.find(
        c => c.name.toLowerCase() === categoryName.toLowerCase()
      )

      if (existingCategory) {
        this.post.category = existingCategory.id
      } else {
        const newCategory = {
          id: `temp_${Date.now()}`,
          name: categoryName
        }
        this.categories.push(newCategory)
        this.post.category = newCategory.id
      }

      this.$message.success('分类添加成功')
      this.newCategory = ''
    }
  },
  created () {
    this.fetchCategories()
    this.fetchTags()
  }
}
</script>

<style scoped>
.write-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.write-header {
  margin-bottom: 1rem;
}

.title-input {
  width: 100%;
  font-size: 2rem;
  padding: 1rem;
  border: none;
  border-bottom: 2px solid #eee;
  margin-bottom: 1.5rem;
  background: transparent;
  color: #2c3e50;
  font-weight: 300;
  transition: all 0.3s ease;
}

.title-input:focus {
  outline: none;
  border-color: #3498db;
}

.post-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 600px;
}

.meta-item i {
  margin-top: 0.5rem;
  color: #3498db;
  font-size: 1.2rem;
}

.category-input-group,
.tags-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.category-select,
.category-input,
.tags-input-group input,
.tags-select {
  height: 40px;
  padding: 0 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #2d3748;
  background-color: white;
  transition: all 0.3s ease;
}

.category-select,
.tags-select {
  padding-right: 32px;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  appearance: none;
  cursor: pointer;
}

.category-select:focus,
.category-input:focus,
.tags-input-group input:focus,
.tags-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.category-add {
  display: flex;
  gap: 0.5rem;
}

.btn-add-category {
  height: 40px;
  width: 40px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background: #ebf5ff;
  color: #3182ce;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  font-weight: 500;
}

.tag i {
  cursor: pointer;
  opacity: 0.7;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #e1efff;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.editor-container {
  margin: 1.5rem 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.write-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-draft,
.btn-publish {
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-draft {
  background: #f8f9fa;
  border: 1px solid #ddd;
  color: #666;
}

.btn-draft:hover {
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn-publish {
  background: #3498db;
  border: none;
  color: white;
}

.btn-publish:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.btn-publish:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .write-container {
    background: rgba(45, 55, 72, 0.95);
  }

  .title-input {
    color: #e2e8f0;
  }

  .meta-item {
    background: rgba(45, 55, 72, 0.9);
  }

  .meta-item i {
    color: #4299e1;
  }

  .category-select,
  .category-input,
  .tags-input-group input,
  .tags-select {
    background-color: #1a202c;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .category-select,
  .tags-select {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23e2e8f0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  }

  .tag {
    background: #2d3748;
    color: #63b3ed;
  }

  .tag:hover {
    background: #2c5282;
  }

  .btn-draft {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .btn-draft:hover {
    background: #1a202c;
  }

  :deep(.v-md-editor__toolbar) {
    background: #2d3748 !important;
    border-bottom: 1px solid #4a5568 !important;
  }

  :deep(.v-md-editor__toolbar-item) {
    color: #e2e8f0 !important;
  }

  :deep(.v-md-editor__toolbar-item:hover) {
    color: #4299e1 !important;
  }
}

/* 自定义编辑器样式 */
:deep(.v-md-editor) {
  border: none !important;
}

:deep(.v-md-editor__toolbar) {
  border-bottom: 1px solid #eee !important;
  background: #f8f9fa !important;
}

:deep(.v-md-editor__toolbar-item) {
  color: #666 !important;
}

:deep(.v-md-editor__toolbar-item:hover) {
  color: #3498db !important;
}

.category-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-add {
  display: flex;
  gap: 0.5rem;
}

.category-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.category-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.btn-add-category {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-category:hover {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-add-category:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .category-input {
    background: #1a202c;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .category-input:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
  }

  .btn-add-category {
    background: #4299e1;
  }

  .btn-add-category:hover {
    background: #3182ce;
  }

  .btn-add-category:disabled {
    background: #4a5568;
  }
}
</style>
