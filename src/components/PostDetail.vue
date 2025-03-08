<template>
  <Home>
    <div class="post-detail-container">
      <!-- 文章内容 -->
      <div class="post-content">
        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-meta">
          <div class="author-info">
            <img :src="post.author && post.author.avatar || require('@/assets/images/default-avatar.png')" :alt="post.author && post.author.username" class="author-avatar">
            <span class="author-name">{{ post.author && post.author.username }}</span>
          </div>
          <div class="post-info">
            <span class="post-date">{{ formatDate(post.created_at) }}</span>
            <span class="post-category">{{ post.category }}</span>
          </div>
        </div>

        <div class="post-tags">
          <span v-for="tag in post.tags"
                :key="tag"
                class="tag">
            {{ tag }}
          </span>
        </div>

        <div class="post-body" v-html="post.content"></div>

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
      <div class="comments-section">
        <h3 class="comments-title">评论 ({{ comments.length }})</h3>

        <!-- 评论输入框 -->
        <div class="comment-form" v-if="isLoggedIn">
          <textarea
            v-model="newComment"
            class="form-control"
            rows="3"
            placeholder="写下你的评论..."
          ></textarea>
          <button
            class="btn btn-primary mt-2"
            @click="submitComment"
            :disabled="!newComment.trim() || commentLoading"
          >
            {{ commentLoading ? '发送中...' : '发表评论' }}
          </button>
        </div>
        <div v-else class="text-center my-3">
          <router-link to="/login" class="btn btn-outline-primary">登录后评论</router-link>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments"
               :key="comment.id"
               class="comment-item">
            <div class="comment-header">
              <img :src="comment.user.avatar" :alt="comment.user.username" class="comment-avatar">
              <div class="comment-info">
                <span class="comment-author">{{ comment.user.username }}</span>
                <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
              </div>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-actions" v-if="isLoggedIn && comment.user.id === currentUserId">
              <button class="btn-delete" @click="deleteComment(comment.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Home>
</template>

<script>
import Home from './Home.vue'
import { postApi, commentApi, likeApi, collectApi } from '../api'

export default {
  name: 'PostDetail',
  components: {
    Home
  },
  data () {
    return {
      post: {},
      comments: [],
      newComment: '',
      isLiked: false,
      isCollected: false,
      loading: false,
      commentLoading: false
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
    }
  },
  methods: {
    formatDate (date) {
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
        this.post = await postApi.getDetail(this.postId)
      } catch (error) {
        console.error('获取文章详情失败:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchComments () {
      try {
        const data = await commentApi.getList(this.postId)
        this.comments = data
      } catch (error) {
        console.error('获取评论失败:', error)
      }
    },
    async submitComment () {
      if (!this.newComment.trim()) return

      try {
        this.commentLoading = true
        await commentApi.create({
          postId: this.postId,
          content: this.newComment
        })
        this.newComment = ''
        await this.fetchComments()
      } catch (error) {
        console.error('发表评论失败:', error)
      } finally {
        this.commentLoading = false
      }
    },
    async deleteComment (commentId) {
      if (!confirm('确定要删除这条评论吗？')) return

      try {
        await commentApi.delete(commentId)
        await this.fetchComments()
      } catch (error) {
        console.error('删除评论失败:', error)
      }
    },
    async handleLike () {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }

      try {
        if (this.isLiked) {
          await likeApi.unlike(this.postId)
        } else {
          await likeApi.like(this.postId)
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
          await collectApi.uncollect(this.postId)
        } else {
          await collectApi.collect(this.postId)
        }
        this.isCollected = !this.isCollected
      } catch (error) {
        console.error('操作失败:', error)
      }
    }
  },
  created () {
    this.fetchPost()
    this.fetchComments()
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
}

.post-info {
  color: #666;
  font-size: 0.9rem;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.2rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #666;
}

.post-body {
  line-height: 1.8;
  color: #2c3e50;
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
}

.btn-action:hover {
  color: #3273dc;
}

.comments-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.comments-title {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.comment-item {
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 500;
  color: #2c3e50;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

.comment-content {
  color: #2c3e50;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn-delete {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.btn-delete:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .post-detail-container {
    padding: 1rem;
  }

  .post-content,
  .comments-section {
    padding: 1rem;
  }

  .post-title {
    font-size: 1.5rem;
  }
}
</style>
