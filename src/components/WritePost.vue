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
                <select v-model="selectedTag" @change="addSelectedTag" class="tags-select">
                  <option value="">选择已有标签</option>
                  <option v-for="tag in availableTags"
                          :key="tag.id"
                          :value="tag">
                    {{ tag.name }}
                  </option>
                </select>
              </div>
              <div class="tags-list">
                <span v-for="tag in post.tags"
                      :key="tag.id"
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
      availableTags: [],
      selectedTag: '',
      postId: null,
      isSaving: false
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
        this.categories = response
      } catch (error) {
        console.error('获取分类失败:', error)
        this.$message.error('获取分类失败')
      }
    },
    async fetchTags () {
      try {
        const response = await tagApi.getList()
        this.availableTags = response
      } catch (error) {
        console.error('获取标签失败:', error)
        this.$message.error('获取标签失败')
      }
    },
    addSelectedTag () {
      if (this.selectedTag && !this.post.tags.find(t => t.id === this.selectedTag.id)) {
        this.post.tags.push(this.selectedTag)
      }
      this.selectedTag = ''
    },
    async addNewTag () {
      if (!this.tagInput) return

      try {
        const response = await tagApi.create({ name: this.tagInput })
        const newTag = response
        this.availableTags.push(newTag)
        this.post.tags.push(newTag)
        this.tagInput = ''
      } catch (error) {
        console.error('创建标签失败:', error)
        this.$message.error('创建标签失败')
      }
    },
    removeTag (tag) {
      this.post.tags = this.post.tags.filter(t => t.id !== tag.id)
    },
    formatPostData () {
      return {
        title: this.post.title,
        content: this.post.content,
        category: {
          name: this.categories.find(c => c.id === this.post.category)?.name || ''
        },
        tags: this.post.tags.map(tag => ({
          name: tag.name
        })),
        is_published: false // 或 true，取决于是保存草稿还是发布
      }
    },
    async saveDraft () {
      try {
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

        if (this.postId) {
          await postApi.update(this.postId, postData)
          this.$message({
            message: '草稿更新成功',
            type: 'success',
            duration: 2000
          })
        } else {
          const response = await postApi.create(postData)
          this.postId = response.id
          this.$message({
            message: '草稿保存成功',
            type: 'success',
            duration: 2000
          })
        }
      } catch (error) {
        console.error('保存草稿失败:', error)
        this.$message({
          message: error.response?.data?.message || '保存失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    async publishPost () {
      if (!this.canPublish) {
        this.$message({
          message: '请填写完整文章信息',
          type: 'warning',
          duration: 2000
        })
        return
      }

      try {
        const postData = this.formatPostData()
        postData.is_published = true

        if (this.postId) {
          await postApi.update(this.postId, postData)
        } else {
          await postApi.create(postData)
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
      }
    },
    handlePaste (event) {
      event.preventDefault()

      const text = event.clipboardData.getData('text/plain')

      const markdownText = this.convertToMarkdown(text)

      document.execCommand('insertText', false, markdownText)
    },
    convertToMarkdown (text) {
      const lines = text.split('\n')
      let markdown = ''
      let inCodeBlock = false
      let codeBlockLang = ''

      lines.forEach((line, index) => {
        // 保留原始缩进
        const originalLine = line
        line = line.trimRight()
        const indent = originalLine.match(/^\s*/)[0]

        if (!line) {
          markdown += '\n'
          return
        }

        // 检测代码块（包括语雀的代码块格式）
        if (line.match(/^```/) || line.match(/^`{3,}/)) {
          inCodeBlock = !inCodeBlock
          if (inCodeBlock) {
            // 提取语言标识
            codeBlockLang = line.replace(/^```\s*/, '').trim()
            markdown += '```' + codeBlockLang + '\n'
          } else {
            markdown += '```\n'
          }
          return
        }

        // 处理代码块内容
        if (inCodeBlock) {
          markdown += indent + line + '\n'
          return
        }

        // 标题处理
        if (line.match(/^第[一二三四五六七八九十百千万]+[章节]/)) {
          markdown += '# ' + line + '\n'
          return
        }

        // 子标题处理
        if (line.match(/^[\d.]+\s+/) || line.match(/^[一二三四五六七八九十][.、]\s*/)) {
          const level = line.split('.').length > 2 ? '###' : '##'
          markdown += level + ' ' + line.replace(/^[\d.]+\s+|^[一二三四五六七八九十][.、]\s*/, '') + '\n'
          return
        }

        // 检测可能的小标题（根据文本特征）
        if (line.length < 40 && !line.endsWith('。') && !line.endsWith('；') &&
            !line.match(/[,，:：]/) && line.match(/^[^\s-•]/)) {
          markdown += '### ' + line + '\n'
          return
        }

        // 列表处理
        if (line.match(/^[•·。○●◆◇■□▪▫-]/)) {
          markdown += '- ' + line.replace(/^[•·。○●◆◇■□▪▫-]\s*/, '') + '\n'
          return
        }

        if (line.match(/^\d+[.、]\s/)) {
          markdown += line.replace(/^(\d+)[.、]\s/, '$1. ') + '\n'
          return
        }

        // 代码片段处理（行内代码）
        if (line.match(/^\s{2,}/) && !line.match(/[。，；：！？]/)) {
          markdown += '`' + line.trim() + '`\n'
          return
        }

        // 普通段落
        markdown += line + '\n\n'
      })

      // 清理多余的空行并保持适当的段落间距
      return markdown
        .replace(/\n{3,}/g, '\n\n')
        .replace(/```\n\n/g, '```\n')
        .trim()
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
  align-items: center;
  gap: 0.5rem;
}

.meta-item i {
  color: #666;
}

.category-select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: transparent;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.tags-input {
  flex: 1;
}

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tags-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.tags-input-group input {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: transparent;
  transition: all 0.3s ease;
}

.tags-select {
  width: auto;
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
}

.tags-input-group input:focus,
.tags-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background: #f8f9fa;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.tag i {
  cursor: pointer;
  opacity: 0.6;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.tag i:hover {
  opacity: 1;
  color: #e74c3c;
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

  .category-select,
  .tags-input input {
    background: #1a202c;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .tag {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .tag:hover {
    background: #1a202c;
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

  .tags-input-group input,
  .tags-select {
    background-color: #1a202c;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .tags-select {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23e2e8f0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
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
</style>
