<template>
  <Home>
    <div class="post-detail-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <i class="fas fa-spinner fa-spin"></i>
      </div>

      <!-- 文章内容 -->
      <div v-else class="post-content">
        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-meta">
          <div class="author-info" v-if="post.author">
            <img :src="getImageUrl(post.author.avatar, 'avatar')" :alt="post.author.username" class="author-avatar">
            <span class="author-name">{{ post.author.nickname || post.author.username }}</span>
          </div>
          <div class="post-info">
            <span class="post-date">{{ formatDate(post.created_at) }}</span>
            <span class="post-category" v-if="post.category">{{ post.category.name }}</span>
          </div>
        </div>

        <div class="post-tags" v-if="post.tags && post.tags.length">
          <span v-for="tag in post.tags"
                :key="tag.id"
                class="tag">
            {{ tag.name }}
          </span>
        </div>

        <div class="post-body">
          <v-md-editor
            v-model="post.content"
            mode="preview"
            :preview-theme="previewTheme"
            :code-theme="codeTheme"
          ></v-md-editor>
        </div>

        <div class="post-actions">
          <button class="btn-action" @click="handleLike">
            <i class="fas" :class="{ 'fa-heart text-danger': isLiked, 'fa-heart': !isLiked }"></i>
            点赞
          </button>
          <button class="btn-action" @click="handleCollect">
            <i class="fas" :class="{ 'fa-star text-warning': isCollected, 'fa-star': !isCollected }"></i>
            收藏
          </button>
        </div>
      </div>

      <!-- 评论区 -->
      <div v-if="post.is_published" class="comments-section">
        <h3 class="comments-title">评论 ({{ totalComments }})</h3>

        <!-- 评论输入框 -->
        <div class="comment-form" v-if="isLoggedIn">
          <textarea
            v-model="newComment"
            class="form-control"
            rows="3"
            :placeholder="replyToComment ? `回复 @${replyToComment.user.nickname || replyToComment.user.username}` : '写下你的评论...'"
          ></textarea>
          <div class="form-actions">
            <button
              v-if="replyToComment"
              class="btn-cancel"
              @click="cancelReply"
            >
              取消回复
            </button>
            <button
              class="btn-submit"
              @click="submitComment"
              :disabled="commentLoading"
            >
              {{ commentLoading ? '发送中...' : '发表评论' }}
            </button>
          </div>
        </div>
        <div v-else class="text-center my-3">
          <router-link to="/login" class="btn btn-outline-primary">登录后评论</router-link>
        </div>

        <!-- 评论列表 - 只显示顶级评论 -->
        <div class="comments-list">
          <comment-item
            v-for="comment in rootComments"
            :key="comment.id"
            :comment="comment"
            :current-user-id="currentUserId"
            :is-logged-in="isLoggedIn"
            @reply="replyTo"
            @delete="deleteComment"
          />
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'
import CommentItem from './CommentItem.vue'
import { postApi, commentApi, likeApi, collectApi } from '../api'
import { getImageUrl } from '../utils/request'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/preview.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

VMdEditor.use(vuepressTheme)

export default {
  name: 'PostDetail',
  components: {
    Home,
    CommentItem,
    VMdEditor
  },
  data () {
    return {
      post: {},
      comments: [],
      newComment: '',
      isLiked: false,
      isCollected: false,
      likeId: null,
      collectId: null,
      loading: false,
      commentLoading: false,
      baseUrl: process.env.VUE_APP_API_URL || 'http://localhost:8000',
      replyToComment: null,
      previewTheme: 'vuepress',
      codeTheme: 'tomorrow'
    }
  },
  computed: {
    postId () {
      return parseInt(this.$route.params.id)
    },
    isLoggedIn () {
      return !!localStorage.getItem('token')
    },
    currentUserId () {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.id
    },
    rootComments () {
      return this.comments.filter(comment => comment.parent_id === null)
    },
    totalComments () {
      let count = 0
      const countComments = (comments) => {
        comments.forEach(comment => {
          count++
          if (comment.children && comment.children.length > 0) {
            countComments(comment.children)
          }
        })
      }
      countComments(this.comments)
      return count
    }
  },
  created () {
    this.fetchPost()
  },
  mounted () {
    window.scrollTo(0, 0)
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id !== from.params.id) {
        this.fetchPost()
        window.scrollTo(0, 0)
      }
    }
  },
  methods: {
    getImageUrl,
    formatDate (date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    async fetchPost () {
      try {
        this.loading = true
        const response = await postApi.getDetail(this.$route.params.id)
        this.post = response.data

        if (this.post.is_published) {
          this.fetchComments()
        }
      } catch (error) {
        console.error('获取文章详情失败:', error)
        this.$message({
          message: '获取文章详情失败',
          type: 'error',
          duration: 2000
        })
        this.$router.push('/posts')
      } finally {
        this.loading = false
      }
    },
    async fetchComments () {
      try {
        const response = await (await commentApi.getList({ post_id: this.$route.params.id })).data
        this.comments = response || []
      } catch (error) {
        console.error('获取评论失败:', error)
      }
    },
    replyTo (comment) {
      this.replyToComment = comment
      this.newComment = ''
      // 滚动到评论表单
      this.$nextTick(() => {
        const commentForm = document.querySelector('.comment-form')
        if (commentForm) {
          commentForm.scrollIntoView({ behavior: 'smooth' })
        }
      })
    },
    cancelReply () {
      this.replyToComment = null
      this.newComment = ''
    },
    async submitComment () {
      if (!this.newComment.trim()) return

      try {
        this.commentLoading = true
        const data = {
          post_id: this.$route.params.id,
          content: this.newComment,
          parent_id: this.replyToComment ? this.replyToComment.id : null
        }
        console.log('评论传输数据：', data)

        await commentApi.create(data)
        this.newComment = ''
        this.replyToComment = null
        await this.fetchComments()
      } catch (error) {
        console.error('发表评论失败:', error)
      } finally {
        this.commentLoading = false
      }
    },
    async deleteComment (commentId) {
      // 先找到要删除的评论
      const commentToDelete = this.comments.find(c => c.id === commentId)

      // 检查是否是自己的评论
      if (!commentToDelete || commentToDelete.user.id !== this.currentUserId) {
        this.$message({
          message: '只能删除自己的评论',
          type: 'warning',
          duration: 2000
        })
        return
      }

      try {
        await this.$confirm('确定要删除这条评论吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await commentApi.delete(commentId)
        await this.fetchComments()
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除评论失败:', error)
          this.$message({
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        }
      }
    },
    async handleLike () {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }

      try {
        if (this.isLiked) {
          await likeApi.unlike(this.likeId)
        } else {
          const res = await likeApi.like(this.postId)
          this.likeId = res.id
        }
        this.isLiked = !this.isLiked
      } catch (error) {
        console.error('操作失败:', error)
      }
    },
    async handleCollect () {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }

      try {
        if (this.isCollected) {
          await collectApi.uncollect(this.collectId)
        } else {
          const res = await collectApi.collect(this.postId)
          this.collectId = res.id
        }
        this.isCollected = !this.isCollected
      } catch (error) {
        console.error('操作失败:', error)
      }
    },
    async goToPost (postId) {
      try {
        await this.$router.push(`/posts/${postId}`)
      } catch (err) {
        if (err.name !== 'NavigationDuplicated') {
          throw err
        }
      }
    }
  }
}
</script>

<style scoped>
.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.post-content {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.post-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.author-name {
  font-weight: 500;
  color: #3273dc;
}

.post-info {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
}

.post-date, .post-category {
  display: flex;
  align-items: center;
}

.post-date::before {
  content: "\f017";
  font-family: "Font Awesome 5 Free";
  margin-right: 0.3rem;
  opacity: 0.7;
}

.post-category::before {
  content: "\f07b";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 0.3rem;
  opacity: 0.7;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  background: #f0f8ff;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #3273dc;
  border: 1px solid rgba(50, 115, 220, 0.2);
  transition: all 0.2s ease;
}

.tag:hover {
  background: #e6f0ff;
  transform: translateY(-1px);
}

.post-body {
  line-height: 1.8;
  color: #2c3e50;
  font-size: 1.05rem;
}

.post-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-action {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.btn-action:hover {
  background: #f5f5f5;
  color: #3273dc;
}

/* 评论区样式美化 */
.comments-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.comments-title {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
  position: relative;
  padding-bottom: 0.8rem;
}

.comments-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #45b7d1);
  border-radius: 3px;
}

.comment-form {
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
}

.comment-form textarea {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.8rem;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  resize: none;
}

.comment-form textarea:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 2px rgba(50, 115, 220, 0.2);
  outline: none;
}

.comment-form button {
  background: #3273dc;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.comment-form button:hover {
  background: #2366d1;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.comment-form button:disabled {
  background: #a0a0a0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  padding: 1.2rem;
  border-radius: 10px;
  background: #f8f9fa;
  border-left: 3px solid #3273dc;
  transition: all 0.3s ease;
}

.comment-item:hover {
  background: #f0f4f8;
  transform: translateX(2px);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.comment-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

.comment-content {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.btn-reply, .btn-delete {
  background: none;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
}

.btn-reply {
  color: #3273dc;
}

.btn-reply:hover {
  background: rgba(50, 115, 220, 0.1);
}

.btn-delete {
  color: #dc3545;
}

.btn-delete:hover {
  background: rgba(220, 53, 69, 0.1);
}

.comment-replies {
  margin-top: 1rem;
  margin-left: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}

.comment-replies::before {
  content: "";
  position: absolute;
  top: 0;
  left: -1.5rem;
  height: 100%;
  width: 2px;
  background: #e0e0e0;
  border-radius: 1px;
}

.reply-item {
  background: white;
  border-left-color: #45b7d1;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.reply-item .comment-avatar {
  width: 35px;
  height: 35px;
}

.reply-item .comment-author {
  font-size: 0.95rem;
}

.reply-item .comment-content {
  font-size: 0.9rem;
}

.root-comment {
  border-bottom: none;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .post-content, .comments-section {
    background: #2d3748;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }

  .post-title, .comments-title, .comment-author, .comment-content {
    color: #e2e8f0;
  }

  .post-body {
    color: #cbd5e0;
  }

  .tag {
    background: #2d3748;
    color: #63b3ed;
    border-color: #4a5568;
  }

  .tag:hover {
    background: #2c3e50;
  }

  .post-actions {
    border-top-color: #4a5568;
  }

  .btn-action:hover {
    background: #4a5568;
  }

  .comment-form {
    background: #2d3748;
  }

  .comment-form textarea {
    background: #1a202c;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .comment-item, .reply-item {
    background: #1a202c;
  }

  .comment-item:hover {
    background: #2d3748;
  }

  .comment-date {
    color: #a0aec0;
  }

  .comment-replies::before {
    background: #4a5568;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-detail-container {
    padding: 1rem;
  }

  .post-content, .comments-section {
    padding: 1.5rem;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .comment-replies {
    margin-left: 1rem;
  }

  .comment-replies::before {
    left: -1rem;
  }
}

/* 添加递归评论的样式 */
.nested-comment {
  margin-left: 0;
  border-left-color: #45b7d1;
  background: rgba(248, 249, 250, 0.7);
}

.nested-comment .nested-comment {
  border-left-color: #6c5ce7;
}

.nested-comment .nested-comment .nested-comment {
  border-left-color: #00b894;
}

.nested-comment .nested-comment .nested-comment {
  border-left-color: #fdcb6e;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  background: #e0e0e0;
  color: #666;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #d0d0d0;
}

.btn-submit {
  background: #3273dc;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: #2366d1;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn-submit:disabled {
  background: #a0a0a0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .nested-comment {
    background: rgba(26, 32, 44, 0.7);
  }

  .btn-cancel {
    background: #4a5568;
    color: #e2e8f0;
  }

  .btn-cancel:hover {
    background: #2d3748;
  }
}

:deep(.v-md-editor) {
  background: transparent !important;
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-overlay i {
  font-size: 2rem;
  color: #3498db;
}
</style>
